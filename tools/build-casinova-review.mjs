import fs from 'node:fs';

// Public Casinova pages and terms reviewed on 2026-09-13.
// Country availability stays authoritative in scripts/brands.js.
const file = 'brands/casinova/index.html';
const base = fs.readFileSync('brands/silverplay/index.html', 'utf8')
  .replaceAll('SilverPlay', 'Casinova')
  .replaceAll('silverplay', 'casinova');
const title = 'Casinova Review 2026: €2,000 Bonus, KYC & Payouts';
const description = 'Casinova review: €2,000 + 350 free spins, 40x deposit-plus-bonus wagering, sports bonus, payments, KYC, VIP withdrawal limits and player safety.';
const url = 'https://spincresta.com/brands/casinova/';
const capture = 'https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1789301229/spincresta/brands/casinova/main-page/casinova-page_yp7nkk';
const offer = 'https://armadaapp.media-412.com/click?pid=3862&amp;offer_id=124845';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const section = (id, heading, body) => `<section class="container" id="${id}"><h2 class="title">${esc(heading)}</h2>\n${body}\n</section>`;
const table = (heads, rows) => `<table><thead><tr>${heads.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('\n')}</tbody></table>`;
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([heading, text]) => `<div class="feature-card glass-card"><strong>${esc(heading)}</strong><span>${text}</span></div>`).join('\n')}</div>`;

const faq = [
  ['What is the Casinova casino welcome bonus?', 'The reviewed EUR package advertises up to €2,000 and 350 free spins across four deposits: 100% up to €500 plus 200 spins, 75% up to €500, 50% up to €500 plus 50 spins, and 50% up to €500 plus 100 spins. A €20 minimum deposit and regional eligibility apply.'],
  ['What wagering applies to the Casinova casino bonus?', 'Each stage requires 40x the deposit plus bonus within 10 days. The maximum qualifying bet is €100 or the listed currency equivalent, and bonus-derived funds are capped at 10x the awarded bonus. Skrill and Neteller deposits are excluded.'],
  ['Does Casinova have a sports welcome bonus?', 'Yes. The public sports promotion starts at 100% up to €100, with higher published caps in some countries, and a €20 minimum deposit. The deposit must first be wagered once at odds of at least 1.50, followed by 5x or 6x wagering of the deposit plus bonus depending on location.'],
  ['How long do Casinova withdrawals take?', 'The terms say the finance team handles eligible withdrawal requests within three business days after the request or the last paid withdrawal, once verification and other checks are complete. This is an internal handling period, not a guaranteed arrival time. Payment-network delays may follow.'],
  ['Which payment methods does Casinova show?', 'The reviewed Germany and EUR cashier displayed cards, bank transfer, MiFinity and several cryptocurrencies, including Bitcoin, Ethereum, Litecoin, Tether, Tron, Cardano and Dogecoin. Revolut appeared for withdrawals. Methods and limits can change by country, currency and account.'],
  ['Does Casinova require KYC?', 'Yes. Casinova may request identity, address, payment ownership and source-of-funds documents before or after deposits and withdrawals. The terms allow 30 days to supply requested documents and say a complete response is usually reviewed within 10 days, with extra checks possible.'],
  ['Is a Casinova licence independently verified here?', 'No. The reviewed public terms do not identify an operating company or licence number. SpinCresta therefore does not describe Casinova as locally licensed or regulator-approved. Players should verify the legal operator and applicable authorisation for their country before depositing.'],
  ['How can I contact Casinova or request self-exclusion?', 'The public site lists support@casinova.com and 24/7 live chat. The terms direct complaints to complaints@casinova.com and self-exclusion requests to support. Self-exclusion is not described as an instant self-service control, so anyone needing an immediate block should also use independent device, bank or national blocking tools where available.'],
];

const features = [
  ['Casino and sportsbook', 'Slots, live tables, jackpots, sports, live betting and virtual sports sit under one account with separate navigation.'],
  ['Four-deposit casino package', 'The headline €2,000 + 350 free spins is split across four deposits. Each stage has its own value and conditions.'],
  ['Live casino and jackpots', 'Roulette, blackjack, baccarat, poker and game-show categories complement the main slot lobby and jackpot pages.'],
  ['Sports welcome offer', 'A separate first-deposit sports promotion starts at 100% up to €100, with country-specific caps and wagering.'],
  ['Published cashier limits', 'The cashier shows methods and transaction ranges, while the terms explain rollover, fees and pending-withdrawal limits.'],
  ['Five VIP levels', 'Published VIP tiers add personalised offers, higher withdrawal limits, cashback and, at upper levels, a personal manager.'],
];

const main = [
  section('bonuses', 'Casinova Casino Bonus: Four Deposits and 350 Free Spins', table(['Deposit', 'Bonus', 'Free spins', 'Release'], [
    ['1st', '100% up to €500', '200', '20 spins immediately, then 20 per day for 9 days'],
    ['2nd', '75% up to €500', '—', 'Second qualifying deposit'],
    ['3rd', '50% up to €500', '50', 'Third qualifying deposit'],
    ['4th', '50% up to €500', '100', 'Fourth qualifying deposit'],
  ])),
  section('casino-bonus-rules', 'Casino Bonus Rules & Wagering', table(['Rule', 'Published condition', 'Player takeaway'], [
    ['Minimum deposit', '€20 or the listed currency equivalent', 'Check the amount displayed for your account and country.'],
    ['Wagering', '40x deposit plus bonus within 10 days', 'Both the deposit and bonus increase the turnover target.'],
    ['Maximum bet', '€100 or the listed currency equivalent while wagering', 'A higher wager can invalidate the promotion.'],
    ['Maximum release', '10x the initially awarded bonus', 'Bonus-derived funds above the cap are not withdrawable.'],
    ['Free spins', 'Cash of Gods by ELA; claim within 24 hours after release', 'Game availability and spin value can vary by currency.'],
    ['Excluded deposits', 'Skrill and Neteller do not qualify', 'Choose an eligible method before activating the offer.'],
  ])),
  section('sports-bonus', 'Sports Welcome Bonus & Betting Rules', table(['Check', 'Published condition', 'What it means'], [
    ['Welcome offer', '100% up to €100; selected country caps are higher', 'Published caps include €200 for DE, NO, FI, CH and AT, and €150 for IT.'],
    ['Minimum deposit', '€20 or the listed currency equivalent', 'The offer is for new sports customers.'],
    ['First step', 'Wager the deposit once at odds of at least 1.50', 'The bonus is credited after this qualifying play.'],
    ['Wagering', '5x deposit plus bonus in DE, NO, FI, CH and AT; 6x elsewhere', 'Complete the requirement within 30 days.'],
    ['Qualifying odds', 'Singles at least 2.00; multis at least 1.50 per selection', 'Cash-out, system, free-bet, casino, live-casino and virtual bets do not count.'],
    ['Excluded deposits', 'Skrill and Neteller do not qualify', 'The maximum contribution per bet is €50 equivalent.'],
  ])),
  section('casino-lobby', 'Casino, Live Games, Jackpots & Sports', cards([
    ['Casino categories', 'The public lobby separates new, popular and exclusive games, slots, bonus buys, Megaways, instant games, roulette, blackjack and table games.'],
    ['Live casino', 'Live roulette, blackjack, baccarat, poker and game shows are listed. Table availability and limits can vary by country and provider.'],
    ['Jackpots and discovery', 'Hot-jackpot pages, challenges, tournaments and a shop sit alongside standard game categories. Promotional mechanics need their own terms review.'],
    ['Sports and virtual sports', 'The sportsbook covers football, American football, ice hockey, handball, golf and tennis, with live and virtual options shown separately.'],
  ])),
  section('cashier', 'Payments, Withdrawals & VIP Limits', table(['Check', 'Published information', 'Practical implication'], [
    ['Deposit methods shown', 'Visa, Mastercard, bank transfer, MiFinity and multiple cryptocurrencies', 'The reviewed Germany/EUR cashier showed €10 minimums for most methods; Bitcoin started at €30.'],
    ['Withdrawal methods shown', 'Cards, bank transfer, Revolut, MiFinity and cryptocurrencies', 'The reviewed cashier showed €10 minimums for cards and bank methods; crypto minimums varied.'],
    ['Deposit rollover', '1x deposit before withdrawal', 'If unmet, the terms allow cancellation of winnings and a 10% fee, or 15% for card and bank-transfer funding.'],
    ['Processing', 'Up to 3 business days after eligibility and checks are complete', 'This is not a guaranteed bank or wallet arrival time.'],
    ['Pending requests', 'Maximum three pending withdrawals', 'Further requests may wait until earlier ones are processed.'],
    ['VIP EUR limits', 'Level 1: €500 daily / €7,000 monthly; Level 5: €1,500 daily / €20,000 monthly', 'Currency-specific limits and account status apply.'],
    ['Inactive account', '€5 monthly administration fee after 180 days of inactivity', 'Close or reactivate an unused account before fees accumulate.'],
  ])),
  section('kyc', 'Registration, KYC & Country Checks', table(['Check', 'Published requirement', 'Before you register'], [
    ['Age and local law', '18+ and the legal gambling age in your jurisdiction', 'A listed market does not prove local authorisation.'],
    ['One-account rule', 'One account per person, household, address, phone, email and IP', 'Duplicate or linked accounts can be closed.'],
    ['Identity checks', 'ID, proof of residence, payment ownership/history and source of funds may be requested', 'Use accurate details and payment methods in your own name.'],
    ['Document deadline', 'Requested documents must be supplied within 30 days', 'A complete response is usually reviewed within 10 days, but extra checks can take longer.'],
    ['Payment destination', 'Withdrawals normally return through the same method where possible', 'The preferred method is not guaranteed.'],
    ['Country and provider checks', 'Registration, games and cashier access can vary by location and player profile', 'Never use a VPN or false identity details to bypass restrictions.'],
  ])),
  section('trust', 'Operator Transparency, Support & Mobile Access', cards([
    ['Operator details remain unclear', 'The reviewed public terms do not name the operating company or show a licence number. SpinCresta does not present the brand as locally licensed or regulator-approved.'],
    ['Support and complaints', 'The site advertises 24/7 live chat and support@casinova.com. Complaints can be sent to complaints@casinova.com; the terms target a response within 10 days, with longer review possible.'],
    ['Browser-based access', 'The responsive website provides casino and betting access on desktop and mobile. No official app-store listing was verified during this review.'],
    ['English terms prevail', 'The published rules state that the English version takes priority over translations. Recheck English terms before accepting a bonus or making a withdrawal.'],
  ])),
  section('responsible-gambling', 'Responsible Gambling & Player Safety', cards([
    ['Self-exclusion through support', 'The terms direct self-exclusion requests to support@casinova.com. They do not describe an instant self-service block.'],
    ['Account closure caveat', 'The terms distinguish ordinary account closure from self-exclusion and attach balance and pending-withdrawal conditions. Do not leave funds unresolved.'],
    ['Use independent blocks when needed', 'If you need to stop immediately, also use bank, device or national blocking tools available in your country while a support request is pending.'],
    ['18+ and limits', 'Gambling is not income and losses should never be chased. Set a time and spending limit before play and stop when it is reached.'],
  ])),
  section('best-for', 'Who Casinova Suits Best', cards([
    ['Casino and sports users', 'Suitable for adults who want slots, live tables, jackpots, sports and virtual sports under one login.'],
    ['Players who read bonus terms', 'The separate casino and sports packages suit users willing to compare wagering, expiry, excluded methods and qualifying odds.'],
    ['Crypto and card users', 'The reviewed cashier offered cards, bank transfer, MiFinity and several crypto networks, subject to country and account availability.'],
    ['Think twice if', 'Compare alternatives if you want low wagering, instant self-exclusion, independently verified payout speed or clearly published operator and licence details.'],
  ])),
  section('pros-cons', 'Casinova Pros & Cons', `<div class="features-grid premium-grid"><div class="feature-card glass-card"><strong>Pros</strong><span>- Casino, live casino, jackpots, sports and virtual sports in one account.</span><br /><span>- Detailed four-stage casino and separate sports promotions.</span><br /><span>- Cards, bank transfer, MiFinity and multiple cryptocurrencies shown.</span><br /><span>- Published VIP, KYC, complaint and withdrawal rules.</span></div><div class="feature-card glass-card"><strong>Cons</strong><span>- 40x deposit-plus-bonus casino wagering.</span><br /><span>- Rollover fees and country-specific cashier restrictions.</span><br /><span>- No independently verified payout test.</span><br /><span>- Public terms do not identify the operator or licence number.</span></div></div>`),
  section('faq', 'Casinova FAQ', `<div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n')}</div>`),
  `<section class="container"><div class="final-cta-glass"><h2 class="title">Ready to Try Casinova?</h2><div class="view-all-wrapper"><a href="${offer}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">Play Now</a></div></div></section>`,
].join('\n');

