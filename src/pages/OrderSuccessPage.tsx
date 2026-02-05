import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

export default function OrderSuccessPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, isArabic } = useLanguage();
  const { getOrderById } = useStore();

  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
          <Link to="/">
            <Button className="mt-4">{t('nav.home')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-16">
        <div className="max-w-lg mx-auto text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-2">{t('order.success')}</h1>
          <p className="text-muted-foreground mb-8">
            {isArabic 
              ? 'شكراً لطلبك! سنتواصل معك قريباً لتأكيد الطلب.'
              : 'Thank you for your order! We will contact you soon to confirm.'
            }
          </p>

          <Card className="text-start mb-8">
            <CardContent className="pt-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('order.number')}</span>
                <span className="font-mono font-bold">{order.number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('order.date')}</span>
                <span>{new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('cart.total')}</span>
                <span className="font-bold text-primary">{order.totals.total} {t('common.currency')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">{t('checkout.payment')}</span>
                <span>{order.payment.method === 'cod' ? t('checkout.cod') : t('checkout.card')}</span>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={`/order/${order.id}`}>
              <Button variant="outline" className="gap-2">
                <Package className="h-4 w-4" />
                {t('order.details')}
              </Button>
            </Link>
            <Link to="/products">
              <Button className="gap-2">
                {t('cart.continueShopping')}
                <ArrowRight className={`h-4 w-4 ${isArabic ? 'rotate-180' : ''}`} />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
