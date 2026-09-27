import fs from 'node:fs';

// Goldenbet public website, promotion pages and general terms reviewed on 2026-09-27.
// UK licensing was checked against the UK Gambling Commission public register.
// Australian legality was checked against ACMA's Interactive Gambling Act guidance
// and licensed interactive wagering register. These are editorial reviews, not offers.

const base = fs.readFileSync('brands/onlywin/index.html', 'utf8');
const screenshot = 'https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1790519366/spincresta/brands/goldenbet/main-page/goldenbet-page_ppsutu';
const logo = '/images/goldenbet.svg';
const reviewed = '27 September 2026';
const affiliateUrls = {
  'goldenbet-uk': 'https://armadaapp.media-412.com/click?pid=3862&amp;offer_id=124461',
  'goldenbet-au': 'https://armadaapp.media-412.com/click?pid=3862&amp;offer_id=124462',
};

const esc = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('"', '&quot;');

const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(head => `<th scope="col">${esc(head)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`).join('\n')}</tbody></table></div>`;
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([heading, text]) => `<article class="feature-card glass-card"><h3>${esc(heading)}</h3><p>${text}</p></article>`).join('\n')}</div>`;
const section = (id, title, content, intro = '') => `<section class="container" id="${id}"><h2 class="title">${esc(title)}</h2>${intro ? `<p class="section-intro">${intro}</p>` : ''}\n${content}\n</section>`;

const sharedFeatures = [
  ['Casino and sportsbook', 'Goldenbet combines slots, live casino, instant games, racing, pre-match sports and in-play betting under one account.'],
  ['Published promotion rules', 'The public promotions hub describes deposit, cashback, free-spin and free-bet campaigns, but every campaign has separate eligibility and cashout limits.'],
  ['Casino discovery tools', 'New games, providers and lobby categories make the catalogue easier to scan than a single unfiltered game wall.'],
  ['Cards and alternative payments', 'The terms mention Visa, Mastercard and alternative payment routes, while the live cashier decides which methods appear for an account.'],
  ['KYC before withdrawals', 'Identity, address and payment-ownership checks can be requested, and withdrawals can remain pending until verification is complete.'],
  ['24/7 support and safer-play tools', 'Goldenbet publishes live chat, email support, account limits, time-outs and self-exclusion routes, although local protections still matter.'],
];

const sharedGameSections = market => [
  section('goldenbet-games', 'Goldenbet Casino, Live Games & New Releases', cards([
    ['Slots and new games', 'The public lobby separates new releases from the wider slots catalogue. The current SpinCresta capture includes 3 Fortune Nuts, Bison Fortune Coins, Coin Storm, Gold Mine Express, Joker Coins Unlimited Fortune and Lucky Cerol 500.'],
    ['Live casino', 'Goldenbet lists live casino separately from standard RNG games. Table limits, language and provider availability can change by location.'],
    ['Instant and table games', 'Instant games, roulette, blackjack, baccarat, poker and other table products sit alongside the main slot lobby. Bonus contribution may differ by game.'],
    ['Providers and search', 'Provider filters and search help players check whether a familiar studio or title is actually available before choosing a promotion.'],
  ]), 'The screenshot and New Games cards show the public lobby at the review date. They do not prove that real-money access is lawful or available in every country.'),
  section('goldenbet-sports', 'Sportsbook, Racing & In-Play Betting', table(
    ['Area', 'Public navigation', 'Important limitation'],
    [
      ['Pre-match sports', 'Football, tennis, basketball and other scheduled markets', 'Market depth and settlement rules can vary by event.'],
      ['In-play betting', 'Live events and changing odds', market.slug.endsWith('au') ? 'In-play online sports betting is prohibited for Australian customers.' : 'Confirm that the operator and product are authorised for players in Great Britain.'],
      ['Racing', 'Horse-racing events and promotions', 'Local wagering authorisation is still required.'],
      ['eSports and virtuals', 'Dedicated electronic and simulated event routes', 'Virtual products can be treated differently under local rules.'],
    ]
  )),
  section('goldenbet-payments', 'Payments, Withdrawals & KYC', table(
    ['Check', 'Published Goldenbet terms', 'What it means in practice'],
    [
      ['Accepted currencies', 'EUR, USD, CAD, BRL, NOK and AUD are listed', 'A listed currency is not proof that the service is licensed in that country.'],
      ['Minimum deposit', '€20 or currency equivalent', 'The cashier can set method-specific minimums and availability.'],
      ['Minimum withdrawal', '€20 or currency equivalent', 'Verification and the chosen payment rail can affect processing.'],
      ['Deposit turnover', 'Deposits generally require 1x wagering before withdrawal', 'Withdrawing unused deposit funds may trigger checks or restrictions.'],
      ['Published withdrawal caps', '€7,500 per seven days and €15,000 per 30 days unless an offer or VIP rule states otherwise', 'Large balances may require several withdrawal cycles.'],
      ['Internal handling', 'Bank-transfer withdrawals are described as processed within three banking days', 'This is not a guaranteed arrival time and does not include KYC or bank delays.'],
      ['Verification', 'Identity, address, payment ownership and source-of-funds evidence may be requested', 'Use accurate personal details and payment methods in your own name.'],
    ]
  )),
  section('goldenbet-support', 'Support & Responsible Gambling', cards([
    ['Live chat and email', 'Goldenbet publishes 24/7 live chat and support@goldenbet.email for account, bonus, payment and verification questions.'],
    ['Account limits', 'The responsible-gambling page describes deposit and play controls. Set limits before funding an account, not after losses.'],
    ['Time-out and self-exclusion', 'Published tools include temporary breaks and self-exclusion periods from six months to five years. National schemes only cover locally licensed operators.'],
    ['18+ only', 'Goldenbet states that minors may not gamble. Local minimum-age and identity rules still apply.'],
  ])),
];

