export const FRAME_COUNT = 192;
export const FRAME_W = 1280;
export const FRAME_H = 712;

/** Frames are 1-indexed because ffmpeg's %03d pattern starts at 1. */
export const frameUrl = (n) => `/frames/frame-${String(n).padStart(3, '0')}.webp`;
export const frameUrls = () => Array.from({ length: FRAME_COUNT }, (_, i) => frameUrl(i + 1));

/** Decode this many before the section becomes interactive; the rest stream in
 *  behind. ~2.3-3.0 MB total, so a blocking wait on all 192 would stall the
 *  page on a slow connection for no benefit. */
export const EAGER_COUNT = 16;

/**
 * Loads every frame, resolving once the first `EAGER_COUNT` have decoded.
 * Returns { images, ready, cancel } — `images` fills in place as the rest land.
 */
export function loadFrames(onEager) {
  const images = new Array(FRAME_COUNT);
  let eagerLoaded = 0;
  let cancelled = false;

  const load = (i) =>
    new Promise((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = img.onerror = () => resolve(img);
      img.src = frameUrl(i + 1);
      images[i] = img;
    });

  (async () => {
    for (let i = 0; i < EAGER_COUNT && !cancelled; i++) {
      await load(i);
      eagerLoaded++;
      if (eagerLoaded === EAGER_COUNT) onEager?.(images);
    }
    for (let i = EAGER_COUNT; i < FRAME_COUNT && !cancelled; i++) await load(i);
  })();

  return { images, cancel: () => { cancelled = true; } };
}
