// Magnetic Slots public-site review. Keep the casino and sportsbook promotions separate.
export const magneticHeadlines = {
  en: 'Casino promotion: up to €2,500 + 250 free spins',
  de: 'Casino-Aktion: bis zu 2.500 € + 250 Freispiele',
  es: 'Promoción de casino: hasta 2.500 € y 250 giros gratis',
  it: 'Promozione casinò: fino a 2.500 € e 250 giri gratis',
  pl: 'Promocja kasynowa: do 2500 € i 250 darmowych spinów',
  uk: 'Акція казино: до 2 500 € і 250 фріспінів',
  pt: 'Promoção de casino: até 2 500 € e 250 jogadas grátis',
  fr: 'Offre casino : jusqu’à 2 500 € et 250 tours gratuits',
  hi: 'कैसीनो ऑफ़र: €2,500 तक और 250 फ़्री स्पिन',
  fi: 'Kasinotarjous: enintään 2 500 € ja 250 ilmaiskierrosta',
};

export const magneticTitles = {
  en: 'Magnetic Slots Review 2026 | Casino, Betting & Payouts',
  de: 'Magnetic Slots im Überblick 2026 | Casino, Sportwetten und Auszahlungen',
  es: 'Reseña de Magnetic Slots 2026 | Casino, apuestas y retiros',
  it: 'Recensione di Magnetic Slots 2026 | Casinò, scommesse e prelievi',
  pl: 'Recenzja Magnetic Slots 2026 | Kasyno, zakłady i wypłaty',
  uk: 'Огляд Magnetic Slots 2026 | Казино, ставки та виплати',
  pt: 'Análise da Magnetic Slots 2026 | Casino, apostas e levantamentos',
  fr: 'Avis sur Magnetic Slots en 2026 | Casino, paris et retraits',
  hi: 'Magnetic Slots की समीक्षा 2026 | कैसीनो, स्पोर्ट्स बेटिंग और निकासी',
  fi: 'Magnetic Slotsin arvostelu 2026 | Kasino, vedonlyönti ja kotiutukset',
};

const fields = [
  'intro', 'reviewed', 'snapshot', 'columns', 'depositStages', 'conflict', 'wager', 'spins',
  'slots', 'live', 'sport', 'sportStages', 'sportRules', 'cashier', 'payout',
  'kyc', 'licence', 'limits', 'eligibility',
];

const localizedRow = (keys, text) => {
  const values = text.trim().split('\n').map(line => line.trim());
  if (values.length !== keys.length || values.some(value => !value)) throw new Error('Incomplete Magnetic Slots review copy');
  return Object.fromEntries(keys.map((field, index) => [field, values[index]]));
};
const row = text => localizedRow(fields, text);

const detailFields = [
  'collections', 'instantTitle', 'instant', 'tableTitle', 'table', 'sportsMarkets', 'loyalty',
  'cashbackTitle', 'cashbackColumns', 'cashback', 'cashbackRules', 'inviteOnly', 'vipCap', 'fundsCheck',
  'pros', 'cons', 'faqBonus', 'faqWager', 'faqGames', 'faqLive', 'faqSports', 'faqCashback', 'faqIdentity', 'faqLimit',
];
const detail = text => localizedRow(detailFields, text);

