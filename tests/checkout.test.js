import { describe, it, expect } from 'vitest';
import { shippingFor, orderTotals } from '../src/lib/totals.js';

const line = (qty) => ({ slug: 'ember', size: 'S', qty, priceCents: 19800 });

describe('shippingFor', () => {
  it('is free on an empty bag — nothing to ship', () => {
    expect(shippingFor(0)).toBe(0);
  });

  it('charges the flat rate below the threshold', () => {
    expect(shippingFor(19800)).toBe(1200);
  });

  it('is free at exactly the threshold', () => {
    expect(shippingFor(25000)).toBe(0);
  });

  it('is free above the threshold', () => {
    expect(shippingFor(39600)).toBe(0);
  });
});

describe('orderTotals', () => {
  it('totals a single line', () => {
    expect(orderTotals({ lines: [line(1)] })).toEqual({
      subtotalCents: 19800, shippingCents: 1200, totalCents: 21000,
    });
  });

  it('crosses the free-shipping threshold on quantity', () => {
    expect(orderTotals({ lines: [line(2)] })).toEqual({
      subtotalCents: 39600, shippingCents: 0, totalCents: 39600,
    });
  });

  it('zeroes an empty bag', () => {
    expect(orderTotals({ lines: [] })).toEqual({
      subtotalCents: 0, shippingCents: 0, totalCents: 0,
    });
  });
});
