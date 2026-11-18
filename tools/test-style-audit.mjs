import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { removeExactStyleDuplicates } from './audit-styles.mjs';

test('stylesheet audit keeps the final exact duplicate and preserves intervening declarations', () => {
  const { css, removed } = removeExactStyleDuplicates(
    '.a,.a,:is(b,c) { color: red; }\n.a { color: blue; }\n.a,:is(b,c) { color: red; }',
  );
  assert.equal(removed, 2);
  assert.match(css, /\.a \{ color: blue; \}\n\.a,:is\(b,c\) \{ color: red; \}/);
  assert.equal(removeExactStyleDuplicates(css).removed, 0);
});

test('stylesheet audit preserves queries, layers, keyframes, and quoted selectors as distinct contexts', () => {
  const fixture = `.a { content: "{}"; }
@media (max-width: 768px) { .a { content: "{}"; } }
@layer { .a { content: "{}"; } }
@layer { .a { content: "{}"; } }
@keyframes demo { 0% { opacity: 0; } 100% { opacity: 0; } }
[data-name="one,two"], :is(.b, .c) { background: url("data:image/svg+xml;utf8,{}"); }`;
  assert.deepEqual(removeExactStyleDuplicates(fixture), { css: fixture, removed: 0 });
});

test('shared stylesheets are free of exact duplicate rules and no longer reference country hero files', () => {
  const shared = [];
  for (const path of ['styles/core.css', 'styles/pages.css', 'styles/brand-review.css', 'styles.css', 'styles/blog.css']) {
    const css = fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
    shared.push(css);
    assert.equal(removeExactStyleDuplicates(css).removed, 0, path);
    assert.doesNotMatch(css, /--country-hero-photo|spincresta\/countries\/[^/]+\/[^\s]+-hero_/);
  }
  assert.equal(removeExactStyleDuplicates(shared.join('\n')).removed, 0);
});
