# AURORA — Plan 2: Homepage

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the AURORA homepage — preloader, hero, the pinned 192-frame Anatomy scrub, the eight-colourway rail, an editorial band, a craft teaser, a journal strip and a closing CTA — plus the shared motion primitives the rest of the site will reuse.

**Architecture:** Section components under `src/sections/`, composed by `src/routes/Home.jsx`. Reusable motion lives in `src/motion/` and is imported by later plans. Every animated component uses `useGSAP` scoped to a ref so it self-cleans on route change.

**Tech Stack:** React 19, GSAP 3.15 (ScrollTrigger, SplitText, CustomEase, InertiaPlugin), Lenis, design-token CSS.

**Spec:** `docs/design-spec.md` §6.1, §7
**Prerequisite:** Plan 1 complete (`docs/plan-01-foundation.md`)

---

## What already exists

Do not rebuild any of this.

| Thing | Where | Exports |
|---|---|---|
| GSAP + eases `hop`/`glide` | `src/motion/gsap.js` | `gsap, ScrollTrigger, SplitText, InertiaPlugin` |
| Colour-tween ground | `src/ground/GroundProvider.jsx` | default, `useGround` → `{setGround, resetGround, active}` |
| Smooth scroll | `src/smooth/SmoothScroll.jsx`, `lenisContext.js` | default, `useLenis` |
| Cart | `src/cart/CartProvider.jsx` | default, `useCart` |
| Product data | `src/data/products.js` | `products`, `bySlug`, `groundSoftFor`, `GROUND_MIX` |
| Money | `src/lib/format.js` | `formatPrice` |
| Responsive | `src/lib/useMediaQuery.js` | `useMediaQuery`, `useIsDesktop`, `useIsFinePointer` |
| Reduced motion | `src/lib/useReducedMotion.js` | `useReducedMotion` |
| Tokens | `src/styles/tokens.css` | `--paper --paper-warm --sand --sand-deep --ink --ink-soft --line`, `--font-text --font-display`, `--dur-* --ease-hop --ease-glide`, `--gutter --measure` |

**Media, all committed:**
- `public/images/products/{slug}-4x5.webp` (880×1100) and `{slug}-1x1.webp` (1100×1100), knocked out to pure white
- `public/images/photo/{hero,model1..model4}-{1600,2400}.webp` (2400×1340) plus `-lqip.webp`
- `public/frames/frame-001.webp` … `frame-192.webp` (1280×712), knocked out to pure white

**Slugs, in shop order:** `eclipse driftwood midnight kelp horizon clay ember salt`

---

## Two rules that break the page if ignored

**1. Pinyon Script appears exactly three times, all on this page.**
`--font-display` may be referenced only in `sections/Hero.jsx`, `sections/Editorial.jsx` and `sections/Closing.jsx`. `tests/fontRule.test.js` already enforces this by filename and will fail the build if you use it anywhere else — including in a shared motion primitive.

**2. The Anatomy section sits on a WHITE band, and is not blended.**
The spec originally called for `mix-blend-mode: multiply` on the canvas over the paper ground. That is wrong here: ScrollTrigger's pinning applies a transform to the pin wrapper, which creates a stacking context, which isolates the blend — the knockout's white backdrop would reappear as a hard box, intermittently, only when pinned. Instead:

- The section background is `#FFFFFF`.
- The canvas letterbox is filled `#FFFFFF`.
- The frames' own backdrop is already exactly `255,255,255` (verified by `scripts/verify-knockout.mjs`).

All three match, so there is nothing to blend and nothing to isolate. A white studio band between paper sections is also the correct editorial read for a section called Anatomy.

---

## File structure

```
src/motion/
  useGsapScope.js      thin wrapper over useGSAP + reduced-motion bail
  SplitReveal.jsx      line/char reveal via GSAP SplitText
  Parallax.jsx         multi-speed scroll translate
  CountUp.jsx          number ramp on enter
  MarqueeRail.jsx      vertical edge ticker, desktop only
  Cursor.jsx           gsap.quickTo follower, fine pointers only
  Preloader.jsx        first-load wipe
  frames.js            frame URL list + preload scheduler
src/sections/
  Hero.jsx / .css
  Anatomy.jsx / .css
  TheEight.jsx / .css
  Editorial.jsx / .css
  CraftTeaser.jsx / .css
  JournalStrip.jsx / .css
  Closing.jsx / .css
src/routes/Home.jsx    composes the above
src/data/content.js    homepage copy in one place, mirrored into CONTENT.md
tests/
  frames.test.js       frame list integrity
  countUp.test.js      easing + formatting
```

---

## Task 1: Homepage copy in one place

Copy must not be scattered through JSX — every claim here is unverified and has to be reviewable against `CONTENT.md`.

**Files:** Create `src/data/content.js`, Test: `tests/content.test.js`

- [x] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { home } from '../src/data/content.js';

