import fs from 'node:fs';
import vm from 'node:vm';
import test from 'node:test';
import assert from 'node:assert/strict';
import { BRANDS } from '../scripts/brands.js';
import { syncBrandCasinoLinks } from '../scripts/pages/brand-layout.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { PINCO_COPY } from './pinco-review-copy.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const migrated = BRANDS.filter(brand => brand.urlCasino?.startsWith('https://offers-armada.com/click?'));
const decode = value => value.replaceAll('&amp;', '&');
const externalClicks = html => [...html.matchAll(/<a\b[^>]*\bhref="([^"]+)"[^>]*>/g)]
  .map(match => decode(match[1]))
  .filter(href => /^https?:\/\/[^/]+\/click\?/.test(href));

for (const brand of migrated) {
  const slug = brand.urlDetail.match(/brands\/([^/.]+)/)[1];
  test(`${slug}: all localized review CTAs use the registry destination`, () => {
    for (const locale of locales) {
      const file = `${locale === 'en' ? '' : `${locale}/`}brands/${slug}/index.html`;
      const links = externalClicks(fs.readFileSync(file, 'utf8'));
      assert.ok(links.length > 0, `${file}: missing casino CTA`);
      assert.deepEqual([...new Set(links)], [brand.urlCasino], `${file}: stale tracking destination`);
    }
  });
  test(`${slug}: all localized catalog rows use the same destination`, () => {
    for (const locale of locales) {
      const file = `${locale === 'en' ? '' : `${locale}/`}casinos-and-betting/index.html`;
      const html = fs.readFileSync(file, 'utf8');
      const rows = [...html.matchAll(/<article\b[^>]*class="casino-list-row"[\s\S]*?<\/article>/g)]
        .map(match => match[0])
        .filter(row => row.includes(`brands/${slug}/`));
      assert.equal(rows.length, 1, `${file}: one ${slug} row`);
      assert.deepEqual([...new Set(externalClicks(rows[0]))], [brand.urlCasino], `${file}: ${slug} catalog CTA`);
    }
  });
}

test('all approved migrated offers retain their exact mappings without tracker requests', () => {
  const approvedOffers = {
    'brands/fraga-ar.html': '253',
    'brands/fraga-az.html': '255',
    'brands/fraga-cl.html': '256',
    'brands/fraga-tr.html': '254',
    'brands/gamblezen.html': '262',
    'brands/goldencrown.html': '260',
    'brands/goldenstar.html': '259',
    'brands/kaasino.html': '261',
    'brands/pin-up.html': '257',
    'brands/pinco.html': '258',
  };
  assert.deepEqual(migrated.map(brand => brand.urlDetail).sort(), Object.keys(approvedOffers).sort());
  for (const brand of migrated) {
    assert.equal(brand.urlCasino, `https://offers-armada.com/click?pid=2&offer_id=${approvedOffers[brand.urlDetail]}`);
  }
  assert.equal(new Set(migrated.map(brand => brand.urlCasino)).size, migrated.length);
});

const link = (href, extra = {}) => {
  const attrs = { href, ...extra };
  return {
    dataset: {},
    getAttribute: name => attrs[name] ?? null,
    setAttribute: (name, value) => { attrs[name] = value; },
  };
};
const root = links => ({
  querySelectorAll(selector) {
    assert.equal(selector, 'a.cta-brands, a.brand-sticky-title, a.brand-new-game-card');
    return links;
  },
});

test('hero, sticky and game CTAs follow registry changes and remain idempotent', () => {
  const brand = BRANDS.find(brand => brand.name === 'Pinco');
  const links = [link('https://old.example/click'), link('/stale'), link('#')];
  const page = root(links);
  assert.equal(syncBrandCasinoLinks(page, brand), 3);
  assert.ok(links.every(item => item.getAttribute('href') === brand.urlCasino));
  assert.equal(syncBrandCasinoLinks(page, brand), 0);
  const changed = { ...brand, urlCasino: 'https://tracker.example/click?pid=9&offer_id=10' };
  assert.equal(syncBrandCasinoLinks(page, changed), 3);
  assert.ok(links.every(item => item.getAttribute('href') === changed.urlCasino));
});

test('unknown, blocked and temporarily unavailable brands never re-enable CTAs', () => {
  const href = 'https://existing.example/';
  for (const brand of [undefined, {}, { urlCasino: '' },
    { urlCasino: 'https://tracker.example/', notRecommended: true },
    { urlCasino: 'https://tracker.example/', temporarilyUnavailable: true }]) {
    const item = link(href);
    assert.equal(syncBrandCasinoLinks(root([item]), brand), 0);
    assert.equal(item.getAttribute('href'), href);
  }
  const ariaBlocked = link(null, { 'aria-disabled': 'true' });
  const blocked = link(null);
  blocked.dataset.blockedCta = 'true';
  assert.equal(syncBrandCasinoLinks(root([ariaBlocked, blocked]), { urlCasino: 'https://tracker.example/' }), 0);
  assert.equal(ariaBlocked.getAttribute('href'), null);
  assert.equal(blocked.getAttribute('href'), null);
});

