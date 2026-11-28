import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { escapeReview as esc } from './brand-review-template.mjs';
import { locales, money } from './jackspay-review-copy.mjs';
import { sunPalaceHeadings } from './sunpalace-review-copy.mjs';

const brand = BRANDS.find(b => b.urlDetail === 'brands/sunpalace.html');
const base = 'https://spincresta.com';
const prefix = lang => lang === 'en' ? '/' : `/${lang}/`;
const route = lang => `${prefix(lang)}brands/sunpalace/`;
const read = path => readFileSync('.' + path + (path.endsWith('/') ? 'index.html' : ''), 'utf8');
const sitemap = read('/sitemap.xml');

test('Sun Palace uses the approved tracker and only payment badges supported by banking tables', () => {
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=121278');
  assert.deepEqual(brand.countries, ['US']);
  assert.ok(brand.payments.includes('bitcoinlightning') && brand.payments.includes('couriercheck'));
  assert.ok(!brand.payments.includes('interac'));
  assert.ok(brand.payments.every(method => existsSync(`icons/payments/${method}.svg`)));
  assert.deepEqual(getReviewProviders('sunpalace'), [['SpinLogic Gaming', null]]);
});

for (const lang of locales) test(`${lang}: Sun Palace cashier, standard review, tracker, and synchronized FAQ`, () => {
  const html = read(route(lang));
  const tracking = esc(brand.urlCasino);
  const [title, heading, screenshotLabel, cta] = sunPalaceHeadings[lang];
  assert.ok(html.includes(`<title>${esc(title)}</title>`));
  assert.ok(html.includes(`<h1>${esc(heading)}</h1>`));
  assert.ok(html.includes(`aria-label="${esc(screenshotLabel)}"`));
  assert.ok(html.includes(`sponsored">${esc(cta)}</a>`));
  assert.match(html, /name="robots" content="index, follow"/);
  assert.doesNotMatch(html, /RTG Reels \d+|href="https?:\/\/[^"/]*sunpalacecasino\.|data-review-section="sports"/i);
  const ctas = [...html.matchAll(/href="([^"]*armadaapp\.media-412\.com[^"]*)"/g)].map(([, href]) => href);
  assert.ok(ctas.length >= 7 && ctas.every(link => link === tracking));
  assert.deepEqual([...html.matchAll(/<section\b[^>]*data-review-section="([^"]+)"/g)].map(([, key]) => key),
    ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust', 'providers', 'pros', 'suitability', 'faq']);

  const gallery = html.match(/<section class="brand-new-games-panel"[^>]*>[\s\S]*?<\/section>/)?.[0];
  assert.ok(gallery && gallery.split(`href="${tracking}"`).length === 7);
  assert.ok(html.indexOf(gallery) < html.indexOf('id="brand-why-section"'));
  for (const game of BRAND_NEW_GAMES.sunpalace) assert.ok(gallery.includes(`<span>${esc(game.name)}</span>`));
  assert.ok(brand.payments.every(method => html.includes(`src="/icons/payments/${method}.svg"`)));

  const cashier = html.match(/<section\b[^>]*id="sunpalace-cashier"[\s\S]*?<\/section>/)?.[0];
  const tables = cashier.match(/<table>[\s\S]*?<\/table>/g);
  assert.equal(tables.length, 2);
  for (const [name, amount] of [['Bitcoin Lightning', 5], ['Google Pay · Apple Pay · Cash App · Bitcoin Cash · Litecoin', 10],
    ['Visa · Mastercard · Discover · Bitcoin · Ethereum', 25]]) assert.ok(tables[0].includes(`${name}</th><td>${money(lang, amount)}</td>`));
  assert.ok(tables[1].includes(`Bitcoin</th><td>${money(lang, 100)}</td>`));
  assert.ok(tables[1].includes(`<td>${money(lang, 150)}</td>`));
  assert.doesNotMatch(tables[1], /Cash App|Visa|Bitcoin Lightning|Interac/);

  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
  const page = graph.find(n => n['@type'] === 'WebPage');
  assert.equal(page.url, base + route(lang));
  assert.equal(page.dateModified, brand.reviewUpdatedAt.slice(0, 10));
  const faq = graph.find(n => n['@type'] === 'FAQPage').mainEntity;
  assert.equal(faq.length, 7);
  for (const { name, acceptedAnswer } of faq) assert.ok(html.includes(`<h3>${esc(name)}</h3><p>${esc(acceptedAnswer.text)}</p>`));
  for (const target of locales) assert.ok(html.includes(`hreflang="${target === 'fi' ? 'fi-FI' : target}" href="${base + route(target)}"`));
  assert.ok(sitemap.includes(`<loc>${base + route(lang)}</loc>\n    <lastmod>${page.dateModified}</lastmod>`));
  assert.ok(read(`${prefix(lang)}game-providers/`).includes(`href="${route(lang)}"`));
});
