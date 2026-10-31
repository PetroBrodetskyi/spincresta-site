import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { BRANDS } from '../scripts/brands.js';
import { syncUnavailableBrandMarkup, unavailableLabel } from './sync-brand-availability.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const slugs = ['casinobossy', 'browinner'];
const brandFor = slug => BRANDS.find(brand => brand.urlDetail === `brands/${slug}.html`);
const anchors = html => [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a\s*>/g)].map(match => match[0]);
const reference = brandFor('retrobet');

test('Casinobossy and Browinner use the established Retrobet unavailable state', () => {
  for (const slug of slugs) {
    const brand = brandFor(slug);
    for (const property of ['urlCasino', 'notRecommended', 'temporarilyUnavailable', 'hasDetailPage']) {
      assert.equal(brand[property], reference[property], `${slug}: ${property}`);
    }
    assert(brand.countries.includes('ES') && brand.countries.includes('KR'), 'historical market data is retained');
    assert(brand.payments.length && brand.image && brand.bgColor, 'review data remains intact');
  }
});

for (const locale of locales) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  for (const slug of slugs) {
    test(`${locale}/${slug}: static review and catalog cannot send casino traffic`, () => {
      const brand = brandFor(slug);
      const html = fs.readFileSync(`${prefix}brands/${slug}/index.html`, 'utf8');
      assert.equal(anchors(html).filter(anchor => /class="[^"]*\bcta-brands\b/.test(anchor)).length, 0);
      assert.equal([...html.matchAll(/<button\b[^>]*class="cta-brands cta-blocked"[^>]*disabled[^>]*aria-disabled="true"/g)].length, 2);
      assert(html.includes(unavailableLabel(locale)));
      assert(!/offer_id=(?:124532|124533)/.test(html));
      assert(!/<meta\b[^>]*name="robots"[^>]*content="[^"]*noindex/.test(html), 'the review stays indexable');
      assert.equal(syncUnavailableBrandMarkup(html, brand, locale), html, 'review synchronization is idempotent');

      const catalog = fs.readFileSync(`${prefix}casinos-and-betting/index.html`, 'utf8');
      const row = [...catalog.matchAll(/<article\b[^>]*class="casino-list-row"[\s\S]*?<\/article>/g)]
        .find(match => match[0].includes(`brands/${slug}/`))?.[0];
      assert(row, 'the historical review remains in the directory');
      assert(row.includes('class="cta cta-blocked" type="button" disabled aria-disabled="true"'));
      assert(anchors(row).some(anchor => anchor.includes(`brands/${slug}/`)), 'internal review links stay accessible');
      assert(!anchors(row).some(anchor => /href="https?:/.test(anchor)));
      assert.equal(syncUnavailableBrandMarkup(catalog, brand, locale), catalog);
    });
  }
}

test('availability synchronization preserves active brands and internal review links', () => {
  const fixture = '<article class="casino-list-row"><a class="cta" href="/brands/browinner/">Review</a><a class="cta" href="https://tracker.example/click">Play</a></article>';
  const brand = brandFor('browinner');
  const blocked = syncUnavailableBrandMarkup(fixture, brand, 'en');
  assert(blocked.includes('href="/brands/browinner/"'));
  assert(!blocked.includes('https://tracker.example'));
  assert.equal(syncUnavailableBrandMarkup(fixture, { ...brand, temporarilyUnavailable: false }, 'en'), fixture);
});

test('Casinobossy generation cannot restore old or empty casino links', () => {
  const source = fs.readFileSync('tools/build-casinobossy-reviews.mjs', 'utf8').replace(/^import .*;\r?\n/gm, '');
  assert(!source.includes('offer_id=124533'), 'generator uses the registry, not a hardcoded destination');
  const generated = new Map();
  vm.runInNewContext(source, {
    fs: { readFileSync: fs.readFileSync, readdirSync: () => [], writeFileSync: (file, html) => generated.set(file, html) },
    BRANDS, syncUnavailableBrandMarkup, console: { log() {} },
  });
  for (const locale of locales) {
    const html = generated.get(`${locale === 'en' ? '' : `${locale}/`}brands/casinobossy/index.html`);
    assert(html.includes(unavailableLabel(locale)));
    assert(!anchors(html).some(anchor => /\bcta-brands\b/.test(anchor)));
    assert(!html.includes('href=""'));
  }
});