test('game and sticky links use the approved registry destination', () => {
  const layout = fs.readFileSync('scripts/pages/brand-layout.js', 'utf8');
  assert.ok(layout.indexOf('syncBrandCasinoLinks(document.body, pageBrand)') < layout.indexOf('applyBrandStickyReviewLayout();'));
  assert.match(layout, /const casinoHref = !pageBrand\?\.notRecommended && !pageBrand\?\.temporarilyUnavailable &&\s*typeof pageBrand\?\.urlCasino === 'string' \? pageBrand\.urlCasino\.trim\(\) : ''/);
  assert.match(layout, /if \(!casinoHref\) return `<article class="brand-new-game-card">/);
  const page = fs.readFileSync('scripts/pages/brand.js', 'utf8');
  assert.ok(page.includes("const casinoHref = heroCta?.getAttribute('href')?.trim() || ''"));
});

test('Pinco generator uses the brand registry instead of a hardcoded offer ID', () => {
  const generator = fs.readFileSync('tools/build-pinco-reviews.mjs', 'utf8');
  assert.ok(generator.includes('esc(brand.urlCasino)'));
  assert.ok(!generator.includes('123113'));
  const main = fs.readFileSync('scripts/main.js', 'utf8');
  assert.match(main, /import \{ BRANDS \} from '\.\/brands\.js\?v=[^']+';/);
  assert.match(main, /import\('\.\/pages\/brand-layout\.js\?v=[^']+'\)/);
  for (const locale of locales) {
    const html = fs.readFileSync(`${locale === 'en' ? '' : `${locale}/`}brands/pinco/index.html`, 'utf8');
    assert.match(html, /\/scripts\/main\.js\?v=[a-zA-Z0-9-]+/);
  }
});

test('Pinco regenerates every locale without Planbet or changes to the review shell', () => {
  const generated = new Map();
  const layoutFixture = '<section data-test-layout="review" data-review-section="games" class="container" id="pinco-games" data-review-details>';
  const readFileSync = (file, encoding) => {
    assert.doesNotMatch(file, /brands\/planbet\//, 'Pinco must not read the Planbet template');
    const html = fs.readFileSync(file, encoding);
    return file === 'brands/pinco/index.html'
      ? html.replace(/<section\b[^>]*\bid="pinco-games"[^>]*>/, layoutFixture)
      : html;
  };
  const source = fs.readFileSync('tools/build-pinco-reviews.mjs', 'utf8').replace(/^import .*;\r?\n/gm, '');
  vm.runInNewContext(source, {
    fs: { readFileSync, writeFileSync: (file, html) => generated.set(file, html) },
    BRANDS, PINCO_COPY, console: { log() {} },
  });
  const brand = BRANDS.find(brand => brand.name === 'Pinco');
  const reviewMetadata = html => html.match(/<link\b(?=[^>]*(?:rel="canonical"|hreflang=))[^>]*>|<script\b[^>]*src="\/scripts\/main\.js[^"]*"[^>]*>/g);
  for (const locale of locales) {
    const file = `${locale === 'en' ? '' : `${locale}/`}brands/pinco/index.html`;
    const original = readFileSync(file, 'utf8');
    const html = generated.get(file) ?? original;
    assert.deepEqual(externalClicks(html), [brand.urlCasino], file);
    assert.deepEqual(reviewMetadata(html), reviewMetadata(original), `${file}: preserve canonical, language URLs and script version`);
    assert.ok(html.includes(BRAND_HOMEPAGE_SCREENSHOTS.pinco), `${file}: preserve Pinco screenshot`);
    assert.doesNotMatch(html, /Planbet/i, file);
    assert.match(html, /<section\b(?=[^>]*id="pinco-sports")(?=[^>]*data-review-section="sports")[^>]*data-review-details[^>]*>/, file);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    assert.deepEqual(graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(question => [question.name, question.acceptedAnswer.text]), PINCO_COPY[locale].faq, file);
  }
  assert.ok(generated.get('brands/pinco/index.html').includes(layoutFixture), 'keep added and reordered section attributes');
  vm.runInNewContext(source, {
    fs: {
      readFileSync: (file, encoding) => generated.get(file) ?? readFileSync(file, encoding),
      writeFileSync: file => assert.fail(`Pinco regeneration must be idempotent: ${file}`),
    },
    BRANDS, PINCO_COPY, console: { log() {} },
  });
});
