import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { siteIconMarkup } from '../scripts/site-icons.js';
import { syncCountryHubLinks } from './country-hub-links.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

// Menu labels: privacy (4 + FAQ), safer gambling (5), blog (4), payments (5).
const labels = {
  en: [['Data and use', 'Storage and accounts', 'Retention and rights', 'Contact'], ['Safer play', 'Account tools', 'Warning signs', 'Get help', 'FAQ'], ['Guides', 'Using the guides', 'Editorial standards', 'More resources'], ['Cards', 'Digital wallets', 'Prepaid vouchers', 'Bank transfers and other methods', 'Cryptocurrencies']],
  de: [['Daten und Nutzung', 'Speicherung und Konten', 'Aufbewahrung und Rechte', 'Kontakt'], ['Spielerschutz', 'Kontofunktionen', 'Warnzeichen', 'Hilfe finden', 'FAQ'], ['Ratgeber', 'Ratgeber nutzen', 'Redaktionelle Standards', 'Weitere Ressourcen'], ['Karten', 'Digitale Geldbörsen', 'Prepaid-Gutscheine', 'Überweisungen und weitere Methoden', 'Kryptowährungen']],
  es: [['Datos y uso', 'Almacenamiento y cuentas', 'Conservación y derechos', 'Contacto'], ['Juego responsable', 'Herramientas de la cuenta', 'Señales de alerta', 'Buscar ayuda', 'Preguntas frecuentes'], ['Guías', 'Cómo usar las guías', 'Criterios editoriales', 'Más recursos'], ['Tarjetas', 'Carteras digitales', 'Vales prepago', 'Transferencias y otros métodos', 'Criptomonedas']],
  it: [['Dati e utilizzo', 'Archiviazione e account', 'Conservazione e diritti', 'Contatti'], ['Gioco responsabile', 'Strumenti del conto', 'Segnali di allarme', 'Trova aiuto', 'Domande frequenti'], ['Guide', 'Come usare le guide', 'Criteri editoriali', 'Altre risorse'], ['Carte', 'Portafogli digitali', 'Voucher prepagati', 'Bonifici e altri metodi', 'Criptovalute']],
  pl: [['Dane i ich wykorzystanie', 'Pamięć przeglądarki i konta', 'Przechowywanie i prawa', 'Kontakt'], ['Odpowiedzialna gra', 'Narzędzia na koncie', 'Sygnały ostrzegawcze', 'Gdzie szukać pomocy', 'FAQ'], ['Poradniki', 'Jak korzystać z poradników', 'Standardy redakcyjne', 'Więcej materiałów'], ['Karty', 'Portfele cyfrowe', 'Bony przedpłacone', 'Przelewy i inne metody', 'Kryptowaluty']],
  uk: [['Дані та їх використання', 'Зберігання й акаунти', 'Строки зберігання та права', 'Контакти'], ['Відповідальна гра', 'Ліміти й інструменти', 'Тривожні ознаки', 'Де знайти допомогу', 'Запитання'], ['Гіди', 'Як користуватися гідами', 'Редакційні стандарти', 'Інші матеріали'], ['Картки', 'Цифрові гаманці', 'Передплачені ваучери', 'Банківські перекази та інші способи', 'Криптовалюти']],
  pt: [['Dados e utilização', 'Armazenamento e contas', 'Conservação e direitos', 'Contactos'], ['Jogo responsável', 'Ferramentas da conta', 'Sinais de alerta', 'Procurar ajuda', 'Perguntas frequentes'], ['Guias', 'Como usar os guias', 'Critérios editoriais', 'Mais recursos'], ['Cartões', 'Carteiras digitais', 'Vales pré-pagos', 'Transferências e outros métodos', 'Criptomoedas']],
  fr: [['Données et utilisation', 'Stockage et comptes', 'Conservation et droits', 'Contact'], ['Jeu responsable', 'Outils du compte', 'Signes d’alerte', 'Trouver de l’aide', 'Questions fréquentes'], ['Guides', 'Comment utiliser les guides', 'Normes éditoriales', 'Autres ressources'], ['Cartes', 'Portefeuilles numériques', 'Bons prépayés', 'Virements et autres modes', 'Cryptomonnaies']],
  hi: [['डेटा और उसका उपयोग', 'स्टोरेज और खाते', 'डेटा रखने की अवधि और अधिकार', 'संपर्क'], ['ज़िम्मेदार खेल', 'खाते के टूल', 'चेतावनी के संकेत', 'मदद पाएँ', 'आम सवाल'], ['गाइड', 'गाइड का उपयोग', 'संपादकीय मानक', 'अन्य संसाधन'], ['कार्ड', 'डिजिटल वॉलेट', 'प्रीपेड वाउचर', 'बैंक ट्रांसफ़र और दूसरे तरीके', 'क्रिप्टोकरेंसी']],
  fi: [['Tiedot ja niiden käyttö', 'Tallennus ja tilit', 'Säilytys ja oikeudet', 'Yhteystiedot'], ['Vastuullinen pelaaminen', 'Pelitilin työkalut', 'Varoitusmerkit', 'Hae apua', 'Usein kysyttyä'], ['Oppaat', 'Oppaiden käyttö', 'Toimitukselliset periaatteet', 'Muita resursseja'], ['Kortit', 'Digitaaliset lompakot', 'Ennakkomaksusetelit', 'Tilisiirrot ja muut maksutavat', 'Kryptovaluutat']],
};

