import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';

const source = await readFile(new URL('../scripts/main.js', import.meta.url), 'utf8');
const implementation = source.match(/const findAnchorTarget = (\(hash, root = document\) => \{[\s\S]*?\n  \});/)?.[1];
assert.ok(implementation, 'Missing shared anchor resolver');
const resolve = vm.runInNewContext(`(${implementation})`);
const ids = new Map(['faq-2', 'ігри', 'середні ставки', '20bet', 'bonus:rules'].map(id => [id, { id }]));
const root = { getElementById: id => ids.get(id) || null };

test('plain and URL-encoded Ukrainian fragments reach the same section', () => {
  assert.equal(resolve('#ігри', root), ids.get('ігри'));
  assert.equal(resolve('#%D1%96%D0%B3%D1%80%D0%B8', root), ids.get('ігри'));
});
test('encoded spaces, digit prefixes and CSS punctuation do not need selectors', () => {
  for (const id of ['середні ставки', '20bet', 'bonus:rules']) {
    assert.equal(resolve(`#${encodeURIComponent(id)}`, root), ids.get(id));
  }
});
test('existing ASCII section links still work', () => {
  assert.equal(resolve('#faq-2', root), ids.get('faq-2'));
});
test('empty, malformed, unknown and non-fragment links fail safely', () => {
  for (const hash of ['', '#', '#%E0%A4', '#missing', 'https://example.com/#faq-2', null]) {
    assert.equal(resolve(hash, root), null);
  }
});
