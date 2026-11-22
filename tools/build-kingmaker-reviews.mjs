import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { kingmakerCopy, kingmakerHeadlines, suitabilityCards, withdrawalFeeNote } from './kingmaker-review-copy.mjs';
import { casinoWelcomeByCurrency, cashierExamples, dailyCasinoCashback, reviewedDetails } from './kingmaker-review-details.mjs';
import { escapeReview as esc, reviewCards, reviewTable } from './brand-review-template.mjs';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const slug = 'kingmaker';
const brand = BRANDS.find(item => item.urlDetail === 'brands/kingmaker.html');
const picture = BRAND_HOMEPAGE_SCREENSHOTS[slug];
const date = '2026-11-22';
const origin = 'https://spincresta.com';
const prefix = lang => lang === 'en' ? '' : lang + '/';
const route = lang => '/' + prefix(lang) + 'brands/kingmaker/';
const limits = [[500, 7000], [500, 10000], [800, 12000], [1000, 15000], [1500, 20000]];
const ctaPattern = /<a\b[^>]*class="cta-brands"[\s\S]*?<\/a>/;
const check = process.argv.includes('--check');
let mismatches = 0;
function save(file, markup) {
  if (readFileSync(file, 'utf8') === markup) return;
  if (check) {
    console.error(`Stale Kingmaker output: ${file}`);
    mismatches++;
  } else writeFileSync(file, markup);
}
if (!picture || brand?.bonus !== kingmakerHeadlines.en) throw new Error('Kingmaker review assets or registry headline missing');

