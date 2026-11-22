const copy = {
  en: ['Choose a country', 'Read the country guide', 'Show all rankings'],
  de: ['Land auswählen', 'Länder-Guide lesen', 'Alle Rankings anzeigen'],
  es: ['Elige un país', 'Leer la guía del país', 'Ver todas las clasificaciones'],
  it: ['Scegli un paese', 'Leggi la guida del paese', 'Mostra tutte le classifiche'],
  pl: ['Wybierz kraj', 'Przeczytaj przewodnik po kraju', 'Pokaż wszystkie rankingi'],
  uk: ['Оберіть країну', 'Переглянути гід країни', 'Показати всі рейтинги'],
  pt: ['Escolha um país', 'Ler o guia do país', 'Ver todas as classificações'],
  fr: ['Choisissez un pays', 'Lire le guide du pays', 'Afficher tous les classements'],
  hi: ['देश चुनें', 'देश की गाइड पढ़ें', 'सभी रैंकिंग दिखाएँ'],
  fi: ['Valitse maa', 'Lue maaopas', 'Näytä kaikki rankingit'],
};

const editorialCopy = {
  en: ['How we rank casinos', 'We compare casinos within each country. A high ranking doesn’t mean a casino suits every player.', 'Bonuses, currencies, payment methods, and games can vary by country. Check the country guide and current terms before depositing.'],
  de: ['Wie wir Casinos bewerten', 'Wir vergleichen Casinos für jedes Land einzeln. Auch ein hoch platziertes Casino passt nicht zu allen Spielern.', 'Boni, Währungen, Zahlungsmethoden und Spiele können sich je nach Land unterscheiden. Prüfen Sie vor der Einzahlung den Länder-Guide und die aktuellen Bedingungen.'],
  es: ['Cómo clasificamos los casinos', 'Comparamos los casinos de cada país por separado. Una buena posición no significa que el casino sea adecuado para todos.', 'Los bonos, las monedas, los métodos de pago y los juegos pueden variar según el país. Consulta la guía de tu país y las condiciones vigentes antes de depositar.'],
  it: ['Come valutiamo i casinò', 'Confrontiamo i casinò paese per paese. Un buon piazzamento non significa che un casinò sia adatto a tutti.', 'Bonus, valute, metodi di pagamento e giochi possono variare da paese a paese. Prima di depositare, consulta la guida del tuo paese e le condizioni aggiornate.'],
  pl: ['Jak tworzymy ranking kasyn', 'Porównujemy kasyna osobno dla każdego kraju. Wysokie miejsce nie oznacza, że dane kasyno odpowiada każdemu graczowi.', 'Bonusy, waluty, metody płatności i gry mogą się różnić w zależności od kraju. Przed wpłatą sprawdź przewodnik po swoim kraju i aktualne warunki.'],
  uk: ['Як ми складаємо рейтинг казино', 'Ми порівнюємо казино окремо для кожної країни. Високе місце в рейтингу не означає, що казино підійде кожному.', 'Бонуси, валюти, способи оплати й ігри можуть відрізнятися залежно від країни. Перед поповненням перегляньте гід для своєї країни й актуальні умови.'],
  pt: ['Como avaliamos os casinos', 'Comparamos os casinos de cada país separadamente. Uma boa posição não significa que o casino seja adequado para todos os jogadores.', 'Os bónus, as moedas, os métodos de pagamento e os jogos podem variar de país para país. Consulte o guia do seu país e as condições em vigor antes de depositar.'],
  fr: ['Comment nous classons les casinos', 'Nous comparons les casinos pays par pays. Une bonne place au classement ne signifie pas qu’un casino convient à tout le monde.', 'Les bonus, les devises, les moyens de paiement et les jeux peuvent varier selon le pays. Avant de déposer, consultez le guide de votre pays et les conditions en vigueur.'],
  hi: ['हम कैसीनो की रैंकिंग कैसे तय करते हैं', 'हम हर देश के कैसीनो की अलग से तुलना करते हैं। ऊँची रैंक का मतलब यह नहीं कि वह कैसीनो हर खिलाड़ी के लिए सही है।', 'बोनस, मुद्राएँ, भुगतान के तरीके और गेम देश के अनुसार बदल सकते हैं। पैसा जमा करने से पहले अपने देश की गाइड और मौजूदा शर्तें देखें।'],
  fi: ['Miten vertailemme nettikasinoita', 'Vertailemme kasinoita maittain. Hyvä sijoitus ei tarkoita, että kasino sopii kaikille pelaajille.', 'Bonukset, valuutat, maksutavat ja pelit voivat vaihdella maittain. Tarkista oman maasi opas ja voimassa olevat ehdot ennen talletusta.'],
};

