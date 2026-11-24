import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { accountCopy, copy, copyKeys, editorial, labels } from './bitgames-review-copy.mjs';
import { escapeReview as esc, reviewCards, reviewCountries, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const origin = 'https://spincresta.com';
const date = '2026-11-24';
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const route = lang => prefix(lang) + 'brands/bitgames/';
const brand = BRANDS.find(item => item.urlDetail === 'brands/bitgames.html');
const picture = BRAND_HOMEPAGE_SCREENSHOTS.bitgames;
const providers = getReviewProviders('bitgames');
const check = process.argv.includes('--check');
const usdtNetworks = [
  ['Tron (TRC-20)', 1], ['Ethereum (ERC-20)', 4], ['BNB Smart Chain (BEP-20)', 1], ['TON mainnet', 1],
  ['Polygon (POL)', 2], ['Solana', 3], ['Arbitrum (ARB)', 2],
];
const cashbackRates = [
  [1, 1157, 34], [2, 3472, 46], [3, 5787, 57], [4, 9260, 92],
  [5, 11575, 173], [10, 115754, 231], [20, 231509, 347], [30, 578772, 578],
];
const questions = {
  en: ['Does the BitGames welcome offer apply in South Korea?', 'How is BitGames slot cashback calculated?', 'What are the BitGames withdrawal limits?', 'Is BitGames licensed in South Korea?'],
  de: ['Gilt das BitGames-Willkommensangebot in Südkorea?', 'Wie wird das Slots-Cashback berechnet?', 'Welche Auszahlungslimits gelten bei BitGames?', 'Hat BitGames eine Lizenz in Südkorea?'],
  es: ['¿La oferta de bienvenida de BitGames se aplica a Corea del Sur?', '¿Cómo se calcula el reembolso en tragamonedas?', '¿Qué límites de retiro aplica BitGames?', '¿Tiene BitGames licencia en Corea del Sur?'],
  it: ['L’offerta di benvenuto BitGames vale in Corea del Sud?', 'Come si calcola il cashback sulle slot?', 'Quali sono i limiti di prelievo di BitGames?', 'BitGames ha una licenza in Corea del Sud?'],
  pl: ['Czy oferta powitalna BitGames obowiązuje w Korei Południowej?', 'Jak obliczany jest cashback na automatach?', 'Jakie są limity wypłat BitGames?', 'Czy BitGames ma licencję w Korei Południowej?'],
  uk: ['Чи діє вітальна пропозиція BitGames у Південній Кореї?', 'Як розраховують кешбек BitGames за слоти?', 'Які ліміти виплат у BitGames?', 'Чи має BitGames ліцензію в Південній Кореї?'],
  pt: ['A oferta de boas-vindas da BitGames aplica-se à Coreia do Sul?', 'Como se calcula o cashback nas slots?', 'Quais são os limites de levantamento da BitGames?', 'A BitGames tem licença na Coreia do Sul?'],
  fr: ['L’offre de bienvenue BitGames s’applique-t-elle à la Corée du Sud ?', 'Comment le cashback sur les machines à sous est-il calculé ?', 'Quels sont les plafonds de retrait de BitGames ?', 'BitGames possède-t-il une licence en Corée du Sud ?'],
  hi: ['क्या BitGames का वेलकम ऑफ़र दक्षिण कोरिया में लागू है?', 'स्लॉट कैशबैक की गणना कैसे होती है?', 'BitGames में निकासी की सीमाएँ क्या हैं?', 'क्या BitGames के पास दक्षिण कोरिया में लाइसेंस है?'],
  fi: ['Koskeeko BitGamesin tervetulotarjous Etelä-Koreaa?', 'Miten kolikkopelien cashback lasketaan?', 'Mitkä ovat BitGamesin kotiutusrajat?', 'Onko BitGamesilla pelilupa Etelä-Koreassa?'],
};
if (!brand?.hasDetailPage || brand.countries.join() !== 'KR' || !picture || providers.length < 7) {
  throw new Error('Incomplete BitGames registry');
}
const save = (file, value) => {
  if (existsSync(file) && readFileSync(file, 'utf8') === value) return;
  if (check) {
    console.error('Stale BitGames output: ' + file);
    process.exitCode = 1;
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, value);
};
const p = value => '<p class="section-intro">' + esc(value) + '</p>';
const ctaPattern = /(<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>)/;

for (const [i, lang] of locales.entries()) {
  if (copy[lang]?.length !== copyKeys.length) throw new Error('Incomplete BitGames copy: ' + lang);
  const c = Object.fromEntries(copyKeys.map((key, j) => [key, copy[lang][j]]));
  const [
    country, market, checked, topic, details, slots, live, quick, cashback, wagers, cap, points, offer,
    limits, withdrawals, identity, license, safer, support, pros, cons, suits, caution, guide, previous, next, sports, acca,
  ] = labels[lang].split('|');
  const [
    reviewTitle, rewards, cashbackRate, selections, unverified, bannerScope, payoutUnknown,
    liveFeature, sportsFeature, cashbackFeature, offerUnknown, licenseUnknown, ...extraQuestions
  ] = editorial[lang].split('|');
  if (extraQuestions.length !== 3) throw new Error('Incomplete BitGames editorial labels: ' + lang);
  const [
    cryptoHeading, accountBonus, accountOffer, bonusRules, bonusCancellation, depositCurrencies,
    fiatStatus, withdrawalGate, usdtHeading, estimatedCredit, timeNote, sportsbookTools,
  ] = accountCopy[lang].split('|');
  if (!sportsbookTools) throw new Error('Incomplete account findings: ' + lang);
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const shell = readFileSync('.' + prefix(lang) + 'brands/coldbet/index.html', 'utf8');
  const take = re => {
    const fragment = shell.match(re)?.[1];
    if (!fragment) throw new Error('Missing shell fragment for ' + lang + ': ' + re);
    return fragment;
  };
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const number = new Intl.NumberFormat(locale).format;
  const minutes = new Intl.NumberFormat(locale, { style: 'unit', unit: 'minute', unitDisplay: 'short' }).format;
  const pct = rate => new Intl.NumberFormat(locale, { style: 'percent' }).format(rate / 100);
  const stamp = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const url = origin + route(lang);
  const cashbackRange = pct(1) + '–' + pct(30);
  const freeSpins = ['free spins', 'Freispiele', 'giros gratis', 'giri gratis', 'darmowych spinów',
    'фріспінів', 'jogadas grátis', 'tours gratuits', 'फ़्री स्पिन', 'ilmaiskierrosta'][i];
  const welcomeBanner = pct(600) + ' · ' + number(350) + ' ' + freeSpins;
  const alt = 'BitGames — ' + label('overview');
  const section = (kind, body, tab = false, heading = label(kind), attributes = '') =>
    '<section class="container" id="' + (kind === 'faq' ? 'faq' : 'bitgames-' + kind) +
    '" data-review-section="' + kind + '"' + (tab ? ' data-review-details' : '') + attributes +
    '><h2 class="title">' + esc(heading) + '</h2>' + body + '</section>';
  const table = rows => reviewTable([topic, details], rows, { rowHeaders: true });
  const cta = take(ctaPattern).replace(/href="[^"]+"/, 'href="' + esc(brand.urlCasino) + '"');
  const hero = take(/(<section class="hero container">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*class="brand-logo"[^>]*>/, '<img class="brand-logo" src="/' + esc(brand.image) + '" alt="BitGames" width="2172" height="724" decoding="async" />')
    .replace(/<h1>[^<]+<\/h1>/, '<h1>' + esc(reviewTitle) + '</h1>')
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, '<p class="hero-subtitle">' + esc(c.overview) + '</p>')
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, '<p class="hero-subtitle editorial-meta">' +
      esc(checked) + ': <time datetime="' + date + '">' + esc(stamp) + '</time></p>')
    .replace(ctaPattern, () => cta);
  const facts = [
    [market, country, 'safety'], [slots, 'Gamzix · 3 Oaks · 100HP', 'games'],
    [live, 'Pragmatic Play · Ezugi', 'games'], [sports, 'CS2 · Dota 2 · Valorant', 'trophy'],
    [cashback, cashbackRange, 'bonus'], [points, number(1200) + ' → ' + number(10350) + ' KRW', 'balance'],
  ];
  let fact = 0;
  const highlights = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/)
    .replace('features-section glass-section', 'features-section glass-section brand-highlights--compact')
    .replace(/<img\b[^>]*>/, '<img src="' + esc(picture) + '" alt="' + esc(alt) +
      '" width="1600" height="838" loading="eager" fetchpriority="high" decoding="async" />')
    .replace(/<div class="icon-placeholder">\d+<\/div>\s*<strong>[^<]*<\/strong>\s*<span>[\s\S]*?<\/span>/g, () => {
      const [title, value, icon] = facts[fact++];
      return siteIconMarkup(icon, 'site-icon brand-highlight-icon', 18) + '<strong>' + esc(title) + '</strong><span>' + esc(value) + '</span>';
    });
  if (fact !== facts.length) throw new Error('Incomplete BitGames highlights: ' + lang);
  const geo = reviewCountries({
    heading: label('countries'),
    countries: [{
      name: country,
      label: guide,
      href: prefix(lang) + 'online-casinos/south-korea/',
      flag: '/icons/south-korea-flag-icon.svg',
    }],
    payments: { heading: cryptoHeading, methods: brand.payments },
  });
  const faq = [...questions[lang], ...extraQuestions]
    .map((q, j) => [q, [c.welcome + ' ' + accountBonus + ': ' + accountOffer, c.cashback, withdrawalGate + ' ' + c.withdrawals,
      c.license, c.points, c.acca, withdrawalGate + ' ' + c.kyc][j]]);
  const org = { '@id': origin + '/#organization' };
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', ...org, name: 'SpinCresta', url: origin + '/' },
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, breadcrumb: { '@id': url + '#breadcrumb' } },
    { '@type': 'Article', '@id': url + '#article', headline: c.h1, description: c.description, inLanguage: lang,
      image: [picture], mainEntityOfPage: { '@id': url }, author: org, publisher: org, dateModified: date },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SpinCresta', item: origin + prefix(lang) },
      { '@type': 'ListItem', position: 2, name: 'BitGames', item: url },
    ] },
  ] };
  const meta = [['title', c.title], ['description', c.description], ['image', picture]]
    .flatMap(([key, value]) => ['<meta property="og:' + key + '" content="' + esc(value) + '" />', '<meta name="twitter:' + key + '" content="' + esc(value) + '" />']);
  const page = [
    take(/^([\s\S]*?)<title>/) + '<title>' + esc(c.title) + '</title>',
    '<meta name="description" content="' + esc(c.description) + '" />',
    '<link rel="canonical" href="' + url + '" />',
    ...[...locales, 'x-default'].map(code => '<link rel="alternate" hreflang="' + (code === 'fi' ? 'fi-FI' : code) +
      '" href="' + origin + route(code === 'x-default' ? 'en' : code) + '" />'),
    '<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />',
    '<meta property="og:type" content="article" />',
    '<meta property="og:url" content="' + url + '" />',
    '<meta property="og:site_name" content="SpinCresta" />',
    '<meta property="og:image:alt" content="' + esc(alt) + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...meta,
    take(/(<link rel="stylesheet"[^>]*>)/),
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>',
  ].join('\n    ') + '\n  </head>\n  <body data-brand="bitgames" data-language="' + lang +
    '" data-review-market-label="' + esc(market) + '" data-review-market-name="' + esc(country) + '">\n    ' + [
    take(/(<header class="header">[\s\S]*?<\/header>)/),
    hero, highlights, geo,
    '<main class="content-review">',
    '  ' + section('summary', table([
      [market, country],
      [label('games'), slots + ' · ' + live + ' · ' + quick],
      [label('sports'), sportsFeature],
      [rewards, cashbackRange + ' · ' + points],
      [cryptoHeading, 'USDT · ETH · TON · USDC · BNB · BTC · TRX · LTC'],
      [limits, payoutUnknown],
      [license, unverified],
    ])),
    '  ' + section('bonuses', table([
      [offer, welcomeBanner + ' — ' + bannerScope],
      [accountBonus, accountOffer],
      [cashback, cashbackRange + ' · ' + cashbackFeature],
      [points, number(1200) + ' → ' + number(10350) + ' KRW'],
    ]) + p(c.welcome), true),
    '  ' + section('bonus-terms', p(bonusRules) + p(bonusCancellation), true),
    '  ' + section('games', table([
      [slots, 'Chicken Pirate (100HP) · Coin Win: Hold The Spin (Gamzix) · Coin Volcano (3 Oaks) · Snow Party (Pragmatic Play)'],
      [live, 'Privé Lounge Russian Poker · HI-LO Baccarat · Amazing Baccarat · Money Time · Ultimate Roulette · VIP Roulette (Ezugi)'],
      [quick, 'BitGames Crash · BitGames Dice'],
    ]), true),
    '  ' + section('sports', p(c.sports) + p(sportsbookTools) + '<h3>' + esc(acca) + '</h3>' + p(c.acca) + reviewTable(
      [selections, acca], [7, 8, 9, 10, 11, 12, 15].map((rate, j) => [number(5 + j) + (j === 6 ? '+' : ''), pct(rate)]),
      { rowHeaders: true },
    ), true),
    '  ' + section('rewards', '<h3>' + esc(cashback) + '</h3>' + p(c.cashback) + reviewTable(
      [cashbackRate, wagers, cap], cashbackRates.map(([rate, minimum, maximum]) => [pct(rate), number(minimum), number(maximum)]),
      { rowHeaders: true },
    ) + '<h3>' + esc(points) + '</h3>' + p(c.points), true, rewards,
    ' data-review-tab-label="' + esc(rewards) + '" data-review-fact-label="' + esc(cashback) +
    '" data-review-fact-value="' + esc(cashbackRange) + '"'),
    '  ' + section('cashier', table([
      [cryptoHeading, depositCurrencies],
      [limits, fiatStatus + ' ' + c.cashier],
      [withdrawals, withdrawalGate + ' ' + c.withdrawals],
      [identity, c.kyc],
    ]) + '<h3>' + esc(usdtHeading) + '</h3>' + p(timeNote) + reviewTable(
      [usdtHeading, estimatedCredit], usdtNetworks.map(([network, time]) => [network, '≈ ' + minutes(time)]), { rowHeaders: true },
    ), true),
    '  ' + section('trust', table([[license, c.license], [safer, c.safer], [support, c.support]]) +
      p(c.market), true),
    '  ' + reviewProviderStrip({ id: 'bitgames-providers', heading: label('providers'), providers, previous, next }),
    '  ' + section('pros', reviewCards([
      [pros, [liveFeature, sportsFeature, cashbackFeature]],
      [cons, [offerUnknown, payoutUnknown, licenseUnknown]],
    ], { comparison: true })),
    '  ' + section('suitability', reviewCards([[suits, c.suits], [caution, c.caution]])),
    '  ' + section('faq', '<div class="timeline">' + faq.map(([q, a]) => '<h3>' + esc(q) + '</h3><p>' + esc(a) + '</p>').join('') + '</div>'),
    '</main>',
    take(/(<section class="all-countries">[\s\S]*$)/).trimEnd(),
  ].join('\n    ') + '\n';
  save('.' + route(lang) + 'index.html', syncDefaultTheme(page));
}

// Replace only this review family in the existing sitemap.
const sitemap = readFileSync('sitemap.xml', 'utf8');
const urls = new Set(locales.map(lang => origin + route(lang)));
const preserved = sitemap.replace(/  <url>\n[\s\S]*?  <\/url>\n/g, block =>
  urls.has(block.match(/<loc>([^<]+)<\/loc>/)?.[1]) ? '' : block,
);
const entries = [...urls].map(url => '  <url>\n    <loc>' + url + '</loc>\n    <lastmod>' + date +
  '</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.7</priority>\n  </url>\n').join('');
save('sitemap.xml', preserved.replace('</urlset>', entries + '</urlset>'));
