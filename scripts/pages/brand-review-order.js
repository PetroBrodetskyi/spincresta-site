// A shared reading order; a missing topic never creates a placeholder block.
const LABELS = {
  overview: ['Review overview', 'Bewertung im Überblick', 'Resumen de la reseña', 'Panoramica della recensione', 'Przegląd recenzji', 'Коротко про бренд', 'Resumo da análise', 'L’essentiel de notre avis', 'समीक्षा का सार', 'Arvostelu lyhyesti'],
  highlights: ['Highlights', 'Highlights', 'Aspectos clave', 'Punti chiave', 'Najważniejsze informacje', 'Головне', 'Destaques', 'Points clés', 'मुख्य बातें', 'Kohokohdat'],
  countries: ['Countries', 'Länder', 'Países', 'Paesi', 'Kraje', 'Країни', 'Países', 'Pays', 'देश', 'Maat'],
  methods: ['Payment methods', 'Zahlungsmethoden', 'Métodos de pago', 'Metodi di pagamento', 'Metody płatności', 'Способи оплати', 'Métodos de pagamento', 'Moyens de paiement', 'भुगतान के तरीके', 'Maksutavat'],
  summary: ['Key facts', 'Wichtige Fakten', 'Datos clave', 'Dati principali', 'Kluczowe informacje', 'Основні факти', 'Dados principais', 'Informations clés', 'मुख्य जानकारी', 'Perustiedot'],
  bonuses: ['Bonuses', 'Boni', 'Bonos', 'Bonus', 'Bonusy', 'Бонуси', 'Bónus', 'Bonus', 'बोनस', 'Bonukset'],
  games: ['Casino & games', 'Casino und Spiele', 'Casino y juegos', 'Casinò e giochi', 'Kasyno i gry', 'Казино та ігри', 'Casino e jogos', 'Casino et jeux', 'कैसीनो और गेम', 'Kasino ja pelit'],
  sports: ['Sports betting', 'Sportwetten', 'Apuestas deportivas', 'Scommesse sportive', 'Zakłady sportowe', 'Ставки на спорт', 'Apostas desportivas', 'Paris sportifs', 'खेल सट्टेबाज़ी', 'Vedonlyönti'],
  rewards: ['Rewards & VIP', 'Prämien und VIP', 'Recompensas y VIP', 'Premi e VIP', 'Nagrody i VIP', 'Винагороди й VIP', 'Recompensas e VIP', 'Récompenses et VIP', 'रिवॉर्ड और VIP', 'Palkinnot ja VIP'],
  cashier: ['Deposits & withdrawals', 'Ein- und Auszahlungen', 'Depósitos y retiros', 'Depositi e prelievi', 'Wpłaty i wypłaty', 'Депозити й виплати', 'Depósitos e levantamentos', 'Dépôts et retraits', 'जमा और निकासी', 'Talletukset ja kotiutukset'],
  trust: ['Licensing & player protection', 'Lizenz und Spielerschutz', 'Licencia y protección', 'Licenza e tutela', 'Licencja i ochrona graczy', 'Ліцензія та захист гравців', 'Licença e proteção', 'Licence et protection', 'लाइसेंस और खिलाड़ी सुरक्षा', 'Lisenssi ja pelaajansuoja'],
  more: ['Other details', 'Weitere Details', 'Otros detalles', 'Altri dettagli', 'Inne informacje', 'Інші деталі', 'Outros detalhes', 'Autres détails', 'अन्य जानकारी', 'Muut tiedot'],
  pros: ['Pros & cons', 'Vor- und Nachteile', 'Ventajas y desventajas', 'Pro e contro', 'Zalety i wady', 'Переваги й недоліки', 'Prós e contras', 'Avantages et inconvénients', 'फायदे और नुकसान', 'Plussat ja miinukset'],
  suitability: ['Who it suits', 'Für wen es geeignet ist', 'Para quién es', 'A chi si rivolge', 'Dla kogo', 'Кому підійде', 'A quem se destina', 'À qui il convient', 'किसके लिए उपयुक्त है', 'Kenelle se sopii'],
  faq: ['FAQ', 'Häufige Fragen', 'Preguntas frecuentes', 'Domande frequenti', 'Częste pytania', 'Поширені запитання', 'Perguntas frequentes', 'Questions fréquentes', 'अक्सर पूछे जाने वाले प्रश्न', 'Usein kysytyt kysymykset'],
  reviews: ['Player reviews', 'Spielerbewertungen', 'Opiniones de jugadores', 'Recensioni dei giocatori', 'Opinie graczy', 'Відгуки гравців', 'Avaliações de jogadores', 'Avis des joueurs', 'खिलाड़ियों की समीक्षाएँ', 'Pelaajien arvostelut'],
};

