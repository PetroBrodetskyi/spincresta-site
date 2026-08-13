#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const FR_ROOT = path.join(ROOT, 'fr');
const regionNames = new Intl.DisplayNames(['fr'], { type: 'region' });
const regionCode = code => code === 'UK' ? 'GB' : code;
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const encode = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = value => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const brandNames = new Map(
  BRANDS.filter(brand => brand.urlDetail).map(brand => {
    const slug = brand.urlDetail.replace(/^.*?brands\//, '').replace(/\.html$/, '').replace(/\/$/, '');
    return [slug, brand.name];
  }),
);

const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name === 'index.html') files.push(target);
  }
};
walk(FR_ROOT);

const pagePath = file => `/${path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`),
);

const serviceTitles = {
  '/fr/': 'Casinos en ligne recommandés 2026 | SpinCresta',
  '/fr/about/': 'À propos de SpinCresta | Méthode éditoriale',
  '/fr/blog/': 'Guides des casinos en ligne | Blog SpinCresta',
  '/fr/casinos-and-betting/': 'Casinos et sites de paris | SpinCresta',
  '/fr/exclusive-offers/': 'Offres exclusives des casinos | SpinCresta',
  '/fr/new-casinos/': 'Nouveaux casinos en ligne 2026 | SpinCresta',
  '/fr/online-casinos/': 'Casinos en ligne par pays | SpinCresta',
  '/fr/partners/': 'Partenaires de SpinCresta | Collaborations',
  '/fr/payment-methods/': 'Moyens de paiement des casinos | Guide 2026',
  '/fr/privacy-policy/': 'Politique de confidentialité | SpinCresta',
  '/fr/responsible-gambling/': 'Jeu responsable | Guide SpinCresta',
  '/fr/top-casinos/': 'Meilleurs casinos en ligne 2026 | SpinCresta',
  '/fr/top-rated/': 'Casinos en ligne les mieux notés 2026 | SpinCresta',
};
const serviceDescriptions = {
  '/fr/': 'Comparez les casinos en ligne, les bonus, les paiements, les retraits et les guides par pays. Vérifiez les conditions avant de vous inscrire.',
  '/fr/about/': 'Découvrez la méthode éditoriale de SpinCresta, nos critères de comparaison, nos sources et la façon dont nous actualisons les avis.',
  '/fr/blog/': 'Guides pratiques sur les casinos, les bonus, les paiements, les retraits, la vérification et les marchés locaux.',
  '/fr/casinos-and-betting/': 'Parcourez les casinos et sites de paris de A à Z avec leurs pays disponibles, offres, moyens de paiement et avis détaillés.',
  '/fr/online-casinos/': 'Explorez les casinos en ligne par pays et comparez disponibilité, bonus, paiements, retraits et jeu responsable.',
  '/fr/partners/': 'Découvrez les partenaires sélectionnés de SpinCresta et notre approche des collaborations dans le secteur des jeux en ligne.',
  '/fr/payment-methods/': 'Comparez cartes, portefeuilles électroniques, virements, paiements mobiles et cryptomonnaies pour dépôts et retraits.',
  '/fr/privacy-policy/': 'Découvrez comment SpinCresta utilise les données et les cookies, protège votre vie privée et gère les liens externes.',
  '/fr/responsible-gambling/': 'Conseils et outils de jeu responsable : limites, pauses, auto-exclusion, signes de risque et organismes d’aide.',
  '/fr/top-casinos/': 'Comparez nos sélections de casinos en ligne par pays, avec bonus, paiements, retraits et informations pratiques.',
};
const brandRegionLabels = {
  'betzino-fr': 'France',
  'casinopeaches-fr': 'France',
  'fortunica-es': 'Espagne',
  'fortunica-nl': 'Pays-Bas',
  'fortunica-uk': 'Royaume-Uni',
  'fraga-ar': 'Argentine',
  'fraga-az': 'Azerbaïdjan',
  'fraga-cl': 'Chili',
  'fraga-tr': 'Turquie',
  'letsjackpot-fr': 'France',
  'uspin-fr': 'France',
};

let titleUpdates = 0;
let descriptionUpdates = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const route = pagePath(file);
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const brandMatch = route.match(/^\/fr\/brands\/([^/]+)\/$/);
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = serviceTitles[route] || currentTitle;
  let description = serviceDescriptions[route] || currentDescription;

  if (brandMatch) {
    const slug = brandMatch[1];
    const name = brandNames.get(slug) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || slug);
    const h1 = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
    const coversSports = /pari|sport|e-sport/i.test(h1);
    const region = brandRegionLabels[slug];
    title = region
      ? `Avis ${name} en ${region} 2026 | Bonus et paiements`
      : coversSports
        ? `Avis ${name} 2026 | Casino, paris et paiements`
        : `Avis ${name} 2026 | Bonus, jeux et paiements`;
    description = region
      ? `${name} en ${region} : bonus, jeux, paiements, retraits, vérification KYC et disponibilité. Vérifiez les conditions avant de jouer.`
      : `${name} : bonus, jeux, paiements, retraits, vérification KYC, accès mobile et disponibilité. Vérifiez les conditions avant de jouer.`;
  } else if (countryCode) {
    const country = regionNames.of(regionCode(countryCode)) || countryCode;
    title = `Meilleurs casinos en ligne en ${country} 2026`;
    description = `Comparez les casinos en ligne en ${country} : bonus, paiements, retraits, disponibilité et jeu responsable. Vérifiez les conditions avant de vous inscrire.`;
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

  html = html.replace(/<script\b[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi, (full, json) => {
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

console.log(`Optimized French SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
