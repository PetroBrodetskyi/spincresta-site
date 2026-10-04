import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../scripts/pages/brand.js', import.meta.url), 'utf8');
const configSource = await readFile(new URL('../scripts/brand-snapshot-configs.js', import.meta.url), 'utf8');
const categories = ['GAME_CATEGORIES', 'LIVE_GAME_CATEGORIES', 'BETTING_CATEGORIES'].flatMap(name => {
  const literal = configSource.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\]);`))?.[1];
  assert.ok(literal, `Missing category list: ${name}`);
  return vm.runInNewContext(literal);
});

for (const locale of ['DE', 'ES', 'IT', 'PL', 'UK', 'PT', 'FR', 'HI', 'FI']) {
  test(`${locale}: every Snapshot category has an explicit localized label`, () => {
    const literal = source.match(new RegExp(`const SNAPSHOT_${locale}_TRANSLATIONS = (\\{[\\s\\S]*?\\n  \\});`))?.[1];
    assert.ok(literal, `Missing translation map: ${locale}`);
    const labels = vm.runInNewContext(`(${literal})`);
    for (const category of categories) {
      assert.ok(Object.hasOwn(labels, category), `Missing ${locale} label: ${category}`);
      assert.ok(labels[category].trim(), `Empty ${locale} label: ${category}`);
    }
  });
}
