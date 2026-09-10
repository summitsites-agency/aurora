const cad = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
});

/** @param {number} cents */
export const formatPrice = (cents) => cad.format(cents / 100);
