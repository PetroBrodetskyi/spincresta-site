import { readFileSync, writeFileSync } from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { escapeReview as esc } from './brand-review-template.mjs';

const brand = BRANDS.find(item => item.urlDetail === 'brands/longfu88.html');
const current = ['SG', 'ID', 'VN', 'TH'];
if (brand?.countries.join() !== current.join()) throw new Error('Review and update Longfu88 market copy together.');
const currencies = ['SGD', 'IDR', 'VND', 'THB'];
const obsolete = /(?<![\p{L}\p{N}])(?:MYR|MY|FPX)(?![\p{L}\p{N}])|DuitNow|Touch 'n Go|Malaysi|Malasia|Malásia|Malaisie|Malesi|Malezj|Малайз|मलेश|ringgit/iu;

// This update removes the paused market; the limits and terms for the other markets remain in their existing table.
const copy = {
  en: [
    'Longfu88 offers casino games, sports betting, and esports in {markets}.',
    'Regional welcome bonus', 'Local currencies',
    'The first-deposit casino offer is 188%. Singapore, Vietnam, and Thailand also list 18 free spins. Maximums and terms vary by country.',
    'Payment methods are not listed publicly before sign-in.',
    'The VIP program has 25 levels from Bronze to Diamond. The published rewards and withdrawal limits are in RM; confirm the amount for your currency.',
    'Separate BTi and SABA sportsbooks.',
    'The Indonesian and Vietnamese bonus amounts do not match their stated USD equivalents. The Thai terms list both 25× and 35× wagering.',
    'Local sites and currencies for all supported markets.',
  ],
  de: [
    'Longfu88 bietet Casinospiele, Sportwetten und E-Sport in {markets} an.',
    'Regionaler Willkommensbonus', 'Lokale Währungen',
    'Der Casino-Ersteinzahlungsbonus beträgt 188 %. In Singapur, Vietnam und Thailand kommen 18 Freispiele hinzu. Höchstbeträge und Bedingungen variieren je nach Land.',
    'Ohne Anmeldung sind keine Zahlungsmethoden öffentlich aufgeführt.',
    'Das VIP-Programm hat 25 Stufen von Bronze bis Diamant. Prämien und Auszahlungslimits sind in RM angegeben; prüfen Sie den Betrag in Ihrer Währung.',
    'Getrennte Sportwettenbereiche von BTi und SABA.',
    'Die Bonusbeträge für Indonesien und Vietnam stimmen nicht mit den angegebenen USD-Beträgen überein. Für Thailand nennt Longfu88 sowohl 25-fachen als auch 35-fachen Umsatz.',
    'Eigene Seiten und lokale Währungen für alle unterstützten Märkte.',
  ],
  es: [
    'Longfu88 ofrece juegos de casino, apuestas deportivas y esports en {markets}.',
    'Bono de bienvenida por país', 'Monedas locales',
    'El bono de casino por el primer depósito es del 188 %. Singapur, Vietnam y Tailandia también anuncian 18 giros gratis. Los importes máximos y las condiciones varían según el país.',
    'Los métodos de pago no se muestran antes de iniciar sesión.',
    'El programa VIP tiene 25 niveles, de Bronce a Diamante. Las recompensas y los límites de retiro se publican en RM; confirma el importe en tu moneda.',
    'Secciones de apuestas deportivas independientes de BTi y SABA.',
    'Los bonos de Indonesia y Vietnam no coinciden con sus importes en USD. Las condiciones de Tailandia indican requisitos de apuesta de 25× y 35×.',
    'Sitios y monedas locales para todos los mercados en los que opera.',
  ],
  it: [
    'Longfu88 offre giochi da casinò, scommesse sportive ed esports nei seguenti mercati: {markets}.',
    'Bonus di benvenuto per paese', 'Valute locali',
    'Il bonus casinò sul primo deposito è del 188%. Singapore, Vietnam e Thailandia indicano anche 18 giri gratis. I massimali e le condizioni variano da paese a paese.',
    'I metodi di pagamento non sono visibili prima dell’accesso.',
    'Il programma VIP ha 25 livelli, da Bronzo a Diamante. I premi e i limiti di prelievo sono espressi in RM: verifica gli importi nella tua valuta.',
    'Sezioni di scommesse sportive separate per BTi e SABA.',
    'I bonus per Indonesia e Vietnam non corrispondono agli importi in USD indicati. Le condizioni per la Thailandia riportano sia un requisito di 25× sia uno di 35×.',
    'Siti e valute locali per tutti i mercati supportati.',
  ],
  pl: [
    'Longfu88 oferuje gry kasynowe, zakłady sportowe i e-sport na rynkach: {markets}.',
    'Bonus powitalny w poszczególnych krajach', 'Lokalne waluty',
    'Bonus kasynowy od pierwszej wpłaty wynosi 188%. W Singapurze, Wietnamie i Tajlandii oferta obejmuje też 18 darmowych spinów. Limity i warunki zależą od kraju.',
    'Metody płatności nie są widoczne przed zalogowaniem.',
    'Program VIP ma 25 poziomów, od brązowego do diamentowego. Nagrody i limity wypłat są podane w RM. Sprawdź kwotę w swojej walucie.',
    'Osobne sekcje zakładów sportowych BTi i SABA.',
    'Kwoty bonusów dla Indonezji i Wietnamu nie odpowiadają kwotom w USD. Warunki dla Tajlandii podają dwa mnożniki obrotu: 25× i 35×.',
    'Lokalne wersje witryny i waluty na wszystkich obsługiwanych rynkach.',
  ],
  uk: [
    'Longfu88 пропонує ігри казино, ставки на спорт і кіберспорт на таких ринках: {markets}.',
    'Вітальний бонус за країнами', 'Місцеві валюти',
    'Бонус казино за перший депозит становить 188%. У Сінгапурі, В’єтнамі й Таїланді також зазначено 18 безкоштовних обертань. Максимальні суми й умови залежать від країни.',
    'До входу в акаунт список способів оплати недоступний.',
    'У VIP-програмі 25 рівнів — від бронзового до діамантового. Нагороди й ліміти виплат зазначено в RM; уточніть суму у вашій валюті.',
    'Окремі розділи ставок на спорт від BTi та SABA.',
    'Суми бонусів для Індонезії та В’єтнаму не збігаються із зазначеними еквівалентами в доларах США. В умовах для Таїланду вказано два множники відіграшу: 25× і 35×.',
    'Локальні версії сайту й валюти для всіх підтримуваних ринків.',
  ],
  pt: [
    'A Longfu88 oferece jogos de casino, apostas desportivas e esports nos seguintes mercados: {markets}.',
    'Bónus de boas-vindas por país', 'Moedas locais',
    'O bónus de casino no primeiro depósito é de 188%. Singapura, Vietname e Tailândia também anunciam 18 jogadas grátis. Os montantes máximos e as condições variam consoante o país.',
    'Não há métodos de pagamento indicados na página pública antes do início de sessão.',
    'O programa VIP tem 25 níveis, de Bronze a Diamante. As recompensas e os limites de levantamento estão em RM. Confirme o montante na sua moeda.',
    'Secções de apostas desportivas separadas da BTi e da SABA.',
    'Os bónus da Indonésia e do Vietname não correspondem aos valores indicados em USD. As condições da Tailândia indicam requisitos de apostas de 25× e 35×.',
    'Versões locais do site e moedas próprias para todos os mercados abrangidos.',
  ],
  fr: [
    'Longfu88 propose des jeux de casino, des paris sportifs et de l’esport sur les marchés suivants : {markets}.',
    'Bonus de bienvenue par pays', 'Devises locales',
    'Le bonus casino sur le premier dépôt est de 188 %. Singapour, le Vietnam et la Thaïlande annoncent également 18 tours gratuits. Les plafonds et les conditions varient selon le pays.',
    'Les moyens de paiement ne sont pas affichés avant la connexion.',
    'Le programme VIP compte 25 niveaux, de Bronze à Diamant. Les récompenses et les plafonds de retrait sont indiqués en RM ; vérifiez le montant dans votre devise.',
    'Espaces de paris sportifs distincts pour BTi et SABA.',
    'Les montants des bonus en Indonésie et au Vietnam ne correspondent pas aux équivalents en USD indiqués. Les conditions en Thaïlande mentionnent deux exigences de mise : 25× et 35×.',
    'Versions locales du site et devises propres à chaque marché couvert.',
  ],
  hi: [
    'Longfu88 इन बाज़ारों में कैसीनो गेम, खेल सट्टेबाज़ी और ईस्पोर्ट्स पेश करता है: {markets}।',
    'देश के अनुसार स्वागत बोनस', 'स्थानीय मुद्राएँ',
    'पहली जमा पर कैसीनो बोनस 188% है। सिंगापुर, वियतनाम और थाईलैंड में 18 मुफ़्त स्पिन भी दिए जाते हैं। अधिकतम राशि और शर्तें देश के अनुसार बदलती हैं।',
    'लॉग इन करने से पहले भुगतान के तरीके नहीं दिखते।',
    'VIP कार्यक्रम में ब्रॉन्ज़ से डायमंड तक 25 स्तर हैं। इनाम और निकासी की सीमा RM में दी गई हैं। अपनी मुद्रा में लागू राशि की पुष्टि करें।',
    'BTi और SABA के अलग-अलग खेल सट्टेबाज़ी सेक्शन।',
    'इंडोनेशिया और वियतनाम में बोनस की रकम दिए गए USD समकक्ष से मेल नहीं खाती। थाईलैंड की शर्तों में 25× और 35×, दोनों दाँव की शर्तें दी गई हैं।',
    'सभी समर्थित बाज़ारों के लिए वेबसाइट के स्थानीय संस्करण और स्थानीय मुद्राएँ।',
  ],
  fi: [
    'Longfu88 tarjoaa kasinopelejä, urheiluvedonlyöntiä ja e-urheilua seuraavilla markkinoilla: {markets}.',
    'Maakohtainen tervetuliaisbonus', 'Paikalliset valuutat',
    'Kasinon ensitalletusbonus on 188 %. Singaporessa, Vietnamissa ja Thaimaassa tarjoukseen on merkitty myös 18 ilmaiskierrosta. Enimmäissummat ja ehdot vaihtelevat maittain.',
    'Maksutapoja ei ole listattu julkisesti ennen kirjautumista.',
    'VIP-ohjelmassa on 25 tasoa pronssista timanttiin. Palkinnot ja kotiutusrajat on ilmoitettu RM-valuutassa; tarkista summa omassa valuutassasi.',
    'Erilliset BTi- ja SABA-vedonlyöntiosiot.',
    'Indonesian ja Vietnamin bonussummat eivät vastaa ilmoitettuja Yhdysvaltain dollarimääriä. Thaimaan ehdoissa mainitaan sekä 25- että 35-kertainen kierrätys.',
    'Paikalliset sivustot ja valuutat kaikilla tuetuilla markkinoilla.',
  ],
};

