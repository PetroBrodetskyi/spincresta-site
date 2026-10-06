import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { resolveBrandPartnerProgram } from '../scripts/pages/brand-layout.js';

test('Mostbet referral destination comes from the brand registry', () => {
  const mostbet = BRANDS.find(brand => brand.name === 'Mostbet');
  assert.deepEqual(resolveBrandPartnerProgram(mostbet), {
    name: 'Mostbet Partners',
    url: 'https://mbp-aff.com/register/referral/480533',
  });
  assert.equal(mostbet.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124843');
});
test('brands without a partner programme safely resolve no link', () => {
  assert.equal(resolveBrandPartnerProgram(undefined), null);
  assert.equal(resolveBrandPartnerProgram({ name: 'Other Brand' }), null);
  assert.equal(resolveBrandPartnerProgram(BRANDS.find(brand => brand.name === 'Gravira')), null);
});
test('the optional configuration works for other brands without Mostbet-specific logic', () => {
  assert.deepEqual(resolveBrandPartnerProgram({ partnerProgram: { name: ' Example Partners ', url: 'https://partners.example/register/referral/123' } }), {
    name: 'Example Partners', url: 'https://partners.example/register/referral/123',
  });
});
test('unsafe, insecure, malformed or credential-bearing URLs are not rendered', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,test', 'http://partners.example/', '/relative-url', 'not a url', 'https://user:password@partners.example/']) {
    assert.equal(resolveBrandPartnerProgram({ partnerProgram: { name: 'Partners', url } }), null, url);
  }
  for (const partnerProgram of [{ name: '', url: 'https://partners.example/' }, { name: 'Partners' }, { name: 'Partners', url: {} }]) {
    assert.equal(resolveBrandPartnerProgram({ partnerProgram }), null);
  }
});
test('all 10 Mostbet reviews have one localized placement inside the existing account-features grid', () => {
  for (const locale of ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi']) {
    const html = fs.readFileSync(`${locale === 'en' ? '' : `${locale}/`}brands/mostbet/index.html`, 'utf8');
    const section = html.match(/<section class="container" id="mostbet-account-features">[\s\S]*?<\/section>/)?.[0];
    assert(section, locale);
    assert.equal([...html.matchAll(/data-brand-partner-program/g)].length, 1, locale);
    assert.equal([...section.matchAll(/class="feature-card glass-card"/g)].length, 5, locale);
    assert(section.includes('<strong data-partner-program-name>Mostbet Partners</strong>'), locale);
    assert(!html.includes('mbp-aff.com') && !html.includes('480533'), `${locale}: referral URL must not be duplicated in HTML`);
    assert(html.includes('/scripts/main.js?v=20261006-mostbet-partners-1'), locale);
    assert(html.includes('/styles.css?v=20261006-feature-card-links-1'), locale);
    assert(!/noindex|\uFFFD/i.test(html), locale);
  }
});
test('shared rendering marks the link sponsored and replaces its heading instead of duplicating it', () => {
  const source = fs.readFileSync('scripts/pages/brand-layout.js', 'utf8');
  assert(source.includes("link.rel = 'noopener noreferrer nofollow sponsored'"));
  assert(source.includes('heading.replaceChildren(link)'));
  assert(source.includes('initBrandPartnerProgram();'));
  assert(!source.includes('mbp-aff.com') && !source.includes('480533'));
});
