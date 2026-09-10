# AURORA — design spec

**Date:** 2026-09-10
**Project root:** ``
**Status:** approved design, ready for implementation plan

---

## 1. Brief

A premium storefront for **AURORA**, a handmade swimwear label. One bikini
silhouette, eight colourways, cut and sewn by hand from expensive fabric. The
site must look premium, use exactly two typefaces, present each colourway as its
own product, use the model photography as proof, carry a heavy but subtle motion
layer, and include a checkout page so Stripe can be added later.

This is a **real client project**. Every factual claim in the copy is logged in
`CONTENT.md` for client sign-off before launch.

---

## 2. Decisions locked

| Decision | Value |
|---|---|
| Brand name | **AURORA** — single word, wide-tracked, no sub-lockup |
| Display font | **Pinyon Script** — homepage only, exactly 3 appearances |
| Text font | **Archivo** (variable 200–700) — everything else including the wordmark |
| Stack | Vite 6 + React 19 + React Router 7 |
| Shop model | 8 distinct products, each with its own slug and page |
| Colour naming | Aurora-themed poetic |
| Price | **CAD $198.00**, identical across all 8 (flagged for sign-off) |
| Model photos | Editorial only — never adjacent to a named colourway |
| Checkout | Order summary only, disabled pay button, marked Stripe seam |
| Scroll sequence | Homepage, pinned "Anatomy" section |
| Extra pages | Size & Fit, Contact, Journal. Care & Returns → PDP accordions |

### 2.1 Rationale for the price

Canadian handmade-premium swim sets sit at roughly CAD $180–260 (Left On Friday
≈ $230 for top + bottom; Jade Swim and Matteau convert to ≈ $245). The ref's USD
$168 converts to ≈ $230 CAD, which is high for a label with no name recognition.
$198 holds the premium position, reads considered rather than round, and is a
one-line change in `src/data/products.js`.

---

## 3. Core concept

**The page wears the colour.**

The base palette is a neutral warm sand sampled from the client's own hero
photograph. The eight colourways *are* the accent system — there is no invented
brand accent. Hovering a card on `/shop`, or opening a product page, tweens the
entire page ground to that colourway, with the product knockout
`multiply`-blended so it floats directly on the tinted ground.

This is what makes eight shades of one garment read as eight products, and it is
a structure no other demo in this repo uses (see
`demo-sites-must-be-structurally-distinct`).

---

## 4. Brand system

### 4.1 Palette — sampled, not invented

Neutrals sampled from `public/home.jpeg`; ink and paper taken from the brand's
own Eclipse and Salt colourways.

```
--paper       #EFEDE7   page ground
--paper-warm  #E7E2D9   alternating band
--sand        #A79685   hero mid-sand → full-bleed bands, footer
--sand-deep   #8A7B6E   wet-sand shadow
--ink         #1B1819   from ECLIPSE
--ink-soft    #4A443F
--line        rgba(27,24,25,0.14)
```

### 4.2 The eight colourways

Each has a base hex (mid-garment) and a light hex (cup highlight). The light hex
drives the swatch gradient so a swatch reads as fabric, not a flat dot.

| Slug | Name | Source file | Base | Light |
|---|---|---|---|---|
| `eclipse` | Eclipse | `black.jpeg` | `#1b1819` | `#3f3a3a` |
| `driftwood` | Driftwood | `brown.jpeg` | `#4f352a` | `#714f42` |
| `midnight` | Midnight | `dark blue.jpeg` | `#312d50` | `#4b4365` |
| `kelp` | Kelp | `green.jpeg` | `#2d3829` | `#44503f` |
| `horizon` | Horizon | `light blue.jpeg` | `#6d90b0` | `#c0d4e4` |
| `clay` | Clay | `pink.jpeg` | `#a14c4b` | `#b35b59` |
| `ember` | Ember | `red.jpeg` | `#8c1b26` | `#9f3740` |
| `salt` | Salt | `white.jpeg` | `#dcdbd8` | `#efefee` |

Note: the file named `pink.jpeg` is a dusty clay-rose, and `red.jpeg` is a deep
wine-crimson. The names above describe what the fabric actually looks like.

### 4.3 Typography — two fonts, one hard rule

- **Archivo** variable, weights 200–700. Wordmark, nav, headings, body, UI,
  every page.
