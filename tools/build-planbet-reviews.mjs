import fs from 'node:fs';
import path from 'node:path';
import { PLANBET_COPY } from './planbet-review-copy.mjs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';

// Reuse the mature review structure, never the template brand's factual copy.
// Sources and verification boundaries: research/planbet-2026-10-03.md.
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const brand = BRANDS.find(item => item.name === 'Planbet');
const screenshot = BRAND_HOMEPAGE_SCREENSHOTS.planbet;
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const bonuses = {
  en: 'Up to €1,500 + 150 Free Spins over 4 Deposits',
  de: 'Bis zu 1.500 € + 150 Freispiele über 4 Einzahlungen',
  es: 'Hasta 1.500 € + 150 giros gratis en 4 depósitos',
  it: 'Fino a 1.500 € + 150 giri gratis su 4 depositi',
  pl: 'Do 1 500 € + 150 darmowych spinów na 4 wpłaty',
  uk: 'До 1 500 € + 150 фріспінів на 4 депозити',
  pt: 'Até 1.500 € + 150 jogadas grátis em 4 depósitos',
  fr: 'Jusqu’à 1 500 € + 150 tours gratuits sur 4 dépôts',
  hi: 'चार जमा पर €1,500 तक + 150 मुफ़्त स्पिन',
  fi: 'Enintään 1 500 € + 150 ilmaiskierrosta neljälle talletukselle',
};
const upTo = { en:'up to', de:'bis zu', es:'hasta', it:'fino a', pl:'do', uk:'до', pt:'até', fr:'jusqu’à', hi:'अधिकतम', fi:'enintään' };
const sectionPattern = id => new RegExp(`<section class="container" id="${id}">[\\s\\S]*?<\\/section>`);
const title = (html, id) => html.match(sectionPattern(id))?.[0].match(/<h2 class="title">(.*?)<\/h2>/)?.[1];
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([heading, text]) => `<article class="feature-card glass-card"><h3>${esc(heading)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`;
const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
if (!brand || !screenshot) throw new Error('Planbet registry must be configured first');

