import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIRS = ['src/routes', 'src/sections', 'src/components', 'src/styles'];

/** Pinyon Script is homepage-only. Exactly these files may reference the
 *  display-font token — plus tokens.css, which declares it. */
const ALLOWED = new Set([
  'src/styles/tokens.css',
  'src/sections/Hero.jsx',
  'src/sections/Editorial.jsx',
  'src/sections/Closing.jsx',
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
