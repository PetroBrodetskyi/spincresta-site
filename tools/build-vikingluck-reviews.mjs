import fs from 'node:fs';

// Reuse the site's polished ViperWin layout and shared rule explanations.
// VikingLuck's own public mirror was checked on 2026-10-03, including
// rules v1.12 (19.08.2026), welcome offers, weekend reload, Canada/CAD
// payments, catalogue, providers, VIP, complaints and responsible gaming.
// Matching numerical conditions were verified, not inferred from the template.
// No real-money test or independently verified licence/operator is claimed.
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const screenshot = 'https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1791034794/spincresta/brands/vikingluck/main-page/vikingluck-page_d8p9jb';
const newGames = 'Rainbow Mantis Masters, Outlaw Rooster, Lightning Diamond Double Strike VIP (3x3), Hamsterdam, Coink Bank 777, Beez Turn Wild';
const copy = {
  en: {
    title: 'VikingLuck Review 2026: €500 Bonus, Free Spins & Withdrawals',
    description: 'VikingLuck casino review: 100% up to €500 + 200 free spins, 35x wagering, sports bonus, games, Interac, five VIP withdrawal tiers and KYC rules.',
    intro: 'VikingLuck offers slots, live casino, jackpots and sports betting alongside a Shop and five VIP levels. We examine its 100% casino welcome bonus up to €500 with 200 free spins, the separate sports offer, game selection, payment options and withdrawal conditions, including the requirements that matter before you deposit.',
    verdict: 'VikingLuck’s strengths are its extensive game catalogue and the option to use casino games and sports betting through one account. The welcome spins are spread over ten days, while the bonus requires 35x wagering on both the deposit and bonus. Withdrawal limits depend on the VIP level. The public pages we reviewed did not provide enough information to independently verify the operator and licence.',
    vip: ['Five VIP levels', 'Daily and monthly withdrawal limits increase by tier. The euro table starts at €500 daily and €7,000 monthly.'],
    licenceCheck: 'Check the current operator, licence number and permissions for your country before depositing.',
    maxBet: 'The published maximum bet with an active casino bonus is €100 or the stated currency equivalent. Exceeding a bonus rule can void the bonus and related winnings.',
    currencies: 'Published welcome caps include CAD750, AUD750 and NZD1,000, each with 200 free spins. The minimum deposit depends on the account currency.',
    games: [
      ['Slots, jackpots and instant games', 'The public lobby listed 11,032 slots and 13,707 games in total when checked. Separate sections cover New, Exclusive, Instant Games and jackpots. These are changing catalogue counts, not a guarantee of access to every title in every country.'],
      ['Live tables and game shows', 'VikingLuck has dedicated live roulette, blackjack, baccarat and dice, poker and game-show categories. International tables and Gold Saloon are also listed. The table-game lobby includes Jacks or Better and Texas Holdem Bonus.'],
      ['Game providers', 'The provider list includes Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil and Thunderkick. Availability of individual studios and titles can vary by country.'],
      ['New Games gallery', `The six illustrated releases are ${newGames}. The images show the games listed in the gallery, rather than suggesting that SpinCresta tested them with a deposit.`],
    ],
    promotions: 'Recurring offers include a 50% weekend reload up to €700, with 50 spins for deposits from €50; the deposit-only bonus starts at €20. The public promotion list also shows 15% weekly casino cashback up to €3,000, 25% live cashback up to €200, and 10% sports cashback up to €500. Each has separate conditions.',
    cashierIntro: 'In the public Canada/CAD payment selector, deposits included Interac, cards, Neteller, MiFinity and cryptocurrencies. Skrill and bank transfer were also listed for withdrawals. Methods and limits vary by country, currency and account verification; the €20 welcome-bonus minimum is separate from payment-provider minimums.',
    payment: ['Deposits and withdrawals', 'Interac, Visa/Mastercard, Neteller, MiFinity and crypto; Skrill and bank transfer were listed for withdrawals', 'Use payment accounts in your own name. Skrill and Neteller deposits do not qualify for the welcome offer.'],
    canada: ['Canada: Interac limits', 'Deposits CAD10–9,000; withdrawals CAD10–3,000', 'These are payment-method limits, not VIP withdrawal allowances. The lowest CAD VIP tier is CAD750 daily / CAD10,500 monthly.'],
    licence: 'The mirror’s footer, general terms and About page did not clearly identify a named operator and verifiable licence number. We therefore do not present licensing as independently confirmed. A country appearing in the site’s selection does not by itself establish local authorisation.',
    support: 'Live chat and support@vikingluck.com are published support channels. Unresolved issues can be sent to complaints@vikingluck.com from the registered email, with COMPLAINT in the subject, account details and a dated summary. The terms state an outcome within ten days, with possible extensions for complex cases.',
    caution: 'The current operator, licence and local permissions need checking before depositing.',
    faqLicence: 'We could not independently verify a current licence number and named legal operator from the reviewed public pages. Ask for the current entity, regulator and permissions for your country; access to the website alone is not proof of local authorisation.',
    faqExclusion: 'Contact support@vikingluck.com and request a break or self-exclusion. The responsible-gaming page says closure will occur as soon as practicable, without a fixed deadline. Do not open another account to get around the exclusion.',
  },
  de: {
    title: 'VikingLuck Test 2026: 500 € Bonus, Freispiele und Auszahlung',
    description: 'VikingLuck im Überblick: 100 % bis 500 € + 200 Freispiele, 35x Umsatz, Sportbonus, Spiele, Interac, fünf VIP-Auszahlungsstufen und KYC.',
    intro: 'VikingLuck bietet Slots, Live-Casino, Jackpots und Sportwetten sowie einen Shop und fünf VIP-Stufen. Wir erklären den Casinobonus von 100 % bis 500 € mit 200 Freispielen, das separate Sportangebot, die Spielauswahl und die Zahlungs- und Auszahlungsbedingungen. Dabei stehen die Regeln im Mittelpunkt, die Sie vor einer Einzahlung kennen sollten.',
    verdict: 'VikingLuck verbindet eine große Spielauswahl mit Sportwetten auf demselben Konto. Die Willkommensfreispiele werden über zehn Tage verteilt; Einzahlung und Bonus müssen zusammen 35-mal umgesetzt werden. Die Auszahlungsgrenzen hängen von der VIP-Stufe ab. Die geprüften öffentlichen Seiten lieferten nicht genügend Angaben, um Betreiber und Lizenz unabhängig zu bestätigen.',
    vip: ['Fünf VIP-Stufen', 'Die täglichen und monatlichen Auszahlungsgrenzen steigen je nach Stufe. Die Euro-Tabelle beginnt bei 500 € täglich und 7.000 € monatlich.'],
    licenceCheck: 'Vor der Einzahlung aktuelle Angaben zu Betreiber, Lizenznummer und Erlaubnis im eigenen Land prüfen.',
    maxBet: 'Mit aktivem Casinobonus beträgt der veröffentlichte Höchsteinsatz 100 € oder den angegebenen Gegenwert. Ein Verstoß gegen Bonusregeln kann Bonus und zugehörige Gewinne aufheben.',
    currencies: 'Die veröffentlichten Bonusgrenzen sind unter anderem 750 CAD, 750 AUD und 1.000 NZD, jeweils mit 200 Freispielen. Die Mindesteinzahlung hängt von der Kontowährung ab.',
    games: [
      ['Slots, Jackpots und Sofortspiele', 'Bei der Prüfung zeigte die öffentliche Lobby 11.032 Slots und insgesamt 13.707 Spiele. Neue und exklusive Titel, Sofortspiele und Jackpots haben eigene Bereiche. Die laufenden Katalogzahlen garantieren nicht, dass jedes Spiel in jedem Land verfügbar ist.'],
      ['Live-Tische und Game Shows', 'Eigene Live-Kategorien decken Roulette, Blackjack, Baccarat und Würfel, Poker sowie Game Shows ab. Hinzu kommen internationale Tische und Gold Saloon. Bei den Tischspielen sind unter anderem Jacks or Better und Texas Holdem Bonus gelistet.'],
      ['Spielanbieter', 'Die Liste enthält Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil und Thunderkick. Einzelne Studios und Titel können je nach Land eingeschränkt sein.'],
      ['Neue Spiele in der Galerie', `Die sechs abgebildeten Titel sind ${newGames}. Die Bilder zeigen die Spiele der Galerie; sie sind kein Nachweis eines Echtgeldtests durch SpinCresta.`],
    ],
    promotions: 'Der Wochenend-Reload bietet 50 % bis 700 €; ab 50 € Einzahlung kommen 50 Freispiele hinzu. Der reine Einzahlungsbonus beginnt bei 20 €. Gelistet sind außerdem 15 % wöchentliches Casino-Cashback bis 3.000 €, 25 % Live-Cashback bis 200 € und 10 % Sportwetten-Cashback bis 500 €. Jede Aktion hat eigene Bedingungen.',
    cashierIntro: 'Nach Auswahl von Kanada und CAD waren Interac, Karten, Neteller, MiFinity und Kryptowährungen für Einzahlungen sichtbar. Für Auszahlungen wurden auch Skrill und Banküberweisung gelistet. Methoden und Grenzen hängen von Land, Währung und Kontoprüfung ab. Die 20 € Mindesteinzahlung für den Bonus ist kein allgemeines Zahlungslimit.',
    payment: ['Ein- und Auszahlungen', 'Interac, Visa/Mastercard, Neteller, MiFinity und Krypto; Skrill und Banküberweisung waren für Auszahlungen gelistet', 'Nur Zahlungsmittel auf den eigenen Namen verwenden. Einzahlungen mit Skrill und Neteller berechtigen nicht zum Willkommensbonus.'],
    canada: ['Kanada: Interac-Limits', 'Einzahlungen 10–9.000 CAD; Auszahlungen 10–3.000 CAD', 'Dies sind Grenzen der Zahlungsmethode, nicht die VIP-Auszahlungslimits. Die niedrigste CAD-Stufe erlaubt 750 CAD täglich / 10.500 CAD monatlich.'],
    licence: 'Im Footer, in den AGB und auf der Über-uns-Seite des geprüften Zugangs waren Betreiber und verifizierbare Lizenznummer nicht eindeutig angegeben. Wir stellen die Lizenz daher nicht als unabhängig bestätigt dar. Die Auswahl eines Landes auf der Website belegt keine dortige Erlaubnis.',
    support: 'Live-Chat und support@vikingluck.com sind die veröffentlichten Supportkanäle. Ungelöste Fälle können von der registrierten E-Mail an complaints@vikingluck.com geschickt werden: Betreff COMPLAINT, Kontodaten und eine Zusammenfassung mit Datum. Laut AGB erfolgt die Entscheidung binnen zehn Tagen; komplexe Fälle können länger dauern.',
    caution: 'Betreiber, aktuelle Lizenz und Erlaubnis im eigenen Land vor der Einzahlung prüfen.',
    faqLicence: 'Eine aktuelle Lizenznummer und den rechtlichen Betreiber konnten wir anhand der öffentlichen Seiten nicht unabhängig bestätigen. Fragen Sie nach Unternehmen, Aufsichtsbehörde und Erlaubnis für Ihr Land. Der bloße Zugriff auf die Website ist kein Nachweis einer lokalen Zulassung.',
    faqExclusion: 'Bitten Sie support@vikingluck.com um eine Spielpause oder einen Selbstausschluss. Die Seite zum Spielerschutz nennt eine Schließung so bald wie möglich, aber keine feste Frist. Eröffnen Sie kein weiteres Konto, um den Ausschluss zu umgehen.',
  },
  es: {
    title: 'VikingLuck: reseña 2026, bono de 500 €, giros y retiros',
    description: 'Reseña de VikingLuck: 100 % hasta 500 € + 200 giros gratis, requisito 35x, bono deportivo, juegos, Interac, cinco niveles de retiro VIP y KYC.',
    intro: 'VikingLuck reúne tragamonedas, casino en vivo, jackpots y apuestas deportivas, con una tienda y cinco niveles VIP. Analizamos el bono de casino del 100 % hasta 500 € con 200 giros gratis, la oferta deportiva por separado, los juegos, los pagos y las condiciones de retiro que conviene conocer antes de depositar.',
    verdict: 'VikingLuck destaca por su catálogo amplio y por permitir jugar al casino y apostar en deportes desde una misma cuenta. Los giros de bienvenida se reparten durante diez días, y el requisito de apuesta de 35x se aplica al depósito más el bono. Los límites de retiro dependen del nivel VIP. Las páginas públicas revisadas no permitieron confirmar de forma independiente el operador y la licencia.',
    vip: ['Cinco niveles VIP', 'Los límites diarios y mensuales aumentan según el nivel. La tabla en euros empieza en 500 € al día y 7.000 € al mes.'],
    licenceCheck: 'Antes de depositar, comprueba el operador, el número de licencia vigente y la autorización en tu país.',
    maxBet: 'La apuesta máxima publicada con un bono de casino activo es 100 € o su equivalente indicado. Incumplir las reglas puede anular el bono y las ganancias asociadas.',
    currencies: 'Los máximos publicados incluyen 750 CAD, 750 AUD y 1.000 NZD, siempre con 200 giros gratis. El depósito mínimo depende de la moneda de la cuenta.',
    games: [
      ['Tragamonedas, jackpots y juegos instantáneos', 'El catálogo público mostraba 11.032 tragamonedas y 13.707 juegos en total al revisarlo. Hay secciones de novedades, exclusivos, juegos instantáneos y jackpots. Son cifras variables del catálogo, no una garantía de acceso a todos los juegos desde cualquier país.'],
      ['Mesas en vivo y concursos', 'Hay categorías de ruleta, blackjack, baccarat y dados, póker y concursos en vivo. También aparecen mesas internacionales y Gold Saloon. La sección de juegos de mesa incluye Jacks or Better y Texas Holdem Bonus.'],
      ['Proveedores de juegos', 'La lista incluye Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil y Thunderkick. Algunos estudios y títulos pueden tener restricciones por país.'],
      ['Galería de nuevos juegos', `Los seis títulos ilustrados son ${newGames}. Las imágenes muestran los juegos de la galería; no implican que SpinCresta los haya probado con dinero real.`],
    ],
    promotions: 'La recarga de fin de semana ofrece un 50 % hasta 700 € y añade 50 giros al depositar desde 50 €. El bono sin giros empieza con depósitos de 20 €. También se publican cashback semanal de casino del 15 % hasta 3.000 €, cashback en vivo del 25 % hasta 200 € y cashback deportivo del 10 % hasta 500 €. Cada promoción tiene sus propias condiciones.',
    cashierIntro: 'Al seleccionar Canadá y CAD en la página pública de pagos aparecían Interac, tarjetas, Neteller, MiFinity y criptomonedas para depositar. Skrill y transferencia bancaria también figuraban para retiros. Los métodos y límites dependen del país, la moneda y la verificación. El mínimo de 20 € del bono no es un mínimo general para todos los pagos.',
    payment: ['Depósitos y retiros', 'Interac, Visa/Mastercard, Neteller, MiFinity y cripto; Skrill y transferencia bancaria figuraban para retiros', 'Usa cuentas de pago a tu nombre. Los depósitos con Skrill o Neteller no dan derecho al bono de bienvenida.'],
    canada: ['Canadá: límites de Interac', 'Depósitos de 10 a 9.000 CAD; retiros de 10 a 3.000 CAD', 'Son límites del método de pago, no del nivel VIP. El nivel inicial en CAD permite 750 CAD diarios / 10.500 CAD mensuales.'],
    licence: 'El pie de página, los términos generales y la sección de información del acceso revisado no identificaban claramente un operador y un número de licencia verificable. Por eso no presentamos la licencia como confirmada de forma independiente. Que un país figure en el selector no demuestra una autorización local.',
    support: 'Los canales publicados son el chat y support@vikingluck.com. Si el problema no se resuelve, puedes escribir desde el correo registrado a complaints@vikingluck.com, con COMPLAINT en el asunto, los datos de la cuenta y un resumen con fechas. Los términos indican una resolución en diez días, con posibles ampliaciones en casos complejos.',
    caution: 'Conviene verificar el operador, la licencia vigente y la autorización en tu país antes de depositar.',
    faqLicence: 'No pudimos confirmar de forma independiente una licencia vigente y el operador legal con las páginas públicas revisadas. Pide los datos de la entidad, el regulador y la autorización para tu país. Poder abrir la web no demuestra que esté autorizada localmente.',
    faqExclusion: 'Solicita una pausa o autoexclusión a support@vikingluck.com. La página de juego responsable indica que la cuenta se cerrará lo antes posible, sin fijar un plazo. No abras otra cuenta para eludir la exclusión.',
  },
  it: {
    title: 'VikingLuck recensione 2026: bonus 500 €, giri e prelievi',
    description: 'Recensione VikingLuck: 100% fino a 500 € + 200 giri gratis, rigioco 35x, bonus sport, giochi, Interac, cinque livelli di prelievo VIP e KYC.',
    intro: 'VikingLuck propone slot, casinò live, jackpot e scommesse sportive, con uno Shop e cinque livelli VIP. Esaminiamo il bonus casinò del 100% fino a 500 € con 200 giri gratis, l’offerta sportiva separata, i giochi, i pagamenti e le condizioni di prelievo da conoscere prima di depositare.',
    verdict: 'Il catalogo ampio e l’accesso a casinò e scommesse dallo stesso conto sono i principali punti di interesse di VikingLuck. I giri di benvenuto arrivano nell’arco di dieci giorni; deposito e bonus richiedono un rigioco complessivo di 35x. I limiti di prelievo dipendono dal livello VIP. Le pagine pubbliche consultate non hanno consentito di confermare in modo indipendente operatore e licenza.',
    vip: ['Cinque livelli VIP', 'I limiti giornalieri e mensili aumentano in base al livello. La tabella in euro parte da 500 € al giorno e 7.000 € al mese.'],
    licenceCheck: 'Prima del deposito verifica operatore, numero di licenza attuale e autorizzazione nel tuo paese.',
    maxBet: 'Con un bonus casinò attivo, la puntata massima pubblicata è 100 € o il controvalore indicato. Violare le regole può annullare il bonus e le vincite collegate.',
    currencies: 'I massimali pubblicati comprendono 750 CAD, 750 AUD e 1.000 NZD, ciascuno con 200 giri gratis. Il deposito minimo dipende dalla valuta del conto.',
    games: [
      ['Slot, jackpot e giochi istantanei', 'Al momento della verifica, il catalogo pubblico mostrava 11.032 slot e 13.707 giochi totali. Novità, esclusivi, giochi istantanei e jackpot hanno sezioni dedicate. Sono conteggi variabili, non una garanzia di accesso a ogni titolo da tutti i paesi.'],
      ['Tavoli live e game show', 'Le categorie live comprendono roulette, blackjack, baccarat e dadi, poker e game show. Sono presenti anche tavoli internazionali e Gold Saloon. Tra i giochi da tavolo figurano Jacks or Better e Texas Holdem Bonus.'],
      ['Fornitori di giochi', 'L’elenco include Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil e Thunderkick. La disponibilità di singoli studi e titoli può cambiare secondo il paese.'],
      ['Galleria delle nuove uscite', `I sei titoli illustrati sono ${newGames}. Le immagini mostrano i giochi della galleria e non attestano un test con denaro reale da parte di SpinCresta.`],
    ],
    promotions: 'Il reload del weekend offre il 50% fino a 700 €; da 50 € di deposito si aggiungono 50 giri. Il bonus senza giri parte da 20 €. Sono pubblicati anche cashback settimanale casinò del 15% fino a 3.000 €, cashback live del 25% fino a 200 € e cashback sportivo del 10% fino a 500 €. Ogni promozione ha condizioni proprie.',
    cashierIntro: 'Selezionando Canada e CAD nella pagina pubblica dei pagamenti, erano disponibili Interac, carte, Neteller, MiFinity e criptovalute per i depositi. Skrill e bonifico bancario comparivano anche per i prelievi. Metodi e limiti dipendono da paese, valuta e verifica del conto. Il minimo di 20 € del bonus non è un limite generale per tutti i pagamenti.',
    payment: ['Depositi e prelievi', 'Interac, Visa/Mastercard, Neteller, MiFinity e cripto; Skrill e bonifico bancario erano elencati per i prelievi', 'Usa strumenti di pagamento intestati a te. I depositi con Skrill o Neteller non danno diritto al bonus di benvenuto.'],
    canada: ['Canada: limiti Interac', 'Depositi 10–9.000 CAD; prelievi 10–3.000 CAD', 'Sono limiti del metodo di pagamento, non del livello VIP. La prima fascia CAD consente 750 CAD al giorno / 10.500 CAD al mese.'],
    licence: 'Footer, termini generali e pagina informativa dell’accesso esaminato non indicavano chiaramente un operatore e un numero di licenza verificabile. Non presentiamo quindi la licenza come confermata in modo indipendente. La presenza di un paese nel selettore non dimostra un’autorizzazione locale.',
    support: 'I canali pubblicati sono la chat e support@vikingluck.com. I casi irrisolti possono essere inviati dall’email registrata a complaints@vikingluck.com, con oggetto COMPLAINT, dati del conto e riepilogo con date. I termini prevedono un esito entro dieci giorni, con possibili proroghe per i casi complessi.',
    caution: 'Prima del deposito occorre verificare operatore, licenza attuale e autorizzazione nel proprio paese.',
    faqLicence: 'Le pagine pubbliche consultate non hanno permesso di confermare in modo indipendente la licenza attuale e l’operatore legale. Chiedi i dati della società, del regolatore e dell’autorizzazione nel tuo paese. Il semplice accesso al sito non prova che sia autorizzato localmente.',
    faqExclusion: 'Scrivi a support@vikingluck.com per chiedere una pausa o l’autoesclusione. La pagina sul gioco responsabile indica una chiusura appena possibile, senza una scadenza precisa. Non aprire un altro conto per aggirare l’esclusione.',
  },
  pl: {
    title: 'VikingLuck opinia 2026: bonus 500 €, spiny i wypłaty',
    description: 'Recenzja VikingLuck: 100% do 500 € + 200 darmowych spinów, obrót 35x, bonus sportowy, gry, Interac, pięć poziomów wypłat VIP i KYC.',
    intro: 'VikingLuck oferuje automaty, kasyno live, jackpoty i zakłady sportowe, a także sklep i pięć poziomów VIP. Omawiamy bonus kasynowy 100% do 500 € z 200 darmowymi spinami, osobną ofertę sportową, gry, płatności i warunki wypłat, które warto poznać przed wpłatą.',
    verdict: 'VikingLuck wyróżnia się dużym katalogiem gier oraz możliwością korzystania z kasyna i zakładów sportowych na jednym koncie. Spiny powitalne są przyznawane przez dziesięć dni, a obrót 35x dotyczy łącznie wpłaty i bonusu. Limity wypłat zależą od poziomu VIP. Sprawdzone strony publiczne nie pozwoliły niezależnie potwierdzić operatora i licencji.',
    vip: ['Pięć poziomów VIP', 'Dzienne i miesięczne limity wypłat rosną wraz z poziomem. Tabela w euro zaczyna się od 500 € dziennie i 7 000 € miesięcznie.'],
    licenceCheck: 'Przed wpłatą sprawdź aktualnego operatora, numer licencji i zezwolenie w swoim kraju.',
    maxBet: 'Opublikowana maksymalna stawka przy aktywnym bonusie kasynowym wynosi 100 € lub wskazaną równowartość. Naruszenie zasad może spowodować anulowanie bonusu i powiązanych wygranych.',
    currencies: 'Opublikowane limity obejmują 750 CAD, 750 AUD i 1 000 NZD, w każdym przypadku z 200 darmowymi spinami. Minimalna wpłata zależy od waluty konta.',
    games: [
      ['Automaty, jackpoty i gry natychmiastowe', 'W chwili sprawdzania publiczny katalog pokazywał 11 032 automaty i 13 707 gier łącznie. Nowości, gry na wyłączność, gry natychmiastowe i jackpoty mają osobne sekcje. Zmieniające się liczniki nie gwarantują dostępu do każdego tytułu we wszystkich krajach.'],
      ['Stoły live i teleturnieje', 'Osobne kategorie obejmują ruletkę, blackjacka, bakarata i kości, pokera oraz teleturnieje live. Dostępne są też stoły międzynarodowe i Gold Saloon. Wśród gier stołowych widoczne były Jacks or Better i Texas Holdem Bonus.'],
      ['Dostawcy gier', 'Na liście są Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil i Thunderkick. Dostępność konkretnych studiów i gier może zależeć od kraju.'],
      ['Galeria nowych gier', `Sześć pokazanych tytułów to ${newGames}. Zdjęcia przedstawiają gry w galerii i nie oznaczają, że SpinCresta przetestowała je za prawdziwe pieniądze.`],
    ],
    promotions: 'Weekendowy bonus reload wynosi 50% do 700 €; przy wpłacie od 50 € dochodzi 50 spinów. Bonus bez spinów jest dostępny od 20 €. Lista zawiera też tygodniowy cashback kasynowy 15% do 3 000 €, cashback live 25% do 200 € i cashback sportowy 10% do 500 €. Każda promocja ma własne warunki.',
    cashierIntro: 'Po wybraniu Kanady i CAD w publicznej sekcji płatności widoczne były Interac, karty, Neteller, MiFinity i kryptowaluty do wpłat. Skrill i przelew bankowy były też wymienione przy wypłatach. Metody i limity zależą od kraju, waluty i weryfikacji konta. Minimalna wpłata 20 € dla bonusu nie jest ogólnym limitem wszystkich płatności.',
    payment: ['Wpłaty i wypłaty', 'Interac, Visa/Mastercard, Neteller, MiFinity i krypto; Skrill i przelew bankowy były wymienione przy wypłatach', 'Korzystaj z metod płatności na własne nazwisko. Wpłaty przez Skrill i Neteller nie dają prawa do bonusu powitalnego.'],
    canada: ['Kanada: limity Interac', 'Wpłaty 10–9 000 CAD; wypłaty 10–3 000 CAD', 'To limity metody płatności, a nie poziomu VIP. Najniższa stawka VIP w CAD pozwala na 750 CAD dziennie / 10 500 CAD miesięcznie.'],
    licence: 'Stopka, regulamin i strona informacyjna sprawdzonego adresu nie wskazywały jasno operatora oraz numeru licencji możliwego do zweryfikowania. Nie przedstawiamy więc licencji jako niezależnie potwierdzonej. Obecność kraju na liście wyboru nie oznacza lokalnego zezwolenia.',
    support: 'Opublikowane kanały pomocy to czat i support@vikingluck.com. Nierozwiązany problem można wysłać z zarejestrowanego adresu na complaints@vikingluck.com, z tematem COMPLAINT, danymi konta i opisem z datami. Regulamin przewiduje wynik w ciągu dziesięciu dni, z możliwością przedłużenia w trudniejszych sprawach.',
    caution: 'Przed wpłatą trzeba sprawdzić operatora, aktualną licencję i zezwolenie w swoim kraju.',
    faqLicence: 'Na podstawie publicznych stron nie mogliśmy niezależnie potwierdzić aktualnej licencji i operatora prawnego. Poproś o dane firmy, regulatora i zezwolenia w swoim kraju. Sam dostęp do strony nie potwierdza lokalnej legalności.',
    faqExclusion: 'Napisz do support@vikingluck.com z prośbą o przerwę lub samowykluczenie. Strona o odpowiedzialnej grze mówi o zamknięciu konta tak szybko, jak to możliwe, bez stałego terminu. Nie otwieraj kolejnego konta, aby obejść wykluczenie.',
  },
  uk: {
    title: 'VikingLuck: огляд 2026, бонус 500 €, фріспіни та виплати',
    description: 'Огляд VikingLuck: 100% до 500 € + 200 фріспінів, відіграш 35×, спортивний бонус, ігри, Interac, п’ять рівнів лімітів виплат VIP і KYC.',
    intro: 'VikingLuck пропонує слоти, live-казино, джекпоти та спортивні ставки, а також магазин винагород і п’ять VIP-рівнів. Розбираємо вітальний бонус казино 100% до 500 € з 200 фріспінами, окрему спортивну пропозицію, вибір ігор, платежі та умови виплат, які варто знати перед депозитом.',
    verdict: 'Сильні сторони VikingLuck — великий каталог ігор і можливість користуватися казино та спортивними ставками з одного акаунта. Вітальні фріспіни нараховують протягом десяти днів, а відіграш 35× стосується суми депозиту й бонусу. Ліміти виплат залежать від VIP-рівня. Перевірених публічних сторінок було недостатньо, щоб незалежно підтвердити оператора та ліцензію.',
    vip: ['П’ять VIP-рівнів', 'Денні та місячні ліміти виплат зростають залежно від рівня. У таблиці для євро початковий ліміт — 500 € на день і 7 000 € на місяць.'],
    licenceCheck: 'Перед депозитом перевірте чинного оператора, номер ліцензії та дозвіл працювати у вашій країні.',
    maxBet: 'Опублікована максимальна ставка з активним бонусом казино — 100 € або зазначений валютний еквівалент. Порушення бонусних правил може призвести до анулювання бонусу й пов’язаних виграшів.',
    currencies: 'Серед опублікованих максимальних сум — 750 CAD, 750 AUD і 1 000 NZD, у кожному випадку з 200 фріспінами. Мінімальний депозит залежить від валюти акаунта.',
    games: [
      ['Слоти, джекпоти та миттєві ігри', 'Під час перевірки публічний каталог показував 11 032 слоти та 13 707 ігор загалом. Новинки, ексклюзиви, миттєві ігри та джекпоти мають окремі розділи. Ці лічильники змінюються й не гарантують доступу до кожної гри з будь-якої країни.'],
      ['Live-столи та ігрові шоу', 'Є окремі live-категорії рулетки, блекджеку, бакари та костей, покеру й ігрових шоу. Також представлені міжнародні столи та Gold Saloon. У розділі настільних ігор були Jacks or Better і Texas Holdem Bonus.'],
      ['Провайдери ігор', 'У переліку є Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil і Thunderkick. Доступність окремих студій та ігор може залежати від країни.'],
      ['Галерея нових ігор', `Шість представлених назв: ${newGames}. Зображення показують ігри з галереї, але не означають, що SpinCresta тестувала їх із реальним депозитом.`],
    ],
    promotions: 'Бонус вихідного дня — 50% до 700 €; від депозиту 50 € додають 50 фріспінів. Бонус без фріспінів доступний від 20 €. Також опубліковані щотижневий кешбек казино 15% до 3 000 €, live-кешбек 25% до 200 € і спортивний кешбек 10% до 500 €. Кожна акція має окремі умови.',
    cashierIntro: 'У публічному розділі платежів після вибору Канади й CAD для депозитів були Interac, картки, Neteller, MiFinity та криптовалюти. Для виплат також зазначені Skrill і банківський переказ. Методи й ліміти залежать від країни, валюти та перевірки акаунта. Мінімум 20 € для вітального бонусу — не загальна вимога для всіх платежів.',
    payment: ['Депозити та виплати', 'Interac, Visa/Mastercard, Neteller, MiFinity та криптовалюти; для виплат також зазначені Skrill і банківський переказ', 'Використовуйте платіжні рахунки на власне ім’я. Депозити через Skrill і Neteller не дають права на вітальний бонус.'],
    canada: ['Канада: ліміти Interac', 'Депозити 10–9 000 CAD; виплати 10–3 000 CAD', 'Це ліміти платіжного методу, а не VIP-рівня. Початковий рівень у CAD дозволяє 750 CAD на день / 10 500 CAD на місяць.'],
    licence: 'У футері, загальних правилах і розділі про бренд за перевіреною адресою не було чітко зазначено оператора та номер ліцензії, які можна незалежно перевірити. Тому ми не подаємо ліцензію як підтверджену. Наявність країни в селекторі сайту сама собою не доводить місцевого дозволу.',
    support: 'Опубліковані канали підтримки — чат і support@vikingluck.com. Невирішене питання можна надіслати із зареєстрованої пошти на complaints@vikingluck.com: тема COMPLAINT, дані акаунта та опис із датами. Правила передбачають результат протягом десяти днів; для складних випадків строк можуть продовжити.',
    caution: 'Перед депозитом потрібно перевірити оператора, чинну ліцензію та дозвіл у своїй країні.',
    faqLicence: 'За перевіреними публічними сторінками ми не змогли незалежно підтвердити чинний номер ліцензії та юридичного оператора. Запитайте дані компанії, регулятора й дозволу для вашої країни. Сам доступ до сайту не доводить місцевої авторизації.',
    faqExclusion: 'Зверніться до support@vikingluck.com із проханням про перерву або самовиключення. Сторінка відповідальної гри обіцяє закриття за першої можливості, без чіткого строку. Не створюйте інший акаунт, щоб обійти обмеження.',
  },
  pt: {
    title: 'VikingLuck: análise 2026, bónus de 500 €, jogos e levantamentos',
    description: 'Análise VikingLuck: 100% até 500 € + 200 jogadas grátis, requisito 35x, bónus desportivo, jogos, Interac, cinco níveis de levantamento VIP e KYC.',
    intro: 'A VikingLuck reúne slots, casino ao vivo, jackpots e apostas desportivas, além de uma loja e cinco níveis VIP. Analisamos o bónus de casino de 100% até 500 € com 200 jogadas grátis, a oferta desportiva separada, os jogos, os pagamentos e as condições de levantamento a conhecer antes de depositar.',
    verdict: 'A VikingLuck destaca-se pelo catálogo extenso e pela possibilidade de usar casino e apostas desportivas na mesma conta. As jogadas de boas-vindas são distribuídas ao longo de dez dias, e o requisito de 35x incide sobre depósito mais bónus. Os limites de levantamento dependem do nível VIP. As páginas públicas consultadas não permitiram confirmar de forma independente o operador e a licença.',
    vip: ['Cinco níveis VIP', 'Os limites diários e mensais aumentam conforme o nível. A tabela em euros começa nos 500 € por dia e 7 000 € por mês.'],
    licenceCheck: 'Antes de depositar, confirme o operador, o número de licença atual e a autorização no seu país.',
    maxBet: 'A aposta máxima publicada com um bónus de casino ativo é 100 € ou o equivalente indicado. Violar as regras pode anular o bónus e os ganhos associados.',
    currencies: 'Os limites publicados incluem 750 CAD, 750 AUD e 1 000 NZD, todos com 200 jogadas grátis. O depósito mínimo depende da moeda da conta.',
    games: [
      ['Slots, jackpots e jogos instantâneos', 'Na verificação, o catálogo público mostrava 11 032 slots e 13 707 jogos no total. Novidades, exclusivos, jogos instantâneos e jackpots têm secções próprias. São contagens variáveis, não uma garantia de acesso a todos os títulos em qualquer país.'],
      ['Mesas ao vivo e game shows', 'Há categorias de roleta, blackjack, bacará e dados, póquer e game shows ao vivo. Também aparecem mesas internacionais e Gold Saloon. Nos jogos de mesa figuram Jacks or Better e Texas Holdem Bonus.'],
      ['Fornecedores de jogos', 'A lista inclui Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil e Thunderkick. A disponibilidade de cada estúdio e jogo pode variar por país.'],
      ['Galeria de novos jogos', `Os seis títulos ilustrados são ${newGames}. As imagens mostram os jogos da galeria, sem sugerir que a SpinCresta os tenha testado com dinheiro real.`],
    ],
    promotions: 'O bónus de fim de semana oferece 50% até 700 €; depósitos a partir de 50 € recebem também 50 jogadas. O bónus sem jogadas começa nos 20 €. Estão ainda publicados cashback semanal de casino de 15% até 3 000 €, cashback ao vivo de 25% até 200 € e cashback desportivo de 10% até 500 €. Cada promoção tem condições próprias.',
    cashierIntro: 'Ao selecionar Canadá e CAD na página pública de pagamentos, apareciam Interac, cartões, Neteller, MiFinity e criptomoedas para depósitos. Skrill e transferência bancária também estavam indicados para levantamentos. Os métodos e limites variam com o país, a moeda e a verificação da conta. O mínimo de 20 € do bónus não é um mínimo geral de pagamento.',
    payment: ['Depósitos e levantamentos', 'Interac, Visa/Mastercard, Neteller, MiFinity e cripto; Skrill e transferência bancária estavam indicados para levantamentos', 'Use meios de pagamento em seu nome. Depósitos com Skrill ou Neteller não dão direito ao bónus de boas-vindas.'],
    canada: ['Canadá: limites Interac', 'Depósitos de 10 a 9 000 CAD; levantamentos de 10 a 3 000 CAD', 'São limites do método de pagamento, não do nível VIP. O nível inicial em CAD permite 750 CAD por dia / 10 500 CAD por mês.'],
    licence: 'O rodapé, os termos gerais e a página de apresentação do endereço verificado não identificavam claramente um operador e um número de licença verificável. Não apresentamos, por isso, a licença como confirmada de forma independente. A presença de um país no seletor não prova uma autorização local.',
    support: 'Os contactos publicados são o chat e support@vikingluck.com. Um caso não resolvido pode ser enviado do email registado para complaints@vikingluck.com, com COMPLAINT no assunto, dados da conta e um resumo com datas. Os termos indicam uma decisão em dez dias, com possíveis extensões em casos complexos.',
    caution: 'É necessário verificar o operador, a licença atual e a autorização no seu país antes de depositar.',
    faqLicence: 'Não conseguimos confirmar de forma independente a licença atual e o operador legal pelas páginas públicas consultadas. Peça os dados da empresa, do regulador e da autorização no seu país. O simples acesso ao site não comprova autorização local.',
    faqExclusion: 'Peça uma pausa ou autoexclusão a support@vikingluck.com. A página de jogo responsável indica que a conta será encerrada assim que possível, sem um prazo fixo. Não abra outra conta para contornar a exclusão.',
  },
  fr: {
    title: 'VikingLuck avis 2026 : bonus 500 €, tours gratuits et retraits',
    description: 'Avis VikingLuck : 100 % jusqu’à 500 € + 200 tours gratuits, mises 35x, bonus sportif, jeux, Interac, cinq niveaux de retrait VIP et KYC.',
    intro: 'VikingLuck propose des machines à sous, un casino en direct, des jackpots et des paris sportifs, ainsi qu’une boutique et cinq niveaux VIP. Nous examinons le bonus casino de 100 % jusqu’à 500 € avec 200 tours gratuits, l’offre sportive distincte, les jeux, les paiements et les conditions de retrait à connaître avant de déposer.',
    verdict: 'VikingLuck se distingue par son catalogue étendu et l’accès au casino comme aux paris depuis un même compte. Les tours de bienvenue sont répartis sur dix jours ; les mises requises de 35x portent sur le dépôt et le bonus réunis. Les plafonds de retrait dépendent du niveau VIP. Les pages publiques consultées n’ont pas permis de confirmer indépendamment l’opérateur et la licence.',
    vip: ['Cinq niveaux VIP', 'Les plafonds quotidiens et mensuels augmentent selon le niveau. Le tableau en euros commence à 500 € par jour et 7 000 € par mois.'],
    licenceCheck: 'Avant de déposer, vérifiez l’opérateur, le numéro de licence actuel et les autorisations dans votre pays.',
    maxBet: 'La mise maximale publiée avec un bonus casino actif est de 100 € ou l’équivalent indiqué. Enfreindre les règles peut annuler le bonus et les gains associés.',
    currencies: 'Les plafonds publiés comprennent 750 CAD, 750 AUD et 1 000 NZD, chacun avec 200 tours gratuits. Le dépôt minimum dépend de la devise du compte.',
    games: [
      ['Machines à sous, jackpots et jeux instantanés', 'Lors de la vérification, le catalogue public affichait 11 032 machines à sous et 13 707 jeux au total. Nouveautés, exclusivités, jeux instantanés et jackpots ont leurs propres rubriques. Ces compteurs évoluent et ne garantissent pas l’accès à chaque titre dans tous les pays.'],
      ['Tables en direct et jeux télévisés', 'Les catégories en direct couvrent roulette, blackjack, baccarat et dés, poker et jeux télévisés. Des tables internationales et Gold Saloon sont également proposés. La rubrique des jeux de table comprend Jacks or Better et Texas Holdem Bonus.'],
      ['Studios de jeux', 'La liste comprend Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil et Thunderkick. L’accès à certains studios et jeux peut varier selon le pays.'],
      ['Galerie des nouveautés', `Les six titres illustrés sont ${newGames}. Les images présentent les jeux de la galerie ; elles ne signifient pas que SpinCresta les a testés avec un dépôt réel.`],
    ],
    promotions: 'Le bonus de rechargement du week-end offre 50 % jusqu’à 700 €, avec 50 tours supplémentaires à partir de 50 € de dépôt. Le bonus sans tours commence à 20 €. Figurent aussi un cashback casino hebdomadaire de 15 % jusqu’à 3 000 €, un cashback en direct de 25 % jusqu’à 200 € et un cashback sportif de 10 % jusqu’à 500 €. Chaque offre a ses propres conditions.',
    cashierIntro: 'Après sélection du Canada et du CAD sur la page publique des paiements, Interac, cartes, Neteller, MiFinity et cryptomonnaies étaient proposés pour les dépôts. Skrill et virement bancaire étaient aussi indiqués pour les retraits. Les méthodes et limites dépendent du pays, de la devise et de la vérification. Le minimum de 20 € du bonus n’est pas un minimum général de paiement.',
    payment: ['Dépôts et retraits', 'Interac, Visa/Mastercard, Neteller, MiFinity et crypto ; Skrill et virement bancaire étaient indiqués pour les retraits', 'Utilisez des moyens de paiement à votre nom. Les dépôts par Skrill et Neteller ne donnent pas droit au bonus de bienvenue.'],
    canada: ['Canada : limites Interac', 'Dépôts de 10 à 9 000 CAD ; retraits de 10 à 3 000 CAD', 'Il s’agit des limites du moyen de paiement, pas du niveau VIP. Le premier niveau en CAD autorise 750 CAD par jour / 10 500 CAD par mois.'],
    licence: 'Le pied de page, les conditions générales et la page de présentation de l’adresse examinée n’identifiaient pas clairement un opérateur et un numéro de licence vérifiable. Nous ne présentons donc pas la licence comme confirmée indépendamment. La présence d’un pays dans le sélecteur ne prouve pas une autorisation locale.',
    support: 'Les canaux publiés sont le chat et support@vikingluck.com. Un litige non résolu peut être envoyé depuis l’email enregistré à complaints@vikingluck.com, avec COMPLAINT en objet, les données du compte et un résumé daté. Les conditions prévoient une décision sous dix jours, avec une prolongation possible pour les cas complexes.',
    caution: 'L’opérateur, la licence actuelle et les autorisations locales doivent être vérifiés avant tout dépôt.',
    faqLicence: 'Les pages publiques consultées n’ont pas permis de confirmer indépendamment la licence actuelle et l’opérateur légal. Demandez les coordonnées de l’entité, du régulateur et les autorisations pour votre pays. L’accès au site ne prouve pas à lui seul une autorisation locale.',
    faqExclusion: 'Demandez une pause ou une auto-exclusion à support@vikingluck.com. La page de jeu responsable prévoit la fermeture dès que possible, sans délai fixe. N’ouvrez pas un autre compte pour contourner l’exclusion.',
  },
  hi: {
    title: 'VikingLuck समीक्षा 2026: €500 बोनस, स्पिन और निकासी',
    description: 'VikingLuck समीक्षा: €500 तक 100% + 200 मुफ़्त स्पिन, 35x दाँव की शर्त, स्पोर्ट्स बोनस, गेम, Interac, पाँच VIP निकासी स्तर और KYC नियम।',
    intro: 'VikingLuck पर स्लॉट, लाइव कैसीनो, जैकपॉट और स्पोर्ट्स बेटिंग के साथ एक शॉप और पाँच VIP स्तर हैं। इस समीक्षा में हम €500 तक 100% कैसीनो बोनस और 200 मुफ़्त स्पिन, अलग स्पोर्ट्स ऑफर, गेम, भुगतान और निकासी की उन शर्तों को समझाते हैं जिन्हें जमा करने से पहले जानना चाहिए।',
    verdict: 'VikingLuck का बड़ा गेम कैटलॉग और एक ही खाते से कैसीनो व स्पोर्ट्स बेटिंग इस्तेमाल करना इसकी मुख्य विशेषताएँ हैं। वेलकम स्पिन दस दिनों में मिलते हैं, जबकि जमा और बोनस की कुल राशि पर 35x दाँव की शर्त है। निकासी सीमा VIP स्तर के अनुसार बदलती है। देखे गए सार्वजनिक पन्नों से संचालक और लाइसेंस की स्वतंत्र पुष्टि के लिए पर्याप्त जानकारी नहीं मिली।',
    vip: ['पाँच VIP स्तर', 'दैनिक और मासिक निकासी सीमा स्तर के साथ बढ़ती है। यूरो तालिका €500 रोज़ और €7,000 प्रति माह से शुरू होती है।'],
    licenceCheck: 'जमा से पहले मौजूदा संचालक, लाइसेंस संख्या और अपने देश में अनुमति की जाँच करें।',
    maxBet: 'सक्रिय कैसीनो बोनस के साथ प्रकाशित अधिकतम बेट €100 या बताई गई मुद्रा की बराबर राशि है। नियम तोड़ने पर बोनस और उससे जुड़ी जीत रद्द हो सकती है।',
    currencies: 'प्रकाशित बोनस सीमाओं में CAD750, AUD750 और NZD1,000 शामिल हैं; हर ऑफर के साथ 200 मुफ़्त स्पिन हैं। न्यूनतम जमा खाते की मुद्रा पर निर्भर है।',
    games: [
      ['स्लॉट, जैकपॉट और इंस्टेंट गेम', 'जाँच के समय सार्वजनिक सूची में 11,032 स्लॉट और कुल 13,707 गेम दिखे। नए व एक्सक्लूसिव गेम, इंस्टेंट गेम और जैकपॉट के अलग सेक्शन हैं। ये बदलते कैटलॉग आँकड़े हैं; हर देश में हर गेम मिलने की गारंटी नहीं।'],
      ['लाइव टेबल और गेम शो', 'लाइव श्रेणियों में रूलेट, ब्लैकजैक, बैकारेट व डाइस, पोकर और गेम शो हैं। अंतरराष्ट्रीय टेबल और Gold Saloon भी सूची में हैं। टेबल गेम में Jacks or Better और Texas Holdem Bonus दिखे।'],
      ['गेम बनाने वाले स्टूडियो', 'सूची में Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil और Thunderkick हैं। किसी स्टूडियो या गेम की उपलब्धता देश के अनुसार अलग हो सकती है।'],
      ['नए गेम की गैलरी', `तस्वीरों वाले छह शीर्षक हैं: ${newGames}। ये तस्वीरें गैलरी के गेम दिखाती हैं; इनका अर्थ यह नहीं कि SpinCresta ने उन्हें असली पैसे से परखा है।`],
    ],
    promotions: 'वीकेंड रीलोड में €700 तक 50% मिलता है; €50 से जमा करने पर 50 स्पिन भी मिलते हैं। बिना स्पिन वाला बोनस €20 से शुरू होता है। सूची में €3,000 तक 15% साप्ताहिक कैसीनो कैशबैक, €200 तक 25% लाइव कैशबैक और €500 तक 10% स्पोर्ट्स कैशबैक भी हैं। हर ऑफर की अपनी शर्तें हैं।',
    cashierIntro: 'सार्वजनिक भुगतान पन्ने पर Canada और CAD चुनने पर जमा के लिए Interac, कार्ड, Neteller, MiFinity और क्रिप्टो दिखे। निकासी के लिए Skrill और बैंक ट्रांसफर भी सूची में थे। तरीके और सीमाएँ देश, मुद्रा और खाते के सत्यापन पर निर्भर हैं। वेलकम बोनस की €20 न्यूनतम जमा सभी भुगतान तरीकों की सामान्य सीमा नहीं है।',
    payment: ['जमा और निकासी', 'Interac, Visa/Mastercard, Neteller, MiFinity और क्रिप्टो; निकासी सूची में Skrill और बैंक ट्रांसफर भी थे', 'अपने नाम के भुगतान खाते इस्तेमाल करें। Skrill और Neteller की जमा से वेलकम बोनस नहीं मिलता।'],
    canada: ['कनाडा: Interac सीमाएँ', 'जमा CAD10–9,000; निकासी CAD10–3,000', 'ये भुगतान तरीके की सीमाएँ हैं, VIP स्तर की नहीं। शुरुआती CAD VIP स्तर में CAD750 रोज़ और CAD10,500 प्रति माह निकासी है।'],
    licence: 'देखे गए पते के फुटर, सामान्य नियम और परिचय पन्ने में संचालक और सत्यापन योग्य लाइसेंस संख्या स्पष्ट नहीं थी। इसलिए हम लाइसेंस को स्वतंत्र रूप से पुष्टि किया हुआ नहीं बताते। देश के चयन में नाम दिखना स्थानीय अनुमति का प्रमाण नहीं है।',
    support: 'प्रकाशित सहायता चैनल चैट और support@vikingluck.com हैं। अनसुलझा मामला पंजीकृत ईमेल से complaints@vikingluck.com पर भेज सकते हैं: विषय COMPLAINT, खाते की जानकारी और तारीखों सहित विवरण। नियम दस दिनों में निर्णय बताते हैं; जटिल मामले में समय बढ़ सकता है।',
    caution: 'जमा से पहले संचालक, मौजूदा लाइसेंस और अपने देश में अनुमति की जाँच ज़रूरी है।',
    faqLicence: 'देखे गए सार्वजनिक पन्नों से मौजूदा लाइसेंस और कानूनी संचालक की स्वतंत्र पुष्टि नहीं हुई। कंपनी, नियामक और अपने देश में अनुमति की जानकारी माँगें। वेबसाइट खुलना स्थानीय अनुमति का प्रमाण नहीं है।',
    faqExclusion: 'support@vikingluck.com पर विराम या सेल्फ-एक्सक्लूज़न माँगें। जिम्मेदार गेमिंग पन्ना खाता जल्द से जल्द बंद करने की बात कहता है, लेकिन तय समय नहीं देता। रोक से बचने के लिए दूसरा खाता न खोलें।',
  },
  fi: {
    title: 'VikingLuck-arvostelu 2026: 500 € bonus, kierrokset ja nostot',
    description: 'VikingLuck-arvostelu: 100 % enintään 500 € + 200 ilmaiskierrosta, 35x kierrätys, vedonlyöntibonus, pelit, Interac, viisi VIP-nostotasoa ja KYC.',
    intro: 'VikingLuck tarjoaa kolikkopelejä, live-kasinon, jackpotteja ja vedonlyöntiä sekä palkintokaupan ja viisi VIP-tasoa. Käymme läpi 100 prosentin kasinobonuksen enintään 500 euroon ja 200 ilmaiskierrosta, erillisen vedonlyöntitarjouksen, pelit, maksut ja nostoehdot, jotka on hyvä tuntea ennen talletusta.',
    verdict: 'VikingLuckin vahvuuksia ovat laaja pelivalikoima sekä kasino ja vedonlyönti samalla tilillä. Tervetulokierrokset jaetaan kymmenen päivän aikana, ja 35x kierrätys koskee talletuksen ja bonuksen yhteissummaa. Nostorajat riippuvat VIP-tasosta. Tarkistetut julkiset sivut eivät antaneet riittävästi tietoa operaattorin ja lisenssin riippumattomaan vahvistamiseen.',
    vip: ['Viisi VIP-tasoa', 'Päivä- ja kuukausikohtaiset nostorajat kasvavat tason mukaan. Eurotaulukko alkaa 500 eurosta päivässä ja 7 000 eurosta kuukaudessa.'],
    licenceCheck: 'Tarkista nykyinen operaattori, lisenssinumero ja lupa omassa maassasi ennen talletusta.',
    maxBet: 'Aktiivisen kasinobonuksen julkaistu maksimipanos on 100 € tai ilmoitettu valuuttavastaavuus. Ehtojen rikkominen voi mitätöidä bonuksen ja siihen liittyvät voitot.',
    currencies: 'Julkaistuihin bonusrajoihin kuuluvat 750 CAD, 750 AUD ja 1 000 NZD, kaikki 200 ilmaiskierroksen kanssa. Minimitalletus riippuu tilin valuutasta.',
    games: [
      ['Kolikkopelit, jackpotit ja pikapelit', 'Tarkistushetkellä julkisessa luettelossa oli 11 032 kolikkopeliä ja yhteensä 13 707 peliä. Uutuuksilla, yksinoikeuspeleillä, pikapeleillä ja jackpoteilla on omat osionsa. Muuttuvat luetteloluvut eivät takaa kaikkien pelien saatavuutta jokaisessa maassa.'],
      ['Live-pöydät ja game show -pelit', 'Live-luokat kattavat ruletin, blackjackin, baccaratin ja nopat, pokerin sekä game show -pelit. Myös kansainväliset pöydät ja Gold Saloon on listattu. Pöytäpeleissä näkyivät Jacks or Better ja Texas Holdem Bonus.'],
      ['Peliyhtiöt', 'Listalla ovat Pragmatic Play, Pragmatic Live, Hacksaw Gaming, Playtech, Playson, Amusnet, Novomatic, BGaming, Betsoft, Yggdrasil ja Thunderkick. Yksittäisten yhtiöiden ja pelien saatavuus voi vaihdella maittain.'],
      ['Uusien pelien kuvagalleria', `Kuusi kuvattua peliä ovat ${newGames}. Kuvat esittelevät gallerian pelejä eivätkä tarkoita, että SpinCresta olisi testannut niitä oikealla rahalla.`],
    ],
    promotions: 'Viikonlopun talletusbonus on 50 % enintään 700 euroon; vähintään 50 euron talletukseen kuuluu myös 50 kierrosta. Pelkkä talletusbonus alkaa 20 eurosta. Listalla näkyvät myös kasinon viikoittainen cashback 15 % enintään 3 000 euroon, live-cashback 25 % enintään 200 euroon ja urheilun cashback 10 % enintään 500 euroon. Jokaisella tarjouksella on omat ehtonsa.',
    cashierIntro: 'Kun julkiselta maksusivulta valittiin Kanada ja CAD, talletuksiin tarjottiin Interacia, kortteja, Netelleriä, MiFinityä ja kryptovaluuttoja. Nostoihin oli listattu myös Skrill ja pankkisiirto. Maksutavat ja rajat riippuvat maasta, valuutasta ja tilin tarkistuksesta. Bonuksen 20 euron minimitalletus ei ole kaikkien maksutapojen yleinen alaraja.',
    payment: ['Talletukset ja nostot', 'Interac, Visa/Mastercard, Neteller, MiFinity ja kryptot; nostoihin oli listattu myös Skrill ja pankkisiirto', 'Käytä omissa nimissäsi olevia maksutilejä. Skrill- ja Neteller-talletukset eivät oikeuta tervetulobonukseen.'],
    canada: ['Kanada: Interacin rajat', 'Talletukset 10–9 000 CAD; nostot 10–3 000 CAD', 'Nämä ovat maksutavan rajoja, eivät VIP-nostorajoja. Alin CAD-taso sallii 750 CAD päivässä / 10 500 CAD kuukaudessa.'],
    licence: 'Tarkistetun osoitteen alatunniste, yleiset ehdot ja esittelysivu eivät yksilöineet selvästi operaattoria ja varmennettavaa lisenssinumeroa. Emme siksi esitä lisenssiä riippumattomasti vahvistettuna. Maan näkyminen valikossa ei yksin osoita paikallista lupaa.',
    support: 'Julkaistut tukikanavat ovat chat ja support@vikingluck.com. Ratkaisemattoman asian voi lähettää rekisteröidystä sähköpostista osoitteeseen complaints@vikingluck.com: aiheeksi COMPLAINT, mukaan tilitiedot ja päivämäärät sisältävä kuvaus. Ehdot lupaavat päätöksen kymmenessä päivässä; monimutkaisten tapausten määräaikaa voidaan jatkaa.',
    caution: 'Operaattori, nykyinen lisenssi ja oman maan lupa on tarkistettava ennen talletusta.',
    faqLicence: 'Emme voineet riippumattomasti vahvistaa nykyistä lisenssiä ja oikeudellista operaattoria julkisilta sivuilta. Pyydä tiedot yhtiöstä, valvojasta ja oman maasi luvasta. Pelkkä pääsy sivustolle ei osoita paikallista lupaa.',
    faqExclusion: 'Pyydä taukoa tai pelikieltoa osoitteesta support@vikingluck.com. Vastuullisen pelaamisen sivu kertoo tilin sulkemisesta mahdollisimman pian ilman tarkkaa määräaikaa. Älä avaa toista tiliä kiertääksesi kieltoa.',
  },
};

