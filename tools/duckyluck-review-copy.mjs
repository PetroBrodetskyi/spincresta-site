// Locale rows follow the same field order; the review builder supplies tables and amounts.
const fields = ['title', 'overview', 'standard', 'crypto', 'spins', 'terms', 'games', 'rewards', 'payments', 'identity', 'trust', 'support', 'inactivity', 'labels', 'questions'];
const rows = {
  en: [
    'Ducky Luck Review 2026: Bonuses, Games & Withdrawals',
    'Ducky Luck is a casino with slots, video poker, crash games, and a separate Fresh Deck live lobby. The two welcome packages cover three qualifying deposits, but use different wagering multipliers. The published payout methods and limits depend on the account and location.',
    '500% on each of the first three qualifying deposits: up to $2,500 per deposit and $7,500 in total. Wager the deposit and bonus together 30×.',
    '600% on each of the first three qualifying crypto deposits: up to $3,000 per deposit and $9,000 in total. Wager the deposit and bonus together 40×.',
    'The offer pages list 150 spins after the first deposit, split into 50 per day for three days. Unused spins expire each day. If you take a match bonus, the help center says you must complete it first. Spin winnings require 30× wagering, with a $100 withdrawal cap.',
    'The qualifying deposit range for either match is $25–$500. Bonus play excludes live dealer games, craps, and progressive jackpots. The promotional withdrawal cap is 10× the qualifying deposit for either match.',
    'The casino also has table games, jackpot slots, and Ducky Luck Originals. Fresh Deck lists live blackjack, poker, and roulette in a separate lobby. Ducky Luck does not list a sportsbook.',
    'DuckyBucks gives one level point per $20 deposited and requires a monthly deposit to retain status. Separate comp points are earned on real-money wagers not tied to bonuses. The program lists a 3% daily rebate on crypto deposits, credited the next day.',
    'The public banking page lists crypto deposits starting at $25, including BTC, ETH, LTC, USDT, BCH, and BNB. US-only card listings show $25–$1,000 for Visa and Mastercard and $25–$750 for American Express. A listing does not guarantee account eligibility.',
    'Identity verification is required for the first withdrawal. The casino can request government ID, a selfie with the ID, and additional proof of address or payment ownership. The general terms require 1× wagering on deposits before withdrawal unless otherwise specified.',
    'This review covers the United States. The casino’s own eligibility rules do not establish legal access in any state. The site displays a Costa Rica badge, but we could not verify a US state gambling license for the reviewed domain. Do not treat the badge as evidence of US authorization.',
    'Support is available by live chat and email. The responsible gaming page says players can request self-exclusion through support.',
    'After six months without signing in, the terms list a monthly charge: the equivalent of €100 or 5% of the balance, whichever is higher.',
    'Reviewed|Standard match|Crypto match|Welcome spins|Method|Minimum withdrawal|Published estimate|business days|Weekly limit|Pros|Cons|Casino game examples|United States',
    'What are the Ducky Luck welcome packages?|How long do Ducky Luck withdrawals take?|Does Ducky Luck require identity verification?|Is Ducky Luck licensed in the United States?'
  ],
  uk: [
    'Огляд Ducky Luck 2026: бонуси, ігри та виплати',
    'Ducky Luck — казино зі слотами, відеопокером, краш-іграми й окремим лобі Fresh Deck. Обидва вітальні пакети охоплюють три депозити, але мають різні вимоги до відіграшу. Способи й ліміти виплат залежать від акаунта та місця перебування.',
    '500% на кожен із перших трьох депозитів, що відповідають умовам: до 2 500 $ за депозит і до 7 500 $ загалом. Депозит і бонус разом потрібно відіграти 30×.',
    '600% на кожен із перших трьох криптодепозитів, що відповідають умовам: до 3 000 $ за депозит і до 9 000 $ загалом. Депозит і бонус разом потрібно відіграти 40×.',
    'Сторінки акцій вказують 150 фріспінів після першого депозиту: по 50 на день протягом трьох днів. Невикористані обертання згорають наприкінці дня. Якщо взяли депозитний бонус, довідка вимагає спершу виконати його умови. Виграш із фріспінів потрібно відіграти 30×; ліміт виплати — 100 $.',
    'Для кожного депозитного бонусу підходить внесок від 25 до 500 $. Ігри з дилерами, крепс і прогресивні джекпоти виключені. Ліміт виплати за кожним бонусом — 10× суми відповідного депозиту.',
    'Є настільні ігри, джекпот-слоти й Ducky Luck Originals. Fresh Deck пропонує блекджек, покер і рулетку з дилерами в окремому лобі. Розділу ставок на спорт немає.',
    'DuckyBucks дає один бал рівня за кожні 20 $ депозиту. Щоб зберегти рівень, потрібен щомісячний депозит. Окремі бали нараховують за ставки реальними грошима без бонусу. Програма передбачає повернення 3% криптодепозитів наступного дня.',
    'Каса вказує криптодепозити від 25 $, зокрема BTC, ETH, LTC, USDT, BCH і BNB. Для США опубліковано 25–1 000 $ для Visa та Mastercard і 25–750 $ для American Express. Доступність залежить від акаунта.',
    'Для першої виплати потрібна перевірка особи. Казино може попросити посвідчення, селфі з ним і підтвердження адреси чи права на платіжний засіб. За загальними правилами депозит треба відіграти 1×, якщо не зазначено інше.',
    'Огляд охоплює США. Правила допуску казино не підтверджують законність доступу в конкретному штаті. На сайті є позначка Коста-Рики, проте ми не підтвердили ліцензію жодного штату США для цього домену.',
    'Підтримка працює через чат та електронну пошту й приймає запити на самовиключення.',
    'За умовами, після шести місяців без входу нараховується щомісячна плата: еквівалент 100 € або 5% балансу, залежно від того, що більше.',
    'Перевірено|Стандартний бонус|Криптобонус|Вітальні фріспіни|Спосіб|Мінімум виплати|Строк за даними казино|робочі дні|Тижневий ліміт|Переваги|Недоліки|Приклади ігор|США',
    'Які вітальні бонуси має Ducky Luck?|Скільки триває виплата в Ducky Luck?|Чи потрібна перевірка особи в Ducky Luck?|Чи має Ducky Luck ліцензію у США?'
  ],
  de: [
    'Ducky Luck Test 2026: Boni, Spiele und Auszahlungen',
    'Ducky Luck bietet Slots, Videopoker, Crash-Spiele und eine separate Fresh-Deck-Lobby. Beide Willkommenspakete gelten für drei qualifizierte Einzahlungen, aber mit unterschiedlichen Umsatzanforderungen. Auszahlungsmethoden und Limits hängen vom Konto und Wohnort ab.',
    '500 % auf jede der ersten drei qualifizierten Einzahlungen, bis zu 2.500 USD pro Einzahlung und insgesamt 7.500 USD. Einzahlung und Bonus sind zusammen 30-fach umzusetzen.',
    '600 % auf jede der ersten drei qualifizierten Krypto-Einzahlungen, bis zu 3.000 USD pro Einzahlung und insgesamt 9.000 USD. Einzahlung und Bonus sind zusammen 40-fach umzusetzen.',
    'Die Aktionsseiten nennen 150 Freispiele nach der ersten Einzahlung, jeweils 50 an drei Tagen. Nicht genutzte Freispiele verfallen täglich. Laut Hilfe muss ein beanspruchter Einzahlungsbonus zuerst abgeschlossen werden. Gewinne aus Freispielen sind 30-fach umzusetzen; die Auszahlung ist auf 100 USD begrenzt.',
    'Für beide Angebote gilt ein Einzahlungsbereich von 25 bis 500 USD. Live-Dealer-Spiele, Craps und progressive Jackpots sind ausgeschlossen. Die Bonusauszahlung ist auf das Zehnfache der jeweiligen Einzahlung begrenzt.',
    'Das Casino bietet auch Tischspiele, Jackpot-Slots und Ducky Luck Originals. Fresh Deck führt Live-Blackjack, Live-Poker und Live-Roulette in einer eigenen Lobby. Sportwetten werden nicht angeboten.',
    'DuckyBucks vergibt je 20 USD Einzahlung einen Stufenpunkt. Eine monatliche Einzahlung erhält den Status. Separate Treuepunkte gibt es für Echtgeldspiele ohne Bonus. Die tägliche Rückvergütung von 3 % auf Krypto-Einzahlungen wird am Folgetag gutgeschrieben.',
    'Die öffentliche Kasse nennt Krypto-Einzahlungen ab 25 USD, darunter BTC, ETH, LTC, USDT, BCH und BNB. Für US-Karten sind 25–1.000 USD für Visa und Mastercard und 25–750 USD für American Express angegeben. Die Methode kann je nach Konto fehlen.',
    'Vor der ersten Auszahlung ist eine Identitätsprüfung erforderlich. Ducky Luck kann einen Ausweis, ein Selfie mit dem Dokument sowie einen Adress- oder Zahlungsnachweis verlangen. Die allgemeinen Bedingungen verlangen einen einfachen Einzahlungsumsatz, sofern nichts anderes gilt.',
    'Dieser Test betrifft die USA. Die Teilnahmebedingungen belegen keinen rechtmäßigen Zugang in einem bestimmten Bundesstaat. Die Seite zeigt ein Costa-Rica-Siegel; eine US-Bundesstaatenlizenz für die Domain konnten wir nicht bestätigen.',
    'Der Support ist per Live-Chat und E-Mail erreichbar und nimmt Anträge auf Selbstausschluss entgegen.',
    'Nach sechs Monaten ohne Anmeldung sehen die Bedingungen eine monatliche Gebühr vor: den Gegenwert von 100 € oder 5 % des Guthabens, je nachdem, welcher Betrag höher ist.',
    'Geprüft am|Standardbonus|Krypto-Bonus|Willkommensfreispiele|Methode|Mindestauszahlung|Angegebene Dauer|Werktage|Wochenlimit|Vorteile|Nachteile|Spielbeispiele|USA',
    'Welche Willkommensboni gibt es bei Ducky Luck?|Wie lange dauern Auszahlungen bei Ducky Luck?|Verlangt Ducky Luck eine Identitätsprüfung?|Hat Ducky Luck eine US-Lizenz?'
  ],
  es: [
    'Reseña de Ducky Luck 2026: bonos, juegos y retiros',
    'Ducky Luck ofrece tragamonedas, video póquer, juegos crash y una sala en vivo de Fresh Deck. Los dos paquetes de bienvenida cubren tres depósitos válidos con distintos requisitos de apuesta. Los métodos y límites de retiro dependen de la cuenta y la ubicación.',
    '500 % en cada uno de los tres primeros depósitos válidos: hasta 2.500 USD por depósito y 7.500 USD en total. Hay que apostar 30 veces el depósito más el bono.',
    '600 % en cada uno de los tres primeros depósitos válidos en criptomonedas: hasta 3.000 USD por depósito y 9.000 USD en total. Hay que apostar 40 veces el depósito más el bono.',
    'Las promociones indican 150 giros tras el primer depósito, en tandas de 50 durante tres días. Los giros caducan al finalizar cada día. Si aceptas un bono de depósito, la ayuda indica que debes completarlo antes. Las ganancias de los giros se apuestan 30 veces y tienen un tope de retiro de 100 USD.',
    'Cada depósito bonificado debe ser de 25 a 500 USD. No cuentan los juegos con crupier en vivo, los dados craps ni los premios progresivos. En ambos bonos el retiro promocional está limitado a diez veces el depósito correspondiente.',
    'El catálogo también incluye juegos de mesa, tragamonedas con premios acumulados y Ducky Luck Originals. Fresh Deck ofrece blackjack, póquer y ruleta en vivo en su propia sala. No hay apuestas deportivas.',
    'DuckyBucks da un punto de nivel por cada 20 USD depositados y exige un depósito mensual para conservar el nivel. Los puntos canjeables se obtienen con apuestas de dinero real sin bono. La devolución diaria del 3 % en depósitos cripto se abona al día siguiente.',
    'La página pública de pagos indica depósitos cripto desde 25 USD, incluidos BTC, ETH, LTC, USDT, BCH y BNB. Para Estados Unidos lista Visa y Mastercard de 25 a 1.000 USD y American Express de 25 a 750 USD. La disponibilidad depende de la cuenta.',
    'El primer retiro requiere verificar la identidad. El casino puede pedir un documento oficial, una selfi con el documento y una prueba de domicilio o de titularidad del medio de pago. Las reglas generales exigen apostar una vez el depósito antes de retirarlo, salvo indicación contraria.',
    'La reseña cubre Estados Unidos. Las reglas de admisión del casino no acreditan acceso legal en ningún estado. El sitio muestra un sello de Costa Rica, pero no pudimos verificar una licencia estatal de EE. UU. para el dominio.',
    'El equipo de asistencia atiende por chat y correo electrónico y acepta solicitudes de autoexclusión.',
    'Tras seis meses sin iniciar sesión, las condiciones prevén un cargo mensual: el equivalente a 100 € o el 5 % del saldo, el que sea mayor.',
    'Revisado el|Bono estándar|Bono cripto|Giros de bienvenida|Método|Retiro mínimo|Plazo publicado|días hábiles|Límite semanal|Ventajas|Desventajas|Ejemplos de juegos|Estados Unidos',
    '¿Qué bonos de bienvenida ofrece Ducky Luck?|¿Cuánto tardan los retiros de Ducky Luck?|¿Ducky Luck exige verificar la identidad?|¿Tiene Ducky Luck licencia en Estados Unidos?'
  ],
  it: [
    'Recensione Ducky Luck 2026: bonus, giochi e prelievi',
    'Ducky Luck offre slot, video poker, giochi crash e una lobby dal vivo di Fresh Deck. Entrambi i pacchetti di benvenuto coprono tre depositi idonei, con requisiti di puntata diversi. Metodi e limiti di prelievo dipendono dal conto e dal luogo.',
    '500% su ciascuno dei primi tre depositi idonei, fino a 2.500 USD per deposito e 7.500 USD in totale. Occorre puntare 30 volte la somma di deposito e bonus.',
    '600% su ciascuno dei primi tre depositi idonei in criptovaluta, fino a 3.000 USD per deposito e 9.000 USD in totale. Occorre puntare 40 volte la somma di deposito e bonus.',
    'Le promozioni indicano 150 giri dopo il primo deposito: 50 al giorno per tre giorni. I giri non usati scadono ogni giorno. Secondo l’assistenza, se si accetta il bonus sul deposito bisogna completarlo prima. Le vincite dei giri vanno puntate 30 volte e il prelievo è limitato a 100 USD.',
    'Per entrambi i bonus il deposito idoneo va da 25 a 500 USD. Sono esclusi i giochi con croupier dal vivo, i craps e i jackpot progressivi. Il prelievo promozionale non può superare dieci volte il deposito corrispondente.',
    'Il casinò include giochi da tavolo, slot con jackpot e Ducky Luck Originals. Fresh Deck offre blackjack, poker e roulette dal vivo in una lobby separata. Non ci sono scommesse sportive.',
    'DuckyBucks assegna un punto di livello ogni 20 USD depositati e richiede un deposito al mese per mantenere il livello. I punti fedeltà separati maturano con puntate in denaro reale senza bonus. Il rimborso del 3% sui depositi in criptovaluta arriva il giorno seguente.',
    'La pagina dei pagamenti indica depositi in criptovaluta da 25 USD, tra cui BTC, ETH, LTC, USDT, BCH e BNB. Per le carte statunitensi indica 25–1.000 USD con Visa e Mastercard e 25–750 USD con American Express. La disponibilità dipende dal conto.',
    'Per il primo prelievo serve la verifica dell’identità. Il casinò può richiedere un documento, un selfie con il documento e una prova di residenza o di titolarità del mezzo di pagamento. Di norma il deposito va puntato una volta prima del prelievo.',
    'Questa recensione riguarda gli Stati Uniti. Le condizioni di accesso del casinò non dimostrano che il gioco sia legale in un determinato stato. Il sito mostra un marchio del Costa Rica, ma non abbiamo verificato una licenza statale statunitense per il dominio.',
    'L’assistenza risponde via chat ed e-mail e accetta richieste di autoesclusione.',
    'Dopo sei mesi senza accessi le condizioni prevedono un addebito mensile pari al maggiore tra l’equivalente di 100 € e il 5% del saldo.',
    'Verificato il|Bonus standard|Bonus in criptovaluta|Giri di benvenuto|Metodo|Prelievo minimo|Tempi pubblicati|giorni lavorativi|Limite settimanale|Pro|Contro|Esempi di giochi|Stati Uniti',
    'Quali sono i bonus di benvenuto di Ducky Luck?|Quanto richiedono i prelievi di Ducky Luck?|Ducky Luck richiede la verifica dell’identità?|Ducky Luck ha una licenza negli Stati Uniti?'
  ],
  pl: [
    'Recenzja Ducky Luck 2026: bonusy, gry i wypłaty',
    'Ducky Luck oferuje automaty, wideopokera, gry crash i osobne kasyno na żywo Fresh Deck. Oba pakiety powitalne obejmują trzy kwalifikujące się wpłaty, lecz mają różne wymagania obrotu. Metody i limity wypłat zależą od konta i lokalizacji.',
    '500% od każdej z pierwszych trzech kwalifikujących się wpłat: do 2 500 USD na wpłatę i 7 500 USD łącznie. Sumę wpłaty i bonusu trzeba obrócić 30 razy.',
    '600% od każdej z pierwszych trzech kwalifikujących się wpłat w kryptowalucie: do 3 000 USD na wpłatę i 9 000 USD łącznie. Sumę wpłaty i bonusu trzeba obrócić 40 razy.',
    'Promocje podają 150 spinów po pierwszej wpłacie, po 50 dziennie przez trzy dni. Niewykorzystane spiny wygasają każdego dnia. Jeśli wybierzesz bonus od wpłaty, według pomocy najpierw musisz spełnić jego warunki. Wygrane ze spinów wymagają obrotu 30×, a limit wypłaty wynosi 100 USD.',
    'Wpłata do obu bonusów musi wynosić od 25 do 500 USD. Gry z krupierem na żywo, craps i progresywne jackpoty są wyłączone. Wypłata z każdego bonusu jest ograniczona do dziesięciokrotności danej wpłaty.',
    'W kasynie są także gry stołowe, automaty z jackpotami i Ducky Luck Originals. Fresh Deck udostępnia blackjacka, pokera i ruletkę na żywo w osobnym lobby. Nie ma zakładów sportowych.',
    'DuckyBucks przyznaje punkt poziomu za każde 20 USD wpłaty i wymaga wpłaty raz w miesiącu, by zachować status. Osobne punkty lojalnościowe nalicza za grę za własne środki bez bonusu. Zwrot 3% wpłat w kryptowalutach trafia na konto następnego dnia.',
    'Publiczna strona płatności podaje wpłaty w kryptowalutach od 25 USD, m.in. BTC, ETH, LTC, USDT, BCH i BNB. W USA dla Visa i Mastercard podaje 25–1 000 USD, a dla American Express 25–750 USD. Dostępność zależy od konta.',
    'Pierwsza wypłata wymaga weryfikacji tożsamości. Kasyno może poprosić o dokument, zdjęcie z dokumentem oraz potwierdzenie adresu lub metody płatności. Ogólne zasady wymagają jednokrotnego obrotu wpłatą, o ile nie określono inaczej.',
    'Recenzja dotyczy USA. Warunki dostępu kasyna nie potwierdzają legalności gry w danym stanie. Witryna pokazuje oznaczenie Kostaryki, ale nie potwierdziliśmy stanowej licencji na gry dla tej domeny.',
    'Pomoc przez czat i e-mail przyjmuje wnioski o samowykluczenie.',
    'Po sześciu miesiącach bez logowania regulamin przewiduje miesięczną opłatę: równowartość 100 € lub 5% salda, zależnie od tego, która kwota jest wyższa.',
    'Sprawdzono|Bonus standardowy|Bonus kryptowalutowy|Spiny powitalne|Metoda|Minimalna wypłata|Podany czas|dni robocze|Limit tygodniowy|Zalety|Wady|Przykładowe gry|Stany Zjednoczone',
    'Jakie bonusy powitalne ma Ducky Luck?|Ile trwają wypłaty z Ducky Luck?|Czy Ducky Luck wymaga weryfikacji tożsamości?|Czy Ducky Luck ma licencję w Stanach Zjednoczonych?'
  ],
  pt: [
    'Análise da Ducky Luck 2026: bónus, jogos e levantamentos',
    'A Ducky Luck tem slots, vídeo póquer, jogos crash e uma sala ao vivo da Fresh Deck. Os dois pacotes de boas-vindas abrangem três depósitos elegíveis, mas têm requisitos de aposta diferentes. Os métodos e limites de levantamento variam por conta e localização.',
    '500% em cada um dos primeiros três depósitos elegíveis, até 2 500 USD por depósito e 7 500 USD no total. É preciso apostar 30 vezes a soma do depósito e do bónus.',
    '600% em cada um dos primeiros três depósitos elegíveis em criptomoeda, até 3 000 USD por depósito e 9 000 USD no total. É preciso apostar 40 vezes a soma do depósito e do bónus.',
    'As páginas das promoções indicam 150 jogadas após o primeiro depósito: 50 por dia durante três dias. As jogadas não utilizadas expiram diariamente. Se aceitar um bónus de depósito, a ajuda indica que deve concluí-lo primeiro. Os ganhos das jogadas exigem 30 vezes o valor em apostas e têm um teto de levantamento de 100 USD.',
    'Os dois bónus exigem depósitos de 25 a 500 USD. Jogos com croupier ao vivo, craps e jackpots progressivos ficam excluídos. O levantamento promocional não pode exceder dez vezes o depósito correspondente.',
    'Há também jogos de mesa, slots com jackpot e Ducky Luck Originals. A Fresh Deck tem blackjack, póquer e roleta ao vivo numa sala separada. Não há apostas desportivas.',
    'O DuckyBucks dá um ponto de nível por cada 20 USD depositados. Para manter o nível, é necessário um depósito mensal. As apostas com dinheiro real sem bónus geram pontos à parte. A devolução diária de 3% sobre depósitos em criptomoeda é creditada no dia seguinte.',
    'A página pública de pagamentos lista depósitos em criptomoeda a partir de 25 USD, incluindo BTC, ETH, LTC, USDT, BCH e BNB. Nos EUA, indica 25–1 000 USD para Visa e Mastercard e 25–750 USD para American Express. A disponibilidade depende da conta.',
    'O primeiro levantamento exige verificação de identidade. O casino pode pedir um documento, uma selfie com o documento e um comprovativo de morada ou de titularidade do meio de pagamento. Salvo indicação em contrário, o valor depositado tem de ser apostado uma vez antes do levantamento.',
    'A análise abrange os Estados Unidos. As condições do casino não comprovam o acesso legal num estado específico. O site mostra um selo da Costa Rica, mas não confirmámos uma licença estadual dos EUA para o domínio.',
    'O apoio aceita pedidos de autoexclusão por chat e e-mail.',
    'Após seis meses sem iniciar sessão, as condições preveem uma comissão mensal: o equivalente a 100 € ou 5% do saldo, consoante o valor mais elevado.',
    'Revisto em|Bónus padrão|Bónus em criptomoeda|Jogadas de boas-vindas|Método|Levantamento mínimo|Prazo publicado|dias úteis|Limite semanal|Prós|Contras|Exemplos de jogos|Estados Unidos',
    'Que bónus de boas-vindas oferece a Ducky Luck?|Quanto demoram os levantamentos na Ducky Luck?|A Ducky Luck exige verificação de identidade?|A Ducky Luck tem licença nos Estados Unidos?'
  ],
  fr: [
    'Avis Ducky Luck 2026 : bonus, jeux et retraits',
    'Ducky Luck propose des machines à sous, du vidéo poker, des jeux crash et un espace en direct Fresh Deck. Les deux offres de bienvenue couvrent trois dépôts éligibles, avec des exigences de mise différentes. Les moyens et plafonds de retrait varient selon le compte et le lieu de résidence.',
    '500 % sur chacun des trois premiers dépôts éligibles, jusqu’à 2 500 USD par dépôt et 7 500 USD au total. Il faut miser 30 fois le montant cumulé du dépôt et du bonus.',
    '600 % sur chacun des trois premiers dépôts éligibles en cryptomonnaie, jusqu’à 3 000 USD par dépôt et 9 000 USD au total. Il faut miser 40 fois le montant cumulé du dépôt et du bonus.',
    'Les offres annoncent 150 tours après le premier dépôt, à raison de 50 par jour pendant trois jours. Les tours non utilisés expirent chaque jour. Si vous prenez un bonus de dépôt, l’aide indique qu’il faut d’abord en remplir les conditions. Les gains des tours sont à miser 30 fois, avec un retrait plafonné à 100 USD.',
    'Chaque dépôt éligible doit être compris entre 25 et 500 USD. Les jeux avec croupier en direct, le craps et les jackpots progressifs sont exclus. Pour chaque bonus, le retrait promotionnel est limité à dix fois le dépôt correspondant.',
    'Le catalogue comprend des jeux de table, des machines à jackpot et Ducky Luck Originals. Fresh Deck propose du blackjack, du poker et de la roulette en direct dans un espace séparé. Il n’y a pas de paris sportifs.',
    'DuckyBucks attribue un point de niveau par tranche de 20 USD déposés et exige un dépôt mensuel pour conserver son statut. Les mises en argent réel hors bonus donnent des points distincts. La remise de 3 % sur les dépôts en cryptomonnaie est créditée le lendemain.',
    'La page des paiements indique des dépôts en cryptomonnaie à partir de 25 USD, dont BTC, ETH, LTC, USDT, BCH et BNB. Aux États-Unis, elle affiche 25 à 1 000 USD pour Visa et Mastercard et 25 à 750 USD pour American Express. La disponibilité dépend du compte.',
    'Une vérification d’identité est nécessaire au premier retrait. Le casino peut demander une pièce d’identité, un selfie avec le document et un justificatif de domicile ou de propriété du moyen de paiement. Sauf exception, il faut miser une fois le montant du dépôt avant de le retirer.',
    'Cet avis couvre les États-Unis. Les conditions d’accès du casino ne prouvent pas que le jeu est légal dans un État donné. Le site affiche un macaron du Costa Rica, mais nous n’avons pas pu vérifier de licence délivrée par un État américain pour ce domaine.',
    'L’assistance reçoit les demandes d’auto-exclusion par chat et e-mail.',
    'Après six mois sans connexion, les conditions prévoient des frais mensuels correspondant au montant le plus élevé entre l’équivalent de 100 € et 5 % du solde.',
    'Vérifié le|Bonus standard|Bonus crypto|Tours de bienvenue|Moyen|Retrait minimal|Délai annoncé|jours ouvrés|Plafond hebdomadaire|Avantages|Inconvénients|Exemples de jeux|États-Unis',
    'Quels bonus de bienvenue propose Ducky Luck ?|Quels sont les délais de retrait chez Ducky Luck ?|Ducky Luck vérifie-t-il l’identité ?|Ducky Luck possède-t-il une licence aux États-Unis ?'
  ],
  hi: [
    'Ducky Luck समीक्षा 2026: बोनस, गेम और निकासी',
    'Ducky Luck में स्लॉट, वीडियो पोकर, क्रैश गेम और अलग Fresh Deck लाइव लॉबी है। दोनों वेलकम पैकेज तीन योग्य जमाओं पर मिलते हैं, लेकिन दाँव की शर्तें अलग हैं। निकासी के तरीके और सीमाएँ खाते और स्थान पर निर्भर हैं।',
    'पहले तीन योग्य जमाओं में से हर एक पर 500%: प्रति जमा 2,500 USD और कुल 7,500 USD तक। जमा और बोनस की कुल राशि 30 बार दाँव पर लगानी होती है।',
    'पहले तीन योग्य क्रिप्टो जमाओं में से हर एक पर 600%: प्रति जमा 3,000 USD और कुल 9,000 USD तक। जमा और बोनस की कुल राशि 40 बार दाँव पर लगानी होती है।',
    'ऑफ़र के पेज पहले जमा के बाद 150 मुफ़्त स्पिन बताते हैं: तीन दिन तक हर दिन 50। बचे स्पिन उसी दिन समाप्त होते हैं। जमा बोनस लेने पर सहायता पेज के अनुसार उसकी शर्तें पहले पूरी करनी होती हैं। स्पिन की जीत 30 बार दाँव पर लगानी होती है और निकासी की सीमा 100 USD है।',
    'दोनों ऑफ़र में योग्य जमा 25 से 500 USD तक है। लाइव डीलर गेम, क्रैप्स और प्रोग्रेसिव जैकपॉट शामिल नहीं हैं। हर बोनस में निकासी की सीमा संबंधित जमा की दस गुना है।',
    'कैसीनो में टेबल गेम, जैकपॉट स्लॉट और Ducky Luck Originals भी हैं। Fresh Deck की अलग लॉबी में लाइव ब्लैकजैक, पोकर और रूलेट हैं। खेलों पर सट्टेबाज़ी का सेक्शन नहीं है।',
    'DuckyBucks हर 20 USD जमा पर एक लेवल पॉइंट देता है। स्तर बनाए रखने के लिए हर महीने जमा करना होता है। बिना बोनस के असली पैसे की बाज़ी पर अलग पॉइंट मिलते हैं। क्रिप्टो जमा पर 3% की दैनिक वापसी अगले दिन खाते में जुड़ती है।',
    'सार्वजनिक भुगतान पेज के अनुसार BTC, ETH, LTC, USDT, BCH और BNB समेत क्रिप्टो जमा 25 USD से शुरू होते हैं। अमेरिका के लिए Visa और Mastercard की सीमा 25–1,000 USD और American Express की 25–750 USD है। उपलब्धता खाते पर निर्भर है।',
    'पहली निकासी के लिए पहचान की जाँच ज़रूरी है। कैसीनो सरकारी पहचानपत्र, उसके साथ सेल्फ़ी और पते या भुगतान के स्वामित्व का प्रमाण माँग सकता है। अलग शर्त न होने पर निकासी से पहले जमा राशि एक बार दाँव पर लगानी होती है।',
    'यह समीक्षा अमेरिका के लिए है। कैसीनो की पात्रता शर्तें किसी राज्य में कानूनी पहुँच की पुष्टि नहीं करतीं। साइट पर कोस्टा रिका का बैज है, लेकिन इस डोमेन के लिए किसी अमेरिकी राज्य के लाइसेंस की पुष्टि नहीं हुई।',
    'चैट और ईमेल पर सहायता उपलब्ध है और वहीं स्व-बहिष्करण का अनुरोध दिया जा सकता है।',
    'छह महीने लॉग इन न करने पर नियम मासिक शुल्क बताते हैं: 100 € के बराबर राशि या शेष का 5%, जो भी अधिक हो।',
    'जाँच की तारीख|स्टैंडर्ड बोनस|क्रिप्टो बोनस|वेलकम स्पिन|तरीका|न्यूनतम निकासी|बताया गया समय|कामकाजी दिन|साप्ताहिक सीमा|फायदे|नुकसान|गेम के उदाहरण|अमेरिका',
    'Ducky Luck के वेलकम बोनस क्या हैं?|Ducky Luck में निकासी में कितना समय लगता है?|क्या Ducky Luck में पहचान की जाँच होती है?|क्या Ducky Luck को अमेरिका में लाइसेंस मिला है?'
  ],
  fi: [
    'Ducky Luck -arvostelu 2026: bonukset, pelit ja kotiutukset',
    'Ducky Luck tarjoaa kolikkopelejä, videopokeria, crash-pelejä ja erillisen Fresh Deck -livekasinon. Molemmat tervetuliaistarjoukset koskevat kolmea ehdot täyttävää talletusta, mutta kierrätysvaatimukset eroavat toisistaan. Kotiutustavat ja rajat riippuvat tilistä ja sijainnista.',
    '500 % kolmesta ensimmäisestä ehdot täyttävästä talletuksesta, enintään 2 500 USD talletusta kohden ja 7 500 USD yhteensä. Talletus ja bonus kierrätetään yhdessä 30 kertaa.',
    '600 % kolmesta ensimmäisestä ehdot täyttävästä kryptotalletuksesta, enintään 3 000 USD talletusta kohden ja 9 000 USD yhteensä. Talletus ja bonus kierrätetään yhdessä 40 kertaa.',
    'Tarjoussivut ilmoittavat 150 ilmaiskierrosta ensimmäisen talletuksen jälkeen, 50 päivässä kolmen päivän ajan. Käyttämättömät kierrokset vanhenevat päivittäin. Ohjeiden mukaan valittu talletusbonus on käytettävä ensin. Kierrosvoitot on kierrätettävä 30 kertaa, ja kotiutusraja on 100 USD.',
    'Kummassakin tarjouksessa talletusraja on 25–500 USD. Livepelit, craps ja progressiiviset jackpotit on rajattu pois. Kummastakin bonuksesta voi kotiuttaa enintään kymmenkertaisen summan kyseiseen talletukseen nähden.',
    'Kasinolla on myös pöytäpelejä, jackpot-kolikkopelejä ja Ducky Luck Originals -pelejä. Fresh Deck tarjoaa liveblackjackia, -pokeria ja -rulettia erillisessä peliaulassa. Urheiluvedonlyöntiä ei ole.',
    'DuckyBucks antaa tasopisteen jokaista talletettua 20 USD:tä kohti. Taso säilyy kuukausittaisella talletuksella. Erillisiä pisteitä kertyy oikean rahan panoksista ilman bonusta. Kryptotalletuksista laskettava 3 %:n palautus maksetaan seuraavana päivänä.',
    'Maksusivun mukaan kryptotalletukset alkavat 25 dollarista. Valikoimaan kuuluvat BTC, ETH, LTC, USDT, BCH ja BNB. Yhdysvalloissa Visa- ja Mastercard-talletuksille ilmoitetaan 25–1 000 USD ja American Expressille 25–750 USD. Saatavuus riippuu tilistä.',
    'Ensimmäinen kotiutus edellyttää henkilöllisyyden vahvistamista. Kasino voi pyytää henkilötodistusta, selfietä sen kanssa ja todistetta osoitteesta tai maksutavan omistajuudesta. Ellei toisin ilmoiteta, talletus on pelattava kerran ennen kotiutusta.',
    'Arvostelu koskee Yhdysvaltoja. Kasinon omat ehdot eivät osoita, että pelaaminen olisi laillista tietyssä osavaltiossa. Sivustolla on Costa Rica -merkki, mutta emme voineet vahvistaa yhdysvaltalaista osavaltiolupaa tälle verkkotunnukselle.',
    'Asiakastuki vastaanottaa pelikiellon pyyntöjä chatissa ja sähköpostitse.',
    'Kuuden kuukauden kirjautumattomuuden jälkeen ehdoissa määrätään kuukausimaksu: 100 euroa vastaava summa tai 5 % saldosta sen mukaan, kumpi on suurempi.',
    'Tarkistettu|Tavallinen bonus|Kryptobonus|Tervetuliaiskierrokset|Maksutapa|Pienin kotiutus|Ilmoitettu käsittelyaika|arkipäivää|Viikkoraja|Plussat|Miinukset|Peliesimerkkejä|Yhdysvallat',
    'Mitä tervetuliaisbonuksia Ducky Luck tarjoaa?|Kuinka kauan Ducky Luckin kotiutus kestää?|Vaatiiko Ducky Luck henkilöllisyyden vahvistamista?|Onko Ducky Luckilla pelilupa Yhdysvalloissa?'
  ],
};

