# AURORA — content sign-off

Every line below is a factual claim rendered on the live site. None has been
confirmed by the client. Tick each one before launch, or replace the value.

Copy written for this build is plausible for a premium handmade swim label but
is **placeholder until signed off**.

## Commerce
- [ ] Price — **CAD $198.00**, identical across all seven colourways.
      Chosen from Canadian handmade-premium comparables (Left On Friday ≈ $230
      a set; Jade Swim and Matteau ≈ $245 converted). Change in
      `src/data/products.js`.
- [ ] Currency is CAD and the store ships from Canada
- [ ] Shipping rates, destinations and free-shipping threshold
- [ ] Returns window and conditions

## Product
- [ ] Colourway names — Eclipse, Driftwood, Midnight, Kelp, Horizon, Clay,
      Ember. These describe the fabric as photographed; the file named
      `pink.jpeg` is a dusty clay-rose and `red.jpeg` is a wine-crimson.
- [ ] **Salt was retired on 2026-09-11** at the client's request, taking the
      range from eight to seven. Its product images were deleted and all
      "eight" copy rewritten to "seven". `--paper` in `tokens.css` is still
      the old Salt hex and was deliberately left alone — every `groundSoft`
      is derived by mixing over it, so changing it moves all seven grounds.
- [ ] Fabric composition, weight and mill or country of origin
- [ ] Lining and construction details
- [ ] **New construction claims added 2026-09-11** on `/anatomy` ("What the
      pieces are") and `/shop`. None is confirmed and all are plausible-sounding
      specifics, which makes them the most dangerous kind of placeholder:
      - fully lined front and back in the **same weight** as the shell, not a
        lighter mesh
      - seams **overlocked then topstitched flat**
      - ties **cut on the same grain as the body**
      - every set **cut to order**, not pulled from stock
      If any is wrong it is a returnable-goods problem, not a copy problem.
- [ ] Size range (XS-L) and the fit notes shown on each product page
- [ ] Care instructions

## Brand
- [ ] Studio city and country
- [ ] Made-to-order lead time
- [ ] Registered business name for the footer
- [ ] **The site has no contact route as of 2026-09-11** — `/contact` was
      removed at the client's request, along with the placeholder email, the
      two-working-day reply promise and the made-to-measure commissions copy.
      There is now no way for a visitor to reach the business. Confirm this is
      intended before launch, or restore a contact surface.

## Legal
- [ ] Photography usage rights
- [ ] Model releases for all four editorial images

## Technical
- [ ] The page `<title>` is the bare word `AURORA` by explicit client choice
      (confirmed 2026-09-10). Do not "fix" this to `AURORA — Handmade
      Swimwear` — it was changed deliberately and reverted by mistake twice
      already. The descriptor lives in the meta description instead.
- [ ] The favicon is the seashell emblem cropped out of `media-src/Logo.jpeg`
      by `scripts/media/logo.mjs`. The client's file is a **presentation
      mockup** — the logo photographed on textured cream paper — not a usable
      logo asset. Two consequences: the fine ring and shell lines soften at
      tab size (the 32px icon drops the ring and lifts contrast to compensate),
      and the mark cannot be placed on any non-cream surface without showing
      its own rectangle, which is why the footer masks it to a circular seal.
      **Ask the client for the vector (SVG/AI/EPS) before launch.**
- [ ] `/favicon.ico` still 404s. Only PNG icons are linked, which every
      current browser honours, but a bare `/favicon.ico` request is not served.
