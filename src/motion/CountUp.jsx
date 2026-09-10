import { useState } from 'react';
import { gsap } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';

/** Eased progress → displayed integer. Exported so it can be tested without
 *  a DOM or a running ticker. */
export function countUpValue(progress, target) {
  const eased = 1 - (1 - progress) ** 3; // cubic ease-out
  return Math.round(eased * target);
}

export default function CountUp({ value, suffix = '', className = '' }) {
  // null means "the ramp has not started". Rendering `shown ?? value` would
  // still show the final number and then visibly snap back to 0 the instant the
  // tween began, so the ramp only takes over from onStart onwards.
  const [shown, setShown] = useState(null);

  const scope = useGsapScope((el) => {
    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      duration: 1.6,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onStart: () => setShown(0),
      onUpdate: () => setShown(countUpValue(state.p, value)),
      onComplete: () => setShown(value),
    });
  }, [value]);

  return (
    <span ref={scope} className={className}>
      {/* Reduced motion and no-JS never start the tween, so the real number is
          the fallback — never a stuck zero. */}
      <span aria-hidden="true">{shown ?? value}{suffix}</span>
      <span className="u-visually-hidden">{value}{suffix}</span>
    </span>
  );
}
