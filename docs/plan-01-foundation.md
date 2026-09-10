# AURORA — Plan 1: Foundation & Media Pipeline

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stand up the AURORA project — scaffold, processed media, design tokens, data layer, cart, routing shell and chrome — so all eight routes render with real assets and a working bag.

**Architecture:** Vite 6 + React 19 + React Router 7, design-token CSS (no framework). Raw client assets move to `media-src/` and a `prepare-media` script emits web-ready derivatives into `public/`. Cart is a reducer + context persisted to localStorage. A `GroundProvider` sits above the router outlet so the colour-tween survives navigation.

**Tech Stack:** Vite 6, React 19, React Router 7, GSAP 3.15 (`@gsap/react`), Lenis, Fontsource (Archivo Variable + Pinyon Script), ffmpeg-static, Vitest + jsdom + Testing Library.

**Spec:** `docs/design-spec.md`

**Working directory for every command:** ``

---

## File structure

```

  package.json                 scripts + deps
  vite.config.js               react plugin + vitest config
  index.html                   root document, font preload
  .gitignore                   node_modules, dist, /media-src/, /refs/
  CONTENT.md                   client sign-off checklist
  scripts/
    prepare-media.mjs          orchestrator
    media/knockout.mjs         LUT + crops for the 8 product stills
    media/frames.mjs           192-frame extraction from expand.mp4
    media/photos.mjs           hero + model resize, LQIP
    media/ffmpeg.mjs           shared ffmpeg runner
  media-src/                   raw client assets (git-ignored)
  public/
    images/products/           knockout derivatives
    images/photo/              hero + model derivatives
    frames/                    192 webp frames
  src/
    main.jsx                   entry
    App.jsx                    router + providers
    data/products.js           the eight colourways
    data/sizes.js              XS S M L
    lib/format.js              CAD money formatting
    lib/useMediaQuery.js
    lib/useReducedMotion.js
    motion/gsap.js             plugin registration + custom eases
    smooth/SmoothScroll.jsx    Lenis <-> ScrollTrigger
    smooth/lenisContext.js
    ground/GroundProvider.jsx  colour-tween ground
    cart/cartReducer.js
    cart/CartProvider.jsx
    cart/CartDrawer.jsx
    components/Nav.jsx
    components/Footer.jsx
    components/PageTransition.jsx
    routes/{Home,Shop,Product,Craft,Journal,Fit,Contact,Checkout}.jsx
    styles/{tokens,base,motion}.css
  tests/
    products.test.js
    format.test.js
    cartReducer.test.js
    fontRule.test.js
```

**Boundaries.** `data/` holds facts only, no React. `lib/` is pure functions and
hooks with no project knowledge. `motion/`, `smooth/` and `ground/` each own one
cross-cutting concern and expose a single named export. Route modules compose;
they never define animation primitives.

---

## Task 1: Scaffold the project

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `.gitignore`
- Create: `src/main.jsx`
- Create: `src/App.jsx`

- [x] **Step 1: Create `package.json`**

```json
{
  "name": "aurora",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "prepare-media": "node scripts/prepare-media.mjs"
  },
  "dependencies": {
    "@fontsource-variable/archivo": "^5.2.5",
    "@fontsource/pinyon-script": "^5.2.5",
    "@gsap/react": "^2.1.2",
    "gsap": "^3.15.0",
    "lenis": "^1.3.23",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "react-router-dom": "^7.9.4"
  },
  "devDependencies": {
    "@testing-library/react": "^16.3.0",
    "@vitejs/plugin-react": "^4.5.2",
    "ffmpeg-static": "^5.3.0",
    "jsdom": "^29.1.1",
    "vite": "^6.3.5",
    "vitest": "^4.1.9"
  }
}
```

- [x] **Step 2: Create `vite.config.js`**

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/**/*.test.js', 'tests/**/*.test.jsx'],
  },
});
```

- [x] **Step 3: Create `index.html`**

> **Client preference, confirmed 2026-09-10:** the title is the bare word
> `AURORA`. It was originally `AURORA — Handmade Swimwear`; the user changed it
> deliberately and it was mistaken for file drift twice. **Do not revert it.**
> The descriptor lives in the meta description instead.

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AURORA</title>
    <meta name="description" content="One silhouette, eight shades. Cut and sewn by hand." />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [x] **Step 4: Create `.gitignore`**

Paths are anchored to the project root so `public/` derivatives still ship.

```gitignore
node_modules/
dist/
*.local
.DS_Store

