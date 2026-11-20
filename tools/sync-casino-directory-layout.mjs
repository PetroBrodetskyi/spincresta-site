import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { BRANDS } from '../scripts/brands.js';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const COPY = {
  en: ['Search by brand name', 'Brand type', 'Browse by letter', 'No brands match. Try a different name or filter.'],
  de: ['Nach Markennamen suchen', 'Angebotsart', 'Nach Anfangsbuchstaben', 'Keine passenden Marken. Ändern Sie den Namen oder den Filter.'],
  es: ['Busca por nombre de marca', 'Tipo de marca', 'Buscar por letra', 'No hay marcas que coincidan. Prueba con otro nombre o filtro.'],
  it: ['Cerca per nome del marchio', 'Tipo di marchio', 'Sfoglia per lettera', 'Nessun marchio corrispondente. Prova un altro nome o filtro.'],
  pl: ['Szukaj według nazwy marki', 'Typ marki', 'Przeglądaj według liter', 'Brak pasujących marek. Zmień nazwę lub filtr.'],
  uk: ['Пошук за назвою бренду', 'Тип бренду', 'Перейти до літери', 'Немає збігів. Спробуйте іншу назву або змініть фільтр.'],
  pt: ['Pesquisar pelo nome da marca', 'Tipo de marca', 'Procurar por letra', 'Nenhuma marca corresponde à pesquisa. Experimente outro nome ou filtro.'],
  fr: ['Rechercher par nom de marque', 'Type de marque', 'Parcourir par lettre', 'Aucune marque ne correspond. Essayez un autre nom ou filtre.'],
  hi: ['ब्रांड के नाम से खोजें', 'ब्रांड का प्रकार', 'अक्षर के अनुसार देखें', 'कोई ब्रांड नहीं मिला। कोई दूसरा नाम या फ़िल्टर आज़माएँ।'],
  fi: ['Hae brändin nimellä', 'Brändin tyyppi', 'Selaa alkukirjaimen mukaan', 'Brändejä ei löytynyt. Kokeile toista nimeä tai suodatinta.'],
};

