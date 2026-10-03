import fs from 'node:fs';

// Layout and independently rechecked shared terms: VikingLuck review.
// Casinado mirror checked on 2026-10-03: rules v1.12 (19.08.2026), both
// welcome offers, Canada/CAD cashier, catalogue, Collections, Champions Cup,
// About, complaints and responsible gaming. No real-money test is claimed.
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const prefix = locale => locale === 'en' ? '' : `${locale}/`;
const screenshot = 'https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1791035543/spincresta/brands/casinado/main-page/casinado-page_z6soxv';
const games = "Spooktacular Bonanza, Nectar of Power, Fruit Mashin’, Frosty Bonanza, Big Catch Rush, 3 Crown Coins Deluxe";
const copy = {
  en: {
    title: 'Casinado Review 2026: €500 Bonus, Games & Withdrawal Rules',
    description: 'Casinado review: 100% up to €500 + 200 free spins, 35x wagering, sports bonus, Collections, Interac, VIP withdrawal limits and KYC checks.',
    intro: 'Casinado combines a casino, live tables and a sportsbook with horse racing, card Collections and Champions Cup rewards. Its casino welcome offer is 100% up to €500 plus 200 free spins. This review explains the bonus schedule, wagering, separate sports offer, games and withdrawal rules, including the limits and unclear terms worth checking before a deposit.',
    verdict: 'Casinado is built around casino games and sports betting in one account, with additional card-collection and Cup rewards. Its headline bonus needs closer attention: the 200 spins arrive over ten days, and 35x wagering applies to both the deposit and bonus. Five VIP tiers determine withdrawal allowances. The welcome page and general rules publish different maximum-bet figures, while a named operator and current licence were not independently verified.',
    together: 'Slots, live tables, sports betting, live betting, horse racing and virtual sports share one account.',
    rewards: ['Collections and Champions Cup', 'Collectible player cards, weekly challenges and Cup points sit alongside the casino and sports offers.'],
    gameCards: [
      ['Slots, jackpots and instant games', 'The lobby separates Slots, New, Exclusive, Bonus Buys, Megaways and Jackpots. Instant Games includes Hot Keno, Jet Crash, Mines, Plinko and scratch-card titles. Game availability and bonus eligibility are separate: a listed game may be excluded from wagering or prohibited with an active bonus.'],
      ['Live casino and table games', 'Visible live titles include Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time and Sweet Bonanza Candyland. The table-game lobby lists Jacks or Better, Texas Holdem Bonus, blackjack and roulette. Table language and access vary by market.'],
      ['Studios and game selection', 'The provider list includes Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming and Betsoft. Search and provider filters help narrow the selection; an individual studio’s presence does not guarantee every title in every country.'],
      ['New Games gallery', `The six featured games are ${games}. Check the current lobby for each title’s availability and bonus eligibility before playing.`],
    ],
    promos: 'The public promotion list advertises 15% weekly casino cashback up to €3,000, a weekend reload up to €700 with 50 spins, 25% live cashback up to €200 and 10% sports cashback up to €500. Sunday Spins, weekly reloads and horse-racing promotions have separate eligibility and wagering rules; these amounts are not one combined welcome package.',
    rewardCard: ['Collections, Cup and VIP', 'Collections lets players use points for football-themed cards and team rewards. Champions Cup also tracks points earned through qualifying real-money activity and challenges. Published Cup reward rules include 1x wagering, a 5x withdrawal cap and possible removal of points after three months without use. Reward figures vary across the public pages, so check the account’s current terms rather than treating them as guaranteed cash. VIP payout status uses the preceding 90 days of activity.'],
    betFinding: 'Welcome page: €100; general rule 7.19: €5; conversion up to 10x bonus',
    betNote: 'The welcome page publishes a €100 maximum bet, but general rule 7.19 flags bets above €5 before wagering is complete. Although specific promotion terms take precedence, obtain written clarification before relying on the higher figure. Bonus winnings are capped at 10x the initial bonus.',
  },
  de: {
    title: 'Casinado Test 2026: 500 € Bonus, Spiele und Auszahlung',
    description: 'Casinado im Überblick: 100 % bis 500 € + 200 Freispiele, 35x Umsatz, Sportbonus, Collections, Interac, VIP-Auszahlungslimits und KYC.',
    intro: 'Casinado verbindet Casino, Live-Tische und Sportwetten mit Pferderennen, Sammelkarten und dem Champions Cup. Der Casinobonus beträgt 100 % bis 500 € plus 200 Freispiele. Wir erklären die Freispielausgabe, Umsatzbedingungen, den separaten Sportbonus, die Spielauswahl und Auszahlungsregeln – einschließlich der Grenzen und unklaren Angaben, die vor einer Einzahlung wichtig sind.',
    verdict: 'Bei Casinado lassen sich Casino und Sportwetten über ein Konto nutzen; Sammelkarten und Cup-Prämien ergänzen das Angebot. Der Willkommensbonus hat klare Hürden: Die 200 Freispiele werden über zehn Tage verteilt, und der 35-fache Umsatz gilt für Einzahlung plus Bonus. Fünf VIP-Stufen bestimmen die Auszahlungslimits. Beim Höchsteinsatz widersprechen sich Bonusseite und allgemeine Regeln. Betreiber und aktuelle Lizenz konnten wir nicht unabhängig bestätigen.',
    together: 'Slots, Live-Tische, Sportwetten, Live-Wetten, Pferderennen und virtuelle Sportarten sind über ein Konto zugänglich.',
    rewards: ['Collections und Champions Cup', 'Sammelkarten, wöchentliche Aufgaben und Cup-Punkte ergänzen die Casino- und Sportangebote.'],
    gameCards: [
      ['Slots, Jackpots und Sofortspiele', 'Die Lobby hat eigene Bereiche für Slots, neue und exklusive Spiele, Bonuskäufe, Megaways und Jackpots. Bei den Sofortspielen sind Hot Keno, Jet Crash, Mines, Plinko und Rubbellose sichtbar. Ein gelistetes Spiel ist nicht automatisch bonusberechtigt: Es kann vom Umsatz ausgeschlossen oder mit aktivem Bonus gesperrt sein.'],
      ['Live-Casino und Tischspiele', 'Sichtbare Live-Titel sind Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time und Sweet Bonanza Candyland. Bei den Tischspielen erscheinen Jacks or Better, Texas Holdem Bonus, Blackjack und Roulette. Tischsprache und Zugang können sich je nach Land unterscheiden.'],
      ['Studios und Spielauswahl', 'Die Anbieterliste enthält Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming und Betsoft. Suche und Anbieterfilter erleichtern die Auswahl. Ein gelistetes Studio bedeutet nicht, dass alle seine Spiele überall verfügbar sind.'],
      ['Galerie der neuen Spiele', `Die Galerie zeigt ${games}. Prüfen Sie in der aktuellen Lobby, welche Titel verfügbar und für den Bonus zugelassen sind.`],
    ],
    promos: 'Die Aktionsliste nennt 15 % wöchentliches Casino-Cashback bis 3.000 €, einen Wochenend-Reload bis 700 € mit 50 Freispielen, 25 % Live-Cashback bis 200 € und 10 % Sportwetten-Cashback bis 500 €. Sunday Spins, wöchentliche Reloads und Pferderennaktionen haben eigene Teilnahme- und Umsatzregeln. Diese Beträge gehören nicht zu einem gemeinsamen Willkommenspaket.',
    rewardCard: ['Collections, Cup und VIP', 'Bei Collections lassen sich Punkte für Fußball-Sammelkarten und Teamprämien einsetzen. Der Champions Cup zählt Punkte aus qualifizierenden Echtgeldaktivitäten und Aufgaben. Die veröffentlichten Prämienregeln nennen 1x Umsatz, eine Auszahlung bis zum Fünffachen der Prämie und möglichen Punkteverlust nach drei Monaten ohne Nutzung. Da die Prämienangaben auf den öffentlichen Seiten variieren, sind die aktuellen Kontobedingungen maßgeblich. Der VIP-Auszahlungsstatus berücksichtigt die letzten 90 Tage.'],
    betFinding: 'Bonusseite: 100 €; allgemeine Regel 7.19: 5 €; Umwandlung bis 10x Bonus',
    betNote: 'Die Bonusseite nennt 100 € als Höchsteinsatz, während Regel 7.19 Einsätze über 5 € vor Abschluss des Umsatzes beanstandet. Spezifische Aktionsbedingungen haben Vorrang; lassen Sie den höheren Betrag dennoch schriftlich bestätigen. Die Bonusgewinne sind auf das Zehnfache des ursprünglichen Bonus begrenzt.',
  },
  es: {
    title: 'Casinado: reseña 2026, bono de 500 €, juegos y retiros',
    description: 'Reseña de Casinado: 100 % hasta 500 € + 200 giros gratis, requisito 35x, bono deportivo, Collections, Interac, límites VIP y KYC.',
    intro: 'Casinado reúne casino, mesas en vivo y apuestas deportivas, con carreras de caballos, colecciones de cartas y premios del Champions Cup. El bono de casino es del 100 % hasta 500 € más 200 giros gratis. Explicamos cómo se entregan los giros, los requisitos de apuesta, la oferta deportiva separada, los juegos y las reglas de retiro, con los límites y dudas que conviene resolver antes de depositar.',
    verdict: 'Casinado permite usar el casino y las apuestas deportivas desde una cuenta, con cartas coleccionables y premios del Cup como complemento. El bono de bienvenida exige atención: los 200 giros se reparten durante diez días y el requisito de 35x se aplica al depósito más el bono. Hay cinco niveles de retiro VIP. La página del bono y los términos generales publican máximos de apuesta distintos; no pudimos confirmar de forma independiente el operador ni la licencia vigente.',
    together: 'Tragamonedas, mesas en vivo, apuestas deportivas, apuestas en directo, carreras de caballos y deportes virtuales comparten una cuenta.',
    rewards: ['Collections y Champions Cup', 'Cartas coleccionables, retos semanales y puntos del Cup complementan las ofertas de casino y deportes.'],
    gameCards: [
      ['Tragamonedas, jackpots y juegos instantáneos', 'El catálogo separa tragamonedas, novedades, exclusivos, compra de bonos, Megaways y jackpots. En juegos instantáneos aparecen Hot Keno, Jet Crash, Mines, Plinko y raspaditas. La disponibilidad de un título no significa que sirva para el bono: puede no contribuir al requisito de apuesta o estar prohibido mientras haya un bono activo.'],
      ['Casino en vivo y juegos de mesa', 'Entre los títulos visibles están Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time y Sweet Bonanza Candyland. En juegos de mesa figuran Jacks or Better, Texas Holdem Bonus, blackjack y ruleta. El idioma y el acceso a las mesas varían según el mercado.'],
      ['Estudios y selección de juegos', 'La lista incluye Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming y Betsoft. La búsqueda y los filtros por proveedor facilitan la selección. La presencia de un estudio no garantiza todos sus juegos en todos los países.'],
      ['Galería de nuevos juegos', `La galería presenta ${games}. Antes de jugar, comprueba en el catálogo actual la disponibilidad de cada título y si es válido para el bono.`],
    ],
    promos: 'La lista anuncia cashback semanal de casino del 15 % hasta 3.000 €, una recarga de fin de semana hasta 700 € con 50 giros, cashback en vivo del 25 % hasta 200 € y cashback deportivo del 10 % hasta 500 €. Sunday Spins, las recargas semanales y las promociones de carreras tienen sus propias condiciones. No son importes de un único paquete de bienvenida.',
    rewardCard: ['Collections, Cup y VIP', 'Collections permite canjear puntos por cartas de fútbol y premios de equipos. El Champions Cup también acumula puntos mediante actividad elegible con dinero real y retos. Sus reglas publicadas incluyen un requisito de apuesta de 1x, un límite de retiro de 5x el premio y la posible eliminación de puntos tras tres meses sin uso. Como los importes publicados varían, consulta los términos actuales de tu cuenta y no los trates como dinero garantizado. El nivel de retiro VIP se calcula con la actividad de los últimos 90 días.'],
    betFinding: 'Página del bono: 100 €; regla general 7.19: 5 €; conversión hasta 10x el bono',
    betNote: 'La página de bienvenida publica una apuesta máxima de 100 €, pero la regla 7.19 considera indebidas las apuestas superiores a 5 € antes de completar el requisito. Las condiciones específicas tienen prioridad, aunque conviene pedir aclaración escrita antes de usar el máximo mayor. Las ganancias del bono están limitadas a diez veces el bono inicial.',
  },
  it: {
    title: 'Casinado recensione 2026: bonus 500 €, giochi e prelievi',
    description: 'Recensione Casinado: 100% fino a 500 € + 200 giri gratis, rigioco 35x, bonus sport, Collections, Interac, limiti VIP e verifica KYC.',
    intro: 'Casinado unisce casinò, tavoli live e scommesse sportive, con corse ippiche, carte da collezione e premi Champions Cup. Il bonus casinò è del 100% fino a 500 € più 200 giri gratis. Esaminiamo la distribuzione dei giri, il rigioco, il bonus sportivo separato, i giochi e i prelievi, comprese le regole da chiarire prima di depositare.',
    verdict: 'Casinado consente di usare casinò e scommesse con un solo conto, affiancando carte da collezione e premi del Cup. Il benvenuto richiede attenzione: i 200 giri sono distribuiti su dieci giorni e il rigioco 35x si applica a deposito e bonus insieme. Cinque livelli VIP determinano i limiti di prelievo. La pagina del bonus e i termini generali indicano puntate massime diverse; operatore e licenza attuale non sono stati confermati in modo indipendente.',
    together: 'Slot, tavoli live, scommesse sportive e in diretta, corse ippiche e sport virtuali si usano dallo stesso conto.',
    rewards: ['Collections e Champions Cup', 'Carte da collezione, sfide settimanali e punti del Cup affiancano le offerte di casinò e sport.'],
    gameCards: [
      ['Slot, jackpot e giochi istantanei', 'Il catalogo distingue slot, novità, esclusivi, acquisto bonus, Megaways e jackpot. Tra i giochi istantanei sono presenti Hot Keno, Jet Crash, Mines, Plinko e gratta e vinci. Un titolo disponibile non è necessariamente valido per il bonus: può non contribuire al rigioco o essere vietato quando un bonus è attivo.'],
      ['Casinò live e giochi da tavolo', 'I titoli visibili comprendono Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time e Sweet Bonanza Candyland. Nei giochi da tavolo figurano Jacks or Better, Texas Holdem Bonus, blackjack e roulette. Lingua e accesso ai tavoli variano secondo il mercato.'],
      ['Fornitori e scelta dei giochi', 'L’elenco include Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming e Betsoft. Ricerca e filtri per fornitore aiutano a scegliere. La presenza di uno studio non garantisce tutti i suoi giochi in ogni paese.'],
      ['Galleria delle nuove uscite', `La galleria presenta ${games}. Prima di giocare, controlla nel catalogo attuale la disponibilità di ogni titolo e la sua idoneità al bonus.`],
    ],
    promos: 'Le offerte pubbliche includono cashback settimanale casinò del 15% fino a 3.000 €, un reload del weekend fino a 700 € con 50 giri, cashback live del 25% fino a 200 € e cashback sportivo del 10% fino a 500 €. Sunday Spins, reload settimanali e promozioni ippiche hanno condizioni proprie: non formano un unico pacchetto di benvenuto.',
    rewardCard: ['Collections, Cup e VIP', 'Collections permette di usare punti per carte a tema calcistico e premi delle squadre. Il Champions Cup conta anche punti da attività idonee con denaro reale e sfide. Le regole pubblicate prevedono rigioco 1x, prelievo massimo pari a 5x il premio e possibile rimozione dei punti dopo tre mesi senza utilizzo. Gli importi non sono uniformi nelle pagine pubbliche: controlla le condizioni del conto e non considerarli denaro garantito. Il livello VIP per i prelievi considera i 90 giorni precedenti.'],
    betFinding: 'Pagina del bonus: 100 €; regola generale 7.19: 5 €; conversione fino a 10x il bonus',
    betNote: 'La pagina del benvenuto indica una puntata massima di 100 €, ma la regola 7.19 contesta puntate oltre 5 € prima del completamento del rigioco. Le condizioni specifiche prevalgono; chiedi comunque un chiarimento scritto prima di applicare il limite più alto. Le vincite da bonus sono limitate a dieci volte il bonus iniziale.',
  },
  pl: {
    title: 'Casinado opinia 2026: bonus 500 €, gry i zasady wypłat',
    description: 'Casinado: 100% do 500 € + 200 darmowych spinów, obrót 35x, bonus sportowy, Collections, Interac, limity wypłat VIP i weryfikacja KYC.',
    intro: 'Casinado łączy kasyno, stoły na żywo i zakłady sportowe z wyścigami konnymi, kolekcjami kart oraz nagrodami Champions Cup. Bonus kasynowy wynosi 100% do 500 € plus 200 darmowych spinów. Wyjaśniamy sposób przyznawania spinów, wymagany obrót, osobny bonus sportowy, gry i zasady wypłat, w tym kwestie wymagające wyjaśnienia przed wpłatą.',
    verdict: 'Casinado oferuje kasyno i zakłady na jednym koncie, uzupełnione kartami kolekcjonerskimi i nagrodami Cup. Oferta powitalna ma istotne warunki: 200 spinów jest rozłożonych na dziesięć dni, a obrót 35x obejmuje wpłatę i bonus razem. Limity wypłat zależą od pięciu poziomów VIP. Strona bonusu i regulamin podają różne maksymalne stawki; nie udało się niezależnie potwierdzić operatora i aktualnej licencji.',
    together: 'Sloty, stoły na żywo, zakłady sportowe i na żywo, wyścigi konne oraz sporty wirtualne są dostępne na jednym koncie.',
    rewards: ['Collections i Champions Cup', 'Karty kolekcjonerskie, cotygodniowe wyzwania i punkty Cup uzupełniają oferty kasyna oraz zakładów.'],
    gameCards: [
      ['Sloty, jackpoty i gry natychmiastowe', 'Katalog ma osobne działy slotów, nowości, gier ekskluzywnych, zakupu bonusów, Megaways i jackpotów. W grach natychmiastowych widoczne są Hot Keno, Jet Crash, Mines, Plinko i zdrapki. Dostępność gry nie oznacza jej zgodności z bonusem: może nie liczyć się do obrotu lub być zabroniona przy aktywnym bonusie.'],
      ['Kasyno na żywo i gry stołowe', 'Widoczne tytuły to Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time i Sweet Bonanza Candyland. Dział stołowy zawiera Jacks or Better, Texas Holdem Bonus, blackjacka i ruletkę. Język oraz dostępność stołów zależą od rynku.'],
      ['Studia i wybór gier', 'Lista obejmuje Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming i Betsoft. Wyszukiwarka oraz filtry dostawców ułatwiają wybór. Obecność studia nie gwarantuje wszystkich jego gier w każdym kraju.'],
      ['Galeria nowych gier', `Galeria przedstawia ${games}. Przed grą sprawdź w aktualnym katalogu dostępność każdego tytułu i jego zgodność z warunkami bonusu.`],
    ],
    promos: 'Publiczna lista podaje 15% tygodniowego cashbacku kasynowego do 3 000 €, weekendowy reload do 700 € z 50 spinami, 25% cashbacku na żywo do 200 € i 10% cashbacku sportowego do 500 €. Sunday Spins, tygodniowe reloady i promocje wyścigów konnych mają własne zasady. Nie są częściami jednego pakietu powitalnego.',
    rewardCard: ['Collections, Cup i VIP', 'W Collections punkty można przeznaczyć na karty piłkarskie i nagrody za drużyny. Champions Cup nalicza też punkty za kwalifikującą się grę za prawdziwe pieniądze i wyzwania. Opublikowane zasady nagród obejmują obrót 1x, limit wypłaty 5x nagrody oraz możliwość usunięcia punktów po trzech miesiącach bez korzystania. Kwoty różnią się na publicznych stronach, dlatego sprawdź aktualne warunki konta i nie traktuj ich jak gwarantowanej gotówki. Poziom wypłat VIP uwzględnia poprzednie 90 dni aktywności.'],
    betFinding: 'Strona bonusu: 100 €; ogólna zasada 7.19: 5 €; zamiana do 10x bonusu',
    betNote: 'Strona powitalna podaje maksymalną stawkę 100 €, ale zasada 7.19 kwestionuje stawki ponad 5 € przed ukończeniem obrotu. Warunki konkretnej promocji mają pierwszeństwo; mimo to poproś o pisemne wyjaśnienie przed zastosowaniem wyższego limitu. Wygrane z bonusu są ograniczone do dziesięciokrotności początkowego bonusu.',
  },
  uk: {
    title: 'Casinado: огляд 2026, бонус 500 €, ігри та виплати',
    description: 'Огляд Casinado: 100% до 500 € + 200 фріспінів, відіграш 35×, спортивний бонус, Collections, Interac, VIP-ліміти виплат і перевірка KYC.',
    intro: 'Casinado поєднує казино, live-столи та ставки на спорт із кінними перегонами, колекціями карток і нагородами Champions Cup. Вітальна пропозиція казино — 100% до 500 € та 200 фріспінів. В огляді пояснюємо графік нарахування спінів, відіграш, окремий спортивний бонус, вибір ігор і правила виплат, зокрема ліміти та неоднозначні умови, які варто уточнити до депозиту.',
    verdict: 'Casinado дозволяє користуватися казино та спортивними ставками з одного рахунку, а колекції карток і Champions Cup доповнюють основну пропозицію. Вітальний бонус має суттєві умови: 200 фріспінів розподілені на десять днів, а відіграш 35× стосується суми депозиту й бонусу. Ліміти виплат залежать від п’яти VIP-рівнів. Сторінка бонусу й загальні правила містять різні максимальні ставки; оператора та чинну ліцензію незалежно підтвердити не вдалося.',
    together: 'Слоти, live-столи, ставки на спорт і в прямому ефірі, кінні перегони та віртуальний спорт доступні з одного рахунку.',
    rewards: ['Collections і Champions Cup', 'Колекційні картки, щотижневі завдання та бали Cup доповнюють пропозиції казино й спортивних ставок.'],
    gameCards: [
      ['Слоти, джекпоти та миттєві ігри', 'Каталог має окремі розділи слотів, новинок, ексклюзивів, купівлі бонусів, Megaways і джекпотів. У миттєвих іграх є Hot Keno, Jet Crash, Mines, Plinko та скретч-картки. Наявність гри не означає, що вона підходить для бонусу: ставки можуть не зараховуватися до відіграшу, а сама гра — бути забороненою з активним бонусом.'],
      ['Live-казино та настільні ігри', 'Серед видимих live-ігор — Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time та Sweet Bonanza Candyland. У настільному розділі є Jacks or Better, Texas Holdem Bonus, блекджек і рулетка. Мова столів та їхня доступність залежать від ринку.'],
      ['Провайдери та вибір ігор', 'У списку є Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming і Betsoft. Пошук і фільтри провайдерів допомагають звузити вибір. Наявність студії не гарантує доступу до всіх її ігор у кожній країні.'],
      ['Галерея нових ігор', `У галереї представлені ${games}. Перед грою перевірте в актуальному каталозі доступність кожного слота та його відповідність умовам бонусу.`],
    ],
    promos: 'У відкритому списку акцій зазначені щотижневий кешбек казино 15% до 3 000 €, бонус вихідного дня до 700 € з 50 фріспінами, live-кешбек 25% до 200 € та спортивний кешбек 10% до 500 €. Sunday Spins, щотижневі бонуси й акції на кінні перегони мають власні умови. Ці суми не складають єдиного вітального пакета.',
    rewardCard: ['Collections, Cup і VIP', 'У Collections бали можна використати для футбольних карток і нагород за зібрані команди. Champions Cup також враховує бали за відповідну гру на реальні кошти та завдання. Опубліковані правила нагород передбачають відіграш 1×, максимальну виплату 5× суми нагороди та можливе видалення балів після трьох місяців без використання. Суми на відкритих сторінках відрізняються, тому перевіряйте чинні умови свого рахунку й не сприймайте їх як гарантовані гроші. VIP-статус для виплат враховує активність за попередні 90 днів.'],
    betFinding: 'Сторінка бонусу: 100 €; загальне правило 7.19: 5 €; конвертація до 10× бонусу',
    betNote: 'Сторінка вітального бонусу вказує максимальну ставку 100 €, але пункт 7.19 відносить ставки понад 5 € до порушень до завершення відіграшу. Спеціальні умови акції мають пріоритет, проте перед використанням вищого ліміту варто отримати письмове уточнення. Виграші з бонусу обмежені десятикратною сумою початкового бонусу.',
  },
  pt: {
    title: 'Casinado análise 2026: bónus 500 €, jogos e levantamentos',
    description: 'Casinado: 100% até 500 € + 200 jogadas grátis, requisito 35x, bónus desportivo, Collections, Interac, limites VIP e verificação KYC.',
    intro: 'A Casinado reúne casino, mesas ao vivo e apostas desportivas, com corridas de cavalos, coleções de cartas e prémios Champions Cup. O bónus de casino é de 100% até 500 € mais 200 jogadas grátis. Explicamos a entrega das jogadas, os requisitos de aposta, a oferta desportiva separada, os jogos e as regras de levantamento, incluindo as questões a esclarecer antes de depositar.',
    verdict: 'A Casinado permite usar casino e apostas na mesma conta, com cartas colecionáveis e prémios Cup como complemento. O bónus exige atenção: as 200 jogadas são distribuídas por dez dias e o requisito de 35x incide sobre depósito mais bónus. Cinco níveis VIP determinam os limites de levantamento. A página da oferta e os termos gerais publicam limites de aposta diferentes; não foi possível confirmar independentemente o operador e a licença atual.',
    together: 'Slots, mesas ao vivo, apostas desportivas e em direto, corridas de cavalos e desportos virtuais partilham uma conta.',
    rewards: ['Collections e Champions Cup', 'Cartas colecionáveis, desafios semanais e pontos Cup complementam as ofertas de casino e desporto.'],
    gameCards: [
      ['Slots, jackpots e jogos instantâneos', 'O catálogo distingue slots, novidades, exclusivos, compra de bónus, Megaways e jackpots. Nos jogos instantâneos aparecem Hot Keno, Jet Crash, Mines, Plinko e raspadinhas. Um título disponível não é necessariamente elegível para o bónus: pode não contar para o requisito de aposta ou ser proibido com um bónus ativo.'],
      ['Casino ao vivo e jogos de mesa', 'Os títulos visíveis incluem Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time e Sweet Bonanza Candyland. Nos jogos de mesa figuram Jacks or Better, Texas Holdem Bonus, blackjack e roleta. O idioma e o acesso às mesas variam conforme o mercado.'],
      ['Estúdios e seleção de jogos', 'A lista inclui Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming e Betsoft. A pesquisa e os filtros por fornecedor facilitam a seleção. A presença de um estúdio não garante todos os seus jogos em todos os países.'],
      ['Galeria dos novos jogos', `A galeria apresenta ${games}. Antes de jogar, confirme no catálogo atual a disponibilidade de cada título e se é elegível para o bónus.`],
    ],
    promos: 'A lista pública anuncia cashback semanal de casino de 15% até 3 000 €, um bónus de fim de semana até 700 € com 50 jogadas, cashback ao vivo de 25% até 200 € e cashback desportivo de 10% até 500 €. Sunday Spins, bónus semanais e promoções de corridas têm condições próprias. Estes valores não constituem um único pacote de boas-vindas.',
    rewardCard: ['Collections, Cup e VIP', 'Em Collections, os pontos servem para cartas de futebol e prémios por equipas completas. O Champions Cup também conta pontos de atividade elegível com dinheiro real e desafios. As regras publicadas preveem apostas de 1x o prémio, limite de levantamento de 5x e possível remoção de pontos após três meses sem utilização. Os valores variam nas páginas públicas: confirme as condições atuais da conta e não os trate como dinheiro garantido. O nível VIP de levantamento considera os 90 dias anteriores.'],
    betFinding: 'Página do bónus: 100 €; regra geral 7.19: 5 €; conversão até 10x o bónus',
    betNote: 'A página de boas-vindas publica uma aposta máxima de 100 €, mas a regra 7.19 contesta apostas acima de 5 € antes de completar o requisito. As condições específicas têm prioridade; ainda assim, peça esclarecimento por escrito antes de usar o limite maior. Os ganhos do bónus estão limitados a dez vezes o bónus inicial.',
  },
  fr: {
    title: 'Casinado avis 2026 : bonus 500 €, jeux et règles de retrait',
    description: 'Avis Casinado : 100 % jusqu’à 500 € + 200 tours gratuits, mises 35x, bonus sportif, Collections, Interac, plafonds VIP et vérification KYC.',
    intro: 'Casinado associe casino, tables en direct et paris sportifs, avec courses hippiques, cartes à collectionner et récompenses Champions Cup. Le bonus casino est de 100 % jusqu’à 500 € plus 200 tours gratuits. Nous expliquons la distribution des tours, les mises requises, l’offre sportive distincte, les jeux et les retraits, y compris les points à clarifier avant tout dépôt.',
    verdict: 'Casinado réunit casino et paris sur un même compte, complétés par des cartes à collectionner et des récompenses Cup. Le bonus mérite attention : les 200 tours sont répartis sur dix jours et les mises requises de 35x portent sur le dépôt et le bonus réunis. Cinq niveaux VIP déterminent les plafonds de retrait. La page du bonus et les conditions générales indiquent des mises maximales différentes ; l’opérateur et la licence actuelle n’ont pas été confirmés indépendamment.',
    together: 'Machines à sous, tables en direct, paris sportifs et en direct, courses hippiques et sports virtuels partagent un compte.',
    rewards: ['Collections et Champions Cup', 'Cartes à collectionner, défis hebdomadaires et points Cup complètent les offres casino et sportives.'],
    gameCards: [
      ['Machines à sous, jackpots et jeux instantanés', 'Le catalogue distingue machines à sous, nouveautés, exclusivités, achats de bonus, Megaways et jackpots. Les jeux instantanés comprennent Hot Keno, Jet Crash, Mines, Plinko et jeux à gratter. Un titre disponible n’est pas forcément admissible au bonus : il peut ne pas contribuer aux mises requises ou être interdit avec un bonus actif.'],
      ['Casino en direct et jeux de table', 'Les titres visibles incluent Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time et Sweet Bonanza Candyland. Les jeux de table comprennent Jacks or Better, Texas Holdem Bonus, blackjack et roulette. La langue et l’accès aux tables varient selon le marché.'],
      ['Studios et choix de jeux', 'La liste comprend Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming et Betsoft. Recherche et filtres par fournisseur facilitent le choix. La présence d’un studio ne garantit pas tous ses jeux dans chaque pays.'],
      ['Galerie des nouveaux jeux', `La galerie présente ${games}. Avant de jouer, vérifiez dans le catalogue actuel la disponibilité de chaque titre et son admissibilité au bonus.`],
    ],
    promos: 'La liste publique annonce un cashback casino hebdomadaire de 15 % jusqu’à 3 000 €, un rechargement du week-end jusqu’à 700 € avec 50 tours, un cashback en direct de 25 % jusqu’à 200 € et un cashback sportif de 10 % jusqu’à 500 €. Sunday Spins, rechargements hebdomadaires et offres hippiques ont leurs propres conditions. Ces montants ne forment pas un unique pack de bienvenue.',
    rewardCard: ['Collections, Cup et VIP', 'Collections permet d’utiliser des points pour des cartes de football et des récompenses par équipe. Le Champions Cup compte aussi les points issus d’activités admissibles en argent réel et de défis. Les règles publiées prévoient des mises de 1x la récompense, un plafond de retrait de 5x et une possible suppression des points après trois mois sans utilisation. Les montants varient entre les pages publiques : vérifiez les conditions actuelles du compte sans les considérer comme de l’argent garanti. Le statut VIP de retrait tient compte des 90 jours précédents.'],
    betFinding: 'Page du bonus : 100 € ; règle générale 7.19 : 5 € ; conversion jusqu’à 10x le bonus',
    betNote: 'La page de bienvenue publie une mise maximale de 100 €, mais la règle 7.19 considère les mises supérieures à 5 € comme abusives avant la fin des mises requises. Les conditions spécifiques priment ; demandez néanmoins une clarification écrite avant d’utiliser le plafond supérieur. Les gains du bonus sont limités à dix fois le bonus initial.',
  },
  hi: {
    title: 'Casinado समीक्षा 2026: €500 बोनस, गेम और निकासी नियम',
    description: 'Casinado समीक्षा: €500 तक 100% + 200 मुफ़्त स्पिन, 35x दाँव की शर्त, स्पोर्ट्स बोनस, Collections, Interac, VIP निकासी सीमा और KYC।',
    intro: 'Casinado पर कैसीनो, लाइव टेबल और स्पोर्ट्स बेटिंग के साथ घुड़दौड़, कार्ड कलेक्शन और Champions Cup पुरस्कार हैं। कैसीनो वेलकम ऑफर में €500 तक 100% बोनस और 200 मुफ़्त स्पिन मिलते हैं। इस समीक्षा में स्पिन मिलने का समय, दाँव की शर्तें, अलग स्पोर्ट्स बोनस, गेम और निकासी के नियम समझाए गए हैं, ताकि जमा से पहले ज़रूरी सीमाएँ और अस्पष्ट बातें जाँची जा सकें।',
    verdict: 'Casinado में एक खाते से कैसीनो और स्पोर्ट्स बेटिंग इस्तेमाल कर सकते हैं; कार्ड कलेक्शन और Cup पुरस्कार अतिरिक्त सुविधाएँ हैं। वेलकम बोनस की शर्तें ध्यान देने योग्य हैं: 200 स्पिन दस दिनों में मिलते हैं और जमा व बोनस की कुल राशि पर 35x दाँव लगाना होता है। पाँच VIP स्तर निकासी सीमा तय करते हैं। बोनस पन्ने और सामान्य नियम में अधिकतम बेट की अलग रकम है; संचालक और मौजूदा लाइसेंस की स्वतंत्र पुष्टि नहीं हुई।',
    together: 'स्लॉट, लाइव टेबल, स्पोर्ट्स व लाइव बेटिंग, घुड़दौड़ और वर्चुअल स्पोर्ट्स एक ही खाते में हैं।',
    rewards: ['Collections और Champions Cup', 'कार्ड कलेक्शन, साप्ताहिक चुनौतियाँ और Cup पॉइंट कैसीनो व स्पोर्ट्स ऑफर के साथ उपलब्ध हैं।'],
    gameCards: [
      ['स्लॉट, जैकपॉट और इंस्टेंट गेम', 'कैटलॉग में स्लॉट, नए व एक्सक्लूसिव गेम, बोनस खरीद, Megaways और जैकपॉट के अलग सेक्शन हैं। इंस्टेंट गेम में Hot Keno, Jet Crash, Mines, Plinko और स्क्रैच कार्ड दिखे। गेम उपलब्ध होने का मतलब बोनस के लिए योग्य होना नहीं है: वह दाँव की शर्त में न गिना जाए या सक्रिय बोनस के साथ निषिद्ध हो सकता है।'],
      ['लाइव कैसीनो और टेबल गेम', 'दिखे हुए लाइव शीर्षकों में Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time और Sweet Bonanza Candyland हैं। टेबल गेम में Jacks or Better, Texas Holdem Bonus, ब्लैकजैक और रूलेट हैं। टेबल की भाषा और उपलब्धता देश के अनुसार बदलती है।'],
      ['स्टूडियो और गेम का चुनाव', 'सूची में Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming और Betsoft हैं। खोज और प्रदाता के फ़िल्टर से सूची छोटी कर सकते हैं। स्टूडियो का नाम दिखने से उसके हर गेम के हर देश में उपलब्ध होने की गारंटी नहीं मिलती।'],
      ['नए गेम की गैलरी', `गैलरी में ये छह गेम हैं: ${games}। खेलने से पहले मौजूदा कैटलॉग में हर गेम की उपलब्धता और बोनस के लिए उसकी पात्रता जाँचें।`],
    ],
    promos: 'सार्वजनिक ऑफर सूची में €3,000 तक 15% साप्ताहिक कैसीनो कैशबैक, €700 तक वीकेंड रीलोड के साथ 50 स्पिन, €200 तक 25% लाइव कैशबैक और €500 तक 10% स्पोर्ट्स कैशबैक हैं। Sunday Spins, साप्ताहिक रीलोड और घुड़दौड़ ऑफर की अपनी शर्तें हैं। ये रकम एक ही वेलकम पैकेज के हिस्से नहीं हैं।',
    rewardCard: ['Collections, Cup और VIP', 'Collections में पॉइंट से फ़ुटबॉल कार्ड और टीम पुरस्कार ले सकते हैं। Champions Cup योग्य असली-पैसे वाली गतिविधि और चुनौतियों के पॉइंट भी गिनता है। प्रकाशित पुरस्कार नियम में 1x दाँव, पुरस्कार के पाँच गुने की निकासी सीमा और तीन महीने इस्तेमाल न होने पर पॉइंट हटने की संभावना है। सार्वजनिक पन्नों पर रकम अलग है, इसलिए खाते के मौजूदा नियम देखें; इसे गारंटीकृत नकदी न मानें। VIP निकासी स्तर पिछले 90 दिनों की गतिविधि पर आधारित है।'],
    betFinding: 'बोनस पन्ना: €100; सामान्य नियम 7.19: €5; बोनस का अधिकतम 10x रूपांतरण',
    betNote: 'वेलकम पन्ने पर अधिकतम बेट €100 है, लेकिन नियम 7.19 दाँव की शर्त पूरी होने से पहले €5 से अधिक की बेट पर आपत्ति करता है। विशेष ऑफर के नियम प्राथमिक हैं, फिर भी ऊँची सीमा इस्तेमाल करने से पहले लिखित स्पष्टीकरण लें। बोनस से हुई जीत शुरुआती बोनस के दस गुने तक सीमित है।',
  },
  fi: {
    title: 'Casinado-arvostelu 2026: 500 € bonus, pelit ja nostot',
    description: 'Casinado: 100 % enintään 500 € + 200 ilmaiskierrosta, kierrätys 35x, vedonlyöntibonus, Collections, Interac, VIP-nostorajat ja KYC.',
    intro: 'Casinado yhdistää kasinon, livepöydät ja vedonlyönnin hevosurheiluun, keräilykortteihin ja Champions Cup -palkintoihin. Kasinon tervetulotarjous on 100 % enintään 500 euroon sekä 200 ilmaiskierrosta. Selvitämme kierrosten jaon, kierrätyksen, erillisen vedonlyöntibonuksen, pelit ja nostoehdot sekä asiat, jotka kannattaa tarkistaa ennen talletusta.',
    verdict: 'Casinadossa kasino ja vedonlyönti toimivat samalla tilillä; keräilykortit ja Cup-palkinnot täydentävät tarjontaa. Tervetulobonus vaatii huomiota: 200 kierrosta jaetaan kymmenelle päivälle, ja 35x kierrätys koskee talletuksen ja bonuksen yhteissummaa. Viisi VIP-tasoa määräävät nostorajat. Bonussivun ja yleisten ehtojen enimmäispanokset poikkeavat toisistaan. Operaattoria ja voimassa olevaa lisenssiä ei voitu vahvistaa riippumattomasti.',
    together: 'Kolikkopelit, livepöydät, urheilu- ja livevedonlyönti, hevosurheilu sekä virtuaaliurheilu toimivat samalla tilillä.',
    rewards: ['Collections ja Champions Cup', 'Keräilykortit, viikoittaiset haasteet ja Cup-pisteet täydentävät kasino- ja vedonlyöntitarjouksia.'],
    gameCards: [
      ['Kolikkopelit, jackpotit ja pikapelit', 'Aulassa on omat osiot kolikkopeleille, uutuuksille, yksinoikeuspeleille, bonusostoille, Megaways-peleille ja jackpoteille. Pikapeleissä näkyvät Hot Keno, Jet Crash, Mines, Plinko ja raaputusarvat. Saatavilla oleva peli ei välttämättä kelpaa bonukseen: se voi olla kierrätyksen ulkopuolella tai kielletty aktiivisen bonuksen aikana.'],
      ['Livekasino ja pöytäpelit', 'Näkyviä livepelejä ovat Mega Fire Blaze Roulette, Tao Yuan Baccarat 8, Venice VIP Blackjack 4, Mega Sic Bo, Money Time ja Sweet Bonanza Candyland. Pöytäpeleissä ovat Jacks or Better, Texas Holdem Bonus, blackjack ja ruletti. Pöytien kieli ja saatavuus vaihtelevat markkinoittain.'],
      ['Studiot ja pelien valinta', 'Listalla ovat Pragmatic Play, Pragmatic Live, Playtech, Hacksaw Gaming, Playson, Amusnet, Novomatic, ELA Games, Penguin King, Backseat Gaming ja Betsoft. Haku ja valmistajasuodattimet helpottavat valintaa. Studion näkyminen ei takaa kaikkia sen pelejä jokaisessa maassa.'],
      ['Uusien pelien galleria', `Galleriassa ovat ${games}. Tarkista ennen pelaamista ajantasaisesta peliaulasta kunkin pelin saatavuus ja kelpoisuus bonukseen.`],
    ],
    promos: 'Julkinen kampanjalista mainostaa 15 % viikoittaista kasinopalautusta enintään 3 000 euroon, viikonlopun lisätalletusbonusta enintään 700 euroon ja 50 kierrosta, 25 % livepalautusta enintään 200 euroon sekä 10 % vedonlyöntipalautusta enintään 500 euroon. Sunday Spins, viikoittaiset lisätalletusbonukset ja hevosurheilutarjoukset sisältävät omat ehdot. Summat eivät muodosta yhtä tervetulopakettia.',
    rewardCard: ['Collections, Cup ja VIP', 'Collections-pisteitä voi käyttää jalkapallokortteihin ja joukkuepalkintoihin. Champions Cup laskee myös hyväksyttävästä oikean rahan toiminnasta ja haasteista saadut pisteet. Julkaistuissa palkintoehdoissa on 1x kierrätys, palkinnon viisinkertainen nostoraja ja mahdollinen pisteiden poisto kolmen kuukauden käyttämättömyyden jälkeen. Palkintosummat vaihtelevat julkisilla sivuilla: tarkista tilin nykyiset ehdot äläkä pidä niitä taattuna käteisenä. VIP-nostotaso huomioi edeltävät 90 päivää.'],
    betFinding: 'Bonussivu: 100 €; yleinen ehto 7.19: 5 €; muunto enintään 10x bonus',
    betNote: 'Tervetulosivu ilmoittaa 100 euron enimmäispanoksen, mutta ehto 7.19 pitää yli viiden euron panoksia väärinkäyttönä ennen kierrätyksen täyttämistä. Tarjouskohtaiset ehdot ovat ensisijaisia; pyydä silti kirjallinen selvennys ennen suuremman rajan käyttöä. Bonusvoitot on rajattu alkuperäisen bonuksen kymmenkertaiseen määrään.',
  },
};

