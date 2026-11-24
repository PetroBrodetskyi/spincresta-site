import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { providerDirectoryIndex } from '../scripts/provider-directory-index.js';
import { providerDirectoryKey } from '../scripts/provider-directory-key.js';
import { matchesProvider } from '../scripts/pages/game-provider-directory.js';
import { directoryCopy } from './game-provider-directory-copy.mjs';
import { gameExamples } from './game-provider-directory-data.mjs';
import { publicThemePages } from './sync-default-theme.mjs';

const path = file => new URL('../' + file, import.meta.url);
const read = file => readFileSync(path(file), 'utf8');
const locales = Object.keys(directoryCopy);
const prefix = lang => lang === 'en' ? '' : lang + '/';
const home = lang => '/' + prefix(lang) + 'game-providers/';
const origin = 'https://spincresta.com';

test('all provider directories keep the Payment Methods shell and reciprocal SEO links', () => {
  const sitemap = read('sitemap.xml');
  for (const lang of locales) {
    const file = prefix(lang) + 'game-providers/index.html';
    const html = read(file);
    assert.match(html, /editorial-dashboard--payment-methods container" data-editorial-dashboard data-provider-directory/g, file);
    assert.ok(html.includes('rel="canonical" href="' + origin + home(lang) + '"'), file);
    for (const other of locales) {
      assert.ok(html.includes('hreflang="' + (other === 'fi' ? 'fi-FI' : other) +
        '" href="' + origin + home(other) + '"'), file + ': ' + other);
    }
    assert.ok(html.includes('hreflang="x-default" href="' + origin + home('en') + '"'), file);
    assert.equal(sitemap.split('<loc>' + origin + home(lang) + '</loc>').length, 2, file);
    assert.ok(read(prefix(lang) + 'payment-methods/index.html').includes('href="' + home(lang) + '"'), file);
    const catalog = html.match(/<main\b[\s\S]*?<\/main>/)?.[0];
    assert.ok(catalog, file);
    assert.doesNotMatch(catalog, /<(details|summary)\b/, file);
    const entries = [...catalog.matchAll(/<li id="provider-([a-z0-9]+)" data-provider-result/g)].map(([, id]) => id);
    assert.ok(entries.length >= 87, file);
    assert.equal(new Set(entries).size, entries.length, file);
    for (const id of new Set(Object.values(providerDirectoryIndex))) assert.ok(entries.includes(id), file + ': ' + id);
    for (const [, href] of catalog.matchAll(/<a\b[^>]*\shref="([^"]+)"/g)) {
      if (href.startsWith('#')) continue;
      assert.ok(href.startsWith('/' + prefix(lang) + 'brands/'), file + ': unexpected destination ' + href);
      assert.ok(existsSync(path(href.slice(1) + 'index.html')), href);
    }
  }
});

test('the directory uses real reviewed games and distinguishes game evidence from studio links', () => {
  const html = read('game-providers/index.html');
  const ezugi = html.match(/<li id="provider-ezugi"[\s\S]*?<\/li>/)?.[0];
  const evo = html.match(/<li id="provider-evolution"[\s\S]*?<\/li>/)?.[0];
  assert.match(ezugi, /VIP Roulette — <a class="provider-review-link" href="\/brands\/bitgames\/">BitGames<\/a>/);
  assert.match(evo, /href="\/brands\/coldbet\/">ColdBet<\/a>/);
  const oaks = html.match(/<li id="provider-3oaks"[\s\S]*?<\/li>/)?.[0];
  assert.match(oaks, /<strong>Casino reviews \(\d+\):<\/strong>/);
  assert.match(oaks, /href="\/brands\/fraga-ar\/">Fraga \(Argentina\)<\/a>/);
  assert.match(oaks, /href="\/brands\/fraga-az\/">Fraga \(Azerbaijan\)<\/a>/);
  assert.equal(providerDirectoryIndex.pocketgamessoft, 'pgsoft');
  assert.ok(gameExamples.length > 10);
});

test('every page with the public footer links to the right catalog once, with the shared layers icon', () => {
  let footerCount = 0;
  for (const file of publicThemePages()) {
    const html = readFileSync(file, 'utf8');
    const nav = html.match(/<nav class="footer-nav">[\s\S]*?<\/nav>/)?.[0];
    if (!nav) continue;
    footerCount++;
    const lang = html.match(/<html\b[^>]*\blang="([a-z]{2})/)?.[1] || 'en';
    const links = [...nav.matchAll(/<a href="(\/(?:[a-z]{2}\/)?game-providers\/)">([\s\S]*?)<\/a>/g)];
    assert.equal(links.length, 1, file);
    assert.equal(links[0][1], home(lang), file);
    assert.match(links[0][2], /<svg class="site-icon site-icon--inline"[^>]+aria-hidden="true"[^>]*><use href="[^\"]+#layers">/, file);
    assert.ok(links[0][2].endsWith(directoryCopy[lang].title), file);
  }
  assert.ok(footerCount > 2600);
});

test('provider filters match studio aliases or game titles and never infer a category from provider presence', () => {
  const row = { search: 'spribe aviator', types: ['crash'] };
  assert.equal(matchesProvider(row, providerDirectoryKey('AVIATOR'), 'all'), true);
  assert.equal(matchesProvider(row, providerDirectoryKey('Aviator'), 'crash'), true);
  assert.equal(matchesProvider(row, providerDirectoryKey('Aviator'), 'slots'), false);
  assert.equal(matchesProvider({ search: 'test', types: [] }, '', 'table'), false);
  assert.equal(matchesProvider({ search: 'test', types: [] }, '', 'all'), true);
  assert.equal(providerDirectoryKey('Joker’s Jewels'), 'jokersjewels');
});
