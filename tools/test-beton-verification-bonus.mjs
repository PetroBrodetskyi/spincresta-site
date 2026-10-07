import fs from 'node:fs';
import assert from 'node:assert/strict';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BETON_VERIFICATION_COPY, plainText, updateBetonBonus } from './update-beton-verification-bonus.mjs';

for (const [locale, copy] of Object.entries(BETON_VERIFICATION_COPY)) for (const slug of ['beton', 'beton-sport']) {
  test(`${locale}/${slug}: 500 UAH document bonus, one-hour condition and matching FAQ`, () => {
    const prefix = locale === 'en' ? '' : `${locale}/`;
    const html = fs.readFileSync(new URL(`../${prefix}brands/${slug}/index.html`, import.meta.url), 'utf8');
    const row = [...html.matchAll(/<tr>[\s\S]*?<\/tr>/g)].find(match => match[0].includes('KYCAID'))[0];
    assert.ok(plainText(row).includes(copy.text));
    assert.ok(html.includes(`<h3>${copy.question}</h3><p>${copy.text}</p>`));
    assert.match(copy.text, /500/);
    assert.doesNotMatch(plainText(html), /\b250\s+(?:FS|free spins|Freispiele|giros|giri|spinów|фриспін|фріспін|обертань|jogadas|tours|स्पिन|ilmaiskierrosta)\b/iu);
    assert.doesNotMatch(html, /href=["']https?:\/\/(?:www\.)?beton\.ua/i);
    assert.doesNotMatch(html, /noindex|\uFFFD/);
    assert.ok(html.includes(`href="https://spincresta.com/${prefix}brands/${slug}/"`));
    const faqBody = html.match(/<div class="timeline">([\s\S]*?)<\/div>/)[1];
    const visible = [...faqBody.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map(match => [plainText(match[1]), plainText(match[2])]);
    const graph = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const structured = graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(question => [question.name, question.acceptedAnswer.text]);
    assert.equal(visible.length, 6);
    assert.deepEqual(structured, visible);
    assert.equal(graph.find(node => node['@type'] === 'WebPage').dateModified, '2026-10-07');
    assert.equal(updateBetonBonus(html, locale, slug), html, 'Updater must be repeatable');
    if (slug === 'beton') assert.ok(html.includes(`id="verification-bonus"><strong>${copy.title}</strong><span>${copy.text}</span>`));
  });
}

test('BetOn welcome packages, markets, payments and approved destinations remain separate and unchanged', () => {
  const casino = BRANDS.find(brand => brand.name === 'BetOn Casino');
  const sport = BRANDS.find(brand => brand.name === 'BetOn Sport');
  assert.equal(casino.bonus, 'For new players: 250,000 ₴ + 500 free spins');
  assert.equal(sport.bonus, 'Sports welcome package up to 200,000 ₴');
  for (const [brand, offer] of [[casino, '121024'], [sport, '121025']]) {
    assert.deepEqual(brand.countries, ['UA']);
    assert.equal(brand.urlCasino, `https://armadaapp.media-412.com/click?pid=3862&offer_id=${offer}`);
    assert.deepEqual(brand.payments, ['visa', 'mastercard', 'applepay', 'googlepay', 'banktransfer']);
  }
});
