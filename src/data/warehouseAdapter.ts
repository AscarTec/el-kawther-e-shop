// src/data/warehouseAdapter.ts
import type { Category, Company, Product, WeightOption } from '@/types';

// JSONL file lives in public/assets/images/warehouse_products.jsonl
const JSONL_URL = '/assets/images/warehouse_products.json';
const PLACEHOLDER_IMAGE = '/assets/products/placeholder.png';

export type WarehouseSection = {
  id: string;
  slug: string;
  name_ar: string;
  name_en: string;
};

type RawRow = {
  product_id?: string | number;
  name?: string;
  description?: string;
  category_name?: string;
  brand_name?: string | null;
  price?: number | string | null;
  sale_price?: number | string | null;
  regular_price?: number | string | null;
  currency?: string | null;
  is_available?: boolean | string | null;
  is_out_of_stock?: boolean | string | null;
  is_on_sale?: boolean | string | null;
  sold_quantity?: number | string | null;
  tags?: string | null;
  sku?: string | null;
  image?: string | null;
  local_image?: string | null;
  image_url?: string | null;
  original_image?: string | null;
  product_url?: string | null;
  custom_url?: string | null;
};

const safeStr = (value: unknown, fallback = '') => {
  if (value === null || value === undefined) return fallback;
  const text = String(value).trim();
  return text || fallback;
};

const safeNum = (value: unknown, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const safeBool = (value: unknown, fallback = false) => {
  if (typeof value === 'boolean') return value;
  const normalized = String(value ?? '').toLowerCase().trim();
  if (['true', '1', 'yes', 'y'].includes(normalized)) return true;
  if (['false', '0', 'no', 'n'].includes(normalized)) return false;
  return fallback;
};

const slugify = (text: string) =>
  text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\u0600-\u06FF\w-]+/g, '')
    .replace(/-+/g, '-');

const getCategoryToken = (name: string): Category['colorToken'] => {
  const normalized = name.toLowerCase();
  if (/(frozen|\u0645\u062c\u0645\u062f|\u0645\u062c\u0645\u062f\u0627\u062a)/.test(normalized)) return 'frozen';
  if (/(meat|chicken|beef|\u0644\u062d\u0648\u0645|\u062f\u0648\u0627\u062c\u0646)/.test(normalized)) return 'meat';
  if (/(dairy|milk|\u0627\u0644\u0628\u0627\u0646|\u062d\u0644\u064a\u0628)/.test(normalized)) return 'dairy';
  return 'grocery';
};

const getCategoryIcon = (token: Category['colorToken']): Category['icon'] => {
  const map: Record<Category['colorToken'], Category['icon']> = {
    frozen: 'snowflake',
    meat: 'meat',
    grocery: 'wheat',
    dairy: 'milk',
  };
  return map[token] ?? 'wheat';
};

const normalizeLocalImage = (value?: string | null) => {
  const candidate = safeStr(value);
  if (!candidate) return null;
  if (/^https?:\/\//i.test(candidate)) return null;
  if (candidate.startsWith('/assets/')) return candidate;
  if (candidate.startsWith('assets/')) return `/${candidate}`;
  if (candidate.startsWith('/images/products/')) {
    return `/assets/images/products/${candidate.split('/').pop()}`;
  }
  if (candidate.startsWith('images/products/')) {
    return `/assets/images/products/${candidate.split('/').pop()}`;
  }
  if (candidate.startsWith('/images/')) return `/assets${candidate}`;
  if (candidate.startsWith('images/')) return `/assets/${candidate}`;
  if (candidate.startsWith('/products/')) return `/assets/images${candidate}`;
  if (candidate.startsWith('products/')) return `/assets/images/${candidate}`;
  const filename = candidate.split('/').pop();
  return filename ? `/assets/images/products/${filename}` : null;
};

export const resolveProductImage = (row: RawRow) => {
  const local =
    normalizeLocalImage(row.local_image) ||
    normalizeLocalImage(row.image) ||
    normalizeLocalImage(row.original_image);
  if (local) return local;

  const remote =
    safeStr(row.image_url) ||
    safeStr(row.image) ||
    safeStr(row.original_image);

  return remote || PLACEHOLDER_IMAGE;
};

export const categories: Category[] = [];
export const companies: Company[] = [];
export const products: Product[] = [];
export const sections: WarehouseSection[] = [];

let loaded = false;
let loadPromise: Promise<void> | null = null;

async function fetchJsonl(): Promise<RawRow[]> {
  const res = await fetch(JSONL_URL, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load ${JSONL_URL}: ${res.status}`);

  const text = await res.text();
  const lines = text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines.flatMap((line, index) => {
    try {
      return [JSON.parse(line) as RawRow];
    } catch {
      console.warn(`Bad JSONL line #${index + 1}`);
      return [];
    }
  });
}

