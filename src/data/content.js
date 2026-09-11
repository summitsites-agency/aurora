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
    { id: 'film',     text: 'shot on film, unretouched',       needsSignoff: true },
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
