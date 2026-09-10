import { describe, it, expect } from 'vitest';
import { countUpValue } from '../src/motion/CountUp.jsx';

describe('countUpValue', () => {
  it('starts at zero', () => {
    expect(countUpValue(0, 17)).toBe(0);
  });

  it('lands exactly on the target', () => {
    expect(countUpValue(1, 17)).toBe(17);
  });

  it('eases out — past halfway at the midpoint', () => {
    expect(countUpValue(0.5, 100)).toBeGreaterThan(50);
  });

  it('returns integers throughout', () => {
    for (const p of [0.1, 0.33, 0.7, 0.99]) {
      expect(Number.isInteger(countUpValue(p, 17))).toBe(true);
    }
  });
});
