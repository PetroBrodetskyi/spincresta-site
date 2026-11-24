import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { renderBrandNewGamesPanel } from '../scripts/pages/brand-layout.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { escapeReview as esc, reviewCards, reviewCountries, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { copy, headlines, supplement } from './slotsandcasino-review-copy.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const slug = 'slotsandcasino';
const date = '2026-11-24';
const brand = BRANDS.find(item => item.urlDetail === 'brands/' + slug + '.html');
const image = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const route = lang => prefix(lang) + 'brands/' + slug + '/';
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const check = process.argv.includes('--check');
const providers = getReviewProviders(slug);
const controls = [
  ['Previous providers', 'Next providers'], ['Vorherige Anbieter', 'Nächste Anbieter'], ['Proveedores anteriores', 'Siguientes proveedores'],
  ['Fornitori precedenti', 'Fornitori successivi'], ['Poprzedni dostawcy', 'Następni dostawcy'], ['Попередні провайдери', 'Наступні провайдери'],
  ['Fornecedores anteriores', 'Fornecedores seguintes'], ['Fournisseurs précédents', 'Fournisseurs suivants'],
  ['पिछले प्रदाता', 'अगले प्रदाता'], ['Edelliset pelintarjoajat', 'Seuraavat pelintarjoajat'],
];
const operatorLabels = ['Operator named by the casino', 'Vom Casino genannter Betreiber', 'Operador indicado por el casino', 'Operatore indicato dal casinò',
  'Operator wskazany przez kasyno', 'Оператор, якого називає казино', 'Operador indicado pelo casino',
  'Exploitant déclaré par le casino', 'कैसीनो द्वारा बताया गया संचालक', 'Kasinon ilmoittama operaattori'];
const bonusPerDeposit = ['Cap per deposit', 'Maximum je Einzahlung', 'Máximo por depósito', 'Massimo per deposito', 'Maksimum na wpłatę',
  'Максимум на депозит', 'Máximo por depósito', 'Maximum par dépôt', 'हर जमा पर अधिकतम बोनस', 'Enimmäisbonus talletusta kohti'];
const generalTerms = ['default in general terms', 'Standard laut AGB', 'regla general', 'regola generale',
  'zasada ogólna', 'за загальними умовами', 'regra geral', 'règle générale', 'सामान्य नियम', 'yleisten ehtojen mukaan'];
const payoutDifferences = [
  'Banking lists USDT withdrawals, but the crypto help page says Bitcoin only. Help lists a $53 wire fee and quotes either $53 or $55 for a check. Confirm availability and fees for your account.',
  'Unter Banking sind USDT-Auszahlungen aufgeführt, die Krypto-Hilfe nennt dagegen nur Bitcoin. Die Hilfe nennt 53 USD für Überweisungen und 53 oder 55 USD für Schecks. Prüfen Sie die Optionen und Gebühren für Ihr Konto.',
  'La página de pagos indica retiros en USDT, pero la ayuda sobre cripto solo menciona Bitcoin. La ayuda indica 53 USD por transferencia y 53 o 55 USD por cheque. Confirma los métodos y comisiones de tu cuenta.',
  'La pagina dei pagamenti indica prelievi in USDT, ma la guida sulle criptovalute cita solo Bitcoin. L’assistenza indica 53 USD per il bonifico e 53 o 55 USD per l’assegno. Verifica disponibilità e commissioni per il tuo conto.',
  'Strona płatności podaje wypłaty w USDT, ale pomoc dotycząca krypto wymienia tylko Bitcoin. Pomoc podaje 53 USD za przelew oraz 53 lub 55 USD za czek. Sprawdź metody i opłaty dla swojego konta.',
  'У банкінгу вказані виплати в USDT, але криптодовідка згадує лише Bitcoin. За переказ довідка вказує 53 $, а за чек — 53 або 55 $ залежно від сторінки. Перевірте доступні способи й комісії для свого акаунта.',
  'A página de pagamentos indica levantamentos em USDT, mas a ajuda sobre criptomoedas menciona apenas Bitcoin. A ajuda indica 53 USD por transferência e 53 ou 55 USD por cheque. Confirme os métodos e as comissões da sua conta.',
  'La page des paiements indique les retraits en USDT, mais l’aide crypto ne mentionne que Bitcoin. L’aide indique 53 USD pour un virement et 53 ou 55 USD pour un chèque. Vérifiez les moyens et les frais applicables à votre compte.',
  'भुगतान पेज पर USDT से निकासी दी गई है, लेकिन क्रिप्टो सहायता में सिर्फ़ Bitcoin लिखा है। सहायता में बैंक ट्रांसफ़र का शुल्क 53 USD और चेक का 53 या 55 USD बताया गया है। अपने खाते के तरीके और शुल्क जाँचें।',
  'Maksusivu listaa USDT-kotiutukset, mutta krypto-ohje mainitsee vain Bitcoinin. Ohje ilmoittaa pankkisiirron maksuksi 53 USD ja shekin maksuksi 53 tai 55 USD. Tarkista tilisi maksutavat ja kulut.',
];
const p = value => '<p class="section-intro">' + esc(value) + '</p>';
const h = value => '<h3>' + esc(value) + '</h3>';
const table = (headers, rows) => reviewTable(headers, rows, { rowHeaders: true });
function save(file, before, after) {
  if (before === after) return;
  if (check) {
    console.error('Stale Slots and Casino output: ' + file);
    process.exitCode = 1;
  } else writeFileSync(file, after);
}
if (!image || brand?.bonus !== headlines.en || brand.countries.join() !== 'US') throw new Error('Incomplete Slots and Casino registry');

