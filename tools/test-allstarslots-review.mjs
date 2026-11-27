import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { allStarCopy, allStarHeadline } from './allstarslots-review-copy.mjs';
import { escapeReview as esc } from './brand-review-template.mjs';

const brand = BRANDS.find(b => b.urlDetail === 'brands/allstarslots.html');
const locales = Object.keys(allStarCopy);
const read = path => readFileSync('.' + path + (path.endsWith('/') ? 'index.html' : ''), 'utf8');
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const route = lang => prefix(lang) + 'brands/allstarslots/';

test('All Star Slots keeps the supplied offer, US-only market, brand artwork and verified RTG catalog', () => {
  assert.deepEqual(brand.countries, ['US']);
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=128781');
  assert.equal(brand.bgColor, '#A80018');
  assert.equal(brand.image, 'images/allstarslots.svg');
  assert.ok(existsSync(brand.image) && brand.hasDetailPage && !brand.reviewComingSoon);
  assert.equal(brand.bonus, allStarHeadline('en'));
  assert.equal(new Set(BRAND_NEW_GAMES.allstarslots.map(g => g.image)).size, 6);
  assert.deepEqual(getReviewProviders('allstarslots'), [['Realtime Gaming', 'realtime-gaming']]);
  assert.deepEqual(BRAND_SNAPSHOT_CONFIGS.allstarslots.tabs[1].available, ['Live baccarat', 'Live blackjack', 'Live roulette']);
  for (const method of brand.payments) assert.ok(existsSync('icons/payments/' + method + '.svg'), method);
  assert.ok(!brand.payments.includes('interac'), 'U.S. availability of Interac is not verified');
});

for (const lang of locales) test(lang + ': verified tiers, standard blocks, indexable artwork and hreflang', async () => {
  const html = read(route(lang));
  const href = 'href="' + esc(brand.urlCasino) + '"';
  const [reviewTitle, title] = allStarCopy[lang][0].split('|');
  assert.ok(html.includes('<h1>' + esc(reviewTitle) + '</h1>'));
  assert.ok(html.includes('<title>' + esc(title) + '</title>'));
  assert.ok(html.includes('src="/' + brand.image + '"'));
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /jackspay|Jacks Pay|href="https?:\/\/(?:www\.)?allstarslots\.com|data-review-section="sports"/i);
  assert.ok(html.includes(href + ' class="cta-brands"'));
  assert.match(html, /<td>250\s*%<\/td><td>300\s*%<\/td>/);
  assert.match(html, /<td>350\s*%<\/td><td>400\s*%<\/td>/);
  assert.match(html, /<td>450\s*%<\/td><td>500\s*%<\/td>/);
  assert.match(html, /ALSI-202409030-FI2/);
  const gallery = html.match(/<section class="brand-new-games-panel"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(gallery && gallery.split(href).length === 7);
  if (lang === 'en') assert.ok(gallery.includes('>New Games</h2>'));
  if (lang === 'uk') assert.ok(gallery.includes('>Нові ігри</h2>'));
  for (const {name, image} of BRAND_NEW_GAMES.allstarslots) assert.ok(gallery.includes('<span>' + esc(name) + '</span>') && gallery.includes('src="' + image + '"'));
  assert.deepEqual([...html.matchAll(/<section\b[^>]*data-review-section="([^"]+)"/g)].map(([, key]) => key),
    ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust', 'providers', 'pros', 'suitability', 'faq']);
  assert.equal((html.match(/<span>- /g) || []).length, 8);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const page = graph.find(node => node['@type'] === 'WebPage');
  assert.equal(page.image, BRAND_HOMEPAGE_SCREENSHOTS.allstarslots);
  assert.equal(page.url, 'https://spincresta.com' + route(lang));
  const faq = graph.find(node => node['@type'] === 'FAQPage').mainEntity;
  assert.equal(faq.length, 8);
  for (const {name, acceptedAnswer} of faq) assert.ok(html.includes('<h3>' + esc(name) + '</h3><p>' + esc(acceptedAnswer.text) + '</p>'));
  for (const alternate of locales) assert.ok(html.includes('hreflang="' + (alternate === 'fi' ? 'fi-FI' : alternate) + '" href="https://spincresta.com' + route(alternate) + '"'));
  assert.ok(read('/sitemap.xml').includes('<loc>https://spincresta.com' + route(lang) + '</loc>'));
  for (const target of ['casinos-and-betting/', 'online-casinos/united-states/', 'game-providers/'])
    assert.ok(read(prefix(lang) + target).includes('href="' + route(lang) + '"'), target);
  if (lang !== 'en') assert.equal((await import('../scripts/brand-bonus-translations/' + lang + '.js')).default[brand.bonus], allStarHeadline(lang));
});
