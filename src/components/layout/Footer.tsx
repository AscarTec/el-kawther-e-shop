import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MessageCircle, Mail, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';

export function Footer() {
  const { t, isArabic } = useLanguage();
  const { isDark } = useTheme();

  return (
    <footer className="bg-card border-t">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <img 
              src={isDark ? logoDark : logoLight} 
              alt={t('brand.name')}
              className="h-12 w-auto"
            />
            <p className="text-muted-foreground text-sm">
              {t('brand.tagline')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('nav.categories')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/products?category=frozen" className="hover:text-primary">{t('cat.frozen')}</Link></li>
              <li><Link to="/products?category=meat" className="hover:text-primary">{t('cat.meat')}</Link></li>
              <li><Link to="/products?category=grocery" className="hover:text-primary">{t('cat.grocery')}</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="font-semibold mb-4">{isArabic ? 'السياسات' : 'Policies'}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shipping-policy" className="hover:text-primary">{t('footer.shipping')}</Link></li>
              <li><Link to="/returns-policy" className="hover:text-primary">{t('footer.returns')}</Link></li>
              <li><Link to="/about" className="hover:text-primary">{t('nav.about')}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">{t('nav.contact')}</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                <span dir="ltr">+20 123 456 7890</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@elkawther.com</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{isArabic ? 'القاهرة، مصر' : 'Cairo, Egypt'}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
}