# Raw client assets. The web-ready derivatives in public/ are committed so the
# repo is clone-and-run; re-running `npm run prepare-media` needs these back.
/media-src/
/refs/
```

- [x] **Step 5: Create a placeholder `src/main.jsx`**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [x] **Step 6: Create a placeholder `src/App.jsx`**

Replaced in Task 13. This exists only so `npm run dev` boots.

```jsx
export default function App() {
  return <h1>AURORA</h1>;
}
```

- [x] **Step 7: Install and verify the dev server boots**

```bash
cd "not uploaded/aurora" && npm install && npm run build
```

Expected: `npm install` completes, `vite build` prints `✓ built in …` and writes `dist/`.

- [x] **Step 8: Commit**

**Scope this add to the seven scaffold files.** A broad
`git add "not uploaded/aurora"` here would commit 28 MB of irreplaceable client
originals into history: Task 2 has not run yet, so `public/` still holds the raw
jpegs and `expand.mp4`, and the project `.gitignore` excludes only `/media-src/`
and `/refs/` — not `/public/`.

```bash
cd "not uploaded/aurora"
git add package.json package-lock.json vite.config.js index.html .gitignore src/main.jsx src/App.jsx
git commit -m "feat(aurora): scaffold Vite + React + Router project"
```

Verify nothing large slipped in before moving on:

```bash
git show --stat HEAD | tail -12
```

Expected: seven files, none over ~200 KB (`package-lock.json` is the largest).

> **Deviation:** staged only the 7 scaffold files (package.json,
> package-lock.json, vite.config.js, index.html, .gitignore, src/main.jsx,
> src/App.jsx) instead of the whole directory. At this point `public/` still
> held the 13 raw client jpegs + expand.mp4 (Task 2 hadn't run yet), and
> `.gitignore` does not exclude `/public/`. A broad `git add` would have
> committed 28 MB of irreplaceable client originals into git history before
> they could be moved to the gitignored `media-src/`. See
> AURORA-PROGRESS.md Decisions & deviations. Commit: `0d61ec8`.

---

## Task 2: Move raw assets into `media-src/`

The client's originals currently sit in `public/`, where Vite would ship all
28 MB of them. They become build inputs instead.

**Files:**
- Move: `public/*` → `media-src/`

- [x] **Step 1: Move the raw assets**

```bash
cd "not uploaded/aurora" && mkdir -p media-src && mv public/*.jpeg public/*.mp4 media-src/ && ls media-src && ls public
```

Expected: `media-src` lists **13** `.jpeg` files and `expand.mp4` (14 total) —
8 product colourways, `home.jpeg`, and `model1`–`model4`. `public` is empty.

Because Task 1's commit was correctly scoped to the scaffold files, nothing
under `public/` was ever tracked, so this move produces an empty git diff. Use
`git commit --allow-empty` so the ledger still has a commit to point at.

> **Deviation:** actual count is 13 `.jpeg` files (8 product colourways +
> home.jpeg + model1–4.jpeg) + expand.mp4 = 14 files, not 12 + 1. This
> matches the plan's own `PRODUCT_SOURCES` (8) + `PHOTO_SOURCES` (5) = 13
> from Tasks 4 and 6. The wildcard `mv` moved all of them correctly
> regardless of the exact count. `public/` verified empty afterward.

- [x] **Step 2: Commit**

```bash
git add -A "not uploaded/aurora"
git commit -m "chore(aurora): move raw client assets to media-src"
```

> **Deviation:** `git add -A` found nothing to stage — `public/*.jpeg` and
> `expand.mp4` were never git-tracked (excluded from the Task 1 commit; see
> that step's note), and `media-src/` is gitignored, so the move produced no
> diff for git to see. Recorded with `git commit --allow-empty` instead so
> the task still has a ledger commit. Commit: `3f8fcf6`.

---

## Task 3: Shared ffmpeg runner

**Files:**
- Create: `scripts/media/ffmpeg.mjs`

- [x] **Step 1: Write the runner**

`ffmpeg-static` exports the binary path as its default export. Every media
module goes through `run()` so failures surface with the actual ffmpeg stderr
rather than a bare non-zero exit.

```js
import { execFileSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

/** The shared knockout LUT.
 *  Identity below 168 so the drop shadow survives (measured floor: 175),
 *  then ramp 168..204 up to pure white. Ceiling is 204 because the darkest
 *  Applies to the 8 product stills AND the expand.mp4 frames — both sit on
 *  the same ~215 grey studio backdrop. */
const RAMP = "if(lt(val,168),val,if(gt(val,204),255,168+(val-168)*2.4167))";
export const KNOCKOUT_LUT = `lutrgb=r='${RAMP}':g='${RAMP}':b='${RAMP}'`;

export function run(args, label) {
  try {
    execFileSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', ...args], {
      stdio: ['ignore', 'ignore', 'pipe'],
      maxBuffer: 1 << 26,
    });
  } catch (err) {
    const stderr = err.stderr?.toString() ?? '';
    throw new Error(`ffmpeg failed (${label})\n${stderr}`);
  }
}
```

- [x] **Step 2: Commit**

```bash
git add "scripts/media/ffmpeg.mjs"
git commit -m "feat(aurora): add shared ffmpeg runner and knockout LUT"
```

---

## Task 4: Knock out and crop the eight product stills

Crop numbers are measured, not guessed: the garment sits at `x 1048–1696,
y 184–1384` in every one of the eight files.

**Files:**
- Create: `scripts/media/knockout.mjs`

- [x] **Step 1: Write the module**

```js
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
// 2752x1536. These crops centre that box with ~16% breathing room.
const CROPS = [
  { name: '4x5', crop: 'crop=1114:1392:815:88', scale: 'scale=880:1100' },
  { name: '1x1', crop: 'crop=1392:1392:676:88', scale: 'scale=1100:1100' },
];

export function buildProducts(srcDir, outDir) {
  mkdirSync(outDir, { recursive: true });
  for (const [file, slug] of PRODUCT_SOURCES) {
    for (const { name, crop, scale } of CROPS) {
      const out = `${outDir}/${slug}-${name}.webp`;
      run(
        ['-i', `${srcDir}/${file}`,
         '-vf', `${KNOCKOUT_LUT},${crop},${scale}`,
         '-c:v', 'libwebp', '-quality', '86', '-compression_level', '6',
         '-frames:v', '1', out, '-y'],
        `knockout ${slug} ${name}`,
      );
    }
    console.log(`  knockout  ${slug}`);
  }
}
```

- [x] **Step 2: Commit**

```bash
git add "scripts/media/knockout.mjs"
git commit -m "feat(aurora): add product knockout and crop pipeline"
```

---

## Task 5: Extract the 192 sequence frames

**Files:**
- Create: `scripts/media/frames.mjs`

- [x] **Step 1: Write the module**

```js
import { mkdirSync } from 'node:fs';
import { run, KNOCKOUT_LUT } from './ffmpeg.mjs';

export const FRAME_COUNT = 192;
export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 712;

/** expand.mp4 carries a per-frame black letterbox: 3px top and bottom on some
 *  frames, none on 135 of the 192. Worst case measured across every frame is 3
 *  rows. Cropping a uniform 4px off top and bottom is clean on all of them and
 *  costs 1.1% of height.
 *
 *  The frames then take the same knockout LUT as the stills, because the video
 *  backdrop measures ~216 grey — identical to the product shots. That is what
 *  lets the sequence sit on the paper ground with no visible plate. */
