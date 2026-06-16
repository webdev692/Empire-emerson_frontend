import sharp from 'sharp';
import { readdir, stat } from 'fs/promises';
import { join, extname, basename } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');

const SEARCH_DIRS = [
  join(root, 'src', 'assets'),
  join(root, 'public'),
];
const RASTER_EXTS = ['.png', '.jpg', '.jpeg'];

for (const dir of SEARCH_DIRS) {
  let files;
  try {
    files = await readdir(dir);
  } catch {
    continue;
  }

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    if (!RASTER_EXTS.includes(ext)) continue;

    const src = join(dir, file);
    const base = basename(file, ext);

    const webpDest = join(dir, `${base}.webp`);
    await sharp(src).webp({ quality: 80 }).toFile(webpDest);
    const { size: webpSize } = await stat(webpDest);
    console.log(`✓ ${file} → ${base}.webp (${(webpSize / 1024).toFixed(1)} KB)`);

    const avifDest = join(dir, `${base}.avif`);
    await sharp(src).avif({ quality: 50, effort: 3 }).toFile(avifDest);
    const { size: avifSize } = await stat(avifDest);
    console.log(`✓ ${file} → ${base}.avif (${(avifSize / 1024).toFixed(1)} KB)`);
  }
}

console.log('Image optimisation complete.');
