import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import test from 'node:test';
import { BRAND_TABLE_TOPICS, belongsInReviewDetails, findSeparateBonusTerms, groupBrandReviewDetails, isSportsbookFeatureHeading } from '../scripts/pages/brand.js';
import { isBrandSportsSection } from '../scripts/pages/brand-layout.js';
import { BRAND_REVIEW_ORDER, classifyReviewSection, compareReviewSections, reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { parseBrandDetailSource, planBrandDetailSections, syncBrandDetailSections } from './sync-brand-review-details.mjs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('review detail tabs group existing editorial tables and central sportsbook coverage', () => {
  assert.deepEqual(BRAND_TABLE_TOPICS, ['summary', 'bonuses', 'bonus-terms', 'games', 'sports', 'cashier', 'trust']);
  assert.ok(belongsInReviewDetails({ kind: 'sports', rail: 'betting', hasTable: false }));
  assert.ok(belongsInReviewDetails({ kind: 'games', hasTable: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'games', hasTable: false }));
  assert.ok(!belongsInReviewDetails({ kind: 'faq', hasTable: true }));
  assert.ok(belongsInReviewDetails({ kind: 'cashier', explicit: true, hasTable: false }));
  assert.ok(belongsInReviewDetails({ kind: 'rewards', explicit: true, hasTable: true }));
  assert.ok(belongsInReviewDetails({ kind: 'rewards', hasTable: true }));
  assert.ok(belongsInReviewDetails({ kind: 'suitability', hasTable: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'suitability', hasTable: false }));
  assert.ok(belongsInReviewDetails({ kind: 'more', hasTable: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'cashier', explicit: true, rail: 'payments' }));
  assert.ok(!belongsInReviewDetails({ kind: 'faq', explicit: true }));
  assert.ok(!belongsInReviewDetails({ kind: 'providers', explicit: true }));
  assert.ok(compareReviewSections('trust', 'providers') < 0 && compareReviewSections('providers', 'pros') < 0);
  const runtime = read('scripts/pages/brand.js');
  assert.deepEqual(groupBrandReviewDetails([{ kind: 'sports' }]), [], 'sports stays inline when there are no other details');
  assert.equal(groupBrandReviewDetails([{ kind: 'cashier', hasTable: true, rail: 'payments' }]).length, 0);
  assert.match(runtime, /if \(groups\.length === 1\)/);
  assert.match(runtime, /panel\.append\(\.\.\.topicSections\.map\(\(\{ section \}\) => section\)\)/);
  assert.match(runtime, /explicit: section\.hasAttribute\('data-review-details'\)/);
  assert.match(runtime, /styleReviewTables\(\);\s*initBrandReviewDetails\(\);/);
  assert.match(read('scripts/main.js'), /panel\?\.firstElementChild\?\.contains\(target\)/);
  const css = read('styles/brand-review.css');
  assert.match(css, /\.brand-review-details__panel\[hidden\]\s*\{\s*display: none/);
});

test('legacy tables and related sections use the same topics in all ten languages', () => {
  execFileSync(process.execPath, ['tools/sync-brand-review-details.mjs', '--check']);
  const prefixes = ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/'];
  for (const [slug, expected] of [
    ['britsino', ['bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust']],
    ['kingmaker', ['summary', 'bonuses', 'games', 'sports', 'rewards', 'cashier', 'trust']],
  ]) {
    for (const prefix of prefixes) {
      const path = `${prefix}brands/${slug}/index.html`;
      const source = parseBrandDetailSource(read(path));
      const groups = groupBrandReviewDetails(source.map(section => ({ ...section, hasTable: Boolean(section.tables) })));
      assert.deepEqual(groups.map(([kind]) => kind), expected, path);
      assert.equal(groups.flatMap(([, entries]) => entries).reduce((count, section) => count + section.tables, 0),
        source.reduce((count, section) => count + section.tables, 0), path);
    }
  }
});

test('substantial bonus tables get a neighboring terms tab only for separately authored conditions', () => {
  const offer = { kind: 'bonuses', id: 'welcome', heading: 'Welcome offers', rows: 4 };
  const rules = { kind: 'bonuses', id: 'casino-bonus-rules', heading: 'Payment and bonus rules', rows: 2 };
  assert.deepEqual(findSeparateBonusTerms([offer, rules]), [rules]);
  assert.deepEqual(findSeparateBonusTerms([offer, { ...rules, rows: 1 }]), []);
  assert.deepEqual(findSeparateBonusTerms([rules]), []);
  assert.deepEqual(findSeparateBonusTerms([offer, { ...rules, id: 'extra-offer', heading: 'Third deposit offer' }]), []);
  for (const prefix of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
    const sections = [...read(prefix + 'brands/gamblezen/index.html').matchAll(/(<section[^>]*>)([^]*?)<[/]section>/g)]
      .map(([, tag, html]) => {
        const id = tag.match(/id="([^"]+)"/)?.[1] || '';
        const heading = html.match(/<h2[^>]*>([^<]+)<[/]h2>/)?.[1] || '';
        return {
          kind: classifyReviewSection({ id, heading, kind: tag.match(/data-review-section="([^"]+)"/)?.[1] }),
          id, heading, rows: (html.match(/<tr>/g) || []).length - 1,
        };
      });
    assert.equal(findSeparateBonusTerms(sections).length, 1, prefix || 'en');
  }
});

test('topic synchronization does not rewrite authored tables, links or IDs', () => {
  const original = '<main class="content-review"><section id="payments"><h2>Payments</h2><table><tr><td>€50</td></tr></table></section><section><h2>Sportsbook</h2><a href="#payments">Details</a></section></main>';
  const source = parseBrandDetailSource(original);
  const output = syncBrandDetailSections(original, source, planBrandDetailSections(source));
  assert.match(output, /id="payments" data-review-section="cashier"/);
  assert.match(output, /<section data-review-section="sports">/);
  assert.equal(output.replace(/ data-review-section="[^"]+"/g, ''), original);
  assert.throws(() => syncBrandDetailSections(original.replace('id="payments"', 'id="different"'), source, planBrandDetailSections(source)));
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

test('inline editorial links keep their visited color and standalone resources use the shared secondary action', () => {
  const css = read('styles/core.css');
  const shared = read('styles.css');
  assert.match(css, /a:any-link:not\(\[class\], nav \*, header \*, footer \*\)\)\s*\{[^}]*color: var\(--editorial-blue/);
  const resource = css.match(/\.cta-secondary\.editorial-resource-link\s*\{([^}]+)\}/)?.[1] || '';
  assert.match(resource, /min-height: var\(--pill-action-height\)/);
  assert.doesNotMatch(resource, /color|background|border|font/);
  assert.match(shared, /:where\([\s\S]*?\.cta-secondary[\s\S]*?\):hover:not\([^)]*\)\s*\{[^}]*--control-secondary-hover-bg/);
  assert.match(shared, /:is\(button, \[role='button'\],[\s\S]*?\.cta-secondary[\s\S]*?:focus-visible\s*\{[^}]*outline: 2px solid var\(--control-focus\)/);
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
