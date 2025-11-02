import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";

// ✅ Use per-icon imports (works 100% in lucide-react v0.552.0)
import Droplets from "lucide-react/dist/esm/icons/droplets";
import Zap from "lucide-react/dist/esm/icons/zap";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Gauge from "lucide-react/dist/esm/icons/gauge";

interface Props {
  farmerId: string;
}

interface Stats {
  avg_score: number;
  total_water: number;
  total_energy: number;
  total_waste: number;
  entries: number;
}

export default function SmartOptimizer({ farmerId }: Props) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [tip, setTip] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("resource_stats")
        .select("water_used_liters, energy_kwh, waste_reused_kg, sustainability_score")
        .eq("farmer_id", farmerId);

      if (error) {
        console.error("Error fetching stats:", error.message);
        setLoading(false);
        return;
      }

      // --- DEMO DATA FALLBACK ---
      if (!data || data.length === 0) {
        const randomScore = Math.floor(65 + Math.random() * 25);
        const demo = {
          avg_score: randomScore,
          total_water: 1000 + Math.random() * 2000,
          total_energy: 200 + Math.random() * 400,
          total_waste: 80 + Math.random() * 160,
          entries: 5,
        };
        setStats(demo);

        const tips = [
          t("Reuse crop residues for biogas fuel.", "فصل کے باقیات کو بایو گیس کے ایندھن کے طور پر استعمال کریں۔"),
          t("Switch to solar drying for grains.", "اناج کو خشک کرنے کے لیے شمسی توانائی استعمال کریں۔"),
          t("Compost organic waste to replace chemical fertilizers.", "نامیاتی فضلے کو کھاد میں تبدیل کریں تاکہ مصنوعی کھاد کی ضرورت کم ہو۔"),
          t("Irrigate at night to reduce water evaporation.", "رات کے وقت آبپاشی کریں تاکہ بخارات کم ہوں۔"),
        ];
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        setLoading(false);
        return;
      }

      // --- REAL DATA AGGREGATION ---
      const totals = data.reduce(
        (acc, row) => {
          acc.total_water += row.water_used_liters || 0;
          acc.total_energy += row.energy_kwh || 0;
          acc.total_waste += row.waste_reused_kg || 0;
          acc.avg_score += row.sustainability_score || 0;
          acc.entries++;
          return acc;
        },
        { total_water: 0, total_energy: 0, total_waste: 0, avg_score: 0, entries: 0 }
      );

      totals.avg_score = totals.avg_score / totals.entries;
      setStats(totals);
      setLoading(false);

      // --- Smart Suggestions Based on Performance ---
      if (totals.total_waste < 100) {
        setTip(
          t(
            "Increase waste reuse — turn residues into compost or organic fertilizer.",
            "فضلہ دوبارہ استعمال بڑھائیں — باقیات سے نامیاتی کھاد بنائیں۔"
          )
        );
      } else if (totals.total_water > 2000) {
        setTip(
          t(
            "High water use detected — irrigate at night to reduce evaporation.",
            "پانی کا استعمال زیادہ ہے — رات کے وقت آبپاشی کریں تاکہ بخارات کم ہوں۔"
          )
        );
      } else if (totals.avg_score < 60) {
        setTip(
          t(
            "Boost your sustainability score — use energy-efficient equipment.",
            "پائیداری کا اسکور بہتر کریں — توانائی کی بچت والی مشینری استعمال کریں۔"
          )
        );
      } else {
        setTip(
          t(
            "Excellent! Your farm is on a great sustainability path.",
            "زبردست! آپ کا کھیت پائیداری کے لحاظ سے بہترین راستے پر ہے۔"
          )
        );
      }
    };

    if (farmerId) fetchStats();
  }, [farmerId, language]);

  const dir = language === "ur" ? "rtl" : "ltr";

  if (loading) {
    return (
      <Card className="p-6 text-center shadow-card">
        <p>{t("Loading optimization data...", "ڈیٹا لوڈ کیا جا رہا ہے...")}</p>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6 text-center shadow-card">
        <p>
          {t(
            "No sustainability data yet. Save progress from your Resource Cards to start optimizing!",
            "ابھی تک کوئی پائیداری ڈیٹا نہیں۔ وسائل کارڈ سے ترقی محفوظ کر کے آغاز کریں۔"
          )}
        </p>
      </Card>
    );
  }

  return (
    <motion.div
      dir={dir}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg border-emerald-200 bg-gradient-to-br from-green-50 to-white">
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center gap-3">
            <Gauge className="text-emerald-600" />
            <h2 className="text-xl font-semibold text-emerald-700">
              {t("Smart Resource Optimizer", "سمارٹ ریسورس آپٹیمائزر")}
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center">
            <motion.div whileHover={{ scale: 1.05 }} className="bg-blue-50 rounded-xl p-3 border border-blue-200">
              <Droplets className="h-5 w-5 text-blue-500 mx-auto mb-1" />
              <p className="font-semibold text-blue-600">{Math.round(stats.total_water)} L</p>
              <p className="text-xs text-gray-500">{t("Water Used", "پانی کا استعمال")}</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-yellow-50 rounded-xl p-3 border border-yellow-200">
              <Zap className="h-5 w-5 text-yellow-500 mx-auto mb-1" />
              <p className="font-semibold text-yellow-600">{Math.round(stats.total_energy)} kWh</p>
              <p className="text-xs text-gray-500">{t("Energy Used", "استعمال شدہ توانائی")}</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-green-50 rounded-xl p-3 border border-green-200">
              <Leaf className="h-5 w-5 text-green-500 mx-auto mb-1" />
              <p className="font-semibold text-green-600">{Math.round(stats.total_waste)} kg</p>
              <p className="text-xs text-gray-500">{t("Waste Reused", "فضلہ دوبارہ استعمال")}</p>
            </motion.div>
          </div>

          <div className="mt-4">
            <p className="font-medium mb-1 text-gray-800">
              {t("Average Sustainability Score", "اوسط پائیداری اسکور")}
            </p>
            <Progress value={stats.avg_score} className="h-2 mb-2" />
            <p className="text-sm text-gray-500">{Math.round(stats.avg_score)} / 100</p>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 bg-emerald-50 border border-emerald-200 rounded-xl p-3"
          >
            <p className="text-emerald-700 text-sm font-medium">{tip}</p>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