- **Pinyon Script** 400. **Homepage only.** Exactly three appearances:
  1. Hero — `Collection`, overlapping the Archivo headline
  2. Mid-page editorial pull-quote
  3. Closing line above the shop CTA

Zero Pinyon on `/shop`, `/shop/:slug`, `/craft`, `/journal`, `/fit`, `/contact`,
`/checkout`. The scarcity is the showcase.

A Vitest assertion guards it. The `--font-display` token may be referenced by
**exactly three files** — `sections/Hero`, `sections/Editorial`,
`sections/Closing` — plus its own declaration in `styles/tokens.css`. The test
scans every file under `src/routes/`, `src/sections/`, `src/components/` and
`src/styles/`, and fails on any other match. Naming the allowed files rather
than the allowed directory is deliberate: `Home` renders from `src/sections/`,
so a directory-level rule would let Pinyon leak into shared sections.

Both self-hosted as woff2 in `public/fonts/`, `font-display: swap`, preloaded.

### 4.4 Motion tokens

Custom eases lifted from `templates/SteelworksStudio-LandingPage-main`:

```js
CustomEase.create("hop",   "0.9, 0, 0.1, 1");   // decisive — wipes, transitions
CustomEase.create("glide", "0.8, 0, 0.2, 1");   // long — grounds, parallax
```

```
--dur-fast 240ms   --dur-base 520ms   --dur-slow 900ms   --dur-ground 700ms
```

---

## 5. Information architecture

| Route | Page |
|---|---|
| `/` | Home |
| `/shop` | The eight colourways |
| `/shop/:slug` | Product detail ×8 |
| `/craft` | The handmade story |
| `/journal` | Editorial — the model photography |
| `/fit` | Size & fit guide |
| `/contact` | Enquiries + custom commissions |
| `/checkout` | Order summary |

Persistent across all routes: nav, cart drawer, footer, cursor, smooth scroll,
page transitions.

---

## 6. Page specs

### 6.1 Home

```
0  PRELOADER      sand scaleX wipe → transformOrigin flip → clipPath reveal
1  HERO           home.jpeg full-bleed
                    A U R O R A                    Archivo 300, tracked
                    THE SUN KISSED                 Archivo 200, clamp to 11vw
                    Collection                     PINYON #1, overlapping
                  vertical marquee rails, both edges, desktop only
2  ANATOMY        ██ PINNED — 192-frame canvas scrub ██
                  3 craft claims phased against frame progress
3  THE EIGHT      knockouts on paper; hover → ground tweens to that colourway
4  EDITORIAL      full-bleed model4 + PINYON #2 pull-quote, sand-grain reveal
5  CRAFT TEASER   3 columns, CountUp
6  JOURNAL STRIP  model1 / model2 / model3 staggered, parallax
7  CLOSING        PINYON #3 + shop CTA
8  FOOTER         sand band
```

**Hero type placement.** `home.jpeg` is 2752×1536 with the model bottom-right
and open wet sand across the top-left. Type anchors top-left. Because the sand
measures `#a18f7e`–`#a79685` (mid-tone, not light), hero type is `--paper` with
a soft scrim: `linear-gradient(105deg, rgba(27,24,25,.34), transparent 58%)`.
Contrast verified ≥ 4.5:1 against the darkest sampled sand.

**Anatomy choreography.** One pinned ScrollTrigger, 400svh, following the
`svhToProgress` + `mapRange` pattern from `templates/MaximaTherapy`:

| Progress | Event |
|---|---|
| 0–15% | canvas `clipPath: circle(6% → 100%)` (splyt pattern) |
| 15–85% | frames 0 → 191 scrubbed |
| 20–40% | claim 1 — "Seventeen pieces." |
| 45–65% | claim 2 — "One pair of hands." |
| 70–88% | claim 3 — fabric line |
| 88–100% | copy fades, unpin |

Canvas repaints **only when the frame index changes** — never per scroll event
(see `glow-cycling-perf-pitfall`).

### 6.2 Shop

Header: `EIGHT SHADES. ONE SILHOUETTE.` Grid 4×2 desktop / 2×4 tablet / 1×8
mobile. Each card: knockout (multiply), name, `CAD $198.00`, fabric-gradient
swatch.

Two distinct interactions, easy to conflate:

