import { describe, it, expect } from 'vitest';
import { formatPrice } from '../src/lib/format.js';

describe('formatPrice', () => {
  it('formats cents as CAD with two decimals', () => {
    expect(formatPrice(19800)).toBe('$198.00');
  });

  it('formats zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('groups thousands', () => {
    expect(formatPrice(158400)).toBe('$1,584.00');
  });
});
