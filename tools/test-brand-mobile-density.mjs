import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { mobileReviewTableMode } from '../scripts/pages/brand.js';

const row = (values, rowHeader = false) => ({
  cells: values.map((textContent, index) => ({
    textContent,
    matches: selector => rowHeader && index === 0 && selector === 'th[scope="row"]',
  })),
});

test('compact numerical comparisons retain their columns on mobile', () => {
  assert.equal(mobileReviewTableMode([
    row(['1 · £20', '100% · £100', '80']),
    row(['2 · £50', '75% · £400', '100']),
  ], 3), 'matrix');
  assert.equal(mobileReviewTableMode([
    row(['Tycoon', '10% · £1,000', '10% · £5,000']),
  ], 3), 'matrix');
  assert.equal(mobileReviewTableMode([
    row(['GBP', '£20', 'Subject to identity verification and method availability.']),
  ], 3), 'stack');
  assert.equal(mobileReviewTableMode([], 3), 'stack');
});

test('two-column terms tables omit repetitive mobile labels only when they have row headings', () => {
  assert.equal(mobileReviewTableMode([row(['Wagering', '35× with a £5 maximum stake'], true)], 2), 'key-value');
  assert.equal(mobileReviewTableMode([row(['Wagering', '35× with a £5 maximum stake'])], 2), 'stack');
});

test('mobile review strips leave room for the next card and carousel alignment is shared', () => {
  const css = readFileSync(new URL('../styles/brand-review.css', import.meta.url), 'utf8');
  assert.match(css, /\[data-review-strip\] > \.brand-review-strip > \.feature-card \{[^}]*flex-basis: calc\(100% - 44px\)/);
  const layout = readFileSync(new URL('../styles/pages.css', import.meta.url), 'utf8');
  assert.match(layout, /body\[data-brand\] \.brand-profile-showcase h1[^}]+--heading-size: var\(--type-section\)/);
  const strip = readFileSync(new URL('../styles/section-contrast-preview.css', import.meta.url), 'utf8');
  assert.match(strip, /\.brand-related-reviews \.home-games-controls \{\s*margin-inline-start: auto/);
});
