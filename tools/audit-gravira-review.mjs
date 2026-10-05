import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { GRAVIRA_COPY } from './gravira-review-copy.mjs';

const locales=['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const brand=BRANDS.find(item => item.name === 'Gravira');
assert.equal(brand.urlCasino,'https://armadaapp.media-412.com/click?pid=3862&offer_id=126829');
assert.equal(brand.bgColor,'#0F1437');
assert.equal(brand.image,'images/gravira.svg');
assert(fs.existsSync(brand.image));
assert.equal(brand.bonus,GRAVIRA_COPY.en.headline);
assert.deepEqual(brand.countries,['CA']);
assert.equal(brand.hasDetailPage,true);
assert(!brand.notRecommended && !brand.temporarilyUnavailable);
assert.deepEqual(brand.payments,['interac','visa','mastercard','applepay','googlepay','tether','usdc','solana','bitcoin','bitcoincash','litecoin','tron']);
for (const method of brand.payments) assert(fs.existsSync(`icons/payments/${method}.svg`),method);
assert.equal(BRAND_NEW_GAMES.gravira.length,6);
assert.equal(new Set(BRAND_NEW_GAMES.gravira.map(game => game.image)).size,6);
const snapshot=BRAND_SNAPSHOT_CONFIGS.gravira;
assert.equal(snapshot.tabs.length,2);
assert.deepEqual(snapshot.tabs.map(tab => tab.label),['Games','Live games']);
assert.equal(snapshot.tabs[0].available.length,10);
assert.equal(snapshot.tabs[1].available.length,6);
assert(BRAND_HOMEPAGE_SCREENSHOTS.gravira.includes('gravira-page_duucwo'));
const esc=value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const decode=value => value.replaceAll('&quot;','"').replaceAll('&lt;','<').replaceAll('&gt;','>').replaceAll('&amp;','&');
const sitemap=fs.readFileSync('sitemap.xml','utf8');
let expectedSections;
for (const locale of locales) {
  const prefix=locale === 'en' ? '' : `${locale}/`;
  const file=`${prefix}brands/gravira/index.html`;
  const html=fs.readFileSync(file,'utf8');
  const c=GRAVIRA_COPY[locale];
  const url=`https://spincresta.com/${prefix}brands/gravira/`;
  assert(html.includes(`<link rel="canonical" href="${url}"`),file);
  assert(html.includes('index, follow, max-image-preview:large'),file);
  assert(!/noindex|coming soon|National Casino|national-casino|Planbet|20Bet|20bet|Sources Checked|\uFFFD|Carlitta|docs.google|advertiser|TechSolutions|gravira-sports|AggregateRating/i.test(html),file);
  assert.equal([...html.matchAll(/hreflang=/g)].length,11,file);
  assert.equal([...html.matchAll(/<h1>/g)].length,1,file);
  for (const table of html.matchAll(/<table>([\s\S]*?)<\/table>/g)) {
    const columns=[...table[1].matchAll(/<th scope="col">/g)].length;
    for (const row of table[1].matchAll(/<tr>((?:<td>[\s\S]*?<\/td>)+)<\/tr>/g)) assert.equal([...row[1].matchAll(/<td>/g)].length,columns,`${file}: table columns`);
  }
  const sections=[...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map(match => match[1]);
  expectedSections ||= sections;
  assert.deepEqual(sections,expectedSections,`${file}: section parity`);
  for (const id of ['verdict','bonus','games','rewards','payments','safety']) assert(sections.includes(`gravira-${id}`),file);
  assert(html.includes(esc(c.snapshot)),`${file}: Snapshot intro`);
  assert.equal(snapshot.notes[locale],c.note);
  for (const phrase of ['support@gravira.com','complaints@gravira.com','OGL/2024/1944/1124','Horizonix Corp N.V.','166811','35x','30x','40x','Interac','90','48']) assert(html.includes(phrase),`${file}: missing ${phrase}`);
  assert(/id="brand-payments"><\/div><\/div><\/section>/.test(html),`${file}: payment icons without boilerplate`);
  const faqSection=html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq=[...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([,q,a]) => [decode(q),decode(a)]);
  assert.deepEqual(faq,c.faq,file);
  assert.equal(faq.length,8,file);
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
  assert.deepEqual(graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(node => [node.name,node.acceptedAnswer.text]),faq,`${file}: FAQ/schema`);
  const article=graph.find(node => node['@type'] === 'Article');
  assert.equal(article.datePublished,'2026-10-05',file);
  assert.equal(article.dateModified,'2026-10-05',file);
  assert.equal(article.headline,c.title,file);
  assert.equal(graph.find(node => node['@type'] === 'WebPage').description,c.description,file);
  for (const href of [...html.matchAll(/<a[^>]*href="(https?:[^\"]+)"/g)].map(match => decode(match[1]))) {
    const allowed=[brand.urlCasino,'https://t.me/spincresta','https://x.com/SpinCresta'];
    assert(href.startsWith('https://spincresta.com/') || allowed.includes(href),`${file}: outbound link ${href}`);
  }
  const catalog=fs.readFileSync(`${prefix}casinos-and-betting/index.html`,'utf8');
  const row=catalog.match(/<article class="casino-list-row"[^>]*data-brand-slug="gravira">[\s\S]*?<\/article>/)?.[0];
  assert(row && row.includes(esc(c.headline)) && row.includes(brand.bgColor),`${file}: catalogue bonus/background`);
  assert(row.includes('data-type="casino"'),`${file}: incorrect catalogue type`);
  assert.equal([...catalog.matchAll(/data-brand-slug="gravira"/g)].length,1);
  assert(sitemap.includes(`<loc>${url}</loc>`),file);
}
console.log('Gravira: 10 indexable localized reviews, section parity, 8 matching FAQs, 6 new games, 2 Snapshot tabs, 12 payment logos and Canada-only availability passed.');
