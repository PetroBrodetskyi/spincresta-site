// Reviewed corrections for legacy copy. Match whole labels so official titles,
// game names and promotion names cannot be changed by a broad word replacement.
const rows = text => Object.fromEntries(text.trim().split('\n').map(line => {
  const pair = line.trim().split(' => ');
  if (pair.length !== 2) throw new Error(`Invalid editorial correction: ${line}`);
  return pair;
}));

export const LOCALIZED_EDITORIAL_CORRECTIONS = {
  en: rows(`
    Think Beyond Deposit => Check the bonus terms and payout rules
    Game Mix, Live Dealer & Crypto-First Player Fit => Casino games, live dealers, and crypto payments
    Casino Beyond Slots => Table games and live casino
    Sports-First Players => Players who mainly bet on sports
    Country Fit & Cashier Notes => Country availability and payment methods
  `),
  de: rows(`
    Country Eignung & Cashier Notes => Verfügbarkeit nach Land und Zahlungsarten
    Über uns Layer => Angaben zum Anbieter
    Promo-Layer-Verfolger => Spieler, die regelmäßig Aktionen nutzen
    Deep-Game-Bereiche => Weitere Spielkategorien
    Deep-Game-Filter => Filter für Casinospiele
    Multi-Market-Player => Spieler, die auf verschiedene Sportarten wetten
    Game-Mix, Live-Dealer und Eignung für Krypto-orientierte Spieler => Casinospiele, Live-Casino und Kryptozahlungen
    Casino Beyond Slots => Tischspiele und Live-Casino
    LATAM Market Eignung => Angebot für Lateinamerika
    Wallet- und KYC-Sichtbarkeit => Zahlungsarten und Identitätsprüfung
    Sichtbare Wallet-Route => Zahlungsbereich
    Die vollständige WarriorBet Sports-Test ist in Vorbereitung => Der vollständige Test von WarriorBet Sports ist in Vorbereitung
    Sportwetten + E-Sports-Breite => Sportwetten und E-Sport
    Sportwetten, E-Sports und schnelle Markttiefe => Sportwetten, E-Sport und digitale Wettmärkte
    Krypto-Game-Hub => Casinospiele und Kryptozahlungen
    Crash & Instant Play => Crash- und Sofortspiele
    E-Sports- und Nischenmarkt-Fans => Fans von E-Sport und weniger verbreiteten Wettmärkten
  `),
  es: rows(`
    New Games y móvil => Juegos nuevos y versión móvil
    La revisión completa de WarriorBet Sports está en camino => La reseña completa de WarriorBet Sports está en preparación
    Veredicto de BC.Game y controles clave => Evaluación de BC.Game y qué conviene comprobar
  `),
  it: rows(`
    Live betting e BetStop => Scommesse in diretta e BetStop
    Scommesse, corse e live betting => Scommesse, corse e puntate in diretta
    Focus dell'offerta di benvenuto => Offerta di benvenuto
    Focus del Club dei Diamanti => Il programma VIP Diamond Club
    Focus solo sui casinò => Offerta incentrata sul casinò
    Focus India e INR => Offerta per l’India e pagamenti in rupie
    La recensione completa di WarriorBet Sports è in arrivo => La recensione completa di WarriorBet Sports è in preparazione
  `),
  pl: rows(`
    Live betting i BetStop => Zakłady na żywo i BetStop
    Zakłady, wyścigi i live betting => Zakłady, wyścigi i typowanie na żywo
    Diamentowy Klub Focus => Program VIP Diamond Club
    Pełna recenzja WarriorBet Sports jest w drodze => Pełna recenzja WarriorBet Sports jest w przygotowaniu
  `),
  uk: rows(`
    Крикет і Live Focus => Крикет і ставки наживо
    Live Casino Focus => Ігри з живими дилерами
    Crypto Game Hub => Ігри та платежі в криптовалюті
    Deep Game Routes => Категорії ігор і фільтри
    Користувачі Crypto Cashier => Гравці, які користуються криптовалютою
    Широкий Fiat + Crypto Cashier => Оплата у звичайній валюті й криптовалюті
    Користувачі EUR Cashier => Гравці, які поповнюють рахунок у євро
    Орієнтований на казино Game Mix => Основні категорії ігор казино
    Користувачі Sports + Results => Гравці, які стежать за спортом і результатами
    Користувачі Sports + Casino Mix => Гравці, які поєднують казино й ставки на спорт
    VIP, Wheel & Event Layers => VIP-програма, колесо призів і події
    Індія та INR Focus => Пропозиції для Індії та розрахунки в рупіях
    Market Fit => Для яких ринків підходить
    LATAM Market Fit => Пропозиції для Латинської Америки
    Казино та Altenar Sports => Казино й ставки на платформі Altenar
    Diamond Club Focus => VIP-програма Diamond Club
    Готові спробувати Let's Jackpot Review? => Хочете спробувати Let's Jackpot?
    Повний огляд WarriorBet Sports вже готовий => Повний огляд WarriorBet Sports готується
  `),
  pt: rows(`
    Utilizadores do Crypto Cashier => Jogadores que usam criptomoedas
    Slots, Crash Games e como Fugu organiza a descoberta => Slots, jogos crash e navegação no catálogo da Fugu
    Como funciona nosso processo editorial => Como funciona o nosso processo editorial
    A análise completa do WarriorBet Sports está a caminho => A análise completa do WarriorBet Sports está em preparação
  `),
  fr: rows(`
    Menu Sports à Longue Queue => Paris sur les disciplines moins courantes
    Sports de longue queue => Paris sur des sports moins courants
    Sports-Joueurs First => Pour les amateurs de paris sportifs
    Game Mix, Live Dealer et Crypto-First Player Fit => Jeux de casino, croupiers en direct et paiements en cryptomonnaies
    Comment Just Casino organise les sports, les tables en direct et le Core Casino => Paris sportifs, tables en direct et jeux de casino
    Comment Lets Lucky organise les sports, les tables en direct et les fonctionnalités de jeu répété => Paris sportifs, tables en direct et offres récurrentes
    Comment Lucky Dreams organise les sports, les tables en direct et la valeur du Diamond Club => Paris sportifs, tables en direct et programme VIP Diamond Club
    Comment Lucky Ones organise les sports, les tables en direct et le contenu de fidélité => Paris sportifs, tables en direct et programme de fidélité
    Profondeur Sports + Esports => Choix de paris sportifs et esport
    Joueurs Sports + Résultats => Pour suivre les sports et les résultats
    Utilisateurs Sports + Résultats => Pour suivre les sports et les résultats
    Focus sur le Club Diamant => Programme VIP Diamond Club
  `),
  hi: rows(`
    New Games और मोबाइल => नए गेम और मोबाइल पर खेलने के विकल्प
    पूर्ण WarriorBet Sports समीक्षा आने वाली है => WarriorBet Sports की पूरी समीक्षा तैयार की जा रही है
  `),
  fi: rows(`
    Kriketti ja Live Focus => Kriketti ja livevedot
    Promo Layers => Kampanjat
    Enemmän kuin yksi Promo Layer => Useita kampanjoita
    Long-Tail Sports Menu => Vedot harvinaisemmista lajeista
    Cricket Exchange Focus => Kriketin vedonlyöntipörssi
    VIP & Promo Layer => VIP-ohjelma ja kampanjat
    World Cup Focus => MM-kisojen vedonlyönti
    Football Focus => Jalkapallovedot
    Kasino + Sports Angle => Kasino ja urheiluvedonlyönti
    Esports & Combat Sports => E-urheilu ja kamppailulajit
    Tilastot Layer => Ottelutilastot
    Esports & Niche Market -fanit => E-urheilusta ja harvinaisemmista vedoista kiinnostuneet
    Live Casino Focus => Livekasino
    Crypto Game Hub => Kasinopelit ja kryptomaksut
    Game Mix, Live Dealer & Crypto-First Player Fit => Kasinopelit, livejakajat ja kryptomaksut
    Focus vain kasinolle => Tarjonta painottuu kasinopeleihin
    AU/NZ Player Fit => Tarjonta Australiassa ja Uudessa-Seelannissa
    Fiat & Crypto Cashier => Perinteiset maksutavat ja kryptomaksut
    Maksut, Cashout Limits & KYC Prep => Maksut, kotiutusrajat ja henkilöllisyyden tarkistus
    Leveä Fiat + Crypto Cashier => Perinteiset maksutavat ja kryptomaksut
    JeetCity Originals & Fast Games => JeetCityn omat pelit ja pikapelit
    Tietoja meistä Layer => Tiedot operaattorista
    Kasino-First Game Mix => Valikoima painottuu kasinopeleihin
    Think Beyond Deposit => Tarkista bonusehdot ja kotiutukset
    Leon Originals, Exclusives & Quick Games => Leonin omat pelit, yksinoikeuspelit ja pikapelit
    Promotion Layer => Kampanjat
    Promo-Layer Chasers => Säännöllisistä kampanjoista kiinnostuneet
    Diamond Club Focus => VIP-ohjelma Diamond Club
    Kasino + Sports Mix => Kasino ja urheiluvedonlyönti
    MoonWin Originals & Fast Games => MoonWinin omat pelit ja pikapelit
    Country Fit & Cashier Notes => Maakohtainen saatavuus ja maksutavat
    LATAM Market Fit => Tarjonta Latinalaisessa Amerikassa
    Intia & INR Focus => Tarjonta Intiassa ja rupiamaksut
    Livekasino + Sports Mix => Livekasino ja urheiluvedonlyönti
    Tervetulotarjous Focus => Tervetulotarjous
    Spinbetter Market Fit => Spinbetterin maakohtainen saatavuus
    Live-pöydät ja game show -pelit => Livepöydät ja pelishow’t
    WarriorBet Sports arvostelu on tulossa => WarriorBet Sportsin arvostelu on tulossa
    Täydellinen WarriorBet Sports-arvostelu on tulossa => WarriorBet Sportsin kattava arvostelu on tekeillä
    Kasino ja Altenar Sports => Kasino ja Altenarin vedonlyöntialusta
    Core Sports markkinaraon => Yleisimmät lajit ja erikoiskohteet
    Casino Beyond Slots => Pöytäpelit ja livekasino
    Crash & Instant Play => Crash- ja pikapelit
    Lue bonusehdot First => Lue bonusehdot ensin
    Lue tarjousehdot First => Lue tarjousehdot ensin
    Lue maksun usein kysytyt kysymykset First => Tarkista ensin maksujen usein kysytyt kysymykset
    Pelaajat, jotka lukevat säännöt First => Pelaajat, jotka tarkistavat ensin säännöt
    Esports-First Vedonlyönti => E-urheiluun painottuva vedonlyönti
    Mobile-First-soittimet => Mobiilissa pelaavat
    Mobile-First Access => Käyttö puhelimella
    Casino-First Paikannus => Tarjonta painottuu kasinopeleihin
    Kasino-First Navigointi => Kasinopelien selaaminen
    Casino-First Aula => Kasinon peliaula
    Crypto-First-kulma => Kryptovaluutat maksutapana
    Crypto-First Fit => Kryptovaluuttaa käyttävät pelaajat
    Crypto-First-edut => Kryptovaluuttojen käyttö kasinolla
    Vaihe 1: Tarkista kassa First => Vaihe 1: Tarkista maksutavat
    Tarkista kassa First => Tarkista ensin maksutavat
    Casino-First käyttäjät => Pääasiassa kasinopelejä pelaavat
    Casino-First pelaajat => Pääasiassa kasinopelejä pelaavat
    Filter-First-kolikkopelit => Kolikkopelien suodattimet
    Ehdot First => Tarkista ensin ehdot
    Kriketti-First-pelaajat => Kriketistä vetoa lyövät
    Casino-First -pelaajat hyötyvät edelleen => Valikoima kasinopelaajille
    Aloita pieni First => Aloita pienellä summalla
    Kasino-First, ei vain vedonlyönti => Kasinopelit vedonlyönnin rinnalla
    Matkapuhelin-First Tarpeeksi => Pelaaminen puhelimella
    Urheilu-First-soittimet => Urheiluvedonlyöjät
    Kotiutussekit First => Kotiutusehdot kannattaa tarkistaa ensin
    Bonukset, sisäänpääsyarvo ja mitä väliä First => Tervetuliaisbonus ja sen ehdot
    Paikka First => Tarkista ensin maakohtainen saatavuus
    Säännöt First => Lue ensin säännöt
    Casino-First Money Flow => Kasinon talletukset ja kotiutukset
    Mitkä uskollisuusominaisuudet tekevät First:stä erottuvan? => Mitä kanta-asiakasetuja First tarjoaa?
  `),
};

