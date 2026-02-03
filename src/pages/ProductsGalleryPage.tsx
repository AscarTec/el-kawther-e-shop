import React from 'react';
import { Layout } from '@/components/layout/Layout';
import { ProductsGallery } from '@/components/ProductsGallery';

export default function ProductsGalleryPage() {
  return (
    <Layout>
      <div className="container py-10">
        <ProductsGallery />
      </div>
    </Layout>
  );
}
