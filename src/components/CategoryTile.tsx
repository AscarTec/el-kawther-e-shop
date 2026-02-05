import React from 'react';
import { Link } from 'react-router-dom';
import { Snowflake, Drumstick, Wheat, Milk, Boxes, IceCream, Fish, Beef, Carrot, Apple, Egg, Sandwich } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Category } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface CategoryTileProps {
  category: Category;
  productCount?: number;
}

const categoryBgColors: Record<string, string> = {
  frozen: 'bg-gradient-to-br from-frozen/15 via-frozen/5 to-transparent',
  meat: 'bg-gradient-to-br from-meat/15 via-meat/5 to-transparent',
  grocery: 'bg-gradient-to-br from-grocery/15 via-grocery/5 to-transparent',
  dairy: 'bg-gradient-to-br from-dairy/15 via-dairy/5 to-transparent',
};

const categoryBgHover: Record<string, string> = {
  frozen: 'hover:from-frozen/25 hover:via-frozen/10',
  meat: 'hover:from-meat/25 hover:via-meat/10',
  grocery: 'hover:from-grocery/25 hover:via-grocery/10',
  dairy: 'hover:from-dairy/25 hover:via-dairy/10',
};

const categoryBorderColors: Record<string, string> = {
  frozen: 'border-frozen/20 hover:border-frozen/40',
  meat: 'border-meat/20 hover:border-meat/40',
  grocery: 'border-grocery/20 hover:border-grocery/40',
  dairy: 'border-dairy/20 hover:border-dairy/40',
};

const categoryIconBg: Record<string, string> = {
  frozen: 'bg-frozen/20',
  meat: 'bg-meat/20',
  grocery: 'bg-grocery/20',
  dairy: 'bg-dairy/20',
};

const categoryTextColors: Record<string, string> = {
  frozen: 'text-frozen',
  meat: 'text-meat',
  grocery: 'text-grocery',
  dairy: 'text-dairy',
};

const categoryIconSets: Record<string, React.ElementType[]> = {
  frozen: [Snowflake, IceCream, Fish],
  meat: [Drumstick, Beef],
  grocery: [Wheat, Carrot, Apple, Sandwich],
  dairy: [Milk, Egg],
};

const getSemanticIcon = (token: string, categorySlug: string): React.ElementType => {
  const icons = categoryIconSets[token];
  if (!icons?.length) return Boxes;
  const hash = categorySlug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return icons[hash % icons.length];
};

export function CategoryTile({ category, productCount }: CategoryTileProps) {
  const { isArabic } = useLanguage();

  const token = category.colorToken || 'grocery';
  const Icon = getSemanticIcon(token, category.slug || category.id);

  const bg = categoryBgColors[token] ?? 'bg-gradient-to-br from-muted/20 to-transparent';
  const bgHover = categoryBgHover[token] ?? '';
  const borderColor = categoryBorderColors[token] ?? 'border-muted/30';
  const iconBg = categoryIconBg[token] ?? 'bg-muted/20';
  const text = categoryTextColors[token] ?? 'text-foreground';

  const name = (isArabic ? category.name_ar : category.name_en) || category.name_en || category.name_ar;

  return (
    <Link to={`/products?category=${category.slug || category.id}`}>
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        <Card
          className={cn(
            'group relative overflow-hidden cursor-pointer border-2 transition-all duration-300',
            'hover:shadow-xl hover:shadow-primary/5',
            bg,
            bgHover,
            borderColor,
          )}
        >
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-current blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full bg-current blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          </div>

          <CardContent className="relative p-6 sm:p-8 flex flex-col items-center text-center gap-4">
            <motion.div
              className={cn('relative p-5 rounded-2xl transition-all duration-300', iconBg)}
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
            >
              <div className={cn(
                'absolute inset-0 rounded-2xl border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                borderColor,
              )} />
              <Icon className={cn('h-12 w-12 transition-transform duration-300 group-hover:scale-110', text)} strokeWidth={1.5} />
            </motion.div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                {name}
              </h3>
              {productCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  <span className={cn('font-semibold', text)}>{productCount}</span>{' '}
                  {isArabic ? 'منتج' : 'products'}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
