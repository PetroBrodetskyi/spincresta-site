import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { headerLanguages } from '../scripts/header-controls.js';
import { publicThemePages } from './sync-default-theme.mjs';
import { syncStaticHeaderControls } from './static-header-controls.mjs';

const read = path => readFileSync(path, 'utf8');

test('all pages with the shared site header ship each control once in the right slot', () => {
  let headers = 0;
  for (const file of publicThemePages()) {
    const html = read(file);
    const header = html.match(/<header\b[^>]*class="header"[^>]*>[\s\S]*?<\/header>/)?.[0];
    if (!header?.includes('class="nav"') || !header.includes('aria-controls="mobileMenu"')) continue;
    headers++;
    const signIn = [...header.matchAll(/<button class="account-auth-control"[^>]+>/g)];
    const search = [...header.matchAll(/<button class="site-search-trigger site-search-trigger--desktop"[^>]+><svg /g)];
    const language = [...header.matchAll(/<details class="language-switcher" data-static-language-switcher>/g)];
    assert.equal(search.length, 1, file);
    assert.equal(signIn.length, 1, file);
    assert.ok(search[0].index < header.indexOf('<nav class="nav"'), file);
    if (/data-page="moderator"/.test(html)) {
      assert.equal(language.length, 0, file);
    } else {
      assert.equal(language.length, 1, file);
      assert.ok(language[0].index < signIn[0].index, file);
      assert.match(header, /<summary class="language-switcher-current"[^>]*><img[^>]*width="20" height="14"/, file);
    }
    assert.equal(syncStaticHeaderControls(html), html, file);
  }
  assert.ok(headers > 2500);
});

test('a localized review presents working static language links to the same review', () => {
  const header = read('uk/brands/duckyluck/index.html').split('</header>')[0];
  for (const [locale] of headerLanguages) {
    assert.ok(header.includes(`href="${locale === 'en' ? '' : '/' + locale}/brands/duckyluck/" lang="${locale}"`), locale);
  }
  assert.match(header, /aria-label="Відкрити пошук"/);
  assert.match(header, /aria-label="Увійти"/);
});

test('account and search bind the static nodes instead of replacing them', () => {
  const auth = read('scripts/account-auth.js');
  const main = read('scripts/main.js');
  assert.match(auth, /const control = existing \|\| document\.createElement\('button'\);[\s\S]*?if \(!existing\) \{/);
  assert.doesNotMatch(auth, /is-placeholder/);
  assert.match(main, /let trigger = headerInner\.querySelector\('\.site-search-trigger--desktop'\);\s*if \(!trigger\)/);
  assert.match(main, /desktopSearchTrigger\.disabled = false/);
});
