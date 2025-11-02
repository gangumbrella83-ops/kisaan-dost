import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';

interface TrainingCardProps {
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: React.ReactNode;
  learnMoreLink?: string; // ✅ new optional prop
}

const TrainingCard: React.FC<TrainingCardProps> = ({ 
  titleEn, 
  titleUr, 
  descriptionEn, 
  descriptionUr,
  icon,
  learnMoreLink
}) => {
  const { language, t } = useLanguage();

  return (
    <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20 h-full flex flex-col">
      <CardHeader>
        <div className="bg-gradient-primary p-4 rounded-lg w-fit mb-3">
          {icon}
        </div>
        <CardTitle className={`${language === 'ur' ? 'font-urdu text-right' : ''}`}>
          {t(titleEn, titleUr)}
        </CardTitle>
      </CardHeader>

      <CardContent className={`flex-1 ${language === 'ur' ? 'font-urdu text-right' : ''}`}>
        <p className="text-muted-foreground">
          {t(descriptionEn, descriptionUr)}
        </p>
      </CardContent>

      <CardFooter>
        {learnMoreLink ? (
          <a 
            href={learnMoreLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="w-full"
          >
            <Button className="w-full gradient-primary text-white hover:opacity-90">
              <BookOpen className="h-4 w-4 mr-2" />
              {t('Learn More', 'مزید جانیں')}
            </Button>
          </a>
        ) : (
          <Button disabled className="w-full gradient-primary text-white opacity-50">
            <BookOpen className="h-4 w-4 mr-2" />
            {t('Learn More', 'مزید جانیں')}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default TrainingCard;
