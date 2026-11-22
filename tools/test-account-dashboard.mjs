import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { getAccountSection } from '../scripts/pages/account.js';
import { accountHeaderPreview, createAccountSessionSync } from '../scripts/account-auth.js';
import { favoriteLogoPath } from '../scripts/brand-favorites.js';
import { collectModeratorContacts, contactsCsv, newsletterStatusLabel } from '../scripts/pages/moderator.js';

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

test('a late sign-in refresh failure cannot replace a confirmed session', async () => {
  const user = { id: 'demo' };
  const profile = { registration_completed_at: '2026-11-22T00:00:00Z' };
  const access = { role: 'user' };
  let rejectFirstProfile, markStarted;
  const firstProfile = new Promise((_, reject) => { rejectFirstProfile = reject; });
  const started = new Promise(resolve => { markStarted = resolve; });
  const applied = [];
  let requests = 0;
  const sync = createAccountSessionSync({
    readSession: async () => ({ data: { session: { user, access_token: 'example' } } }),
    loadProfile: () => {
      if (++requests !== 1) return profile;
      markStarted();
      return firstProfile;
    },
    loadAccess: () => access,
    apply: value => applied.push(value),
  });
  const callback = sync.refresh();
  await started;
  await sync.refresh();
  rejectFirstProfile(new Error('temporary profile error'));
  await callback;
  assert.deepEqual(applied, [{ user, profile, access }]);
});

test('the newest session error still surfaces and a canceled refresh applies nothing', async () => {
  const error = new Error('session unavailable');
  const sync = createAccountSessionSync({
    readSession: async () => ({ data: null, error }),
    apply: () => assert.fail('An unconfirmed session must not update the account'),
  });
  await assert.rejects(sync.refresh(), error);
  const late = sync.refresh();
  sync.cancel();
  await late;
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
  assert.match(html, /class="cta-secondary moderation-button" href="\/account\/"[^]*?#arrow-left/);
  assert.match(html, /data-moderator-user-export disabled hidden/);
  assert.doesNotMatch(html, /0 users|moderation-user-table/);
  assert.equal(newsletterStatusLabel('PENDING_CONFIRMATION'), 'Pending confirmation');
  assert.equal(newsletterStatusLabel(null), 'Not subscribed');
});

test('contact CSV preserves international text and protects user-entered spreadsheet cells', () => {
  const csv = contactsCsv([{
    userId: 'private-id',
    displayName: 'Леся, "Demo"',
    email: 'lesya@example.test',
    phoneNumber: '+380 555 0100',
    telegramUsername: '@demo',
    countryCode: 'UA',
    locale: 'uk',
    newsletterStatus: 'pending_confirmation',
  }, { displayName: '  =1+1', email: '\r\n+2', telegramUsername: 'none' }]);
  assert.equal(csv.charCodeAt(0), 0xfeff);
  assert.ok(csv.includes('"Леся, ""Demo""","lesya@example.test","\'+380 555 0100","\'@demo","UA","uk","Pending confirmation"\r\n'));
  assert.ok(csv.includes('"\'  =1+1","\'\r\n+2"'));
  assert.doesNotMatch(csv, /private-id/);
});

test('contact export requests every page, and rejects an incomplete or interrupted result', async () => {
  const users = Array.from({ length: 201 }, (_, index) => ({ userId: String(index) }));
  const offsets = [];
  const page = (offset, limit) => ({
    users: users.slice(offset, offset + limit),
    pagination: { total: users.length, hasMore: offset + limit < users.length },
  });
  const all = await collectModeratorContacts(async (offset, limit) => {
    offsets.push(offset);
    return page(offset, limit);
  });
  assert.deepEqual(all, users);
  assert.deepEqual(offsets, [0, 100, 200]);
  await assert.rejects(collectModeratorContacts(async (offset, limit) => {
    const result = page(offset, limit);
    if (offset) result.users[0] = users[0];
    return result;
  }), /incomplete_contacts/);
  const controller = new AbortController();
  await assert.rejects(collectModeratorContacts(async (offset, limit) => {
    controller.abort();
    return page(offset, limit);
  }, controller.signal), { name: 'AbortError' });
});
