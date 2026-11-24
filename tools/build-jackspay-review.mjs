import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { renderBrandNewGamesPanel } from '../scripts/pages/brand-layout.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { escapeReview as esc, reviewCards, reviewCountries, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { copy, headlines, locales, money, offer } from './jackspay-review-copy.mjs';
// Both casinos publish the same card limits, crypto deposit limits, and ID rules.
import { copy as sharedUsCasinoCopy } from './slotsandcasino-review-copy.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const slug = 'jackspay';
const template = 'slotsandcasino';
const date = '2026-11-24';
const check = process.argv.includes('--check');
const origin = 'https://spincresta.com';
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const reviewPath = (lang, key = slug) => prefix(lang) + 'brands/' + key + '/';
const brand = BRANDS.find(entry => entry.urlDetail === 'brands/' + slug + '.html');
const fromBrand = BRANDS.find(entry => entry.urlDetail === 'brands/' + template + '.html');
const image = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const games = BRAND_NEW_GAMES[slug];
const providers = ['Rival', 'Dragon Gaming', 'Arrow’s Edge', 'DiceLab Slots', 'Fresh Deck Studios'].map(name => [name, null]);
const previous = ['Previous providers', 'Vorherige Anbieter', 'Proveedores anteriores', 'Fornitori precedenti', 'Poprzedni dostawcy', 'Попередні провайдери', 'Fornecedores anteriores', 'Fournisseurs précédents', 'पिछले प्रदाता', 'Edelliset pelintarjoajat'];
const next = ['Next providers', 'Nächste Anbieter', 'Siguientes proveedores', 'Fornitori successivi', 'Następni dostawcy', 'Наступні провайдери', 'Fornecedores seguintes', 'Fournisseurs suivants', 'अगले प्रदाता', 'Seuraavat pelintarjoajat'];
const snapshotIntro = [
  'The catalog separates casino games from live dealer tables.', 'Der Katalog trennt Casinospiele von Live-Tischen.',
  'El catálogo separa los juegos de casino de las mesas en vivo.', 'Il catalogo distingue i giochi da casinò dai tavoli dal vivo.',
  'Katalog oddziela gry kasynowe od stołów na żywo.', 'У каталозі ігри з дилерами відокремлені від інших ігор казино.',
  'O catálogo separa os jogos de casino das mesas ao vivo.', 'Le catalogue sépare les jeux de casino des tables en direct.',
  'कैटलॉग में कैसीनो गेम और लाइव टेबल अलग हैं।', 'Valikoima erottaa kasinopelit livepöydistä.',
];
const payoutCaveats = [
  'Estimates are not guaranteed. Wire and check are not available in Maryland or Washington. Deposits generally require 1× wagering before withdrawal; processing fees may apply.',
  'Die Zeiten sind Richtwerte. Überweisungen und Schecks sind in Maryland und Washington nicht verfügbar. Einzahlungen sind meist einmal umzusetzen. Gebühren sind möglich.',
  'Los plazos son orientativos. No hay transferencias ni cheques en Maryland o Washington. Por lo general, hay que apostar el depósito una vez antes de retirarlo. Pueden aplicarse comisiones.',
  'I tempi sono indicativi. Bonifici e assegni non sono disponibili in Maryland o Washington. Di norma il deposito va giocato una volta prima di prelevare. Possono applicarsi commissioni.',
  'Terminy są orientacyjne. Przelewy i czeki nie są dostępne w Maryland i stanie Waszyngton. Wpłatę zwykle trzeba obrócić raz przed wypłatą. Mogą obowiązywać opłaty.',
  'Строки орієнтовні. Перекази й чеки недоступні в Меріленді та штаті Вашингтон. Перед виплатою депозит зазвичай треба відіграти один раз. Можливі комісії.',
  'Os prazos são indicativos. Não há transferências nem cheques em Maryland ou Washington. Normalmente, é preciso apostar o depósito uma vez antes de levantar. Podem aplicar-se comissões.',
  'Les délais sont indicatifs. Les virements et chèques ne sont pas disponibles au Maryland ni dans l’État de Washington. En général, il faut miser le dépôt une fois avant le retrait. Des frais peuvent s’appliquer.',
  'समय अनुमान है। मैरीलैंड और वॉशिंगटन राज्य में बैंक ट्रांसफ़र और चेक नहीं हैं। आम तौर पर निकासी से पहले जमा एक बार दाँव पर लगानी होती है। शुल्क लग सकता है।',
  'Ajat ovat arvioita. Pankkisiirto ja shekki eivät ole saatavilla Marylandissa tai Washingtonin osavaltiossa. Talletus on yleensä pelattava kerran ennen kotiutusta. Maksuja voi tulla.',
];
const suitedFor = [
  'The catalog suits readers comparing slots, video poker, and live tables. The public catalog does not include a sportsbook.',
  'Der Katalog eignet sich zum Vergleich von Slots, Videopoker und Live-Spielen. Ein Sportwettenangebot ist nicht aufgeführt.',
  'El catálogo permite comparar tragamonedas, video póquer y juegos en vivo. No incluye una casa de apuestas deportivas.',
  'Il catalogo permette di confrontare slot, video poker e giochi dal vivo. Non comprende le scommesse sportive.',
  'Katalog pozwala porównać automaty, wideopokera i gry na żywo. Nie obejmuje zakładów sportowych.',
  'Каталог підійде тим, хто порівнює слоти, відеопокер та ігри з дилерами. Ставок на спорт у відкритому каталозі немає.',
  'O catálogo permite comparar slots, vídeo póquer e jogos ao vivo. Não inclui apostas desportivas.',
  'Le catalogue permet de comparer les machines à sous, le vidéo poker et les jeux en direct. Il ne comprend pas de paris sportifs.',
  'कैटलॉग स्लॉट, वीडियो पोकर और लाइव गेम की तुलना के लिए है। सार्वजनिक कैटलॉग में खेल सट्टेबाज़ी नहीं है।',
  'Valikoimassa voi vertailla kolikkopelejä, videopokeria ja livepelejä. Vedonlyöntiä ei ole julkisessa valikoimassa.',
];
const matchCap = [
  '10× the deposit', '10× der Einzahlung', '10 veces el depósito', '10 volte il deposito', '10-krotność wpłaty',
  '10× від суми депозиту', '10 vezes o valor do depósito', '10 fois le dépôt', 'जमा राशि का 10 गुना', '10 kertaa talletussumma',
];
const maxPerDeposit = [
  'Maximum match per deposit', 'Maximaler Bonus pro Einzahlung', 'Bono máximo por depósito', 'Bonus massimo per deposito',
  'Maksymalny bonus na wpłatę', 'Максимальний бонус за депозит', 'Bónus máximo por depósito', 'Bonus maximal par dépôt',
  'हर जमा पर अधिकतम बोनस', 'Enimmäisbonus talletusta kohti',
];
const p = value => '<p class="section-intro">' + esc(value) + '</p>';
const h = value => '<h3>' + esc(value) + '</h3>';
const table = (headers, rows) => reviewTable(headers, rows, { rowHeaders: true });
const load = file => readFileSync(file, 'utf8');
function save(file, output) {
  if (existsSync(file) && load(file) === output) return;
  if (check) {
    console.error('Stale Jacks Pay output: ' + file);
    process.exitCode = 1;
  } else {
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, output);
  }
}
if (!image || games?.length !== 6 || brand?.countries.join() !== 'US' || brand.bonus !== headlines.en) throw new Error('Incomplete Jacks Pay registry');
const rename = value => value.replaceAll(fromBrand.image, brand.image).replaceAll(fromBrand.name, brand.name).replaceAll(template, slug);