const cells = (row, values) => {
  let index = 0;
  return row.replace(/(<td>)[\s\S]*?(<\/td>)/g, (original, open, close) => {
    const value = values[index++];
    return value === undefined ? original : open + esc(value) + close;
  });
};
const tableRows = (section, update) => {
  let index = 0;
  return section.replace(/^[ \t]*<tr><td\b[^>]*>[\s\S]*?<\/tr>\n?/gm, row => update(row, index++));
};
const featureCopy = (html, index, heading, description) => html.replace(
  new RegExp(`(<div class="icon-placeholder">${index}<\\/div><strong>)([\\s\\S]*?)(<\\/strong><span>)[\\s\\S]*?(<\\/span>)`),
  (_, before, existing, middle, end) => before + (heading ? esc(heading) : existing) + middle + esc(description) + end,
);

for (const [lang, [intro, bonus, currencyHeading, offer, cashier, vip, sports, caveat, pros]] of Object.entries(copy)) {
  const locale = lang === 'pt' ? 'pt-PT' : lang;
  const format = new Intl.ListFormat(locale);
  const region = new Intl.DisplayNames(locale, { type: 'region' });
  const markets = format.format(current.map(code => region.of(code)));
  const currencyList = format.format(currencies);
  const file = (lang === 'en' ? '' : lang + '/') + 'brands/longfu88/index.html';
  const before = readFileSync(file, 'utf8');
  let summary = 0;
  const answers = new Map([[0, offer], [3, cashier]]);
  let after = before.replace(/(<p class="hero-subtitle">)[\s\S]*?(<\/p>)/, (_, open, close) =>
    open + esc(intro.replace('{markets}', markets)) + close);
  after = featureCopy(after, '01', bonus, offer);
  after = featureCopy(after, '03', currencyHeading, currencyList);
  after = featureCopy(after, '05', '', vip);
  after = after.replace(/<section\b[^>]*data-review-section="(summary|bonuses|sports|cashier)"[^>]*>[\s\S]*?<\/section>/g, (section, topic) => {
    if (topic === 'summary') {
      if (++summary === 1) return tableRows(section, (row, i) => i === 0 ? cells(row, [, markets]) : i === 1 ? cells(row, [, offer]) : row);
      return tableRows(section, row => obsolete.test(row) ? '' : row);
    }
    if (topic === 'bonuses') {
      const title = section.replace(/(<h2 class="title">)[\s\S]*?(<\/h2>)/, (_, a, b) => a + esc(bonus) + b);
      return tableRows(title, (row, i) => i === 0 ? cells(row, [bonus, offer]) : obsolete.test(row) ? '' : row);
    }
    if (topic === 'sports') return tableRows(section, (row, i) => i === 0 ? cells(row, [, sports]) : i === 2 ? cells(row, [, , vip]) : row);
    return tableRows(section, (row, i) => i === 0 ? cells(row, [, currencyList]) : i === 1 ? cells(row, [, cashier]) : obsolete.test(row) ? '' : row);
  });
  if (summary !== 2) throw new Error('Missing market tables: ' + file);
  after = after.replace(/(<strong>[^<]+<\/strong><span>)([^<]+)(<\/span>)/g, (whole, a, body, b) => {
    if (body.includes('x25') && body.includes('x35') && obsolete.test(body)) return a + esc(caveat + ' ' + vip) + b;
    if (/^- /.test(body) && /\bfive\b|\bfünf\b|\bcinco\b|\bcinque\b|pięci|п['’ʼ]ят|\bcinq\b|पांच|पाँच|viid|viis/iu.test(body)) return a + '- ' + esc(pros) + b;
    return whole;
  });
  let question = 0;
  after = after.replace(/(<div class="timeline">)([\s\S]*?)(<\/div>)/, (_, a, body, b) =>
    a + body.replace(/(<h3>[\s\S]*?<\/h3><p>)[\s\S]*?(<\/p>)/g, (whole, open, close) => {
      const value = answers.get(question++);
      return value ? open + esc(value) + close : whole;
    }) + b);
  if (question !== 7) throw new Error('Missing FAQ: ' + file);
  after = after.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, a, json, b) => {
    const data = JSON.parse(json);
    const faq = data['@graph'].find(node => node['@type'] === 'FAQPage');
    for (const [i, value] of answers) faq.mainEntity[i].acceptedAnswer.text = value;
    return a + (json.startsWith('\n') ? '\n' + JSON.stringify(data, null, 2) + '\n' : JSON.stringify(data)).replaceAll('<', '\\u003c') + b;
  });
  if (obsolete.test(after)) {
    const match = after.match(obsolete);
    throw new Error(`Obsolete market copy in ${file}: ${after.slice(match.index - 30, match.index + 45)}`);
  }
  if (before !== after) {
    if (process.argv.includes('--apply')) writeFileSync(file, after);
    else {
      console.error('Stale Longfu88 review:', file);
      process.exitCode = 1;
    }
  }
}
