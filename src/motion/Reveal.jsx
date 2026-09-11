import { gsap } from './gsap.js';
import { useGsapScope } from './useGsapScope.js';

/** The workhorse scroll reveal, ported from the Summit rebrand's framer-motion
 *  `Reveal` to this project's GSAP. Everything that is NOT type enters on one
 *  curve and one duration; type keeps using `SplitReveal`, which splits lines.
 *  A dozen near-miss timings read as sloppiness rather than as variety.
 *
 *  `hidden` is applied by JS, never by CSS. `useGsapScope` skips setup entirely
 *  under prefers-reduced-motion, so a CSS hidden state would leave the content
 *  permanently invisible for those users. It runs in a layout effect, so the
 *  hidden state lands before paint and nothing flashes. */
const VARIANTS = {
  up: {
    hidden: { y: 34, opacity: 0 },
    shown: { y: 0, opacity: 1 },
  },
  /** For images: uncover from the bottom edge while the picture settles back
   *  to its own scale, so the frame and its contents move at different rates.
   *
   *  The scale is on the CHILD, not the wrapper. Summit's version scales the
   *  same element it clips, which is fine for a boxed image but not for a
   *  full-bleed band — an 8% scale on a wrapper that already spans the viewport
   *  pushes the document wider and raises a horizontal scrollbar. Clipping the
   *  parent also clips its descendants, so the oversized child stays hidden. */
  curtain: {
    hidden: { clipPath: 'inset(100% 0% 0% 0%)' },
    shown: { clipPath: 'inset(0% 0% 0% 0%)' },
    childHidden: { scale: 1.08 },
    childShown: { scale: 1 },
  },
  wipe: {
    hidden: { clipPath: 'inset(0% 100% 0% 0%)' },
    shown: { clipPath: 'inset(0% 0% 0% 0%)' },
  },
  fade: {
    hidden: { opacity: 0 },
    shown: { opacity: 1 },
  },
  rule: {
    hidden: { scaleX: 0, transformOrigin: 'left center' },
    shown: { scaleX: 1 },
  },
};

export default function Reveal({
  children,
  variant = 'up',
  as: Tag = 'div',
  delay = 0,
  duration = 0.9,
  stagger = 0,
  start = 'top 85%',
  className = '',
  ...rest
}) {
  const preset = VARIANTS[variant] ?? VARIANTS.up;

  const scope = useGsapScope((el) => {
    // With a stagger the wrapper orchestrates and its children animate; without
    // one the wrapper is the thing that moves. Reading `children` rather than a
    // selector keeps this working for any markup a caller passes in.
    const targets = stagger > 0 ? Array.from(el.children) : el;
    if (stagger > 0 && targets.length === 0) return undefined;

    const trigger = { trigger: el, start, once: true };

    gsap.set(targets, preset.hidden);
    gsap.to(targets, {
      ...preset.shown,
      duration,
      delay,
      stagger,
      ease: 'glide',
      scrollTrigger: trigger,
    });

    // A variant may move its children on a second track — see `curtain`.
    if (preset.childHidden) {
      const kids = Array.from(el.children);
      if (kids.length > 0) {
        gsap.set(kids, preset.childHidden);
        gsap.to(kids, {
          ...preset.childShown,
          duration,
          delay,
          ease: 'glide',
          scrollTrigger: trigger,
        });
      }
    }
    return undefined;
  }, [variant, delay, duration, stagger, start]);

  return (
    <Tag ref={scope} className={className} {...rest}>
      {children}
    </Tag>
  );
}
