import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Sprout, Users, Cloud, BookOpen, TrendingUp, Shield } from 'lucide-react';

const Index = () => {
  const { user, profile, loading } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && profile) {
      if (profile.role === 'farmer') {
        navigate('/farmer');
      } else if (profile.role === 'buyer') {
        navigate('/buyer');
      }
    }
  }, [user, profile, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen gradient-soft flex items-center justify-center">
        <p>{t('Loading...', 'لوڈ ہو رہا ہے...')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block gradient-primary p-6 rounded-3xl mb-6 shadow-elevated">
          <Sprout className="h-20 w-20 text-white" />
        </div>
        <h1 className={`text-5xl md:text-6xl font-bold text-primary mb-6 ${language === 'ur' ? 'font-urdu' : ''}`}>
          {t('Agri-Connect', 'ایگری کنیکٹ')}
        </h1>
        <p className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto ${language === 'ur' ? 'font-urdu' : ''}`}>
          {t(
            'Connecting Farmers and Buyers with Smart Weather Insights',
            'سمارٹ موسمی معلومات کے ساتھ کسانوں اور خریداروں کو جوڑنا'
          )}
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="gradient-primary text-white hover:opacity-90 text-lg px-8 py-6"
          >
            {t('Get Started', 'شروع کریں')}
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate('/training')}
            className="border-primary text-primary hover:bg-primary hover:text-white text-lg px-8 py-6"
          >
            <BookOpen className="h-5 w-5 mr-2" />
            {t('Learn More', 'مزید جانیں')}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className={`text-3xl md:text-4xl font-bold text-center text-primary mb-12 ${language === 'ur' ? 'font-urdu' : ''}`}>
          {t('Why Choose Agri-Connect?', 'ایگری کنیکٹ کیوں منتخب کریں؟')}
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Direct Connection', 'براہ راست رابطہ')}
              </h3>
              <p className={`text-muted-foreground ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t(
                  'Connect farmers directly with buyers, eliminating middlemen',
                  'درمیانی لوگوں کو ختم کرتے ہوئے کسانوں کو براہ راست خریداروں سے جوڑیں'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-4">
                <Cloud className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Weather Insights', 'موسمی معلومات')}
              </h3>
              <p className={`text-muted-foreground ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t(
                  'Real-time weather data and farming recommendations',
                  'حقیقی وقت کی موسمی معلومات اور زراعت کی سفارشات'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-4">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Training Resources', 'تربیتی وسائل')}
              </h3>
              <p className={`text-muted-foreground ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t(
                  'Access modern farming techniques and best practices',
                  'جدید زراعت کی تکنیک اور بہترین طریقوں تک رسائی'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Better Prices', 'بہتر قیمتیں')}
              </h3>
              <p className={`text-muted-foreground ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t(
                  'Fair pricing and transparent marketplace for all',
                  'سب کے لیے منصفانہ قیمتیں اور شفاف بازار'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Verified Users', 'تصدیق شدہ صارفین')}
              </h3>
              <p className={`text-muted-foreground ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t(
                  'All farmers verified with Kissan Card for security',
                  'حفاظت کے لیے کسان کارڈ سے تصدیق شدہ تمام کسان'
                )}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card transition-smooth hover:shadow-elevated border-primary/20">
            <CardContent className="pt-6">
              <div className="bg-gradient-primary p-4 rounded-xl w-fit mb-4">
                <Sprout className="h-8 w-8 text-white" />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Resource Management', 'وسائل کا انتظام')}
              </h3>
              <p className={`text-muted-foreground ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t(
                  'Smart tips for efficient use of water, fertilizer, and resources',
                  'پانی، کھاد اور وسائل کے موثر استعمال کے لیے سمارٹ تجاویز'
                )}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="gradient-primary rounded-3xl p-12 text-center shadow-elevated">
          <h2 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t('Ready to Transform Agriculture?', 'زراعت کو تبدیل کرنے کے لیے تیار ہیں؟')}
          </h2>
          <p className={`text-xl text-white/90 mb-8 ${language === 'ur' ? 'font-urdu' : ''}`}>
            {t(
              'Join thousands of farmers and buyers already using Agri-Connect',
              'ہزاروں کسانوں اور خریداروں میں شامل ہوں جو پہلے سے ایگری کنیکٹ استعمال کر رہے ہیں'
            )}
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/auth')}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-6"
          >
            {t('Join Now', 'ابھی شامل ہوں')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
