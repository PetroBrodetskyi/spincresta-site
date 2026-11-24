import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { documentedReviewProviderKeys, getReviewProviders } from '../scripts/brand-review-providers.js';
import { providerLogoPath } from '../scripts/provider-logo-library.js';
import { insertBrandProviderSection, isPublishedBrandReview } from '../scripts/pages/brand-provider-strip.js';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const brand = slug => BRANDS.find(entry => entry.urlDetail === `brands/${slug}.html`);

test('each documented provider list belongs to a published review and uses only existing logos', () => {
  for (const slug of documentedReviewProviderKeys) {
    assert.ok(isPublishedBrandReview(brand(slug)), slug);
    for (const [name, logo] of getReviewProviders(slug)) {
      assert.ok(name, slug);
      if (!logo) continue;
      const path = providerLogoPath(logo);
      if (path.endsWith('.png')) {
        assert.equal(readFileSync(new URL(`..${path}`, import.meta.url)).subarray(0, 8).toString('hex'), '89504e470d0a1a0a', logo);
      } else {
        assert.match(read(path.slice(1)), /<svg\b/, logo);
      }
    }
  }
  assert.ok(getReviewProviders('kingmaker').length > 10);
  assert.ok(getReviewProviders('betrepublic').length > 10);
  assert.deepEqual(getReviewProviders('does-not-exist'), []);
});

test('all localized reviews serve original local logos without placeholder cards', () => {
  for (const [slug, count] of Object.entries({ jackspay: 5, duckyluck: 10, slotsandcasino: 11 })) {
    const providers = getReviewProviders(slug);
    assert.equal(providers.length, count, slug);
    assert.ok(providers.every(([, id]) => id && providerLogoPath(id)), slug);
    for (const prefix of ['', 'de/', 'es/', 'fi/', 'fr/', 'hi/', 'it/', 'pl/', 'pt/', 'uk/']) {
      const route = `${prefix}brands/${slug}/index.html`;
      const strip = read(route).match(/<ul[^>]*class="review-provider-strip"[^>]*>([\s\S]*?)<\/ul>/)?.[1];
      assert.ok(strip, route);
      assert.deepEqual([...strip.matchAll(/<img src="([^"]+)"/g)].map(match => match[1]), providers.map(([, id]) => providerLogoPath(id)), route);
      assert.doesNotMatch(strip, /#layers|https?:/);
    }
  }
});

test('reviewed brands receive a local strip or an honest empty state; placeholders receive neither', () => {
  const english = (...args) => args[0];
  const template = () => {
    let markup = '';
    return {
      querySelector: () => markup || null,
      insertAdjacentHTML: (_, html) => { markup += html; },
      render: () => markup,
    };
  };
  const article = template();
  const testBrand = brand('betonwin');
  insertBrandProviderSection({ article, brand: testBrand, localeText: english });
  const strip = article.render();
  assert.match(strip, /#layers/);
  assert.match(strip, /pragmatic-play\.svg/);
  assert.match(strip, /data-strip-next/);
  assert.doesNotMatch(strip, /126 entries|https?:/);
  insertBrandProviderSection({ article, brand: testBrand, localeText: english });
  assert.equal(article.render(), strip);

  const noEvidence = template();
  insertBrandProviderSection({ article: noEvidence, brand: brand('fortunica-uk'), localeText: english });
  assert.match(noEvidence.render(), /haven’t confirmed a list/);
  assert.doesNotMatch(noEvidence.render(), /<ul|data-strip-next/);

  const unpublished = template();
  insertBrandProviderSection({ article: unpublished, brand: { ...testBrand, reviewComingSoon: true }, localeText: english });
  assert.equal(unpublished.render(), '');
});

test('review pages have content roots for the shared component and snapshot headings use site icons', () => {
  for (const { urlDetail } of BRANDS.filter(isPublishedBrandReview)) {
    const file = urlDetail.replace(/\.html$/, '/index.html');
    if (existsSync(new URL(`../${file}`, import.meta.url))) {
      assert.match(read(file), /class="[^"]*content-(?:review|article)\b/, file);
    }
  }
  assert.match(read('scripts/site-icons.js'), /\['\.brand-availability-widget > h2', 'games'\]/);
  assert.match(read('styles/section-contrast-preview.css'), /\.review-provider-strip > li\s*\{[^}]*flex: 0 0 106px/);
  assert.match(read('styles/section-contrast-preview.css'), /\.review-provider-logo\s*\{[^}]*background: #000;/);
});
