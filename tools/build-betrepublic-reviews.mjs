import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import text, { copyFields, extraTerms } from './betrepublic-review-copy.mjs';
import { escapeReview as esc, reviewCards, reviewTable } from './brand-review-template.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const brand = BRANDS.find(item => item.urlDetail === 'brands/betrepublic.html');
const picture = BRAND_HOMEPAGE_SCREENSHOTS.betrepublic;
const origin = 'https://spincresta.com';
const stamp = '2026-11-22';
const check = process.argv.includes('--check');
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/betrepublic/';
const ctaPattern = /<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>/;
const labels = {
  en: ['Reviewed', 'Casino welcome package', 'Wagering and limits', 'Live casino', 'Verification', 'Responsible gambling', 'Pros', 'Cons', 'Best for', 'What to consider', 'Market / method', 'Deposit', 'Withdrawal', 'Offer', 'Terms', 'Recurring promotions', 'Withdrawal checks and fees', 'How does the BetRepublic casino bonus work?', 'What is the BetRepublic sports bonus?', 'How long do BetRepublic withdrawals take?', 'What documents can BetRepublic request?', 'Is BetRepublic licensed?'],
  de: ['Geprüft am', 'Willkommenspaket im Casino', 'Umsatz und Limits', 'Live-Casino', 'Verifizierung', 'Verantwortungsvolles Spielen', 'Vorteile', 'Nachteile', 'Geeignet für', 'Was zu beachten ist', 'Land / Zahlungsart', 'Einzahlung', 'Auszahlung', 'Angebot', 'Bedingungen', 'Regelmäßige Aktionen', 'Auszahlungsbedingungen und Gebühren', 'Wie funktioniert der Casinobonus bei BetRepublic?', 'Wie hoch ist der Sportwettenbonus bei BetRepublic?', 'Wie lange dauern Auszahlungen bei BetRepublic?', 'Welche Unterlagen kann BetRepublic verlangen?', 'Hat BetRepublic eine Lizenz?'],
  es: ['Revisado el', 'Paquete de bienvenida del casino', 'Requisitos de apuesta y límites', 'Casino en vivo', 'Verificación', 'Juego responsable', 'Ventajas', 'Desventajas', 'Para quién es', 'Qué tener en cuenta', 'Mercado / método', 'Depósito', 'Retiro', 'Oferta', 'Condiciones', 'Promociones habituales', 'Condiciones y comisiones de retiro', '¿Cómo funciona el bono de casino de BetRepublic?', '¿Cuál es el bono deportivo de BetRepublic?', '¿Cuánto tardan los retiros de BetRepublic?', '¿Qué documentos puede pedir BetRepublic?', '¿Tiene licencia BetRepublic?'],
  it: ['Verifica del', 'Pacchetto di benvenuto del casinò', 'Requisiti di puntata e limiti', 'Casinò dal vivo', 'Verifica del conto', 'Gioco responsabile', 'Pro', 'Contro', 'A chi si rivolge', 'Cosa considerare', 'Paese / metodo', 'Deposito', 'Prelievo', 'Offerta', 'Condizioni', 'Promozioni ricorrenti', 'Condizioni e commissioni di prelievo', 'Come funziona il bonus casinò di BetRepublic?', 'Qual è il bonus scommesse di BetRepublic?', 'Quanto tempo richiedono i prelievi BetRepublic?', 'Quali documenti può chiedere BetRepublic?', 'BetRepublic ha una licenza?'],
  pl: ['Sprawdzono', 'Kasynowy pakiet powitalny', 'Obrót i limity', 'Kasyno na żywo', 'Weryfikacja', 'Odpowiedzialna gra', 'Zalety', 'Wady', 'Dla kogo', 'Na co zwrócić uwagę', 'Kraj / metoda', 'Wpłata', 'Wypłata', 'Oferta', 'Warunki', 'Cykliczne promocje', 'Warunki wypłat i opłaty', 'Jak działa bonus kasynowy BetRepublic?', 'Jaki jest bonus sportowy BetRepublic?', 'Ile trwają wypłaty w BetRepublic?', 'Jakich dokumentów może wymagać BetRepublic?', 'Czy BetRepublic ma licencję?'],
  uk: ['Перевірено', 'Вітальний пакет казино', 'Відіграш і ліміти', 'Казино наживо', 'Перевірка акаунта', 'Відповідальна гра', 'Переваги', 'Недоліки', 'Кому може підійти', 'Що варто врахувати', 'Країна / спосіб', 'Поповнення', 'Виплата', 'Пропозиція', 'Умови', 'Регулярні акції', 'Умови й комісії за виплати', 'Як працює бонус казино BetRepublic?', 'Який бонус на спорт пропонує BetRepublic?', 'Скільки тривають виплати в BetRepublic?', 'Які документи може попросити BetRepublic?', 'Чи має BetRepublic ліцензію?'],
  pt: ['Revisto em', 'Pacote de boas-vindas do casino', 'Requisitos de aposta e limites', 'Casino ao vivo', 'Verificação', 'Jogo responsável', 'Prós', 'Contras', 'A quem se destina', 'O que considerar', 'Mercado / método', 'Depósito', 'Levantamento', 'Oferta', 'Condições', 'Promoções regulares', 'Condições e taxas de levantamento', 'Como funciona o bónus de casino da BetRepublic?', 'Qual é o bónus de apostas da BetRepublic?', 'Quanto demoram os levantamentos na BetRepublic?', 'Que documentos pode pedir a BetRepublic?', 'A BetRepublic tem licença?'],
  fr: ['Vérifié le', 'Offre de bienvenue du casino', 'Conditions de mise et plafonds', 'Casino en direct', 'Vérification', 'Jeu responsable', 'Avantages', 'Inconvénients', 'À qui il convient', 'À prendre en compte', 'Pays / moyen', 'Dépôt', 'Retrait', 'Offre', 'Conditions', 'Promotions récurrentes', 'Conditions et frais de retrait', 'Comment fonctionne le bonus casino de BetRepublic ?', 'Quel est le bonus sportif de BetRepublic ?', 'Quels sont les délais de retrait chez BetRepublic ?', 'Quels documents BetRepublic peut-il demander ?', 'BetRepublic a-t-il une licence ?'],
  hi: ['जाँच की तारीख', 'कैसीनो वेलकम पैकेज', 'वेजरिंग और सीमाएँ', 'लाइव कैसीनो', 'खाते का सत्यापन', 'ज़िम्मेदार गेमिंग', 'फायदे', 'नुकसान', 'किसके लिए उपयुक्त', 'ध्यान देने की बातें', 'देश / तरीका', 'जमा', 'निकासी', 'ऑफ़र', 'शर्तें', 'नियमित ऑफ़र', 'निकासी की शर्तें और शुल्क', 'BetRepublic का कैसीनो बोनस कैसे काम करता है?', 'BetRepublic में खेल बोनस क्या है?', 'BetRepublic में निकासी में कितना समय लगता है?', 'BetRepublic कौन-से दस्तावेज़ माँग सकता है?', 'क्या BetRepublic के पास लाइसेंस है?'],
  fi: ['Tarkistettu', 'Kasinon tervetulopaketti', 'Kierrätys ja rajat', 'Livekasino', 'Tilin vahvistus', 'Vastuullinen pelaaminen', 'Plussat', 'Miinukset', 'Kenelle sopii', 'Mitä kannattaa huomioida', 'Maa / maksutapa', 'Talletus', 'Kotiutus', 'Tarjous', 'Ehdot', 'Toistuvat kampanjat', 'Kotiutusehdot ja kulut', 'Miten BetRepublicin kasinobonus toimii?', 'Mikä on BetRepublicin vedonlyöntibonus?', 'Kuinka kauan BetRepublicin kotiutus kestää?', 'Mitä asiakirjoja BetRepublic voi pyytää?', 'Onko BetRepublicilla lisenssi?'],
};