export const magneticDetails = {
  en: detail(`
    The casino separates new releases, popular games, jackpots, book-themed slots, scratch cards, and slots with a bonus-buy feature.
    Instant and original games
    Chicken Run 2 by Spartix, Plinko by Amiry Games, and Redjet by Gamzix are in Quick Games. Magnetic Slots Originals has its own collection, including Chicken Coin and Plinko Aztec.
    Table games and bingo
    The Table Games collection combines digital games such as Amiry Games’ Blackjack and Platipus’s Wild Bingo with titles such as Evolution’s Auto-Roulette. Use the Live Casino menu for separate roulette, blackjack, and game-show collections.
    The soccer listings include the Premier League, LaLiga, and Copa Sudamericana. The sportsbook also lists darts and rugby union, in addition to major team sports and esports.
    Complete missions to move up the loyalty ranks and use points in the rewards store. Weekly cashback follows a separate tier schedule, with the rate of up to 25% reserved for invited VIPs.
    Weekly casino cashback
    Cashback rate|Weekly net deposits|Maximum cashback
    The published rates depend on net deposits and real-money slot losses from Monday through Sunday (UTC). The public table does not give a fixed cap for invitation-only VIP cashback.
    Cashback has 1× wagering, is available for 72 hours after crediting, and caps winnings at €10,000. The minimum weekly loss in euros is €20. Accounts registered in Finland do not qualify.
    VIP by invitation
    Confirm with VIP manager
    The operator may also ask for proof of where the money came from. The full time from withdrawal request to receipt is unconfirmed.
    Separate lobby collections for jackpots, scratch cards, and quick games.|Dedicated live roulette, blackjack, and game-show categories.|Live and upcoming sports markets, including Counter-Strike and Dota 2.|Weekly slot cashback has published tiers and 1× wagering.|Deposit limits and long-term self-exclusion are available under the player-protection policy.
    Advertised casino bonuses and the written rules disagree.|Cash deposits require 3× playthrough before withdrawal.|Minimum withdrawals can be as high as €120.|The 25% cashback tier is invitation-only; accounts registered in Finland cannot receive weekly cashback.|The public pages reviewed do not establish a license number or legal operator.
    Does the €2,500 casino headline match the written rules?|No. The promo cards add up to €2,500, but the general rules list a €150 cap for the first three deposit bonuses. The free-spin schedule differs, too.
    How long do I have to wager the casino welcome bonus?|The general rules allow seven days and set the default requirement at 40×. The per-bet cap is the lower of €5 or 20% of the bonus.
    Are there games other than slots?|Yes. The catalog includes blackjack without a live dealer, bingo, scratch cards, and quick games such as Plinko. There's also a separate live casino.
    What can I play in the live casino?|There are collections for roulette, blackjack, and game shows. Evolution supplies Infinite Blackjack and Crazy Time; Pragmatic Play Live supplies Sweet Bonanza CandyLand.
    Do single bets count toward the sports welcome bonus?|No. Only parlays with at least three events and decimal odds of 1.40 or higher per leg count. Voided bets and bets settled early through Cash Out do not count.
    Can every player get 25% cashback?|No. The published non-VIP tiers range from 5% to 12.5%. Up to 25% is invitation-only, and accounts registered in Finland do not qualify for weekly cashback.
    Can a withdrawal be held for verification?|Yes. The operator can pause it while checking your identity, address, or ownership of the payment method, and can ask for proof of the source of funds.
    Can I lower my deposit limit or take a break?|The policy applies lower deposit limits immediately and delays increases or removals by 24 hours. Self-exclusion can be set for three months to five years or indefinitely.
  `),
  uk: detail(`
    У казино є окремі добірки новинок, популярних ігор, джекпотів, слотів серії Book, скретч-карток та ігор із купівлею бонусу.
    Миттєві та оригінальні ігри
    У розділі швидких ігор є Chicken Run 2 від Spartix, Plinko від Amiry Games і Redjet від Gamzix. В окремій добірці Magnetic Slots Originals є Chicken Coin і Plinko Aztec.
    Настільні ігри та бінго
    У розділі настільних ігор поруч з Auto-Roulette від Evolution є цифровий Blackjack від Amiry Games і Wild Bingo від Platipus. У меню live-казино є окремі добірки рулетки, блекджеку та шоу.
    Серед футбольних турнірів є англійська Прем’єр-ліга, Ла Ліга та Південноамериканський кубок. Крім командних видів спорту й кіберспорту, є ставки на дартс і регбі.
    За виконання завдань у програмі лояльності можна підвищувати свій ранг. Накопичені бали можна витратити в магазині винагород. Тижневий кешбек нараховують за окремою шкалою; до 25% доступно лише VIP-гравцям за запрошенням.
    Тижневий кешбек казино
    Відсоток кешбеку|Чисті депозити за тиждень|Максимальний кешбек
    Відсоток залежить від чистої суми депозитів і програшів у слотах на гроші з понеділка до неділі за UTC. Для VIP-кешбеку фіксованої максимальної суми в таблиці немає.
    Кешбек доступний 72 години після нарахування. Відіграш — 1×, максимальний виграш — 10 000 €, мінімальний тижневий програш у євро — 20 €. Для акаунтів, зареєстрованих у Фінляндії, тижневий кешбек недоступний.
    VIP за запрошенням
    Уточнює VIP-менеджер
    Оператор також може попросити підтвердження походження коштів. Фактичний час від заявки до отримання виплати не підтверджено.
    Окремі добірки джекпотів, скретч-карток і миттєвих ігор.|Окремі розділи рулетки, блекджеку та шоу з живими ведучими.|Ставки до матчу й наживо, зокрема на Counter-Strike і Dota 2.|Відсотки тижневого кешбеку за слоти опубліковані, а відіграш становить 1×.|Правила передбачають ліміти депозитів і тривале самовиключення.
    Рекламні суми бонусів казино не збігаються з письмовими правилами.|Перед виплатою треба зробити ставок на суму, утричі більшу за депозит.|Мінімальна сума виплати може сягати 120 €.|Кешбек до 25% лише за запрошенням; акаунти, зареєстровані у Фінляндії, не отримують тижневого кешбеку.|За відкритими сторінками не вдалося підтвердити номер ліцензії та юридичну назву оператора.
    Чи збігається обіцянка 2 500 € із письмовими умовами?|Ні. На картках акцій загалом виходить 2 500 €, а в загальних умовах зазначено ліміт 150 € для бонусів на перші три депозити. Графік нарахування фріспінів теж різниться.
    Скільки часу є на відіграш вітального бонусу казино?|За загальними правилами — сім днів і відіграш 40×. Максимальна ставка — 5 € або 20% від бонусу, залежно від того, яка сума менша.
    Чи є ігри, крім слотів?|Так. У каталозі є блекджек без дилера, бінго, скретч-картки й миттєві ігри на кшталт Plinko. Ігри з дилерами зібрано в окремому live-казино.
    У що можна зіграти в live-казино?|Є окремі добірки рулетки, блекджеку та шоу. Infinite Blackjack і Crazy Time пропонує Evolution, а Sweet Bonanza CandyLand — Pragmatic Play Live.
    Чи зараховують одиночні ставки для спортивного бонусу?|Ні. Потрібен експрес щонайменше з трьох подій із коефіцієнтом від 1,40 на кожну. Скасовані й достроково закриті ставки не зараховуються.
    Чи всі можуть отримати 25% кешбеку?|Ні. Звичайні ставки — від 5% до 12,5%; до 25% — лише за VIP-запрошенням. Для акаунтів, зареєстрованих у Фінляндії, тижневого кешбеку немає.
    Чи можуть призупинити виплату на час перевірки?|Так. Оператор може перевірити особу, адресу й належність платіжного засобу, а також попросити підтвердження походження коштів.
    Чи можна знизити ліміт депозиту або зробити перерву?|За правилами зниження ліміту діє одразу, підвищення або скасування — через 24 години. Самовиключення можливе на строк від трьох місяців до п’яти років або безстроково.
  `),
  de: detail(`
    Das Casino hat eigene Rubriken für Neuheiten, beliebte Spiele, Jackpots, Book-Slots, Rubbellose und Slots mit Bonus-Kauf.
    Schnellspiele und hauseigene Titel
    Unter den Schnellspielen finden sich Chicken Run 2 von Spartix, Plinko von Amiry Games und Redjet von Gamzix. Die eigene Rubrik Magnetic Slots Originals enthält unter anderem Chicken Coin und Plinko Aztec.
    Tischspiele und Bingo
    Die Tischspielrubrik führt neben Evolutions Auto-Roulette auch digitale Titel wie Blackjack von Amiry Games und Wild Bingo von Platipus. Im Live-Casino gibt es eigene Rubriken für Roulette, Blackjack und Spielshows.
    Im Fußball gibt es Wetten auf die Premier League, La Liga und die Copa Sudamericana. Auch Darts, Rugby Union und E-Sport stehen im Programm.
    Wer Aufgaben im Treueprogramm erfüllt, steigt im Rang auf und kann Punkte im Prämienshop einlösen. Das wöchentliche Cashback hat eigene Stufen. Bis zu 25 % gibt es nur auf VIP-Einladung.
    Wöchentliches Casino-Cashback
    Cashback-Satz|Nettoeinzahlungen pro Woche|Höchstbetrag
    Der Satz richtet sich nach den Nettoeinzahlungen und den Echtgeldverlusten an Spielautomaten von Montag bis Sonntag (UTC). Für das VIP-Cashback auf Einladung nennt die öffentliche Tabelle keinen festen Höchstbetrag.
    Das Cashback ist nach der Gutschrift 72 Stunden verfügbar und muss 1-fach umgesetzt werden. Der Höchstgewinn beträgt 10.000 €, der wöchentliche Mindestverlust in Euro 20 €. In Finnland registrierte Konten sind ausgeschlossen.
    VIP auf Einladung
    Beim VIP-Betreuer erfragen
    Der Anbieter kann auch einen Nachweis über die Herkunft der Gelder verlangen. Die tatsächliche Dauer vom Antrag bis zum Zahlungseingang ist nicht bestätigt.
    Eigene Rubriken für Jackpots, Rubbellose und Schnellspiele.|Getrennte Kategorien für Live-Roulette, Blackjack und Spielshows.|Livewetten und kommende Begegnungen, auch in Counter-Strike und Dota 2.|Veröffentlichte Cashback-Stufen für Slots mit 1-fachem Umsatz.|Einzahllimits und langfristige Selbstsperre laut Spielerschutzregeln.
    Casino-Werbung und schriftliche Bonusbedingungen widersprechen sich.|Einzahlungen müssen vor der Auszahlung 3-fach umgesetzt werden.|Der Mindestbetrag für eine Auszahlung kann bei 120 € liegen.|Bis zu 25 % Cashback nur auf Einladung; in Finnland registrierte Konten erhalten kein wöchentliches Cashback.|Die geprüften öffentlichen Seiten bestätigen weder Lizenznummer noch Betreiberfirma.
    Entsprechen die beworbenen 2.500 € den schriftlichen Bedingungen?|Nein. In der Werbung summieren sich die Boni auf 2.500 €. Die allgemeinen Regeln nennen für die ersten drei Einzahlungsboni dagegen eine Obergrenze von 150 €. Sie verteilen auch die Freispiele anders.
    Wie lange gilt der Casino-Willkommensbonus?|Die allgemeinen Bedingungen sehen sieben Tage und 40-fachen Umsatz vor. Der Höchsteinsatz ist der niedrigere Betrag aus 5 € und 20 % des Bonus.
    Gibt es außer Spielautomaten noch andere Spiele?|Ja. Im Katalog stehen auch digitales Blackjack, Bingo, Rubbellose und Schnellspiele wie Plinko. Dazu kommt ein separates Live-Casino.
    Welche Spiele gibt es im Live-Casino?|Es gibt Rubriken für Roulette, Blackjack und Shows. Infinite Blackjack und Crazy Time stammen von Evolution, Sweet Bonanza CandyLand von Pragmatic Play Live.
    Zählen Einzelwetten für den Sport-Willkommensbonus?|Nein. Es zählen Kombiwetten mit mindestens drei Ereignissen und einer Quote ab 1,40 pro Auswahl. Stornos und Cashouts sind ausgeschlossen.
    Bekommt jeder 25 % Cashback?|Nein. Die regulären Sätze liegen zwischen 5 % und 12,5 %. Bis zu 25 % gibt es nur auf VIP-Einladung. In Finnland registrierte Konten sind vom wöchentlichen Cashback ausgeschlossen.
    Kann eine Auszahlung zur Prüfung angehalten werden?|Ja. Der Anbieter kann Identität, Adresse und die Inhaberschaft der Zahlungsmethode prüfen und einen Nachweis über die Herkunft der Gelder verlangen.
    Kann ich mein Einzahllimit senken oder eine Pause machen?|Eine Senkung gilt laut Richtlinie sofort. Eine Erhöhung oder Aufhebung dauert 24 Stunden. Eine Selbstsperre ist für drei Monate bis fünf Jahre oder unbefristet möglich.
  `),
  es: detail(`
    El casino separa las novedades, los juegos populares, los jackpots, las tragamonedas de la serie Book, las raspaditas y las tragamonedas que permiten comprar una ronda de bono.
    Juegos instantáneos y originales
    La sección de juegos rápidos incluye Chicken Run 2 de Spartix, Plinko de Amiry Games y Redjet de Gamzix. Magnetic Slots Originals reúne títulos como Chicken Coin y Plinko Aztec.
    Juegos de mesa y bingo
    En los juegos de mesa figuran Auto-Roulette de Evolution, Blackjack de Amiry Games y Wild Bingo de Platipus. El casino en vivo tiene secciones de ruleta, blackjack y concursos con presentador.
    La oferta de fútbol incluye la Premier League, La Liga y la Copa Sudamericana. También hay apuestas de dardos, rugby a quince y deportes electrónicos.
    El programa de fidelidad tiene misiones, rangos y una tienda para canjear puntos. El reembolso semanal tiene sus propios niveles: solo los VIP invitados pueden llegar al 25 %.
    Reembolso semanal del casino
    Porcentaje de reembolso|Depósitos netos semanales|Reembolso máximo
    El porcentaje depende de los depósitos netos y las pérdidas con dinero real en tragamonedas, de lunes a domingo (UTC). La tabla pública no fija un tope para los VIP invitados.
    El reembolso está disponible por 72 horas desde que se acredita y exige apostarlo 1 vez. La ganancia máxima es de 10.000 € y la pérdida semanal mínima en euros es de 20 €. No se ofrece a cuentas registradas en Finlandia.
    VIP por invitación
    Consultar al responsable VIP
    El operador también puede pedir un comprobante del origen de los fondos. No se ha confirmado el tiempo total desde la solicitud hasta que llega el dinero.
    Secciones propias para jackpots, raspaditas y juegos rápidos.|Categorías separadas de ruleta, blackjack y concursos en vivo.|Apuestas antes del evento y en vivo, también en Counter-Strike y Dota 2.|El porcentaje del reembolso de tragamonedas se puede consultar y solo hay que apostarlo una vez.|El reglamento prevé límites de depósito y autoexclusión prolongada.
    Los anuncios del bono de casino no coinciden con las condiciones escritas.|Hay que apostar 3 veces el depósito antes de retirar.|El mínimo de retiro puede llegar a 120 €.|El 25 % de reembolso requiere invitación; el reembolso semanal no se ofrece a cuentas de Finlandia.|Las páginas públicas revisadas no permiten confirmar el número de licencia ni la empresa operadora.
    ¿Los 2.500 € anunciados coinciden con las condiciones escritas?|No. Las promociones suman 2.500 €, pero las reglas generales indican un tope de 150 € para los bonos de los tres primeros depósitos. El reparto de los giros gratis tampoco coincide.
    ¿Cuánto tiempo tengo para apostar el bono de bienvenida del casino?|Las reglas generales dan siete días y exigen apostar el bono 40 veces. La apuesta máxima es el menor importe entre 5 € y el 20 % del bono.
    ¿Hay algo más que tragamonedas?|Sí. El catálogo incluye blackjack digital, bingo, raspaditas y juegos rápidos como Plinko, además de un casino en vivo aparte.
    ¿Qué juegos hay en el casino en vivo?|Hay secciones de ruleta, blackjack y programas en vivo. Infinite Blackjack y Crazy Time son de Evolution; Sweet Bonanza CandyLand, de Pragmatic Play Live.
    ¿Las apuestas simples cuentan para el bono deportivo de bienvenida?|No. Hace falta una combinada de al menos tres eventos y una cuota mínima de 1,40 por selección. No cuentan las apuestas anuladas ni las cerradas antes de tiempo.
    ¿Todos pueden obtener un 25 % de reembolso?|No. Los porcentajes habituales van del 5 % al 12,5 %. El 25 % es un máximo reservado a VIP invitados. Las cuentas registradas en Finlandia no reciben el reembolso semanal.
    ¿Pueden retener mi retiro mientras verifican la cuenta?|Sí. El operador puede comprobar la identidad, el domicilio y la titularidad del medio de pago, y pedir un comprobante del origen de los fondos.
    ¿Puedo bajar mi límite de depósito o hacer una pausa?|Según la política, la reducción es inmediata; subir o eliminar el límite tarda 24 horas. La autoexclusión puede durar de tres meses a cinco años o ser indefinida.
  `),
  it: detail(`
    Il casinò ha sezioni per novità, giochi popolari, jackpot, slot della serie Book, gratta e vinci e slot con acquisto del bonus.
    Giochi istantanei e originali
    Tra i giochi rapidi ci sono Chicken Run 2 di Spartix, Plinko di Amiry Games e Redjet di Gamzix. La sezione Magnetic Slots Originals include Chicken Coin e Plinko Aztec.
    Giochi da tavolo e bingo
    La sezione dei giochi da tavolo abbina titoli digitali come Blackjack di Amiry Games e Wild Bingo di Platipus ad Auto-Roulette di Evolution. Il menu del casinò live separa roulette, blackjack e game show.
    Nel calcio figurano Premier League, LaLiga e Copa Sudamericana. Il palinsesto include anche freccette e rugby a 15, oltre agli sport di squadra e agli eSport.
    Completando le missioni del programma fedeltà si sale di livello e si possono spendere i punti nel negozio premi. Il cashback settimanale segue una scala a parte: fino al 25% solo su invito VIP.
    Cashback settimanale del casinò
    Percentuale di cashback|Depositi netti settimanali|Cashback massimo
    La percentuale dipende dai depositi netti e dalle perdite in denaro reale alle slot da lunedì a domenica (UTC). La tabella pubblica non indica un tetto fisso per i VIP invitati.
    Il cashback è disponibile per 72 ore dall’accredito e va rigiocato una volta. La vincita massima è di 10.000 € e la perdita settimanale minima in euro è di 20 €. Sono esclusi gli account registrati in Finlandia.
    VIP su invito
    Da concordare con il referente VIP
    L’operatore può chiedere anche una prova dell’origine dei fondi. Non è confermato il tempo effettivo dalla richiesta all’accredito.
    Sezioni dedicate a jackpot, gratta e vinci e giochi rapidi.|Categorie separate per roulette live, blackjack e game show.|Eventi dal vivo e in programma, anche di Counter-Strike e Dota 2.|Fasce pubbliche di cashback sulle slot, da rigiocare una volta.|Il regolamento prevede limiti di deposito e autoesclusione prolungata.
    Gli importi pubblicizzati non coincidono con quelli del regolamento.|Prima del prelievo bisogna puntare tre volte l’importo depositato.|La soglia minima per prelevare può arrivare a 120 €.|Il 25% di cashback richiede un invito; i conti registrati in Finlandia non ricevono il cashback settimanale.|Le pagine pubbliche non permettono di verificare né il numero di licenza né la ragione sociale del gestore.
    I 2.500 € pubblicizzati corrispondono al regolamento?|No. Le schede promozionali sommano 2.500 €, ma le condizioni generali indicano un limite di 150 € per i bonus dei primi tre depositi. Anche la distribuzione dei giri gratis è diversa.
    Quanto tempo ho per rigiocare il bonus di benvenuto del casinò?|In generale il termine è di sette giorni e il bonus va rigiocato 40 volte. La puntata non può superare il minore tra 5 € e il 20% del bonus.
    Ci sono giochi oltre alle slot?|Sì. Il catalogo include blackjack digitale, bingo, gratta e vinci e giochi rapidi come Plinko, oltre a un casinò live a parte.
    Cosa si trova nel casinò live?|Ci sono sezioni per roulette, blackjack e game show. Infinite Blackjack e Crazy Time sono di Evolution; Sweet Bonanza CandyLand è di Pragmatic Play Live.
    Le scommesse singole valgono per il bonus sportivo?|No. Serve una multipla con almeno tre eventi e una quota minima di 1,40 per selezione. Non contano le scommesse annullate né quelle liquidate in anticipo.
    Tutti possono ottenere il 25% di cashback?|No. Le percentuali ordinarie vanno dal 5% al 12,5%. Fino al 25% è riservato ai VIP invitati; gli account registrati in Finlandia non ricevono cashback settimanale.
    Un prelievo può essere sospeso durante la verifica?|Sì. L’operatore può verificare identità, indirizzo e titolarità del metodo di pagamento e chiedere una prova dell’origine dei fondi.
    Posso abbassare il limite di deposito o prendermi una pausa?|Secondo la politica, la riduzione è immediata, mentre aumento e rimozione richiedono 24 ore. L’autoesclusione può durare da tre mesi a cinque anni o essere a tempo indeterminato.
  `),
  pl: detail(`
    Kasyno ma osobne kolekcje nowości, popularnych gier, jackpotów, slotów typu Book, zdrapek i gier z opcją kupna bonusu.
    Gry błyskawiczne i autorskie
    Wśród szybkich gier są Chicken Run 2 od Spartix, Plinko od Amiry Games i Redjet od Gamzix. Osobna kolekcja Magnetic Slots Originals zawiera Chicken Coin i Plinko Aztec.
    Gry stołowe i bingo
    W kategorii gier stołowych obok Auto-Roulette od Evolution znajdziesz cyfrowego Blackjacka od Amiry Games i Wild Bingo od Platipus. Kasyno na żywo ma własne kategorie ruletki, blackjacka i teleturniejów.
    Ofertę piłkarską tworzą m.in. Premier League, La Liga i Copa Sudamericana. Oprócz e-sportu dostępne są też zakłady na darta i rugby union.
    W programie lojalnościowym wykonujesz zadania, awansujesz i wymieniasz punkty w sklepie z nagrodami. Tygodniowy zwrot ma osobne progi: do 25% mogą uzyskać tylko zaproszeni gracze VIP.
    Tygodniowy zwrot w kasynie
    Stawka zwrotu|Tygodniowe wpłaty netto|Maksymalny zwrot
    Stawka zależy od wpłat netto i strat na automatach za prawdziwe pieniądze od poniedziałku do niedzieli (UTC). Publiczna tabela nie podaje stałego limitu dla zaproszonych graczy VIP.
    Zwrot jest dostępny przez 72 godziny od przyznania i wymaga obrotu 1×. Maksymalna wygrana to 10 000 €, a minimalna strata tygodniowa w euro wynosi 20 €. Konta zarejestrowane w Finlandii nie kwalifikują się do zwrotu.
    VIP na zaproszenie
    Do ustalenia z opiekunem VIP
    Operator może też zażądać potwierdzenia źródła środków. Rzeczywisty czas od złożenia dyspozycji do otrzymania wypłaty nie jest potwierdzony.
    Osobne kolekcje jackpotów, zdrapek i szybkich gier.|Oddzielne kategorie ruletki na żywo, blackjacka i teleturniejów.|Zakłady przed meczem i na żywo, także na Counter-Strike i Dota 2.|Publiczne stawki zwrotu za grę na automatach i obrót 1×.|Regulamin przewiduje limity wpłat i długoterminowe samowykluczenie.
    Reklamy kasyna i pisemne warunki bonusów nie są zgodne.|Przed wypłatą trzeba obrócić wpłatę 3 razy.|Minimalna wypłata może sięgać 120 €.|Zwrot do 25% tylko na zaproszenie; brak tygodniowego zwrotu dla kont z Finlandii.|Sprawdzone strony publiczne nie potwierdzają numeru licencji ani nazwy operatora.
    Czy reklamowane 2500 € zgadza się z regulaminem?|Nie. Karty promocji dają łącznie 2500 €, lecz ogólne zasady podają limit 150 € dla bonusów od pierwszych trzech wpłat. Różni się też rozkład darmowych spinów.
    Ile czasu mam na obrót bonusem powitalnym kasyna?|Ogólne zasady przewidują siedem dni i obrót 40×. Maksymalna stawka to 5 € lub 20% bonusu, zależnie od tego, która kwota jest niższa.
    Czy oprócz automatów są inne gry?|Tak. Są cyfrowy blackjack, bingo, zdrapki i szybkie gry takie jak Plinko, a także osobne kasyno na żywo.
    W co można zagrać w kasynie na żywo?|Są osobne sekcje ruletki, blackjacka i teleturniejów. Infinite Blackjack i Crazy Time to gry Evolution, a Sweet Bonanza CandyLand — Pragmatic Play Live.
    Czy zakłady pojedyncze liczą się do obrotu bonusem sportowym?|Nie. Liczą się tylko kupony AKO z co najmniej trzema zdarzeniami, każde z kursem co najmniej 1,40. Zakłady anulowane oraz te rozliczone wcześniej przez cash out nie liczą się do obrotu.
    Czy każdy może otrzymać 25% zwrotu?|Nie. Standardowe stawki wynoszą od 5% do 12,5%, a maksymalnie 25% jest dostępne na zaproszenie VIP. Zwrotu tygodniowego nie ma dla kont zarejestrowanych w Finlandii.
    Czy wypłata może zostać wstrzymana do zakończenia weryfikacji?|Tak. Operator może sprawdzić tożsamość, adres i własność metody płatności oraz poprosić o potwierdzenie pochodzenia środków.
    Czy można obniżyć limit wpłat lub zrobić przerwę?|Zgodnie z zasadami obniżenie działa od razu, a podwyższenie lub zniesienie limitu po 24 godzinach. Samowykluczenie może trwać od trzech miesięcy do pięciu lat lub bezterminowo.
  `),
  pt: detail(`
    O casino tem secções para novidades, jogos populares, jackpots, slots da série Book, raspadinhas e slots com compra de bónus.
    Jogos instantâneos e originais
    Nos jogos rápidos encontram-se Chicken Run 2 da Spartix, Plinko da Amiry Games e Redjet da Gamzix. A coleção Magnetic Slots Originals inclui Chicken Coin e Plinko Aztec.
    Jogos de mesa e bingo
    Nesta secção, Auto-Roulette da Evolution aparece ao lado de jogos digitais como Blackjack da Amiry Games e Wild Bingo da Platipus. O casino ao vivo tem secções próprias para roleta, blackjack e game shows.
    No futebol há Premier League, LaLiga e Copa Sudamericana. Além dos desportos coletivos e eletrónicos, há também apostas em dardos e râguebi de quinze.
    As missões do programa de fidelização permitem subir de nível. Os jogadores podem trocar os pontos por recompensas na loja. O cashback semanal tem escalões próprios e só os VIP convidados podem receber até 25%.
    Cashback semanal do casino
    Taxa de cashback|Depósitos líquidos semanais|Cashback máximo
    A taxa depende dos depósitos líquidos e das perdas a dinheiro real nas slots de segunda a domingo (UTC). A tabela pública não indica um limite fixo para o cashback VIP por convite.
    O cashback fica disponível durante 72 horas após o crédito e tem de ser apostado uma vez. O ganho máximo é de 10 000 € e a perda semanal mínima em euros é de 20 €. As contas registadas na Finlândia não são elegíveis.
    VIP por convite
    Confirmar com o gestor VIP
    O operador também pode pedir comprovativo da origem dos fundos. O tempo total entre o pedido e a receção do dinheiro não está confirmado.
    Secções distintas de jackpots, raspadinhas e jogos rápidos.|Categorias próprias de roleta ao vivo, blackjack e game shows.|Apostas pré-jogo e ao vivo, incluindo Counter-Strike e Dota 2.|O casino publica as taxas de cashback nas slots e só exige que o valor seja apostado uma vez.|A política prevê limites de depósito e autoexclusão prolongada.
    As promoções do casino não coincidem com as condições escritas.|É preciso apostar 3 vezes o valor depositado antes de levantar.|O levantamento mínimo pode chegar aos 120 €.|Os 25% de cashback exigem convite; contas da Finlândia não recebem cashback semanal.|As páginas públicas consultadas não confirmam o número de licença nem a empresa operadora.
    Os 2 500 € anunciados coincidem com as condições escritas?|Não. As promoções somam 2 500 €, mas as regras gerais indicam um limite de 150 € para os bónus dos primeiros três depósitos. O calendário das jogadas grátis também é diferente.
    Quanto tempo tenho para cumprir o requisito do bónus de boas-vindas?|As regras gerais dão sete dias e exigem apostar o bónus 40 vezes. A aposta máxima é o menor valor entre 5 € e 20% do bónus.
    Há outros jogos além das slots?|Sim. Há blackjack digital, bingo, raspadinhas e jogos rápidos como Plinko, além de um casino ao vivo separado.
    O que se pode jogar no casino ao vivo?|Há secções de roleta, blackjack e game shows. Infinite Blackjack e Crazy Time são da Evolution; Sweet Bonanza CandyLand é da Pragmatic Play Live.
    As apostas simples contam para o bónus desportivo?|Não. Só contam múltiplas com pelo menos três eventos e uma odd mínima de 1,40 em cada seleção. Apostas anuladas ou resolvidas por cash out não contam.
    Todos os jogadores podem obter 25% de cashback?|Não. As taxas normais vão de 5% a 12,5%. Até 25% é exclusivo para VIP convidados; contas registadas na Finlândia não recebem cashback semanal.
    Um levantamento pode ficar suspenso durante a verificação?|Sim. O operador pode confirmar identidade, morada e titularidade do meio de pagamento e pedir comprovativo da origem dos fundos.
    Posso baixar o limite de depósito ou fazer uma pausa?|A redução é imediata segundo a política. O aumento ou a remoção demora 24 horas. A autoexclusão pode durar de três meses a cinco anos ou ser por tempo indeterminado.
  `),
  fr: detail(`
    Le casino sépare les nouveautés, les jeux populaires, les jackpots, les machines de la série Book, les cartes à gratter et les machines avec achat de bonus.
    Jeux instantanés et originaux
    Les jeux rapides comprennent Chicken Run 2 de Spartix, Plinko d’Amiry Games et Redjet de Gamzix. La collection Magnetic Slots Originals réunit notamment Chicken Coin et Plinko Aztec.
    Jeux de table et bingo
    Dans les jeux de table, Auto-Roulette d’Evolution côtoie le Blackjack d’Amiry Games et Wild Bingo de Platipus. Le casino en direct propose des rubriques distinctes pour la roulette, le blackjack et les jeux à présentateur.
    La rubrique football propose la Premier League, la Liga et la Copa Sudamericana. On trouve aussi les fléchettes et le rugby à XV, en plus des sports collectifs et de l’esport.
    Les missions du programme de fidélité permettent de monter en grade et d’échanger des points dans la boutique. Le cashback hebdomadaire suit un barème distinct : jusqu’à 25 % sur invitation VIP seulement.
    Cashback hebdomadaire du casino
    Taux de cashback|Dépôts nets de la semaine|Cashback maximal
    Le taux dépend des dépôts nets et des pertes en argent réel aux machines à sous du lundi au dimanche (UTC). Le tableau public n’indique pas de plafond fixe pour les VIP invités.
    Le cashback reste disponible 72 heures après son crédit et doit être misé une fois. Le gain est plafonné à 10 000 € et la perte hebdomadaire minimale en euros est de 20 €. Les comptes inscrits en Finlande sont exclus.
    VIP sur invitation
    À confirmer auprès du responsable VIP
    L’opérateur peut également demander un justificatif d’origine des fonds. Le délai réel entre la demande et la réception du retrait n’est pas confirmé.
    Rubriques dédiées aux jackpots, aux cartes à gratter et aux jeux rapides.|Catégories distinctes pour la roulette en direct, le blackjack et les jeux télévisés.|Paris en direct et avant match, notamment sur Counter-Strike et Dota 2.|Barème public pour le cashback sur les machines à sous, à miser une fois.|La politique prévoit des plafonds de dépôt et l’auto-exclusion de longue durée.
    Les offres de casino affichées et les conditions écrites ne concordent pas.|Les dépôts en argent doivent être misés trois fois avant un retrait.|Le minimum de retrait peut atteindre 120 €.|Le cashback à 25 % est sur invitation ; le cashback hebdomadaire exclut les comptes finlandais.|Les pages publiques consultées ne confirment ni numéro de licence ni société exploitante.
    Les 2 500 € annoncés correspondent-ils aux conditions écrites ?|Non. Les promotions totalisent 2 500 €, mais les conditions générales indiquent un plafond de 150 € pour les bonus des trois premiers dépôts. Les tours gratuits sont aussi répartis différemment.
    Quel est le délai pour remplir les conditions du bonus de bienvenue du casino ?|Selon les conditions générales, il faut miser 40 fois le montant du bonus en sept jours. Chaque mise est limitée à 5 € ou à 20 % du bonus si ce montant est inférieur.
    Y a-t-il d’autres jeux que les machines à sous ?|Oui. Le catalogue propose du blackjack numérique, du bingo, des cartes à gratter, des jeux rapides comme Plinko et un casino en direct à part.
    À quoi peut-on jouer dans le casino en direct ?|Il y a des rubriques roulette, blackjack et jeux télévisés. Infinite Blackjack et Crazy Time viennent d’Evolution ; Sweet Bonanza CandyLand est signé Pragmatic Play Live.
    Les paris simples comptent-ils pour le bonus sportif ?|Non. Il faut un combiné d’au moins trois événements avec une cote minimale de 1,40 par sélection. Les paris annulés ou clôturés par cash out ne comptent pas.
    Tout le monde peut-il recevoir 25 % de cashback ?|Non. Les taux ordinaires vont de 5 % à 12,5 %. Jusqu’à 25 % est réservé aux VIP invités. Les comptes inscrits en Finlande n’ont pas droit au cashback hebdomadaire.
    Un retrait peut-il être bloqué le temps de la vérification ?|Oui. L’opérateur peut vérifier l’identité, l’adresse et la titularité du moyen de paiement, et demander un justificatif d’origine des fonds.
    Puis-je baisser mon plafond de dépôt ou faire une pause ?|La baisse est immédiate, selon la politique. La hausse ou la suppression prend 24 heures. L’auto-exclusion peut durer de trois mois à cinq ans ou être indéfinie.
  `),
  hi: detail(`
    कैसीनो में नए गेम, लोकप्रिय गेम, जैकपॉट, बुक सीरीज़ के स्लॉट, स्क्रैच कार्ड और बोनस खरीदने की सुविधा वाले स्लॉट की अलग सूचियाँ हैं।
    इंस्टेंट और ओरिजिनल गेम
    क्विक गेम में Spartix का Chicken Run 2, Amiry Games का Plinko और Gamzix का Redjet शामिल हैं। Magnetic Slots Originals की अलग सूची में Chicken Coin और Plinko Aztec हैं।
    टेबल गेम और बिंगो
    टेबल गेम में Evolution के Auto-Roulette के साथ Amiry Games का डिजिटल Blackjack और Platipus का Wild Bingo है। लाइव कैसीनो में रूलेट, ब्लैकजैक और गेम शो की अलग सूचियाँ हैं।
    फ़ुटबॉल में Premier League, LaLiga और Copa Sudamericana के मैचों पर दाँव लगाए जा सकते हैं। डार्ट्स, रग्बी यूनियन और ईस्पोर्ट्स के मुकाबले भी हैं।
    लॉयल्टी प्रोग्राम में चुनौतियाँ पूरी करने पर रैंक बढ़ती है। खिलाड़ी रिवॉर्ड स्टोर में अपने पॉइंट इस्तेमाल कर सकते हैं। साप्ताहिक कैशबैक की दरें अलग से तय होती हैं; 25% तक का कैशबैक सिर्फ़ आमंत्रित VIP खिलाड़ियों को मिलता है।
    साप्ताहिक कैसीनो कैशबैक
    कैशबैक दर|हफ़्ते की नेट जमा|अधिकतम कैशबैक
    दर सोमवार से रविवार (UTC) तक की नेट जमा और असली पैसे से स्लॉट खेलने पर हुए नुकसान पर निर्भर है। सार्वजनिक सूची में आमंत्रित VIP के लिए तय अधिकतम राशि नहीं दी गई है।
    कैशबैक खाते में आने के बाद 72 घंटे तक उपलब्ध रहता है। मिली रकम के बराबर एक बार दाँव लगाना होता है। अधिकतम जीत €10,000 है और यूरो वाले खाते में हफ़्ते का नुकसान कम से कम €20 होना चाहिए। फ़िनलैंड में पंजीकृत खातों को यह कैशबैक नहीं मिलता।
    सिर्फ़ आमंत्रित VIP
    VIP मैनेजर से पूछें
    ऑपरेटर रकम के स्रोत का प्रमाण भी माँग सकता है। निकासी का अनुरोध देने से पैसे मिलने तक का वास्तविक समय पक्का नहीं है।
    जैकपॉट, स्क्रैच कार्ड और क्विक गेम की अलग सूचियाँ।|लाइव रूलेट, ब्लैकजैक और गेम शो की अपनी श्रेणियाँ।|लाइव और आगामी इवेंट पर सट्टे, जिनमें Counter-Strike और Dota 2 भी हैं।|स्लॉट के साप्ताहिक कैशबैक की दरें प्रकाशित हैं और वेजरिंग 1× है।|नीति में जमा सीमा और लंबे समय के लिए खुद को खेल से बाहर रखने का विकल्प है।
    कैसीनो के विज्ञापन और लिखित बोनस शर्तें मेल नहीं खातीं।|निकासी से पहले जमा राशि को 3× दाँव पर लगाना पड़ता है।|न्यूनतम निकासी €120 तक हो सकती है।|25% कैशबैक आमंत्रण पर है; फ़िनलैंड में रजिस्टर खातों को साप्ताहिक कैशबैक नहीं मिलता।|जाँचे गए सार्वजनिक पेज लाइसेंस नंबर या ऑपरेटर कंपनी की पुष्टि नहीं करते।
    क्या विज्ञापन में दिए €2,500 लिखित नियमों से मेल खाते हैं?|नहीं। ऑफ़र कार्ड का कुल €2,500 है, लेकिन सामान्य नियम पहली तीन जमा के बोनस की सीमा €150 बताते हैं। फ़्री स्पिन बाँटने का तरीका भी अलग है।
    कैसीनो के वेलकम बोनस की शर्तें पूरी करने के लिए कितना समय मिलता है?|सामान्य नियमों के मुताबिक सात दिनों के भीतर बोनस की रकम के 40 गुना के बराबर दाँव लगाने होते हैं। हर दाँव की सीमा €5 या बोनस का 20% है, जो भी कम हो।
    क्या स्लॉट के अलावा भी गेम हैं?|हाँ। डिजिटल ब्लैकजैक, बिंगो, स्क्रैच कार्ड और Plinko जैसे क्विक गेम के साथ एक अलग लाइव कैसीनो भी है।
    लाइव कैसीनो में कौन-से गेम हैं?|रूलेट, ब्लैकजैक और गेम शो की अलग श्रेणियाँ हैं। Infinite Blackjack और Crazy Time, Evolution के हैं; Sweet Bonanza CandyLand, Pragmatic Play Live का है।
    क्या सिंगल बेट खेल के वेलकम बोनस में गिनी जाती है?|नहीं। कम से कम तीन इवेंट की कॉम्बो बेट चाहिए और हर चयन के ऑड्स कम से कम 1.40 होने चाहिए। रद्द या कैश आउट की गई बेट नहीं गिनी जातीं।
    क्या सभी खिलाड़ियों को 25% कैशबैक मिल सकता है?|नहीं। सामान्य दर 5% से 12.5% तक है। 25% तक सिर्फ़ आमंत्रित VIP को मिलता है। फ़िनलैंड में रजिस्टर खातों को साप्ताहिक कैशबैक नहीं मिलता।
    क्या वेरिफ़िकेशन के दौरान निकासी रोकी जा सकती है?|हाँ। ऑपरेटर पहचान, पता और भुगतान के तरीके का मालिकाना हक जाँच सकता है। वह रकम के स्रोत का प्रमाण भी माँग सकता है।
    क्या जमा सीमा घटा सकते हैं या खेल से ब्रेक ले सकते हैं?|नीति के मुताबिक सीमा घटाने का असर तुरंत होता है; बढ़ाने या हटाने में 24 घंटे लगते हैं। खुद को खेल से बाहर रखने की अवधि तीन महीने से पाँच साल या अनिश्चित काल तक हो सकती है।
  `),
  fi: detail(`
    Kasinolla on omat osiot uutuuksille, suosituille peleille, jättipoteille, Book-sarjan kolikkopeleille, raaputusarvoille ja bonuksen oston tarjoaville peleille.
    Pikapelit ja omat pelit
    Pikapelejä ovat Spartixin Chicken Run 2, Amiry Gamesin Plinko ja Gamzixin Redjet. Erillisessä Magnetic Slots Originals -kokoelmassa ovat muun muassa Chicken Coin ja Plinko Aztec.
    Pöytäpelit ja bingo
    Pöytäpeleissä on Evolutionin Auto-Rouletten lisäksi digitaalisia pelejä, kuten Amiry Gamesin Blackjack ja Platipusin Wild Bingo. Livekasinolla ruletti, blackjack ja pelishow’t ovat omissa osioissaan.
    Jalkapallokohteisiin kuuluvat Valioliiga, La Liga ja Copa Sudamericana. Joukkue- ja e-urheilun lisäksi tarjolla on dartsia ja rugby unionia.
    Kanta-asiakasohjelmassa tehtävät auttavat nousemaan tasolta toiselle, ja pisteitä voi käyttää palkintokaupassa. Viikoittaisen tappionpalautuksen prosentti määräytyy erikseen. Enintään 25 %:n palautus on tarjolla vain kutsutuille VIP-pelaajille.
    Kasinon viikoittainen tappionpalautus
    Palautusprosentti|Viikon nettotalletukset|Palautus enintään
    Prosentti määräytyy viikon nettotalletusten ja oikealla rahalla pelattujen kolikkopelien tappioiden perusteella. Viikko lasketaan maanantaista sunnuntaihin (UTC). Taulukossa ei ole kiinteää euromääräistä ylärajaa kutsutuille VIP-pelaajille.
    Palautus on käytettävissä 72 tuntia hyvityksestä, ja se on kierrätettävä kerran. Enimmäisvoitto on 10 000 € ja viikoittaisen tappion alaraja euroissa 20 €. Suomessa rekisteröidyt tilit eivät saa viikoittaista palautusta.
    VIP vain kutsusta
    Varmista VIP-yhteyshenkilöltä
    Operaattori voi pyytää myös selvitystä varojen alkuperästä. Aikaa kotiutuspyynnöstä rahan saapumiseen ei ole vahvistettu.
    Omat osiot jättipoteille, raaputusarvoille ja pikapeleille.|Erilliset osiot live-ruletille, blackjackille ja pelishow’lle.|Ennakko- ja livevedot myös Counter-Strikesta ja Dota 2:sta.|Kolikkopelien tappionpalautuksen julkinen taulukko ja yhden kerran kierrätys.|Peliehtojen mukaiset talletusrajat ja pitkäaikainen pelikielto.
    Kasinon bonustarjoukset ja kirjalliset ehdot eivät vastaa toisiaan.|Talletus on kierrätettävä 3 kertaa ennen kotiutusta.|Pienin kotiutus voi olla jopa 120 €.|Palautus enintään 25 % vain kutsusta; Suomessa rekisteröidyt tilit eivät saa viikoittaista palautusta.|Tarkistetut julkiset sivut eivät vahvista lisenssinumeroa tai operaattoriyhtiötä.
    Vastaako mainostettu 2 500 € kirjallisia ehtoja?|Ei. Tarjouskorttien summa on 2 500 €, mutta yleisissä ehdoissa kolmen ensimmäisen talletusbonuksen yläraja on 150 €. Ilmaiskierrokset jaetaan ehdoissa eri tavalla.
    Kuinka kauan kasinon tervetuliaisbonusta voi kierrättää?|Yleiset ehdot antavat seitsemän päivää ja edellyttävät 40-kertaista kierrätystä. Panos on enintään 5 € tai 20 % bonuksesta sen mukaan, kumpi on pienempi.
    Onko kolikkopelien lisäksi muita pelejä?|On. Valikoimassa on digitaalista blackjackia, bingoa, raaputusarpoja ja Plinkon kaltaisia pikapelejä sekä erillinen livekasino.
    Mitä livekasinolla voi pelata?|Ruletille, blackjackille ja pelishow’lle on omat osiot. Infinite Blackjack ja Crazy Time ovat Evolutionilta, Sweet Bonanza CandyLand Pragmatic Play Liveltä.
    Lasketaanko yksittäiset vedot urheilubonuksen kierrätykseen?|Ei. Ehto vaatii yhdistelmävedon, jossa on vähintään kolme kohdetta ja jokaisen kerroin on vähintään 1,40. Perutut ja cash outilla päätetyt vedot eivät kerrytä kierrätystä.
    Voiko jokainen pelaaja saada 25 % palautuksen?|Ei. Tavalliset palautusprosentit ovat 5–12,5 %. Enintään 25 % saa vain VIP-kutsulla. Suomessa rekisteröidyt tilit eivät saa viikoittaista palautusta.
    Voidaanko kotiutus keskeyttää tarkistusten ajaksi?|Kyllä. Operaattori voi tarkistaa henkilöllisyyden, osoitteen ja maksutavan omistajan sekä pyytää selvitystä varojen alkuperästä.
    Voinko alentaa talletusrajaa tai pitää tauon?|Talletusrajan alennus tulee voimaan heti. Korotus tai poisto tulee voimaan 24 tunnin kuluttua. Pelieston voi asettaa 3 kuukaudeksi–5 vuodeksi tai toistaiseksi.
  `),
};

