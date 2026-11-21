import assert from 'node:assert/strict';
import { afterEach, test } from 'node:test';
import { fetchPublicFeedback, fetchFeedbackVotes, buildFeedbackStructuredData, renderRatingOptions, renderRatingTeaser } from '../scripts/pages/brand-feedback.js';

const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const empty = { ok: true, summary: { averageRating: 0, ratingCount: 0, reviewCount: 0 }, reviews: [] };

test('empty review masthead has outlined stars, plain copy and no numeric placeholder', () => {
  const markup = renderRatingTeaser(empty.summary, 'en');
  assert.equal((markup.match(/class="brand-rating-star"/g) || []).length, 5);
  assert.match(markup, /No ratings yet/);
  assert.match(markup, /Write a review/);
  assert.doesNotMatch(markup, /—|0\.0|Ratings: 0|brand-rating-teaser-score|Be the first|--rating-fill/);
  assert.doesNotMatch(renderRatingTeaser(null, 'en'), /No ratings yet|Write a review/);
});

test('a populated masthead shows the actual localized score and fractional stars', () => {
  const summary = { averageRating: 4.3, ratingCount: 3, reviewCount: 2 };
  const markup = renderRatingTeaser(summary, 'uk');
  assert.match(markup, /<strong>4,3<\/strong><span> \/ 5/);
  assert.equal((markup.match(/--rating-fill: 100%/g) || []).length, 4);
  assert.match(markup, /--rating-fill: 30%/);
  assert.match(markup, /Оцінки: 3 · Відгуки: 2/);
  assert.match(markup, /Читати відгуки/);
  assert.match(renderRatingTeaser({...summary, reviewCount: 0}, 'uk'), /Залишити відгук/);
  assert.doesNotMatch(renderRatingTeaser({...empty.summary, averageRating: 5}, 'en'), /--rating-fill/);
});

test('rating options follow left-to-right keyboard order and have localized accessible names', () => {
  const markup = renderRatingOptions({ star: 'estrella', stars: 'estrellas' });
  const radios = [...markup.matchAll(/id="brand-rating-(\d)" name="rating" type="radio" value="(\d)" aria-label="([^"]+)"/g)];
  assert.deepEqual(radios.map(([, id, value, label]) => [id, value, label]), [
    ['1', '1', '1 estrella'], ['2', '2', '2 estrellas'], ['3', '3', '3 estrellas'], ['4', '4', '4 estrellas'], ['5', '5', '5 estrellas'],
  ]);
  assert.deepEqual([...markup.matchAll(/for="brand-rating-(\d)"/g)].map(([, id]) => id), ['1', '2', '3', '4', '5']);
  assert.equal([...markup.matchAll(/aria-hidden="true" focusable="false"/g)].length, 5);
});

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
