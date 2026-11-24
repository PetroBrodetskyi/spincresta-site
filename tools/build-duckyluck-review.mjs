import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { escapeReview as esc, reviewCards, reviewCountries, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { duckyluckCopy, duckyluckHeadlines, duckyluckSections, duckyluckTrustLabels } from './duckyluck-review-copy.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const date = '2026-11-24';
const origin = 'https://spincresta.com';
const prefix = lang => lang === 'en' ? '/' : `/${lang}/`;
const route = lang => prefix(lang) + 'brands/duckyluck/';
const brand = BRANDS.find(item => item.urlDetail === 'brands/duckyluck.html');
const image = BRAND_HOMEPAGE_SCREENSHOTS.duckyluck;
const check = process.argv.includes('--check');
const providers = [
  ['DiceLab Slots', null], ['Fresh Deck Studios', null], ['Dragon Gaming', null], ['Rival', null],
  ['Arrow’s Edge', null], ['Betsoft Gaming', 'betsoft-gaming'], ['Wingo', null], ['Felix Gaming', null],
  ['Saucify', null], ['Qora Gaming', null],
];
const snapshotIntro = {
  en: 'Categories listed in the public casino and Fresh Deck lobbies.', de: 'Kategorien der öffentlichen Casino- und Fresh-Deck-Lobbys.',
  es: 'Categorías de las salas públicas del casino y de Fresh Deck.', it: 'Categorie delle lobby pubbliche del casinò e di Fresh Deck.',
  pl: 'Kategorie z publicznych lobby kasyna i Fresh Deck.', uk: 'Категорії з публічного каталогу казино й лобі Fresh Deck.',
  pt: 'Categorias das salas públicas do casino e da Fresh Deck.', fr: 'Catégories des espaces publics du casino et de Fresh Deck.',
  hi: 'कैसीनो और Fresh Deck की सार्वजनिक लॉबी की श्रेणियाँ।', fi: 'Kasinon ja Fresh Deckin julkisten peliaulojen kategoriat.',
};
const bankingLabels = {
  en: ['Deposits', 'Withdrawals', 'No public maximum is listed for these crypto deposits.', 'Help lists a $53 wire fee. Its pages disagree on the paper-check fee ($53 or $55). The Bitcoin guide lists no operator fee, but network or wallet fees may apply.'],
  de: ['Einzahlungen', 'Auszahlungen', 'Für diese Krypto-Einzahlungen ist kein Höchstbetrag angegeben.', 'Die Hilfe nennt 53 USD für Überweisungen und widersprüchliche Scheckgebühren von 53 oder 55 USD. Laut Bitcoin-Ratgeber erhebt das Casino keine Bitcoin-Gebühr; Netzwerk oder Wallet können Gebühren berechnen.'],
  es: ['Depósitos', 'Retiros', 'La página no publica un máximo para estos depósitos en criptomonedas.', 'La ayuda indica 53 USD por transferencia y da dos cifras para el cheque: 53 o 55 USD. La guía de Bitcoin no indica comisión del casino, pero la red o la cartera pueden cobrar.'],
  it: ['Depositi', 'Prelievi', 'Per questi depositi in criptovaluta non è indicato un massimo pubblico.', 'L’assistenza indica 53 USD per il bonifico e riporta due cifre per l’assegno: 53 o 55 USD. La guida Bitcoin non indica commissioni del casinò, ma la rete o il portafoglio possono applicarle.'],
  pl: ['Wpłaty', 'Wypłaty', 'Strona nie podaje maksymalnej kwoty tych wpłat w kryptowalutach.', 'Pomoc podaje opłatę 53 USD za przelew i dwie różne opłaty za czek: 53 lub 55 USD. Według przewodnika kasyno nie pobiera opłaty za Bitcoin, ale sieć lub portfel mogą ją naliczyć.'],
  uk: ['Депозити', 'Виплати', 'Для цих криптодепозитів публічного максимуму не вказано.', 'У довідці зазначено комісію 53 $ за переказ. Для паперового чека джерела казино наводять різні суми: 53 або 55 $. У довідці про Bitcoin комісії казино немає, але комісію може стягнути мережа чи гаманець.'],
  pt: ['Depósitos', 'Levantamentos', 'A página não indica um máximo para estes depósitos em criptomoeda.', 'A ajuda indica 53 USD por transferência e dá dois valores para o cheque: 53 ou 55 USD. O guia Bitcoin não indica comissão do casino, mas a rede ou a carteira podem cobrar.'],
  fr: ['Dépôts', 'Retraits', 'La page ne publie pas de plafond pour ces dépôts en cryptomonnaie.', 'L’aide indique 53 USD par virement et deux montants pour un chèque : 53 ou 55 USD. Le guide Bitcoin n’indique pas de frais du casino, mais le réseau ou le portefeuille peuvent en facturer.'],
  hi: ['जमा', 'निकासी', 'इन क्रिप्टो जमाओं की अधिकतम राशि सार्वजनिक पेज पर नहीं दी गई है।', 'सहायता पेज बैंक ट्रांसफ़र की फ़ीस 53 USD बताते हैं। चेक के लिए दो रकमें दी गई हैं: 53 या 55 USD। Bitcoin गाइड में कैसीनो की ओर से कोई शुल्क नहीं है, लेकिन नेटवर्क या वॉलेट शुल्क लग सकता है।'],
  fi: ['Talletukset', 'Kotiutukset', 'Näille kryptotalletuksille ei ole ilmoitettu julkista enimmäismäärää.', 'Ohje ilmoittaa pankkisiirron maksuksi 53 USD ja shekin maksuksi sivusta riippuen 53 tai 55 USD. Bitcoin-oppaan mukaan kasino ei veloita maksua, mutta verkko tai lompakko voi veloittaa.'],
};
const payoutLabels = {
  en: ['Bank wire', 'Paper check', 'Standard members', 'Published estimates are not guaranteed. Bank wire and checks are not listed for Maryland or Washington.'],
  de: ['Banküberweisung', 'Scheck', 'Standardmitglieder', 'Die angegebenen Zeiten sind keine Garantie. Überweisung und Scheck sind für Maryland und Washington nicht aufgeführt.'],
  es: ['Transferencia bancaria', 'Cheque en papel', 'Miembros estándar', 'Los plazos publicados no son una garantía. No se indican transferencias ni cheques para Maryland o Washington.'],
  it: ['Bonifico bancario', 'Assegno cartaceo', 'Utenti standard', 'I tempi pubblicati non sono garantiti. Bonifici e assegni non risultano disponibili per Maryland e Washington.'],
  pl: ['Przelew bankowy', 'Czek papierowy', 'Użytkownicy standardowi', 'Podane terminy nie są gwarantowane. Przelewów i czeków nie wymieniono dla Maryland ani stanu Waszyngton.'],
  uk: ['Банківський переказ', 'Паперовий чек', 'Стандартний акаунт', 'Опубліковані строки не гарантовані. Для штатів Меріленд і Вашингтон казино не вказує перекази й чеки.'],
  pt: ['Transferência bancária', 'Cheque em papel', 'Membros padrão', 'Os prazos publicados não são garantidos. Não são indicadas transferências nem cheques para Maryland ou Washington.'],
  fr: ['Virement bancaire', 'Chèque papier', 'Membres standard', 'Les délais annoncés ne sont pas garantis. Les virements et chèques ne sont pas indiqués pour le Maryland ni l’État de Washington.'],
  hi: ['बैंक ट्रांसफ़र', 'काग़ज़ी चेक', 'स्टैंडर्ड सदस्य', 'बताया गया समय गारंटी नहीं है। मैरीलैंड और वॉशिंगटन राज्य के लिए बैंक ट्रांसफ़र और चेक सूची में नहीं हैं।'],
  fi: ['Pankkisiirto', 'Paperishekki', 'Perusjäsenet', 'Ilmoitetut ajat eivät ole takuu. Pankkisiirtoa ja shekkiä ei ole listattu Marylandiin tai Washingtonin osavaltioon.'],
};
const payMore = {
  en: 'VIP limits may be higher. Fees and identity checks can affect a withdrawal.', de: 'Für VIPs können höhere Limits gelten. Gebühren und Prüfungen können die Auszahlung beeinflussen.',
  es: 'Los límites VIP pueden ser mayores. Las comisiones y verificaciones pueden afectar el retiro.', it: 'I limiti VIP possono essere superiori. Commissioni e verifiche possono incidere sul prelievo.',
  pl: 'Limity VIP mogą być wyższe. Opłaty i weryfikacja mogą wpłynąć na wypłatę.', uk: 'Для VIP ліміти можуть бути вищими. На виплату можуть вплинути комісії та перевірка особи.',
  pt: 'Os limites VIP podem ser superiores. Comissões e verificações podem afetar o levantamento.', fr: 'Les plafonds VIP peuvent être supérieurs. Les frais et les vérifications peuvent influer sur le retrait.',
  hi: 'VIP की सीमा ज़्यादा हो सकती है। शुल्क और पहचान की जाँच का असर निकासी पर पड़ सकता है।', fi: 'VIP-raja voi olla korkeampi. Maksut ja henkilöllisyyden tarkistus voivat vaikuttaa kotiutukseen.',
};
const reviewProsCons = {
  en: ['Separate Fresh Deck live lobby', 'Published minimums and schedules by payout method', 'High wagering and promotional withdrawal caps', 'US state licensing not verified'],
  de: ['Eigene Live-Lobby von Fresh Deck', 'Veröffentlichte Mindestbeträge und Fristen je Auszahlungsmethode', 'Hohe Umsatzanforderungen und Bonusauszahlungslimits', 'US-Bundesstaatenlizenz nicht bestätigt'],
  es: ['Sala en vivo separada de Fresh Deck', 'Mínimos y plazos publicados por método de retiro', 'Requisitos de apuesta altos y retiros de bonos limitados', 'Licencia estatal de EE. UU. sin verificar'],
  it: ['Lobby dal vivo separata di Fresh Deck', 'Minimi e tempi indicati per ogni metodo di prelievo', 'Requisiti di puntata alti e prelievi promozionali limitati', 'Licenza statale statunitense non verificata'],
  pl: ['Osobne kasyno na żywo Fresh Deck', 'Podane minima i terminy według metody wypłaty', 'Wysoki obrót i limity wypłat z bonusów', 'Brak potwierdzonej licencji stanowej w USA'],
  uk: ['Окреме лобі Fresh Deck з дилерами', 'Опубліковані мінімуми й строки за способами виплати', 'Високий відіграш і ліміти виплат за бонусами', 'Ліцензію штату США не підтверджено'],
  pt: ['Sala ao vivo separada da Fresh Deck', 'Mínimos e prazos publicados por método de levantamento', 'Requisitos de aposta elevados e limites de levantamento promocional', 'Licença estadual dos EUA não confirmada'],
  fr: ['Espace Fresh Deck séparé pour les jeux en direct', 'Minima et délais publiés par moyen de retrait', 'Exigences de mise élevées et retraits promotionnels plafonnés', 'Licence d’un État américain non vérifiée'],
  hi: ['अलग Fresh Deck लाइव लॉबी', 'हर निकासी तरीके की न्यूनतम राशि और समय प्रकाशित', 'दाँव की कड़ी शर्तें और बोनस निकासी की सीमाएँ', 'अमेरिकी राज्य का लाइसेंस सत्यापित नहीं'],
  fi: ['Erillinen Fresh Deck -livekasino', 'Julkaistut kotiutusminimit ja käsittelyajat maksutavoittain', 'Suuret kierrätysvaatimukset ja bonusten kotiutusrajat', 'Yhdysvaltain osavaltiolupaa ei vahvistettu'],
};
const save = (file, before, after) => {
  if (before === after) return;
  if (check) {
    console.error(`Stale Ducky Luck output: ${file}`);
    process.exitCode = 1;
  } else writeFileSync(file, after);
};
if (!image || brand?.bonus !== duckyluckHeadlines.en || brand.countries.join() !== 'US') throw new Error('Incomplete Ducky Luck registry');

for (const [i, lang] of locales.entries()) {
  const c = duckyluckCopy[lang];
  const detail = duckyluckSections[lang];
  const [topic, trustDetails, licensing, accountRules, support, inactivity] = duckyluckTrustLabels[lang];
  const [reviewed, standard, crypto, spins, method, minimum, timing, days, weekly, pros, cons, samples, market] = c.labels.split('|');
  const [wire, paper, member, limitsNote] = payoutLabels[lang];
  const [deposits, withdrawals, depositMax, fees] = bankingLabels[lang];
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const format = new Intl.NumberFormat(locale).format;
  const money = amount => lang === 'en' ? '$' + format(amount) : format(amount) + ' USD';
  const stamp = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const overview = p(c.overview);
  const description = c.title.split(/[:：]/)[0].trimEnd() + ': ' + duckyluckHeadlines[lang] + '. ' + weekly + ': ' + money(2500) + ' (' + member + ').';
  function p(text) { return `<p class="section-intro">${esc(text)}</p>`; }
  const section = (key, content, tab = false, heading = label(key), extra = '') =>
    `<section class="container" id="${key === 'faq' ? 'faq' : 'duckyluck-' + key}" data-review-section="${key}"${tab ? ' data-review-details' : ''}${extra}><h2 class="title">${esc(heading)}</h2>${content}</section>`;
  const highlights = [
    [standard, duckyluckHeadlines[lang], 'bonus'], [crypto, '3 × 600% · ' + money(9000), 'wallet'],
    [label('games'), 'Fresh Deck · Ducky Luck Originals', 'games'], [label('rewards'), 'DuckyBucks', 'trophy'],
    [weekly, money(2500) + ' · ' + member, 'payments'], [label('countries'), market, 'globe'],
  ];
  const headings = {
    previous: ['Previous providers', 'Vorherige Anbieter', 'Proveedores anteriores', 'Fornitori precedenti', 'Poprzedni dostawcy', 'Попередні провайдери', 'Fornecedores anteriores', 'Fournisseurs précédents', 'पिछले प्रदाता', 'Edelliset pelintarjoajat'],
    next: ['Next providers', 'Nächste Anbieter', 'Siguientes proveedores', 'Fornitori successivi', 'Następni dostawcy', 'Наступні провайдери', 'Fornecedores seguintes', 'Fournisseurs suivants', 'अगले प्रदाता', 'Seuraavat pelintarjoajat'],
  };
  const time = amount => '≈ ' + format(amount) + ' ' + (amount === 20 ? { uk: 'робочих днів', pl: 'dni roboczych' }[lang] || days : days);
  const payout = reviewTable([method, minimum, timing], [
    ['Bitcoin (BTC) / Tether (USDT)', money(25), time(4)],
    [wire, money(150), time(20)], [paper, money(150), time(20)],
  ], { rowHeaders: true });
  const cap = weekly + ' (' + member + '): ' + money(2500) + '. ' + payMore[lang];
  const timingAnswer = 'Bitcoin / Tether: ' + time(4) + '. ' + wire + ' / ' + paper + ': ' + time(20) + '. ' + limitsNote;
  const [welcomeQuestion, paymentQuestion, identityQuestion, licenseQuestion] = c.questions.split('|');
  const faq = [
    [welcomeQuestion, c.standard + ' ' + c.crypto], [detail.spinsQuestion, c.spins], [detail.rewardsQuestion, c.rewards],
    [paymentQuestion, timingAnswer], [identityQuestion, c.identity], [licenseQuestion, c.trust],
  ];
  const core = [
    section('summary', reviewTable([label('bonuses'), label('bonus-terms')], [[standard, c.standard], [crypto, c.crypto], [spins, c.spins]], { rowHeaders: true })),
    section('bonuses', p(c.spins) + p('Mythic Wolf · Golden Gorilla · Five Times Wins'), true),
    section('bonus-terms', p(c.standard) + p(c.crypto) + p(c.terms), true),
    section('games', p(c.games) + p('DiceLab Slots: Fluffalo Fortune · Ace Bounty ReSpin Saloon') + p('Saucify: Ca$hbah Cafe'), true),
    section('rewards', p(c.rewards), true),
    section('cashier', `<h3>${esc(deposits)}</h3>` + p(c.payments + ' ' + depositMax) +
      `<h3>${esc(withdrawals)}</h3>` + payout + p(limitsNote) + p(fees) + p(cap) +
      `<h3>${esc(detail.identityHeading)}</h3>` + p(c.identity), true),
    section('trust', reviewTable([topic, trustDetails], [
      [licensing, c.trust], [accountRules, detail.accountRule], [support, c.support], [inactivity, c.inactivity],
    ], { rowHeaders: true }), true),
    reviewProviderStrip({ id: 'duckyluck-providers', heading: label('providers'), providers, previous: headings.previous[i], next: headings.next[i] }),
    section('pros', reviewCards([[pros, reviewProsCons[lang].slice(0, 2)], [cons, reviewProsCons[lang].slice(2)]], { comparison: true })),
    section('suitability', reviewCards([[label('games'), detail.forWho], [detail.considerHeading, detail.checkFirst]])),
    section('faq', '<div class="timeline">' + faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('') + '</div>'),
  ].join('\n      ');
  const geo = reviewCountries({ heading: label('countries'), countries: [
    { name: market, href: prefix(lang) + 'online-casinos/united-states/', flag: '/icons/united-states-flag-icon.svg' },
  ], payments: { heading: label('methods'), methods: brand.payments } });
  const file = '.' + route(lang) + 'index.html';
  const before = readFileSync(file, 'utf8');
  const hero = before.match(/<section class="hero container">[\s\S]*?<\/section>/)?.[0];
  const feature = before.match(/<section\b[^>]*\bid="brand-why-section"[^>]*>([\s\S]*?)<\/section>/)?.[1];
  const button = feature?.match(/<button\b[^>]*class="brand-why-media"[\s\S]*?<\/button>/)?.[0];
  if (!hero || !button) throw new Error('Missing Ducky Luck review shell: ' + lang);
  const heroUpdated = hero
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, () => overview.replace('section-intro', 'hero-subtitle'))
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () =>
      `<p class="hero-subtitle editorial-meta">${esc(reviewed)}: <time datetime="${date}">${esc(stamp)}</time></p>`)
    .replace(/(<a href=")[^"]+(" class="cta-brands")/, (_, open, close) => open + esc(brand.urlCasino) + close);
  const featureUpdated = `<section class="container features-section glass-section brand-highlights--compact" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">${esc(label('highlights'))}</h2>${button.replace(/<img\b[^>]*>/, () => `<img src="${esc(image)}" alt="Ducky Luck — ${esc(label('games'))}" width="3024" height="1590" loading="eager" fetchpriority="high" decoding="async" />`)}</div><div class="features-grid premium-grid">${highlights.map(([title, value, mark]) => `<div class="feature-card glass-card">${siteIconMarkup(mark, 'site-icon brand-highlight-icon', 18)}<strong>${esc(title)}</strong><span>${esc(value)}</span></div>`).join('')}</div></section>`;
  const faqItems = faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
  const schema = before.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!schema) throw new Error('Missing structured data: ' + lang);
  const graph = JSON.parse(schema[1]);
  const page = graph['@graph'].find(n => n['@type'] === 'WebPage');
  Object.assign(page, { name: c.title, description, dateModified: date, image });
  graph['@graph'].find(n => n['@type'] === 'FAQPage').mainEntity = faqItems;
  const meta = (html, key, value) => html.replace(new RegExp(`(<meta\\s+(?:name|property)="${key}"\\s+content=")[^"]*(")`), (_, a, b) => a + esc(value) + b);
  let after = before
    .replace(/<title>[\s\S]*?<\/title>/, () => '<title>' + esc(c.title) + '</title>')
    .replace(/\n[ \t]*<meta name="brand-(?:snapshot-intro|games-title)"[^>]*>/g, '')
    .replace(/^[ \t]*<\/head>/m, `    <meta name="brand-games-title" content="${esc(samples)}" />\n    <meta name="brand-snapshot-intro" content="${esc(snapshotIntro[lang])}" />\n  </head>`)
    .replace(schema[0], () => '<script type="application/ld+json">' + JSON.stringify(graph).replaceAll('<', '\\u003c') + '</script>')
    .replace(/<section class="hero container">[\s\S]*?<main class="content-review">[\s\S]*?<\/main>/, () =>
      `${heroUpdated}\n\n    ${featureUpdated}\n\n    ${geo}\n\n    <main class="content-review">\n      ${core}\n    </main>`);
  for (const key of ['og:title', 'twitter:title']) after = meta(after, key, c.title);
  for (const key of ['description', 'og:description', 'twitter:description']) after = meta(after, key, description);
  for (const key of ['og:image', 'twitter:image']) after = meta(after, key, image);
  save(file, before, syncDefaultTheme(after));
}

const sitemapFile = 'sitemap.xml';
const sitemap = readFileSync(sitemapFile, 'utf8');
const locs = new Set(locales.map(lang => origin + route(lang)));
save(sitemapFile, sitemap, sitemap.replace(/<url>[\s\S]*?<\/url>/g, entry =>
  locs.has(entry.match(/<loc>([^<]+)<\/loc>/)?.[1]) ? entry.replace(/<lastmod>[^<]+<\/lastmod>/, `<lastmod>${date}</lastmod>`) : entry));
