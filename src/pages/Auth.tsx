import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Header from '@/components/Header';
import { Sprout } from 'lucide-react';

const Auth = () => {
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Signup state
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'farmer' | 'buyer'>('buyer');
  const [kissanCard, setKissanCard] = useState('');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'farmer' && kissanCard.length !== 13) {
      toast.error(t(
        'Please enter a valid 13-digit Kissan Card number',
        'براہ کرم درست کسان کارڈ نمبر درج کریں (۱۳ ہندسے)'
      ));
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          data: {
            full_name: fullName,
            role: role,
            kissan_card_number: role === 'farmer' ? kissanCard : null,
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      toast.success(t(
        'Account created successfully! Please check your email.',
        'اکاؤنٹ کامیابی سے بنایا گیا! براہ کرم اپنی ای میل چیک کریں۔'
      ));
      
      // Auto-navigate after successful signup
      setTimeout(() => {
        navigate(role === 'farmer' ? '/farmer' : '/buyer');
      }, 1000);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) throw error;

      toast.success(t('Logged in successfully!', 'کامیابی سے لاگ ان ہو گئے!'));
      
      // The AuthContext will handle navigation based on user role
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-soft">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="inline-block gradient-primary p-4 rounded-2xl mb-4 shadow-elevated">
              <Sprout className="h-12 w-12 text-white" />
            </div>
            <h1 className={`text-3xl font-bold text-primary mb-2 ${language === 'ur' ? 'font-urdu' : ''}`}>
              {t('Welcome to Agri-Connect', 'ایگری کنیکٹ میں خوش آمدید')}
            </h1>
            <p className="text-muted-foreground">
              {t('Connect with farmers and buyers', 'کسانوں اور خریداروں سے جڑیں')}
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">
                {t('Login', 'لاگ ان')}
              </TabsTrigger>
              <TabsTrigger value="signup">
                {t('Sign Up', 'سائن اپ')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <Card className="shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Login to your account', 'اپنے اکاؤنٹ میں لاگ ان کریں')}
                  </CardTitle>
                  <CardDescription className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Enter your credentials to continue', 'جاری رکھنے کے لیے اپنی معلومات درج کریں')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">
                        {t('Email', 'ای میل')}
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">
                        {t('Password', 'پاس ورڈ')}
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full gradient-primary text-white hover:opacity-90"
                    >
                      {loading ? t('Loading...', 'لوڈ ہو رہا ہے...') : t('Login', 'لاگ ان')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="signup">
              <Card className="shadow-card border-primary/20">
                <CardHeader>
                  <CardTitle className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Create an account', 'اکاؤنٹ بنائیں')}
                  </CardTitle>
                  <CardDescription className={language === 'ur' ? 'font-urdu' : ''}>
                    {t('Sign up to start connecting', 'جڑنا شروع کرنے کے لیے سائن اپ کریں')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">
                        {t('Full Name', 'پورا نام')}
                      </Label>
                      <Input
                        id="full-name"
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email">
                        {t('Email', 'ای میل')}
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password">
                        {t('Password', 'پاس ورڈ')}
                      </Label>
                      <Input
                        id="signup-password"
                        type="password"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                        minLength={6}
                        className="border-primary/30 focus:border-primary"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">
                        {t('I am a', 'میں ہوں')}
                      </Label>
                      <Select value={role} onValueChange={(value: 'farmer' | 'buyer') => setRole(value)}>
                        <SelectTrigger className="border-primary/30 focus:border-primary">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="farmer">
                            {t('Farmer', 'کسان')}
                          </SelectItem>
                          <SelectItem value="buyer">
                            {t('Buyer', 'خریدار')}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {role === 'farmer' && (
                      <div className="space-y-2">
                        <Label htmlFor="kissan-card">
                          {t('Kissan Card Number (13 digits)', 'کسان کارڈ نمبر (۱۳ ہندسے)')}
                        </Label>
                        <Input
                          id="kissan-card"
                          type="text"
                          value={kissanCard}
                          onChange={(e) => setKissanCard(e.target.value)}
                          required
                          maxLength={13}
                          pattern="[0-9]{13}"
                          className="border-primary/30 focus:border-primary"
                          placeholder={t('1234567890123', '۱۲۳۴۵۶۷۸۹۰۱۲۳')}
                        />
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full gradient-primary text-white hover:opacity-90"
                    >
                      {loading ? t('Creating...', 'بنایا جا رہا ہے...') : t('Sign Up', 'سائن اپ')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Auth;