export function buildFrames(srcFile, outDir) {
  mkdirSync(outDir, { recursive: true });
  run(
    ['-i', srcFile,
     '-vf', `crop=${FRAME_WIDTH}:${FRAME_HEIGHT}:0:4,${KNOCKOUT_LUT}`,
     '-vsync', '0',
     '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6',
     `${outDir}/frame-%03d.webp`, '-y'],
    'frame extraction',
  );
  console.log(`  frames    ${FRAME_COUNT} @ ${FRAME_WIDTH}x${FRAME_HEIGHT}`);
}
```

- [x] **Step 2: Commit**

```bash
git add "scripts/media/frames.mjs"
git commit -m "feat(aurora): add frame extraction with per-frame letterbox crop"
```

---

## Task 6: Resize the hero and model photographs

These are **not** knocked out. They are photographs of people; the LUT would
blow out skin tones.

**Files:**
- Create: `scripts/media/photos.mjs`

- [x] **Step 1: Write the module**

```js
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
 *  crush skin tones. Emits two widths plus a 24px blurred LQIP placeholder. */
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
```

- [x] **Step 2: Commit**

```bash
git add "scripts/media/photos.mjs"
git commit -m "feat(aurora): add photo resize and LQIP pipeline"
```

---

## Task 7: Wire and run the media pipeline

**Files:**
- Create: `scripts/prepare-media.mjs`

- [x] **Step 1: Write the orchestrator**

```js
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
```

- [x] **Step 2: Run it**

```bash
cd "not uploaded/aurora" && npm run prepare-media
```

Expected: 8 `knockout` lines, 5 `photo` lines, one `frames` line, then `done.`

- [x] **Step 3: Verify the output counts and total size**

```bash
cd "not uploaded/aurora" && \
  echo "products: $(ls public/images/products | wc -l) (expect 16)" && \
  echo "photos:   $(ls public/images/photo | wc -l) (expect 15)" && \
  echo "frames:   $(ls public/frames | wc -l) (expect 192)" && \
  du -sh public/frames public/images
```

Expected: 16 / 15 / 192, with `public/frames` around 2–3 MB.

- [x] **Step 4: Verify the knockout produced pure white**

Create `scripts/verify-knockout.mjs`:

```js
import { execFileSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

const px = (file, crop) => {
  const buf = execFileSync(ffmpegPath, [
    '-hide_banner', '-loglevel', 'error', '-i', file,
    '-vf', `${crop},scale=1:1`, '-frames:v', '1',
    '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-',
  ]);
  return [...buf].join(',');
};

const CORNER = 'crop=40:40:4:4';
const targets = [
  ['product ember', 'public/images/products/ember-4x5.webp'],
  ['product salt ', 'public/images/products/salt-4x5.webp'],
  ['frame 001    ', 'public/frames/frame-001.webp'],
  ['frame 192    ', 'public/frames/frame-192.webp'],
];

let ok = true;
for (const [label, file] of targets) {
  const rgb = px(file, CORNER);
  const pass = rgb === '255,255,255';
  if (!pass) ok = false;
  console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}  ${rgb}`);
}

if (!ok) {
  console.error('\nBackdrop is not pure white. The LUT did not apply, and every');
  console.error('product will render as a grey rectangle on the tinted grounds.');
  process.exit(1);
}
```

Run it:

```bash
cd "not uploaded/aurora" && node scripts/verify-knockout.mjs
```

Expected: four `PASS` lines, each reading `255,255,255`.

Note: `execFileSync` returns a Buffer, which has no `.join` — spreading it into
an array first is required.

- [x] **Step 5: Commit**

```bash
git add "scripts" "public"
git commit -m "feat(aurora): run media pipeline, commit web-ready derivatives"
```

---

## Task 8: Product data

**Files:**
- Create: `src/data/products.js`
- Create: `src/data/sizes.js`
- Test: `tests/products.test.js`

- [x] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { products } from '../src/data/products.js';
import { SIZES } from '../src/data/sizes.js';

const HEX = /^#[0-9a-f]{6}$/;

describe('product data', () => {
  it('has exactly eight colourways', () => {
    expect(products).toHaveLength(8);
  });

  it('has unique slugs', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(8);
  });

  it('has valid lowercase hex for every colour field', () => {
    for (const p of products) {
      expect(p.hex, p.slug).toMatch(HEX);
      expect(p.hexLight, p.slug).toMatch(HEX);
      expect(p.groundSoft, p.slug).toMatch(HEX);
    }
  });

  it('prices every colourway identically in CAD cents', () => {
    for (const p of products) {
      expect(p.priceCents).toBe(19800);
      expect(p.currency).toBe('CAD');
    }
  });

  it('marks every product as knocked out', () => {
    for (const p of products) expect(p.knockout, p.slug).toBe(true);
  });

  it('points at image files that exist', () => {
    for (const p of products) {
      for (const ratio of ['4x5', '1x1']) {
        const path = `public/images/products/${p.slug}-${ratio}.webp`;
        expect(existsSync(path), path).toBe(true);
      }
    }
  });

  it('offers four sizes', () => {
    expect(SIZES).toEqual(['XS', 'S', 'M', 'L']);
  });
});
```

- [x] **Step 2: Run it to verify it fails**

```bash
cd "not uploaded/aurora" && npx vitest run tests/products.test.js
```

Expected: FAIL — `Failed to resolve import "../src/data/products.js"`.

- [x] **Step 3: Write `src/data/sizes.js`**

```js
export const SIZES = ['XS', 'S', 'M', 'L'];
```

- [x] **Step 4: Write `src/data/products.js`**

`hex` is the mid-garment colour and `hexLight` the cup highlight, both sampled
from the client's files.

> **Superseded:** this task originally wrote `groundSoft` as a hand-authored
> literal per product. 7 of the 8 had drifted from the documented 12% ratio by
> up to 10 levels, and no test could see it. `groundSoft` is now derived via
> `groundSoftFor(hex)` with `GROUND_MIX` exported and asserted. The committed
> `src/data/products.js` is authoritative over the listing below.

```js
/** The eight colourways. One silhouette, eight dye lots.
 *  hex / hexLight are sampled from the client's product photography;
 *  groundSoft is hex mixed ~12% over --paper (#EFEDE7). */
export const products = [
  {
    slug: 'eclipse', name: 'Eclipse',
    hex: '#1b1819', hexLight: '#3f3a3a', groundSoft: '#dad7d2',
    note: 'The deepest black we can dye without losing the sheen.',
  },
  {
    slug: 'driftwood', name: 'Driftwood',
    hex: '#4f352a', hexLight: '#714f42', groundSoft: '#e3dcd3',
    note: 'Warm bark brown, the colour of sun-bleached wood.',
  },
  {
    slug: 'midnight', name: 'Midnight',
    hex: '#312d50', hexLight: '#4b4365', groundSoft: '#dedbd9',
    note: 'Indigo with a violet cast, like water just after sunset.',
  },
  {
    slug: 'kelp', name: 'Kelp',
    hex: '#2d3829', hexLight: '#44503f', groundSoft: '#dcdcd4',
    note: 'Deep sea-green that reads almost black in shade.',
  },
  {
    slug: 'horizon', name: 'Horizon',
    hex: '#6d90b0', hexLight: '#c0d4e4', groundSoft: '#e7e9e8',
    note: 'The blue where the sky meets the water.',
  },
  {
    slug: 'clay', name: 'Clay',
    hex: '#a14c4b', hexLight: '#b35b59', groundSoft: '#ebe3dd',
    note: 'Sun-warmed terracotta with a rose undertone.',
  },
  {
    slug: 'ember', name: 'Ember',
    hex: '#8c1b26', hexLight: '#9f3740', groundSoft: '#e8ded9',
    note: 'Deep wine red, the last light of the day.',
  },
  {
    slug: 'salt', name: 'Salt',
    hex: '#dcdbd8', hexLight: '#efefee', groundSoft: '#eeece7',
    note: 'Barely off-white, like sea salt dried on skin.',
  },
].map((p) => ({
  ...p,
  priceCents: 19800,
  currency: 'CAD',
  knockout: true,
  image: {
    card: `/images/products/${p.slug}-4x5.webp`,
    square: `/images/products/${p.slug}-1x1.webp`,
  },
}));

