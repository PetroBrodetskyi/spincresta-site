import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { reviewSectionLabel } from '../scripts/pages/brand-review-order.js';
import { magneticCopy, magneticDetails, magneticHeadlines, magneticTitles } from './magneticslots-review-copy.mjs';
import { escapeReview as esc, reviewCards, reviewTable } from './brand-review-template.mjs';

const slug = 'magneticslots';
const brand = BRANDS.find(item => item.urlDetail === `brands/${slug}.html`);
if (brand?.bonus !== magneticHeadlines.en) throw new Error('Magnetic Slots registry headline does not match editorial copy');
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const date = '2026-11-21';
// Published cashback tiers in EUR, from the weekly cashback table (2026-11-21).
const cashbackTiers = [
  [0.05, 20, 1000, 100],
  [0.06, 1001, 5000, 500],
  [0.08, 5001, 10000, 1000],
  [0.10, 10001, 25000, 3000],
  [0.125, 25000, null, 5000],
];
const terms = {
  en: ['Casino & Betting', 'Slots', 'Live games', 'Identity checks', 'License and complaints', 'Safer gambling', 'Pros', 'Cons', 'Can I play for real money from Spain?', 'What is the withdrawal minimum?'],
  de: ['Casino und Sportwetten', 'Spielautomaten', 'Live-Spiele', 'Identitätsprüfung', 'Lizenz und Beschwerden', 'Verantwortungsvolles Spielen', 'Vorteile', 'Nachteile', 'Kann ich aus Spanien um Echtgeld spielen?', 'Wie hoch ist die Mindestauszahlung?'],
  es: ['Casino y apuestas', 'Tragamonedas', 'Juegos en vivo', 'Verificación de identidad', 'Licencia y reclamaciones', 'Juego responsable', 'Ventajas', 'Desventajas', '¿Puedo jugar con dinero real desde España?', '¿Cuál es el retiro mínimo?'],
  it: ['Casinò e scommesse', 'Slot', 'Giochi dal vivo', 'Verifica dell’identità', 'Licenza e reclami', 'Gioco responsabile', 'Pro', 'Contro', 'Posso giocare con denaro reale dalla Spagna?', 'Qual è il prelievo minimo?'],
  pl: ['Kasyno i zakłady', 'Automaty', 'Gry na żywo', 'Weryfikacja tożsamości', 'Licencja i reklamacje', 'Odpowiedzialna gra', 'Zalety', 'Wady', 'Czy można grać na pieniądze z Hiszpanii?', 'Jaka jest minimalna wypłata?'],
  uk: ['Казино та ставки', 'Слоти', 'Live-ігри', 'Перевірка особи', 'Ліцензія та скарги', 'Відповідальна гра', 'Переваги', 'Недоліки', 'Чи можна грати на гроші з Іспанії?', 'Яка мінімальна сума виплати?'],
  pt: ['Casino e apostas', 'Slots', 'Jogos ao vivo', 'Verificação de identidade', 'Licença e reclamações', 'Jogo responsável', 'Prós', 'Contras', 'Posso jogar a dinheiro real a partir de Espanha?', 'Qual é o levantamento mínimo?'],
  fr: ['Casino et paris', 'Machines à sous', 'Jeux en direct', 'Vérification d’identité', 'Licence et réclamations', 'Jeu responsable', 'Avantages', 'Inconvénients', 'Peut-on jouer en argent réel depuis l’Espagne ?', 'Quel est le retrait minimum ?'],
  hi: ['कैसीनो और सट्टेबाज़ी', 'स्लॉट', 'लाइव गेम', 'पहचान की जाँच', 'लाइसेंस और शिकायतें', 'ज़िम्मेदार खेल', 'फ़ायदे', 'नुकसान', 'क्या स्पेन से असली पैसे से खेल सकते हैं?', 'न्यूनतम निकासी कितनी है?'],
  fi: ['Kasino ja vedonlyönti', 'Kolikkopelit', 'Livepelit', 'Henkilöllisyyden tarkistus', 'Lisenssi ja valitukset', 'Vastuullinen pelaaminen', 'Plussat', 'Miinukset', 'Voiko Espanjasta pelata oikealla rahalla?', 'Mikä on pienin kotiutussumma?'],
};

const paragraph = text => `<p class="section-intro">${esc(text)}</p>`;
const change = (html, pattern, render) => {
  if (!pattern.test(html)) throw new Error(`Missing review template slot: ${pattern}`);
  return html.replace(pattern, render);
};
const save = (file, before, after) => {
  if (before !== after) fs.writeFileSync(file, after);
};

