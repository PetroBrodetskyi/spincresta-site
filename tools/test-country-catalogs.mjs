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
      assert.equal(simplifyCountryCatalog(html, locale, country), html);
    }
  });
}
