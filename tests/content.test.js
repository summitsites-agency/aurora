import { describe, it, expect } from 'vitest';
import { home } from '../src/data/content.js';

describe('homepage copy', () => {
  it('has a hero with the script word isolated', () => {
    expect(home.hero.kicker).toBe('Aurora');
    expect(home.hero.line1).toBe('The Sun Kissed');
    expect(home.hero.script).toBe('Collection');
  });

  it('has exactly three anatomy claims', () => {
    expect(home.anatomy.claims).toHaveLength(3);
    for (const c of home.anatomy.claims) {
      expect(c.title.length).toBeGreaterThan(0);
      expect(c.body.length).toBeGreaterThan(0);
    }
  });

  it('has three craft stats with numeric values', () => {
    expect(home.craft.stats).toHaveLength(3);
    for (const s of home.craft.stats) expect(typeof s.value).toBe('number');
  });

  it('flags every factual claim for client sign-off', () => {
    // Anything asserting a fact about the business carries needsSignoff so it
    // can be reconciled with CONTENT.md before launch.
    expect(home.claims.every((c) => typeof c.needsSignoff === 'boolean')).toBe(true);
    expect(home.claims.some((c) => c.needsSignoff)).toBe(true);
  });
});
