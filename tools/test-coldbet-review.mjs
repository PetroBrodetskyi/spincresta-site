import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { escapeReview as esc } from './brand-review-template.mjs';
import { headlines, welcomeDeposits } from './coldbet-review-copy.mjs';
import { depositCount, paymentGroups, paymentIcons, vipRows, withdrawalCount } from './coldbet-account-data.mjs';
import { providers, providerFilterCount } from './coldbet-providers.mjs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const brand = BRANDS.find(item => item.name === 'ColdBet');

test('ColdBet retains every approved market and uses the approved affiliate endpoint', () => {
  assert.deepEqual(brand.countries, ['PT', 'PL', 'GE']);
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124847');
  assert.equal(brand.reviewComingSoon, undefined);
  assert.deepEqual(brand.payments, paymentIcons);
  assert.equal(depositCount, 34);
  assert.equal(withdrawalCount, 25);
  assert.deepEqual(paymentGroups.map(group => group.length), [24, 10, 1]);
  assert.equal(new Set(paymentGroups.flat()).size, 35);
  assert.deepEqual(paymentGroups[2], ['SEPA']);
  assert.ok(paymentGroups[1].includes('Google Pay'));
  for (const icon of brand.payments) assert.match(read(`icons/payments/${icon}.svg`), /<svg/);
  assert.equal(BRAND_NEW_GAMES.coldbet.length, 6);
  assert.equal(new Set(BRAND_NEW_GAMES.coldbet.map(game => game.image)).size, 6);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.coldbet.tabs.length, 3);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.coldbet.labels.en['Not surfaced:'], 'Not surfaced:');
  assert.equal(welcomeDeposits.reduce((total, [, , , cap]) => total + cap, 0), 1500);
  assert.equal(welcomeDeposits.reduce((total, [, , , , spins]) => total + spins, 0), 150);
  assert.equal(providerFilterCount, 126);
  assert.equal(providers.length, providerFilterCount);
  assert.equal(new Set(providers.map(([, slug]) => slug)).size, providers.length);
  for (const [, slug] of providers) {
    const logo = read(`images/providers/${slug}.svg`);
    assert.match(logo, /<svg\b[^>]*\bviewBox=/);
    assert.doesNotMatch(logo, /<(?:script|foreignObject|image|iframe|style)\b|<!DOCTYPE|\s(?:on\w+|(?:xlink:)?href)\s*=/i);
  }
});

test('each localized review has indexable metadata, verified offer figures and matched FAQ', () => {
  const sitemap = read('sitemap.xml');
  for (const lang of Object.keys(headlines)) {
    const prefix = lang === 'en' ? '' : lang + '/';
    const path = `/${prefix}brands/coldbet/`;
    const canonical = 'https://spincresta.com' + path;
    const html = read(prefix + 'brands/coldbet/index.html');
    assert.match(html, /data-brand="coldbet"/);
    assert.doesNotMatch(html, /noindex|brand-coming-soon|betrepublic|coldbetde1c\.com/i);
    assert.ok(html.includes(`<link rel="canonical" href="${canonical}"`));
    assert.ok(sitemap.includes(`<loc>${canonical}</loc>`));
    assert.equal([...html.matchAll(/rel="alternate" hreflang=/g)].length, 11);
    assert.match(html, /data-review-section="sports" data-review-details/);
    assert.match(html, /OGL\/2024\/296\/1093/);
    assert.ok(html.includes(esc(headlines[lang])));
    const links = [...html.matchAll(/<a\b(?=[^>]*class="cta-brands")[^>]*href="([^"]+)"/g)].map(match => match[1]);
    assert.equal(links.length, 2, lang);
    assert.ok(links.every(link => link === esc(brand.urlCasino)), lang);

    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
    const faq = graph.find(node => node['@type'] === 'FAQPage').mainEntity;
    assert.equal(faq.length, 9);
    for (const item of faq) assert.ok(html.includes(`<h3>${esc(item.name)}</h3><p>${esc(item.acceptedAnswer.text)}</p>`), lang);
    const locale = lang === 'pt' ? 'pt-PT' : lang;
    const eur = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format;
    const percent = new Intl.NumberFormat(locale, { style: 'percent' }).format;
    const number = new Intl.NumberFormat(locale).format;
    const games = html.match(/<section[^>]+id="coldbet-games"[\s\S]*?<\/section>/)?.[0];
    assert.doesNotMatch(games, /review-providers|images\/providers\//, lang);
    const providerSection = html.match(/<section[^>]+id="coldbet-providers"[\s\S]*?<\/section>/)?.[0];
    assert.doesNotMatch(providerSection, /<p\b|section-intro/, lang);
    assert.match(providerSection, /data-review-section="providers"/, lang);
    assert.doesNotMatch(providerSection, /data-review-details/, lang);
    assert.match(providerSection, /data-strip-previous[^>]*aria-controls="coldbet-providers-strip"/, lang);
    assert.match(providerSection, /data-strip-next[^>]*aria-controls="coldbet-providers-strip"/, lang);
    assert.equal([...providerSection.matchAll(/<img src="\/images\/providers\//g)].length, providers.length, lang);
    for (const [name, slug] of providers) {
      assert.ok(providerSection.includes(`src="/images/providers/${slug}.svg"`), lang);
      assert.ok(providerSection.includes(`<span>${esc(name)}</span>`), lang);
    }
    const comparison = html.match(/<section[^>]+id="coldbet-pros-cons"[\s\S]*?<\/section>/)?.[0];
    assert.equal([...comparison.matchAll(/<span>- /g)].length, 10, lang);
    for (const [step, rate, min, cap, spins, game] of welcomeDeposits) {
      assert.ok(html.includes(`<tr><th scope="row">${number(step)}</th><td>${eur(min)}</td><td>${percent(rate)} · ${eur(cap)}</td><td>${number(spins)} · ${game}</td></tr>`), lang);
    }
    const cashier = html.match(/<section[^>]+id="coldbet-cashier"[\s\S]*?<\/section>/)?.[0];
    for (const methods of paymentGroups) assert.ok(cashier.includes(esc(methods.join(', '))), lang);
    assert.match(cashier, /34/);
    assert.match(cashier, /25/);
    const perks = html.match(/<section[^>]+id="coldbet-rewards"[\s\S]*?<\/section>/)?.[0];
    for (const [tier] of vipRows) assert.ok(perks.includes(`<th scope="row">${esc(tier)}</th>`), lang);
    for (const country of ['poland', 'portugal']) {
      assert.ok(read(`${prefix}online-casinos/${country}/index.html`).includes(`href="${path}"`), `${lang}/${country}`);
    }
  }
});