const builders = { 'privacy-policy': privacy, 'responsible-gambling': responsible, blog, 'payment-methods': payments };
const authorPage = 'authors/odri-chambers';
const articlePage = 'blog/how-to-choose-an-online-casino';
const countryHubPage = 'online-casinos';
const routes = [...Object.keys(builders), authorPage, articlePage, countryHubPage];
export const lightEditorialPages = () => Object.keys(labels).flatMap(locale => routes.map(page =>
  ({ locale, page, file: path.join(locale === 'en' ? '' : locale, page, 'index.html') })));

const get = (source, pattern, field) => {
  const value = source.match(pattern)?.[1]?.trim();
  if (!value) throw new Error(`Missing ${field}`);
  return value;
};
const sections = source => [...source.matchAll(/<section\b([^>]*)>([\s\S]*?)<\/section>/g)];
const section = (source, key) => {
  const match = sections(source).find(([, attrs]) => new RegExp(`(?:id|aria-labelledby)="${key}"`).test(attrs));
  if (!match) throw new Error(`Missing section: ${key}`);
  return match[2];
};
const h2 = body => get(body, /<h2\b[^>]*>([\s\S]*?)<\/h2>/, 'section heading');
const intro = body => get(body, /<p\b[^>]*>([\s\S]*?)<\/p>/, 'intro');
const headingLead = body => body.match(/<\/div>\s*<p\b[^>]*>([\s\S]*?)<\/p>/)?.[1]?.trim() || '';
const icon = (id, size = 20) => siteIconMarkup(id, 'site-icon', size);
const links = entries => `<div class="account-support-links">${entries.join('')}</div>`;
const link = (href, symbol, label, extra = '') => `<a href="${href}"${extra}>${icon(symbol)}<span>${label}</span></a>`;
const head = (body, key) => body.match(/<h2\b[^>]*id="([^"]+)"/)?.[1] || `${key}-title`;
const paragraphs = text => text ? `<p>${text}</p>` : '';
const cards = source => [...source.matchAll(/<article\b([^>]*)>([\s\S]*?)<\/article>/g)];
const firstHeading = source => get(source, /<h3>([\s\S]*?)<\/h3>/, 'item heading');
const titled = (id, label, symbol, title, body, titleId = `${id}-title`) => ({ id, label, symbol, title, body, titleId });

function dashboard(page, title, lead, panels, { action = '', id = `${page}-heading`, customHeader } = {}) {
  const header = customHeader || `<header class="account-dashboard-heading">
        <h1 id="${id}">${title}</h1>
        <p>${lead}</p>${action ? '\n        ' + action : ''}
      </header>`;
  return `<main class="account-dashboard editorial-dashboard editorial-dashboard--${page} container" data-editorial-dashboard>
      ${header}
      <div class="account-layout">
        <aside class="account-sidebar">
          <nav class="account-menu" aria-labelledby="${id}">
${panels.map(({ id, label, symbol }, i) => '            ' + link('#' + id, symbol, label, ` data-editorial-nav="${id}"${i ? '' : ' aria-current="location"'}`)).join('\n')}
          </nav>
        </aside>
        <div class="account-workspace">
${panels.map(({ id, title, titleId, body }) => `          <section class="account-panel" id="${id}" data-editorial-panel="${id}" aria-labelledby="${titleId}">
            <h2 id="${titleId}" tabindex="-1">${title}</h2>
            ${body}
          </section>`).join('\n')}
        </div>
      </div>
    </main>`;
}

