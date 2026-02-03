import { readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const IMAGE_ROOTS = [
  {
    collection: 'egypt',
    dir: path.join(process.cwd(), 'public/assets/products/egypt-products/images'),
  },
  {
    collection: 'local',
    dir: path.join(process.cwd(), 'public/assets/products/local-products/images'),
  },
];

const OUTPUT_PATH = path.join(process.cwd(), 'public/assets/products/images_index.json');
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp']);

const toPosixPath = (value) => value.split(path.sep).join('/');

const collectImages = async (dir) => {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectImages(fullPath)));
    } else if (entry.isFile()) {
      const extension = path.extname(entry.name).toLowerCase();
      if (ALLOWED_EXTENSIONS.has(extension)) {
        files.push(fullPath);
      }
    }
  }

  return files;
};

const buildIndexForRoot = async (rootDir) => {
  try {
    return await collectImages(rootDir);
  } catch (error) {
    if (error && error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const buildIndex = async () => {
  const index = {
    egypt: {},
    local: {},
  };

  for (const { collection, dir } of IMAGE_ROOTS) {
    const images = await buildIndexForRoot(dir);
    for (const filePath of images) {
      const filename = path.basename(filePath);
      const relativeToPublic = path.relative(path.join(process.cwd(), 'public'), filePath);
      const publicPath = `/${toPosixPath(relativeToPublic)}`;

      if (index[collection][filename]) {
        console.warn(
          `Duplicate filename detected for ${collection}: ${filename}. Keeping the first entry.`,
        );
        continue;
      }

      index[collection][filename] = publicPath;
    }
  }

  await writeFile(OUTPUT_PATH, `${JSON.stringify(index, null, 2)}\n`, 'utf8');
};

await buildIndex();
console.log(`Image index written to ${OUTPUT_PATH}`);