- **Hover or keyboard focus** tweens the section ground to that colourway and
  lifts the card — translate, shadow, slight tilt.
- **Pointer leaving the card** hands its velocity to InertiaPlugin, so the card
  is thrown and settles back to rest rather than snapping. Pointer only; the
  keyboard path is a plain tween back.

No model photography on this page.

### 6.3 Product — `/shop/:slug`

Full-viewport ground tinted to the colourway. Left: knockout floating on the
ground, multiply-blended, idle float + parallax. Right: name, price, size
selector (XS S M L), add to bag, then accordions — **Fabric & Care**,
**Shipping & Returns**, **Fit Notes**.

Below: **The Other Seven** — a pinned horizontal rail (splyt `FlavorSlider`
pattern) of the remaining colourways. Selecting one **navigates to that
colourway's URL** (`/shop/kelp`), so every colourway stays independently
linkable and shareable. The ground tween survives the navigation because
`GroundProvider` sits *above* the router outlet — the route component remounts,
the ground does not. Combined with the fade-and-scale page transition, the
visible effect is the colour flowing from one product into the next.

No model photography on this page.

### 6.4 Craft

Archivo only. Long-form process copy, CountUp stats, macro detail crops taken
from the knockout sources. One full-bleed model band is permitted here because
no colourway is named anywhere near it.

### 6.5 Journal

The four model photographs as a proper editorial spread — captions, shot notes,
no prices, no colour names, no add-to-bag. This is where "proof and appeal"
lives without creating a colour-match expectation.

### 6.6 Fit

Measurement table (bust / waist / hip, XS–L), how-to-measure diagram,
model-height reference, between-sizes guidance.

### 6.7 Contact

Formspree via `VITE_FORM_ENDPOINT`, falling back to `mailto:`. Studio location,
response time, custom-commission note.

### 6.8 Checkout

Order summary only, per decision. Editable quantities, live subtotal / shipping
/ total, `Intl.NumberFormat('en-CA')` money formatting, and a disabled pay
button with an explanatory line.

**Stripe seam.** The payment block is isolated as
`src/components/checkout/PaymentBlock.jsx` with a header comment naming the
exact swap: replace the disabled button with Stripe's `<PaymentElement />` and
post the cart to a `/api/checkout` handler. No keys, no server, no Stripe
dependency in `package.json`.

---

## 7. Motion system

### 7.1 Foundation

- **Lenis** ↔ **ScrollTrigger** wired with the canonical Truus pattern:
  `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t * 1000))`,
  `gsap.ticker.lagSmoothing(0)`. Instance exposed on a context, not `window`.
- **`useGSAP`** from `@gsap/react` in every animated component, scoped to a ref,
  so animations self-clean on unmount. Non-negotiable in a routed app.
- GSAP **3.15** — `SplitText`, `InertiaPlugin` and `ScrollSmoother` are free as
  of 3.13 and present in the installed package. No Club licence needed.

### 7.2 Inventory

| # | System | Source |
|---|---|---|
| 1 | Lenis smooth scroll | Truus |
| 2 | `useGSAP` scoped contexts | splyt |
| 3 | 192-frame pinned canvas scrub | MaximaTherapy + Lamborghini |
| 4 | `@property` colour-tween ground | **bespoke** |
| 5 | `SplitText` line/char reveals, `mask:"lines"` | GSAP 3.15 |
| 6 | `gsap.quickTo` cursor with contextual label | Truus |
| 7 | Multi-speed parallax | bespoke |
| 8 | Fade + scale page transitions | bespoke |
| 9 | Knockout card inertia throw-settle | Truus |
| 10 | Vertical marquee rails | Truus |
| 11 | Scroll-progress hairline | bespoke |
| 12 | CountUp | repo primitive |
| 13 | Nav shrink + invert over dark bands | bespoke |
| 14 | ClipPath title wipes | splyt |
| 15 | Spring cart drawer | bespoke |
| 16 | Sand-grain photo reveal | AINO architecture, re-skinned |
| 17 | Pinned horizontal colour rails | splyt |
| 18 | Preloader wipe | Steelworks |

### 7.3 The colour-tween ground

A flat `background-color` transition would be enough for a solid fill, but the
ground is a soft radial wash, and gradients do not interpolate without
registered custom properties. Hence:

