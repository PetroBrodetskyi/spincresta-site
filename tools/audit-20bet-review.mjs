import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { BET20_COPY } from './20bet-review-copy.mjs';

const locales=['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const brand=BRANDS.find(item => item.name === '20Bet');
assert.equal(brand.urlCasino,'https://armadaapp.media-412.com/click?pid=3862&offer_id=127265');
assert.equal(brand.bgColor,'#0D1D34');
assert.equal(brand.image,'images/20bet.webp');
assert(fs.existsSync(brand.image));
assert.equal(brand.bonus,BET20_COPY.en.headline);
assert.equal(brand.countries.length,49);
assert.equal(new Set(brand.countries).size,49);
for (const code of ['AU','BE','EE','FR','IS','LV','LT','LU','NL','RU','TR','UG','UA','UK','US']) assert(!brand.countries.includes(code),`Restricted country ${code}`);
assert(brand.countries.includes('JP'));
for (const locale of locales) assert(brand.bonusByCountry.JP[locale]);
assert.equal(brand.hasDetailPage,true);
assert(!brand.notRecommended && !brand.temporarilyUnavailable);
assert.deepEqual(brand.payments,['visa','mastercard','skrill','neteller','webmoney','ecopayz','banktransfer']);
for (const method of brand.payments) assert(fs.existsSync(`icons/payments/${method}.svg`));
assert.equal(BRAND_NEW_GAMES['20bet'].length,6);
assert.equal(new Set(BRAND_NEW_GAMES['20bet'].map(game => game.image)).size,6);
assert.equal(BRAND_SNAPSHOT_CONFIGS['20bet'].tabs.length,3);
assert(BRAND_SNAPSHOT_CONFIGS['20bet'].tabs[2].available.includes('American football'));
assert(BRAND_HOMEPAGE_SCREENSHOTS['20bet'].includes('20bet-page_cizpsd'));
const decode=value => value.replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const sitemap=fs.readFileSync('sitemap.xml','utf8');
let expectedSections;
for (const locale of locales) {
  const prefix=locale === 'en' ? '' : `${locale}/`;
  const file=`${prefix}brands/20bet/index.html`;
  const html=fs.readFileSync(file,'utf8');
  const c=BET20_COPY[locale];
  const url=`https://spincresta.com/${prefix}brands/20bet/`;
  assert(html.includes(`<link rel="canonical" href="${url}"`),file);
  assert(html.includes('index, follow, max-image-preview:large'),file);
  assert(!/noindex|coming soon|Pinco|pinco|Planbet|planbet|Sources Checked|\uFFFD|Carlitta|50x|docs.google|advertiser/i.test(html),file);
  assert.equal([...html.matchAll(/hreflang=/g)].length,11,file);
  assert.equal([...html.matchAll(/<h1>/g)].length,1,file);
  for (const table of html.matchAll(/<table>([\s\S]*?)<\/table>/g)) {
    const columns=[...table[1].matchAll(/<th scope="col">/g)].length;
    for (const row of table[1].matchAll(/<tr>((?:<td>[\s\S]*?<\/td>)+)<\/tr>/g)) assert.equal([...row[1].matchAll(/<td>/g)].length,columns,`${file}: table column mismatch`);
  }
  const sections=[...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map(match => match[1]);
  expectedSections ||= sections;
  assert.deepEqual(sections,expectedSections,`${file}: section parity`);
  for (const id of ['verdict','bonus','games','sports','payments','safety']) assert(sections.includes(`20bet-${id}`),file);
  assert(html.includes(esc(c.snapshot)),`${file}: public Snapshot introduction`);
  assert(!html.match(/<section class="container" id="20bet-payments">[\s\S]*?<\/section>/)[0].includes('class="section-intro"'),`${file}: removed payment introduction returned`);
  assert(/id="brand-payments"><\/div><\/div><\/section>/.test(html),`${file}: payment logos must remain without the removed paragraph`);
  assert.equal(BRAND_SNAPSHOT_CONFIGS['20bet'].notes[locale],c.note);
  for (const phrase of ['support@20bet.com','OGL/2024/590/0758','TechSolutions Group N.V.','144920','120','180','500','90','24']) assert(html.includes(phrase),`${file}: missing ${phrase}`);
  assert(/40x|x40/.test(html),`${file}: detailed wagering requirement missing`);
  const faqSection=html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq=[...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([,q,a]) => [decode(q),decode(a)]);
  assert.deepEqual(faq,c.faq,file);
  assert.equal(faq.length,8,file);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
  assert.deepEqual(graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(node => [node.name,node.acceptedAnswer.text]),faq,`${file}: FAQ/schema mismatch`);
  const article=graph.find(node => node['@type'] === 'Article');
  assert.equal(article.datePublished,'2026-10-04',file);
  assert.equal(article.dateModified,'2026-10-04',file);
  assert.equal(article.headline,c.title,file);
  assert.equal(graph.find(node => node['@type'] === 'WebPage').description,c.description,file);
  for (const href of [...html.matchAll(/<a[^>]*href="(https?:[^\"]+)"/g)].map(match => decode(match[1]))) {
    const allowed=[brand.urlCasino,'https://t.me/spincresta','https://x.com/SpinCresta'];
    assert(href.startsWith('https://spincresta.com/') || allowed.includes(href),`${file}: unexpected outbound link ${href}`);
  }
  const catalog=fs.readFileSync(`${prefix}casinos-and-betting/index.html`,'utf8');
  const row=catalog.match(/<article class="casino-list-row"[^>]*data-brand-slug="20bet">[\s\S]*?<\/article>/)?.[0];
  assert(row && row.includes(esc(c.headline)),`${file}: catalogue bonus`);
  assert.equal([...catalog.matchAll(/data-brand-slug="20bet"/g)].length,1);
  assert(sitemap.includes(`<loc>${url}</loc>`),file);
}
console.log('20Bet: 10 indexable locale reviews, section parity, 8 matching FAQs, 6 new games, 3 Snapshot tabs, 49 GEOs and Japan bonus exclusions passed.');
function esc(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'); }