// The logos and screenshots already have localized captions on most pages.
// Use these same phrases in their generators, without touching image URLs.
export const REVIEW_IMAGE_LABELS = {
  en: { logo: brand => `${brand} logo`, bcgame: 'BC.Game casino and sportsbook homepage' },
  de: { logo: brand => `Logo von ${brand}`, bcgame: 'Startseite von BC.Game mit Casino und Sportwetten' },
  es: { logo: brand => `Logotipo de ${brand}`, bcgame: 'Página de inicio del casino y las apuestas deportivas de BC.Game' },
  it: { logo: brand => `Logo di ${brand}`, bcgame: 'Pagina iniziale di BC.Game: casinò e scommesse sportive' },
  pl: { logo: brand => `Logo ${brand}`, bcgame: 'Strona główna kasyna i zakładów sportowych BC.Game' },
  uk: { logo: brand => `Логотип ${brand}`, bcgame: 'Головна сторінка казино й букмекерського розділу BC.Game' },
  pt: { logo: brand => `Logótipo da ${brand}`, bcgame: 'Página inicial do casino e da casa de apostas BC.Game' },
  fr: { logo: brand => `Logo de ${brand}`, bcgame: 'Page d’accueil du casino et des paris sportifs de BC.Game' },
  hi: { logo: brand => `${brand} का लोगो`, bcgame: 'BC.Game के कैसीनो और स्पोर्ट्स बेटिंग का होमपेज' },
  fi: { logo: brand => `${brand} – logo`, bcgame: 'BC.Gamen kasinon ja vedonlyönnin etusivu' },
};

export function localizedImageLabel(text, locale) {
  const labels = REVIEW_IMAGE_LABELS[locale];
  if (!labels) return text;
  if (text === REVIEW_IMAGE_LABELS.en.bcgame) return labels.bcgame;
  const brand = /^(BC\.Game|National Casino|Casino Peaches) logo$/u.exec(text)?.[1];
  return brand ? labels.logo(brand) : text;
}
