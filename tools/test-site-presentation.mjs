import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { matteCss, stripDecorativeLabels } from './polish-site-presentation.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const css = ['core', 'pages', 'blog'].map(name => fs.readFileSync(path.join(root, 'styles', `${name}.css`), 'utf8'));

test('remove decorative labels, not headings, facts or controls', () => {
  const kept = '<h1>Casino review</h1><h2>New games</h2><p>35x wagering</p><a href="/about/">About</a>' +
    '<span class="section-kicker" role="status">Loading</span><p class="eyebrow" id="anchor">Target</p>';
  const input = '<span class="home-section-kicker">LATEST RELEASES</span>' +
    '<p class="author-kicker">EDITORIAL TEAM</p><span class="brand-quick-facts__heading">At a glance</span>' + kept;
  assert.equal(stripDecorativeLabels(input), kept);
  assert.equal(stripDecorativeLabels('  <span class="blog-kicker">Blog</span>\n<h2>Articles</h2>'), '<h2>Articles</h2>');
  assert.equal(stripDecorativeLabels(kept), kept);
});

test('CSS polishing retains image blur, icons, counters and structural borders', () => {
  const before = '.title::before {content:"AVAILABILITY";} .hero::before {content:"";filter:blur(24px);background-image:var(--brand-showcase-image);}' +
    '.arrow::after {content:"\\2192";} .step::before {content:counter(step);} table {border-left:1px solid var(--surface-border);}' +
    '.panel {backdrop-filter:blur(16px);box-shadow:inset 0 1px 0 #fff,0 4px 12px rgba(0,0,0,.2);}';
  const after = matteCss(before);
  assert.match(after, /content: none/);
  assert.match(after, /filter:blur\(24px\)/);
  assert.match(after, /background-image:var\(--brand-showcase-image\)/);
  assert.match(after, /content:"\\2192"/);
  assert.match(after, /content:counter\(step\)/);
  assert.match(after, /border-left:1px solid var\(--surface-border\)/);
  assert.match(after, /backdrop-filter:none/);
  assert.doesNotMatch(after, /inset 0/);
  assert.match(after, /0 4px 12px rgba/);
  assert.equal(matteCss(after), after);
});

test('remove fixed-height and responsive vertical accents, not decorative bullets', () => {
  for (const height of ['62px', 'clamp(54px, 4vw, 68px)']) {
    const result = matteCss(`.intro::before {content:'';width:4px;height:${height};background:var(--section-accent);}`);
    assert.match(result, /content: none/);
  }
  assert.match(matteCss(".bullet::before {content:'';width:6px;height:6px;background:var(--section-accent);}"), /content:''/);
});

test('all published pages and source templates remain free of decorative labels', () => {
  const visit = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || ['node_modules', 'tmp', 'research'].includes(entry.name)) continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(file);
      else if (entry.name === 'index.html' || file.startsWith(path.join(root, 'scripts') + path.sep) && entry.name.endsWith('.js') || /^tools\/(?:build-|redesign-|generate-).*\.mjs$/.test(path.relative(root, file))) {
        const source = fs.readFileSync(file, 'utf8');
        assert.equal(stripDecorativeLabels(source), source, path.relative(root, file));
      }
    }
  };
  visit(root);
});

test('all shared UI CSS stays matte after regeneration', () => {
  for (const source of css) {
    assert.equal(matteCss(source), source);
    const filters = [...source.matchAll(/(?:-webkit-)?backdrop-filter:\s*([^;]+);/g)];
    assert(filters.every(match => match[1].trim() === 'none'));
  }
  for (const name of ['surface-graphite-gradient', 'surface-graphite-gradient-hover', 'sticker-bg', 'sticker-bg-hover']) {
    for (const [, value] of css[0].matchAll(new RegExp(`--${name}:\\s*([^;]+);`, 'g'))) {
      assert.match(value.trim(), /^(?:#[\da-f]+|var\(--[\w-]+\))$/i, name);
    }
  }
  assert.match(css[1], /\.brand-profile-showcase__media::before\s*\{[^}]*background-image: var\(--brand-showcase-image\);[^}]*filter: blur\(24px\)/);
  assert.match(css[1], /\.game-art-backdrop::before\s*\{[^}]*background-image: var\(--game-art\);[^}]*filter: blur\(20px\)/);
});

test('functional feedback rating label is a heading, not an eyebrow', () => {
  const feedback = fs.readFileSync(path.join(root, 'scripts/pages/brand-feedback.js'), 'utf8');
  assert.match(feedback, /<h3>\$\{[^}]*rateTitle[^}]*\}<\/h3>/);
  assert.doesNotMatch(feedback, /class="section-kicker"/);
});
