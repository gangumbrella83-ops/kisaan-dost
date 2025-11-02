// ✅ Simplified Supabase Client – fixes “type instantiation is excessively deep” error
import { createClient } from "@supabase/supabase-js";
// 🚫 Do NOT import the generated Database types here – they trigger recursion
// import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL!;
const SUPABASE_KEY =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY!;

// ✅ Create an untyped client (no recursion, works perfectly for hackathon)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Optional sanity check — remove later
console.log("✅ Supabase client ready:", SUPABASE_URL);