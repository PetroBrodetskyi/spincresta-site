import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { belongsInReviewDetails } from '../scripts/pages/brand.js';
import { escapeReview } from './brand-review-template.mjs';
import { magneticCopy, magneticDetails, magneticHeadlines, magneticTitles } from './magneticslots-review-copy.mjs';

const brand = BRANDS.find(item => item.urlDetail === 'brands/magneticslots.html');

test('Magnetic Slots keeps its existing affiliate destination and marketing markets', () => {
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=120784');
  assert.equal(brand.bonus, magneticHeadlines.en);
  assert.ok(brand.countries.includes('ES'));
});

test('Magnetic Slots snapshot covers verified casino, live and sports collections', () => {
  const { tabs, labels } = BRAND_SNAPSHOT_CONFIGS.magneticslots;
  assert.deepEqual(tabs.map(tab => tab.label), ['Games', 'Live games', 'Betting']);
  assert.deepEqual(tabs.map(tab => tab.available.length), [14, 3, 11]);
  for (const category of ['Blackjack', 'Bingo', 'Jackpot games', 'Scratch cards', 'Instant win', 'Original games', 'Bonus buy', 'Book slots', 'Table games', 'New games', 'Top games']) {
    assert.ok(tabs[0].available.includes(category), category);
  }
  assert.ok(tabs[0].unavailable.includes('Video poker'));
  assert.deepEqual(tabs[1].available, ['Live shows', 'Live blackjack', 'Live roulette']);
  for (const category of ['eSports', 'Darts', 'Rugby']) assert.ok(tabs[2].available.includes(category), category);
  for (const [locale, localized] of Object.entries(labels)) {
    assert.ok(localized['Not surfaced:'], locale);
    if (locale === 'en') continue; // The default English labels do not need overrides.
    for (const key of ['Instant win', 'Original games', 'Bonus buy', 'Book slots', 'Table games', 'New games', 'Top games', 'Darts', 'Rugby']) {
      assert.ok(localized[key], `${locale}: ${key}`);
    }
  }
});

test('Magnetic Slots new games use the six approved Cloudinary images', () => {
  const cards = BRAND_NEW_GAMES.magneticslots;
  assert.equal(cards.length, 6);
  assert.equal(new Set(cards.map(card => card.name)).size, 6);
  for (const {image} of cards) {
    assert.match(image, /^https:\/\/res\.cloudinary\.com\/drj61gmd2\/image\/upload\/f_auto,q_auto\/v\d+\/spincresta\/brands\/magneticslots\/new-games\//);
  }
});

for (const [locale, copy] of Object.entries(magneticCopy)) {
  test(`Magnetic Slots ${locale}: grounded offers, main-column sportsbook, and no direct operator links`, async () => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const reviewUrl = `/${prefix}brands/magneticslots/`;
    const review = readFileSync(`${prefix}brands/magneticslots/index.html`, 'utf8');
    const blocks = [...review.matchAll(/<section[^>]*data-review-section="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)];
    const sport = blocks.find(([, kind]) => kind === 'sports');
    const bonus = blocks.find(([, kind]) => kind === 'bonuses');
    const games = blocks.find(([, kind]) => kind === 'games');
    const rewards = blocks.find(([, kind]) => kind === 'rewards');
    const comparison = blocks.find(([, kind]) => kind === 'pros');
    const details = magneticDetails[locale];
    const detailTopics = blocks.filter(([section, kind, markup]) => belongsInReviewDetails({
      kind,
      explicit: /^<section[^>]*\bdata-review-details\b/.test(section),
      hasTable: markup.includes('<table>'),
    })).map(([, kind]) => kind);
    assert.deepEqual(detailTopics, ['summary', 'bonuses', 'sports', 'rewards', 'cashier']);
    assert.ok(sport);
    assert.ok(bonus);
    assert.ok(belongsInReviewDetails({ kind: 'sports', hasTable: sport[2].includes('<table>') }));
    assert.doesNotMatch(sport[0], /data-brand-rail/);
    for (const [, amount] of copy.sportStages.matchAll(/[^|]+\|([^|]+)(?:\||$)/g)) assert.ok(sport[2].includes(escapeReview(amount)));
    for (const key of ['conflict', 'wager', 'spins']) assert.ok(bonus[2].includes(escapeReview(copy[key])), key);
    assert.ok(review.includes(escapeReview(copy.payout)));
    assert.ok(review.includes(escapeReview(copy.licence)));
    assert.ok(games[2].includes(escapeReview(details.instant)));
    assert.ok(games[2].includes(escapeReview(details.table)));
    assert.ok(rewards[2].includes(escapeReview(details.cashbackRules)));
    assert.equal((rewards[2].match(/<tbody>[\s\S]*?<\/tbody>/)?.[0].match(/<tr>/g) ?? []).length, 6);
    for (const [kind, points] of [['pros', details.pros], ['cons', details.cons]]) {
      const card = comparison[2].match(new RegExp(`is-${kind}-card">([\\s\\S]*?)</div>`))?.[1];
      assert.equal(card?.match(/<span>/g)?.length, 5);
      for (const point of points.split('|')) assert.ok(card.includes(escapeReview(point)), point);
    }
    assert.doesNotMatch(review, /href="https?:\/\/[^"/]*magneticslots[^"/]*[\/"]/i);
    for (const [ ,href] of review.matchAll(/<a href="([^"]+)" class="cta-brands"/g)) {
      assert.equal(href, escapeReview(brand.urlCasino));
    }
    const schema = JSON.parse(review.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    const title = magneticTitles[locale];
    assert.ok(review.includes(`<title>${escapeReview(title)}</title>`));
    assert.ok(review.includes(`property="og:title" content="${escapeReview(title)}"`));
    assert.equal(schema['@graph'].find(entry => entry['@type'] === 'WebPage').name, title);
    const faq = schema['@graph'].find(entry => entry['@type'] === 'FAQPage');
    assert.equal(faq.mainEntity.length, 10);
    assert.equal(new Set(faq.mainEntity.map(item => item.name)).size, 10);
    for (const { name, acceptedAnswer } of faq.mainEntity) {
      assert.ok(review.includes(`<h3>${escapeReview(name)}</h3><p>${escapeReview(acceptedAnswer.text)}</p>`));
    }
    const directory = readFileSync(`${prefix}casinos-and-betting/index.html`, 'utf8');
    const card = directory.match(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)
      .find(row => row.includes(`href="${reviewUrl}"`));
    assert.match(card ?? '', /data-type="casino-betting"/);
    assert.ok(card.includes(escapeReview(magneticHeadlines[locale])));
    const spain = readFileSync(`${prefix}online-casinos/spain/index.html`, 'utf8');
    assert.ok(spain.includes(reviewUrl));
    assert.ok(review.includes(escapeReview(copy.eligibility)));
    if (locale !== 'en') {
      const { default: translations } = await import(`../scripts/brand-bonus-translations/${locale}.js`);
      assert.equal(translations[brand.bonus], magneticHeadlines[locale]);
    }
  });
}
