# AURORA — Plan 4: Content pages & the decorative motion layer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Finish the site — build `/craft`, `/journal` and `/contact`, add the decorative motion layer (preloader, custom cursor, marquee rails, grain reveal), give every route its own document title, add a favicon, and do a final accessibility and performance pass.

**Architecture:** Three route components plus four reusable motion primitives in `src/motion/`. Everything degrades to a fully usable static page under `prefers-reduced-motion`.

**Tech Stack:** React 19, React Router 7, GSAP 3.15, design-token CSS.

**Spec:** `docs/design-spec.md` §6.4, §6.5, §6.7, §7
**Prerequisites:** Plans 1–3 complete. **44 tests passing.**

---

## What already exists

| Thing | Import from | Exports |
|---|---|---|
| Motion scope | `src/motion/useGsapScope.js` | `useGsapScope(setup, deps)` |
| Line reveal | `src/motion/SplitReveal.jsx` | default |
| Parallax | `src/motion/Parallax.jsx` | default (`speed`, `className`) |
| GSAP | `src/motion/gsap.js` | `gsap`, `ScrollTrigger`, `SplitText`, `InertiaPlugin` + eases `hop` / `glide` |
| Responsive | `src/lib/useMediaQuery.js` | `useMediaQuery`, `useIsDesktop`, `useIsFinePointer` |
| Reduced motion | `src/lib/useReducedMotion.js` | `useReducedMotion` |
| Copy | `src/data/content.js` | `home` |
| Detail copy | `src/data/productDetail.js` | `detail`, `SHIPPING_CENTS`, `FREE_SHIPPING_OVER_CENTS` |

**Photography, all landscape 2400×1340** (`public/images/photo/`): `hero`, `model1`–`model4`, each at `-1600`, `-2400` and `-lqip`. **No portrait crop exists.**

---

## Rules that still apply

1. **No Pinyon Script.** `--font-display` is homepage-only; `tests/fontRule.test.js` allowlists six files. Nothing in this plan may use it.
2. **No `transform` on an ancestor of a blended product image.** None of these pages show knockouts, but the preloader and cursor are global — keep them out of the page-content tree (render them as siblings, fixed-position).
3. **The model photographs are editorial only** and must never sit beside a named colourway with a price. That rule is why `/journal` exists.
4. **Reduced motion must leave every page fully usable.** `useGsapScope` skips setup entirely, so markup must render the finished state.

---

## Task 1: Per-route document titles

Every route currently reports `AURORA`, so a search index or a row of browser
tabs cannot tell them apart. The homepage keeps the bare brand name by explicit
client choice — the others get a prefix.

**Files:** Create `src/lib/useDocumentTitle.js`, Test: `tests/documentTitle.test.js`, then edit all seven route files.

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { titleFor } from '../src/lib/useDocumentTitle.js';

