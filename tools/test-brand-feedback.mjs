import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { fetchPublicFeedback, fetchFeedbackVotes, buildFeedbackStructuredData } from '../scripts/pages/brand-feedback.js';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const empty = { ok: true, summary: { averageRating: 0, ratingCount: 0, reviewCount: 0 }, reviews: [] };

test('a successful empty response is a genuine empty state, without a fabricated rating', async () => {
  globalThis.fetch = async () => Response.json(empty);
  assert.deepEqual(await fetchPublicFeedback('https://example.test/reviews'), empty);
  assert.equal(buildFeedbackStructuredData({ payload: empty, canonicalUrl: 'https://spincresta.com/brands/20bet/', brandName: '20Bet', locale: 'en' }), null);
});

test('published reviews remain available', async () => {
  const payload = { ...empty, reviews: [{ id: 'review-1', body: 'A real published review' }] };
  globalThis.fetch = async () => Response.json(payload);
  assert.deepEqual(await fetchPublicFeedback('https://example.test/reviews'), payload);
});

test('an unregistered brand is not mistaken for an empty or failed review list', async () => {
  globalThis.fetch = async () => Response.json({ ok: false, error: 'brand_not_found' }, { status: 404 });
  assert.equal(await fetchPublicFeedback('https://example.test/reviews'), null);
});

test('HTTP failures and malformed responses never become zero-review claims', async () => {
  for (const response of [
    Response.json({ ok: false, error: 'feedback_unavailable' }, { status: 502 }),
    Response.json({ ok: false, error: 'origin_not_allowed' }, { status: 403 }),
    Response.json({ ok: true }),
    Response.json({ ...empty, reviews: null }),
    new Response('not json'),
  ]) {
    globalThis.fetch = async () => response;
    await assert.rejects(fetchPublicFeedback('https://example.test/reviews'));
  }
});

test('network failures do not become an empty review list', async () => {
  globalThis.fetch = async () => { throw new Error('offline'); };
  await assert.rejects(fetchPublicFeedback('https://example.test/reviews'));
});

test('optional votes cannot prevent otherwise valid reviews from loading', async () => {
  for (const response of [new Response(null, { status: 502 }), new Response('bad json'), Response.json(null)]) {
    globalThis.fetch = async () => response;
    assert.deepEqual(await fetchFeedbackVotes('https://example.test/votes'), { reviews: {}, replies: {} });
  }
  globalThis.fetch = async () => { throw new Error('offline'); };
  assert.deepEqual(await fetchFeedbackVotes('https://example.test/votes'), { reviews: {}, replies: {} });
});

test('valid vote counts are preserved', async () => {
  const payload = { reviews: { 'review-1': { likes: 2, dislikes: 1 } }, replies: {} };
  globalThis.fetch = async () => Response.json(payload);
  assert.deepEqual(await fetchFeedbackVotes('https://example.test/votes'), payload);
});
