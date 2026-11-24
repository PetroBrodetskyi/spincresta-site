import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import { homeLanguagePaths, HOME_PAGE_ASSET_VERSION, syncHomeLanguageSwitcher } from './sync-home-language-switcher.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

test('all homepages expose canonical language links in the original HTML', () => {
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  for (const [locale, route] of homeLanguagePaths) {
    const file = `${route.slice(1)}index.html`;
    const html = fs.readFileSync(file, 'utf8');
    assert.equal(syncHomeLanguageSwitcher(html, locale), html, file);
    assert.equal(syncDefaultTheme(html), html, file);

    const menu = html.match(/<details class="language-switcher" data-static-language-switcher>[\s\S]+?<\/details>/g);
    assert.equal(menu?.length, 1, file);
    assert.ok(html.indexOf(menu[0]) < html.indexOf('</header>'), file);
    const options = [...menu[0].matchAll(/<a class="language-switcher-option" href="([^"]+)" lang="([^"]+)"([^>]*)>/g)];
    assert.equal(options.length, 10, file);
    for (const [, href, lang, attrs] of options) {
      assert.equal(href, homeLanguagePaths.get(lang), file);
      assert.ok(sitemap.includes(`<loc>https://spincresta.com${href}</loc>`), href);
      assert.equal(attrs.includes('aria-current="page"'), lang === locale, file);
      assert.match(attrs, /aria-label="[^"]+"/, file);
    }
    assert.equal(new Set(options.map(([, , lang]) => lang)).size, 10, file);
    assert.ok(html.includes(`src="/scripts/main.js?v=${HOME_PAGE_ASSET_VERSION}"`), file);
    assert.ok(html.includes(`href="/styles.css?v=${HOME_PAGE_ASSET_VERSION}"`), file);
  }
});

test('runtime enhances the existing menu without duplicating it or losing language preference', () => {
  let href = '/';
  const english = {
    getAttribute: name => name === 'lang' ? 'en' : href,
    setAttribute: (_, value) => { href = value; },
  };
  const handlers = {};
  const documentHandlers = {};
  const switcher = {
    dataset: {},
    querySelectorAll: () => [english],
    addEventListener: (event, listener) => { handlers[event] = listener; },
    contains: () => false,
    removeAttribute: name => { assert.equal(name, 'open'); closeCount++; },
  };
  const account = {};
  const appended = [];
  const persisted = [];
  let closeCount = 0;
  const header = {
    querySelector: selector => selector === '.language-switcher' ? switcher : account,
    append: element => appended.push(element),
  };
  const document = {
    querySelector: () => header,
    createElement: () => assert.fail('must reuse the existing switcher'),
    addEventListener: (event, listener) => { documentHandlers[event] = listener; },
  };
  const source = fs.readFileSync('scripts/main.js', 'utf8');
  const init = source.slice(source.indexOf('const getLocaleSwitchPath ='), source.indexOf('const renderPayments ='));
  vm.runInNewContext(`${init}\ninitLanguageSwitcher(); initLanguageSwitcher();`, {
    document,
    window: { location: { pathname: '/uk/', search: '?utm_source=example', hash: '#home-country-title' } },
    persistLanguage: locale => persisted.push(locale),
  });
  assert.equal(href, '/?utm_source=example#home-country-title');
  assert.deepEqual(appended, [account]);
  handlers.click({ target: { closest: () => english } });
  documentHandlers.click({ target: {} });
  assert.deepEqual(persisted, ['en']);
  assert.equal(closeCount, 2);
});