for (const [i, locale] of locales.entries()) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  const reviewPath = `/${prefix}brands/${slug}/`;
  const file = `${prefix}brands/${slug}/index.html`;
  const source = fs.readFileSync(file, 'utf8');
  const c = magneticCopy[locale];
  const d = magneticDetails[locale];
  const [type, slots, live, identity, license, protection, pros, cons, q1, q2] = terms[locale];
  const label = kind => reviewSectionLabel(kind, (...labels) => labels[i]);
  const heading = (id, kind, title, body, { inDetails = false } = {}) => `<section class="container" id="${id}" data-review-section="${kind}"${inDetails ? ' data-review-details' : ''}>
        <h2 class="title">${esc(title)}</h2>
        ${body}
      </section>`;
  const [first, firstAmount, firstNote, second, secondAmount, third, thirdAmount, thirdNote] = c.depositStages.split('|');
  const [s1, s1Amount, s2, s2Amount, s3, s3Amount] = c.sportStages.split('|');
  const columns = c.columns.split('|');
  const welcomeTable = reviewTable(columns, [
    [first, firstAmount, firstNote], [second, secondAmount, ''], [third, thirdAmount, thirdNote],
  ]);
  const sportTable = reviewTable([s1, s2, s3], [[s1Amount, s2Amount, s3Amount]]);
  const euro = new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR', maximumFractionDigits: 0, minimumFractionDigits: 0 });
  const percent = new Intl.NumberFormat(locale, { style: 'percent', maximumFractionDigits: 1 });
  const cashbackTable = reviewTable(d.cashbackColumns.split('|'), [
    ...cashbackTiers.map(([rate, min, max, cap]) => [
      percent.format(rate),
      max === null ? `${euro.format(min)}+` : `${euro.format(min)}–${euro.format(max)}`,
      euro.format(cap),
    ]),
    [`≤${percent.format(0.25)}`, d.inviteOnly, d.vipCap],
  ]);
  const rules = (text, count) => Array.from(new Intl.Segmenter(locale, { granularity: 'sentence' }).segment(text), item => item.segment.trim()).slice(0, count).join(' ');
  const faq = [
    ...['faqBonus', 'faqWager', 'faqGames', 'faqLive', 'faqSports', 'faqCashback'].map(key => d[key].split('|')),
    [q2, rules(c.payout, 1)],
    d.faqIdentity.split('|'),
    [q1, rules(c.eligibility, 1)],
    d.faqLimit.split('|'),
  ];
  const dateText = new Intl.DateTimeFormat(locale, { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(date));
  const unchangedFinal = source.match(/<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>/)?.[0];
  if (!unchangedFinal) throw new Error(`${locale}: no standard final CTA`);
  const content = [
    heading(`${slug}-verdict`, 'summary', label('summary'), reviewTable(columns, [
      [label('bonuses'), magneticHeadlines[locale], '40×'],
      [label('sports'), '€450', '5×'],
      [label('cashier'), '€50–€120', '3×'],
      [label('countries'), '18+', c.eligibility],
    ])),
    heading(`${slug}-bonuses`, 'bonuses', label('bonuses'), welcomeTable + paragraph(c.conflict) + paragraph(c.wager) + paragraph(c.spins)),
    heading('casino-lobby', 'games', label('games'), paragraph(d.collections) + reviewCards([
      [slots, c.slots], [live, c.live], [d.instantTitle, d.instant], [d.tableTitle, d.table],
    ])),
    heading(`${slug}-sports`, 'sports', label('sports'), paragraph(c.sport) + paragraph(d.sportsMarkets) + sportTable + paragraph(c.sportRules)),
    heading(`${slug}-rewards`, 'rewards', label('rewards'), paragraph(d.loyalty) +
      `<h3>${esc(d.cashbackTitle)}</h3>` + paragraph(d.cashback) + cashbackTable + paragraph(d.cashbackRules), { inDetails: true }),
    heading(`${slug}-payments`, 'cashier', label('cashier'), reviewCards([
      [label('methods'), c.cashier], [label('cashier'), c.payout],
    ]) + `<h3>${esc(identity)}</h3>` + paragraph(`${c.kyc} ${d.fundsCheck}`), { inDetails: true }),
    heading(`${slug}-trust`, 'trust', label('trust'), reviewCards([[license, c.licence], [protection, c.limits]])),
    heading('pros-cons', 'pros', label('pros'), reviewCards([[pros, d.pros.split('|')], [cons, d.cons.split('|')]], { comparison: true })),
    heading('faq', 'faq', label('faq'), `<div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div>`),
    unchangedFinal,
  ].join('\n      ');

  const highlights = [
    [label('bonuses'), magneticHeadlines[locale]],
    [slots, 'Diamond Strike: Lucky Reels · Gates of Olympus 2500'],
    [live, 'Lightning Roulette · Crazy Time'],
    [label('sports'), 'Counter-Strike · Dota 2 · Premier League'],
    [label('methods'), 'Visa · Mastercard · Apple Pay · Google Pay · BTC'],
    [label('cashier'), '50–120 €'],
  ];
  let headlineIndex = 0;
  let html = change(source, /<p class="hero-subtitle">[\s\S]*?<\/p>/, () => `<p class="hero-subtitle">${esc(c.intro)}</p>`);
  html = change(html, /<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/, () =>
    `<p class="hero-subtitle editorial-meta">${esc(c.reviewed)}: <time datetime="${date}">${esc(dateText)}</time>${dateText.endsWith('.') ? '' : '.'}</p>`);
  html = change(html, /(<section\b[^>]*id="brand-why-section">)[\s\S]*?<\/section>/, part => {
    const result = part.replace(/<h2 class="title">[\s\S]*?<\/h2>/, () => `<h2 class="title">${esc(label('highlights'))}</h2>`)
      .replace(/(<strong>)[\s\S]*?(<\/strong>\s*<span>)[\s\S]*?(<\/span>)/g, (_, start, middle, end) => {
        const item = highlights[headlineIndex++];
        if (!item) throw new Error(`${locale}: unexpected highlight card`);
        return start + esc(item[0]) + middle + esc(item[1]) + end;
      });
    if (headlineIndex !== highlights.length) throw new Error(`${locale}: lost a standard highlight card`);
    return result;
  });
  html = change(html, /(<main class="content-review">)[\s\S]*?(<\/main>)/, (_, open, close) => `${open}\n      ${content}\n    ${close}`);
  html = change(html, /<title>[^<]+<\/title>/, () => `<title>${esc(magneticTitles[locale])}</title>`);
  html = html.replace(/(<meta (?:name|property)="(?:og|twitter):title" content=")[^"]+(")/g, (_, a, b) => a + esc(magneticTitles[locale]) + b);
  html = html.replace(/(<a\b[^>]*?href=")[^"]+("[^>]*class="cta-brands")/g, (_, a, b) => a + esc(brand.urlCasino) + b);
  html = html.replace(/^[ \t]*<meta name="brand-(?:snapshot|Überblick)-intro"[^>]*>\r?\n/gm, '');
  html = change(html, /(<meta name="description" content=")[^"]+("\s*\/>)/, (_, a, b) =>
    `${a}${esc(c.intro)}${b}\n    <meta name="brand-snapshot-intro" content="${esc(c.snapshot)}" />`);
  html = html.replace(/(<meta (?:name|property)="(?:og|twitter):description" content=")[^"]+(")/g, (_, a, b) => a + esc(c.intro) + b);
  html = change(html, /(<script type="application\/ld\+json">)([^<]+)(<\/script>)/, (_, open, json, close) => {
    const schema = JSON.parse(json);
    const blocks = schema['@graph'];
    for (const block of blocks) {
      if (['Article', 'Review', 'WebPage'].includes(block['@type'])) {
        block.description = c.intro;
        if (block.name && block['@type'] === 'WebPage') block.name = magneticTitles[locale];
        if (block.headline) block.headline = magneticTitles[locale];
        if (block.dateModified || block['@type'] === 'Article') block.dateModified = date;
      }
    }
    const questions = faq.map(([name, text]) => ({ '@type': 'Question', name, acceptedAnswer: { '@type': 'Answer', text } }));
    const faqBlock = blocks.find(block => block['@type'] === 'FAQPage');
    if (faqBlock) faqBlock.mainEntity = questions;
    else blocks.push({ '@type': 'FAQPage', '@id': `https://spincresta.com${reviewPath}#faq`, inLanguage: locale, mainEntity: questions });
    return open + JSON.stringify(schema) + close;
  });
  if (html.includes('Fast payouts for players')) throw new Error(`${locale}: stale promotion in review`);
  save(file, source, html);

  const catalogue = `${prefix}casinos-and-betting/index.html`;
  const before = fs.readFileSync(catalogue, 'utf8');
  let updatedRows = 0;
  const names = new Intl.DisplayNames([locale], { type: 'region' });
  const after = before.replace(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g, part => {
    if (!part.includes(`href="${reviewPath}"`)) return part;
    updatedRows++;
    let index = 0;
    const values = [type, magneticHeadlines[locale], brand.countries.map(code => names.of(code)).join(', ')];
    const result = part.replace(/(<p class="casino-bonus">\s*<strong>[^<]+<\/strong>)[\s\S]*?(<\/p>)/g,
      (full, start, end) => index < values.length ? `${start} ${esc(values[index++])}${end}` : full);
    if (index !== values.length) throw new Error(`${locale}: incomplete casino directory row`);
    return result.replace(/data-type="[^"]+"/, 'data-type="casino-betting"');
  });
  if (updatedRows !== 1) throw new Error(`${locale}: expected one Magnetic Slots directory row`);
  save(catalogue, before, after);

}

const sitemapFile = 'sitemap.xml';
const sitemap = fs.readFileSync(sitemapFile, 'utf8');
const sitemapUpdated = sitemap.replace(
  /(<loc>https:\/\/spincresta\.com\/(?:[a-z]{2}\/)?brands\/magneticslots\/<\/loc>\s*<lastmod>)\d{4}-\d{2}-\d{2}(<\/lastmod>)/g,
  (_, a, b) => a + date + b,
);
save(sitemapFile, sitemap, sitemapUpdated);
