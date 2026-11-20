import fs from 'node:fs';
import { COUNTRIES } from '../scripts/countries.js';

const escape = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const aliases = {
  uk: 'GB Great Britain Britain',
  us: 'USA United States of America',
  ae: 'UAE',
  cz: 'Czechia',
  kr: 'Republic of Korea',
  vn: 'Viet Nam',
};
const hasGuide = href => {
  const file = new URL(`..${href}index.html`, import.meta.url);
  return fs.existsSync(file) && !/<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["'][^"']*noindex/i.test(fs.readFileSync(file, 'utf8'));
};

export function renderCountryHubLinks(locale, include = hasGuide) {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const collator = new Intl.Collator(locale, { sensitivity: 'base' });
  return COUNTRIES.map(country => {
    const { code, slug, name } = country;
    const label = locale === 'en' ? name : names.of(code === 'uk' ? 'GB' : code.toUpperCase());
    return { slug, label, href: `${prefix}/online-casinos/${slug}/`, words: [name, code, aliases[code]].filter(Boolean).join(' ') };
  }).filter(({ href }) => include(href)).sort((a, b) => collator.compare(a.label, b.label))
    .map(({ slug, label, href, words }) => `<a class="country-hub-link" href="${href}" data-country-keywords="${escape(words)}"><img src="/icons/${slug}-flag-icon.svg" alt="" width="32" height="24" loading="lazy" decoding="async"><span>${escape(label)}</span></a>`);
}

export function syncCountryHubLinks(html, locale, include) {
  return html.replace(/(<div class="country-hub-grid" data-country-hub-grid>)[\s\S]*?(<\/div>)/,
    (_, open, close) => `${open}\n              ${renderCountryHubLinks(locale, include).join('\n              ')}\n            ${close}`);
}