```css
@property --ground      { syntax: '<color>'; inherits: true; initial-value: #EFEDE7 }
@property --ground-soft { syntax: '<color>'; inherits: true; initial-value: #EFEDE7 }

.ground {
  background: radial-gradient(120% 80% at 50% 0%, var(--ground-soft), var(--paper) 70%);
  transition: --ground var(--dur-ground) var(--ease-glide),
              --ground-soft var(--dur-ground) var(--ease-glide);
}
```

Set from JS via `el.style.setProperty('--ground', hex)`. `--ground-soft` is the
colourway mixed to ~12% over paper, precomputed in the product data so no
runtime colour maths is needed. Where `@property` is unsupported the colour
snaps instead of tweening — acceptable degradation, no broken layout.

### 7.4 Reduced motion and mobile

Every system has a `prefers-reduced-motion: reduce` path. Specifically:

- Anatomy renders three static key frames (0, 96, 191) and **does not request
  the other 189**.
- Mobile (< 768px) uses the same three-frame treatment, gated by
  `useMediaQuery` in JS — not CSS `display:none`, so the frames are never
  fetched.
- Parallax, inertia, cursor and marquees disable entirely; reveals become
  instant opacity.

---

## 8. Media pipeline — `npm run prepare-media`

Runs `ffmpeg-static`. Sources stay in `media-src/`, git-ignored; outputs land in
`public/` and are committed so the repo is clone-and-run.

### 8.1 Knockout — mandatory

The eight product shots sit on a **~215 grey** backdrop (measured: corners
213–217 across all eight), not white. Dropped on a tinted ground they read as a
grey rectangle. Measured shadow floor under the garment: **175**.

LUT: identity below 168 so the shadow survives, then ramp 168 → 204 up to pure
white, clamping above.

```
lutrgb=r='if(lt(val,168),val,if(gt(val,204),255,168+(val-168)*2.4167))':g=…:b=…
```

**The ceiling is 204, not 212.** An averaged corner sample suggested the backdrop
bottomed out near 212, but the true *per-pixel* minimum across every still and
every frame is **205**. A 212 ceiling therefore left real backdrop pixels short
of pure white, which shows as grey speckle once multiplied. After the change all
eight products return `255,255,255` as a per-channel minimum over large backdrop
strips, and the drop shadow survives at 175–177.

Only images through this LUT get `knockout: true` in the data, and only those
are ever `multiply`-blended. Blending an unprocessed photo blows out skin tones.

**Hard constraint: knockouts may only sit on light grounds.** `multiply`
multiplies the *garment* by the ground too, not just the backdrop. For the seven
dark or saturated colourways that is invisible. For **Salt**, a white garment, it
is fatal: composited onto the sand band (`#A79685`) the bikini renders
sand-coloured, so a customer viewing "Salt" would see a beige product. Verified
by compositing exactly as a browser would.

Every `groundSoft` value is a 12% tint over paper, which is light enough that all
eight composite correctly. Nothing else is permitted behind a knockout — never
the sand band, never a full-strength colourway.

Alpha matting was prototyped as an alternative and **rejected**: the white
garment's mid-tones overlap the backdrop luma band and form large contiguous
regions, so no luma key can separate them. Three approaches were tried
(threshold, flood-fill with morphological closing, large-region classification);
each either hollowed out the white garment or filled the enclosed halter loop.

### 8.2 Product crops — measured

The garment occupies an **identical box in all eight files**: `x 1048–1696,
y 184–1384` (648×1200) inside 2752×1536. That is 23% of the frame width, so a
naive `object-fit: cover` would render mostly empty backdrop.

Crops, centred on that box with ~16% breathing room, verified visually:

```
4:5  crop=1114:1392:815:88  → scale=880:1100
1:1  crop=1392:1392:676:88  → scale=1100:1100
```

### 8.3 Frame extraction — measured

**`expand.mp4` is an exploded technical diagram, not a simple disassembly.** The
garment separates into multiple copies with thin annotation lines radiating
outward; by the closing frames those lines reach every edge and sweep all four
corners (measured: frame 173 places one at 1140,572). This is *better* than
assumed for a section called Anatomy — it literally is an anatomy diagram — but
it has one consequence: **no region of the frame is backdrop across all 192**, so
the knockout cannot be verified by sampling a strip. See §8.5.

