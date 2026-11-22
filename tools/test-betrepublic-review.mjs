import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { COUNTRIES } from '../scripts/countries.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { relatedBrandReviews } from '../scripts/pages/related-brand-reviews.js';
import { getBrandDetailSlug as slug } from '../scripts/featured-brands.js';
import copy from './betrepublic-review-copy.mjs';

const locales = Object.keys(copy);
const brand = BRANDS.find(item => item.name === 'BetRepublic');
const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const casino = brand.urlCasino.replaceAll('&', '&amp;');

test('BetRepublic retains every agreed GEO, the approved CTA and the Cloudinary game set', () => {
  assert.deepEqual(brand.countries, ['ES', 'DE', 'AT', 'NO', 'FI', 'IE', 'HU', 'PL', 'SI', 'SK', 'CZ', 'IT', 'CH', 'BE', 'CA', 'AU', 'NZ']);
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124844');
  assert.equal(BRAND_NEW_GAMES.betrepublic.length, 6);
  assert.ok(BRAND_NEW_GAMES.betrepublic.every(game => game.image.startsWith('https://res.cloudinary.com/drj61gmd2/')));
  assert.equal(BRAND_SNAPSHOT_CONFIGS.betrepublic.tabs.length, 3);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.betrepublic.labels.en['Not surfaced:'], 'Not surfaced:');
});

test('localized reviews are indexable with matching canonical, FAQ and market links', () => {
  const sitemap = read('sitemap.xml');
  for (const lang of locales) {
    const prefix = lang === 'en' ? '' : lang + '/';
    const route = '/' + prefix + 'brands/betrepublic/';
    const url = 'https://spincresta.com' + route;
    const html = read(prefix + 'brands/betrepublic/index.html');
    assert.match(html, /data-brand="betrepublic"/);
    assert.doesNotMatch(html, /noindex|kingmaker|betonwin|betrepublic2\.com/i);
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`));
    assert.ok(sitemap.includes(`<loc>${url}</loc>`));
    assert.equal([...html.matchAll(/rel="alternate" hreflang=/g)].length, 11);
    const links = [...html.matchAll(/<a\b(?=[^>]*class="cta-brands")[^>]*href="([^"]+)"/g)].map(match => match[1]);
    assert.ok(links.length >= 2 && links.every(href => href === casino), lang);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    const faq = graph.find(node => node['@type'] === 'FAQPage').mainEntity;
    assert.equal(faq.length, 5);
    const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
    for (const q of faq) assert.ok(html.includes(`<h3>${escape(q.name)}</h3><p>${escape(q.acceptedAnswer.text)}</p>`));
    assert.match(html, /data-review-section="sports" data-review-details/);
    for (const country of COUNTRIES) {
      const page = read(`${prefix}online-casinos/${country.slug}/index.html`);
      assert.equal(page.includes(`href="${route}"`), brand.countries.includes(country.code.toUpperCase()), `${lang}/${country.slug}`);
    }
  }
});

test('related reviews rank by shared GEO and exclude the current brand and unpublished reviews', () => {
  const make = (id, countries, overrides = {}) => ({ urlDetail: `brands/${id}.html`, hasDetailPage: true, image: 'logo.svg', countries, ...overrides });
  const current = make('current-test', ['us', 'CA']);
  const canada = make('canada-test', ['CA', 'CA']);
  const both = make('both-test', ['US', 'ca']);
  assert.deepEqual(relatedBrandReviews(current, [
    current, canada, both, canada, make('other-test', ['JP']), make('pending-test', ['US'], { reviewComingSoon: true }),
    make('paused-test', ['US'], { temporarilyUnavailable: true }), make('not-rated-test', ['US'], { notRecommended: true }),
  ], slug), [both, canada]);
  for (const item of BRANDS) {
    const page = new URL(`../brands/${slug(item)}/index.html`, import.meta.url);
    if (!existsSync(page)) continue;
    assert.equal(Boolean(item.reviewComingSoon), readFileSync(page, 'utf8').includes('brand-coming-soon-page'), item.name);
  }
});
