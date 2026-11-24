import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';
import { COUNTRIES } from '../scripts/countries.js';
import { syncCountryHeader } from './sync-country-header.mjs';
import { syncCountryHubLinks } from './country-hub-links.mjs';
import { syncTopCasinoMarkets } from './top-casino-markets.mjs';
import { syncHomeLanguageSwitcher } from './sync-home-language-switcher.mjs';

const root = process.cwd();
const countryHeaderOnly = process.argv.includes('--country-header-only');
const topCasinosOnly = process.argv.includes('--top-casinos-only');
const brandSlug = process.argv.find(arg => arg.startsWith('--brand='))?.slice('--brand='.length);
const onlyBrand = brandSlug && BRANDS.find(brand => brand.urlDetail === `brands/${brandSlug}.html`);
if (brandSlug && !onlyBrand) throw new Error(`Unknown brand: ${brandSlug}`);
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const labels = {
  en: 'Browse casino reviews', de: 'Casino-Bewertungen ansehen', es: 'Ver reseñas de casinos',
  it: 'Consulta le recensioni dei casinò', pl: 'Przeglądaj recenzje kasyn', uk: 'Переглянути огляди казино',
  pt: 'Ver análises de casinos', fr: 'Consulter les avis sur les casinos', hi: 'कैसीनो समीक्षाएँ देखें', fi: 'Tutustu kasinoarvosteluihin',
};
const escape = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
  if (entry.name.startsWith('.') || ['node_modules', 'tmp', 'tools'].includes(entry.name)) return [];
  const file = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(file) : entry.name === 'index.html' ? [file] : [];
});
const pages = new Map(walk(root).map(file => [
  '/' + path.relative(root, file).replace(/index\.html$/, ''), { file, html: fs.readFileSync(file, 'utf8') },
]));
const indexable = url => pages.has(url) && !/<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(pages.get(url).html);
const countryLinks = (locale, prefix, rankings = false) => {
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  return COUNTRIES.filter(country => indexable(`${prefix}online-casinos/${country.slug}/`)).map(country => {
    const code = country.code.toUpperCase() === 'UK' ? 'GB' : country.code.toUpperCase();
    const name = escape(locale === 'en' ? country.name : names.of(code));
    const picker = rankings ? ` data-top-casino-country="${country.slug}"` : '';
    return `<a class="country-link" href="${prefix}online-casinos/${country.slug}/"${picker}><img class="flag" src="/icons/${country.slug}-flag-icon.svg" alt="" loading="lazy" decoding="async"><span>${name}</span></a>`;
  }).join('\n');
};
let updated = 0;
for (const [url, page] of pages) {
  const locale = locales.find(lang => lang !== 'en' && url.startsWith(`/${lang}/`)) || 'en';
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  const country = COUNTRIES.find(c => url === `${prefix}online-casinos/${c.slug}/`);
  if (topCasinosOnly && url !== `${prefix}top-casinos/`) continue;
  if (onlyBrand && (!country || !onlyBrand.countries?.includes(country.code.toUpperCase()))) continue;
  let html = syncCountryHeader(page.html, prefix);
  if (!countryHeaderOnly && url === prefix) html = syncHomeLanguageSwitcher(html, locale);
  // Home and country hubs expose the complete directory before JS executes.
  if (!countryHeaderOnly && url === `${prefix}top-casinos/`) {
    html = syncTopCasinoMarkets(html, locale, countryLinks(locale, prefix, true));
  } else if (!countryHeaderOnly && url === `${prefix}online-casinos/` && html.includes('data-country-hub-grid')) {
    html = syncCountryHubLinks(html, locale, indexable);
  } else if (!countryHeaderOnly && (url === prefix || url === `${prefix}online-casinos/`)) {
    const links = countryLinks(locale, prefix);
    html = html.replace(/(<div class="countries-cloud">)[\s\S]*?(<\/div>)/, `$1\n${links}\n$2`);
  }
  if (!countryHeaderOnly && country && html.includes('id="brand-cards"')) {
    const seen = new Set();
    const brands = BRANDS.filter(b => b.hasDetailPage && b.countries?.includes(country.code.toUpperCase()))
      .sort((a, b) => (a.countryPagePriority || 999) - (b.countryPagePriority || 999) || a.name.localeCompare(b.name, locale))
      .flatMap(b => {
        const href = prefix + b.urlDetail.replace(/^\//, '').replace(/\.html$/, '/');
        if (!indexable(href) || seen.has(href)) return [];
        seen.add(href);
        return [`<a href="${href}">${escape(b.name)}</a>`];
      });
    const start = '<!-- crawlable-reviews:start -->';
    const end = '<!-- crawlable-reviews:end -->';
    const current = html.match(/<!-- crawlable-reviews:start -->[\s\S]*?<!-- crawlable-reviews:end -->/)?.[0];
    if (onlyBrand && current) {
      const href = `${prefix}brands/${brandSlug}/`;
      const link = brands.find(row => row.includes(`href="${href}"`));
      if (link && !current.includes(`href="${href}"`)) {
        const count = [...current.matchAll(/<a\b/g)].length + 1;
        html = html.replace(current, current.replace(/<span>\(\d+\)<\/span>/, `<span>(${count})</span>`)
          .replace('</nav></details>', `${link}\n</nav></details>`));
      }
      if (html !== page.html) { fs.writeFileSync(page.file, html); updated++; }
      continue;
    }
    html = html.replace(/\n?<!-- crawlable-reviews:start -->[\s\S]*?<!-- crawlable-reviews:end -->/g, '');
    if (brands.length) {
      const directory = `\n${start}\n<details class="country-review-directory"><summary>${labels[locale]} <span>(${brands.length})</span></summary><nav aria-label="${labels[locale]}">\n${brands.join('\n')}\n</nav></details>\n${end}`;
      html = html.replace(/(<div class="load-more-wrapper">[\s\S]*?<\/div>)/, `$1${directory}`);
    }
  }
  if (html !== page.html) { fs.writeFileSync(page.file, html); updated++; }
}
console.log(`Updated crawlable navigation on ${updated} pages.`);
