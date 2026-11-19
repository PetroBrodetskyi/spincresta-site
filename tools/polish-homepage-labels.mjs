import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { SITE_ICON_SPRITE, siteIconMarkup } from '../scripts/site-icons.js';

// Reviewed homepage headings. Keep these after locale/page regeneration.
// Order: recommendations region label, then reviews, games, method headings.
export const HOME_LABELS = {
  en: ['Casino recommendations', 'Latest casino reviews', 'New games', 'How we review casinos'],
  de: ['Casino-Empfehlungen', 'Neue Casino-Bewertungen', 'Neue Spiele', 'So prüfen wir Casinos'],
  es: ['Casinos recomendados', 'Últimas reseñas de casinos', 'Nuevos juegos', 'Cómo analizamos los casinos'],
  it: ['Casinò consigliati', 'Nuove recensioni di casinò', 'Nuovi giochi', 'Come valutiamo i casinò'],
  pl: ['Polecane kasyna', 'Najnowsze recenzje kasyn', 'Nowe gry', 'Jak oceniamy kasyna'],
  uk: ['Рекомендовані казино', 'Нові огляди казино', 'Нові ігри', 'Як ми перевіряємо казино'],
  pt: ['Casinos recomendados', 'Novas avaliações de casinos', 'Novos jogos', 'Como avaliamos os casinos'],
  fr: ['Casinos recommandés', 'Avis récents sur les casinos', 'Nouveaux jeux', 'Comment nous évaluons les casinos'],
  hi: ['सुझाए गए कैसीनो', 'नई कैसीनो समीक्षाएँ', 'नए गेम', 'हम कैसीनो की समीक्षा कैसे करते हैं'],
  fi: ['Suositellut kasinot', 'Uudet kasinoarvostelut', 'Uudet pelit', 'Näin arvioimme kasinot'],
};

const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const methodIcons = ['safety', 'bonus', 'payments', 'games'];
const replaceOne = (html, pattern, replacement, label) => {
  if ([...html.matchAll(new RegExp(pattern.source, 'g'))].length !== 1) {
    throw new Error(`Expected one homepage ${label}`);
  }
  return html.replace(pattern, replacement);
};

export function polishHomepageLabels(html, locale) {
  const copy = HOME_LABELS[locale];
  if (!copy) throw new Error(`Unsupported homepage locale: ${locale}`);
  if (!/<body\b[^>]*class="home-page"/.test(html) || /<body\b[^>]*data-page=/.test(html)) {
    throw new Error('Expected the homepage, not another page sharing its components');
  }

  // The h2 already explains the section. Remove redundant promotional eyebrows
  // from the published markup rather than merely hiding them with CSS.
  let result = html.replace(/^[ \t]*<section class="home-stats"[^>]*>[\s\S]*?<\/section>\r?\n(?:\r?\n)?/gm, '');
  result = result.replace(/^[ \t]*<section class="home-showcase-section home-casino-gallery"[^>]*>[\s\S]*?<\/section>\r?\n(?:\r?\n)?/gm, '');
  result = result.replace(/^[ \t]*<a class="home-primary-action" href="#recommended-brands">[^<]*<\/a>\r?\n/gm, '');
  result = result.replace(/^[ \t]*<span class="home-section-kicker">[^<]*<\/span>\r?\n/gm, '');
  result = result.replace(/<span class="home-section-kicker">[^<]*<\/span>/g, '');
  result = replaceOne(result,
    /(<section class="home-showcase-section home-recommendations" id="recommended-brands")(?: aria-label="[^"]*")?>(?:\s*<div class="home-showcase-heading">\s*<div>\s*<h2>[^<]*<\/h2>\s*<\/div>\s*<p>[\s\S]*?<\/p>\s*<\/div>)?\s*(?=<div class="casino-grid\b)/,
    (_, start) => `${start} aria-label="${escapeHtml(copy[0])}">\n          `, 'recommendations grid');
  for (const [index, id] of ['new-reviews-title', 'new-games-title', 'editorial-method-title'].entries()) {
    result = replaceOne(result, new RegExp(`(<h2 id="${id}">)[^<]*(<\\/h2>)`),
      (_, start, end) => start + escapeHtml(copy[index + 1]) + end, id);
  }
  result = replaceOne(result,
    /<section class="home-showcase-section home-editorial-method"[^>]*>[\s\S]*?<\/section>/,
    section => section
      .replace(/<span>0([1-4])<\/span>(?=\s*<h3>)/g, (_, number) =>
        siteIconMarkup(methodIcons[Number(number) - 1], 'home-method-icon', 40))
      .replace(/(?<=href=")\/icons\/ui\/review-method\.svg(?:\?[^"#]*)?(?=#)/g, SITE_ICON_SPRITE),
    'editorial method section');
  if (locale === 'en') {
    result = result.replace('lobby is organised', 'lobby is organized')
      .replace('licence information', 'license information');
  }
  return result;
}

function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  const apply = process.argv.includes('--apply');
  let changed = 0;
  for (const locale of Object.keys(HOME_LABELS)) {
    const file = path.join(root, locale === 'en' ? 'index.html' : `${locale}/index.html`);
    const html = fs.readFileSync(file, 'utf8');
    const next = polishHomepageLabels(html, locale);
    if (next === html) continue;
    changed++;
    if (apply) fs.writeFileSync(file, next);
  }
  console.log(`Homepage labels: ${changed} ${apply ? 'updated' : 'need updating'}; 10 locales checked.`);
  if (!apply && changed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
