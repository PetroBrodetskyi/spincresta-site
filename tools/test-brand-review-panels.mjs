import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { BRAND_TABLE_TOPICS, belongsInReviewDetails, isSportsbookFeatureHeading } from '../scripts/pages/brand.js';
import { isBrandSportsSection } from '../scripts/pages/brand-layout.js';
import { BRAND_REVIEW_ORDER, classifyReviewSection, compareReviewSections, reviewSectionLabel } from '../scripts/pages/brand-review-order.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('review detail tabs group existing editorial tables and central sportsbook coverage', () => {
  assert.deepEqual(BRAND_TABLE_TOPICS, ['summary', 'bonuses', 'games', 'sports', 'cashier', 'trust']);
  assert.ok(belongsInReviewDetails({ kind: 'sports', rail: 'betting', hasTable: false }));
  assert.ok(belongsInReviewDetails({ kind: 'games', hasTable: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'games', hasTable: false }));
  assert.ok(!belongsInReviewDetails({ kind: 'faq', hasTable: true }));
  assert.ok(belongsInReviewDetails({ kind: 'cashier', explicit: true, hasTable: false }));
  assert.ok(belongsInReviewDetails({ kind: 'rewards', explicit: true, hasTable: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'rewards', hasTable: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'cashier', explicit: true, rail: 'payments' }));
  assert.ok(!belongsInReviewDetails({ kind: 'faq', explicit: true }));
  const runtime = read('scripts/pages/brand.js');
  assert.match(runtime, /if \(groups\.length < 2\) return/);
  assert.match(runtime, /panel\.append\(\.\.\.topicSections\)/);
  assert.match(runtime, /explicit: section\.hasAttribute\('data-review-details'\)/);
  assert.match(runtime, /styleReviewTables\(\);\s*initBrandReviewDetails\(\);/);
  assert.match(read('scripts/main.js'), /panel\?\.firstElementChild\?\.contains\(target\)/);
  const css = read('styles/brand-review.css');
  assert.match(css, /\.brand-review-details__panel\[hidden\]\s*\{\s*display: none/);
});

