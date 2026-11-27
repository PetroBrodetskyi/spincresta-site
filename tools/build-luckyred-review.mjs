import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { renderBrandNewGamesPanel } from '../scripts/pages/brand-layout.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { escapeReview as esc, reviewCards, reviewCountries, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { locales, money } from './jackspay-review-copy.mjs';
import { copy as usLabels } from './slotsandcasino-review-copy.mjs';
import { localeCopy } from './luckyred-review-copy.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const slug = 'luckyred';
const template = 'jackspay';
const date = '2026-11-27';
const origin = 'https://spincresta.com';
const brand = BRANDS.find(b => b.urlDetail === 'brands/luckyred.html');
const reference = BRANDS.find(b => b.urlDetail === 'brands/jackspay.html');
const capture = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const socialImage = new URL(capture, origin).href;
const games = BRAND_NEW_GAMES[slug];
const providers = getReviewProviders(slug);
const check = process.argv.includes('--check');
const read = file => readFileSync(file, 'utf8');
const p = text => '<p class="section-intro">' + esc(text) + '</p>';
const h = text => '<h3>' + esc(text) + '</h3>';
const table = (columns, rows) => reviewTable(columns, rows, { rowHeaders: true });
const meta = (source, key, value) => source.replace(new RegExp('(<meta\\s+(?:name|property)="' + key + '"\\s+content=")[^"]*(")'), (_, a, b) => a + esc(value) + b);
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
export const luckyRedPath = lang => prefix(lang) + 'brands/luckyred/';
const amount = (lang, number) => money(lang, number);
function save(file, output) {
  if (existsSync(file) && read(file) === output) return;
  if (check) {
    console.error('Stale Lucky Red output: ' + file);
    process.exitCode = 1;
  } else writeFileSync(file, output);
}
if (!brand || brand.reviewComingSoon || brand.countries.join() !== 'US' || games.length !== 6) throw Error('Incomplete Lucky Red registry');
const rename = html => html.replaceAll(reference.image, brand.image)
  .replaceAll(template, slug).replaceAll(esc(reference.urlCasino), esc(brand.urlCasino)).replaceAll(reference.name, brand.name);