describe('homepage copy', () => {
  it('has a hero with the script word isolated', () => {
    expect(home.hero.kicker).toBe('Aurora');
    expect(home.hero.line1).toBe('The Sun Kissed');
    expect(home.hero.script).toBe('Collection');
  });

  it('has exactly three anatomy claims', () => {
    expect(home.anatomy.claims).toHaveLength(3);
    for (const c of home.anatomy.claims) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.body.length).toBeGreaterThan(0);
    }
  });

  it('has three craft stats with numeric values', () => {
    expect(home.craft.stats).toHaveLength(3);
    for (const s of home.craft.stats) expect(typeof s.value).toBe('number');
  });

  it('flags every factual claim for client sign-off', () => {
    // Anything asserting a fact about the business carries needsSignoff so it
    // can be reconciled with CONTENT.md before launch.
    expect(home.claims.every((c) => typeof c.needsSignoff === 'boolean')).toBe(true);
    expect(home.claims.some((c) => c.needsSignoff)).toBe(true);
  });
});
```

- [x] **Step 2: Run it, confirm it fails**

Run: `cd "not uploaded/aurora" && npx vitest run tests/content.test.js`
Expected: FAIL — cannot resolve `../src/data/content.js`.

- [x] **Step 3: Write `src/data/content.js`**

```js
/** Homepage copy, in one place so every factual claim is reviewable against
 *  CONTENT.md. NOTHING here has been confirmed by the client — see `claims`. */
export const home = {
  hero: {
    kicker: 'Aurora',
    line1: 'The Sun Kissed',
    script: 'Collection',          // the ONLY Pinyon on the hero
    standfirst: 'One silhouette. Eight shades. Cut and sewn by hand.',
    cta: 'View the eight',
  },

  anatomy: {
    label: 'The anatomy',
    claims: [
      { title: 'Seventeen pieces.', body: 'Every set is cut from seventeen separate pattern pieces, by hand, one at a time.' },
      { title: 'One pair of hands.', body: 'A single maker sees each set from first cut to final stitch. No production line.' },
      { title: 'Italian fabric.',    body: 'A dense, high-recovery knit that holds its shape wet, dry, and season after season.' },
    ],
  },

  eight: {
    label: 'The collection',
    title: 'Eight shades. One silhouette.',
    body: 'The same considered cut, dyed eight ways. Choose the one you will actually live in.',
  },

  editorial: {
    script: 'Made for the water',   // Pinyon #2
    body: 'Photographed on film at golden hour, unretouched.',
  },

  craft: {
    label: 'The craft',
    stats: [
      { value: 17, suffix: '', caption: 'pattern pieces per set' },
      { value: 6,  suffix: 'h', caption: 'average time to make one' },
      { value: 12, suffix: '', caption: 'sets in a batch' },
    ],
  },

  journal: { label: 'The journal', title: 'On the sand' },

  closing: {
    script: 'Yours for a very long time',  // Pinyon #3
    cta: 'Shop the collection',
  },

  /** Every assertion of fact on this page. Mirror into CONTENT.md. */
  claims: [
    { id: 'pieces',   text: '17 pattern pieces per set',       needsSignoff: true },
    { id: 'maker',    text: 'one maker per set, no line',      needsSignoff: true },
    { id: 'fabric',   text: 'Italian high-recovery knit',      needsSignoff: true },
    { id: 'hours',    text: '6h average make time',            needsSignoff: true },
    { id: 'batch',    text: '12 sets per batch',               needsSignoff: true },
    { id: 'film',     text: 'shot on film, unretouched',       needsSignoff: true },
  ],
};
```

- [x] **Step 4: Run the test, confirm it passes**

Expected: PASS, 4 tests. Suite total 29.

- [x] **Step 5: Commit**

```bash
cd "not uploaded/aurora"
git add src/data/content.js tests/content.test.js
git commit -m "feat(aurora): add homepage copy with sign-off flags"
```

---

## Task 2: Scoped GSAP hook

Every animated component uses this. It centralises the reduced-motion bail so no section has to remember it.

**Files:** Create `src/motion/useGsapScope.js`

- [x] **Step 1: Write it**

```js
import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../lib/useReducedMotion.js';

/** Runs `setup(scopeEl)` inside a GSAP context scoped to the returned ref, so
 *  every tween and ScrollTrigger it creates is reverted on unmount. Skips setup
 *  entirely under prefers-reduced-motion, which is why sections must render
 *  their finished visual state in markup and treat animation as enhancement. */
export function useGsapScope(setup, deps = []) {
  const scope = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !scope.current) return undefined;
    // Return the setup's own cleanup so useGSAP runs it on unmount. Without
    // this, things GSAP cannot revert by itself — a SplitText's injected line
    // wrappers, for instance — would leak on every route change.
    return setup(scope.current);
  }, { scope, dependencies: [...deps, reduced] });

  return scope;
}
```

- [x] **Step 2: Commit**

```bash
cd "not uploaded/aurora"
git add src/motion/useGsapScope.js
git commit -m "feat(aurora): add scoped GSAP hook with reduced-motion bail"
```

---

## Task 3: SplitReveal

**Files:** Create `src/motion/SplitReveal.jsx`, `src/motion/SplitReveal.css`

- [x] **Step 1: Write `SplitReveal.css`**

```css
.split-reveal { display: block; }

/* The finished state. Animation overrides this downward, so with JS disabled or
   reduced motion on, the text is simply visible. */
.split-reveal__line { display: block; }
```

- [x] **Step 2: Write `SplitReveal.jsx`**

```jsx
import { gsap, SplitText, ScrollTrigger } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';
import './SplitReveal.css';

/** Reveals its text by line, masked. Uses GSAP's own SplitText (free since
 *  3.13) with mask:"lines" so no wrapper divs are hand-rolled.
 *
 *  `as` lets a caller pick the heading level without this component guessing. */
