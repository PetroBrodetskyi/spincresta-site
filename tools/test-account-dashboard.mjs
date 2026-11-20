import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { getAccountSection } from '../scripts/pages/account.js';

const locales = ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/'];

test('account navigation supports deep links and old section bookmarks', () => {
  for (const section of ['profile', 'favorites', 'reviews', 'support']) {
    assert.equal(getAccountSection(`#${section}`), section);
  }
  assert.equal(getAccountSection('#account-favorites-title'), 'favorites');
  assert.equal(getAccountSection('#account-review-history-title'), 'reviews');
  assert.equal(getAccountSection('#account-overview-title'), 'profile');
  assert.equal(getAccountSection('#missing'), 'profile');
  assert.equal(getAccountSection(''), 'profile');
});

test('every account page keeps its private panels and the existing auth hooks', () => {
  for (const prefix of locales) {
    const html = fs.readFileSync(new URL(`../${prefix}account/index.html`, import.meta.url), 'utf8');
    assert.match(html, /name="robots" content="noindex, nofollow"/, prefix);
    assert.match(html, /<main [^>]*data-account-page\b[^>]*>/, prefix);
    const navigation = [...html.matchAll(/href="#([a-z]+)" data-account-nav="([a-z]+)"/g)];
    assert.deepEqual(navigation.map(match => match[1]), ['profile', 'favorites', 'reviews', 'support'], prefix);
    assert.ok(navigation.every(match => match[1] === match[2]), prefix);
    const afterSignedIn = html.split('<div data-account-page-signed-in hidden>')[1];
    const [privatePanels, publicPanel] = afterSignedIn.split('<section id="support"');
    for (const attribute of ['data-account-page-name', 'data-account-contact-form', 'data-account-favorites-mount', 'data-account-review-history']) {
      assert.ok(privatePanels.includes(attribute), `${prefix}: ${attribute}`);
    }
    assert.match(publicPanel, /data-account-panel="support"/, prefix);
    assert.ok(publicPanel.includes(`href="/${prefix}privacy-policy/"`), prefix);
    assert.ok(publicPanel.includes(`href="/${prefix}responsible-gambling/"`), prefix);
    assert.match(html, /data-account-page-signout hidden/, prefix);
    assert.match(html, /data-moderator-link hidden/, prefix);
  }
});
