#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const IT_ROOT = path.join(ROOT, 'it');
const regionNames = new Intl.DisplayNames(['it'], { type: 'region' });
const regionCode = code => code === 'UK' ? 'GB' : code;
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const encode = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = value => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const brandNames = new Map(
  BRANDS.filter(brand => brand.urlDetail).map(brand => {
    const slug = brand.urlDetail.replace(/^.*?brands\//, '').replace(/\.html$/, '').replace(/\/$/, '');
    return [slug, brand.name];
  })
);

const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name === 'index.html') files.push(target);
  }
};
walk(IT_ROOT);

const pagePath = file => `/${path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`)
);

const serviceTitles = {
  '/it/': 'Casinò online e recensioni | SpinCresta',
  '/it/about/': 'Chi siamo | Metodo editoriale di SpinCresta',
  '/it/blog/': 'Guide ai casinò online | Blog SpinCresta',
  '/it/casinos-and-betting/': 'Casinò e siti di scommesse | SpinCresta',
  '/it/exclusive-offers/': 'Offerte esclusive dei casinò | SpinCresta',
  '/it/new-casinos/': 'Nuovi casinò online 2026 | SpinCresta',
  '/it/online-casinos/': 'Casinò online per paese | SpinCresta',
  '/it/payment-methods/': 'Metodi di pagamento dei casinò | Guida 2026',
  '/it/privacy-policy/': 'Informativa sulla privacy | SpinCresta',
  '/it/responsible-gambling/': 'Gioco responsabile | Guida SpinCresta',
  '/it/top-casinos/': 'Migliori casinò online 2026 | SpinCresta',
  '/it/top-rated/': 'Casinò online più votati 2026 | SpinCresta',
};
const serviceDescriptions = {
  '/it/': 'Confronta casinò online, bonus, pagamenti, prelievi e guide per paese. Verifica disponibilità e condizioni aggiornate prima di registrarti.',
  '/it/blog/': 'Guide pratiche su casinò online, bonus, pagamenti, prelievi, verifica e mercati locali per scegliere con maggiore consapevolezza.',
  '/it/online-casinos/': 'Esplora i casinò online per paese e confronta disponibilità, bonus, pagamenti, prelievi e strumenti per il gioco responsabile.',
  '/it/payment-methods/': 'Confronta carte, e-wallet, bonifici, pagamenti mobili e criptovalute per depositi e prelievi nei casinò online.',
  '/it/privacy-policy/': 'Scopri come SpinCresta utilizza dati e cookie, protegge la privacy, gestisce i link esterni e risponde alle richieste degli utenti.',
  '/it/responsible-gambling/': 'Consigli e strumenti per il gioco responsabile: limiti, pause, autoesclusione, segnali di rischio e organizzazioni di supporto.',
};
const brandRegionLabels = {
  'betzino-fr': 'Francia',
  'casinopeaches-fr': 'Francia',
  'fortunica-es': 'Spagna',
  'fortunica-nl': 'Paesi Bassi',
  'fortunica-uk': 'Regno Unito',
  'fraga-ar': 'Argentina',
  'fraga-az': 'Azerbaigian',
  'fraga-cl': 'Cile',
  'fraga-tr': 'Turchia',
  'letsjackpot-fr': 'Francia',
  'uspin-fr': 'Francia',
};

let titleUpdates = 0;
let descriptionUpdates = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const route = pagePath(file);
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const brandMatch = route.match(/^\/it\/brands\/([^/]+)\/$/);
  const brandSlug = brandMatch?.[1] || '';
  const brandRegion = brandRegionLabels[brandSlug] || '';
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = serviceTitles[route] || currentTitle;
  let description = currentDescription;

  if (brandMatch) {
    const name = brandNames.get(brandSlug) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || brandSlug);
    const casinoName = /\bcasino\b/i.test(name) ? name : `${name} Casino`;
    title = brandRegion
      ? `${name} ${brandRegion}: recensione 2026`
      : `${casinoName} 2026 | Bonus, giochi e pagamenti`;
    if (title.length > 65) title = `${casinoName} 2026 | Bonus e pagamenti`;
    if (title.length > 65) title = `${name}: recensione casinò 2026`;
    if (currentDescription.length > 170) {
      description = `${name}: bonus, giochi, pagamenti, prelievi, verifica KYC, accesso mobile e disponibilità. Controlla le condizioni aggiornate prima di giocare.`;
    }
  } else if (countryCode) {
    const country = regionNames.of(regionCode(countryCode)) || countryCode;
    title = `${country}: migliori casinò online 2026`;
    if (currentDescription.length > 170) {
      description = `Confronta i casinò online in ${country}: bonus, pagamenti, prelievi, disponibilità e gioco responsabile. Controlla le condizioni prima di registrarti.`;
    }
  }

  if (serviceDescriptions[route]) description = serviceDescriptions[route];
  if (title.length > 65) title = title.slice(0, 62).replace(/[\s|,:;-]+$/, '') + '…';
  if (description.length > 170) description = description.slice(0, 167).replace(/[\s,;:-]+$/, '') + '…';

  if (title !== currentTitle) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    html = replaceMeta(html, `\\bproperty=['"]og:title['"]`, title);
    html = replaceMeta(html, `\\bname=['"]twitter:title['"]`, title);
    titleUpdates += 1;
  }
  if (description !== currentDescription) {
    html = replaceMeta(html, `\\bname=['"]description['"]`, description);
    html = replaceMeta(html, `\\bproperty=['"]og:description['"]`, description);
    html = replaceMeta(html, `\\bname=['"]twitter:description['"]`, description);
    descriptionUpdates += 1;
  }

  html = html
    .replace(/\s*<meta\b[^>]*name=['"]keywords['"][^>]*>/gi, '')
    .replace(/<script\b[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi, (full, json) => {
      try {
        const data = JSON.parse(json);
        const nodes = data['@graph'] || [data];
        const webPage = nodes.find(node => node?.['@type'] === 'WebPage');
        if (webPage) {
          webPage.name = title;
          webPage.description = description;
        }
        return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
      } catch {
        return full;
      }
    });

  fs.writeFileSync(file, html);
}

console.log(`Optimized Italian SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
