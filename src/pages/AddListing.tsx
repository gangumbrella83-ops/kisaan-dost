import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left';

const AddListing = () => {
  const { language, t } = useLanguage();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    crop_name: '',
    quantity: '',
    price_per_kg: '',
    location: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('crop_listings').insert({
        farmer_id: profile.id,
        crop_name: formData.crop_name,
        quantity: parseFloat(formData.quantity),
        price_per_kg: parseFloat(formData.price_per_kg),
        location: formData.location,
        description: formData.description,
      });

      if (error) throw error;

      toast.success(t('Listing added successfully!', 'فہرست کامیابی سے شامل کی گئی!'));
      navigate('/farmer');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/farmer')}
          className="mb-6 text-primary hover:text-primary-glow"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('Back to Dashboard', 'ڈیش بورڈ پر واپس جائیں')}
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="shadow-card border-primary/20">
            <CardHeader>
              <CardTitle className={`text-2xl ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Add Crop Listing', 'فصل کی فہرست شامل کریں')}
              </CardTitle>
              <CardDescription className={language === 'ur' ? 'font-urdu' : ''}>
                {t('Fill in the details to list your crop', 'اپنی فصل کی فہرست بنانے کے لیے تفصیلات بھریں')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="crop_name" className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Crop Name', 'فصل کا نام')} *
                  </Label>
                  <Input
                    id="crop_name"
                    value={formData.crop_name}
                    onChange={(e) => setFormData({ ...formData, crop_name: e.target.value })}
                    required
                    placeholder={t('e.g., Wheat, Rice', 'مثلاً گندم، چاول')}
                    className="border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity" className={language === 'ur' ? 'font-urdu' : ''}>
                      {t('Quantity (kg)', 'مقدار (کلوگرام)')} *
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price_per_kg" className={language === 'ur' ? 'font-urdu' : ''}>
                      {t('Price per kg (Rs.)', 'فی کلو قیمت (روپے)')} *
                    </Label>
                    <Input
                      id="price_per_kg"
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price_per_kg}
                      onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                      required
                      className="border-primary/30 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location" className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Location', 'مقام')} *
                  </Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    placeholder={t('e.g., Lahore, Faisalabad', 'مثلاً لاہور، فیصل آباد')}
                    className="border-primary/30 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Description (Optional)', 'تفصیل (اختیاری)')}
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    placeholder={t('Additional details about your crop...', 'اپنی فصل کے بارے میں اضافی تفصیلات...')}
                    className="border-primary/30 focus:border-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full gradient-primary text-white hover:opacity-90"
                >
                  {loading ? t('Adding...', 'شامل ہو رہا ہے...') : t('Add Listing', 'فہرست شامل کریں')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddListing;
