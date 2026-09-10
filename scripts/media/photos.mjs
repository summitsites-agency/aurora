import { mkdirSync } from 'node:fs';
import { run } from './ffmpeg.mjs';

export const PHOTO_SOURCES = [
  ['home.jpeg', 'hero'],
  ['model1.jpeg', 'model1'],
  ['model2.jpeg', 'model2'],
  ['model3.jpeg', 'model3'],
  ['model4.jpeg', 'model4'],
];

const WIDTHS = [1600, 2400];

/** No knockout LUT here — these are photographs of people, and the LUT would
 *  crush skin tones. Emits two widths plus a 24px blurred LQIP placeholder.
 *
 *  All five sources are landscape 2752x1536. No portrait crop exists, so no
 *  layout may require a vertical shot. */
export function buildPhotos(srcDir, outDir) {
  mkdirSync(outDir, { recursive: true });
  for (const [file, slug] of PHOTO_SOURCES) {
    for (const w of WIDTHS) {
      run(
        ['-i', `${srcDir}/${file}`,
         '-vf', `scale=${w}:-2`,
         '-c:v', 'libwebp', '-quality', '82', '-compression_level', '6',
         '-frames:v', '1', `${outDir}/${slug}-${w}.webp`, '-y'],
        `photo ${slug} ${w}`,
      );
    }
    run(
      ['-i', `${srcDir}/${file}`,
       '-vf', 'scale=24:-2,gblur=sigma=3',
       '-c:v', 'libwebp', '-quality', '40',
       '-frames:v', '1', `${outDir}/${slug}-lqip.webp`, '-y'],
      `lqip ${slug}`,
    );
    console.log(`  photo     ${slug}`);
  }
}
