import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Snowflake, Award, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { CategoryTile } from '@/components/CategoryTile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { useTheme } from '@/contexts/ThemeContext';
import patternLight from '@/assets/pattern-light.png';
import patternDark from '@/assets/pattern-dark.png';

export default function HomePage() {
  const { t, isArabic } = useLanguage();
  const { isDark } = useTheme();
  const { products, categories, getProductsByCategory } = useStore();

  // Featured products (bestsellers or first 8)
  const featuredProducts = products
    .filter(p => p.badges.includes('bestseller') || p.badges.includes('new'))
    .slice(0, 8);

  // Count products per category
  const getCategoryCount = (catId: string) => getProductsByCategory(catId).length;

  const benefits = [
    {
      icon: Truck,
      title: t('home.benefit1.title'),
      desc: t('home.benefit1.desc'),
    },
    {
      icon: Snowflake,
      title: t('home.benefit2.title'),
      desc: t('home.benefit2.desc'),
    },
    {
      icon: Award,
      title: t('home.benefit3.title'),
      desc: t('home.benefit3.desc'),
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative hero-gradient text-primary-foreground overflow-hidden">
        <div 
          className="absolute inset-0 opacity-10"
          style={{ 
            backgroundImage: `url(${isDark ? patternDark : patternLight})`,
            backgroundSize: '300px',
          }}
        />
        <div className="container relative py-20 md:py-32">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              {t('home.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl opacity-90">
              {t('home.hero.subtitle')}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/products">
                <Button size="lg" variant="secondary" className="text-lg gap-2">
                  {t('home.hero.cta')}
                  <ArrowRight className={`h-5 w-5 ${isArabic ? 'rotate-180' : ''}`} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.categories.title')}</h2>
            <Link to="/categories" className="text-primary hover:underline flex items-center gap-1">
              {t('common.viewAll')}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.map(cat => (
              <CategoryTile 
                key={cat.id} 
                category={cat} 
                productCount={getCategoryCount(cat.id)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t('home.benefits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-8 pb-6 px-6 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* New Shipment Banner */}
      <section className="py-6 bg-accent text-accent-foreground">
        <div className="container flex items-center justify-center gap-4">
          <Package className="h-6 w-6" />
          <span className="text-lg font-semibold">{t('home.newshipment')}</span>
          <Link to="/products?sort=newest">
            <Button variant="outline" size="sm" className="border-accent-foreground/30 hover:bg-accent-foreground/10">
              {t('common.viewAll')}
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-bold">{t('home.featured.title')}</h2>
            <Link to="/products" className="text-primary hover:underline flex items-center gap-1">
              {t('common.viewAll')}
              <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold">
            {isArabic ? 'جاهز للطلب؟' : 'Ready to Order?'}
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            {isArabic 
              ? 'تسوق الآن واستمتع بأفضل المنتجات الغذائية مع توصيل سريع'
              : 'Shop now and enjoy the best food products with fast delivery'
            }
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-lg">
              {t('home.hero.cta')}
            </Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
