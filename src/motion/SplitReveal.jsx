import { gsap, SplitText, ScrollTrigger } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';
import './SplitReveal.css';

/** Reveals its text by line, masked. Uses GSAP's own SplitText (free since
 *  3.13) with mask:"lines" so no wrapper divs are hand-rolled.
 *
 *  `as` lets a caller pick the heading level without this component guessing. */
export default function SplitReveal({
  as: Tag = 'p',
  children,
  className = '',
  delay = 0,
  stagger = 0.09,
  start = 'top 82%',
}) {
  const scope = useGsapScope((el) => {
    const target = el.querySelector('.split-reveal__text');
    if (!target) return;

    const split = new SplitText(target, { type: 'lines', mask: 'lines', linesClass: 'split-reveal__line' });
    gsap.set(split.lines, { yPercent: 115 });

    gsap.to(split.lines, {
      yPercent: 0,
      duration: 1,
      ease: 'glide',
      stagger,
      delay,
      scrollTrigger: { trigger: el, start, once: true },
    });

    return () => { split.revert(); ScrollTrigger.refresh(); };
  }, [children]);

  return (
    <Tag ref={scope} className={`split-reveal ${className}`}>
      <span className="split-reveal__text">{children}</span>
    </Tag>
  );
}
