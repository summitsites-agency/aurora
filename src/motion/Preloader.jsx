import { useEffect, useRef, useState } from 'react';
import { gsap } from './gsap.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './Preloader.css';

export default function Preloader() {
  const ref = useRef(null);
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setDone(true); return undefined; }
    const el = ref.current;
    if (!el) return undefined;

    const tl = gsap.timeline({ onComplete: () => setDone(true) });
    tl.to(el.querySelector('.preloader__mark'), {
      opacity: 0, duration: 0.4, delay: 0.5, ease: 'glide',
    });
    tl.to(el, { scaleY: 0, duration: 0.8, ease: 'hop' });
    return () => tl.kill();
  }, [reduced]);

  // Unmounted once finished, so it cannot trap focus or intercept clicks.
  if (done) return null;
  return (
    <div className="preloader" ref={ref} data-done={done}>
      <p className="preloader__mark">Aurora</p>
    </div>
  );
}
