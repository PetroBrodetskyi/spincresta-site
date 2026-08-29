import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const markets = [
  { code: 'DZ', currency: 'DZD', max: '15,000', min: '170', payments: ['Binance Pay: 262.18–2,621,746.53 DZD'] },
  { code: 'BD', currency: 'BDT', max: '14,000', min: '80', payments: ['bKash / Nagad: 400–25,000 BDT', 'bKash Agent / Nagad Agent / Rocket Agent / bKash Merchant Agent: 300–5,000 BDT'] },
  { code: 'BJ', currency: 'XOF', max: '65,000', min: '2,000', payments: ['Moov: 500–300,000 XOF', 'MTN Agent / Celtiis Agent: 300–30,000 XOF'] },
  { code: 'BF', currency: 'XOF', max: '65,000', min: '2,000', payments: ['Orange / Moov / Wave: 500–300,000 XOF', 'Moov Agent: 200–12,000 XOF'] },
  { code: 'CM', currency: 'XAF', max: '65,000', min: '2,000', payments: ['MTN / Orange: 500–500,000 XAF', 'MTN Agent / Orange Agent: 500–30,000 XAF'] },
  { code: 'CD', currency: 'CDF', max: '341,000', min: '900', payments: ['MTN: 500–2,000,000 CDF', 'M-Pesa / Airtel / Orange: 2,000–1,500,000 CDF'] },
  { code: 'EG', currency: 'EGP', max: '6,000', min: '200', payments: ['Mobile Wallets Egypt: 350–15,000 EGP', 'Vodafone / Orange / Instapay / Etisalat agents: 20–5,000 EGP'] },
  { code: 'ET', currency: 'ETB', max: '16,000', min: '30', payments: ['Telebirr: 100–15,000 ETB', 'E-birr / CBE Birr / CBE Bank / Telebirr / M-Pesa agents: 50–3,000 ETB'] },
  { code: 'GH', currency: 'GHS', max: '1,000', min: '10', payments: ['MTN / Telecel / Airtel: 10–30,000 GHS'] },
  { code: 'CI', currency: 'XOF', max: '65,000', min: '2,000', payments: ['MTN: 500–550,000 XOF', 'Orange / Wave / MTN agents: 300–30,000 XOF'] },
  { code: 'JO', currency: 'JOD', max: '81.34', min: '4.07', payments: ['Orange Agent: 1–35 JOD'] },
  { code: 'KE', currency: 'KES', max: '15,118', min: '756', payments: ['M-Pesa: 10–100,000 KES', 'Airtel: 100–150,000 KES'] },
  { code: 'MA', currency: 'MAD', max: '1,000', min: '50', payments: ['Attijari Agent / CIH Agent: 20–800 MAD'] },
  { code: 'NG', currency: 'NGN', max: '179,000', min: '8,000', payments: ['OPay: 500–500,000 NGN', 'Bank transfer: 500–1,000,000 NGN', 'Visa / Mastercard / Verve / PalmPay: 500–2,000,000 NGN'] },
  { code: 'RU', currency: 'RUB', max: '10,000', min: '300', payments: ['Sber: 1,000–50,000 RUB', 'T-Bank: 1,000–1,000,000 RUB', 'VTB: 1,000–300,000 RUB', 'Piastrix: 300–100,000 RUB'] },
  { code: 'SN', currency: 'XOF', max: '65,000', min: '2,000', payments: ['Orange: 500–1,500,000 XOF', 'Wave Agent: 500–30,000 XOF'] },
  { code: 'SO', currency: 'SOS', max: '67,000', min: '1,500', payments: ['MoneyGo: 700–4,500,000 SOS'] },
  { code: 'LK', currency: 'LKR', max: null, min: null, payments: ['iPay Agent / Sampath Vishwa Agent / Bank Transfer Agent: 500–30,000 LKR'] },
  { code: 'TZ', currency: 'TZS', max: '303,000', min: '2,000', payments: ['Vodacom / Airtel / Tigo / HaloPesa: 1,500–5,000,000 TZS'] },
  { code: 'TG', currency: 'XOF', max: '65,000', min: '2,000', payments: ['Moov / TMoney: 500–500,000 XOF'] },
  { code: 'UZ', currency: 'UZS', max: '1,484,000', min: '18,000', payments: ['Humo e-commerce: 5,000–100,000,000 UZS', 'Humo P2P / Uzcard P2P: 20,000–22,000,000 UZS', 'Payme / Click / UZ Telegram Bot: 15,000–22,000,000 UZS', 'Piastrix: 15,000–10,000,000 UZS'] },
  { code: 'ZM', currency: 'ZMW', max: '3,000', min: '100', payments: ['Zamtel / MTN / Airtel: 10–5,000 ZMW'] },
];

