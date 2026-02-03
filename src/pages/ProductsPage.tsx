import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Layout } from '@/components/layout/Layout';
import { ProductCard } from '@/components/ProductCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { useStore } from '@/contexts/StoreContext';

type SortOption = 'newest' | 'priceAsc' | 'priceDesc' | 'bestselling';

export default function ProductsPage() {
  const { t, isArabic } = useLanguage();
  const { products, categories, companies } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedCompany, setSelectedCompany] = useState(searchParams.get('company') || 'all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [frozenOnly, setFrozenOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'newest');

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(p =>
        p.name_ar.toLowerCase().includes(searchLower) ||
        p.name_en.toLowerCase().includes(searchLower) ||
        p.desc_ar.toLowerCase().includes(searchLower) ||
        p.desc_en.toLowerCase().includes(searchLower)
      );
    }

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }

    // Company filter
    if (selectedCompany && selectedCompany !== 'all') {
      result = result.filter(p => p.companyId === selectedCompany);
    }

    // In stock filter
    if (inStockOnly) {
      result = result.filter(p => p.stockQty > 0);
    }

    // Frozen filter
    if (frozenOnly) {
      result = result.filter(p => p.isFrozen);
    }

    // Sorting
    switch (sortBy) {
      case 'priceAsc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'bestselling':
        result.sort((a, b) => {
          const aIsBest = a.badges.includes('bestseller') ? 1 : 0;
          const bIsBest = b.badges.includes('bestseller') ? 1 : 0;
          return bIsBest - aIsBest;
        });
        break;
      case 'newest':
      default:
        result.sort((a, b) => {
          const aIsNew = a.badges.includes('new') ? 1 : 0;
          const bIsNew = b.badges.includes('new') ? 1 : 0;
          return bIsNew - aIsNew;
        });
    }

    return result;
  }, [products, search, selectedCategory, selectedCompany, inStockOnly, frozenOnly, sortBy]);

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('all');
    setSelectedCompany('all');
    setInStockOnly(false);
    setFrozenOnly(false);
    setSortBy('newest');
    setSearchParams({});
  };

  const hasFilters = search || selectedCategory !== 'all' || selectedCompany !== 'all' || inStockOnly || frozenOnly;

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.category')}</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('cat.all')}</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat.id} value={cat.id}>
                {isArabic ? cat.name_ar : cat.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Company Filter */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.company')}</Label>
        <Select value={selectedCompany} onValueChange={setSelectedCompany}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('company.all')}</SelectItem>
            {companies.map(company => (
              <SelectItem key={company.id} value={company.id}>
                {isArabic ? company.name_ar : company.name_en}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Availability */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.availability')}</Label>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox 
              id="inStock" 
              checked={inStockOnly} 
              onCheckedChange={(checked) => setInStockOnly(checked as boolean)} 
            />
            <Label htmlFor="inStock" className="text-sm cursor-pointer">
              {t('filter.inStockOnly')}
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="frozen" 
              checked={frozenOnly} 
              onCheckedChange={(checked) => setFrozenOnly(checked as boolean)} 
            />
            <Label htmlFor="frozen" className="text-sm cursor-pointer">
              {t('filter.frozenOnly')}
            </Label>
          </div>
        </div>
      </div>

      {/* Sort */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">{t('filter.sort')}</Label>
        <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">{t('filter.sort.newest')}</SelectItem>
            <SelectItem value="priceAsc">{t('filter.sort.priceAsc')}</SelectItem>
            <SelectItem value="priceDesc">{t('filter.sort.priceDesc')}</SelectItem>
            <SelectItem value="bestselling">{t('filter.sort.bestselling')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasFilters && (
        <Button variant="outline" className="w-full" onClick={clearFilters}>
          <X className="h-4 w-4 me-2" />
          {t('filter.clear')}
        </Button>
      )}
    </div>
  );

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t('nav.products')}</h1>
            <p className="text-muted-foreground mt-1">
              {filteredProducts.length} {isArabic ? 'منتج' : 'products'}
            </p>
          </div>

          {/* Search */}
          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('filter.search')}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="ps-9"
              />
            </div>
            
            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isArabic ? 'right' : 'left'}>
                <SheetHeader>
                  <SheetTitle>{t('filter.title')}</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-64 shrink-0">
            <div className="sticky top-24 bg-card rounded-lg border p-6">
              <h3 className="font-semibold mb-4">{t('filter.title')}</h3>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">{t('common.noResults')}</p>
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  {t('filter.clear')}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
