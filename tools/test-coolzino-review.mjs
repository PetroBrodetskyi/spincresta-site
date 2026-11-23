import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { casinoTiers, sportsTiers, copy, fields } from './coolzino-review-copy.mjs';
import { escapeReview as esc } from './brand-review-template.mjs';
import { unavailableLabel } from './sync-brand-availability.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const brand = BRANDS.find(item => item.urlDetail === 'brands/coolzino.html');

test('Coolzino retains market and payment data; EUR figures and observed providers are complete', () => {
  assert.equal(brand.temporarilyUnavailable, true);
  assert.equal(brand.notRecommended, true);
  assert.equal(brand.urlCasino, '');
  assert.equal(brand.hasDetailPage, true);
  assert.deepEqual(brand.countries, ['IT', 'GR', 'BE', 'PL', 'AU', 'CH', 'AT', 'NO', 'DK', 'PT', 'IE', 'CA', 'NZ']);
  assert.deepEqual(brand.payments, ['visa', 'mastercard', 'googlepay', 'applepay', 'ethereum', 'bitcoin']);
  assert.deepEqual(casinoTiers, [[1, 100, 500, 150], [2, 55, 500, 100], [3, 100, 500, 0]]);
  assert.deepEqual(sportsTiers, [[1, 100, 100], [2, 75, 150], [3, 50, 200]]);
  assert.equal(getReviewProviders('coolzino').length, 11);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.coolzino.tabs.length, 3);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.coolzino.labels.en['Not surfaced:'], 'Not surfaced:');
  assert.equal(BRAND_NEW_GAMES.coolzino.length, 6);
});

test('all ten localized reviews and catalog rows disable the casino CTA but keep review navigation', () => {
  const sitemap = read('sitemap.xml');
  for (const [lang, values] of Object.entries(copy)) {
    const prefix = lang === 'en' ? '' : lang + '/';
    const path = `${prefix}brands/coolzino/`;
    const html = read(path + 'index.html');
    const url = 'https://spincresta.com/' + path;
    assert.equal(values.length, fields.length, lang);
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`), lang);
    assert.ok(sitemap.includes(`<loc>${url}</loc>\n    <lastmod>2026-11-23</lastmod>`), lang);
    assert.equal((html.match(/rel="alternate" hreflang/g) || []).length, 11, lang);
    assert.doesNotMatch(html, /ColdBet|381coolzino\.com|(?:https?:\/\/)?coolzino\.com|noindex|AggregateRating|offer_id=120782/i, lang);
    assert.doesNotMatch(html, /<a\b[^>]*class="cta-brands/, lang);
    const ctas = [...html.matchAll(/<button class="cta-brands cta-blocked" type="button" disabled aria-disabled="true">([^<]+)<\/button>/g)];
    assert.equal(ctas.length, 2, lang);
    assert.ok(ctas.every(([, label]) => label === unavailableLabel(lang)), lang);
    const catalog = read(prefix + 'casinos-and-betting/index.html');
    const row = [...catalog.matchAll(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)]
      .find(([article]) => article.includes(`href="/${path}"`))?.[0];
    assert.ok(row, lang);
    assert.doesNotMatch(row, /offer_id=120782|sponsored/, lang);
    assert.ok(row.includes(`<button class="cta cta-blocked" type="button" disabled aria-disabled="true">${unavailableLabel(lang)}</button>`), lang);
    assert.match(html, /id="coolzino-sports" data-review-section="sports" data-review-details/);
    assert.match(html, /id="coolzino-providers"[\s\S]*?data-strip-next[^>]*aria-controls="coolzino-providers-strip"/);
    const schema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.equal(schema.find(item => item['@type'] === 'Article').dateModified, '2026-11-23', lang);
    const faq = schema.find(item => item['@type'] === 'FAQPage').mainEntity;
    assert.equal(faq.length, 8, lang);
    for (const question of faq) assert.ok(html.includes(`<h3>${esc(question.name)}</h3><p>${esc(question.acceptedAnswer.text)}</p>`), lang);
  }
});
