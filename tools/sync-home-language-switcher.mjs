import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { headerLanguages, renderHeaderLanguageSwitcher } from '../scripts/header-controls.js';

export const HOME_PAGE_ASSET_VERSION = '20261125-country-guides';
export const HEADER_STYLE_REVISION = '-stable-nav';
export const homeLanguagePaths = new Map(headerLanguages.map(([code]) => [code, code === 'en' ? '/' : `/${code}/`]));

const markerStart = '<!-- home-language-switcher:start -->';
const markerEnd = '<!-- home-language-switcher:end -->';
const markerBlock = /\r?\n[ \t]*<!-- home-language-switcher:start -->[\s\S]*?<!-- home-language-switcher:end -->/g;
const afterBurger = /(<button\b(?=[^>]*\bclass="burger")(?=[^>]*\baria-controls="mobileMenu")[^>]*>[\s\S]*?<\/button>)/;

export function syncHomeLanguageSwitcher(html, locale) {
  if (!homeLanguagePaths.has(locale)) throw new Error(`Unsupported home language: ${locale}`);
  if (!html.includes(`rel="canonical" href="https://spincresta.com${homeLanguagePaths.get(locale)}"`)) {
    throw new Error(`Language switcher must be generated on the ${locale} homepage`);
  }

  const menu = `        ${markerStart}
        ${renderHeaderLanguageSwitcher(locale, code => homeLanguagePaths.get(code))}
        ${markerEnd}`;
  const clean = html.replace(markerBlock, '');
  if (!afterBurger.test(clean)) throw new Error(`Missing homepage header insertion point: ${locale}`);
  return clean
    .replace(afterBurger, (_, button) => `${button}\n${menu}`)
    .replace(/(<script\b[^>]*\bsrc="\/scripts\/main\.js)(?:\?v=[^"]*)?(?=")/, `$1?v=${HOME_PAGE_ASSET_VERSION}`)
    .replace(/(<link\b[^>]*\bhref="\/styles\.css)(?:\?v=[^"]*)?(?=")/, `$1?v=${HOME_PAGE_ASSET_VERSION}${HEADER_STYLE_REVISION}`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const updates = [];
  const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
  for (const [locale, route] of homeLanguagePaths) {
    if (!sitemap.includes(`<loc>https://spincresta.com${route}</loc>`)) {
      throw new Error(`Homepage not in the sitemap: ${route}`);
    }
    const file = `${route.slice(1)}index.html`;
    const before = fs.readFileSync(file, 'utf8');
    const after = syncHomeLanguageSwitcher(before, locale);
    if (before !== after) updates.push([file, after]);
  }
  const apply = process.argv.includes('--apply');
  if (apply) for (const [file, html] of updates) fs.writeFileSync(file, html);
  console.log(`Static home language switchers: ${updates.length} ${apply ? 'updated' : 'pending'}.`);
  if (!apply && updates.length) process.exitCode = 1;
}
