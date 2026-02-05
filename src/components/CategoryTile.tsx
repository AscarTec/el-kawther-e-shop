import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Drumstick, Wheat, Milk, Boxes } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CategoryTileProps {
  category: Category;
  productCount?: number;
}

const categoryBgColors: Record<string, string> = {
  frozen: 'bg-frozen/10 hover:bg-frozen/20',
  meat: 'bg-meat/10 hover:bg-meat/20',
  grocery: 'bg-grocery/10 hover:bg-grocery/20',
  dairy: 'bg-dairy/10 hover:bg-dairy/20',
};

const categoryTextColors: Record<string, string> = {
  frozen: 'text-frozen',
  meat: 'text-meat',
  grocery: 'text-grocery',
  dairy: 'text-dairy',
};

const categoryIcons: Record<string, React.ElementType> = {
  frozen: Snowflake,
  meat: Drumstick,
  grocery: Wheat,
  dairy: Milk,
};

export function CategoryTile({ category, productCount }: CategoryTileProps) {
  const { isArabic } = useLanguage();

  const token = category.colorToken || 'grocery';
  const Icon = categoryIcons[token] ?? Boxes;

  const bg = categoryBgColors[token] ?? 'bg-muted/40 hover:bg-muted/60';
  const text = categoryTextColors[token] ?? 'text-foreground';

  const name = (isArabic ? category.name_ar : category.name_en) || category.name_en || category.name_ar;

  return (
    <Link to={`/products?category=${category.slug || category.id}`}>
      <Card
        className={cn(
          'group overflow-hidden transition-all duration-300 hover:shadow-md cursor-pointer border-2 border-transparent',
          bg,
        )}
      >
        <CardContent className="p-6 flex flex-col items-center text-center gap-4">
          <div className={cn('p-4 rounded-full transition-transform duration-300 group-hover:scale-110', 'bg-background/40')}>
            <Icon className={cn('h-10 w-10', text)} strokeWidth={2} />
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
