import fs from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { COUNTRIES } from '../scripts/countries.js';

const labels = {
  en: 'Choose a country',
  de: 'Land auswählen',
  es: 'Elegir un país',
  it: 'Scegli un paese',
  pl: 'Wybierz kraj',
  uk: 'Вибрати країну',
  pt: 'Escolher um país',
  fr: 'Choisir un pays',
  hi: 'देश चुनें',
  fi: 'Valitse maa',
};

const root = new URL('../', import.meta.url);

export function simplifyCountryCatalog(html, locale, country) {
  const choose = labels[locale];
  if (!new RegExp(`<body\\b[^>]*\\bdata-country="${country.code.toUpperCase()}"`).test(html)) {
    throw new Error('Expected the country guide for ' + country.slug);
  }
  if (html.includes('class="content country-catalog-results"')) {
    return html.replace(/\n[ \t]*<details class="country-catalog-intro">[\s\S]*?<\/details>/, '');
  }

  const heroPattern = /(<main\b[^>]*>\s*(?:<!-- HERO -->\s*)?)<section class="hero container">([\s\S]*?)<\/section>/i;
  const resultsPattern = /<section class="content">(\s*<div class="container">(?:\s*<div class="country-brand-stage">\s*<div class="country-brand-main">)?)\s*(<header class="section-head">[\s\S]*?<\/header>)\s*(<p class="intro">[\s\S]*?<\/p>)(\s*<div class="casino-grid" id="brand-cards">[\s\S]*?)(\s*<\/div>\s*<\/section>)/;
  if (!heroPattern.test(html) || !resultsPattern.test(html)) throw new Error('Unexpected layout for ' + country.slug);
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  return html.replace(heroPattern, (_, opening, body) => {
    const heading = body.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0];
    if (!heading) throw new Error('Missing heading for ' + country.slug);
    return `${opening}<section class="home-country-hero country-catalog-heading container">
        <div class="home-country-hero-heading">
          <div class="country-catalog-title">
            <img src="/icons/${country.slug}-flag-icon.svg" alt="" width="32" height="22" />
            ${heading}
          </div>
          <a class="home-country-return" href="${prefix}">${choose}</a>
        </div>
      </section>`;
  }).replace(resultsPattern, (_, opening, _heading, _intro, cards, closing) =>
    `<section class="content country-catalog-results">${opening}${cards}${closing}`
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const apply = process.argv.includes('--apply');
  const pages = [];
  for (const locale of Object.keys(labels)) {
    for (const country of COUNTRIES) {
      const prefix = locale === 'en' ? '' : `${locale}/`;
      const file = new URL(`${prefix}online-casinos/${country.slug}/index.html`, root);
      const html = fs.readFileSync(file, 'utf8');
      const next = simplifyCountryCatalog(html, locale, country);
      if (next !== html) pages.push([file, next]);
    }
  }
  if (apply) for (const [file, html] of pages) fs.writeFileSync(file, html);
  console.log(`Country catalogs: ${pages.length} ${apply ? 'updated' : 'need updating'}.`);
  if (!apply && pages.length) process.exitCode = 1;
}
