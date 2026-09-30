import fs from 'node:fs';
import { GOLDENBET_LOCALE_COPY } from './goldenbet-locale-copy.mjs';

const screenshot = 'https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1790519366/spincresta/brands/goldenbet/main-page/goldenbet-page_ppsutu';
const affiliate = { uk: 'https://armadaapp.media-412.com/click?pid=3862&amp;offer_id=124461', au: 'https://armadaapp.media-412.com/click?pid=3862&amp;offer_id=124462' };
const tableLabels = {
  de: ['Prüfung', 'Ergebnis', 'SpinCresta-Hinweis', 'Angebot', 'Veröffentlichte Bedingungen'],
  es: ['Comprobación', 'Resultado', 'Nota de SpinCresta', 'Oferta', 'Condiciones publicadas'],
  it: ['Controllo', 'Risultato', 'Nota SpinCresta', 'Offerta', 'Condizioni pubblicate'],
  pl: ['Kontrola', 'Ustalenie', 'Wskazówka SpinCresta', 'Oferta', 'Opublikowane warunki'],
  uk: ['Перевірка', 'Результат', 'Примітка SpinCresta', 'Пропозиція', 'Опубліковані умови'],
  pt: ['Verificação', 'Resultado', 'Nota SpinCresta', 'Oferta', 'Condições publicadas'],
  fr: ['Contrôle', 'Constat', 'Note SpinCresta', 'Offre', 'Conditions publiées'],
  hi: ['जाँच', 'नतीजा', 'SpinCresta टिप्पणी', 'ऑफ़र', 'प्रकाशित शर्तें'],
  fi: ['Tarkistus', 'Havainto', 'SpinCresta-huomio', 'Tarjous', 'Julkaistut ehdot'],
};
const structuralLabels = {
  de: { regulation: 'Lizenz, Zugang und Spielerschutz', localChecks: 'Praktische Prüfung vor der Registrierung', sports: 'Sportwetten, Rennen und Live-Wetten', area: 'Bereich', publicView: 'Öffentliches Angebot', limitation: 'Wichtige Einschränkung', live: 'Live-Wetten', racing: 'Pferderennen', bestFor: 'Für wen eignet sich Goldenbet?', compare: 'Für Spieler, die Casino und Sport vergleichen', careful: 'Für Nutzer, die Bedingungen sorgfältig prüfen', prosCons: 'Goldenbet: Vorteile und Nachteile', pros: 'Vorteile', cons: 'Nachteile', faqGames: 'Welche Spiele und Sportwetten bietet Goldenbet?', faqPayments: 'Was sollte ich vor einer Auszahlung prüfen?', faqPromos: 'Wie sollten Goldenbet-Aktionen bewertet werden?' },
  es: { regulation: 'Licencia, acceso y protección del jugador', localChecks: 'Comprobación práctica antes del registro', sports: 'Apuestas deportivas, carreras y directo', area: 'Área', publicView: 'Oferta pública', limitation: 'Limitación importante', live: 'Apuestas en directo', racing: 'Carreras de caballos', bestFor: '¿Para quién es Goldenbet?', compare: 'Para quien compara casino y deportes', careful: 'Para usuarios que revisan bien las condiciones', prosCons: 'Ventajas y desventajas de Goldenbet', pros: 'Ventajas', cons: 'Contras', faqGames: '¿Qué juegos y apuestas ofrece Goldenbet?', faqPayments: '¿Qué debo comprobar antes de retirar?', faqPromos: '¿Cómo se deben valorar las promociones de Goldenbet?' },
  it: { regulation: 'Licenza, accesso e tutela del giocatore', localChecks: 'Controllo pratico prima della registrazione', sports: 'Scommesse, corse e live betting', area: 'Area', publicView: 'Offerta pubblica', limitation: 'Limite importante', live: 'Scommesse live', racing: 'Corse dei cavalli', bestFor: 'Per chi è adatto Goldenbet?', compare: 'Per chi confronta casinò e sport', careful: 'Per utenti attenti alle condizioni', prosCons: 'Goldenbet: pro e contro', pros: 'Pro', cons: 'Contro', faqGames: 'Quali giochi e scommesse offre Goldenbet?', faqPayments: 'Cosa verificare prima di un prelievo?', faqPromos: 'Come valutare le promozioni Goldenbet?' },
  pl: { regulation: 'Licencja, dostęp i ochrona gracza', localChecks: 'Praktyczna kontrola przed rejestracją', sports: 'Zakłady, wyścigi i live betting', area: 'Obszar', publicView: 'Oferta publiczna', limitation: 'Ważne ograniczenie', live: 'Zakłady na żywo', racing: 'Wyścigi konne', bestFor: 'Dla kogo Goldenbet jest odpowiedni?', compare: 'Dla graczy porównujących kasyno i sport', careful: 'Dla osób uważnie czytających warunki', prosCons: 'Goldenbet: plusy i wady', pros: 'Plusy', cons: 'Wady', faqGames: 'Jakie gry i zakłady oferuje Goldenbet?', faqPayments: 'Co sprawdzić przed wypłatą?', faqPromos: 'Jak oceniać promocje Goldenbet?' },
  uk: { regulation: 'Ліцензія, доступ і захист гравців', localChecks: 'Практична перевірка до реєстрації', sports: 'Спортивні ставки, перегони та live', area: 'Розділ', publicView: 'Публічна пропозиція', limitation: 'Важливе обмеження', live: 'Live-ставки', racing: 'Кінні перегони', bestFor: 'Кому підійде Goldenbet?', compare: 'Для гравців, які порівнюють казино і спорт', careful: 'Для тих, хто уважно читає умови', prosCons: 'Goldenbet: переваги та недоліки', pros: 'Переваги', cons: 'Недоліки', faqGames: 'Які ігри та ставки пропонує Goldenbet?', faqPayments: 'Що перевірити перед виведенням?', faqPromos: 'Як оцінювати акції Goldenbet?' },
  pt: { regulation: 'Licença, acesso e proteção do jogador', localChecks: 'Verificação prática antes do registo', sports: 'Apostas, corridas e live', area: 'Área', publicView: 'Oferta pública', limitation: 'Limitação importante', live: 'Apostas ao vivo', racing: 'Corridas de cavalos', bestFor: 'Para quem é o Goldenbet?', compare: 'Para quem compara casino e desporto', careful: 'Para utilizadores atentos aos termos', prosCons: 'Goldenbet: prós e contras', pros: 'Prós', cons: 'Contras', faqGames: 'Que jogos e apostas oferece o Goldenbet?', faqPayments: 'O que verificar antes de levantar?', faqPromos: 'Como avaliar as promoções Goldenbet?' },
  fr: { regulation: 'Licence, accès et protection des joueurs', localChecks: 'Contrôle pratique avant inscription', sports: 'Paris sportifs, courses et direct', area: 'Rubrique', publicView: 'Offre publique', limitation: 'Limite importante', live: 'Paris en direct', racing: 'Courses hippiques', bestFor: 'À qui Goldenbet convient-il ?', compare: 'Pour comparer casino et paris sportifs', careful: 'Pour les joueurs attentifs aux conditions', prosCons: 'Goldenbet : avantages et inconvénients', pros: 'Avantages', cons: 'Inconvénients', faqGames: 'Quels jeux et paris propose Goldenbet ?', faqPayments: 'Que vérifier avant un retrait ?', faqPromos: 'Comment évaluer les promotions Goldenbet ?' },
  hi: { regulation: 'लाइसेंस, पहुँच और खिलाड़ी सुरक्षा', localChecks: 'पंजीकरण से पहले व्यावहारिक जाँच', sports: 'स्पोर्ट्स बेटिंग, रेसिंग और लाइव', area: 'खंड', publicView: 'सार्वजनिक पेशकश', limitation: 'महत्वपूर्ण सीमा', live: 'लाइव बेटिंग', racing: 'घुड़दौड़', bestFor: 'Goldenbet किसके लिए उपयुक्त है?', compare: 'कैसीनो और खेल की तुलना करने वाले खिलाड़ी', careful: 'शर्तें ध्यान से पढ़ने वाले उपयोगकर्ता', prosCons: 'Goldenbet के फायदे और नुकसान', pros: 'फायदे', cons: 'नुकसान', faqGames: 'Goldenbet कौन से गेम और बेटिंग देता है?', faqPayments: 'निकासी से पहले क्या जाँचें?', faqPromos: 'Goldenbet प्रमोशन का मूल्यांकन कैसे करें?' },
  fi: { regulation: 'Lisenssi, pääsy ja pelaajansuoja', localChecks: 'Käytännön tarkistus ennen rekisteröitymistä', sports: 'Vedonlyönti, ravit ja live-vedot', area: 'Alue', publicView: 'Julkinen tarjonta', limitation: 'Tärkeä rajoitus', live: 'Live-vedonlyönti', racing: 'Hevosurheilu', bestFor: 'Kenelle Goldenbet sopii?', compare: 'Kasinon ja vedonlyönnin vertailijalle', careful: 'Ehdot huolellisesti tarkistavalle', prosCons: 'Goldenbet: plussat ja miinukset', pros: 'Plussat', cons: 'Miinukset', faqGames: 'Mitä pelejä ja vedonlyöntiä Goldenbet tarjoaa?', faqPayments: 'Mitä tarkistaa ennen kotiutusta?', faqPromos: 'Miten Goldenbet-kampanjoita kannattaa arvioida?' },
};
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const finnishKeywords = {
  uk: 'Goldenbet UK arvostelu, Goldenbet UKGC lisenssi, Goldenbet bonus, Goldenbet kotiutus, Goldenbet kasino',
  au: 'Goldenbet Australia arvostelu, Goldenbet AU, Goldenbet bonus Australia, Goldenbet kotiutus, Goldenbet kasino',
};
const cards = items => `<div class="features-grid premium-grid">${items.map(([h, p]) => `<article class="feature-card glass-card"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>`;
const table = (heads, rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const section = (id, title, intro, body) => `<section class="container" id="${id}"><h2 class="title">${esc(title)}</h2>${intro ? `<p class="section-intro">${esc(intro)}</p>` : ''}${body}</section>`;

const replaceHead = (english, locale, market, copy) => {
  const route = `brands/goldenbet-${market}`;
  const canonical = `https://spincresta.com/${locale}/${route}/`;
  let head = english.slice(0, english.indexOf('<body'));
  head = head.replace(/<html lang="[^"]+">/, `<html lang="${copy.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(copy[market].title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(copy[market].description)}">`)
    .replace(/<meta name="keywords" content="[^"]*">/, match => locale === 'fi' ? `<meta name="keywords" content="${finnishKeywords[market]}">` : match)
    .replace(/<link rel="canonical" href="[^"]+">/, `<link rel="canonical" href="${canonical}">`)
    .replace(/<meta property="og:title" content="[^"]+">/, `<meta property="og:title" content="${esc(copy[market].title)}">`)
    .replace(/<meta property="og:description" content="[^"]+">/, `<meta property="og:description" content="${esc(copy[market].description)}">`)
    .replace(/<meta property="og:url" content="[^"]+">/, `<meta property="og:url" content="${canonical}">`)
    .replace(/<meta name="twitter:title" content="[^"]+">/, `<meta name="twitter:title" content="${esc(copy[market].title)}">`)
    .replace(/<meta name="twitter:description" content="[^"]+">/, `<meta name="twitter:description" content="${esc(copy[market].description)}">`)
    .replace(/<meta name="brand-snapshot-intro" content="[^"]+">/, `<meta name="brand-snapshot-intro" content="${esc(copy[market].description)}">`);
  const url = canonical;
  const graph = {'@context':'https://schema.org','@graph':[
    {'@type':'Organization','@id':'https://spincresta.com/#organization','name':'SpinCresta','url':'https://spincresta.com/'},
    {'@type':'WebPage','@id':`${url}#webpage`,'url':url,'name':copy[market].title,'description':copy[market].description,'inLanguage':copy.lang},
    {'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'SpinCresta','item':`https://spincresta.com/${locale}/`},{'@type':'ListItem','position':2,'name':copy[market].h1,'item':url}]},
    {'@type':'FAQPage','mainEntity':copy[market].faq.map(([q,a])=>({'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}}))},
  ]};
  return head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(graph)}</script>`);
};

for (const [locale, copy] of Object.entries(GOLDENBET_LOCALE_COPY)) {
  for (const market of ['uk', 'au']) {
    const sourceFile = `brands/goldenbet-${market}/index.html`;
    const targetFile = `${locale}/brands/goldenbet-${market}/index.html`;
    const english = fs.readFileSync(sourceFile, 'utf8');
    const previous = fs.readFileSync(targetFile, 'utf8');
    const header = previous.match(/<header class="header">[\s\S]*?<\/header>/)?.[0] || english.match(/<header class="header">[\s\S]*?<\/header>/)[0];
    const footer = (previous.match(/<footer class="footer">[\s\S]*?<\/footer>/)?.[0] || english.match(/<footer class="footer">[\s\S]*?<\/footer>/)[0]);
    const m = copy[market];
    const tl = tableLabels[locale];
    const sl = structuralLabels[locale];
    const features = copy.features.map(([h, p], i) => `<div class="feature-card glass-card"><div class="icon-placeholder">0${i + 1}</div><strong>${esc(h)}</strong><span>${esc(p)}</span></div>`).join('');
    const regulationCards = [
      ...m.verdict.map(([h, finding, note]) => [h, `${finding} ${note}`]),
      [sl.localChecks, m.verdictIntro],
    ];
    const gameCards = [...copy.games, [copy.features[2][0], copy.features[2][1]]];
    const supportCards = [...copy.safety, [copy.features[5][0], copy.features[5][1]]];
    const faq = [
      ...m.faq,
      [sl.faqGames, copy.gamesIntro],
      [sl.faqPayments, copy.cashierIntro],
      [sl.faqPromos, `${m.bonusIntro} ${m.bonuses[1][1]} ${m.bonuses[1][2]}`],
    ];
    const sportsRows = [
      [copy.games[2][0], copy.games[2][1], m.verdict[1][2]],
      [sl.live, copy.features[0][1], m.verdict[2][2]],
      [sl.racing, copy.features[0][1], m.verdict[0][2]],
      [copy.features[0][0], copy.features[0][1], m.verdict[0][2]],
    ];
    const verdictRows = [
      ...m.verdict,
      [copy.labels.cashier, copy.cashierIntro, m.verdict[0][2]],
      [copy.labels.safety, copy.features[5][1], m.verdict[2][2]],
    ];
    const bonusRows = [
      ...m.bonuses,
      [copy.features[1][0], copy.features[1][1], m.bonusIntro],
    ];
    const cashierRows = [
      ...copy.cashier,
      [copy.features[3][0], copy.features[3][1], copy.cashierIntro],
      [copy.features[4][0], copy.features[4][1], m.verdict[0][2]],
      [copy.labels.payments, copy.cashierIntro, copy.features[3][1]],
      [sl.localChecks, m.verdictIntro, m.verdict[0][2]],
    ];
    const prosCons = `<div class="features-grid premium-grid pros-cons-grid"><div class="feature-card glass-card"><strong>${esc(sl.pros)}</strong><span>- ${esc(copy.features[0][1])}</span><br /><span>- ${esc(copy.features[2][1])}</span><br /><span>- ${esc(copy.features[5][1])}</span></div><div class="feature-card glass-card"><strong>${esc(sl.cons)}</strong><span>- ${esc(m.verdict[0][1])}</span><br /><span>- ${esc(m.verdict[1][1])}</span><br /><span>- ${esc(m.verdict[2][1])}</span></div></div>`;
    const content = [
      section('goldenbet-verdict', m.verdictTitle, m.verdictIntro, table(tl.slice(0, 3), verdictRows)),
      section('goldenbet-regulation', sl.regulation, '', cards(regulationCards)),
      section('goldenbet-bonuses', m.bonusTitle, m.bonusIntro, table([tl[3], tl[4], tl[2]], bonusRows)),
      section('goldenbet-games', copy.labels.games, copy.gamesIntro, cards(gameCards)),
      section('goldenbet-sports', sl.sports, '', table([sl.area, sl.publicView, sl.limitation], sportsRows)),
      section('goldenbet-payments', copy.labels.cashier, copy.cashierIntro, table([tl[0], tl[4], tl[2]], cashierRows)),
      section('goldenbet-support', copy.labels.safety, '', cards(supportCards)),
      section('goldenbet-best-for', sl.bestFor, '', cards([[sl.compare, copy.features[0][1]], [sl.careful, m.verdictIntro]])),
      section('goldenbet-pros-cons', sl.prosCons, '', prosCons),
      section('goldenbet-faq', copy.labels.faq, '', `<div class="timeline">${faq.map(([q, a]) => `<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div>`),
      `<section class="container"><div class="final-cta-glass"><h2 class="title">${esc(copy.labels.final)}</h2><div class="view-all-wrapper"><a href="${affiliate[market]}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">${esc(copy.labels.cta)}</a></div></div></section>`,
    ].join('\n');
    const head = replaceHead(english, locale, market, copy);
    const html = `${head}<body data-brand="goldenbet-${market}" data-language="${locale}">
${header}
<section class="hero container"><div class="hero-content glass-card"><div class="brand-logo-container hero-logo"><img class="brand-logo" src="/images/goldenbet.svg" alt="Goldenbet" width="640" height="320" loading="eager" fetchpriority="high" decoding="async" /></div><h1>${esc(m.h1)}</h1><p class="hero-subtitle">${esc(m.intro)}</p><p class="hero-subtitle editorial-meta">${esc(copy.labels.editorial)}</p><div class="hero-cta-wrapper"><a href="${affiliate[market]}" class="cta-brands" target="_blank" rel="noopener noreferrer nofollow sponsored">${esc(copy.labels.cta)}</a></div></div></section>
<section class="container features-section glass-section" id="brand-why-section"><div class="brand-why-heading"><h2 class="title">${esc(copy.labels.why)}</h2><button class="brand-why-media" type="button" aria-expanded="false" aria-controls="brand-why-section" aria-label="Goldenbet"><img src="${screenshot}" alt="Goldenbet" width="3024" height="1576" loading="eager" fetchpriority="high" decoding="async" /></button></div><div class="features-grid premium-grid">${features}</div></section>
<section class="container"><div class="brand-countries"><h2 class="title">${esc(copy.labels.countries)}</h2><div class="countries-container" id="brand-countries"></div></div></section>
<section class="container"><div class="brand-payments"><h2 class="title">${esc(copy.labels.payments)}</h2><div class="payments-container" id="brand-payments"></div></div></section>
<main class="content-review">${content}</main>
<section class="all-countries"><div class="container"><h2 class="title">${esc(copy.labels.allCountries)}</h2><div class="countries-cloud"></div></div></section>
${footer}
<script type="module" src="/scripts/main.js?v=20260929-goldenbet-parity-2"></script>
</body></html>`;
    fs.writeFileSync(targetFile, html);
    console.log(`Built ${targetFile}`);
  }
}
