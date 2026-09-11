# AURORA — Plan 3: Shop, Product, Checkout

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the commerce path — a shop page presenting the eight colourways as eight products, a full product page for each, and an order-summary checkout with a clean Stripe seam.

**Architecture:** Route components under `src/routes/`, with shared commerce pieces in `src/components/`. Reuses the motion primitives and the ground provider from Plans 1–2. No new dependencies.

**Tech Stack:** React 19, React Router 7, GSAP 3.15, design-token CSS.

**Spec:** `docs/design-spec.md` §6.2–6.3, §6.8
**Prerequisites:** Plans 1 and 2 complete. **33 tests passing.**

> **Scope change, 2026-09-11 (client):** the `/fit` page was cut, and the
> homepage craft-stats band was removed along with the `CountUp` primitive.
> Sizing guidance now lives only in the PDP "Fit notes" accordion. Do not
> reintroduce a `/fit` route or link to one.

---

## What already exists

| Thing | Import from | Exports |
|---|---|---|
| Products | `src/data/products.js` | `products`, `bySlug`, `groundSoftFor`, `GROUND_MIX` |
| Sizes | `src/data/sizes.js` | `SIZES` = `['XS','S','M','L']` |
| Money | `src/lib/format.js` | `formatPrice(cents)` |
| Cart | `src/cart/CartProvider.jsx` | `useCart()` → `{ cart, dispatch, open, openCart, closeCart, count, totalCents }` |
| Cart actions | `src/cart/cartReducer.js` | `add` / `setQty` / `remove` / `clear`; a line is keyed by **slug + size** |
| Ground | `src/ground/GroundProvider.jsx` | `useGround()` → `{ setGround, resetGround, active }` |
| Motion | `src/motion/` | `useGsapScope`, `SplitReveal`, `Parallax` |
| Responsive | `src/lib/useMediaQuery.js` | `useMediaQuery`, `useIsDesktop`, `useIsFinePointer` |

Product shape: `{ slug, name, hex, hexLight, groundSoft, note, priceCents, currency, knockout, image: { card, square } }`

---

## Four rules that break this page

**1. The product page must use `groundSoft`, never `hex`, behind the garment.**
The current `Product.jsx` stub calls `setGround(product)`, which sets `--ground` to the full-saturation hex. A `multiply`-blended knockout on `#8c1b26` gets swallowed — Ember's garment would vanish into the red. `hex` is for accents (swatches, rules, the size selector's active state) only. The area directly behind the knockout gets `groundSoft`.

**2. No `transform` on any ancestor of a blended product image.** It creates a containing block, which isolates `mix-blend-mode`, and the knockout's pure-white backdrop returns as a hard rectangle. This already bit us once: `PageTransition` used to animate an identity transform and broke both blending and ScrollTrigger pinning sitewide. Animate the `<img>` itself, never its wrapper, and never wrap a knockout in `Parallax`.

**3. Every knockout plate is square.** `border-radius: 0`. JPEG noise leaves knockout corners a shade under 255; a radius clips that darkening into visible arcs.

**4. No Pinyon Script anywhere in this plan.** `--font-display` is homepage-only and `tests/fontRule.test.js` allowlists exactly six files (three homepage sections and their stylesheets, plus `tokens.css`). Any use here fails the suite. Do not relax the test.

---

## File structure

```
src/routes/
  Shop.jsx / Shop.css            replace the stub
  Product.jsx / Product.css      replace the stub
  Checkout.jsx / Checkout.css    replace the stub
src/components/
  SizeSelector.jsx / .css        XS S M L, keyboard-operable
  Accordion.jsx / .css           PDP detail panels
  ColourRail.jsx / .css          "the other seven"
  QuantityStepper.jsx            checkout line quantity
src/data/
  productDetail.js               fabric / care / shipping copy + sign-off flags
tests/
  productDetail.test.js
  checkout.test.js               totals, shipping threshold
```

---

## Task 1: Product detail copy

