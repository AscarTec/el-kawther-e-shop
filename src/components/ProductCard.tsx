import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Drumstick, Wheat, ShoppingCart, Milk } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product, Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const categoryColors = {
  frozen: 'bg-frozen',
  meat: 'bg-meat',
  grocery: 'bg-grocery',
  dairy: 'bg-dairy',
};

const categoryIcons = {
  frozen: Snowflake,
  meat: Drumstick,
  grocery: Wheat,
  dairy: Milk,
};

export function ProductCard({ product }: ProductCardProps) {
  const { t, isArabic } = useLanguage();
  const { addToCart, getCategoryById, getCompanyById } = useStore();
  const category = getCategoryById(product.categoryId);
  const company = getCompanyById(product.companyId);

  const name = isArabic ? product.name_ar : product.name_en;
  const baseWeight = product.weightOptions[0];
  const weightLabel = isArabic ? baseWeight?.label_ar : baseWeight?.label_en;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stockQty > 0) {
      addToCart(product.id, 0, 1);
    }
  };

  const isOutOfStock = product.stockQty === 0;
  const isLowStock = product.stockQty > 0 && product.stockQty <= 10;

  const badgeLabels = {
    new: t('badge.new'),
    bestseller: t('badge.bestseller'),
    offer: t('badge.offer'),
  };

  return (
    <Link to={`/product/${product.slug}`}>
      <Card className="group overflow-hidden card-hover h-full">
        {/* Category Stripe */}
        <div className={cn('h-1.5', categoryColors[category?.colorToken || 'grocery'])} />
        
        <div className="relative aspect-square bg-muted overflow-hidden">
          <img 
            src={product.images[0] || '/placeholder.svg'} 
            alt={name}
            onError={(event) => {
              event.currentTarget.src = '/placeholder.svg';
            }}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-2 start-2 flex flex-col gap-1">
            {product.badges.map(badge => (
              <Badge 
                key={badge} 
                variant={badge === 'offer' ? 'destructive' : 'secondary'}
                className="text-xs"
              >
                {badgeLabels[badge]}
              </Badge>
            ))}
            {product.isFrozen && (
              <Badge variant="outline" className="bg-frozen/20 text-frozen border-frozen/30 text-xs">
                <Snowflake className="h-3 w-3 me-1" />
                {t('badge.frozen')}
              </Badge>
            )}
          </div>

          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-destructive font-semibold">{t('product.outOfStock')}</span>
            </div>
          )}
        </div>

        <CardContent className="p-4 space-y-3">
          {/* Category label */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {category && React.createElement(categoryIcons[category.colorToken], { 
              className: cn('h-3.5 w-3.5', `text-${category.colorToken}`)
            })}
            <span>{isArabic ? category?.name_ar : category?.name_en}</span>
          </div>

          {/* Product name */}
          <h3 className="font-semibold text-foreground line-clamp-2 min-h-[2.5rem]">
            {name}
          </h3>

          {company && (
            <p className="text-xs text-muted-foreground">
              {isArabic ? company.name_ar : company.name_en}
            </p>
          )}

          {/* Weight */}
          <p className="text-sm text-muted-foreground">{weightLabel}</p>

          {/* Price row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary price-value">
                {product.price}
              </span>
              <span className="text-xs text-muted-foreground">{t('common.currency')}</span>
              {product.compareAtPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.compareAtPrice}
                </span>
              )}
            </div>
            
            <Button
              size="icon"
              variant="outline"
              className="h-9 w-9 shrink-0"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>

          {/* Low stock warning */}
          {isLowStock && (
            <p className="text-xs text-destructive">
              {isArabic ? `متبقي ${product.stockQty} فقط` : `Only ${product.stockQty} left`}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
