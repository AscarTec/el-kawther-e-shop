import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/contexts/StoreContext';
import { useLanguage } from '@/contexts/LanguageContext';

const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A → Z)' },
  { value: 'brand', label: 'Brand (A → Z)' },
  { value: 'category', label: 'Category (A → Z)' },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]['value'];

export function ProductsGallery() {
  const { products, categories, companies } = useStore();
  const { isArabic } = useLanguage();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [companyFilter, setCompanyFilter] = useState('all');
  const [sortBy, setSortBy] = useState<SortValue>('title');

  const categoryMap = useMemo(
    () => new Map(categories.map((c) => [c.id, c])),
    [categories],
  );
  const companyMap = useMemo(
    () => new Map(companies.map((c) => [c.id, c])),
    [companies],
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (categoryFilter !== 'all') {
      result = result.filter((p) => p.categoryId === categoryFilter);
    }

    if (companyFilter !== 'all') {
      result = result.filter((p) => p.companyId === companyFilter);
    }

    if (search) {
      const s = search.toLowerCase();
      result = result.filter((p) => {
        const category = categoryMap.get(p.categoryId);
        const company = companyMap.get(p.companyId);
        return [
          p.name_ar,
          p.name_en,
          p.desc_ar,
          p.desc_en,
          category?.name_ar,
          category?.name_en,
          company?.name_ar,
          company?.name_en,
        ]
          .filter(Boolean)
          .some((field) => String(field).toLowerCase().includes(s));
      });
    }

    return [...result].sort((a, b) => {
      const aCategory = categoryMap.get(a.categoryId);
      const bCategory = categoryMap.get(b.categoryId);
      const aCompany = companyMap.get(a.companyId);
      const bCompany = companyMap.get(b.companyId);

      if (sortBy === 'brand') {
        return (aCompany?.name_en || aCompany?.name_ar || '').localeCompare(
          bCompany?.name_en || bCompany?.name_ar || '',
        );
      }

      if (sortBy === 'category') {
        return (aCategory?.name_en || aCategory?.name_ar || '').localeCompare(
          bCategory?.name_en || bCategory?.name_ar || '',
        );
      }

      return (a.name_en || a.name_ar || '').localeCompare(b.name_en || b.name_ar || '');
    });
  }, [products, categoryFilter, companyFilter, search, sortBy, categoryMap, companyMap]);

  const isLoading = products.length === 0;

  return (
    <section className="space-y-8">
      <div className="flex flex-col gap-6 rounded-2xl border bg-background/60 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Products Gallery</h1>
            <p className="text-muted-foreground">
              {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, brand, or category"
              className="pl-9"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {(isArabic ? c.name_ar : c.name_en) || c.name_en || c.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={companyFilter} onValueChange={setCompanyFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {companies.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {(isArabic ? c.name_ar : c.name_en) || c.name_en || c.name_ar}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortValue)}>
            <SelectTrigger>
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            className="justify-start"
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
              setCompanyFilter('all');
              setSortBy('title');
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Card key={`skeleton-${i}`} className="animate-pulse">
                <div className="aspect-square w-full bg-muted" />
                <CardContent className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          : filteredProducts.map((p) => {
              const category = categoryMap.get(p.categoryId);
              const company = companyMap.get(p.companyId);
              const title = (isArabic ? p.name_ar : p.name_en) || p.name_en || p.name_ar;
              return (
                <Card key={p.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={p.images?.[0] || '/assets/products/placeholder.png'}
                      alt={title}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/products/placeholder.png';
                      }}
                    />
                    <div className="absolute left-3 top-3 flex gap-2">
                      {category && (
                        <Badge variant="secondary">
                          {(isArabic ? category.name_ar : category.name_en) ||
                            category.name_en ||
                            category.name_ar}
                        </Badge>
                      )}
                      {company && (
                        <Badge variant="outline">
                          {(isArabic ? company.name_ar : company.name_en) ||
                            company.name_en ||
                            company.name_ar}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardContent className="space-y-2 p-4">
                    <h3 className="text-lg font-semibold leading-snug">{title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {company
                        ? `${isArabic ? company.name_ar : company.name_en}`
                        : '—'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category
                        ? `${isArabic ? category.name_ar : category.name_en}`
                        : '—'}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
      </div>
    </section>
  );
}
