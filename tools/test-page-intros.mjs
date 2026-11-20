import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { simplifyPageIntro } from './simplify-page-intros.mjs';

const read = path => fs.readFileSync(new URL(`../${path}/index.html`, import.meta.url), 'utf8');

test('illustrated editorial mastheads become compact headings without losing the title or links', () => {
  const fixture = `<body data-page="top-casinos">
    <section class="hero container"><div class="hero-content">
      <h1 id="rankings-title">Top casinos</h1><a href="#markets">Browse markets</a>
    </div>
    <div class="hero-banner"><!-- Banner ad or promo script --></div></section>
  </body>`;
  const next = simplifyPageIntro(fixture);
  assert.match(next, /class="page-intro container"/);
  assert.match(next, /class="page-intro-copy"/);
  assert.match(next, /<h1 id="rankings-title">Top casinos<\/h1><a href="#markets">Browse markets<\/a>/);
  assert.doesNotMatch(next, /hero-banner/);
  assert.equal(simplifyPageIntro(next), next);
});

test('public blog header has no decorative image and still has its article metadata', () => {
  const html = read('blog/how-to-choose-an-online-casino');
  assert.match(html, /<header class="account-dashboard-heading editorial-reading-heading">/);
  assert.match(html, /class="blog-article-meta"/);
  assert.match(html, /property="og:image"/);
  assert.doesNotMatch(html, /--blog-article-hero-image/);
});

test('brand reviews keep their own hero and artwork', () => {
  const html = read('uk/brands/gravira');
  assert.match(html, /class="hero container"/);
  assert.equal(simplifyPageIntro(html), html);
});
