import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { COUNTRIES } from '../scripts/countries.js';
import { HOME_LABELS, polishHomepageLabels } from './polish-homepage-labels.mjs';

const root = new URL('../', import.meta.url);
const attributes = html => [...html.matchAll(/\b(?:href|src|id|aria-label|aria-labelledby)="[^"]*"/g)].map(match => match[0]);

for (const [locale, copy] of Object.entries(HOME_LABELS)) {
  test(`${locale}: homepage uses direct headings without redundant eyebrows`, () => {
    const html = fs.readFileSync(new URL(locale === 'en' ? 'index.html' : `${locale}/index.html`, root), 'utf8');
    assert.equal(polishHomepageLabels(html, locale), html, 'published HTML matches the reviewed source');
    assert(!html.includes('class="home-section-kicker"'));
    for (const text of copy.slice(1)) assert(html.includes(`>${text}<`), `missing reviewed label: ${text}`);
    for (const id of ['recommended-brands', 'new-reviews-title', 'new-games-title', 'editorial-method-title']) {
      assert.equal([...html.matchAll(new RegExp(`id="${id}"`, 'g'))].length, 1);
    }

    const fixture = html.replace('<h2 id="new-reviews-title">', '<span class="home-section-kicker">RECENTLY ADDED TO SPINCRESTA</span><h2 id="new-reviews-title">');
    const polished = polishHomepageLabels(fixture, locale);
    assert(!polished.includes('class="home-section-kicker"'));
    assert.deepEqual(attributes(polished), attributes(fixture), 'links, assets and anchors stay intact');
    assert.equal(polished.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0], fixture.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/)[0]);
    assert.equal(polishHomepageLabels(polished, locale), polished, 'the copy pass is idempotent');
  });

  test(`${locale}: the homepage country cloud replaces the video and exposes localized links without JS`, () => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const html = fs.readFileSync(new URL(`${prefix}index.html`, root), 'utf8');
    const hero = html.match(/<section class="home-country-hero container"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(hero, 'homepage country hero is present');
    assert.match(hero, /<h1 id="home-country-title">[^<]+<\/h1>/);
    assert.match(hero, /<nav class="home-country-directory" aria-label="[^"]+">/);
    assert.equal([...html.matchAll(/class="countries-cloud"/g)].length, 1, 'country links are not duplicated at the bottom');
    assert.doesNotMatch(html, /home-video-hero|home-hero_d0lzo1/);
    assert.doesNotMatch(hero, /href="#recommended-brands"/);
    assert.ok(hero.includes(`href="/${prefix}top-casinos/"`), 'rankings link remains available');
    assert.doesNotMatch(html, /home-casino-gallery|casino-gallery-title/);
    assert.doesNotMatch(html, /class="home-stats"|id="site(?:Country|Brand)Count"/);
    assert.match(html, /<\/nav>\s*<\/section>\s*<div class="content-area container">\s*<section class="home-showcase-section home-recommendations" id="recommended-brands" aria-label="[^"]+">\s*<div class="casino-grid home-featured-casino-grid home-recommendation-grid">/);
    assert.ok(html.includes(`id="recommended-brands" aria-label="${copy[0]}"`));
    const hrefs = [...hero.matchAll(/class="country-link" href="([^"]+)"/g)].map(([, href]) => href);
    assert.deepEqual(hrefs, COUNTRIES.map(country => `/${prefix}online-casinos/${country.slug}/`));
    for (const href of hrefs) assert.ok(fs.existsSync(new URL(`.${href}index.html`, root)), href);
  });
}

test('homepage copy pass cannot edit other pages or unknown locales', () => {
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  assert.throws(() => polishHomepageLabels(html, 'unknown'), /Unsupported/);
  assert.throws(() => polishHomepageLabels(html.replace('class="home-page"', 'class="home-page" data-page="about"'), 'en'), /Expected the homepage/);
});

test('homepage copy pass removes the old stats block after regeneration', () => {
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  const fixture = html.replace('      <div class="content-area container">\n',
    '      <div class="content-area container">\n        <section class="home-stats" aria-label="Coverage"><span id="siteCountryCount">0</span></section>\n\n');
  assert.notEqual(fixture, html);
  assert.equal(polishHomepageLabels(fixture, 'en'), html);
});

test('homepage copy pass removes the recommendation introduction without touching the cards or other headings', () => {
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  const fixture = html.replace('id="recommended-brands" aria-label="Casino recommendations">\n',
    'id="recommended-brands">\n          <div class="home-showcase-heading"><div><h2>Compare online casinos</h2></div><p>Legacy introduction.</p></div>\n\n');
  assert.notEqual(fixture, html);
  assert.equal(polishHomepageLabels(fixture, 'en'), html);
});

test('homepage copy pass removes the redundant recommendation shortcut but keeps the rankings link', () => {
  const html = fs.readFileSync(new URL('index.html', root), 'utf8');
  const fixture = html.replace('<div class="home-country-hero-actions">\n',
    '<div class="home-country-hero-actions">\n            <a class="home-primary-action" href="#recommended-brands">Explore our recommendations</a>\n');
  assert.notEqual(fixture, html);
  assert.equal(polishHomepageLabels(fixture, 'en'), html);
});
