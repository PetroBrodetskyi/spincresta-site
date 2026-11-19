import assert from 'node:assert/strict';
import { test } from 'node:test';
import { persistBrandFavorite, readFavoriteBrands } from '../scripts/brand-favorites.js';

const key = 'spincresta_favorite_brands';
const fixture = (favorites = []) => {
  let user = { id: 'account-a', user_metadata: { full_name: 'Test account', [key]: favorites } };
  const writes = [];
  return {
    writes,
    auth: {
      getUser: async () => ({ data: { user } }),
      updateUser: async ({ data }) => {
        writes.push(data);
        user = { ...user, user_metadata: { ...user.user_metadata, ...data } };
        return { data: { user } };
      },
    },
  };
};
const active = () => 'account-a';

test('favorites read only the account’s valid, unique brand slugs', () => {
  assert.deepEqual(readFavoriteBrands(null), []);
  assert.deepEqual(readFavoriteBrands({ user_metadata: { [key]: 'spinboss' } }), []);
  assert.deepEqual(readFavoriteBrands({ user_metadata: {
    [key]: ['spinboss', 'spinboss', 'fraga-tr', '../account', 'Capital', null, 'x'.repeat(41)],
  } }), ['spinboss', 'fraga-tr']);
});

test('adding and removing favorites changes only the current account preference', async () => {
  const { auth, writes } = fixture(['fraga-tr']);
  let user = await persistBrandFavorite(auth, active, 'spinboss', true);
  assert.deepEqual(readFavoriteBrands(user), ['spinboss', 'fraga-tr']);
  assert.equal(user.user_metadata.full_name, 'Test account');
  await persistBrandFavorite(auth, active, 'spinboss', true);
  assert.equal(writes.length, 1);
  user = await persistBrandFavorite(auth, active, 'spinboss', false);
  assert.deepEqual(readFavoriteBrands(user), ['fraga-tr']);
  assert.deepEqual(writes, [{ [key]: ['spinboss', 'fraga-tr'] }, { [key]: ['fraga-tr'] }]);
});

test('guests, account switches and invalid slugs never update favorites', async () => {
  const { auth, writes } = fixture();
  for (const [userId, slug] of [[() => undefined, 'spinboss'], [() => 'account-b', 'spinboss'], [active, '/spinboss']]) {
    await assert.rejects(persistBrandFavorite(auth, userId, slug, true), /favorite_unavailable/);
  }
  let id = 'account-a';
  await assert.rejects(persistBrandFavorite({
    ...auth,
    getUser: async () => {
      id = 'account-b';
      return auth.getUser();
    },
  }, () => id, 'spinboss', true), /favorite_unavailable/);
  assert.deepEqual(writes, []);
});

test('failed persistence does not produce a saved state, and the list remains bounded', async () => {
  const { auth, writes } = fixture(Array.from({ length: 80 }, (_, i) => `brand-${i}`));
  await assert.rejects(persistBrandFavorite(auth, active, 'spinboss', true), /favorites_limit/);
  assert.deepEqual(writes, []);
  await assert.rejects(persistBrandFavorite({
    ...auth, updateUser: async () => ({ error: new Error('network') }),
  }, active, 'brand-0', false), /favorite_unavailable/);
  assert.equal(readFavoriteBrands(await persistBrandFavorite(auth, active, 'brand-0', false)).length, 79);
});