export const duckyluckCopy = Object.fromEntries(Object.entries(rows).map(([lang, values]) => {
  if (values.length !== fields.length) throw new Error('Incomplete Ducky Luck review: ' + lang);
  return [lang, Object.fromEntries(fields.map((field, i) => [field, values[i]]))];
}));

// Shared review sections: account rules, suitability cards, and two FAQ prompts.
const sectionFields = ['identityHeading', 'accountRule', 'considerHeading', 'forWho', 'checkFirst', 'spinsQuestion', 'rewardsQuestion'];
const sectionRows = {
  en: [
    'Identity verification', 'The terms allow one account per household. If another household member wants to register, the casino asks them to contact support first.',
    'Before registering', 'The catalog is relevant to readers comparing slots, video poker, and Fresh Deck live tables. It does not include sports betting.',
    'Check legal eligibility in your state, the withdrawal fee for your method, and the wagering rules of the offer you are considering. The headline bonus amount is not a withdrawal limit.',
    'How are the welcome free spins released?', 'How does DuckyBucks work?',
  ],
  uk: [
    'Перевірка особи', 'За правилами дозволено один акаунт на домогосподарство. Якщо інший член домогосподарства хоче зареєструватися, казино просить спершу звернутися до підтримки.',
    'Що перевірити перед реєстрацією', 'Каталог стане в пригоді тим, хто порівнює слоти, відеопокер та ігри з дилерами Fresh Deck. Ставок на спорт немає.',
    'Перевірте, чи дозволена гра у вашому штаті, яка комісія за вибраний спосіб виплати та які умови відіграшу діють для бонусу. Сума бонусу й ліміт виплати — різні речі.',
    'Як нараховують вітальні фріспіни?', 'Як працює програма DuckyBucks?',
  ],
  de: [
    'Identitätsprüfung', 'Die Bedingungen erlauben ein Konto pro Haushalt. Möchte sich ein weiteres Haushaltsmitglied registrieren, soll es vorher den Support kontaktieren.',
    'Vor der Anmeldung prüfen', 'Der Katalog eignet sich zum Vergleich von Slots, Videopoker und Live-Tischen von Fresh Deck. Sportwetten gehören nicht zum Angebot.',
    'Prüfen Sie den rechtmäßigen Zugang in Ihrem Bundesstaat, die Gebühr Ihrer Auszahlungsmethode und die Umsatzbedingungen des Angebots. Der Bonusbetrag ist nicht das Auszahlungslimit.',
    'Wie werden die Willkommensfreispiele gutgeschrieben?', 'Wie funktioniert DuckyBucks?',
  ],
  es: [
    'Verificación de identidad', 'Las condiciones permiten una cuenta por hogar. Si otra persona del hogar quiere registrarse, el casino le pide que contacte antes con el equipo de asistencia.',
    'Antes de registrarte', 'El catálogo sirve para comparar tragamonedas, video póquer y mesas en vivo de Fresh Deck. No incluye apuestas deportivas.',
    'Comprueba si puedes jugar legalmente en tu estado, la comisión de tu método de retiro y los requisitos de apuesta del bono. El importe del bono no es el tope de retiro.',
    '¿Cómo se acreditan los giros gratis de bienvenida?', '¿Cómo funciona DuckyBucks?',
  ],
  it: [
    'Verifica dell’identità', 'Le condizioni consentono un conto per nucleo familiare. Se un’altra persona dello stesso nucleo vuole registrarsi, il casinò chiede di contattare prima l’assistenza.',
    'Cosa controllare prima di registrarsi', 'Il catalogo serve a chi confronta slot, video poker e tavoli dal vivo di Fresh Deck. Non include scommesse sportive.',
    'Verifica se il gioco è consentito nel tuo stato, la commissione del metodo di prelievo e i requisiti di puntata del bonus. L’importo del bonus non coincide con il limite di prelievo.',
    'Come vengono accreditati i giri gratis di benvenuto?', 'Come funziona DuckyBucks?',
  ],
  pl: [
    'Weryfikacja tożsamości', 'Regulamin pozwala na jedno konto w gospodarstwie domowym. Inny domownik, który chce się zarejestrować, powinien najpierw skontaktować się z obsługą kasyna.',
    'Co sprawdzić przed rejestracją', 'Katalog przydaje się do porównania automatów, wideopokera i stołów na żywo Fresh Deck. Nie ma w nim zakładów sportowych.',
    'Sprawdź, czy gra jest legalna w Twoim stanie, ile kosztuje wybrana metoda wypłaty i jakie są wymagania obrotu. Kwota bonusu nie jest limitem wypłaty.',
    'Jak naliczane są darmowe spiny powitalne?', 'Jak działa program DuckyBucks?',
  ],
  pt: [
    'Verificação de identidade', 'As condições permitem uma conta por agregado familiar. Se outra pessoa do agregado quiser registar-se, o casino pede que contacte primeiro o apoio.',
    'O que verificar antes do registo', 'O catálogo permite comparar slots, vídeo póquer e mesas ao vivo da Fresh Deck. Não inclui apostas desportivas.',
    'Verifique se pode jogar legalmente no seu estado, a comissão do método de levantamento e os requisitos de aposta do bónus. O valor do bónus não é o limite de levantamento.',
    'Como são atribuídas as jogadas grátis de boas-vindas?', 'Como funciona o programa DuckyBucks?',
  ],
  fr: [
    'Vérification d’identité', 'Les conditions prévoient un compte par foyer. Si une autre personne du foyer souhaite s’inscrire, le casino lui demande de contacter d’abord l’assistance.',
    'À vérifier avant l’inscription', 'Le catalogue permet de comparer les machines à sous, le vidéo poker et les tables en direct de Fresh Deck. Il ne comprend pas de paris sportifs.',
    'Vérifiez si vous pouvez jouer légalement dans votre État, les frais du moyen de retrait et les exigences de mise du bonus. Le montant du bonus n’est pas le plafond de retrait.',
    'Comment les tours gratuits de bienvenue sont-ils crédités ?', 'Comment fonctionne DuckyBucks ?',
  ],
  hi: [
    'पहचान की जाँच', 'नियमों के अनुसार एक घर में एक खाता हो सकता है। अगर घर का कोई और सदस्य खाता बनाना चाहता है, तो कैसीनो पहले सहायता टीम से संपर्क करने को कहता है।',
    'रजिस्ट्रेशन से पहले क्या जाँचें', 'यह कैटलॉग स्लॉट, वीडियो पोकर और Fresh Deck की लाइव टेबल की तुलना के काम आता है। इसमें खेलों पर सट्टेबाज़ी नहीं है।',
    'देखें कि आपके राज्य में खेलना कानूनी है या नहीं, निकासी की फ़ीस क्या है और बोनस की दाँव शर्तें क्या हैं। बोनस की राशि निकासी की सीमा नहीं है।',
    'वेलकम के मुफ़्त स्पिन कैसे मिलते हैं?', 'DuckyBucks कैसे काम करता है?',
  ],
  fi: [
    'Henkilöllisyyden vahvistaminen', 'Ehdot sallivat yhden tilin kotitaloutta kohti. Jos toinen saman kotitalouden jäsen haluaa rekisteröityä, kasino pyytää ottamaan ensin yhteyttä asiakastukeen.',
    'Tarkista ennen rekisteröitymistä', 'Pelivalikoimassa voi vertailla kolikkopelejä, videopokeria ja Fresh Deckin livepöytiä. Urheiluvedonlyöntiä ei ole.',
    'Tarkista, onko pelaaminen sallittua osavaltiossasi, mitä kotiutus maksaa ja mitä kierrätysehtoja bonukseen sovelletaan. Bonuksen määrä ei ole kotiutusraja.',
    'Miten tervetuliaistarjouksen ilmaiskierrokset hyvitetään?', 'Miten DuckyBucks toimii?',
  ],
};

