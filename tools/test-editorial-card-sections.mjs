import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { editorialCardPages, syncEditorialCardSections } from './sync-editorial-card-sections.mjs';
import { TOP_CASINOS_PREVIEW_LIMIT } from '../scripts/pages/top-casinos.js';

const read = file => fs.readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');
const bands = html => [...html.matchAll(/<section\b[^>]*class="[^"]*\beditorial-card-band\b[^"]*"[^>]*data-editorial-columns="(\d+)"[^>]*>[\s\S]*?<\/section>/g)];

test('all localized editorial bands have accessible topic icons without decorative numbers', () => {
  const symbols = new Set([...read('icons/ui/review-method.svg').matchAll(/<symbol id="([^"]+)"/g)].map(match => match[1]));
  assert.equal(editorialCardPages().length, 40);
  for (const { page, file } of editorialCardPages()) {
    const html = read(file);
    const sections = bands(html);
    assert.equal(sections.length, page === 'top-casinos' ? 2 : 1, file);
    assert.equal(syncEditorialCardSections(html, page), html, file);
    for (const [section, columns] of sections) {
      const icons = [...section.matchAll(/<svg class="home-method-icon"[^>]*aria-hidden="true"[^>]*focusable="false"><use href="[^"]+#([^"]+)"/g)];
      assert.equal(icons.length, Number(columns), file);
      assert.ok(icons.every(match => symbols.has(match[1])), file);
      assert.equal([...section.matchAll(/<h3>/g)].length, Number(columns), file);
      assert.equal([...section.matchAll(/<div\b/g)].length, [...section.matchAll(/<\/div>/g)].length, file);
      const numbers = [...section.matchAll(/<span(?: class="editorial-card-step")?>(\d{2})<\/span>/g)].map(match => match[1]);
      assert.deepEqual(numbers, [], file);
    }
  }
});

test('listing conversion leaves existing content and FAQ markup intact', () => {
  const cards = ['Gift', 'Card', 'Phone', 'Shield', 'Review'].map(name =>
    `<div><h3>${name}</h3><p><a href="#details">${name} details</a></p></div>`
  ).join('');
  const faq = '<section class="content"><div class="faq-grid"><h3>FAQ</h3></div></section>';
  // This legacy listing has a missing wrapper close, as some translations did.
  const html = `<section class="content"><div class="container content-article"><h2 class="title">Checks</h2><div class="timeline">${cards}</div></section>${faq}`;
  const result = syncEditorialCardSections(html, 'new-casinos');
  assert.ok(result.endsWith(faq));
  assert.match(result, /aria-labelledby="editorial-cards-title".*data-editorial-columns="5"/);
  assert.equal(result.split('href="#details"').length - 1, 5);
  assert.equal(bands(result).length, 1);
  assert.equal([...bands(result)[0][0].matchAll(/<div\b/g)].length, [...bands(result)[0][0].matchAll(/<\/div>/g)].length);
  assert.equal(syncEditorialCardSections(result, 'new-casinos'), result);
});

test('Top Casinos uses one five-brand preview limit and localized reading-guide cards', () => {
  assert.equal(TOP_CASINOS_PREVIEW_LIMIT, 5);
  for (const { file } of editorialCardPages().filter(({ page }) => page === 'top-casinos')) {
    const html = read(file);
    const guide = bands(html).find(([section]) => section.includes('id="seo-editorial-guide"'));
    assert.equal(guide[1], '3', file);
    assert.match(guide[0], /aria-labelledby="reading-guide-title"/, file);
    assert.equal([...guide[0].matchAll(/<p>/g)].length, 3, file);
    assert.doesNotMatch(html, /\bdata-limit=/, file);
  }
});
