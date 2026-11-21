import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {BRANDS} from '../scripts/brands.js';
import {belongsInReviewDetails} from '../scripts/pages/brand.js';
import {BRAND_SNAPSHOT_CONFIGS,BETONWIN_SPECIAL_MARKETS} from '../scripts/brand-snapshot-configs.js';
import {
 accountHeadline,argentinaCopy,betonwinCopy,conciseCopy,licenseStatement,loyaltyCopy,
 loyaltyLevels,prosConsCopy,reviewLabels,snapshotIntro,templateCopy,
} from './betonwin-review-copy.mjs';
const locales=['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const brand=BRANDS.find(b=>b.name==='BetonWin');
const snapshot=BRAND_SNAPSHOT_CONFIGS.betonwin;
const bettingTab=snapshot.tabs.find(t=>t.label==='Betting');
const read=(lang,slug)=>readFileSync(`${lang==='en'?'':lang+'/'}brands/${slug}/index.html`,'utf8');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
const countedSpinPhrases={de:'50 Freispiele',fi:'50 ilmaiskierrosta',pl:'50 darmowych spinów',uk:'50 фріспінів'};
for(const lang of locales) {
 test(`BetonWin ${lang}: complete standard review components and six functional detail topics`,()=>{
  const html=read(lang,'betonwin');
  const hero=source=>source.match(/<section class="hero container">([\s\S]*?)<\/section>/)[1];
  const classStructure=markup=>Array.from(markup.matchAll(/<(\w+)\b[^>]*\bclass="([^"]+)"/g),([,tag,classes])=>[tag,classes]);
  assert.deepEqual(classStructure(hero(html)),classStructure(hero(read(lang,'stonevegas'))),'reuse StoneVegas hero markup');
  const labels=reviewLabels[lang];
  const number=new Intl.NumberFormat(lang,{useGrouping:'always'});
  assert.match(html,new RegExp(`<body data-brand="betonwin" data-language="${lang}">`));
  const ar=argentinaCopy[lang], c=templateCopy[lang];
  const sections=[...html.matchAll(/<section[^>]*data-review-section="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)];
  const topics=sections.filter(m=>belongsInReviewDetails({kind:m[1],hasTable:m[2].includes('<table>')})).map(m=>m[1]);
  assert.deepEqual([...new Set(topics)],['summary','bonuses','games','sports','cashier','trust']);
  assert.equal((html.match(/<table>/g)||[]).length,6);
  assert.equal((html.match(/class="feature-card glass-card(?: [^"]*)?"/g)||[]).length,30);
  assert.equal((html.match(/class="icon-placeholder"/g)||[]).length,6);
  const sentences=text=>Array.from(new Intl.Segmenter(lang,{granularity:'sentence'}).segment(text),s=>s.segment.trim());
  for(const field of ['payout','cashier']) assert.ok(html.includes(esc(ar[field])),field);
  for(const field of ['pause','exclusion']) assert.ok(html.includes(esc(c[field])),field);
  for(const sentence of [...sentences(c.limits),...sentences(c.mobile).slice(1)]) assert.ok(html.includes(esc(sentence)));
  assert.ok(html.includes(esc(sentences(ar.funding).at(-1))));
  assert.ok(html.includes(esc(sentences(licenseStatement[lang]).at(-1))));
  for(const field of ['verification','deadline','spinRelease','cashout','holder','phone','goodFit','caution','gameQuestion','gameAnswer','payoutAnswer','coinTitle']) assert.ok(html.includes(esc(conciseCopy[lang][field])),field);
  for(const n of [3000,4000000,5000000,1000,50000000,500000]) assert.ok(html.includes(number.format(n)));
  for(const name of ['Mercado Pago','NaranjaX','AstroPay','TRC20','ERC20','CUIT/CUIL']) assert.ok(html.includes(name));
  assert.ok(html.includes('<td>'+esc(labels.cashout)+'</td><td>x5</td>'));
  assert.ok(html.includes(number.format(5000)+' ARS'));
  assert.ok(html.includes(number.format(300000)+' ARS'));
  if(countedSpinPhrases[lang]) assert.ok(html.includes('ARS · '+countedSpinPhrases[lang]));
  assert.ok(html.includes('25×'));
  for(const section of ['betonwin-providers','betonwin-loyalty','betonwin-vip','betonwin-responsible','betonwin-pros-cons','betonwin-best-for']) assert.ok(html.includes('id="'+section+'"'));
  assert.ok(html.includes('class="features-grid premium-grid pros-cons-grid"'));
  const providers=html.match(/id="betonwin-providers"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.equal((providers.match(/class="features-grid premium-grid"/g)||[]).length,1,'providers must use one grid');
  assert.equal((providers.match(/class="feature-card glass-card"/g)||[]).length,4,'four cards form two complete rows');
  const compare=html.match(/id="betonwin-pros-cons"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.ok(compare.includes('is-pros-card'));
  assert.ok(compare.includes('is-cons-card'));
  assert.equal((compare.match(/<span>- /g)||[]).length,8,'four separately formatted points per column');
  for(const point of [...prosConsCopy[lang].pros,...prosConsCopy[lang].cons]) assert.ok(compare.includes(esc(point)));
  const sports=html.match(/id="betonwin-sports"[^>]*>([\s\S]*?)<\/section>/)[1];
  const loyalty=html.match(/id="betonwin-loyalty"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.equal((loyalty.match(/<tr>/g)||[]).length,16,'all 15 verified loyalty cards plus header');
  assert.ok(loyalty.includes(esc(loyaltyCopy[lang].summary)));
  assert.ok(loyalty.includes(esc(loyaltyCopy[lang].disclosure)));
  for(const sentence of sentences(loyaltyCopy[lang].conditions)) assert.ok(html.includes(esc(sentence)));
  for(const [level,target,slots,sport] of loyaltyLevels) {
   assert.ok(loyalty.includes(`${level} · ${number.format(target)} ${loyaltyCopy[lang].points}`));
   for(const rate of [slots,sport]) assert.ok(loyalty.includes(new Intl.NumberFormat(lang,{style:'percent',maximumFractionDigits:2}).format(rate/100)));
  }
  for(const sport of bettingTab.available) assert.ok(sports.includes(esc(snapshot.labels[lang][sport])),sport);
  assert.ok(sports.includes('Liga Profesional'));
  assert.ok(sports.includes('Copa Sudamericana'));
  assert.ok(!html.includes('<details>'), 'no unrelated legacy bonus accordion');
  const graph=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
  const faq=graph.find(n=>n['@type']==='FAQPage');
  assert.equal(faq.mainEntity.length,8);
  for(const qa of faq.mainEntity) assert.ok(html.includes(`<h3>${esc(qa.name)}</h3><p>${esc(qa.acceptedAnswer.text)}</p>`));
  for(const field of ['providers','loyalty','license','saferPlay','pause','exclusion','session']) assert.ok(html.includes(esc(labels[field])),field);
  assert.ok(faq.mainEntity.every(({acceptedAnswer})=>acceptedAnswer.text));
  for(const question of labels.questions) assert.ok(faq.mainEntity.some(qa=>qa.name===question));
  assert.doesNotMatch(html,/\.<\/time>\./,'do not double the date’s locale-specific period');
  assert.doesNotMatch(html,/\b50 FS\b/,'spell out free spins in the page language');
  assert.doesNotMatch(html,/Palcoscenico|Safer-Play-ohjaimet|ठंडा बंद करना|поточне відкриття гри|Sterowanie bezpieczniejszą grą/);
  assert.doesNotMatch(html,/Spinrise|OnlyWin|ViperWin|StoneVegas|Tobique|Metlait|119 Active|13,901|5,555|support@spinrise/i);
  assert.doesNotMatch(html,/https?:\/\/(?:www\.)?(?:betonwin\.casino|beton\.win)/i);
  for(const m of html.matchAll(/<a href="([^"]+)" class="cta-brands"/g)) assert.equal(m[1],brand.urlCasino.replaceAll('&','&amp;'));
 });
 test(`BetonWin ${lang}: concise overview and no repeated long body sentences`,()=>{
  const html=read(lang,'betonwin');
  const overview=html.match(/<p class="hero-subtitle">([\s\S]*?)<\/p>/)[1];
  assert.equal(overview,esc(betonwinCopy[lang].intro));
  assert.doesNotMatch(overview,/300[,. ]?000|50 (?:FS|free)|20/);
  assert.ok(html.includes(`name="brand-snapshot-intro" content="${esc(snapshotIntro[lang])}"`));
  assert.notEqual(esc(snapshotIntro[lang]), overview,'snapshot must not replay the overview');
  const main=html.match(/<main class="content-review">([\s\S]*?)<\/main>/)[1].replace(/<section[^>]*id="faq"[\s\S]*?<\/section>/,'');
  const blocks=[...main.matchAll(/<(?:p|span|td)\b[^>]*>([\s\S]*?)<\/(?:p|span|td)>/g)].map(m=>m[1].replace(/<[^>]+>/g,' ').replaceAll('&amp;','&').replaceAll('&quot;','"').replace(/\s+/g,' ').trim());
  const seen=new Set();
  for(const block of blocks) for(const s of new Intl.Segmenter(lang,{granularity:'sentence'}).segment(block)) {
   const sentence=s.segment.trim();
   if(sentence.length<85)continue; // Short figures and labels are useful in summaries.
   assert.ok(!seen.has(sentence),'Repeated long sentence: '+sentence);
   seen.add(sentence);
  }
  const rewards=main.match(/id="betonwin-rewards"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.doesNotMatch(rewards,/<strong>Triple Spin<\/strong><span>[^<]*Daily Picks/,'Daily Picks belongs in its own card');
  const bonus=main.match(/id="betonwin-bonus"[^>]*>([\s\S]*?)<\/section>/)[1];
  assert.doesNotMatch(bonus,/class="section-intro"/,'keep the full offer terms in the table');
  assert.doesNotMatch(main,/June 2026 Count/,'do not copy another review’s dated count label');
 });
}
test('BetonWin sidebar and catalog headline are localized and regeneration-safe',async()=>{
 assert.equal(brand.bonus,accountHeadline.en);
 for(const lang of locales.filter(x=>x!=='en')) {
  const {default:map}=await import(`../scripts/brand-bonus-translations/${lang}.js`);
  assert.equal(map[brand.bonus],accountHeadline[lang]);
 }
 for(const method of brand.payments)assert.ok(readFileSync(`icons/payments/${method}.svg`,'utf8').includes('<svg'));
 const source=readFileSync('tools/sync-brand-bonus-translations.mjs','utf8');
 assert.ok(source.includes('accountHeadline[locale]'));
 assert.equal(bettingTab.available.filter(key=>!BETONWIN_SPECIAL_MARKETS.includes(key)).length,21);
 assert.deepEqual(bettingTab.available.slice(-2),['Politics','Other']);
 assert.equal(bettingTab.unavailable.length,0);
 assert.equal(snapshot.tabs.find(t=>t.label==='Games').available.length,12);
 assert.equal(snapshot.tabs.find(t=>t.label==='Live games').available.length,8);
 assert.equal(loyaltyLevels.length,15);
 assert.deepEqual(loyaltyLevels.at(-1),[15,500000,8,5]);
 for(const lang of locales) {
  for(const key of [...bettingTab.available,'Bonus buy','Hold and Win','Megaways','Drops & Wins','Spanish-language tables','VIP live casino']) {
   assert.ok(snapshot.labels[lang][key],`${lang}: missing Snapshot label for ${key}`);
  }
 }
});

test('BetonWin follows the standard Gamblezen and Pinco Snapshot template with its own categories',()=>{
  const {tabs} = BRAND_SNAPSHOT_CONFIGS.betonwin;
  const onlyWin = BRAND_SNAPSHOT_CONFIGS.onlywin.tabs[0];
  assert.deepEqual(tabs[0].unavailable, onlyWin.unavailable.filter(item=>item!=='Craps and dice'));
  assert.deepEqual(tabs[1].unavailable, ['Live bingo','Live dice games']);
  assert.deepEqual(tabs.slice(0,2).map(tab=>tab.note), BRAND_SNAPSHOT_CONFIGS.gamblezen.tabs.map(tab=>tab.note));
  assert.equal(tabs[2].note, BRAND_SNAPSHOT_CONFIGS.pinco.tabs[2].note);
  for (const tab of tabs) assert.ok(tab.unavailable.every(item=>!tab.available.includes(item)));
  for (const lang of locales) {
    assert.ok(!Object.hasOwn(BRAND_SNAPSHOT_CONFIGS.betonwin.labels[lang],'Not surfaced:'));
  }
  assert.match(readFileSync('scripts/pages/brand.js','utf8'),/unavailableCount > 0 \? `<span class="is-unavailable">/);
});
