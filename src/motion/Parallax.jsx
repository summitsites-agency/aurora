import { gsap } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';

/** Translates its child as the section scrolls past.
 *
 *  `speed` is the total travel in percent of the element's own height:
 *  negative drifts up (slower than scroll), positive drifts down.
 *
 *  Never wrap a knockout product image in this on a tinted ground — the
 *  transform would isolate its blend. Safe here on the homepage, where the
 *  Anatomy band is white and unblended. */
export default function Parallax({ children, speed = -12, className = '' }) {
  const scope = useGsapScope((el) => {
    const inner = el.firstElementChild;
    if (!inner) return;
    gsap.fromTo(
      inner,
      { yPercent: -speed / 2 },
      {
        yPercent: speed / 2,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
      },
    );
  }, [speed]);

  return <div ref={scope} className={className} style={{ overflow: 'hidden' }}>{children}</div>;
}
