import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { copy, headlines, keys, reviewTitles, rewards, welcome } from './britsino-review-copy.mjs';
import { tableCopy } from './britsino-review-tables.mjs';
import { escapeReview as esc } from './brand-review-template.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const brand = BRANDS.find(item => item.urlDetail === 'brands/britsino.html');

test('keeps the Britsino partner market and approved CTA and correctly sums deposit maxima', () => {
  assert.deepEqual(brand.countries, ['UK']);
  assert.deepEqual(brand.top, ['UK']);
  assert.equal(new URL(brand.urlCasino).searchParams.get('offer_id'), '122325');
  assert.equal(brand.bonus, headlines.en);
  const maxima = [1, 2, 3, 4].map(stage => welcome.filter(([n]) => n === stage).at(-1));
  assert.deepEqual(maxima.reduce(([gbp, spins], [, , , cap, count]) => [gbp + cap, spins + count], [0, 0]), [2000, 700]);
  assert.equal(welcome.length, 10);
  assert.equal(rewards.length, 5);
  assert.equal(getReviewProviders('britsino').length, 15);
  assert.equal(BRAND_NEW_GAMES.britsino.length, 6);
});

test('Britsino separates electronic and live formats and does not mark listed games as missing', () => {
  const { tabs, labels } = BRAND_SNAPSHOT_CONFIGS.britsino;
  assert.deepEqual(tabs.map(tab => tab.label), ['Games', 'Live games']);
  const [games, live] = tabs;
  for (const name of ['Roulette', 'Blackjack', 'Card games', 'Poker', 'Lottery', 'Bingo', 'Scratch cards', 'Keno', 'Craps and dice']) {
    assert.ok(games.available.includes(name) && !games.unavailable.includes(name), name);
  }
  for (const name of ['Live roulette', 'Live blackjack', 'Live baccarat', 'Live poker', 'Live shows', 'Live dice games']) {
    assert.ok(live.available.includes(name) && !live.unavailable.includes(name), name);
  }
  assert.equal(labels.en['Not surfaced:'], 'Not surfaced:');
  for (const lang of Object.keys(copy)) assert.ok(labels[lang]['Not surfaced:'], lang);
});

test('all ten reviews and catalog cards use localized current copy and approved links', async () => {
  const sitemap = read('sitemap.xml');
  for (const [lang, values] of Object.entries(copy)) {
    const prefix = lang === 'en' ? '' : lang + '/';
    const path = prefix + 'brands/britsino/';
    const url = 'https://spincresta.com/' + path;
    const html = read(path + 'index.html');
    assert.equal(values.length, keys.length, lang);
    assert.ok(html.includes('<link rel="canonical" href="' + url + '"'), lang);
    assert.ok(html.includes('<h1>' + esc(reviewTitles[lang]) + '</h1>'), lang);
    assert.ok(html.includes('<title>' + esc(values[keys.indexOf('title')]) + '</title>'), lang);
    assert.equal((html.match(/rel="alternate" hreflang/g) || []).length, 11, lang);
    assert.ok(sitemap.includes('<loc>' + url + '</loc>\n    <lastmod>2026-11-23</lastmod>'), lang);
    assert.doesNotMatch(html, /ColdBet|320\s*%|https?:\/\/(?:www\.)?britsino\.com|data-review-section="sports"|AggregateRating/i, lang);
    assert.ok(html.includes(esc(values[keys.indexOf('license')])), lang);
    assert.ok(html.includes(esc(values[keys.indexOf('banking')])), lang);
    const highlights = html.match(/<section[^>]*id="brand-why-section"[^>]*>[^]*?<[/]section>/)?.[0];
    assert.match(highlights, /brand-highlights--compact/);
    assert.equal((highlights.match(/class="site-icon brand-highlight-icon"/g) || []).length, 6, lang);
    assert.doesNotMatch(highlights, /icon-placeholder/, lang);
    const topics = [...html.matchAll(/<section[^>]*data-review-section="([^"]+)"[^>]*>([^]*?)<[/]section>/g)]
      .map(([, kind, content]) => [kind, (content.match(/<table>/g) || []).length]).filter(([, tables]) => tables);
    assert.deepEqual(topics, [
      ['bonuses', 2], ['games', 1], ['rewards', 1], ['cashier', 1], ['trust', 1],
    ], lang);
    const suitability = html.match(/<section class="container" id="britsino-best-for"[^>]*>[^]*?<[/]section>/)?.[0];
    assert.equal((suitability?.match(/class="feature-card glass-card"/g) || []).length, 2, lang);
    assert.ok(suitability.includes(esc(tableCopy[lang][3])) && suitability.includes(esc(tableCopy[lang][4])), lang);
    for (const name of ['Classic Multihand Blackjack', 'Bingo Power', 'Rainbow Fruit Scratch', 'Gravity Wheel']) {
      assert.ok(html.includes(name), lang + ' ' + name);
    }
    const ctas = [...html.matchAll(/<a href="([^"]+)" class="cta-brands"/g)].map(([, href]) => href);
    assert.deepEqual(ctas, [esc(brand.urlCasino), esc(brand.urlCasino)], lang);
    const row = [...read(prefix + 'casinos-and-betting/index.html').matchAll(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)]
      .find(([article]) => article.includes('href="/' + path + '"'))?.[0];
    assert.ok(row?.includes(esc(headlines[lang])), lang);
    if (lang !== 'en') {
      const module = await import('../scripts/brand-bonus-translations/' + lang + '.js');
      assert.equal(module.default[headlines.en], headlines[lang], lang);
    }
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.equal(graph.find(item => item['@type'] === 'Article').dateModified, '2026-11-23', lang);
    const faq = graph.find(item => item['@type'] === 'FAQPage').mainEntity;
    assert.equal(faq.length, 8, lang);
    for (const q of faq) assert.ok(html.includes('<h3>' + esc(q.name) + '</h3><p>' + esc(q.acceptedAnswer.text) + '</p>'), lang);
  }
});
