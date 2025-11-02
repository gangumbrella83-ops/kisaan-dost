import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Droplets, Thermometer, Wind } from 'lucide-react';

interface WeatherCardProps {
  temp?: number;
  humidity?: number;
  rainfall?: number;
  windSpeed?: number;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
  temp = 28, 
  humidity = 65, 
  rainfall = 0,
  windSpeed = 12
}) => {
  const { language, t } = useLanguage();

  const getRiskLevel = () => {
    if (rainfall > 50) return { level: t('High Risk', 'زیادہ خطرہ'), color: 'text-danger', advice: t('Reduce irrigation', 'آبپاشی کم کریں') };
    if (rainfall > 20 || humidity > 80) return { level: t('Moderate Risk', 'درمیانی خطرہ'), color: 'text-warning', advice: t('Use less fertilizer', 'کھاد کم مقدار میں دیں') };
    return { level: t('Low Risk', 'کم خطرہ'), color: 'text-success', advice: t('Continue farming', 'کاشت جاری رکھیں') };
  };

  const risk = getRiskLevel();

  return (
    <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
          <Cloud className="h-5 w-5 text-primary" />
          {t('Weather Conditions', 'موسمی حالات')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-soft">
            <Thermometer className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('Temperature', 'درجہ حرارت')}</p>
              <p className="text-xl font-semibold">{temp}°C</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-soft">
            <Droplets className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('Humidity', 'نمی')}</p>
              <p className="text-xl font-semibold">{humidity}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-soft">
            <Wind className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('Wind Speed', 'ہوا کی رفتار')}</p>
              <p className="text-xl font-semibold">{windSpeed} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 rounded-lg bg-gradient-soft">
            <Cloud className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">{t('Rainfall', 'بارش')}</p>
              <p className="text-xl font-semibold">{rainfall} mm</p>
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg gradient-accent ${language === 'ur' ? 'font-urdu' : ''}`}>
          <p className={`font-semibold ${risk.color} mb-1`}>{risk.level}</p>
          <p className="text-sm text-foreground">{risk.advice}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
