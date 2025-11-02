import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import TrainingCard from '@/components/TrainingCard';
import { Button } from '@/components/ui/button';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';
import RefreshCw from 'lucide-react/dist/esm/icons/refresh-cw';
import Sprout from 'lucide-react/dist/esm/icons/sprout';
import Droplets from 'lucide-react/dist/esm/icons/droplets';
import Recycle from 'lucide-react/dist/esm/icons/recycle';

const TrainingCenter = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-primary hover:text-primary-glow"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('Back', 'واپس')}
        </Button>

        <div className="text-center mb-12">
          <h1
            className={`text-4xl font-bold text-primary mb-4 ${
              language === 'ur' ? 'font-urdu' : ''
            }`}
          >
            {t('Training Center', 'تربیتی مرکز')}
          </h1>
          <p
            className={`text-lg text-muted-foreground max-w-2xl mx-auto ${
              language === 'ur' ? 'font-urdu' : ''
            }`}
          >
            {t(
              'Learn modern farming techniques and best practices',
              'جدید زرعی تکنیک اور بہترین طریقے سیکھیں'
            )}
          </p>
        </div>

        {/* ✅ Training Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <TrainingCard
            titleEn="Crop Rotation"
            titleUr="فصلوں کی گردش"
            descriptionEn="Learn how to rotate crops for better soil health and increased yields"
            descriptionUr="بہتر مٹی کی صحت اور زیادہ پیداوار کے لیے فصلوں کی گردش کا طریقہ سیکھیں"
            icon={<RefreshCw className="h-8 w-8 text-white" />}
            learnMoreLink="https://www.fao.org/3/i4741e/i4741e.pdf"
         
          />

          <TrainingCard
            titleEn="Organic Fertilizers"
            titleUr="نامیاتی کھاد"
            descriptionEn="Discover natural and organic fertilizer methods for sustainable farming"
            descriptionUr="پائیدار زراعت کے لیے قدرتی اور نامیاتی کھاد کے طریقے دریافت کریں"
            icon={<Sprout className="h-8 w-8 text-white" />}
            learnMoreLink="https://www.researchgate.net/publication/274896698_Organic_Fertilizers_Types_Production_and_Environmental_Impact"
          
          />

          <TrainingCard
            titleEn="Smart Irrigation"
            titleUr="سمارٹ آبپاشی"
            descriptionEn="Master water-efficient irrigation techniques to save resources"
            descriptionUr="وسائل بچانے کے لیے پانی کی بچت والی آبپاشی کی تکنیک سیکھیں"
            icon={<Droplets className="h-8 w-8 text-white" />}
            learnMoreLink="https://www.researchgate.net/publication/368970930_Smart_Irrigation_Systems_Overview"
           
          />

          <TrainingCard
            titleEn="Waste Management"
            titleUr="فضلہ کا انتظام"
            descriptionEn="Learn to convert farm waste into valuable resources and compost"
            descriptionUr="فارم کے فضلے کو قیمتی وسائل اور کھاد میں تبدیل کرنا سیکھیں"
            icon={<Recycle className="h-8 w-8 text-white" />}
            learnMoreLink="https://www.epa.gov/recycle/composting-home"
           
          />
        </div>

        {/* ✅ Expert Contact Section */}
        <div className="mt-12 p-8 gradient-primary rounded-2xl shadow-elevated text-white">
          <div className={`text-center ${language === 'ur' ? 'font-urdu' : ''}`}>
            <h2 className="text-2xl font-bold mb-4">
              {t('Need Expert Guidance?', 'ماہر رہنمائی کی ضرورت ہے؟')}
            </h2>
            <p className="mb-6 text-white/90">
              {t(
                'Connect with agricultural experts for personalized advice and support',
                'ذاتی مشورے اور مدد کے لیے زرعی ماہرین سے رابطہ کریں'
              )}
            </p>

            <Button
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              onClick={() => navigate('/chat')}
            >
              {t('Contact Expert', 'ماہر سے رابطہ کریں')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainingCenter;