export const bySlug = (slug) => products.find((p) => p.slug === slug);
```

- [x] **Step 5: Run the test to verify it passes**

```bash
cd "not uploaded/aurora" && npx vitest run tests/products.test.js
```

Expected: PASS, 7 tests.

- [x] **Step 6: Commit**

```bash
git add "src/data" "tests/products.test.js"
git commit -m "feat(aurora): add product data for the eight colourways"
```

---

## Task 9: CAD money formatting

**Files:**
- Create: `src/lib/format.js`
- Test: `tests/format.test.js`

- [x] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { formatPrice } from '../src/lib/format.js';

describe('formatPrice', () => {
  it('formats cents as CAD with two decimals', () => {
    expect(formatPrice(19800)).toBe('$198.00');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('groups thousands', () => {
    expect(formatPrice(158400)).toBe('$1,584.00');
  });
});
```

- [x] **Step 2: Run it to verify it fails**

```bash
cd "not uploaded/aurora" && npx vitest run tests/format.test.js
```

Expected: FAIL — cannot resolve `../src/lib/format.js`.

- [x] **Step 3: Write the implementation**

`en-CA` renders CAD as a bare `$`, which is what a Canadian storefront shows.

```js
const cad = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
});

/** @param {number} cents */
export const formatPrice = (cents) => cad.format(cents / 100);
```

- [x] **Step 4: Run the test to verify it passes**

```bash
cd "not uploaded/aurora" && npx vitest run tests/format.test.js
```

Expected: PASS, 3 tests.

- [x] **Step 5: Commit**

```bash
git add "src/lib/format.js" "tests/format.test.js"
git commit -m "feat(aurora): add CAD price formatting"
```

---

## Task 10: Cart reducer

**Files:**
- Create: `src/cart/cartReducer.js`
- Test: `tests/cartReducer.test.js`

A line is identified by `slug` **and** `size` — Ember in S and Ember in M are
different lines.

- [x] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { cartReducer, emptyCart, cartTotalCents, cartCount } from '../src/cart/cartReducer.js';

const add = (slug, size, qty = 1) => ({
  type: 'add',
  line: { slug, size, qty, priceCents: 19800 },
});

describe('cartReducer', () => {
  it('starts empty', () => {
    expect(emptyCart.lines).toEqual([]);
  });

  it('adds a line', () => {
    const s = cartReducer(emptyCart, add('ember', 'S'));
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0]).toMatchObject({ slug: 'ember', size: 'S', qty: 1 });
  });

  it('increments quantity when slug and size both match', () => {
    let s = cartReducer(emptyCart, add('ember', 'S'));
    s = cartReducer(s, add('ember', 'S'));
    expect(s.lines).toHaveLength(1);
    expect(s.lines[0].qty).toBe(2);
  });

  it('keeps sizes of the same colourway as separate lines', () => {
    let s = cartReducer(emptyCart, add('ember', 'S'));
    s = cartReducer(s, add('ember', 'M'));
    expect(s.lines).toHaveLength(2);
  });

  it('sets an explicit quantity', () => {
    let s = cartReducer(emptyCart, add('kelp', 'L'));
    s = cartReducer(s, { type: 'setQty', slug: 'kelp', size: 'L', qty: 4 });
    expect(s.lines[0].qty).toBe(4);
  });

  it('removes a line when quantity is set to zero', () => {
    let s = cartReducer(emptyCart, add('kelp', 'L'));
    s = cartReducer(s, { type: 'setQty', slug: 'kelp', size: 'L', qty: 0 });
    expect(s.lines).toHaveLength(0);
  });

  it('removes a line explicitly', () => {
    let s = cartReducer(emptyCart, add('salt', 'XS'));
    s = cartReducer(s, { type: 'remove', slug: 'salt', size: 'XS' });
    expect(s.lines).toHaveLength(0);
  });

  it('clears every line', () => {
    let s = cartReducer(emptyCart, add('salt', 'XS'));
    s = cartReducer(s, add('clay', 'M'));
    s = cartReducer(s, { type: 'clear' });
    expect(s.lines).toEqual([]);
  });

  it('totals in cents', () => {
    let s = cartReducer(emptyCart, add('ember', 'S', 2));
    s = cartReducer(s, add('clay', 'M'));
    expect(cartTotalCents(s)).toBe(19800 * 3);
  });

  it('counts total units, not distinct lines', () => {
    let s = cartReducer(emptyCart, add('ember', 'S', 2));
    s = cartReducer(s, add('clay', 'M'));
    expect(cartCount(s)).toBe(3);
  });

  it('ignores an unknown action', () => {
    const s = cartReducer(emptyCart, { type: 'nope' });
    expect(s).toBe(emptyCart);
  });
});
```

- [x] **Step 2: Run it to verify it fails**

```bash
cd "not uploaded/aurora" && npx vitest run tests/cartReducer.test.js
```

Expected: FAIL — cannot resolve `../src/cart/cartReducer.js`.

- [x] **Step 3: Write the implementation**

```js
export const emptyCart = { lines: [] };

const sameLine = (a, slug, size) => a.slug === slug && a.size === size;

export function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { slug, size, qty = 1, priceCents } = action.line;
      const existing = state.lines.find((l) => sameLine(l, slug, size));
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            sameLine(l, slug, size) ? { ...l, qty: l.qty + qty } : l,
          ),
        };
      }
      return { lines: [...state.lines, { slug, size, qty, priceCents }] };
    }

    case 'setQty': {
      const { slug, size, qty } = action;
      if (qty <= 0) {
        return { lines: state.lines.filter((l) => !sameLine(l, slug, size)) };
      }
      return {
        lines: state.lines.map((l) => (sameLine(l, slug, size) ? { ...l, qty } : l)),
      };
    }

    case 'remove':
      return {
        lines: state.lines.filter((l) => !sameLine(l, action.slug, action.size)),
      };

    case 'clear':
      return emptyCart;

    default:
      return state;
  }
}

