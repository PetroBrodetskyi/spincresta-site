import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS, BETONWIN_SPECIAL_MARKETS } from '../scripts/brand-snapshot-configs.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import {
  accountHeadline, argentinaCopy, betonwinCopy, componentLabels, conciseCopy, countedSpinNouns,
  detailCopy, editorial, licenseStatement, loyaltyCopy, loyaltyLevels, marketDetails,
  prosConsCopy, reviewLabels, snapshotIntro, sportsCopy, templateCopy,
} from './betonwin-review-copy.mjs';
import { reviewCards, reviewTable } from './brand-review-template.mjs';

const brand = BRANDS.find(b => b.urlDetail === 'brands/betonwin.html');
const image = BRAND_HOMEPAGE_SCREENSHOTS.betonwin;
const snapshot = BRAND_SNAPSHOT_CONFIGS.betonwin;
const sportsCategories = snapshot.tabs.find(tab => tab.label === 'Betting').available
  .filter(key => !BETONWIN_SPECIAL_MARKETS.includes(key));
const esc = s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/betonwin/';
const origin = 'https://spincresta.com';
const locales = Object.keys(betonwinCopy);
for (const lang of locales) {
  const { title, intro, games, gamesText, bonusShop, sports, banking } = betonwinCopy[lang];
  // Use StoneVegas's review shell and put only BetonWin data in its slots.
  const shell = fs.readFileSync(prefix(lang) + 'brands/stonevegas/index.html', 'utf8');
  // Preserve the same shared navigation, footer and comparison labels as before.
  const shared = fs.readFileSync(prefix(lang) + 'brands/viperwin/index.html', 'utf8');
  const take = (re, source = shell) => {
    const match = source.match(re);
    if (!match) throw new Error(lang + ': missing review template fragment: ' + re);
    return match[1];
  };
  const replaceSlot = (source, re, replacement) => {
    if (!re.test(source)) throw new Error(lang + ': missing review template slot: ' + re);
    return source.replace(re, () => replacement);
  };
  const casinoAnchor = /<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>/;
  const link = take(/(<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>)/)
    .replace(/href="[^"]+"/, `href="${esc(brand.urlCasino)}"`);
  const canonical = origin + route(lang);
  const ar = argentinaCopy[lang];
  const d = detailCopy[lang];
  const e = editorial[lang];
  const c = templateCopy[lang];
  const lc = loyaltyCopy[lang];
  const short = conciseCopy[lang];
  const ui = reviewLabels[lang];
  const number = new Intl.NumberFormat(lang,{useGrouping:'always'});
  const money = n => number.format(n);
  const spins = `50 ${countedSpinNouns[lang] ?? d.spins.toLocaleLowerCase(lang)}`;
  const offerAmount = `100% · ${money(300000)} ARS · ${spins}`;
  const s = sportsCopy[lang];
  const categoryNames = snapshot.labels[lang];
  const localeIndex = ['en','de','es','it','pl','uk','pt','fr','hi','fi'].indexOf(lang);
  const label = key => reviewSectionLabel(key, (...labels)=>labels[localeIndex]);
  const sentences = text => Array.from(new Intl.Segmenter(lang,{granularity:'sentence'}).segment(text), v=>v.segment.trim());
  const faqAnswers = [
    `${accountHeadline[lang]}. ${ui.deposit}: ${money(5000)} ARS.`,
    `25× · 3 ${short.days}. ${short.verification} ${d.spins}: ${short.spinRelease}`,
    short.gameAnswer,
    short.loyaltyAnswer,
    short.payoutAnswer,
    `ARS: Mercado Pago · ${ar.table[3]} · NaranjaX · AstroPay. BTC · LTC · ETH · USDT (TRC20/ERC20).`,
    `BIG D LTD · BVI 2164666 · Anjouan ALSI-202502041-FI2. ${sentences(licenseStatement[lang]).at(-1)}`,
  ];
  const faqQuestions = [...ui.questions.slice(0,2),short.gameQuestion,...ui.questions.slice(2),e.supportQuestion];
  faqAnswers.push(e.supportAnswer);
  const faq = faqQuestions.map((question,i)=>[question,faqAnswers[i]]);
  const org = {'@id':origin+'/#organization'};
  const date = '2026-11-20';
  const schema = {'@context':'https://schema.org','@graph':[
    {'@type':'Organization',...org,name:'SpinCresta',url:origin+'/'},
    {'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'SpinCresta',publisher:org},
    {'@type':'WebPage','@id':canonical,url:canonical,name:title,description:intro,inLanguage:lang,isPartOf:{'@id':origin+'/#website'},breadcrumb:{'@id':canonical+'#breadcrumb'}},
    {'@type':'Article','@id':canonical+'#article',headline:title,inLanguage:lang,description:intro,image:[image],mainEntityOfPage:{'@id':canonical},author:org,publisher:org,dateModified:date},
    {'@type':'BreadcrumbList','@id':canonical+'#breadcrumb',itemListElement:[{'@type':'ListItem',position:1,name:'SpinCresta',item:origin+'/'+prefix(lang)},{'@type':'ListItem',position:2,name:'BetonWin',item:canonical}]},
    {'@type':'FAQPage','@id':canonical+'#faq',inLanguage:lang,mainEntity:faq.map(([name,text])=>({'@type':'Question',name,acceptedAnswer:{'@type':'Answer',text}}))}
  ]};
  const paragraph = text => `<p class="section-intro">${esc(text)}</p>`;
  const cards = reviewCards;
  const t = e.table;
  const depositTable = reviewTable([ar.table[1],ar.table[2],ui.fees],[
    ['Mercado Pago',`ARS ${money(3000)}–${money(4000000)}`,'CUIT/CUIL · '+short.holder],
    [ar.table[3],`ARS ${money(3000)}–${money(5000000)}`,'CUIT/CUIL · '+short.holder],
    ['NaranjaX',`ARS ${money(1000)}–${money(50000000)}`,'DNI'],
    ['AstroPay',`ARS ${money(1000)}–${money(500000)}`,short.holder+' · '+short.phone],
    ['BTC · LTC · ETH','Bitcoin · Litecoin · Ethereum','—'],
    ['USDT','TRC20 · ERC20','—'],
  ]);
  const prosLabels = [...take(/id="pros-cons">([\s\S]*?)<\/section>/, shared).matchAll(/<strong>([^<]+)<\/strong>/g)].map(m=>m[1]);
  if(prosLabels.length!==2) throw Error('Missing comparison labels for '+lang);
  const prosCons = reviewCards([
    [prosLabels[0],prosConsCopy[lang].pros],
    [prosLabels[1],prosConsCopy[lang].cons],
  ],{comparison:true});
  const highlightRows = [
    [label('bonuses'),offerAmount],
    [games,'Kendoo · Playson · Pragmatic Play'],
    [d.liveTitle,'Evolution · Pragmatic Play'],
    [sports,sportsCategories.length+' · '+categoryNames.Football+' · '+categoryNames.Cricket+' · MMA'],
    [label('methods'),'Mercado Pago · NaranjaX · AstroPay · ARS'],
    [label('rewards'),'15 · Bonus Shop · Triple Spin'],
  ];
  const facts = reviewTable([ui.detail,ui.value,ui.note],[
    [label('countries'),new Intl.DisplayNames([lang],{type:'region'}).of('AR'),sentences(ar.overview)[0]],
    [label('bonuses'),offerAmount,'25× · 3 '+short.days],
    [label('methods'),'Mercado Pago · NaranjaX · AstroPay · '+ar.table[3],'ARS · BTC · LTC · ETH · USDT'],
    [label('sports'),sportsCategories.length+' · '+categoryNames.Football+' · '+categoryNames.Cricket+' · MMA · '+categoryNames.Chess,categoryNames.Politics+' · '+categoryNames.Other],
    [label('rewards'),'15 · Bonus Shop · Triple Spin',`${lc.headers[1]}: 1%–8% · ${lc.headers[2]}: ${new Intl.NumberFormat(lang).format(0.33)}%–5%`],
    [label('trust'),'BIG D LTD · ALSI-202502041-FI2','BVI · 2164666'],
  ]);
  const bonusTable=reviewTable([ui.detail,ui.bonusValue,ui.note],[
    [label('bonuses'),offerAmount,sentences(c.offerNote)[0]],
    [ui.deposit,money(5000)+' ARS',short.verification],
    [componentLabels[lang][3],'25×',short.deadline],
    [d.spins,spins,short.spinRelease],
    [ui.cashout,'x5',short.cashout],
  ]);
  const gameRows=[[games,gamesText],[d.liveTitle,sentences(d.live).slice(0,-1).join(' ')],[d.instantTitle,sentences(d.instant)[0]]];
  const gameTable=reviewTable([ui.game,ui.example,ui.note],[
    [games,['Bonus buy','Hold and Win','Megaways'].map(key=>categoryNames[key]).join(' · '),'Drops & Wins'],
    [d.liveTitle,['Spanish-language tables','VIP live casino'].map(key=>categoryNames[key]).join(' · '),sentences(d.live).at(-1)],
    [d.instantTitle,'Aviator · Spaceman · Dice · Limbo XY',sentences(d.instant).at(-1)],
  ]);
  const trustTable=reviewTable([ui.detail,ui.value,ui.note],[
    [ui.operator,'BIG D LTD · 2164666',new Intl.DisplayNames([lang],{type:'region'}).of('VG')],
    ['Anjouan','ALSI-202502041-FI2',sentences(licenseStatement[lang]).at(-1)],
    [ui.account,'18+',sentences(e.help).at(-1)],
  ]);
  const rewardSentences=sentences(d.rewards);
  const dailyStart=rewardSentences.findIndex(sentence=>sentence.includes('Daily Picks'));
  if(dailyStart<0)throw Error('Missing Daily Picks copy: '+lang);
  const rewards=cards([
    ['Bonus Shop',bonusShop],
    ['Triple Spin',rewardSentences.slice(0,dailyStart).join(' ')],
    ['Daily Picks',rewardSentences.slice(dailyStart).join(' ')],
    [short.coinTitle,sentences(lc.conditions).at(-1)],
  ]);
  const percent=n=>new Intl.NumberFormat(lang,{style:'percent',maximumFractionDigits:2}).format(n/100);
  const loyaltyTable=reviewTable(lc.headers,loyaltyLevels.map(([level,target,slots,sport])=>[
    `${level} · ${money(target)} ${lc.points}`,percent(slots),percent(sport),
  ]));
  const supplementaryDetails = new Set(['providers', 'rewards', 'vip', 'responsible']);
  const section = (id, kind, heading, content) => `<section class="container" id="betonwin-${id}" data-review-section="${kind}"${supplementaryDetails.has(id) ? ' data-review-details' : ''}><h2 class="title">${esc(heading)}</h2>${content}</section>`;
  const reviewDate = new Intl.DateTimeFormat(lang,{dateStyle:'long',timeZone:'UTC'}).format(new Date(date));
  const reviewMeta = `<p class="hero-subtitle editorial-meta">${esc(c.reviewed)}: <time datetime="${date}">${esc(reviewDate)}</time>${reviewDate.endsWith('.')?'':'.'} ${esc(t[7])}</p>`;
  const hero = [
    [/<img\b[^>]*class="brand-logo"[^>]*>/, `<img class="brand-logo" src="/${brand.image}" alt="${brand.name}" loading="lazy" />`],
    [/<h1>[\s\S]*?<\/h1>/, `<h1>${esc(title)}</h1>`],
    [/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(intro)}</p>`],
    [/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, reviewMeta],
    [casinoAnchor, link],
  ].reduce((markup, [re, value]) => replaceSlot(markup, re, value), take(/(<section class="hero container">[\s\S]*?<\/section>)/));
  let highlightSection = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/);
  highlightSection = replaceSlot(highlightSection, /<h2 class="title">[\s\S]*?<\/h2>/, `<h2 class="title">${esc(label('highlights'))}</h2>`);
  highlightSection = replaceSlot(highlightSection, /<img\b[^>]*>/,
    `<img src="${esc(image)}" alt="${brand.name}" width="3024" height="1660" loading="eager" fetchpriority="high" decoding="async" />`);
  let cardIndex = 0;
  highlightSection = highlightSection.replace(/(<strong>)[^<]*(<\/strong>\s*<span>)[\s\S]*?(<\/span>)/g, (_, start, middle, end) => {
    const row = highlightRows[cardIndex++];
    if (!row) throw new Error(lang + ': too many highlight cards in template');
    return start + esc(row[0]) + middle + esc(row[1]) + end;
  });
  if (cardIndex !== highlightRows.length) throw new Error(lang + ': missing highlight cards in template');
  const finalTitle = take(/class="final-cta-glass"><h2 class="title">([^<]+)<\/h2>/, shared).replaceAll('ViperWin', brand.name);
  let finalCta = take(/(<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>)/);
  finalCta = replaceSlot(finalCta, /<h2 class="title">[\s\S]*?<\/h2>/, `<h2 class="title">${finalTitle}</h2>`);
  finalCta = replaceSlot(finalCta, casinoAnchor, link);
  const html = `${take(/^([\s\S]*?)<title>/, shared)}<title>${esc(title)}</title>
    <meta name="description" content="${esc(intro)}" />
    <meta name="brand-snapshot-intro" content="${esc(snapshotIntro[lang])}" />
    <link rel="canonical" href="${canonical}" />
    ${[...locales, 'x-default'].map(code => `<link rel="alternate" hreflang="${code === 'fi' ? 'fi-FI' : code}" href="${origin + route(code === 'x-default' ? 'en' : code)}" />`).join('\n    ')}
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
    <meta property="og:type" content="article" /><meta property="og:url" content="${canonical}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${[['title',title],['description',intro],['image',image]].map(([key,val])=>`<meta property="og:${key}" content="${esc(val)}" /><meta name="twitter:${key}" content="${esc(val)}" />`).join('\n    ')}
    ${take(/(<link rel="stylesheet"[^>]*>)/, shared)}
    <script type="application/ld+json">${JSON.stringify(schema)}</script>
  </head>
  <body data-brand="betonwin" data-language="${lang}">
    ${take(/(<header class="header">[\s\S]*?<\/header>)/, shared)}
    ${hero}
    ${highlightSection}
    ${take(/(<section class="container">\s*<div class="brand-countries">[\s\S]*?<\/section>)/)}
    ${take(/(<section class="container">\s*<div class="brand-payments">[\s\S]*?<\/section>)/)}
    <main class="content-review">
      ${section('verdict','summary',label('summary'),facts)}
      ${section('bonus','bonuses','BetonWin · '+label('bonuses'),bonusTable)}
      ${section('games','games',label('games'),gameTable)}
      ${section('providers','games',ui.providers,cards([...gameRows,[componentLabels[lang][1],'Kendoo · Playson · 3 Oaks · PG Soft · Pragmatic Play · TaDa · BGaming · Nolimit City · Wicked Games']]))}
      ${section('sports','sports',sports,paragraph(s.lead)+cards([
        [sports,sportsCategories.map(key=>categoryNames[key]).join(' · ')+'. '+BETONWIN_SPECIAL_MARKETS.map(key=>categoryNames[key]).join(' · ')+'.'],
        [s.navigationTitle,s.navigation],
        [s.leaguesTitle,s.leagues],
        [s.marketsTitle,marketDetails[lang]],
      ])+paragraph(s.promotion))}
      ${section('rewards','rewards',d.rewardsTitle,rewards)}
      ${section('loyalty','rewards',ui.loyalty,paragraph(lc.summary)+paragraph(lc.disclosure)+loyaltyTable+paragraph(sentences(lc.conditions).slice(0,-1).join(' ')))}
      ${section('vip','rewards',componentLabels[lang][2]+' · '+componentLabels[lang][0],cards([[componentLabels[lang][2],sentences(e.help).slice(0,-1).join(' ')],[componentLabels[lang][0],sentences(c.mobile).slice(1).join(' ')]]))}
      ${section('payments','cashier',banking,paragraph(ar.cashier)+depositTable+paragraph(sentences(ar.funding).at(-1))+paragraph(ar.payout))}
      ${section('safety','trust',ui.license,trustTable+cards([[ui.identity,e.identity],[ui.verification,e.conflict]]))}
      ${section('responsible','trust',ui.saferPlay,cards([[ui.limits,sentences(c.limits)[0]],[ui.pause,c.pause],[ui.exclusion,c.exclusion],[ui.session,sentences(c.limits).at(-1)]]))}
      ${section('pros-cons','pros',label('pros'),prosCons)}
      ${section('best-for','suitability',label('suitability'),cards([[ui.fit,short.goodFit],[ui.caution,short.caution]]))}
      <section class="container" id="faq" data-review-section="faq"><h2 class="title">${esc(d.faqTitle)}</h2><div class="timeline">${faq.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>
      ${finalCta}
    </main>
    ${take(/(<section class="all-countries">[\s\S]*$)/, shared).trimEnd()}\n`;
  const dir = prefix(lang) + 'brands/betonwin';
  fs.mkdirSync(dir, {recursive:true});
  fs.writeFileSync(dir + '/index.html', html);

  // Keep sidebar/card headlines and their generated translation maps in sync.
  if(lang!=='en') {
    const translations='scripts/brand-bonus-translations/'+lang+'.js';
    const mapText=fs.readFileSync(translations,'utf8');
    const map=JSON.parse(mapText.slice(mapText.indexOf('{'),mapText.lastIndexOf('}')+1));
    map[accountHeadline.en]=accountHeadline[lang];
    fs.writeFileSync(translations,'// Generated by tools/sync-brand-bonus-translations.mjs. Do not edit manually.\nexport default '+JSON.stringify(map,null,2)+';\n');
  }

  const file = prefix(lang) + 'casinos-and-betting/index.html';
  const directory = fs.readFileSync(file,'utf8');
  const row = `<article class="casino-list-row" data-type="casino-betting" data-brand-slug="betonwin"><a class="home-new-review-card" href="${route(lang)}"><span class="home-new-review-logo" style="--brand-bg-color: ${brand.bgColor};"><img src="/${brand.image}" alt="" loading="lazy" decoding="async" /></span><strong class="casino-name">BetonWin</strong></a></article>`;
  const rows = /<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g;
  let inserted = false;
  const result = directory.replace(rows, current => {
    if (current.includes('data-brand-slug="betonwin"')) return '';
    if (!current.includes('/brands/betory/"')) return current;
    inserted = true;
    return row + '\n            ' + current;
  }).replace(/\n[ \t]*\n([ \t]*<article[^>]*data-brand-slug="betonwin")/g,'\n$1');
  if (!inserted) throw new Error(file + ': missing directory anchor');
  fs.writeFileSync(file, result);
}
