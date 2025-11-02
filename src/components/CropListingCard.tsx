import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import MapPin from 'lucide-react/dist/esm/icons/map-pin';
import Phone from 'lucide-react/dist/esm/icons/phone';
import User from 'lucide-react/dist/esm/icons/user';

interface CropListingCardProps {
  listing: {
    id: string;
    crop_name: string;
    quantity: number;
    price_per_kg: number;
    location: string;
    description?: string;
    farmer: {
      full_name: string;
      phone?: string;
    };
  };
}

const CropListingCard: React.FC<CropListingCardProps> = ({ listing }) => {
  const { language, t } = useLanguage();

  return (
    <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
      <CardHeader>
        <CardTitle className={`${language === 'ur' ? 'font-urdu' : ''}`}>
          {listing.crop_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {t('Quantity', 'مقدار')}
            </p>
            <p className="font-semibold">{listing.quantity} kg</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              {t('Price/kg', 'فی کلو قیمت')}
            </p>
            <p className="font-semibold text-primary">Rs. {listing.price_per_kg}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{listing.location}</span>
        </div>

        {listing.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {listing.description}
          </p>
        )}

        <div className="flex items-center gap-2 pt-2 border-t">
          <User className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">{listing.farmer.full_name}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full gradient-primary text-white hover:opacity-90">
          <Phone className="h-4 w-4 mr-2" />
          {t('Contact Farmer', 'کسان سے رابطہ کریں')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CropListingCard;
