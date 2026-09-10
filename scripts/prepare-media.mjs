import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';
import { buildProducts } from './media/knockout.mjs';
import { buildFrames } from './media/frames.mjs';
import { buildPhotos } from './media/photos.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'media-src');

if (!existsSync(src)) {
  console.error(`media-src/ not found at ${src}.`);
  console.error('Raw client assets are git-ignored — restore them before running this.');
  process.exit(1);
}

console.log('AURORA media pipeline');
buildProducts(src, resolve(root, 'public/images/products'));
buildPhotos(src, resolve(root, 'public/images/photo'));
buildFrames(resolve(src, 'expand.mp4'), resolve(root, 'public/frames'));
console.log('done.');
