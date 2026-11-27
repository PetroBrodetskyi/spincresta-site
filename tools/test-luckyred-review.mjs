import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { escapeReview as esc } from './brand-review-template.mjs';
import { localeCopy } from './luckyred-review-copy.mjs';

const brand = BRANDS.find(item => item.urlDetail === 'brands/luckyred.html');
const read = path => readFileSync('.' + path + (path.endsWith('/') ? 'index.html' : ''), 'utf8');
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const route = lang => prefix(lang) + 'brands/luckyred/';
const locales = Object.keys(localeCopy);

test('Lucky Red retains the approved US scope, tracking and user-supplied logo', () => {
  assert.deepEqual(brand.countries, ['US']);
  assert.deepEqual(brand.top, ['US']);
  assert.equal(brand.isExclusive, true);
  assert.ok(brand.hasDetailPage && !brand.reviewComingSoon);
  assert.equal(brand.image, 'images/luckyred.png');
  assert.ok(existsSync(brand.image));
  assert.equal(brand.bgColor, '#1A0302');
  assert.equal(new URL(brand.urlCasino).searchParams.get('offer_id'), '128780');
  assert.equal(new Set(BRAND_NEW_GAMES.luckyred.map(game => game.image)).size, 6);
  assert.deepEqual(BRAND_SNAPSHOT_CONFIGS.luckyred.tabs.map(tab => tab.label), ['Games']);
  assert.deepEqual(getReviewProviders('luckyred'), [['Realtime Gaming', 'realtime-gaming']]);
  assert.ok(existsSync('images/providers/realtime-gaming.png'));
});

for (const lang of locales) test(lang + ': Lucky Red has the complete review, verified terms and crawlable links', async () => {
  const html = read(route(lang));
  const href = 'href="' + esc(brand.urlCasino) + '"';
  const [reviewTitle, title, dynamicBonus] = localeCopy[lang][0].split('|');
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  assert.ok(html.includes('<h1>' + esc(reviewTitle) + '</h1>'));
  assert.ok(html.includes('<title>' + esc(title) + '</title>'));
  assert.ok(html.includes('src="/' + brand.image + '"'));
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /jackspay|review-coming-soon|offer_id=119927|href="https?:\/\/(?:www\.)?luckyredcasino\.com|data-review-section="sports"/i);
  const page = graph.find(node => node['@type'] === 'WebPage');
  assert.equal(page.image, BRAND_HOMEPAGE_SCREENSHOTS.luckyred);
  assert.equal(page.url, 'https://spincresta.com' + route(lang));
  assert.ok(html.includes(href + ' class="cta-brands"'));
  assert.match(html, /<td>50×<\/td><td>50×<\/td>/);
  assert.match(html, /LUCKYRED400[\s\S]*LUCKYRED100/);
  assert.match(html, /ALSI-202409030-FI2/);
  const gallery = html.match(/<section class="brand-new-games-panel"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(gallery && gallery.split(href).length === 7);
  if (lang === 'en') assert.ok(gallery.includes('>New Games</h2>'));
  if (lang === 'uk') assert.ok(gallery.includes('>Нові ігри</h2>'));
  for (const {name, image} of BRAND_NEW_GAMES.luckyred) assert.ok(gallery.includes('<span>' + esc(name) + '</span>') && gallery.includes('src="' + image + '"'));
  assert.deepEqual([...html.matchAll(/<section\b[^>]*data-review-section="([^"]+)"/g)].map(([, key]) => key),
    ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust', 'providers', 'pros', 'suitability', 'faq']);
  assert.equal((html.match(/<span>- /g) || []).length, 8);
  const faq = graph.find(node => node['@type'] === 'FAQPage').mainEntity;
  assert.equal(faq.length, 8);
  for (const {name, acceptedAnswer} of faq) assert.ok(html.includes('<h3>' + esc(name) + '</h3><p>' + esc(acceptedAnswer.text) + '</p>'));
  for (const locale of locales) assert.ok(html.includes('hreflang="' + (locale === 'fi' ? 'fi-FI' : locale) + '" href="https://spincresta.com' + route(locale) + '"'));
  assert.ok(read('/sitemap.xml').includes('<loc>https://spincresta.com' + route(lang) + '</loc>'));
  for (const target of ['casinos-and-betting/', 'online-casinos/united-states/', 'game-providers/']) {
    assert.ok(read(prefix(lang) + target).includes('href="' + route(lang) + '"'), target);
  }
  if (lang === 'en') assert.equal(brand.bonus, dynamicBonus);
  else assert.equal((await import('../scripts/brand-bonus-translations/' + lang + '.js')).default[brand.bonus], dynamicBonus);
});