export const magneticCopy = {
  en: row(`
    Magnetic Slots has slots, live-dealer games, and a separate sportsbook. The casino promotion and its published rules disagree on deposit bonus caps and the free-spin schedule.
    Editorially reviewed
    Casino games, live tables, and sports listed in the public lobby. The selection varies by market.
    Topic|Details|Conditions
    First deposit|Up to €1,500 + 150 free spins|The card does not give a match rate.|Second deposit|55% up to €500 + 100 free spins|Third deposit|100% up to €500|No free spins are listed.
    These are the advertised stages. The general bonus rules list a €150 cap for the first three deposit bonuses and a €15 minimum deposit. The amount actually available in the account could not be confirmed.
    The default wagering requirement is 40× unless the offer says otherwise. The general rules give seven days for the welcome bonuses. The maximum stake while wagering is the lower of €5 or 20% of the bonus.
    The written rules describe 50 spins a day for five days after the first deposit, unlike the split shown on the cards. Signup spin winnings are capped at €50 unless specified otherwise.
    The homepage advertises 5,000+ games. Public examples include Diamond Strike: Lucky Reels and Gates of Olympus 2500.
    Lightning Roulette and Crazy Time are from Evolution. Sweet Bonanza CandyLand is from Pragmatic Play Live.
    The sportsbook has separate Live and Upcoming sections. It lists soccer, tennis, basketball, ice hockey, cricket, MMA, and esports such as Counter-Strike and Dota 2.
    First deposit|100% up to €100|Second deposit|75% up to €150|Third deposit|50% up to €200
    The sports bonus requires a deposit of at least €20 and must be selected before depositing. The terms require 5× wagering within 14 days. Only parlays with at least three events and decimal odds of 1.40 or higher per leg count. Voided bets and bets settled early through Cash Out do not count.
    The homepage lists Visa, Mastercard, Apple Pay, Google Pay, and cryptocurrency. The options depend on the account and country. The terms call for withdrawals through the same method used to deposit.
    The minimum withdrawal ranges from €50 to €120, depending on the country and payment method. The terms require 3× playthrough of active deposits and give the operator up to three business days to process the request, not including the payment provider’s time. The bonus rules list a separate 72-hour window. Neither is a guarantee of when the money will arrive.
    The operator may ask for ID, proof of address, and proof that you own the payment method. Withdrawals can be held while checks are in progress.
    The site describes itself as licensed, but the legal operator and license number could not be verified from the public pages checked. The complaints policy lists contact@magneticslots.com.
    Deposit and wagering limits are available under the responsible gaming policy. Raising or removing a deposit limit takes 24 hours. Self-exclusion can run from three months to five years or indefinitely.
    The operator’s terms exclude Spain from deposits and real-money play. Players must be at least 18 and meet any higher local age requirement.
  `),
  uk: row(`
    У Magnetic Slots є слоти, ігри з живими дилерами й окремий букмекерський розділ. На картках акцій казино та в загальних правилах різняться ліміти бонусів і порядок нарахування фріспінів.
    Редакційна перевірка
    Категорії ігор, live-столів і ставок у відкритому лобі. Вибір залежить від країни.
    Тема|Деталі|Умови
    Перший депозит|До 1 500 € і 150 фріспінів|На картці не вказано відсоток бонусу.|Другий депозит|55% до 500 € і 100 фріспінів|Третій депозит|100% до 500 €|Фріспіни не вказано.
    Це суми з карток акцій. У загальних правилах для бонусів на перші три депозити зазначено ліміт 150 € і мінімальний депозит 15 €. Яку суму нарахують у конкретному акаунті, не підтверджено.
    Стандартний відіграш — 40×, якщо акція не передбачає іншого. За загальними правилами вітальні бонуси діють сім днів. Максимальна ставка під час відіграшу — 5 € або 20% суми бонусу, залежно від того, що менше.
    У правилах описано 50 фріспінів щодня протягом п’яти днів після першого депозиту. Картки акцій показують інший розподіл. Виграш із вітальних фріспінів обмежено 50 €, якщо не вказано іншого.
    На головній заявлено понад 5 000 ігор. Серед слотів у відкритому лобі є Diamond Strike: Lucky Reels і Gates of Olympus 2500.
    Lightning Roulette і Crazy Time пропонує Evolution, а Sweet Bonanza CandyLand — Pragmatic Play Live.
    У букмекерському розділі є окремі вкладки для ставок наживо й майбутніх подій. Серед категорій — футбол, теніс, баскетбол, хокей, крикет, MMA та кіберспорт, зокрема Counter-Strike і Dota 2.
    Перший депозит|100% до 100 €|Другий депозит|75% до 150 €|Третій депозит|50% до 200 €
    За правилами спортивної акції мінімальний депозит — 20 €. Бонус потрібно обрати до поповнення й відіграти 5× за 14 днів. Зараховуються експреси щонайменше з трьох подій із коефіцієнтом від 1,40 на кожну. Скасовані й достроково закриті ставки не зараховуються.
    На головній показано Visa, Mastercard, Apple Pay, Google Pay і криптовалюту. Набір методів залежить від країни й акаунта. За правилами кошти виплачують тим самим способом, яким поповнювали рахунок.
    Мінімальна сума виплати — від 50 до 120 € залежно від країни й способу оплати. За правилами активні депозити треба відіграти 3×. Оператор має до трьох робочих днів на обробку заявки, не враховуючи часу платіжної системи. У бонусних правилах окремо зазначено строк до 72 годин, але точного часу надходження коштів не гарантують.
    Оператор може попросити посвідчення особи, підтвердження адреси й документ, який підтверджує, що платіжний засіб належить гравцеві. До завершення перевірки виплату можуть призупинити.
    Сайт заявляє про ліцензію, але юридичну особу оператора й номер ліцензії за відкритими сторінками не вдалося підтвердити. У правилах розгляду скарг зазначено contact@magneticslots.com.
    Політика відповідальної гри передбачає ліміти депозитів і ставок. Підвищення або зняття депозитного ліміту набирає чинності через 24 години. Самовиключення можливе на строк від трьох місяців до п’яти років або безстроково.
    За правилами оператора гравці з Іспанії не можуть поповнювати рахунок і грати на гроші. Мінімальний вік — 18 років; місцеві вимоги можуть встановлювати вищу межу.
  `),
  de: row(`
    Magnetic Slots bietet Spielautomaten, Live-Casino und einen eigenen Sportwettenbereich. Die Casino-Angebote und die allgemeinen Bonusbedingungen widersprechen sich bei Höchstbeträgen und Freispielen.
    Redaktionell geprüft
    Casinospiele, Live-Tische und Sportarten aus der öffentlichen Lobby. Das Angebot variiert je nach Land.
    Thema|Details|Bedingungen
    Erste Einzahlung|Bis zu 1.500 € + 150 Freispiele|Die Angebotskarte nennt keinen Prozentsatz.|Zweite Einzahlung|55 % bis 500 € + 100 Freispiele|Dritte Einzahlung|100 % bis 500 €|Keine Freispiele ausgewiesen.
    Die Beträge stehen auf den Angebotskarten. Die allgemeinen Bonusbedingungen nennen für die ersten drei Einzahlungsboni eine Obergrenze von 150 € und eine Mindesteinzahlung von 15 €. Welcher Betrag im Spielerkonto gilt, ist nicht bestätigt.
    Ohne abweichende Aktionsregel gilt 40-facher Umsatz. Das Willkommenspaket ist laut allgemeinen Bedingungen sieben Tage gültig. Pro Einsatz gilt der niedrigere Betrag aus 5 € und 20 % des Bonus.
    Die Bedingungen sehen nach der ersten Einzahlung fünf Tage lang je 50 Freispiele vor. Die Karten zeigen eine andere Verteilung. Gewinne aus Willkommensfreispielen sind ohne abweichende Regel auf 50 € begrenzt.
    Die Startseite wirbt mit mehr als 5.000 Spielen. In der öffentlichen Lobby stehen unter anderem Diamond Strike: Lucky Reels und Gates of Olympus 2500.
    Lightning Roulette und Crazy Time sind von Evolution, Sweet Bonanza CandyLand von Pragmatic Play Live.
    Im Sportwettenbereich sind Livewetten und kommende Begegnungen getrennt. Zur Auswahl gehören Fußball, Tennis, Basketball, Eishockey, Cricket, MMA und E-Sport wie Counter-Strike oder Dota 2.
    Erste Einzahlung|100 % bis 100 €|Zweite Einzahlung|75 % bis 150 €|Dritte Einzahlung|50 % bis 200 €
    Für den Sportbonus sind mindestens 20 € Einzahlung erforderlich. Der Bonus muss vorher ausgewählt und innerhalb von 14 Tagen 5-fach umgesetzt werden. Es zählen nur Kombiwetten auf mindestens drei Ereignisse mit einer Quote von mindestens 1,40 pro Auswahl. Stornierte und per Cashout vorzeitig abgerechnete Wetten zählen nicht.
    Die Startseite führt Visa, Mastercard, Apple Pay, Google Pay und Kryptowährungen auf. Welche Zahlungsarten verfügbar sind, hängt vom Land und vom Konto ab. Laut AGB erfolgt die Auszahlung über dieselbe Methode wie die Einzahlung.
    Der Mindestbetrag für Auszahlungen liegt je nach Land und Methode bei 50–120 €. Eingezahlte Beträge müssen 3-fach umgesetzt werden. Die AGB nennen bis zu drei Werktage Bearbeitung, zuzüglich der Zeit beim Zahlungsanbieter. Die Bonusregeln nennen separat bis zu 72 Stunden; das ist keine Zusage für den Zahlungseingang.
    Der Anbieter kann Ausweis, Adressnachweis und einen Nachweis über die Inhaberschaft der Zahlungsmethode verlangen. Solange geprüft wird, können Auszahlungen ausgesetzt werden.
    Die Seite bezeichnet sich als lizenziert. Betreiberfirma und Lizenznummer ließen sich auf den geprüften öffentlichen Seiten nicht bestätigen. Für Beschwerden nennt der Anbieter contact@magneticslots.com.
    Die Spielerschutzregeln sehen Einzahlungs- und Einsatzlimits vor. Ein höheres Einzahllimit oder seine Aufhebung wird nach 24 Stunden wirksam. Eine Selbstsperre ist für drei Monate bis fünf Jahre oder unbefristet möglich.
    Die AGB schließen Einzahlungen und Echtgeldspiele aus Spanien aus. Das Mindestalter beträgt 18 Jahre; vor Ort kann eine höhere Altersgrenze gelten.
  `),
  es: row(`
    Magnetic Slots tiene tragamonedas, casino en vivo y una sección de apuestas deportivas independiente. Los anuncios del casino y sus condiciones generales no coinciden en los topes de los bonos ni en el reparto de los giros.
    Revisión editorial
    Categorías de juegos, mesas en vivo y deportes del catálogo público. La oferta varía según el país.
    Tema|Detalles|Condiciones
    Primer depósito|Hasta 1.500 € y 150 giros gratis|La ficha no indica el porcentaje.|Segundo depósito|55 % hasta 500 € y 100 giros gratis|Tercer depósito|100 % hasta 500 €|No se indican giros gratis.
    Los importes son los anunciados en las fichas. Las condiciones generales fijan un tope de 150 € para los tres primeros bonos de depósito y un depósito mínimo de 15 €. No pudimos confirmar qué importe se aplica en la cuenta.
    Salvo que la promoción indique otra cosa, el requisito de apuesta es de 40× y los bonos de bienvenida caducan a los siete días. La apuesta máxima es el menor importe entre 5 € y el 20 % del bono.
    Las reglas escritas prevén 50 giros diarios durante cinco días tras el primer depósito. Las fichas muestran otro reparto. Las ganancias de los giros de bienvenida tienen un tope de 50 €, salvo indicación contraria.
    La portada anuncia más de 5.000 juegos. Entre las tragamonedas del catálogo público están Diamond Strike: Lucky Reels y Gates of Olympus 2500.
    Evolution ofrece Lightning Roulette y Crazy Time; Sweet Bonanza CandyLand es de Pragmatic Play Live.
    Las apuestas en vivo y los próximos eventos aparecen en secciones distintas. Hay fútbol, tenis, básquetbol, hockey sobre hielo, críquet, MMA y deportes electrónicos como Counter-Strike y Dota 2.
    Primer depósito|100 % hasta 100 €|Segundo depósito|75 % hasta 150 €|Tercer depósito|50 % hasta 200 €
    Para el bono deportivo hay que elegir la oferta antes de depositar al menos 20 €. El requisito es apostar cinco veces el importe del bono en 14 días. Solo cuentan las combinadas de al menos tres eventos con una cuota mínima de 1,40 por selección. No cuentan las apuestas anuladas ni las liquidadas antes de tiempo con cash out.
    La portada muestra Visa, Mastercard, Apple Pay, Google Pay y criptomonedas. Los métodos disponibles dependen del país y de la cuenta. Las reglas indican que el retiro se hace por el medio usado para depositar.
    El retiro mínimo va de 50 a 120 € según el país y el método. Los depósitos activos deben apostarse 3×. El operador indica hasta tres días hábiles de procesamiento interno, más el plazo del proveedor de pagos. Las reglas de bonos mencionan por separado hasta 72 horas; no es una garantía de abono.
    El operador puede pedir identificación, comprobante de domicilio y prueba de titularidad del medio de pago. Puede retener el retiro mientras dure la verificación.
    El sitio afirma tener licencia, pero no pudimos confirmar la razón social ni el número de licencia en las páginas públicas consultadas. La política de reclamaciones indica contact@magneticslots.com.
    La política de juego responsable contempla límites de depósito y de apuesta. El aumento o la eliminación de un límite de depósito tarda 24 horas. La autoexclusión puede durar de tres meses a cinco años o ser indefinida.
    El operador no admite depósitos ni juego con dinero real desde España. La edad mínima es de 18 años, o superior si así lo exige el país.
  `),
  it: row(`
    Magnetic Slots offre slot, casinò dal vivo e una sezione separata di scommesse sportive. Le promozioni del casinò e le condizioni generali indicano massimali e ripartizioni dei giri gratuiti diversi.
    Verifica editoriale
    Giochi, tavoli dal vivo e sport presenti nella lobby pubblica. L’offerta varia in base al paese.
    Voce|Dettagli|Condizioni
    Primo deposito|Fino a 1.500 € e 150 giri gratis|La scheda non indica la percentuale.|Secondo deposito|55% fino a 500 € e 100 giri gratis|Terzo deposito|100% fino a 500 €|Non sono indicati giri gratis.
    Le cifre sono quelle pubblicizzate. Le condizioni generali indicano 150 € come tetto per i primi tre bonus di deposito e un deposito minimo di 15 €. Non è stato possibile verificare l’importo applicato al conto.
    Salvo condizioni diverse, il bonus va rigiocato 40 volte. I bonus di benvenuto durano sette giorni. Durante il rigioco la puntata massima è il minore tra 5 € e il 20% del bonus.
    Le regole indicano 50 giri al giorno per cinque giorni dopo il primo deposito, con una ripartizione diversa dalle schede. Le vincite dei giri di benvenuto sono limitate a 50 €, salvo diversa indicazione.
    La pagina iniziale pubblicizza oltre 5.000 giochi. Nella lobby pubblica compaiono Diamond Strike: Lucky Reels e Gates of Olympus 2500.
    Lightning Roulette e Crazy Time sono di Evolution; Sweet Bonanza CandyLand è di Pragmatic Play Live.
    Le scommesse in diretta e gli eventi in programma hanno sezioni separate. Il sito propone calcio, tennis, basket, hockey su ghiaccio, cricket, MMA ed esport come Counter-Strike e Dota 2.
    Primo deposito|100% fino a 100 €|Secondo deposito|75% fino a 150 €|Terzo deposito|50% fino a 200 €
    Il bonus sportivo richiede un versamento di almeno 20 € e va selezionato prima di depositare. Va rigiocato 5 volte in 14 giorni. Valgono solo le multiple con almeno tre eventi e quota minima di 1,40 per selezione. Non contano le scommesse annullate o chiuse in anticipo.
    La pagina iniziale mostra Visa, Mastercard, Apple Pay, Google Pay e criptovalute. La disponibilità dipende da paese e conto. I prelievi seguono il metodo usato per depositare.
    La soglia minima per un prelievo va da 50 a 120 €, a seconda del paese e del metodo di pagamento. I depositi attivi vanno giocati tre volte. Il casinò può impiegare fino a tre giorni lavorativi per elaborare la richiesta, senza contare i tempi del servizio di pagamento. Le condizioni dei bonus indicano a parte un termine di 72 ore, che non garantisce l’accredito entro quel momento.
    Il sito può chiedere un documento, una prova di residenza e una conferma della titolarità del mezzo di pagamento. I prelievi possono restare sospesi fino alla fine dei controlli.
    Il sito dichiara di avere una licenza, ma nelle pagine consultate non è stato possibile verificare né il nome legale del gestore né il numero di licenza. Per i reclami è indicato contact@magneticslots.com.
    La politica di gioco responsabile prevede limiti di deposito e di puntata. Un aumento o la rimozione del limite di deposito si applica dopo 24 ore. L’autoesclusione può durare da tre mesi a cinque anni o a tempo indeterminato.
    I termini escludono depositi e gioco con denaro reale dalla Spagna. L’età minima è di 18 anni o superiore se richiesto dalle regole locali.
  `),
  pl: row(`
    Magnetic Slots ma automaty, kasyno na żywo i osobny dział zakładów sportowych. Karty promocji kasynowych i ogólny regulamin podają różne limity premii oraz inny podział darmowych spinów.
    Weryfikacja redakcyjna
    Gry, stoły na żywo i dyscypliny z otwartego lobby. Oferta różni się w zależności od kraju.
    Temat|Szczegóły|Warunki
    Pierwsza wpłata|Do 1500 € i 150 darmowych spinów|Na karcie nie podano stawki procentowej.|Druga wpłata|55% do 500 € i 100 darmowych spinów|Trzecia wpłata|100% do 500 €|Nie podano darmowych spinów.
    To kwoty z kart promocji. Ogólny regulamin dla pierwszych trzech premii podaje limit 150 € i minimalną wpłatę 15 €. Nie potwierdziliśmy, jaka kwota obowiązuje na koncie.
    Domyślny obrót wynosi 40×, chyba że dana promocja stanowi inaczej. Bonusy powitalne są ważne przez siedem dni. Maksymalna stawka to niższa z dwóch kwot: 5 € lub 20% bonusu.
    Według regulaminu po pierwszej wpłacie przysługuje po 50 spinów przez pięć dni. Karty pokazują inny podział. Wygrane z powitalnych spinów są ograniczone do 50 €, chyba że podano inny limit.
    Strona główna reklamuje ponad 5000 gier. W otwartym lobby są m.in. Diamond Strike: Lucky Reels i Gates of Olympus 2500.
    Lightning Roulette i Crazy Time pochodzą od Evolution, a Sweet Bonanza CandyLand od Pragmatic Play Live.
    Zakłady na żywo i nadchodzące wydarzenia mają osobne sekcje. Oferta obejmuje piłkę nożną, tenis, koszykówkę, hokej na lodzie, krykiet, MMA i esport, m.in. Counter-Strike i Dota 2.
    Pierwsza wpłata|100% do 100 €|Druga wpłata|75% do 150 €|Trzecia wpłata|50% do 200 €
    Bonus sportowy trzeba wybrać przed wpłatą wynoszącą co najmniej 20 €. Wymagany jest obrót 5× w ciągu 14 dni. Liczą się tylko kupony z co najmniej trzema zdarzeniami i kursem od 1,40 na każde. Zakłady anulowane i zamknięte przed czasem nie liczą się do obrotu.
    Na stronie głównej są wymienione Visa, Mastercard, Apple Pay, Google Pay i kryptowaluty. Dostępność zależy od kraju i konta. Wypłata ma być zrealizowana tą samą metodą co wpłata.
    Minimalna wypłata wynosi od 50 do 120 € zależnie od kraju i metody płatności. Aktywne wpłaty podlegają trzykrotnemu obrotowi. Regulamin daje operatorowi do trzech dni roboczych na rozpatrzenie dyspozycji, nie licząc czasu po stronie dostawcy płatności. Regulamin bonusów osobno wymienia do 72 godzin. Nie jest to gwarancja terminu wpływu pieniędzy.
    Operator może poprosić o dokument tożsamości, potwierdzenie adresu i dowód, że metoda płatności należy do gracza. Wypłata może czekać na zakończenie kontroli.
    Strona deklaruje posiadanie licencji, ale w sprawdzonych publicznych materiałach nie udało się potwierdzić nazwy spółki ani numeru licencji. Adres do skarg: contact@magneticslots.com.
    Zasady odpowiedzialnej gry przewidują limity wpłat i stawek. Podniesienie lub zniesienie limitu wpłat zaczyna obowiązywać po 24 godzinach. Samowykluczenie może trwać od trzech miesięcy do pięciu lat albo bezterminowo.
    Regulamin wyklucza wpłaty i grę za pieniądze z Hiszpanii. Minimalny wiek to 18 lat lub więcej, jeśli wymagają tego lokalne przepisy.
  `),
  pt: row(`
    A Magnetic Slots tem slots, jogos com crupiê ao vivo e uma área de apostas desportivas separada. As fichas das promoções de casino e as regras gerais divergem nos limites dos bónus e na distribuição das jogadas grátis.
    Revisão editorial
    Jogos, mesas ao vivo e desportos do catálogo público. A oferta varia consoante o país.
    Tema|Detalhes|Condições
    Primeiro depósito|Até 1 500 € e 150 jogadas grátis|A ficha não indica a percentagem.|Segundo depósito|55% até 500 € e 100 jogadas grátis|Terceiro depósito|100% até 500 €|Não são indicadas jogadas grátis.
    Estes são os valores anunciados. As regras gerais fixam um limite de 150 € para os primeiros três bónus de depósito e um depósito mínimo de 15 €. Não foi possível confirmar o montante aplicável à conta.
    Salvo indicação em contrário, o bónus tem de ser apostado 40 vezes. Os bónus de boas-vindas são válidos por sete dias. Durante o cumprimento do requisito, a aposta máxima é o menor valor entre 5 € e 20% do bónus.
    As regras indicam 50 jogadas por dia durante cinco dias após o primeiro depósito, ao contrário da distribuição das fichas. Os ganhos das jogadas de boas-vindas têm um limite de 50 €, salvo indicação em contrário.
    A página inicial anuncia mais de 5 000 jogos. O catálogo público inclui Diamond Strike: Lucky Reels e Gates of Olympus 2500.
    Lightning Roulette e Crazy Time são da Evolution. Sweet Bonanza CandyLand é da Pragmatic Play Live.
    Há áreas diferentes para apostas ao vivo e próximos eventos. Entre as modalidades estão futebol, ténis, basquetebol, hóquei no gelo, críquete, MMA e desportos eletrónicos, como Counter-Strike e Dota 2.
    Primeiro depósito|100% até 100 €|Segundo depósito|75% até 150 €|Terceiro depósito|50% até 200 €
    É preciso escolher o bónus desportivo antes de depositar pelo menos 20 €. O valor do bónus tem de ser apostado cinco vezes em 14 dias. Só contam múltiplas de três ou mais eventos com uma odd mínima de 1,40 por seleção. Apostas anuladas ou resolvidas por cash out não contam.
    A página inicial indica Visa, Mastercard, Apple Pay, Google Pay e criptomoedas. As opções dependem da conta e do país. As regras preveem o levantamento pelo mesmo método usado para depositar.
    O levantamento mínimo varia entre 50 € e 120 €, consoante o país e o método. É preciso apostar 3 vezes os depósitos ativos. Os termos indicam até três dias úteis para o processamento interno, além do prazo do prestador de pagamento. As regras de bónus indicam até 72 horas, sem garantia de crédito nesse prazo.
    Podem ser pedidos um documento de identificação, comprovativo de morada e prova de titularidade do método de pagamento. O levantamento pode ficar suspenso até ao fim da verificação.
    O site afirma ter licença, mas não foi possível confirmar a entidade operadora ou o número de licença nas páginas públicas consultadas. A política de reclamações indica contact@magneticslots.com.
    A política de jogo responsável prevê limites de depósito e de aposta. Uma subida ou remoção do limite de depósito só produz efeito ao fim de 24 horas. A autoexclusão pode durar de três meses a cinco anos ou ser por tempo indeterminado.
    Os termos excluem depósitos e jogo a dinheiro real a partir de Espanha. A idade mínima é 18 anos ou superior, se a lei local o exigir.
  `),
  fr: row(`
    Magnetic Slots propose des machines à sous, un casino en direct et un espace distinct pour les paris sportifs. Les offres de casino et les conditions générales divergent sur les plafonds des bonus et la répartition des tours gratuits.
    Vérification éditoriale
    Jeux, tables en direct et sports du catalogue public. L’offre varie selon le pays.
    Sujet|Détails|Conditions
    Premier dépôt|Jusqu’à 1 500 € et 150 tours gratuits|La fiche ne précise pas le pourcentage.|Deuxième dépôt|55 % jusqu’à 500 € et 100 tours gratuits|Troisième dépôt|100 % jusqu’à 500 €|Aucun tour gratuit n’est indiqué.
    Ces montants figurent sur les fiches promotionnelles. Les conditions générales indiquent un plafond de 150 € pour les trois premiers bonus de dépôt et un dépôt minimum de 15 €. Le montant applicable au compte n’a pas pu être confirmé.
    Sauf indication contraire, il faut miser 40 fois le bonus. Les bonus de bienvenue sont valables sept jours. La mise maximale est de 5 € ou 20 % du bonus si ce montant est inférieur.
    Les conditions écrites prévoient 50 tours par jour pendant cinq jours après le premier dépôt, alors que les fiches indiquent une autre répartition. Les gains issus des tours de bienvenue sont plafonnés à 50 €, sauf indication contraire.
    La page d’accueil annonce plus de 5 000 jeux. Le catalogue public présente notamment Diamond Strike: Lucky Reels et Gates of Olympus 2500.
    Lightning Roulette et Crazy Time sont proposés par Evolution, Sweet Bonanza CandyLand par Pragmatic Play Live.
    Les paris en direct et les événements à venir ont chacun leur espace. Le site propose du football, du tennis, du basket, du hockey sur glace, du cricket, du MMA et de l’esport, dont Counter-Strike et Dota 2.
    Premier dépôt|100 % jusqu’à 100 €|Deuxième dépôt|75 % jusqu’à 150 €|Troisième dépôt|50 % jusqu’à 200 €
    Il faut sélectionner l’offre sportive avant de déposer au moins 20 €. Le bonus doit être misé cinq fois en 14 jours. Seuls les combinés d’au moins trois événements comptent, avec une cote minimale de 1,40 pour chaque sélection. Les paris annulés ou réglés par cash out ne comptent pas.
    La page d’accueil affiche Visa, Mastercard, Apple Pay, Google Pay et les cryptomonnaies. Les moyens disponibles dépendent du pays et du compte. Les conditions prévoient un retrait par le moyen utilisé pour le dépôt.
    Le retrait minimum varie de 50 à 120 € selon le pays et le moyen de paiement. Il faut miser 3 fois les dépôts actifs. Les conditions prévoient jusqu’à trois jours ouvrés de traitement interne, hors délai du prestataire. Les conditions des bonus indiquent de leur côté jusqu’à 72 heures, sans garantie sur la date de réception.
    L’opérateur peut demander une pièce d’identité, un justificatif de domicile et une preuve de titularité du moyen de paiement. Les retraits peuvent être suspendus pendant ces contrôles.
    Le site affirme détenir une licence. Les pages publiques consultées n’ont pas permis de confirmer la société exploitante ni le numéro de licence. Pour une réclamation, le site indique contact@magneticslots.com.
    La politique de jeu responsable prévoit des limites de dépôt et de mise. Une hausse ou une suppression de la limite de dépôt prend effet après 24 heures. L’auto-exclusion peut durer de trois mois à cinq ans, ou être sans limite de durée.
    Les conditions excluent les dépôts et le jeu en argent réel depuis l’Espagne. L’âge minimum est de 18 ans, ou plus si la réglementation locale l’exige.
  `),
  hi: row(`
    Magnetic Slots में स्लॉट, लाइव डीलर गेम और खेल सट्टेबाज़ी का अलग सेक्शन है। कैसीनो ऑफ़र के कार्ड और सामान्य नियमों में बोनस की अधिकतम रकम और फ़्री स्पिन के बँटवारे पर अलग-अलग जानकारी है।
    संपादकीय समीक्षा
    सार्वजनिक लॉबी में दिखने वाले कैसीनो गेम, लाइव टेबल और खेल। विकल्प देश के अनुसार बदलते हैं।
    विषय|जानकारी|शर्तें
    पहली जमा|€1,500 तक और 150 फ़्री स्पिन|कार्ड पर बोनस का प्रतिशत नहीं दिया गया है।|दूसरी जमा|55%, €500 तक और 100 फ़्री स्पिन|तीसरी जमा|100%, €500 तक|फ़्री स्पिन का ज़िक्र नहीं है।
    ये रकम ऑफ़र कार्ड पर दी गई हैं। सामान्य नियम पहली तीन जमाओं के बोनस पर €150 की सीमा और €15 की न्यूनतम जमा बताते हैं। खाते में लागू रकम की पुष्टि नहीं हो सकी।
    अगर ऑफ़र में अलग शर्त न हो, तो बोनस की रकम के 40 गुना के बराबर दाँव लगाने होते हैं। वेलकम बोनस सात दिन तक मान्य रहता है। एक बार में €5 या बोनस का 20%, इनमें से जो कम हो, उतना ही दाँव लगा सकते हैं।
    लिखित नियम पहली जमा के बाद पाँच दिनों तक रोज़ 50 स्पिन बताते हैं। कार्ड पर स्पिन का बँटवारा अलग है। अलग शर्त न होने पर स्वागत स्पिन से €50 तक की जीत मिल सकती है।
    होमपेज पर 5,000 से ज़्यादा गेम का विज्ञापन है। सार्वजनिक लॉबी में Diamond Strike: Lucky Reels और Gates of Olympus 2500 जैसे स्लॉट हैं।
    Lightning Roulette और Crazy Time, Evolution के हैं। Sweet Bonanza CandyLand, Pragmatic Play Live का है।
    लाइव सट्टेबाज़ी और आगामी मैचों के सेक्शन अलग हैं। फ़ुटबॉल, टेनिस, बास्केटबॉल, आइस हॉकी, क्रिकेट, MMA और Counter-Strike व Dota 2 जैसे ईस्पोर्ट्स की श्रेणियाँ हैं।
    पहली जमा|100%, €100 तक|दूसरी जमा|75%, €150 तक|तीसरी जमा|50%, €200 तक
    स्पोर्ट्स बोनस के लिए कम से कम €20 जमा करने होते हैं। पैसे जमा करने से पहले ऑफ़र चुनना ज़रूरी है। 14 दिनों के भीतर बोनस की रकम के पाँच गुना के बराबर दाँव लगाने होते हैं। सिर्फ़ कम से कम तीन इवेंट वाली कॉम्बो बेट गिनी जाती है और हर चयन के ऑड्स कम से कम 1.40 होने चाहिए। रद्द या कैश आउट की गई बेट नहीं गिनी जातीं।
    होमपेज पर Visa, Mastercard, Apple Pay, Google Pay और क्रिप्टोकरेंसी दिखते हैं। उपलब्ध तरीके खाते और देश पर निर्भर हैं। नियमों के अनुसार रकम उसी तरीके से निकाली जाती है जिससे जमा की गई थी।
    न्यूनतम निकासी देश और तरीके के अनुसार €50 से €120 है। सक्रिय जमा की रकम के 3 गुना दाँव लगाने होते हैं। सामान्य नियमों में ऑपरेटर को निकासी की प्रक्रिया के लिए तीन कामकाजी दिन तक मिलते हैं; भुगतान सेवा का समय अलग है। बोनस नियम अलग से 72 घंटे तक बताते हैं, लेकिन यह रकम मिलने की गारंटी नहीं है।
    ऑपरेटर पहचान, पते और भुगतान साधन के स्वामित्व का प्रमाण माँग सकता है। जाँच पूरी होने तक निकासी रोकी जा सकती है।
    साइट का कहना है कि उसके पास लाइसेंस है। सार्वजनिक पेजों से न तो संचालक कंपनी के पंजीकृत नाम की पुष्टि हुई, न लाइसेंस नंबर की। शिकायत के लिए साइट contact@magneticslots.com देती है।
    ज़िम्मेदार खेल की नीति में जमा और दाँव की सीमाएँ हैं। जमा की सीमा बढ़ाने या हटाने में 24 घंटे लगते हैं। स्व-बहिष्कार तीन महीने से पाँच साल तक या अनिश्चित अवधि के लिए लिया जा सकता है।
    ऑपरेटर के नियम स्पेन से जमा और असली पैसे से खेलने की अनुमति नहीं देते। न्यूनतम आयु 18 वर्ष है; स्थानीय नियम इससे अधिक आयु माँग सकते हैं।
  `),
  fi: row(`
    Magnetic Slots tarjoaa kolikkopelejä, livekasinopelejä ja erillisen vedonlyöntiosion. Kasinon tarjouskortit ja yleiset bonusehdot antavat eri tiedot enimmäisbonuksista ja ilmaiskierrosten jaosta.
    Toimituksellisesti tarkistettu
    Peliaulan kasinopelit, livepöydät ja vedonlyöntilajit. Valikoima voi vaihdella maittain.
    Aihe|Tiedot|Ehdot
    Ensimmäinen talletus|Enintään 1 500 € ja 150 ilmaiskierrosta|Kortti ei ilmoita bonusprosenttia.|Toinen talletus|55 % enintään 500 € ja 100 ilmaiskierrosta|Kolmas talletus|100 % enintään 500 €|Ilmaiskierroksia ei ilmoiteta.
    Summat ovat tarjouskorteista. Yleisissä ehdoissa kolmen ensimmäisen talletusbonuksen ylärajaksi ilmoitetaan 150 € ja vähimmäistalletukseksi 15 €. Pelitiliin sovellettavaa summaa ei voitu vahvistaa.
    Oletuskierrätys on 40-kertainen, ellei tarjouksessa sanota muuta. Tervetulobonusten voimassaoloaika on seitsemän päivää. Suurin panos kierrätyksen aikana on 5 € tai 20 % bonuksesta, sen mukaan kumpi on pienempi.
    Kirjallisten ehtojen mukaan ensimmäisen talletuksen jälkeen saa 50 kierrosta päivässä viiden päivän ajan. Kortit näyttävät toisenlaisen jaon. Tervetuliaiskierrosten voittoraja on 50 €, ellei toisin ilmoiteta.
    Etusivu mainostaa yli 5 000 peliä. Julkisessa aulassa ovat muun muassa Diamond Strike: Lucky Reels ja Gates of Olympus 2500.
    Lightning Roulette ja Crazy Time ovat Evolutionin pelejä; Sweet Bonanza CandyLand on Pragmatic Play Liven peli.
    Livevedonlyönnille ja tuleville otteluille on omat osionsa. Tarjolla on jalkapalloa, tennistä, koripalloa, jääkiekkoa, krikettiä, vapaaottelua ja e-urheilua, kuten Counter-Strikea ja Dota 2:ta.
    Ensimmäinen talletus|100 % enintään 100 €|Toinen talletus|75 % enintään 150 €|Kolmas talletus|50 % enintään 200 €
    Urheilubonus on valittava ennen vähintään 20 €:n talletusta. Bonus on kierrätettävä 5 kertaa 14 päivässä. Vain yhdistelmävedot, joissa on vähintään kolme kohdetta ja kunkin kerroin on vähintään 1,40, lasketaan mukaan. Mitätöidyt ja ennenaikaisesti suljetut vedot eivät kelpaa.
    Etusivulla mainitaan Visa, Mastercard, Apple Pay, Google Pay ja kryptovaluutat. Käytettävissä olevat maksutavat riippuvat maasta ja pelitilistä. Ehtojen mukaan kotiutus tehdään samalla maksutavalla kuin talletus.
    Kotiutuksen alaraja on maasta ja maksutavasta riippuen 50–120 €. Aktiiviset talletukset on pelattava 3 kertaa. Yleisten ehtojen mukaan kasinon oma käsittely voi kestää kolme arkipäivää, minkä lisäksi tulee maksupalvelun käsittelyaika. Bonusehdot ilmoittavat erikseen 72 tuntia, mutta eivät takaa maksun saapumisaikaa.
    Kasino voi pyytää henkilöllisyystodistusta, osoitetodistusta ja näyttöä maksutavan omistuksesta. Kotiutus voidaan keskeyttää tarkistusten ajaksi.
    Kasino kertoo toimivansa lisenssillä, mutta julkisilta sivuilta ei voitu vahvistaa lisenssin numeroa eikä kasinoa ylläpitävää yhtiötä. Kasino ilmoittaa reklamaatioiden osoitteeksi contact@magneticslots.com.
    Vastuullisen pelaamisen ehdoissa on talletus- ja panosrajat. Talletusrajan nosto tai poisto tulee voimaan 24 tunnin kuluttua. Pelieston voi asettaa kolmeksi kuukaudeksi, enintään viideksi vuodeksi tai toistaiseksi.
    Ehtojen mukaan Espanjasta ei voi tallettaa eikä pelata oikealla rahalla. Ikäraja on 18 vuotta, elleivät paikalliset säännöt edellytä korkeampaa ikää.
  `),
};
