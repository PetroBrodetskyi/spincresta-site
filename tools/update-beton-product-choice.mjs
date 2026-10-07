import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

// Product navigation is an audience/choice card, not sportsbook coverage.
// The shared #best-for behavior moves it left at 901px and restores it inline
// on mobile. Reuse the site's internal-review button without brand-specific CSS.
export const BETON_PRODUCT_CHOICE = {
  en: {
    title: 'Casino or Sportsbook?', casino: 'BetOn Casino',
    casinoText: 'Slots, live dealer games, casino bonuses, loyalty rewards, and game providers.',
    sport: 'Looking for Sports Betting?',
    sportText: 'Live betting, soccer, NBA, NHL, esports, and sportsbook promotions.',
    link: 'BetOn Sport review',
  },
  de: {
    title: 'Casino oder Sportwetten?', casino: 'BetOn Casino',
    casinoText: 'Slots, Live-Casino, Casinoboni, Treueprämien und Spieleanbieter.',
    sport: 'Lieber Sportwetten?',
    sportText: 'Live-Wetten, Fußball, NBA, NHL, E-Sport und Sportwettenaktionen.',
    link: 'BetOn Sport im Überblick',
  },
  es: {
    title: '¿Casino o apuestas deportivas?', casino: 'BetOn Casino',
    casinoText: 'Tragamonedas, casino en vivo, bonos de casino, recompensas de fidelidad y proveedores de juegos.',
    sport: '¿Prefieres las apuestas deportivas?',
    sportText: 'Apuestas en vivo, fútbol, NBA, NHL, esports y promociones deportivas.',
    link: 'Reseña de BetOn Sport',
  },
  it: {
    title: 'Casinò o scommesse sportive?', casino: 'BetOn Casino',
    casinoText: 'Slot, casinò dal vivo, bonus casinò, premi fedeltà e fornitori di giochi.',
    sport: 'Preferisci le scommesse sportive?',
    sportText: 'Scommesse live, calcio, NBA, NHL, eSport e promozioni sportive.',
    link: 'Recensione di BetOn Sport',
  },
  pl: {
    title: 'Kasyno czy zakłady sportowe?', casino: 'BetOn Casino',
    casinoText: 'Automaty, kasyno na żywo, bonusy kasynowe, nagrody lojalnościowe i dostawcy gier.',
    sport: 'Wolisz zakłady sportowe?',
    sportText: 'Zakłady na żywo, piłka nożna, NBA, NHL, esport i promocje sportowe.',
    link: 'Recenzja BetOn Sport',
  },
  uk: {
    title: 'Казино чи ставки на спорт?', casino: 'BetOn Casino',
    casinoText: 'Слоти, ігри з живими дилерами, бонуси казино, винагороди за лояльність та провайдери ігор.',
    sport: 'Цікавлять ставки на спорт?',
    sportText: 'Live-ставки, футбол, NBA, NHL, кіберспорт і спортивні акції.',
    link: 'Огляд BetOn Sport',
  },
  pt: {
    title: 'Casino ou apostas desportivas?', casino: 'BetOn Casino',
    casinoText: 'Slots, casino ao vivo, bónus de casino, prémios de fidelidade e fornecedores de jogos.',
    sport: 'Prefere apostas desportivas?',
    sportText: 'Apostas ao vivo, futebol, NBA, NHL, esports e promoções desportivas.',
    link: 'Análise da BetOn Sport',
  },
  fr: {
    title: 'Casino ou paris sportifs ?', casino: 'BetOn Casino',
    casinoText: 'Machines à sous, casino en direct, bonus de casino, récompenses de fidélité et fournisseurs de jeux.',
    sport: 'Vous préférez les paris sportifs ?',
    sportText: 'Paris en direct, football, NBA, NHL, esport et promotions sportives.',
    link: 'Avis sur BetOn Sport',
  },
  hi: {
    title: 'कैसीनो या स्पोर्ट्सबुक?', casino: 'BetOn Casino',
    casinoText: 'स्लॉट, लाइव डीलर गेम, कैसीनो बोनस, लॉयल्टी रिवॉर्ड और गेम प्रदाता।',
    sport: 'स्पोर्ट्स बेटिंग में रुचि है?',
    sportText: 'लाइव बेटिंग, फ़ुटबॉल, NBA, NHL, ईस्पोर्ट्स और स्पोर्ट्स प्रमोशन।',
    link: 'BetOn Sport की समीक्षा',
  },
  fi: {
    title: 'Kasino vai vedonlyönti?', casino: 'BetOn Casino',
    casinoText: 'Kolikkopelit, live-kasino, kasinobonukset, kanta-asiakaspalkinnot ja pelintarjoajat.',
    sport: 'Kiinnostaako urheiluvedonlyönti?',
    sportText: 'Live-vedonlyönti, jalkapallo, NBA, NHL, e-urheilu ja vedonlyöntitarjoukset.',
    link: 'BetOn Sport -arvostelu',
  },
};

const escape = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export function updateBetonProductChoice(html, locale) {
  const copy = BETON_PRODUCT_CHOICE[locale];
  assert.ok(copy, `Unknown locale: ${locale}`);
  const prefix = locale === 'en' ? '' : `${locale}/`;
  const matches = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)].filter(match =>
    match[0].includes(`href="/${prefix}brands/beton-sport/"`) && match[0].includes('features-grid')
  );
  assert.equal(matches.length, 1, `${locale}: one product-choice section`);
  const section = `<section class="container" id="best-for">
        <h2 class="title">${escape(copy.title)}</h2>
        <div class="features-grid premium-grid">
          <div class="feature-card glass-card"><strong>${escape(copy.casino)}</strong><span>${escape(copy.casinoText)}</span></div>
          <div class="feature-card glass-card"><strong>${escape(copy.sport)}</strong><span>${escape(copy.sportText)}</span><a href="/${prefix}brands/beton-sport/" class="view-all">${escape(copy.link)}</a></div>
        </div>
      </section>`;
  return html.replace(matches[0][0], section);
}

// Patch output keeps changes reviewable and applies through apply_patch.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const patches = [];
  for (const locale of Object.keys(BETON_PRODUCT_CHOICE)) {
    const file = `${locale === 'en' ? '' : `${locale}/`}brands/beton/index.html`;
    const before = fs.readFileSync(file, 'utf8');
    const after = updateBetonProductChoice(before, locale);
    if (before === after) continue;
    const a = before.split('\n'), b = after.split('\n');
    let first = 0;
    while (a[first] === b[first]) first++;
    let lastA = a.length - 1, lastB = b.length - 1;
    while (a[lastA] === b[lastB]) { lastA--; lastB--; }
    const start = Math.max(0, first - 1);
    patches.push(`*** Update File: ${file}\n@@\n` + a.slice(start, first).map(line => ' ' + line).join('\n') + '\n' + a.slice(first, lastA + 1).map(line => '-' + line).join('\n') + '\n' + b.slice(first, lastB + 1).map(line => '+' + line).join('\n') + '\n ' + a[lastA + 1] + '\n');
  }
  if (process.argv.includes('--check')) {
    console.log(`BetOn product choice: 10 pages checked, ${patches.length} pending updates.`);
    if (patches.length) process.exitCode = 1;
  } else if (patches.length) console.log('*** Begin Patch\n' + patches.join('') + '*** End Patch');
}
