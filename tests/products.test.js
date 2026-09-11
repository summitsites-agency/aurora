import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { products, groundSoftFor, GROUND_MIX } from '../src/data/products.js';
import { SIZES } from '../src/data/sizes.js';

const HEX = /^#[0-9a-f]{6}$/;

describe('product data', () => {
  it('has exactly seven colourways', () => {
    expect(products).toHaveLength(7);
  });

  it('has unique slugs', () => {
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(7);
  });

  it('no longer carries the retired Salt colourway', () => {
    expect(products.map((p) => p.slug)).not.toContain('salt');
  });

  it('has valid lowercase hex for every colour field', () => {
    for (const p of products) {
      expect(p.hex, p.slug).toMatch(HEX);
      expect(p.hexLight, p.slug).toMatch(HEX);
      expect(p.groundSoft, p.slug).toMatch(HEX);
    }
  });

  it('derives groundSoft from hex rather than hand-authored literals', () => {
    for (const p of products) {
      expect(p.groundSoft, p.slug).toBe(groundSoftFor(p.hex));
    }
  });

  it('mixes the ground at the documented ratio over paper', () => {
    // Guards the ratio itself, at both extremes rather than at whichever
    // colourway currently happens to be palest or darkest: a near-white ground
    // must stay distinguishable from bare paper, and a near-black one must not
    // tint so hard that the ground stops reading as paper.
    expect(GROUND_MIX).toBe(0.12);
    expect(groundSoftFor('#000000')).toBe('#d2d1cb'); // darkest possible ground
    expect(groundSoftFor('#ffffff')).toBe('#f1efea'); // lifts slightly above paper
    expect(groundSoftFor('#efede7')).toBe('#efede7'); // paper mixed with paper is paper
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
