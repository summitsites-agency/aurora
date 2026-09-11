/** Homepage copy, in one place so every factual claim is reviewable against
 *  CONTENT.md. NOTHING here has been confirmed by the client — see `claims`. */
export const home = {
  hero: {
    line1: 'The Sun Kissed',
    script: 'Collection',          // the ONLY Pinyon on the hero
    cta: 'View all',
    /** No standfirst. It was cut from desktop, then from mobile too — the hero
     *  is the headline, the script and the CTA. The line still runs in the
     *  marquee rails and the meta description. */
  },

  collection: {
    label: 'The collection',
    title: 'Seven shades. One silhouette.',
    body: 'The same considered cut, dyed seven ways. Choose the one you will actually live in.',
  },

  /** Every assertion of fact on this page. Mirror into CONTENT.md.
   *  The construction claims moved to the Anatomy page with the scrub, and the
   *  film claim moved with the editorial band into the global furniture. */
  claims: [],
};

/** The editorial band. Global furniture, not homepage copy — it renders above
 *  the footer on every route, so it lives at the top level rather than under
 *  `home`. Pinyon #2 of 3. */
export const editorial = {
  script: 'Made for the water',
  body: 'Photographed on film at golden hour, unretouched.',
  claims: [
    { id: 'film', text: 'shot on film, unretouched', needsSignoff: true },
  ],
};

/** The Shop page head. Sits above the grid, so it is the last thing read
 *  before the photography. `notes` are the three questions the PDP answers
 *  further down — surfaced here so the grid is not the first place anyone
 *  learns the suit is made to order. Unconfirmed; see `claims`. */
export const shop = {
  label: 'The collection',
  title: 'Seven shades. One silhouette.',
  body: 'The same considered cut, dyed seven ways. Every piece is made to order.',
  notes: [
    { term: 'Made to order', detail: 'Each set is cut after you buy it, not pulled from a shelf.' },
    { term: 'Fully lined',   detail: 'Front and back, in the same Italian knit as the shell.' },
    { term: 'Sizes XS–L',    detail: 'Fit notes and measurements sit on every product page.' },
  ],
  claims: [
    { id: 'made-to-order', text: 'cut to order, not stocked',      needsSignoff: true },
    { id: 'lined',         text: 'fully lined in the shell fabric', needsSignoff: true },
    { id: 'sizes',         text: 'size range XS-L',                 needsSignoff: true },
  ],
};

/** The global footer. `script` was the homepage Closing section's line — it is
 *  now site-wide, which is the one place Pinyon leaves the homepage. Client's
 *  call; see the Pinyon note in docs/design-spec.md. */
export const footer = {
  script: 'Yours for a very long time',
  name: 'Aurora',
  descriptor: 'Swimwear',
};

/** The Anatomy page — the pinned frame scrub that used to sit on the homepage.
 *  `steps` is display copy pinned to the scrub windows; `claims` is the
 *  sign-off mirror, same split as `craft`. */
export const anatomy = {
  label: 'The anatomy',
  title: 'Inside the suit.',
  standfirst: 'One set, taken apart piece by piece.',
  steps: [
    { title: 'Seventeen pieces.', body: 'Every set is cut from seventeen separate pattern pieces, by hand, one at a time.' },
    { title: 'One pair of hands.', body: 'A single maker sees each set from first cut to final stitch. No production line.' },
    { title: 'Italian fabric.',    body: 'A dense, high-recovery knit that holds its shape wet, dry, and season after season.' },
  ],

  /** Read after the scrub. Deliberately about construction rather than
   *  marketing — the scrub shows the garment coming apart, this says what the
   *  parts are. Every line is an unconfirmed assertion; see `claims`. */
  build: {
    label: 'What the pieces are',
    title: 'Where a set gains and loses its shape.',
    rows: [
      {
        term: 'The shell',
        detail:
          'A dense Italian knit, matte on the face and smooth against the ' +
          'skin. High recovery is the whole point: it is what stops a set ' +
          'bagging at the seat after an afternoon in salt water.',
      },
      {
        term: 'The lining',
        detail:
          'Fully lined front and back in the same weight, not a lighter ' +
          'mesh. It doubles the fabric everywhere, which is why the colour ' +
          'holds when wet instead of going sheer.',
      },
      {
        term: 'The seams',
        detail:
          'Overlocked, then topstitched flat. The second pass is what keeps ' +
          'an edge from rolling, and it is the slowest part of the make.',
      },
      {
        term: 'The ties',
        detail:
          'Cut on the same grain as the body so they stretch at the same ' +
          'rate. Cut across it and they lengthen over a season while the ' +
          'cups do not.',
      },
    ],
  },

  /** The one thing the scrub cannot show: what it costs in time. Set in
   *  Archivo, NOT the display face — Pinyon is rationed to three appearances
   *  site-wide and all three are spoken for (hero, editorial, footer). */
  coda: {
    line: 'Seventeen pieces, one pair of hands.',
    body: 'Made to order, which is why it takes as long as it takes.',
  },

  claims: [
    { id: 'pieces',   text: '17 pattern pieces per set',       needsSignoff: true },
    { id: 'maker',    text: 'one maker per set, no line',      needsSignoff: true },
    { id: 'fabric',   text: 'Italian high-recovery knit',      needsSignoff: true },
    { id: 'lined',    text: 'fully lined front and back, same weight', needsSignoff: true },
    { id: 'seams',    text: 'overlocked then topstitched flat', needsSignoff: true },
    { id: 'grain',    text: 'ties cut on the body grain',       needsSignoff: true },
    { id: 'to-order', text: 'made to order',                    needsSignoff: true },
  ],
};

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
 *  these photographs is a tan that is NOT one of the seven colourways, so any
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

