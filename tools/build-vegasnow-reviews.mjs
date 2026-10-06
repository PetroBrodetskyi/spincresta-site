import fs from 'node:fs';
import assert from 'node:assert/strict';
import { VEGASNOW_COPY } from './vegasnow-review-copy.mjs';
import { BRANDS } from '../scripts/brands.js';

// Reuse the existing Vegas Now shell and shared review components, not another
// brand's financial/legal facts. No automated translation or global CSS edits.
const locales = ['en','de','es','it','pl','uk','pt','fr','hi','fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const version = '20261006-vegasnow-2';
const brand = BRANDS.find(item => item.name === 'Vegas Now');
const expectedGeos = ['AU','CA','NZ','AT','CH','NO','SE','FI','DK','IS'];
assert.deepEqual(brand.countries, expectedGeos);
assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=121066');
const esc = value => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
const cards = rows => `<div class="features-grid premium-grid">${rows.map(([h,p]) => `<article class="feature-card glass-card"><h3>${esc(h)}</h3><p>${esc(p)}</p></article>`).join('')}</div>`;
const table = (heads,rows) => `<div class="table-wrap"><table><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(v=>`<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const withdraw = {
  en: ['Withdrawal methods','Interac CA$30–4,000; cards, Skrill and Neteller €20–4,000','MiFinity €20–2,500; Inpay/Fixipay bank transfers €200–4,000. These are published transaction limits, not a payout-time guarantee.'],
  de: ['Auszahlungsmethoden','Interac CA$30–4.000; Karten, Skrill und Neteller €20–4.000','MiFinity €20–2.500; Banküberweisungen Inpay/Fixipay €200–4.000. Veröffentlichte Transaktionsgrenzen, keine Zusage einer Auszahlungsdauer.'],
  es: ['Métodos de retiro','Interac CA$30–4.000; tarjetas, Skrill y Neteller €20–4.000','MiFinity €20–2.500; transferencias Inpay/Fixipay €200–4.000. Límites publicados por operación, no garantía de plazo.'],
  it: ['Metodi di prelievo','Interac CA$30–4.000; carte, Skrill e Neteller €20–4.000','MiFinity €20–2.500; bonifici Inpay/Fixipay €200–4.000. Limiti pubblicati per operazione, non garanzie sui tempi.'],
  pl: ['Metody wypłaty','Interac CA$30–4 000; karty, Skrill i Neteller €20–4 000','MiFinity €20–2 500; przelewy Inpay/Fixipay €200–4 000. Opublikowane limity transakcji, nie gwarancja czasu realizacji.'],
  uk: ['Способи виведення','Interac CA$30–4 000; картки, Skrill і Neteller €20–4 000','MiFinity €20–2 500; перекази Inpay/Fixipay €200–4 000. Опубліковані межі операцій, не гарантія строку виплати.'],
  pt: ['Métodos de levantamento','Interac CA$30–4 000; cartões, Skrill e Neteller €20–4 000','MiFinity €20–2 500; transferências Inpay/Fixipay €200–4 000. Limites publicados por operação, não garantia de prazo.'],
  fr: ['Moyens de retrait','Interac CA$30–4 000 ; cartes, Skrill et Neteller €20–4 000','MiFinity €20–2 500 ; virements Inpay/Fixipay €200–4 000. Limites publiées par opération, pas une garantie de délai.'],
  hi: ['निकासी के तरीके','Interac CA$30–4,000; कार्ड, Skrill और Neteller €20–4,000','MiFinity €20–2,500; Inpay/Fixipay बैंक ट्रांसफ़र €200–4,000। प्रकाशित लेनदेन सीमाएँ हैं, समय की गारंटी नहीं।'],
  fi: ['Kotiutustavat','Interac CA$30–4 000; kortit, Skrill ja Neteller €20–4 000','MiFinity €20–2 500; Inpay/Fixipay-siirrot €200–4 000. Julkaistut tapahtumarajat, eivät aikataulutakuu.'],
};
const eligibility = {
  en: 'Bonus rules exclude Bulgaria, North Macedonia, Moldova, the Philippines, Sierra Leone, Spain, Belarus and Ukraine. A residency-based exception may require proof of address. Country eligibility and local law remain separate checks.',
  de: 'Die Bonusregeln schließen Bulgarien, Nordmazedonien, Moldau, die Philippinen, Sierra Leone, Spanien, Belarus und die Ukraine aus. Eine Ausnahme nach Wohnsitz kann einen Adressnachweis erfordern. Länderzulassung und örtliches Recht separat prüfen.',
  es: 'Las reglas de bono excluyen Bulgaria, Macedonia del Norte, Moldavia, Filipinas, Sierra Leona, España, Bielorrusia y Ucrania. Una excepción por residencia puede exigir justificante de domicilio. Comprueba por separado acceso y normativa local.',
  it: 'Le regole bonus escludono Bulgaria, Macedonia del Nord, Moldova, Filippine, Sierra Leone, Spagna, Bielorussia e Ucraina. Un’eccezione legata alla residenza può richiedere prova dell’indirizzo. Verifica separatamente accesso e legge locale.',
  pl: 'Warunki bonusów wykluczają Bułgarię, Macedonię Północną, Mołdawię, Filipiny, Sierra Leone, Hiszpanię, Białoruś i Ukrainę. Wyjątek związany z miejscem zamieszkania może wymagać potwierdzenia adresu. Osobno sprawdź dostęp i lokalne przepisy.',
  uk: 'Бонусні правила виключають Україну, Болгарію, Північну Македонію, Молдову, Філіппіни, Сьєрра-Леоне, Іспанію та Білорусь. Для громадян, які живуть у дозволеній країні, можливий виняток із підтвердженням адреси. Доступність і місцеві вимоги перевіряйте окремо.',
  pt: 'As regras de bónus excluem Bulgária, Macedónia do Norte, Moldávia, Filipinas, Serra Leoa, Espanha, Bielorrússia e Ucrânia. Uma exceção por residência pode exigir prova de morada. Verifique separadamente acesso e lei local.',
  fr: 'Les règles de bonus excluent Bulgarie, Macédoine du Nord, Moldavie, Philippines, Sierra Leone, Espagne, Biélorussie et Ukraine. Une exception liée à la résidence peut nécessiter un justificatif de domicile. Vérifiez séparément accès et droit local.',
  hi: 'बोनस नियम बुल्गारिया, उत्तर मैसेडोनिया, मोल्दोवा, फ़िलिपींस, सिएरा लियोन, स्पेन, बेलारूस और यूक्रेन को बाहर रखते हैं। निवास के आधार पर अपवाद के लिए पते का प्रमाण माँगा जा सकता है। पात्रता और स्थानीय कानून अलग से जाँचें।',
  fi: 'Bonusehdot sulkevat pois Bulgarian, Pohjois-Makedonian, Moldovan, Filippiinit, Sierra Leonen, Espanjan, Valko-Venäjän ja Ukrainan. Asuinpaikkaan perustuva poikkeus voi vaatia osoitetodistuksen. Tarkista erikseen pääsyoikeus ja paikallinen laki.',
};
const plus = {en:'Pros',de:'Vorteile',es:'Ventajas',it:'Pro',pl:'Plusy',uk:'Переваги',pt:'Prós',fr:'Avantages',hi:'फायदे',fi:'Plussat'};
const minus = {en:'Cons',de:'Nachteile',es:'Contras',it:'Contro',pl:'Wady',uk:'Недоліки',pt:'Contras',fr:'Inconvénients',hi:'नुकसान',fi:'Miinukset'};
const spinLabels = {en:'free spins',de:'Freispiele',es:'giros gratis',it:'giri gratuiti',pl:'darmowych spinów',uk:'фриспінів',pt:'jogadas grátis',fr:'tours gratuits',hi:'फ़्री स्पिन',fi:'ilmaiskierrosta'};
const gameTitles = {en:'New Games',de:'Neue Spiele',es:'Juegos nuevos',it:'Nuovi giochi',pl:'Nowe gry',uk:'Нові ігри',pt:'Novos jogos',fr:'Nouveaux jeux',hi:'नए गेम',fi:'Uudet pelit'};
const gameKickers = {en:'GAME SCREENSHOTS',de:'SPIEL-SCREENSHOTS',es:'CAPTURAS DE JUEGOS',it:'SCHERMATE DEI GIOCHI',pl:'ZDJĘCIA GIER',uk:'СКРІНШОТИ ІГОР',pt:'CAPTURAS DOS JOGOS',fr:'CAPTURES DE JEUX',hi:'गेम स्क्रीनशॉट',fi:'PELIKUVAT'};
const profitCaps = {
  en:['Daily profit cap','US$50,000 equivalent per UTC day','General terms allow winnings above this cap to be voided. This is separate from bonus cash-out caps and withdrawal limits. NOK withdrawals: 40,000/day, 80,000/week, 300,000/month.'],
  de:['Tägliche Gewinngrenze','US$50.000 Gegenwert pro UTC-Tag','Laut AGB können darüber hinausgehende Gewinne gestrichen werden. Separat von Bonus- und Auszahlungslimits. NOK-Auszahlungen: 40.000/Tag, 80.000/Woche, 300.000/Monat.'],
  es:['Límite diario de ganancias','Equivalente a US$50.000 por día UTC','Las condiciones permiten anular las ganancias que superen ese límite. Es distinto de los topes de bono y retiro. Retiros en NOK: 40.000/día, 80.000/semana, 300.000/mes.'],
  it:['Limite giornaliero delle vincite','Equivalente a US$50.000 per giorno UTC','I termini consentono di annullare le vincite oltre il limite. È distinto dai limiti del bonus e dei prelievi. Prelievi in NOK: 40.000/giorno, 80.000/settimana, 300.000/mese.'],
  pl:['Dzienny limit wygranych','Równowartość US$50 000 na dobę UTC','Regulamin pozwala anulować wygrane powyżej tego limitu. Jest on odrębny od limitów bonusu i wypłat. Wypłaty w NOK: 40 000/dzień, 80 000/tydzień, 300 000/miesiąc.'],
  uk:['Добова межа виграшу','Еквівалент US$50 000 за добу UTC','За загальними правилами виграш понад цю межу можуть анулювати. Це окреме обмеження, не ліміт бонусу чи виведення. Виведення в NOK: 40 000/день, 80 000/тиждень, 300 000/місяць.'],
  pt:['Limite diário de ganhos','Equivalente a US$50 000 por dia UTC','As condições permitem anular os ganhos acima deste limite. É distinto dos limites do bónus e dos levantamentos. Levantamentos em NOK: 40 000/dia, 80 000/semana, 300 000/mês.'],
  fr:['Plafond quotidien des gains','Équivalent de US$50 000 par jour UTC','Les conditions permettent d’annuler les gains excédentaires. Ce plafond est distinct de ceux des bonus et des retraits. Retraits en NOK : 40 000/jour, 80 000/semaine, 300 000/mois.'],
  hi:['रोज़ की जीत की सीमा','प्रति UTC दिन US$50,000 के बराबर','सामान्य नियम इस सीमा से ऊपर की जीत रद्द करने की अनुमति देते हैं। यह बोनस और निकासी की सीमाओं से अलग है। NOK में निकासी: रोज़ 40,000, सप्ताह 80,000, महीने 300,000।'],
  fi:['Päivittäinen voittoraja','US$50 000:n vastine UTC-vuorokaudessa','Ehdot sallivat rajan ylittävien voittojen mitätöinnin. Erillinen bonus- ja kotiutusrajoista. NOK-kotiutukset: 40 000/päivä, 80 000/viikko, 300 000/kuukausi.'],
};
const figures = [[150,1500,200],[100,2000,50],[50,2000,50],[25,2500,200]];

// FAQs reuse the corresponding native text so that later fact corrections
// cannot silently diverge between the review body and structured data.
export const getVegasNowFaq = (locale,c=VEGASNOW_COPY[locale]) => c.faq || c.faqQuestions.map((q,i)=>[q,[
  [c.bonusIntro,...c.stage.map((label,n)=>`${label}: ${figures[n][0]}% · €/$${new Intl.NumberFormat(locale).format(figures[n][1])} + ${figures[n][2]} ${spinLabels[locale]}.`)].join(' '),
  c.offerNotes.join(' ')+' '+c.bonusIntro,
  c.rules[0].slice(1).join('. ')+'. '+c.rules[2].slice(1).join('. '),
  c.rules[5].slice(1).join('. ')+'. '+c.rules[6].slice(1).join('. '),
  c.cashier[0].slice(1).join('. ')+'. '+withdraw[locale].slice(1).join('. '),
  c.cashier[3].slice(1).join('. '),
  c.safety[0],c.safety[2],
][i]]);

for (const locale of locales) {
  const c=VEGASNOW_COPY[locale];
  assert(c && c.features.length===6 && c.rules.length===8 && c.cashier.length===6 && c.headings.length===11,`${locale}: incomplete native copy`);
  const file=`${prefix(locale)}brands/vegasnow/index.html`;
  let html=fs.readFileSync(file,'utf8');
  const url=`https://spincresta.com/${prefix(locale)}brands/vegasnow/`;
  const section=(id,i,content)=>`<section class="container" id="${id}"><h2 class="title">${esc(c.headings[i])}</h2>${content}</section>`;
  const intro=text=>`<p class="section-intro">${esc(text)}</p>`;
  const faq=getVegasNowFaq(locale);
  const offerRows=c.stage.map((label,i)=>[label,`${figures[i][0]}% · €/$${new Intl.NumberFormat(locale).format(figures[i][1])} + ${figures[i][2]} ${spinLabels[locale]}`,c.offerNotes[i]]);
  const cashRows=[...c.cashier.slice(0,3),withdraw[locale],c.cashier[3],profitCaps[locale],...c.cashier.slice(4)];
  const main=section('vegasnow-verdict',0,intro(c.verdict)+table(c.tableHeads.slice(0,2),c.features.slice(1,5)))
    +section('vegasnow-bonus',1,intro(c.bonusIntro)+table(c.tableHeads,offerRows))
    +section('vegasnow-wagering',2,table(c.tableHeads,c.rules)+intro(eligibility[locale]))
    +section('casino-lobby',3,cards(c.games.slice(0,2)))
    // Shared brand layout places casino-lobby in the left rail and this second
    // feature section in the right rail. On smaller screens both return inline.
    +`<section class="container" id="sports-betting"><h2 class="title">${esc(c.games[2][0])}</h2><div class="features-grid premium-grid"><article class="feature-card glass-card"><h3>${esc(c.features[4][0])}</h3><p>${esc(c.features[4][1])}</p><p>${esc(c.games[2][1])}</p></article></div></section>`
    +section('vegasnow-rewards',4,table(c.tableHeads.slice(0,2),c.rewards))
    +section('vegasnow-payments',5,table(c.tableHeads,cashRows))
    +section('vegasnow-license',6,intro(c.safety[0]))
    +section('vegasnow-support',7,intro(c.safety[1]))
    +section('vegasnow-responsible',8,intro(c.safety[2]))
    +section('pros-cons',9,`<div class="features-grid premium-grid pros-cons-grid">${[c.pros,c.cons].map((items,i)=>`<article class="feature-card glass-card"><strong>${esc(i?minus[locale]:plus[locale])}</strong><ul>${items.map(item=>`<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div>`)
    +section('faq',10,`<div class="timeline">${faq.map(([q,a])=>`<h3>${esc(q)}</h3><p>${esc(a)}</p>`).join('')}</div>`);
  html=html.replace(/<main class="content-review">[\s\S]*?<\/main>/,`<main class="content-review">${main}</main>`)
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${esc(c.title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g,(_,a,b)=>a+esc(c.description)+b)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*("\s*\/?>)/g,(_,a,b)=>a+esc(c.title)+b)
    .replace(/<meta name="robots"[^>]*>/,'<meta name="robots" content="index, follow, max-image-preview:large" />')
    .replace(/<meta property="og:type"[^>]*>/,'<meta property="og:type" content="article" />')
    .replace(/<h1>[\s\S]*?<\/h1>/,`<h1>${esc(c.h1)}</h1>`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/,`<p class="hero-subtitle">${esc(c.intro)}</p>`)
    .replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/,`<p class="hero-subtitle editorial-meta">${esc(c.editorial)}</p>`)
    .replace(/(<div class="brand-why-heading">\s*<h2 class="title">)[\s\S]*?(<\/h2>)/,(_,a,b)=>a+esc(c.why)+b)
    .replace(/(<link rel="stylesheet" href="\/styles.css\?v=)[^"]+/,`$1${version}`)
    .replace(/(<script type="module" src="\/scripts\/main.js\?v=)[^"]+/,`$1${version}`);
  const meta=`<meta name="brand-snapshot-intro" content="${esc(c.snapshot)}" />`;
  html=/<meta name="brand-snapshot-intro"/.test(html) ? html.replace(/<meta name="brand-snapshot-intro"[^>]*>/,meta) : html.replace('<meta name="theme-color"',`${meta}\n    <meta name="theme-color"`);
  // Use the site's New Games heading for the uploaded game cards. Optional
  // labels leave every other brand's defaults intact.
  for (const [name,value] of [['brand-games-title',gameTitles[locale]],['brand-games-kicker',gameKickers[locale]]]) {
    const tag=`<meta name="${name}" content="${esc(value)}" />`;
    const pattern=new RegExp(`<meta name="${name}"[^>]*>`);
    html=pattern.test(html)?html.replace(pattern,tag):html.replace('<meta name="theme-color"',`${tag}\n    <meta name="theme-color"`);
  }
  let feature=0;
  html=html.replace(/<div class="feature-card glass-card">\s*<div class="icon-placeholder">[\s\S]*?<\/div>\s*<strong>[\s\S]*?<\/strong>\s*<span>[\s\S]*?<\/span>\s*<\/div>/g,()=>{
    const [h,p]=c.features[feature++];
    return `<div class="feature-card glass-card"><div class="icon-placeholder">${String(feature).padStart(2,'0')}</div><strong>${esc(h)}</strong><span>${esc(p)}</span></div>`;
  });
  assert.equal(feature,6,`${locale}: highlight count`);
  html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(_,open,json,close)=>{
    const schema=JSON.parse(json), graph=schema['@graph'];
    const page=graph.find(n=>n['@type']==='WebPage');
    Object.assign(page,{name:c.title,description:c.description,dateModified:'2026-10-06'});
    graph.find(n=>n['@type']==='BreadcrumbList').itemListElement.at(-1).name=c.h1;
    graph.find(n=>n['@type']==='FAQPage').mainEntity=faq.map(([q,a])=>({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));
    const person={'@type':'Person','@id':'https://spincresta.com/authors/odri-chambers/#person',name:'Odri Chambers',url:'https://spincresta.com/authors/odri-chambers/'};
    const article={'@type':'Article','@id':url+'#article',headline:c.title,description:c.description,image:html.match(/<meta property="og:image" content="([^"]+)"/)[1],datePublished:'2026-03-09',dateModified:'2026-10-06',inLanguage:locale,author:{'@id':person['@id']},publisher:{'@id':'https://spincresta.com/#organization'},mainEntityOfPage:{'@id':url+'#webpage'},about:{'@type':'Thing',name:'Vegas Now'}};
    for (const node of [person,article]) {
      const found=graph.findIndex(n=>n['@type']===node['@type']);
      if (found===-1) graph.push(node); else graph[found]=node;
    }
    return open+JSON.stringify(schema)+close;
  });
  // Remove the obsolete generic closing sales pitch; shared layout does this at
  // runtime too, but crawlers should not see its stale localized wording.
  html=html.replace(/<section class="container">\s*<div class="final-cta-glass">[\s\S]*?<\/section>/,'');
  assert(!/noindex|Gravira|National Casino|coming soon|AggregateRating|\uFFFD/i.test(html),file);
  fs.writeFileSync(file,html.trim()+'\n');
  console.log(`Updated ${file}`);
}