// Logged-out public cashier examples; currency and limits depend on the selected market.
const paymentExamples = [
  ['CA', 'CAD', 'Interac', 10, 9000, 10, 3000],
  ['CA', 'CAD', 'Litecoin', 20, 8000, 35, 8000],
  ['PL', 'PLN', 'Litecoin', 45, 20000, 100, 20000],
  ['PL', 'PLN', 'TRX', 45, 20000, 100, 20000],
];

function save(file, markup) {
  if (readFileSync(file, 'utf8') === markup) return;
  if (check) {
    console.error(`Stale BetRepublic output: ${file}`);
    process.exitCode = 1;
  } else writeFileSync(file, markup);
}

if (!picture || brand?.bonus !== text.en[2]) throw new Error('BetRepublic registry does not match the review');

for (const [i, lang] of locales.entries()) {
  if (text[lang]?.length !== copyFields.length || labels[lang]?.length !== labels.en.length) {
    throw new Error(`Incomplete BetRepublic copy: ${lang}`);
  }
  const c = Object.fromEntries(copyFields.map((field, index) => [field, text[lang][index]]));
  const [reviewed, welcome, wagering, live, verification, safer, pros, cons, best, caution, market, deposit, withdrawal, offer, terms, repeat, fees, ...questions] = labels[lang];
  const faq = questions.map((question, index) => [question, [c.casino, c.sportOffer, c.cashier, c.verification, c.license][index]]);
  const template = readFileSync(prefix(lang) + 'brands/kingmaker/index.html', 'utf8');
  const take = re => {
    const match = template.match(re);
    if (!match) throw new Error(`Missing localized review shell (${lang}): ${re}`);
    return match[1];
  };
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const localDate = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(stamp));
  const currency = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat(locale, { useGrouping: 'always' });
  const regions = new Intl.DisplayNames([locale], { type: 'region' });
  const range = (a, b, code) => `${number.format(a)}–${number.format(b)} ${code}`;
  const url = origin + route(lang);
  const imageAlt = `BetRepublic — ${label('overview')}`;
  const paragraph = value => `<p class="section-intro">${esc(value)}</p>`;
  const section = (id, key, inner, tab = false) =>
    `<section class="container" id="betrepublic-${id}" data-review-section="${key}"${tab ? ' data-review-details' : ''}><h2 class="title">${esc(label(key))}</h2>${inner}</section>`;
  const cta = template.match(ctaPattern)[0].replace(/href="[^"]+"/, `href="${esc(brand.urlCasino)}"`);
  const hero = take(/(<section class="hero container">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*class="brand-logo"[^>]*>/, `<img class="brand-logo" src="/${brand.image}" alt="BetRepublic" width="640" height="320" decoding="async" />`)
    .replace(/<h1>[^<]+<\/h1>/, `<h1>${esc(c.title)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(c.overview)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, `<p class="hero-subtitle editorial-meta">${esc(reviewed)}: <time datetime="${stamp}">${esc(localDate)}</time></p>`)
    .replace(ctaPattern, () => cta);
  const highlightsData = [
    [welcome, c.headline], [wagering, '35× / 40×'], [live, 'Gold Saloon'],
    [label('sports'), `100% · ${currency.format(250)}`], [label('cashier'), 'Interac · Litecoin'], [label('rewards'), 'VIP 1–5'],
  ];
  let row = 0;
  const highlights = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*>/, `<img src="${esc(picture)}" alt="${esc(imageAlt)}" width="1600" height="835" loading="eager" fetchpriority="high" decoding="async" />`)
    .replace(/(<strong>)[^<]*(<\/strong>\s*<span>)[\s\S]*?(<\/span>)/g, (_, a, b, end) =>
      a + esc(highlightsData[row][0]) + b + esc(highlightsData[row++][1]) + end);
  if (row !== highlightsData.length) throw new Error(`Invalid highlight shell: ${lang}`);
  const geoSection = take(/(<section class="container">\s*<div class="brand-countries">[\s\S]*?<\/section>)/);
  const bankingSection = take(/(<section class="container">\s*<div class="brand-payments">[\s\S]*?<\/section>)/);
  const final = take(/(<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>)/)
    .replaceAll('Kingmaker', 'BetRepublic').replace(ctaPattern, () => cta);
  const footer = take(/(<section class="all-countries">[\s\S]*$)/).trimEnd();
  const safetyLink = `<p class="section-intro"><a class="cta-secondary editorial-resource-link" href="/${prefix(lang)}responsible-gambling/">${siteIconMarkup('safety', 'site-icon site-icon--inline', 18)}<span>${esc(safer)}</span></a></p>`;
  const org = { '@id': origin + '/#organization' };
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', ...org, name: 'SpinCresta', url: origin + '/' },
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, breadcrumb: { '@id': url + '#breadcrumb' } },
    { '@type': 'Article', '@id': url + '#article', headline: c.title, description: c.description, inLanguage: lang, image: [picture], mainEntityOfPage: { '@id': url }, author: org, publisher: org, datePublished: stamp, dateModified: stamp },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SpinCresta', item: origin + '/' + prefix(lang) },
      { '@type': 'ListItem', position: 2, name: 'BetRepublic', item: url },
    ] },
    { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: lang, mainEntity: faq.map(([name, answer]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer } })) },
  ] };
  const page = `${take(/^([\s\S]*?)<title>/)}<title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <link rel="canonical" href="${url}" />
    ${[...locales, 'x-default'].map(code => `<link rel="alternate" hreflang="${code === 'fi' ? 'fi-FI' : code}" href="${origin + route(code === 'x-default' ? 'en' : code)}" />`).join('\n    ')}
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="SpinCresta" />
    <meta property="og:image:alt" content="${esc(imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${[['title', c.title], ['description', c.description], ['image', picture]].map(([key, value]) => `<meta property="og:${key}" content="${esc(value)}" />\n    <meta name="twitter:${key}" content="${esc(value)}" />`).join('\n    ')}
    ${take(/(<link rel="stylesheet"[^>]*>)/)}
    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
  </head>
  <body data-brand="betrepublic" data-language="${lang}">
    ${take(/(<header class="header">[\s\S]*?<\/header>)/)}
    ${hero}
    ${highlights}
    ${geoSection}
    ${bankingSection}
    <main class="content-review">
      ${section('summary', 'summary', reviewTable([offer, terms, 'EUR'], [
        [welcome, c.headline, currency.format(20) + ' · 35× / 40×'],
        [label('sports'), '100%', currency.format(250) + ' · 6×'],
        [label('rewards'), 'VIP 1–5', '—'],
      ]))}
      ${section('bonus', 'bonuses', reviewCards([[welcome, [c.casino, extraTerms[lang][0]]], [wagering, c.wager], [repeat, c.reload]]), true)}
      ${section('games', 'games', reviewCards([[label('games'), c.games], [live, c.live]]), true)}
      ${section('sports', 'sports', paragraph(c.sports) + reviewCards([[label('bonuses'), c.sportOffer], [wagering, [c.sportRules, extraTerms[lang][1]]]]), true)}
      ${section('rewards', 'rewards', paragraph(c.vip), true)}
      ${section('cashier', 'cashier', paragraph(c.cashier) +
        reviewTable([market, deposit, withdrawal], paymentExamples.map(([country, code, method, low, high, wLow, wHigh]) =>
          [regions.of(country) + ' · ' + method, range(low, high, code), range(wLow, wHigh, code)])) +
        reviewCards([[fees, c.rollover], [verification, c.verification]]))}
      ${section('trust', 'trust', reviewCards([[label('trust'), c.license], [safer, c.safer]]) + safetyLink, true)}
      ${section('pros-cons', 'pros', reviewCards([[pros, [c.sports, c.live]], [cons, [c.caution, c.rollover]]], { comparison: true }))}
      ${section('best-for', 'suitability', reviewCards([[best, c.best], [caution, c.caution]]))}
      <section class="container" id="faq" data-review-section="faq"><h2 class="title">${esc(label('faq'))}</h2><div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>
      ${final}
    </main>
    ${footer}
`;
  save(prefix(lang) + 'brands/betrepublic/index.html', page);

  const directory = prefix(lang) + 'casinos-and-betting/index.html';
  const directorySource = readFileSync(directory, 'utf8');
  const updated = directorySource.replace(/<article class="casino-list-row"[^>]*data-brand-slug="betrepublic"[^>]*>[\s\S]*?<\/article>/, block => {
    let n = 0;
    return block.replace(/(<p class="casino-bonus">\s*<strong>[^<]+<\/strong>)[\s\S]*?(<\/p>)/g, (full, start, end) =>
      n++ === 1 ? start + ' ' + esc(c.headline) + end : full);
  });
  if (!updated.includes('data-brand-slug="betrepublic"')) throw new Error(`Missing directory listing: ${lang}`);
  save(directory, updated);
}
