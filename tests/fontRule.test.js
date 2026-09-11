import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['src/routes', 'src/sections', 'src/components', 'src/styles'];

/** Pinyon Script is homepage-only. Exactly these files may reference the
 *  display-font token — plus tokens.css, which declares it. */
const ALLOWED = new Set([
  'src/styles/tokens.css',
  // The three homepage sections that carry Pinyon, and their own stylesheets.
  // A section's .css file is part of that section — excluding it only forces
  // font-family into inline styles, which is worse architecture for the same
  // amount of Pinyon. The rule being protected is "Pinyon appears on the
  // homepage and nowhere else", not "Pinyon may not be set in CSS".
  'src/sections/Hero.jsx',
  'src/sections/Hero.css',
  'src/sections/Editorial.jsx',
  'src/sections/Editorial.css',
  'src/sections/Closing.jsx',
  'src/sections/Closing.css',
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