const markets = {
  uk: {
    slug: 'goldenbet-uk',
    title: 'Goldenbet UK Review 2026 | UKGC Status & Safety',
    description: 'Goldenbet UK review for 2026: UK access, UKGC licence checks, casino and sportsbook products, bonus rules, payments, withdrawals, KYC and safer alternatives.',
    keywords: 'Goldenbet UK review, Goldenbet UKGC licence, is Goldenbet legal in UK, Goldenbet bonus, Goldenbet withdrawal, Goldenbet casino review',
    h1: 'Goldenbet UK Review',
    intro: 'Goldenbet combines casino games, live tables, racing and sports betting in one account. This UK review checks the current product, public bonus rules, payments, withdrawals and KYC, while explaining the licensing and access details every British player should verify before registering.',
    snapshot: 'Goldenbet UK product review covering casino, sportsbook, promotions, payments, withdrawals, KYC and the unverified UKGC licensing status.',
    whyTitle: 'Why Players Choose Goldenbet — and What to Check First',
    statusTitle: 'Goldenbet UK Verdict & Key Checks',
    statusIntro: 'Goldenbet offers a substantial casino and sportsbook, but British players should independently confirm current access, licence coverage and local protections before creating or funding an account.',
    statusRows: [
      ['UKGC licence', 'No active Goldenbet or goldenbet.com entry verified in the UKGC public register on 27 September 2026', 'Do not treat Goldenbet as UK-licensed.'],
      ['Great Britain access', 'Independent access checks report that UK visitors are redirected or blocked', 'Availability can change, but blocked access is not a reason to use a VPN.'],
      ['GAMSTOP', 'No verified participation', 'GAMSTOP protection applies to UK-licensed online operators.'],
      ['ADR and UK complaints route', 'No UK-approved ADR or UK licence account verified', 'UK players may not have the normal UKGC complaint safeguards.'],
      ['SpinCresta view', 'Feature-rich product with important UK regulatory checks', 'Confirm eligibility and current local terms before registering.'],
    ],
    regulationTitle: 'UKGC Licence, UK Access & Player Protection',
    regulationCards: [
      ['Licence check', 'The UK Gambling Commission register is the primary place to verify a remote operator, trading name and domain. SpinCresta found no active Goldenbet or goldenbet.com match during this review.'],
      ['No VPN workaround', 'If the site blocks Great Britain, do not bypass the restriction or provide false residence information. That can also create account and withdrawal problems.'],
      ['UK protections matter', 'UK-licensed operators must follow rules on identity checks, safer gambling, complaints, marketing and participation in the national self-exclusion scheme.'],
      ['What to choose instead', 'Use a casino or sportsbook whose exact domain appears in the UKGC register, with clear operator details, GAMSTOP coverage and a published ADR route.'],
    ],
    promoTitle: 'Goldenbet Bonuses: Public Terms, Not a UK Offer',
    promoIntro: 'Goldenbet publishes global promotions, but none should be treated as available to Great Britain without legal UK access and UK-specific terms.',
    promoRows: [
      ['200 free spins campaign', 'Deposit 50 and use promo code GOLDEN for 100 spins on Thursday and 100 on Friday', 'Public campaign only; availability and eligible currency must be confirmed.'],
      ['Sports cashback free bet', '20% of qualifying losing accumulator stakes, up to €500', 'Published conditions include minimum stake, selections and odds. Not a verified UK offer.'],
      ['10% casino cashback', 'Up to €500 under the public rules', 'Published rules include a qualifying deposit, 45x wagering and a maximum cashout.'],
      ['General free-spin/free-bet rules', 'Often 10x wagering within seven days and a €100-equivalent max cashout unless campaign terms override', 'The specific promotion page always takes priority.'],
    ],
    bestForTitle: 'Who Should Consider Goldenbet in the UK?',
    bestFor: [
      ['Players comparing casino and sports', 'Goldenbet may appeal to adults who want slots, live casino, racing and sports betting in one account and are prepared to verify current UK eligibility first.'],
      ['Researchers and comparison users', 'The page remains useful for understanding the product, bonus mechanics and withdrawal terms without promoting registration or deposits.'],
    ],
    pros: [
      'Broad casino, live casino, sports, racing, esports and instant-game navigation.',
      'Public general terms, promotion conditions and responsible-gambling information.',
      'AUD is listed among supported currencies and the cashier rules publish minimums and withdrawal caps.',
    ],
    cons: [
      'No active UKGC licence or goldenbet.com domain entry verified.',
      'No verified GAMSTOP or UK-approved ADR protection.',
      'Great Britain access appears restricted.',
      'Bonus cashout and wagering rules can materially reduce the practical promotional value.',
    ],
    faq: [
      ['Is Goldenbet legal in the UK?', 'SpinCresta could not verify an active UK Gambling Commission licence or goldenbet.com domain entry in the UKGC public register on 27 September 2026. British players should check the current operator and exact domain in the official register before registering.'],
      ['Can UK players open Goldenbet?', 'Independent access checks indicate Great Britain visitors may be redirected or blocked. Do not use a VPN or false residence details to bypass a restriction.'],
      ['Is Goldenbet on GAMSTOP?', 'We could not verify Goldenbet as a GAMSTOP participant. GAMSTOP applies to online operators licensed by the UK Gambling Commission.'],
      ['What does Goldenbet offer?', 'The public site combines slots, live casino, instant games, racing, esports, pre-match sports and in-play betting, with separate promotion and responsible-gambling pages.'],
      ['What are Goldenbet withdrawal limits?', 'The reviewed general terms list a €20-equivalent minimum and maximum withdrawals of €7,500 per seven days and €15,000 per 30 days, unless a promotion or VIP rule states otherwise.'],
      ['Does Goldenbet require KYC?', 'Yes. The terms allow identity, address, payment-ownership and source-of-funds checks, and withdrawals can be held while verification is completed.'],
      ['What is a safer UK alternative?', 'Choose an operator whose exact domain appears in the UKGC public register and that clearly provides GAMSTOP coverage, UK complaint information and an approved ADR route.'],
    ],
  },
  au: {
    slug: 'goldenbet-au',
    title: 'Goldenbet Australia Review 2026 | ACMA Status & Safety',
    description: 'Goldenbet Australia review for 2026: ACMA legality, casino and sportsbook access, AUD bonuses, payment rules, withdrawals, KYC and safer local alternatives.',
    keywords: 'Goldenbet Australia review, Goldenbet AU, is Goldenbet legal in Australia, Goldenbet bonus Australia, Goldenbet withdrawal, Goldenbet casino review',
    h1: 'Goldenbet Australia Review',
    intro: 'Goldenbet publishes AUD promotions and combines casino, racing and sports betting in one account. This Australia review checks the current product, AUD offers, payments, withdrawals and KYC, while clearly explaining the ACMA rules and eligibility checks players should understand first.',
    snapshot: 'Goldenbet Australia product review covering AUD promotions, casino and sportsbook products, payments, withdrawals, KYC and ACMA legality.',
    whyTitle: 'Why Players Choose Goldenbet — and What to Check First',
    statusTitle: 'Goldenbet Australia Verdict & Key Checks',
    statusIntro: 'Goldenbet has Australia-specific promotions and AUD support, but those features do not establish local authorisation. Players should understand the ACMA rules and verify current eligibility before registering.',
    statusRows: [
      ['Online casino', 'ACMA lists online casinos as prohibited interactive gambling services', 'The casino product should not be offered to people in Australia.'],
      ['Sports betting', 'Goldenbet was not verified in ACMA’s register of licensed interactive wagering providers', 'Do not treat the sportsbook as Australian-licensed.'],
      ['In-play betting', 'ACMA lists online in-play sports betting as a banned service', 'Goldenbet’s in-play product is not appropriate for Australian customers.'],
      ['BetStop', 'No verified participation', 'BetStop covers Australian-licensed online and phone wagering providers.'],
      ['SpinCresta view', 'Feature-rich offshore product with major Australian regulatory limitations', 'Check ACMA guidance and current account eligibility before registering.'],
    ],
    regulationTitle: 'ACMA Rules, Australian Access & BetStop',
    regulationCards: [
      ['Online casinos are prohibited', 'ACMA states that online casino services are banned under the Interactive Gambling Act, including slots, roulette, blackjack and similar real-money products.'],
      ['Wagering needs a local licence', 'An online sports betting service must appear in ACMA’s register of licensed interactive wagering providers. Goldenbet was not verified there.'],
      ['In-play betting is banned online', 'Goldenbet promotes in-play markets, but online in-play sports betting is one of the services ACMA identifies as prohibited.'],
      ['BetStop has a defined scope', 'Australia’s national self-exclusion register applies to licensed online and telephone wagering providers, not an unverified offshore casino.'],
    ],
    promoTitle: 'Goldenbet Australia Bonuses & AUD Promotion Terms',
    promoIntro: 'These public AU promotions are documented for accuracy. A localized offer does not override the Interactive Gambling Act or establish an Australian licence, so confirm current eligibility before opting in.',
    promoRows: [
      ['First three deposits', 'A$30 + A$20 + A$50 cash gifts after matching deposits, up to A$100 total', 'The public AU page states 1x wagering on the combined deposit and gift; only one reward is active at a time.'],
      ['Weekly 300 free spins', 'Deposit A$50 with code GOLDENBET for 100 spins on Monday, Wednesday and Friday', 'Public terms name Hot Chilli Bells and a maximum cashout of A$1,000.'],
      ['Sports cashback free bet', '20% of qualifying losing accumulator stakes', 'Minimum stake, selection count and odds rules apply; legal Australian wagering status is still required.'],
      ['10% casino cashback', 'Up to A$500 under the localized terms', 'Published conditions include qualification, 45x wagering, expiry and maximum cashout rules.'],
    ],
    bestForTitle: 'Who Should Consider Goldenbet in Australia?',
    bestFor: [
      ['Players comparing casino and sports', 'Goldenbet may appeal on product breadth and AUD promotions, but Australian customers must first consider ACMA’s online-casino prohibition and licensed-wagering register.'],
      ['Researchers and comparison users', 'This page explains the published AUD offers and product mechanics without linking Australians to registration or deposits.'],
    ],
    pros: [
      'Broad casino and sportsbook product with AUD-denominated public promotions.',
      'Transparent public terms for deposits, withdrawals, KYC and several recurring campaigns.',
      'Live chat, email support and published responsible-gambling controls.',
    ],
    cons: [
      'Online casino services are prohibited for people in Australia.',
      'Goldenbet was not verified in ACMA’s licensed interactive wagering register.',
      'No verified BetStop coverage.',
      'Localized AUD promotions may create a misleading impression of local authorisation.',
    ],
    faq: [
      ['Is Goldenbet legal in Australia?', 'ACMA states that online casinos are prohibited and that online sports wagering providers must hold an Australian state or territory licence. Goldenbet was not verified in ACMA’s licensed wagering register during this review, so players should check current eligibility before registering.'],
      ['Does Goldenbet accept Australian dollars?', 'Goldenbet’s general terms list AUD among accepted currencies, and the public AU promotions use Australian-dollar amounts. Currency support does not establish legal Australian access.'],
      ['What is the Goldenbet Australia welcome offer?', 'The public AU promotion describes A$100 in cash gifts across the first three matching deposits: A$30, A$20 and A$50. Check the live promotion page, account eligibility and local rules before opting in.'],
      ['Does Goldenbet offer free spins in Australia?', 'The public AU page advertises 300 weekly free spins after an A$50 deposit with code GOLDENBET, split across Monday, Wednesday and Friday. Terms and legality must be considered before any offer.'],
      ['Is Goldenbet on BetStop?', 'We could not verify Goldenbet as a BetStop-covered provider. BetStop applies to Australian-licensed online and phone wagering providers.'],
      ['What are Goldenbet withdrawal limits?', 'The reviewed general terms list a €20-equivalent minimum and maximum withdrawals of €7,500 per seven days and €15,000 per 30 days, unless promotion or VIP terms state otherwise.'],
      ['What is a safer Australian alternative?', 'Use ACMA’s register to choose a locally licensed wagering provider. Online casino services remain prohibited even when a site accepts AUD or shows Australia-specific promotions.'],
    ],
  },
};

