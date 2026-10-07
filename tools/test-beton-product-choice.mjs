import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { BETON_PRODUCT_CHOICE, updateBetonProductChoice } from './update-beton-product-choice.mjs';

for (const [locale, copy] of Object.entries(BETON_PRODUCT_CHOICE)) {
  test(`${locale}: BetOn product choice uses the shared left sidebar and internal-review button`, () => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const html = fs.readFileSync(`${prefix}brands/beton/index.html`, 'utf8');
    const section = html.match(/<section class="container" id="best-for">[\s\S]*?<\/section>/)?.[0];
    assert.ok(section);
    assert.equal([...html.matchAll(/id="best-for"/g)].length, 1);
    assert.equal([...section.matchAll(/class="feature-card glass-card"/g)].length, 2);
    assert.ok(section.includes(`<a href="/${prefix}brands/beton-sport/" class="view-all">${copy.link}</a>`));
    assert.ok(!/<span[^>]*>[\s\S]*?<a\b[\s\S]*?<\/span>/.test(section), 'Link is separate from the description');
    assert.ok(section.includes(copy.sportText));
    assert.ok(!/style=|https?:\/\//.test(section), 'No custom style or external operator link');
    assert.equal(updateBetonProductChoice(html, locale), html, 'Repeatable updater');
  });
}

test('Product choice reuses the existing responsive binding and button styles', () => {
  const layout = fs.readFileSync('scripts/pages/brand-layout.js', 'utf8');
  assert.ok(layout.includes("sections.find(section => section.id === 'best-for')"));
  assert.match(layout, /\[bestFor, prosCons\][\s\S]*?target: aside,[\s\S]*?className: 'brand-sidebar-section',[\s\S]*?mediaQuery: '\(min-width: 901px\)'/);
  assert.ok(layout.includes('placeholder.after(element)'));
  const css = fs.readFileSync('styles/pages.css', 'utf8');
  assert.match(css, /\.view-all\s*\{[^}]*text-decoration:\s*none/);
  assert.match(css, /\.view-all:hover\s*\{[^}]*border-color:/);
});
