import { readFileSync, writeFileSync } from 'node:fs';
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
import { sunPalaceCopy, sunPalaceHeadings } from './sunpalace-review-copy.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const slug = 'sunpalace';
const check = process.argv.includes('--check');
const brand = BRANDS.find(b => b.urlDetail === `brands/${slug}.html`);
const date = brand.reviewUpdatedAt.slice(0, 10);
const image = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const games = BRAND_NEW_GAMES[slug];
const providers = getReviewProviders(slug);
const prefix = lang => lang === 'en' ? '/' : `/${lang}/`;
const read = file => readFileSync(file, 'utf8');
const h = value => `<h3>${esc(value)}</h3>`;
const p = value => `<p class="section-intro">${esc(value)}</p>`;
const table = (headers, rows) => reviewTable(headers, rows, { rowHeaders: true });

// Exact groupings from the operator's published USD banking tables.
const depositAmounts = [
  ['Bitcoin Lightning', 5],
  ['Google Pay · Apple Pay · Cash App · Bitcoin Cash · Litecoin', 10],
  ['Visa · Mastercard · Discover · Bitcoin · Ethereum', 25],
];

function save(path, previous, output) {
  if (previous === output) return;
  if (!check) return writeFileSync(path, output);
  console.error(`Stale Sun Palace output: ${path}`);
  process.exitCode = 1;
}

if (brand.countries.join() !== 'US' || !image || games.length !== 6 || !providers.length || brand.payments.includes('interac')) {
  throw Error('Incomplete or unverified Sun Palace data');
}

