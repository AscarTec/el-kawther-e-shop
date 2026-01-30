import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, Tag, Snowflake, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { QuantityStepper } from '@/components/QuantityStepper';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { toast } from 'sonner';
import { FREE_SHIPPING_THRESHOLD } from '@/data/seedData';

export default function CartPage() {
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const { 
    cartItems, 
    cartTotals, 
    updateCartItemQty, 
    removeFromCart, 
    applyCoupon, 
    removeCoupon,
    appliedCoupon 
  } = useStore();

  const [couponCode, setCouponCode] = useState('');

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    if (result.success) {
      toast.success(isArabic ? 'تم تطبيق الكوبون' : 'Coupon applied!');
      setCouponCode('');
    } else {
      toast.error(result.message);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold mb-2">{t('cart.empty')}</h1>
          <p className="text-muted-foreground mb-6">
            {isArabic ? 'ابدأ التسوق الآن!' : 'Start shopping now!'}
          </p>
          <Link to="/products">
            <Button size="lg">{t('cart.continueShopping')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const progressToFreeShipping = Math.min(100, (cartTotals.subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const amountToFreeShipping = FREE_SHIPPING_THRESHOLD - cartTotals.subtotal;

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Free Shipping Progress */}
            {!cartTotals.isFreeShipping && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="py-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="text-sm">
                      {isArabic 
                        ? `أضف ${amountToFreeShipping} ج.م للشحن المجاني`
                        : `Add ${amountToFreeShipping} EGP for free shipping`
                      }
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${progressToFreeShipping}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {cartItems.map(item => (
              <Card key={`${item.productId}-${item.weightOptionIndex}`}>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={`/product/${item.product.slug}`} className="shrink-0">
                      <div className="w-24 h-24 bg-muted rounded-md overflow-hidden">
                        <img
                          src={item.product.images[0] || '/placeholder.svg'}
                          alt={isArabic ? item.product.name_ar : item.product.name_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <Link to={`/product/${item.product.slug}`}>
                        <h3 className="font-semibold hover:text-primary transition-colors">
                          {isArabic ? item.product.name_ar : item.product.name_en}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {isArabic ? item.selectedWeight.label_ar : item.selectedWeight.label_en}
                      </p>
                      {item.product.isFrozen && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-frozen">
                          <Snowflake className="h-3 w-3" />
                          {t('badge.frozen')}
                        </div>
                      )}
                    </div>

                    {/* Quantity & Price */}
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-lg price-value">
                        {item.lineTotal} {t('common.currency')}
                      </span>
                      <QuantityStepper
                        value={item.qty}
                        onChange={(newQty) => updateCartItemQty(item.productId, item.weightOptionIndex, newQty)}
                        max={item.product.stockQty}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.productId, item.weightOptionIndex)}
                      >
                        <Trash2 className="h-4 w-4 me-1" />
                        {t('cart.remove')}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>{t('checkout.orderSummary')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Coupon */}
                <div className="flex gap-2">
                  <Input
                    placeholder={t('cart.coupon')}
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" onClick={handleApplyCoupon}>
                    {t('cart.applyCoupon')}
                  </Button>
                </div>
                {appliedCoupon && (
                  <div className="flex items-center justify-between text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                    <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                      <Tag className="h-4 w-4" />
                      <span>{appliedCoupon.code}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeCoupon}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <Separator />

                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                    <span className="font-medium">{cartTotals.subtotal} {t('common.currency')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('cart.shipping')}</span>
                    <span className={cartTotals.isFreeShipping ? 'text-green-600 font-medium' : ''}>
                      {cartTotals.isFreeShipping ? t('cart.freeShipping') : `${cartTotals.shipping} ${t('common.currency')}`}
                    </span>
                  </div>
                  {cartTotals.hasFrozen && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Snowflake className="h-3 w-3" />
                        {t('cart.coldChain')}
                      </span>
                      <span>{cartTotals.coldChain} {t('common.currency')}</span>
                    </div>
                  )}
                  {cartTotals.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>{t('cart.discount')}</span>
                      <span>-{cartTotals.discount} {t('common.currency')}</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary">{cartTotals.total} {t('common.currency')}</span>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button 
                  size="lg" 
                  className="w-full"
                  onClick={() => navigate('/checkout')}
                >
                  {t('cart.checkout')}
                </Button>
                <Link to="/products" className="w-full">
                  <Button variant="outline" className="w-full">
                    {t('cart.continueShopping')}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
