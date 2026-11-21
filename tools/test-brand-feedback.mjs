import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { afterEach, test } from 'node:test';
import { fetchPublicFeedback, fetchFeedbackVotes, buildFeedbackStructuredData, initBrandFeedback, renderRatingOptions, renderRatingTeaser } from '../scripts/pages/brand-feedback.js';

const originalFetch = globalThis.fetch;
afterEach(() => {
  globalThis.fetch = originalFetch;
  delete globalThis.document;
  delete globalThis.window;
});
const empty = { ok: true, summary: { averageRating: 0, ratingCount: 0, reviewCount: 0 }, reviews: [] };

test('empty review masthead has outlined stars, plain copy and no numeric placeholder', () => {
  const markup = renderRatingTeaser(empty.summary, 'en');
  assert.equal((markup.match(/class="brand-rating-star"/g) || []).length, 5);
  assert.match(markup, /No ratings yet/);
  assert.doesNotMatch(markup, /Write a review|—|0\.0|Ratings: 0|brand-rating-teaser-score|Be the first|--rating-fill/);
  assert.doesNotMatch(renderRatingTeaser(null, 'en'), /No ratings yet|Write a review/);
});

test('a populated masthead shows the actual localized score and fractional stars', () => {
  const summary = { averageRating: 4.3, ratingCount: 3, reviewCount: 2 };
  const markup = renderRatingTeaser(summary, 'uk');
  assert.match(markup, /<strong>4,3<\/strong><span> \/ 5/);
  assert.equal((markup.match(/--rating-fill: 100%/g) || []).length, 4);
  assert.match(markup, /--rating-fill: 30%/);
  assert.match(markup, /Оцінки: 3 · Відгуки: 2/);
  assert.doesNotMatch(markup, /brand-rating-teaser-action/);
  assert.match(renderRatingTeaser({...summary, reviewCount: 0}, 'uk'), /Оцінки: 3 · Відгуки: 0/);
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

test('the multiline review field uses the standard panel radius, not the pill radius', () => {
  const css = readFileSync(new URL('../styles/pages.css', import.meta.url), 'utf8');
  const field = [...css.matchAll(/^body\[data-brand\] \.brand-feedback-compose textarea \{([^}]+)\}/gm)].at(-1)?.[1];
  assert.match(field ?? '', /border-radius: var\(--radius-md\)/);
  assert.match(field ?? '', /resize: vertical/);
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

test('brand_not_found keeps the ratings and reviews section linked, and later success restores its form', async () => {
  const element = () => ({
    dataset: {}, isConnected: true, innerHTML: '', textContent: '',
    addEventListener() {}, setAttribute() {},
    remove() { this.isConnected = false; },
  });
  const section = element();
  const teaser = element();
  const compose = element();
  const signIn = element();
  const list = element();
  const counts = element();
  const children = new Map([
    ['.brand-feedback-compose', compose], ['[data-feedback-list]', list],
    ['[data-feedback-signin]', signIn], ['[data-feedback-counts]', counts],
    ...['form', 'compose-toggle', 'status', 'average', 'stars'].map(key=>[`[data-feedback-${key}]`,element()]),
  ]);
  section.querySelector = selector => children.get(selector) ?? null;
  section.append = child => { child.isConnected = true; };
  const listeners = new Map();
  const main = { append(node) { assert.equal(node, section); } };
  const highlights = { querySelector: selector => selector.startsWith(':scope')
    ? { insertAdjacentElement(_position, link) { assert.equal(link, teaser); } }
    : null };
  globalThis.document = {
    documentElement: { dataset: {} },
    getElementById: () => null,
    createElement: tag => tag === 'section' ? section : teaser,
    querySelector: selector => selector.includes('.content-review') ? main
      : selector.includes('#brand-why-section') ? highlights : null,
  };
  globalThis.window = {
    location: new URL('https://spincresta.com/brands/example/'),
    matchMedia: () => ({ matches: false }),
    addEventListener(type, listener) { listeners.set(type, [...(listeners.get(type) || []), listener]); },
  };
  globalThis.fetch = async () => Response.json({ ok: false, error: 'brand_not_found' }, { status: 404 });
  await initBrandFeedback({ brand: 'example' });
  assert.equal(section.isConnected, true);
  assert.equal(teaser.isConnected, true);
  assert.equal(teaser.href, '#player-reviews');
  assert.equal(compose.isConnected, false);
  assert.equal(list.dataset.state, 'unavailable');
  assert.match(list.innerHTML, /temporarily unavailable/);
  assert.doesNotMatch(teaser.innerHTML + list.innerHTML, /No ratings yet|No player reviews yet/);

  globalThis.fetch = async () => Response.json(empty);
  listeners.get('spincresta:account-ready').forEach(listener => listener());
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(compose.isConnected, true);
  assert.equal(signIn.hidden, false);
  assert.equal(list.dataset.state, 'ready');
  assert.equal(counts.textContent, 'No ratings yet');
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