describe('titleFor', () => {
  it('leaves the homepage as the bare brand name', () => {
    // Client's explicit choice — do not add a descriptor here.
    expect(titleFor(null)).toBe('AURORA');
  });

  it('prefixes every other page', () => {
    expect(titleFor('Shop')).toBe('Shop — AURORA');
    expect(titleFor('The Craft')).toBe('The Craft — AURORA');
  });

  it('uses the colourway name on a product page', () => {
    expect(titleFor('Ember')).toBe('Ember — AURORA');
  });
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `cd "not uploaded/aurora" && npx vitest run tests/documentTitle.test.js`
Expected: FAIL — cannot resolve the import.

- [ ] **Step 3: Write `src/lib/useDocumentTitle.js`**

```js
import { useEffect } from 'react';

const BRAND = 'AURORA';

/** Pass null for the homepage — it stays the bare brand name by client choice. */
export const titleFor = (page) => (page ? `${page} — ${BRAND}` : BRAND);

export function useDocumentTitle(page) {
  useEffect(() => {
    document.title = titleFor(page);
  }, [page]);
}
```

- [ ] **Step 4: Call it in every route**

Add the import and one call at the top of each component body:

| File | Call |
|---|---|
| `src/routes/Home.jsx` | `useDocumentTitle(null)` |
| `src/routes/Shop.jsx` | `useDocumentTitle('Shop')` |
| `src/routes/Product.jsx` | `useDocumentTitle(product ? product.name : 'Not found')` |
| `src/routes/Craft.jsx` | `useDocumentTitle('The Craft')` |
| `src/routes/Journal.jsx` | `useDocumentTitle('Journal')` |
| `src/routes/Contact.jsx` | `useDocumentTitle('Contact')` |
| `src/routes/Checkout.jsx` | `useDocumentTitle('Your bag')` |

In `Product.jsx` the call must sit **above** the `if (!product) return` early
return, or React will see a different hook count between renders.

- [ ] **Step 5: Run the test and the suite**

Expected: PASS, 3 tests. Suite total 47.

- [ ] **Step 6: Commit**

```bash
cd "not uploaded/aurora"
git add src/lib/useDocumentTitle.js tests/documentTitle.test.js src/routes
git commit -m "feat(aurora): give every route its own document title"
```

---

## Task 2: Favicon

`/favicon.ico` has 404'd on every page load since Plan 1.

**Files:** Create `public/favicon.svg`, edit `index.html`

- [ ] **Step 1: Write `public/favicon.svg`**

An SVG favicon scales to every size and needs no binary tooling. The mark is the
brand's own ink and paper.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#1B1819"/>
  <path d="M32 14 L45 50 L38.5 50 L35.6 41.5 L28.4 41.5 L25.5 50 L19 50 Z M32 25.5 L29.9 36 L34.1 36 Z"
        fill="#EFEDE7"/>
</svg>
```

- [ ] **Step 2: Reference it in `index.html`**

Add inside `<head>`, leaving the `<title>` exactly as it is:

```html
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

**Do not change the `<title>`.** It is the bare word `AURORA` by explicit client
decision and has been reverted twice by mistake already.

- [ ] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add public/favicon.svg index.html
git commit -m "feat(aurora): add an SVG favicon"
```

---

## Task 3: Content for the three pages

**Files:** Edit `src/data/content.js`, edit `tests/content.test.js`

- [ ] **Step 1: Extend the test**

Append these cases inside the existing `describe('homepage copy')` block —
rename it to `describe('site copy')` since it now covers more than the homepage:

```js
  it('has craft sections with a title and body', () => {
    expect(craft.sections.length).toBeGreaterThanOrEqual(3);
    for (const s of craft.sections) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
  });

  it('captions every journal plate', () => {
    expect(journal.plates).toHaveLength(4);
    for (const p of journal.plates) {
      expect(p.src).toMatch(/^\/images\/photo\/model[1-4]-\d+\.webp$/);
      expect(p.alt.length).toBeGreaterThan(0);
      expect(p.caption.length).toBeGreaterThan(0);
    }
  });

  it('never puts a price next to editorial photography', () => {
    // The model shots wear a tan suit that is not one of the eight colourways.
    // Pairing them with a price would promise a match that does not exist.
    const text = JSON.stringify(journal);
    expect(text).not.toMatch(/\$|price|priceCents/i);
  });

  it('gives contact a real mailto fallback', () => {
    expect(contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
```

Update the import line to `import { home, craft, journal, contact } from '../src/data/content.js';`

- [ ] **Step 2: Run it, confirm it fails**

Expected: FAIL — `craft`, `journal` and `contact` are not exported.

- [ ] **Step 3: Append to `src/data/content.js`**

```js
/** The Craft page. Every factual assertion here is unconfirmed — see claims. */
export const craft = {
  label: 'The craft',
  title: 'Made slowly, on purpose.',
  standfirst:
    'Aurora is cut and sewn by hand in small batches. No production line, no ' +
    'overseas factory, no thousand-unit minimum.',
  sections: [
    {
      title: 'The pattern',
      body:
        'Seventeen pieces make one set. Each is cut by hand from a paper ' +
        'pattern that has been revised more times than we care to admit — the ' +
        'difference between a suit that stays put and one that does not is ' +
        'measured in millimetres.',
    },
    {
      title: 'The fabric',
      body:
        'A dense Italian knit with high recovery, chosen because it holds its ' +
        'shape wet and dry. It costs several times what a standard swim jersey ' +
        'costs, and it is the reason a set lasts seasons rather than a summer.',
    },
    {
      title: 'The maker',
      body:
        'One person sees each set from first cut to final stitch. Nothing is ' +
        'passed down a line. It takes as long as it takes, which is why we ' +
        'make to order rather than to a forecast.',
    },
  ],
  band: {
    src: '/images/photo/model2-2400.webp',
    alt: 'A model walking at the waterline in the surf.',
  },
  claims: [
    { id: 'small-batch',  text: 'made by hand in small batches', needsSignoff: true },
    { id: 'seventeen',    text: '17 pattern pieces per set',      needsSignoff: true },
    { id: 'italian-knit', text: 'dense Italian knit',             needsSignoff: true },
    { id: 'one-maker',    text: 'one maker per set',              needsSignoff: true },
    { id: 'made-to-order', text: 'made to order, not to forecast', needsSignoff: true },
  ],
};

/** The Journal. Editorial only — no prices, no colourway names. The suit in
 *  these photographs is a tan that is NOT one of the eight colourways, so any
 *  price beside them would promise a match that does not exist. */
export const journal = {
  label: 'The journal',
  title: 'On the sand',
  standfirst: 'Shot on film at golden hour. Nothing retouched.',
  plates: [
    { src: '/images/photo/model4-2400.webp', alt: 'A model walking along the shoreline, smiling.',    caption: 'First light, low tide.',    wide: true },
    { src: '/images/photo/model1-1600.webp', alt: 'A model seated on dry sand above the waterline.',  caption: 'Waiting out the heat.',     wide: false },
    { src: '/images/photo/model3-1600.webp', alt: 'A model reclining against a grass-topped dune.',   caption: 'Out of the wind.',          wide: false },
    { src: '/images/photo/model2-2400.webp', alt: 'A model standing in shallow surf, facing the sea.', caption: 'The last swim of the day.', wide: true },
  ],
  claims: [
    { id: 'film', text: 'shot on film, unretouched', needsSignoff: true },
  ],
};

/** Contact. The email and handle are placeholders. */
export const contact = {
  label: 'Contact',
  title: 'Talk to us.',
  standfirst:
    'Aurora is small enough that a person reads every message. Commissions, ' +
    'sizing questions, or anything else.',
  email: 'hello@aurora.example',
  responseTime: 'We reply within two working days.',
  commissions:
    'We take a small number of made-to-measure commissions each season. Tell ' +
    'us what you have in mind.',
  claims: [
    { id: 'email',      text: 'hello@aurora.example',          needsSignoff: true },
    { id: 'reply-time', text: 'replies within 2 working days', needsSignoff: true },
    { id: 'commissions', text: 'made-to-measure commissions offered', needsSignoff: true },
  ],
};
```

- [ ] **Step 4: Run the test, confirm it passes**

Expected: PASS. Suite total 51.

- [ ] **Step 5: Commit**

```bash
cd "not uploaded/aurora"
git add src/data/content.js tests/content.test.js
git commit -m "feat(aurora): add craft, journal and contact copy"
```

---

## Task 4: The grain reveal

A canvas overlay filled with sand, cleared cell by cell in random order to
reveal the photograph beneath. This is the AINO template's grid-dissolve
architecture re-skinned — the template used ASCII characters, which would be
completely wrong for this brand.

**Files:** Create `src/motion/GrainReveal.jsx` + `.css`

- [ ] **Step 1: Write `GrainReveal.css`**

```css
.grain { position: relative; overflow: hidden; }
.grain > img { display: block; width: 100%; }

.grain__veil {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* No JS and reduced motion both leave the veil absent, so the photograph is
   simply visible. */
@media (prefers-reduced-motion: reduce) {
  .grain__veil { display: none; }
}
```

- [ ] **Step 2: Write `GrainReveal.jsx`**

```jsx
import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './GrainReveal.css';

const CELL = 26;        // px, at CSS scale
const DURATION = 900;   // ms for the full dissolve

/** Reveals a photograph by clearing a sand-coloured veil in random cells.
 *
 *  Deliberately NOT a GSAP tween: this paints to a canvas on rAF, and the
 *  cheapest correct way to do that is to own the loop. It also means the veil
 *  can be removed from the DOM the moment it finishes, so it costs nothing
 *  afterwards. */
export default function GrainReveal({ src, srcSet, sizes, alt, width, height, className = '' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    let raf = 0;
    let observer;
    let cancelled = false;

    const start = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(rect.width / CELL);
      const rows = Math.ceil(rect.height / CELL);
      const order = Array.from({ length: cols * rows }, (_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }

      // Sampled from the client's hero photograph.
      ctx.fillStyle = '#A79685';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const t0 = performance.now();
      let cleared = 0;

      const tick = (now) => {
        if (cancelled) return;
        const p = Math.min(1, (now - t0) / DURATION);
        const target = Math.floor(p * order.length);
        for (; cleared < target; cleared++) {
          const idx = order[cleared];
          const x = (idx % cols) * CELL;
          const y = Math.floor(idx / cols) * CELL;
          ctx.clearRect(x, y, CELL, CELL);
        }
        if (p < 1) raf = requestAnimationFrame(tick);
        else canvas.style.display = 'none'; // done — stop compositing it
      };
      raf = requestAnimationFrame(tick);
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(wrap);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [reduced, src]);

  return (
    <div className={`grain ${className}`} ref={wrapRef}>
      <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height} loading="lazy" />
      {!reduced && <canvas className="grain__veil" ref={canvasRef} aria-hidden="true" />}
    </div>
  );
}
```

- [ ] **Step 3: Build and commit**

```bash
cd "not uploaded/aurora"
npm run build
git add src/motion/GrainReveal.jsx src/motion/GrainReveal.css
git commit -m "feat(aurora): add the sand-grain photo reveal"
```

---

## Task 5: Cursor, marquee rails and preloader

**Files:** Create `src/motion/Cursor.jsx` + `.css`, `src/motion/MarqueeRail.jsx` + `.css`, `src/motion/Preloader.jsx` + `.css`

- [ ] **Step 1: Write `Cursor.css`**

```css
.cursor {
  position: fixed;
  top: 0; left: 0;
  z-index: 90;
  pointer-events: none;
  mix-blend-mode: difference;
  will-change: transform;
}

.cursor__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  background: var(--paper);
  transform: translate(-50%, -50%);
  transition: width var(--dur-fast) var(--ease-glide),
              height var(--dur-fast) var(--ease-glide);
}
.cursor[data-active='true'] .cursor__dot { width: 34px; height: 34px; }
```

- [ ] **Step 2: Write `Cursor.jsx`**

Uses `gsap.quickTo`, which writes straight to the transform without allocating
a tween per mousemove. The native cursor is never hidden — a custom cursor that
replaces the system one is a usability problem the moment the JS fails.

```jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from './gsap.js';
import { useIsFinePointer } from '../lib/useMediaQuery.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './Cursor.css';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea';

export default function Cursor() {
  const ref = useRef(null);
  const fine = useIsFinePointer();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });

    const onMove = (e) => { xTo(e.clientX); yTo(e.clientY); };
    const onOver = (e) => setActive(!!e.target.closest?.(INTERACTIVE));

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div className="cursor" ref={ref} data-active={active} aria-hidden="true">
      <div className="cursor__dot" />
    </div>
  );
}
```

- [ ] **Step 3: Write `MarqueeRail.css`**

```css
.rail-edge {
  position: fixed;
  top: 0; bottom: 0;
  width: 2.25rem;
  z-index: 50;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.rail-edge--left { left: 0; }
.rail-edge--right { right: 0; }

.rail-edge__track {
  writing-mode: vertical-rl;
  white-space: nowrap;
  display: flex;
  gap: 3rem;
  animation: rail-scroll 38s linear infinite;
  color: var(--ink-soft);
  opacity: 0.5;
}
.rail-edge--right .rail-edge__track { animation-direction: reverse; }

/* The track holds two identical copies, so translating by exactly -50%
   returns to an identical position and the loop has no visible seam. */
@keyframes rail-scroll {
  from { transform: translateY(0); }
  to   { transform: translateY(-50%); }
}

@media (max-width: 1100px) { .rail-edge { display: none; } }
@media (prefers-reduced-motion: reduce) { .rail-edge__track { animation: none; } }
```

- [ ] **Step 4: Write `MarqueeRail.jsx`**

```jsx
import './MarqueeRail.css';

const WORDS = [
  'Handmade in small batches',
  'Italian fabric',
  'Made to order',
  'One silhouette, eight shades',
];

export default function MarqueeRail({ side = 'left' }) {
  // Two copies: the keyframe translates by -50%, which lands on the start of
  // the second copy — pixel-identical to frame zero, so the loop is seamless.
  const items = [...WORDS, ...WORDS];
  return (
    <div className={`rail-edge rail-edge--${side}`} aria-hidden="true">
      <div className="rail-edge__track u-label">
        {items.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Write `Preloader.css`**

```css
.preloader {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: var(--sand);
  display: grid;
  place-items: center;
  transform-origin: bottom;
}

.preloader__mark {
  color: var(--paper);
  letter-spacing: var(--track-wordmark);
  text-transform: uppercase;
  font-size: clamp(1rem, 3vw, 1.5rem);
}

.preloader[data-done='true'] { pointer-events: none; }
```

- [ ] **Step 6: Write `Preloader.jsx`**

Runs once per page load, whichever route the visitor lands on. It is mounted in
`App.jsx` outside `<Routes>`, so it does NOT replay on client-side navigation —
a preloader in front of every route change is an obstacle, not an effect.

```jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from './gsap.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './Preloader.css';

export default function Preloader() {
  const ref = useRef(null);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setDone(true); return undefined; }
    const el = ref.current;
    if (!el) return undefined;

    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.to(el.querySelector('.preloader__mark'), {
      opacity: 0, duration: 0.4, delay: 0.5, ease: 'glide',
    });
    tl.to(el, { scaleY: 0, duration: 0.8, ease: 'hop' });
    return () => tl.kill();
  }, [reduced]);

  // Unmounted once finished, so it cannot trap focus or intercept clicks.
  if (done) return null;
  return (
    <div className="preloader" ref={ref} data-done={done}>
      <p className="preloader__mark">Aurora</p>
    </div>
  );
}
```

- [ ] **Step 7: Build and commit**

```bash
cd "not uploaded/aurora"
npm run build
git add src/motion/Cursor.jsx src/motion/Cursor.css src/motion/MarqueeRail.jsx src/motion/MarqueeRail.css src/motion/Preloader.jsx src/motion/Preloader.css
git commit -m "feat(aurora): add cursor, marquee rails and preloader"
```

---

## Task 6: The Craft page

**Files:** Replace `src/routes/Craft.jsx`, create `src/routes/Craft.css`

- [ ] **Step 1: Write `Craft.css`**

```css
.craft-p { padding: calc(var(--gutter) * 4) var(--gutter) 0; }
.craft-p__head { max-width: var(--measure); }
.craft-p__title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 200; line-height: 1.02; }
.craft-p__standfirst { margin-top: 1.25rem; color: var(--ink-soft); max-width: 46ch; font-size: 1.1rem; }

.craft-p__band { margin: calc(var(--gutter) * 3) calc(var(--gutter) * -1); }
.craft-p__band img { width: 100%; aspect-ratio: 21 / 9; object-fit: cover; object-position: 50% 45%; }

.craft-p__sections {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: calc(var(--gutter) * 1.5);
  padding-bottom: calc(var(--gutter) * 4);
}
@media (max-width: 860px) { .craft-p__sections { grid-template-columns: 1fr; } }

.craft-p__sec h2 { font-size: 1.35rem; font-weight: 400; margin-bottom: 0.75rem; }
.craft-p__sec p { color: var(--ink-soft); max-width: 42ch; }
.craft-p__num { display: block; margin-bottom: 0.5rem; color: var(--sand-deep); }
```

- [ ] **Step 2: Write `Craft.jsx`**

```jsx
import { craft } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import GrainReveal from '../motion/GrainReveal.jsx';
import './Craft.css';

export default function Craft() {
  useDocumentTitle('The Craft');

  return (
    <main className="craft-p">
      <div className="craft-p__head">
        <p className="u-label">{craft.label}</p>
        <SplitReveal as="h1" className="craft-p__title">{craft.title}</SplitReveal>
        <p className="craft-p__standfirst">{craft.standfirst}</p>
      </div>

      {/* A model shot is allowed here: no colourway is named anywhere near it,
          so it cannot imply a match with the tan suit in the photograph. */}
      <div className="craft-p__band">
        <GrainReveal
          src={craft.band.src}
          alt={craft.band.alt}
          width="2400"
          height="1340"
        />
      </div>

      <div className="craft-p__sections">
        {craft.sections.map((s, i) => (
          <section className="craft-p__sec" key={s.title}>
            <span className="craft-p__num u-label">{String(i + 1).padStart(2, '0')}</span>
            <h2>{s.title}</h2>
            <p>{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/routes/Craft.jsx src/routes/Craft.css
git commit -m "feat(aurora): build the craft page"
```

---

## Task 7: The Journal page

**Files:** Replace `src/routes/Journal.jsx`, create `src/routes/Journal.css`

- [ ] **Step 1: Write `Journal.css`**

```css
.jr { padding: calc(var(--gutter) * 4) var(--gutter) calc(var(--gutter) * 4); }
.jr__head { max-width: var(--measure); margin-bottom: calc(var(--gutter) * 2); }
.jr__title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 200; line-height: 1.02; }
.jr__standfirst { margin-top: 1rem; color: var(--ink-soft); }

.jr__plates { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--gutter); }
/* Every photograph is landscape 2400x1340. A "wide" plate spans both columns;
   no plate is ever taller than it is wide, because no portrait crop exists. */
.jr__plate--wide { grid-column: 1 / -1; }
@media (max-width: 700px) { .jr__plates { grid-template-columns: 1fr; } }

.jr__plate img { width: 100%; aspect-ratio: 16 / 9; object-fit: cover; }
.jr__plate--wide img { aspect-ratio: 21 / 9; }
.jr__caption { margin-top: 0.75rem; color: var(--ink-soft); }
```

- [ ] **Step 2: Write `Journal.jsx`**

```jsx
import { journal } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import GrainReveal from '../motion/GrainReveal.jsx';
import './Journal.css';

export default function Journal() {
  useDocumentTitle('Journal');

  return (
    <main className="jr">
      <div className="jr__head">
        <p className="u-label">{journal.label}</p>
        <SplitReveal as="h1" className="jr__title">{journal.title}</SplitReveal>
        <p className="jr__standfirst">{journal.standfirst}</p>
      </div>

      {/* Editorial only. No prices and no colourway names anywhere on this
          page: the suit photographed is a tan that is not one of the eight. */}
      <div className="jr__plates">
        {journal.plates.map((p) => (
          <figure className={`jr__plate ${p.wide ? 'jr__plate--wide' : ''}`} key={p.src + p.caption}>
            <GrainReveal src={p.src} alt={p.alt} width="2400" height="1340" />
            <figcaption className="jr__caption u-label">{p.caption}</figcaption>
          </figure>
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/routes/Journal.jsx src/routes/Journal.css
git commit -m "feat(aurora): build the journal page"
```

---

## Task 8: The Contact page

**Files:** Replace `src/routes/Contact.jsx`, create `src/routes/Contact.css`

- [ ] **Step 1: Write `Contact.css`**

```css
.ct { padding: calc(var(--gutter) * 4) var(--gutter) calc(var(--gutter) * 4); }
.ct__grid { display: grid; grid-template-columns: 1fr 1fr; gap: calc(var(--gutter) * 2); align-items: start; }
@media (max-width: 860px) { .ct__grid { grid-template-columns: 1fr; } }

.ct__title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 200; line-height: 1.02; }
.ct__standfirst { margin-top: 1.25rem; color: var(--ink-soft); max-width: 40ch; }
.ct__aside { margin-top: 2rem; }
.ct__aside p { margin-bottom: 1rem; color: var(--ink-soft); max-width: 38ch; }

.ct__field { margin-bottom: 1.25rem; }
.ct__field label { display: block; margin-bottom: 0.4rem; }
.ct__field input, .ct__field textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border: 1px solid var(--line);
  background: transparent;
  font: inherit;
  color: inherit;
}
.ct__field textarea { min-height: 9rem; resize: vertical; }
.ct__submit { padding: 1rem 2rem; background: var(--ink); color: var(--paper); }
.ct__status { margin-top: 1rem; min-height: 1.4em; }
```

- [ ] **Step 2: Write `Contact.jsx`**

Posts to Formspree when `VITE_FORM_ENDPOINT` is set, and otherwise falls back to
a `mailto:` — so the form is never a dead end in a demo or a fresh clone.

```jsx
import { useState } from 'react';
import { contact } from '../data/content.js';
import { useDocumentTitle } from '../lib/useDocumentTitle.js';
import SplitReveal from '../motion/SplitReveal.jsx';
import './Contact.css';

const ENDPOINT = import.meta.env.VITE_FORM_ENDPOINT;

export default function Contact() {
  useDocumentTitle('Contact');
  const [status, setStatus] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));

    if (!ENDPOINT) {
      // No endpoint configured: hand off to the user's mail client rather than
      // silently dropping the message.
      const body = encodeURIComponent(`${data.message}\n\n— ${data.name}`);
      window.location.href =
        `mailto:${contact.email}?subject=${encodeURIComponent('Enquiry from the website')}&body=${body}`;
      setStatus('Opening your email app…');
      return;
    }

    setStatus('Sending…');
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(e.target),
      });
      setStatus(res.ok ? 'Thank you — we will be in touch.' : 'Something went wrong. Please email us directly.');
      if (res.ok) e.target.reset();
    } catch {
      setStatus('Something went wrong. Please email us directly.');
    }
  };

  return (
    <main className="ct">
      <div className="ct__grid">
        <div>
          <p className="u-label">{contact.label}</p>
          <SplitReveal as="h1" className="ct__title">{contact.title}</SplitReveal>
          <p className="ct__standfirst">{contact.standfirst}</p>
          <div className="ct__aside">
            <p>{contact.commissions}</p>
            <p>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <br />
              {contact.responseTime}
            </p>
          </div>
        </div>

        <form onSubmit={onSubmit}>
          <div className="ct__field">
            <label htmlFor="ct-name" className="u-label">Name</label>
            <input id="ct-name" name="name" type="text" required autoComplete="name" />
          </div>
          <div className="ct__field">
            <label htmlFor="ct-email" className="u-label">Email</label>
            <input id="ct-email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="ct__field">
            <label htmlFor="ct-message" className="u-label">Message</label>
            <textarea id="ct-message" name="message" required />
          </div>
          <button type="submit" className="ct__submit u-label">Send</button>
          <p className="ct__status" role="status" aria-live="polite">{status}</p>
        </form>
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/routes/Contact.jsx src/routes/Contact.css
git commit -m "feat(aurora): build the contact page"
```

---

## Task 9: Mount the global motion layer

**Files:** Edit `src/App.jsx`, edit `src/sections/Hero.jsx`

- [ ] **Step 1: Add the cursor and preloader to `App.jsx`**

Mount them as siblings of the page tree, **not** wrapping it — a wrapper with a
transform would isolate every product blend and break ScrollTrigger pinning, as
happened once already.

Add the imports, then place inside `<GroundProvider>` immediately before `<Nav />`:

```jsx
<Preloader />
<Cursor />
```

- [ ] **Step 2: Add the marquee rails to `Hero.jsx`**

The rails belong to the homepage hero, not the whole site. Import `MarqueeRail`
and render both sides as the last children of the `<section className="hero">`:

```jsx
      <MarqueeRail side="left" />
      <MarqueeRail side="right" />
```

- [ ] **Step 3: Build, test, commit**

```bash
cd "not uploaded/aurora"
npm run build && npm test
git add src/App.jsx src/sections/Hero.jsx
git commit -m "feat(aurora): mount the global motion layer"
```

---

## Task 10: Final verification

- [ ] **Step 1: Full suite and build**

```bash
cd "not uploaded/aurora"
npm test && npm run build
```

Expected: **51 tests pass**, build clean.

- [ ] **Step 2: Browser pass**

Start the dev server, **read the actual port from the Vite output** (other
projects here hold 5173/5174), and confirm:

| Check | Pass condition |
|---|---|
| Preloader | Plays once, then unmounts — not present in the DOM afterwards |
| Cursor | Follows on desktop; grows over links; native cursor never hidden |
| Rails | Both edges scroll, seamless loop, hidden under 1100px |
| `/craft` | Grain reveal dissolves the band; three numbered sections |
| `/journal` | 4 plates, 2 wide + 2 half; **no price or colourway name anywhere** |
| `/contact` | Labels tied to inputs; submit without an endpoint opens mailto |
| Titles | Each route's tab differs; homepage stays the bare `AURORA` |
| Favicon | No `/favicon.ico` 404 in the console |
| Console | Zero errors |

- [ ] **Step 3: Reduced motion pass**

Emulate `prefers-reduced-motion: reduce` and reload. Confirm no preloader, no
cursor, static rails, photographs visible with no veil, and every page fully
readable.

- [ ] **Step 4: Mobile pass at 390px**

Confirm no horizontal scroll on any route, rails hidden, Anatomy showing three
static frames rather than requesting 192.

- [ ] **Step 5: Commit any fixes**

```bash
cd "not uploaded/aurora"
git add -u
git commit -m "fix(aurora): final verification fixes"
```

---

## Notes for the implementer

- **The preloader unmounts when finished.** Leaving a `position: fixed` overlay
  in the DOM at `opacity: 0` would still swallow clicks and trap focus.
- **Never hide the native cursor.** If the JS fails, a hidden cursor leaves the
  site unusable.
- **The grain veil removes itself** (`display: none`) once the dissolve ends, so
  it stops costing compositor work.
- **No portrait photographs exist.** Every plate is landscape; do not add a
  layout slot that needs a vertical crop.
