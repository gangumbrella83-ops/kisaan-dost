import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// ✅ Direct icon imports (compatible with lucide-react v0.552.0)
import Lightbulb from "lucide-react/dist/esm/icons/lightbulb";
import Leaf from "lucide-react/dist/esm/icons/leaf";
import Zap from "lucide-react/dist/esm/icons/zap";
import Droplet from "lucide-react/dist/esm/icons/droplet";
import Coins from "lucide-react/dist/esm/icons/coins";
import Users from "lucide-react/dist/esm/icons/users";
import Recycle from "lucide-react/dist/esm/icons/recycle";

interface ResourceCardProps {
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  category?: "water" | "energy" | "waste" | "general";
  farmerId?: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({
  titleEn,
  titleUr,
  descriptionEn,
  descriptionUr,
  category = "general",
  farmerId,
}) => {
  const { language, t } = useLanguage();
  const [score, setScore] = useState(Math.floor(Math.random() * 50) + 25);
  const [tips, setTips] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [impact, setImpact] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [miniStats, setMiniStats] = useState({
    waterSaved: 0,
    energySaved: 0,
    wasteReused: 0,
    income: 0,
  });

  // 🌿 Theme configuration
  const theme = {
    water: {
      color: "from-blue-400 to-blue-600",
      icon: <Droplet className="h-6 w-6 text-white" />,
    },
    energy: {
      color: "from-yellow-400 to-orange-500",
      icon: <Zap className="h-6 w-6 text-white" />,
    },
    waste: {
      color: "from-green-500 to-emerald-700",
      icon: <Leaf className="h-6 w-6 text-white" />,
    },
    general: {
      color: "from-teal-400 to-emerald-600",
      icon: <Lightbulb className="h-6 w-6 text-white" />,
    },
  }[category];

  // 🔹 Bilingual smart tips
  const tipsData: Record<
    "water" | "energy" | "waste" | "general",
    { en: string[]; ur: string[] }
  > = {
    water: {
      en: [
        "Install drip irrigation systems.",
        "Collect and reuse rainwater.",
        "Water crops early in the morning.",
      ],
      ur: [
        "ڈِرِپ آبپاشی کا نظام لگائیں۔",
        "بارش کے پانی کو جمع کر کے دوبارہ استعمال کریں۔",
        "فصلوں کو صبح سویرے پانی دیں۔",
      ],
    },
    energy: {
      en: [
        "Use solar-powered pumps.",
        "Turn off unused electrical systems.",
        "Switch to energy-efficient equipment.",
      ],
      ur: [
        "سولر پمپ استعمال کریں۔",
        "غیر استعمال شدہ برقی نظام بند رکھیں۔",
        "توانائی مؤثر آلات استعمال کریں۔",
      ],
    },
    waste: {
      en: [
        "Compost organic waste to make fertilizer.",
        "Reuse plant residues as mulch.",
        "Separate recyclable waste on-site.",
      ],
      ur: [
        "نامیاتی فضلہ سے کھاد بنائیں۔",
        "پودوں کے باقیات کو مَلچ کے طور پر استعمال کریں۔",
        "ری سائیکل ہونے والا فضلہ الگ کریں۔",
      ],
    },
    general: {
      en: [
        "Maintain soil health with crop rotation.",
        "Monitor weather before irrigation.",
        "Adopt sustainable farming practices.",
      ],
      ur: [
        "فصلوں کی تبدیلی سے مٹی کی صحت برقرار رکھیں۔",
        "آبپاشی سے پہلے موسم کی پیشگوئی دیکھیں۔",
        "پائیدار کاشتکاری کے اصول اپنائیں۔",
      ],
    },
  };

  // 🔹 Smart Tip Generator
  const generateSmartTips = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const langTips = language === "ur" ? tipsData[category].ur : tipsData[category].en;
    const randomTips = langTips.sort(() => 0.5 - Math.random()).slice(0, 3);
    setTips(randomTips);

    const newScore = Math.min(score + 10, 100);
    setScore(newScore);

    const newStats = { ...miniStats };
    if (category === "water") newStats.waterSaved += 200 + newScore * 2;
    if (category === "energy") newStats.energySaved += 5 + newScore / 10;
    if (category === "waste") newStats.wasteReused += 3 + newScore / 15;
    newStats.income += newScore * 2;
    setMiniStats(newStats);

    setImpact(
      t(
        `Your farm efficiency improved by ${(newScore / 1.8).toFixed(0)}%. Sustainability impact rising!`,
        `آپ کے فارم کی کارکردگی میں ${(newScore / 1.8).toFixed(0)}٪ بہتری آئی۔ پائیداری میں اضافہ ہو رہا ہے!`
      )
    );

    setInsight(
      category === "waste"
        ? t("Circular farming reduces pollution and increases income.", "چکر دار کاشتکاری آلودگی کم اور آمدنی زیادہ کرتی ہے۔")
        : t("Smart optimization leads to greener growth.", "وسائل کا بہتر استعمال پائیدار ترقی لاتا ہے۔")
    );

    setLoading(false);
  };

