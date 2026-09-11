import { describe, it, expect, afterEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { useMediaQuery, useIsDesktop, useIsFinePointer } from '../src/lib/useMediaQuery.js';
import { useReducedMotion } from '../src/lib/useReducedMotion.js';
import { setMatchMedia, resetMatchMedia } from './setup.js';

afterEach(() => {
  cleanup();
  resetMatchMedia();
});

/** Records the hook's value on every render pass.
 *
 *  Asserting on the DOM instead would prove nothing: `render` wraps in `act`,
 *  which flushes effects and re-renders, so the markup shows the corrected
 *  value even when the first render was wrong. The bug being guarded lives
 *  entirely in that first pass. */
function probe(hook) {
  const seen = [];
  const Probe = () => {
    seen.push(hook());
    return null;
  };
  render(<Probe />);
  return seen;
}

describe('useMediaQuery', () => {
  it('reports a matching query on the very first render', () => {
    // Regression guard. This was `useState(false)` with an effect to correct
    // it, so the first render of every consumer answered "false" regardless of
    // the truth. `useGsapScope` gates on `useReducedMotion`, so that one frame
    // was enough to run the setup, stamp the hidden state onto elements and
    // register a ScrollTrigger that outlived the correction — reduced-motion
    // users got the animation anyway.
    setMatchMedia(() => true);
    expect(probe(() => useMediaQuery('(min-width: 768px)'))[0]).toBe(true);
  });

  it('never reports a transitional wrong answer', () => {
    setMatchMedia(() => true);
    // Every pass agrees; there is no false-then-true flip to observe.
    expect(new Set(probe(() => useMediaQuery('(min-width: 768px)')))).toEqual(new Set([true]));
  });

  it('reports a non-matching query on the first render', () => {
    setMatchMedia(() => false);
    expect(probe(() => useMediaQuery('(min-width: 768px)'))[0]).toBe(false);
  });

  it('passes each helper its own query rather than a shared one', () => {
    // Guards against a refactor that collapses these onto one query string:
    // each must resolve independently or Anatomy's desktop gate and Magnetic's
    // pointer gate start answering each other's question.
    setMatchMedia((q) => q.includes('pointer'));
    expect(probe(useIsFinePointer)[0]).toBe(true);
    cleanup();
    expect(probe(useIsDesktop)[0]).toBe(false);
    cleanup();
    expect(probe(useReducedMotion)[0]).toBe(false);
  });

  it('reports reduced motion on the first render when the user asks for it', () => {
    setMatchMedia((q) => q.includes('prefers-reduced-motion'));
    expect(probe(useReducedMotion)[0]).toBe(true);
  });
});