for (const [i, lang] of locales.entries()) {
  const [title, welcome, overview, labels, spinTerms, bonusTerms, games, rewards, banking, payoutNote,
    identity, licensing, account, inactivity, support, comparison, suitability, questions, cryptoOffer] = copy[lang];
  const [reviewed, market, standard, crypto, bonusRange, wagering, cap, spinRate, depositAndBonus, spinWinnings,
    none, method, min, timing, days, deposits, withdrawals, weekly, wire, paper, topic, details, license,
    rules, dormant, help, pros, cons, beforeSignup] = labels.split('|');
  const [checkFirst, morePros, moreCons, moreQuestions, vipLimit] = supplement[lang];
  const localeText = (...values) => values[i];
  const label = key => reviewSectionLabel(key, localeText);
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const format = amount => new Intl.NumberFormat(locale).format(amount);
  const money = amount => lang === 'en' ? '$' + format(amount) : format(amount) + ' USD';
  const duration = amount => format(amount) + ' ' + (lang === 'pl' && amount === 4 ? 'dni robocze' : days);
  const stamp = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const description = title.split(':')[0].trim() + ': ' + welcome + '. ' + weekly + ': ' + money(2500) + '.';
  const section = (key, inner, tab = false) => '<section class="container" id="' + (key === 'faq' ? 'faq' : slug + '-' + key) +
    '" data-review-section="' + key + '"' + (tab ? ' data-review-details' : '') + '><h2 class="title">' + esc(label(key)) + '</h2>' + inner + '</section>';
  const bankRows = [['Bitcoin (BTC) / Tether (USDT)', money(25), duration(4)], [wire, money(150), duration(20)], [paper, money(150), duration(20)]];
  const weeklyAnswer = weekly + ': ' + money(2500) + '. ' + vipLimit;
  const faq = [...questions.split('|'), ...moreQuestions].map((question, j) => [question, [
    standard + ': ' + welcome + '. ' + crypto + ': ' + cryptoOffer + '. ' + bonusRange + ': ' + money(25) + '–' + money(500) + '.',
    bankRows.map(([name, value, time]) => name + ': ' + value + ' (' + time + ').').join(' ') + ' ' + payoutDifferences[i],
    identity, licensing, spinTerms,
    standard + ': 30× (' + depositAndBonus + '). ' + crypto + ': 40× (' + depositAndBonus + '). ' + spinWinnings + ': 30×.',
    rewards, weeklyAnswer,
  ][j]]);
  const comparisonItems = comparison.split('|');
  const body = [
    section('summary', table([topic, details], [[standard, welcome], [crypto, cryptoOffer], [weekly, money(2500)], [label('games'), 'Fresh Deck · Mythic Wolf · Five Times Wins'], [license, licensing]])),
    section('bonuses', p(spinTerms) + p(welcome) + p(cryptoOffer), true),
    section('bonus-terms', table([topic, standard, crypto], [
      [bonusRange, money(25) + '–' + money(500), money(25) + '–' + money(500)],
      [bonusPerDeposit[i], money(1500), money(2500)],
      [wagering + ' (' + depositAndBonus.toLocaleLowerCase(locale) + ')', '30×', '40×'],
      [cap, none, '10×'],
      [spinRate, '10', '15'],
      [wagering + ' (' + spinWinnings.toLocaleLowerCase(locale) + ')', '30×', '30×'],
      [cap + ' (' + spinWinnings.toLocaleLowerCase(locale) + ')', money(100) + ' (' + generalTerms[i] + ')', money(100)],
    ]) + p(bonusTerms), true),
    section('games', p(games), true),
    section('rewards', p(rewards), true),
    section('cashier', h(deposits) + p(banking) + h(withdrawals) + table([method, min, timing], bankRows) +
      p(weeklyAnswer) + p(payoutNote) + p(payoutDifferences[i]) + p(identity), true),
    section('trust', table([topic, details], [
      [operatorLabels[i], 'Online Casino Share Group'], [license, licensing], [rules, account], [dormant, inactivity], [help, support],
    ]), true),
    reviewProviderStrip({ id: slug + '-providers', heading: label('providers'), providers, previous: controls[i][0], next: controls[i][1] }),
    section('pros', reviewCards([[pros, [...comparisonItems.slice(0, 2), ...morePros]], [cons, [...comparisonItems.slice(2), ...moreCons]]], { comparison: true })),
    section('suitability', reviewCards([[label('games'), suitability], [beforeSignup, checkFirst]])),
    section('faq', '<div class="timeline">' + faq.map(([q, a]) => h(q) + '<p>' + esc(a) + '</p>').join('') + '</div>'),
  ].join('\n      ');
  const geo = reviewCountries({ heading: label('countries'), countries: [
    { name: market, href: prefix(lang) + 'online-casinos/united-states/', flag: '/icons/united-states-flag-icon.svg' },
  ], payments: { heading: label('methods'), methods: brand.payments } });
  const file = '.' + route(lang) + 'index.html';
  const before = readFileSync(file, 'utf8');
  const hero = before.match(/<section class="hero container">[\s\S]*?<\/section>/)?.[0];
  const button = before.match(/<button\b[^>]*class="brand-why-media"[\s\S]*?<\/button>/)?.[0];
  const schema = before.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!hero || !button || !schema) throw new Error('Missing Slots and Casino review shell: ' + lang);
  const heroUpdated = hero
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, () => '<p class="hero-subtitle">' + esc(overview) + '</p>')
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () =>
      '<p class="hero-subtitle editorial-meta">' + esc(reviewed) + ': <time datetime="' + date + '">' + esc(stamp) + '</time></p>')
    .replace(/(<a href=")[^"]+(" class="cta-brands")/, (_, open, close) => open + esc(brand.urlCasino) + close);
  const highlights = [
    [standard, welcome, 'bonus'], [crypto, cryptoOffer, 'wallet'], [label('games'), 'Fresh Deck · SlotsandCasino Originals', 'games'],
    [label('rewards'), 'MySlotsandCasino', 'trophy'], [weekly, money(2500), 'payments'], [label('countries'), market, 'globe'],
  ];
  const feature = '<section class="container features-section glass-section brand-highlights--compact" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">' +
    esc(label('highlights')) + '</h2>' + button.replace(/<img\b[^>]*>/, () => '<img src="' + esc(image) + '" alt="Slots and Casino — ' + esc(label('games')) +
      '" width="3024" height="1578" loading="eager" fetchpriority="high" decoding="async" />') + '</div><div class="features-grid premium-grid">' +
    highlights.map(([heading, value, icon]) => '<div class="feature-card glass-card">' + siteIconMarkup(icon, 'site-icon brand-highlight-icon', 18) +
      '<strong>' + esc(heading) + '</strong><span>' + esc(value) + '</span></div>').join('') + '</div></section>';
  const gamesRow = renderBrandNewGamesPanel({
    games: BRAND_NEW_GAMES[slug], pageBrand: brand, brandName: brand.name, escapeHtml: esc, localeText,
  });
  const graph = JSON.parse(schema[1]);
  const page = graph['@graph'].find(node => node['@type'] === 'WebPage');
  Object.assign(page, { name: title, description, dateModified: date, image });
  graph['@graph'].find(node => node['@type'] === 'FAQPage').mainEntity =
    faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  const meta = (html, key, value) => html.replace(new RegExp('(<meta\\s+(?:name|property)="' + key + '"\\s+content=")[^"]*(")'), (_, a, b) => a + esc(value) + b);
  let after = before
    .replace(/(src="\/scripts\/main\.js\?v=)[^"]+/, (_, start) => start + '20261124-slotsandcasino-games')
    .replace(/<title>[\s\S]*?<\/title>/, () => '<title>' + esc(title) + '</title>')
    .replace(schema[0], () => '<script type="application/ld+json">' + JSON.stringify(graph).replaceAll('<', '\\u003c') + '</script>')
    .replace(/<section class="hero container">[\s\S]*?<main class="content-review">[\s\S]*?<\/main>/, () =>
      heroUpdated + '\n\n    ' + gamesRow + '\n\n    ' + feature + '\n\n    ' + geo + '\n\n    <main class="content-review">\n      ' + body + '\n    </main>');
  for (const key of ['og:title', 'twitter:title']) after = meta(after, key, title);
  for (const key of ['description', 'og:description', 'twitter:description']) after = meta(after, key, description);
  for (const key of ['og:image', 'twitter:image']) after = meta(after, key, image);
  save(file, before, syncDefaultTheme(after));
}

const sitemap = 'sitemap.xml';
const xml = readFileSync(sitemap, 'utf8');
const locs = new Set(locales.map(lang => 'https://spincresta.com' + route(lang)));
save(sitemap, xml, xml.replace(/<url>[\s\S]*?<\/url>/g, entry =>
  locs.has(entry.match(/<loc>([^<]+)<\/loc>/)?.[1]) ? entry.replace(/<lastmod>[^<]+<\/lastmod>/, '<lastmod>' + date + '</lastmod>') : entry));