const configs = {
  en: {
    intl: 'en',
    title: 'GoldPari Review 2026: Bonuses & Payments by Country',
    description: 'Independent GoldPari review of country-specific bonuses, minimum deposits and local payment methods across 22 markets, plus games, withdrawals and KYC.',
    hero: 'GoldPari combines sports betting, live betting, esports, slots, live casino, GoldGames and Bingo. Bonus values, minimum deposits and cashier methods are configured by country and local currency, so the live offer should be checked for the player’s market.',
    feature2Title: 'Bonuses by Market',
    feature2Body: 'The first-deposit maximum and qualifying minimum differ by country and local currency. Many listed markets include 30 free spins on Reliquary of Ra.',
    feature3Title: 'Local Cashier Options',
    feature3Body: 'The regional cashier includes market-specific mobile wallets, bank routes, cards and payment agents, with method-level deposit limits.',
    regionalTitle: 'Bonuses & Local Payment Methods by Country',
    regionalIntro: 'The current regional configurations cover 22 markets. The table compares the first-deposit offer and the local deposit routes published for each country. Amounts and availability can change by account, so confirm the live promotion and cashier before paying.',
    market: 'Market', offer: 'First-deposit offer', payments: 'Local deposit methods and limits',
    offer: (m) => `100% up to ${m.max} ${m.currency}; minimum deposit ${m.min} ${m.currency}; 30 free spins on Reliquary of Ra`,
    unavailable: 'No bonus amount was listed for this market; check the live promotion.',
    nigeriaCasino: 'Nigeria: Four-Deposit Casino Package & Key Terms',
    nigeriaSports: 'Nigeria: Sports Welcome Bonus',
    faqQuestion: 'Does GoldPari use the same welcome bonus in every country?',
    faqAnswer: 'No. The August 2026 review found country-specific first-deposit values and local cashier methods across 22 regional configurations. Many listed markets offered 100% plus 30 free spins, while maximums and minimum deposits differed by local currency. Nigeria also displayed a separate four-deposit package.',
    faqCasino: 'What casino package was shown for Nigeria?',
    faqSports: 'What sports welcome bonus was shown for Nigeria?',
  },
  de: {
    intl: 'de',
    title: 'GoldPari Test 2026: Boni & Zahlungen nach Land',
    description: 'Unabhängiger GoldPari-Test mit länderspezifischen Boni, Mindesteinzahlungen und lokalen Zahlungsmethoden in 22 Märkten sowie Spielen, Auszahlungen und KYC.',
    hero: 'GoldPari verbindet Sportwetten, Live-Wetten, E-Sport, Slots, Live-Casino, GoldGames und Bingo. Bonushöhen, Mindesteinzahlungen und Kassenmethoden richten sich nach Land und lokaler Währung. Maßgeblich ist daher immer das Live-Angebot für den jeweiligen Markt.',
    feature2Title: 'Boni nach Markt', feature2Body: 'Höchstbetrag und Mindesteinzahlung des ersten Bonus unterscheiden sich je nach Land und Währung. In vielen aufgeführten Märkten sind 30 Freispiele für Reliquary of Ra enthalten.',
    feature3Title: 'Lokale Zahlungswege', feature3Body: 'Die regionale Kasse umfasst je nach Markt mobile Wallets, Bankwege, Karten und Zahlungsagenten mit eigenen Einzahlungslimits.',
    regionalTitle: 'Boni & lokale Zahlungsmethoden nach Land',
    regionalIntro: 'Die aktuellen regionalen Konfigurationen decken 22 Märkte ab. Die Tabelle vergleicht das Ersteinzahlungsangebot und die veröffentlichten lokalen Einzahlungswege. Beträge und Verfügbarkeit können sich je nach Konto ändern; prüfen Sie deshalb vor der Zahlung die Live-Aktion und die Kasse.',
    market: 'Markt', offer: 'Ersteinzahlungsangebot', payments: 'Lokale Einzahlungsmethoden und Limits',
    offer: (m) => `100 % bis ${m.max} ${m.currency}; Mindesteinzahlung ${m.min} ${m.currency}; 30 Freispiele für Reliquary of Ra`, unavailable: 'Für diesen Markt wurde kein Bonusbetrag angegeben; prüfen Sie die Live-Aktion.',
    nigeriaCasino: 'Nigeria: Casino-Paket für vier Einzahlungen & Bedingungen', nigeriaSports: 'Nigeria: Sport-Willkommensbonus',
    faqQuestion: 'Gilt bei GoldPari in jedem Land derselbe Willkommensbonus?', faqAnswer: 'Nein. Im August 2026 fanden wir in 22 regionalen Konfigurationen unterschiedliche Ersteinzahlungsbeträge und lokale Kassenmethoden. Viele aufgeführte Märkte boten 100 % plus 30 Freispiele, während Höchstbetrag und Mindesteinzahlung von der lokalen Währung abhingen. Für Nigeria wurde zusätzlich ein Paket über vier Einzahlungen angezeigt.',
    faqCasino: 'Welches Casino-Paket wurde für Nigeria angezeigt?', faqSports: 'Welcher Sport-Willkommensbonus wurde für Nigeria angezeigt?',
  },
  es: {
    intl: 'es', title: 'Reseña de GoldPari 2026: bonos y pagos por país',
    description: 'Reseña independiente de GoldPari con bonos, depósitos mínimos y métodos de pago locales para 22 mercados, además de juegos, retiros y verificación KYC.',
    hero: 'GoldPari reúne apuestas deportivas y en vivo, esports, tragamonedas, casino en vivo, GoldGames y Bingo. Los importes de los bonos, los depósitos mínimos y los métodos de caja cambian según el país y la moneda local, por lo que conviene comprobar la oferta activa para cada mercado.',
    feature2Title: 'Bonos según el mercado', feature2Body: 'El máximo y el depósito mínimo del bono inicial varían según el país y la moneda. Muchos de los mercados indicados incluyen 30 giros gratis en Reliquary of Ra.',
    feature3Title: 'Métodos de pago locales', feature3Body: 'La caja regional incluye monederos móviles, transferencias bancarias, tarjetas y agentes de pago específicos, cada uno con sus propios límites.',
    regionalTitle: 'Bonos y métodos de pago locales por país', regionalIntro: 'Las configuraciones regionales actuales cubren 22 mercados. La tabla compara la oferta del primer depósito y las vías de ingreso publicadas para cada país. Los importes y la disponibilidad pueden cambiar según la cuenta; comprueba la promoción y la caja activas antes de pagar.',
    market: 'Mercado', offer: 'Oferta del primer depósito', payments: 'Métodos de ingreso locales y límites', offer: (m) => `100 % hasta ${m.max} ${m.currency}; depósito mínimo ${m.min} ${m.currency}; 30 giros gratis en Reliquary of Ra`, unavailable: 'No se indicó un importe de bono para este mercado; comprueba la promoción activa.',
    nigeriaCasino: 'Nigeria: paquete de casino de cuatro depósitos y condiciones', nigeriaSports: 'Nigeria: bono de bienvenida de deportes', faqQuestion: '¿GoldPari ofrece el mismo bono de bienvenida en todos los países?', faqAnswer: 'No. En agosto de 2026 encontramos importes de primer depósito y métodos de caja locales distintos en 22 configuraciones regionales. Muchos mercados ofrecían un 100 % más 30 giros gratis, pero el máximo y el depósito mínimo variaban según la moneda local. Nigeria también mostraba un paquete separado para cuatro depósitos.', faqCasino: '¿Qué paquete de casino se mostraba para Nigeria?', faqSports: '¿Qué bono deportivo de bienvenida se mostraba para Nigeria?',
  },
  fi: {
    intl: 'fi', title: 'GoldPari-arvostelu 2026: bonukset ja maksut maittain',
    description: 'Riippumaton GoldPari-arvostelu: maakohtaiset bonukset, minimitalletukset ja paikalliset maksutavat 22 markkinalla sekä pelit, kotiutukset ja KYC.',
    hero: 'GoldPari yhdistää urheilu- ja live-vedonlyönnin, e-urheilun, kolikkopelit, livekasinon, GoldGames-pelit ja Bingon. Bonussummat, minimitalletukset ja kassavaihtoehdot määräytyvät maan ja paikallisen valuutan mukaan, joten pelaajan kannattaa tarkistaa oman markkinansa voimassa oleva tarjous.',
    feature2Title: 'Bonukset markkinoittain', feature2Body: 'Ensitalletusbonuksen enimmäismäärä ja minimitalletus vaihtelevat maan ja valuutan mukaan. Monilla listatuilla markkinoilla tarjoukseen kuuluu 30 ilmaiskierrosta Reliquary of Ra -peliin.',
    feature3Title: 'Paikalliset maksutavat', feature3Body: 'Aluekohtainen kassa sisältää paikallisia mobiililompakoita, pankkivaihtoehtoja, kortteja ja maksuagentteja omine talletusrajoineen.',
    regionalTitle: 'Bonukset ja paikalliset maksutavat maittain', regionalIntro: 'Nykyiset aluekohtaiset asetukset kattavat 22 markkinaa. Taulukossa verrataan ensitalletustarjousta ja kussakin maassa julkaistuja paikallisia talletustapoja. Summat ja saatavuus voivat muuttua tilikohtaisesti, joten tarkista ajantasainen kampanja ja kassa ennen maksua.',
    market: 'Markkina', offer: 'Ensitalletustarjous', payments: 'Paikalliset talletustavat ja rajat', offer: (m) => `100 % enintään ${m.max} ${m.currency}; minimitalletus ${m.min} ${m.currency}; 30 ilmaiskierrosta Reliquary of Ra -peliin`, unavailable: 'Tälle markkinalle ei ilmoitettu bonussummaa; tarkista ajantasainen kampanja.',
    nigeriaCasino: 'Nigeria: neljän talletuksen kasinopaketti ja ehdot', nigeriaSports: 'Nigeria: vedonlyönnin tervetuliaisbonus', faqQuestion: 'Onko GoldParin tervetuliaisbonus sama kaikissa maissa?', faqAnswer: 'Ei. Elokuun 2026 tarkistuksessa 22 aluekohtaisessa asetuksessa oli erilaisia ensitalletussummia ja paikallisia kassavaihtoehtoja. Monilla markkinoilla tarjous oli 100 % ja 30 ilmaiskierrosta, mutta enimmäismäärä ja minimitalletus vaihtelivat paikallisen valuutan mukaan. Nigeriassa näytettiin lisäksi erillinen neljän talletuksen paketti.', faqCasino: 'Mikä kasinopaketti näytettiin Nigeriassa?', faqSports: 'Mikä vedonlyönnin tervetuliaisbonus näytettiin Nigeriassa?',
  },
  fr: {
    intl: 'fr', title: 'Avis GoldPari 2026 : bonus et paiements par pays',
    description: 'Avis indépendant sur GoldPari : bonus, dépôts minimums et paiements locaux dans 22 marchés, ainsi que jeux, retraits et vérification KYC.',
    hero: 'GoldPari réunit paris sportifs et en direct, esports, machines à sous, casino en direct, GoldGames et Bingo. Les montants des bonus, les dépôts minimums et les moyens de paiement dépendent du pays et de la devise locale : il faut donc vérifier l’offre affichée pour son marché.',
    feature2Title: 'Bonus selon le marché', feature2Body: 'Le plafond et le dépôt minimum du bonus initial varient selon le pays et la devise. De nombreux marchés listés incluent 30 tours gratuits sur Reliquary of Ra.',
    feature3Title: 'Paiements locaux', feature3Body: 'La caisse régionale propose, selon le marché, des portefeuilles mobiles, virements, cartes et agents de paiement avec des limites propres à chaque méthode.',
    regionalTitle: 'Bonus et paiements locaux par pays', regionalIntro: 'Les configurations régionales actuelles couvrent 22 marchés. Le tableau compare l’offre du premier dépôt et les moyens de dépôt publiés pour chaque pays. Les montants et la disponibilité peuvent changer selon le compte ; vérifiez la promotion et la caisse en direct avant de payer.',
    market: 'Marché', offer: 'Offre du premier dépôt', payments: 'Dépôts locaux et limites', offer: (m) => `100 % jusqu’à ${m.max} ${m.currency} ; dépôt minimum ${m.min} ${m.currency} ; 30 tours gratuits sur Reliquary of Ra`, unavailable: 'Aucun montant de bonus n’était indiqué pour ce marché ; vérifiez la promotion en direct.',
    nigeriaCasino: 'Nigeria : forfait casino sur quatre dépôts et conditions', nigeriaSports: 'Nigeria : bonus de bienvenue sportif', faqQuestion: 'GoldPari propose-t-il le même bonus de bienvenue dans tous les pays ?', faqAnswer: 'Non. En août 2026, nous avons relevé des montants de premier dépôt et des moyens de paiement locaux différents dans 22 configurations régionales. De nombreux marchés proposaient 100 % plus 30 tours gratuits, mais le plafond et le dépôt minimum variaient selon la devise. Le Nigeria affichait aussi un forfait distinct sur quatre dépôts.', faqCasino: 'Quel forfait casino était affiché pour le Nigeria ?', faqSports: 'Quel bonus de bienvenue sportif était affiché pour le Nigeria ?',
  },
  hi: {
    intl: 'hi', title: 'GoldPari समीक्षा 2026: देशवार बोनस और भुगतान',
    description: 'GoldPari की स्वतंत्र समीक्षा: 22 बाज़ारों के देश-विशिष्ट बोनस, न्यूनतम जमा और स्थानीय भुगतान विधियाँ, साथ ही गेम, निकासी और KYC।',
    hero: 'GoldPari में स्पोर्ट्स और लाइव बेटिंग, ईस्पोर्ट्स, स्लॉट, लाइव कैसीनो, GoldGames और Bingo उपलब्ध हैं। बोनस राशि, न्यूनतम जमा और भुगतान विकल्प देश तथा स्थानीय मुद्रा के अनुसार बदलते हैं, इसलिए खिलाड़ी को अपने बाज़ार में दिख रही मौजूदा पेशकश अवश्य जाँचनी चाहिए।',
    feature2Title: 'हर बाज़ार के लिए अलग बोनस', feature2Body: 'पहले जमा बोनस की अधिकतम राशि और न्यूनतम जमा देश तथा मुद्रा के अनुसार अलग हैं। सूचीबद्ध कई बाज़ारों में Reliquary of Ra पर 30 फ्री स्पिन शामिल हैं।',
    feature3Title: 'स्थानीय भुगतान विकल्प', feature3Body: 'क्षेत्रीय भुगतान अनुभाग में बाज़ार के अनुसार मोबाइल वॉलेट, बैंक भुगतान, कार्ड और भुगतान एजेंट उपलब्ध हैं, जिनकी जमा सीमाएँ अलग हैं।',
    regionalTitle: 'देशवार बोनस और स्थानीय भुगतान विधियाँ', regionalIntro: 'मौजूदा क्षेत्रीय सेटिंग 22 बाज़ारों को कवर करती हैं। तालिका हर देश के पहले जमा ऑफ़र और प्रकाशित स्थानीय जमा विकल्पों की तुलना करती है। राशि और उपलब्धता खाते के अनुसार बदल सकती है, इसलिए भुगतान से पहले लाइव प्रमोशन और भुगतान अनुभाग जाँचें।',
    market: 'बाज़ार', offer: 'पहले जमा का ऑफ़र', payments: 'स्थानीय जमा विधियाँ और सीमाएँ', offer: (m) => `100% अधिकतम ${m.max} ${m.currency}; न्यूनतम जमा ${m.min} ${m.currency}; Reliquary of Ra पर 30 फ्री स्पिन`, unavailable: 'इस बाज़ार के लिए बोनस राशि सूचीबद्ध नहीं थी; लाइव प्रमोशन जाँचें।',
    nigeriaCasino: 'नाइजीरिया: चार जमा वाला कैसीनो पैकेज और मुख्य शर्तें', nigeriaSports: 'नाइजीरिया: स्पोर्ट्स स्वागत बोनस', faqQuestion: 'क्या GoldPari हर देश में एक ही स्वागत बोनस देता है?', faqAnswer: 'नहीं। अगस्त 2026 की समीक्षा में 22 क्षेत्रीय सेटिंग में पहले जमा की अलग-अलग राशि और स्थानीय भुगतान विधियाँ मिलीं। कई बाज़ारों में 100% के साथ 30 फ्री स्पिन थे, लेकिन अधिकतम राशि और न्यूनतम जमा स्थानीय मुद्रा के अनुसार अलग थे। नाइजीरिया में चार जमा वाला एक अलग पैकेज भी दिखा।', faqCasino: 'नाइजीरिया में कौन-सा कैसीनो पैकेज दिखाया गया था?', faqSports: 'नाइजीरिया में कौन-सा स्पोर्ट्स स्वागत बोनस दिखाया गया था?',
  },
  it: {
    intl: 'it', title: 'Recensione GoldPari 2026: bonus e pagamenti per Paese',
    description: 'Recensione indipendente di GoldPari con bonus, depositi minimi e pagamenti locali in 22 mercati, oltre a giochi, prelievi e verifica KYC.',
    hero: 'GoldPari riunisce scommesse sportive e live, eSport, slot, casinò dal vivo, GoldGames e Bingo. Importi dei bonus, depositi minimi e metodi di cassa dipendono dal Paese e dalla valuta locale: è quindi necessario verificare l’offerta attiva per il proprio mercato.',
    feature2Title: 'Bonus per mercato', feature2Body: 'Il massimale e il deposito minimo del bonus iniziale cambiano in base al Paese e alla valuta. Molti mercati elencati includono 30 giri gratis su Reliquary of Ra.',
    feature3Title: 'Pagamenti locali', feature3Body: 'La cassa regionale comprende wallet mobili, canali bancari, carte e agenti di pagamento specifici per mercato, ciascuno con i propri limiti.',
    regionalTitle: 'Bonus e metodi di pagamento locali per Paese', regionalIntro: 'Le configurazioni regionali attuali coprono 22 mercati. La tabella confronta l’offerta sul primo deposito e i canali di deposito pubblicati per ogni Paese. Importi e disponibilità possono cambiare in base al conto; verifica la promozione e la cassa attive prima di pagare.',
    market: 'Mercato', offer: 'Offerta sul primo deposito', payments: 'Metodi di deposito locali e limiti', offer: (m) => `100% fino a ${m.max} ${m.currency}; deposito minimo ${m.min} ${m.currency}; 30 giri gratis su Reliquary of Ra`, unavailable: 'Per questo mercato non era indicato un importo del bonus; verifica la promozione attiva.',
    nigeriaCasino: 'Nigeria: pacchetto casinò su quattro depositi e condizioni', nigeriaSports: 'Nigeria: bonus di benvenuto sportivo', faqQuestion: 'GoldPari offre lo stesso bonus di benvenuto in ogni Paese?', faqAnswer: 'No. Ad agosto 2026 abbiamo trovato importi sul primo deposito e metodi di cassa locali diversi in 22 configurazioni regionali. Molti mercati offrivano il 100% più 30 giri gratis, ma massimale e deposito minimo variavano in base alla valuta locale. In Nigeria era mostrato anche un pacchetto separato su quattro depositi.', faqCasino: 'Quale pacchetto casinò era mostrato per la Nigeria?', faqSports: 'Quale bonus sportivo di benvenuto era mostrato per la Nigeria?',
  },
  pl: {
    intl: 'pl', title: 'Recenzja GoldPari 2026: bonusy i płatności według kraju',
    description: 'Niezależna recenzja GoldPari: bonusy, minimalne wpłaty i lokalne płatności na 22 rynkach oraz gry, wypłaty i weryfikacja KYC.',
    hero: 'GoldPari łączy zakłady sportowe i na żywo, e-sport, automaty, kasyno na żywo, GoldGames i Bingo. Kwoty bonusów, minimalne wpłaty i metody płatności zależą od kraju i lokalnej waluty, dlatego należy sprawdzić aktualną ofertę dla swojego rynku.',
    feature2Title: 'Bonusy według rynku', feature2Body: 'Maksymalna kwota i minimalna wpłata dla pierwszego bonusu różnią się w zależności od kraju i waluty. Na wielu wymienionych rynkach dostępnych jest 30 darmowych spinów w Reliquary of Ra.',
    feature3Title: 'Lokalne metody płatności', feature3Body: 'Regionalna sekcja płatności obejmuje lokalne portfele mobilne, przelewy, karty i agentów płatniczych z osobnymi limitami wpłat.',
    regionalTitle: 'Bonusy i lokalne metody płatności według kraju', regionalIntro: 'Aktualne konfiguracje regionalne obejmują 22 rynki. Tabela porównuje ofertę pierwszej wpłaty oraz opublikowane lokalne metody wpłat. Kwoty i dostępność mogą zależeć od konta, dlatego przed płatnością sprawdź aktualną promocję i dostępne metody płatności.',
    market: 'Rynek', offer: 'Oferta pierwszej wpłaty', payments: 'Lokalne metody wpłat i limity', offer: (m) => `100% do ${m.max} ${m.currency}; minimalna wpłata ${m.min} ${m.currency}; 30 darmowych spinów w Reliquary of Ra`, unavailable: 'Dla tego rynku nie podano kwoty bonusu; sprawdź aktualną promocję.',
    nigeriaCasino: 'Nigeria: pakiet kasynowy na cztery wpłaty i warunki', nigeriaSports: 'Nigeria: sportowy bonus powitalny', faqQuestion: 'Czy GoldPari oferuje taki sam bonus powitalny w każdym kraju?', faqAnswer: 'Nie. W sierpniu 2026 r. w 22 konfiguracjach regionalnych znaleźliśmy różne kwoty pierwszej wpłaty i lokalne metody płatności. Na wielu rynkach oferta wynosiła 100% plus 30 darmowych spinów, ale maksymalna kwota i minimalna wpłata zależały od lokalnej waluty. W Nigerii wyświetlano także osobny pakiet na cztery wpłaty.', faqCasino: 'Jaki pakiet kasynowy był wyświetlany dla Nigerii?', faqSports: 'Jaki sportowy bonus powitalny był wyświetlany dla Nigerii?',
  },
  pt: {
    intl: 'pt-PT', title: 'Análise GoldPari 2026: bónus e pagamentos por país',
    description: 'Análise independente da GoldPari com bónus, depósitos mínimos e pagamentos locais em 22 mercados, além de jogos, levantamentos e verificação KYC.',
    hero: 'A GoldPari reúne apostas desportivas e ao vivo, eSports, slots, casino ao vivo, GoldGames e Bingo. Os valores dos bónus, depósitos mínimos e métodos de caixa dependem do país e da moeda local, pelo que deve confirmar a oferta ativa para o seu mercado.',
    feature2Title: 'Bónus por mercado', feature2Body: 'O limite e o depósito mínimo do bónus inicial variam consoante o país e a moeda. Muitos dos mercados indicados incluem 30 jogadas grátis no Reliquary of Ra.',
    feature3Title: 'Pagamentos locais', feature3Body: 'A caixa regional inclui carteiras móveis, canais bancários, cartões e agentes de pagamento específicos de cada mercado, com limites próprios.',
    regionalTitle: 'Bónus e métodos de pagamento locais por país', regionalIntro: 'As configurações regionais atuais abrangem 22 mercados. A tabela compara a oferta do primeiro depósito e os métodos locais publicados para cada país. Os valores e a disponibilidade podem variar por conta; confirme a promoção e a caixa ativas antes de pagar.',
    market: 'Mercado', offer: 'Oferta do primeiro depósito', payments: 'Métodos de depósito locais e limites', offer: (m) => `100% até ${m.max} ${m.currency}; depósito mínimo ${m.min} ${m.currency}; 30 jogadas grátis no Reliquary of Ra`, unavailable: 'Não foi indicado um valor de bónus para este mercado; confirme a promoção ativa.',
    nigeriaCasino: 'Nigéria: pacote de casino em quatro depósitos e condições', nigeriaSports: 'Nigéria: bónus de boas-vindas desportivo', faqQuestion: 'A GoldPari oferece o mesmo bónus de boas-vindas em todos os países?', faqAnswer: 'Não. Em agosto de 2026 encontrámos valores de primeiro depósito e métodos de caixa locais diferentes em 22 configurações regionais. Muitos mercados ofereciam 100% mais 30 jogadas grátis, mas o limite e o depósito mínimo variavam com a moeda local. A Nigéria também apresentava um pacote separado em quatro depósitos.', faqCasino: 'Que pacote de casino era apresentado para a Nigéria?', faqSports: 'Que bónus de boas-vindas desportivo era apresentado para a Nigéria?',
  },
  uk: {
    intl: 'uk', title: 'Огляд GoldPari 2026: бонуси й платежі за країнами',
    description: 'Незалежний огляд GoldPari: бонуси, мінімальні депозити та локальні платежі для 22 ринків, а також ігри, виведення коштів і KYC.',
    hero: 'GoldPari поєднує ставки на спорт і live-події, кіберспорт, слоти, live-казино, GoldGames та Bingo. Розмір бонусу, мінімальний депозит і способи оплати залежать від країни та місцевої валюти, тому гравцеві слід перевіряти актуальну пропозицію для свого ринку.',
    feature2Title: 'Бонуси для різних ринків', feature2Body: 'Максимальна сума та мінімальний депозит для першого бонусу відрізняються залежно від країни й валюти. На багатьох зазначених ринках доступні 30 фріспінів у Reliquary of Ra.',
    feature3Title: 'Локальні способи оплати', feature3Body: 'Регіональна каса підтримує місцеві мобільні гаманці, банківські платежі, картки та платіжних агентів з окремими лімітами.',
    regionalTitle: 'Бонуси та локальні способи оплати за країнами', regionalIntro: 'Актуальні регіональні конфігурації охоплюють 22 ринки. У таблиці порівняно пропозицію на перший депозит і доступні локальні способи поповнення. Суми та доступність можуть залежати від акаунта, тому перед оплатою перевіряйте чинну акцію й касу.',
    market: 'Ринок', offer: 'Пропозиція на перший депозит', payments: 'Локальні способи поповнення та ліміти', offer: (m) => `100% до ${m.max} ${m.currency}; мінімальний депозит ${m.min} ${m.currency}; 30 фріспінів у Reliquary of Ra`, unavailable: 'Для цього ринку суму бонусу не вказано; перевірте актуальну акцію.',
    nigeriaCasino: 'Нігерія: пакет казино за чотири депозити та умови', nigeriaSports: 'Нігерія: спортивний вітальний бонус', faqQuestion: 'Чи однаковий вітальний бонус GoldPari в усіх країнах?', faqAnswer: 'Ні. У серпні 2026 року ми знайшли різні суми першого депозиту й локальні способи оплати у 22 регіональних конфігураціях. На багатьох ринках пропонували 100% і 30 фріспінів, але максимальна сума та мінімальний депозит залежали від місцевої валюти. Для Нігерії також був окремий пакет за чотири депозити.', faqCasino: 'Який пакет казино був доступний для Нігерії?', faqSports: 'Який спортивний вітальний бонус був доступний для Нігерії?',
  },
};

