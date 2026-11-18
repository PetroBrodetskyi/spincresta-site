import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file, encoding = 'utf8') => readFileSync(new URL(`../${file}`, import.meta.url), encoding);

test('the separate design trial uses local variable fonts with Latin and Cyrillic coverage', () => {
  const css = read('styles/section-contrast-preview.css');
  assert.match(read('styles.css'), /@import url\('\/styles\/section-contrast-preview\.css\?v=[\w-]+'\);/);
  assert.match(css, /--font-main: "Inter Tight Variable", system-ui,/);
  assert.match(read('fonts/inter-tight/LICENSE'), /SIL OPEN FONT LICENSE/i);

  for (const name of ['index.css', 'wght-italic.css']) {
    const file = `fonts/inter-tight/${name}`;
    assert.ok(css.includes(`@import url('/${file}');`));
    const faces = read(file);
    assert.match(faces, /font-weight: 100 900;/);
    assert.match(faces, /\/inter-tight-cyrillic-wght-/);
    assert.match(faces, /\/inter-tight-latin-wght-/);
    for (const [, asset] of faces.matchAll(/url\(\.\/([^\s)]+)\)/g)) {
      assert.equal(read(`fonts/inter-tight/${asset}`, null).subarray(0, 4).toString(), 'wOF2');
    }
  }
});
