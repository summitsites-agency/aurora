import { useEffect, useState } from 'react';

/** The initial value is read during render, NOT left false until an effect
 *  corrects it.
 *
 *  It used to be `useState(false)`, which made the first render of every
 *  consumer claim "no reduced motion, coarse pointer, not desktop" regardless
 *  of the truth. For `useReducedMotion` that was a real accessibility bug:
 *  `useGsapScope` gates on it, so on first render it saw `false`, ran the
 *  setup, and stamped the hidden state (opacity 0, y 34) onto elements — then
 *  the effect flipped the flag and the context reverted, but the ScrollTrigger
 *  it had already created survived. Reduced-motion users got the animation
 *  anyway. It also made `useIsDesktop` render Anatomy's mobile fallback for a
 *  frame on desktop before swapping to the canvas.
 *
 *  Reading `matchMedia` in the initialiser costs one synchronous call per
 *  mount and removes the wrong-for-one-frame window entirely. */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export const useIsDesktop = () => useMediaQuery('(min-width: 768px)');
export const useIsFinePointer = () => useMediaQuery('(pointer: fine)');