export const cartTotalCents = (state) =>
  state.lines.reduce((sum, l) => sum + l.priceCents * l.qty, 0);

export const cartCount = (state) =>
  state.lines.reduce((sum, l) => sum + l.qty, 0);
```

- [x] **Step 4: Run the test to verify it passes**

```bash
cd "not uploaded/aurora" && npx vitest run tests/cartReducer.test.js
```

Expected: PASS, 11 tests.

- [x] **Step 5: Commit**

```bash
git add "src/cart/cartReducer.js" "tests/cartReducer.test.js"
git commit -m "feat(aurora): add cart reducer with size-aware lines"
```

---

## Task 11: Design tokens

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/base.css`

- [x] **Step 1: Write `tokens.css`**

```css
/* AURORA design tokens.
   Neutrals sampled from the client's hero photograph; ink and paper taken from
   the brand's own Eclipse and Salt colourways. No invented accent — the eight
   colourways ARE the accent system. */

@property --ground      { syntax: '<color>'; inherits: true; initial-value: #EFEDE7; }
@property --ground-soft { syntax: '<color>'; inherits: true; initial-value: #EFEDE7; }

:root {
  /* neutrals */
  --paper: #EFEDE7;
  --paper-warm: #E7E2D9;
  --sand: #A79685;
  --sand-deep: #8A7B6E;
  --ink: #1B1819;
  --ink-soft: #4A443F;
  --line: rgba(27, 24, 25, 0.14);

  /* type */
  --font-text: 'Archivo Variable', system-ui, sans-serif;
  --font-display: 'Pinyon Script', cursive; /* HOMEPAGE ONLY — see spec 4.3 */

  --track-wordmark: 0.38em;
  --track-label: 0.18em;

  /* motion */
  --dur-fast: 240ms;
  --dur-base: 520ms;
  --dur-slow: 900ms;
  --dur-ground: 700ms;
  --ease-hop: cubic-bezier(0.9, 0, 0.1, 1);
  --ease-glide: cubic-bezier(0.8, 0, 0.2, 1);

  /* layout */
  --gutter: clamp(1.25rem, 4vw, 4rem);
  --measure: 62ch;
}

/* The colour-tween ground. A flat background-color would transition fine, but
   this is a soft radial wash and gradients do not interpolate without
   registered custom properties — hence the @property declarations above. */
.ground {
  background: radial-gradient(120% 80% at 50% 0%, var(--ground-soft), var(--paper) 70%);
  transition:
    --ground var(--dur-ground) var(--ease-glide),
    --ground-soft var(--dur-ground) var(--ease-glide);
}

@media (prefers-reduced-motion: reduce) {
  .ground { transition: none; }
}
```

- [x] **Step 2: Write `base.css`**

```css
@import '@fontsource-variable/archivo';
@import '@fontsource/pinyon-script';
@import './tokens.css';

*, *::before, *::after { box-sizing: border-box; }

html { -webkit-text-size-adjust: 100%; }

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font-family: var(--font-text);
  font-weight: 400;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, p, figure { margin: 0; }
img { display: block; max-width: 100%; }

/* The presentational height attribute beats a class rule's aspect-ratio, so
   plates render at full intrinsic height. :where() zeroes specificity so this
   still beats the attribute but loses to any component rule wanting a real
   height (e.g. parallax inners at height:100%). A plain img[width][height]
   selector is too strong and breaks those. */
:where(img[width][height]) { height: auto; }

a { color: inherit; text-decoration: none; }

button {
  font: inherit;
  color: inherit;
  background: none;
  border: none;
  cursor: pointer;
}

:focus-visible {
  outline: 2px solid var(--ink);
  outline-offset: 3px;
}

.u-label {
  font-size: 0.72rem;
  font-weight: 500;
  letter-spacing: var(--track-label);
  text-transform: uppercase;
}

.u-visually-hidden {
  position: absolute;
  width: 1px; height: 1px;
  margin: -1px; padding: 0;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
}
```

- [x] **Step 3: Commit**

```bash
git add "src/styles"
git commit -m "feat(aurora): add design tokens and base styles"
```

---

## Task 12: GSAP setup, media-query and reduced-motion hooks

**Files:**
- Create: `src/motion/gsap.js`
- Create: `src/lib/useMediaQuery.js`
- Create: `src/lib/useReducedMotion.js`

- [x] **Step 1: Write `src/motion/gsap.js`**

Registered once, imported everywhere. GSAP 3.13+ ships SplitText and
InertiaPlugin in the free package — no Club licence needed.

```js
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import { SplitText } from 'gsap/SplitText';
import { InertiaPlugin } from 'gsap/InertiaPlugin';

gsap.registerPlugin(ScrollTrigger, CustomEase, SplitText, InertiaPlugin);

// Brand motion signature. "hop" is decisive — wipes and transitions.
// "glide" is long — grounds, parallax, anything scrubbed.
CustomEase.create('hop', '0.9, 0, 0.1, 1');
CustomEase.create('glide', '0.8, 0, 0.2, 1');

export { gsap, ScrollTrigger, SplitText, InertiaPlugin };
```

- [x] **Step 2: Write `src/lib/useMediaQuery.js`**

Returns `false` during SSR/first paint so animation-gated components never
mount heavy work before the query is known.

```js
import { useEffect, useState } from 'react';

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
export const useIsFinePointer = () => useMediaQuery('(pointer: fine)');
```

- [x] **Step 3: Write `src/lib/useReducedMotion.js`**

```js
import { useMediaQuery } from './useMediaQuery.js';

export const useReducedMotion = () =>
  useMediaQuery('(prefers-reduced-motion: reduce)');
```

- [x] **Step 4: Commit**

```bash
git add "src/motion" "src/lib"
git commit -m "feat(aurora): add GSAP setup and responsive hooks"
```

---

## Task 13: Smooth scroll

**Files:**
- Create: `src/smooth/lenisContext.js`
- Create: `src/smooth/SmoothScroll.jsx`

- [x] **Step 1: Write `lenisContext.js`**

Exposed through context rather than `window`, so tests and unmounted trees do
not see a stale instance.

