import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Phone, Mail, Package, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { DELIVERY_SLOTS } from '@/data/seedData';

export default function OrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t, isArabic } = useLanguage();
  const { getOrderById } = useStore();

  const order = orderId ? getOrderById(orderId) : null;

  if (!order) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
          <Link to="/orders">
            <Button className="mt-4">{t('common.back')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    confirmed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };

  const deliverySlot = DELIVERY_SLOTS.find(s => s.value === order.deliverySlot);

  return (
    <Layout>
      <div className="container py-8">
        <Link to="/orders">
          <Button variant="ghost" className="-ms-3 mb-6">
            <ArrowLeft className={`h-4 w-4 me-2 ${isArabic ? 'rotate-180' : ''}`} />
            {t('order.history')}
          </Button>
        </Link>

        <div className="flex flex-wrap items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">{t('order.details')}</h1>
          <Badge className={statusColors[order.status]}>
            {t(`order.status.${order.status}`)}
          </Badge>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Order Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  {isArabic ? 'المنتجات' : 'Items'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center py-2">
                      <div>
                        <p className="font-medium">
                          {isArabic ? item.productName_ar : item.productName_en}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {isArabic ? item.weightOption.label_ar : item.weightOption.label_en} × {item.qty}
                        </p>
                      </div>
                      <span className="font-semibold">{item.totalPrice} {t('common.currency')}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Customer & Delivery */}
            <div className="grid sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('checkout.customer')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span dir="ltr">{order.customer.phone}</span>
                  </div>
                  {order.customer.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{order.customer.email}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('checkout.address')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div>
                      <p>{order.address.street}</p>
                      <p>{order.address.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Truck className="h-4 w-4" />
                    <span>{isArabic ? deliverySlot?.label_ar : deliverySlot?.label_en}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>{t('checkout.orderSummary')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('order.number')}</span>
                  <span className="font-mono">{order.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('order.date')}</span>
                  <span>{new Date(order.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US')}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                  <span>{order.totals.subtotal} {t('common.currency')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t('cart.shipping')}</span>
                  <span>{order.totals.shipping === 0 ? t('cart.freeShipping') : `${order.totals.shipping} ${t('common.currency')}`}</span>
                </div>
                {order.totals.coldChain > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.coldChain')}</span>
                    <span>{order.totals.coldChain} {t('common.currency')}</span>
                  </div>
                )}
                {order.totals.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('cart.discount')}</span>
                    <span>-{order.totals.discount} {t('common.currency')}</span>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>{t('cart.total')}</span>
                <span className="text-primary">{order.totals.total} {t('common.currency')}</span>
              </div>

              <div className="flex items-center gap-2 text-sm pt-2">
                <CreditCard className="h-4 w-4" />
                <span>{order.payment.method === 'cod' ? t('checkout.cod') : t('checkout.card')}</span>
                {order.payment.paid && (
                  <Badge variant="outline" className="ms-auto text-green-600 border-green-600">
                    {isArabic ? 'مدفوع' : 'Paid'}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
