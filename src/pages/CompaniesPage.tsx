import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { CompanyTile } from '@/components/CompanyTile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

export default function CompaniesPage() {
  const { t } = useLanguage();
  const { companies, getProductsByCompany } = useStore();

  return (
    <Layout>
      <div className="container py-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('companies.title')}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map(company => (
            <CompanyTile
              key={company.id}
              company={company}
              productCount={getProductsByCompany(company.id).length}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
