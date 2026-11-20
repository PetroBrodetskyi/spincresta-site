import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteIconMarkup } from '../scripts/site-icons.js';

const locales = ['', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const listingIcons = {
  'new-casinos': ['bonus', 'payments', 'phone', 'safety', 'review'],
  'top-rated': ['star', 'wallet', 'bonus', 'games', 'chat'],
  'exclusive-offers': ['wallet', 'review', 'bonus', 'clock', 'link'],
};

const guideTitles = {
  en: ['What we compare', 'Check your country', 'Set limits'],
  de: ['Was wir vergleichen', 'Land prüfen', 'Limits festlegen'],
  es: ['Qué comparamos', 'Consulta tu país', 'Fija límites'],
  it: ['Che cosa confrontiamo', 'Verifica il tuo paese', 'Imposta dei limiti'],
  pl: ['Co porównujemy', 'Sprawdź swój kraj', 'Ustal limity'],
  uk: ['Що ми порівнюємо', 'Перевірте умови для своєї країни', 'Встановіть ліміти'],
  pt: ['O que comparamos', 'Consulte o seu país', 'Defina limites'],
  fr: ['Ce que nous comparons', 'Vérifiez les conditions dans votre pays', 'Fixez des limites'],
  hi: ['हम किन बातों की तुलना करते हैं', 'अपने देश के नियम देखें', 'सीमाएँ तय करें'],
  fi: ['Mitä vertailemme', 'Tarkista maakohtaiset ehdot', 'Aseta rajat'],
};

const guidePreviewPhrases = {
  en: ['the six current choices shown', 'the choices shown'],
  de: ['die sechs aktuell angezeigten Empfehlungen', 'die angezeigten Empfehlungen'],
  es: ['las seis opciones actuales que se muestran', 'las opciones que se muestran'],
  it: ['le sei scelte attuali mostrate', 'le opzioni mostrate'],
  pl: ['sześć aktualnych opcji pokazanych', 'opcje pokazane'],
  uk: ['шість поточних варіантів, показаних', 'варіанти, показані'],
  pt: ['as seis opções atuais mostradas', 'as opções mostradas'],
  fr: ['les six choix actuels présentés', 'les options présentées'],
  hi: ['छह मौजूदा विकल्पों', 'विकल्पों'],
  fi: ['kuutta nykyistä vaihtoehtoa', 'vaihtoehtoja'],
};

const sections = {
  'top-casinos': [
    ['class="top-casinos-method-grid"', ['safety', 'games', 'bonus', 'payments', 'clock']],
    ['class="content top-casinos-reading-guide"', ['review', 'globe', 'safety']],
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

function formatReadingGuide(section, icons, locale) {
  const titles = guideTitles[locale];
  const heading = section.match(/<h2 class="title">([\s\S]*?)<\/h2>/)?.[1];
  const paragraphs = [...section.matchAll(/<p>[\s\S]*?<\/p>/g)].map(match => match[0]);
  if (!heading || paragraphs.length !== icons.length || titles.length !== icons.length) {
    throw new Error('Unexpected Top Casinos reading guide structure');
  }
  paragraphs[1] = paragraphs[1].replace(...guidePreviewPhrases[locale]);
  const cards = paragraphs.map((paragraph, i) => `            <article>
              ${siteIconMarkup(icons[i], 'home-method-icon', 40)}
              <h3>${titles[i]}</h3>
              ${paragraph}
            </article>`).join('\n');
  return `<section class="editorial-card-band" id="seo-editorial-guide" aria-labelledby="reading-guide-title" data-editorial-columns="${paragraphs.length}">
        <div class="container editorial-card-inner">
          <div class="home-showcase-heading"><div><h2 id="reading-guide-title">${heading}</h2></div></div>
          <div class="home-method-grid">
${cards}
          </div>
        </div>
      </section>`;
}

export function syncEditorialCardSections(html, page) {
  let index = 0;
  const listing = Object.hasOwn(listingIcons, page) ? listingIcons[page] : null;
  const knownSections = Object.hasOwn(sections, page) ? sections[page] : [];
  const updated = html.replace(/<section\b[^>]*>[\s\S]*?<\/section>/g, section => {
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
    if (page === 'top-casinos' && config[0] === 'class="content top-casinos-reading-guide"') {
      const locale = html.match(/<html\b[^>]*\blang="([a-z]{2})/i)?.[1]?.toLowerCase() || 'en';
      return formatReadingGuide(section, icons, Object.hasOwn(guideTitles, locale) ? locale : 'en');
    }
    let replacement = section
      .replace(/^<section class="([^"]+)"/, `<section class="$1 editorial-card-band" data-editorial-columns="${icons.length}"`)
      .replace('class="top-casinos-method-panel"', 'class="editorial-card-inner"')
      .replace(/class="(?:author-intro|top-casinos-method-head)"/, 'class="home-showcase-heading"')
      .replace(/class="(?:author-focus-grid|top-casinos-method-grid)"/, 'class="home-method-grid"');
    return replaceCards(replacement, icons, ordered);
  });
  const expected = listing ? 1 : knownSections.length;
  if (index !== expected) throw new Error(`Expected ${expected} editorial sections on ${page}, found ${index}`);
  return page === 'top-casinos'
    ? updated.replace(/(<div class="casino-grid") data-limit="\d+"/g, '$1')
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
