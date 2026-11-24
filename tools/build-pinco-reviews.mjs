import fs from 'node:fs';
import { PINCO_COPY } from './pinco-review-copy.mjs';
import { BRANDS } from '../scripts/brands.js';

// Refresh the existing Pinco review shells without borrowing another brand's layout or data.
// Verification boundaries: research/pinco-2026-10-04.md. No account/payment testing.
const locales = ['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const conditions = {en:'Conditions',de:'Bedingungen',es:'Condiciones',it:'Condizioni',pl:'Warunki',uk:'Умови',pt:'Condições',fr:'Conditions',hi:'शर्तें',fi:'Ehdot'};
const brand = BRANDS.find(item => item.name === 'Pinco');
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const sectionPattern = id => new RegExp(`(<section\\b(?=[^>]*\\sid=["']${id}["'])[^>]*>)([\\s\\S]*?)(</section\\s*>)`, 'i');
const headingPattern = /(<h2\b[^>]*>)([\s\S]*?)(<\/h2\s*>)/i;
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([h,p]) => `<article class="feature-card glass-card"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>`;
const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h => `<th scope="col">${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
if (!brand?.urlCasino) throw new Error('Missing Pinco affiliate destination in the brand registry');
if (brand.bonus !== PINCO_COPY.en.headline) throw new Error('Pinco headline differs from registry');

const updates = new Map();
for (const locale of locales) {
  const c = PINCO_COPY[locale];
  const output = `${prefix(locale)}brands/pinco/index.html`;
  let html = fs.readFileSync(output, 'utf8')
    .replace(/(<a\b(?=[^>]*\bclass="[^"]*\bcta-brands\b)[^>]*\bhref=")[^"]*"/g, (_, open) => `${open}${esc(brand.urlCasino)}"`);
  const heads = [...(html.match(sectionPattern('pinco-verdict'))?.[2] || '').matchAll(/<th scope="col">(.*?)<\/th>/g)].map(match => match[1]);
  const ruleHeads = [...heads.slice(0,2), conditions[locale]];
  const prosLabels = [...(html.match(sectionPattern('pros-cons'))?.[2] || '').matchAll(/<strong>(.*?)<\/strong>/g)].map(match => match[1]);
  if (heads.length < 2 || prosLabels.length !== 2) throw new Error(`${locale}: Pinco table or pros/cons labels missing`);
  const replaceSection = (id, content, heading) => {
    const pattern = sectionPattern(id);
    const match = html.match(pattern);
    const currentHeading = match?.[2].match(headingPattern);
    if (!currentHeading) throw new Error(`${locale}: heading missing in #${id}`);
    let [, open, , close] = match;
    if (id === 'pinco-sports') {
      open = open.replace(/\sdata-review-section=["'][^"']*["']/i, '')
        .replace(/\sdata-review-details(?:=["'][^"']*["'])?(?=\s|>)/i, '')
        .replace(/>$/, ' data-review-section="sports" data-review-details>');
    }
    const title = heading ? `${currentHeading[1]}${esc(heading)}${currentHeading[3]}` : currentHeading[0];
    html = html.replace(pattern, () => open + title + content + close);
  };
  const intro = text => `<p class="section-intro">${esc(text)}</p>`;
  replaceSection('pinco-verdict', intro(c.verdict) + table(heads.slice(0,2),[1,2,3,4].map(i => c.features[i])));
  replaceSection('pinco-bonus', intro(c.bonusIntro) + table(heads.slice(0,2),c.bonusRules));
  replaceSection('pinco-games', cards(c.games));
  replaceSection('pinco-sports', cards(c.sports), c.sportsTitle);
  replaceSection('pinco-payments', table(ruleHeads,c.cashier));
  replaceSection('pinco-safety', cards(c.safety));
  replaceSection('pros-cons', `<div class="features-grid premium-grid pros-cons-grid">${[c.pros,c.cons].map((items,i) => `<div class="feature-card glass-card"><strong>${prosLabels[i]}</strong>${items.map(item => `<span>- ${esc(item)}</span>`).join('<br />')}</div>`).join('')}</div>`);
  replaceSection('faq', `<div class="timeline">${c.faq.map(([q,a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div>`);
  html = html
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
      if (node['@type'] === 'Article') { node.headline=c.title; node.description=c.description; node.datePublished='2026-05-03'; node.dateModified='2026-10-04'; }
      if (node['@type'] === 'BreadcrumbList') node.itemListElement.at(-1).name=c.h1;
      if (node['@type'] === 'FAQPage') node.mainEntity=c.faq.map(([q,a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));
    }
    return open+JSON.stringify(schema)+close;
  });
  if (/Planbet|planbet|€1,500|35x|support-en@|security@|complaints@|block@|Pincoin\b|Pincoista|Sources Checked/.test(html)) throw new Error(`${locale}: template facts leaked`);
  updates.set(output, html);

  const catalogFile=`${prefix(locale)}casinos-and-betting/index.html`;
  let found=0;
  const catalog=fs.readFileSync(catalogFile,'utf8').replace(/<article class="casino-list-row"[\s\S]*?<\/article>/g,row => {
    if (!row.includes(`href="/${prefix(locale)}brands/pinco/"`)) return row;
    found++;
    if (!row.includes('data-brand-slug=')) row=row.replace('data-type="casino-betting"','data-type="casino-betting" data-brand-slug="pinco"');
    let index=0;
    return row.replace(/(<p class="casino-bonus">\s*<strong>[\s\S]*?<\/strong>)[\s\S]*?(<\/p>)/g,(whole,open,close) => index++ === 1 ? `${open} ${esc(c.headline)}${close}` : whole);
  });
  if (found !== 1) throw new Error(`${locale}: expected one Pinco catalogue row`);
  updates.set(catalogFile, catalog);
}
for (const [file, html] of updates) {
  if (fs.readFileSync(file, 'utf8') === html) continue;
  fs.writeFileSync(file, html);
  console.log(`Updated ${file}`);
}
