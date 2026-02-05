import React from 'react';
import { Link } from 'react-router-dom';
import { Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

export default function OrdersPage() {
  const { t, isArabic } = useLanguage();
  const { orders, user } = useStore();

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  if (!user) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('order.history')}</h1>
          <p className="text-muted-foreground mb-6">
            {isArabic ? 'سجل الدخول لعرض طلباتك' : 'Login to view your orders'}
          </p>
          <Link to="/login">
            <Button size="lg">{t('nav.login')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  if (orders.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('order.history')}</h1>
          <p className="text-muted-foreground mb-6">{t('order.noOrders')}</p>
          <Link to="/products">
            <Button size="lg">{t('home.hero.cta')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">{t('order.history')}</h1>

        <div className="space-y-4">
          {orders.map(order => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold">{order.number}</span>
                      <Badge className={statusColors[order.status]}>
                        {t(`order.status.${order.status}`)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-end">
                      <p className="text-sm text-muted-foreground">{t('cart.total')}</p>
                      <p className="font-bold text-primary">{order.totals.total} {t('common.currency')}</p>
                    </div>
                    <Link to={`/order/${order.id}`}>
                      <Button variant="outline" size="sm">
                        {t('order.details')}
                        <ArrowRight className={`h-4 w-4 ms-2 ${isArabic ? 'rotate-180' : ''}`} />
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Preview items */}
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">
                    {order.items.slice(0, 3).map(item => 
                      isArabic ? item.productName_ar : item.productName_en
                    ).join('، ')}
                    {order.items.length > 3 && ` +${order.items.length - 3}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
}
