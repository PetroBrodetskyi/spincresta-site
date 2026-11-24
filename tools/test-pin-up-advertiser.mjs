import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {BRANDS} from '../scripts/brands.js';
import {PINUP_COPY, PINUP_FREEBET_CAPS} from './pin-up-advertiser-copy.mjs';
import {plain, updatePinUpReview, updatePinUpCatalog} from './update-pin-up-advertiser.mjs';
import {syncDefaultTheme} from './sync-default-theme.mjs';
import {syncCountryHeader} from './sync-country-header.mjs';
import {parseBrandDetailSource, planBrandDetailSections, syncBrandDetailSections} from './sync-brand-review-details.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const brand=BRANDS.find(b=>b.name==='Pin-Up');
const sectionSource=parseBrandDetailSource(read('brands/pin-up/index.html'));
test('approved 17 markets, destination and logo retained',()=>{
  assert.equal(brand.countries.length,17);assert.equal(new Set(brand.countries).size,17);
  for(const code of ['TJ','KG','NG','CD'])assert.ok(brand.countries.includes(code));
  assert.ok(!brand.countries.includes('CG'));
  assert.equal(brand.urlCasino,'https://offers-armada.com/click?pid=2&offer_id=257');
  assert.equal(createHash('sha1').update(fs.readFileSync(new URL('../images/pin-up.webp',import.meta.url))).digest('hex'),'50e6b7fff15c6fc80c128c8508078a9dfedce2f7');
});
for(const [locale,c] of Object.entries(PINUP_COPY)){
  const prefix=locale==='en'?'':locale+'/';const html=read(prefix+'brands/pin-up/index.html');
  test(locale+': slot count, separate regional caps and all free bets',()=>{
    assert.ok(plain(html).includes(c.slots));assert.ok(plain(html).includes(c.sports));
    assert.doesNotMatch(html,/10[ ,.\u00a0]?000\s*AZN/);
    const sports=html.match(/<section class="container" id="pinup-sports-betting" data-brand-rail="betting"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    assert.ok(sports);
    for(const cap of PINUP_FREEBET_CAPS)assert.ok(plain(sports).includes(c.freeBet.replace('{cap}',cap)),cap);
    assert.match(sports,/8,000 AZN/);assert.ok(plain(html).includes('17'));
    assert.equal([...sports.matchAll(/class="feature-card glass-card"/g)].length,10);
    assert.doesNotMatch(html,/docs\.google\.com|Yelyzaveta|doco\.|noindex|\uFFFD/);
    const external=[...html.matchAll(/href="(https?:[^"\s]+)"/g)].map(m=>m[1]);
    assert.ok(external.every(u=>u.startsWith('https://spincresta.com/')||u===brand.urlCasino||u==='https://t.me/spincresta'||u==='https://x.com/SpinCresta'));
  });
  test(locale+': visible FAQ and schema match, updater is repeatable',()=>{
    const json=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const faq=html.match(/<div class="timeline">([\s\S]*?)<\/div>/)[1];
    const visible=[...faq.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map(m=>[plain(m[1]),plain(m[2])]);
    assert.equal(visible.length,8);assert.deepEqual(json['@graph'].find(n=>n['@type']==='FAQPage').mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),visible);
    assert.equal(json['@graph'].find(n=>n['@type']==='WebPage').dateModified,'2026-11-17');
    assert.equal(updatePinUpReview(html,locale),html);
    const catalog=read(prefix+'casinos-and-betting/index.html');assert.equal(updatePinUpCatalog(catalog,locale),catalog);
    assert.ok(catalog.includes(c.short.replaceAll('&','&amp;')));
    assert.match(html,/name="robots" content="index, follow"/);
  });
  test(locale+': regeneration from the previous page preserves all bonus rows',()=>{
    const previous=execFileSync('git',['show',`HEAD:${prefix}brands/pin-up/index.html`],{maxBuffer:1000000}).toString();
    const regenerated=syncCountryHeader(syncDefaultTheme(updatePinUpReview(previous,locale)),'/'+prefix);
    const fresh=syncBrandDetailSections(regenerated,sectionSource,planBrandDetailSections(sectionSource));
    assert.equal(fresh,html);
    assert.equal((fresh.match(/<table>/g)||[]).length,4);
    assert.match(fresh,/class="pinup-sports-coverage"/);
  });
}
