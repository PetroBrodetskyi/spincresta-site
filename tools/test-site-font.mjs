import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const read = (file, encoding = 'utf8') => readFileSync(new URL(`../${file}`, import.meta.url), encoding);

test('the site shell always loads the local Inter Tight faces with Latin and Cyrillic coverage', () => {
  const css = read('styles.css');
  const core = read('styles/core.css');
  assert.match(core, /--font-main:\s*"Inter Tight Variable",\s*system-ui,/);
  assert.match(core, /\bhtml\s*\{\s*font-family: var\(--font-main\);/);
  assert.doesNotMatch(read('styles/section-contrast-preview.css'), /--font-main|inter-tight/);
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

test('native controls and editorial codes inherit the site font', () => {
  const core = read('styles/core.css');
  assert.match(core, /button,\s*input,\s*select,\s*textarea\s*\{\s*font: inherit;/);
  assert.match(core, /:where\(code, kbd, pre, samp, optgroup, option\),\s*input::file-selector-button\s*\{\s*font-family: inherit;/);
});
