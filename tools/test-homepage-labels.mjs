import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { HOME_LABELS, polishHomepageLabels } from './polish-homepage-labels.mjs';

const root = new URL('../', import.meta.url);
const attributes = html => [...html.matchAll(/\b(?:href|src|id|aria-labelledby)="[^"]*"/g)].map(match => match[0]);

for (const [locale, copy] of Object.entries(HOME_LABELS)) {
  test(`${locale}: homepage uses direct headings without redundant eyebrows`, () => {
    const html = fs.readFileSync(new URL(locale === 'en' ? 'index.html' : `${locale}/index.html`, root), 'utf8');
    assert.equal(polishHomepageLabels(html, locale), html, 'published HTML matches the reviewed source');
    assert(!html.includes('class="home-section-kicker"'));
    for (const text of copy) assert(html.includes(`>${text}<`), `missing reviewed label: ${text}`);
    for (const id of ['recommended-brands', 'new-reviews-title', 'casino-gallery-title', 'new-games-title', 'editorial-method-title', 'siteCountryCount', 'siteBrandCount']) {
      assert.equal([...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length, 1);
    }

    const fixture = html.replace('<div class="home-insight-head">', '<div class="home-insight-head">\n<span class="home-section-kicker">EXPLORE SPINCRESTA</span>')
      .replace('<h2 id="new-reviews-title">', '<span class="home-section-kicker">RECENTLY ADDED TO SPINCRESTA</span><h2 id="new-reviews-title">');
    const polished = polishHomepageLabels(fixture, locale);
    assert(!polished.includes('class="home-section-kicker"'));
    assert.deepEqual(attributes(polished), attributes(fixture), 'links, assets and anchors stay intact');
    assert.equal(polished.match(/<h1>[\s\S]*?<\/h1>/)[0], fixture.match(/<h1>[\s\S]*?<\/h1>/)[0]);
    assert.equal(polishHomepageLabels(polished, locale), polished, 'the copy pass is idempotent');
  });
}

test('homepage copy pass cannot edit other pages or unknown locales', () => {
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  assert.throws(() => polishHomepageLabels(html, 'unknown'), /Unsupported/);
  assert.throws(() => polishHomepageLabels(html.replace('class="home-page"', 'class="home-page" data-page="about"'), 'en'), /Expected the homepage/);
});

test('homepage counter labels use normal case and readable body-sized type', () => {
  const css = fs.readFileSync(new URL('styles/pages.css', root), 'utf8');
  const rule = css.match(/body\.home-page \.hero\.home-video-hero \+ \.content-area \.home-stat-tile strong\s*\{([^}]+)\}/)[1];
  assert.match(rule, /text-transform:\s*none;/);
  assert.match(rule, /letter-spacing:\s*normal;/);
  assert.match(rule, /font-size:\s*14px;/);
  assert.match(rule, /font-weight:\s*500;/);
});
