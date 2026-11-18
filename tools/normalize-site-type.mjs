import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TYPE_STYLESHEETS = ['styles.css', 'styles/core.css', 'styles/pages.css', 'styles/brand-review.css', 'styles/blog.css', 'styles/section-contrast-preview.css'];

const aliases = {
  '--heading-display-size': '--type-title',
  '--heading-content-section-size': '--type-section',
  '--heading-subsection-size': '--type-subheading',
  '--heading-compact-mobile-section-size': '--type-section',
};
const declaration = /\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|((?<![\w-])(?:font-size|--heading-size):\s*)([^;{}]+)(?=;|})/g;

function inPixels(value) {
  const size = value.trim().match(/^(\d+(?:\.\d+)?|\.\d+)(px|rem)$/);
  return size ? Number(size[1]) * (size[2] === 'rem' ? 16 : 1) : null;
}

export function typeSize(value) {
  const alias = value.match(/^var\((--[\w-]+)\)$/);
  if (alias && aliases[alias[1]]) return `var(${aliases[alias[1]]})`;
  let size = inPixels(value);
  const clamp = value.match(/^clamp\(([^,]+),[^,]+,([^,]+)\)$/);
  if (clamp) {
    const min = inPixels(clamp[1]);
    const max = inPixels(clamp[2]);
    if (min !== null && max !== null) size = (min + max) / 2;
  }
  if (size === null || size === 0) return value; // Zero intentionally hides text in icon-only controls.
  const token = size <= 12.5 ? 'caption' : size <= 14.5 ? 'ui' : size < 17 ? 'body'
    : size < 20 ? 'subheading' : size <= 26 ? 'section' : 'title';
  return `var(--type-${token})`;
}

export function normalizeSiteType(css) {
  return css
    .replace(declaration, (match, property, raw) => {
      if (!property) return match;
      const [, value, suffix] = raw.match(/^(.*?)(\s*(?:!important)?\s*)$/s);
      return property + typeSize(value) + suffix;
    })
    .replace(/^[ \t]*--heading-compact-mobile-section-size:[^;]*;\r?\n/gm, '');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const apply = process.argv.includes('--apply');
  let pending = 0;
  for (const filename of TYPE_STYLESHEETS) {
    const file = new URL(`../${filename}`, import.meta.url);
    const before = readFileSync(file, 'utf8');
    const after = normalizeSiteType(before);
    if (after === before) continue;
    pending++;
    if (apply) writeFileSync(file, after);
    console.log(filename);
  }
  console.log(`Shared typography: ${pending} stylesheets ${apply ? 'updated' : 'pending'}.`);
  if (!apply && pending) process.exitCode = 1;
}
