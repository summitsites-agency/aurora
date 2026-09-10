# AURORA

A storefront for **AURORA**, a handmade swimwear label. One bikini silhouette,
eight colourways, cut and sewn by hand.

> **This is an in-progress client build.** Plan 1 (foundation) is complete. The
> homepage, product pages and content pages are still being built. Nothing in
> the copy has been confirmed by the client — see [`CONTENT.md`](./CONTENT.md).

---

## Run it

```bash
npm install
npm run dev
```

Vite picks the first free port from 5173 upward.

| Script | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the built output |
| `npm test` | Vitest suite |
| `npm run prepare-media` | Rebuild every derivative in `public/` from `media-src/` |

---

## The idea

**The page wears the colour.** The base palette is a neutral warm sand sampled
from the client's own hero photograph. The eight colourways *are* the accent
system — there is no invented brand accent. Hovering a card, or opening a
product, tweens the whole page ground to that colourway while the product
knockout `multiply`-blends so it floats directly on the tint.

Two typefaces, total. **Archivo** runs the entire site including the wordmark.
**Pinyon Script** appears exactly three times, all on the homepage. A test
enforces that by filename.

---

## Layout

```
media-src/     the client's untouched originals (13 jpegs + expand.mp4)
refs/          client design references
public/        web-ready derivatives, all generated — never hand-edit
  images/products/   8 colourways, knocked out, 4:5 and 1:1
  images/photo/      hero + 4 model shots, 2 widths + LQIP
  frames/            192 frames for the pinned Anatomy scrub
scripts/       the media pipeline
src/
  data/        products, sizes, copy
  lib/         pure helpers and hooks
  motion/      GSAP setup and reusable motion primitives
  ground/      the colour-tween provider
  cart/        reducer, provider, drawer
  components/  nav, footer, page transition
  sections/    homepage sections
  routes/      the eight pages
docs/          design spec, implementation plans, build ledger
```

---

## Things that will bite you

These are measured from the real assets, not assumed. Full detail in
[`docs/design-spec.md`](./docs/design-spec.md) §8 and §11.

- **The product shots are not on white.** They sit on a ~215 grey studio
  backdrop, and the darkest per-pixel value anywhere is 205. `prepare-media`
  runs a LUT that ramps 168→204 to pure white while preserving the drop shadow
  (measured floor 175). Skip it and every product renders as a grey rectangle.
- **`multiply` tints the garment, not just the backdrop.** Salt is a white
  bikini; on a saturated ground it renders *as* that ground. Knockouts may only
  sit on the light `groundSoft` tints — never the sand band.
- **Any `transform` between a blended image and its band isolates the blend**
  and the white box returns. Page transitions fade, never slide; float
  animations go on the `<img>`, never its wrapper.
- **`expand.mp4` has a per-frame black letterbox** — 3px on some frames, none on
  135 of 192. Always crop a uniform 4px top and bottom.
- **All twelve photographs are landscape.** No portrait crop exists.

---

## Verifying the media

```bash
node scripts/verify-knockout.mjs
```

Gates the pipeline: per-channel minimums over backdrop strips for the products,
a distributional check for the frames, and a shadow-survival check. Never verify
a knockout by averaging a patch — averaging hides exactly the per-pixel failures
that ruin a blend.

---

## Checkout

`/checkout` is an order summary with a disabled pay button, by design. The
payment block is isolated so Stripe can be dropped in without touching anything
else. No Stripe dependency, no keys, no server.
