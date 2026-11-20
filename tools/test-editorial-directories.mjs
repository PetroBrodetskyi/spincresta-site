import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { casinoDirectoryFiles, syncCasinoDirectoryLayout } from './sync-casino-directory-layout.mjs';
import { catalogMatch } from '../scripts/pages/catalog-directory.js';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

test('the directory combines a case- and accent-insensitive name search with product filters', () => {
  assert.equal(catalogMatch('Café Spin', 'casino-betting', 'cafe SPIN', 'betting'), true);
  assert.equal(catalogMatch('SpinBoss', 'casino-betting', 'boss', 'casino'), true);
  assert.equal(catalogMatch('SpinBoss', 'betting', 'boss', 'casino'), false);
  assert.equal(catalogMatch('Azurslot', 'casino', 'fraga', 'all'), false);
});

test('localized directories have one internal review link per compact card, one search and alphabet groups', () => {
  for (const { file, locale } of casinoDirectoryFiles()) {
    const html = read(file);
    assert.equal(syncCasinoDirectoryLayout(html, locale), html, file);
    assert.equal([...html.matchAll(/data-catalog-query/g)].length, 1, file);
    assert.doesNotMatch(html, /const buttons = document\.querySelectorAll\('#typeFilters/, file);
    const entries = [...html.matchAll(/<article class="casino-list-row"[^>]*>([\s\S]*?)<\/article>/g)];
    assert.ok(entries.length > 180, file);
    const prefix = locale === 'en' ? '/' : `/${locale}/`;
    for (const [, markup] of entries) {
      const card = markup.replace(/<template\b[\s\S]*?<\/template>/g, '');
      const links = [...card.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)].map(match => match[1]);
      assert.equal(links.length, 1, card);
      assert.ok(links[0].startsWith(`${prefix}brands/`), card);
      assert.ok(fs.existsSync(new URL(`..${links[0]}index.html`, import.meta.url)), card);
      assert.match(card, /class="home-new-review-logo"/);
      assert.match(card, /<strong class="casino-name">[^<]+<\/strong>/);
      assert.match(card, /\balt=""/);
      assert.doesNotMatch(card, /casino-(?:bonus|list-cta)|<details/);
    }
    const ids = new Set([...html.matchAll(/<section class="content" id="(letter-[^"]+)"/g)].map(match => match[1]));
    const links = [...html.matchAll(/href="#(letter-[^"]+)"/g)].map(match => match[1]);
    assert.deepEqual(new Set(links), ids, file);
  }
});

test('partners share the account navigation shell without counters and retain their contact links', () => {
  for (const { locale } of casinoDirectoryFiles()) {
    const file = `${locale === 'en' ? '' : locale + '/'}partners/index.html`;
    const html = read(file);
    const keys = ['formats', 'process', 'requirements', 'contact', 'faq'].map(key => `partners-${key}`);
    assert.match(html, /<nav class="account-menu" aria-labelledby="partners-title">/, file);
    assert.deepEqual([...html.matchAll(/data-partners-nav="([^"]+)"/g)].map(match => match[1]), keys, file);
    assert.deepEqual([...html.matchAll(/data-partners-panel="([^"]+)"/g)].map(match => match[1]), keys, file);
    assert.doesNotMatch(html, /home-stats-(?:grid|number)|siteCountryCount|siteBrandCount|editorial-card-band|home-method-icon/, file);
    assert.match(html, /<ol class="editorial-panel-rows"/, file);
    assert.equal([...html.matchAll(/class="editorial-panel-step" aria-hidden="true">(\d)\./g)].map(match => match[1]).join(''), '1234', file);
    assert.match(html, /href="mailto:affiliates@armadaapp\.com"/, file);
    assert.match(html, /href="https:\/\/t\.me\/armada_affiliates_team"/, file);
    assert.match(html, /aria-label="Telegram: @armada_affiliates_team"><span class="partners-telegram-icon" aria-hidden="true"><\/span>/, file);
  }
});

test('About shares the neutral dashboard with crawlable sections and localized links', () => {
  const keys = ['about-overview', 'editorial-method', 'about-author', 'about-transparency', 'about-countries'];
  for (const { locale } of casinoDirectoryFiles()) {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const file = `${prefix}about/index.html`;
    const html = read(file);
    assert.match(html, /<nav class="account-menu" aria-labelledby="about-title">/, file);
    assert.deepEqual([...html.matchAll(/href="#([^"]+)" data-about-nav="\1"/g)].map(match => match[1]), keys, file);
    assert.deepEqual([...html.matchAll(/id="([^"]+)" data-about-panel="\1"/g)].map(match => match[1]), keys, file);
    assert.doesNotMatch(html, /home-stats-(?:grid|number)|siteCountryCount|siteBrandCount|editorial-card-band|home-method-icon/, file);
    for (const target of ['authors/odri-chambers/', 'partners/', 'online-casinos/', 'casinos-and-betting/', 'responsible-gambling/']) {
      assert.ok(html.split('<main')[1].split('</main>')[0].includes(`href="/${prefix}${target}"`), `${file}: ${target}`);
    }
  }
});
