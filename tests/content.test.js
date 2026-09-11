import { describe, it, expect } from 'vitest';
import { home, craft, journal, contact } from '../src/data/content.js';

describe('site copy', () => {
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


  it('flags every factual claim for client sign-off', () => {
    // Anything asserting a fact about the business carries needsSignoff so it
    // can be reconciled with CONTENT.md before launch.
    expect(home.claims.every((c) => typeof c.needsSignoff === 'boolean')).toBe(true);
    expect(home.claims.some((c) => c.needsSignoff)).toBe(true);
  });

  it('has craft sections with a title and body', () => {
    expect(craft.sections.length).toBeGreaterThanOrEqual(3);
    for (const s of craft.sections) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
  });

  it('captions every journal plate', () => {
    expect(journal.plates).toHaveLength(4);
    for (const p of journal.plates) {
      expect(p.src).toMatch(/^\/images\/photo\/model[1-4]-\d+\.webp$/);
      expect(p.alt.length).toBeGreaterThan(0);
      expect(p.caption.length).toBeGreaterThan(0);
    }
  });

  it('never puts a price next to editorial photography', () => {
    // The model shots wear a tan suit that is not one of the eight colourways.
    // Pairing them with a price would promise a match that does not exist.
    const text = JSON.stringify(journal);
    expect(text).not.toMatch(/\$|price|priceCents/i);
  });

  it('gives contact a real mailto fallback', () => {
    expect(contact.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });
});
