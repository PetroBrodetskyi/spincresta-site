import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
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
import { allStarCopy, allStarHeadline } from './allstarslots-review-copy.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const slug = 'allstarslots';
const template = 'jackspay';
const date = '2026-11-27';
const origin = 'https://spincresta.com';
const check = process.argv.includes('--check');
const prefix = lang => lang === 'en' ? '/' : '/' + lang + '/';
const route = (lang, key = slug) => prefix(lang) + 'brands/' + key + '/';
const registered = key => BRANDS.find(b => b.urlDetail === 'brands/' + key + '.html');
const brand = registered(slug);
const from = registered(template);
const capture = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const games = BRAND_NEW_GAMES[slug];
const providers = getReviewProviders(slug);
const load = file => readFileSync(file, 'utf8');
const p = text => '<p class="section-intro">' + esc(text) + '</p>';
const h = text => '<h3>' + esc(text) + '</h3>';
const table = (head, rows) => reviewTable(head, rows, { rowHeaders: true });
const meta = (source, key, value) => source.replace(new RegExp('(<meta\\s+(?:name|property)="' + key + '"\\s+content=")[^"]*(")'), (_, a, b) => a + esc(value) + b);
const rename = text => text.replaceAll(from.image, brand.image).replaceAll(template, slug)
  .replaceAll(esc(from.urlCasino), esc(brand.urlCasino)).replaceAll(from.name, brand.name);
function save(file, contents) {
  if (existsSync(file) && load(file) === contents) return;
  if (check) {
    console.error('Outdated All Star Slots output: ' + file);
    process.exitCode = 1;
    return;
  }
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
}
if (brand?.countries.join() !== 'US' || brand.reviewComingSoon || brand.bonus !== allStarHeadline('en') ||
    !existsSync(brand.image) || !capture || games?.length !== 6 || !providers.length) throw Error('Incomplete All Star Slots registry');
const depositTiers = [[35, 99.99, 250, 300], [100, 249.99, 350, 400], [250, null, 450, 500]];
const sectionIds = ['summary', 'bonuses', 'bonus-terms', 'games', 'rewards', 'cashier', 'trust'];

