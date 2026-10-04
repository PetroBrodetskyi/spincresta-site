import { test } from 'node:test';
import assert from 'node:assert/strict';
import { resolveBrandNewGames } from '../scripts/pages/brand-layout.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
const normalize = key => key.toLowerCase().replace(/&/g,'and').replace(/[^a-z0-9]+/g,'');
test('canonical hyphenated slug resolves all National Casino games', () => {
  assert.equal(resolveBrandNewGames('national-casino', BRAND_NEW_GAMES, normalize),BRAND_NEW_GAMES['national-casino']);
  assert.equal(resolveBrandNewGames('national-casino', BRAND_NEW_GAMES, normalize).length,6);
});
test('legacy punctuation-free keys remain supported', () => {
  assert.equal(resolveBrandNewGames('goldenbet-uk', BRAND_NEW_GAMES, normalize),BRAND_NEW_GAMES.goldenbetuk);
});
test('unknown brand safely resolves no games', () => {
  assert.deepEqual(resolveBrandNewGames('not-a-brand', BRAND_NEW_GAMES, normalize),[]);
});
test('canonical entry takes precedence over legacy fallback', () => {
  const canonical=[{name:'Canonical'}];
  assert.equal(resolveBrandNewGames('example-brand',{'example-brand':canonical,examplebrand:[{name:'Legacy'}]},normalize),canonical);
});
