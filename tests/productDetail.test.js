import { describe, it, expect } from 'vitest';
import { detail, SHIPPING_CENTS, FREE_SHIPPING_OVER_CENTS } from '../src/data/productDetail.js';

describe('product detail copy', () => {
  it('has the three PDP accordions in order', () => {
    expect(detail.panels.map((p) => p.id)).toEqual(['fabric', 'shipping', 'fit']);
  });

  it('gives every panel a title and body', () => {
    for (const p of detail.panels) {
      expect(p.title.length).toBeGreaterThan(0);
      expect(p.body.length).toBeGreaterThan(0);
    }
  });

  it('flags every factual claim for client sign-off', () => {
    expect(detail.claims.length).toBeGreaterThan(0);
    expect(detail.claims.every((c) => typeof c.needsSignoff === 'boolean')).toBe(true);
  });

  it('states shipping in cents, not dollars', () => {
    expect(SHIPPING_CENTS).toBe(1200);
    expect(FREE_SHIPPING_OVER_CENTS).toBe(25000);
  });
});