for (const [i, lang] of locales.entries()) {
  const c = copy[lang];
  const [, , , labels, , , , , cardDeposits, , identity] = sharedUsCasinoCopy[lang];
  const [reviewed, market, standard, crypto, bonusRange, wagering, cap, , depositAndBonus, , ,
    method, min, timing, days, deposits, withdrawals, weekly, wire, paper, topic, details, license,
    rules, , help, pros, cons, beforeSignup] = labels.split('|');
  const localeText = (...values) => values[i];
  const label = key => reviewSectionLabel(key, localeText);
  const usd = amount => money(lang, amount);
  const elapsed = amount => amount + ' ' + (lang === 'pl' && amount === 4 ? 'dni robocze' : days);
  const pagePath = reviewPath(lang);
  const welcome = headlines[lang], cryptoBonus = offer(lang, true);
  const payout = [['Bitcoin (BTC) / Tether (USDT)', usd(25), elapsed(4)], [wire, usd(150), elapsed(20)], [paper, usd(150), elapsed(20)]];
  const weeklyLimit = weekly + ': ' + usd(2500) + '.';
  const section = (key, inner, tab = false) => '<section class="container" id="' + (key === 'faq' ? 'faq' : slug + '-' + key) +
    '" data-review-section="' + key + '"' + (tab ? ' data-review-details' : '') + '><h2 class="title">' + esc(label(key)) + '</h2>' + inner + '</section>';
  const faq = c.questions.split('|').map((question, n) => [question, [
    standard + ': ' + welcome + '. ' + crypto + ': ' + cryptoBonus + '.',
    c.chipTerms,
    standard + ': 20× (' + depositAndBonus + '). ' + crypto + ': 30× (' + depositAndBonus + '). ' + cap + ': ' + matchCap[i] + '.',
    c.games.split('. ').at(-1),
    payout.map(([name, amount, time]) => name + ': ' + amount + ' (' + time + ').').join(' ') + ' ' + weeklyLimit + ' ' + payoutCaveats[i],
    identity, c.cashback, c.license,
  ][n]]);
  const comparison = c.compare.split('|');
  const body = [
    section('summary', table([topic, details], [
      [standard, welcome], [crypto, cryptoBonus], [weekly, usd(2500)], [label('games'), 'Fresh Deck · Eclipse of Ra · Mythic Wolf'], [license, c.license],
    ])),
    section('bonuses', p(c.chipTerms) + p(standard + ': ' + welcome) + p(crypto + ': ' + cryptoBonus), true),
    section('bonus-terms', table([topic, standard, crypto], [
      [bonusRange, usd(25) + '–' + usd(1000), usd(25) + '–' + usd(1000)],
      [maxPerDeposit[i], usd(2000), usd(2500)],
      [wagering + ' (' + depositAndBonus + ')', '20×', '30×'],
      [cap, matchCap[i], matchCap[i]],
    ]) + p(c.bonusTerms), true),
    section('games', p(c.games), true),
    section('rewards', p(c.vip) + p(c.cashback), true),
    section('cashier', h(deposits) + p(cardDeposits) + h(withdrawals) + table([method, min, timing], payout) +
      p(weeklyLimit) + p(payoutCaveats[i]) + p(identity), true),
    section('trust', table([topic, details], [[license, c.license], [rules, c.account], [help, c.support]]), true),
    reviewProviderStrip({ id: slug + '-providers', heading: label('providers'), providers, previous: previous[i], next: next[i] }),
    section('pros', reviewCards([[pros, comparison.slice(0, 4)], [cons, comparison.slice(4)]], { comparison: true })),
    section('suitability', reviewCards([[label('games'), suitedFor[i]], [beforeSignup, c.safety]])),
    section('faq', '<div class="timeline">' + faq.map(([q, a]) => h(q) + '<p>' + esc(a) + '</p>').join('') + '</div>'),
  ].join('\n      ');
  const geo = reviewCountries({
    heading: label('countries'),
    countries: [{ name: market, href: prefix(lang) + 'online-casinos/united-states/', flag: '/icons/united-states-flag-icon.svg' }],
    payments: { heading: label('methods'), methods: brand.payments },
  });
  const gallery = renderBrandNewGamesPanel({ games, pageBrand: brand, brandName: brand.name, escapeHtml: esc, localeText });
  const html = load('.' + reviewPath(lang, template) + 'index.html');
  const hero = html.match(/<section class="hero container">[\s\S]*?<\/section>/)?.[0];
  const zoom = html.match(/<button\b[^>]*class="brand-why-media"[\s\S]*?<\/button>/)?.[0];
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!hero || !zoom || !schema) throw Error('Incomplete review template for ' + lang);
  const stamp = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const heroMarkup = rename(hero)
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/, () => '<h1>' + esc(c.reviewTitle) + '</h1>')
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, () => '<p class="hero-subtitle">' + esc(c.overview) + '</p>')
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () =>
      '<p class="hero-subtitle editorial-meta">' + esc(reviewed) + ': <time datetime="' + date + '">' + esc(stamp) + '</time></p>')
    .replaceAll(esc(fromBrand.urlCasino), esc(brand.urlCasino));
  const preview = zoom.replace(/<img\b[^>]*>/, () => '<img src="' + esc(image) + '" alt="' + esc(brand.name + ' — ' + label('games')) +
    '" width="3020" height="1592" loading="eager" fetchpriority="high" decoding="async" />');
  const highlights = [
    [standard, welcome, 'bonus'], [crypto, cryptoBonus, 'wallet'], [label('games'), 'Fresh Deck · JacksPay Originals', 'games'],
    [label('rewards'), 'Jack’s Royal Club', 'trophy'], [weekly, usd(2500), 'payments'], [label('countries'), market, 'globe'],
  ];
  const features = '<section class="container features-section glass-section brand-highlights--compact" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">' +
    esc(label('highlights')) + '</h2>' + preview + '</div><div class="features-grid premium-grid">' + highlights.map(([heading, value, icon]) =>
    '<div class="feature-card glass-card">' + siteIconMarkup(icon, 'site-icon brand-highlight-icon', 18) + '<strong>' + esc(heading) +
    '</strong><span>' + esc(value) + '</span></div>').join('') + '</div></section>';

  const description = c.reviewTitle + ': ' + welcome + '. ' + weeklyLimit;
  const graph = JSON.parse(rename(schema[1]));
  Object.assign(graph['@graph'].find(node => node['@type'] === 'WebPage'), { name: c.title, description, datePublished: date, dateModified: date, image });
  graph['@graph'].find(node => node['@type'] === 'BreadcrumbList').itemListElement[2].name = c.reviewTitle;
  graph['@graph'].find(node => node['@type'] === 'FAQPage').mainEntity = faq.map(([name, text]) =>
    ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  const meta = (source, key, value) => source.replace(new RegExp('(<meta\\s+(?:name|property)="' + key + '"\\s+content=")[^"]*(")'), (_, a, b) => a + esc(value) + b);
  let output = rename(html)
    .replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, (_, a, b) => a + JSON.stringify(graph).replaceAll('<', '\\u003c') + b)
    .replace(/<title>[\s\S]*?<\/title>/, () => '<title>' + esc(c.title) + '</title>')
    .replace(/<section class="hero container">[\s\S]*?<main class="content-review">[\s\S]*?<\/main>/, () =>
      [heroMarkup, gallery, features, geo, '<main class="content-review">\n      ' + body + '\n    </main>'].join('\n\n    '))
    .replace(/(src="\/scripts\/main\.js\?v=)[^"]+/, (_, start) => start + '20261124-jackspay-copy')
    .replace(/(href="\/styles\.css\?v=)[^"]+/, (_, start) => start + '20261124-sticky-logo');
  for (const key of ['og:title', 'twitter:title']) output = meta(output, key, c.title);
  for (const key of ['description', 'og:description', 'twitter:description']) output = meta(output, key, description);
  for (const key of ['og:image', 'twitter:image']) output = meta(output, key, image);
  output = meta(output, 'brand-snapshot-intro', snapshotIntro[i]);
  save('.' + pagePath + 'index.html', syncDefaultTheme(output).trimEnd() + '\n');

  const directoryFile = '.' + prefix(lang) + 'casinos-and-betting/index.html';
  const directory = load(directoryFile);
  const entries = [...directory.matchAll(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)];
  const templateRow = entries.find(([row]) => row.includes('href="' + reviewPath(lang, template) + '"'))?.[0];
  if (!templateRow) throw new Error('Missing catalog template for ' + lang);
  const row = rename(templateRow).replaceAll(esc(fromBrand.urlCasino), esc(brand.urlCasino)).replaceAll(fromBrand.bgColor, brand.bgColor)
    .replace(esc(sharedUsCasinoCopy[lang][1]), () => esc(welcome));
  if (!row.includes(esc(welcome))) throw new Error('Missing catalog bonus for ' + lang);
  const existingRow = entries.find(([item]) => item.includes('href="' + pagePath + '"'))?.[0];
  const after = entries.find(([item]) => item.match(/<strong class="casino-name">([^<]+)<\/strong>/)?.[1].localeCompare(brand.name, 'en') > 0)?.[0];
  if (!existingRow && !after) throw new Error('Missing catalog insertion point for ' + lang);
  save(directoryFile, existingRow ? directory.replace(existingRow, () => row) : directory.replace(after, () => row + '\n\n            ' + after));
}

const sitemap = load('sitemap.xml');
let updated = sitemap;
for (const lang of locales) {
  const url = origin + reviewPath(lang);
  const oldUrl = origin + reviewPath(lang, template);
  const blocks = [...updated.matchAll(/  <url>\n[\s\S]*?  <\/url>/g)];
  const old = blocks.find(([entry]) => entry.includes('<loc>' + oldUrl + '</loc>'))?.[0];
  if (!old) throw new Error('Missing sitemap review template for ' + lang);
  const current = blocks.find(([entry]) => entry.includes('<loc>' + url + '</loc>'))?.[0];
  const entry = old.replace(oldUrl, url).replace(/<lastmod>[^<]+<\/lastmod>/, '<lastmod>' + date + '</lastmod>');
  const nextEntry = blocks.find(([item]) => item.match(/<loc>([^<]+)<\/loc>/)?.[1].localeCompare(url, 'en') > 0)?.[0];
  if (!current && !nextEntry) throw new Error('Missing sitemap insertion point for ' + lang);
  updated = current ? updated.replace(current, () => entry) : updated.replace(nextEntry, () => entry + '\n' + nextEntry);
}
save('sitemap.xml', updated);