Note the closing frames also introduce gold and cream pieces that match none of
the eight colourways. Acceptable — the sequence is a craft illustration, not a
product listing — but it must never be presented as a colour reference.

**The source has a per-frame black letterbox.** Frame 0 carries a 3px black band
top and bottom; frame 191 carries none. Across all 192 frames the worst case is
3 rows top and 3 bottom, and 135 frames have none at all. A fixed crop tuned to
one frame leaves black slivers on others.

Fix: crop 4px off the top and bottom of **every** frame — `crop=1280:712:0:4`.
Guaranteed clean on all 192, costs 1.1% of height, invisible.

Frames then take the **same knockout LUT as the stills**, because the video
backdrop measures ~216 grey, identical to the product shots. This is what lets
the sequence sit on the paper ground with no visible plate.

Output is **native 1280×712** — the source is 1280 wide, so any upscale is
wasted bytes. webp q80, measured at **~12 KB per frame, ~2.3 MB for all 192**.

Loading: preload the first 16, background-load the rest, hold frame 0 as a
static `<img>` until 24 frames have decoded.

### 8.4 Other outputs

Resize hero and model shots to web sizes, emit webp plus a blurred LQIP.

### 8.5 Verifying the knockout

`scripts/verify-knockout.mjs` gates the pipeline and must pass before any
downstream work. Two different checks, because the two sources differ:

- **Products** — per-channel **minimum** over large backdrop strips, which must
  be exactly `255,255,255`. Deliberately not an average: the first version of
  this script averaged a 40×40 corner to one pixel and reported a clean pass
  while individual pixels were still short of white. A single sub-255 pixel stays
  visible as grey speckle after multiplying, so the minimum is the only figure
  that means anything.
- **Frames** — a **distributional** check, since no strip is backdrop on all 192.
  Backdrop dominates every frame, so pure white must be the modal value and
  cover >50% of pixels. Measured: 87–96% white, mode 255 on every frame sampled.
- **Shadow** — confirm the darkest pixel under the garment is still below 250, so
  a future LUT change cannot silently flatten the drop shadow.

### 8.3 Canvas letterboxing

The frames are drawn contain-fit at `FRAME_PAD ≈ 0.86` so the exploded pieces
never touch the edge, then the frame's own edge rows, columns and corners are
stretched into the letterbox margins. Proven on the Lamborghini demo; handles
every viewport aspect with no seam. A flat white fill would *probably* work here
since the studio background is near-uniform, but edge-extend costs nothing extra
and carries no risk.

---

## 9. Data model

`src/data/products.js` — the single source of truth.

```js
{
  slug:       'ember',
  name:       'Ember',
  file:       '/images/products/ember',   // .webp, plus -4x5 and -1x1
  hex:        '#8c1b26',
  hexLight:   '#9f3740',
  groundSoft: '#e3d4d0',                  // DERIVED — see below
  note:       'Deep wine red, the last light of the day.',
  knockout:   true,
  priceCents: 19800,
  currency:   'CAD',
}
```

`groundSoft` is **derived from `hex`**, not written by hand: `groundSoftFor(hex)`
mixes the colourway `GROUND_MIX` (0.12) over paper. It was hand-authored at
first and 7 of the 8 literals had drifted from the documented ratio by up to 10
levels, which no test could detect — the data was the only statement of what the
values should be. Deriving it makes that class of drift impossible, and the
ratio is asserted in `tests/products.test.js`.

Money is stored in cents and formatted with
`Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' })`. Sizes are
a shared constant `['XS','S','M','L']`.

---

## 10. Component inventory

```
src/
  smooth/      SmoothScroll  lenisContext
  motion/      SplitReveal  ClipTitle  GrainReveal  Parallax  MarqueeRail
               CountUp  PageTransition  Cursor  Preloader
  ground/      GroundProvider  useGround
  cart/        CartProvider  cartReducer  CartDrawer
  components/  Nav  Footer  KnockoutCard  ColourRail  Accordion
               SizeSelector  Field  PillButton  SectionLabel
  components/checkout/  OrderSummary  PaymentBlock
  sections/    Hero  Anatomy  TheEight  Editorial  CraftTeaser
               JournalStrip  Closing
  routes/      Home  Shop  Product  Craft  Journal  Fit  Contact  Checkout
  data/        products.js  content.js  fit.js
  lib/         format.js  useMediaQuery.js  useReducedMotion.js
  styles/      tokens.css  motion.css  base.css
```

