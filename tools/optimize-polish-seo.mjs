#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const PL_ROOT = path.join(ROOT, 'pl');
const regionNames = new Intl.DisplayNames(['pl'], { type: 'region' });
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
walk(PL_ROOT);

const pagePath = file => `/${path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`)
);

const serviceTitles = {
  '/pl/': 'Kasyna online i recenzje | SpinCresta',
  '/pl/about/': 'O nas | Metodologia redakcyjna SpinCresta',
  '/pl/blog/': 'Przewodniki po kasynach online | Blog SpinCresta',
  '/pl/casinos-and-betting/': 'Kasyna i strony bukmacherskie | SpinCresta',
  '/pl/exclusive-offers/': 'Ekskluzywne oferty kasyn | SpinCresta',
  '/pl/new-casinos/': 'Nowe kasyna online 2026 | SpinCresta',
  '/pl/online-casinos/': 'Kasyna online według kraju | SpinCresta',
  '/pl/payment-methods/': 'Metody płatności w kasynach | Poradnik 2026',
  '/pl/privacy-policy/': 'Polityka prywatności | SpinCresta',
  '/pl/responsible-gambling/': 'Odpowiedzialna gra | Poradnik SpinCresta',
  '/pl/top-casinos/': 'Najlepsze kasyna online 2026 | SpinCresta',
  '/pl/top-rated/': 'Najwyżej oceniane kasyna 2026 | SpinCresta',
};
const serviceDescriptions = {
  '/pl/': 'Porównaj kasyna online, bonusy, płatności, wypłaty i przewodniki po krajach. Przed rejestracją sprawdź dostępność i aktualne warunki.',
  '/pl/blog/': 'Praktyczne przewodniki po kasynach online, bonusach, płatnościach, wypłatach, weryfikacji i lokalnych rynkach.',
  '/pl/online-casinos/': 'Przeglądaj kasyna online według kraju i porównuj dostępność, bonusy, płatności, wypłaty oraz narzędzia odpowiedzialnej gry.',
  '/pl/payment-methods/': 'Porównaj karty, e-portfele, przelewy, płatności mobilne i kryptowaluty do wpłat i wypłat w kasynach online.',
  '/pl/privacy-policy/': 'Sprawdź, jak SpinCresta wykorzystuje dane i pliki cookie, chroni prywatność, obsługuje linki zewnętrzne i żądania użytkowników.',
  '/pl/responsible-gambling/': 'Wskazówki i narzędzia odpowiedzialnej gry: limity, przerwy, samowykluczenie, sygnały ryzyka i organizacje pomocowe.',
};

let titleUpdates = 0;
let descriptionUpdates = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const route = pagePath(file);
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const brandMatch = route.match(/^\/pl\/brands\/([^/]+)\/$/);
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = serviceTitles[route] || currentTitle;
  let description = serviceDescriptions[route] || currentDescription;

  if (brandMatch) {
    const name = brandNames.get(brandMatch[1]) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || brandMatch[1]);
    const casinoName = /\bcasino\b/i.test(name) ? name : `${name} Casino`;
    title = `${casinoName} 2026 | Bonusy, gry i płatności`;
    if (title.length > 65) title = `${casinoName} 2026 | Bonusy i płatności`;
    if (title.length > 65) title = `${name}: recenzja kasyna 2026`;
    description = `${name}: bonusy, gry, płatności, wypłaty, weryfikacja KYC, wersja mobilna i dostępność. Przed grą sprawdź aktualne warunki.`;
  } else if (countryCode) {
    const country = regionNames.of(regionCode(countryCode)) || countryCode;
    title = `${country}: najlepsze kasyna online 2026`;
    if (currentDescription.length > 170) {
      description = `Porównaj kasyna online w kraju ${country}: bonusy, płatności, wypłaty, dostępność i odpowiedzialną grę. Sprawdź warunki przed rejestracją.`;
    }
  }

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

console.log(`Optimized Polish SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