// FAQ answers use complete, idiomatic sentences rather than table shorthand.
const faqAnswers = {
  en: [
    'The casino offer is 100% up to €500 plus 200 free spins with a qualifying first deposit from €20. Published currency caps include CAD750, AUD750 and NZD1,000. Deposits through Skrill or Neteller are excluded.',
    'You receive 20 spins per day for ten days. Claim each daily batch within 24 hours and complete any active casino bonus before using the spins. Activating another offer can cancel the current bonus.',
    'Wager the deposit and bonus together 35 times within ten days of activation. Free-spin winnings require 40x wagering and are subject to conversion caps. A €100 deposit plus a €100 bonus therefore requires €7,000 in eligible wagers.',
    'No. You must choose either the casino or sports welcome offer. The standard sports cap is €100, with different limits in some countries. Sports rollover is 5x or 6x the combined deposit and bonus, depending on the country.',
    'The lowest euro VIP tier permits €500 per day and €7,000 per month. The highest tier permits €5,000 per day and €20,000 per month. Currency-specific limits apply, and no more than three withdrawal requests can be pending.',
    'Withdrawal processing takes up to three business days once the required checks are complete. KYC generally takes up to ten days after all requested documents are supplied, but can take longer. Payment-provider delivery time is additional.',
  ],
  de: [
    'Der Casinobonus beträgt 100 % bis 500 € plus 200 Freispiele bei der ersten qualifizierenden Einzahlung ab 20 €. Für andere Währungen sind unter anderem 750 CAD, 750 AUD und 1.000 NZD veröffentlicht. Einzahlungen mit Skrill oder Neteller sind ausgeschlossen.',
    'Sie erhalten zehn Tage lang jeweils 20 Freispiele. Jede Tagesreihe muss innerhalb von 24 Stunden abgeholt werden. Schließen Sie einen aktiven Casinobonus zuerst ab; eine weitere Aktion kann den bisherigen Bonus aufheben.',
    'Einzahlung und Bonus müssen zusammen innerhalb von zehn Tagen nach Aktivierung 35-mal umgesetzt werden. Freispielgewinne erfordern 40x Umsatz und haben Umwandlungsgrenzen. Bei 100 € Einzahlung und 100 € Bonus sind 7.000 € anrechenbarer Spieleinsatz nötig.',
    'Nein. Sie müssen zwischen dem Casino- und dem Sport-Willkommensbonus wählen. Der Sportbonus ist standardmäßig auf 100 € begrenzt; manche Länder haben andere Grenzen. Einzahlung und Bonus müssen je nach Land 5- oder 6-mal umgesetzt werden.',
    'Die niedrigste Euro-VIP-Stufe erlaubt 500 € täglich und 7.000 € monatlich. Die höchste erlaubt 5.000 € täglich und 20.000 € monatlich. Andere Währungen haben eigene Grenzen; höchstens drei Auszahlungsanträge dürfen gleichzeitig offen sein.',
    'Die Bearbeitung einer Auszahlung dauert nach Abschluss der erforderlichen Prüfungen bis zu drei Werktage. Die KYC-Prüfung dauert nach Eingang aller Unterlagen meist bis zu zehn Tage, gegebenenfalls länger. Die Überweisungsdauer des Zahlungsdienstes kommt hinzu.',
  ],
  es: [
    'El bono de casino es del 100 % hasta 500 € más 200 giros gratis con un primer depósito válido desde 20 €. Los máximos publicados en otras monedas incluyen 750 CAD, 750 AUD y 1.000 NZD. Los depósitos con Skrill o Neteller están excluidos.',
    'Recibes 20 giros diarios durante diez días. Debes recoger cada tanda en un plazo de 24 horas y completar antes cualquier bono de casino activo. Activar otra oferta puede cancelar el bono anterior.',
    'Debes apostar 35 veces la suma del depósito y el bono en diez días desde la activación. Las ganancias de giros requieren 40x y tienen límites de conversión. Un depósito de 100 € más un bono de 100 € exige 7.000 € de apuestas válidas.',
    'No. Debes elegir el bono de casino o el deportivo. El máximo deportivo habitual es 100 €, con límites diferentes en algunos países. El requisito es apostar 5 o 6 veces el depósito más el bono, según el país.',
    'El nivel VIP inicial en euros permite 500 € al día y 7.000 € al mes. El más alto permite 5.000 € al día y 20.000 € al mes. Se aplican límites por moneda y puede haber como máximo tres solicitudes de retiro pendientes.',
    'La tramitación del retiro tarda hasta tres días laborables una vez completadas las comprobaciones. El KYC suele tardar hasta diez días desde la entrega de todos los documentos solicitados, aunque puede prolongarse. El tiempo de entrega del proveedor de pago se añade a esos plazos.',
  ],
  it: [
    'Il bonus casinò è del 100% fino a 500 € più 200 giri gratis sul primo deposito valido da 20 €. I massimali in altre valute comprendono 750 CAD, 750 AUD e 1.000 NZD. I depositi con Skrill o Neteller sono esclusi.',
    'Ricevi 20 giri al giorno per dieci giorni. Ogni gruppo va riscattato entro 24 ore, dopo aver completato eventuali bonus casinò attivi. Attivare un’altra offerta può annullare il bonus precedente.',
    'Devi rigiocare 35 volte la somma di deposito e bonus entro dieci giorni dall’attivazione. Le vincite dei giri richiedono un rigioco di 40x e sono soggette a limiti di conversione. Un deposito di 100 € più un bonus di 100 € richiede 7.000 € di puntate valide.',
    'No. Devi scegliere il bonus di benvenuto casinò oppure quello sportivo. Il massimale sportivo standard è 100 €, con importi diversi in alcuni paesi. Il rigioco di deposito e bonus è di 5x o 6x secondo il paese.',
    'Il primo livello VIP in euro permette 500 € al giorno e 7.000 € al mese. Il più alto permette 5.000 € al giorno e 20.000 € al mese. Si applicano limiti specifici per valuta e possono esserci al massimo tre richieste di prelievo in sospeso.',
    'L’elaborazione del prelievo richiede fino a tre giorni lavorativi dopo i controlli necessari. La verifica KYC dura normalmente fino a dieci giorni dalla consegna di tutti i documenti richiesti, ma può richiedere più tempo. Si aggiungono i tempi del servizio di pagamento.',
  ],
  pl: [
    'Bonus kasynowy wynosi 100% do 500 € plus 200 darmowych spinów przy pierwszej wpłacie od 20 €, spełniającej warunki promocji. Limity w innych walutach obejmują 750 CAD, 750 AUD i 1 000 NZD. Wpłaty przez Skrill lub Neteller są wyłączone.',
    'Otrzymujesz po 20 spinów dziennie przez dziesięć dni. Każdą partię trzeba odebrać w ciągu 24 godzin, a wcześniej ukończyć aktywny bonus kasynowy. Aktywacja innej oferty może anulować poprzedni bonus.',
    'Wpłatę i bonus należy łącznie obrócić 35 razy w ciągu dziesięciu dni od aktywacji. Wygrane ze spinów wymagają obrotu 40x i podlegają limitom zamiany. Wpłata 100 € plus bonus 100 € oznacza 7 000 € stawek zaliczanych do obrotu.',
    'Nie. Trzeba wybrać bonus kasynowy albo sportowy. Standardowy limit sportowy wynosi 100 €, z innymi kwotami w niektórych krajach. Obrót wpłaty i bonusu wynosi 5x lub 6x zależnie od kraju.',
    'Najniższy poziom VIP w euro pozwala wypłacić 500 € dziennie i 7 000 € miesięcznie. Najwyższy pozwala na 5 000 € dziennie i 20 000 € miesięcznie. Inne waluty mają własne limity; jednocześnie mogą oczekiwać najwyżej trzy zlecenia wypłaty.',
    'Realizacja wypłaty zajmuje do trzech dni roboczych po zakończeniu wymaganych kontroli. KYC trwa zwykle do dziesięciu dni od dostarczenia wszystkich dokumentów, ale może potrwać dłużej. Czas przekazania środków przez dostawcę płatności jest dodatkowy.',
  ],
  uk: [
    'Вітальний бонус казино — 100% до 500 € і 200 фріспінів за перший депозит від 20 €, який відповідає умовам акції. Серед лімітів в інших валютах — 750 CAD, 750 AUD і 1 000 NZD. Депозити через Skrill або Neteller не підходять.',
    'Ви отримуєте по 20 фріспінів щодня протягом десяти днів. Кожен набір потрібно забрати протягом 24 годин. Перед використанням завершіть активний бонус казино; активація іншої пропозиції може скасувати попередній бонус.',
    'Суму депозиту й бонусу потрібно відіграти 35 разів протягом десяти днів після активації. Для виграшів із фріспінів діє відіграш 40× та ліміти конвертації. Наприклад, депозит 100 € і бонус 100 € потребують 7 000 € ставок, які зараховуються до відіграшу.',
    'Ні. Потрібно обрати вітальний бонус казино або спортивний. Стандартний спортивний ліміт — 100 €, але для окремих країн суми відрізняються. Відіграш суми депозиту та бонусу становить 5× або 6× залежно від країни.',
    'Початковий VIP-рівень у євро дозволяє виводити 500 € на день і 7 000 € на місяць. Найвищий — 5 000 € на день і 20 000 € на місяць. Для інших валют діють окремі ліміти; одночасно можуть очікувати не більше ніж три запити на виплату.',
    'Виплату обробляють до трьох робочих днів після завершення потрібних перевірок. Перевірка KYC зазвичай триває до десяти днів після надання всіх документів, але може зайняти більше часу. Строк переказу платіжним провайдером додається окремо.',
  ],
  pt: [
    'O bónus de casino é de 100% até 500 € mais 200 jogadas grátis no primeiro depósito elegível a partir de 20 €. Os limites noutras moedas incluem 750 CAD, 750 AUD e 1 000 NZD. Depósitos com Skrill ou Neteller estão excluídos.',
    'Recebe 20 jogadas por dia durante dez dias. Cada lote deve ser ativado no prazo de 24 horas, depois de concluir qualquer bónus de casino ativo. Ativar outra oferta pode anular o bónus anterior.',
    'É necessário apostar 35 vezes a soma do depósito e do bónus em dez dias após a ativação. Os ganhos das jogadas exigem 40x e estão sujeitos a limites de conversão. Um depósito de 100 € mais um bónus de 100 € exige 7 000 € em apostas válidas.',
    'Não. É preciso escolher o bónus de casino ou o desportivo. O limite desportivo habitual é 100 €, com valores diferentes em alguns países. O requisito é apostar 5 ou 6 vezes a soma do depósito e do bónus, conforme o país.',
    'O primeiro nível VIP em euros permite 500 € por dia e 7 000 € por mês. O mais elevado permite 5 000 € por dia e 20 000 € por mês. Aplicam-se limites por moeda e podem estar pendentes, no máximo, três pedidos de levantamento.',
    'O processamento do levantamento demora até três dias úteis após as verificações necessárias. O KYC costuma demorar até dez dias depois da entrega de todos os documentos, mas pode prolongar-se. O tempo de transferência do prestador de pagamento é adicional.',
  ],
  fr: [
    'Le bonus casino est de 100 % jusqu’à 500 € plus 200 tours gratuits au premier dépôt admissible à partir de 20 €. Les plafonds dans d’autres devises comprennent 750 CAD, 750 AUD et 1 000 NZD. Les dépôts par Skrill ou Neteller sont exclus.',
    'Vous recevez 20 tours par jour pendant dix jours. Chaque lot doit être récupéré sous 24 heures, après avoir terminé tout bonus casino actif. Activer une autre offre peut annuler le bonus précédent.',
    'Il faut miser 35 fois la somme du dépôt et du bonus dans les dix jours suivant l’activation. Les gains des tours exigent 40x et sont soumis à des plafonds de conversion. Un dépôt de 100 € plus un bonus de 100 € nécessite donc 7 000 € de mises admissibles.',
    'Non. Il faut choisir le bonus casino ou le bonus sportif. Le plafond sportif standard est de 100 €, avec des montants différents dans certains pays. Les mises requises sont de 5x ou 6x la somme du dépôt et du bonus, selon le pays.',
    'Le premier niveau VIP en euros autorise 500 € par jour et 7 000 € par mois. Le plus élevé autorise 5 000 € par jour et 20 000 € par mois. Des plafonds propres à chaque devise s’appliquent, avec trois demandes de retrait en attente au maximum.',
    'Le traitement du retrait prend jusqu’à trois jours ouvrés après les vérifications nécessaires. Le KYC prend généralement jusqu’à dix jours après réception de tous les documents demandés, mais peut durer davantage. Le délai de transfert du prestataire de paiement s’ajoute à ces durées.',
  ],
  hi: [
    'पहली योग्य जमा €20 से शुरू होने पर कैसीनो ऑफर में €500 तक 100% बोनस और 200 मुफ़्त स्पिन मिलते हैं। दूसरी मुद्राओं की प्रकाशित सीमाओं में CAD750, AUD750 और NZD1,000 हैं। Skrill या Neteller की जमा पर यह ऑफर नहीं मिलता।',
    'दस दिनों तक रोज़ 20 स्पिन मिलते हैं। हर समूह 24 घंटे के भीतर लें और स्पिन इस्तेमाल करने से पहले सक्रिय कैसीनो बोनस पूरा करें। दूसरा ऑफर सक्रिय करने पर मौजूदा बोनस रद्द हो सकता है।',
    'सक्रिय करने के दस दिनों में जमा और बोनस की कुल राशि का 35 गुना दाँव लगाना होता है। मुफ़्त स्पिन से हुई जीत पर 40x दाँव की शर्त और रूपांतरण सीमा है। €100 जमा और €100 बोनस पर €7,000 के मान्य दाँव चाहिए।',
    'नहीं। कैसीनो या स्पोर्ट्स वेलकम ऑफर में से एक चुनना होता है। स्पोर्ट्स का सामान्य बोनस अधिकतम €100 है, लेकिन कुछ देशों में राशि अलग है। देश के अनुसार जमा और बोनस की कुल राशि का 5 या 6 गुना दाँव लगाना होता है।',
    'शुरुआती यूरो VIP स्तर में €500 रोज़ और €7,000 प्रति माह निकासी की अनुमति है। सबसे ऊँचे स्तर में €5,000 रोज़ और €20,000 प्रति माह है। दूसरी मुद्राओं की अलग सीमाएँ हैं और एक समय में अधिकतम तीन निकासी अनुरोध लंबित रह सकते हैं।',
    'ज़रूरी जाँच पूरी होने के बाद निकासी प्रक्रिया में तीन कार्यदिवस तक लगते हैं। सभी माँगे गए दस्तावेज़ मिलने के बाद KYC आम तौर पर दस दिन तक लेता है, लेकिन अधिक समय भी लग सकता है। भुगतान सेवा से पैसा पहुँचने का समय अलग जुड़ता है।',
  ],
  fi: [
    'Kasinobonus on 100 % enintään 500 euroon sekä 200 ilmaiskierrosta ensimmäiselle hyväksyttävälle talletukselle alkaen 20 eurosta. Muiden valuuttojen julkaistut rajat ovat esimerkiksi 750 CAD, 750 AUD ja 1 000 NZD. Skrill- ja Neteller-talletukset eivät kelpaa tarjoukseen.',
    'Saat 20 ilmaiskierrosta päivässä kymmenen päivän ajan. Lunasta kukin erä 24 tunnissa ja täytä aktiivisen kasinobonuksen ehdot ennen kierrosten käyttöä. Toisen tarjouksen aktivointi voi peruuttaa aiemman bonuksen.',
    'Talletuksen ja bonuksen yhteissumma on kierrätettävä 35 kertaa kymmenen päivän kuluessa aktivoinnista. Kierrosvoitot vaativat 40x kierrätyksen, ja niitä koskevat muuntorajat. Sadan euron talletus ja sadan euron bonus vaativat siis 7 000 euroa hyväksyttäviä panoksia.',
    'Et voi. Valitse kasinon tai vedonlyönnin tervetulobonus. Vedonlyönnin perusraja on 100 euroa, mutta joissakin maissa summa on eri. Talletus ja bonus kierrätetään yhteensä 5 tai 6 kertaa maan mukaan.',
    'Alin euro-VIP-taso sallii 500 euroa päivässä ja 7 000 euroa kuukaudessa. Ylin sallii 5 000 euroa päivässä ja 20 000 euroa kuukaudessa. Muille valuutoille on omat rajansa, ja enintään kolme nostopyyntöä voi odottaa käsittelyä.',
    'Noston käsittely kestää enintään kolme arkipäivää tarvittavien tarkistusten jälkeen. KYC kestää yleensä enintään kymmenen päivää kaikkien pyydettyjen asiakirjojen toimittamisesta, mutta voi viedä pidempään. Maksupalvelun siirtoaika tulee lisäksi.',
  ],
};

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const replaceSection = (html, id, transform) => {
  const re = new RegExp(`<section class="container" id="${id}">[\\s\\S]*?<\\/section>`);
  if (!re.test(html)) throw new Error(`Missing template section ${id}`);
  return html.replace(re, transform);
};
const replaceCells = (section, index, values) => {
  let i = 0;
  const result = section.replace(/<tr>([\s\S]*?)<\/tr>/g, (row) => {
    if (!row.includes('<td>')) return row;
    if (i++ !== index) return row;
    let c = 0;
    return row.replace(/<td>[\s\S]*?<\/td>/g, cell => values[c] == null ? (c++, cell) : `<td>${esc(values[c++])}</td>`);
  });
  if (i <= index) throw new Error(`Missing table row ${index}`);
  return result;
};

