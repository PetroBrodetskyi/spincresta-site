import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { providerDirectoryIndex } from '../scripts/provider-directory-index.js';
import { duckyluckCopy, duckyluckHeadlines, duckyluckSections, duckyluckTrustLabels } from './duckyluck-review-copy.mjs';
import { escapeReview } from './brand-review-template.mjs';

const read = file => readFileSync(new URL('../' + file, import.meta.url), 'utf8');
const brand = BRANDS.find(item => item.urlDetail === 'brands/duckyluck.html');
const image = BRAND_HOMEPAGE_SCREENSHOTS.duckyluck;
const locales = Object.keys(duckyluckCopy);
const path = lang => lang === 'en' ? '' : lang + '/';
const origin = 'https://spincresta.com/';

test('Ducky Luck preserves the approved United States market and uses the current screenshot version', () => {
  assert.deepEqual(brand.countries, ['US']);
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=121377');
  assert.equal(brand.bonus, duckyluckHeadlines.en);
  assert.equal(brand.image, 'images/duckyluck.svg');
  assert.equal(brand.bgColor, '#FFFFFF');
  assert.match(read(brand.image), /^<svg\b/);
  assert.equal(existsSync(new URL('../images/duckyluck.webp', import.meta.url)), false);
  assert.ok(brand.payments.includes('americanexpress'));
  assert.match(image, /\/v1795550040\/spincresta\/brands\/duckyluck\/main-page\//);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.duckyluck.tabs.length, 2);
  assert.deepEqual(BRAND_SNAPSHOT_CONFIGS.duckyluck.tabs[1].available, ['Live blackjack', 'Live poker', 'Live roulette']);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.duckyluck.labels.uk['Games & Betting Snapshot'], 'Огляд каталогу ігор');
  assert.equal(providerDirectoryIndex.dicelabslots, 'dicelabslots');
});

for (const lang of locales) test(`${lang}: Ducky Luck copy, media, casino details, and catalog are synchronized`, async () => {
  const c = duckyluckCopy[lang];
  const route = path(lang) + 'brands/duckyluck/';
  const html = read(route + 'index.html');
  const pageSchema = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const faq = pageSchema.find(node => node['@type'] === 'FAQPage').mainEntity;
  assert.equal(faq.length, 6);
  const detail = duckyluckSections[lang];
  assert.ok(faq.some(item => item.name === detail.spinsQuestion && item.acceptedAnswer.text === c.spins));
  assert.ok(faq.some(item => item.name === detail.rewardsQuestion && item.acceptedAnswer.text === c.rewards));
  for (const { name, acceptedAnswer } of faq) assert.ok(html.includes(`<h3>${escapeReview(name)}</h3><p>${escapeReview(acceptedAnswer.text)}</p>`));
  assert.equal(pageSchema.find(node => node['@type'] === 'WebPage').image, image);
  assert.ok(html.includes(`<link rel="canonical" href="${origin + route}"`));
  for (const locale of locales) assert.ok(html.includes(`hreflang="${locale === 'fi' ? 'fi-FI' : locale}" href="${origin + path(locale)}brands/duckyluck/"`));
  assert.ok(html.includes(`<meta property="og:image" content="${image}"`));
  assert.ok(html.includes(`<meta name="twitter:image" content="${image}"`));
  assert.match(html, /width="3024" height="1590" loading="eager"/);
  assert.match(html, /class="brand-logo-container hero-logo" style="--brand-bg-color: #FFFFFF;">\s*<img class="brand-logo" src="\/images\/duckyluck\.svg"/);
  assert.doesNotMatch(html, /v1785004778|data-review-section="sports"|href="https?:\/\/(?:www\.)?duckyluck\.ag/i);
  assert.ok(html.includes(`href="${escapeReview(brand.urlCasino)}" class="cta-brands"`));
  for (const key of ['payments', 'standard', 'crypto', 'spins', 'terms', 'identity', 'trust']) assert.ok(html.includes(escapeReview(c[key])), key);
  for (const key of ['bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust']) {
    assert.ok(html.includes(`id="duckyluck-${key}" data-review-section="${key}" data-review-details`), key);
  }
  const main = html.match(/<main class="content-review">[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.deepEqual([...main.matchAll(/<section\b[^>]*data-review-section="([^"]+)"/g)].map(([, key]) => key),
    ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust', 'providers', 'pros', 'suitability', 'faq']);
  assert.ok(main.includes(`<h3>${escapeReview(detail.identityHeading)}</h3>`));
  for (const key of ['forWho', 'checkFirst']) assert.ok(main.includes(escapeReview(detail[key])), key);
  const trustTable = main.match(/<section\b[^>]*id="duckyluck-trust"[^>]*>[\s\S]*?<table\b[^>]*>([\s\S]*?)<\/table>/)?.[1];
  assert.ok(trustTable);
  const headings = duckyluckTrustLabels[lang].slice(2);
  for (const [i, value] of [c.trust, detail.accountRule, c.support, c.inactivity].entries()) {
    assert.ok(trustTable.includes(`<th scope="row">${escapeReview(headings[i])}</th><td>${escapeReview(value)}</td>`), headings[i]);
  }
  const listing = [...read(path(lang) + 'casinos-and-betting/index.html').matchAll(/<article class="casino-list-row"[\s\S]*?<\/article>/g)]
    .find(([row]) => row.includes(`href="/${route}"`))?.[0];
  assert.ok(listing, 'Ducky Luck directory card');
  assert.match(listing, /class="home-new-review-logo" style="--brand-bg-color: #FFFFFF;"><img\s+src="\/images\/duckyluck\.svg"/);
  assert.ok(listing.includes(escapeReview(duckyluckHeadlines[lang])));
  if (lang !== 'en') {
    const translation = await import(`../scripts/brand-bonus-translations/${lang}.js`);
    assert.equal(translation.default[brand.bonus], duckyluckHeadlines[lang]);
  }
  assert.ok(read(path(lang) + 'game-providers/index.html').includes(`<a class="provider-review-link" href="/${route}">Ducky Luck</a>`));
  assert.ok(read('sitemap.xml').includes(`<loc>${origin + route}</loc>\n    <lastmod>2026-11-24</lastmod>`));
});
