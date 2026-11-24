import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { copy, headlines, locales, offer } from './jackspay-review-copy.mjs';
import { escapeReview as esc } from './brand-review-template.mjs';

const brand = BRANDS.find(value => value.urlDetail === 'brands/jackspay.html');
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const route = lang => prefix(lang) + 'brands/jackspay/';
const read = urlPath => readFileSync('.' + urlPath + (urlPath.endsWith('/') ? 'index.html' : ''), 'utf8');
const affiliate = 'https://armadaapp.media-412.com/click?pid=3862&offer_id=128692';

test('Jacks Pay uses the supplied US scope, verified payments and approved media', () => {
  assert.deepEqual(brand.countries, ['US']);
  assert.equal(brand.urlCasino, affiliate);
  assert.ok(existsSync(brand.image));
  assert.equal(brand.bonus, '3 × 200% up to $6,000 + $100 in Free Chips');
  assert.equal(offer('en', true), '3 × 250% up to $7,500 + $100 in Free Chips');
  assert.equal(new Set(BRAND_NEW_GAMES.jackspay.map(game => game.image)).size, 6);
  assert.deepEqual(BRAND_SNAPSHOT_CONFIGS.jackspay.tabs[1].available, ['Live blackjack', 'Live poker', 'Live roulette']);
  for (const payment of brand.payments) assert.ok(existsSync('icons/payments/' + payment + '.svg'), payment);
});

for (const lang of locales) test(lang + ': Jacks Pay has localized template, crawlable games and matching FAQ schema', async () => {
  const html = read(route(lang));
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(html.includes('<h1>' + esc(copy[lang].reviewTitle) + '</h1>'));
  assert.ok(html.includes('src="/' + brand.image + '"'));
  const page = graph.find(node => node['@type'] === 'WebPage');
  assert.equal(page.image, BRAND_HOMEPAGE_SCREENSHOTS.jackspay);
  assert.equal(page.url, 'https://spincresta.com' + route(lang));
  assert.match(html, /data-brand="jackspay"/);
  assert.doesNotMatch(html, /slotsandcasino|href="https?:\/\/(?:www\.)?jackspay\.ag|data-review-section="sports"/i);
  assert.match(html, /<td>20×<\/td><td>30×<\/td>/);
  assert.match(html, /<td>([^<]*10[^<]+)<\/td><td>\1<\/td>/);
  const href = 'href="' + esc(affiliate) + '"';
  assert.ok(html.includes(href + ' class="cta-brands"'));
  const gallery = html.match(/<section class="brand-new-games-panel"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(gallery && gallery.split(href).length === 7);
  for (const { name, image } of BRAND_NEW_GAMES.jackspay) {
    assert.ok(gallery.includes('<span>' + esc(name) + '</span>') && gallery.includes('src="' + image + '"'));
  }
  const sections = [...html.matchAll(/<section\b[^>]*data-review-section="([^"]+)"/g)].map(([, key]) => key);
  assert.deepEqual(sections, ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust', 'providers', 'pros', 'suitability', 'faq']);
  assert.equal((html.match(/<span>- /g) || []).length, 8);
  const suitability = html.match(/<section class="container" id="jackspay-suitability"[\s\S]*?<\/section>/)[0];
  assert.equal((suitability.match(/class="feature-card glass-card"/g) || []).length, 2);
  const faq = graph.find(node => node['@type'] === 'FAQPage').mainEntity;
  assert.equal(faq.length, 8);
  for (const { name, acceptedAnswer } of faq) assert.ok(html.includes('<h3>' + esc(name) + '</h3><p>' + esc(acceptedAnswer.text) + '</p>'));
  for (const other of locales) assert.ok(html.includes('hreflang="' + (other === 'fi' ? 'fi-FI' : other) + '" href="https://spincresta.com' + route(other) + '"'));
  assert.ok(read('/sitemap.xml').includes('<loc>https://spincresta.com' + route(lang) + '</loc>'));
  for (const target of ['casinos-and-betting/', 'online-casinos/united-states/', 'game-providers/']) {
    assert.ok(read(prefix(lang) + target).includes('href="' + route(lang) + '"'), target);
  }
  if (lang !== 'en') assert.equal((await import('../scripts/brand-bonus-translations/' + lang + '.js')).default[brand.bonus], headlines[lang]);
});