const buildPage = market => {
  const url = `https://spincresta.com/brands/${market.slug}/`;
  const faqGraph = market.faq.map(([question, answer]) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {'@type': 'Answer', text: answer},
  }));
  const graph = [
    {'@type': 'Organization', '@id': 'https://spincresta.com/#organization', name: 'SpinCresta', url: 'https://spincresta.com/', logo: 'https://spincresta.com/favicon.png'},
    {'@type': 'WebSite', '@id': 'https://spincresta.com/#website', url: 'https://spincresta.com/', name: 'SpinCresta', publisher: {'@id': 'https://spincresta.com/#organization'}},
    {'@type': 'WebPage', '@id': `${url}#webpage`, url, name: market.title, description: market.description, inLanguage: 'en', isPartOf: {'@id': 'https://spincresta.com/#website'}, breadcrumb: {'@id': `${url}#breadcrumb`}, mainEntity: {'@id': `${url}#article`}},
    {'@type': 'Article', '@id': `${url}#article`, headline: market.title, description: market.description, image: screenshot, datePublished: '2026-09-27', dateModified: '2026-09-27', inLanguage: 'en', author: {'@id': 'https://spincresta.com/#organization'}, publisher: {'@id': 'https://spincresta.com/#organization'}, mainEntityOfPage: {'@id': `${url}#webpage`}, about: {'@type': 'Thing', name: `Goldenbet ${market.slug.endsWith('uk') ? 'UK' : 'Australia'}`}},
    {'@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: 'https://spincresta.com/'},
      {'@type': 'ListItem', position: 2, name: 'Casino Reviews', item: 'https://spincresta.com/casinos-and-betting/'},
      {'@type': 'ListItem', position: 3, name: market.h1, item: url},
    ]},
    {'@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faqGraph},
  ];

  let head = base.slice(0, base.indexOf('<body'));
  head = head.replace(/<meta name="brand-snapshot-intro"[^>]*>\s*/g, '');
  head = head.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(market.title)}</title>`);
  head = head.replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(market.description)}">`);
  head = head.replace(/<meta name="keywords" content="[^"]*">/, `<meta name="keywords" content="${esc(market.keywords)}">`);
  head = head.replace(/<meta name="robots" content="[^"]*">/, '<meta name="robots" content="index, follow, max-image-preview:large">');
  head = head.replace(/\/styles\.css\?v=[^"]+/, '/styles.css?v=20260927-faq-background-all-1');
  head = head.replaceAll('https://spincresta.com/brands/onlywin/', url);
  head = head.replaceAll('brands/onlywin/', `brands/${market.slug}/`);
  head = head.replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(market.title)}`);
  head = head.replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(market.description)}`);
  head = head.replace(/(<meta property="og:image" content=")[^"]*/, `$1${screenshot}`);
  head = head.replace(/(<meta name="twitter:title" content=")[^"]*/, `$1${esc(market.title)}`);
  head = head.replace(/(<meta name="twitter:description" content=")[^"]*/, `$1${esc(market.description)}`);
  head = head.replace(/(<meta name="twitter:image" content=")[^"]*/, `$1${screenshot}`);
  head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@graph': graph})}</script>`);
  head = head.replace('</head>', `  <meta name="brand-snapshot-intro" content="${esc(market.snapshot)}">\n</head>`);

  const header = base.match(/<header class="header">[\s\S]*?<\/header>/)[0];
  const footer = base
    .slice(base.indexOf('<footer class="footer">'))
    .replace(/\/scripts\/main\.js\?v=[^"]+/, '/scripts/main.js?v=20260927-faq-background-all-1')
    .replace(/<\/body>[\s\S]*$/, '</body>\n</html>\n');
  const features = sharedFeatures.map(([heading, text], index) => `<div class="feature-card glass-card"><div class="icon-placeholder">0${index + 1}</div><strong>${esc(heading)}</strong><span>${text}</span></div>`).join('\n');
  const status = section('goldenbet-verdict', market.statusTitle, table(['Check', 'Finding', 'SpinCresta view'], market.statusRows), market.statusIntro);
  const regulation = section('goldenbet-regulation', market.regulationTitle, cards(market.regulationCards));
  const promos = section('goldenbet-bonuses', market.promoTitle, table(['Offer', 'Public headline', 'Important check'], market.promoRows), market.promoIntro);
  const bestFor = section('goldenbet-best-for', market.bestForTitle, cards(market.bestFor));
  const prosCons = section('goldenbet-pros-cons', 'Goldenbet Pros & Cons', `<div class="features-grid premium-grid"><div class="feature-card glass-card"><strong>Pros</strong>${market.pros.map(item => `<span>- ${item}</span>`).join('<br />')}</div><div class="feature-card glass-card"><strong>Cons</strong>${market.cons.map(item => `<span>- ${item}</span>`).join('<br />')}</div></div>`);
  const faq = section('goldenbet-faq', 'Goldenbet FAQ', `<div class="timeline">${market.faq.map(([question, answer]) => `<h3>${esc(question)}</h3><p>${esc(answer)}</p>`).join('\n')}</div>`);

  return `${head}<body data-brand="${market.slug}">\n${header}
  <section class="hero container"><div class="hero-content glass-card">
    <div class="brand-logo-container hero-logo"><img class="brand-logo" src="${logo}" alt="Goldenbet logo" width="640" height="320" loading="eager" fetchpriority="high" decoding="async" /></div>
    <h1>${esc(market.h1)}</h1>
    <p class="hero-subtitle">${market.intro}</p>
    <p class="hero-subtitle editorial-meta">Editorially reviewed: ${reviewed}. Public-site, terms and regulator-register review; no deposit or payout test. Rules, access and promotions can change.</p>
    <div class="hero-cta-wrapper"><a href="${affiliateUrls[market.slug]}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">Play Now</a></div>
  </div></section>
  <section class="container features-section glass-section" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">Why Players Choose Goldenbet</h2><button class="brand-why-media" type="button" aria-expanded="false" aria-controls="brand-why-section" aria-label="Expand Goldenbet screenshot"><img src="${screenshot}" alt="Goldenbet casino and sportsbook homepage" width="3024" height="1576" loading="eager" fetchpriority="high" decoding="async" /></button></div><div class="features-grid premium-grid">${features}</div></section>
  <section class="container"><div class="brand-countries"><h2 class="title">Available Countries</h2><div class="countries-container" id="brand-countries"></div></div></section>
  <section class="container"><div class="brand-payments"><h2 class="title">Payment Methods</h2><div class="payments-container" id="brand-payments"></div></div></section>
  <main class="content-review">${[status, regulation, promos, ...sharedGameSections(market), bestFor, prosCons, faq, `<section class="container"><div class="final-cta-glass"><h2 class="title">Ready to Try Goldenbet?</h2><div class="view-all-wrapper"><a href="${affiliateUrls[market.slug]}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">Play Now</a></div></div></section>`].join('\n')}</main>
  <section class="all-countries"><div class="container"><h2 class="title">Online Casinos by Country</h2><div class="countries-cloud"></div></div></section>
${footer}`;
};

for (const market of Object.values(markets)) {
  const file = `brands/${market.slug}/index.html`;
  fs.writeFileSync(file, buildPage(market));
  console.log(`Built ${file}`);
}
