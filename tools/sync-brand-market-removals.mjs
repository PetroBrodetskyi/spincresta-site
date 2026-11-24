import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { COUNTRIES } from '../scripts/countries.js';

// Keep existing directory order, review links and commercial copy. Only
// remove the requested markets after the registry has been updated.
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const regionOption = process.argv.find(arg => arg.startsWith('--countries='));
const codes = regionOption?.slice('--countries='.length).toUpperCase().split(',') || [];
const slugs = [...new Set(process.argv.slice(2).filter(arg => !arg.startsWith('--')))];
const apply = process.argv.includes('--apply');
const regions = codes.map(code => COUNTRIES.find(country => country.code.toUpperCase() === code));
if (!regions.length || regions.some(country => !country) || !slugs.length) {
  throw new Error('Usage: node tools/sync-brand-market-removals.mjs --countries=DE,PT [--apply] brand-slug ...');
}
for (const slug of slugs) {
  const brand = BRANDS.find(entry => entry.urlDetail === `brands/${slug}.html`);
  if (!brand?.countries || [...brand.countries, ...(brand.top || [])].some(code => codes.includes(code.toUpperCase()))) {
    throw new Error(`${slug}: remove the selected markets from the registry first`);
  }
}

const namesOf = (locale, code) => new Intl.DisplayNames([locale], { type: 'region' }).of(code);
const normalize = name => name.trim().normalize('NFC').toLowerCase();
let changed = 0;
for (const lang of locales) {
  const prefix = lang === 'en' ? '' : lang + '/';
  const hrefs = new Set(slugs.map(slug => `/${prefix}brands/${slug}/`));
  const names = new Set(codes.flatMap(code => [lang, lang === 'pt' ? 'pt-PT' : lang].map(locale => normalize(namesOf(locale, code)))));

  update(prefix + 'casinos-and-betting/index.html', html => {
    const found = new Set();
    const next = html.replace(/<article\b[^>]*class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g, row => {
      const href = row.match(/<a\b[^>]*class="home-new-review-card"[^>]*href="([^"]+)"/)?.[1];
      if (!hrefs.has(href)) return row;
      if (found.has(href)) throw new Error(`Duplicate directory row: ${href}`);
      found.add(href);
      const fields = [...row.matchAll(/(<p class="casino-bonus">\s*<strong>[^<]+<\/strong>\s*)([^<]+)(<\/p>)/g)];
      if (fields.length !== 3) throw new Error(`Expected type, bonus and market list: ${href}`);
      const [field, open, list, close] = fields[2];
      const remaining = list.trimEnd().split(',').filter(country => !names.has(normalize(country))).join(',').trimStart();
      return row.replace(field, () => open + remaining + list.slice(list.trimEnd().length) + close);
    });
    if (found.size !== hrefs.size) throw new Error(`Missing directory rows in ${lang}: ${[...hrefs].filter(href => !found.has(href)).join(', ')}`);
    return next;
  });

  for (const { slug } of regions) {
    update(`${prefix}online-casinos/${slug}/index.html`, html => {
      const marker = /<!-- crawlable-reviews:start -->[\s\S]*?<!-- crawlable-reviews:end -->/;
      if (!marker.test(html)) throw new Error(`Missing crawlable reviews directory: ${lang}/${slug}`);
      return html.replace(marker, block => {
        const next = block.replace(/^[\t ]*<a href="([^"]+)">[^<]*<\/a>[\t ]*\r?\n/gm,
          (link, href) => hrefs.has(href) ? '' : link);
        if (next === block) return block;
        const count = [...next.matchAll(/<a\b/g)].length;
        return next.replace(/<span>\(\d+\)<\/span>/, `<span>(${count})</span>`);
      });
    });
  }
}

function update(file, transform) {
  const original = readFileSync(file, 'utf8');
  const next = transform(original);
  if (original === next) return;
  changed++;
  if (apply) writeFileSync(file, next);
  else console.error(`Stale market references: ${file}`);
}

console.log(`Partner markets: ${changed} pages ${apply ? 'updated' : 'need updating'}; ${slugs.length} brands, ${codes.join(', ')}.`);
if (!apply && changed) process.exitCode = 1;