const toWeightOptions = (): WeightOption[] => [
  {
    label_ar: 'افتراضي',
    label_en: 'Default',
    grams: 0,
    priceDelta: 0,
  },
];

const toBadges = (row: RawRow): Product['badges'] => {
  const badges: Product['badges'] = [];
  const tags = safeStr(row.tags).toLowerCase();
  if (safeBool(row.is_on_sale)) badges.push('offer');
  if (safeNum(row.sold_quantity) >= 50) badges.push('bestseller');
  if (/(new|\u062c\u062f\u064a\u062f)/.test(tags)) badges.push('new');
  return badges;
};

const toTags = (value?: string | null) =>
  safeStr(value)
    .split(/[|,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

export async function ensureWarehouseLoaded() {
  if (loaded) return;
  if (!loadPromise) {
    loadPromise = (async () => {
      const rows = await fetchJsonl();

      const catMap = new Map<string, Category>();
      const brandMap = new Map<string, Company>();

      for (const row of rows) {
        const categoryName = safeStr(row.category_name, 'بدون تصنيف');
        const categorySlug = slugify(categoryName) || 'uncategorized';
        const categoryId = `cat-${categorySlug}`;

        if (!catMap.has(categoryId)) {
          const colorToken = getCategoryToken(categoryName);
          catMap.set(categoryId, {
            id: categoryId,
            slug: categorySlug,
            colorToken,
            icon: getCategoryIcon(colorToken),
            name_ar: categoryName,
            name_en: categoryName,
          });
        }

        const brandName = safeStr(row.brand_name, 'Unknown');
        const brandSlug = slugify(brandName) || 'unknown';
        const brandId = `brand-${brandSlug}`;

        if (!brandMap.has(brandId)) {
          brandMap.set(brandId, {
            id: brandId,
            slug: brandSlug,
            name_ar: brandName,
            name_en: brandName,
            description_ar: '',
            description_en: '',
          });
        }
      }

      const builtCategories = Array.from(catMap.values());
      const builtCompanies = Array.from(brandMap.values());

      const builtProducts = rows
        .filter((row) => safeStr(row.product_id))
        .map((row) => {
          const id = safeStr(row.product_id);
          const title = safeStr(row.name, `Product ${id}`);
          const description = safeStr(row.description, '');
          const categoryName = safeStr(row.category_name, 'بدون تصنيف');
          const categorySlug = slugify(categoryName) || 'uncategorized';
          const categoryId = `cat-${categorySlug}`;
          const brandName = safeStr(row.brand_name, 'Unknown');
          const brandSlug = slugify(brandName) || 'unknown';
          const companyId = `brand-${brandSlug}`;

          const price = safeNum(row.sale_price ?? row.price ?? row.regular_price, 0);
          const regularPrice = safeNum(row.regular_price ?? price, price);

          const inStock = safeBool(row.is_available, true) && !safeBool(row.is_out_of_stock, false);
          const stockQty = inStock ? Math.max(1, safeNum(row.sold_quantity, 0)) || 999 : 0;

          const tags = toTags(row.tags);
          const isFrozen =
            getCategoryToken(categoryName) === 'frozen' ||
            tags.some((tag) => /(frozen|\u0645\u062c\u0645\u062f)/i.test(tag));

          const image = resolveProductImage(row);
          const badges = toBadges(row);

          return {
            id,
            slug: safeStr(row.custom_url) || slugify(title) || id,
            name_ar: title,
            name_en: title,
            desc_ar: description,
            desc_en: description,
            categoryId,
            companyId,
            price,
            compareAtPrice: regularPrice > price ? regularPrice : undefined,
            currency: safeStr(row.currency, 'SAR'),
            images: [image],
            sku: safeStr(row.sku) || `SKU-${id}`,
            weightOptions: toWeightOptions(),
            stockQty,
            isFrozen,
            badges,
            tags,
          } satisfies Product;
        });

      const builtSections: WarehouseSection[] = [
        { id: 'best-sellers', slug: 'best-sellers', name_ar: 'الأكثر مبيعاً', name_en: 'Best sellers' },
        { id: 'offers', slug: 'offers', name_ar: 'العروض', name_en: 'Offers' },
        { id: 'new', slug: 'new', name_ar: 'الجديد', name_en: 'New' },
      ];

      categories.splice(0, categories.length, ...builtCategories);
      companies.splice(0, companies.length, ...builtCompanies);
      products.splice(0, products.length, ...builtProducts);
      sections.splice(0, sections.length, ...builtSections);

      loaded = true;
    })();
  }

  return loadPromise;
}
