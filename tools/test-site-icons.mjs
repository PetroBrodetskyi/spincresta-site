import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { initSiteIcons, linkIconFor, siteIconMarkup, SITE_ICON_SPRITE, TOPIC_ICONS } from '../scripts/site-icons.js';

const sprite = readFileSync(new URL('..' + SITE_ICON_SPRITE.split('?')[0], import.meta.url), 'utf8');
const symbols = [...sprite.matchAll(/<symbol id="([\w-]+)" viewBox="0 0 24 24">/g)].map(match => match[1]);

test('review topics use unique sprite definitions and decorative, unfocusable instances', () => {
  assert.equal(new Set(symbols).size, symbols.length);
  for (const icon of [...Object.values(TOPIC_ICONS), 'heart', 'mail', 'clock', 'calendar', 'lock', 'book', 'link', 'warning']) {
    assert.ok(symbols.includes(icon), icon);
    const markup = siteIconMarkup(icon);
    assert.ok(markup.includes(`href="${SITE_ICON_SPRITE}#${icon}"`));
    assert.match(markup, /aria-hidden="true" focusable="false"/);
    assert.doesNotMatch(markup, /\baria-label=|\btabindex=/);
  }
});

test('navigation icons follow localized internal destinations, not visible label text', () => {
  const base = 'https://spincresta.com/uk/brands/spinboss/';
  const routes = {
    '/uk/#home-country-title': 'globe', '/#home-country-title': 'globe',
    '/fi/top-casinos/': 'trophy', '/de/top-rated/': 'star', '/hi/new-casinos/': 'sparkles',
    '/exclusive-offers/': 'bonus', '/es/responsible-gambling/': 'safety', '/pl/privacy-policy/': 'lock',
    '/casinos-and-betting/': 'games', '/it/payment-methods/': 'payments', '/pt/partners/': 'link',
    '/fr/about/': 'user', '/blog/': 'book',
  };
  for (const [href, icon] of Object.entries(routes)) {
    assert.equal(linkIconFor(href, base), icon);
    assert.ok(symbols.includes(icon));
  }
  for (const href of [null, '#brand-review-overview', '/brands/spinboss/', 'https://example.org/about/', 'http://[invalid']) {
    assert.equal(linkIconFor(href, base), undefined);
  }
});

test('shared decoration is idempotent and leaves headings that already have an icon or image alone', () => {
  const element = (text, existing = false) => ({
    textContent: text, existing, icons: [],
    querySelector() { return this.existing || this.icons[0] || null; },
    insertAdjacentHTML(position, html) { assert.equal(position, 'afterbegin'); this.icons.push(html); },
  });
  const overview = element('Коротко про бренд');
  const countryFlagTitle = element('Україна', true);
  const paymentsTab = { ...element('Оплата'), id: 'brand-review-tab-cashier' };
  const section = (topic, title) => ({ dataset: { reviewSection: topic }, querySelector: () => title, closest: () => null });
  const doc = {
    body: { dataset: { brand: 'spinboss' }, matches: () => false },
    querySelector: () => null,
    querySelectorAll(selector) {
      if (selector.includes('[data-review-section]')) return [section('overview', overview), section('countries', countryFlagTitle)];
      if (selector.includes('__tabs')) return [paymentsTab];
      return [];
    },
  };
  initSiteIcons(doc);
  initSiteIcons(doc);
  assert.equal(overview.icons.length, 1);
  assert.match(overview.icons[0], /#review"/);
  assert.deepEqual(countryFlagTitle.icons, []);
  assert.equal(paymentsTab.icons.length, 1);
  assert.match(paymentsTab.icons[0], /#wallet"/);
  assert.equal(paymentsTab.textContent, 'Оплата');
});