export const BRAND_REVIEW_ORDER = Object.freeze(Object.keys(LABELS));
export const reviewSectionLabel = (kind, translate) => translate(...LABELS[kind]);
export const compareReviewSections = (left, right) =>
  BRAND_REVIEW_ORDER.indexOf(left) - BRAND_REVIEW_ORDER.indexOf(right);

const FAQ_TITLE = /\bfaq\b|häufige fragen|preguntas frecuentes|perguntas frequentes|questions fréquentes|domande frequenti|częste pytania|поширені запит|часті запит|usein kysytyt|\bukk\b|अक्सर पूछ|प्रश्नोत्तर/iu;
const PROS_TITLE = /pros?\b.*cons\b|vor- und nachteile|vorteile.*nachteile|ventajas.*desventajas|vantagens.*desvantagens|pr[oó]s.*contras|vantaggi.*svantaggi|pro.*contro|zalety.*wady|plusy.*minusy|переваг.*недолік|плюс.*мінус|avantages.*inconvénients|फायदे.*नुकसान|plussat.*miinukset|hyvät.*huonot puolet/iu;
const SUITABILITY_TITLE = /\b(?:suits?|best for|checklist|before registration)\b|what players can check|für wen|wem .*passt|vor der registrierung|(?:para|a) qui[eé]n|antes de registrarte|pueden comprobar los jugadores|lista de (?:control|verifica[cç][aã]o)|a chi si rivolge|per chi|chi .*si adatta|prima di registrarsi|possono controllare i giocatori|dla kogo|kto .*pasuje|przed rejestracją|co gracze mogą sprawdzić|кому.{0,35}(?:підход|підійд)|перед реєстрацією|quem .*combina|pour qui|à qui|qui .*convient|avant l['’]inscription|les joueurs peuvent vérifier|liste de vérification|किसके लिए|सबसे उपयुक्त|पंजीकरण से पहले|खिलाड़ी क्या जाँ?च|kenelle|tarkistuslista/iu;
const CASHIER_TITLE = /\b(?:payments?|cashier|withdrawals?|cashouts?|deposits?|kyc|aml|verification)\b|auszahl|einzahl|zahlung|verifizier|pagos?|retiros?|depósitos?|verificaci[oó]n|pagament|preliev|verific[ah]|wypłat|wpłat|płatnoś|weryfikac|плат[еі]ж|оплат|виплат|депозит|верифікац|levanta|retraits?|paiements?|vérification|भुगतान|निकासी|सत्यापन|maksu|kotiutu|talletu|vahvistu/iu;
const BONUS_TERMS_TITLE = /wagering|welcome (?:pack|bonus|offer)|umsatzbeding|willkommens|requisit.*(?:apuest|scommess)|bono de bienvenida|de boas-vindas|de bienvenue|wymagan.*obrot|powitaln|умов.*бонус|віта(?:льн|ння)|वेलकम|वेजर|tervetul|kierrätys/iu;
const TRUST_TITLE = /licen[cs]|regulat|\btrust\b|responsibl|safer[- ]play|player (?:safety|protection)|complaints?|\bsupport\b|lizenz|spielerschutz|beschwerd|vertrauen|confian[çz]a|fiducia|licen[çz]|respons[aá]vel|responsable|sicurezz|licencj|odpowiedzial|zaufanie|підтрим|ліценз|скарг|відповідальн|надійність|protection|plaintes|fiabilité|confiance|assistance|लाइसेंस|सुरक्षा|विश्वास|समर्थन|ज़िम्मेदारी|lisenss|vastuull|asiakastuk|luottamus/iu;
const REWARDS_TITLE = /\b(?:loyalty|rewards?|tournaments?|vip|cashback)\b|treue|pr[äa]mien|fidelidad|fideliza|recompens|torne|loyaut|fid[ée]lit|turniej|lojalno|lojaln|винагор|лояльн|турнір|кешбек|रिवॉर्ड|वफादारी|वीआईपी|palkin|uskoll|turnau/iu;
const BONUS_TITLE = /\b(?:bonuses|bonus|promotions?|welcome (?:pack|offer))\b|boni\b|bonos?\b|bonifica[cç]|promoci|promoz|promocj|premie\b|бонус|акці|offres?|b[oóô]nus|बोनस|bonuk|tarjouk/iu;
const GAMES_TITLE = /\b(?:games?|casino|slots?|jackpots?|providers?|lobby|live dealers?)\b|casinò|kasyn|kasino|spel|spiel|anbieter|juegos?|tragaperr|giochi|fornitor|fornecedor|gr[ay]\b|dostawc|automat|іг(?:ри|ор|рове)|казино|слот|джекпот|провайдер|jogos?|jeux|fournisseur|कैसीनो|गेम|स्लॉट|pelit|pelej|kolikk|palveluntarjoaj/iu;
const SUMMARY_TITLE = /\b(?:snapshot|at a glance|verdict|key facts)\b|überblick|resumen|ocena|veredicto|verdetto|висновок|огляд|résumé|verdict|सार|yhteenveto|yleiskuva/iu;

export function classifyReviewSection({ id = '', heading = '', navLabel = '', isSports = false, kind, isFaq = false, isPros = false }) {
  if (kind && BRAND_REVIEW_ORDER.includes(kind)) return kind;
  const title = `${heading} ${navLabel}`.trim().normalize('NFC');
  if (isFaq || /(?:^|-)faq(?:-|$)/i.test(id) || FAQ_TITLE.test(title)) return 'faq';
  if (isPros || /(?:^|-)pros-cons(?:-|$)/i.test(id) || PROS_TITLE.test(title)) return 'pros';
  if (isSports) return 'sports';
  if (/(?:^|-)verdict$/i.test(id) || /\bverdict\b|\bocena\b|висновок|veredicto|verdetto/iu.test(navLabel)) return 'summary';
  if (id === 'best-for' || SUITABILITY_TITLE.test(title)) return 'suitability';
  if (/(?:^|-)wagering$/i.test(id) || BONUS_TERMS_TITLE.test(title)) return 'bonuses';
  if (/(?:^|-)(?:payments|banking|cashier)$/i.test(id) || CASHIER_TITLE.test(title)) return 'cashier';
  if (/(?:^|-)(?:license|licence|support|responsible|trust)$/i.test(id) || TRUST_TITLE.test(title)) return 'trust';
  if (/(?:^|-)(?:rewards|loyalty|vip)$/i.test(id) || REWARDS_TITLE.test(title) && !BONUS_TITLE.test(title)) return 'rewards';
  if (/(?:^|-)(?:bonus|bonuses|promotions)$/i.test(id) || BONUS_TITLE.test(title)) return 'bonuses';
  if (id === 'casino-lobby' || GAMES_TITLE.test(title) && !SUMMARY_TITLE.test(title)) return 'games';
  if (SUMMARY_TITLE.test(title)) return 'summary';
  return 'more';
}
