import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import './GrainReveal.css';

const CELL = 26;        // px, at CSS scale
const DURATION = 900;   // ms for the full dissolve

/** Reveals a photograph by clearing a sand-coloured veil in random cells.
 *
 *  Deliberately NOT a GSAP tween: this paints to a canvas on rAF, and the
 *  cheapest correct way to do that is to own the loop. It also means the veil
 *  can be removed from the DOM the moment it finishes, so it costs nothing
 *  afterwards. */
export default function GrainReveal({ src, srcSet, sizes, alt, width, height, className = '' }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    let raf = 0;
    let observer;
    let cancelled = false;

    const start = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cols = Math.ceil(rect.width / CELL);
      const rows = Math.ceil(rect.height / CELL);
      const order = Array.from({ length: cols * rows }, (_, i) => i);
      for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
      }

      // Sampled from the client's hero photograph.
      ctx.fillStyle = '#A79685';
      ctx.fillRect(0, 0, rect.width, rect.height);

      const t0 = performance.now();
      let cleared = 0;

      const tick = (now) => {
        if (cancelled) return;
        const p = Math.min(1, (now - t0) / DURATION);
        const target = Math.floor(p * order.length);
        for (; cleared < target; cleared++) {
          const idx = order[cleared];
          const x = (idx % cols) * CELL;
          const y = Math.floor(idx / cols) * CELL;
          ctx.clearRect(x, y, CELL, CELL);
        }
        if (p < 1) raf = requestAnimationFrame(tick);
        else canvas.style.display = 'none'; // done — stop compositing it
      };
      raf = requestAnimationFrame(tick);
    };

    observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          start();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(wrap);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer?.disconnect();
    };
  }, [reduced, src]);

  return (
    <div className={`grain ${className}`} ref={wrapRef}>
      <img src={src} srcSet={srcSet} sizes={sizes} alt={alt} width={width} height={height} loading="lazy" />
      {!reduced && <canvas className="grain__veil" ref={canvasRef} aria-hidden="true" />}
    </div>
  );
}
