import { describe, it, expect } from 'vitest';
import { titleFor } from '../src/lib/useDocumentTitle.js';

describe('titleFor', () => {
  it('leaves the homepage as the bare brand name', () => {
    // Client's explicit choice — do not add a descriptor here.
    expect(titleFor(null)).toBe('AURORA');
  });

  it('prefixes every other page', () => {
    expect(titleFor('Shop')).toBe('Shop — AURORA');
    expect(titleFor('The Craft')).toBe('The Craft — AURORA');
  });

  it('uses the colourway name on a product page', () => {
    expect(titleFor('Ember')).toBe('Ember — AURORA');
  });
});
