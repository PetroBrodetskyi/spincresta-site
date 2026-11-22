import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { syncTopCasinoEditorial } from './top-casino-markets.mjs';

const locales = ['', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const listingIcons = {
  'new-casinos': ['bonus', 'payments', 'phone', 'safety', 'review'],
  'top-rated': ['star', 'wallet', 'bonus', 'games', 'chat'],
  'exclusive-offers': ['wallet', 'review', 'bonus', 'clock', 'link'],
};

const sections = {
  'top-casinos': [
    ['class="top-casinos-method-grid"', ['safety', 'games', 'bonus', 'payments', 'clock']],
  ],
};

export function editorialCardPages() {
  return locales.flatMap(locale => [...Object.keys(listingIcons), ...Object.keys(sections)]
    .map(page => ({ page, file: path.join(locale, page, 'index.html') })));
}

function replaceCards(html, icons, ordered = false) {
  let count = 0;
  const result = html.replace(/<article(?: class="top-casinos-method-card[^"]*")?>(\s*)(?:<span[^>]*>(\d{2})<\/span>\s*)?(?=<h3>)/g,
    (_, spacing, number) => {
      const icon = icons[count++];
      if (!icon || (ordered && Number(number) !== count)) throw new Error('Unexpected editorial card order');
      const step = ordered ? `${spacing}<span class="editorial-card-step">${number}</span>` : '';
      return `<article>${spacing}${siteIconMarkup(icon, 'home-method-icon', 40)}${step}${spacing}`;
    });
  if (count !== icons.length) throw new Error(`Expected ${icons.length} editorial cards, found ${count}`);
  return result;
}

export function syncEditorialCardSections(html, page) {
  const topCasinos = page === 'top-casinos';
  const locale = html.match(/<html\b[^>]*\blang="([a-z]{2})/i)?.[1]?.toLowerCase() || 'en';
  const content = topCasinos ? syncTopCasinoEditorial(html, locale) : html;
  let index = 0;
  const listing = Object.hasOwn(listingIcons, page) ? listingIcons[page] : null;
  const knownSections = Object.hasOwn(sections, page) ? sections[page] : [];
  const updated = content.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, section => {
    if (section.startsWith('<section') && section.match(/^<section[^>]*\bdata-editorial-columns=/)) {
      index++;
      return section;
    }
    if (listing) {
      if (!section.includes('<div class="timeline">')) return section;
      index++;
      return section
        .replace('<section class="content">', `<section class="editorial-card-band" aria-labelledby="editorial-cards-title" data-editorial-columns="${listing.length}">`)
        .replace('<div class="container content-article">', '<div class="container editorial-card-inner">')
        .replace(/<h2 class="title">([\s\S]*?)<\/h2>/, '<div class="home-showcase-heading"><div><h2 id="editorial-cards-title">$1</h2></div></div>')
        .replace('<div class="timeline">', '<div class="home-method-grid">')
        .replace(/<div>(\s*<h3>[\s\S]*?)<\/div>/g, '<article>$1</article>')
        .replace(/<div class="home-method-grid">[\s\S]*/, tail => replaceCards(tail, listing)
          .replace(/(\s*)<\/section>$/, (_end, spacing) => {
            // Some listing templates omitted the closing content wrapper.
            const wrappers = (tail.match(/<\/div>/g) || []).length;
            return `${wrappers === 1 ? '\n        </div>' : ''}${spacing}</section>`;
          }));
    }
    const config = knownSections[index];
    if (!config || !section.includes(config[0])) return section;
    const [, icons, ordered] = config;
    index++;
    let replacement = section
      .replace(/^<section class="([^"]+)"/, `<section class="$1 editorial-card-band" data-editorial-columns="${icons.length}"`)
      .replace('class="top-casinos-method-panel"', 'class="editorial-card-inner"')
      .replace(/class="(?:author-intro|top-casinos-method-head)"/, 'class="home-showcase-heading"')
      .replace(/class="(?:author-focus-grid|top-casinos-method-grid)"/, 'class="home-method-grid"');
    return replaceCards(replacement, icons, ordered);
  });
  const expected = listing ? 1 : knownSections.length;
  if (index !== expected) throw new Error(`Expected ${expected} editorial sections on ${page}, found ${index}`);
  return topCasinos
    ? syncTopCasinoEditorial(updated, locale).replace(/(<div class="casino-grid") data-limit="\d+"/g, '$1')
    : updated;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apply = process.argv.includes('--apply');
  const pages = editorialCardPages();
  let changed = 0;
  for (const { page, file } of pages) {
    const html = fs.readFileSync(file, 'utf8');
    const updated = syncEditorialCardSections(html, page);
    if (updated === html) continue;
    changed++;
    if (apply) fs.writeFileSync(file, updated);
    else console.log(file);
  }
  console.log(`Editorial cards: ${pages.length} pages, ${changed} ${apply ? 'updated' : 'pending'}.`);
  if (!apply && changed) process.exitCode = 1;
}
