import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { getFeaturedHomeBrands } from '../scripts/featured-brands.js';
import { homeBrandScrollStep } from '../scripts/pages/home.js';

const featuredSlugs = [
  'onlywin', 'fraga-ar', 'spinboss', 'stonevegas', 'lizaro',
  'zarbet', 'trino', 'gamblezen', '10bet', 'spinrise',
  'pinco', 'ybets', 'dazard', 'coolzino', '22bet',
  'casinado', 'magneticslots', 'goldenstar', 'moonwin', 'mrpunter',
];

test('the default homepage uses the 20 approved registry entries in editorial order', () => {
  const featured = getFeaturedHomeBrands([...BRANDS].reverse());
  assert.deepEqual(featured.map(brand => brand.urlDetail), featuredSlugs.map(slug => `brands/${slug}.html`));
  assert.deepEqual(featured[1].countries, ['AR']);
  for (const brand of featured) {
    assert.equal(brand, BRANDS.find(entry => entry.urlDetail === brand.urlDetail));
    assert.ok(brand.urlCasino && brand.image, brand.name);
  }
  for (const locale of ['', 'uk/']) {
    for (const slug of featuredSlugs) {
      const page = `../${locale}brands/${slug}/index.html`;
      assert.ok(existsSync(new URL(page, import.meta.url)), page);
    }
  }
});

test('a brand becomes ineligible for homepage recommendations if it or its review is withdrawn', () => {
  const offlineFlags = [{ notRecommended: true }, { temporarilyUnavailable: true }, { hasDetailPage: false }];
  for (const flags of offlineFlags) {
    const registry = BRANDS.map(brand => brand.urlDetail === 'brands/fraga-ar.html' ? { ...brand, ...flags } : brand);
    const featured = getFeaturedHomeBrands(registry);
    assert.equal(featured.length, 19);
    assert.ok(!featured.some(brand => brand.name === 'Fraga'));
  }
});

test('carousel arrows advance full columns and still move on narrow viewports', () => {
  assert.equal(homeBrandScrollStep(1200, 260, 16), 1104);
  assert.equal(homeBrandScrollStep(340, 240, 12), 252);
  assert.equal(homeBrandScrollStep(240, 265, 12), 277);
  assert.equal(homeBrandScrollStep(340, 0, 0), 340);
});

test('localized Fraga Argentina cards keep the registry amount and currency', async () => {
  const { bonus } = BRANDS.find(brand => brand.urlDetail === 'brands/fraga-ar.html');
  for (const locale of ['de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi']) {
    const { default: translated } = await import(`../scripts/brand-bonus-translations/${locale}.js`);
    assert.match(translated[bonus], /860[ ,.\u00a0\u202f]?000 ARS.*500/, locale);
  }
});
