import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { lightEditorialPages, syncLightEditorialPage } from './sync-light-editorial-pages.mjs';
import { countryMatches } from '../scripts/pages/country-hub.js';
import { COUNTRIES } from '../scripts/countries.js';
import { renderCountryHubLinks } from './country-hub-links.mjs';

const expectedKeys = {
  'privacy-policy': ['privacy-details', 'privacy-storage', 'privacy-rights', 'privacy-contact', 'privacy-faq'],
  'responsible-gambling': ['safe-play-guide', 'protection-tools', 'warning-signs', 'support-resources', 'responsible-faq'],
  blog: ['latest-guides', 'seo-editorial-guide', 'blog-standards', 'blog-resources'],
  'payment-methods': ['payment-cards', 'payment-wallets', 'payment-vouchers', 'payment-transfers', 'payment-crypto'],
  'authors/odri-chambers': ['author-work', 'author-background', 'author-standards'],
  'online-casinos': ['country-guides', 'seo-editorial-guide', 'before-registration'],
};
const guidePage = 'blog/how-to-choose-an-online-casino';
const articleSections = ['quick-answer', 'license-and-location', 'bonus-terms', 'payments-withdrawals', 'game-fit', 'support-and-safety', 'final-checklist'];

test('all localized editorial pages use the light shell with unique and addressable sections', () => {
  assert.equal(lightEditorialPages().length, 70);
  for (const { file, locale, page } of lightEditorialPages()) {
    const html = fs.readFileSync(file, 'utf8');
    const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
    assert.equal(syncLightEditorialPage(html, page, locale), html, file);
    assert.match(main, /<nav class="account-menu"/, file);
    assert.doesNotMatch(main, /editorial-card-band|home-method-icon|blog-card-grid|payment-methods-grid|<section\b[^>]*\shidden[\s=>]/, file);
    if (page === guidePage) {
      assert.match(main, /<nav class="account-menu" aria-labelledby="article-contents-title" data-editorial-contents>/, file);
      assert.deepEqual([...main.matchAll(/href="#([^"]+)"/g)].map(match => match[1]), articleSections, file);
      assert.deepEqual([...main.matchAll(/<section aria-labelledby="([^"]+)"><h2 id="\1"/g)].map(match => match[1]), articleSections, file);
      assert.doesNotMatch(main, /data-editorial-panel/, file);
    } else {
      assert.deepEqual([...main.matchAll(/href="#([^"]+)"[^>]*data-editorial-nav="\1"/g)].map(match => match[1]), expectedKeys[page], file);
      assert.deepEqual([...main.matchAll(/<section class="account-panel" id="([^"]+)" data-editorial-panel="\1"/g)].map(match => match[1]), expectedKeys[page], file);
    }
    const ids = [...main.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, file);
  }
});

test('the localized country hubs expose every public guide as a static link', () => {
  for (const { file, locale } of lightEditorialPages().filter(({ page }) => page === 'online-casinos')) {
    const html = fs.readFileSync(file, 'utf8');
    const prefix = locale === 'en' ? '' : `/${locale}`;
    const links = [...html.matchAll(/class="country-hub-link" href="([^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(new Set(links), new Set(COUNTRIES.map(({ slug }) => `${prefix}/online-casinos/${slug}/`)), file);
    assert.equal(links.length, renderCountryHubLinks(locale).length, file);
    assert.match(html, /<label for="country-hub-query">/, file);
    assert.match(html, /class="country-hub-search" data-country-hub-search role="search" hidden/, file);
  }
  assert.equal(renderCountryHubLinks('uk', href => href.endsWith('/germany/')).length, 1);
  assert.ok(countryMatches('osterreich', 'Österreich', 'Austria at'));
  assert.ok(countryMatches('  United-King  ', 'Велика Британія', 'United Kingdom uk GB'));
  assert.ok(countryMatches('НІМЕЧ', 'Німеччина', 'Germany de'));
  assert.ok(countryMatches('फ़्रांस', 'फ़्रांस', 'France fr'));
  assert.ok(!countryMatches('spain', 'Франція', 'France fr'));
});

test('author profile keeps its photo and public links; the guide keeps its metadata, links, and checklist', () => {
  for (const { file, locale, page } of lightEditorialPages().filter(({ page }) =>
    page === 'authors/odri-chambers' || page === guidePage)) {
    const html = fs.readFileSync(file, 'utf8');
    const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
    const local = locale === 'en' ? '' : `/${locale}`;
    if (page === guidePage) {
      assert.match(main, /<time datetime="2026-07-22">/, file);
      assert.match(main, /<ol>[\s\S]*?<\/ol>/, file);
      for (const route of ['/online-casinos/', '/payment-methods/', '/responsible-gambling/', '/casinos-and-betting/', '/blog/']) {
        assert.ok(main.includes(`href="${local}${route}"`), file);
      }
    } else {
      assert.match(main, /<h1 id="author-title">Odri Chambers<\/h1>/, file);
      assert.match(main, /src="\/images\/team\/odri-chambers\.jpg"/, file);
      assert.match(main, /linkedin\.com\/in\/odri-chambers-4344091b5/, file);
      assert.match(main, /id="author-work-title"[^>]*>[^<]+<\/h2>\s*<p>[^<]+<\/p>/, file);
      assert.ok(main.includes(`href="${local}/about/"`), file);
      assert.equal([...main.matchAll(/<li><svg/g)].length, 4, file);
    }
  }
});

test('the redesign retains policy disclosures, help links, published guides, and payment providers', () => {
  for (const { file, locale, page } of lightEditorialPages()) {
    const html = fs.readFileSync(file, 'utf8');
    const main = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/)[0];
    const local = locale === 'en' ? '' : `/${locale}`;
    if (page === 'privacy-policy') {
      assert.equal([...main.matchAll(/<article[^>]*>\s*<h3>\d+[AB]?\./g)].length, 14, file);
      assert.match(main, /data-newsletter-privacy/, file);
      assert.match(main, /data-account-privacy/, file);
      assert.match(main, /mailto:affiliates@armadaapp\.com/, file);
    } else if (page === 'responsible-gambling') {
      assert.match(main, /class="home-primary-action editorial-help-action" href="#support-resources" data-editorial-jump/, file);
      assert.match(main, /id="support-resources-title"/, file);
      assert.match(main, /https:\/\/www\.gamcare\.org\.uk/, file);
      assert.match(main, /id="warning-signs-title"/, file);
    } else if (page === 'blog') {
      for (const dest of ['/blog/how-to-choose-an-online-casino/', '/payment-methods/', '/responsible-gambling/', '/online-casinos/']) {
        assert.ok(main.includes(`href="${local}${dest}"`), file);
      }
      assert.match(main, /id="editorial-standard-title"/, file);
    } else if (page === 'payment-methods') {
      const logos = [...main.matchAll(/<img src="(\/icons\/payments\/[^"]+)"/g)].map(match => match[1]);
      assert.equal(new Set(logos).size, 26, file);
      assert.ok(logos.every(logo => fs.existsSync(new URL(`..${logo}`, import.meta.url))), file);
      assert.equal([...main.matchAll(/<a href="https:[^"]+"[^>]+>[^<]+<span class="editorial-provider-name">/g)].length, 26, file);
      assert.match(main, /<h3>Visa<\/h3>/, file);
      assert.match(main, /<h3>Apple Pay<\/h3>/, file);
    }
    const faqs = [...main.matchAll(/<article class="faq-card">/g)];
    assert.equal(faqs.length, ['privacy-policy', 'responsible-gambling'].includes(page) ? 6 : 0, file);
  }
});
