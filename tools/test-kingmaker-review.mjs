import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { belongsInReviewDetails } from '../scripts/pages/brand.js';
import { kingmakerCopy } from './kingmaker-review-copy.mjs';
import { casinoWelcomeByCurrency, cashierExamples, dailyCasinoCashback, reviewedDetails } from './kingmaker-review-details.mjs';
import { escapeReview as esc } from './brand-review-template.mjs';

const brand = BRANDS.find(item => item.name === 'Kingmaker');
const sitemap = readFileSync('sitemap.xml', 'utf8');
const hero = BRAND_HOMEPAGE_SCREENSHOTS.kingmaker;
const locales = ['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const route = lang => `/${lang === 'en' ? '' : lang + '/'}brands/kingmaker/`;
const url = lang => 'https://spincresta.com' + route(lang);

test('Kingmaker registry retains approved affiliate URL and every partner market', () => {
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124846');
  assert.deepEqual(brand.countries, ['ES','DE','AT','NO','FI','IE','HU','PL','SI','SK','CZ','IT','CH','BE','CA','AU','NZ']);
  assert.equal(brand.bonus, kingmakerCopy.en.headline);
  assert.equal(new Set(BRAND_NEW_GAMES.kingmaker.map(game => game.image)).size, 6);
  for (const { image } of BRAND_NEW_GAMES.kingmaker) assert.match(image, /^https:\/\/res\.cloudinary\.com\/drj61gmd2\/.*\/kingmaker\/new-games\//);
});

test('Kingmaker snapshot distinguishes public catalog observations from items not surfaced', () => {
  const { tabs, labels } = BRAND_SNAPSHOT_CONFIGS.kingmaker;
  const [games, live, sports] = tabs;
  assert.deepEqual(tabs.map(tab => tab.unavailable), [['Slingo'], ['Live bingo'], ['Chess']]);
  for (const tab of tabs) {
    assert.ok(tab.available.length > 0);
    assert.ok(tab.unavailable.every(category => !tab.available.includes(category)));
  }
  for (const category of ['Keno', 'Video poker', 'Bingo', 'Scratch cards', 'Crash games', 'Craps and dice']) {
    assert.ok(games.available.includes(category), category);
  }
  assert.ok(live.available.includes('Live shows'));
  for (const category of ['Cricket', 'Boxing', 'MMA', 'Horse racing']) assert.ok(sports.available.includes(category), category);
  assert.equal(labels.en['Not surfaced:'], 'Not surfaced:');
  for (const lang of locales.filter(lang => lang !== 'en')) {
    assert.ok(labels[lang]['Not surfaced:']?.trim());
    assert.notEqual(labels[lang].Chess, 'Chess');
    assert.ok(labels[lang].Chess?.trim());
  }
});

for (const lang of locales) {
  test(`Kingmaker ${lang}: indexed review, localized FAQ, supported assets, and central sportsbook`, async () => {
    const html = readFileSync(`.${route(lang)}index.html`, 'utf8');
    const c = kingmakerCopy[lang];
    assert.doesNotMatch(html, /noindex|class="brand-coming-soon|BetonWin|https?:\/\/(?:www\.)?kingmaker[-.]/i);
    assert.ok(sitemap.includes(`<loc>${url(lang)}</loc>`));
    assert.ok(html.includes(`rel="canonical" href="${url(lang)}"`));
    assert.ok(html.includes(`name="description" content="${esc(c.description)}"`));
    assert.ok(html.includes(`property="og:image" content="${hero}"`));
    for (const code of locales) assert.ok(html.includes(`hreflang="${code === 'fi' ? 'fi-FI' : code}" href="${url(code)}"`));
    const anchors = [...html.matchAll(/<a href="([^"]+)" class="cta-brands"/g)];
    assert.equal(anchors.length, 2);
    for (const [, href] of anchors) assert.equal(href, esc(brand.urlCasino));
    const json = JSON.parse(html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/)[1]);
    const questions = json['@graph'].find(item => item['@type'] === 'FAQPage').mainEntity;
    assert.equal(questions.length, 10);
    for (const {name, acceptedAnswer} of questions) assert.ok(html.includes(`<h3>${esc(name)}</h3><p>${esc(acceptedAnswer.text)}</p>`));
    assert.equal((html.match(/<span>- /g) || []).length, 8);
    const suitability = html.match(/id="kingmaker-best-for"[^>]*>([\s\S]*?)<\/section>/)[1];
    assert.match(suitability, /class="features-grid premium-grid"/);
    assert.equal((suitability.match(/class="feature-card glass-card"/g) || []).length, 2);
    assert.doesNotMatch(suitability, /<a\b/);
    if (lang === 'uk') assert.match(suitability, /<h2 class="title">Кому найкраще підходить<\/h2>/);
    assert.ok(html.includes(`class="cta-secondary editorial-resource-link" href="/${lang === 'en' ? '' : lang + '/'}responsible-gambling/"`));
    assert.doesNotMatch(html, /36 Coins x3000 · Bass Riches · Raptor Doublemax/);
    for (const kind of ['countries', 'payments']) {
      const panel = html.match(new RegExp(`class="brand-${kind}"[\\s\\S]*?<\\/section>`))[0];
      assert.doesNotMatch(panel, /class="section-intro"/);
    }

    const topics = [...html.matchAll(/<section([^>]+)data-review-section="([^"]+)"([^>]*)>([\s\S]*?)<\/section>/g)]
      .map(([, a, kind, b, markup]) => ({ kind, rail: (a+b).match(/data-brand-rail="([^"]+)"/)?.[1], hasTable: markup.includes('<table>'), explicit: (a+b).includes('data-review-details') }));
    assert.deepEqual(topics.filter(belongsInReviewDetails).map(item => item.kind), ['summary', 'bonuses', 'games', 'sports', 'rewards', 'cashier', 'trust']);
    assert.equal(topics.find(item => item.kind === 'sports').rail, undefined);
    if (lang !== 'en') {
      const { default: translations } = await import(`../scripts/brand-bonus-translations/${lang}.js`);
      assert.equal(translations[brand.bonus], c.headline);
    }
  });

  test(`Kingmaker ${lang}: currency amounts and payment ranges match the reviewed data`, () => {
    const html = readFileSync(`.${route(lang)}index.html`, 'utf8');
    const d = reviewedDetails[lang];
    const numbers = new Intl.NumberFormat(lang === 'pt' ? 'pt-PT' : lang, { useGrouping: 'always' });
    const locale = lang === 'pt' ? 'pt-PT' : lang;
    const regions = new Intl.DisplayNames([locale], { type: 'region' });
    const percent = new Intl.NumberFormat(locale, { style: 'percent' });
    const euro = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
    const part = id => html.match(new RegExp(`id="kingmaker-${id}"[^>]*>([\\s\\S]*?)<\\/section>`))[1];
    const bonus = part('bonus');
    for (const [code, min, max] of casinoWelcomeByCurrency) {
      assert.ok(bonus.includes(`<tr><td>${code}</td><td>${numbers.format(min)}</td><td>${numbers.format(max)}</td></tr>`), code);
    }
    for (const amount of [/700/, /35(?:×|-mal)/, /40(?:×|-mal)/, /50/]) assert.match(d.weekend[1], amount);
    assert.ok(bonus.includes(esc(d.weekend[1])));
    assert.ok(part('sports').includes(esc(d.boost[1])));
    assert.ok(part('games').includes('Sweet Bonanza Candyland'));
    const cashier = part('cashier');
    for (const [country, code, method, dMin, dMax, wMin, wMax] of cashierExamples) {
      const range = (min, max) => `${numbers.format(min)}–${numbers.format(max)} ${code}`;
      assert.ok(cashier.includes(`<tr><td>${regions.of(country)} · ${method}</td><td>${range(dMin, dMax)}</td><td>${range(wMin, wMax)}</td></tr>`), method);
    }
    for (const [level, rate, cap] of dailyCasinoCashback) {
      assert.ok(part('rewards').includes(`<tr><td>VIP ${level}</td><td>${percent.format(rate / 100)}</td><td>${euro.format(cap)}</td></tr>`));
    }
    assert.match(part('trust'), /support@kingmaker\.com.*complaints@kingmaker\.com/);
  });
}
