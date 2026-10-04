import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { PINCO_COPY } from './pinco-review-copy.mjs';

const locales=['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const brand=BRANDS.find(item => item.name === 'Pinco');
assert.equal(brand.urlCasino,'https://armadaapp.media-412.com/click?pid=3862&offer_id=123113');
assert.equal(brand.bgColor,'#171213');
assert.equal(brand.image,'images/pinco.svg');
assert(fs.existsSync(brand.image));
assert.equal(brand.bonus,PINCO_COPY.en.headline);
assert.deepEqual(brand.countries,['RU','TR','KZ','AZ','KG','UZ','TJ','CA']);
assert.equal(brand.hasDetailPage,true);
assert(!brand.notRecommended && !brand.temporarilyUnavailable);
assert.deepEqual(brand.payments,['visa','mastercard','banktransfer','bitcoin','tether','ethereum','dogecoin','litecoin']);
assert.equal(BRAND_NEW_GAMES.pinco.length,6);
assert.equal(new Set(BRAND_NEW_GAMES.pinco.map(game => game.image)).size,6);
assert.equal(BRAND_SNAPSHOT_CONFIGS.pinco.tabs.length,3);
assert(BRAND_SNAPSHOT_CONFIGS.pinco.tabs[2].available.includes('American football'));
assert(BRAND_HOMEPAGE_SCREENSHOTS.pinco.includes('pinco-page_vdgrnp'));
const decode=value => value.replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const sitemap=fs.readFileSync('sitemap.xml','utf8');
let expectedSections;
for (const locale of locales) {
  const prefix=locale === 'en' ? '' : `${locale}/`;
  const file=`${prefix}brands/pinco/index.html`;
  const html=fs.readFileSync(file,'utf8');
  const c=PINCO_COPY[locale];
  const url=`https://spincresta.com/${prefix}brands/pinco/`;
  assert(html.includes(`<link rel="canonical" href="${url}"`),file);
  assert(html.includes('index, follow, max-image-preview:large'),file);
  assert(!/noindex|coming soon|Planbet|planbet|Sources Checked|\uFFFD|10,000|10\.000|C\$7,000|₽350,000|35x/i.test(html),file);
  assert.equal([...html.matchAll(/hreflang=/g)].length,11,file);
  assert.equal([...html.matchAll(/<h1>/g)].length,1,file);
  for (const table of html.matchAll(/<table>([\s\S]*?)<\/table>/g)) {
    const columns=[...table[1].matchAll(/<th scope="col">/g)].length;
    for (const row of table[1].matchAll(/<tr>((?:<td>[\s\S]*?<\/td>)+)<\/tr>/g)) assert.equal([...row[1].matchAll(/<td>/g)].length,columns,`${file}: table column mismatch`);
  }
  const sections=[...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map(match => match[1]);
  expectedSections ||= sections;
  assert.deepEqual(sections,expectedSections,`${file}: section parity`);
  for (const id of ['verdict','bonus','games','sports','payments','safety']) assert(sections.includes(`pinco-${id}`),file);
  assert(html.includes(esc(c.snapshot)),`${file}: public Snapshot introduction`);
  assert(!html.match(/<section class="container" id="pinco-payments">[\s\S]*?<\/section>/)[0].includes('class="section-intro"'),`${file}: removed payment introduction returned`);
  assert(/id="brand-payments"><\/div><\/div><\/section>/.test(html),`${file}: payment logos must remain without the removed paragraph`);
  assert.equal(BRAND_SNAPSHOT_CONFIGS.pinco.notes[locale],c.note);
  for (const phrase of ['support@pinco.win','responsiblegaming@pinco.win','OGL/2024/1516/0841','Carlitta N.V.','720','120','250','96','180','25']) assert(html.includes(phrase),`${file}: missing ${phrase}`);
  assert(/50x|x50/.test(html),`${file}: detailed wagering requirement missing`);
  const faqSection=html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq=[...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([,q,a]) => [decode(q),decode(a)]);
  assert.deepEqual(faq,c.faq,file);
  assert.equal(faq.length,8,file);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
  assert.deepEqual(graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(node => [node.name,node.acceptedAnswer.text]),faq,`${file}: FAQ/schema mismatch`);
  const article=graph.find(node => node['@type'] === 'Article');
  assert.equal(article.datePublished,'2026-05-03',file);
  assert.equal(article.dateModified,'2026-10-04',file);
  assert.equal(article.headline,c.title,file);
  assert.equal(graph.find(node => node['@type'] === 'WebPage').description,c.description,file);
  for (const href of [...html.matchAll(/<a[^>]*href="(https?:[^\"]+)"/g)].map(match => decode(match[1]))) {
    const allowed=[brand.urlCasino,'https://t.me/spincresta','https://x.com/SpinCresta'];
    assert(href.startsWith('https://spincresta.com/') || allowed.includes(href),`${file}: unexpected outbound link ${href}`);
  }
  const catalog=fs.readFileSync(`${prefix}casinos-and-betting/index.html`,'utf8');
  const row=catalog.match(/<article class="casino-list-row"[^>]*data-brand-slug="pinco">[\s\S]*?<\/article>/)?.[0];
  assert(row && row.includes(esc(c.headline)),`${file}: catalogue bonus`);
  assert.equal([...catalog.matchAll(/data-brand-slug="pinco"/g)].length,1);
  assert(sitemap.includes(`<loc>${url}</loc>`),file);
}
console.log('Pinco: all 10 indexed locale reviews, section parity, 8 matching FAQs, 6 new games, 3 Snapshot tabs, researched terms and 8 unchanged GEOs passed.');
function esc(value) { return String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;'); }