const row = (marker, title, body = '') => `<li>${marker}<div><h3>${title}</h3>${body}</div></li>`;
const rows = values => `<ul class="editorial-panel-rows" role="list">\n              ${values.join('\n              ')}\n            </ul>`;
const faq = source => `<div class="faq-grid">${cards(source).map(([card]) => card).join('\n            ')}</div>`;
const asPolicyBody = values => `<div class="editorial-prose-sections">${values.map(([_, attrs, body]) =>
  `<article${attrs.replace(/\sclass="faq-card"/, '')}>${body}</article>`).join('\n            ')}</div>`;

function privacy(main, [data, storage, rights, contact]) {
  const all = sections(main);
  const details = section(main, 'privacy-details');
  const contactText = all.find(([, attrs, body]) => attrs.includes('aria-label=') && body.includes('mailto:'))?.[2] || '';
  const faqBody = section(main, 'privacy-faq');
  const entries = cards(details);
  const storageEntries = entries.filter(([, , body]) => /^5[AB]?\./i.test(firstHeading(body)));
  const dataEntries = entries.slice(0, entries.indexOf(storageEntries[0]));
  const rightsEntries = entries.slice(dataEntries.length + storageEntries.length);
  if (dataEntries.length !== 4 || storageEntries.length < 1 || rightsEntries.length !== 7) throw new Error('Unexpected privacy policy section order');
  return [
    titled('privacy-details', data, 'lock', h2(details), paragraphs(headingLead(details)) + asPolicyBody(dataEntries), head(details, 'privacy-details')),
    titled('privacy-storage', storage, 'user', storage, asPolicyBody(storageEntries)),
    titled('privacy-rights', rights, 'review', rights, asPolicyBody(rightsEntries)),
    titled('privacy-contact', contact, 'mail', get(contactText, /<strong>([\s\S]*?)<\/strong>/, 'contact title'),
      paragraphs(get(contactText, /<span>([\s\S]*?)<\/span>/, 'contact text')) +
      links([link(get(contactText, /href="(mailto:[^"]+)"/, 'privacy email'), 'mail', get(contactText, /href="mailto:[^"]+">([\s\S]*?)<\/a>/, 'email label'))])),
    titled('privacy-faq', h2(faqBody), 'help', h2(faqBody), faq(faqBody), head(faqBody, 'privacy-faq')),
  ];
}

const jumpLinks = source => [...source.matchAll(/<a href="#support-resources">([\s\S]*?)<\/a>/g)]
  .map(([, label]) => link('#support-resources', 'chat', label, ' data-editorial-jump'));

function responsible(main, [guide, tools, signs, support, questions]) {
  const introSection = get(main, /<section class="page-intro container">([\s\S]*?)<\/section>/, 'safer play introduction');
  const definition = section(main, 'safe-play-guide');
  const protection = section(main, 'protection-tools-title');
  const warnings = section(main, 'warning-signs-title');
  const resources = section(main, 'support-resources');
  const faqBody = section(main, 'responsible-faq');
  const subRows = (source, icons) => cards(source).map(([, , body], i) => {
    const title = firstHeading(body);
    const rest = body.split('</h3>')[1].trim();
    return row(icon(icons[i % icons.length], 22), title, rest);
  });
  const callout = source => {
    const copy = source.match(/<div class="home-section-cta">\s*<div>\s*<strong>([\s\S]*?)<\/strong>\s*<span>([\s\S]*?)<\/span>/);
    return copy ? `<div class="editorial-callout"><h3>${copy[1]}</h3><p>${copy[2]}</p>${links(jumpLinks(source))}</div>` : '';
  };
  return [
    titled('safe-play-guide', guide, 'safety', h2(definition), paragraphs(headingLead(definition)) +
      rows(subRows(introSection, ['clock', 'heart', 'games', 'wallet'])) + callout(definition), head(definition, 'safe-play-guide')),
    titled('protection-tools', tools, 'lock', h2(protection), paragraphs(headingLead(protection)) +
      rows(subRows(protection, ['wallet', 'payments', 'clock', 'warning', 'calendar', 'lock'])), head(protection, 'protection-tools')),
    titled('warning-signs', signs, 'warning', h2(warnings), paragraphs(headingLead(warnings)) +
      rows(subRows(warnings, ['clock', 'warning', 'lock', 'wallet', 'user', 'chat'])) + callout(warnings), head(warnings, 'warning-signs')),
    titled('support-resources', support, 'chat', h2(resources), paragraphs(headingLead(resources)) +
      rows(subRows(resources, ['phone', 'chat', 'globe'])), head(resources, 'support-resources')),
    titled('responsible-faq', questions, 'help', h2(faqBody), faq(faqBody), head(faqBody, 'responsible-faq')),
  ];
}