const pages = [
  ['brands/goldpari/index.html', 'en'],
  ['de/brands/goldpari/index.html', 'de'],
  ['es/brands/goldpari/index.html', 'es'],
  ['fi/brands/goldpari/index.html', 'fi'],
  ['fr/brands/goldpari/index.html', 'fr'],
  ['hi/brands/goldpari/index.html', 'hi'],
  ['it/brands/goldpari/index.html', 'it'],
  ['pl/brands/goldpari/index.html', 'pl'],
  ['pt/brands/goldpari/index.html', 'pt'],
  ['uk/brands/goldpari/index.html', 'uk'],
];

const offerHeadings = {
  en: 'First-deposit offer',
  de: 'Ersteinzahlungsangebot',
  es: 'Oferta del primer depósito',
  fi: 'Ensitalletustarjous',
  fr: 'Offre du premier dépôt',
  hi: 'पहले जमा का ऑफ़र',
  it: 'Offerta sul primo deposito',
  pl: 'Oferta pierwszej wpłaty',
  pt: 'Oferta do primeiro depósito',
  uk: 'Пропозиція на перший депозит',
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceMeta(html, selector, value) {
  const escaped = escapeHtml(value);
  const pattern = new RegExp(`(<meta\\s+${selector.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\s+content=")[^"]*("\\s*/?>)`);
  return html.replace(pattern, `$1${escaped}$2`);
}

function localizeAmounts(value, locale) {
  const formatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  return value.replace(/\d[\d,]*(?:\.\d+)?(?=–|\s[A-Z]{3}\b)/g, (number) => {
    const parsed = Number(number.replaceAll(',', ''));
    return Number.isFinite(parsed) ? formatter.format(parsed) : number;
  });
}

function regionalSection(config, locale) {
  const names = new Intl.DisplayNames([config.intl], { type: 'region' });
  const rows = markets.map((market) => {
    const country = names.of(market.code) || market.code;
    const displayMarket = {
      ...market,
      max: market.max ? localizeAmounts(`${market.max} ${market.currency}`, config.intl).replace(` ${market.currency}`, '') : null,
      min: market.min ? localizeAmounts(`${market.min} ${market.currency}`, config.intl).replace(` ${market.currency}`, '') : null,
    };
    const offer = market.max ? config.offer(displayMarket) : config.unavailable;
    const payments = market.payments.map((payment) => escapeHtml(localizeAmounts(payment, config.intl))).join('<br />');
    return `            <tr><td><strong>${escapeHtml(country)}</strong> <span class="editorial-meta">${market.code}</span></td><td>${escapeHtml(offer)}</td><td>${payments}</td></tr>`;
  }).join('\n');

  return `      <section class="container" id="goldpari-regional-guide">
        <h2 class="title">${escapeHtml(config.regionalTitle)}</h2>
        <p>${escapeHtml(config.regionalIntro)}</p>
        <table>
          <thead><tr><th>${escapeHtml(config.market)}</th><th>${escapeHtml(offerHeadings[locale])}</th><th>${escapeHtml(config.payments)}</th></tr></thead>
          <tbody>
${rows}
          </tbody>
        </table>
      </section>

`;
}

function updateStructuredData(html, config, pretty = false) {
  return html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (full, jsonText) => {
    try {
      const data = JSON.parse(jsonText);
      const graph = Array.isArray(data['@graph']) ? data['@graph'] : [];
      const page = graph.find((item) => item['@type'] === 'WebPage');
      if (page) {
        page.name = config.title;
        page.description = config.description;
        page.dateModified = '2026-08-29';
      }
      const faq = graph.find((item) => item['@type'] === 'FAQPage');
      if (faq?.mainEntity?.length) {
        const nigeriaQuestions = new Set([config.faqCasino, config.faqSports]);
        faq.mainEntity = faq.mainEntity.filter((item) => {
          const answer = item?.acceptedAnswer?.text || '';
          return !nigeriaQuestions.has(item?.name) &&
            !/(?:716[\s.,\u00a0]*000|145[\s.,\u00a0]*600)\s*NGN/i.test(answer);
        });
        faq.mainEntity[0].name = config.faqQuestion;
        faq.mainEntity[0].acceptedAnswer.text = config.faqAnswer;
      }
      const serialized = pretty ? `\n${JSON.stringify(data, null, 2)}\n` : JSON.stringify(data);
      return `<script type="application/ld+json">${serialized}</script>`;
    } catch {
      return full;
    }
  });
}

