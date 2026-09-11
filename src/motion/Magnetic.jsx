import { useRef } from 'react';
import { gsap } from './gsap.js';
import { useIsFinePointer } from '../lib/useMediaQuery.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './Magnetic.css';

/** Pulls its child toward the pointer while the pointer is over it, then
 *  springs back on leave. Ported from the Summit rebrand's framer-motion
 *  `Magnetic`; `useSpring` becomes `gsap.quickTo`, which writes straight to the
 *  transform without a React render per frame.
 *
 *  This is element magnetism, not a cursor replacement — the pointer stays the
 *  system one. Inert on coarse pointers (there is no hover to respond to) and
 *  under reduced motion.
 *
 *  `strength` is the fraction of the pointer's offset from centre that the
 *  child follows. Past about 0.4 it stops feeling like weight and starts
 *  feeling like the button is running away from you. */
const SPRING = { duration: 0.5, ease: 'power3' };

/** The label drifts further than its box, which reads as the surface
 *  stretching rather than the whole control sliding. */
const LABEL_LAG = 0.35;

export default function Magnetic({ children, strength = 0.3, className = '', ...rest }) {
  const boxRef = useRef(null);
  const labelRef = useRef(null);
  const toRef = useRef(null);
  const fine = useIsFinePointer();
  const reduced = useReducedMotion();

  const inert = !fine || reduced;

  const quick = () => {
    if (toRef.current) return toRef.current;
    toRef.current = {
      x: gsap.quickTo(boxRef.current, 'x', SPRING),
      y: gsap.quickTo(boxRef.current, 'y', SPRING),
      lx: gsap.quickTo(labelRef.current, 'x', SPRING),
      ly: gsap.quickTo(labelRef.current, 'y', SPRING),
    };
    return toRef.current;
  };

  const onMove = (e) => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const dx = (e.clientX - (box.left + box.width / 2)) * strength;
    const dy = (e.clientY - (box.top + box.height / 2)) * strength;
    const q = quick();
    q.x(dx); q.y(dy);
    q.lx(dx * LABEL_LAG); q.ly(dy * LABEL_LAG);
  };

  const onLeave = () => {
    const q = quick();
    q.x(0); q.y(0); q.lx(0); q.ly(0);
  };

  if (inert) return <span className={className} {...rest}>{children}</span>;

  return (
    <span
      ref={boxRef}
      className={`magnetic ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...rest}
    >
      <span ref={labelRef} className="magnetic__label">{children}</span>
    </span>
  );
}
