import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { topCasinosForCountry } from '../scripts/pages/top-casinos.js';

const markets = { DE: 'germany', PT: 'portugal' };
const slugs = ['22bet', 'azurslot', '22bit', 'betlabel', '22casino', 'planbet', 'safecasino'];
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const brandFor = slug => BRANDS.find(brand => brand.urlDetail === `brands/${slug}.html`);

test('partner removals exclude the seven brands from PT and DE country catalogs and rankings', () => {
  for (const slug of slugs) {
    const brand = brandFor(slug);
    assert.ok(brand.hasDetailPage && brand.urlCasino && brand.countries.includes('CA'), slug);
    for (const code of Object.keys(markets)) {
      assert.ok(!brand.countries.includes(code), slug);
      assert.ok(!brand.top?.includes(code), slug);
    }
  }
  for (const [code, country] of Object.entries(markets)) {
    const ranking = topCasinosForCountry(BRANDS, code);
    assert.equal(ranking.length, 5);
    assert.ok(ranking.every(brand => !slugs.some(slug => brand === brandFor(slug))));
    for (const lang of locales) {
      const prefix = lang === 'en' ? '' : lang + '/';
      const html = readFileSync(`${prefix}online-casinos/${country}/index.html`, 'utf8');
      const list = html.match(/<!-- crawlable-reviews:start -->[\s\S]*?<!-- crawlable-reviews:end -->/)?.[0];
      assert.ok(list, `${lang}/${country}`);
      assert.equal(Number(list.match(/<span>\((\d+)\)<\/span>/)?.[1]), [...list.matchAll(/<a\b/g)].length);
      for (const slug of slugs) assert.ok(!html.includes(`brands/${slug}/`), `${lang}/${country}/${slug}`);
      assert.ok(html.includes(`/${prefix}brands/coldbet/`), 'ColdBet remains in these markets');
    }
  }
});

test('all localized directory rows are synchronized, and direct review links remain active', () => {
  execFileSync(process.execPath, ['tools/sync-brand-market-removals.mjs', '--countries=DE,PT', ...slugs]);
  for (const lang of locales) {
    const prefix = lang === 'en' ? '' : lang + '/';
    for (const slug of slugs) {
      const html = readFileSync(`${prefix}brands/${slug}/index.html`, 'utf8');
      assert.ok(html.includes(`rel="canonical" href="https://spincresta.com/${prefix}brands/${slug}/"`), `${lang}/${slug}`);
      const ctas = [...html.matchAll(/<a\b(?=[^>]*class="cta-brands")[^>]*href="([^"]+)"/g)]
        .map(([, href]) => href.replaceAll('&amp;', '&'));
      assert.deepEqual([...new Set(ctas)], [brandFor(slug).urlCasino], `${lang}/${slug}`);
    }
  }
});
