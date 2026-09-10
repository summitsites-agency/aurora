import { execFileSync } from 'node:child_process';
import ffmpegPath from 'ffmpeg-static';

/** The shared knockout LUT.
 *  Identity below 168 so the drop shadow survives (measured floor: 175),
 *  then ramp 168..204 up to pure white. Ceiling is 204 because the darkest
 *  per-pixel backdrop value measured anywhere — stills and frames — is 205.
 *  Applies to the 8 product stills AND the expand.mp4 frames — both sit on
 *  the same ~215 grey studio backdrop. Never apply it to a photograph of a
 *  person; it would crush skin tones. */
const RAMP = "if(lt(val,168),val,if(gt(val,204),255,168+(val-168)*2.4167))";
export const KNOCKOUT_LUT = `lutrgb=r='${RAMP}':g='${RAMP}':b='${RAMP}'`;

export function run(args, label) {
  try {
    execFileSync(ffmpegPath, ['-hide_banner', '-loglevel', 'error', ...args], {
      stdio: ['ignore', 'ignore', 'pipe'],
      maxBuffer: 1 << 26,
    });
  } catch (err) {
    const stderr = err.stderr?.toString() ?? '';
    throw new Error(`ffmpeg failed (${label})\n${stderr}`);
  }
}