  // 🔹 Save stats to Supabase
  const saveProgress = async () => {
    if (!farmerId) return alert("Login required to save progress.");
    setSaving(true);
    const { error } = await supabase.from("resource_stats").insert([
      {
        farmer_id: farmerId,
        crop_name: titleEn,
        sustainability_score: score,
        water_used_liters: miniStats.waterSaved,
        energy_kwh: miniStats.energySaved,
        waste_reused_kg: miniStats.wasteReused,
      },
    ]);
    setSaving(false);
    if (error) console.error(error);
    else alert(t("Progress saved successfully!", "ترقی کامیابی سے محفوظ ہو گئی!"));
  };

  const dir = language === "ur" ? "rtl" : "ltr";

  return (
    <motion.div whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 200, damping: 10 }}>
      <Card
        dir={dir}
        className={`relative overflow-hidden border-0 shadow-lg bg-gradient-to-br ${theme.color} p-[1px] rounded-2xl`}
      >
        <motion.div
          className="absolute inset-0 bg-emerald-400/10 blur-xl"
          animate={{ opacity: Math.min(score / 100, 0.6), scale: [1, 1.03, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="bg-white rounded-2xl p-5 sm:p-6 relative z-10">
          <CardContent className="p-0">
            <div className="flex items-start gap-4">
              <div className="bg-gradient-to-br from-emerald-500 to-green-700 p-3 rounded-lg shadow-md">
                {theme.icon}
              </div>

              <div className={`flex-1 ${language === "ur" ? "font-urdu text-right" : ""}`}>
                <h3 className="font-semibold text-lg sm:text-xl mb-1 text-gray-800">{t(titleEn, titleUr)}</h3>
                <p className="text-gray-600 mb-3">{t(descriptionEn, descriptionUr)}</p>

                {/* Mini Dashboard */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div className="bg-blue-50 text-blue-700 rounded-lg p-2 text-center">
                    <Droplet className="h-4 w-4 mx-auto" />
                    <p className="text-xs mt-1">{miniStats.waterSaved.toFixed(0)} L</p>
                    <p className="text-[11px]">Water Saved</p>
                  </div>
                  <div className="bg-yellow-50 text-yellow-700 rounded-lg p-2 text-center">
                    <Zap className="h-4 w-4 mx-auto" />
                    <p className="text-xs mt-1">{miniStats.energySaved.toFixed(1)} kWh</p>
                    <p className="text-[11px]">Energy Saved</p>
                  </div>
                  <div className="bg-green-50 text-green-700 rounded-lg p-2 text-center">
                    <Recycle className="h-4 w-4 mx-auto" />
                    <p className="text-xs mt-1">{miniStats.wasteReused.toFixed(1)} kg</p>
                    <p className="text-[11px]">Waste Reused</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-700 rounded-lg p-2 text-center">
                    <Coins className="h-4 w-4 mx-auto" />
                    <p className="text-xs mt-1">Rs {miniStats.income.toFixed(0)}</p>
                    <p className="text-[11px]">Earned</p>
                  </div>
                </div>

                <Progress value={score} className="h-2 mb-2" />
                <p className="text-xs text-gray-500 mb-3">
                  {t("Sustainability Score:", "پائیداری کا اسکور:")} {score}/100
                </p>

                {impact && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-700 font-medium mb-2">
                    {impact}
                  </motion.p>
                )}

                <div className="flex flex-wrap gap-2 mb-3">
                  <Button variant="outline" size="sm" onClick={generateSmartTips} disabled={loading}>
                    {loading ? t("Analyzing...", "تجزیہ کیا جا رہا ہے...") : t("Get Smart Tips", "سمارٹ تجاویز حاصل کریں")}
                  </Button>
                  <Button variant="secondary" size="sm" onClick={saveProgress} disabled={saving}>
                    {saving ? t("Saving...", "محفوظ کیا جا رہا ہے...") : t("Save Progress", "ترقی محفوظ کریں")}
                  </Button>
                </div>

                {tips.length > 0 && (
                  <ul className={`mt-2 text-sm space-y-1 text-emerald-700 ${language === "ur" ? "font-urdu text-right" : ""}`}>
                    {tips.map((tip, i) => (
                      <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        • {tip}
                      </motion.li>
                    ))}
                  </ul>
                )}

                {insight && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-xs text-gray-500 italic">
                    {t("Insight:", "اختراعی نکتہ:")} {insight}
                  </motion.div>
                )}

                {score >= 90 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="mt-3 inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    <Users className="h-4 w-4" />
                    {t("Sustainable Excellence Achieved!", "پائیدار برتری حاصل ہو گئی!")}
                  </motion.div>
                )}
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default ResourceCard;