```js
import { createContext, useContext } from 'react';

export const LenisContext = createContext(null);
export const useLenis = () => useContext(LenisContext);
```

- [x] **Step 2: Write `SmoothScroll.jsx`**

```jsx
import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { LenisContext } from './lenisContext.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Canonical Lenis <-> ScrollTrigger wiring: drive ScrollTrigger from Lenis,
    // drive Lenis from the GSAP ticker, and disable lag smoothing so a dropped
    // frame does not desync the two.
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
```

- [x] **Step 3: Commit**

```bash
git add "src/smooth"
git commit -m "feat(aurora): add Lenis smooth scroll wired to ScrollTrigger"
```

---

## Task 14: Ground provider

**Files:**
- Create: `src/ground/GroundProvider.jsx`

Mounted **above** the router outlet so the colour tween survives navigation:
the route component remounts, the ground element does not.

- [x] **Step 1: Write the provider**

```jsx
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

const GroundContext = createContext(null);

export const useGround = () => {
  const ctx = useContext(GroundContext);
  if (!ctx) throw new Error('useGround must be used inside <GroundProvider>');
  return ctx;
};

const PAPER = '#EFEDE7';

export default function GroundProvider({ children }) {
  const ref = useRef(null);
  const [active, setActive] = useState(null);

  /** @param {{hex:string, groundSoft:string, slug:string}|null} product */
  const setGround = useCallback((product) => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--ground', product ? product.hex : PAPER);
    el.style.setProperty('--ground-soft', product ? product.groundSoft : PAPER);
    setActive(product ? product.slug : null);
  }, []);

  const resetGround = useCallback(() => setGround(null), [setGround]);

  const value = useMemo(
    () => ({ setGround, resetGround, active }),
    [setGround, resetGround, active],
  );

  return (
    <GroundContext.Provider value={value}>
      <div className="ground" ref={ref}>{children}</div>
    </GroundContext.Provider>
  );
}
```

- [x] **Step 2: Commit**

```bash
git add "src/ground"
git commit -m "feat(aurora): add colour-tween ground provider"
```

---

## Task 15: Cart provider and drawer

**Files:**
- Create: `src/cart/CartProvider.jsx`
- Create: `src/cart/CartDrawer.jsx`
- Create: `src/cart/CartDrawer.css`

- [x] **Step 1: Write `CartProvider.jsx`**

```jsx
import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { cartReducer, emptyCart, cartCount, cartTotalCents } from './cartReducer.js';

const CartContext = createContext(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
  return ctx;
};

const KEY = 'aurora.cart.v1';

const load = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyCart;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed?.lines) ? parsed : emptyCart;
  } catch {
    return emptyCart;
  }
};

export default function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* private mode or quota — the cart just does not persist */
    }
  }, [state]);

  const value = useMemo(
    () => ({
      cart: state,
      dispatch,
      open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      count: cartCount(state),
      totalCents: cartTotalCents(state),
    }),
    [state, open],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

- [x] **Step 2: Write `CartDrawer.css`**

```css
.drawer-scrim {
  position: fixed;
  inset: 0;
  background: rgba(27, 24, 25, 0.4);
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur-base) var(--ease-glide);
  z-index: 80;
}
.drawer-scrim[data-open='true'] { opacity: 1; pointer-events: auto; }

.drawer {
  position: fixed;
  top: 0; right: 0; bottom: 0;
  width: min(28rem, 100vw);
  background: var(--paper);
  border-left: 1px solid var(--line);
  transform: translateX(100%);
  transition: transform var(--dur-base) var(--ease-hop);
  z-index: 81;
  display: flex;
  flex-direction: column;
  padding: var(--gutter);
  gap: 1.5rem;
}
.drawer[data-open='true'] { transform: translateX(0); }

.drawer__head { display: flex; align-items: center; justify-content: space-between; }
.drawer__lines { flex: 1; overflow-y: auto; display: grid; gap: 1rem; align-content: start; }
.drawer__line { display: grid; grid-template-columns: 4.5rem 1fr auto; gap: 1rem; align-items: center; }
.drawer__line img { width: 100%; border-radius: 0; }
.drawer__foot { border-top: 1px solid var(--line); padding-top: 1rem; display: grid; gap: 1rem; }
.drawer__total { display: flex; justify-content: space-between; }

@media (prefers-reduced-motion: reduce) {
  .drawer, .drawer-scrim { transition: none; }
}
```

- [x] **Step 3: Write `CartDrawer.jsx`**

Focus is trapped while open and restored to the trigger on close.

```jsx
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from './CartProvider.jsx';
import { bySlug } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import './CartDrawer.css';

export default function CartDrawer() {
  const { cart, dispatch, open, closeCart, totalCents, count } = useCart();
  const panelRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    restoreRef.current = document.activeElement;
    panelRef.current?.querySelector('button, a')?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') { closeCart(); return; }
      if (e.key !== 'Tab') return;
      const focusables = panelRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      restoreRef.current?.focus?.();
    };
  }, [open, closeCart]);

  return (
    <>
      <div className="drawer-scrim" data-open={open} onClick={closeCart} aria-hidden="true" />
      <aside
        className="drawer"
        data-open={open}
        ref={panelRef}
        aria-label="Shopping bag"
        inert={!open}
      >
        <header className="drawer__head">
          <span className="u-label">Bag ({count})</span>
          <button onClick={closeCart} aria-label="Close bag">Close</button>
        </header>

        <div className="drawer__lines">
          {cart.lines.length === 0 && <p>Your bag is empty.</p>}
          {cart.lines.map((line) => {
            const product = bySlug(line.slug);
            return (
              <div className="drawer__line" key={`${line.slug}-${line.size}`}>
                <img src={product.image.card} alt="" width="880" height="1100" />
                <div>
                  <p>{product.name}</p>
                  <p className="u-label">Size {line.size}</p>
                  <button onClick={() => dispatch({ type: 'remove', slug: line.slug, size: line.size })}>
                    Remove
                  </button>
                </div>
                <span>{formatPrice(line.priceCents * line.qty)}</span>
              </div>
            );
          })}
        </div>

        <div className="drawer__foot">
          <div className="drawer__total">
            <span className="u-label">Subtotal</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
          <Link to="/checkout" onClick={closeCart}>Checkout</Link>
        </div>
      </aside>
    </>
  );
}
```

- [x] **Step 4: Commit**

```bash
git add "src/cart"
git commit -m "feat(aurora): add cart provider and slide-in drawer"
```

---

## Task 16: Nav, footer and page transition

**Files:**
- Create: `src/components/Nav.jsx`
- Create: `src/components/Nav.css`
- Create: `src/components/Footer.jsx`
- Create: `src/components/PageTransition.jsx`
- Create: `src/components/PageTransition.css`

- [x] **Step 1: Write `Nav.css`**

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem var(--gutter);
  z-index: 60;
  mix-blend-mode: normal;
  transition: padding var(--dur-base) var(--ease-glide);
}
.nav[data-shrunk='true'] { padding-block: 0.7rem; background: var(--paper); border-bottom: 1px solid var(--line); }

.nav__mark {
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: var(--track-wordmark);
  text-transform: uppercase;
}
.nav__links { display: flex; gap: 1.5rem; }
@media (max-width: 640px) { .nav__links { gap: 0.9rem; } }
```