**Files:** Create `src/data/productDetail.js`, Test: `tests/productDetail.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { detail, SHIPPING_CENTS, FREE_SHIPPING_OVER_CENTS } from '../src/data/productDetail.js';

describe('product detail copy', () => {
  it('has the three PDP accordions in order', () => {
    expect(detail.panels.map((p) => p.id)).toEqual(['fabric', 'shipping', 'fit']);
  });

  it('gives every panel a title and body', () => {
    for (const p of detail.panels) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.body.length).toBeGreaterThan(0);
    }
  });

  it('flags every factual claim for client sign-off', () => {
    expect(detail.claims.length).toBeGreaterThan(0);
    expect(detail.claims.every((c) => typeof c.needsSignoff === 'boolean')).toBe(true);
  });

  it('states shipping in cents, not dollars', () => {
    expect(SHIPPING_CENTS).toBe(1200);
    expect(FREE_SHIPPING_OVER_CENTS).toBe(25000);
  });
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `cd "not uploaded/aurora" && npx vitest run tests/productDetail.test.js`
Expected: FAIL — cannot resolve `../src/data/productDetail.js`.

- [ ] **Step 3: Write `src/data/productDetail.js`**

```js
/** Shared PDP copy. Identical for all eight colourways — same garment, same
 *  construction, different dye lot. NOTHING here is confirmed by the client;
 *  every assertion is mirrored into CONTENT.md via `claims`. */

export const SHIPPING_CENTS = 1200;
export const FREE_SHIPPING_OVER_CENTS = 25000;

export const detail = {
  panels: [
    {
      id: 'fabric',
      title: 'Fabric & care',
      body:
        'A dense Italian knit with high recovery, fully lined front and back. ' +
        'Rinse in cool fresh water after every swim. Never wring. Dry flat, ' +
        'out of direct sun. No machine wash, no tumble dry, no bleach.',
    },
    {
      id: 'shipping',
      title: 'Shipping & returns',
      body:
        'Made to order in small batches, so allow five to seven days before ' +
        'dispatch. Flat rate shipping within Canada, free over $250. ' +
        'Unworn returns with the hygiene liner intact within 30 days.',
    },
    {
      id: 'fit',
      title: 'Fit notes',
      body:
        'A high-cut brief with adjustable ties and a sliding triangle top. ' +
        'The cut runs true to size. Between sizes, take the smaller — the ' +
        'knit relaxes slightly with wear.',
    },
  ],

  addToBag: 'Add to bag',
  soldOut: 'Made to order',

  /** Mirror into CONTENT.md. */
  claims: [
    { id: 'fabric-origin', text: 'Italian knit, high recovery', needsSignoff: true },
    { id: 'lining',        text: 'fully lined front and back',  needsSignoff: true },
    { id: 'lead-time',     text: '5-7 days before dispatch',    needsSignoff: true },
    { id: 'shipping-rate', text: 'flat $12, free over $250',    needsSignoff: true },
    { id: 'returns',       text: '30 days, unworn, liner intact', needsSignoff: true },
    { id: 'sizing',        text: 'runs true to size',           needsSignoff: true },
  ],
};
```

- [ ] **Step 4: Run the test, confirm it passes**

Expected: PASS, 4 tests. Suite total 37.

- [ ] **Step 5: Commit**

```bash
cd "not uploaded/aurora"
git add src/data/productDetail.js tests/productDetail.test.js
git commit -m "feat(aurora): add product detail copy with sign-off flags"
```

---

## Task 2: Checkout totals

Money maths gets a test before it gets a UI.

**Files:** Create `src/lib/totals.js`, Test: `tests/checkout.test.js`

- [ ] **Step 1: Write the failing test**

```js
import { describe, it, expect } from 'vitest';
import { shippingFor, orderTotals } from '../src/lib/totals.js';

const line = (qty) => ({ slug: 'ember', size: 'S', qty, priceCents: 19800 });

describe('shippingFor', () => {
  it('is free on an empty bag — nothing to ship', () => {
    expect(shippingFor(0)).toBe(0);
  });

  it('charges the flat rate below the threshold', () => {
    expect(shippingFor(19800)).toBe(1200);
  });

  it('is free at exactly the threshold', () => {
    expect(shippingFor(25000)).toBe(0);
  });

  it('is free above the threshold', () => {
    expect(shippingFor(39600)).toBe(0);
  });
});

