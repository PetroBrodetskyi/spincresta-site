import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { getReviewProviders } from '../scripts/brand-review-providers.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { casinoTiers, cashbackTiers, comparisons, copy, fields, sportsTiers } from './coolzino-review-copy.mjs';
import { escapeReview as esc, reviewCards, reviewProviderStrip, reviewTable } from './brand-review-template.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';
import { syncUnavailableBrandMarkup } from './sync-brand-availability.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const slug = 'coolzino';
const brand = BRANDS.find(item => item.urlDetail === `brands/${slug}.html`);
const picture = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const providers = getReviewProviders(slug);
const origin = 'https://spincresta.com';
const updated = '2026-11-23';
const partnerMarkets = ['Partner markets', 'Partnermärkte', 'Mercados de afiliación', 'Mercati partner', 'Rynki partnerskie', 'Партнерські ринки', 'Mercados de parceria', 'Marchés partenaires', 'पार्टनर बाज़ार', 'Kumppanimarkkinat'];
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/' + slug + '/';
const ctaPattern = /<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>/;
const check = process.argv.includes('--check');

// Order: UI labels, then eight visible FAQ questions.
const words = {
  en: 'Reviewed|Welcome offer|Wagering|Free spins|Live casino|Deposit|Match|Maximum|Terms|Cashback|Weekly cap|Verification|Market restrictions|Player protection|Responsible gambling|Pros|Cons|Best for|What to consider|Previous providers|Next providers|What is the Coolzino casino welcome bonus?|How do the free spins work?|What is the Coolzino sportsbook bonus?|How does weekly cashback work?|Which payment methods does Coolzino list?|What is the Coolzino withdrawal minimum and processing time?|Does Coolzino require identity verification?|Is Coolzino licensed?',
  de: 'Geprüft am|Willkommensangebot|Umsatzbedingungen|Freispiele|Live-Casino|Einzahlung|Bonusanteil|Höchstbetrag|Bedingungen|Cashback|Wochenlimit|Verifizierung|Länderbeschränkungen|Spielerschutz|Verantwortungsvolles Spielen|Vorteile|Nachteile|Geeignet für|Was zu beachten ist|Vorherige Anbieter|Nächste Anbieter|Wie hoch ist der Willkommensbonus im Coolzino Casino?|Wie funktionieren die Freispiele?|Wie hoch ist der Sportwettenbonus bei Coolzino?|Wie funktioniert das wöchentliche Cashback?|Welche Zahlungsmethoden nennt Coolzino?|Wie hoch ist die Mindestauszahlung und wie lange dauert sie?|Verlangt Coolzino eine Identitätsprüfung?|Hat Coolzino eine Lizenz?',
  es: 'Revisado el|Oferta de bienvenida|Requisitos de apuesta|Tiradas gratis|Casino en vivo|Depósito|Porcentaje|Tope|Condiciones|Reembolso|Límite semanal|Verificación|Restricciones geográficas|Protección al jugador|Juego responsable|Ventajas|Desventajas|A quién le conviene|Qué considerar|Proveedores anteriores|Siguientes proveedores|¿Cuál es el bono de bienvenida del casino Coolzino?|¿Cómo funcionan las tiradas gratis?|¿Cuál es el bono de apuestas deportivas de Coolzino?|¿Cómo funciona el reembolso semanal?|¿Qué métodos de pago muestra Coolzino?|¿Cuál es el retiro mínimo y cuánto tarda?|¿Coolzino verifica la identidad?|¿Coolzino tiene licencia?',
  it: 'Verificato il|Offerta di benvenuto|Requisiti di puntata|Giri gratis|Casinò dal vivo|Deposito|Percentuale|Massimo|Condizioni|Cashback|Limite settimanale|Verifica del conto|Restrizioni territoriali|Tutela dei giocatori|Gioco responsabile|Pro|Contro|A chi si rivolge|Cosa considerare|Fornitori precedenti|Fornitori successivi|Qual è il bonus di benvenuto del casinò Coolzino?|Come funzionano i giri gratis?|Qual è il bonus sport di Coolzino?|Come funziona il cashback settimanale?|Quali metodi di pagamento indica Coolzino?|Qual è il prelievo minimo e quanto tempo richiede?|Coolzino verifica l’identità?|Coolzino ha una licenza?',
  pl: 'Sprawdzono|Oferta powitalna|Wymagania obrotu|Darmowe spiny|Kasyno na żywo|Wpłata|Procent bonusu|Maksimum|Warunki|Cashback|Limit tygodniowy|Weryfikacja|Ograniczenia terytorialne|Ochrona graczy|Odpowiedzialna gra|Zalety|Wady|Dla kogo|Na co zwrócić uwagę|Poprzedni dostawcy|Następni dostawcy|Jaki jest bonus powitalny w kasynie Coolzino?|Jak działają darmowe spiny?|Jaki jest bonus sportowy w Coolzino?|Jak działa cotygodniowy cashback?|Jakie metody płatności podaje Coolzino?|Ile wynosi minimalna wypłata i ile trwa?|Czy Coolzino weryfikuje tożsamość?|Czy Coolzino ma licencję?',
  uk: 'Перевірено|Вітальна пропозиція|Відіграш|Фріспіни|Казино наживо|Депозит|Розмір бонусу|Максимум|Умови|Кешбек|Тижневий ліміт|Перевірка акаунта|Регіональні обмеження|Захист гравців|Відповідальна гра|Переваги|Недоліки|Кому може підійти|Що варто врахувати|Попередні провайдери|Наступні провайдери|Який вітальний бонус казино Coolzino?|Як нараховують фріспіни?|Який бонус на спорт у Coolzino?|Як працює щотижневий кешбек?|Які платіжні методи вказує Coolzino?|Яка мінімальна виплата і скільки часу вона займає?|Чи перевіряє Coolzino особу?|Чи має Coolzino ліцензію?',
  pt: 'Revisto em|Oferta de boas-vindas|Requisitos de aposta|Jogadas grátis|Casino ao vivo|Depósito|Percentagem|Máximo|Condições|Cashback|Limite semanal|Verificação|Restrições regionais|Proteção do jogador|Jogo responsável|Prós|Contras|A quem se destina|O que considerar|Fornecedores anteriores|Próximos fornecedores|Qual é o bónus de boas-vindas do casino Coolzino?|Como funcionam as jogadas grátis?|Qual é o bónus desportivo da Coolzino?|Como funciona o cashback semanal?|Que métodos de pagamento indica a Coolzino?|Qual é o levantamento mínimo e quanto tempo demora?|A Coolzino verifica a identidade?|A Coolzino tem licença?',
  fr: 'Vérifié le|Offre de bienvenue|Conditions de mise|Tours gratuits|Casino en direct|Dépôt|Pourcentage|Plafond|Conditions|Cashback|Plafond hebdomadaire|Vérification|Restrictions géographiques|Protection des joueurs|Jeu responsable|Avantages|Inconvénients|À qui il convient|À prendre en compte|Fournisseurs précédents|Fournisseurs suivants|Quel est le bonus de bienvenue du casino Coolzino ?|Comment fonctionnent les tours gratuits ?|Quel est le bonus sportif de Coolzino ?|Comment fonctionne le cashback hebdomadaire ?|Quels moyens de paiement Coolzino indique-t-il ?|Quel est le retrait minimum et quel est son délai ?|Coolzino vérifie-t-il l’identité ?|Coolzino a-t-il une licence ?',
  hi: 'जाँच की तारीख|वेलकम ऑफ़र|वेजरिंग|मुफ़्त स्पिन|लाइव कैसीनो|जमा|बोनस दर|अधिकतम|शर्तें|कैशबैक|साप्ताहिक सीमा|सत्यापन|क्षेत्रीय प्रतिबंध|खिलाड़ियों की सुरक्षा|ज़िम्मेदार गेमिंग|फायदे|नुकसान|किसके लिए उपयुक्त|ध्यान देने की बातें|पिछले प्रदाता|अगले प्रदाता|Coolzino का कैसीनो वेलकम बोनस क्या है?|मुफ़्त स्पिन कैसे मिलते हैं?|Coolzino का खेल बोनस क्या है?|साप्ताहिक कैशबैक कैसे मिलता है?|Coolzino कौन से भुगतान तरीके दिखाता है?|न्यूनतम निकासी कितनी है और कितना समय लगता है?|क्या Coolzino पहचान की जाँच करता है?|क्या Coolzino के पास लाइसेंस है?',
  fi: 'Tarkistettu|Tervetulotarjous|Kierrätys|Ilmaiskierrokset|Livekasino|Talletus|Bonusprosentti|Enimmäismäärä|Ehdot|Tappiohyvitys|Viikkoraja|Tilin vahvistus|Maarajoitukset|Pelaajansuoja|Vastuullinen pelaaminen|Plussat|Miinukset|Kenelle sopii|Mitä kannattaa huomioida|Edelliset pelintarjoajat|Seuraavat pelintarjoajat|Mikä on Coolzinon kasinon tervetulobonus?|Miten ilmaiskierrokset toimivat?|Mikä on Coolzinon vedonlyöntibonus?|Miten viikoittainen tappiohyvitys toimii?|Mitä maksutapoja Coolzino ilmoittaa?|Mikä on kotiutuksen vähimmäismäärä ja käsittelyaika?|Vaatiiko Coolzino henkilöllisyyden vahvistamista?|Onko Coolzinolla lisenssi?',
};