- [x] **Step 2: Write `Nav.jsx`**

The wordmark is Archivo, never Pinyon — Pinyon is homepage-body only.

```jsx
import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../cart/CartProvider.jsx';
import './Nav.css';

const LINKS = [
  ['/shop', 'Shop'],
  ['/craft', 'The Craft'],
  ['/journal', 'Journal'],
  ['/fit', 'Fit'],
  ['/contact', 'Contact'],
];

export default function Nav() {
  const { count, openCart } = useCart();
  const [shrunk, setShrunk] = useState(false);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav" data-shrunk={shrunk}>
      <Link to="/" className="nav__mark">Aurora</Link>
      <div className="nav__links u-label">
        {LINKS.map(([to, label]) => (
          <NavLink key={to} to={to}>{label}</NavLink>
        ))}
        <button onClick={openCart} className="u-label">Bag ({count})</button>
      </div>
    </nav>
  );
}
```

- [x] **Step 3: Write `Footer.jsx`**

Every factual claim here is listed in `CONTENT.md` for client sign-off.

```jsx
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--sand)', color: 'var(--paper)', padding: 'calc(var(--gutter) * 2) var(--gutter)' }}>
      <p style={{ letterSpacing: 'var(--track-wordmark)', textTransform: 'uppercase' }}>Aurora</p>
      <nav style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginTop: '1.5rem' }} className="u-label">
        <Link to="/shop">Shop</Link>
        <Link to="/craft">The Craft</Link>
        <Link to="/journal">Journal</Link>
        <Link to="/fit">Fit</Link>
        <Link to="/contact">Contact</Link>
      </nav>
    </footer>
  );
}
```

- [x] **Step 4: Write `PageTransition.css`**

Fade and scale only. A slide would put a `transform` on an ancestor of every
blended product image, which isolates the blend and brings the grey backdrop
box back.

```css
.page-transition {
  animation: page-in var(--dur-base) var(--ease-glide) both;
}

@keyframes page-in {
  from { opacity: 0; transform: scale(0.994); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .page-transition { animation: none; }
}
```

- [x] **Step 5: Write `PageTransition.jsx`**

Also moves focus to the page heading on navigation and announces the route.

```jsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

export default function PageTransition({ children }) {
  const { pathname } = useLocation();
  const ref = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const heading = ref.current?.querySelector('h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({ preventScroll: true });
    }
  }, [pathname]);

  return (
    <div className="page-transition" key={pathname} ref={ref}>
      {children}
    </div>
  );
}
```

- [x] **Step 6: Commit**

```bash
git add "src/components"
git commit -m "feat(aurora): add nav, footer and fade page transition"
```

---

## Task 17: Router shell and eight stub routes

**Files:**
- Create: `src/routes/Home.jsx`
- Create: `src/routes/Shop.jsx`
- Create: `src/routes/Product.jsx`
- Create: `src/routes/Craft.jsx`
- Create: `src/routes/Journal.jsx`
- Create: `src/routes/Fit.jsx`
- Create: `src/routes/Contact.jsx`
- Create: `src/routes/Checkout.jsx`
- Modify: `src/App.jsx`
- Modify: `src/main.jsx`

Stubs are replaced by Plans 2–4. They exist now so the shell, cart and ground
can be exercised end to end.

- [x] **Step 1: Create seven simple stubs**

Create each of `Home.jsx`, `Craft.jsx`, `Journal.jsx`, `Fit.jsx`,
`Contact.jsx`, `Checkout.jsx` with this shape, substituting the component name
and heading:

```jsx
export default function Home() {
  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>Home</h1>
    </main>
  );
}
```

Headings: `Home`, `The Craft`, `Journal`, `Size & Fit`, `Contact`, `Checkout`.

- [x] **Step 2: Create `Shop.jsx`**

Proves the data layer and the ground tween are wired.

```jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';

export default function Shop() {
  const { setGround, resetGround } = useGround();

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>Eight shades. One silhouette.</h1>
      <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 'var(--gutter)', gridTemplateColumns: 'repeat(auto-fit, minmax(14rem, 1fr))' }}>
        {products.map((p) => (
          <li
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              <img src={p.image.card} alt={`Aurora bikini in ${p.name}`} width="880" height="1100" />
              <p>{p.name}</p>
              <p className="u-label">{formatPrice(p.priceCents)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [x] **Step 3: Create `Product.jsx`**

```jsx
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bySlug } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';

export default function Product() {
  const { slug } = useParams();
  const product = bySlug(slug);
  const { setGround, resetGround } = useGround();

  useEffect(() => {
    if (product) setGround(product);
    return resetGround;
  }, [product, setGround, resetGround]);

  if (!product) {
    return (
      <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
        <h1>Not found</h1>
        <Link to="/shop">Back to the shop</Link>
      </main>
    );
  }

  return (
    <main style={{ padding: 'calc(var(--gutter) * 4) var(--gutter)' }}>
      <h1>{product.name}</h1>
      <p>{product.note}</p>
      <p>{formatPrice(product.priceCents)}</p>
      <img src={product.image.card} alt={`Aurora bikini in ${product.name}`} width="880" height="1100" />
    </main>
  );
}
```

- [x] **Step 4: Replace `src/App.jsx`**

Provider order matters: `GroundProvider` wraps the routes so the ground element
survives navigation.

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SmoothScroll from './smooth/SmoothScroll.jsx';
import GroundProvider from './ground/GroundProvider.jsx';
import CartProvider from './cart/CartProvider.jsx';
import CartDrawer from './cart/CartDrawer.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';
import PageTransition from './components/PageTransition.jsx';

import Home from './routes/Home.jsx';
import Shop from './routes/Shop.jsx';
import Product from './routes/Product.jsx';
import Craft from './routes/Craft.jsx';
import Journal from './routes/Journal.jsx';
import Fit from './routes/Fit.jsx';
import Contact from './routes/Contact.jsx';
import Checkout from './routes/Checkout.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <SmoothScroll>
          <GroundProvider>
            <Nav />
            <CartDrawer />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/shop/:slug" element={<Product />} />
                <Route path="/craft" element={<Craft />} />
                <Route path="/journal" element={<Journal />} />
                <Route path="/fit" element={<Fit />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/checkout" element={<Checkout />} />
              </Routes>
            </PageTransition>
            <Footer />
          </GroundProvider>
        </SmoothScroll>
      </CartProvider>
    </BrowserRouter>
  );
}
```