describe('orderTotals', () => {
  it('totals a single line', () => {
    expect(orderTotals({ lines: [line(1)] })).toEqual({
      subtotalCents: 19800, shippingCents: 1200, totalCents: 21000,
    });
  });

  it('crosses the free-shipping threshold on quantity', () => {
    expect(orderTotals({ lines: [line(2)] })).toEqual({
      subtotalCents: 39600, shippingCents: 0, totalCents: 39600,
    });
  });

  it('zeroes an empty bag', () => {
    expect(orderTotals({ lines: [] })).toEqual({
      subtotalCents: 0, shippingCents: 0, totalCents: 0,
    });
  });
});
```

- [ ] **Step 2: Run it, confirm it fails**

Run: `cd "not uploaded/aurora" && npx vitest run tests/checkout.test.js`
Expected: FAIL — cannot resolve `../src/lib/totals.js`.

- [ ] **Step 3: Write `src/lib/totals.js`**

```js
import { cartTotalCents } from '../cart/cartReducer.js';
import { SHIPPING_CENTS, FREE_SHIPPING_OVER_CENTS } from '../data/productDetail.js';

/** Free over the threshold, and free on an empty bag — charging shipping on
 *  nothing would show $12.00 on a checkout with no items. */
export function shippingFor(subtotalCents) {
  if (subtotalCents <= 0) return 0;
  return subtotalCents >= FREE_SHIPPING_OVER_CENTS ? 0 : SHIPPING_CENTS;
}

