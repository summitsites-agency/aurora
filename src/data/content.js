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
