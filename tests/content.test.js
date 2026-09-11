import { describe, it, expect } from 'vitest';
import * as content from '../src/data/content.js';

const { home, craft, journal, anatomy, editorial, shop } = content;

/** Every exported surface that carries a claims list. Derived rather than
 *  hand-listed, so a new surface cannot quietly skip the sign-off check. */
const CLAIM_SURFACES = Object.entries(content)
  .filter(([, v]) => v && Array.isArray(v.claims));

describe('site copy', () => {
  it('has a hero with the script word isolated', () => {
    expect(home.hero.line1).toBe('The Sun Kissed');
    expect(home.hero.script).toBe('Collection');
  });

  it('no longer carries a hero kicker', () => {
    // The AURORA kicker was removed: the fixed nav wordmark sits directly above
    // it, so the brand rendered twice, stacked. Re-adding the field would put
    // it back on screen.
    expect(home.hero.kicker).toBeUndefined();
  });

  it('has exactly three anatomy steps, one per scrub window', () => {
    // The scrub in sections/Anatomy.jsx hard-codes three CLAIM_WINDOWS. A
    // fourth step here would silently never fade in.
    expect(anatomy.steps).toHaveLength(3);
    for (const s of anatomy.steps) {
      expect(s.title.length).toBeGreaterThan(0);
      expect(s.body.length).toBeGreaterThan(0);
    }
  });


  it('flags every factual claim for client sign-off', () => {
    // Anything asserting a fact about the business carries needsSignoff so it
    // can be reconciled with CONTENT.md before launch. `home.claims` is
    // legitimately empty now — the film claim moved out with the editorial
    // band and the construction claims moved to the anatomy page — so this
    // checks the shape of every entry rather than demanding each surface have
    // one.
    for (const [name, surface] of CLAIM_SURFACES) {
      for (const claim of surface.claims) {
        expect(typeof claim.id, name).toBe('string');
        expect(claim.id.length, name).toBeGreaterThan(0);
        expect(typeof claim.text, name).toBe('string');
        expect(claim.text.length, name).toBeGreaterThan(0);
        expect(typeof claim.needsSignoff, name).toBe('boolean');
      }
    }
  });

  it('still has unsigned-off claims somewhere, and covers the new surfaces', () => {
    // The guard above passes trivially if every list is emptied. Nothing here
    // has client sign-off yet, so the total must not be zero.
    const all = CLAIM_SURFACES.flatMap(([, s]) => s.claims);
    expect(all.filter((c) => c.needsSignoff).length).toBeGreaterThan(0);

    // The editorial band and the shop head both assert facts and both were
    // added after the original sign-off sweep.
    expect(editorial.claims.length).toBeGreaterThan(0);
    expect(shop.claims.length).toBeGreaterThan(0);
  });

  it('gives every claim a unique id within its surface', () => {
    for (const [name, surface] of CLAIM_SURFACES) {
      const ids = surface.claims.map((c) => c.id);
      expect(new Set(ids).size, name).toBe(ids.length);
    }
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
    // The model shots wear a tan suit that is not one of the seven colourways.
    // Pairing them with a price would promise a match that does not exist.
    // Still true now the journal renders on the homepage rather than its own
    // page — it sits above the collection grid, which is where prices start.
    const text = JSON.stringify(journal);
    expect(text).not.toMatch(/\$|price|priceCents/i);
  });
});