for (const [i, lang] of locales.entries()) {
  const c = kingmakerCopy[lang];
  const d = reviewedDetails[lang];
  const [reviewed, welcomeLabel, wageringLabel, reloadLabel, slotsLabel, liveLabel, sportsBonusLabel, vipLabel, limitsLabel, kycLabel, trustLabel, saferLabel, prosLabel, consLabel, topicLabel, termsLabel, dailyLabel, monthlyLabel] = c.labels;
  const [overview, welcome, wheel, wager, games, live, sports, sportsOffer, sportsRules, vip, cashier, payments, kyc, trust, safer] = c.body;
  if (c.labels.length !== 18 || c.body.length !== 15 || c.faq.length !== 8 || d?.headers.length !== 8 || d.faq.length !== 2) {
    throw new Error(`Incomplete Kingmaker copy: ${lang}`);
  }
  const faq = [...c.faq, ...d.faq];
  const template = readFileSync(prefix(lang) + 'brands/betonwin/index.html', 'utf8');
  const take = re => {
    const match = template.match(re);
    if (!match) throw new Error(`Missing Kingmaker shell fragment (${lang}): ${re}`);
    return match[1];
  };
  const label = key => reviewSectionLabel(key, (...values) => values[i]);
  const url = origin + route(lang);
  const euros = new Intl.NumberFormat(lang, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  const sectionLocale = lang === 'pt' ? 'pt-PT' : lang;
  const number = new Intl.NumberFormat(sectionLocale, { useGrouping: 'always' });
  const regions = new Intl.DisplayNames([sectionLocale], { type: 'region' });
  const percent = new Intl.NumberFormat(sectionLocale, { style: 'percent' });
  const range = (lo, hi, currency) => `${number.format(lo)}–${number.format(hi)} ${currency}`;
  const localDate = new Intl.DateTimeFormat(lang, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const paragraph = s => `<p class="section-intro">${esc(s)}</p>`;
  const section = (id, key, heading, inner, tab = false) =>
    `<section class="container" id="kingmaker-${id}" data-review-section="${key}"${tab ? ' data-review-details' : ''}><h2 class="title">${esc(heading)}</h2>${inner}</section>`;
  const cta = template.match(ctaPattern)[0].replace(/href="[^"]+"/, `href="${esc(brand.urlCasino)}"`);
  const hero = take(/(<section class="hero container">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*class="brand-logo"[^>]*>/, `<img class="brand-logo" src="/${brand.image}" alt="Kingmaker" width="640" height="320" decoding="async" />`)
    .replace(/<h1>[^<]+<\/h1>/, `<h1>${esc(c.title)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(overview)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, `<p class="hero-subtitle editorial-meta">${esc(reviewed)}: <time datetime="${date}">${esc(localDate)}</time></p>`)
    .replace(ctaPattern, () => cta);
  const highlightRows = [
    [welcomeLabel, c.headline], [slotsLabel, '36 Coins x3000 · Ze Zeus'],
    [liveLabel, c.liveExamples], [label('sports'), c.sportExamples],
    [limitsLabel, `VIP 1: ${euros.format(500)} / ${euros.format(7000)}`], [vipLabel, 'VIP 1–5'],
  ];
  let row = 0;
  const highlights = take(/(<section[^>]*id="brand-why-section">[\s\S]*?<\/section>)/)
    .replace(/<img\b[^>]*>/, `<img src="${esc(picture)}" alt="${esc(c.imageAlt)}" width="1600" height="835" loading="eager" fetchpriority="high" decoding="async" />`)
    .replace(/(<strong>)[^<]*(<\/strong>\s*<span>)[\s\S]*?(<\/span>)/g, (_, a, b, end) => {
      const [heading, value] = highlightRows[row++];
      return a + esc(heading) + b + esc(value) + end;
    });
  if (row !== highlightRows.length) throw new Error(`Missing highlights: ${lang}`);
  const geoSection = take(/(<section class="container">\s*<div class="brand-countries">[\s\S]*?<\/section>)/);
  const bankingSection = take(/(<section class="container">\s*<div class="brand-payments">[\s\S]*?<\/section>)/);
  const final = take(/(<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>)/)
    .replaceAll('BetonWin', 'Kingmaker')
    .replace(ctaPattern, () => cta);
  const footer = take(/(<section class="all-countries">[\s\S]*$)/).trimEnd();
  const saferPlayLink = `<a class="cta-secondary editorial-resource-link" href="/${prefix(lang)}responsible-gambling/">${siteIconMarkup('safety', 'site-icon site-icon--inline', 18)}<span>${esc(saferLabel)}</span></a>`;

  const org = { '@id': origin + '/#organization' };
  const schema = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'Organization', ...org, name: 'SpinCresta', url: origin + '/' },
    { '@type': 'WebSite', '@id': origin + '/#website', url: origin + '/', name: 'SpinCresta', publisher: org },
    { '@type': 'WebPage', '@id': url, url, name: c.title, description: c.description, inLanguage: lang, isPartOf: { '@id': origin + '/#website' }, breadcrumb: { '@id': url + '#breadcrumb' } },
    { '@type': 'Article', '@id': url + '#article', headline: c.title, description: c.description, inLanguage: lang, image: [picture], mainEntityOfPage: { '@id': url }, author: org, publisher: org, datePublished: date, dateModified: date },
    { '@type': 'BreadcrumbList', '@id': url + '#breadcrumb', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'SpinCresta', item: origin + '/' + prefix(lang) },
      { '@type': 'ListItem', position: 2, name: 'Kingmaker', item: url },
    ] },
    { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: lang, mainEntity: faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } })) },
  ] };
  const html = `${take(/^([\s\S]*?)<title>/).replace(/<meta name="robots"[^>]*>/, '<meta name="robots" content="index, follow, max-image-preview:large" />')}<title>${esc(c.title)}</title>
    <meta name="description" content="${esc(c.description)}" />
    <meta name="brand-snapshot-intro" content="${esc(c.snapshot)}" />
    <link rel="canonical" href="${url}" />
    ${[...locales, 'x-default'].map(code => `<link rel="alternate" hreflang="${code === 'fi' ? 'fi-FI' : code}" href="${origin + route(code === 'x-default' ? 'en' : code)}" />`).join('\n    ')}
    <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png" />
    <meta property="og:type" content="article" />
    <meta property="og:url" content="${url}" />
    <meta property="og:site_name" content="SpinCresta" />
    <meta property="og:image:alt" content="${esc(c.imageAlt)}" />
    <meta name="twitter:card" content="summary_large_image" />
    ${[['title', c.title], ['description', c.description], ['image', picture]].map(([k, v]) => `<meta property="og:${k}" content="${esc(v)}" />\n    <meta name="twitter:${k}" content="${esc(v)}" />`).join('\n    ')}
    ${take(/(<link rel="stylesheet"[^>]*>)/)}
    <script type="application/ld+json">${JSON.stringify(schema).replaceAll('<', '\\u003c')}</script>
  </head>
  <body data-brand="kingmaker" data-language="${lang}">
    ${take(/(<header class="header">[\s\S]*?<\/header>)/)}
    ${hero}
    ${highlights}
    ${geoSection}
    ${bankingSection}
    <main class="content-review">
      ${section('summary', 'summary', label('summary'), reviewTable([topicLabel, termsLabel, 'EUR'], [
        [welcomeLabel, c.headline, euros.format(20) + ' · 35×'],
        [sportsBonusLabel, '100%', euros.format(100) + ' · 6× / 5×'],
        [limitsLabel, 'VIP 1', euros.format(500) + ' / ' + euros.format(7000)],
        [vipLabel, 'VIP 1–5', '—'],
      ]))}
      ${section('bonus', 'bonuses', label('bonuses'),
        reviewCards([[welcomeLabel, welcome], ['Royal Fortune Wheel', wheel], [wageringLabel, wager]]) +
        paragraph(d.currencies) + reviewTable(d.headers.slice(0, 3), casinoWelcomeByCurrency.map(([code, min, cap]) => [code, number.format(min), number.format(cap)])) +
        reviewCards([[reloadLabel, d.reload], d.weekend]), true)}
      ${section('games', 'games', label('games'), reviewCards([[slotsLabel, games], [liveLabel, live + ' ' + d.shows]]), true)}
      ${section('sports', 'sports', label('sports'), paragraph(sports) + reviewCards([[sportsBonusLabel, sportsOffer], [wageringLabel, sportsRules], d.boost]))}
      ${section('rewards', 'rewards', label('rewards'), paragraph(vip) + paragraph(d.cash) +
        reviewTable([vipLabel, ...d.headers.slice(6)], dailyCasinoCashback.map(([level, rate, cap]) => [`VIP ${level}`, percent.format(rate / 100), euros.format(cap)])), true)}
      ${section('cashier', 'cashier', label('cashier'), paragraph(cashier) +
        paragraph(d.banking) + reviewTable(d.headers.slice(3, 6), cashierExamples.map(([country, code, method, dMin, dMax, wMin, wMax]) =>
          [regions.of(country) + ' · ' + method, range(dMin, dMax, code), range(wMin, wMax, code)])) +
        reviewTable([vipLabel, dailyLabel, monthlyLabel], limits.map(([day, month], n) => [`VIP ${n + 1}`, euros.format(day), euros.format(month)])) +
        paragraph(payments) + paragraph(withdrawalFeeNote[lang]))}
      ${section('trust', 'trust', label('trust'), reviewCards([[trustLabel, trust], [kycLabel, kyc], d.support, [saferLabel, safer]]) + `<p class="section-intro">${saferPlayLink}</p>`, true)}
      ${section('pros-cons', 'pros', label('pros'), reviewCards([[prosLabel, c.pros], [consLabel, c.cons]], { comparison: true }))}
      ${section('best-for', 'suitability', label('suitability'), reviewCards(suitabilityCards[lang]))}
      <section class="container" id="faq" data-review-section="faq"><h2 class="title">${esc(label('faq'))}</h2><div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div></section>
      ${final}
    </main>
    ${footer}
`;
  save(prefix(lang) + 'brands/kingmaker/index.html', html);

  const directory = prefix(lang) + 'casinos-and-betting/index.html';
  const source = readFileSync(directory, 'utf8');
  let seen = 0;
  const updated = source.replace(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g, block => {
    if (!block.includes(`data-brand-slug="${slug}"`)) return block;
    seen++;
    let n = 0;
    const next = block.replace(/(<p class="casino-bonus">\s*<strong>[^<]+<\/strong>)[\s\S]*?(<\/p>)/g, (full, start, end) =>
      n++ === 1 ? start + ' ' + esc(c.headline) + end : full);
    if (n !== 3) throw new Error(`Incomplete Kingmaker directory row: ${lang}`);
    return next;
  });
  if (seen !== 1) throw new Error(`Missing or duplicate Kingmaker directory row: ${lang}`);
  save(directory, updated);
}
if (mismatches) process.exitCode = 1;
