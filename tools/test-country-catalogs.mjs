import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { COUNTRIES } from '../scripts/countries.js';
import { HOME_LABELS } from './polish-homepage-labels.mjs';
import { simplifyCountryCatalog } from './simplify-country-catalogs.mjs';

const root = new URL('../', import.meta.url);

for (const locale of Object.keys(HOME_LABELS)) {
  test(`${locale}: all country catalogs retain their original routes and editorial sections`, () => {
    const prefix = locale === 'en' ? '/' : `/${locale}/`;
    for (const country of COUNTRIES) {
      const pathname = `${prefix}online-casinos/${country.slug}/`;
      const html = fs.readFileSync(new URL(`.${pathname}index.html`, root), 'utf8');
      const canonical = html.match(/<link\b(?=[^>]*\brel="canonical")[^>]*href="([^"]+)"/i)?.[1];
      assert.equal(canonical, `https://spincresta.com${pathname}`);
      assert.match(html, /class="home-country-hero country-catalog-heading container"/);
      assert.match(html, /class="content country-catalog-results"/);
      assert.match(html, /id="brand-cards"/);
      assert.doesNotMatch(html, /class="country-catalog-intro"/);
      assert.match(html, /id="expert-review"/);
      assert.match(html, /href="\/styles\.css\?v=[^"]+-expert-contrast"/, pathname);
      assert.equal(simplifyCountryCatalog(html, locale, country), html);
    }
  });
}

test('the shared light expert card sets readable colors without depending on a desktop breakpoint', () => {
  const css = fs.readFileSync(new URL('styles/section-contrast-preview.css', root), 'utf8');
  const core = fs.readFileSync(new URL('styles/core.css', root), 'utf8');
  const style = css.slice(css.indexOf('html:root body[data-country] .expert-review {'),
    css.indexOf('html:root body :is(.brand-related-reviews, .country-new-games)'));
  assert.doesNotMatch(style, /@media/);
  assert.match(style, /\.expert-card\s*\{[^}]*background: #fff;/);
  assert.match(style, /\.expert-byline-label, \.expert-meta, \.expert-body > p, \.expert-criteria li\s*\)\s*\{\s*color: var\(--text-muted\)/);
  assert.match(style, /\.expert-info h3, \.expert-body > p:first-of-type\s*\)\s*\{\s*color: var\(--text-main\)/);
  assert.match(style, /\.expert-methodology > li:nth-child\(n\)\s*\{[^}]*background: #f1f4f9;\s*color: var\(--text-muted\)/);
  assert.match(style, /\.expert-linkedin\s*\{\s*color: var\(--editorial-blue\)/);
  assert.match(style, /\.expert-linkedin\):focus-visible\s*\{[^}]*outline: 2px solid/);

  const luminance = hex => hex.match(/.{2}/g).map(pair => {
    const s = parseInt(pair, 16) / 255;
    return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4;
  }).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
  for (const name of ['text-main', 'text-muted', 'editorial-blue']) {
    const hex = (core + css).match(new RegExp(`--${name}: #([a-f0-9]{6});`, 'i'))?.[1];
    assert.ok(hex, name);
    for (const surface of ['ffffff', 'f1f4f9']) {
      assert.ok((luminance(surface) + .05) / (luminance(hex) + .05) >= 4.5, name);
    }
  }
});
