import fs from 'node:fs';
import assert from 'node:assert/strict';
import { BRANDS } from '../scripts/brands.js';

// Keep the referral destination in the brand registry. Review pages only provide
// a localized placement; the shared layout supplies the link at runtime.
const brand = BRANDS.find(item => item.name === 'Mostbet');
assert(brand?.partnerProgram?.name);
const copy = {
  en: {
    title: 'Mostbet Loyalty, VIP & Additional Features',
    partnerTitle: 'Affiliate Programme',
    cards: [
      ['Loyalty Programme', 'Mostbet has a loyalty section alongside deposit bonuses and promotions. Check the rewards available to your account and the participation rules.'],
      ['VIP Club', 'VIP benefits depend on the account tier. Read the current requirements and do not increase your spending just to reach a higher level.'],
      ['Shop and Achievements', 'The account also includes a shop, achievements and a bonus map. Reward availability and use are subject to their own rules.'],
      ['Mobile Access', 'Casino, sports, promotions and the cashier are accessible on mobile. Protect your account and use the brand’s official access routes.'],
    ],
    partner: 'For website owners and iGaming publishers: Mostbet Partners is the brand’s affiliate programme, separate from a player account and casino bonuses.',
  },
  de: {
    title: 'Mostbet: Treueprogramm, VIP und weitere Angebote',
    partnerTitle: 'Partnerprogramm',
    cards: [
      ['Treueprogramm', 'Neben Einzahlungsboni und Aktionen gibt es bei Mostbet ein Treueprogramm. Prüfen Sie im Konto, welche Prämien verfügbar sind und welche Teilnahmebedingungen gelten.'],
      ['VIP-Club', 'VIP-Vorteile hängen von der Kontostufe ab. Lesen Sie die aktuellen Bedingungen und erhöhen Sie Ihre Ausgaben nicht allein, um eine höhere Stufe zu erreichen.'],
      ['Shop und Erfolge', 'Zum Konto gehören auch ein Shop, Erfolge und eine Bonuskarte. Für die Verfügbarkeit und Nutzung der Prämien gelten eigene Regeln.'],
      ['Mobiler Zugriff', 'Casino, Sportwetten, Aktionen und Kasse sind auch mobil zugänglich. Schützen Sie Ihr Konto und nutzen Sie die offiziellen Zugangswege der Marke.'],
    ],
    partner: 'Für Website-Betreiber und iGaming-Publisher: Mostbet Partners ist das Partnerprogramm der Marke. Es ist kein Spielerkonto und kein Casinobonus.',
  },
  es: {
    title: 'Mostbet: fidelización, VIP y otras opciones',
    partnerTitle: 'Programa de afiliados',
    cards: [
      ['Programa de fidelización', 'Además de los bonos por depósito y las promociones, Mostbet tiene un programa de fidelización. Consulta en tu cuenta las recompensas disponibles y las condiciones para participar.'],
      ['Club VIP', 'Las ventajas VIP dependen del nivel de la cuenta. Revisa los requisitos actuales y no aumentes tus gastos solo para alcanzar un nivel superior.'],
      ['Tienda y logros', 'La cuenta también incluye una tienda, logros y un mapa de bonos. La disponibilidad y el uso de las recompensas tienen sus propias condiciones.'],
      ['Acceso móvil', 'El casino, las apuestas deportivas, las promociones y la caja son accesibles desde el móvil. Protege tu cuenta y utiliza las vías de acceso oficiales de la marca.'],
    ],
    partner: 'Para propietarios de sitios web y creadores de contenido de iGaming: Mostbet Partners es el programa de afiliados de la marca, no una cuenta de jugador ni un bono de casino.',
  },
  it: {
    title: 'Mostbet: fedeltà, VIP e altre opportunità',
    partnerTitle: 'Programma di affiliazione',
    cards: [
      ['Programma fedeltà', 'Oltre ai bonus sui depositi e alle promozioni, Mostbet offre un programma fedeltà. Controlla nel tuo account i premi disponibili e le condizioni di partecipazione.'],
      ['Club VIP', 'I vantaggi VIP dipendono dal livello dell’account. Leggi i requisiti aggiornati e non aumentare le spese soltanto per raggiungere un livello superiore.'],
      ['Negozio e obiettivi', 'L’account comprende anche un negozio, obiettivi e una mappa dei bonus. La disponibilità e l’utilizzo dei premi seguono regole specifiche.'],
      ['Accesso da mobile', 'Casino, scommesse sportive, promozioni e cassa sono accessibili anche da mobile. Proteggi il tuo account e utilizza i canali di accesso ufficiali del marchio.'],
    ],
    partner: 'Per proprietari di siti e autori di contenuti iGaming: Mostbet Partners è il programma di affiliazione del marchio, distinto dall’account di gioco e dai bonus del casino.',
  },
  pl: {
    title: 'Mostbet: program lojalnościowy, VIP i dodatkowe możliwości',
    partnerTitle: 'Program partnerski',
    cards: [
      ['Program lojalnościowy', 'Oprócz bonusów od wpłat i promocji Mostbet ma program lojalnościowy. Sprawdź na swoim koncie dostępne nagrody oraz warunki udziału.'],
      ['Klub VIP', 'Korzyści VIP zależą od poziomu konta. Przeczytaj aktualne wymagania i nie zwiększaj wydatków tylko po to, by osiągnąć wyższy poziom.'],
      ['Sklep i osiągnięcia', 'Na koncie dostępne są również sklep, osiągnięcia i mapa bonusów. Dostępność oraz wykorzystanie nagród podlegają osobnym zasadom.'],
      ['Dostęp mobilny', 'Kasyno, zakłady sportowe, promocje i kasa są dostępne także na urządzeniach mobilnych. Zabezpiecz swoje konto i korzystaj z oficjalnych kanałów dostępu marki.'],
    ],
    partner: 'Dla właścicieli stron i wydawców treści iGaming: Mostbet Partners to program partnerski marki, a nie konto gracza ani bonus kasynowy.',
  },
  uk: {
    title: 'Mostbet: лояльність, VIP та додаткові можливості',
    partnerTitle: 'Партнерська програма',
    cards: [
      ['Програма лояльності', 'Окрім депозитних бонусів і акцій, Mostbet має програму лояльності. Перевірте в акаунті доступні винагороди та правила участі.'],
      ['VIP-клуб', 'VIP-переваги залежать від рівня акаунта. Ознайомтеся з актуальними вимогами й не збільшуйте витрати лише заради переходу на вищий рівень.'],
      ['Магазин і досягнення', 'В акаунті також є магазин, досягнення та карта бонусів. Доступність і використання винагород регулюються окремими правилами.'],
      ['Мобільний доступ', 'Казино, спортивні ставки, акції та каса доступні з мобільного пристрою. Захистіть свій акаунт і користуйтеся офіційними каналами доступу бренду.'],
    ],
    partner: 'Для власників сайтів і авторів iGaming-контенту: Mostbet Partners — партнерська програма бренду. Це не ігровий акаунт і не бонус для гравців.',
  },
  pt: {
    title: 'Mostbet: fidelização, VIP e outras opções',
    partnerTitle: 'Programa de afiliados',
    cards: [
      ['Programa de fidelização', 'Além dos bónus de depósito e das promoções, a Mostbet tem um programa de fidelização. Consulte na sua conta as recompensas disponíveis e as condições de participação.'],
      ['Clube VIP', 'As vantagens VIP dependem do nível da conta. Leia os requisitos atuais e não aumente os gastos apenas para alcançar um nível superior.'],
      ['Loja e conquistas', 'A conta também inclui uma loja, conquistas e um mapa de bónus. A disponibilidade e a utilização das recompensas seguem regras próprias.'],
      ['Acesso móvel', 'O casino, as apostas desportivas, as promoções e a caixa estão acessíveis em dispositivos móveis. Proteja a sua conta e utilize os canais de acesso oficiais da marca.'],
    ],
    partner: 'Para proprietários de sites e autores de conteúdos de iGaming: a Mostbet Partners é o programa de afiliados da marca, distinto da conta de jogador e dos bónus de casino.',
  },
  fr: {
    title: 'Mostbet : fidélité, VIP et autres possibilités',
    partnerTitle: 'Programme d’affiliation',
    cards: [
      ['Programme de fidélité', 'En plus des bonus de dépôt et des promotions, Mostbet propose un programme de fidélité. Consultez dans votre compte les récompenses disponibles et les conditions de participation.'],
      ['Club VIP', 'Les avantages VIP dépendent du niveau du compte. Lisez les conditions actuelles et n’augmentez pas vos dépenses uniquement pour atteindre un niveau supérieur.'],
      ['Boutique et objectifs', 'Le compte comprend également une boutique, des objectifs et une carte des bonus. La disponibilité et l’utilisation des récompenses obéissent à des règles spécifiques.'],
      ['Accès mobile', 'Le casino, les paris sportifs, les promotions et la caisse sont accessibles sur mobile. Protégez votre compte et utilisez les accès officiels de la marque.'],
    ],
    partner: 'Pour les propriétaires de sites et les éditeurs de contenus iGaming : Mostbet Partners est le programme d’affiliation de la marque, distinct du compte joueur et des bonus de casino.',
  },
  hi: {
    title: 'Mostbet: लॉयल्टी, VIP और अन्य सुविधाएँ',
    partnerTitle: 'अफ़िलिएट कार्यक्रम',
    cards: [
      ['लॉयल्टी कार्यक्रम', 'डिपॉज़िट बोनस और प्रमोशन के अलावा Mostbet में लॉयल्टी कार्यक्रम भी है। अपने खाते में उपलब्ध पुरस्कार और भाग लेने की शर्तें देखें।'],
      ['VIP क्लब', 'VIP सुविधाएँ खाते के स्तर पर निर्भर करती हैं। मौजूदा शर्तें पढ़ें और केवल अगला स्तर पाने के लिए अपना खर्च न बढ़ाएँ।'],
      ['शॉप और उपलब्धियाँ', 'खाते में शॉप, उपलब्धियाँ और बोनस मैप भी हैं। पुरस्कारों की उपलब्धता और उनके इस्तेमाल के लिए अलग नियम लागू होते हैं।'],
      ['मोबाइल पर इस्तेमाल', 'कैसीनो, स्पोर्ट्स बेटिंग, प्रमोशन और कैशियर मोबाइल से भी उपलब्ध हैं। अपना खाता सुरक्षित रखें और ब्रांड के आधिकारिक माध्यमों का ही इस्तेमाल करें।'],
    ],
    partner: 'वेबसाइट मालिकों और iGaming प्रकाशकों के लिए: Mostbet Partners ब्रांड का अफ़िलिएट कार्यक्रम है। यह खिलाड़ी का खाता या कैसीनो बोनस नहीं है।',
  },
  fi: {
    title: 'Mostbet: kanta-asiakasohjelma, VIP ja muut palvelut',
    partnerTitle: 'Kumppaniohjelma',
    cards: [
      ['Kanta-asiakasohjelma', 'Talletusbonusten ja kampanjoiden lisäksi Mostbetilla on kanta-asiakasohjelma. Tarkista tililtäsi saatavilla olevat palkinnot ja osallistumisehdot.'],
      ['VIP-klubi', 'VIP-edut riippuvat tilin tasosta. Lue ajantasaiset ehdot äläkä lisää rahankäyttöäsi vain päästäksesi seuraavalle tasolle.'],
      ['Kauppa ja saavutukset', 'Tilillä on myös kauppa, saavutuksia ja bonuskartta. Palkintojen saatavuutta ja käyttöä koskevat omat säännöt.'],
      ['Mobiilikäyttö', 'Kasino, urheiluvedonlyönti, kampanjat ja kassa ovat käytettävissä myös mobiililaitteella. Suojaa tilisi ja käytä brändin virallisia yhteyskanavia.'],
    ],
    partner: 'Sivustojen omistajille ja iGaming-julkaisijoille: Mostbet Partners on brändin kumppaniohjelma, ei pelitili tai kasinobonus.',
  },
};
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;');
for (const [locale, c] of Object.entries(copy)) {
  const file = `${locale === 'en' ? '' : `${locale}/`}brands/mostbet/index.html`;
  const original = fs.readFileSync(file, 'utf8');
  const main = original.match(/<main class="content-review">([\s\S]*?)<\/main>/)?.[0];
  assert(main, file);
  const previous = [...main.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)][5]?.[0];
  assert(previous?.includes('features-grid premium-grid'), `${file}: expected account-features section`);
  const bestFor = [...main.matchAll(/<section\b[^>]*>[\s\S]*?<\/section>/g)][7]?.[0];
  assert(bestFor?.includes('features-grid premium-grid'), `${file}: expected audience section`);
  const cards = c.cards.map(([title, body]) => `          <div class="feature-card glass-card"><strong>${esc(title)}</strong><span>${esc(body)}</span></div>`).join('\n');
  const next = `<section class="container" id="mostbet-account-features">
        <h2 class="title">${esc(c.title)}</h2>
        <div class="features-grid premium-grid">
${cards}
          <div class="feature-card glass-card" data-brand-partner-program><strong>${esc(c.partnerTitle)}</strong><span>${esc(c.partner)}</span><div data-partner-program-link>${esc(brand.partnerProgram.name)}</div></div>
        </div>
      </section>`;
  const updated = original.replace(previous, next)
    .replace(bestFor, bestFor.replace(/<section\b[^>]*>/, '<section class="container" id="best-for">'))
    .replace(/src="\/scripts\/main\.js\?v=[^"]+"/, 'src="/scripts/main.js?v=20261006-mostbet-partners-3"')
    .replace(/href="\/styles\.css\?v=[^"]+"/, 'href="/styles.css?v=20261006-feature-card-links-3"');
  fs.writeFileSync(file, updated);
  console.log(`${locale}: updated account-features section and partner-program placement`);
}