function blog(main, [guides, howTo, editorial, more]) {
  const guide = section(main, 'seo-editorial-guide');
  const standards = section(main, 'editorial-standard-title');
  const articleLinks = [...main.matchAll(/<a class="blog-card" href="([^"]+)">([\s\S]*?)<\/a>/g)].map(([, href, body]) =>
    `<a class="editorial-featured-link" href="${href}">${icon('book', 24)}<div><h3>${firstHeading(body)}</h3><p>${intro(body)}</p></div><span aria-hidden="true">→</span></a>`);
  if (!articleLinks.length) throw new Error('Missing published blog article links');
  const heroLinks = get(main, /<div class="blog-hero-links"[^>]*>([\s\S]*?)<\/div>/, 'blog links');
  const related = [...heroLinks.matchAll(/<a href="(\/[^"]+)">([^<]+)<\/a>/g)]
    .map(([, href, label]) => link(href, href.includes('payment-methods') ? 'payments' : href.includes('responsible-gambling') ? 'safety' : 'globe', label));
  const lastSection = sections(main).at(-1)?.[2] || '';
  const guideText = [...guide.matchAll(/<p>[\s\S]*?<\/p>/g)].map(([p]) => p).join('\n            ');
  const list = get(standards, /(<ul>[\s\S]*?<\/ul>)/, 'editorial principles');
  return [
    titled('latest-guides', guides, 'book', guides, articleLinks.join('\n            ')),
    titled('seo-editorial-guide', howTo, 'review', h2(guide), guideText + `<div class="editorial-callout"><h3>${h2(lastSection)}</h3><p>${intro(lastSection)}</p></div>`),
    titled('blog-standards', editorial, 'safety', editorial, paragraphs(intro(standards)) + list, 'editorial-standard-title'),
    titled('blog-resources', more, 'link', more, links(related)),
  ];
}

const paymentGroups = [
  ['payment-cards', 'payments', 'visa mastercard maestro americanexpress'],
  ['payment-wallets', 'wallet', 'applepay googlepay paypal skrill neteller ecopayz jeton mifinity webmoney'],
  ['payment-vouchers', 'bonus', 'paysafecard neosurf flexepin'],
  ['payment-transfers', 'balance', 'banktransfer bci wirecard'],
  ['payment-crypto', 'globe', 'bitcoin bitcoincash ethereum litecoin cardano tether tron'],
];
// Provider names are proper names, not localized labels. Keep the generic
// bank-transfer heading and descriptions in the reader's language.
const paymentNames = {
  visa: 'Visa', mastercard: 'Mastercard', maestro: 'Maestro', americanexpress: 'American Express',
  applepay: 'Apple Pay', googlepay: 'Google Pay', paypal: 'PayPal', skrill: 'Skrill', neteller: 'Neteller',
  ecopayz: 'ecoPayz', jeton: 'Jeton', mifinity: 'MiFinity', webmoney: 'WebMoney',
  paysafecard: 'PaysafeCard', neosurf: 'Neosurf', flexepin: 'Flexepin', bci: 'BCI', wirecard: 'Wirecard',
  bitcoin: 'Bitcoin', bitcoincash: 'Bitcoin Cash', ethereum: 'Ethereum', litecoin: 'Litecoin',
  cardano: 'Cardano', tether: 'Tether (USDT)', tron: 'TRON',
};

