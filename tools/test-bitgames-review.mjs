import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { accountCopy, labels } from './bitgames-review-copy.mjs';

const langs = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const path = lang => lang === 'en' ? '' : lang + '/';
const origin = 'https://spincresta.com/';
const page = (file) => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const brand = BRANDS.find(item => item.urlDetail === 'brands/bitgames.html');

test('BitGames keeps the KR market and uses only verified deposit icons, not a KR welcome claim', () => {
  assert.deepEqual(brand.countries, ['KR']);
  assert.equal(brand.hasDetailPage, true);
  assert.equal(brand.bonus, '');
  assert.deepEqual(brand.payments, ['tether', 'bitcoin', 'ethereum', 'usdc', 'tron', 'litecoin']);
  for (const method of brand.payments) assert.match(page('icons/payments/' + method + '.svg'), /<svg\b/, method);
  assert.equal(brand.name, 'BitGames');
  for (const lang of langs) assert.ok(brand.cardSummary?.[lang], lang);
  assert.ok(BRAND_HOMEPAGE_SCREENSHOTS.bitgames.includes('/bitgames/main-page/'));
  assert.equal(BRAND_NEW_GAMES.bitgames.length, 6);
  assert.ok(BRAND_NEW_GAMES.bitgames.every(game => game.image.includes('/bitgames/new-games/')));
});

test('BitGames keeps the deduplicated operator provider catalog in each locale', () => {
  const providers = getReviewProviders('bitgames');
  assert.equal(providers.length, 87);
  assert.equal(new Set(providers.map(([name]) => name)).size, 87);
  assert.deepEqual(providers.slice(0, 6).map(([, slug]) => slug),
    ['pragmatic-play', 'evolution', 'pg-soft', 'hacksaw-gaming', 'endorphina', '3-oaks']);
  assert.ok(providers.some(([name, slug]) => name === '7777 Gaming' && slug === null));
  for (const lang of langs) {
    const html = page(path(lang) + 'brands/bitgames/index.html');
    const strip = html.match(/<ul id="bitgames-providers-strip"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
    assert.ok(strip, lang);
    const names = [...strip.matchAll(/<\/span><span>([^<]+)<\/span><\/li>/g)].map(([, name]) => name);
    assert.deepEqual(names, providers.map(([name]) => name), lang);
  }
});

test('BitGames uses the shared three-tab snapshot with verified categories only', () => {
  const snapshot = BRAND_SNAPSHOT_CONFIGS.bitgames;
  assert.deepEqual(snapshot.tabs.map(({ label }) => label), ['Games', 'Live games', 'Betting']);
  assert.ok(snapshot.tabs.every(({ available, unavailable }) => available.length > 0 && unavailable.length === 0));
  assert.ok(snapshot.tabs[2].available.includes('eSports'));
  for (const lang of langs) assert.ok(snapshot.notes[lang], lang);
});

test('BitGames review family has crawlable locale links, separate sports and only approved casino links', () => {
  const sitemap = page('sitemap.xml');
  for (const lang of langs) {
    const route = path(lang) + 'brands/bitgames/';
    const html = page(route + 'index.html');
    const main = html.match(/<main class="content-review">([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main, lang);
    assert.match(main, /data-review-section="sports" data-review-details/);
    assert.match(main, /id="bitgames-summary"[^>]*><h2[^>]*>[^<]+<\/h2><div class="table-wrap">/);
    assert.match(main, /id="bitgames-bonuses"[^>]*><h2[^>]*>[^<]+<\/h2><div class="table-wrap">/);
    assert.match(main, /id="bitgames-bonus-terms" data-review-section="bonus-terms" data-review-details/);
    const cashier = main.match(/id="bitgames-cashier"[\s\S]*?<\/section>/)?.[0];
    assert.ok(cashier?.includes('USDT, ETH, TON, USDC, BNB, BTC, TRX'), lang);
    assert.equal(cashier.match(/<tr>/g).length, 13, lang);
    assert.ok(cashier.includes('Arbitrum (ARB)'), lang);
    assert.ok(main.includes(accountCopy[lang].split('|')[1]), lang);
    assert.match(main, /5\s+USDT/);
    assert.match(main, /data-review-section="rewards"[^>]*data-review-fact-label="[^"]+" data-review-fact-value="[^"]+"/);
    assert.equal((main.match(/id="faq"[\s\S]*?<\/section>/)?.[0].match(/<h3>/g) ?? []).length, 7, lang);
    assert.match(main, /1,25|1\.25/);
    assert.match(main, /350/);
    assert.doesNotMatch(main, /advertiser|рекламодав|промоматеріали|older promotional|kakao|toss pay|bitgames7715\.com/i);
    assert.doesNotMatch(html, /ColdBet|partner market|partnermarkt|партнерський ринок|bitgames7715\.com/i);
    assert.doesNotMatch(html, /law\.go\.kr|kcgp\.or\.kr|Korea Problem Gambling Agency|\b1336\b|This review uses the public lobby/i, lang);
    const market = labels[lang].split('|')[1];
    assert.ok(html.includes('data-review-market-label="' + market + '"'), lang);
    assert.ok(html.includes('<link rel="canonical" href="' + origin + route + '" />'), lang);
    for (const other of langs) {
      assert.ok(html.includes('hreflang="' + (other === 'fi' ? 'fi-FI' : other) +
        '" href="' + origin + path(other) + 'brands/bitgames/"'), lang + ' → ' + other);
    }
    assert.ok(html.includes('hreflang="x-default" href="' + origin + 'brands/bitgames/"'), lang);
    assert.ok(html.includes(BRAND_HOMEPAGE_SCREENSHOTS.bitgames), lang);
    // The common review runtime supplies the same byline as the reference reviews.
    // A hand-authored byline suppresses that standard component.
    assert.doesNotMatch(html, /class="brand-reviewer-byline\b/, lang);
    const countries = html.match(/<section class="container brand-info-pair">[\s\S]*?<\/section>/)?.[0];
    assert.ok(countries?.includes('class="brand-countries" data-review-section="countries"'), lang);
    assert.match(countries, /class="countries-container" id="brand-countries"><a class="flag-container"/);
    assert.ok(countries.includes('class="brand-payments" data-review-section="methods"'), lang);
    assert.equal((countries.match(/\/icons\/payments\//g) ?? []).length, brand.payments.length, lang);
    const outbound = [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*class="cta-brands"[^>]*>/g)]
      .map(([, href]) => href.replaceAll('&amp;', '&'));
    assert.deepEqual(outbound, [brand.urlCasino], lang);
    assert.ok(html.includes('href="/' + path(lang) + 'online-casinos/south-korea/"'), lang);
    assert.ok(page(path(lang) + 'online-casinos/south-korea/index.html').includes('href="/' + route + '">BitGames</a>'), lang);
    assert.equal(sitemap.split('<loc>' + origin + route + '</loc>').length, 2, lang);
  }
});
