#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const root = process.cwd();
const spanishRoot = path.join(root, 'es');
const regionNames = new Intl.DisplayNames(['es'], { type: 'region' });
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
walk(spanishRoot);

const pagePath = file => `/${path.relative(root, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`)
);
const serviceTitles = {
  '/es/about/': 'Sobre SpinCresta | Método editorial',
  '/es/payment-methods/': 'Métodos de pago para casinos online | Guía 2026',
  '/es/privacy-policy/': 'Política de privacidad de SpinCresta',
  '/es/responsible-gambling/': 'Juego responsable | Guía de SpinCresta',
};
const serviceDescriptions = {
  '/es/': 'Compara casinos online, bonos, pagos, retiros y guías por país. Revisa la disponibilidad y las condiciones actuales antes de registrarte.',
  '/es/blog/': 'Guías prácticas sobre casinos online, bonos, pagos, retiros, verificación y mercados locales para tomar decisiones mejor informadas.',
  '/es/blog/how-to-choose-an-online-casino/': 'Lista práctica para elegir un casino online: licencia, bonos, pagos, retiros, soporte, protección de datos y juego responsable.',
  '/es/online-casinos/': 'Explora casinos online por país y compara disponibilidad, licencias, bonos, métodos de pago, retiros y herramientas de juego responsable.',
  '/es/payment-methods/': 'Compara tarjetas, monederos electrónicos, transferencias, pagos móviles y criptomonedas para depósitos y retiros en casinos online.',
  '/es/privacy-policy/': 'Consulta cómo SpinCresta utiliza analítica y cookies, protege los datos, gestiona enlaces externos y atiende solicitudes de privacidad.',
  '/es/responsible-gambling/': 'Consejos y herramientas para jugar de forma responsable: límites, pausas, autoexclusión, señales de riesgo y organizaciones de ayuda.',
  '/es/top-rated/': 'Compara casinos online mejor valorados por seguridad, bonos, pagos, retiros, soporte, experiencia móvil y herramientas de juego responsable.',
};
const brandRegionLabels = {
  'betzino-fr': 'Francia',
  'casinopeaches-fr': 'Francia',
  'fortunica-es': 'España',
  'fortunica-nl': 'Países Bajos',
  'fortunica-uk': 'Reino Unido',
  'fraga-ar': 'Argentina',
  'fraga-az': 'Azerbaiyán',
  'fraga-cl': 'Chile',
  'fraga-tr': 'Turquía',
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
  const brandMatch = route.match(/^\/es\/brands\/([^/]+)\/$/);
  const brandSlug = brandMatch?.[1] || '';
  const brandRegion = brandRegionLabels[brandSlug] || '';
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = currentTitle;
  let description = currentDescription;

  if (currentTitle.length > 65) {
    if (brandMatch) {
      const name = brandNames.get(brandMatch[1]) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || brandMatch[1]);
      title = `${name} Casino 2026 | Bonos, juegos y pagos`;
      if (title.length > 65) title = `${name} Casino 2026 | Bonos y pagos`;
      if (title.length > 65) title = `${name}: reseña de casino 2026`;
    } else if (countryCode) {
      const country = regionNames.of(regionCode(countryCode)) || countryCode;
      title = `${country}: mejores casinos online 2026`;
    } else {
      title = serviceTitles[route] || currentTitle.replaceAll('Bonificaciones', 'Bonos').replaceAll('billeteras electrónicas', 'e-wallets');
    }
  }

  if (currentDescription.length > 170) {
    if (brandMatch) {
      const name = brandNames.get(brandMatch[1]) || brandMatch[1];
      description = `${name}: bonos, juegos, pagos, retiros, verificación KYC, acceso móvil y disponibilidad. Consulta las condiciones actuales antes de jugar.`;
    } else if (countryCode) {
      const country = regionNames.of(regionCode(countryCode)) || countryCode;
      description = `Compara casinos online en ${country}: licencias, bonos, pagos, retiros, disponibilidad y juego responsable. Revisa las condiciones antes de registrarte.`;
    } else {
      description = serviceDescriptions[route] || currentDescription
        .replaceAll('bonificaciones', 'bonos')
        .replaceAll('herramientas de juego más seguro', 'juego responsable')
        .replaceAll('casinos en línea', 'casinos online');
    }
  }

  if (brandMatch && brandRegion) {
    const name = brandNames.get(brandSlug) || brandSlug;
    title = `${name} ${brandRegion} Casino 2026 | Bonos y pagos`;
    if (title.length > 65) title = `${name} ${brandRegion}: reseña 2026`;
    description = `${name} en ${brandRegion}: bonos, juegos, pagos, retiros, KYC y disponibilidad. Consulta las condiciones actuales antes de jugar.`;
  }

  if (serviceDescriptions[route] && currentDescription.length > 170) {
    description = serviceDescriptions[route];
  }

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

console.log(`Optimized Spanish SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