function keepPaymentNames(html) {
  return html.replace(/<li><span class="editorial-payment-logo">[\s\S]*?<\/li>/g, item => {
    const title = paymentNames[get(item, /\/payments\/([^"/]+)\.svg/, 'payment slug')];
    return title ? item.replace(/<h3>[^<]+<\/h3>/, `<h3>${title}</h3>`)
      .replace(/(<span class="editorial-provider-name"> — )[^<]+/, `$1${title}`) : item;
  });
}

function payments(main, names) {
  const methods = new Map(cards(main).map(([, , body]) => {
    const image = get(body, /(<img\b[^>]+>)/, 'payment logo');
    const key = get(image, /\/payments\/([^"/]+)\.svg/, 'payment slug');
    const title = paymentNames[key] || h2(body);
    const anchor = get(body, /(<a\b[^>]*>[\s\S]*?<\/a>)/, 'provider link')
      .replace(/>([^<]+)<\/a>$/, `>$1<span class="editorial-provider-name"> — ${title}</span></a>`);
    return [key, row(`<span class="editorial-payment-logo">${image.replace(/alt="[^"]*"/, 'alt=""')}</span>`,
      title, paragraphs(intro(body)) + anchor)];
  }));
  if (methods.size !== 26) throw new Error('Unexpected number of payment providers');
  return paymentGroups.map(([id, symbol, keys], i) =>
    titled(id, names[i], symbol, names[i], rows(keys.split(' ').map(key => {
      if (!methods.has(key)) throw new Error(`Missing payment method: ${key}`);
      return methods.get(key);
    }))));
}

const authorLabels = {
  en: ['Review topics', 'Experience', 'Editorial standards'],
  de: ['Prüfkriterien', 'Erfahrung', 'Redaktionelle Standards'],
  es: ['Qué revisa', 'Experiencia', 'Criterios editoriales'],
  it: ['Criteri di valutazione', 'Esperienza', 'Criteri editoriali'],
  pl: ['Zakres recenzji', 'Doświadczenie', 'Standardy redakcyjne'],
  uk: ['Що перевіряє Одрі', 'Досвід', 'Редакційні принципи'],
  pt: ['Temas das análises', 'Experiência', 'Critérios editoriais'],
  fr: ['Critères d’évaluation', 'Expérience', 'Normes éditoriales'],
  hi: ['समीक्षा के विषय', 'अनुभव', 'संपादकीय मानक'],
  fi: ['Arviointikohteet', 'Kokemus', 'Toimitukselliset periaatteet'],
};
const authorReviewLead = {
  en: 'Odri checks information players can verify before registering and organizes it into country guides. Operator marketing claims are not presented as independent test results.',
  de: 'Odri prüft Angaben, die Spieler vor der Registrierung nachvollziehen können, und ordnet sie in Länder-Guides ein. Werbeaussagen der Anbieter werden nicht als unabhängige Testergebnisse dargestellt.',
  es: 'Odri comprueba la información que los jugadores pueden verificar antes de registrarse y la organiza en guías por país. Las afirmaciones publicitarias no se presentan como resultados de pruebas independientes.',
  it: 'Odri verifica le informazioni che i giocatori possono controllare prima di registrarsi e le organizza in guide per paese. Le affermazioni pubblicitarie non sono presentate come risultati di test indipendenti.',
  pl: 'Odri sprawdza informacje, które gracze mogą zweryfikować przed rejestracją, i porządkuje je w przewodnikach po krajach. Twierdzeń reklamowych nie przedstawia jako wyników niezależnych testów.',
  uk: 'Одрі перевіряє відомості, які гравці можуть звірити до реєстрації, і впорядковує їх у гідах за країнами. Рекламні заяви операторів не подаються як результати незалежних тестів.',
  pt: 'Odri verifica as informações que os jogadores podem confirmar antes do registo e organiza-as em guias por país. As alegações publicitárias não são apresentadas como resultados de testes independentes.',
  fr: 'Odri vérifie les informations que les joueurs peuvent contrôler avant de s’inscrire et les organise en guides par pays. Les affirmations publicitaires ne sont pas présentées comme des résultats de tests indépendants.',
  hi: 'ओड्री उस जानकारी की समीक्षा करती हैं जिसे खिलाड़ी पंजीकरण से पहले जाँच सकते हैं और उसे देश के अनुसार गाइड में व्यवस्थित करती हैं। ऑपरेटरों के विज्ञापन दावों को स्वतंत्र परीक्षण के नतीजे के रूप में पेश नहीं किया जाता।',
  fi: 'Odri tarkistaa tiedot, jotka pelaaja voi varmistaa ennen rekisteröitymistä, ja kokoaa ne maakohtaisiin oppaisiin. Operaattoreiden markkinointiväitteitä ei esitetä riippumattomien testien tuloksina.',
};
const allParagraphs = source => [...source.matchAll(/<p>[\s\S]*?<\/p>/g)].map(([p]) => p).join('\n            ');
const withProfileCopy = (html, locale) => html.replace(
  /(<h2 id="author-work-title"[^>]*>[\s\S]*?<\/h2>)\s*(?:<p>[\s\S]*?<\/p>\s*)?(?=<ul class="editorial-panel-rows")/,
  (_, heading) => `${heading}\n            <p>${authorReviewLead[locale]}</p>\n            `,
);
const articleNavUk = { 'license-and-location': 'Ліцензія й доступність', 'game-fit': 'Ігри та функції' };
const withArticleCopy = (html, locale) => locale === 'uk'
  ? html.replace(/(<a href="#([^"]+)"[^>]*><svg[^>]*>[\s\S]*?<\/svg><span>)[^<]+(<\/span><\/a>)/g,
    (entry, opening, id, closing) => articleNavUk[id] ? opening + articleNavUk[id] + closing : entry)
  : html;

function author(main, title, locale) {
  const [workLabel, backgroundLabel, standardsLabel] = authorLabels[locale];
  const profile = section(main, 'author-title');
  const work = section(main, 'author-work-title');
  const background = section(main, 'author-background-title');
  const standards = get(main, /<section class="author-standard">([\s\S]*?)<\/section>/, 'author standards');
  const role = get(profile, /<p class="author-role">([\s\S]*?)<\/p>/, 'author role');
  const photo = get(profile, /(<img\b[^>]*src="\/images\/team\/odri-chambers\.jpg"[^>]*>)/, 'author photo');
  const actions = get(profile, /<div class="author-actions">([\s\S]*?)<\/div>/, 'profile links')
    .replace(/<a /g, '<a class="home-secondary-action" ');
  const prose = str => locale === 'en' ? str.replace(/\blicences?\b/g, item => item.replace('licence', 'license')) : str;
  const topics = cards(work).map(([, , body], i) =>
    row(icon(['safety', 'bonus', 'payments', 'lock'][i], 22), prose(firstHeading(body)), prose(allParagraphs(body))));
  if (topics.length !== 4) throw new Error('Expected four review topics');
  const lead = allParagraphs(profile);
  const customHeader = `<header class="account-dashboard-heading editorial-profile-header">
        <div class="editorial-profile-photo" aria-hidden="true">${photo}</div>
        <div>
          <h1 id="author-title">${title}</h1>
          <p class="editorial-profile-role">${role}</p>
          ${lead}
          <div class="editorial-profile-actions">${actions}</div>
        </div>
      </header>`;
  return dashboard('author', title, '', [
    titled('author-work', workLabel, 'review', locale === 'uk' ? workLabel : h2(work), paragraphs(authorReviewLead[locale]) + rows(topics), 'author-work-title'),
    titled('author-background', backgroundLabel, 'user', h2(background), allParagraphs(background), 'author-background-title'),
    titled('author-standards', standardsLabel, 'book', locale === 'uk' ? standardsLabel : h2(standards), allParagraphs(standards)),
  ], { id: 'author-title', customHeader });
}

function article(main, title, locale) {
  const metadata = get(main, /(<div class="blog-article-meta">[\s\S]*?<\/div>)/, 'article metadata');
  const prose = get(main, /<div class="blog-article-body">([\s\S]*?)<\/div>\s*<aside class="blog-article-aside"/, 'article body');
  const footer = get(prose, /(<div class="blog-article-footer">[\s\S]*?<\/div>)/, 'article links');
  const aside = get(main, /<aside class="blog-article-aside"[^>]*>([\s\S]*?)<\/aside>/, 'article contents');
  const names = new Map([...aside.matchAll(/<a href="#([^"]+)">([^<]+)<\/a>/g)].map(([, id, text]) => [id, text]));
  const parts = [...prose.replace(footer, '').matchAll(/<h2 id="([^"]+)">([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2\b|$)/g)];
  const bodyCopy = text => locale === 'en'
    ? text.replace(/\bauthorised\b/g, 'authorized').replace(/\bcatalogues\b/g, 'catalogs') : text;
  if (!parts.length || parts.length !== names.size + 1 || parts[0][1] !== 'quick-answer' ||
      parts.slice(1).some(([, id]) => !names.has(id))) throw new Error('Article headings and contents do not match');
  const icons = ['review', 'safety', 'bonus', 'payments', 'games', 'chat', 'book'];
  return `<main class="account-dashboard editorial-dashboard editorial-reading-page container" data-editorial-reading>
      <article aria-labelledby="article-title">
        <header class="account-dashboard-heading editorial-reading-heading">
          <h1 id="article-title">${title}</h1>
          <p>${intro(main)}</p>
          ${metadata}
        </header>
        <div class="account-layout">
          <aside class="account-sidebar editorial-contents">
            <p id="article-contents-title">${h2(aside)}</p>
            <nav class="account-menu" aria-labelledby="article-contents-title" data-editorial-contents>
              ${parts.map(([, id, heading], i) =>
                link('#' + id, icons[i], names.get(id) || heading, i ? '' : ' aria-current="location"')).join('\n              ')}
            </nav>
          </aside>
          <div class="account-panel editorial-article-prose">
            ${parts.map(([, id, heading, content]) =>
              `<section aria-labelledby="${id}"><h2 id="${id}">${heading}</h2>\n${bodyCopy(content.trimEnd())}\n            </section>`).join('\n            ')}
            ${footer}
          </div>
        </div>
      </article>
    </main>`;
}

const countryHubCopy = {
  en: ['Country guides', 'What we compare', 'Before you register', 'Search by country', 'No countries match your search.', 'Find the guide for your country to compare availability, local payment methods, bonus terms, and safer-play tools.'],
  de: ['Länder-Guides', 'Was wir vergleichen', 'Vor der Registrierung', 'Nach Land suchen', 'Keine Länder passen zu Ihrer Suche.', 'Im Guide für Ihr Land finden Sie Informationen zu Verfügbarkeit, lokalen Zahlungsarten, Bonusbedingungen und Spielerschutz.'],
  es: ['Guías por país', 'Qué comparamos', 'Antes de registrarte', 'Buscar por país', 'No se encontraron países que coincidan con tu búsqueda.', 'Encuentra la guía de tu país para comparar la disponibilidad, los métodos de pago locales, las condiciones de los bonos y las herramientas de juego responsable.'],
  it: ['Guide per paese', 'Cosa confrontiamo', 'Prima di registrarti', 'Cerca per paese', 'Nessun paese corrisponde alla ricerca.', 'Trova la guida del tuo paese per confrontare disponibilità, metodi di pagamento locali, condizioni dei bonus e strumenti di gioco responsabile.'],
  pl: ['Przewodniki po krajach', 'Co porównujemy', 'Przed rejestracją', 'Szukaj kraju', 'Brak krajów pasujących do wyszukiwania.', 'Znajdź przewodnik dla swojego kraju i porównaj dostępność, lokalne metody płatności, warunki bonusów oraz narzędzia odpowiedzialnej gry.'],
  uk: ['Гіди за країнами', 'Що ми порівнюємо', 'Перед реєстрацією', 'Знайти країну', 'За вашим запитом країн не знайдено.', 'Знайдіть гід для своєї країни й порівняйте доступність казино, місцеві способи оплати, умови бонусів та інструменти відповідальної гри.'],
  pt: ['Guias por país', 'O que comparamos', 'Antes do registo', 'Pesquisar por país', 'Nenhum país corresponde à sua pesquisa.', 'Encontre o guia do seu país para comparar disponibilidade, métodos de pagamento locais, condições dos bónus e ferramentas de jogo responsável.'],
  fr: ['Guides par pays', 'Nos critères de comparaison', 'Avant de vous inscrire', 'Rechercher un pays', 'Aucun pays ne correspond à votre recherche.', 'Trouvez le guide de votre pays pour comparer la disponibilité, les moyens de paiement locaux, les conditions des bonus et les outils de jeu responsable.'],
  hi: ['देश के अनुसार गाइड', 'हम क्या तुलना करते हैं', 'रजिस्ट्रेशन से पहले', 'देश खोजें', 'आपकी खोज से कोई देश मेल नहीं खाता।', 'अपने देश का गाइड खोजें और उपलब्धता, स्थानीय भुगतान विकल्प, बोनस की शर्तें और ज़िम्मेदार खेल के टूल की तुलना करें।'],
  fi: ['Maaoppaat', 'Mitä vertailemme', 'Ennen rekisteröitymistä', 'Hae maata', 'Hakua vastaavia maita ei löytynyt.', 'Löydä maasi opas ja vertaile saatavuutta, paikallisia maksutapoja, bonusehtoja ja vastuullisen pelaamisen työkaluja.'],
};

function countryHub(main, title, locale) {
  const [browse, compare, before, search, empty, lead] = countryHubCopy[locale];
  const method = section(main, 'seo-editorial-guide');
  const followups = sections(main.slice(main.indexOf(method) + method.length)).map(([, , body]) =>
    `<article><h3>${h2(body)}</h3>${allParagraphs(body)}</article>`);
  if (followups.length !== 2) throw new Error('Expected both country guide follow-up sections');
  const criteria = method.replace(/^[\s\S]*?<\/h2>/, '').replace(/<\/div>\s*$/, '')
    .replace(/<h2>/g, '<h3>').replace(/<\/h2>/g, '</h3>');
  const prose = value => locale === 'en' ? value.replace(/\blicences?\b/g, match => match.replace('licence', 'license')) : value;
  const finder = `<div class="country-hub-search" data-country-hub-search role="search" hidden>
              <label for="country-hub-query">${icon('search')}<span class="country-hub-search-label">${search}</span></label>
              <input type="search" id="country-hub-query" placeholder="${search}" autocomplete="off" aria-controls="country-hub-results" />
            </div>
            <p class="country-hub-empty" data-country-hub-empty role="status" hidden>${empty}</p>
            <div id="country-hub-results">
              <div class="country-hub-grid" data-country-hub-grid></div>
            </div>`;
  return syncCountryHubLinks(dashboard('country-hub', title, lead, [
    titled('country-guides', browse, 'globe', browse, finder),
    titled('seo-editorial-guide', compare, 'review', h2(method), `<div class="country-hub-prose">${prose(criteria)}</div>`),
    titled('before-registration', before, 'book', before, `<div class="editorial-prose-sections">${prose(followups.join('\n            '))}</div>`),
  ]), locale);
}

export function syncLightEditorialPage(html, page, locale) {
  if (html.includes('data-editorial-reading')) return syncDefaultTheme(withArticleCopy(html, locale));
  if (html.includes('data-editorial-dashboard')) {
    if (page === 'payment-methods') return syncDefaultTheme(keepPaymentNames(html));
    if (page === authorPage) return syncDefaultTheme(withProfileCopy(html, locale));
    if (page === countryHubPage) return syncDefaultTheme(syncCountryHubLinks(html, locale));
    return syncDefaultTheme(html);
  }
  const main = get(html, /<main\b[^>]*>([\s\S]*?)<\/main>/, 'main');
  const title = get(main, /<h1\b[^>]*>([\s\S]*?)<\/h1>/, 'page heading');
  const replaceMain = content => syncDefaultTheme(html.replace(/<main\b[^>]*>[\s\S]*?<\/main>/, () => content));
  if (page === authorPage) return replaceMain(author(main, title, locale));
  if (page === articlePage) return replaceMain(withArticleCopy(article(main, title, locale), locale));
  if (page === countryHubPage) return replaceMain(countryHub(main, title, locale));
  const [privacyLabels, responsibleLabels, blogLabels, paymentLabels] = labels[locale];
  const menu = { 'privacy-policy': privacyLabels, 'responsible-gambling': responsibleLabels, blog: blogLabels, 'payment-methods': paymentLabels };
  const action = page === 'responsible-gambling'
    ? `<a class="home-primary-action editorial-help-action" href="#support-resources" data-editorial-jump>${icon('chat')}${get(main, /class="home-secondary-action" href="#support-resources">([^<]+)/, 'help action')}</a>` : '';
  return replaceMain(dashboard(page, title, intro(main), builders[page](main, menu[page]), { action }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const apply = process.argv.includes('--apply');
  let changed = 0;
  for (const { file, locale, page } of lightEditorialPages()) {
    const html = fs.readFileSync(file, 'utf8');
    let updated;
    try {
      updated = syncLightEditorialPage(html, page, locale);
    } catch (error) {
      throw new Error(`${file}: ${error.message}`, { cause: error });
    }
    if (updated === html) continue;
    changed++;
    if (apply) fs.writeFileSync(file, updated);
  }
  console.log(`Light editorial pages: ${changed} pages ${apply ? 'updated' : 'pending'}.`);
  if (!apply && changed) process.exitCode = 1;
}
