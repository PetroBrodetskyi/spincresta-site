import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { copy, headlines, keys, rewards, verdict, welcome } from './britsino-review-copy.mjs';
import { snapshotIntro, tableCopy } from './britsino-review-tables.mjs';
import { escapeReview as esc, reviewCards, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const origin = 'https://spincresta.com';
const updated = '2026-11-23';
const brand = BRANDS.find(item => item.urlDetail === 'brands/britsino.html');
const picture = BRAND_HOMEPAGE_SCREENSHOTS.britsino;
const providers = getReviewProviders('britsino');
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/britsino/';
const ctaPattern = /<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>/;
const check = process.argv.includes('--check');
const oldHeadline = 'Welcome Package - 320% up to £2,200 + 2,000 FS';
const maxOffers = [1, 2, 3, 4].map(stage => welcome.filter(([n]) => n === stage).at(-1));
const gbpCap = maxOffers.reduce((sum, [, , , cap]) => sum + cap, 0);
const spinsCap = maxOffers.reduce((sum, [, , , , spins]) => sum + spins, 0);

// UI labels followed by the independently localized questions shown in the FAQ.
const words = {
  en: 'Reviewed|Partner market|Welcome offer|Deposit|Minimum deposit|Match and cap|Free spins|Wagering|Live casino|VIP tier|Weekly rakeback cap|Monthly cashback cap|Identity checks|Player protection|Responsible gambling|Pros|Cons|Previous providers|Next providers|Up to|What is the Britsino welcome package?|How much do I have to wager to withdraw a cash bonus?|How do the loot boxes, scratch cards, and free spins work?|How do cashback and rakeback differ?|What are the withdrawal minimum and limits?|Does Britsino check identity before withdrawal?|What does the Britsino live casino offer?|Is Britsino licensed in Great Britain?',
  de: 'Geprüft am|Partnermarkt|Willkommensangebot|Einzahlung|Mindesteinzahlung|Bonusanteil und Höchstbetrag|Freispiele|Umsatzbedingungen|Live-Casino|VIP-Rang|Rakeback-Limit pro Woche|Cashback-Limit pro Monat|Identitätsprüfung|Spielerschutz|Verantwortungsvolles Spielen|Vorteile|Nachteile|Vorherige Anbieter|Nächste Anbieter|Bis zu|Was enthält das Willkommenspaket von Britsino?|Welche Umsatzbedingungen gelten für den Geldbonus?|Wie funktionieren Lootboxen, Rubbellose und Freispiele?|Was ist der Unterschied zwischen Cashback und Rakeback?|Welche Mindestbeträge und Limits gelten für Auszahlungen?|Prüft Britsino vor der Auszahlung die Identität?|Was bietet das Live-Casino von Britsino?|Hat Britsino eine Lizenz in Großbritannien?',
  es: 'Revisado el|Mercado de afiliación|Oferta de bienvenida|Depósito|Depósito mínimo|Porcentaje y tope|Tiradas gratis|Requisitos de apuesta|Casino en vivo|Nivel VIP|Tope semanal de rakeback|Tope mensual de reembolso|Verificación de identidad|Protección al jugador|Juego responsable|Ventajas|Desventajas|Proveedores anteriores|Siguientes proveedores|Hasta|¿En qué consiste el paquete de bienvenida de Britsino?|¿Cuáles son los requisitos de apuesta del bono de dinero?|¿Cómo funcionan las cajas, las tarjetas rasca y las tiradas gratis?|¿En qué se diferencian el reembolso y el rakeback?|¿Cuáles son el mínimo y los límites de retiro?|¿Britsino verifica la identidad antes de un retiro?|¿Qué ofrece el casino en vivo de Britsino?|¿Tiene Britsino licencia en Gran Bretaña?',
  it: 'Verificato il|Mercato partner|Offerta di benvenuto|Deposito|Deposito minimo|Percentuale e massimale|Giri gratis|Requisiti di puntata|Casinò dal vivo|Livello VIP|Limite settimanale del rakeback|Limite mensile del cashback|Verifica dell’identità|Tutela dei giocatori|Gioco responsabile|Pro|Contro|Fornitori precedenti|Fornitori successivi|Fino a|In cosa consiste il pacchetto di benvenuto di Britsino?|Quali sono i requisiti di puntata del bonus in denaro?|Come funzionano loot box, gratta e vinci e giri gratis?|Qual è la differenza tra cashback e rakeback?|Quali sono il minimo e i limiti di prelievo?|Britsino verifica l’identità prima del prelievo?|Che cosa offre il casinò dal vivo di Britsino?|Britsino ha una licenza in Gran Bretagna?',
  pl: 'Sprawdzono|Rynek partnerski|Oferta powitalna|Wpłata|Minimalna wpłata|Procent i limit bonusu|Darmowe spiny|Wymagania obrotu|Kasyno na żywo|Poziom VIP|Tygodniowy limit rakebacku|Miesięczny limit cashbacku|Weryfikacja tożsamości|Ochrona graczy|Odpowiedzialna gra|Zalety|Wady|Poprzedni dostawcy|Następni dostawcy|Do|Co obejmuje pakiet powitalny Britsino?|Jakie są wymagania obrotu dla bonusu gotówkowego?|Jak działają skrzynki, zdrapki i darmowe spiny?|Czym różni się cashback od rakebacku?|Jakie są minimum i limity wypłat?|Czy Britsino sprawdza tożsamość przed wypłatą?|Co oferuje kasyno na żywo Britsino?|Czy Britsino ma licencję w Wielkiej Brytanii?',
  uk: 'Перевірено|Партнерський ринок|Вітальна пропозиція|Депозит|Мінімальний депозит|Відсоток і ліміт|Фріспіни|Відіграш|Казино наживо|Рівень VIP|Тижневий ліміт рейкбеку|Місячний ліміт кешбеку|Перевірка особи|Захист гравців|Відповідальна гра|Переваги|Недоліки|Попередні провайдери|Наступні провайдери|До|Що входить у вітальний пакет Britsino?|Які умови відіграшу грошового бонусу?|Як працюють лутбокси, скретч-картки та фріспіни?|Чим кешбек відрізняється від рейкбеку?|Який мінімум і які ліміти виплат?|Чи перевіряє Britsino особу перед виплатою?|Що пропонує казино Britsino наживо?|Чи має Britsino ліцензію у Великій Британії?',
  pt: 'Revisto em|Mercado de parceria|Oferta de boas-vindas|Depósito|Depósito mínimo|Percentagem e limite|Jogadas grátis|Requisitos de aposta|Casino ao vivo|Nível VIP|Limite semanal do rakeback|Limite mensal do cashback|Verificação de identidade|Proteção do jogador|Jogo responsável|Prós|Contras|Fornecedores anteriores|Próximos fornecedores|Até|O que inclui o pacote de boas-vindas da Britsino?|Quais são os requisitos de aposta do bónus em dinheiro?|Como funcionam as caixas, as raspadinhas e as jogadas grátis?|Qual é a diferença entre cashback e rakeback?|Qual é o mínimo e quais são os limites de levantamento?|A Britsino verifica a identidade antes do levantamento?|O que oferece o casino ao vivo da Britsino?|A Britsino tem licença na Grã-Bretanha?',
  fr: 'Vérifié le|Marché partenaire|Offre de bienvenue|Dépôt|Dépôt minimum|Pourcentage et plafond|Tours gratuits|Conditions de mise|Casino en direct|Rang VIP|Plafond hebdomadaire du rakeback|Plafond mensuel du cashback|Vérification d’identité|Protection des joueurs|Jeu responsable|Avantages|Inconvénients|Fournisseurs précédents|Fournisseurs suivants|Jusqu’à|Que comprend l’offre de bienvenue de Britsino ?|Quelles sont les conditions de mise du bonus en argent ?|Comment fonctionnent les coffres, les cartes à gratter et les tours gratuits ?|Quelle est la différence entre cashback et rakeback ?|Quels sont le minimum et les plafonds de retrait ?|Britsino vérifie-t-il l’identité avant un retrait ?|Que propose le casino en direct de Britsino ?|Britsino a-t-il une licence en Grande-Bretagne ?',
  hi: 'जाँच की तारीख|पार्टनर बाज़ार|वेलकम ऑफ़र|जमा|न्यूनतम जमा|बोनस दर और सीमा|मुफ़्त स्पिन|वेजरिंग|लाइव कैसीनो|VIP स्तर|साप्ताहिक रेकबैक सीमा|मासिक कैशबैक सीमा|पहचान की जाँच|खिलाड़ियों की सुरक्षा|ज़िम्मेदार गेमिंग|फायदे|नुकसान|पिछले प्रदाता|अगले प्रदाता|अधिकतम|Britsino के वेलकम पैकेज में क्या है?|नकद बोनस पर वेजरिंग की शर्तें क्या हैं?|लूट बॉक्स, स्क्रैच कार्ड और मुफ़्त स्पिन कैसे काम करते हैं?|कैशबैक और रेकबैक में क्या फ़र्क है?|निकासी की न्यूनतम रकम और सीमाएँ क्या हैं?|क्या Britsino निकासी से पहले पहचान की जाँच करता है?|Britsino के लाइव कैसीनो में क्या है?|क्या Britsino के पास ग्रेट ब्रिटेन का लाइसेंस है?',
  fi: 'Tarkistettu|Kumppanimarkkina|Tervetulotarjous|Talletus|Vähimmäistalletus|Prosentti ja enimmäismäärä|Ilmaiskierrokset|Kierrätys|Livekasino|VIP-taso|Viikoittaisen rakebackin yläraja|Kuukausittaisen cashbackin yläraja|Henkilöllisyyden vahvistus|Pelaajansuoja|Vastuullinen pelaaminen|Plussat|Miinukset|Edelliset pelintarjoajat|Seuraavat pelintarjoajat|Enintään|Mitä Britsino-kasinon tervetulopaketti sisältää?|Mikä on rahabonuksen kierrätysvaatimus?|Miten yllätyslaatikot, raaputusarvat ja ilmaiskierrokset toimivat?|Miten cashback ja rakeback eroavat toisistaan?|Mitkä ovat kotiutuksen vähimmäismäärä ja rajat?|Tarkistaako Britsino henkilöllisyyden ennen kotiutusta?|Mitä Britsino-livekasino tarjoaa?|Onko Britsinolla pelilupa Isossa-Britanniassa?',
};

function save(file, output) {
  if (readFileSync(file, 'utf8') === output) return;
  if (!check) return writeFileSync(file, output);
  console.error('Stale Britsino output: ' + file);
  process.exitCode = 1;
}

if (!brand?.hasDetailPage || brand.bonus !== headlines.en || !picture || providers.length < 7 || gbpCap !== 2000 || spinsCap !== 700) {
  throw new Error('Incomplete Britsino registry, assets, or offer data');
}

for (const [i, lang] of locales.entries()) {
  const c = Object.fromEntries(keys.map((key, j) => [key, copy[lang][j]]));
  const [
    reviewed, market, offer, deposit, minimum, match, spins, wagering, live, vip, rakeback, cashback,
    identity, safetyLabel, safer, pros, cons, previous, next, _upTo, ...questions
  ] = words[lang].split('|');
  const [fieldNames, cashierNote, liveExtras, bestFit, tradeoffs] = tableCopy[lang];
  const detailLabels = fieldNames.split('|');
  const [
    topic, details, gameType, examples, roulette, cardGames, lotteryBingo, scratch, keno, dice, liveFormats,
    prizes, cashierMinimum, daily, weekly, monthly, pending, license, best, caution,
  ] = detailLabels;
  if (copy[lang].length !== keys.length || questions.length !== 8 || detailLabels.length !== 20 || !tradeoffs) {
    throw new Error('Incomplete copy: ' + lang);
  }
  const shell = readFileSync(prefix(lang) + 'brands/coldbet/index.html', 'utf8');
  const take = re => {
    const found = shell.match(re);
    if (!found) throw new Error('Missing localized shell (' + lang + '): ' + re);
    return found[1];
  };
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const number = new Intl.NumberFormat(locale).format;
  const gbp = new Intl.NumberFormat(locale, { style: 'currency', currency: 'GBP', currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format;
  const minimums = ['GBP', 'EUR', 'USD'].map(currency =>
    new Intl.NumberFormat(locale, { style: 'currency', currency, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(20),
  ).join(' · ');
  const percent = rate => new Intl.NumberFormat(locale, { style: 'percent' }).format(rate / 100);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(updated));
  const url = origin + route(lang);
  const imageAlt = 'Britsino — ' + label('overview');
  const headline = headlines[lang];
  const paragraph = value => '<p class="section-intro">' + esc(value) + '</p>';
  const section = (id, key, body, details = false) =>
    '<section class="container" id="' + id + '" data-review-section="' + key + '"' + (details ? ' data-review-details' : '') +
    '><h2 class="title">' + esc(label(key)) + '</h2>' + body + '</section>';
  const cta = take(/(<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>)/).replace(/href="[^"]+"/, 'href="' + esc(brand.urlCasino) + '"');
  const hero = take(/(<section class="hero container">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*class="brand-logo"[^>]*>/, '<img class="brand-logo" src="/' + brand.image + '" alt="Britsino" width="640" height="320" decoding="async" />')
    .replace(/<h1>[^<]+<\/h1>/, '<h1>' + esc(c.title) + '</h1>')
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, '<p class="hero-subtitle">' + esc(c.overview) + '</p>')
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, '<p class="hero-subtitle editorial-meta">' + esc(reviewed) + ': <time datetime="' + updated + '">' + esc(date) + '</time></p>')
    .replace(ctaPattern, () => cta);
  const facts = [
    [offer, headline], [wagering, '35×'], [live, 'Live Vegas · Plati+ · ICONIC21'],
    [minimum, gbp(20)], [label('cashier'), gbp(20) + ' · 3×'], [label('rewards'), percent(2) + '–' + percent(10) + ' · 40×'],
  ];
  const highlightIcons = ['bonus', 'balance', 'games', 'payments', 'wallet', 'trophy'];
  let fact = 0;
  const highlights = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/)
    .replace('features-section glass-section', 'features-section glass-section brand-highlights--compact')
    .replace(/<img\b[^>]*>/, '<img src="' + esc(picture) + '" alt="' + esc(imageAlt) + '" width="1600" height="900" loading="eager" fetchpriority="high" decoding="async" />')
    .replace(/<div class="icon-placeholder">\d+<\/div>\s*<strong>[^<]*<\/strong>\s*<span>[\s\S]*?<\/span>/g, () => {
      const [heading, value] = facts[fact];
      return siteIconMarkup(highlightIcons[fact++], 'site-icon brand-highlight-icon', 18) +
        '<strong>' + esc(heading) + '</strong><span>' + esc(value) + '</span>';
    });
  if (fact !== facts.length) throw new Error('Invalid highlights: ' + lang);
  const geo = take(/(<section class="container">\s*<div class="brand-countries">[\s\S]*?<\/section>)/)
    .replace(/(<h2 class="title">)[^<]+/, (_, open) => open + esc(market))
    .replace(/<\/div>\s*<\/section>$/, paragraph(c.market) + '</div></section>');
  const payments = take(/(<section class="container">\s*<div class="brand-payments">[\s\S]*?<\/section>)/);
  const final = take(/(<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>)/)
    .replaceAll('ColdBet', 'Britsino').replace(ctaPattern, () => cta);
  const footer = take(/(<section class="all-countries">[\s\S]*$)/)
    .replace(/\/scripts\/main\.js\?v=[^"]+/, '/scripts/main.js?v=20261123-britsino-catalog').trimEnd();
  const safety = '<p class="section-intro"><a class="cta-secondary editorial-resource-link" href="/' + prefix(lang) +
    'responsible-gambling/">' + siteIconMarkup('safety', 'site-icon site-icon--inline', 18) + '<span>' + esc(safer) + '</span></a></p>';
  const faq = questions.map((q, j) => [q, [c.offer, c.wagering, c.prizes, c.rewards, c.banking, c.kyc, c.live + ' ' + liveExtras, c.license][j]]);
  const detailsTable = rows => reviewTable([topic, details], rows, { rowHeaders: true });
  const org = { '@id': origin + '/#organization' };
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', ...org, name: 'SpinCresta', url: origin + '/' },
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, breadcrumb: { '@id': url + '#breadcrumb' } },
    { '@type': 'Article', '@id': url + '#article', headline: c.title, description: c.description, inLanguage: lang, image: [picture], mainEntityOfPage: { '@id': url }, author: org, publisher: org, dateModified: updated },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SpinCresta', item: origin + '/' + prefix(lang) },
      { '@type': 'ListItem', position: 2, name: 'Britsino', item: url },
    ] },
    { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: lang, mainEntity: faq.map(([name, answer]) => ({
      '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text: answer },
    })) },
  ] };
  const meta = [['title', c.title], ['description', c.description], ['image', picture]]
    .flatMap(([key, value]) => ['<meta property="og:' + key + '" content="' + esc(value) + '" />', '<meta name="twitter:' + key + '" content="' + esc(value) + '" />']);
  const page = [
    take(/^([\s\S]*?)<title>/) + '<title>' + esc(c.title) + '</title>',
    '<meta name="description" content="' + esc(c.description) + '" />',
    '<meta name="brand-snapshot-intro" content="' + esc(snapshotIntro[lang]) + '" />',
    '<link rel="canonical" href="' + url + '" />',
    ...[...locales, 'x-default'].map(code => '<link rel="alternate" hreflang="' + (code === 'fi' ? 'fi-FI' : code) +
      '" href="' + origin + route(code === 'x-default' ? 'en' : code) + '" />'),
    '<link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />',
    '<meta property="og:type" content="article" />',
    '<meta property="og:url" content="' + url + '" />',
    '<meta property="og:site_name" content="SpinCresta" />',
    '<meta property="og:image:alt" content="' + esc(imageAlt) + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    ...meta,
    take(/(<link rel="stylesheet"[^>]*>)/).replace(/\/styles\.css\?v=[^"]+/, '/styles.css?v=20261123-britsino-catalog'),
    '<script type="application/ld+json">' + JSON.stringify(schema).replaceAll('<', '\\u003c') + '</script>',
  ].join('\n    ') + '\n  </head>\n  <body data-brand="britsino" data-language="' + lang + '" data-review-market-label="' + esc(market) + '">\n    ' + [
    take(/(<header class="header">[\s\S]*?<\/header>)/),
    hero, highlights, geo, payments,
    '<main class="content-review">',
    '  ' + section('britsino-bonus', 'bonuses', paragraph(c.offer) + reviewTable(
      [deposit + ' · ' + minimum, match, spins],
      welcome.map(([n, min, rate, cap, count]) => [number(n) + ' · ' + gbp(min), percent(rate) + ' · ' + gbp(cap), number(count)]),
    ) + detailsTable([[wagering, c.wagering], [prizes, c.prizes]]), true),
    '  ' + section('britsino-games', 'games', paragraph(c.games) + reviewTable([gameType, examples], [
      [roulette, 'European Roulette (True Labs) · American Roulette (KA Gaming)'],
      [cardGames, 'Classic Multihand Blackjack (BGaming) · Triple Edge Poker (Betsoft)'],
      [lotteryBingo, 'Bingo Power (Belatra) · Super Bingo (TaDa Gaming)'],
      [scratch, 'Ice Scratch Gold (BGaming) · Rainbow Fruit Scratch (KA Gaming)'],
      [keno, 'Sweet Keno (InOut) · Super Keno (KA Gaming)'],
      [dice, 'Sic Bo (TaDa Gaming) · Craps (Nucleus Gaming)'],
      [live, 'Live Roulette (Live Vegas) · Live Baccarat (Plati+)'],
      [liveFormats, "Texas Hold'em Multiplayer (Live Vegas) · Gravity Wheel (ICONIC21) · Dice Duel (BetGames)"],
    ], { rowHeaders: true }) + paragraph(c.live), true),
    '  ' + section('britsino-rewards', 'rewards', paragraph(c.rewards) + reviewTable(
      [vip, rakeback, cashback],
      rewards.map(([tier, rate, weekly, monthly]) => [tier, percent(rate) + ' · ' + gbp(weekly), percent(rate) + ' · ' + gbp(monthly)]),
    ), true),
    '  ' + section('britsino-cashier', 'cashier', detailsTable([
      [cashierMinimum, minimums], [daily, number(2000)], [weekly, number(5000)], [monthly, number(20000)],
      [pending, number(1)], [identity, c.kyc],
    ]) + paragraph(cashierNote), true),
    '  ' + section('britsino-trust', 'trust', detailsTable([[license, c.license], [safetyLabel, c.safer]]) + safety, true),
    '  ' + reviewProviderStrip({ id: 'britsino-providers', heading: label('providers'), providers, previous, next }),
    '  ' + section('britsino-pros-cons', 'pros', reviewCards([
      [pros, [live + ': Live Vegas · Plati+ · ICONIC21', label('providers') + ': BGaming · TrueLab · Gamzix', label('rewards') + ': ' + percent(2) + '–' + percent(10)]],
      [cons, [verdict[lang][0], verdict[lang][1], c.market.split('. ').at(-1)]],
    ], { comparison: true })),
    '  ' + section('britsino-best-for', 'suitability', reviewCards([[best, bestFit], [caution, tradeoffs]])),
    '  ' + section('faq', 'faq', '<div class="timeline">' + faq.map(([q, a]) => '<h3>' + esc(q) + '</h3><p>' + esc(a) + '</p>').join('') + '</div>'),
    '  ' + final,
    '</main>',
    footer,
  ].join('\n    ') + '\n';
  save(prefix(lang) + 'brands/britsino/index.html', syncDefaultTheme(page));

  const catalogFile = prefix(lang) + 'casinos-and-betting/index.html';
  const catalog = readFileSync(catalogFile, 'utf8');
  let rows = 0;
  const catalogUpdated = catalog.replace(/<article\b[^>]*class="casino-list-row"[\s\S]*?<\/article>/g, article => {
    if (!article.includes('href="' + route(lang) + '"')) return article;
    rows++;
    let fields = 0;
    const result = article.replace(/(<p class="casino-bonus">\s*<strong>)([^<]+)(<\/strong>)([\s\S]*?)(<\/p>)/g,
      (tag, open, name, end, value, close) => {
        fields++;
        if (fields === 2) return open + name + end + ' ' + esc(headline) + '\n                ' + close;
        if (fields === 3) return open + esc(market) + ':' + end + value + close;
        return tag;
      });
    if (fields !== 3) throw new Error('Expected type, bonus, and market in ' + catalogFile);
    return result;
  });
  if (rows !== 1) throw new Error('Expected one Britsino row in ' + catalogFile);
  save(catalogFile, catalogUpdated);

  if (lang !== 'en') {
    const file = 'scripts/brand-bonus-translations/' + lang + '.js';
    const data = readFileSync(file, 'utf8');
    const entry = JSON.stringify(brand.bonus) + ': ' + JSON.stringify(headline) + ',';
    const oldKey = JSON.stringify(oldHeadline) + ': ';
    const newKey = JSON.stringify(brand.bonus) + ': ';
    const lines = data.split('\n');
    const index = lines.findIndex(line => line.trimStart().startsWith(oldKey) || line.trimStart().startsWith(newKey));
    if (index < 0) throw new Error('Missing Britsino bonus key in ' + file);
    lines[index] = '  ' + entry;
    save(file, lines.join('\n'));
  }
}

const sitemap = readFileSync('sitemap.xml', 'utf8');
let entries = 0;
const result = sitemap.replace(/(<loc>https:\/\/spincresta\.com\/(?:[a-z]{2}\/)?brands\/britsino\/<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/g,
  (_, open, close) => { entries++; return open + updated + close; });
if (entries !== locales.length) throw new Error('Incorrect number of Britsino routes in sitemap: ' + entries);
save('sitemap.xml', result);
