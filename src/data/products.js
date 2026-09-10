/** The eight colourways. One silhouette, eight dye lots.
 *  hex / hexLight are sampled from the client's product photography;
 *  groundSoft is hex mixed ~12% over --paper (#EFEDE7). */
export const products = [
  {
    slug: 'eclipse', name: 'Eclipse',
    hex: '#1b1819', hexLight: '#3f3a3a', groundSoft: '#dad7d2',
    note: 'The deepest black we can dye without losing the sheen.',
  },
  {
    slug: 'driftwood', name: 'Driftwood',
    hex: '#4f352a', hexLight: '#714f42', groundSoft: '#e3dcd3',
    note: 'Warm bark brown, the colour of sun-bleached wood.',
  },
  {
    slug: 'midnight', name: 'Midnight',
    hex: '#312d50', hexLight: '#4b4365', groundSoft: '#dedbd9',
    note: 'Indigo with a violet cast, like water just after sunset.',
  },
  {
    slug: 'kelp', name: 'Kelp',
    hex: '#2d3829', hexLight: '#44503f', groundSoft: '#dcdcd4',
    note: 'Deep sea-green that reads almost black in shade.',
  },
  {
    slug: 'horizon', name: 'Horizon',
    hex: '#6d90b0', hexLight: '#c0d4e4', groundSoft: '#e7e9e8',
    note: 'The blue where the sky meets the water.',
  },
  {
    slug: 'clay', name: 'Clay',
    hex: '#a14c4b', hexLight: '#b35b59', groundSoft: '#ebe3dd',
    note: 'Sun-warmed terracotta with a rose undertone.',
  },
  {
    slug: 'ember', name: 'Ember',
    hex: '#8c1b26', hexLight: '#9f3740', groundSoft: '#e8ded9',
    note: 'Deep wine red, the last light of the day.',
  },
  {
    slug: 'salt', name: 'Salt',
    hex: '#dcdbd8', hexLight: '#efefee', groundSoft: '#eeece7',
    note: 'Barely off-white, like sea salt dried on skin.',
  },
].map((p) => ({
  ...p,
  priceCents: 19800,
  currency: 'CAD',
  knockout: true,
  image: {
    card: `/images/products/${p.slug}-4x5.webp`,
    square: `/images/products/${p.slug}-1x1.webp`,
  },
}));

export const bySlug = (slug) => products.find((p) => p.slug === slug);