for (const locale of locales) {
  const c = copy[locale];
  let html = fs.readFileSync(`${prefix(locale)}brands/viperwin/index.html`, 'utf8')
    .replaceAll('ViperWin', 'VikingLuck').replaceAll('viperwin', 'vikingluck')
    .replaceAll('/images/vikingluck.png', '/images/vikingluck.webp')
    .replaceAll('offer_id=124852', 'offer_id=124853')
    .replaceAll('20261003-vikingluck-2', '20261003-vikingluck-1')
    .replaceAll('https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/spincresta/brands/vikingluck/main-page/vikingluck-page_je2txg', screenshot);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(c.title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g, `$1${esc(c.description)}$2`)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*("\s*\/?>)/g, `$1${esc(c.title)}$2`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(c.intro)}</p>`);
  let featureIndex = 0;
  html = html.replace(/<div class="feature-card glass-card"><div class="icon-placeholder">[\s\S]*?<\/div><strong>[\s\S]*?<\/strong><span>[\s\S]*?<\/span><\/div>/g, card => {
    if (featureIndex++ !== 4) return card;
    return card.replace(/<strong>[\s\S]*?<\/strong>/, `<strong>${esc(c.vip[0])}</strong>`).replace(/<span>[\s\S]*?<\/span>/, `<span>${esc(c.vip[1])}</span>`);
  });
  if (featureIndex !== 6) throw new Error(`${locale}: expected six feature cards`);
  html = replaceSection(html, 'vikingluck-verdict', section => replaceCells(
    section.replace(/<p class="section-intro">[\s\S]*?<\/p>/, `<p class="section-intro">${esc(c.verdict)}</p>`), 3, [null, null, c.licenceCheck]));
  html = replaceSection(html, 'vikingluck-bonus', section => replaceCells(replaceCells(section, 0, [null, null, c.currencies]), 4, [null, null, c.maxBet]));
  html = replaceSection(html, 'vikingluck-games', section => section.replace(/<div class="features-grid premium-grid">[\s\S]*<\/div>/, `<div class="features-grid premium-grid">${c.games.map(([title, text]) => `<article class="feature-card glass-card"><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`));
  html = replaceSection(html, 'vikingluck-sports', section => {
    let i = 0;
    return section.replace(/<article class="feature-card glass-card">[\s\S]*?<\/article>/g, card => i++ === 3 ? card.replace(/<p>[\s\S]*?<\/p>/, `<p>${esc(c.promotions)}</p>`) : card);
  });
  html = replaceSection(html, 'vikingluck-payments', section => replaceCells(
    section.replace(/<p class="section-intro">[\s\S]*?<\/p>/, `<p class="section-intro">${esc(c.cashierIntro)}</p>`), 0, c.payment)
    .replace('</tbody>', `<tr>${c.canada.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr></tbody>`));
  html = replaceSection(html, 'vikingluck-safety', section => {
    let i = 0;
    return section.replace(/<article class="feature-card glass-card">[\s\S]*?<\/article>/g, card => {
      const text = [c.licence, c.support, null][i++];
      return text == null ? card : card.replace(/<p>[\s\S]*?<\/p>/, `<p>${esc(text)}</p>`);
    });
  });
  html = replaceSection(html, 'pros-cons', section => {
    let i = 0;
    return section.replace(/<span>[\s\S]*?<\/span>/g, span => i++ === 7 ? `<span>- ${esc(c.caution)}</span>` : span);
  });
  html = replaceSection(html, 'faq', section => {
    let i = 0;
    return section.replace(/<h3>[\s\S]*?<\/h3><p>[\s\S]*?<\/p>/g, pair => {
      const text = [...faqAnswers[locale], c.faqLicence, c.faqExclusion][i++];
      return text == null ? pair : pair.replace(/<p>[\s\S]*?<\/p>/, `<p>${esc(text)}</p>`);
    });
  });
  const faqSection = html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq = [...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([, q, a]) => [decode(q), decode(a)]);
  if (faq.length !== 8) throw new Error(`${locale}: expected eight FAQ items`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, json, close) => {
    const schema = JSON.parse(json);
    for (const node of schema['@graph']) {
      if (node['@type'] === 'WebPage') { node.name = c.title; node.description = c.description; }
      if (node['@type'] === 'Article') { node.headline = c.title; node.description = c.description; }
      if (node['@type'] === 'FAQPage') node.mainEntity = faq.map(([q, a]) => ({'@type': 'Question', name: q, acceptedAnswer: {'@type': 'Answer', text: a}}));
    }
    return open + JSON.stringify(schema) + close;
  });
  if (/ViperWin|viperwin|_je2txg|Le Bandit Monsters|Sun Totem|Moon Dynasty|Battle Thunder/.test(html)) throw new Error(`${locale}: template brand or games leaked`);
  if (!html.includes('index, follow, max-image-preview:large')) throw new Error(`${locale}: missing index directive`);
  const file = `${prefix(locale)}brands/vikingluck/index.html`;
  fs.writeFileSync(file, html);
  console.log(`Built ${file}`);
}
