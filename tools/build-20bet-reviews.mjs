import fs from 'node:fs';
import path from 'node:path';
import { BET20_COPY } from './20bet-review-copy.mjs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';

// Reuse the established layout, replacing every template fact with researched copy.
// Verification boundaries: tools/research/20bet-2026-10-04.md. No account/payment testing.
const locales = ['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const conditions = {en:'Conditions',de:'Bedingungen',es:'Condiciones',it:'Condizioni',pl:'Warunki',uk:'Умови',pt:'Condições',fr:'Conditions',hi:'शर्तें',fi:'Ehdot'};
const brand = BRANDS.find(item => item.name === '20Bet');
const screenshot = BRAND_HOMEPAGE_SCREENSHOTS['20bet'];
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const sectionPattern = id => new RegExp(`<section class="container" id="${id}">[\\s\\S]*?<\\/section>`);
const title = (html, id) => html.match(sectionPattern(id))?.[0].match(/<h2 class="title">(.*?)<\/h2>/)?.[1];
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([h,p]) => `<article class="feature-card glass-card"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>`;
const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
if (!brand || !screenshot) throw new Error('Missing 20Bet registry');
if (brand.bonus !== BET20_COPY.en.headline) throw new Error('20Bet headline differs from registry');

for (const locale of locales) {
  const c = BET20_COPY[locale];
  let html = fs.readFileSync(`${prefix(locale)}brands/pinco/index.html`, 'utf8')
    .replaceAll(BRAND_HOMEPAGE_SCREENSHOTS.pinco, screenshot)
    .replaceAll('Pinco', '20Bet').replaceAll('pinco', '20bet')
    .replaceAll('images/20bet.svg', 'images/20bet.webp')
    .replaceAll('offer_id=123113', 'offer_id=127265')
    .replaceAll('width="3024" height="1582"', 'width="3024" height="1572"')
    .replaceAll('20261004-pinco-1', '20261004-20bet-1');
  if (locale === 'fi') html = html.replace(/20Betn\b/g, '20Betin').replaceAll('20Betsta', '20Betista');
  const labels = Object.fromEntries(['verdict','bonus','games','sports','payments','safety'].map(id => [id,title(html,`20bet-${id}`)]));
  labels.sports = esc(c.sportsTitle);
  if (Object.values(labels).some(value => !value)) throw new Error(`${locale}: template heading missing`);
  const heads = [...html.match(sectionPattern('20bet-verdict'))[0].matchAll(/<th scope="col">(.*?)<\/th>/g)].map(match => match[1]);
  const ruleHeads = [...heads.slice(0,2), conditions[locale]];
  const prosLabels = [...html.match(sectionPattern('pros-cons'))[0].matchAll(/<strong>(.*?)<\/strong>/g)].map(match => match[1]);
  const section = (id,content) => `<section class="container" id="20bet-${id}"><h2 class="title">${labels[id]}</h2>${content}</section>`;
  const intro = text => `<p class="section-intro">${esc(text)}</p>`;
  const main = section('verdict',intro(c.verdict)+table(heads.slice(0,2),[1,2,3,4].map(i => c.features[i])))
    + section('bonus',intro(c.bonusIntro)+table(ruleHeads,c.bonusRules))
    + section('games',cards(c.games))
    + section('sports',cards(c.sports))
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
    .replace(/(<div class="payments-container" id="brand-payments"><\/div>)<p>[\s\S]*?<\/p>/,'$1');
  let feature = 0;
  html = html.replace(/<div class="feature-card glass-card"><div class="icon-placeholder">[\s\S]*?<\/div><strong>[\s\S]*?<\/strong><span>[\s\S]*?<\/span><\/div>/g,() => {
    const [heading,text] = c.features[feature++];
    return `<div class="feature-card glass-card"><div class="icon-placeholder">${String(feature).padStart(2,'0')}</div><strong>${esc(heading)}</strong><span>${esc(text)}</span></div>`;
  });
  if (feature !== 6) throw new Error(`${locale}: six highlight cards required`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(_,open,json,close) => {
    const schema = JSON.parse(json);
    for (const node of schema['@graph']) {
      if (node['@type'] === 'WebPage') { node.name=c.title; node.description=c.description; node.dateModified='2026-10-04'; }
      if (node['@type'] === 'Article') { node.headline=c.title; node.description=c.description; node.datePublished='2026-10-04'; node.dateModified='2026-10-04'; }
      if (node['@type'] === 'BreadcrumbList') node.itemListElement.at(-1).name=c.h1;
      if (node['@type'] === 'FAQPage') node.mainEntity=c.faq.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));
    }
    return open+JSON.stringify(schema)+close;
  });
  if (/Pinco|pinco|Planbet|planbet|50x|Carlitta|Sources Checked/.test(html)) throw new Error(`${locale}: template facts leaked`);
  const output=`${prefix(locale)}brands/20bet/index.html`;
  fs.mkdirSync(path.dirname(output), {recursive:true});
  fs.writeFileSync(output,html);


  const catalogFile=`${prefix(locale)}casinos-and-betting/index.html`;
  let catalog=fs.readFileSync(catalogFile,'utf8');
  const rowPattern = slug => new RegExp(`<article class="casino-list-row"[^>]*data-brand-slug="${slug}">[\\s\\S]*?<\\/article>`);
  const sourceRow=catalog.match(rowPattern('planbet'))?.[0];
  if (!sourceRow) throw new Error(`${locale}: catalogue template missing`);
  let row=sourceRow.replaceAll('Planbet','20Bet').replaceAll('planbet','20bet')
    .replaceAll('images/20bet.svg','images/20bet.webp')
    .replaceAll('offer_id=127363','offer_id=127265').replaceAll('#1F2528','#0D1D34');
  const names=new Intl.DisplayNames([locale],{type:'region'});
  const countries=brand.countries.map(code => names.of(code)).join(', ');
  let para=0;
  row=row.replace(/(<p class="casino-bonus"><strong>.*?<\/strong>)\s*[\s\S]*?(<\/p>)/g,(whole,open,close) => {
    const index=para++;
    return index === 1 ? `${open} ${esc(c.headline)}${close}`
      : index === 2 ? `${open} ${esc(countries)}. ${esc(c.catalogNote)}${close}` : whole;
  });
  if (para !== 3) throw new Error(`${locale}: catalogue fields changed`);
  catalog=rowPattern('20bet').test(catalog) ? catalog.replace(rowPattern('20bet'),row)
    : catalog.replace(rowPattern('planbet'),sourceRow+'\n            '+row);
  catalog=catalog.replaceAll('20261004-pinco-1','20261004-20bet-1');
  fs.writeFileSync(catalogFile,catalog);
  console.log(`Built ${output} and catalogue row`);
}
