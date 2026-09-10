import { mkdirSync } from 'node:fs';
import { run, KNOCKOUT_LUT } from './ffmpeg.mjs';

export const FRAME_COUNT = 192;
export const FRAME_WIDTH = 1280;
export const FRAME_HEIGHT = 712;

/** expand.mp4 carries a per-frame black letterbox: 3px top and bottom on some
 *  frames, none on 135 of the 192. Worst case measured across every frame is 3
 *  rows. Cropping a uniform 4px off top and bottom is clean on all of them and
 *  costs 1.1% of height. Never crop to a box measured from a single frame.
 *
 *  The frames then take the same knockout LUT as the stills, because the video
 *  backdrop measures ~216 grey — identical to the product shots. That is what
 *  lets the sequence sit on the paper ground with no visible plate.
 *
 *  Output is native 1280 wide; the source is 1280, so any upscale is wasted
 *  bytes. Measured: ~16 KB/frame, ~3.0 MB for all 192. */
export function buildFrames(srcFile, outDir) {
  mkdirSync(outDir, { recursive: true });
  run(
    ['-i', srcFile,
     '-vf', `crop=${FRAME_WIDTH}:${FRAME_HEIGHT}:0:4,${KNOCKOUT_LUT}`,
     '-vsync', '0',
     '-c:v', 'libwebp', '-quality', '80', '-compression_level', '6',
     `${outDir}/frame-%03d.webp`, '-y'],
    'frame extraction',
  );
  console.log(`  frames    ${FRAME_COUNT} @ ${FRAME_WIDTH}x${FRAME_HEIGHT}`);
}
