#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const PT_ROOT = path.join(ROOT, 'pt');
const regionNames = new Intl.DisplayNames(['pt-PT'], { type: 'region' });
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
walk(PT_ROOT);

const pagePath = file => `/${path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`),
);

const serviceTitles = {
  '/pt/': 'Casinos online recomendados 2026 | SpinCresta',
  '/pt/about/': 'Sobre o SpinCresta | Método editorial',
  '/pt/blog/': 'Guias de casinos online | Blog SpinCresta',
  '/pt/casinos-and-betting/': 'Casinos e sites de apostas | SpinCresta',
  '/pt/exclusive-offers/': 'Ofertas exclusivas de casinos | SpinCresta',
  '/pt/new-casinos/': 'Novos casinos online 2026 | SpinCresta',
  '/pt/online-casinos/': 'Casinos online por país | SpinCresta',
  '/pt/payment-methods/': 'Métodos de pagamento em casinos | Guia 2026',
  '/pt/privacy-policy/': 'Política de Privacidade | SpinCresta',
  '/pt/responsible-gambling/': 'Jogo responsável | Guia SpinCresta',
  '/pt/top-casinos/': 'Melhores casinos online 2026 | SpinCresta',
  '/pt/top-rated/': 'Casinos online melhor avaliados 2026 | SpinCresta',
};
const serviceDescriptions = {
  '/pt/': 'Compare casinos online, bónus, pagamentos, levantamentos e guias por país. Confirme a disponibilidade e as condições atuais antes de se registar.',
  '/pt/blog/': 'Guias práticos sobre casinos online, bónus, pagamentos, levantamentos, verificação e mercados locais para escolher com mais informação.',
  '/pt/online-casinos/': 'Explore casinos online por país e compare disponibilidade, bónus, pagamentos, levantamentos e ferramentas de jogo responsável.',
  '/pt/payment-methods/': 'Compare cartões, carteiras eletrónicas, transferências bancárias, pagamentos móveis e criptomoedas para depósitos e levantamentos.',
  '/pt/privacy-policy/': 'Saiba como o SpinCresta utiliza dados e cookies, protege a privacidade, gere ligações externas e responde aos pedidos dos utilizadores.',
  '/pt/responsible-gambling/': 'Conselhos e ferramentas de jogo responsável: limites, pausas, autoexclusão, sinais de risco e organizações de apoio.',
};
const brandRegionLabels = {
  'betzino-fr': 'França',
  'casinopeaches-fr': 'França',
  'fortunica-es': 'Espanha',
  'fortunica-nl': 'Países Baixos',
  'fortunica-uk': 'Reino Unido',
  'fraga-ar': 'Argentina',
  'fraga-az': 'Azerbaijão',
  'fraga-cl': 'Chile',
  'fraga-tr': 'Turquia',
  'letsjackpot-fr': 'França',
  'uspin-fr': 'França',
};

let titleUpdates = 0;
let descriptionUpdates = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const route = pagePath(file);
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const brandMatch = route.match(/^\/pt\/brands\/([^/]+)\/$/);
  const brandSlug = brandMatch?.[1] || '';
  const brandRegion = brandRegionLabels[brandSlug] || '';
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = serviceTitles[route] || currentTitle;
  let description = currentDescription;

  if (brandMatch) {
    const name = brandNames.get(brandSlug) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || brandSlug);
    const casinoName = /\bcasino\b/i.test(name) ? name : `${name} Casino`;
    title = brandRegion
      ? `${name} ${brandRegion}: análise do casino 2026`
      : `${casinoName} 2026 | Bónus, jogos e pagamentos`;
    if (title.length > 65) title = `${casinoName} 2026 | Bónus e pagamentos`;
    if (title.length > 65) title = `${name}: análise do casino 2026`;
    if (brandRegion) {
      description = `${name} em ${brandRegion}: análise de bónus, jogos, pagamentos, levantamentos, acesso móvel e disponibilidade. Confirme as condições atuais antes de jogar.`;
    } else if (currentDescription.length > 170) {
      description = `${name}: bónus, jogos, pagamentos, levantamentos, verificação KYC, acesso móvel e disponibilidade. Confirme as condições atuais antes de jogar.`;
    }
  } else if (countryCode) {
    const country = regionNames.of(regionCode(countryCode)) || countryCode;
    title = `${country}: melhores casinos online 2026`;
    if (currentDescription.length > 170) {
      description = `Compare casinos online em ${country}: bónus, pagamentos, levantamentos, disponibilidade e jogo responsável. Confirme as condições antes de se registar.`;
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

console.log(`Optimized Portuguese SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