test('the selected review and snapshot tabs share a filled treatment without an underline', () => {
  const panels = read('styles/brand-review.css');
  assert.doesNotMatch(read('styles/pages.css'), /\.availability-tab[^,{]*::after/);
  assert.doesNotMatch(panels, /\.brand-review-details__tabs > button[^{}]*\{[^{}]*border-bottom/);
  assert.match(panels, /:is\(\.brand-availability-widget \.availability-tab, \.brand-review-details__tabs > button\)\[aria-selected='true'\]\s*\{[^}]*background: var\(--review-surface\);/);
  assert.match(panels, /\.brand-review-details__tabs > button:focus-visible\s*\{[^}]*outline:/);
});

test('Lizaro has exactly one separately labeled sportsbook card in all ten languages', () => {
  for (const prefix of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
    const html = read(`${prefix}brands/lizaro/index.html`);
    const labels = [...html.matchAll(/<strong>([^<>]+)<\/strong>/g)].map(([, label]) => label);
    assert.equal(labels.filter(isSportsbookFeatureHeading).length, 1, prefix || 'en');
  }
  for (const heading of ['Casino + Sports', 'Live Casino', 'Sportsbook & Poker', 'Казино + Спорт']) {
    assert.equal(isSportsbookFeatureHeading(heading), false, heading);
  }
});

test('shared panel styles are included without overriding the approved masthead', () => {
  const root = read('styles.css');
  const panels = read('styles/brand-review.css');
  assert.match(root, /@import url\('\/styles\/brand-review\.css\?v=[^']+'\)/);
  assert.doesNotMatch(panels, /brand-profile-showcase/);
  assert.match(panels, /\.brand-sticky-review-layout > \.brand-sticky-aside\s*\{[^}]*position:\s*sticky/);
  assert.match(panels, /\.brand-review-table--stackable\s+\.brand-review-table__label\s*\{\s*display:\s*block/);
});

test('the overview uses the same neutral surface and dividers as other review panels', () => {
  const panels = read('styles/brand-review.css');
  assert.match(panels, /\.brand-review-overview\s*\{[^}]*border: 1px solid var\(--review-line\);[^}]*background: var\(--review-surface\);/);
  assert.match(panels, /\.brand-review-overview > p\.editorial-meta\s*\{[^}]*border-top: 1px solid var\(--review-line\);/);
});

test('review contents use a line marker without numbered chips', () => {
  const panels = read('styles/brand-review.css');
  assert.doesNotMatch(panels, /counter-(?:increment|reset):\s*review-section/);
  assert.match(panels, /\.brand-section-nav__links a\[aria-current='location'\]\s*\{[^}]*border-inline-start-color:\s*var\(--review-contents-active\)/);
  const runtime = read('scripts/pages/brand.js');
  assert.match(runtime, /window\.addEventListener\('scroll', schedule, \{ passive: true \}\)/);
});

test('shared editorial links keep their color in visited state and give resource links visible keyboard focus', () => {
  const css = read('styles/core.css');
  assert.match(css, /a:any-link:not\(\[class\], nav \*, header \*, footer \*\)\)\s*\{[^}]*color: var\(--editorial-blue/);
  assert.match(css, /\.editorial-resource-link:any-link\s*\{[^}]*min-height: 44px;[^}]*color: var\(--editorial-blue/);
  assert.match(css, /\.editorial-resource-link:focus-visible\s*\{[^}]*outline: 2px solid currentColor/);
  assert.equal(reviewSectionLabel('suitability', (...labels) => labels[5]), 'Кому найкраще підходить');
});

test('the masthead uses a wider logo surface without stretching the brand image', () => {
  const shared = read('styles/pages.css');
  assert.match(shared, /\.brand-profile-showcase \.brand-logo-container\.hero-logo\s*\{[^}]*aspect-ratio:\s*2\.4;/);
  assert.match(shared, /\.brand-profile-showcase img\.brand-logo\s*\{[^}]*object-fit: contain;/);
});

test('different authored orders converge without creating absent topics', () => {
  const fixtures = [
    ['SpinBoss FAQ', 'Payments, Withdrawals & KYC', 'Casino Welcome Package', 'Jackpots & Live Casino'],
    ['Вітальний пакет казино', 'Казино та ігри', 'Поширені запитання', 'Платежі, виплати та верифікація'],
  ];
  for (const headings of fixtures) {
    const topics = headings.map(heading => classifyReviewSection({ heading })).sort(compareReviewSections);
    assert.deepEqual(topics, ['bonuses', 'games', 'cashier', 'faq']);
  }
  for (const kind of BRAND_REVIEW_ORDER) {
    reviewSectionLabel(kind, (...labels) => assert.ok(labels.length === 10 && labels.every(Boolean), kind));
  }
});

test('localized legacy sections still resolve to the same review topics', () => {
  for (const [kind, headings] of Object.entries({
    sports: ['Sportsbook, Live Betting & Horse Racing', 'Apuestas deportivas y apuestas en vivo', 'Paris sportifs et paris en direct'],
    cashier: ['Deposits, Withdrawals & KYC', 'Способи оплати для Південної Африки'],
    pros: ['Pros & Cons For Real Players', 'Vantagens e desvantagens', 'Hyvät ja huonot puolet'],
    trust: ['License, Complaints & Safer Play', 'Zaufanie, wsparcie i przejrzystość zasad'],
    suitability: ['Who Fraga Suits Best', 'Cosa controllare prima di registrarsi', "Points à vérifier avant l'inscription", 'पंजीकरण से पहले क्या जांचें'],
    faq: ['Sportsbook FAQ', 'Поширені запитання'],
  })) {
    for (const heading of headings) {
      assert.equal(classifyReviewSection({ heading, isSports: isBrandSportsSection({ heading }) }), kind, heading);
    }
  }
  assert.equal(classifyReviewSection({ heading: 'Sports & Crypto Welcome Offers' }), 'bonuses');
});
