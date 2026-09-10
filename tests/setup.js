/** Vitest global setup.
 *
 *  jsdom does not implement `window.matchMedia` at all — it is `undefined`, not
 *  a stub. That breaks two things in this project:
 *
 *  1. `src/motion/gsap.js` calls `gsap.registerPlugin(ScrollTrigger, ...)` at
 *     module scope. ScrollTrigger self-enables as soon as it sees a `window`
 *     with a `document`, and immediately calls `matchMedia`, throwing
 *     `TypeError: _win.matchMedia is not a function`. Any test that imports
 *     anything reaching gsap.js dies on import, before a single assertion runs.
 *  2. `src/lib/useMediaQuery.js` calls `matchMedia(...).addEventListener`.
 *
 *  So this polyfill has to be a real MediaQueryList: both the modern
 *  add/removeEventListener pair and the deprecated add/removeListener pair,
 *  because GSAP still uses the legacy names for older-browser support.
 *
 *  Queries default to NOT matching, which is the honest default under jsdom —
 *  there is no viewport, no pointer and no motion preference. Tests that need a
 *  specific answer should use `setMatchMedia()` below rather than assuming.
 */

/** @type {(query: string) => boolean} */
let matcher = () => false;

/** Override how queries resolve for one test. Pass a predicate over the query
 *  string, e.g. `setMatchMedia(q => q.includes('min-width'))`. */
export function setMatchMedia(fn) {
  matcher = fn;
}

export function resetMatchMedia() {
  matcher = () => false;
}

if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query) => {
    const listeners = new Set();
    return {
      get matches() {
        return matcher(query);
      },
      media: query,
      onchange: null,
      addEventListener: (_type, fn) => listeners.add(fn),
      removeEventListener: (_type, fn) => listeners.delete(fn),
      // Deprecated pair — GSAP still calls these.
      addListener: (fn) => listeners.add(fn),
      removeListener: (fn) => listeners.delete(fn),
      dispatchEvent: (event) => {
        listeners.forEach((fn) => fn(event));
        return true;
      },
    };
  };
}