for (const [relativePath, locale] of pages) {
  const file = path.join(root, relativePath);
  const config = configs[locale];
  let html = fs.readFileSync(file, 'utf8');

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(config.title)}</title>`);
  html = replaceMeta(html, 'name="description"', config.description);
  html = replaceMeta(html, 'property="og:title"', config.title);
  html = replaceMeta(html, 'property="og:description"', config.description);
  html = replaceMeta(html, 'name="twitter:title"', config.title);
  html = replaceMeta(html, 'name="twitter:description"', config.description);
  html = updateStructuredData(html, config, locale !== 'en');

  html = html.replace(/<p class="hero-subtitle">[\s\S]*?<\/p>/, `<p class="hero-subtitle">${escapeHtml(config.hero)}</p>`);
  html = html.replace(/(<div class="feature-card glass-card"><div class="icon-placeholder">02<\/div><strong>)[\s\S]*?(<\/strong><span>)[\s\S]*?(<\/span><\/div>)/, `$1${escapeHtml(config.feature2Title)}$2${escapeHtml(config.feature2Body)}$3`);
  html = html.replace(/(<div class="feature-card glass-card"><div class="icon-placeholder">03<\/div><strong>)[\s\S]*?(<\/strong><span>)[\s\S]*?(<\/span><\/div>)/, `$1${escapeHtml(config.feature3Title)}$2${escapeHtml(config.feature3Body)}$3`);

  const newRegionalSection = regionalSection(config, locale);
  if (html.includes('id="goldpari-regional-guide"')) {
    html = html.replace(/      <section class="container" id="goldpari-regional-guide">[\s\S]*?      <\/section>\n\n/, newRegionalSection);
  } else {
    html = html.replace('    <main class="content-review">\n', `    <main class="content-review">\n${newRegionalSection}`);
  }

  html = html.replace(/      <section class="container" id="goldpari-bonus">[\s\S]*?      <\/section>\n\n/, '');
  html = html.replace(
    /      <section class="container">[\s\S]*?      <\/section>\n\n/g,
    (section) => /300\s*%[\s\S]*?145[\s.,\u00a0]*600\s*NGN/i.test(section) ? '' : section
  );
  html = html.replace(
    new RegExp(`      <section class="container">\\s*<h2 class="title">${escapeRegExp(escapeHtml(config.nigeriaSports))}<\\/h2>[\\s\\S]*?      <\\/section>\\n\\n`),
    ''
  );

  [config.faqCasino, config.faqSports].forEach((question) => {
    html = html.replace(
      new RegExp(`\\s*<h3>${escapeRegExp(escapeHtml(question))}<\\/h3><p>[\\s\\S]*?<\\/p>`),
      ''
    );
  });
  html = html.replace(
    /\s*<h3>[^<]+<\/h3><p>[\s\S]*?<\/p>/g,
    (entry) => /(?:716[\s.,\u00a0]*000|145[\s.,\u00a0]*600)\s*NGN/i.test(entry) ? '' : entry
  );

  fs.writeFileSync(file, html);
  console.log(`Updated ${relativePath}`);
}
