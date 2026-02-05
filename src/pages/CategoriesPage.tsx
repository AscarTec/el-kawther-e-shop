import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { CategoryTile } from '@/components/CategoryTile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

export default function CategoriesPage() {
  const { t } = useLanguage();
  const { categories, getProductsByCategory } = useStore();

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('nav.categories')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(cat => (
            <CategoryTile 
              key={cat.id} 
              category={cat} 
              productCount={getProductsByCategory(cat.id).length}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