const LOCALES = Object.keys(COPY);
const BRAND_COLORS = new Map(BRANDS.map(brand => [
  brand.urlDetail?.replace(/^\/?brands\//, '').replace(/\.html$/, ''), brand.bgColor,
]));

export const REVIEW_DIRECTORY_COPY = {
  en: 'Browse casino and sportsbook brands by name. Open a review to check country availability, payments, and bonus terms.',
  de: 'Finden Sie Casinos und Wettanbieter nach Namen. In den Testberichten erfahren Sie mehr über verfügbare Länder, Zahlungen und Bonusbedingungen.',
  es: 'Busca casinos y casas de apuestas por nombre. Consulta las reseñas para ver los países disponibles, los pagos y las condiciones de los bonos.',
  it: 'Cerca casinò e siti di scommesse per nome. Nelle recensioni trovi i paesi in cui operano, i metodi di pagamento e le condizioni dei bonus.',
  pl: 'Szukaj kasyn i bukmacherów według nazwy. W recenzjach znajdziesz informacje o dostępności w poszczególnych krajach, płatnościach i warunkach bonusów.',
  uk: 'Знайдіть казино чи букмекера за назвою. В огляді можна перевірити доступність у різних країнах, способи оплати й умови бонусів.',
  pt: 'Procure casinos e casas de apostas pelo nome. Consulte as análises para ver os países disponíveis, os pagamentos e as condições dos bónus.',
  fr: 'Recherchez un casino ou un site de paris par nom. Consultez les avis pour connaître les pays desservis, les moyens de paiement et les conditions des bonus.',
  hi: 'कैसीनो और खेल सट्टेबाज़ी साइटें नाम से खोजें। देश में उपलब्धता, भुगतान के तरीके और बोनस की शर्तें जानने के लिए समीक्षा पढ़ें।',
  fi: 'Hae kasinoita ja vedonlyöntisivustoja nimellä. Arvosteluista löydät tiedot maakohtaisesta saatavuudesta, maksuista ja bonusehdoista.',
};

function compactCatalogCards(html, locale) {
  const intro = REVIEW_DIRECTORY_COPY[locale];
  return html.replace(
    /(<article class="casino-list-row"[^>]*>)([\s\S]*?)(<\/article>)/g,
    (row, open, body, close) => {
      if (body.includes('class="home-new-review-card"')) return row;
      const logo = body.match(/<div class="casino-list-logo"([^>]*)>[\s\S]*?(<img\b[^>]+>)[\s\S]*?<\/div>/);
      const heading = body.match(/<h3 class="casino-name">([\s\S]*?)<\/h3>/);
      const link = heading?.[1].trim().match(/^<a href="([^"]+)"[^>]*>([^<]+)<\/a>$/);
      // This legacy entry predates its published review in every locale.
      const jackpot = !link && logo?.[2].includes('/images/letsjackpot.svg');
      const href = jackpot ? `/${locale === 'en' ? '' : locale + '/'}brands/letsjackpot/` : link?.[1];
      const slug = href?.match(/^\/(?:[a-z]{2}\/)?brands\/([^"/]+)\/$/)?.[1];
      if (!logo || !heading || !slug) {
        throw new Error(`Missing logo or internal review link in ${locale}: ${heading?.[1] || open}`);
      }
      const name = jackpot ? "Let's Jackpot" : link[2];
      const color = BRAND_COLORS.get(slug);
      const logoAttrs = logo[1] || (/^#[\da-f]{3,8}$/i.test(color || '') ? ` style="--brand-bg-color: ${color};"` : '');
      const image = logo[2].replace(/\s+class="casino-image"/, '').replace(/\balt="[^"]*"/, 'alt=""')
        .replace(/loading="lazy"(?!\s+decoding=)/, 'loading="lazy" decoding="async"');
      const details = body.replace(logo[0], '').replace(heading[0], '').trim();
      // Legacy language/brand updaters still maintain these localized fields.
      // Keep them inert: only the single internal review link is rendered.
      return `${open}
              <a class="home-new-review-card" href="${href}">
                <span class="home-new-review-logo"${logoAttrs}>${image}</span>
                <strong class="casino-name">${name}</strong>
              </a>
              <template data-catalog-details>
              ${details}
              </template>
            ${close}`;
    },
  )
    .replace(/<template data-catalog-details>[\s\S]*?<\/template>/g, template =>
      template.replace(/^[ \t]+\n/gm, ''))
    .replace(/(<div class="page-intro-copy">\s*<h1>[\s\S]*?<\/h1>\s*<p>)[\s\S]*?(<\/p>)/, `$1${intro}$2`)
    .replace(/((?:name|property)="(?:og:|twitter:)?description"\s+content=")[^"]*(")/g, `$1${intro}$2`)
    .replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g, (script, open, data, close) => {
      if (JSON.parse(data)['@type'] !== 'WebPage') return script;
      return open + data.replace(/("description"\s*:\s*)"(?:[^"\\]|\\.)*"/, (_match, field) =>
        field + JSON.stringify(intro)) + close;
    });
}

export const casinoDirectoryFiles = () => LOCALES.map(locale => ({
  locale, file: path.join(locale === 'en' ? '' : locale, 'casinos-and-betting', 'index.html'),
}));

export function syncCasinoDirectoryLayout(html, locale) {
  const ids = [...html.matchAll(/<section class="content" id="(letter-[A-Z]+)"/g)].map(match => match[1]);
  const alphabetLinks = ids.map(id =>
    `            <a href="#${id}" class="view-all">${id.endsWith('-NUM') ? '#' : id.slice('letter-'.length)}</a>`
  ).join('\n');
  const applyLayout = content => syncDefaultTheme(compactCatalogCards(content.replace(
    /(<nav class="alpha-nav" aria-label="[^"]+">)[\s\S]*?(<\/nav>)/,
    `$1\n${alphabetLinks}\n          $2`,
  ), locale));
  if (html.includes('<main class="catalog-directory">')) return applyLayout(html);
  const [search, types, letters, empty] = COPY[locale];
  const intro = html.match(/<section class="page-intro container">[\s\S]*?<\/section>/)?.[0];
  const filters = intro?.match(/<div class="filters-wrap" id="typeFilters">[\s\S]*?<\/div>/)?.[0];
  const alphabet = intro?.match(/<div class="alpha-nav">([\s\S]*?)<\/div>/)?.[1];
  const oldScript = html.match(/\s*<script>\s*\(function \(\) \{\s*const buttons = document\.querySelectorAll\('#typeFilters \.filter-btn'\);[\s\S]*?<\/script>/)?.[0];
  if (!intro || !filters || !alphabet || !oldScript) throw new Error(`Missing catalog controls for ${locale}`);
  const heading = intro.replace(/\s*<div class="filters-wrap"[\s\S]*?<\/div>/, '')
    .replace(/\s*<div class="alpha-nav">[\s\S]*?<\/div>/, '');
  const labeled = filters.replace('id="typeFilters"', `id="typeFilters" role="group" aria-label="${types}"`);
  const toolbar = `<div class="catalog-toolbar">
        <div class="container catalog-toolbar-inner">
          <div class="catalog-toolbar-row">
            <label class="catalog-search">
              ${siteIconMarkup('search', 'site-icon', 20)}
              <input type="search" data-catalog-query aria-label="${search}" placeholder="${search}" autocomplete="off" />
            </label>
            ${labeled}
          </div>
          <nav class="alpha-nav" aria-label="${letters}">${alphabet}</nav>
        </div>
      </div>
      <p class="container catalog-empty" data-catalog-empty role="status" hidden>${empty}</p>`;
  return applyLayout(html.replace('<main>', '<main class="catalog-directory">')
    .replace(intro, `${heading}\n\n      ${toolbar}`)
    .replace(oldScript, ''));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apply = process.argv.includes('--apply');
  let changed = 0;
  for (const { locale, file } of casinoDirectoryFiles()) {
    const html = fs.readFileSync(file, 'utf8');
    const next = syncCasinoDirectoryLayout(html, locale);
    if (next === html) continue;
    changed++;
    if (apply) fs.writeFileSync(file, next);
  }
  console.log(`Casino directory: ${changed} pages ${apply ? 'updated' : 'pending'}.`);
  if (!apply && changed) process.exitCode = 1;
}
