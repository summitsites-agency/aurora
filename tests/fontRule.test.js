import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['src/routes', 'src/sections', 'src/components', 'src/styles'];

/** Pinyon Script is rationed. Exactly these files may reference the
 *  display-font token — plus tokens.css, which declares it.
 *
 *  This was "homepage-only" until 2026-09-11, when the client moved the
 *  Closing line ("Yours for a very long time") into the global footer. That
 *  puts one Pinyon on every page by design, so the rule this guards is now
 *  "Pinyon appears in exactly these three places", not "Pinyon is
 *  homepage-only". The count is still what matters — the scarcity is the
 *  showcase. */
const ALLOWED = new Set([
  'src/styles/tokens.css',
  // A component's .css file is part of that component — excluding it only
  // forces font-family into inline styles, which is worse architecture for
  // the same amount of Pinyon.
  'src/sections/Hero.jsx',
  'src/sections/Hero.css',
  'src/sections/Editorial.jsx',
  'src/sections/Editorial.css',
  // Global: the only Pinyon that leaves the homepage.
  'src/components/Footer.jsx',
  'src/components/Footer.css',
]);

const walk = (dir) => {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
};

describe('two-font rule', () => {
  it('references --font-display only in the allowlisted files', () => {
    const offenders = DIRS.flatMap(walk)
      .filter((file) => readFileSync(file, 'utf8').includes('--font-display'))
      .map((file) => file.split('\\').join('/'))
      .filter((file) => !ALLOWED.has(file));

    expect(offenders).toEqual([]);
  });

  it('never loads a third font family', () => {
    const families = readFileSync('src/styles/tokens.css', 'utf8')
      .match(/--font-[a-z]+:/g) ?? [];
    expect(families.sort()).toEqual(['--font-display:', '--font-text:']);
  });
});
