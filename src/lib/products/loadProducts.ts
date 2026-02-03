export type ProductSource = 'shopify' | 'woocommerce';
export type ProductCollection = 'egypt' | 'local';

export interface NormalizedProduct {
  id: string;
  title: string;
  brand: string;
  category: string;
  image: string;
  source: ProductSource;
  collection: ProductCollection;
}

const PLACEHOLDER_IMAGE = '/assets/products/placeholder.png';
const IMAGE_INDEX_URL = '/assets/products/images_index.json';

const SOURCE_CONFIG: Array<{ source: ProductSource; url: string }> = [
  { source: 'shopify', url: '/assets/products/products_shopify.csv' },
  { source: 'woocommerce', url: '/assets/products/products_woocommerce.csv' },
];

type ImageIndex = Record<ProductCollection, Record<string, string>>;
type ImageIndexStatus = 'unknown' | 'loaded' | 'missing' | 'error';

let imageIndexPromise: Promise<ImageIndex | null> | null = null;
let imageIndexStatus: ImageIndexStatus = 'unknown';

const warnedMessages = new Set<string>();

const isDev = import.meta.env?.DEV ?? false;

const warnOnce = (message: string) => {
  if (!isDev) {
    return;
  }
  if (warnedMessages.has(message)) {
    return;
  }
  warnedMessages.add(message);
  console.warn(message);
};

const fetchImageIndex = async () => {
  if (!imageIndexPromise) {
    imageIndexPromise = (async () => {
      try {
        const response = await fetch(IMAGE_INDEX_URL);
        if (!response.ok) {
          imageIndexStatus = response.status === 404 ? 'missing' : 'error';
          warnOnce(
            `Images index could not be loaded (${response.status}). Run "node scripts/build-images-index.mjs".`,
          );
          return null;
        }
        const data = (await response.json()) as ImageIndex;
        imageIndexStatus = 'loaded';
        return data;
      } catch (error) {
        imageIndexStatus = 'error';
        warnOnce(
          `Images index could not be loaded (${
            error instanceof Error ? error.message : 'unknown error'
          }). Run "node scripts/build-images-index.mjs".`,
        );
        return null;
      }
    })();
  }
  return imageIndexPromise;
};

export const getImageIndexStatus = () => imageIndexStatus;

const csvValue = (value: string | undefined) => (value ?? '').trim();

const normalizeText = (value: string) => value.trim();

const extractFilename = (rawValue: string) => {
  if (!rawValue) {
    return '';
  }

  const firstEntry = rawValue.split(',').map((entry) => entry.trim()).find(Boolean) ?? '';
  if (!firstEntry) {
    return '';
  }

  const sanitized = firstEntry.split('|')[0]?.trim() ?? '';
  if (!sanitized) {
    return '';
  }

  try {
    const url = new URL(sanitized);
    return decodeURIComponent(url.pathname.split('/').pop() ?? '');
  } catch {
    const withoutQuery = sanitized.split('?')[0]?.split('#')[0] ?? '';
    return decodeURIComponent(withoutQuery.split('/').pop() ?? '');
  }
};

const buildLocalImagePath = (collection: ProductCollection, filename: string) =>
  `/assets/products/${collection}-products/images/${filename}`;

const resolveImagePath = (
  collection: ProductCollection,
  filename: string,
  imageIndex: ImageIndex | null,
) => {
  if (!filename) {
    warnOnce(`Missing image filename for ${collection} product record.`);
    return PLACEHOLDER_IMAGE;
  }

  if (!imageIndex) {
    warnOnce(`Images index missing, using placeholder for ${filename}.`);
    return PLACEHOLDER_IMAGE;
  }

  const mapped = imageIndex[collection]?.[filename];
  if (!mapped) {
    warnOnce(`Image filename "${filename}" not found in ${collection} index.`);
    return PLACEHOLDER_IMAGE;
  }

  return mapped || buildLocalImagePath(collection, filename);
};

