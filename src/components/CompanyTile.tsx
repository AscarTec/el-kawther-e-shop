import React from 'react';
import { Link } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Company } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';

interface CompanyTileProps {
  company: Company;
  productCount?: number;
}

export function CompanyTile({ company, productCount }: CompanyTileProps) {
  const { isArabic, t } = useLanguage();
  const name = isArabic ? company.name_ar : company.name_en;
  const description = isArabic ? company.description_ar : company.description_en;

  return (
    <Link to={`/products?company=${company.id}`}>
      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-md">
        <CardContent className="p-6 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary/10 p-3 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{name}</h3>
              {productCount !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {productCount} {isArabic ? 'منتج' : 'products'}
                </p>
              )}
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