export function syncTopCasinoEditorial(html, locale) {
  const [heading, intro] = editorialCopy[locale] || editorialCopy.en;
  return html.replace(/\n[ \t]*<section\b[^>]*>[\s\S]*?<\/section>/g, section => {
    const opening = section.match(/<section\b[^>]*>/)?.[0] || '';
    if (!/\bclass="[^"]*\btop-casinos-method\b/.test(opening)) {
      return /\bid="seo-editorial-guide"|\bclass="[^"]*\btop-casinos-reading-guide\b/.test(opening) ? '' : section;
    }

    const withAnchor = opening.includes('id="seo-editorial-guide"')
      ? section : section.replace(opening, opening.slice(0, -1) + ' id="seo-editorial-guide">');
    const withCopy = withAnchor.replace(
      /(<h2 id="top-casinos-method-title">)[\s\S]*?(<\/h2>\s*<\/div>\s*)<p>[\s\S]*?<\/p>/,
      (_, start, end) => `${start}${heading}${end}<p>${intro}</p>`
    );
    return locale === 'en' ? withCopy.replace('operator and licence information', 'operator and license information') : withCopy;
  });
}

export function syncTopCasinoMarkets(html, locale, links) {
  const [heading, guide, reset] = copy[locale] || copy.en;
  const [, , marketHint] = editorialCopy[locale] || editorialCopy.en;
  const cloud = `      <!-- top-casino-picker:start -->
      <nav id="top-casino-markets" class="market-country-picker" aria-labelledby="top-casino-market-title" aria-describedby="top-casino-market-hint">
        <h2 id="top-casino-market-title">${heading}</h2>
        <p id="top-casino-market-hint">${marketHint}</p>
        <div id="top-casino-country-links" class="countries-cloud" data-top-casino-markets>
${links}
        </div>
      </nav>
      <!-- top-casino-picker:end -->`;
  const results = `        <!-- top-casino-results:start -->
        <div class="top-casino-results" data-top-casino-results>
          <button class="top-casino-reset" type="button" data-top-casino-reset hidden>${reset}</button>
          <div class="top-casino-rankings" data-top-casino-rankings></div>
          <template data-top-casino-ranking-template>
            <section class="content top-casino-ranking">
              <div class="cards-main">
                <h2 class="top-country-title" tabindex="-1"></h2>
                <div class="casino-grid"></div>
                <div class="view-all-wrapper">
                  <a class="view-all">${guide}</a>
                </div>
              </div>
            </section>
          </template>
        </div>
        <!-- top-casino-results:end -->`;

  return syncTopCasinoEditorial(html, locale)
    .replace(/\n[ \t]*<div class="top-casinos-hero-actions">[\s\S]*?<\/div>/, '')
    .replace(/\n[ \t]*<!-- (top-casino-picker|top-casino-results):start -->[\s\S]*?<!-- \1:end -->/g, '')
    .replace(/\n[ \t]*(?:<!-- (?:US|UK|AU|CA|BR) -->\s*)?<section class="content" data-country="(?:US|UK|AU|CA|BR)">[\s\S]*?<\/section>/g, '')
    .replace(/\n([ \t]*<div class="content-area container">)/, `\n${cloud}\n$1\n${results}`);
}
