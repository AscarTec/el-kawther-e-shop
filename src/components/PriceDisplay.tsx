import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function PriceDisplay({ price, compareAtPrice, size = 'md', className }: PriceDisplayProps) {
  const { t } = useLanguage();

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const hasDiscount = compareAtPrice && compareAtPrice > price;
  const discountPercent = hasDiscount 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  return (
    <div className={cn('flex items-baseline gap-2 flex-wrap', className)}>
      <span className={cn('font-bold text-primary price-value', sizeClasses[size])}>
        {price.toLocaleString()}
      </span>
      <span className="text-xs text-muted-foreground">{t('common.currency')}</span>
      {hasDiscount && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            {compareAtPrice.toLocaleString()}
          </span>
          <span className="text-xs font-medium text-destructive">
            -{discountPercent}%
          </span>
        </>
      )}
    </div>
  );
}
