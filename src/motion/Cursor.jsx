import { useEffect, useRef, useState } from 'react';
import { gsap } from './gsap.js';
import { useIsFinePointer } from '../lib/useMediaQuery.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './Cursor.css';

const INTERACTIVE = 'a, button, [role="button"], input, select, textarea';

export default function Cursor() {
  const ref = useRef(null);
  const fine = useIsFinePointer();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!fine || reduced) return undefined;
    const el = ref.current;
    if (!el) return undefined;

    const xTo = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' });

    const onMove = (e) => { xTo(e.clientX); yTo(e.clientY); };
    const onOver = (e) => setActive(!!e.target.closest?.(INTERACTIVE));

    window.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseover', onOver, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
    };
  }, [fine, reduced]);

  if (!fine || reduced) return null;
  return (
    <div className="cursor" ref={ref} data-active={active} aria-hidden="true">
      <div className="cursor__dot" />
    </div>
  );
}
