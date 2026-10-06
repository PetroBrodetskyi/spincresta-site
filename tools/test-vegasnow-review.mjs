import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { VEGASNOW_COPY } from './vegasnow-review-copy.mjs';
import ukrainianBonuses from '../scripts/brand-bonus-translations/uk.js';

const locales=['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const gameTitles={en:'New Games',de:'Neue Spiele',es:'Juegos nuevos',it:'Nuovi giochi',pl:'Nowe gry',uk:'Нові ігри',pt:'Novos jogos',fr:'Nouveaux jeux',hi:'नए गेम',fi:'Uudet pelit'};
const decode=value=>value.replaceAll('&amp;','&').replaceAll('&lt;','<').replaceAll('&quot;','"');
const ids=['vegasnow-verdict','vegasnow-bonus','vegasnow-wagering','casino-lobby','sports-betting','vegasnow-rewards','vegasnow-payments','vegasnow-license','vegasnow-support','vegasnow-responsible','pros-cons','faq'];
const root=new URL('../',import.meta.url);
const read=file=>fs.readFileSync(new URL(file,root),'utf8');
const exists=file=>fs.existsSync(new URL(file,root));
const section=(html,id)=>html.match(new RegExp(`<section class="container" id="${id}">([\\s\\S]*?)<\\/section>`))?.[1];
const count=(value,pattern)=>[...value.matchAll(pattern)].length;

for(const locale of locales){
  const prefix=locale==='en'?'':`${locale}/`;
  const html=read(`${prefix}brands/vegasnow/index.html`);
  const copy=VEGASNOW_COPY[locale];
  const url=`https://spincresta.com/${prefix}brands/vegasnow/`;
  test(`${locale}: Vegas Now remains crawlable with native metadata and shared structure`,()=>{
    assert.match(html,/<meta charset="UTF-8"\s*\/?\s*>/i);
    assert.match(html,/<meta name="robots" content="index, follow, max-image-preview:large"/);
    assert.ok(html.includes(`<link rel="canonical" href="${url}"`));
    assert.equal(count(html,/<link rel="alternate" hreflang=/g),11);
    assert.equal(count(html,/<h1>/g),1);
    assert.equal(decode(html.match(/<title>(.*?)<\/title>/)[1]),copy.title);
    assert.equal(decode(html.match(/<h1>(.*?)<\/h1>/)[1]),copy.h1);
    assert.deepEqual([...html.matchAll(/<section class="container" id="([^"]+)">/g)].map(m=>m[1]),ids);
    assert.match(html,/brand-snapshot-intro/);
    assert.ok(html.includes(`<meta name="brand-games-title" content="${gameTitles[locale]}" />`));
    assert.doesNotMatch(html,/\uFFFD|Ã|Ð|noindex|AggregateRating|Gravira|National Casino/);
    assert.match(html,/main\.js\?v=20261006-vegasnow-2/);
    assert.equal(count(section(html,'casino-lobby'),/<article /g),2);
    assert.ok(decode(section(html,'sports-betting')).includes(copy.games[2][1]));
    assert.ok(decode(section(html,'sports-betting')).includes(copy.features[4][1]));
  });
  test(`${locale}: four-stage bonus, cash limits and FAQ schema stay consistent`,()=>{
    assert.equal(count(section(html,'vegasnow-bonus'),/<tbody><tr>|<\/tr><tr>/g),4);
    assert.equal(count(section(html,'vegasnow-wagering'),/<tbody><tr>|<\/tr><tr>/g),8);
    assert.equal(count(section(html,'vegasnow-payments'),/<tbody><tr>|<\/tr><tr>/g),8);
    for(const code of ['VEGAS2','VEGAS3','VEGAS4']) assert.ok(section(html,'vegasnow-bonus').includes(code));
    assert.match(section(html,'vegasnow-payments'),/Interac CA\$30[–-]4[ ,.]000/);
    assert.match(section(html,'vegasnow-payments'),/US\$50[ ,.]000/);
    assert.match(section(html,'vegasnow-license'),/Just Entertainment B\.V\.|Just Entertainment B.V./);
    assert.match(section(html,'vegasnow-license'),/OGL\/2024\/164\/0246/);
    const graph=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1])['@graph'];
    const article=graph.find(n=>n['@type']==='Article');
    assert.equal(article.dateModified,'2026-10-06');
    assert.equal(article.datePublished,'2026-03-09');
    assert.equal(article.inLanguage,locale);
    assert.equal(article.mainEntityOfPage['@id'],url+'#webpage');
    assert.equal(article.headline,copy.title);
    assert.equal(graph.find(n=>n['@type']==='Person').name,'Odri Chambers');
    const actualFaq=[...section(html,'faq').matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(m=>[decode(m[1]),decode(m[2])]);
    const schemaFaq=graph.find(n=>n['@type']==='FAQPage').mainEntity.map(q=>[q.name,q.acceptedAnswer.text]);
    assert.equal(actualFaq.length,8);
    assert.deepEqual(actualFaq,schemaFaq);
    assert.equal(BRAND_SNAPSHOT_CONFIGS.vegasnow.notes[locale],copy.note);
    // Research sources remain private; published casino CTAs use the registry's
    // affiliate destination rather than direct operator-page links.
    assert.doesNotMatch(html,/href=["']https?:\/\/(?:www\.)?vegasnow\.com\b/i);
    assert.match(html,/href="https:\/\/armadaapp\.media-412\.com\/click\?pid=3862&offer_id=121066"/);
  });
  test(`${locale}: betting copy states current sports without an observation narrative`,()=>{
    const bettingCopy=copy.games[2][1];
    assert.ok(bettingCopy.includes('Vegas Now'));
    assert.ok(bettingCopy.includes('MMA'));
    assert.equal(bettingCopy.trim().split(/[.!।](?:\s|$)/u).filter(Boolean).length,1);
    assert.doesNotMatch(bettingCopy,/were visible|waren sichtbar|Se observaron|Erano visibili|Widoczne były|У каталозі були|Foram observados|étaient visibles|इवेंट दिखे|Näkyvissä oli/u);
    assert.doesNotMatch(copy.games[0][1],/shelf showed|Bei der Prüfung waren|mostraba|figuravano|widoczne były|Під час перевірки|mostrava|affichait|जाँच के समय|sisälsi tarkistuksessa/u);
  });
}

test('Vegas Now preserves approved registry data and every payment logo resolves locally',()=>{
  const brand=BRANDS.find(b=>b.name==='Vegas Now');
  assert.equal(brand.urlCasino,'https://armadaapp.media-412.com/click?pid=3862&offer_id=121066');
  assert.equal(brand.bonus,'Up to 8,000 €/$ + 500 free spins');
  assert.equal(brand.bgColor,'#181528');
  assert.equal(brand.image,'images/vegasnow.webp');
  assert.deepEqual(brand.countries,['AU','CA','NZ','AT','CH','NO','SE','FI','DK','IS']);
  assert.deepEqual(brand.top,['AU']);
  assert.equal(brand.payments.length,12);
  for(const payment of brand.payments) assert.ok(exists(`icons/payments/${payment}.svg`),payment);
  assert.equal(ukrainianBonuses[brand.bonus],'До 8 000 €/$ + 500 фриспінів');
});

test('Vegas Now Snapshot covers verified categories, with all ten native notes',()=>{
  const config=BRAND_SNAPSHOT_CONFIGS.vegasnow;
  assert.equal(config.tabs.length,3);
  assert.deepEqual(config.tabs.map(tab=>tab.available.length),[7,4,3]);
  assert.deepEqual(config.tabs[2].available,['Football','American football','Martial arts']);
  assert.deepEqual(Object.keys(config.notes).sort(),locales.toSorted());
  const screenshots=BRAND_NEW_GAMES.vegasnow;
  assert.equal(screenshots.length,6);
  for(const game of screenshots) assert.match(game.image,/^https:\/\/res\.cloudinary\.com\/drj61gmd2\/image\/upload\/v\d+\/spincresta\/brands\/vegasnow\/new-games\//);
});

test('Shared gallery labels remain optional, escaped and preserve other brands’ defaults',()=>{
  const source=read('scripts/pages/brand-layout.js');
  assert.match(source,/meta\[name="brand-games-title"\]/);
  assert.match(source,/\|\| localeText\('New Games'/);
  assert.match(source,/\|\| localeText\('LATEST RELEASES'/);
  assert.match(source,/escapeHtml\(newGamesLabel\)/);
  assert.match(source,/escapeHtml\(newGamesKicker\)/);
  assert.doesNotMatch(JSON.stringify(VEGASNOW_COPY.en),/\bprogramme\b|\blicence\b|\bcolour\b|\bcentre\b/);
});
