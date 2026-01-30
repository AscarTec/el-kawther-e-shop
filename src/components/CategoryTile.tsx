import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Drumstick, Wheat } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CategoryTileProps {
  category: Category;
  productCount?: number;
}

const categoryBgColors = {
  frozen: 'bg-frozen/10 hover:bg-frozen/20',
  meat: 'bg-meat/10 hover:bg-meat/20',
  grocery: 'bg-grocery/10 hover:bg-grocery/20',
};

const categoryTextColors = {
  frozen: 'text-frozen',
  meat: 'text-meat',
  grocery: 'text-grocery',
};

const categoryIcons = {
  frozen: Snowflake,
  meat: Drumstick,
  grocery: Wheat,
};

export function CategoryTile({ category, productCount }: CategoryTileProps) {
  const { isArabic } = useLanguage();
  const Icon = categoryIcons[category.colorToken];
  const name = isArabic ? category.name_ar : category.name_en;

  return (
    <Link to={`/products?category=${category.slug}`}>
      <Card className={cn(
        'group overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer border-2 border-transparent',
        categoryBgColors[category.colorToken],
        `hover:border-${category.colorToken}/30`
      )}>
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className={cn(
            'p-4 rounded-full transition-transform duration-300 group-hover:scale-110',
            `bg-${category.colorToken}/20`
          )}>
            <Icon className={cn('h-10 w-10', categoryTextColors[category.colorToken])} strokeWidth={2} />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-foreground">{name}</h3>
            {productCount !== undefined && (
              <p className="text-sm text-muted-foreground mt-1">
                {productCount} {isArabic ? 'منتج' : 'products'}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
