import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, Sprout } from 'lucide-react';

const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { user, profile, signOut } = useAuth();

  return (
    <header className="gradient-primary shadow-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Sprout className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl font-bold text-white ${language === 'ur' ? 'font-urdu' : ''}`}>
                {t('Agri-Connect', 'ایگری کنیکٹ')}
              </h1>
              <p className="text-white/80 text-xs">
                {t('Connecting Farmers & Buyers', 'کسانوں اور خریداروں کو جوڑنا')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user && profile && (
              <div className={`hidden md:block text-right ${language === 'ur' ? 'font-urdu' : ''}`}>
                <p className="text-white font-medium">{profile.full_name}</p>
                <p className="text-white/80 text-sm capitalize">{profile.role}</p>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleLanguage}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
            >
              <Globe className="h-4 w-4 mr-2" />
              {language === 'en' ? 'اردو' : 'English'}
            </Button>

            {user && (
              <Button
                variant="outline"
                size="sm"
                onClick={signOut}
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
