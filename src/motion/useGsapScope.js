import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { useReducedMotion } from '../lib/useReducedMotion.js';

/** Runs `setup(scopeEl)` inside a GSAP context scoped to the returned ref, so
 *  every tween and ScrollTrigger it creates is reverted on unmount. Skips setup
 *  entirely under prefers-reduced-motion, which is why sections must render
 *  their finished visual state in markup and treat animation as enhancement. */
export function useGsapScope(setup, deps = []) {
  const scope = useRef(null);
  const reduced = useReducedMotion();

  useGSAP(() => {
    if (reduced || !scope.current) return undefined;
    // Return the setup's own cleanup so useGSAP runs it on unmount. Without
    // this, things GSAP cannot revert by itself — a SplitText's injected line
    // wrappers, for instance — would leak on every route change.
    return setup(scope.current);
  }, { scope, dependencies: [...deps, reduced] });

  return scope;
}
