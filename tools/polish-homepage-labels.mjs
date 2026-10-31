import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Reviewed homepage headings. Keep these after locale/page regeneration.
// Order: country introduction, two counters, comparison, reviews, gallery, games, method.
export const HOME_LABELS = {
  en: ['Find casinos in your country', 'Countries', 'Casino reviews', 'Compare online casinos', 'Latest casino reviews', 'Casino screenshots', 'New games', 'How we review casinos'],
  de: ['Casinos für Ihr Land', 'Länder', 'Casino-Bewertungen', 'Online-Casinos vergleichen', 'Neue Casino-Bewertungen', 'Casino-Screenshots', 'Neue Spiele', 'So prüfen wir Casinos'],
  es: ['Casinos para tu país', 'Países', 'Reseñas de casinos', 'Compara casinos online', 'Últimas reseñas de casinos', 'Capturas de los casinos', 'Nuevos juegos', 'Cómo analizamos los casinos'],
  it: ['Trova i casinò nel tuo paese', 'Paesi', 'Recensioni di casinò', 'Confronta i casinò online', 'Nuove recensioni di casinò', 'Immagini dei casinò', 'Nuovi giochi', 'Come valutiamo i casinò'],
  pl: ['Kasyna w Twoim kraju', 'Kraje', 'Recenzje kasyn', 'Porównaj kasyna online', 'Najnowsze recenzje kasyn', 'Zrzuty ekranu kasyn', 'Nowe gry', 'Jak oceniamy kasyna'],
  uk: ['Казино для вашої країни', 'Країни', 'Огляди казино', 'Порівняйте онлайн-казино', 'Нові огляди казино', 'Скриншоти казино', 'Нові ігри', 'Як ми перевіряємо казино'],
  pt: ['Casinos no seu país', 'Países', 'Avaliações de casinos', 'Compare casinos online', 'Novas avaliações de casinos', 'Imagens dos casinos', 'Novos jogos', 'Como avaliamos os casinos'],
  fr: ['Trouvez un casino dans votre pays', 'Pays', 'Avis sur les casinos', 'Comparez les casinos en ligne', 'Avis récents sur les casinos', 'Captures d’écran des casinos', 'Nouveaux jeux', 'Comment nous évaluons les casinos'],
  hi: ['अपने देश के लिए कैसीनो खोजें', 'देश', 'कैसीनो समीक्षाएँ', 'ऑनलाइन कैसीनो की तुलना करें', 'नई कैसीनो समीक्षाएँ', 'कैसीनो के स्क्रीनशॉट', 'नए गेम', 'हम कैसीनो की समीक्षा कैसे करते हैं'],
  fi: ['Kasinot maittain', 'Maata', 'Kasinoarvostelua', 'Vertaa nettikasinoita', 'Uudet kasinoarvostelut', 'Kasinoiden kuvakaappaukset', 'Uudet pelit', 'Näin arvioimme kasinot'],
};

const escapeHtml = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
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
  let result = html.replace(/^[ \t]*<span class="home-section-kicker">[^<]*<\/span>\r?\n/gm, '');
  result = result.replace(/<span class="home-section-kicker">[^<]*<\/span>/g, '');
  result = replaceOne(result, /(<div class="home-insight-head">\s*<h2>)[^<]*(<\/h2>)/,
    (_, start, end) => start + escapeHtml(copy[0]) + end, 'country introduction');

  for (const [id, text] of [['siteCountryCount', copy[1]], ['siteBrandCount', copy[2]]]) {
    result = replaceOne(result, new RegExp(`(<span class="home-stat-number" id="${id}">[^<]*<\\/span>\\s*<strong>)[^<]*(<\\/strong>)`),
      (_, start, end) => start + escapeHtml(text) + end, id);
  }
  result = replaceOne(result, /(<section class="home-showcase-section home-recommendations"[^>]*>[\s\S]*?<h2>)[^<]*(<\/h2>)/,
    (_, start, end) => start + escapeHtml(copy[3]) + end, 'comparison heading');
  for (const [index, id] of ['new-reviews-title', 'casino-gallery-title', 'new-games-title', 'editorial-method-title'].entries()) {
    result = replaceOne(result, new RegExp(`(<h2 id="${id}">)[^<]*(<\\/h2>)`),
      (_, start, end) => start + escapeHtml(copy[index + 4]) + end, id);
  }
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
