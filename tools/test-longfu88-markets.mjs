import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { escapeReview as esc } from './brand-review-template.mjs';

const read = path => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');
const brand = BRANDS.find(entry => entry.urlDetail === 'brands/longfu88.html');
const oldMarket = /(?<![\p{L}\p{N}])(?:MYR|MY|FPX)(?![\p{L}\p{N}])|DuitNow|Touch 'n Go|Malaysi|Malasia|Malásia|Malaisie|Malesi|Malezj|Малайз|मलेश|ringgit/iu;

test('Longfu88 supports only the four approved markets and keeps its affiliate destination', () => {
  assert.deepEqual(brand.countries, ['SG', 'ID', 'VN', 'TH']);
  assert.ok(!brand.top?.includes('MY'));
  assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124107');
});

for (const prefix of ['', 'de/', 'es/', 'fi/', 'fr/', 'hi/', 'it/', 'pl/', 'pt/', 'uk/']) {
  test(`${prefix || 'en'}: Longfu88 market references agree across the review, catalog, and country ranking`, () => {
    const route = `${prefix}brands/longfu88/`;
    const html = read(route + 'index.html');
    assert.doesNotMatch(html, oldMarket);
    assert.ok(html.includes(esc(brand.urlCasino)));
    const comparison = [...html.matchAll(/<section\b[^>]*data-review-section="summary"[^>]*>[\s\S]*?<\/section>/g)][1]?.[0];
    assert.ok(comparison);
    assert.equal([...comparison.matchAll(/<tr><td>/g)].length, 4);
    for (const code of ['SGD', 'IDR', 'VND', 'THB']) {
      const hindi = { SGD: 'एसजीडी', IDR: 'आईडीआर', VND: 'वीएनडी' };
      const alias = prefix === 'hi/' && hindi[code] ? '|' + hindi[code] : '';
      assert.match(comparison, new RegExp(`\\b${code}\\b${alias}`), code);
    }
    const json = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    for (const faq of json['@graph'].find(node => node['@type'] === 'FAQPage').mainEntity.filter((_, i) => [0, 3].includes(i))) {
      assert.ok(html.includes(`<p>${esc(faq.acceptedAnswer.text)}</p>`));
    }
    const list = read(prefix + 'casinos-and-betting/index.html');
    const card = [...list.matchAll(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)]
      .find(([row]) => row.includes(`href="/${route}"`))?.[0];
    assert.ok(card);
    assert.doesNotMatch(card, oldMarket);
    assert.ok(!read(prefix + 'online-casinos/malaysia/index.html').includes(`href="/${route}"`));
    for (const country of ['singapore', 'indonesia', 'vietnam', 'thailand']) {
      assert.ok(read(prefix + 'online-casinos/' + country + '/index.html').includes(`href="/${route}"`), country);
    }
  });
}
