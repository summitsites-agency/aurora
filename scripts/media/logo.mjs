import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { run } from './ffmpeg.mjs';

/** Crop boxes measured against media-src/Logo.jpeg at its native 2752x1536.
 *  If the client ever re-supplies the logo at a different size these must be
 *  re-measured — they are absolute pixels, not ratios. */
const SOURCE_W = 2752;

/** The emblem inside its double ring. Reads well from ~128px up; below that
 *  the ring and the shell's fine lines collapse into a beige blob, which is
 *  why the small icons use EMBLEM_TIGHT instead. */
const EMBLEM_RING = 'crop=840:840:949:210';

/** The A and the scallop only, ring dropped. The ring is what dies first at
 *  icon sizes, and losing it buys roughly 45% more mark per pixel. */
const EMBLEM_TIGHT = 'crop=580:580:1104:300';

/** The mark is drawn in thin terracotta-on-cream line work — a print weight.
 *  At 32px it goes muddy without help, so lift contrast before downscaling.
 *  Applied ONLY to the small icons; the large art keeps the client's values. */
const ICON_PUNCH = 'eq=contrast=1.6:saturation=1.4:brightness=-0.04';

/** Full lockup — emblem, AURORA, SWIMWEAR. Width is set by the AURORA
 *  wordmark, which is wider than the ring: a box drawn to the ring clips the
 *  outer A and R. Keeps a little paper margin so the mark can sit on the
 *  cream without looking guillotined. */
const LOCKUP = 'crop=1196:1149:778:221';

/** Everything under public/ ships verbatim, so only emit what the site links.
 *  compression_level is ffmpeg's zlib setting — the source is a photographed
 *  paper texture, which deflates badly, so it is worth the max. */
const png = (src, out, vf) =>
  run(['-y', '-i', src, '-vf', vf, '-compression_level', '100', out], `logo ${out}`);

export function buildLogo(srcDir, outDir) {
  const src = resolve(srcDir, 'Logo.jpeg');
  mkdirSync(outDir, { recursive: true });
  const at = (name) => resolve(outDir, name);

  // Tab and bookmark icons. Lanczos, because the default bilinear smears the
  // shell's ribs into one blur at these sizes. No 512: there is no web app
  // manifest to consume it, and it cost 376kB of the bundle to sit unused.
  png(src, at('favicon-32.png'), `${EMBLEM_TIGHT},${ICON_PUNCH},scale=32:32:flags=lanczos`);
  png(src, at('favicon-180.png'), `${EMBLEM_TIGHT},${ICON_PUNCH},scale=180:180:flags=lanczos`);

  // The footer seal, at 2x its 68px render.
  png(src, at('logo-emblem.png'), `${EMBLEM_RING},scale=160:160:flags=lanczos`);

  console.log(`  logo: 2 icons + 1 emblem -> ${outDir}`);
}

/** The full AURORA / SWIMWEAR lockup. Not emitted: the footer sets the
 *  wordmark in Archivo and uses only the emblem, because the lockup carries
 *  its own cream paper and reads as a pasted sticker on the sand ground.
 *  Call this if the client ever supplies the logo as a vector. */
export function buildLockup(srcDir, outDir) {
  png(resolve(srcDir, 'Logo.jpeg'), resolve(outDir, 'logo-lockup.png'),
    `${LOCKUP},scale=620:-1:flags=lanczos`);
}

export const CROPS = { SOURCE_W, EMBLEM_RING, EMBLEM_TIGHT, LOCKUP };