const providerPros = {
  en: 'Broad provider selection with dedicated filters for new games.',
  de: 'Große Anbieterauswahl und ein eigener Bereich für neue Spiele.',
  es: 'Muchos proveedores y una sección dedicada a nuevos juegos.',
  it: 'Numerosi fornitori e una sezione dedicata alle nuove uscite.',
  pl: 'Wielu dostawców i osobny dział nowych gier.',
  uk: 'Багато провайдерів і окремий розділ нових ігор.',
  pt: 'Muitos fornecedores e uma secção dedicada aos novos jogos.',
  fr: 'Nombreux studios et rubrique dédiée aux nouveaux jeux.',
  hi: 'कई प्रोवाइडर और नए गेम का अलग सेक्शन।',
  fi: 'Laaja pelivalmistajien valikoima ja oma osio uusille peleille.',
};

const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const section = (html, id, transform) => {
  const pattern = new RegExp(`<section class="container" id="${id}">[\\s\\S]*?<\\/section>`);
  if (!pattern.test(html)) throw new Error(`Missing section ${id}`);
  return html.replace(pattern, transform);
};
for (const locale of locales) {
  const c = copy[locale];
  let html = fs.readFileSync(`${prefix(locale)}brands/vikingluck/index.html`, 'utf8')
    .replaceAll('VikingLuck', 'Casinado').replaceAll('vikingluck', 'casinado')
    .replaceAll('/images/casinado.webp', '/images/casinado.svg')
    .replaceAll('offer_id=124853', 'offer_id=124854')
    .replaceAll('/scripts/main.js?v=20261003-reviewed-localizations-1', '/scripts/main.js?v=20261003-casinado-1')
    .replaceAll('https://res.cloudinary.com/drj61gmd2/image/upload/f_auto,q_auto,w_1600/v1791034794/spincresta/brands/casinado/main-page/casinado-page_d8p9jb', screenshot);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(c.title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*("\s*\/?>)/g, `$1${esc(c.description)}$2`)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*("\s*\/?>)/g, `$1${esc(c.title)}$2`)
    .replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${esc(c.intro)}</p>`);
  let featureIndex = 0;
  html = html.replace(/<div class="feature-card glass-card"><div class="icon-placeholder">[\s\S]*?<\/div><strong>[\s\S]*?<\/strong><span>[\s\S]*?<\/span><\/div>/g, card => {
    const i = featureIndex++;
    if (i === 0) return card.replace(/<span>[\s\S]*?<\/span>/, `<span>${esc(c.together)}</span>`);
    if (i !== 5) return card;
    return card.replace(/<strong>[\s\S]*?<\/strong>/, `<strong>${esc(c.rewards[0])}</strong>`).replace(/<span>[\s\S]*?<\/span>/, `<span>${esc(c.rewards[1])}</span>`);
  });
  if (featureIndex !== 6) throw new Error(`${locale}: six feature cards required`);
  html = section(html, 'casinado-verdict', s => s.replace(/<p class="section-intro">[\s\S]*?<\/p>/, `<p class="section-intro">${esc(c.verdict)}</p>`));
  html = section(html, 'casinado-bonus', s => {
    let i = 0;
    return s.replace(/<tr>[\s\S]*?<\/tr>/g, row => {
      if (!row.includes('<td>')) return row;
      if (i++ !== 4) return row;
      let cell = 0;
      return row.replace(/<td>[\s\S]*?<\/td>/g, value => [value, `<td>${esc(c.betFinding)}</td>`, `<td>${esc(c.betNote)}</td>`][cell++]);
    });
  });
  html = section(html, 'casinado-games', s => s.replace(/<div class="features-grid premium-grid">[\s\S]*<\/div>/, `<div class="features-grid premium-grid">${c.gameCards.map(([title, text]) => `<article class="feature-card glass-card"><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join('')}</div>`));
  html = section(html, 'casinado-sports', s => {
    let i = 0;
    return s.replace(/<article class="feature-card glass-card">[\s\S]*?<\/article>/g, card => {
      const n = i++;
      if (n === 3) return card.replace(/<p>[\s\S]*?<\/p>/, `<p>${esc(c.promos)}</p>`);
      if (n !== 4) return card;
      return `<article class="feature-card glass-card"><h3>${esc(c.rewardCard[0])}</h3><p>${esc(c.rewardCard[1])}</p></article>`;
    });
  });
  html = section(html, 'pros-cons', s => {
    let i = 0;
    return s.replace(/<span>[\s\S]*?<\/span>/g, span => i++ === 2 ? `<span>- ${esc(providerPros[locale])}</span>` : span);
  });
  if (locale === 'fi') html = html.replaceAll('Casinadoin', 'Casinadon').replaceAll('Casinadoista', 'Casinadosta');
  const faqSection = html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq = [...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([, q, a]) => [decode(q), decode(a)]);
  if (faq.length !== 8) throw new Error(`${locale}: eight FAQ answers required`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, json, close) => {
    const schema = JSON.parse(json);
    for (const node of schema['@graph']) {
      if (node['@type'] === 'WebPage') { node.name = c.title; node.description = c.description; }
      if (node['@type'] === 'Article') { node.headline = c.title; node.description = c.description; }
      if (node['@type'] === 'FAQPage') node.mainEntity = faq.map(([q, a]) => ({'@type':'Question',name:q,acceptedAnswer:{'@type':'Answer',text:a}}));
    }
    return open + JSON.stringify(schema) + close;
  });
  if (/VikingLuck|vikingluck|ViperWin|viperwin|d8p9jb|11[,. ]032|13[,. ]707|Rainbow Mantis|Outlaw Rooster|Hamsterdam|Coink Bank|Beez Turn/.test(html)) throw new Error(`${locale}: template content leaked`);
  fs.writeFileSync(`${prefix(locale)}brands/casinado/index.html`, html);
  console.log(`Built ${prefix(locale)}brands/casinado/index.html`);
}