Each unit does one thing, is used through a named export, and can be reasoned
about without reading its siblings.

---

## 11. Known traps

Carried forward from `product-shot-knockout-and-blend-traps` and confirmed
against the harvested template code.

1. **Any `transform` between a blended image and its band isolates the blend**
   and the grey box returns. This collides directly with the Truus
   InertiaPlugin card pattern. **Resolution:** inertia goes on the card
   wrapper; the `<img>` carries an explicit `--plate` background matching the
   current ground. Float animations go on the `<img>`, never its stage.
2. **Page transitions fade and scale — never slide.** A slide is a transform on
   an ancestor of every blended image on the page.
3. **`border-radius` on a plate whose colour equals the band** shows as faint
   corner arcs, because JPEG noise leaves image corners a shade under 255.
   Square off every knockout plate.
4. **`<img width height>` beats `aspect-ratio`.** Reset with
   `:where(img[width][height]) { height: auto }` — `:where()` zeroes
   specificity so component rules that want a real height still win.
5. **All twelve photographs are landscape** (2752×1536 / 1280×720). No portrait
   crop exists. No layout may require a vertical shot; tall slots get
   per-image `object-position` or are not used.
6. **Canvas repaints only on frame-index change.** No animated filters, glows
   or box-shadows on scroll — transform and opacity only.
7. **The video letterbox varies per frame.** 3px on some frames, 0px on 135 of
   them. Never crop the sequence to a box measured from a single frame; always
   take the uniform 4px off top and bottom.
8. **`multiply` tints the garment, not just the backdrop.** Salt is white, so on
   any non-light ground it renders as that ground's colour. Knockouts sit on
   `groundSoft` tints only — never the sand band, never a full-strength
   colourway. See §8.1.
9. **Never verify an image by averaging a patch.** Averaging hides exactly the
   per-pixel failures that ruin a blend. Take minimums, or check the
   distribution. This cost a full debugging cycle already.

---

## 12. Accessibility

- Contrast ≥ 4.5:1 for body text, ≥ 3:1 for large display, verified against
  each of the eight grounds — Salt and Horizon are the light-ground risks and
  force `--ink` rather than a tinted text colour.
- The colour-tween is decorative; colour is never the sole carrier of meaning.
  Every swatch has a visible text name.
- Full keyboard path: focus-visible rings, focus tweens the ground exactly as
  hover does, cart drawer traps focus and restores it on close.
- Cursor is `pointer: fine` only; the native cursor is never hidden on touch.
- Anatomy copy exists as real text in the DOM, not painted into the canvas.
- Route changes move focus to the page `<h1>` and announce via a live region.

---

## 13. Testing

Vitest:

- `cartReducer` — add, increment, remove, size variants, total in cents.
- Product data integrity — exactly 8 entries, unique slugs, valid 6-digit hex
  for `hex`/`hexLight`/`groundSoft`, every `file` resolves, all `knockout: true`.
- `format.js` — CAD formatting from cents.
- **Font rule** — `--font-display` appears only in `sections/Hero`,
  `sections/Editorial`, `sections/Closing` and `styles/tokens.css`.

Manual verification in Playwright at 360×740, 768×1024, 1440×900, 1920×1080 and
a portrait desktop, plus a `prefers-reduced-motion` pass, before completion is
claimed.

---

## 14. Out of scope

Real payment processing, a backend, user accounts, inventory, a CMS, i18n,
search, reviews, and any third-party analytics.

---

## 15. Open items for client sign-off

To be tracked as a checklist in `CONTENT.md`. Every one is a
factual claim that must be confirmed before launch.

- [ ] Price — CAD $198.00
- [ ] Fabric composition, weight, and mill or origin
- [ ] Lining and construction details
- [ ] Studio city and country
- [ ] Made-to-order lead time
- [ ] Size range and the measurement table
- [ ] Shipping rates, destinations, returns window
- [ ] Care instructions
- [ ] Email address, social handles, business name
- [ ] Colourway names — the poetic set, or the client's own
- [ ] Photography usage rights and model releases