const intro = 'Casinova combines a broad casino lobby, live dealer tables, jackpots, sportsbook and virtual sports. This review checks the current four-deposit casino package, sports bonus, payment and withdrawal rules, KYC requirements and transparency limits before you deposit.';
const header = base.match(/<header class="header">[\s\S]*?<\/header>/)[0];
const footer = base.slice(base.indexOf('<footer class="footer">')).replace(/<\/body>[\s\S]*$/, '</body>\n</html>\n');
let head = base.slice(0, base.indexOf('<body'));
head = head.replace(/<meta name="brand-snapshot-intro"[^>]*>\s*/g, '');
head = head.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
head = head.replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*/g, `$1${esc(description)}`);
head = head.replace(/(<meta\s+(?:name|property)="(?:og:title|twitter:title)"\s+content=")[^"]*/g, `$1${esc(title)}`);
head = head.replace(/(<meta\s+(?:name|property)="(?:og:image|twitter:image)"\s+content=")[^"]*/g, `$1${capture}`);
const graph = [
  {'@type': 'Organization', '@id': 'https://spincresta.com/#organization', name: 'SpinCresta', url: 'https://spincresta.com/'},
  {'@type': 'WebSite', '@id': 'https://spincresta.com/#website', name: 'SpinCresta', url: 'https://spincresta.com/'},
  {'@type': 'WebPage', '@id': `${url}#webpage`, url, name: title, description, inLanguage: 'en', isPartOf: {'@id': 'https://spincresta.com/#website'}, breadcrumb: {'@id': `${url}#breadcrumb`}, mainEntity: {'@id': `${url}#article`}},
  {'@type': 'Article', '@id': `${url}#article`, headline: title, description, image: capture, datePublished: '2026-09-13', dateModified: '2026-09-13', inLanguage: 'en', author: {'@id': 'https://spincresta.com/#organization'}, publisher: {'@id': 'https://spincresta.com/#organization'}, mainEntityOfPage: {'@id': `${url}#webpage`}, about: {'@type': 'Thing', name: 'Casinova'}},
  {'@type': 'BreadcrumbList', '@id': `${url}#breadcrumb`, itemListElement: [{name: 'Home', item: 'https://spincresta.com/'}, {name: 'Casino Reviews', item: 'https://spincresta.com/casinos-and-betting/'}, {name: 'Casinova Review', item: url}].map((item, index) => ({'@type': 'ListItem', position: index + 1, ...item}))},
  {'@type': 'FAQPage', '@id': `${url}#faq`, mainEntity: faq.map(([q, a]) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a}}))},
];
head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify({'@context': 'https://schema.org', '@graph': graph})}</script>`);
head = head.replace('</head>', '<meta name="brand-snapshot-intro" content="Categories observed in the public Casinova navigation. Game visibility does not establish eligibility in your country." />\n</head>');

const html = `${head}<body data-brand="casinova">\n${header}
<section class="hero container"><div class="hero-content glass-card"><div class="brand-logo-container hero-logo"><img class="brand-logo" src="/images/casinova.svg" alt="Casinova logo" width="640" height="320" loading="eager" decoding="async" /></div><h1>Casinova Casino &amp; Sportsbook Review</h1><p class="hero-subtitle">${intro}</p><p class="hero-subtitle editorial-meta">Reviewed: 13 September 2026. Public-site and terms review by SpinCresta; no deposit or payout test. Offers, limits and eligibility can change.</p><div class="hero-cta-wrapper"><a href="${offer}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">Play Now</a></div></div></section>
<section class="container features-section glass-section" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">Why Players Choose Casinova</h2><button class="brand-why-media" type="button" aria-expanded="false" aria-controls="brand-why-section" aria-label="Expand casino screenshot"><img src="${capture}" alt="Casinova homepage with casino, live betting and promotion navigation" width="3024" height="1568" loading="eager" fetchpriority="high" decoding="async" /></button></div><div class="features-grid premium-grid">${features.map(([heading, text], index) => `<div class="feature-card glass-card"><div class="icon-placeholder">0${index + 1}</div><strong>${heading}</strong><span>${text}</span></div>`).join('\n')}</div></section>
<section class="container"><div class="brand-countries"><h2 class="title">Available Countries</h2><div class="countries-container" id="brand-countries"></div></div></section>
<section class="container"><div class="brand-payments"><h2 class="title">Payment Methods</h2><div class="payments-container" id="brand-payments"></div></div></section>
<main class="content-review">${main}</main>
<section class="all-countries"><div class="container"><h2 class="title">Online Casinos by Country</h2><div class="countries-cloud"></div></div></section>
${footer}`;

fs.writeFileSync(file, html);
console.log('Built full Casinova English review.');
