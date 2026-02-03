import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, Moon, Sun, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useStore } from '@/contexts/StoreContext';
import logoLight from '@/assets/logo-light.png';
import logoDark from '@/assets/logo-dark.png';

export function Header() {
  const { t, language, setLanguage, isArabic } = useLanguage();
  const { isDark, toggleTheme } = useTheme();
  const { cartItems, user, isAdmin } = useStore();
  const location = useLocation();

  const cartCount = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const navLinks = [
    { href: '/', label: t('nav.home') },
    { href: '/categories', label: t('nav.categories') },
    { href: '/products', label: t('nav.products') },
    { href: '/contact', label: t('nav.contact') },
  ];

  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
        <img 
  data-header-logo
  src={isDark ? logoDark : logoLight} 
  alt={t('brand.name')}
  className="h-10 w-auto"
/>

        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname.startsWith('/admin') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {t('nav.admin')}
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            className="relative"
            title={language === 'ar' ? 'English' : 'العربية'}
          >
            <Globe className="h-5 w-5" />
            <span className="absolute -bottom-1 text-[10px] font-bold">
              {language === 'ar' ? 'EN' : 'ع'}
            </span>
          </Button>

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Cart */}
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-semibold">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {/* Account */}
          <Link to={user ? '/account' : '/login'}>
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side={isArabic ? 'right' : 'left'} className="w-72">
              <nav className="flex flex-col gap-4 mt-8">
                {navLinks.map(link => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`text-lg font-medium transition-colors hover:text-primary ${
                      location.pathname === link.href ? 'text-primary' : 'text-foreground'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="text-lg font-medium text-primary"
                  >
                    {t('nav.admin')}
                  </Link>
                )}
                <hr className="my-2" />
                {user ? (
                  <>
                    <Link to="/account" className="text-lg font-medium">
                      {t('nav.profile')}
                    </Link>
                    <Link to="/orders" className="text-lg font-medium">
                      {t('nav.orders')}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="text-lg font-medium">
                      {t('nav.login')}
                    </Link>
                    <Link to="/register" className="text-lg font-medium">
                      {t('nav.register')}
                    </Link>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
