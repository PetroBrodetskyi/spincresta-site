import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { normalizeSiteType, typeSize, TYPE_STYLESHEETS } from './normalize-site-type.mjs';

test('legacy sizes map to six role-based levels; icon-only controls retain zero', () => {
  assert.deepEqual(
    ['9.5px', '13.5px', '0.98rem', '18px', '24px', 'clamp(30px, 3.2vw, 48px)', '0', '0px', 'inherit'].map(typeSize),
    ['caption', 'ui', 'body', 'subheading', 'section', 'title'].map(level => `var(--type-${level})`).concat(['0', '0px', 'inherit'])
  );
  const fixture = '/* font-size: 20px; */ .a { content: "font-size: 16px;"; font-size: 17px !important; }';
  assert.equal(normalizeSiteType(fixture), fixture.replace('17px', 'var(--type-subheading)'));
});

test('all shared stylesheets conform to the common scale', () => {
  const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
  const tokens = [...read('styles.css').matchAll(/--type-([\w-]+):/g)].map(match => match[1]);
  assert.deepEqual(tokens, ['caption', 'ui', 'body', 'subheading', 'section', 'title']);
  for (const file of TYPE_STYLESHEETS) {
    const css = read(file);
    assert.equal(normalizeSiteType(css), css, file);
    for (const match of css.matchAll(/font-size:\s*var\(--type-([\w-]+)\)/g)) assert.ok(tokens.includes(match[1]), file);
  }
});
