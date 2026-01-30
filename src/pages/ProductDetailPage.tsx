import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Snowflake, ShoppingCart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { QuantityStepper } from '@/components/QuantityStepper';
import { PriceDisplay } from '@/components/PriceDisplay';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { cn } from '@/lib/utils';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const { products, getCategoryById, addToCart, getProductsByCategory } = useStore();

  const product = products.find(p => p.slug === slug);
  const [selectedWeightIndex, setSelectedWeightIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (!product) {
    return (
      <Layout>
        <div className="container py-16 text-center">
          <p className="text-muted-foreground">{t('common.noResults')}</p>
          <Link to="/products">
            <Button className="mt-4">{t('common.back')}</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const category = getCategoryById(product.categoryId);
  const selectedWeight = product.weightOptions[selectedWeightIndex];
  const currentPrice = product.price + (selectedWeight?.priceDelta || 0);
  const isOutOfStock = product.stockQty === 0;

  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter(p => p.id !== product.id)
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product.id, selectedWeightIndex, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const badgeLabels = {
    new: t('badge.new'),
    bestseller: t('badge.bestseller'),
    offer: t('badge.offer'),
  };

  const categoryColors = {
    frozen: 'bg-frozen',
    meat: 'bg-meat',
    grocery: 'bg-grocery',
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Breadcrumb */}
        <Button
          variant="ghost"
          className="mb-6 -ms-3"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className={`h-4 w-4 me-2 ${isArabic ? 'rotate-180' : ''}`} />
          {t('common.back')}
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
              <div className={cn('absolute top-0 left-0 right-0 h-2', categoryColors[category?.colorToken || 'grocery'])} />
              <img
                src={product.images[0] || '/placeholder.svg'}
                alt={isArabic ? product.name_ar : product.name_en}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 start-4 flex flex-col gap-2">
                {product.badges.map(badge => (
                  <Badge 
                    key={badge} 
                    variant={badge === 'offer' ? 'destructive' : 'secondary'}
                  >
                    {badgeLabels[badge]}
                  </Badge>
                ))}
                {product.isFrozen && (
                  <Badge variant="outline" className="bg-frozen/20 text-frozen border-frozen/30">
                    <Snowflake className="h-3 w-3 me-1" />
                    {t('badge.frozen')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-muted-foreground">
              {isArabic ? category?.name_ar : category?.name_en}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold">
              {isArabic ? product.name_ar : product.name_en}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-lg">
              {isArabic ? product.desc_ar : product.desc_en}
            </p>

            {/* Price */}
            <PriceDisplay 
              price={currentPrice} 
              compareAtPrice={product.compareAtPrice ? product.compareAtPrice + (selectedWeight?.priceDelta || 0) : undefined}
              size="lg" 
            />

            {/* Weight Options */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t('product.weight')}</Label>
              <RadioGroup
                value={String(selectedWeightIndex)}
                onValueChange={(v) => setSelectedWeightIndex(parseInt(v))}
                className="flex flex-wrap gap-3"
              >
                {product.weightOptions.map((opt, index) => (
                  <div key={index}>
                    <RadioGroupItem
                      value={String(index)}
                      id={`weight-${index}`}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={`weight-${index}`}
                      className={cn(
                        "flex items-center justify-center px-4 py-2 rounded-md border-2 cursor-pointer transition-all",
                        "hover:border-primary/50",
                        selectedWeightIndex === index 
                          ? "border-primary bg-primary/5" 
                          : "border-input"
                      )}
                    >
                      {isArabic ? opt.label_ar : opt.label_en}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">{t('product.quantity')}</Label>
              <QuantityStepper
                value={quantity}
                onChange={setQuantity}
                max={product.stockQty}
                disabled={isOutOfStock}
              />
              {product.stockQty <= 10 && product.stockQty > 0 && (
                <p className="text-sm text-destructive">
                  {isArabic ? `متبقي ${product.stockQty} فقط` : `Only ${product.stockQty} left`}
                </p>
              )}
            </div>

            {/* Add to Cart */}
            <Button
              size="lg"
              className="w-full text-lg h-14"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              {addedToCart ? (
                <>
                  <Check className="h-5 w-5 me-2" />
                  {t('common.success')}
                </>
              ) : isOutOfStock ? (
                t('product.outOfStock')
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 me-2" />
                  {t('product.addToCart')}
                </>
              )}
            </Button>

            {/* SKU */}
            <div className="pt-4 border-t text-sm text-muted-foreground">
              <span className="font-medium">{t('product.sku')}:</span> {product.sku}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">{t('product.related')}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
}
