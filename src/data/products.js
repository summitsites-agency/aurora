/** The eight colourways. One silhouette, eight dye lots.
 *  hex / hexLight are sampled from the client's product photography.
 *
 *  groundSoft — the page ground behind a product — is DERIVED, not written by
 *  hand. Earlier it was hand-authored and 7 of the 8 values had drifted from
 *  the documented ratio by up to 10 levels, which no test could see. Deriving
 *  it makes that class of drift impossible. */
export const GROUND_MIX = 0.12;
const PAPER = [239, 237, 231]; // --paper #EFEDE7

const toRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const toHex = (rgb) =>
  `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, '0')).join('')}`;

/** Mix a colourway over paper. Exported so the test can assert the data
 *  matches the formula rather than trusting a literal. */
export const groundSoftFor = (hex) =>
  toHex(toRgb(hex).map((v, i) => GROUND_MIX * v + (1 - GROUND_MIX) * PAPER[i]));

export const products = [
  {
    slug: 'eclipse', name: 'Eclipse',
    hex: '#1b1819', hexLight: '#3f3a3a',
    note: 'The deepest black we can dye without losing the sheen.',
  },
  {
    slug: 'driftwood', name: 'Driftwood',
    hex: '#4f352a', hexLight: '#714f42',
    note: 'Warm bark brown, the colour of sun-bleached wood.',
  },
  {
    slug: 'midnight', name: 'Midnight',
    hex: '#312d50', hexLight: '#4b4365',
    note: 'Indigo with a violet cast, like water just after sunset.',
  },
  {
    slug: 'kelp', name: 'Kelp',
    hex: '#2d3829', hexLight: '#44503f',
    note: 'Deep sea-green that reads almost black in shade.',
  },
  {
    slug: 'horizon', name: 'Horizon',
    hex: '#6d90b0', hexLight: '#c0d4e4',
    note: 'The blue where the sky meets the water.',
  },
  {
    slug: 'clay', name: 'Clay',
    hex: '#a14c4b', hexLight: '#b35b59',
    note: 'Sun-warmed terracotta with a rose undertone.',
  },
  {
    slug: 'ember', name: 'Ember',
    hex: '#8c1b26', hexLight: '#9f3740',
    note: 'Deep wine red, the last light of the day.',
  },
  {
    slug: 'salt', name: 'Salt',
    hex: '#dcdbd8', hexLight: '#efefee',
    note: 'Barely off-white, like sea salt dried on skin.',
  },
].map((p) => ({
  ...p,
  groundSoft: groundSoftFor(p.hex),
  priceCents: 19800,
  currency: 'CAD',
  knockout: true,
  image: {
    card: `/images/products/${p.slug}-4x5.webp`,
    square: `/images/products/${p.slug}-1x1.webp`,
  },
}));

export const bySlug = (slug) => products.find((p) => p.slug === slug);