- [x] **Step 5: Update `src/main.jsx` to import the stylesheet**

```jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/base.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

- [x] **Step 6: Build and verify**

```bash
cd "not uploaded/aurora" && npm run build
```

Expected: `✓ built in …`, no unresolved imports.

- [x] **Step 7: Commit**

```bash
git add "src"
git commit -m "feat(aurora): add router shell and eight stub routes"
```

---

## Task 18: The font rule test

The two-font constraint is the client's hardest requirement, so it gets a test
rather than a code comment.

**Files:**
- Test: `tests/fontRule.test.js`

- [x] **Step 1: Write the test**

`Home` renders out of `src/sections/`, so a directory-level rule would let
Pinyon leak into shared sections. The allowlist is by filename.

```js
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['src/routes', 'src/sections', 'src/components', 'src/styles'];

/** Pinyon Script is homepage-only. Exactly these files may reference the
 *  display-font token — plus tokens.css, which declares it. */
const ALLOWED = new Set([
  'src/styles/tokens.css',
  'src/sections/Hero.jsx',
  'src/sections/Editorial.jsx',
  'src/sections/Closing.jsx',
]);

const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
};

describe('two-font rule', () => {
  it('references --font-display only in the allowlisted files', () => {
    const offenders = DIRS.flatMap(walk)
      .filter((file) => readFileSync(file, 'utf8').includes('--font-display'))
      .map((file) => file.split('\\').join('/'))
      .filter((file) => !ALLOWED.has(file));

    expect(offenders).toEqual([]);
  });

  it('never loads a third font family', () => {
    const families = readFileSync('src/styles/tokens.css', 'utf8')
      .match(/--font-[a-z]+:/g) ?? [];
    expect(families.sort()).toEqual(['--font-display:', '--font-text:']);
  });
});
```

- [x] **Step 2: Run the whole suite**

```bash
cd "not uploaded/aurora" && npm test
```

Expected: PASS — 4 files, 23 tests. `src/sections/` does not exist yet, which
the `existsSync` guard handles.

- [x] **Step 3: Commit**

```bash
git add "tests/fontRule.test.js"
git commit -m "test(aurora): enforce the two-font rule"
```

---

## Task 19: Client sign-off checklist

**Files:**
- Create: `CONTENT.md`

- [x] **Step 1: Write the checklist**

```markdown
# AURORA — content sign-off

Every line below is a factual claim rendered on the live site. None has been
confirmed by the client. Tick each one before launch, or replace the value.

Copy written for this build is plausible for a premium handmade swim label but
is **placeholder until signed off**.

## Commerce
- [ ] Price — **CAD $198.00**, identical across all eight colourways.
      Chosen from Canadian handmade-premium comparables (Left On Friday ≈ $230
      a set; Jade Swim and Matteau ≈ $245 converted). Change in
      `src/data/products.js`.
- [ ] Currency is CAD and the store ships from Canada
- [ ] Shipping rates, destinations and free-shipping threshold
- [ ] Returns window and conditions

## Product
- [ ] Colourway names — Eclipse, Driftwood, Midnight, Kelp, Horizon, Clay,
      Ember, Salt. These describe the fabric as photographed; the file named
      `pink.jpeg` is a dusty clay-rose and `red.jpeg` is a wine-crimson.
- [ ] Fabric composition, weight and mill or country of origin
- [ ] Lining and construction details
- [ ] Size range and the full measurement table
- [ ] Care instructions

## Brand
- [ ] Studio city and country
- [ ] Made-to-order lead time
- [ ] Whether custom commissions are actually offered
- [ ] Email address
- [ ] Social handles
- [ ] Registered business name for the footer

## Legal
- [ ] Photography usage rights
- [ ] Model releases for all four editorial images
```

- [x] **Step 2: Commit**

```bash
git add "CONTENT.md"
git commit -m "docs(aurora): add client content sign-off checklist"
```

---

## Task 20: Verify the foundation end to end

- [x] **Step 1: Run the full suite**

```bash
cd "not uploaded/aurora" && npm test
```

Expected: 4 files, 23 tests, all passing.

- [x] **Step 2: Build**

```bash
cd "not uploaded/aurora" && npm run build
```

Expected: `✓ built in …` with no warnings about unresolved imports.

- [x] **Step 3: Start the dev server and check every route**

```bash
cd "not uploaded/aurora" && npm run dev
```

Visit each of `/`, `/shop`, `/shop/ember`, `/craft`, `/journal`, `/fit`,
`/contact`, `/checkout`. Confirm by observation:

- Every route renders its heading with no console errors
- `/shop` shows eight products at `$198.00` each
- Hovering a shop card tweens the page ground to that colourway over ~700 ms
- Opening `/shop/ember` sets the ground and it persists through navigation
- Adding to the bag from the drawer persists across a page reload
- The bag drawer opens, traps Tab, and closes on Escape
- Product images show **no grey rectangle** — the backdrop is invisible

- [x] **Step 4: Commit any fixes, then stop**

```bash
git add -A "not uploaded/aurora"
git commit -m "fix(aurora): foundation verification fixes"
```

Plan 2 (Homepage) begins after this plan is verified.

---

## Notes for the implementer

- **Never blend an unprocessed photograph.** Only the eight product stills and
  the 192 frames went through the knockout LUT. `multiply` on a model shot
  blows out skin tones.
- **No slide transitions anywhere.** A transform on an ancestor of a blended
  image isolates the blend and the grey backdrop box returns.
- **Square off knockout plates.** JPEG noise leaves image corners a shade under
  255, and a border-radius clips that darkening into visible arcs.
- **All twelve photographs are landscape.** No portrait crop exists. Do not
  build a layout that needs a vertical shot.
