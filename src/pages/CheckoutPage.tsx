import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Banknote, Truck, Snowflake, MapPin, User, Phone, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Layout } from '@/components/layout/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { DELIVERY_SLOTS } from '@/data/seedData';
import { toast } from 'sonner';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const { cartItems, cartTotals, createOrder, user } = useStore();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    street: '',
    city: '',
    deliverySlot: DELIVERY_SLOTS[0].value,
    paymentMethod: 'cod' as 'cod' | 'card',
  });

  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.street || !formData.city) {
      toast.error(isArabic ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }

    setLoading(true);

    try {
      const order = createOrder({
        status: 'pending',
        customer: {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
        },
        address: {
          street: formData.street,
          city: formData.city,
        },
        deliverySlot: formData.deliverySlot,
        payment: {
          method: formData.paymentMethod,
          paid: formData.paymentMethod === 'card', // Demo: card is auto-paid
        },
      });

      navigate(`/order-success/${order.id}`);
    } catch (error) {
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('checkout.customer')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t('checkout.name')} *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t('checkout.phone')} *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        dir="ltr"
                        value={formData.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('checkout.email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    {t('checkout.address')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">{t('checkout.address')} *</Label>
                    <Textarea
                      id="street"
                      value={formData.street}
                      onChange={(e) => handleChange('street', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('checkout.city')} *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Slot */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    {t('checkout.delivery')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={formData.deliverySlot} onValueChange={(v) => handleChange('deliverySlot', v)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {DELIVERY_SLOTS.map(slot => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {isArabic ? slot.label_ar : slot.label_en}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {/* Payment */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('checkout.payment')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(v) => handleChange('paymentMethod', v)}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="cod" id="cod" />
                      <Label htmlFor="cod" className="flex items-center gap-3 cursor-pointer flex-1">
                        <Banknote className="h-5 w-5 text-green-600" />
                        {t('checkout.cod')}
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rtl:space-x-reverse p-4 border rounded-lg cursor-pointer hover:bg-muted/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                        <CreditCard className="h-5 w-5 text-blue-600" />
                        {t('checkout.card')}
                      </Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div>
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>{t('checkout.orderSummary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {cartItems.map(item => (
                      <div key={`${item.productId}-${item.weightOptionIndex}`} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {isArabic ? item.product.name_ar : item.product.name_en} × {item.qty}
                        </span>
                        <span>{item.lineTotal} {t('common.currency')}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.subtotal')}</span>
                      <span>{cartTotals.subtotal} {t('common.currency')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('cart.shipping')}</span>
                      <span>{cartTotals.isFreeShipping ? t('cart.freeShipping') : `${cartTotals.shipping} ${t('common.currency')}`}</span>
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

                  <Button type="submit" size="lg" className="w-full" disabled={loading}>
                    {loading ? t('common.loading') : t('checkout.placeOrder')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
}