const csvToRows = (csvText: string) => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let index = 0; index < csvText.length; index += 1) {
    const char = csvText[index];

    if (char === '"') {
      if (inQuotes && csvText[index + 1] === '"') {
        currentValue += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === ',' && !inQuotes) {
      currentRow.push(currentValue);
      currentValue = '';
      continue;
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && csvText[index + 1] === '\n') {
        index += 1;
      }

      currentRow.push(currentValue);
      if (currentRow.some((value) => value.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentValue = '';
      continue;
    }

    currentValue += char;
  }

  currentRow.push(currentValue);
  if (currentRow.some((value) => value.trim().length > 0)) {
    rows.push(currentRow);
  }

  return rows;
};

const csvToRecords = (csvText: string) => {
  const rows = csvToRows(csvText);
  if (rows.length === 0) {
    return [] as Record<string, string>[];
  }

  const [headerRow, ...dataRows] = rows;
  const headers = headerRow.map((header) => header.trim());

  return dataRows.map((row) =>
    headers.reduce((record, header, index) => {
      record[header] = row[index] ?? '';
      return record;
    }, {} as Record<string, string>),
  );
};

const normalizeShopifyRecord = (
  record: Record<string, string>,
  index: number,
  collection: ProductCollection,
  imageIndex: ImageIndex | null,
): NormalizedProduct | null => {
  const status = normalizeText(record['Status'] ?? '');
  if (status && status.toLowerCase() !== 'active') {
    return null;
  }

  const handle = csvValue(record['Handle']);
  const title = csvValue(record['Title']);
  const vendor = csvValue(record['Vendor']);
  const category = csvValue(record['Product Category']);
  const imageFilename = extractFilename(csvValue(record['Image Src']));
  const image = resolveImagePath(collection, imageFilename, imageIndex);

  const idBase = handle || title || `shopify-${index}`;

  return {
    id: `shopify-${collection}-${idBase}-${index}`,
    title: title || handle,
    brand: vendor,
    category,
    image,
    source: 'shopify',
    collection,
  };
};

const normalizeWooCommerceRecord = (
  record: Record<string, string>,
  index: number,
  collection: ProductCollection,
  imageIndex: ImageIndex | null,
): NormalizedProduct => {
  const title = csvValue(record['Name']);
  const category = csvValue(record['Categories']);
  const brand = csvValue(record['Brand']);
  const imageFilename = extractFilename(csvValue(record['Images']));
  const image = resolveImagePath(collection, imageFilename, imageIndex);

  const idBase = title || `woocommerce-${index}`;

  return {
    id: `woocommerce-${collection}-${idBase}-${index}`,
    title,
    brand,
    category,
    image,
    source: 'woocommerce',
    collection,
  };
};

const checkImageExists = async (imageUrl: string) => {
  if (!imageUrl || imageUrl === PLACEHOLDER_IMAGE) {
    return false;
  }

  if (typeof window === 'undefined') {
    try {
      const { access } = await import('node:fs/promises');
      const { join } = await import('node:path');
      const localPath = imageUrl.startsWith('/')
        ? join(process.cwd(), 'public', imageUrl)
        : imageUrl;
      await access(localPath);
      return true;
    } catch {
      return false;
    }
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = imageUrl;
  });
};

const resolveImageFallbacks = async (products: NormalizedProduct[]) => {
  const cache = new Map<string, Promise<boolean>>();

  const hasImage = (url: string) => {
    if (!cache.has(url)) {
      cache.set(url, checkImageExists(url));
    }
    return cache.get(url)!;
  };

  const resolved = await Promise.all(
    products.map(async (product) => {
      const imageOk = await hasImage(product.image);
      return {
        ...product,
        image: imageOk ? product.image : PLACEHOLDER_IMAGE,
      };
    }),
  );

  return resolved;
};

const loadCsv = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Unable to load CSV from ${url}`);
  }
  return response.text();
};

export interface LoadProductsOptions {
  collections?: ProductCollection[];
  sources?: ProductSource[];
}

export const loadProducts = async ({
  collections = ['egypt', 'local'],
  sources = ['shopify', 'woocommerce'],
}: LoadProductsOptions = {}): Promise<NormalizedProduct[]> => {
  const imageIndex = await fetchImageIndex();
  const desiredSources = SOURCE_CONFIG.filter((config) => sources.includes(config.source));

  const csvPayloads = await Promise.all(
    desiredSources.map(async (config) => ({
      source: config.source,
      csvText: await loadCsv(config.url),
    })),
  );

  const products = csvPayloads.flatMap(({ source, csvText }) => {
    const records = csvToRecords(csvText);
    return collections.flatMap((collection) =>
      records
        .map((record, index) => {
          if (source === 'shopify') {
            return normalizeShopifyRecord(record, index, collection, imageIndex);
          }
          return normalizeWooCommerceRecord(record, index, collection, imageIndex);
        })
        .filter((item): item is NormalizedProduct => Boolean(item)),
    );
  });

  return resolveImageFallbacks(products);
};

export const listCategories = (products: NormalizedProduct[]) =>
  Array.from(new Set(products.map((product) => product.category).filter(Boolean))).sort(
    (a, b) => a.localeCompare(b),
  );
