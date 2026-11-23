import assert from 'node:assert/strict';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import test from 'node:test';
import { classifyReviewSection } from '../scripts/pages/brand-review-order.js';

const locales = ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/'];
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const paths = locale => {
  const directory = new URL('../' + locale + 'brands/', import.meta.url);
  return readdirSync(directory, { withFileTypes: true })
    .filter(dir => dir.isDirectory() && existsSync(new URL(dir.name + '/index.html', directory)))
    .map(dir => dir.name).sort();
};

test('legacy headings are normalized without adding a disclosure to the cards', () => {
  const layout = read('scripts/pages/brand-layout.js');
  assert.doesNotMatch(layout, /applyBrandHeroConcept|hero\.appendChild\(whySection\)/);
  const strips = read('scripts/pages/brand-review-strips.js');
  assert.doesNotMatch(strips, /createElement\(['"](?:details|summary)['"]\)/);
  assert.match(strips, /reviewSectionLabel\(kind, localeText\)/);
});

test('every localized brand review has compatible highlight, comparison and suitability markup', t => {
  const slugs = paths('');
  let total = 0, highlights = 0, pros = 0, suitability = 0;
  for (const locale of locales) {
    assert.deepEqual(paths(locale), slugs, locale || 'en');
    for (const slug of slugs) {
      const file = locale + 'brands/' + slug + '/index.html';
      const html = read(file);
      total++;
      const block = html.match(/<section[^>]*id="brand-why-section"[^>]*>([^]*?)<[/]section>/)?.[1];
      const legacy = !block && html.match(/<section[^>]*class="[^"]*\bfeatures-section\b[^"]*"[^>]*>([^]*?)<[/]section>/)?.[1];
      if (block) {
        highlights++;
        assert.match(block, /<h2\b[^>]*class="title"/, file);
        assert.match(block, /class="[^"]*\bfeatures-grid\b/, file);
        assert.match(block, /class="[^"]*\bbrand-why-media\b/, file);
        assert.ok((block.match(/class="[^"]*\bfeature-card\b/g) || []).length > 1, file);
      }
      if (legacy) {
        highlights++;
        assert.match(legacy, /<h2\b[^>]*class="title"/, file);
        assert.match(legacy, /class="[^"]*\bfeatures-grid\b/, file);
      }
      for (const [, tag, content] of html.matchAll(/(<section\b[^>]*>)([^]*?)<[/]section>/g)) {
        const heading = content.match(/^\s*<h2\b[^>]*>([^]*?)<[/]h2>/)?.[1]
          .replaceAll('&amp;', '&').replace(/<[^>]*>/g, '').trim();
        if (!heading) continue;
        const kind = classifyReviewSection({
          heading, id: tag.match(/\bid="([^"]+)"/)?.[1], kind: tag.match(/data-review-section="([^"]+)"/)?.[1],
          isPros: /class="[^"]*\bpros-cons-grid\b/.test(content),
        });
        const hasGrid = /class="[^"]*\bfeatures-grid\b/.test(content);
        const cards = (content.match(/class="[^"]*\bfeature-card\b/g) || []).length;
        if (kind === 'pros') {
          pros++;
          assert.ok(hasGrid && cards >= 2, file);
        }
        if (kind === 'suitability' && hasGrid) {
          suitability++;
          assert.ok(cards > 0, file);
        }
      }
    }
  }
  assert.ok(highlights && pros && suitability);
  t.diagnostic(total + ' localized routes; ' + highlights + ' highlight grids, ' + pros +
    ' comparison grids and ' + suitability + ' suitability grids audited');
});

test('all three review strips keep a single row and homepage arrows align to the right', () => {
  const css = read('styles/brand-review.css');
  assert.match(css, /\[data-review-strip\] > \.brand-review-strip \{[^}]*flex-wrap: nowrap;[^}]*align-items: stretch;[^}]*overflow: auto hidden/);
  assert.match(css, /\[data-review-strip='pros'\], \[data-review-strip='suitability'\][^}]+flex-basis: min\(84%, 420px\)/);
  assert.match(css, /flex-basis: calc\(100% - 44px\)/);
  const home = read('styles/pages.css');
  assert.match(home, /\.home-brand-carousel-controls \{[^}]*margin-inline-start: auto/);
  assert.match(home, /body\.home-page \.home-games-toolbar \.home-games-controls \{ margin-inline-start: auto/);
});
