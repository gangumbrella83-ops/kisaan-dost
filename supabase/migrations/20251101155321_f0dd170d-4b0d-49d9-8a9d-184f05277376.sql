-- ============================================================
-- ENUMS & BASE TYPES
-- ============================================================

CREATE TYPE user_role AS ENUM ('farmer', 'buyer');
CREATE TYPE waste_type_enum AS ENUM ('crop_residue', 'manure', 'husk', 'biowaste', 'other');

-- ============================================================
-- PROFILES TABLE (linked to auth.users)
-- ============================================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL,
  kissan_card_number TEXT,
  full_name TEXT,
  phone TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_kissan_card CHECK (
    role = 'buyer' OR 
    (role = 'farmer' AND kissan_card_number IS NOT NULL AND LENGTH(kissan_card_number) = 13)
  )
);

-- ============================================================
-- CROP LISTINGS TABLE
-- ============================================================

CREATE TABLE public.crop_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  price_per_kg DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- WASTE MARKETPLACE TABLE
-- ============================================================

CREATE TABLE public.waste_market (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  waste_type waste_type_enum NOT NULL,
  description TEXT,
  quantity DECIMAL(10,2),
  unit TEXT DEFAULT 'kg',
  location TEXT,
  price NUMERIC,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RESOURCE TRACKING TABLE
-- ============================================================

CREATE TABLE public.resource_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_name TEXT,
  water_used_liters NUMERIC,
  fertilizer_kg NUMERIC,
  energy_kwh NUMERIC,
  waste_reused_kg NUMERIC,
  sustainability_score INTEGER DEFAULT 50,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- VIEWS: SUSTAINABILITY LEADERBOARD
-- ============================================================

CREATE OR REPLACE VIEW public.sustainability_leaderboard AS
SELECT
  p.id AS farmer_id,
  p.full_name,
  p.location,
  AVG(r.sustainability_score) AS avg_score,
  SUM(r.waste_reused_kg) AS total_reused_kg,
  COUNT(r.id) AS reports_submitted
FROM public.profiles p
JOIN public.resource_stats r ON p.id = r.farmer_id
GROUP BY p.id, p.full_name, p.location
ORDER BY avg_score DESC;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_market ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resource_stats ENABLE ROW LEVEL SECURITY;

-- -------------------------
-- PROFILES POLICIES
-- -------------------------
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- -------------------------
-- CROP LISTINGS POLICIES
-- -------------------------
CREATE POLICY "Anyone can view available listings"
  ON public.crop_listings FOR SELECT
  USING (is_available = true);

CREATE POLICY "Farmers can create their own listings"
  ON public.crop_listings FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own listings"
  ON public.crop_listings FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own listings"
  ON public.crop_listings FOR DELETE
  USING (auth.uid() = farmer_id);

-- -------------------------
-- WASTE MARKET POLICIES
-- -------------------------
CREATE POLICY "Anyone can view available waste listings"
  ON public.waste_market FOR SELECT
  USING (available = true);

CREATE POLICY "Farmers can insert their own waste listings"
  ON public.waste_market FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can update their own waste listings"
  ON public.waste_market FOR UPDATE
  USING (auth.uid() = farmer_id);

CREATE POLICY "Farmers can delete their own waste listings"
  ON public.waste_market FOR DELETE
  USING (auth.uid() = farmer_id);

-- -------------------------
-- RESOURCE STATS POLICIES
-- -------------------------
CREATE POLICY "Farmers can insert their own resource data"
  ON public.resource_stats FOR INSERT
  WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Farmers can view their own resource data"
  ON public.resource_stats FOR SELECT
  USING (auth.uid() = farmer_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Automatically create a profile for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role, kissan_card_number, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'buyer'),
    NEW.raw_user_meta_data->>'kissan_card_number',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- Update updated_at automatically
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_crop_listings_updated_at
  BEFORE UPDATE ON public.crop_listings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_waste_market_updated_at
  BEFORE UPDATE ON public.waste_market
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_resource_stats_updated_at
  BEFORE UPDATE ON public.resource_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();