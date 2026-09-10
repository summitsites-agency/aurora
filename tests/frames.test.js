import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { FRAME_COUNT, FRAME_W, FRAME_H, frameUrl, frameUrls, EAGER_COUNT } from '../src/motion/frames.js';

describe('frame sequence', () => {
  it('is 192 frames at 1280x712', () => {
    expect(FRAME_COUNT).toBe(192);
    expect(FRAME_W).toBe(1280);
    expect(FRAME_H).toBe(712);
  });

  it('is 1-indexed and zero-padded to three digits', () => {
    expect(frameUrl(1)).toBe('/frames/frame-001.webp');
    expect(frameUrl(192)).toBe('/frames/frame-192.webp');
  });

  it('lists every frame once', () => {
    const urls = frameUrls();
    expect(urls).toHaveLength(192);
    expect(new Set(urls).size).toBe(192);
  });

  it('points at files that actually exist', () => {
    for (const u of frameUrls()) {
      expect(existsSync(`public${u}`), u).toBe(true);
    }
  });

  it('eagerly loads a first chunk smaller than the whole sequence', () => {
    expect(EAGER_COUNT).toBeGreaterThan(0);
    expect(EAGER_COUNT).toBeLessThan(FRAME_COUNT);
  });
});
