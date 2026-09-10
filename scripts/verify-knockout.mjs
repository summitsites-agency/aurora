import { execFileSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

/** Returns the per-channel MINIMUM over a crop region.
 *
 *  Deliberately not an average. An earlier version averaged a 40x40 corner to
 *  one pixel, which masked per-pixel failures: individual backdrop pixels were
 *  still short of 255 while the mean read exactly 255. Any single pixel below
 *  255 stays visible as a grey speck once the image is multiply-blended, so the
 *  minimum is the only figure that means anything here.
 *
 *  execFileSync returns a Buffer, which has no .join — spread it first. */
function regionMin(file, crop) {
  const buf = execFileSync(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-i', file,
    '-vf', crop, '-frames:v', '1',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-',
  ], { maxBuffer: 1 << 28 });
  const min = [255, 255, 255];
  for (let i = 0; i < buf.length; i += 3) {
    for (let c = 0; c < 3; c++) if (buf[i + c] < min[c]) min[c] = buf[i + c];
  }
  return min;
}

// Backdrop-only strips, clear of the garment.
// In the 880x1100 product crop the garment spans x 184-696, y 76-1024.
const PRODUCT_STRIPS = [
  ['left  ', 'crop=160:1100:0:0'],
  ['right ', 'crop=160:1100:720:0'],
  ['top   ', 'crop=880:60:0:0'],
];
/** The frames cannot be checked by sampling a region. expand.mp4 is an exploded
 *  technical diagram: by the late frames, thin annotation lines radiate out to
 *  every edge and sweep through all four corners (measured: frame 173 puts a
 *  line at 1140,572). No strip is backdrop on all 192 frames.
 *
 *  So verify distributionally instead. Backdrop dominates every frame, so if the
 *  LUT worked, pure white is by far the most common value. A frame that failed
 *  to knock out would peak at ~215 grey instead. */
function whiteShare(file) {
  const buf = execFileSync(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-i', file,
    '-f', 'rawvideo', '-pix_fmt', 'gray', '-',
  ], { maxBuffer: 1 << 28 });
  let white = 0;
  const hist = new Uint32Array(256);
  for (const v of buf) { hist[v]++; if (v === 255) white++; }
  let mode = 0;
  for (let v = 1; v < 256; v++) if (hist[v] > hist[mode]) mode = v;
  return { share: white / buf.length, mode };
}

const products = ['eclipse', 'driftwood', 'midnight', 'kelp', 'horizon', 'clay', 'ember', 'salt'];
const frames = ['001', '032', '064', '096', '128', '160', '192'];

let ok = true;
const fail = (label, why) => { ok = false; console.log(`FAIL  ${label}  ${why}`); };

console.log('Backdrop must be pure white on every channel, every pixel.\n');

for (const slug of products) {
  const file = `public/images/products/${slug}-4x5.webp`;
  const worst = PRODUCT_STRIPS
    .map(([name, crop]) => [name, regionMin(file, crop)])
    .reduce((a, b) => (Math.min(...b[1]) < Math.min(...a[1]) ? b : a));
  if (Math.min(...worst[1]) === 255) console.log(`PASS  product ${slug.padEnd(10)} 255,255,255`);
  else fail(`product ${slug.padEnd(10)}`, `${worst[1].join(',')} in ${worst[0].trim()} strip`);
}

console.log('');

for (const n of frames) {
  const { share, mode } = whiteShare(`public/frames/frame-${n}.webp`);
  const pct = (share * 100).toFixed(1);
  if (mode === 255 && share > 0.5) console.log(`PASS  frame ${n}          ${pct}% pure white, mode 255`);
  else fail(`frame ${n}         `, `${pct}% pure white, mode ${mode} — expected mode 255`);
}

// The shadow is what sells the float. Confirm the LUT did not erase it.
console.log('');
for (const slug of ['ember', 'salt']) {
  const file = `public/images/products/${slug}-4x5.webp`;
  const darkest = Math.min(...regionMin(file, 'crop=440:80:220:990'));
  if (darkest < 250) console.log(`PASS  shadow ${slug.padEnd(11)} darkest ${darkest}`);
  else fail(`shadow ${slug.padEnd(11)}`, `darkest ${darkest} — drop shadow was flattened`);
}

if (!ok) {
  console.error('\nBackdrop is not pure white, or the shadow was destroyed.');
  console.error('Multiply-blending this would show a grey rectangle behind the product.');
  process.exit(1);
}
console.log('\nAll knockout checks passed.');
