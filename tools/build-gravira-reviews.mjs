import fs from 'node:fs';
import path from 'node:path';
import { GRAVIRA_COPY } from './gravira-review-copy.mjs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';

// Use the established review layout, never the previous brand's commercial facts.
// Private evidence: tools/research/gravira-2026-10-05.md. No real-money testing.
const locales = ['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const version = '20261005-gravira-1';
const conditions = {en:'Conditions',de:'Bedingungen',es:'Condiciones',it:'Condizioni',pl:'Warunki',uk:'Умови',pt:'Condições',fr:'Conditions',hi:'शर्तें',fi:'Ehdot'};
const verdictNav = {en:'Verdict',de:'Fazit',es:'Valoración',it:'Valutazione',pl:'Ocena',uk:'Висновок',pt:'Avaliação',fr:'Avis',hi:'निष्कर्ष',fi:'Yhteenveto'};
const rewardsNav = {en:'Rewards',de:'Extras',es:'Otras ofertas',it:'Altre offerte',pl:'Inne promocje',uk:'Інші пропозиції',pt:'Outras ofertas',fr:'Autres offres',hi:'अन्य ऑफ़र',fi:'Muut tarjoukset'};
const bonusTitles = {en:'Welcome Bonuses & Wagering',de:'Willkommensboni & Umsatzbedingungen',es:'Bonos de bienvenida y requisitos de apuesta',it:'Bonus di benvenuto e requisiti di puntata',pl:'Bonusy powitalne i wymagania obrotu',uk:'Вітальні бонуси та умови відіграшу',pt:'Bónus de boas-vindas e requisitos de aposta',fr:'Bonus de bienvenue et conditions de mise',hi:'वेलकम बोनस और दाँव की शर्तें',fi:'Tervetulobonukset ja kierrätysehdot'};
const homepageAlt = {en:'Gravira casino homepage',de:'Gravira Casino-Startseite',es:'Página principal del casino Gravira',it:'Pagina iniziale del casinò Gravira',pl:'Strona główna kasyna Gravira',uk:'Головна сторінка казино Gravira',pt:'Página inicial do casino Gravira',fr:'Page d’accueil du casino Gravira',hi:'Gravira कैसीनो का मुख्य पृष्ठ',fi:'Graviran kasinon etusivu'};
const casinoType = {en:'Casino',de:'Casino',es:'Casino',it:'Casinò',pl:'Kasyno',uk:'Казино',pt:'Casino',fr:'Casino',hi:'कैसीनो',fi:'Kasino'};
const brand = BRANDS.find(item => item.name === 'Gravira');
const screenshot = BRAND_HOMEPAGE_SCREENSHOTS.gravira;
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const sectionPattern = id => new RegExp(`<section class="container" id="${id}">[\\s\\S]*?<\\/section>`);
const title = (html,id) => html.match(sectionPattern(id))?.[0].match(/<h2 class="title"[^>]*>(.*?)<\/h2>/)?.[1];
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([h,p]) => `<article class="feature-card glass-card"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>`;
const table = (heads,rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
if (!brand || !screenshot || brand.bonus !== GRAVIRA_COPY.en.headline) throw new Error('Incomplete Gravira registry');

for (const locale of locales) {
  const c = GRAVIRA_COPY[locale];
  if (!c || c.features.length !== 6 || c.bonusRules.length !== 9 || c.cashier.length !== 8 || c.faq.length !== 8) throw new Error(`${locale}: incomplete copy`);
  let html = fs.readFileSync(`${prefix(locale)}brands/national-casino/index.html`,'utf8')
    .replaceAll(BRAND_HOMEPAGE_SCREENSHOTS['national-casino'],screenshot)
    .replaceAll('National Casino','Gravira').replaceAll('national-casino','gravira')
    .replaceAll('offer_id=127266','offer_id=126829')
    .replaceAll('20261004-gravira-1',version);
  const labels = Object.fromEntries(['verdict','bonus','games','payments','safety'].map(id => [id,title(html,`gravira-${id}`)]));
  labels.bonus = esc(bonusTitles[locale]);
  labels.rewards = esc(c.rewardsTitle);
  if (Object.values(labels).some(value => !value)) throw new Error(`${locale}: template heading missing`);
  const heads = [...html.match(sectionPattern('gravira-verdict'))[0].matchAll(/<th scope="col">(.*?)<\/th>/g)].map(match => match[1]);
  const ruleHeads = [...heads.slice(0,2),conditions[locale]];
  const prosLabels = [...html.match(sectionPattern('pros-cons'))[0].matchAll(/<strong>(.*?)<\/strong>/g)].map(match => match[1]);
  const section = (id,content) => `<section class="container" id="gravira-${id}"><h2 class="title"${id === 'verdict' ? ` data-nav-label="${esc(verdictNav[locale])}"` : id === 'rewards' ? ` data-nav-label="${esc(rewardsNav[locale])}"` : ''}>${labels[id]}</h2>${content}</section>`;
  const intro = text => `<p class="section-intro">${esc(text)}</p>`;
  const main = section('verdict',intro(c.verdict)+table(heads.slice(0,2),[1,2,3,4].map(i => c.features[i])))
    + section('bonus',intro(c.bonusIntro)+table(ruleHeads,c.bonusRules))
    + section('games',cards(c.games))
    + section('rewards',table(heads.slice(0,2),c.rewards))
    + section('payments',table(ruleHeads,c.cashier))
    + section('safety',cards(c.safety))
    + `<section class="container" id="pros-cons"><h2 class="title">${title(html,'pros-cons')}</h2><div class="features-grid premium-grid pros-cons-grid">${[c.pros,c.cons].map((items,i) => `<div class="feature-card glass-card"><strong>${prosLabels[i]}</strong>${items.map(item => `<span>- ${esc(item)}</span>`).join('<br />')}</div>`).join('')}</div></section>`
    + `<section class="container" id="faq"><h2 class="title">${title(html,'faq')}</h2><div class="timeline">${c.faq.map(([q,a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>`;
  html = html.replace(/<main class="content-review">[\s\S]*?<\/main>/,`<main class="content-review">${main}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(c.title)}</title>`)
    .replace(/\s*<meta name="keywords"[^>]*>/,'')
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g,(_,a,b) => a+esc(c.description)+b)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*("\s*\/?>)/g,(_,a,b) => a+esc(c.title)+b)
    .replace(/(<meta name="brand-snapshot-intro" content=")[^"]*("\s*\/?>)/,(_,a,b) => a+esc(c.snapshot)+b)
    .replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${esc(c.h1)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/,`<p class="hero-subtitle">${esc(c.intro)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/,`<p class="hero-subtitle editorial-meta">${esc(c.editorial)}</p>`)
    .replace(/(<button class="brand-why-media"[\s\S]*?<img[^>]*alt=")[^"]*(")/,(_,a,b) => a+esc(homepageAlt[locale])+b)
    .replace('width="3024" height="1572"','width="3024" height="1596"');
  let feature=0;
  html=html.replace(/<div class="feature-card glass-card"><div class="icon-placeholder">[\s\S]*?<\/div><strong>[\s\S]*?<\/strong><span>[\s\S]*?<\/span><\/div>/g,() => {
    const [heading,text]=c.features[feature++];
    return `<div class="feature-card glass-card"><div class="icon-placeholder">${String(feature).padStart(2,'0')}</div><strong>${esc(heading)}</strong><span>${esc(text)}</span></div>`;
  });
  if (feature !== 6) throw new Error(`${locale}: highlight structure changed`);
  html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(_,open,json,close) => {
    const schema=JSON.parse(json);
    for (const node of schema['@graph']) {
      if (node['@type'] === 'WebPage') {node.name=c.title;node.description=c.description;node.dateModified='2026-10-05';}
      if (node['@type'] === 'Article') {node.headline=c.title;node.description=c.description;node.datePublished='2026-10-05';node.dateModified='2026-10-05';}
      if (node['@type'] === 'BreadcrumbList') node.itemListElement.at(-1).name=c.h1;
      if (node['@type'] === 'FAQPage') node.mainEntity=c.faq.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));
    }
    return open+JSON.stringify(schema)+close;
  });
  if (/National Casino|national-casino|Planbet|20Bet|20bet|Carlitta|Sources Checked|TechSolutions|590\/0758|gravira-sports/.test(html)) throw new Error(`${locale}: template facts leaked`);
  const output=`${prefix(locale)}brands/gravira/index.html`;
  fs.mkdirSync(path.dirname(output),{recursive:true});
  fs.writeFileSync(output,html);

  const catalogFile=`${prefix(locale)}casinos-and-betting/index.html`;
  let catalog=fs.readFileSync(catalogFile,'utf8');
  const rowPattern=slug => new RegExp(`<article class="casino-list-row"[^>]*data-brand-slug="${slug}">[\\s\\S]*?<\\/article>`);
  const sourceRow=catalog.match(rowPattern('national-casino'))?.[0];
  if (!sourceRow) throw new Error(`${locale}: catalogue template missing`);
  let row=sourceRow.replaceAll('National Casino','Gravira').replaceAll('national-casino','gravira')
    .replaceAll('offer_id=127266','offer_id=126829').replaceAll('#292526',brand.bgColor)
    .replace('data-type="casino-betting"','data-type="casino"');
  const country=new Intl.DisplayNames([locale],{type:'region'}).of('CA');
  let para=0;
  const values=[casinoType[locale],c.headline,`${country}. ${c.catalogNote}`];
  row=row.replace(/(<p class="casino-bonus"><strong>.*?<\/strong>)\s*[\s\S]*?(<\/p>)/g,(_,open,close) => `${open} ${esc(values[para++])}${close}`);
  if (para !== 3) throw new Error(`${locale}: catalogue fields changed`);
  catalog=rowPattern('gravira').test(catalog) ? catalog.replace(rowPattern('gravira'),row) : catalog.replace(rowPattern('national-casino'),sourceRow+'\n            '+row);
  catalog=catalog.replaceAll('20261004-national-casino-1',version);
  fs.writeFileSync(catalogFile,catalog);
  console.log(`Built ${output} and catalogue row`);
}