export function orderTotals(cart) {
  const subtotalCents = cartTotalCents(cart);
  const shippingCents = shippingFor(subtotalCents);
  return { subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
```

- [ ] **Step 4: Run the test, confirm it passes**

Expected: PASS, 7 tests. Suite total 44.

- [ ] **Step 5: Commit**

```bash
cd "not uploaded/aurora"
git add src/lib/totals.js tests/checkout.test.js
git commit -m "feat(aurora): add order totals with free-shipping threshold"
```

---

## Task 3: SizeSelector and Accordion

**Files:** Create `src/components/SizeSelector.jsx` + `.css`, `src/components/Accordion.jsx` + `.css`

- [ ] **Step 1: Write `SizeSelector.css`**

```css
.sizes { display: flex; gap: 0.5rem; flex-wrap: wrap; }

.sizes__btn {
  min-width: 3rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--line);
  background: transparent;
  transition: border-color var(--dur-fast) var(--ease-glide),
              color var(--dur-fast) var(--ease-glide);
}

.sizes__btn[aria-pressed='true'] {
  border-color: var(--accent, var(--ink));
  color: var(--accent, var(--ink));
}

.sizes__btn:hover { border-color: var(--ink); }
```

- [ ] **Step 2: Write `SizeSelector.jsx`**

Real `<button>`s with `aria-pressed`, so keyboard and screen-reader users get
the control for free rather than a div with a click handler.

```jsx
import { SIZES } from '../data/sizes.js';
import './SizeSelector.css';

export default function SizeSelector({ value, onChange, accent }) {
  return (
    <div className="sizes" role="group" aria-label="Size">
      {SIZES.map((size) => (
        <button
          key={size}
          type="button"
          className="sizes__btn u-label"
          aria-pressed={value === size}
          style={accent ? { '--accent': accent } : undefined}
          onClick={() => onChange(size)}
        >
          {size}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Write `Accordion.css`**

Animates `grid-template-rows` rather than `max-height`, so the panel opens to
its real height with no magic number to get wrong.

```css
.acc { border-top: 1px solid var(--line); }
.acc:last-of-type { border-bottom: 1px solid var(--line); }

.acc__trigger {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.1rem 0;
  text-align: left;
}

.acc__icon { transition: transform var(--dur-base) var(--ease-glide); }
.acc__trigger[aria-expanded='true'] .acc__icon { transform: rotate(45deg); }

/* 0fr -> 1fr animates to the content's natural height. */
.acc__panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--dur-base) var(--ease-glide);
}
.acc__panel[data-open='true'] { grid-template-rows: 1fr; }
.acc__inner { overflow: hidden; }
.acc__inner p { padding-bottom: 1.2rem; max-width: 46ch; color: var(--ink-soft); }

@media (prefers-reduced-motion: reduce) {
  .acc__panel, .acc__icon { transition: none; }
}
```

- [ ] **Step 4: Write `Accordion.jsx`**

```jsx
import { useId, useState } from 'react';
import './Accordion.css';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className="acc">
      <button
        type="button"
        className="acc__trigger u-label"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {title}
        <span className="acc__icon" aria-hidden="true">+</span>
      </button>
      {/* The panel stays in the DOM when closed so its content remains
          findable by in-page search and by assistive tech. */}
      <div className="acc__panel" data-open={open} id={id} role="region">
        <div className="acc__inner">{children}</div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Build and commit**

```bash
cd "not uploaded/aurora"
npm run build
git add src/components/SizeSelector.jsx src/components/SizeSelector.css src/components/Accordion.jsx src/components/Accordion.css
git commit -m "feat(aurora): add size selector and accordion"
```

---

## Task 4: The shop page

**Files:** Replace `src/routes/Shop.jsx`, create `src/routes/Shop.css`

- [ ] **Step 1: Write `Shop.css`**

```css
.shop { padding: calc(var(--gutter) * 4) var(--gutter) calc(var(--gutter) * 3); }

.shop__head { max-width: var(--measure); margin-bottom: calc(var(--gutter) * 2); }
.shop__title { font-size: clamp(2rem, 5vw, 4rem); font-weight: 200; line-height: 1.02; }
.shop__body { margin-top: 1rem; color: var(--ink-soft); max-width: 44ch; }
.shop__count { margin-top: 1.5rem; }

.shop__grid {
  list-style: none; padding: 0; margin: 0;
  display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--gutter);
}
@media (max-width: 1024px) { .shop__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px)  { .shop__grid { grid-template-columns: 1fr; } }

.shop__card { position: relative; }

/* Explicit plate behind every knockout. If an ancestor ever gains a transform
   and isolates the blend, the image composites against this instead of against
   nothing — a slightly-wrong tint rather than a hard white box. Square: JPEG
   noise darkens knockout corners and a radius would clip that into arcs. */
.shop__plate { display: block; border-radius: 0; }

.shop__img {
  width: 100%; height: auto;
  mix-blend-mode: multiply;
  transition: transform var(--dur-base) var(--ease-glide);
}
/* The transform is on the IMG, never on the plate or the card — a transform on
   an ancestor would isolate the blend. */
.shop__card:hover .shop__img,
.shop__card:focus-within .shop__img { transform: translateY(-8px) scale(1.015); }

.shop__meta { display: flex; justify-content: space-between; align-items: baseline; margin-top: 0.9rem; }
.shop__name { display: flex; align-items: center; gap: 0.55rem; }
.shop__swatch {
  width: 0.85rem; height: 0.85rem; border-radius: 50%;
  background: linear-gradient(140deg, var(--sw-light), var(--sw));
}
.shop__note { margin-top: 0.35rem; color: var(--ink-soft); font-size: 0.9rem; max-width: 30ch; }

@media (prefers-reduced-motion: reduce) {
  .shop__img { transition: none; }
}
```

- [ ] **Step 2: Write `Shop.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { useGround } from '../ground/GroundProvider.jsx';
import SplitReveal from '../motion/SplitReveal.jsx';
import './Shop.css';

export default function Shop() {
  const { setGround, resetGround } = useGround();

  return (
    <main className="shop">
      <div className="shop__head">
        <p className="u-label">The collection</p>
        <SplitReveal as="h1" className="shop__title">Eight shades. One silhouette.</SplitReveal>
        <p className="shop__body">
          The same considered cut, dyed eight ways. Every piece is made to order.
        </p>
        <p className="shop__count u-label">{products.length} colourways</p>
      </div>

      <ul className="shop__grid">
        {products.map((p) => (
          <li
            className="shop__card"
            key={p.slug}
            onMouseEnter={() => setGround(p)}
            onMouseLeave={resetGround}
          >
            <Link to={`/shop/${p.slug}`} onFocus={() => setGround(p)} onBlur={resetGround}>
              {/* groundSoft, not hex — a multiply blend over a saturated ground
                  would swallow the garment. */}
              <span className="shop__plate" style={{ background: p.groundSoft }}>
                <img
                  className="shop__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880" height="1100" loading="lazy"
                />
              </span>
              <div className="shop__meta">
                <span className="shop__name">
                  <span
                    className="shop__swatch"
                    style={{ '--sw': p.hex, '--sw-light': p.hexLight }}
                    aria-hidden="true"
                  />
                  {p.name}
                </span>
                <span className="u-label">{formatPrice(p.priceCents)}</span>
              </div>
              <p className="shop__note">{p.note}</p>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 3: Build, test, commit**

```bash
cd "not uploaded/aurora"
npm run build && npm test
git add src/routes/Shop.jsx src/routes/Shop.css
git commit -m "feat(aurora): build the shop page"
```

---

## Task 5: The colour rail

**Files:** Create `src/components/ColourRail.jsx` + `.css`

- [ ] **Step 1: Write `ColourRail.css`**

```css
.rail { padding: calc(var(--gutter) * 2) 0 0; border-top: 1px solid var(--line); }
.rail__list {
  list-style: none; margin: var(--gutter) 0 0; padding: 0;
  display: grid; grid-template-columns: repeat(7, 1fr); gap: 1rem;
}
@media (max-width: 900px) { .rail__list { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 520px) { .rail__list { grid-template-columns: repeat(3, 1fr); } }

.rail__plate { display: block; border-radius: 0; }
.rail__img { width: 100%; height: auto; mix-blend-mode: multiply; }
.rail__name { margin-top: 0.5rem; }
```

- [ ] **Step 2: Write `ColourRail.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { products } from '../data/products.js';
import './ColourRail.css';

/** The other seven colourways. Each links to its own URL so every colourway
 *  stays independently shareable — the ground tween survives the navigation
 *  because GroundProvider sits above the router outlet. */
export default function ColourRail({ currentSlug }) {
  const others = products.filter((p) => p.slug !== currentSlug);

  return (
    <section className="rail" aria-label="Other colourways">
      <p className="u-label">The other {others.length}</p>
      <ul className="rail__list">
        {others.map((p) => (
          <li key={p.slug}>
            <Link to={`/shop/${p.slug}`}>
              <span className="rail__plate" style={{ background: p.groundSoft }}>
                <img
                  className="rail__img"
                  src={p.image.card}
                  alt={`The Aurora bikini in ${p.name}`}
                  width="880" height="1100" loading="lazy"
                />
              </span>
              <span className="rail__name u-label">{p.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 3: Commit**

```bash
cd "not uploaded/aurora"
git add src/components/ColourRail.jsx src/components/ColourRail.css
git commit -m "feat(aurora): add the other-seven colour rail"
```

---

## Task 6: The product page

**Files:** Replace `src/routes/Product.jsx`, create `src/routes/Product.css`

- [ ] **Step 1: Write `Product.css`**

```css
.pdp { padding: calc(var(--gutter) * 4) var(--gutter) calc(var(--gutter) * 3); }

.pdp__top {
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  gap: calc(var(--gutter) * 2);
  align-items: start;
}
@media (max-width: 900px) { .pdp__top { grid-template-columns: 1fr; } }

/* groundSoft, never hex. A multiply blend over a saturated ground swallows the
   garment — Ember's #8c1b26 would leave nothing readable. */
.pdp__plate { display: block; border-radius: 0; }
.pdp__img { width: 100%; height: auto; mix-blend-mode: multiply; }

.pdp__name { font-size: clamp(2rem, 5vw, 3.6rem); font-weight: 200; line-height: 1.02; }
.pdp__price { margin-top: 0.75rem; font-size: 1.25rem; }
.pdp__note { margin-top: 1.25rem; color: var(--ink-soft); max-width: 40ch; }

.pdp__field { margin-top: 2rem; }
.pdp__fieldhead { display: flex; justify-content: space-between; margin-bottom: 0.75rem; }

.pdp__add {
  width: 100%;
  margin-top: 1.75rem;
  padding: 1.05rem 1.5rem;
  background: var(--ink);
  color: var(--paper);
  transition: opacity var(--dur-fast) var(--ease-glide);
}
.pdp__add:hover { opacity: 0.86; }
.pdp__add:disabled { opacity: 0.4; cursor: not-allowed; }

.pdp__hint { margin-top: 0.75rem; color: var(--ink-soft); min-height: 1.4em; }
.pdp__panels { margin-top: 2.5rem; }
.pdp__rail { margin-top: calc(var(--gutter) * 3); }

@media (prefers-reduced-motion: reduce) {
  .pdp__add { transition: none; }
}
```

- [ ] **Step 2: Write `Product.jsx`**

```jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { bySlug } from '../data/products.js';
import { detail } from '../data/productDetail.js';
import { formatPrice } from '../lib/format.js';
import { useCart } from '../cart/CartProvider.jsx';
import { useGround } from '../ground/GroundProvider.jsx';
import SizeSelector from '../components/SizeSelector.jsx';
import Accordion from '../components/Accordion.jsx';
import ColourRail from '../components/ColourRail.jsx';
import './Product.css';

export default function Product() {
  const { slug } = useParams();
  const product = bySlug(slug);
  const { dispatch, openCart } = useCart();
  const { setGround, resetGround } = useGround();
  const [size, setSize] = useState(null);
  const [hint, setHint] = useState('');

  useEffect(() => {
    if (product) setGround(product);
    return resetGround;
  }, [product, setGround, resetGround]);

  // Changing colourway must not silently carry a stale size selection.
  useEffect(() => { setSize(null); setHint(''); }, [slug]);

  if (!product) {
    return (
      <main className="pdp">
        <h1 className="pdp__name">Not found</h1>
        <p className="pdp__note">That colourway does not exist.</p>
        <Link to="/shop" className="u-label">Back to the shop</Link>
      </main>
    );
  }

  const addToBag = () => {
    if (!size) { setHint('Choose a size first.'); return; }
    dispatch({
      type: 'add',
      line: { slug: product.slug, size, qty: 1, priceCents: product.priceCents },
    });
    setHint('');
    openCart();
  };

  return (
    <main className="pdp">
      <div className="pdp__top">
        <span className="pdp__plate" style={{ background: product.groundSoft }}>
          <img
            className="pdp__img"
            src={product.image.card}
            alt={`The Aurora bikini in ${product.name}`}
            width="880" height="1100"
          />
        </span>

        <div>
          <p className="u-label">The Aurora bikini</p>
          <h1 className="pdp__name">{product.name}</h1>
          <p className="pdp__price">{formatPrice(product.priceCents)}</p>
          <p className="pdp__note">{product.note}</p>

          <div className="pdp__field">
            <div className="pdp__fieldhead">
              <span className="u-label">Size</span>
              {/* No size-guide page: /fit was cut at the client's request.
                  Sizing lives in the "Fit notes" accordion below. */}
            </div>
            <SizeSelector value={size} onChange={(s) => { setSize(s); setHint(''); }} accent={product.hex} />
          </div>

          <button type="button" className="pdp__add u-label" onClick={addToBag}>
            {detail.addToBag}
          </button>
          {/* aria-live so the "choose a size" hint is announced, not just shown. */}
          <p className="pdp__hint" role="status" aria-live="polite">{hint}</p>

          <div className="pdp__panels">
            {detail.panels.map((p, i) => (
              <Accordion key={p.id} title={p.title} defaultOpen={i === 0}>
                <p>{p.body}</p>
              </Accordion>
            ))}
          </div>
        </div>
      </div>

      <div className="pdp__rail">
        <ColourRail currentSlug={product.slug} />
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Build, test, commit**

```bash
cd "not uploaded/aurora"
npm run build && npm test
git add src/routes/Product.jsx src/routes/Product.css
git commit -m "feat(aurora): build the product page"
```

---

## Task 7: Checkout

Order summary only, with a disabled pay button. The payment block is isolated
so Stripe drops in without touching anything else.

**Files:** Replace `src/routes/Checkout.jsx`, create `src/routes/Checkout.css`, create `src/components/QuantityStepper.jsx`

- [ ] **Step 1: Write `QuantityStepper.jsx`**

```jsx
export default function QuantityStepper({ qty, onChange, label }) {
  return (
    <span className="qty" role="group" aria-label={`Quantity, ${label}`}>
      <button type="button" onClick={() => onChange(qty - 1)} aria-label={`Decrease quantity of ${label}`}>−</button>
      <span aria-live="polite">{qty}</span>
      <button type="button" onClick={() => onChange(qty + 1)} aria-label={`Increase quantity of ${label}`}>+</button>
    </span>
  );
}
```

- [ ] **Step 2: Write `Checkout.css`**

```css
.co { padding: calc(var(--gutter) * 4) var(--gutter) calc(var(--gutter) * 3); }
.co__title { font-size: clamp(1.8rem, 4vw, 3rem); font-weight: 200; }
.co__grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: calc(var(--gutter) * 2); margin-top: var(--gutter); align-items: start; }
@media (max-width: 900px) { .co__grid { grid-template-columns: 1fr; } }

.co__lines { list-style: none; margin: 0; padding: 0; }
.co__line { display: grid; grid-template-columns: 5.5rem 1fr auto; gap: 1.25rem; padding: 1.25rem 0; border-bottom: 1px solid var(--line); align-items: center; }
.co__line img { width: 100%; border-radius: 0; }

.qty { display: inline-flex; align-items: center; gap: 0.75rem; margin-top: 0.5rem; }
.qty button { width: 1.75rem; height: 1.75rem; border: 1px solid var(--line); }

.co__summary { border: 1px solid var(--line); padding: var(--gutter); }
.co__row { display: flex; justify-content: space-between; padding: 0.5rem 0; }
.co__row--total { border-top: 1px solid var(--line); margin-top: 0.5rem; padding-top: 1rem; font-size: 1.15rem; }

.co__pay { width: 100%; margin-top: 1.5rem; padding: 1.05rem; background: var(--ink); color: var(--paper); }
.co__pay:disabled { opacity: 0.35; cursor: not-allowed; }
.co__paynote { margin-top: 0.9rem; color: var(--ink-soft); font-size: 0.9rem; }
.co__empty { margin-top: var(--gutter); }
```

- [ ] **Step 3: Write `Checkout.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { useCart } from '../cart/CartProvider.jsx';
import { bySlug } from '../data/products.js';
import { formatPrice } from '../lib/format.js';
import { orderTotals } from '../lib/totals.js';
import { FREE_SHIPPING_OVER_CENTS } from '../data/productDetail.js';
import QuantityStepper from '../components/QuantityStepper.jsx';
import './Checkout.css';

export default function Checkout() {
  const { cart, dispatch } = useCart();
  const { subtotalCents, shippingCents, totalCents } = orderTotals(cart);
  const empty = cart.lines.length === 0;

  return (
    <main className="co">
      <h1 className="co__title">Your bag</h1>

      {empty ? (
        <p className="co__empty">
          Your bag is empty. <Link to="/shop" className="u-label">View the eight</Link>
        </p>
      ) : (
        <div className="co__grid">
          <ul className="co__lines">
            {cart.lines.map((line) => {
              const product = bySlug(line.slug);
              return (
                <li className="co__line" key={`${line.slug}-${line.size}`}>
                  <span style={{ background: product.groundSoft, display: 'block' }}>
                    <img
                      src={product.image.card}
                      alt=""
                      width="880" height="1100"
                      style={{ mixBlendMode: 'multiply' }}
                    />
                  </span>
                  <div>
                    <p>{product.name}</p>
                    <p className="u-label">Size {line.size}</p>
                    <QuantityStepper
                      qty={line.qty}
                      label={`${product.name}, size ${line.size}`}
                      onChange={(qty) => dispatch({ type: 'setQty', slug: line.slug, size: line.size, qty })}
                    />
                  </div>
                  <span>{formatPrice(line.priceCents * line.qty)}</span>
                </li>
              );
            })}
          </ul>

          <div className="co__summary">
            <div className="co__row">
              <span className="u-label">Subtotal</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="co__row">
              <span className="u-label">Shipping</span>
              <span>{shippingCents === 0 ? 'Free' : formatPrice(shippingCents)}</span>
            </div>
            {shippingCents > 0 && (
              <p className="co__paynote">
                {formatPrice(FREE_SHIPPING_OVER_CENTS - subtotalCents)} away from free shipping.
              </p>
            )}
            <div className="co__row co__row--total">
              <span className="u-label">Total</span>
              <span>{formatPrice(totalCents)}</span>
            </div>

            {/* ── STRIPE SEAM ──────────────────────────────────────────────
                This is the only block that changes to accept real payments.

                1. npm i @stripe/stripe-js @stripe/react-stripe-js
                2. Add a server route that creates a PaymentIntent from
                   `cart.lines` — recompute the price SERVER-SIDE from the
                   slugs. Never trust a total sent by the browser.
                3. Replace the button below with Stripe's <PaymentElement />
                   wrapped in <Elements>.

                Nothing else on the site needs to change. There is deliberately
                no Stripe dependency and no publishable key in this build. */}
            <button type="button" className="co__pay u-label" disabled>
              Pay {formatPrice(totalCents)}
            </button>
            <p className="co__paynote">
              Payments are not connected yet. This is a preview of the checkout.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
```

- [ ] **Step 4: Build, test, commit**

```bash
cd "not uploaded/aurora"
npm run build && npm test
git add src/routes/Checkout.jsx src/routes/Checkout.css src/components/QuantityStepper.jsx
git commit -m "feat(aurora): build the checkout with an isolated Stripe seam"
```

---

## Task 8: Verify in a real browser

Building is not evidence, and the last two rounds of bugs here were invisible to
both the build and the test suite.

- [ ] **Step 1: Start the dev server and read the real port**

```bash
cd "not uploaded/aurora"
npm run dev > .dev.log 2>&1 &
sleep 7
grep -oE "http://localhost:[0-9]+" .dev.log | head -1
```

Other projects in this repo occupy 5173 and 5174 — **read the port, never assume it.**

- [ ] **Step 2: Confirm by observation**

| Check | Pass condition |
|---|---|
| `/shop` | 8 cards, no white rectangles behind any garment |
| Ground tween | Hovering a card tints the page over ~700ms |
| Salt | Visible against its plate — the palest and highest-risk card |
| `/shop/ember` | Garment reads clearly; it is NOT swallowed by red |
| Size selector | Keyboard operable, `aria-pressed` flips; no link to a /fit page |
| Add to bag | Without a size shows the hint; with a size opens the drawer |
| Accordions | Open to full height, no clipped text |
| `/checkout` | Totals correct; shipping free at 2 items ($396 ≥ $250) |
| Empty bag | Shows the empty state, not a $12.00 shipping row |
| Console | No errors except the known `/favicon.ico` 404 |

**Drive scroll with real wheel events (`page.mouse.wheel`), never
`window.scrollTo`** — the latter bypasses Lenis, leaves ScrollTrigger stale and
produces convincing false negatives.

- [ ] **Step 3: Kill the dev server**

Git-bash `kill %1` does not reach the Vite child on Windows:

```bash
netstat -ano | grep <port>
taskkill //PID <pid> //F
```

- [ ] **Step 4: Commit any fixes**

```bash
cd "not uploaded/aurora"
git add -u
git commit -m "fix(aurora): commerce browser verification fixes"
```

---

## Notes for the implementer

- **`groundSoft` behind garments, `hex` for accents.** This is the single
  easiest thing to get wrong here, and it makes Ember and Eclipse unreadable.
- **Recompute prices server-side** when Stripe is added. The checkout sends
  nothing authoritative; a browser-supplied total is a discount button.
- **Reduced motion** must leave every page fully usable. All animation here is
  CSS transition only, so it degrades by itself — but check.