for (const [i, lang] of locales.entries()) {
  const loc = (...options) => options[i];
  const label = key => reviewSectionLabel(key, loc);
  const [seo, overview, rules, depositNote, payoutNote, verification, catalog, rewards, protection, licenseNote, comparison, suitability, faqQuestions] = sunPalaceCopy[lang];
  const [title, heading, screenshotLabel, cta] = sunPalaceHeadings[lang];
  const [reviewed, market, , , , wagering, , , , , , method, , , , deposits, withdrawals,
    , , , topic, details, license, , , support, pros, cons, beforeSignup] = usLabels[lang][3].split('|');
  const usd = value => money(lang, value);
  const pct = value => new Intl.NumberFormat(lang, { style: 'percent' }).format(value / 100);
  const minimum = loc('Minimum', 'Minimum', 'Mínimo', 'Minimo', 'Minimum', 'Мінімум', 'Mínimo', 'Minimum', 'न्यूनतम', 'Vähintään');
  const processing = loc('Published processing time', 'Angegebene Bearbeitungszeit', 'Plazo de tramitación publicado', 'Tempo di elaborazione pubblicato', 'Podany czas realizacji', 'Заявлений строк обробки', 'Prazo de processamento publicado', 'Délai de traitement publié', 'बताया गया प्रोसेसिंग समय', 'Ilmoitettu käsittelyaika');
  const instant = loc('Instant after confirmation', 'Sofort nach Bestätigung', 'Al instante tras la confirmación', 'Subito dopo la conferma', 'Od razu po potwierdzeniu', 'Одразу після підтвердження', 'Imediato após confirmação', 'Immédiat après confirmation', 'पुष्टि के तुरंत बाद', 'Heti vahvistuksen jälkeen');
  const twoDays = loc('2 business days', '2 Werktage', '2 días hábiles', '2 giorni lavorativi', '2 dni robocze', '2 робочі дні', '2 dias úteis', '2 jours ouvrés', '2 कारोबारी दिन', '2 arkipäivää');
  const bank = loc('Bank wire', 'Banküberweisung', 'Transferencia bancaria', 'Bonifico bancario', 'Przelew bankowy', 'Банківський переказ', 'Transferência bancária', 'Virement bancaire', 'बैंक वायर', 'Pankkisiirto');
  const courier = loc('Courier check', 'Kurierscheck', 'Cheque por mensajería', 'Assegno tramite corriere', 'Czek kurierski', 'Чек із доставкою кур’єром', 'Cheque por correio expresso', 'Chèque par coursier', 'कूरियर चेक', 'Kuriirisekki');
  const checkMarket = loc('U.S. and Canada', 'USA und Kanada', 'EE. UU. y Canadá', 'Stati Uniti e Canada', 'USA i Kanada', 'США та Канада', 'EUA e Canadá', 'États-Unis et Canada', 'अमेरिका और कनाडा', 'Yhdysvallat ja Kanada');
  const cashMethods = [['Bitcoin', 100], [bank, 100], [`${courier} (${checkMarket})`, 150]];
  const relationship = rows => rows.map(([name, amount]) => `${name}: ${usd(amount)}`).join('; ') + '.';
  const welcome = loc('No-deposit bonus', 'Bonus ohne Einzahlung', 'Bono sin depósito', 'Bonus senza deposito', 'Bonus bez wpłaty', 'Бездепозитний бонус', 'Bónus sem depósito', 'Bonus sans dépôt', 'बिना जमा का बोनस', 'Talletukseton bonus');
  const firstDeposit = loc('First deposit', 'Erste Einzahlung', 'Primer depósito', 'Primo deposito', 'Pierwsza wpłata', 'Перший депозит', 'Primeiro depósito', 'Premier dépôt', 'पहली जमा', 'Ensitalletus');
  const firstFour = loc('First four deposits', 'Erste vier Einzahlungen', 'Primeros cuatro depósitos', 'Primi quattro depositi', 'Pierwsze cztery wpłaty', 'Перші чотири депозити', 'Primeiros quatro depósitos', 'Quatre premiers dépôts', 'पहली चार जमाएँ', 'Neljä ensimmäistä talletusta');
  const daily = loc('Daily bonus', 'Tagesbonus', 'Bono diario', 'Bonus giornaliero', 'Codzienny bonus', 'Щоденний бонус', 'Bónus diário', 'Bonus quotidien', 'रोज़ाना बोनस', 'Päivittäinen bonus');
  const crypto = loc('Crypto deposit bonus', 'Bonus auf Krypto-Einzahlungen', 'Bono por depósito en cripto', 'Bonus sul deposito in cripto', 'Bonus za wpłatę krypto', 'Бонус за криптодепозит', 'Bónus por depósito em cripto', 'Bonus sur dépôt en crypto', 'क्रिप्टो जमा बोनस', 'Kryptotalletusbonus');
  const upTo = loc('up to', 'bis zu', 'hasta', 'fino a', 'do', 'до', 'até', 'jusqu’à', 'तक', 'enintään');
  const capped = value => lang === 'hi' ? `${value} ${upTo}` : `${upTo} ${value}`;
  const match = (percent, amount) => `${pct(percent)} · ${capped(usd(amount))}`;
  const bonusRows = [[welcome, `PALACE20 · ${usd(20)}`], [firstDeposit, `400BONUS · ${match(400, 500)}`],
    [firstFour, `SP250 · ${[250, 300, 350, 400].map(pct).join(' / ')} · ${capped(usd(6000))}`]];
  const timesPerWeek = loc('up to 3 claims a week', 'bis zu 3 Einlösungen pro Woche', 'hasta 3 canjes por semana', 'fino a 3 utilizzi a settimana', 'do 3 użyć w tygodniu', 'до 3 активацій на тиждень', 'até 3 utilizações por semana', 'jusqu’à 3 utilisations par semaine', 'हफ़्ते में 3 बार तक', 'enintään 3 käyttökertaa viikossa');
  const values = bonusRows.concat([[deposits, `${minimum}: ${usd(5)}`], [withdrawals, `${minimum}: ${usd(100)}`], [processing, twoDays]]);
  const fit = suitability.split('|'), points = comparison.split('|');
  const faqs = faqQuestions.split('|').map((question, j) => [question, [relationship(depositAmounts), relationship(cashMethods), payoutNote, verification, rules, rewards, licenseNote][j]]);
  if (fit.length !== 2 || points.length !== 8 || faqs.length !== 7) throw Error(`Incomplete ${lang} copy`);
  const section = (key, content, tab = false) => `<section class="container" id="${key === 'faq' ? 'faq' : `${slug}-${key}`}" data-review-section="${key}"${tab ? ' data-review-details' : ''}><h2 class="title">${esc(label(key))}</h2>${content}</section>`;
  const sections = [
    section('summary', table([topic, details], values)),
    section('bonuses', table([topic, details], bonusRows), true),
    section('bonus-terms', table([topic, details], [[`${deposits} · ${wagering}`, '1×'],
      [loc('Standard maximum bonus bet', 'Üblicher Höchsteinsatz beim Bonusumsatz', 'Apuesta máxima habitual del bono', 'Puntata massima standard durante il bonus', 'Standardowa maksymalna stawka bonusowa', 'Типова максимальна ставка під час відіграшу', 'Aposta máxima habitual do bónus', 'Mise maximale habituelle du bonus', 'बोनस पर सामान्य अधिकतम दाँव', 'Tavallinen enimmäispanos bonuksella'), usd(10)]]) + p(rules), true),
    section('games', p(catalog), true),
    section('rewards', table([topic, details], [[daily, `SUNNY100 · ${match(100, 3000)}`], [crypto, `CRYPTO · ${capped(pct(250))} · ${timesPerWeek}`]]) + h('Comp Points') + p(rewards), true),
    section('cashier', h(deposits) + table([method, minimum, processing], depositAmounts.map(([name, value]) => [name, usd(value), instant])) + p(depositNote) +
      h(withdrawals) + table([method, minimum, processing], cashMethods.map(([name, value]) => [name, usd(value), twoDays])) + p(payoutNote) + h('KYC') + p(verification), true),
    section('trust', table([topic, details], [[license, licenseNote], [support, protection]]), true),
    reviewProviderStrip({ id: `${slug}-providers`, heading: label('providers'), providers,
      previous: loc('Previous providers', 'Vorherige Anbieter', 'Proveedores anteriores', 'Fornitori precedenti', 'Poprzedni dostawcy', 'Попередні провайдери', 'Fornecedores anteriores', 'Fournisseurs précédents', 'पिछले प्रदाता', 'Edelliset pelintarjoajat'),
      next: loc('Next providers', 'Nächste Anbieter', 'Siguientes proveedores', 'Fornitori successivi', 'Następni dostawcy', 'Наступні провайдери', 'Próximos fornecedores', 'Fournisseurs suivants', 'अगले प्रदाता', 'Seuraavat pelintarjoajat'),
    }),
    section('pros', reviewCards([[pros, points.slice(0, 4)], [cons, points.slice(4)]], { comparison: true })),
    section('suitability', reviewCards([[label('games'), fit[0]], [beforeSignup, fit[1]]])),
    section('faq', '<div class="timeline">' + faqs.map(([q, a]) => h(q) + `<p>${esc(a)}</p>`).join('') + '</div>'),
  ];

  const path = `.${prefix(lang)}brands/${slug}/index.html`;
  const html = read(path);
  const hero = html.match(/<section class="hero container">[\s\S]*?<\/section>/)?.[0];
  const zoom = html.match(/<button\b[^>]*class="brand-why-media"[\s\S]*?<\/button>/)?.[0];
  const json = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!hero || !zoom || !json) throw Error(`Missing Sun Palace review shell: ${lang}`);
  const stamp = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const heroMarkup = hero.replace(/(<h1\b[^>]*>)[\s\S]*?(<\/h1>)/, (_, a, b) => a + esc(heading) + b)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, () => `<p class="hero-subtitle">${esc(overview)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () => `<p class="hero-subtitle editorial-meta">${esc(reviewed)}: <time datetime="${date}">${esc(stamp)}</time></p>`)
    .replace(/(<a\s+href=")[^"]+("\s+class="cta-brands"[^>]*>)[\s\S]*?(<\/a>)/, (_, a, b, c) => a + esc(brand.urlCasino) + b + esc(cta) + c);
  const screenshot = zoom.replace(/aria-label="[^"]*"/, () => `aria-label="${esc(screenshotLabel)}"`);
  const features = `<section class="container features-section glass-section brand-highlights--compact" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">${esc(label('highlights'))}</h2>${screenshot}</div><div class="features-grid premium-grid">` +
    values.map(([heading, value], j) => `<div class="feature-card glass-card">${siteIconMarkup(['bonus','bonus','bonus','wallet','payments','clock'][j], 'site-icon brand-highlight-icon', 18)}<strong>${esc(heading)}</strong><span>${esc(value)}</span></div>`).join('') + '</div></section>';
  const geo = reviewCountries({ heading: label('countries'),
    countries: [{ name: market, href: `${prefix(lang)}online-casinos/united-states/`, flag: '/icons/united-states-flag-icon.svg' }],
    payments: { heading: label('methods'), methods: brand.payments },
  });
  const gallery = renderBrandNewGamesPanel({ games, pageBrand: brand, brandName: brand.name, escapeHtml: esc, localeText: loc });
  const graph = JSON.parse(json);
  Object.assign(graph['@graph'].find(n => n['@type'] === 'WebPage'), { name: title, description: seo, dateModified: date, image });
  graph['@graph'].find(n => n['@type'] === 'BreadcrumbList').itemListElement.at(-1).name = heading;
  graph['@graph'].find(n => n['@type'] === 'FAQPage').mainEntity = faqs.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  let output = html.replace(/(<script type="application\/ld\+json">)[\s\S]*?(<\/script>)/, (_, a, b) => a + JSON.stringify(graph).replaceAll('<', '\\u003c') + b)
    .replace(/<title>[\s\S]*?<\/title>/, () => `<title>${esc(title)}</title>`)
    .replace(/<section class="hero container">[\s\S]*?<main class="content-review">[\s\S]*?<\/main>/, () =>
      [heroMarkup, gallery, features, geo, '<main class="content-review">\n      ' + sections.join('\n      ') + '\n    </main>'].join('\n\n    '));
  for (const key of ['description', 'og:description', 'twitter:description']) {
    output = output.replace(new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`), (_, a, b) => a + esc(seo) + b);
  }
  for (const key of ['og:title', 'twitter:title']) {
    output = output.replace(new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`), (_, a, b) => a + esc(title) + b);
  }
  const snapshot = `<meta name="brand-snapshot-intro" content="${esc(overview)}" />`;
  output = output.replace(/^\s*<meta name="brand-snapshot-intro"[^>]*>\n/m, '')
    .replace(/^  <\/head>/m, () => `    ${snapshot}\n  </head>`);
  save(path, html, syncDefaultTheme(output));
}

const sitemap = read('sitemap.xml');
let count = 0;
const updated = sitemap.replace(/  <url>\n[\s\S]*?  <\/url>/g, row => {
  if (!/<loc>https:\/\/spincresta\.com\/(?:[a-z]{2}\/)?brands\/sunpalace\/<\/loc>/.test(row)) return row;
  count++;
  return row.includes('<lastmod>') ? row.replace(/<lastmod>[^<]*<\/lastmod>/, `<lastmod>${date}</lastmod>`)
    : row.replace('  </url>', `    <lastmod>${date}</lastmod>\n  </url>`);
});
if (count !== locales.length) throw Error('Missing Sun Palace sitemap routes');
save('sitemap.xml', sitemap, updated);
