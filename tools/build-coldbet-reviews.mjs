import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import text, { fields, headlines, welcomeDeposits, comparison } from './coldbet-review-copy.mjs';
import { depositCount, paymentGroups, paymentIcons, vipRows, withdrawalCount } from './coldbet-account-data.mjs';
import { accountCopy } from './coldbet-account-copy.mjs';
import { details } from './coldbet-editorial-details.mjs';
import { providers } from './coldbet-providers.mjs';
import { escapeReview as esc, reviewCards, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const slug = 'coldbet';
const brand = BRANDS.find(item => item.urlDetail === `brands/${slug}.html`);
const picture = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const origin = 'https://spincresta.com';
const stamp = '2026-11-22';
const updatedStamp = '2026-11-23';
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/' + slug + '/';
const ctaPattern = /<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>/;
const check = process.argv.includes('--check');

const labels = {
  en: ['Reviewed', 'Casino welcome package', 'Wagering and limits', 'Live casino', 'Verification', 'Responsible gambling', 'Pros', 'Cons', 'Best for', 'What to consider', 'Deposit', 'Minimum', 'Match and cap', 'Spins / game', 'Offer', 'Terms', 'Sunday reload', 'Partner markets', 'Withdrawal rules', 'How does the ColdBet casino bonus work?', 'What is the ColdBet sports welcome bonus?', 'What are ColdBet’s withdrawal limits?', 'Does ColdBet require identity verification?', 'Is ColdBet licensed?'],
  de: ['Geprüft am', 'Willkommenspaket im Casino', 'Umsatz und Limits', 'Live-Casino', 'Verifizierung', 'Verantwortungsvolles Spielen', 'Vorteile', 'Nachteile', 'Geeignet für', 'Was zu beachten ist', 'Einzahlung', 'Mindestbetrag', 'Bonus und Obergrenze', 'Freispiele / Spiel', 'Angebot', 'Bedingungen', 'Sonntagsbonus', 'Partnerländer', 'Auszahlungsregeln', 'Wie funktioniert der Casinobonus von ColdBet?', 'Wie hoch ist der Sportwettenbonus bei ColdBet?', 'Welche Auszahlungslimits gelten bei ColdBet?', 'Verlangt ColdBet eine Identitätsprüfung?', 'Hat ColdBet eine Lizenz?'],
  es: ['Revisado el', 'Paquete de bienvenida del casino', 'Requisitos de apuesta y límites', 'Casino en vivo', 'Verificación', 'Juego responsable', 'Ventajas', 'Desventajas', 'Para quién es', 'Qué tener en cuenta', 'Depósito', 'Mínimo', 'Bono y tope', 'Tiradas / juego', 'Oferta', 'Condiciones', 'Recarga del domingo', 'Mercados de afiliación', 'Reglas de retiro', '¿Cómo funciona el bono de casino de ColdBet?', '¿Cuál es la bienvenida deportiva de ColdBet?', '¿Qué límites de retiro tiene ColdBet?', '¿Exige ColdBet verificar la identidad?', '¿Tiene licencia ColdBet?'],
  it: ['Verifica del', 'Pacchetto di benvenuto del casinò', 'Requisiti di puntata e limiti', 'Casinò dal vivo', 'Verifica del conto', 'Gioco responsabile', 'Pro', 'Contro', 'A chi si rivolge', 'Cosa considerare', 'Deposito', 'Minimo', 'Bonus e limite', 'Giri / gioco', 'Offerta', 'Condizioni', 'Ricarica della domenica', 'Mercati partner', 'Regole per i prelievi', 'Come funziona il bonus casinò ColdBet?', 'Qual è il bonus sport di benvenuto ColdBet?', 'Quali sono i limiti di prelievo su ColdBet?', 'ColdBet verifica l’identità?', 'ColdBet ha una licenza?'],
  pl: ['Sprawdzono', 'Kasynowy pakiet powitalny', 'Obrót i limity', 'Kasyno na żywo', 'Weryfikacja', 'Odpowiedzialna gra', 'Zalety', 'Wady', 'Dla kogo', 'Na co zwrócić uwagę', 'Wpłata', 'Minimum', 'Bonus i limit', 'Spiny / gra', 'Oferta', 'Warunki', 'Niedzielny bonus', 'Rynki partnerskie', 'Zasady wypłat', 'Jak działa bonus kasynowy ColdBet?', 'Jaki jest powitalny bonus sportowy ColdBet?', 'Jakie są limity wypłat w ColdBet?', 'Czy ColdBet weryfikuje tożsamość?', 'Czy ColdBet ma licencję?'],
  uk: ['Перевірено', 'Вітальний пакет казино', 'Відіграш і ліміти', 'Казино наживо', 'Перевірка акаунта', 'Відповідальна гра', 'Переваги', 'Недоліки', 'Кому може підійти', 'Що варто врахувати', 'Депозит', 'Мінімум', 'Бонус і максимум', 'Фріспіни / гра', 'Пропозиція', 'Умови', 'Недільний бонус', 'Партнерські ринки', 'Умови виплат', 'Як працює бонус казино ColdBet?', 'Який вітальний бонус на спорт пропонує ColdBet?', 'Які ліміти виплат у ColdBet?', 'Чи перевіряє ColdBet особу?', 'Чи має ColdBet ліцензію?'],
  pt: ['Revisto em', 'Pacote de boas-vindas do casino', 'Requisitos de aposta e limites', 'Casino ao vivo', 'Verificação', 'Jogo responsável', 'Prós', 'Contras', 'A quem se destina', 'O que considerar', 'Depósito', 'Mínimo', 'Bónus e limite', 'Jogadas / jogo', 'Oferta', 'Condições', 'Bónus de domingo', 'Mercados de parceria', 'Regras de levantamento', 'Como funciona o bónus de casino da ColdBet?', 'Qual é o bónus de boas-vindas das apostas da ColdBet?', 'Quais são os limites de levantamento da ColdBet?', 'A ColdBet verifica a identidade?', 'A ColdBet tem licença?'],
  fr: ['Vérifié le', 'Offre de bienvenue du casino', 'Conditions de mise et plafonds', 'Casino en direct', 'Vérification', 'Jeu responsable', 'Avantages', 'Inconvénients', 'À qui il convient', 'À prendre en compte', 'Dépôt', 'Minimum', 'Bonus et plafond', 'Tours / jeu', 'Offre', 'Conditions', 'Recharge du dimanche', 'Marchés partenaires', 'Conditions de retrait', 'Comment fonctionne le bonus casino de ColdBet ?', 'Quel est le bonus de bienvenue sportif de ColdBet ?', 'Quels sont les plafonds de retrait de ColdBet ?', 'ColdBet demande-t-il une vérification d’identité ?', 'ColdBet a-t-il une licence ?'],
  hi: ['जाँच की तारीख', 'कैसीनो वेलकम पैकेज', 'वेजरिंग और सीमाएँ', 'लाइव कैसीनो', 'खाते का सत्यापन', 'ज़िम्मेदार गेमिंग', 'फायदे', 'नुकसान', 'किसके लिए उपयुक्त', 'ध्यान देने की बातें', 'जमा', 'न्यूनतम', 'बोनस और सीमा', 'स्पिन / गेम', 'ऑफ़र', 'शर्तें', 'रविवार का बोनस', 'पार्टनर बाज़ार', 'निकासी की शर्तें', 'ColdBet का कैसीनो बोनस कैसे काम करता है?', 'ColdBet का खेल वेलकम बोनस क्या है?', 'ColdBet में निकासी सीमाएँ क्या हैं?', 'क्या ColdBet पहचान सत्यापित करता है?', 'क्या ColdBet के पास लाइसेंस है?'],
  fi: ['Tarkistettu', 'Kasinon tervetulopaketti', 'Kierrätys ja rajat', 'Livekasino', 'Tilin vahvistus', 'Vastuullinen pelaaminen', 'Plussat', 'Miinukset', 'Kenelle sopii', 'Mitä kannattaa huomioida', 'Talletus', 'Vähimmäismäärä', 'Bonus ja yläraja', 'Kierrokset / peli', 'Tarjous', 'Ehdot', 'Sunnuntaibonus', 'Kumppanimarkkinat', 'Kotiutusehdot', 'Miten ColdBetin kasinobonus toimii?', 'Mikä on ColdBetin vedonlyöntibonus?', 'Mitkä ovat ColdBetin kotiutusrajat?', 'Vaatiiko ColdBet henkilöllisyyden vahvistamista?', 'Onko ColdBetilla lisenssi?'],
};

const providerControls = {
  en: ['Previous providers', 'Next providers'],
  de: ['Vorherige Anbieter', 'Nächste Anbieter'],
  es: ['Proveedores anteriores', 'Siguientes proveedores'],
  it: ['Fornitori precedenti', 'Fornitori successivi'],
  pl: ['Poprzedni dostawcy', 'Następni dostawcy'],
  uk: ['Попередні провайдери', 'Наступні провайдери'],
  pt: ['Fornecedores anteriores', 'Próximos fornecedores'],
  fr: ['Fournisseurs précédents', 'Fournisseurs suivants'],
  hi: ['पिछले प्रदाता', 'अगले प्रदाता'],
  fi: ['Edelliset pelintarjoajat', 'Seuraavat pelintarjoajat'],
};

function save(file, markup) {
  if (readFileSync(file, 'utf8') === markup) return;
  if (check) {
    console.error(`Stale ColdBet output: ${file}`);
    process.exitCode = 1;
  } else writeFileSync(file, markup);
}

if (!picture || brand?.bonus !== headlines.en || brand.reviewComingSoon ||
    brand.payments.join(',') !== paymentIcons.join(',')) throw new Error('ColdBet registry does not match the review');

for (const [i, lang] of locales.entries()) {
  if (text[lang]?.length !== fields.length || labels[lang]?.length !== labels.en.length ||
      accountCopy[lang]?.length !== accountCopy.en.length) throw new Error(`Incomplete ColdBet copy: ${lang}`);
  const c = Object.fromEntries(fields.map((key, index) => [key, text[lang][index]]));
  const [reviewed, welcome, wagering, live, verification, safer, pros, cons, best, caution, deposit, minimum, matchCap, spins, offer, terms, reload, markets, withdrawals, ...questions] = labels[lang];
  const [cashierHeading, cashierScope, availability, countLabel, methodLabel, both, depositOnly, withdrawalOnly,
    level, xp, xpRate, cashback, cashbackNote, protection, bonusCountdown] = accountCopy[lang];
  const [morePros, moreCons, newQuestions, newAnswers] = details[lang];
  const [previous, next] = providerControls[lang];
  if (newQuestions.length !== newAnswers.length) throw new Error(`ColdBet FAQ mismatch: ${lang}`);
  const template = readFileSync(prefix(lang) + 'brands/betrepublic/index.html', 'utf8');
  const take = re => {
    const match = template.match(re);
    if (!match) throw new Error(`Missing localized review shell (${lang}): ${re}`);
    return match[1];
  };
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(updatedStamp));
  const eur = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format;
  const percent = new Intl.NumberFormat(locale, { style: 'percent' }).format;
  const cashbackPercent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 2 }).format;
  const number = new Intl.NumberFormat(locale).format;
  const cashierCounts = value => value.replace('{d}', number(depositCount)).replace('{w}', number(withdrawalCount));
  const faq = [
    ...questions.map((question, index) => [question, [c.casino + ' ' + c.spins, c.sportOffer + ' ' + c.sportRules, c.cashier, c.verification, c.license][index]]),
    ...newQuestions.map((question, index) => [question, cashierCounts(newAnswers[index])]),
  ];
  const regions = new Intl.DisplayNames([locale], { type: 'region' });
  const url = origin + route(lang);
  const imageAlt = `ColdBet — ${label('overview')}`;
  const paragraph = value => `<p class="section-intro">${esc(value)}</p>`;
  const section = (id, key, inner, tab = false) =>
    `<section class="container" id="${slug}-${id}" data-review-section="${key}"${tab ? ' data-review-details' : ''}><h2 class="title">${esc(label(key))}</h2>${inner}</section>`;
  const cta = take(/(<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>)/).replace(/href="[^"]+"/, `href="${esc(brand.urlCasino)}"`);
  const hero = take(/(<section class="hero container">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*class="brand-logo"[^>]*>/, `<img class="brand-logo" src="/${brand.image}" alt="ColdBet" width="640" height="320" decoding="async" />`)
    .replace(/<h1>[^<]+<\/h1>/, `<h1>${esc(c.title)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(c.overview)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, `<p class="hero-subtitle editorial-meta">${esc(reviewed)}: <time datetime="${updatedStamp}">${esc(date)}</time></p>`)
    .replace(ctaPattern, () => cta);
  const facts = [[welcome, c.headline], [wagering, '35×'], [live, 'Crazy Time · Funky Time'], [label('sports'), `${percent(1)} · ${eur(100)}`], [label('cashier'), '3×'], [label('rewards'), 'VIP 1–8']];
  let row = 0;
  const highlights = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*>/, `<img src="${esc(picture)}" alt="${esc(imageAlt)}" width="1600" height="833" loading="eager" fetchpriority="high" decoding="async" />`)
    .replace(/(<strong>)[^<]*(<\/strong>\s*<span>)[\s\S]*?(<\/span>)/g, (_, start, body, end) =>
      start + esc(facts[row][0]) + body + esc(facts[row++][1]) + end);
  if (row !== facts.length) throw new Error(`Invalid highlight shell: ${lang}`);
  const geo = take(/(<section class="container">\s*<div class="brand-countries">[\s\S]*?<\/section>)/)
    .replace(/(<h2 class="title">)[^<]+/, (_, opening) => opening + esc(markets));
  const banking = take(/(<section class="container">\s*<div class="brand-payments">[\s\S]*?<\/section>)/);
  const final = take(/(<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>)/)
    .replaceAll('BetRepublic', 'ColdBet').replace(ctaPattern, () => cta);
  const footer = take(/(<section class="all-countries">[\s\S]*$)/).trimEnd();
  const safety = `<p class="section-intro"><a class="cta-secondary editorial-resource-link" href="/${prefix(lang)}responsible-gambling/">${siteIconMarkup('safety', 'site-icon site-icon--inline', 18)}<span>${esc(safer)}</span></a></p>`;
  const table = (headers, rows) => `<div class="table-wrap"><table><thead><tr>${
    headers.map(value => `<th scope="col">${esc(value)}</th>`).join('')
  }</tr></thead><tbody>${
    rows.map(([heading, ...cells]) => `<tr><th scope="row">${esc(heading)}</th>${cells.map(value => `<td>${esc(value)}</td>`).join('')}</tr>`).join('')
  }</tbody></table></div>`;
  const matrix = table([deposit, minimum, matchCap, spins],
    welcomeDeposits.map(([depositNumber, rate, min, cap, count, game]) =>
      [number(depositNumber), eur(min), percent(rate) + ' · ' + eur(cap), number(count) + ' · ' + game]));
  const cashierMethods = `<h3>${esc(cashierHeading)}</h3>${paragraph(cashierCounts(cashierScope))}${
    table([availability, countLabel, methodLabel], paymentGroups.map((methods, index) =>
      [[both, depositOnly, withdrawalOnly][index], number(methods.length), methods.join(', ')]))
  }`;
  const cashbackTiers = table([level, xp, xpRate, cashback],
    vipRows.map(([name, points, experienceRate, rate, upper]) =>
      [name, points === null ? '—' : number(points), number(experienceRate), cashbackPercent(rate) + (upper ? '–' + cashbackPercent(upper) : '')]));
  const org = { '@id': origin + '/#organization' };
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', ...org, name: 'SpinCresta', url: origin + '/' },
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, breadcrumb: { '@id': url + '#breadcrumb' } },
    { '@type': 'Article', '@id': url + '#article', headline: c.title, description: c.description, inLanguage: lang, image: [picture], mainEntityOfPage: { '@id': url }, author: org, publisher: org, datePublished: stamp, dateModified: updatedStamp },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SpinCresta', item: origin + '/' + prefix(lang) },
      { '@type': 'ListItem', position: 2, name: 'ColdBet', item: url },
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
  <body data-brand="${slug}" data-language="${lang}" data-review-market-label="${esc(markets)}">
    ${take(/(<header class="header">[\s\S]*?<\/header>)/)}
    ${hero}
    ${highlights}
    ${geo}
    ${banking}
    <main class="content-review">
      ${section('summary', 'summary', reviewTable([offer, terms, 'EUR'], [
        [welcome, c.headline, eur(10) + ' · 35×'],
        [label('sports'), percent(1) + ' · ' + eur(100), eur(1) + ' · 5×'],
        [label('cashier'), '3×', eur(3000) + ' / ' + eur(30000) + ' / ' + eur(100000)],
      ]))}
      ${section('bonus', 'bonuses', paragraph(c.casino) + matrix + reviewCards([[wagering, [c.wagering, bonusCountdown]], [spins, c.spins], [reload, c.reload]]), true)}
      ${section('games', 'games', reviewCards([[label('games'), c.games], [live, c.live]]), true)}
      ${section('sports', 'sports', paragraph(c.sports) + reviewCards([[label('bonuses'), c.sportOffer], [wagering, c.sportRules]]), true)}
      ${section('rewards', 'rewards', paragraph(c.vip) + cashbackTiers + paragraph(cashbackNote), true)}
      ${section('cashier', 'cashier', paragraph(c.cashier) + cashierMethods + reviewCards([[withdrawals, c.withdrawalRules], [verification, c.verification]]))}
      ${section('trust', 'trust', reviewCards([[label('trust'), c.license], [markets, c.markets], [safer, [c.safer, protection]]]) + safety, true)}
      ${reviewProviderStrip({
        id: 'coldbet-providers', heading: label('providers'),
        providers, previous, next,
      })}
      ${section('pros-cons', 'pros', reviewCards([[pros, [...comparison[lang][0], ...morePros]], [cons, [...comparison[lang][1], ...moreCons]]], { comparison: true }))}
      ${section('best-for', 'suitability', reviewCards([[best, c.best], [caution, c.caution]]))}
      <section class="container" id="faq" data-review-section="faq"><h2 class="title">${esc(label('faq'))}</h2><div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>
      ${final}
    </main>
    ${footer}
`;
  save(prefix(lang) + 'brands/coldbet/index.html', syncDefaultTheme(page));

  const directory = prefix(lang) + 'casinos-and-betting/index.html';
  const source = readFileSync(directory, 'utf8');
  const rowPattern = key => new RegExp(`<article class="casino-list-row"[^>]*data-brand-slug="${key}"[^>]*>[\\s\\S]*?<\\/article>`);
  const catalogType = source.match(rowPattern('betrepublic'))?.[0].match(/<p class="casino-bonus"><strong>[^<]+<\/strong> ([^<]+)<\/p>/)?.[1];
  if (!catalogType || !rowPattern(slug).test(source)) throw new Error(`Missing ColdBet or BetRepublic directory row: ${lang}`);
  const updated = source.replace(rowPattern(slug), block => {
    let n = 0;
    return block.replace(/(<p class="casino-bonus">\s*<strong>)([^<]+)(<\/strong>)[\s\S]*?(<\/p>)/g,
      (_, start, labelText, mid, end) => {
        const content = [catalogType, esc(c.headline), esc(brand.countries.map(code => regions.of(code)).join(', '))][n];
        if (n > 2) throw new Error(`Unexpected ColdBet directory field: ${lang}`);
        return start + (n++ === 2 ? esc(markets) + ':' : labelText) + mid + ' ' + content + end;
      });
  });
  save(directory, updated);
}
