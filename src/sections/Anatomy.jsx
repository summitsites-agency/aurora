import { useRef, useState, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { useGsapScope } from '../motion/useGsapScope.js';
import { FRAME_COUNT, FRAME_W, FRAME_H, frameUrl, loadFrames, EAGER_COUNT } from '../motion/frames.js';
import { useIsDesktop } from '../lib/useMediaQuery.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import { home } from '../data/content.js';
import './Anatomy.css';

const PIN_SVH = 400;
const svh = (n) => n / PIN_SVH;

/** Phase map. One pinned trigger drives the scrub AND the copy, following the
 *  svhToProgress + mapRange pattern from templates/MaximaTherapy. */
const SCRUB_START = svh(60);
const SCRUB_END = svh(340);
const CLAIM_WINDOWS = [
  [svh(80), svh(160)],
  [svh(180), svh(260)],
  [svh(280), svh(352)],
];

export default function Anatomy() {
  const isDesktop = useIsDesktop();
  const reduced = useReducedMotion();
  const useCanvas = isDesktop && !reduced;

  if (!useCanvas) return <AnatomyStatic />;
  return <AnatomyCanvas />;
}

/** Mobile and reduced-motion: three key frames as plain images. Deliberately a
 *  separate component so the 192 frames are never requested — a CSS
 *  display:none would still download them. */
function AnatomyStatic() {
  return (
    <section className="anatomy">
      <div className="anatomy__static">
        {[1, 96, 192].map((n, i) => (
          <figure key={n}>
            <img src={frameUrl(n)} alt="" width={FRAME_W} height={FRAME_H} loading="lazy" />
            <figcaption>
              <strong>{home.anatomy.claims[i].title}</strong>
              <br />
              {home.anatomy.claims[i].body}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function AnatomyCanvas() {
  const canvasRef = useRef(null);
  const imagesRef = useRef(null);
  const lastFrame = useRef(-1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const { images, cancel } = loadFrames(() => setReady(true));
    imagesRef.current = images;
    return cancel;
  }, []);

  const draw = (index) => {
    // Repaint ONLY when the frame index changes. Painting every scroll event
    // is what turns a smooth scrub into a 20fps one.
    if (index === lastFrame.current) return;
    const canvas = canvasRef.current;
    const img = imagesRef.current?.[index];
    if (!canvas || !img?.complete || !img.naturalWidth) return;
    lastFrame.current = index;

    const ctx = canvas.getContext('2d', { alpha: false });
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Fill white, then contain-fit. The frames' backdrop is already pure white
    // (verify-knockout.mjs gates this), so the letterbox is seamless and needs
    // no edge-extension.
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w / FRAME_W, h / FRAME_H) * 0.92;
    const dw = FRAME_W * scale, dh = FRAME_H * scale;
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
  };

  const scope = useGsapScope((el) => {
    const stage = el.querySelector('.anatomy__stage');
    const claims = el.querySelectorAll('.anatomy__claim');

    // ScrollTrigger's end string does not understand `svh`, so resolve the pin
    // length to pixels ourselves.
    const pinPx = () => window.innerHeight * (PIN_SVH / 100);

    ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: () => `+=${pinPx()}`,
      invalidateOnRefresh: true,
      pin: stage,
      pinSpacing: true,
      scrub: true,
      onUpdate: ({ progress }) => {
        const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(SCRUB_START, SCRUB_END, 0, 1, progress));
        draw(Math.min(FRAME_COUNT - 1, Math.round(p * (FRAME_COUNT - 1))));

        claims.forEach((claim, i) => {
          const [a, b] = CLAIM_WINDOWS[i];
          const local = gsap.utils.clamp(0, 1, gsap.utils.mapRange(a, b, 0, 1, progress));
          // fade in over the first fifth, hold, fade out over the last fifth
          const o = local < 0.2 ? local / 0.2 : local > 0.8 ? (1 - local) / 0.2 : 1;
          gsap.set(claim, { opacity: o, y: (1 - o) * 12 });
        });
      },
    });
  }, [ready]);

  return (
    <section className="anatomy" ref={scope} aria-labelledby="anatomy-label">
      <div className="anatomy__stage">
        <p className="anatomy__label u-label" id="anatomy-label">{home.anatomy.label}</p>

        <canvas className="anatomy__canvas" ref={canvasRef} aria-hidden="true" />

        {/* Copy lives in the DOM as real text, never painted into the canvas,
            so it is selectable and reachable by a screen reader. */}
        <div className="anatomy__copy">
          {home.anatomy.claims.map((c) => (
            <div className="anatomy__claim" key={c.title}>
              <h3>{c.title}</h3>
              <p>{c.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
