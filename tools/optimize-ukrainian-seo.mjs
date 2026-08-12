#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const UK_ROOT = path.join(ROOT, 'uk');
const regionNames = new Intl.DisplayNames(['uk'], { type: 'region' });
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
walk(UK_ROOT);

const pagePath = file => `/${path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`)
);

const serviceTitles = {
  '/uk/': 'Онлайн-казино й огляди 2026 | SpinCresta',
  '/uk/about/': 'Про SpinCresta | Редакційна методологія',
  '/uk/blog/': 'Гіди онлайн-казино | Блог SpinCresta',
  '/uk/casinos-and-betting/': 'Казино та букмекерські сайти | SpinCresta',
  '/uk/exclusive-offers/': 'Ексклюзивні пропозиції казино | SpinCresta',
  '/uk/new-casinos/': 'Нові онлайн-казино 2026 | SpinCresta',
  '/uk/online-casinos/': 'Онлайн-казино за країнами | SpinCresta',
  '/uk/payment-methods/': 'Способи оплати в казино | Гід 2026',
  '/uk/privacy-policy/': 'Політика конфіденційності | SpinCresta',
  '/uk/responsible-gambling/': 'Відповідальна гра | Гід SpinCresta',
  '/uk/top-casinos/': 'Найкращі онлайн-казино 2026 | SpinCresta',
  '/uk/top-rated/': 'Найвище оцінені казино 2026 | SpinCresta',
};
const serviceDescriptions = {
  '/uk/': 'Порівнюйте онлайн-казино, бонуси, способи оплати, виплати та гіди за країнами. Перед реєстрацією перевіряйте доступність і актуальні умови.',
  '/uk/blog/': 'Практичні гіди про онлайн-казино, бонуси, способи оплати, виплати, верифікацію та особливості різних ринків.',
  '/uk/online-casinos/': 'Переглядайте онлайн-казино за країнами та порівнюйте доступність, бонуси, способи оплати, виплати й інструменти відповідальної гри.',
  '/uk/payment-methods/': 'Порівняйте картки, електронні гаманці, перекази, мобільні платежі та криптовалюти для депозитів і виплат в онлайн-казино.',
  '/uk/privacy-policy/': 'Дізнайтеся, як SpinCresta використовує дані й файли cookie, захищає приватність, працює із зовнішніми посиланнями та запитами користувачів.',
  '/uk/responsible-gambling/': 'Поради та інструменти відповідальної гри: ліміти, перерви, самовиключення, ознаки ризику й організації підтримки.',
};

let titleUpdates = 0;
let descriptionUpdates = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const route = pagePath(file);
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const brandMatch = route.match(/^\/uk\/brands\/([^/]+)\/$/);
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = serviceTitles[route] || currentTitle;
  let description = serviceDescriptions[route] || currentDescription;

  if (brandMatch) {
    const name = brandNames.get(brandMatch[1]) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || brandMatch[1]);
    const casinoName = /\bcasino\b/i.test(name) ? name : `${name} Casino`;
    title = `${casinoName}: огляд 2026 | Бонуси та виплати`;
    if (title.length > 65) title = `${casinoName}: огляд і бонуси 2026`;
    if (title.length > 65) title = `${name}: огляд казино 2026`;
    description = `${name}: бонуси, ігри, способи оплати, виплати, KYC, мобільна версія та доступність. Перед грою перевірте актуальні умови.`;
  } else if (countryCode) {
    const country = regionNames.of(regionCode(countryCode)) || countryCode;
    title = `${country}: найкращі онлайн-казино 2026`;
    if (currentDescription.length > 170) {
      description = `Порівняйте онлайн-казино для гравців з країни ${country}: бонуси, способи оплати, виплати, доступність і відповідальну гру.`;
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

console.log(`Optimized Ukrainian SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
