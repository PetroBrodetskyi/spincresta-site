import fs from 'node:fs';

// Source review: public SilverPlay pages inspected on 2026-09-06.
// Country availability is maintained in scripts/brands.js from the supplied geo sheet.
const file = 'brands/silverplay/index.html';
const old = fs.readFileSync(file, 'utf8');
const title = 'SilverPlay Review 2026: Bonus Codes, KYC & Withdrawals';
const description = 'SilverPlay review: 300% up to €2,500 + 250 spins, exact bonus codes, 35x wagering, KYC, withdrawals and payment methods including Visa, Skrill and Neteller.';
const url = 'https://spincresta.com/brands/silverplay/';
const capture = 'https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1788687510/spincresta/brands/silverplay/main-page/silverplay-page_nglrsy';
const offer = 'https://armadaapp.media-412.com/click?pid=3862&amp;offer_id=124850';
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
// Brand URLs are intentionally not exposed on SpinCresta. Only the tracked CTA may leave the site.
const source = (_path, label) => esc(label);
const section = (id, heading, body) => `<section class="container" id="${id}"><h2 class="title">${esc(heading)}</h2>\n${body}\n</section>`;
const table = (heads, rows) => `<table><thead><tr>${heads.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join('')}</tr>`).join('\n')}</tbody></table>`;
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([heading,text]) => `<div class="feature-card glass-card"><strong>${esc(heading)}</strong><span>${text}</span></div>`).join('\n')}</div>`;
const faq = [
  ['What is the SilverPlay welcome casino bonus?', 'The reviewed EUR promotion advertises a combined 300% up to €2,500 and 250 free spins across four deposits, not one payment. The first step is 100% up to €500 plus 50 spins with SILVER500. A qualifying deposit starts at €20; regional eligibility and currency terms must be checked.'],
  ['What wagering applies to the SilverPlay casino package?', 'The promotion requires 35x the deposit plus bonus within 21 days. Free spins expire after 7 days. The maximum conversion is 5x the awarded bonus, and the maximum stake is the lower of €12 or 5% of the bonus. Live casino does not contribute.'],
  ['Does SilverPlay have a sports welcome bonus?', 'The reviewed sports promotion is 100% up to €100 with code 100PLAY and a €10 minimum deposit. It requires 12x the bonus within 21 days and odds of at least 1.80; additional bet restrictions apply.'],
  ['How much can I withdraw from SilverPlay?', 'The published general limit is €5,000, or the currency equivalent, in any 7-day period unless another limit is stated. The terms also specify deposit rollover, potential fees and verification. We have not tested a real-money withdrawal or verified a fixed payout time.'],
  ['Does SilverPlay require KYC?', 'Yes. The public policy requires full KYC for a withdrawal of any amount, aggregate lifetime deposits above €5,000, or suspicious transactions. It lists photo ID, a selfie with ID, and a bank statement or utility bill. Checks can also be requested earlier.'],
  ['Where is SilverPlay listed as available?', 'The current SpinCresta availability list is shown on this page and covers selected markets in Europe, the Americas, Africa, the Middle East and Central Asia. Availability can still change, so players should confirm registration and payment options before depositing.'],
  ['How do I contact SilverPlay or request self-exclusion?', 'The contact page advertises email and live chat support around the clock at support@silverplay.com. The separate self-exclusion policy directs requests to customercare@silverplay.com and allows up to 10 business days to act. It is not described as an instant block.'],
];
const features = [
  ['Casino and sportsbook', 'Slots, live tables, sports, esports and virtual sports have separate navigation. The layout makes it easier to compare products without mixing their bonus rules.'],
  ['Four-deposit package', 'The EUR welcome promotion advertises a combined 300% across four explicit stages with separate codes. The €2,500 maximum is not a first-deposit payout.'],
  ['Dedicated live lobby', 'Roulette, blackjack, baccarat, poker and game-show categories are visible, including Crazy Time and Lightning Roulette.'],
  ['New games and providers', 'The lobby separates new releases, jackpot slots, bonus-buy games and provider spotlights. Provider availability may differ by location.'],
  ['Published withdrawal rules', 'A €5,000 rolling weekly limit, deposit rollover and possible fees are important caveats. We have not independently tested payout speed.'],
  ['Country-specific access', 'The listed markets come from SpinCresta’s current geo data. Registration, payment and verification availability can still differ by location.'],
];
const main = [
section('bonuses', 'SilverPlay Casino Bonus: Four Deposits and Exact Codes', `
${table(['Deposit', 'Bonus & free spins', 'Bonus code', 'Key terms'], [
['1st', '100% up to €500 + 50 FS', '<code translate="no">SILVER500</code>', '€20 minimum deposit'],
['2nd', '50% up to €500 + 50 FS', '<code translate="no">SILVER502</code>', 'Claim after the first stage'],
['3rd', '50% up to €500 + 50 FS', '<code translate="no">SILVER503</code>', 'Claim after the second stage'],
['4th', '100% up to €1,000 + 100 FS', '<code translate="no">SILVER1000</code>', 'Final stage of the package'],
])}`),
section('casino-bonus-rules', 'Casino Bonus Rules & Wagering', `
${table(['Rule', 'Current requirement', 'Player takeaway'], [
['Wagering', '35x deposit plus bonus within 21 days', 'A €20 deposit plus €20 bonus creates €1,400 of turnover.'],
['Maximum stake', 'The lower of €12 or 5% of the awarded bonus', 'Higher bets can breach the promotion rules.'],
['Maximum conversion', '5x the awarded bonus', 'Withdrawals are blocked while the bonus is active.'],
['Free spins', 'Expire after 7 days and must be used before other bets', 'Eligible games and contribution rates must be checked.'],
])}`),
section('sports-bonus', 'Sports Bonus, Live Betting and Esports', `
${table(['Check', 'Published term', 'What it means'], [
['Welcome offer', '100% up to €100 with code <code translate="no">100PLAY</code>', 'Reviewed EUR minimum deposit: €10'],
['Wagering', '12x the bonus within 21 days', 'Only stakes up to 50% of the bonus count'],
['Minimum odds', 'At least 1.80', 'Lower-odds bets breach the promotion terms'],
['Maximum conversion', '10x the awarded bonus', 'Restricted markets and settlement rules still apply'],
['Bet restrictions', 'Refunded, tie, cancelled and denied bets do not count', 'Multiple bets on the same outcome and other listed strategies are also restricted'],
])}`),
section('casino-lobby', 'Casino Games, Live Tables and New Releases', `
${cards([
['Slot navigation', 'The casino menu separates new games, video slots, provider spotlights, jackpot slots and bonus-buy games. Table, scratch, Asian-style, sport and casual categories provide alternatives to the main slot feed.'],
['Live casino', 'The observed lobby includes roulette, blackjack, baccarat, poker, game shows and TV games. Crazy Time, Lightning Roulette, Ice Fishing and Infinite Blackjack were visible during the review. Individual table limits vary.'],
['Providers and discovery', 'The public homepage displays studios including Pragmatic Play, Evolution, Play’n GO, NetEnt, Novomatic, Red Tiger and Yggdrasil. The new-game artwork shown here was supplied for the September 2026 review; it is not a live inventory or a recommendation based on winnings.'],
['GEO', `Use the ${source('online-casino', 'casino lobby')} and ${source('live-casino', 'live lobby')} to check current availability. A demo link or visible game tile is not proof that real-money play is available in your country.`],
])}
`),
section('cashier', 'Payments, Withdrawal Limits and Fees', `
${table(['Check', 'Published rule', 'Practical implication'],[
['Cashier methods', 'Skrill, Visa, Mastercard, Neteller, ecoPayz, Rapid Transfer, Interac, MiFinity, crypto, Volt and PayRedeem', 'Availability, limits, currencies and fees can vary by country and account. Confirm them in the live cashier.'],
['Weekly withdrawal limit', '€5,000 or currency equivalent per rolling 7 days, unless stated otherwise (clause 8.6).', 'This is a withdrawal limit, not a guaranteed payout schedule.'],
['Deposit turnover', '5x deposit rollover; qualifying settled sports bets require odds of at least 1.60 (8.2).', 'The operator reserves rejection or an administrative fee up to 8% if the requirement is not met. Ask how casino turnover is counted.'],
['Repeated withdrawals', 'Multiple withdrawals within a rolling 30-day period may incur a fee up to 8% (8.7).', 'Do not describe withdrawals as unconditionally free.'],
['Verification and destination', 'Identity checks may precede withdrawal; the original payment method is normally required (8.3–8.4).', 'Use payment details in your own name and check the payment options before depositing.'],
['Pending withdrawals', 'Requested funds remain playable; a lower balance can trigger cancellation after a grace period up to one hour (8.10).', 'Stop wagering funds already requested for withdrawal.'],
])}`),
section('kyc', 'Registration, KYC and Country Restrictions', `
${table(['Check', 'Published requirement', 'Before you register'], [
['Withdrawal verification', 'Full KYC for a withdrawal of any amount', 'Prepare verification before expecting a payout'],
['Additional triggers', 'Lifetime deposits above €5,000 or suspicious activity', 'Checks may also be requested earlier'],
['Identity documents', 'Photo ID and a selfie holding that ID', 'Use accurate details that match the account'],
['Address evidence', 'Bank statement or utility bill from the last three months', 'The ID should have at least three months before expiry'],
['Published country restrictions', 'The KYC policy lists Austria, France, Germany, the Netherlands, Spain, Comoros, the UK, the USA and FATF-blacklisted jurisdictions', 'This conflicts with some markets in the current availability data. Confirm eligibility during registration and never use a VPN'],
['Age requirement', 'Applicable legal gambling age', 'Only adults may register and play'],
])}`),
section('trust', 'Operator Transparency, Support and Mobile Access', `
${cards([
['Licence verification remains open', 'The reviewed footer links to Ardevar Logo Ltd as the technology provider, and policies refer to Anjouan restrictions. Neither establishes a current licence for this exact domain. We did not independently verify a licence number and do not present the brand as locally licensed or regulator-approved.'],
['Support channels', `The ${source('pages/contact-us', 'contact page')} advertises 24/7 email and live chat. General questions go to support@silverplay.com. We checked the published channels, not response times or dispute outcomes.`],
['Browser access', 'The site promotes PC, Mac and mobile access. No official app-store listing was verified, so mobile players should use the responsive website unless a verified app is offered in their account.'],
['Privacy and account data', `The ${source('pages/privacy-policy', 'privacy policy')} describes handling identity, contact and banking information. Use only the secure profile interface when submitting documents or payment details.`],
])}`),
section('responsible-gambling', 'Responsible Gambling & Player Safety', `
${cards([
['Self-exclusion is not described as instant', `The ${source('pages/self-exclusion', 'self-exclusion policy')} directs requests to customercare@silverplay.com and allows up to 10 business days for action. This delay is a material limitation, not an immediate safety guarantee.`],
['Profile closure is a separate process', 'The published closure policy uses customerassist@silverplay.com, says a request may be made no sooner than 90 days after the first deposit, and allows up to 60 days to complete it. Ordinary closure should not be confused with self-exclusion.'],
['Limits and independent help', 'The policy discusses temporary restrictions and financial limits after consultation; we did not verify self-service controls in the profile settings. If you need to stop, do not rely solely on a pending request: stop depositing and use independent support and device or bank blocking options where available.'],
['18+', 'Only adults who meet the legal gambling age in their jurisdiction may use the service. Gambling is not a way to earn income or recover losses; set limits before playing and stop if control becomes difficult.'],
])}
`),
section('best-for', 'Who SilverPlay Suits Best', `
${cards([
['Casino and Sports Players', 'A practical fit for players who want slots, live tables, sports, esports and virtual sports under one account.'],
['Players Who Compare Bonus Terms', 'The separate casino and sports offers make more sense for players who check codes, wagering, expiry and eligible products before depositing.'],
['Mobile Browser Players', 'The observed responsive site provides casino and betting navigation without requiring an app-store download.'],
['Think Twice If', 'Compare alternatives if you want simple wagering, immediate self-exclusion, unrestricted withdrawals or a licence independently verified for the reviewed domain.'],
])}`),
section('pros-cons', 'Pros & Cons For Real Players', `
<div class="features-grid premium-grid">
<div class="feature-card glass-card"><strong>Pros</strong><span>- Casino, live casino, sportsbook, esports and virtual sports in one account.</span><br /><span>- Four identifiable casino bonus codes and a separate sports code.</span><br /><span>- Public KYC, withdrawal, support and self-exclusion information.</span><br /><span>- Useful game, live-table and provider navigation.</span></div>
<div class="feature-card glass-card"><strong>Cons</strong><span>- 35x deposit-plus-bonus wagering and game contribution exclusions.</span><br /><span>- Deposit rollover, possible withdrawal fees and a €5,000 rolling weekly limit.</span><br /><span>- Self-exclusion may take up to 10 business days.</span><br /><span>- Payout speed and a licence number for the reviewed domain were not independently verified.</span></div>
</div>`),
section('faq', 'SilverPlay FAQ', `<div class="timeline">${faq.map(([q,a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('\n')}</div>`),
`<section class="container"><div class="final-cta-glass"><h2 class="title">Ready to Try SilverPlay?</h2><div class="view-all-wrapper"><a href="${offer}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">Play Now</a></div></div></section>`,
].join('\n');
const intro = 'SilverPlay combines a large casino lobby with live tables, sports, esports and virtual sports. This review examines the four-deposit EUR welcome package, exact bonus codes and the withdrawal and KYC restrictions that matter before you deposit.';
const header = old.match(/<header class="header">[\s\S]*?<\/header>/)[0];
const footer = old.slice(old.indexOf('<footer class="footer">')).replace(/<\/body>[\s\S]*$/, '</body>\n</html>\n');
let head = old.slice(0, old.indexOf('<body'));
head = head.replace(/<meta name="brand-snapshot-intro"[^>]*>\s*/g, '');
head = head.replace('noindex, follow', 'index, follow').replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`);
head = head.replace(/(<meta\s+(?:name|property)="(?:description|og:description|twitter:description)"\s+content=")[^"]*/g, `$1${esc(description)}`);
head = head.replace(/(<meta\s+(?:name|property)="(?:og:title|twitter:title)"\s+content=")[^"]*/g, `$1${esc(title)}`);
head = head.replace(/(<meta\s+(?:name|property)="(?:og:image|twitter:image)"\s+content=")[^"]*/g, `$1${capture}`);
const graph = [
{'@type':'Organization','@id':'https://spincresta.com/#organization',name:'SpinCresta',url:'https://spincresta.com/'},
{'@type':'WebSite','@id':'https://spincresta.com/#website',name:'SpinCresta',url:'https://spincresta.com/'},
{'@type':'WebPage','@id':url+'#webpage',url,name:title,description,inLanguage:'en',isPartOf:{'@id':'https://spincresta.com/#website'},breadcrumb:{'@id':url+'#breadcrumb'},mainEntity:{'@id':url+'#article'}},
{'@type':'Article','@id':url+'#article',headline:title,description,image:capture,datePublished:'2026-09-06',dateModified:'2026-09-07',inLanguage:'en',author:{'@id':'https://spincresta.com/#organization'},publisher:{'@id':'https://spincresta.com/#organization'},mainEntityOfPage:{'@id':url+'#webpage'},about:{'@type':'Thing',name:'SilverPlay'}},
{'@type':'BreadcrumbList','@id':url+'#breadcrumb',itemListElement:[{name:'Home',item:'https://spincresta.com/'},{name:'Casino Reviews',item:'https://spincresta.com/casinos-and-betting/'},{name:'SilverPlay Review',item:url}].map((x,i)=>({'@type':'ListItem',position:i+1,...x}))},
{'@type':'FAQPage','@id':url+'#faq',mainEntity:faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}))},
];
head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@graph':graph})}</script>`);
head = head.replace('</head>', '<meta name="brand-snapshot-intro" content="Categories observed in the public SilverPlay navigation. Game visibility does not establish eligibility in your country." />\n</head>');
const html = `${head}<body data-brand="silverplay">\n${header}
<section class="hero container"><div class="hero-content glass-card">
<div class="brand-logo-container hero-logo"><img class="brand-logo" src="/images/silverplay.svg" alt="SilverPlay logo" width="640" height="320" loading="eager" decoding="async" /></div>
<h1>SilverPlay Casino &amp; Sportsbook Review</h1><p class="hero-subtitle">${intro}</p><p class="hero-subtitle editorial-meta">Reviewed: 6 September 2026. Public-site review by SpinCresta; no deposit or payout test. Offers and eligibility can change.</p>
<div class="hero-cta-wrapper"><a href="${offer}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">Play Now</a></div></div></section>
<section class="container features-section glass-section" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">Why Players Choose SilverPlay</h2><button class="brand-why-media" type="button" aria-expanded="false" aria-controls="brand-why-section" aria-label="Expand casino screenshot"><img src="${capture}" alt="SilverPlay homepage with casino welcome package and game navigation" width="3024" height="1568" loading="eager" fetchpriority="high" decoding="async" /></button></div>
<div class="features-grid premium-grid">${features.map(([heading,text],i)=>`<div class="feature-card glass-card"><div class="icon-placeholder">0${i+1}</div><strong>${heading}</strong><span>${text}</span></div>`).join('\n')}</div></section>
<section class="container"><div class="brand-countries"><h2 class="title">Available Countries</h2><div class="countries-container" id="brand-countries"></div></div></section>
<section class="container"><div class="brand-payments"><h2 class="title">Payment Methods</h2><div class="payments-container" id="brand-payments"></div></div></section>
<main class="content-review">${main}</main>
<section class="all-countries"><div class="container"><h2 class="title">Online Casinos by Country</h2><div class="countries-cloud"></div></div></section>
${footer}`;
fs.writeFileSync(file, html);
console.log('Built full SilverPlay English review.');
