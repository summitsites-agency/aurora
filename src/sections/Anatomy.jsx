import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../motion/gsap.js';
import { useGsapScope } from '../motion/useGsapScope.js';
import { FRAME_COUNT, FRAME_W, FRAME_H, frameUrl, loadFrames, EAGER_COUNT } from '../motion/frames.js';
import { useIsDesktop } from '../lib/useMediaQuery.js';
import { useReducedMotion } from '../lib/useReducedMotion.js';
import { anatomy } from '../data/content.js';
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
/** Mobile and reduced-motion: the FIRST and LAST key frames, and their two
 *  steps. The middle pair was cut — on a phone the three stack into a column
 *  and frame 96 is a barely-different halfway pose, so it read as the same
 *  photograph twice with different words under it. First and last are the two
 *  that actually show the garment coming apart. */
const STATIC_STEPS = [
  { frame: 1, step: 0 },
  { frame: 192, step: 2 },
];

function AnatomyStatic() {
  return (
    <section className="anatomy">
      <div className="anatomy__static">
        {STATIC_STEPS.map(({ frame, step }) => (
          <figure key={frame}>
            <img src={frameUrl(frame)} alt="" width={FRAME_W} height={FRAME_H} loading="lazy" />
            <figcaption>
              <strong>{anatomy.steps[step].title}</strong>
              <br />
              {anatomy.steps[step].body}
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

  // Paint frame 0 as soon as it decodes, rather than waiting for the first
  // scroll. The canvas only ever drew from ScrollTrigger's onUpdate, which does
  // not fire until the scroll position changes — so landing on /anatomy showed
  // an empty white stage until you moved, which looked broken rather than
  // unstarted. `drawRef` is what lets the load callback reach the draw function
  // declared below it.
  const drawRef = useRef(null);

  useEffect(() => {
    const { images, cancel } = loadFrames(() => {
      // Frames are decoded. Do NOT trigger a React re-render to react to this:
      // the draw path reads imagesRef directly, and making the ScrollTrigger
      // depend on a `ready` flag rebuilt the pin from scratch. The rebuild left
      // the old pin-spacer behind, so the spacer's padding doubled to 2x the
      // pin length and ScrollTrigger translated the "pinned" element 3600px
      // down the page — off-screen, and the section looked blank.
      //
      // Instead: drop the repaint guard so the next update repaints, and let
      // ScrollTrigger re-measure now the images have changed layout height.
      lastFrame.current = -1;
      ScrollTrigger.refresh();
      drawRef.current?.(0);
    });
    imagesRef.current = images;

    // The eager callback only fires once EAGER_COUNT (16) frames have decoded,
    // which is too long to leave the stage white. `loadFrames` assigns
    // images[0] synchronously, so the first frame can be painted the moment it
    // alone is ready.
    const first = images[0];
    const paintFirst = () => { lastFrame.current = -1; drawRef.current?.(0); };
    // Deferred, not called inline. This effect is declared above the one that
    // populates `drawRef`, and effects run synchronously in declaration order —
    // so on a cache hit the inline call would land while `drawRef` is still
    // null and silently paint nothing. A microtask runs after the whole commit.
    if (first?.complete) queueMicrotask(paintFirst);
    else first?.addEventListener('load', paintFirst, { once: true });

    return () => {
      first?.removeEventListener('load', paintFirst);
      cancel();
    };
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

  // Effect, not a bare assignment in the body: mutating a ref during render is
  // a side effect, and this runs early enough either way — the load callbacks
  // above are all asynchronous.
  useEffect(() => { drawRef.current = draw; });

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
  }, []);

  // The stage used to print `anatomy.label` as visible text. Now that this
  // lives on its own page, the page head already shows it, and the two
  // rendered one above the other in the same viewport. aria-label carries the
  // accessible name instead, so nothing is lost to a screen reader.
  return (
    <section className="anatomy" ref={scope} aria-label={anatomy.label}>
      <div className="anatomy__stage">
        <canvas className="anatomy__canvas" ref={canvasRef} aria-hidden="true" />

        {/* Copy lives in the DOM as real text, never painted into the canvas,
            so it is selectable and reachable by a screen reader. */}
        <div className="anatomy__copy">
          {anatomy.steps.map((c) => (
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