function save(file, output) {
  if (readFileSync(file, 'utf8') === output) return;
  if (!check) return writeFileSync(file, output);
  console.error(`Stale Coolzino output: ${file}`);
  process.exitCode = 1;
}

if (!picture || !brand?.hasDetailPage || brand.reviewComingSoon || providers.length < 8) {
  throw new Error('Incomplete Coolzino brand data');
}
for (const [i, lang] of locales.entries()) {
  const c = Object.fromEntries(fields.map((key, j) => [key, copy[lang][j]]));
  const [
    reviewed, welcome, wagering, spins, live, deposit, match, cap, terms, cashback, weekCap,
    verification, _markets, protection, safer, pros, cons, best, caution, previous, next, ...questions
  ] = words[lang].split('|');
  if (copy[lang].length !== fields.length || questions.length !== 8) throw new Error(`Incomplete review: ${lang}`);
  const template = readFileSync(prefix(lang) + 'brands/coldbet/index.html', 'utf8');
  const take = re => {
    const found = template.match(re);
    if (!found) throw new Error(`Missing localized shell (${lang}): ${re}`);
    return found[1];
  };
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const number = new Intl.NumberFormat(locale).format;
  const eur = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format;
  const percent = rate => new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 }).format(rate / 100);
  const date = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(updated));
  const url = origin + route(lang);
  const imageAlt = `Coolzino — ${label('overview')}`;
  const paragraph = value => `<p class="section-intro">${esc(value)}</p>`;
  const section = (id, key, body, tab = false) =>
    `<section class="container" id="${id}" data-review-section="${key}"${tab ? ' data-review-details' : ''}><h2 class="title">${esc(label(key))}</h2>${body}</section>`;
  const cta = take(/(<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>)/).replace(/href="[^"]+"/, `href="${esc(brand.urlCasino)}"`);
  const hero = take(/(<section class="hero container">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*class="brand-logo"[^>]*>/, `<img class="brand-logo" src="/${brand.image}" alt="Coolzino" width="640" height="320" decoding="async" />`)
    .replace(/<h1>[^<]+<\/h1>/, `<h1>${esc(c.title)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(c.overview)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, `<p class="hero-subtitle editorial-meta">${esc(reviewed)}: <time datetime="${updated}">${esc(date)}</time></p>`)
    .replace(ctaPattern, () => cta);
  const facts = [
    [welcome, `${eur(1500)} + ${number(250)}`], [wagering, '35×'], [live, 'Evolution · Pragmatic Play Live'],
    [label('sports'), eur(450)], [label('cashier'), `${eur(50)} · 3×`], [cashback, `${percent(5)}–${percent(12.5)}`],
  ];
  let fact = 0;
  const highlights = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*>/, `<img src="${esc(picture)}" alt="${esc(imageAlt)}" width="1600" height="900" loading="eager" fetchpriority="high" decoding="async" />`)
    .replace(/(<strong>)[^<]*(<\/strong>\s*<span>)[\s\S]*?(<\/span>)/g,
      (_, start, mid, end) => start + esc(facts[fact][0]) + mid + esc(facts[fact++][1]) + end);
  if (fact !== facts.length) throw new Error(`Invalid highlights: ${lang}`);
  const geo = take(/(<section class="container">\s*<div class="brand-countries">[\s\S]*?<\/section>)/)
    .replace(/(<h2 class="title">)[^<]+/, (_, opening) => opening + esc(partnerMarkets[i]))
    .replace(/<\/div>\s*<\/section>$/, paragraph(c.markets) + '</div></section>');
  const banking = take(/(<section class="container">\s*<div class="brand-payments">[\s\S]*?<\/section>)/);
  const final = take(/(<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>)/)
    .replaceAll('ColdBet', 'Coolzino').replace(ctaPattern, () => cta);
  const footer = take(/(<section class="all-countries">[\s\S]*$)/)
    .replace(/\/scripts\/main\.js\?v=[^"]+/, '/scripts/main.js?v=20261123-coolzino').trimEnd();
  const safety = `<p class="section-intro"><a class="cta-secondary editorial-resource-link" href="/${prefix(lang)}responsible-gambling/">${siteIconMarkup('safety', 'site-icon site-icon--inline', 18)}<span>${esc(safer)}</span></a></p>`;
  const casino = reviewTable([deposit, `${match} · ${cap}`, spins], casinoTiers.map(([n, rate, max, count]) => [number(n), `${percent(rate)} · ${eur(max)}`, number(count)]));
  const sport = reviewTable([deposit, match, cap], sportsTiers.map(([n, rate, max]) => [number(n), percent(rate), eur(max)]));
  const rewards = reviewTable([cashback, weekCap, wagering], cashbackTiers.map(([rate, max]) => [percent(rate), eur(max), '1×']));
  const answers = [c.offer, c.spins, c.sports + ' ' + c.sportsRules, c.cashback + ' ' + c.cashbackRules, c.methods, c.withdrawals, c.verification, c.license];
  const faq = questions.map((question, j) => [question, answers[j]]);
  const org = { '@id': origin + '/#organization' };
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', ...org, name: 'SpinCresta', url: origin + '/' },
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, breadcrumb: { '@id': url + '#breadcrumb' } },
    { '@type': 'Article', '@id': url + '#article', headline: c.title, description: c.description, inLanguage: lang, image: [picture], mainEntityOfPage: { '@id': url }, author: org, publisher: org, dateModified: updated },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SpinCresta', item: origin + '/' + prefix(lang) },
      { '@type': 'ListItem', position: 2, name: 'Coolzino', item: url },
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
  <body data-brand="${slug}" data-language="${lang}" data-review-market-label="${esc(partnerMarkets[i])}">
    ${take(/(<header class="header">[\s\S]*?<\/header>)/)}
    ${hero}
    ${highlights}
    ${geo}
    ${banking}
    <main class="content-review">
      ${section('coolzino-summary', 'summary', reviewTable([label('summary'), cap, terms], [
        [welcome, `${eur(1500)} + ${number(250)} ${spins.toLocaleLowerCase(locale)}`, `${eur(15)} · 35×`],
        [label('sports'), eur(450), `${eur(20)} · 5×`],
        [label('cashier'), eur(50), '3×'],
      ]))}
      ${section('coolzino-bonus', 'bonuses', paragraph(c.offer) + casino + reviewCards([[wagering, c.bonusRules], [spins, c.spins]]), true)}
      ${section('coolzino-games', 'games', paragraph(c.games) + reviewCards([[live, c.live]]), true)}
      ${section('coolzino-sports', 'sports', paragraph(c.sports) + sport + paragraph(c.sportsRules), true)}
      ${section('coolzino-cashback', 'rewards', paragraph(c.cashback) + rewards + paragraph(c.cashbackRules), true)}
      ${section('coolzino-cashier', 'cashier', paragraph(c.methods) + reviewCards([[label('cashier'), c.withdrawals], [verification, c.verification]]), true)}
      ${section('coolzino-trust', 'trust', reviewCards([[label('trust'), c.license], [protection, c.safer]]) + safety, true)}
      ${reviewProviderStrip({ id: 'coolzino-providers', heading: label('providers'), providers, previous, next })}
      ${section('coolzino-pros-cons', 'pros', reviewCards(comparisons[lang].map((items, j) => [[pros, cons][j], items.split('|')]), { comparison: true }))}
      ${section('coolzino-best-for', 'suitability', reviewCards([[best, c.best], [caution, c.caution]]))}
      <section class="container" id="faq" data-review-section="faq"><h2 class="title">${esc(label('faq'))}</h2><div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>
      ${final}
    </main>
    ${footer}
`;
  save(prefix(lang) + 'brands/coolzino/index.html', syncDefaultTheme(syncUnavailableBrandMarkup(page, brand, lang)));
}

const sitemap = readFileSync('sitemap.xml', 'utf8');
let entries = 0;
const result = sitemap.replace(/(<loc>https:\/\/spincresta\.com\/(?:[a-z]{2}\/)?brands\/coolzino\/<\/loc>\s*<lastmod>)[^<]+(<\/lastmod>)/g,
  (_, open, close) => { entries++; return open + updated + close; });
if (entries !== locales.length) throw new Error(`Expected ${locales.length} Coolzino canonical URLs in the sitemap, found ${entries}`);
save('sitemap.xml', result);