for (const [i, lang] of locales.entries()) {
  const texts = localeCopy[lang];
  if (texts?.length !== 15) throw Error('Missing Lucky Red copy for ' + lang);
  const [head, overview, termsLabels, conditions, chipCopy, gameCopy, rewards, depositsCopy,
    withdrawalsCopy, kyc, licensing, safety, comparisons, fit, questions] = texts;
  const [reviewTitle, title, headline] = head.split('|');
  const [slotsBonus, widerBonus, chip, eligible, maxBet, noCap, chipCap, minimum, excluded, jackpots] = termsLabels.split('|');
  const [reviewed, market, , , , wagering, cap, , , , , method, , , , deposits, withdrawals,
    weekly, wire, paper, topic, details, license, , , support, pros, cons, beforeSignup] = usLabels[lang][3].split('|');
  const usd = value => amount(lang, value);
  const localeText = (...values) => values[i];
  const label = key => reviewSectionLabel(key, localeText);
  const section = (key, content, tab = false) => '<section class="container" id="' + (key === 'faq' ? 'faq' : slug + '-' + key) +
    '" data-review-section="' + key + '"' + (tab ? ' data-review-details' : '') + '><h2 class="title">' + esc(label(key)) + '</h2>' + content + '</section>';
  const percent = value => new Intl.NumberFormat(lang, {style: 'percent'}).format(value / 100);
  const offerA = percent(400) + ' · ' + usd(4000);
  const offerB = percent(100) + ' · ' + usd(1000);
  const faq = questions.split('|').map((question, key) => [question, [
    slotsBonus + ': LUCKYRED400 (' + offerA + '). ' + widerBonus + ': LUCKYRED100 (' + offerB + ').',
    chipCopy, conditions + ' ' + wagering + ': 50×.', gameCopy, withdrawalsCopy, kyc, licensing, safety,
  ][key]]);
  const splits = comparisons.split('|');
  const fitCards = fit.split('|');
  if (faq.length !== 8 || splits.length !== 8 || fitCards.length !== 2) throw Error('Incomplete Lucky Red sections: ' + lang);
  const quickFacts = [
    [slotsBonus, offerA], [widerBonus, offerB], [chip, usd(75)], [weekly, usd(5001)],
    [label('games'), 'Realtime Gaming (RTG)'], [label('countries'), market],
  ];
  const body = [
    section('summary', table([topic, details], quickFacts)),
    section('bonuses', table([topic, details], [[slotsBonus, 'LUCKYRED400: ' + offerA], [widerBonus, 'LUCKYRED100: ' + offerB], [chip, usd(75)]]) + p(chipCopy), true),
    section('bonus-terms', table([topic, 'LUCKYRED400', 'LUCKYRED100'], [
      [wagering, '50×', '50×'], [deposits + ' · ' + minimum, usd(35), usd(35)], [maxBet, usd(10), usd(10)],
      [cap, noCap, noCap], [eligible, slotsBonus, widerBonus], [jackpots, excluded, excluded],
    ]) + p(conditions) + p(chip + ': ' + wagering + ' 50× · ' + cap + ' ' + chipCap + '.'), true),
    section('games', p(gameCopy), true),
    section('rewards', p(rewards), true),
    section('cashier', h(deposits) + p(depositsCopy) + h(withdrawals) + table([method, minimum], [
      ['Bitcoin (BTC) / Litecoin (LTC)', usd(35)], [wire + ' / ' + paper + ' / Interac', usd(35)],
    ]) + p(withdrawalsCopy) + h('KYC') + p(kyc), true),
    section('trust', table([topic, details], [[license, licensing], [support, safety]]), true),
    reviewProviderStrip({
      id: slug + '-providers', heading: label('providers'), providers,
      previous: localeText('Previous providers', 'Vorherige Anbieter', 'Proveedores anteriores', 'Fornitori precedenti', 'Poprzedni dostawcy', 'Попередні провайдери', 'Fornecedores anteriores', 'Fournisseurs précédents', 'पिछले प्रदाता', 'Edelliset pelintarjoajat'),
      next: localeText('Next providers', 'Nächste Anbieter', 'Siguientes proveedores', 'Fornitori successivi', 'Następni dostawcy', 'Наступні провайдери', 'Fornecedores seguintes', 'Fournisseurs suivants', 'अगले प्रदाता', 'Seuraavat pelintarjoajat'),
    }),
    section('pros', reviewCards([[pros, splits.slice(0, 4)], [cons, splits.slice(4)]], { comparison: true })),
    section('suitability', reviewCards([[label('games'), fitCards[0]], [beforeSignup, fitCards[1]]])),
    section('faq', '<div class="timeline">' + faq.map(([q, a]) => h(q) + '<p>' + esc(a) + '</p>').join('') + '</div>'),
  ].join('\n      ');
  const geo = reviewCountries({
    heading: label('countries'),
    countries: [{ name: market, href: prefix(lang) + 'online-casinos/united-states/', flag: '/icons/united-states-flag-icon.svg' }],
    payments: { heading: label('methods'), methods: brand.payments },
  });
  const gallery = renderBrandNewGamesPanel({ games, pageBrand: brand, brandName: brand.name, escapeHtml: esc, localeText });
  const html = read('.' + prefix(lang) + 'brands/jackspay/index.html');
  const hero = html.match(/<section class="hero container">[\s\S]*?<\/section>/)?.[0];
  const zoom = html.match(/<button\b[^>]*class="brand-why-media"[\s\S]*?<\/button>/)?.[0];
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!hero || !zoom || !schema) throw Error('Incomplete review template: ' + lang);
  const stamp = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const heroMarkup = rename(hero)
    .replace(/class="brand-logo-container hero-logo"/, 'class="brand-logo-container hero-logo" style="background-color: ' + esc(brand.bgColor) + ';"')
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/, () => '<h1>' + esc(reviewTitle) + '</h1>')
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, () => '<p class="hero-subtitle">' + esc(overview) + '</p>')
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () =>
      '<p class="hero-subtitle editorial-meta">' + esc(reviewed) + ': <time datetime="' + date + '">' + esc(stamp) + '</time></p>');
  const preview = zoom.replace(/<img\b[^>]*>/, () => '<img src="' + esc(capture) + '" alt="' + esc(brand.name + ' — ' + label('games')) +
    '" loading="eager" fetchpriority="high" decoding="async" />');
  const features = '<section class="container features-section glass-section brand-highlights--compact" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">' +
    esc(label('highlights')) + '</h2>' + preview + '</div><div class="features-grid premium-grid">' + quickFacts.map(([heading, value], key) =>
    '<div class="feature-card glass-card">' + siteIconMarkup(['bonus', 'bonus', 'wallet', 'payments', 'games', 'globe'][key], 'site-icon brand-highlight-icon', 18) +
    '<strong>' + esc(heading) + '</strong><span>' + esc(value) + '</span></div>').join('') + '</div></section>';
  const description = reviewTitle + ': ' + headline + '. ' + wagering + ' 50×. ' + weekly + ': ' + usd(5001) + '.';
  const graph = JSON.parse(rename(schema[1]));
  Object.assign(graph['@graph'].find(node => node['@type'] === 'WebPage'), { name: title, description, datePublished: date, dateModified: date, image: socialImage });
  graph['@graph'].find(node => node['@type'] === 'BreadcrumbList').itemListElement[2].name = reviewTitle;
  graph['@graph'].find(node => node['@type'] === 'FAQPage').mainEntity = faq.map(([name, text]) =>
    ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  let output = rename(html)
    .replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, (_, a, b) => a + JSON.stringify(graph).replaceAll('<', '\\u003c') + b)
    .replace(/<title>[\s\S]*?<\/title>/, () => '<title>' + esc(title) + '</title>')
    .replace(/<section class="hero container">[\s\S]*?<main class="content-review">[\s\S]*?<\/main>/, () =>
      [heroMarkup, gallery, features, geo, '<main class="content-review">\n      ' + body + '\n    </main>'].join('\n\n    '))
    .replace(/(src="\/scripts\/main\.js\?v=)[^"]+/, (_, start) => start + '20261127-luckyred-review');
  for (const key of ['og:title', 'twitter:title']) output = meta(output, key, title);
  for (const key of ['description', 'og:description', 'twitter:description']) output = meta(output, key, description);
  for (const key of ['og:image', 'twitter:image']) output = meta(output, key, socialImage);
  output = meta(output, 'brand-snapshot-intro', localeText(
    'The catalog marks which games support browser play, mobile devices, or the downloadable client.',
    'Der Katalog kennzeichnet Spiele für den Browser, Mobilgeräte und die Download-Version.',
    'El catálogo indica qué juegos se pueden abrir en el navegador, en el móvil o en el programa descargable.',
    'Il catalogo indica i giochi disponibili su browser, dispositivi mobili o tramite il programma da scaricare.',
    'Katalog oznacza gry dostępne w przeglądarce, na urządzeniach mobilnych i w aplikacji do pobrania.',
    'У каталозі позначено, які ігри відкриваються в браузері, на телефоні або в програмі для завантаження.',
    'O catálogo indica os jogos disponíveis no navegador, no telemóvel ou no programa para descarregar.',
    'Le catalogue indique si chaque jeu est accessible dans le navigateur, sur mobile ou dans le logiciel à télécharger.',
    'कैटलॉग बताता है कि कौन-से गेम ब्राउज़र, मोबाइल या डाउनलोड वाले प्रोग्राम में उपलब्ध हैं।',
    'Valikoimassa on merkinnät selainpeleille, mobiilipeleille ja ladattavan ohjelman peleille.'
  ));
  save('.' + luckyRedPath(lang) + 'index.html', syncDefaultTheme(output).trimEnd() + '\n');

  const directoryFile = '.' + prefix(lang) + 'casinos-and-betting/index.html';
  const directory = read(directoryFile);
  const existing = [...directory.matchAll(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)]
    .find(([item]) => item.includes('href="' + luckyRedPath(lang) + '"'))?.[0];
  if (!existing) throw Error('Missing directory row: ' + lang);
  const row = existing
    .replaceAll('images/luckyred.webp', brand.image)
    .replace(/(href=")[^"]+(?="[^>]*\brel="[^"]*sponsored)/g, '$1' + esc(brand.urlCasino))
    .replace(/(--brand-bg-color:\s*)#[\da-f]{6}/i, '$1' + brand.bgColor)
    .replace(/(<p class="casino-bonus">\s*<strong>[^<]+<\/strong>)(\s*)([^<]*)(?=<\/p>)/g, (original, start, space, text, offset, source) => {
      const spans = [...source.matchAll(/<p class="casino-bonus">/g)];
      return spans[1]?.index === offset ? start + space + esc(headline) : original;
    });
  if (!row.includes(esc(brand.urlCasino)) || !row.includes(esc(headline)) || !row.includes(brand.bgColor)) throw Error('Stale directory data: ' + lang);
  save(directoryFile, directory.replace(existing, () => row));
}
