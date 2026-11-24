import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { test } from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { getBrandDetailSlug } from '../scripts/featured-brands.js';

// Ignore Cloudinary delivery transforms and format suffixes, not the asset path.
const capturePath = url =>
  /^https:\/\/res\.cloudinary\.com\/drj61gmd2\/image\/upload\/.*?(spincresta\/brands\/[^/]+\/main-page\/[^?#]+)/.exec(url)?.[1]
    .replace(/\.(?:webp|avif|png|jpe?g)$/i, '');

const openGraphImage = html => html.match(/<meta\b[^>]*\bproperty="og:image"[^>]*>/i)?.[0]
  .match(/\bcontent="([^"]+)"/)?.[1];

test('each English brand review with a site capture uses the same asset in its catalog card', () => {
  const reviewSlugs = new Set(BRANDS.filter(brand => brand.hasDetailPage).map(getBrandDetailSlug));
  const expected = [];
  const actual = [];
  for (const slug of reviewSlugs) {
    const page = new URL(`../brands/${slug}/index.html`, import.meta.url);
    if (!existsSync(page)) continue;
    const html = readFileSync(page, 'utf8');
    const capture = capturePath(openGraphImage(html));
    if (!capture) continue;
    expected.push([slug, capture]);
    actual.push([slug, capturePath(BRAND_HOMEPAGE_SCREENSHOTS[slug])]);
  }
  assert.ok(expected.length > 100, 'review capture audit must cover the brand catalog');
  assert.deepEqual(actual, expected);
});

test('Goldenbet market reviews and the BC.Game and Yep Casino reviews share the card capture in all languages', () => {
  for (const slug of ['goldenbet-uk', 'goldenbet-au', 'bcgame', 'yepcasino']) {
    const expected = capturePath(BRAND_HOMEPAGE_SCREENSHOTS[slug]);
    assert.ok(expected, slug);
    for (const prefix of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
      const route = `${prefix}brands/${slug}/index.html`;
      const html = readFileSync(new URL(`../${route}`, import.meta.url), 'utf8');
      assert.equal(capturePath(openGraphImage(html)), expected, route);
    }
  }
});