export default function SplitReveal({
  as: Tag = 'p',
  children,
  className = '',
  delay = 0,
  stagger = 0.09,
  start = 'top 82%',
}) {
  const scope = useGsapScope((el) => {
    const target = el.querySelector('.split-reveal__text');
    if (!target) return;

    const split = new SplitText(target, { type: 'lines', mask: 'lines', linesClass: 'split-reveal__line' });
    gsap.set(split.lines, { yPercent: 115 });

    gsap.to(split.lines, {
      yPercent: 0,
      duration: 1,
      ease: 'glide',
      stagger,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => { split.revert(); ScrollTrigger.refresh(); };
  }, [children]);

  return (
    <Tag ref={scope} className={`split-reveal ${className}`}>
      <span className="split-reveal__text">{children}</span>
    </Tag>
  );
}
```

- [x] **Step 3: Verify it builds**

Run: `cd "not uploaded/aurora" && npm run build`
Expected: `✓ built in …`

- [x] **Step 4: Commit**

```bash
cd "not uploaded/aurora"
git add src/motion/SplitReveal.jsx src/motion/SplitReveal.css
git commit -m "feat(aurora): add masked line reveal via GSAP SplitText"
```

---

## Task 4: Parallax and CountUp

**Files:** Create `src/motion/Parallax.jsx`, `src/motion/CountUp.jsx`, Test: `tests/countUp.test.js`

- [x] **Step 1: Write `Parallax.jsx`**

```jsx
import { gsap } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';

/** Translates its child as the section scrolls past.
 *
 *  `speed` is the total travel in percent of the element's own height:
 *  negative drifts up (slower than scroll), positive drifts down.
 *
 *  Never wrap a knockout product image in this on a tinted ground — the
 *  transform would isolate its blend. Safe here on the homepage, where the
 *  Anatomy band is white and unblended. */
export default function Parallax({ children, speed = -12, className = '' }) {
  const scope = useGsapScope((el) => {
    const inner = el.firstElementChild;
    if (!inner) return;
    gsap.fromTo(
      inner,
      { yPercent: -speed / 2 },
      {
        yPercent: speed / 2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }, [speed]);

  return <div ref={scope} className={className} style={{ overflow: 'hidden' }}>{children}</div>;
}
```

- [x] **Step 2: Write the failing CountUp test**

```js
import { describe, it, expect } from 'vitest';
import { countUpValue } from '../src/motion/CountUp.jsx';

describe('countUpValue', () => {
  it('starts at zero', () => {
    expect(countUpValue(0, 17)).toBe(0);
  });

  it('lands exactly on the target', () => {
    expect(countUpValue(1, 17)).toBe(17);
  });

  it('eases out — past halfway at the midpoint', () => {
    expect(countUpValue(0.5, 100)).toBeGreaterThan(50);
  });

  it('returns integers throughout', () => {
    for (const p of [0.1, 0.33, 0.7, 0.99]) {
      expect(Number.isInteger(countUpValue(p, 17))).toBe(true);
    }
  });
});
```

- [x] **Step 3: Run it, confirm it fails**

Run: `cd "not uploaded/aurora" && npx vitest run tests/countUp.test.js`
Expected: FAIL — cannot resolve the import.

- [x] **Step 4: Write `CountUp.jsx`**

```jsx
import { useState } from 'react';
import { gsap } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';

/** Eased progress → displayed integer. Exported so it can be tested without
 *  a DOM or a running ticker. */
export function countUpValue(progress, target) {
  const eased = 1 - (1 - progress) ** 3; // cubic ease-out
  return Math.round(eased * target);
}

export default function CountUp({ value, suffix = '', className = '' }) {
  // null means "the ramp has not started". Rendering `shown ?? value` would
  // still show the final number and then visibly snap back to 0 the instant the
  // tween began, so the ramp only takes over from onStart onwards.
  const [shown, setShown] = useState(null);

  const scope = useGsapScope((el) => {
    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      duration: 1.6,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onStart: () => setShown(0),
      onUpdate: () => setShown(countUpValue(state.p, value)),
      onComplete: () => setShown(value),
    });
  }, [value]);

  return (
    <span ref={scope} className={className}>
      {/* Reduced motion and no-JS never start the tween, so the real number is
          the fallback — never a stuck zero. */}
      <span aria-hidden="true">{shown ?? value}{suffix}</span>
      <span className="u-visually-hidden">{value}{suffix}</span>
    </span>
  );
}
```

- [ ] **Step 5: Run the test, confirm it passes**

Expected: PASS, 4 tests. Suite total 33.

- [ ] **Step 6: Commit**

```bash
cd "not uploaded/aurora"
git add src/motion/Parallax.jsx src/motion/CountUp.jsx tests/countUp.test.js
git commit -m "feat(aurora): add parallax and count-up primitives"
```

---

## Task 5: Frame list and preload scheduler

**Files:** Create `src/motion/frames.js`, Test: `tests/frames.test.js`

- [x] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { FRAME_COUNT, FRAME_W, FRAME_H, frameUrl, frameUrls, EAGER_COUNT } from '../src/motion/frames.js';

describe('frame sequence', () => {
  it('is 192 frames at 1280x712', () => {
    expect(FRAME_COUNT).toBe(192);
    expect(FRAME_W).toBe(1280);
    expect(FRAME_H).toBe(712);
  });

  it('is 1-indexed and zero-padded to three digits', () => {
    expect(frameUrl(1)).toBe('/frames/frame-001.webp');
    expect(frameUrl(192)).toBe('/frames/frame-192.webp');
  });

  it('lists every frame once', () => {
    const urls = frameUrls();
    expect(urls).toHaveLength(192);
    expect(new Set(urls).size).toBe(192);
  });

  it('points at files that actually exist', () => {
    for (const u of frameUrls()) {
      expect(existsSync(`public${u}`), u).toBe(true);
    }
  });

  it('eagerly loads a first chunk smaller than the whole sequence', () => {
    expect(EAGER_COUNT).toBeGreaterThan(0);
    expect(EAGER_COUNT).toBeLessThan(FRAME_COUNT);
  });
});
```

- [x] **Step 2: Run it, confirm it fails**

Run: `cd "not uploaded/aurora" && npx vitest run tests/frames.test.js`
Expected: FAIL — cannot resolve `../src/motion/frames.js`.

- [x] **Step 3: Write `src/motion/frames.js`**

```js
export const FRAME_COUNT = 192;
export const FRAME_W = 1280;
export const FRAME_H = 712;

/** Frames are 1-indexed because ffmpeg's %03d pattern starts at 1. */
export const frameUrl = (n) => `/frames/frame-${String(n).padStart(3, '0')}.webp`;
export const frameUrls = () => Array.from({ length: FRAME_COUNT }, (_, i) => frameUrl(i + 1));

/** Decode this many before the section becomes interactive; the rest stream in
 *  behind. ~2.3-3.0 MB total, so a blocking wait on all 192 would stall the
 *  page on a slow connection for no benefit. */
export const EAGER_COUNT = 16;

/**
 * Loads every frame, resolving once the first `EAGER_COUNT` have decoded.
 * Returns { images, ready, cancel } — `images` fills in place as the rest land.
 */
export function loadFrames(onEager) {
  const images = new Array(FRAME_COUNT);
  let eagerLoaded = 0;
  let cancelled = false;

  const load = (i) =>
    new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => resolve(img);
      img.src = frameUrl(i + 1);
      images[i] = img;
    });

  (async () => {
    for (let i = 0; i < EAGER_COUNT && !cancelled; i++) {
      await load(i);
      eagerLoaded++;
      if (eagerLoaded === EAGER_COUNT) onEager?.(images);
    }
    for (let i = EAGER_COUNT; i < FRAME_COUNT && !cancelled; i++) await load(i);
  })();

  return { images, cancel: () => { cancelled = true; } };
}
```

- [x] **Step 4: Run the test, confirm it passes**

Expected: PASS, 5 tests. Suite total 38.

- [x] **Step 5: Commit**

```bash
cd "not uploaded/aurora"
git add src/motion/frames.js tests/frames.test.js
git commit -m "feat(aurora): add frame sequence list and preload scheduler"
```

---

## Task 6: The Anatomy section — pinned canvas scrub

The centrepiece. Read the two rules at the top of this plan again before starting.

**Files:** Create `src/sections/Anatomy.jsx`, `src/sections/Anatomy.css`

- [x] **Step 1: Write `Anatomy.css`**

```css
/* A white studio band. NOT the paper ground, and NOT blended — see the plan's
   rule 2. The frames' own backdrop is exactly 255,255,255, so matching the
   section to white makes the letterbox seamless with no blend mode, and
   therefore nothing for ScrollTrigger's pin transform to isolate. */
.anatomy {
  background: #fff;
  position: relative;
}

.anatomy__stage {
  height: 100svh;
  display: grid;
  grid-template-columns: 1fr;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.anatomy__canvas {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: contain;
}

.anatomy__copy {
  position: absolute;
  left: var(--gutter);
  bottom: clamp(2rem, 8vh, 6rem);
  width: min(26rem, calc(100% - var(--gutter) * 2));
}

.anatomy__claim {
  position: absolute;
  bottom: 0;
  left: 0;
  opacity: 0;
}

.anatomy__claim h3 {
  font-size: clamp(1.5rem, 3vw, 2.25rem);
  font-weight: 300;
  margin-bottom: 0.5rem;
}

.anatomy__claim p { color: var(--ink-soft); max-width: 32ch; }

.anatomy__label {
  position: absolute;
  top: clamp(1.5rem, 5vh, 3rem);
  left: var(--gutter);
  color: var(--ink-soft);
}

/* Fallback: three key frames, no canvas, no 192-file download. */
.anatomy__static {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--gutter);
  padding: calc(var(--gutter) * 2) var(--gutter);
}
.anatomy__static img { width: 100%; }
.anatomy__static figcaption { margin-top: 1rem; color: var(--ink-soft); }

@media (max-width: 767px) {
  .anatomy__static { grid-template-columns: 1fr; }
}
```

- [x] **Step 2: Write `Anatomy.jsx`**

```jsx
import { useRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { useGsapScope } from '../motion/useGsapScope.js';
import { FRAME_COUNT, FRAME_W, FRAME_H, frameUrl, loadFrames, EAGER_COUNT } from '../motion/frames.js';
import { useIsDesktop } from '../lib/useMediaQuery.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import { home } from '../data/content.js';
import './Anatomy.css';

const PIN_SVH = 400;
const svh = (n) => n / PIN_SVH;

/** Phase map. One pinned trigger drives the scrub AND the copy, following the
 *  svhToProgress + mapRange pattern from templates/MaximaTherapy. */
const SCRUB_START = svh(60);
const SCRUB_END = svh(340);
const CLAIM_WINDOWS = [
  [svh(80), svh(160)],
  [svh(180), svh(260)],
  [svh(280), svh(352)],
];

export default function Anatomy() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const useCanvas = isDesktop && !reduced;

  if (!useCanvas) return <AnatomyStatic />;
  return <AnatomyCanvas />;
}

/** Mobile and reduced-motion: three key frames as plain images. Deliberately a
 *  separate component so the 192 frames are never requested — a CSS
 *  display:none would still download them. */
function AnatomyStatic() {
  return (
    <section className="anatomy">
      <div className="anatomy__static">
        {[1, 96, 192].map((n, i) => (
          <figure key={n}>
            <img src={frameUrl(n)} alt="" width={FRAME_W} height={FRAME_H} loading="lazy" />
            <figcaption>
              <strong>{home.anatomy.claims[i].title}</strong>
              <br />
              {home.anatomy.claims[i].body}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function AnatomyCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef(null);
  const lastFrame = useRef(-1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { images, cancel } = loadFrames(() => setReady(true));
    imagesRef.current = images;
    return cancel;
  }, []);

  const draw = (index) => {
    // Repaint ONLY when the frame index changes. Painting every scroll event
    // is what turns a smooth scrub into a 20fps one.
    if (index === lastFrame.current) return;
    const canvas = canvasRef.current;
    const img = imagesRef.current?.[index];
    if (!canvas || !img?.complete || !img.naturalWidth) return;
    lastFrame.current = index;

    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill white, then contain-fit. The frames' backdrop is already pure white
    // (verify-knockout.mjs gates this), so the letterbox is seamless and needs
    // no edge-extension.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w / FRAME_W, h / FRAME_H) * 0.92;
    const dw = FRAME_W * scale, dh = FRAME_H * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  const scope = useGsapScope((el) => {
    const stage = el.querySelector('.anatomy__stage');
    const claims = el.querySelectorAll('.anatomy__claim');

    // ScrollTrigger's end string does not understand `svh`, so resolve the pin
    // length to pixels ourselves.
    const pinPx = () => window.innerHeight * (PIN_SVH / 100);

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${pinPx()}`,
      invalidateOnRefresh: true,
      pin: stage,
      pinSpacing: true,
      scrub: true,
      onUpdate: ({ progress }) => {
        const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(SCRUB_START, SCRUB_END, 0, 1, progress));
        draw(Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1))));

        claims.forEach((claim, i) => {
          const [a, b] = CLAIM_WINDOWS[i];
          const local = gsap.utils.clamp(0, 1, gsap.utils.mapRange(a, b, 0, 1, progress));
          // fade in over the first fifth, hold, fade out over the last fifth
          const o = local < 0.2 ? local / 0.2 : local > 0.8 ? (1 - local) / 0.2 : 1;
          gsap.set(claim, { opacity: o, y: (1 - o) * 12 });
        });
      },
    });
  }, [ready]);

  return (
    <section className="anatomy" ref={scope} aria-labelledby="anatomy-label">
      <div className="anatomy__stage">
        <p className="anatomy__label u-label" id="anatomy-label">{home.anatomy.label}</p>

        <canvas className="anatomy__canvas" ref={canvasRef} aria-hidden="true" />

        {/* Copy lives in the DOM as real text, never painted into the canvas,
            so it is selectable and reachable by a screen reader. */}
        <div className="anatomy__copy">
          {home.anatomy.claims.map((c) => (
            <div className="anatomy__claim" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [x] **Step 3: Verify it builds**

Run: `cd "not uploaded/aurora" && npm run build`
Expected: `✓ built in …`

- [x] **Step 4: Commit**

```bash
cd "not uploaded/aurora"
git add src/sections/Anatomy.jsx src/sections/Anatomy.css
git commit -m "feat(aurora): add pinned 192-frame anatomy scrub on a white band"
```

---

## Task 7: Hero

Pinyon appearance #1 of 3.

**Files:** Create `src/sections/Hero.jsx`, `src/sections/Hero.css`

- [x] **Step 1: Write `Hero.css`**

```css
.hero {
  position: relative;
  height: 100svh;
  min-height: 34rem;
  overflow: hidden;
  display: flex;
  align-items: flex-start;
}

.hero__media { position: absolute; inset: 0; }

/* home.jpeg is 2400x1340 with the model bottom-right and open wet sand across
   the top-left. Anchor the crop right so the model is never sliced off, which
   leaves the sand under the type at every aspect ratio. */
.hero__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 72% 50%;
}

/* The sand measures #a18f7e-#a79685 — mid-tone, not light. Paper-coloured type
   needs this scrim to clear 4.5:1. */
.hero__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(105deg, rgba(27, 24, 25, 0.42), rgba(27, 24, 25, 0.06) 58%);
}

.hero__inner {
  position: relative;
  padding: calc(var(--gutter) * 3) var(--gutter) var(--gutter);
  color: var(--paper);
  max-width: 46rem;
}

.hero__kicker {
  letter-spacing: var(--track-wordmark);
  text-transform: uppercase;
  font-size: 0.8rem;
  margin-bottom: clamp(1rem, 4vh, 2.5rem);
}

.hero__line {
  font-weight: 200;
  font-size: clamp(2.6rem, 9vw, 7rem);
  line-height: 0.95;
  text-transform: uppercase;
  letter-spacing: -0.01em;
}

/* Pinyon #1. Overlaps the Archivo line and hangs right — the one flourish on
   an otherwise severe page. */
.hero__script {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 12vw, 9rem);
  line-height: 0.8;
  text-transform: none;
  letter-spacing: 0;
  display: block;
  margin-top: -0.18em;
  margin-left: clamp(2rem, 18vw, 14rem);
}

.hero__standfirst { margin-top: clamp(1.5rem, 5vh, 3rem); max-width: 28ch; }

.hero__cta {
  display: inline-block;
  margin-top: 1.5rem;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.2rem;
}

@media (max-width: 640px) {
  .hero__script { margin-left: 0; }
}
```

- [x] **Step 2: Write `Hero.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { gsap } from '../motion/gsap.js';
import { useGsapScope } from '../motion/useGsapScope.js';
import { home } from '../data/content.js';
import './Hero.css';

export default function Hero() {
  const scope = useGsapScope((el) => {
    const media = el.querySelector('.hero__media img');
    const inner = el.querySelector('.hero__inner');

    gsap.fromTo(media, { scale: 1.06 }, { scale: 1, duration: 1.6, ease: 'glide' });

    gsap.to(media, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });
    gsap.to(inner, {
      yPercent: -28,
      opacity: 0.25,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
    });

    gsap.from(el.querySelectorAll('[data-hero-in]'), {
      yPercent: 60,
      opacity: 0,
      duration: 1.1,
      ease: 'glide',
      stagger: 0.12,
      delay: 0.15,
    });
  });

  return (
    <section className="hero" ref={scope}>
      <div className="hero__media">
        <img
          src="/images/photo/hero-2400.webp"
          srcSet="/images/photo/hero-1600.webp 1600w, /images/photo/hero-2400.webp 2400w"
          sizes="100vw"
          alt="A model lying in the shallows at the water's edge, wearing an Aurora bikini."
          width="2400"
          height="1340"
          fetchPriority="high"
        />
      </div>
      <div className="hero__scrim" />

      <div className="hero__inner">
        <p className="hero__kicker" data-hero-in>{home.hero.kicker}</p>
        <h1 className="hero__line" data-hero-in>
          {home.hero.line1}
          <span className="hero__script">{home.hero.script}</span>
        </h1>
        <p className="hero__standfirst" data-hero-in>{home.hero.standfirst}</p>
        <Link to="/shop" className="hero__cta u-label" data-hero-in>{home.hero.cta}</Link>
      </div>
    </section>
  );
}
```

- [x] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/sections/Hero.jsx src/sections/Hero.css
git commit -m "feat(aurora): add hero with first Pinyon appearance"
```

---

## Task 8: The Eight

The colour-tween rail. Knockouts multiply onto the tinted ground here.

**Files:** Create `src/sections/TheEight.jsx`, `src/sections/TheEight.css`

- [x] **Step 1: Write `TheEight.css`**

```css
.eight { padding: calc(var(--gutter) * 3) var(--gutter); }
.eight__head { max-width: var(--measure); margin-bottom: calc(var(--gutter) * 2); }
.eight__title { font-size: clamp(1.8rem, 4.5vw, 3.4rem); font-weight: 200; line-height: 1.05; }
.eight__body { margin-top: 1rem; color: var(--ink-soft); max-width: 42ch; }

.eight__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--gutter);
}
@media (max-width: 1024px) { .eight__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .eight__grid { grid-template-columns: 1fr; } }

.eight__card { position: relative; }

/* The plate is the blend's safety net. If any ancestor ever gains a transform
   and isolates the multiply, the image composites against THIS instead of
   against nothing, so the worst case is a slightly-wrong tint rather than a
   hard white box. Squared off deliberately: JPEG noise leaves knockout corners
   a shade under 255 and a radius would clip that into visible arcs. */
.eight__plate {
  display: block;
  background: var(--ground-soft, var(--paper));
  border-radius: 0;
}

.eight__img {
  width: 100%;
  height: auto;
  mix-blend-mode: multiply;
  transition: transform var(--dur-base) var(--ease-glide);
}

.eight__card:hover .eight__img,
.eight__card:focus-within .eight__img { transform: translateY(-6px) scale(1.02); }

.eight__meta { display: flex; justify-content: space-between; margin-top: 0.9rem; }
.eight__swatch {
  width: 0.9rem; height: 0.9rem; border-radius: 50%;
  background: linear-gradient(140deg, var(--sw-light), var(--sw));
}
```

- [x] **Step 2: Write `TheEight.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';
import { home } from '../data/content.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import './TheEight.css';

export default function TheEight() {
  const { setGround, resetGround } = useGround();

  return (
    <section className="eight">
      <div className="eight__head">
        <p className="u-label">{home.eight.label}</p>
        <SplitReveal as="h2" className="eight__title">{home.eight.title}</SplitReveal>
        <p className="eight__body">{home.eight.body}</p>
      </div>

      <ul className="eight__grid">
        {products.map((p) => (
          <li
            className="eight__card"
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              <span className="eight__plate" style={{ background: p.groundSoft }}>
                <img
                  className="eight__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880"
                  height="1100"
                  loading="lazy"
                />
              </span>
              <div className="eight__meta">
                <span>{p.name}</span>
                <span className="u-label">{formatPrice(p.priceCents)}</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [x] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/sections/TheEight.jsx src/sections/TheEight.css
git commit -m "feat(aurora): add the eight colourway rail with ground tween"
```

---

## Task 9: Editorial, CraftTeaser, JournalStrip, Closing

Pinyon appearances #2 (Editorial) and #3 (Closing).

**Files:** Create `src/sections/{Editorial,CraftTeaser,JournalStrip,Closing}.jsx` and matching `.css`

- [x] **Step 1: Write `Editorial.jsx` + `Editorial.css`**

`Editorial.css`:
```css
.editorial { position: relative; height: 90svh; min-height: 30rem; overflow: hidden; }
.editorial img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 42%; }
.editorial__wash { position: absolute; inset: 0; background: linear-gradient(0deg, rgba(27,24,25,.38), transparent 55%); }
.editorial__quote {
  position: absolute; left: var(--gutter); right: var(--gutter); bottom: clamp(2rem, 8vh, 5rem);
  color: var(--paper); text-align: center;
}
/* Pinyon #2 */
.editorial__script { font-family: var(--font-display); font-size: clamp(2.4rem, 8vw, 6rem); line-height: 1; }
.editorial__body { margin-top: 1rem; }
```

`Editorial.jsx`:
```jsx
import Parallax from '../motion/Parallax.jsx';
import { home } from '../data/content.js';
import './Editorial.css';

export default function Editorial() {
  return (
    <section className="editorial">
      <Parallax speed={-16} className="editorial__media">
        <img
          src="/images/photo/model4-2400.webp"
          srcSet="/images/photo/model4-1600.webp 1600w, /images/photo/model4-2400.webp 2400w"
          sizes="100vw"
          alt="A model walking at the shoreline in the surf."
          width="2400" height="1340" loading="lazy"
        />
      </Parallax>
      <div className="editorial__wash" />
      <figure className="editorial__quote">
        <p className="editorial__script">{home.editorial.script}</p>
        <figcaption className="editorial__body u-label">{home.editorial.body}</figcaption>
      </figure>
    </section>
  );
}
```

- [x] **Step 2: Write `CraftTeaser.jsx` + `CraftTeaser.css`**

`CraftTeaser.css`:
```css
.craft { padding: calc(var(--gutter) * 3) var(--gutter); background: var(--paper-warm); }
.craft__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gutter); margin-top: calc(var(--gutter) * 1.5); }
@media (max-width: 760px) { .craft__grid { grid-template-columns: 1fr; } }
.craft__value { display: block; font-size: clamp(2.4rem, 6vw, 4.5rem); font-weight: 200; line-height: 1; }
.craft__caption { color: var(--ink-soft); margin-top: 0.5rem; }
```

`CraftTeaser.jsx`:
```jsx
import { Link } from 'react-router-dom';
import CountUp from '../motion/CountUp.jsx';
import { home } from '../data/content.js';
import './CraftTeaser.css';

export default function CraftTeaser() {
  return (
    <section className="craft">
      <p className="u-label">{home.craft.label}</p>
      <div className="craft__grid">
        {home.craft.stats.map((s) => (
          <div key={s.caption}>
            <CountUp className="craft__value" value={s.value} suffix={s.suffix} />
            <p className="craft__caption">{s.caption}</p>
          </div>
        ))}
      </div>
      <Link to="/craft" className="u-label" style={{ display: 'inline-block', marginTop: '2rem', borderBottom: '1px solid currentColor' }}>
        How it is made
      </Link>
    </section>
  );
}
```

- [x] **Step 3: Write `JournalStrip.jsx` + `JournalStrip.css`**

`JournalStrip.css`:
```css
.jstrip { padding: calc(var(--gutter) * 3) var(--gutter); }
.jstrip__grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--gutter); margin-top: var(--gutter); }
@media (max-width: 760px) { .jstrip__grid { grid-template-columns: 1fr; } }
/* All twelve photographs are landscape 2400x1340. No portrait crop exists, so
   these tiles are 4:3 and never taller than wide. */
.jstrip__grid figure { margin: 0; }
.jstrip__grid img { width: 100%; aspect-ratio: 4 / 3; object-fit: cover; }
.jstrip__grid figure:nth-child(2) { margin-top: clamp(1rem, 6vw, 4rem); }
```

`JournalStrip.jsx`:
```jsx
import { Link } from 'react-router-dom';
import Parallax from '../motion/Parallax.jsx';
import { home } from '../data/content.js';
import './JournalStrip.css';

const SHOTS = [
  ['model1', 'A model seated on the sand at golden hour.'],
  ['model2', 'A model walking along the waterline.'],
  ['model3', 'A model reclining against a dune.'],
];

export default function JournalStrip() {
  return (
    <section className="jstrip">
      <p className="u-label">{home.journal.label}</p>
      <div className="jstrip__grid">
        {SHOTS.map(([slug, alt], i) => (
          <Parallax key={slug} speed={i === 1 ? -18 : -8}>
            <figure>
              <img
                src={`/images/photo/${slug}-1600.webp`}
                alt={alt}
                width="1600" height="893" loading="lazy"
              />
            </figure>
          </Parallax>
        ))}
      </div>
      <Link to="/journal" className="u-label" style={{ display: 'inline-block', marginTop: '2rem', borderBottom: '1px solid currentColor' }}>
        {home.journal.title}
      </Link>
    </section>
  );
}
```

- [x] **Step 4: Write `Closing.jsx` + `Closing.css`**

`Closing.css`:
```css
.closing { padding: calc(var(--gutter) * 4) var(--gutter); text-align: center; }
/* Pinyon #3 — the last one on the site. */
.closing__script { font-family: var(--font-display); font-size: clamp(2.6rem, 9vw, 7rem); line-height: 0.95; }
.closing__cta { display: inline-block; margin-top: 2rem; border-bottom: 1px solid currentColor; padding-bottom: 0.25rem; }
```

`Closing.jsx`:
```jsx
import { Link } from 'react-router-dom';
import { home } from '../data/content.js';
import './Closing.css';

export default function Closing() {
  return (
    <section className="closing">
      <p className="closing__script">{home.closing.script}</p>
      <Link to="/shop" className="closing__cta u-label">{home.closing.cta}</Link>
    </section>
  );
}
```

- [x] **Step 5: Commit**

```bash
cd "not uploaded/aurora"
git add src/sections/Editorial.* src/sections/CraftTeaser.* src/sections/JournalStrip.* src/sections/Closing.*
git commit -m "feat(aurora): add editorial, craft teaser, journal strip and closing"
```

---

## Task 10: Compose the homepage

**Files:** Modify `src/routes/Home.jsx`

- [ ] **Step 1: Replace `Home.jsx`**

```jsx
import Hero from '../sections/Hero.jsx';
import Anatomy from '../sections/Anatomy.jsx';
import TheEight from '../sections/TheEight.jsx';
import Editorial from '../sections/Editorial.jsx';
import CraftTeaser from '../sections/CraftTeaser.jsx';
import JournalStrip from '../sections/JournalStrip.jsx';
import Closing from '../sections/Closing.jsx';

export default function Home() {
  return (
    <main>
      {/* The page's only <h1> lives in Hero. PageTransition focuses it on
          navigation so screen readers announce the page. */}
      <Hero />
      <Anatomy />
      <TheEight />
      <Editorial />
      <CraftTeaser />
      <JournalStrip />
      <Closing />
    </main>
  );
}
```

- [ ] **Step 2: Build and test**

```bash
cd "not uploaded/aurora" && npm run build && npm test
```

Expected: build succeeds; **38 tests pass**. The font-rule test now has real files to scan — if it fails, `--font-display` has leaked outside Hero/Editorial/Closing and must be removed rather than the test relaxed.

- [ ] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/routes/Home.jsx
git commit -m "feat(aurora): compose the homepage from its sections"
```

---

## Task 11: Verify in a real browser

Building is not evidence. This page is mostly motion, and motion only fails visibly.

- [ ] **Step 1: Start the dev server and find the real port**

```bash
cd "not uploaded/aurora"
npm run dev > .dev.log 2>&1 &
sleep 7
grep -oE "http://localhost:[0-9]+" .dev.log | head -1
```

Other projects in this repo hold 5173 and 5174 — **read the port, do not assume it**.

- [ ] **Step 2: Confirm each of these by observation**

| Check | Pass condition |
|---|---|
| Hero | Type sits over open sand, model not cropped out, text legible |
| Pinyon count | Exactly 3 on the page: hero `Collection`, editorial script, closing script |
| Anatomy pin | Section pins, garment disassembles as you scroll, unpins cleanly |
| Anatomy band | Pure white, **no grey or white box edges** around the canvas |
| Anatomy copy | Three claims fade through in sequence, readable throughout |
| The Eight | Products float with **no white rectangle**; ground tints on hover |
| Ground tween | Hovering a card tweens the page ground over ~700ms |
| Console | No errors other than the known `/favicon.ico` 404 |

- [ ] **Step 3: Check reduced motion and mobile**

Emulate `prefers-reduced-motion: reduce` and reload. Confirm:
- The page still reads top to bottom with all content visible
- Anatomy shows **three static frames**, and the Network panel shows **~3 frame requests, not 192**

Resize to 390px wide. Confirm the same three-frame fallback and no horizontal scroll.

- [ ] **Step 4: Kill the dev server**

Git-bash `kill %1` does not reach the Vite child on Windows:

```bash
netstat -ano | grep <port>
taskkill //PID <pid> //F
```

- [ ] **Step 5: Commit any fixes**

```bash
cd "not uploaded/aurora"
git add -u
git commit -m "fix(aurora): homepage browser verification fixes"
```

---

## Deferred to Plan 4

Do not build these now; they are listed so they are not forgotten.

- Preloader, custom cursor, vertical marquee rails, sand-grain reveal — the decorative motion layer. The page must be right before it is dressed.
- Per-route document titles (`Shop — AURORA`). The homepage title is the bare `AURORA` by client choice.
- Favicon. `/favicon.ico` currently 404s.

---

## Notes for the implementer

- **Never wrap a knockout product image in `Parallax`** or any other transform on a tinted ground — it isolates the multiply and the white box returns. `TheEight` deliberately animates the `<img>` itself, not its stage, and carries an explicit `--plate` fallback.
- **The Anatomy canvas must repaint only on frame-index change.** Painting per scroll event is the difference between 60fps and 20.
- **Reduced motion is not a degraded page.** `useGsapScope` skips setup entirely, so every section must render its finished visual state in markup and treat animation as enhancement.
- All twelve photographs are landscape 2400×1340. No portrait crop exists.
