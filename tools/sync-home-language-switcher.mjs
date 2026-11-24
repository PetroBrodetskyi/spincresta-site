import fs from 'node:fs';
import { pathToFileURL } from 'node:url';

export const HOME_LANGUAGE_ENTRY_VERSION = '20261123-static-home-languages';
const languages = [
  ['en', 'united-kingdom', 'English', 'Choose language'],
  ['de', 'germany', 'Deutsch', 'Sprache auswählen'],
  ['es', 'spain', 'Español', 'Elegir idioma'],
  ['it', 'italy', 'Italiano', 'Scegli la lingua'],
  ['pl', 'poland', 'Polski', 'Wybierz język'],
  ['uk', 'ukraine', 'Українська', 'Вибрати мову'],
  ['pt', 'portugal', 'Português', 'Escolher idioma'],
  ['fr', 'france', 'Français', 'Choisir la langue'],
  ['hi', 'india', 'हिन्दी', 'भाषा चुनें'],
  ['fi', 'finland', 'Suomi', 'Valitse kieli'],
];

export const homeLanguagePaths = new Map(languages.map(([code]) => [code, code === 'en' ? '/' : `/${code}/`]));

const markerStart = '<!-- home-language-switcher:start -->';
const markerEnd = '<!-- home-language-switcher:end -->';
const markerBlock = /\r?\n[ \t]*<!-- home-language-switcher:start -->[\s\S]*?<!-- home-language-switcher:end -->/g;
const afterBurger = /(<button\b(?=[^>]*\bclass="burger")(?=[^>]*\baria-controls="mobileMenu")[^>]*>[\s\S]*?<\/button>)(\s*<\/div>\s*<!-- MOBILE MENU -->)/;
const flag = name => `<img src="/icons/${name}-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />`;
const codeLabel = code => `<span class="language-switcher-code" aria-hidden="true">${code.toUpperCase()}</span>`;

export function syncHomeLanguageSwitcher(html, locale) {
  const current = languages.find(([code]) => code === locale);
  if (!current) throw new Error(`Unsupported home language: ${locale}`);
  if (!html.includes(`rel="canonical" href="https://spincresta.com${homeLanguagePaths.get(locale)}"`)) {
    throw new Error(`Language switcher must be generated on the ${locale} homepage`);
  }

  const options = languages.map(([code, icon, name]) =>
    `            <a class="language-switcher-option" href="${homeLanguagePaths.get(code)}" lang="${code}" aria-label="${name}" title="${name}"${code === locale ? ' aria-current="page"' : ''}>${flag(icon)}${codeLabel(code)}</a>`
  ).join('\n');
  const menu = `        ${markerStart}
        <details class="language-switcher" data-static-language-switcher>
          <summary class="language-switcher-current" aria-label="${current[3]}">${flag(current[1])}${codeLabel(locale)}</summary>
          <div class="language-switcher-menu">
${options}
          </div>
        </details>
        ${markerEnd}`;
  const clean = html.replace(markerBlock, '');
  if (!afterBurger.test(clean)) throw new Error(`Missing homepage header insertion point: ${locale}`);
  return clean
    .replace(afterBurger, (_, button, tail) => `${button}\n${menu}${tail}`)
    .replace(/(<script\b[^>]*\bsrc="\/scripts\/main\.js)(?:\?v=[^"]*)?(?=")/, `$1?v=${HOME_LANGUAGE_ENTRY_VERSION}`);
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
