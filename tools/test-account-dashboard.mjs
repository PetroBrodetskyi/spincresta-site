import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { getAccountSection } from '../scripts/pages/account.js';
import { accountHeaderPreview } from '../scripts/account-auth.js';
import { favoriteLogoPath } from '../scripts/brand-favorites.js';
import { newsletterStatusLabel } from '../scripts/pages/moderator.js';

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
    for (const hook of ['data-account-page-loading', 'data-account-reviews-loading']) {
      assert.ok(html.includes(`class="dashboard-skeleton" ${hook} role="status"`), prefix);
    }
  }
});

test('header previews are time-limited presentation data, not session state', () => {
  const now = 100000;
  const raw = value => JSON.stringify({ expires: now + 10, ...value });
  assert.deepEqual(accountHeaderPreview(raw({ kind: 'account', name: 'Demo Player', role: 'moderator', token: 'unused' }), now),
    { kind: 'account', name: 'Demo Player' });
  assert.equal(accountHeaderPreview(raw({ kind: 'account', name: 'demo@example.test' }), now), null);
  assert.equal(accountHeaderPreview(raw({ kind: 'guest', expires: now }), now), null);
  assert.deepEqual(accountHeaderPreview(raw({ kind: 'guest' }), now), { kind: 'guest' });
  assert.equal(accountHeaderPreview('broken JSON', now), null);
});

test('favorite images use local brand assets and reject external or traversal paths', () => {
  assert.equal(favoriteLogoPath('images/britsino.webp'), '/images/britsino.webp');
  for (const invalid of ['images/../other.png', '/images//logo.webp', 'https://other.test/logo.png', 'data:image/svg+xml,foo', '//other.test/logo.png']) {
    assert.equal(favoriteLogoPath(invalid), '');
  }
});

test('moderation has two accessible panels, real loading states and plain status labels', () => {
  const html = fs.readFileSync(new URL('../moderator/index.html', import.meta.url), 'utf8');
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.match(html, /rel="canonical" href="https:\/\/spincresta\.com\/moderator\/"/);
  for (const view of ['reviews', 'users']) {
    assert.match(html, new RegExp(`aria-controls="moderator-${view}-panel"`));
    assert.match(html, new RegExp(`role="tabpanel" aria-labelledby="moderator-${view}-tab"`));
  }
  assert.match(html, /class="dashboard-skeleton" data-moderator-loading/);
  assert.match(html, /class="dashboard-skeleton" data-moderator-users-loading/);
  assert.doesNotMatch(html, /0 users|moderation-user-table/);
  assert.equal(newsletterStatusLabel('PENDING_CONFIRMATION'), 'Pending confirmation');
  assert.equal(newsletterStatusLabel(null), 'Not subscribed');
});
