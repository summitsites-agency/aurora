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