for (const [i, lang] of locales.entries()) {
  const [names, overview, columns, offer, gameCopy, rewards, depositCopy, payoutCopy, kyc, licenseCopy, safety, prosCons, suitability, questions] = allStarCopy[lang];
  const [reviewTitle, title, headline] = names.split('|');
  const [tier, nonCrypto, crypto, maxBonus, maxBet, cap, noCap, fee, slots] = columns.split('|');
  const [reviewed, market, , , , wagering, , , , , , method, , , , deposits, withdrawals, weekly,
    wire, paper, topic, details, license, , , support, pros, cons, beforeSignup] = usLabels[lang][3].split('|');
  const localeText = (...text) => text[i];
  const label = key => reviewSectionLabel(key, localeText);
  const usd = number => money(lang, number);
  const rate = value => new Intl.NumberFormat(lang,{ style: 'percent' }).format(value / 100);
  const weeklyLine = weekly + ': ' + usd(5001);
  const range = (lo, hi) => hi === null ? usd(lo) + '+' : usd(lo) + '–' + usd(hi);
  const faq = questions.split('|').map((question, j) => [question, [
    headline + '. ' + nonCrypto + ': ' + depositTiers.map(([, , rateA]) => rate(rateA)).join(' / ') + '. ' +
      crypto + ': ' + depositTiers.map(([, , , rateB]) => rate(rateB)).join(' / ') + '. ' + tier + ': ' + depositTiers.map(([lo, hi]) => range(lo, hi)).join(' / ') + '.',
    offer, gameCopy, rewards, payoutCopy, kyc, licenseCopy, safety,
  ][j]]);
  const facts = [
    [label('bonuses'), headline], [wagering, '50×'], [weekly, usd(5001)], [label('games'), 'Realtime Gaming (RTG)'],
    [label('rewards'), 'All Star Rewards'], [label('countries'), market],
  ];
  const summary = table([topic, details], facts);
  const bonus = table([tier, nonCrypto, crypto], depositTiers.map(([lo, hi, a, b]) => [range(lo, hi), rate(a), rate(b)]));
  const bonusTerms = table([topic, details], [[maxBonus, usd(4500)], [wagering, '50×'], [maxBet, usd(10)], [label('games'), slots], [cap, noCap]]) + p(offer);
  const cashier = h(deposits) + p(depositCopy) + h(withdrawals) +
    table([method, fee], [['Bitcoin (BTC) / Litecoin (LTC) / Interac', usd(0)], [wire, usd(25)], [paper, usd(25)]]) +
    p(payoutCopy) + h('KYC') + p(kyc);
  const detailsSections = [summary, bonus, bonusTerms, p(gameCopy), p(rewards), cashier,
    table([topic, details], [[license, licenseCopy], [support, safety]])];
  const section = (key, inner, tab = false) => '<section class="container" id="' + (key === 'faq' ? 'faq' : slug + '-' + key) +
    '" data-review-section="' + key + '"' + (tab ? ' data-review-details' : '') + '><h2 class="title">' + esc(label(key)) + '</h2>' + inner + '</section>';
  const comparison = prosCons.split('|');
  const fit = suitability.split('|');
  if (comparison.length !== 8 || fit.length !== 2 || faq.length !== 8) throw Error('Incomplete copy for ' + lang);
  const sections = [
    ...sectionIds.map((key, j) => section(key, detailsSections[j], key !== 'summary')),
    reviewProviderStrip({
      id: slug + '-providers', heading: label('providers'), providers,
      previous: localeText('Previous providers', 'Vorherige Anbieter', 'Proveedores anteriores', 'Fornitori precedenti', 'Poprzedni dostawcy', 'Попередні провайдери', 'Fornecedores anteriores', 'Fournisseurs précédents', 'पिछले प्रदाता', 'Edelliset pelintarjoajat'),
      next: localeText('Next providers', 'Nächste Anbieter', 'Siguientes proveedores', 'Fornitori successivi', 'Następni dostawcy', 'Наступні провайдери', 'Fornecedores seguintes', 'Fournisseurs suivants', 'अगले प्रदाता', 'Seuraavat pelintarjoajat'),
    }),
    section('pros', reviewCards([[pros, comparison.slice(0, 4)], [cons, comparison.slice(4)]], { comparison: true })),
    section('suitability', reviewCards([[label('games'), fit[0]], [beforeSignup, fit[1]]])),
    section('faq', '<div class="timeline">' + faq.map(([q, a]) => h(q) + '<p>' + esc(a) + '</p>').join('') + '</div>'),
  ];
  const geo = reviewCountries({
    heading: label('countries'),
    countries: [{ name: market, href: prefix(lang) + 'online-casinos/united-states/', flag: '/icons/united-states-flag-icon.svg' }],
    payments: { heading: label('methods'), methods: brand.payments },
  });
  const gallery = renderBrandNewGamesPanel({ games, pageBrand: brand, brandName: brand.name, escapeHtml: esc, localeText });
  const html = load('.' + route(lang, template) + 'index.html');
  const hero = html.match(/<section class="hero container">[\s\S]*?<\/section>/)?.[0];
  const zoom = html.match(/<button\b[^>]*class="brand-why-media"[\s\S]*?<\/button>/)?.[0];
  const schema = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!hero || !zoom || !schema) throw Error('Incomplete template for ' + lang);
  const stamp = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const heroMarkup = rename(hero)
    .replace(/class="brand-logo-container hero-logo"/, 'class="brand-logo-container hero-logo" style="background-color: ' + esc(brand.bgColor) + ';"')
    .replace(/<h1[^>]*>[\s\S]*?<\/h1>/, () => '<h1>' + esc(reviewTitle) + '</h1>')
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, () => '<p class="hero-subtitle">' + esc(overview) + '</p>')
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () =>
      '<p class="hero-subtitle editorial-meta">' + esc(reviewed) + ': <time datetime="' + date + '">' + esc(stamp) + '</time></p>');
  const imageMarkup = zoom.replace(/<img\b[^>]*>/, () => '<img src="' + esc(capture) + '" alt="' + esc(brand.name + ' — ' + label('games')) +
    '" loading="eager" fetchpriority="high" decoding="async" />');
  const features = '<section class="container features-section glass-section brand-highlights--compact" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">' +
    esc(label('highlights')) + '</h2>' + imageMarkup + '</div><div class="features-grid premium-grid">' + facts.map(([key, value], j) =>
    '<div class="feature-card glass-card">' + siteIconMarkup(['bonus', 'wallet', 'payments', 'games', 'trophy', 'globe'][j], 'site-icon brand-highlight-icon', 18) +
    '<strong>' + esc(key) + '</strong><span>' + esc(value) + '</span></div>').join('') + '</div></section>';
  const description = reviewTitle + ': ' + headline + '. ' + wagering + ' 50×. ' + weeklyLine + '.';
  const graph = JSON.parse(rename(schema));
  Object.assign(graph['@graph'].find(n => n['@type'] === 'WebPage'), { name: title, description, datePublished: date, dateModified: date, image: capture });
  graph['@graph'].find(n => n['@type'] === 'BreadcrumbList').itemListElement[2].name = reviewTitle;
  graph['@graph'].find(n => n['@type'] === 'FAQPage').mainEntity = faq.map(([name, text]) =>
    ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  let output = rename(html)
    .replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, (_, a, b) => a + JSON.stringify(graph).replaceAll('<', '\\u003c') + b)
    .replace(/<title>[\s\S]*?<\/title>/, () => '<title>' + esc(title) + '</title>')
    .replace(/<section class="hero container">[\s\S]*?<main class="content-review">[\s\S]*?<\/main>/, () =>
      [heroMarkup, gallery, features, geo, '<main class="content-review">\n      ' + sections.join('\n      ') + '\n    </main>'].join('\n\n    '))
    .replace(/(src="\/scripts\/main\.js\?v=)[^"]+/, (_, start) => start + '20261127-allstarslots-review');
  for (const key of ['og:title', 'twitter:title']) output = meta(output, key, title);
  for (const key of ['description', 'og:description', 'twitter:description']) output = meta(output, key, description);
  for (const key of ['og:image', 'twitter:image']) output = meta(output, key, capture);
  output = meta(output, 'brand-snapshot-intro', localeText(
    'Slots, jackpots and video poker are listed separately from live-dealer tables.',
    'Slots, Jackpots und Videopoker sind getrennt von Live-Tischen aufgeführt.',
    'Las tragamonedas, los jackpots y el video póquer se muestran aparte de las mesas en vivo.',
    'Slot, jackpot e video poker sono separati dai tavoli con croupier dal vivo.',
    'Automaty, jackpoty i wideopoker są oddzielone od stołów na żywo.',
    'Слоти, джекпоти й відеопокер відокремлені від ігор із дилерами.',
    'As slots, os jackpots e o vídeo póquer estão separados das mesas ao vivo.',
    'Les machines à sous, jackpots et jeux de vidéo poker sont séparés des tables en direct.',
    'स्लॉट, जैकपॉट और वीडियो पोकर लाइव डीलर टेबल से अलग हैं।',
    'Kolikkopelit, jättipotit ja videopokeri on erotettu livepöydistä.'
  ));
  save('.' + route(lang) + 'index.html', syncDefaultTheme(output).trimEnd() + '\n');

  const directoryPath = '.' + prefix(lang) + 'casinos-and-betting/index.html';
  const directory = load(directoryPath);
  const rows = [...directory.matchAll(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g)].map(([row]) => row);
  const rowFrom = rows.find(row => row.includes('href="' + route(lang, template) + '"'));
  const old = rows.find(row => row.includes('href="' + route(lang) + '"'));
  const next = rows.find(row => row.match(/<strong class="casino-name">([^<]+)<\/strong>/)?.[1].localeCompare(brand.name, 'en') > 0);
  if (!rowFrom || (!old && !next)) throw Error('Incomplete directory for ' + lang);
  let ordinal = 0;
  const row = rename(rowFrom).replaceAll(from.bgColor, brand.bgColor)
    .replace(/(<p class="casino-bonus">\s*<strong>[^<]+<\/strong>)(\s*)[\s\S]*?(\s*<\/p>)/g,
      (original, start, space, end) => ++ordinal === 2 ? start + space + esc(headline) + end : original);
  if (ordinal !== 3 || !row.includes(esc(headline))) throw Error('Bonus not found in directory for ' + lang);
  save(directoryPath, old ? directory.replace(old, () => row) : directory.replace(next, () => row + '\n            ' + next));
}

// Keep other brands' sitemap entries and dates when regenerating these reviews.
const sitemap = load('sitemap.xml');
let updated = sitemap;
for (const lang of locales) {
  const url = origin + route(lang);
  const entries = [...updated.matchAll(/  <url>\n[\s\S]*?  <\/url>/g)].map(([entry]) => entry);
  const base = entries.find(entry => entry.includes('<loc>' + origin + route(lang, template) + '</loc>'));
  const current = entries.find(entry => entry.includes('<loc>' + url + '</loc>'));
  const next = entries.find(entry => entry.match(/<loc>([^<]+)<\/loc>/)?.[1].localeCompare(url, 'en') > 0);
  if (!base || (!current && !next)) throw Error('Missing sitemap template for ' + lang);
  const row = base.replace(origin + route(lang, template), url).replace(/<lastmod>[^<]+<\/lastmod>/, '<lastmod>' + date + '</lastmod>');
  updated = current ? updated.replace(current, () => row) : updated.replace(next, () => row + '\n' + next);
}
save('sitemap.xml', updated);
