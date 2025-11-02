import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import WeatherCard from "@/components/WeatherCard";
import ResourceCard from "@/components/ResourceCard";
import SmartOptimizer from "@/components/SmartOptimizer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

// ✅ FIXED ICON IMPORTS (Per-icon imports)
import Plus from "lucide-react/dist/esm/icons/plus";
import Edit from "lucide-react/dist/esm/icons/edit";
import Trash2 from "lucide-react/dist/esm/icons/trash-2";
import BookOpen from "lucide-react/dist/esm/icons/book-open";
import BarChart2 from "lucide-react/dist/esm/icons/bar-chart-2";
import Droplets from "lucide-react/dist/esm/icons/droplets";
import Zap from "lucide-react/dist/esm/icons/zap";
import Leaf from "lucide-react/dist/esm/icons/leaf";

const FarmerDashboard = () => {
  const { language, t } = useLanguage();
  const { profile, loading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [summaryData, setSummaryData] = useState({
    water: 1650,
    energy: 320,
    waste: 120,
  });

  useEffect(() => {
    if (!loading && (!profile || profile.role !== "farmer")) {
      navigate("/auth");
    }
  }, [loading, profile, navigate]);

  useEffect(() => {
    if (profile?.id) {
      fetchListings();
      generateSummary();
    }
  }, [profile]);

  const fetchListings = async () => {
    try {
      const { data, error } = await supabase
        .from("crop_listings")
        .select("*")
        .eq("farmer_id", profile.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setListings(data || []);
    } catch {
      toast.error(t("Failed to fetch listings", "فہرست لوڈ کرنے میں ناکامی"));
    } finally {
      setLoadingListings(false);
    }
  };

  // Demo animated summary (in real use, fetch from resource_stats)
  const generateSummary = () => {
    const base = {
      water: 1500 + Math.random() * 500,
      energy: 300 + Math.random() * 100,
      waste: 100 + Math.random() * 50,
    };
    setSummaryData(base);
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("crop_listings").delete().eq("id", id);
      if (error) throw error;
      toast.success(t("Listing deleted", "فہرست ہٹائی گئی"));
      fetchListings();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen gradient-soft">
        <Header />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <p>{t("Loading...", "لوڈ ہو رہا ہے...")}</p>
        </div>
      </div>
    );
  }

  const dir = language === "ur" ? "rtl" : "ltr";

  return (
    <div className="min-h-screen gradient-soft">
      <Header />

      <div className="container mx-auto px-4 py-8 space-y-10">
        {/* DASHBOARD HEADER */}
        <motion.div
          className="text-center md:text-left"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className={`text-3xl font-bold text-primary mb-2 ${
              language === "ur" ? "font-urdu text-right" : ""
            }`}
          >
            {t("Farmer Dashboard", "کسان ڈیش بورڈ")}
          </h1>
          <p className="text-muted-foreground">
            {t(
              "Monitor sustainability, optimize resources, and grow profitably.",
              "پائیداری کی نگرانی کریں، وسائل بہتر بنائیں، اور منافع میں اضافہ کریں۔"
            )}
          </p>
        </motion.div>

        {/* 🌿 SUSTAINABILITY SUMMARY BAR */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-emerald-100"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          dir={dir}
        >
          {[
            {
              icon: <Droplets className="h-8 w-8 text-blue-500" />,
              label: t("Water Saved", "پانی کی بچت"),
              value: `${Math.round(summaryData.water)} L`,
              color: "from-blue-400 to-blue-600",
            },
            {
              icon: <Zap className="h-8 w-8 text-yellow-500" />,
              label: t("Energy Used", "استعمال شدہ توانائی"),
              value: `${Math.round(summaryData.energy)} kWh`,
              color: "from-yellow-400 to-orange-500",
            },
            {
              icon: <Leaf className="h-8 w-8 text-green-600" />,
              label: t("Waste Reused", "فضلہ دوبارہ استعمال"),
              value: `${Math.round(summaryData.waste)} kg`,
              color: "from-green-400 to-emerald-600",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex flex-col items-center justify-center p-3 text-center rounded-xl"
              whileHover={{ scale: 1.05 }}
            >
              <div className={`p-3 rounded-full bg-gradient-to-br ${item.color} text-white mb-2`}>
                {item.icon}
              </div>
              <p className="text-sm text-gray-600">{item.label}</p>
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.2 }}
                className="font-bold text-lg text-gray-800"
              >
                {item.value}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>

        {/* WEATHER + RESOURCE MANAGEMENT */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <WeatherCard />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h2
              className={`text-xl font-semibold ${
                language === "ur" ? "font-urdu text-right" : ""
              }`}
            >
              {t("Resource Efficiency & Sustainability", "وسائل کی کارکردگی اور پائیداری")}
            </h2>

            <ResourceCard
              titleEn="Water Efficiency"
              titleUr="پانی کی کارکردگی"
              descriptionEn="Smart irrigation and rainwater harvesting tips."
              descriptionUr="سمارٹ آبپاشی اور بارش کے پانی کے استعمال کے نکات۔"
              category="water"
              farmerId={profile.id}
            />

            <ResourceCard
              titleEn="Energy Optimization"
              titleUr="توانائی کی بہتری"
              descriptionEn="Adopt renewable energy and low-cost power solutions."
              descriptionUr="قابل تجدید توانائی اور کم لاگت بجلی کے حل اپنائیں۔"
              category="energy"
              farmerId={profile.id}
            />

            <ResourceCard
              titleEn="Waste Recycling"
              titleUr="فضلہ کی ری سائیکلنگ"
              descriptionEn="Convert crop residues into compost and fuel."
              descriptionUr="فصل کے فضلے کو کھاد یا ایندھن میں تبدیل کریں۔"
              category="waste"
              farmerId={profile.id}
            />
          </motion.div>
        </div>

        {/* SMART OPTIMIZER */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <SmartOptimizer farmerId={profile.id || "demo"} />
        </motion.div>

        {/* CROP LISTINGS */}
        <div className="mb-6 flex justify-between items-center flex-wrap gap-3">
          <h2
            className={`text-2xl font-semibold ${
              language === "ur" ? "font-urdu text-right" : ""
            }`}
          >
            {t("My Crop Listings", "میری فصلوں کی فہرست")}
          </h2>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate("/training")}
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-white"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              {t("Training Center", "تربیتی مرکز")}
            </Button>


            <Button
              onClick={() => navigate("/add-listing")}
              className="gradient-primary text-white hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("Add Listing", "فہرست شامل کریں")}
            </Button>
          </div>
        </div>

        {/* LISTINGS GRID */}
        {loadingListings ? (
          <p className="text-center py-8">{t("Loading listings...", "فہرست لوڈ ہو رہی ہے...")}</p>
        ) : listings.length === 0 ? (
          <Card className="shadow-card text-center py-12">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                {t("No listings yet. Add your first crop!", "ابھی تک کوئی فہرست نہیں۔ اپنی پہلی فصل شامل کریں!")}
              </p>
              <Button onClick={() => navigate("/add-listing")} className="gradient-primary text-white">
                <Plus className="h-4 w-4 mr-2" />
                {t("Add Listing", "فہرست شامل کریں")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="shadow-card border-primary/20 hover:shadow-lg transition">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-primary">
                      {listing.crop_name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-sm text-muted-foreground">{t("Quantity", "مقدار")}</p>
                        <p className="font-semibold">{listing.quantity} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{t("Price/kg", "فی کلو قیمت")}</p>
                        <p className="font-semibold text-primary">Rs. {listing.price_per_kg}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{listing.location}</p>
                    {listing.description && (
                      <p className="text-sm line-clamp-2">{listing.description}</p>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      {t("Edit", "ترمیم")}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDelete(listing.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t("Delete", "ہٹائیں")}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
