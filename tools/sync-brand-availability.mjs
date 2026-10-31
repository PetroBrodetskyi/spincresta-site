import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { BRANDS } from '../scripts/brands.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const slugFor = brand => brand.urlDetail.replace(/^\/?brands\//, '').replace(/\.html$/, '');

// Reuse the site's established unavailable treatment and reviewed translations.
// Retrobet is the reference; do not invent a closure/legal warning for a brand.
export function unavailableLabel(locale) {
  if (!locales.includes(locale)) throw new Error(`Unknown locale: ${locale}`);
  const html = fs.readFileSync(path.join(root, `${prefix(locale)}brands/retrobet/index.html`), 'utf8');
  const label = html.match(/<button\b[^>]*class="[^"]*cta-blocked[^"]*"[^>]*>([^<]+)<\/button>/)?.[1];
  if (!label) throw new Error(`Missing Retrobet unavailable label: ${locale}`);
  return label;
}

function disableCtas(html, className, label) {
  return html.replace(/<a\b([^>]*)>[\s\S]*?<\/a\s*>/g, (anchor, attributes) => {
    const classes = attributes.match(/\bclass="([^"]*)"/)?.[1]?.split(/\s+/) || [];
    if (!classes.includes(className)) return anchor;
    // Catalog rows may also contain internal review links; keep them accessible.
    const href = attributes.match(/\bhref="([^"]*)"/)?.[1] || '';
    if (className === 'cta' && !/^https?:\/\//.test(href)) return anchor;
    if (!classes.includes('cta-blocked')) classes.push('cta-blocked');
    return `<button class="${classes.join(' ')}" type="button" disabled aria-disabled="true">${label}</button>`;
  });
}

export function syncUnavailableBrandMarkup(html, brand, locale) {
  if (!brand?.temporarilyUnavailable || !brand.notRecommended) return html;
  const slug = slugFor(brand);
  const label = unavailableLabel(locale);
  const pageBrand = html.match(/<body\b[^>]*\bdata-brand="([^"]+)"/)?.[1];
  if (pageBrand === slug) return disableCtas(html, 'cta-brands', label);

  return html.replace(/<article\b[^>]*class="casino-list-row"[\s\S]*?<\/article>/g, row => {
    if (!row.includes(`brands/${slug}/`) && !row.includes(`brands/${slug}.html`)) return row;
    return disableCtas(row, 'cta', label);
  });
}

function main() {
  const apply = process.argv.includes('--apply');
  const slugs = process.argv.slice(2).filter(argument => !argument.startsWith('--'));
  const brands = slugs.length
    ? slugs.map(slug => {
      const brand = BRANDS.find(item => slugFor(item) === slug);
      if (!brand?.temporarilyUnavailable || !brand.notRecommended || brand.urlCasino) {
        throw new Error(`Expected an unavailable brand with no casino destination: ${slug}`);
      }
      return brand;
    })
    : BRANDS.filter(brand => brand.temporarilyUnavailable && brand.notRecommended && !brand.urlCasino);
  let changed = 0;
  for (const locale of locales) {
    const files = [`${prefix(locale)}casinos-and-betting/index.html`, ...brands.map(brand => `${prefix(locale)}brands/${slugFor(brand)}/index.html`)];
    for (const relative of files) {
      const file = path.join(root, relative);
      const html = fs.readFileSync(file, 'utf8');
      const next = brands.reduce((markup, brand) => syncUnavailableBrandMarkup(markup, brand, locale), html);
      if (next === html) continue;
      changed++;
      if (apply) fs.writeFileSync(file, next);
    }
  }
  console.log(`Unavailable brand CTAs: ${changed} pages ${apply ? 'updated' : 'need updating'}; ${brands.length} brands, ${locales.length} locales.`);
  if (!apply && changed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
