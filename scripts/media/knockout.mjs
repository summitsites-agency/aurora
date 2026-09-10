import { mkdirSync } from 'node:fs';
import { run, KNOCKOUT_LUT } from './ffmpeg.mjs';

/** source file (in media-src/) -> output slug */
export const PRODUCT_SOURCES = [
  ['black.jpeg', 'eclipse'],
  ['brown.jpeg', 'driftwood'],
  ['dark blue.jpeg', 'midnight'],
  ['green.jpeg', 'kelp'],
  ['light blue.jpeg', 'horizon'],
  ['pink.jpeg', 'clay'],
  ['red.jpeg', 'ember'],
  ['white.jpeg', 'salt'],
];

// Garment box measured across all 8 files: x 1048-1696, y 184-1384 inside
// 2752x1536 — only 23% of frame width, so a naive cover-crop would render
// mostly empty backdrop. These crops centre that box with ~16% breathing room.
const CROPS = [
  { name: '4x5', crop: 'crop=1114:1392:815:88', scale: 'scale=880:1100' },
  { name: '1x1', crop: 'crop=1392:1392:676:88', scale: 'scale=1100:1100' },
];

export function buildProducts(srcDir, outDir) {
  mkdirSync(outDir, { recursive: true });
  for (const [file, slug] of PRODUCT_SOURCES) {
    for (const { name, crop, scale } of CROPS) {
      run(
        ['-i', `${srcDir}/${file}`,
         '-vf', `${KNOCKOUT_LUT},${crop},${scale}`,
         '-c:v', 'libwebp', '-quality', '86', '-compression_level', '6',
         '-frames:v', '1', `${outDir}/${slug}-${name}.webp`, '-y'],
        `knockout ${slug} ${name}`,
      );
    }
    console.log(`  knockout  ${slug}`);
  }
}