for (const locale of locales) {
  const c = PLANBET_COPY[locale];
  let html = fs.readFileSync(`${prefix(locale)}brands/casinado/index.html`, 'utf8')
    .replaceAll(BRAND_HOMEPAGE_SCREENSHOTS.casinado, screenshot)
    .replaceAll('Casinado', 'Planbet').replaceAll('casinado', 'planbet')
    .replaceAll('offer_id=124854', 'offer_id=127363')
    .replaceAll('width="3024" height="1660"', 'width="1600" height="837"')
    .replaceAll('20261003-casinado-1', '20261003-planbet-1');
  if (locale === 'fi') html = html.replaceAll('Planbetn', 'Planbetin').replaceAll('Planbetsta', 'Planbetista');
  const labels = Object.fromEntries(['verdict','bonus','games','sports','payments','safety'].map(id => [id, title(html, `planbet-${id}`)]));
  if (Object.values(labels).some(value => !value)) throw new Error(`${locale}: missing template heading`);
  const heads = [...html.match(sectionPattern('planbet-verdict'))[0].matchAll(/<th scope="col">(.*?)<\/th>/g)].map(match => match[1]);
  const prosLabels = [...html.match(sectionPattern('pros-cons'))[0].matchAll(/<strong>(.*?)<\/strong>/g)].map(match => match[1]);
  const section = (id, content) => `<section class="container" id="planbet-${id}"><h2 class="title">${labels[id]}</h2>${content}</section>`;
  const intro = text => `<p class="section-intro">${esc(text)}</p>`;
  const stages = [[100,300,30,10],[50,350,35,15],[25,400,40,15],[25,450,45,15]].map(([rate, cap, spins, min], i) => [
    `${c.stage} ${i + 1}`, `${rate}% ${upTo[locale]} €${cap} + ${spins} ${c.spins}`, `${c.min}: €${min}.`,
  ]);
  const verdictRows = [1,2,3,5].map(index => [c.features[index][0], c.features[index][1]]);
  const main = section('verdict', intro(c.verdict) + table(heads.slice(0,2), verdictRows))
    + section('bonus', intro(c.bonusIntro) + table(heads, [...stages, ...c.bonusRules]))
    + section('games', cards(c.games))
    + section('sports', cards(c.sports))
    + section('payments', intro(c.cashierIntro) + table(heads, c.cashier))
    + section('safety', cards(c.safety))
    + `<section class="container" id="pros-cons"><h2 class="title">${title(html, 'pros-cons')}</h2><div class="features-grid premium-grid pros-cons-grid">${[c.pros,c.cons].map((items, i) => `<div class="feature-card glass-card"><strong>${prosLabels[i]}</strong>${items.map(item => `<span>- ${esc(item)}</span>`).join('<br />')}</div>`).join('')}</div></section>`
    + `<section class="container" id="faq"><h2 class="title">${title(html, 'faq')}</h2><div class="timeline">${c.faq.map(([q,a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>`;
  html = html.replace(/<main class="content-review">[\s\S]*?<\/main>/, `<main class="content-review">${main}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(c.title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g, (_, a, b) => a + esc(c.description) + b)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*("\s*\/?>)/g, (_, a, b) => a + esc(c.title) + b)
    .replace(/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(c.h1)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(c.intro)}</p>`)
    .replace('<div class="payments-container" id="brand-payments"></div>', `<div class="payments-container" id="brand-payments"></div><p>${esc(c.cashierIntro)}</p>`);
  let feature = 0;
  html = html.replace(/<div class="feature-card glass-card"><div class="icon-placeholder">[\s\S]*?<\/div><strong>[\s\S]*?<\/strong><span>[\s\S]*?<\/span><\/div>/g, () => {
    const [heading, text] = c.features[feature++];
    return `<div class="feature-card glass-card"><div class="icon-placeholder">${String(feature).padStart(2,'0')}</div><strong>${esc(heading)}</strong><span>${esc(text)}</span></div>`;
  });
  if (feature !== 6) throw new Error(`${locale}: six highlight cards required`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, json, close) => {
    const schema = JSON.parse(json);
    for (const node of schema['@graph']) {
      if (node['@type'] === 'WebPage') { node.name = c.title; node.description = c.description; }
      if (node['@type'] === 'Article') { node.headline = c.title; node.description = c.description; }
      if (node['@type'] === 'BreadcrumbList') node.itemListElement.at(-1).name = c.h1;
      if (node['@type'] === 'FAQPage') node.mainEntity = c.faq.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));
    }
    return open + JSON.stringify(schema) + close;
  });
  if (/Casinado|casinado|VikingLuck|vikingluck|Champions Cup|Collections|Interac|7\.19|€500|Planbetn|Planbetsta/.test(html)) throw new Error(`${locale}: template facts leaked`);
  const output = `${prefix(locale)}brands/planbet/index.html`;
  fs.mkdirSync(path.dirname(output), {recursive:true});
  fs.writeFileSync(output, html);

  // The existing catalogue is the static, crawlable discovery path for reviews.
  const catalogFile = `${prefix(locale)}casinos-and-betting/index.html`;
  let catalog = fs.readFileSync(catalogFile, 'utf8');
  const rowPattern = slug => new RegExp(`<article class="casino-list-row"[^>]*data-brand-slug="${slug}">[\\s\\S]*?<\\/article>`);
  const sourceRow = catalog.match(rowPattern('casinado'))?.[0];
  if (!sourceRow) throw new Error(`${locale}: catalogue template row missing`);
  let row = sourceRow.replaceAll('Casinado', 'Planbet').replaceAll('casinado', 'planbet')
    .replaceAll('offer_id=124854', 'offer_id=127363').replaceAll('#1C2738', '#1F2528').replace('data-type="casino"', 'data-type="casino-betting"');
  const typeParagraph = catalog.match(rowPattern('casinova'))?.[0].match(/<p class="casino-bonus">[\s\S]*?<\/p>/)?.[0];
  if (!typeParagraph) throw new Error(`${locale}: native casino/sports type label missing`);
  row = row.replace(/<p class="casino-bonus">[\s\S]*?<\/p>/, typeParagraph);
  const names = new Intl.DisplayNames([locale], {type:'region'});
  const countries = brand.countries.map(code => names.of(code)).join(', ');
  let para = 0;
  row = row.replace(/(<p class="casino-bonus"><strong>.*?<\/strong>)\s*[\s\S]*?(<\/p>)/g, (whole, open, close) => {
    const index = para++;
    return index === 1 ? `${open} ${esc(bonuses[locale])}${close}` : index === 2 ? `${open} ${esc(countries)}${close}` : whole;
  });
  if (para !== 3) throw new Error(`${locale}: catalogue row fields changed`);
  catalog = rowPattern('planbet').test(catalog) ? catalog.replace(rowPattern('planbet'), row) : catalog.replace(rowPattern('casinado'), sourceRow + '\n            ' + row);
  catalog = catalog.replaceAll('20261003-casinado-1', '20261003-planbet-1');
  fs.writeFileSync(catalogFile, catalog);
  console.log(`Built ${output} and catalogue row`);
}
