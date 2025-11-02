import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import CropListingCard from '@/components/CropListingCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Search from 'lucide-react/dist/esm/icons/search';
import { toast } from 'sonner';

const BuyerDashboard = () => {
  const { language, t } = useLanguage();
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [filteredListings, setFilteredListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');

  useEffect(() => {
    if (!loading && (!profile || profile.role !== 'buyer')) {
      navigate('/auth');
    }
  }, [loading, profile, navigate]);

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchTerm, locationFilter, listings]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from('crop_listings')
        .select(`
          *,
          farmer:profiles!farmer_id (
            full_name,
            phone
          )
        `)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setListings(data || []);
      setFilteredListings(data || []);
    } catch (error: any) {
      toast.error(t('Failed to fetch listings', 'فہرست لوڈ کرنے میں ناکامی'));
    } finally {
      setLoadingListings(false);
    }
  };

  const filterListings = () => {
    let filtered = [...listings];

    if (searchTerm) {
      filtered = filtered.filter(listing =>
        listing.crop_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter !== 'all') {
      filtered = filtered.filter(listing =>
        listing.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredListings(filtered);
  };

  const locations = Array.from(new Set(listings.map(l => l.location)));

  if (loading || !profile) {
    return (
      <div className="min-h-screen gradient-soft">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <p>{t('Loading...', 'لوڈ ہو رہا ہے...')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('Buyer Dashboard', 'خریدار ڈیش بورڈ')}
          </h1>
          <p className="text-muted-foreground">
            {t('Browse available crops from farmers', 'کسانوں سے دستیاب فصلیں دیکھیں')}
          </p>
        </div>

        <div className="mb-6 grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('Search crops...', 'فصلیں تلاش کریں...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary/30 focus:border-primary"
            />
          </div>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="border-primary/30 focus:border-primary">
              <SelectValue placeholder={t('Filter by location', 'مقام کے مطابق فلٹر کریں')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('All Locations', 'تمام مقامات')}</SelectItem>
              {locations.map(location => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loadingListings ? (
          <p className="text-center py-8">{t('Loading listings...', 'فہرست لوڈ ہو رہی ہے...')}</p>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {t('No listings found', 'کوئی فہرست نہیں ملی')}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <CropListingCard
                key={listing.id}
                listing={{
                  ...listing,
                  farmer: listing.farmer
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuyerDashboard;
