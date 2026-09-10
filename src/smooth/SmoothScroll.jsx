import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { LenisContext } from './lenisContext.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';

export default function SmoothScroll({ children }) {
  const [lenis, setLenis] = useState(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    // Canonical Lenis <-> ScrollTrigger wiring: drive ScrollTrigger from Lenis,
    // drive Lenis from the GSAP ticker, and disable lag smoothing so a dropped
    // frame does not desync the two.
    instance.on('scroll', ScrollTrigger.update);
    const tick = (time) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(instance);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      setLenis(null);
    };
  }, [reduced]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
