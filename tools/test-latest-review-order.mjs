import assert from 'node:assert/strict';
import test from 'node:test';
import { selectLatestReviewBrands } from '../scripts/pages/home.js';

const brand = (name, attributes = {}) => ({ name, urlDetail: `brands/${name}.html`,
  image: `images/${name}.webp`, hasDetailPage: true, countries: ['US'], ...attributes });
const names = brands => brands.map(entry => entry.name);

test('new and edited reviews move to the front using their UTC editorial timestamps', () => {
  const older = brand('old', { reviewUpdatedAt: '2026-11-28T10:00:00Z' });
  const newer = brand('new', { reviewUpdatedAt: '2026-11-28T11:00:00Z' });
  const undated = brand('fallback');
  const options = { market: 'US', fallbackSlugs: ['old', 'fallback'] };
  assert.deepEqual(names(selectLatestReviewBrands([older, newer, undated], options)), ['new', 'old', 'fallback']);
  const updated = { ...older, reviewUpdatedAt: '2026-11-28T12:00:00Z' };
  assert.deepEqual(names(selectLatestReviewBrands([updated, newer, undated], options)), ['old', 'new', 'fallback']);
});

test('latest reviews honor market, publication and availability, and do not duplicate cards', () => {
  const dated = { reviewUpdatedAt: '2026-11-28T11:00:00Z' };
  const branches = [brand('valid', dated), brand('valid'), brand('coming', { ...dated, reviewComingSoon: true }),
    brand('hidden', { ...dated, temporarilyUnavailable: true }), brand('not-recommended', { ...dated, notRecommended: true }),
    brand('de-only', { ...dated, countries: ['DE'] }), brand('legacy'), brand('priority')];
  assert.deepEqual(names(selectLatestReviewBrands(branches, { market: 'US', fallbackSlugs: ['priority'], limit: 3 })),
    ['valid', 'priority', 'legacy']);
  assert.deepEqual(names(selectLatestReviewBrands(branches, { market: 'DE' })), ['de-only']);
});
