import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { copy, headlines, supplement } from './slotsandcasino-review-copy.mjs';
import { escapeReview } from './brand-review-template.mjs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const brand = BRANDS.find(item => item.urlDetail === 'brands/slotsandcasino.html');
const locs = Object.keys(copy);
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/slotsandcasino/';

test('Slots and Casino keeps approved geography, affiliate CTA and verified live categories', () => {
  assert.deepEqual(brand.countries, ['US']);
  assert.equal(brand.bonus, headlines.en);
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=121376');
  assert.ok(!brand.payments.includes('interac'));
  const snapshot = BRAND_SNAPSHOT_CONFIGS.slotsandcasino;
  assert.equal(snapshot.tabs.length, 2);
  assert.deepEqual(snapshot.tabs[1].available, ['Live blackjack', 'Live poker', 'Live roulette']);
  assert.equal(snapshot.labels.uk['Games & Betting Snapshot'], 'Огляд каталогу ігор');
});

test('Slots and Casino uses the six uploaded Cloudinary covers', () => {
  const games = BRAND_NEW_GAMES.slotsandcasino;
  assert.deepEqual(games.map(({ name }) => name), ['Cheetah Chase', 'Buy or Die', 'Oil Gushers', 'The Collector', 'Firestrike Hot Hits', 'Volt Rush Power Stack']);
  assert.equal(new Set(games.map(({ image }) => image)).size, 6);
  for (const { image } of games) {
    assert.match(image, /^https:\/\/res\.cloudinary\.com\/drj61gmd2\/image\/upload\/v\d+\/spincresta\/brands\/slotsandcasino\/new-games\//);
  }
});

for (const lang of locs) test(lang + ': Slots and Casino template and factual review data are synchronized', async () => {
  const html = read(route(lang).slice(1) + 'index.html');
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const page = graph.find(node => node['@type'] === 'WebPage');
  assert.equal(page.image, BRAND_HOMEPAGE_SCREENSHOTS.slotsandcasino);
  assert.equal(page.dateModified, '2026-11-24');
  assert.ok(html.includes('<link rel="canonical" href="https://spincresta.com' + route(lang) + '"'));
  for (const locale of locs) assert.ok(html.includes('hreflang="' + (locale === 'fi' ? 'fi-FI' : locale) + '" href="https://spincresta.com' + route(locale) + '"'));
  const faqs = graph.find(node => node['@type'] === 'FAQPage').mainEntity;
  assert.equal(faqs.length, 8);
  assert.deepEqual(faqs.slice(4).map(({ name }) => name), supplement[lang][3]);
  for (const { name, acceptedAnswer } of faqs) {
    assert.ok(html.includes('<h3>' + escapeReview(name) + '</h3><p>' + escapeReview(acceptedAnswer.text) + '</p>'));
  }
  assert.ok(html.includes('href="' + escapeReview(brand.urlCasino) + '" class="cta-brands"'));
  assert.doesNotMatch(html, /href="https?:\/\/(?:www\.)?slotsandcasino\.(?:ag|com)\b/i);
  const [gamesPanel] = [...html.matchAll(/<section class="brand-new-games-panel"[^>]*>[\s\S]+?<\/section>/g)];
  assert.ok(gamesPanel);
  assert.equal((html.match(/class="brand-new-game-card"/g) || []).length, 6);
  for (const { name, image } of BRAND_NEW_GAMES.slotsandcasino) {
    assert.ok(gamesPanel[0].includes('<span>' + escapeReview(name) + '</span>'), 'Visible HTML game name: ' + name);
    assert.ok(gamesPanel[0].includes('src="' + image + '"'), 'Cloudinary artwork: ' + name);
  }
  assert.equal(gamesPanel[0].split('href="' + escapeReview(brand.urlCasino) + '"').length - 1, 6);
  const matchingSection = key => html.match(new RegExp('<section class="container" id="slotsandcasino-' + key + '"[\\s\\S]+?</section>'))?.[0];
  const suitability = matchingSection('suitability');
  assert.equal((suitability.match(/class="feature-card glass-card"/g) || []).length, 2);
  assert.ok(suitability.includes(escapeReview(supplement[lang][0])));
  for (const key of ['pros', 'cons']) {
    const comparison = matchingSection('pros').split('is-' + key + '-card">')[1].split('</div>')[0];
    assert.equal((comparison.match(/<span>- /g) || []).length, 4);
  }
  assert.ok(html.includes(escapeReview(headlines[lang])));
  assert.ok(html.includes(escapeReview(copy[lang][18])));
  assert.match(html, /<td>30×<\/td><td>40×<\/td>/);
  assert.match(html, /<td>10<\/td><td>15<\/td>/);
  const sections = [...html.matchAll(/<section\b[^>]*data-review-section="([^"]+)"/g)].map(([, key]) => key);
  assert.deepEqual(sections, ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust', 'providers', 'pros', 'suitability', 'faq']);
  assert.match(html, /<section[^>]+id="slotsandcasino-trust"[\s\S]*?<table[\s\S]*?Online Casino Share Group/);
  const directory = read(prefix(lang) + 'casinos-and-betting/index.html');
  const listing = [...directory.matchAll(/<article class="casino-list-row"[\s\S]*?<\/article>/g)]
    .find(([row]) => row.includes('href="' + route(lang) + '"'))?.[0];
  assert.ok(listing);
  const details = [...listing.matchAll(/<p class="casino-bonus">\s*<strong>[^<]+<\/strong>([\s\S]*?)<\/p>/g)].map(([, value]) => value.trim());
  assert.equal(details[1], escapeReview(headlines[lang]));
  assert.ok(details[2] && !details[2].includes('%'), 'Country field must remain a country name');
  if (lang !== 'en') {
    const { default: bonuses } = await import('../scripts/brand-bonus-translations/' + lang + '.js');
    assert.equal(bonuses[brand.bonus], headlines[lang]);
  }
  assert.ok(read(prefix(lang) + 'game-providers/index.html').includes('class="provider-review-link" href="' + route(lang) + '"'));
});