export const duckyluckSections = Object.fromEntries(Object.entries(sectionRows).map(([lang, values]) => {
  if (values.length !== sectionFields.length) throw new Error('Incomplete Ducky Luck sections: ' + lang);
  return [lang, Object.fromEntries(sectionFields.map((field, i) => [field, values[i]]))];
}));

// Table headings and row labels for the standard licensing and protection tab.
export const duckyluckTrustLabels = {
  en: ['Topic', 'Details', 'Licensing', 'Account rules', 'Support and self-exclusion', 'Inactivity fee'],
  de: ['Thema', 'Details', 'Lizenz', 'Kontoregeln', 'Support und Selbstausschluss', 'Inaktivitätsgebühr'],
  es: ['Tema', 'Detalles', 'Licencia', 'Reglas de la cuenta', 'Asistencia y autoexclusión', 'Cargo por inactividad'],
  it: ['Voce', 'Dettagli', 'Licenza', 'Regole del conto', 'Assistenza e autoesclusione', 'Addebito per inattività'],
  pl: ['Temat', 'Szczegóły', 'Licencja', 'Zasady konta', 'Obsługa i samowykluczenie', 'Opłata za brak aktywności'],
  uk: ['Тема', 'Деталі', 'Ліцензія', 'Правила акаунта', 'Підтримка й самовиключення', 'Плата за неактивність'],
  pt: ['Tema', 'Detalhes', 'Licença', 'Regras da conta', 'Apoio e autoexclusão', 'Comissão por inatividade'],
  fr: ['Sujet', 'Détails', 'Licence', 'Règles du compte', 'Assistance et auto-exclusion', 'Frais d’inactivité'],
  hi: ['विषय', 'जानकारी', 'लाइसेंस', 'खाते के नियम', 'सहायता और स्व-बहिष्करण', 'निष्क्रियता शुल्क'],
  fi: ['Aihe', 'Tiedot', 'Pelilupa', 'Tilin säännöt', 'Asiakastuki ja pelikielto', 'Passiivisuusmaksu'],
};

export const duckyluckHeadlines = {
  en: '3 × 500% up to $7,500 total + 150 Free Spins',
  de: '3 × 500 % bis insgesamt 7.500 USD + 150 Freispiele',
  es: '3 × 500 % hasta 7.500 USD en total + 150 giros gratis',
  it: '3 × 500% fino a 7.500 USD totali + 150 giri gratis',
  pl: '3 × 500% do 7 500 USD łącznie + 150 darmowych spinów',
  uk: '3 × 500% до 7 500 $ загалом + 150 фріспінів',
  pt: '3 × 500% até 7 500 USD no total + 150 jogadas grátis',
  fr: '3 × 500 % jusqu’à 7 500 USD au total + 150 tours gratuits',
  hi: '3 × 500%: कुल 7,500 USD तक + 150 मुफ़्त स्पिन',
  fi: '3 × 500 % yhteensä enintään 7 500 USD + 150 ilmaiskierrosta',
};
