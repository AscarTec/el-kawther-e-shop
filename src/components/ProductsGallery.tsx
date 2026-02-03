import React, { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import {
  getImageIndexStatus,
  listCategories,
  loadProducts,
  NormalizedProduct,
  ProductCollection,
  ProductSource,
} from '@/lib/products/loadProducts';

const SORT_OPTIONS = [
  { value: 'title', label: 'Title (A → Z)' },
  { value: 'brand', label: 'Brand (A → Z)' },
  { value: 'category', label: 'Category (A → Z)' },
] as const;

const COLLECTION_OPTIONS: Array<{ value: ProductCollection; label: string }> = [
  { value: 'egypt', label: 'Egypt' },
  { value: 'local', label: 'Local' },
];

const SOURCE_OPTIONS: Array<{ value: ProductSource | 'all'; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'shopify', label: 'Shopify' },
  { value: 'woocommerce', label: 'WooCommerce' },
];

export function ProductsGallery() {
  const [products, setProducts] = useState<NormalizedProduct[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [imageIndexStatus, setImageIndexStatus] = useState<
    ReturnType<typeof getImageIndexStatus>
  >('unknown');
  const [search, setSearch] = useState('');
  const [collectionFilter, setCollectionFilter] = useState<ProductCollection>('egypt');
  const [sourceFilter, setSourceFilter] = useState<ProductSource | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<(typeof SORT_OPTIONS)[number]['value']>('title');

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setStatus('loading');
      try {
        const data = await loadProducts();
        if (isMounted) {
          setProducts(data);
          setImageIndexStatus(getImageIndexStatus());
          setStatus('idle');
        }
      } catch (error) {
        console.error(error);
        if (isMounted) {
          setStatus('error');
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(() => listCategories(products), [products]);

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => product.collection === collectionFilter);

    if (sourceFilter !== 'all') {
      result = result.filter((product) => product.source === sourceFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter((product) => product.category === categoryFilter);
    }

    if (search) {
      const searchValue = search.toLowerCase();
      result = result.filter((product) =>
        [product.title, product.brand, product.category].some((field) =>
          field.toLowerCase().includes(searchValue),
        ),
      );
    }

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'title':
        default:
          return a.title.localeCompare(b.title);
      }
    });

    return result;
  }, [products, collectionFilter, sourceFilter, categoryFilter, search, sortBy]);

  const isLoading = status === 'loading';
  const hasError = status === 'error';

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
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by title, brand, or category"
              className="pl-9"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-3">
            {COLLECTION_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={collectionFilter === option.value ? 'default' : 'outline'}
                onClick={() => setCollectionFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            {SOURCE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={sourceFilter === option.value ? 'default' : 'outline'}
                onClick={() => setSourceFilter(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as typeof sortBy)}>
              <SelectTrigger>
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            variant="ghost"
            className="md:col-span-2 xl:col-span-2 justify-start"
            onClick={() => {
              setSearch('');
              setCategoryFilter('all');
              setSourceFilter('all');
              setSortBy('title');
            }}
          >
            Clear filters
          </Button>
        </div>
      </div>

      {hasError && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          Unable to load products right now. Please try again later.
        </div>
      )}

      {(imageIndexStatus === 'missing' || imageIndexStatus === 'error') && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Images index missing. Run <span className="font-medium">node scripts/build-images-index.mjs</span>{' '}
          after copying the product images into the public assets folders.
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <Card key={`skeleton-${index}`} className="animate-pulse">
                <div className="aspect-square w-full bg-muted" />
                <CardContent className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-muted" />
                  <div className="h-3 w-1/2 rounded bg-muted" />
                  <div className="h-3 w-2/3 rounded bg-muted" />
                </CardContent>
              </Card>
            ))
          : filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div className="relative aspect-square bg-muted">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="h-full w-full object-cover"
                    onError={(event) => {
                      event.currentTarget.src = '/assets/products/placeholder.png';
                    }}
                  />
                  <div className="absolute left-3 top-3 flex gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {product.collection}
                    </Badge>
                    <Badge variant="outline">{product.source}</Badge>
                  </div>
                </div>
                <CardContent className="space-y-2 p-4">
                  <h3 className="text-lg font-semibold leading-snug">{product.title}</h3>
                  <p className="text-sm text-muted-foreground">Brand: {product.brand || '—'}</p>
                  <p className="text-sm text-muted-foreground">Category: {product.category || '—'}</p>
                </CardContent>
              </Card>
            ))}
      </div>
    </section>
  );
}
