import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { products } from '../src/data/products.js';
import { SIZES } from '../src/data/sizes.js';

const HEX = /^#[0-9a-f]{6}$/;

describe('product data', () => {
  it('has exactly eight colourways', () => {
    expect(products).toHaveLength(8);
  });

  it('has unique slugs', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(8);
  });

  it('has valid lowercase hex for every colour field', () => {
    for (const p of products) {
      expect(p.hex, p.slug).toMatch(HEX);
      expect(p.hexLight, p.slug).toMatch(HEX);
      expect(p.groundSoft, p.slug).toMatch(HEX);
    }
  });

  it('prices every colourway identically in CAD cents', () => {
    for (const p of products) {
      expect(p.priceCents).toBe(19800);
      expect(p.currency).toBe('CAD');
    }
  });

  it('marks every product as knocked out', () => {
    for (const p of products) expect(p.knockout, p.slug).toBe(true);
  });

  it('points at image files that exist', () => {
    for (const p of products) {
      for (const ratio of ['4x5', '1x1']) {
        const path = `public/images/products/${p.slug}-${ratio}.webp`;
        expect(existsSync(path), path).toBe(true);
      }
    }
  });

  it('offers four sizes', () => {
    expect(SIZES).toEqual(['XS', 'S', 'M', 'L']);
  });
});
