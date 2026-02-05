import React from 'react';
import { motion } from 'framer-motion';
import { Layout } from '@/components/layout/Layout';
import { CategoryTile } from '@/components/CategoryTile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

export default function CategoriesPage() {
  const { t, isArabic } = useLanguage();
  const { categories, getProductsByCategory } = useStore();

  return (
    <Layout>
      <div className="container py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{t('nav.categories')}</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {isArabic ? 'تصفح أقسامنا واختر ما يناسبك' : 'Browse our categories and find what you need'}
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map(cat => (
            <CategoryTile 
              key={cat.id} 
              category={cat} 
              productCount={getProductsByCategory(cat.id).length}
            />
          ))}
        </motion.div>
      </div>
    </Layout>
  );
}
