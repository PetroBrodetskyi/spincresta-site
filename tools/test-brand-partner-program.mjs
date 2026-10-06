import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { resolveBrandPartnerProgram, matchesBrandBestForTitle } from '../scripts/pages/brand-layout.js';

test('Mostbet referral destination comes from the brand registry', () => {
  const mostbet = BRANDS.find(brand => brand.name === 'Mostbet');
  assert.deepEqual(resolveBrandPartnerProgram(mostbet), {
    name: 'Mostbet Partners',
    url: 'https://mbp-aff.com/register/referral/480533',
  });
  assert.equal(mostbet.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124843');
});
test('brands without a partner program safely resolve no link', () => {
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
    assert(section.includes('<div data-partner-program-link>Mostbet Partners</div>'), locale);
    assert(/data-brand-partner-program><strong>[^<]+<\/strong><span>[^<]+<\/span><div data-partner-program-link>/.test(section), `${locale}: localized heading, description and link must be in that order`);
    assert(!html.includes('mbp-aff.com') && !html.includes('480533'), `${locale}: referral URL must not be duplicated in HTML`);
    assert(html.includes('/scripts/main.js?v=20261006-mostbet-partners-3'), locale);
    assert(html.includes('/styles.css?v=20261006-feature-card-links-3'), locale);
    const bestFor = html.match(/<section class="container" id="best-for">[\s\S]*?<\/section>/)?.[0];
    assert(bestFor, `${locale}: audience section must have a stable sidebar ID`);
    const heading = bestFor.match(/<h2[^>]*>(.*?)<\/h2>/)?.[1];
    assert(matchesBrandBestForTitle(heading), `${locale}: title-based fallback must also recognize the audience section`);
    assert(!/Referral link|Empfehlungslink|Enlace de referido|Link di referral|Link polecający|Реферальне посилання|Ligação de referência|Lien de parrainage|रेफ़रल लिंक|Suosittelulinkki/i.test(section), locale);
    assert(!/noindex|\uFFFD/i.test(html), locale);
  }
});
test('legacy Ukrainian, Italian and French audience headings are recognized without ASCII-only boundaries', () => {
  for (const title of ['Кому підходить казино?', 'Кому підійде це казино?', 'Найкраще підходить для', 'Per chi è meglio Mostbet?', 'À qui s’adresse le Mostbet ?', 'À qui convient ce casino ?']) {
    assert(matchesBrandBestForTitle(title), title);
  }
  for (const title of ['', undefined, 'Mostbet FAQ', 'Payments, Withdrawals & Verification', 'Responsible Gambling']) {
    assert.equal(matchesBrandBestForTitle(title), false, title);
  }
});
test('Mostbet English copy and its generator use the American English program spelling', () => {
  const html = fs.readFileSync('brands/mostbet/index.html', 'utf8');
  assert(html.includes('<strong>Affiliate Program</strong>'));
  assert(html.includes('<strong>Loyalty Program</strong>'));
  assert(html.includes('the brand’s affiliate program,'));
  assert(!/\bprogrammes?\b/i.test(html));
  const generator = fs.readFileSync('tools/update-mostbet-partner-section.mjs', 'utf8');
  const englishCopy = generator.match(/\ben: \{([\s\S]*?)\n  \},\n  de:/)?.[1];
  assert(englishCopy);
  assert(!/\bprogrammes?\b/i.test(englishCopy));
  assert(generator.includes("partnerTitle: 'Programme d’affiliation'"), 'French wording must stay unchanged');
});
test('the partner link below the description uses the site accent without an underline', () => {
  const css = fs.readFileSync('styles/core.css', 'utf8');
  assert(/\.feature-card \[data-partner-program-link\] a:visited\s*\{[^}]*text-decoration:\s*none/.test(css));
  assert(/\.feature-card \[data-partner-program-link\] a:visited\s*\{[^}]*color:\s*var\(--section-accent\)/.test(css));
});
test('shared rendering marks the link sponsored and replaces its container instead of duplicating it', () => {
  const source = fs.readFileSync('scripts/pages/brand-layout.js', 'utf8');
  assert(source.includes("link.rel = 'noopener noreferrer nofollow sponsored'"));
  assert(source.includes('linkContainer.replaceChildren(link)'));
  assert(source.includes('initBrandPartnerProgram();'));
  assert(!source.includes('mbp-aff.com') && !source.includes('480533'));
});
