const CASINO_LINKS = ['casinos-and-betting', 'payment-methods', 'game-providers', 'responsible-gambling'];
const SITE_LINKS = ['about', 'blog', 'partners', 'privacy-policy'];

const CASINOS_HEADING = {
  en: 'Casinos', de: 'Casinos', es: 'Casinos', it: 'Casinò', pl: 'Kasyna',
  uk: 'Казино', pt: 'Casinos', fr: 'Casinos', hi: 'कैसीनो', fi: 'Kasinot',
};

// Preserve the published link names except where the source uses all caps,
// title case, or a literal translation that reads poorly in a footer.
const LABELS = {
  en: {
    'casinos-and-betting': 'Casinos & betting', 'payment-methods': 'Payment methods',
    'game-providers': 'Game providers', 'responsible-gambling': 'Responsible gambling', 'privacy-policy': 'Privacy policy',
  },
  de: {
    'casinos-and-betting': 'Casinos & Wetten', 'responsible-gambling': 'Verantwortungsvolles Spielen',
    about: 'Über uns', blog: 'Blog', partners: 'Partner', 'privacy-policy': 'Datenschutz',
  },
  uk: { 'responsible-gambling': 'Відповідальна гра' },
  pt: { 'casinos-and-betting': 'Casinos e apostas', 'privacy-policy': 'Política de privacidade', about: 'Sobre nós' },
  es: { about: 'Sobre nosotros' },
  fr: { about: 'À propos de nous' },
  hi: { 'responsible-gambling': 'ज़िम्मेदारी से खेलना', about: 'हमारे बारे में', partners: 'पार्टनर' },
};

function makeGroup(doc, title, links) {
  const group = doc.createElement('div');
  group.className = 'footer-nav-group';
  const heading = doc.createElement('h2');
  heading.textContent = title;
  const list = doc.createElement('ul');
  links.forEach(link => {
    const item = doc.createElement('li');
    item.append(link);
    list.append(item);
  });
  group.append(heading, list);
  return group;
}

export function layoutFooter(locale, doc = document) {
  doc.querySelectorAll('.footer > .container > .footer-nav').forEach(nav => {
    const top = doc.createElement('div');
    top.className = 'footer-top';
    const linksSection = doc.createElement('div');
    linksSection.className = 'footer-links';
    const social = doc.createElement('div');
    social.className = 'footer-socials';
    const casino = [];
    const site = [];

    nav.querySelectorAll(':scope > a').forEach(link => {
      if (link.classList.contains('footer-social')) {
        const label = link.querySelector('span');
        const name = link.getAttribute('aria-label') || label?.textContent.trim();
        if (name) {
          link.setAttribute('aria-label', name);
          link.querySelector('img')?.setAttribute('alt', '');
        }
        label?.remove();
        social.append(link);
        return;
      }

      const route = link.pathname.split('/').filter(Boolean).at(-1);
      link.textContent = LABELS[locale]?.[route] ?? link.textContent.trim();
      (CASINO_LINKS.includes(route) ? casino : site).push({ route, link });
    });

    const orderedLinks = (items, order) => [
      ...order.flatMap(route => items.filter(item => item.route === route)),
      ...items.filter(item => !order.includes(item.route)),
    ].map(item => item.link);

    nav.classList.add('footer-nav--grouped');
    if (casino.length) nav.append(makeGroup(doc, CASINOS_HEADING[locale] || CASINOS_HEADING.en, orderedLinks(casino, CASINO_LINKS)));
    if (site.length) nav.append(makeGroup(doc, 'SpinCresta', orderedLinks(site, SITE_LINKS)));

    const container = nav.parentElement;
    const newsletter = container.querySelector(':scope > .footer-newsletter');
    const [firstLegalLine, secondLegalLine] = container.querySelectorAll(':scope > p');
    nav.before(top);
    linksSection.append(nav);
    if (social.childElementCount) linksSection.append(social);
    if (firstLegalLine) {
      const legal = doc.createElement('div');
      legal.className = 'footer-legal';
      const notice = secondLegalLine ?? firstLegalLine;
      if (secondLegalLine) {
        firstLegalLine.classList.add('footer-legal-copy');
        legal.append(firstLegalLine);
      }
      notice.classList.add('footer-legal-notice');
      legal.append(notice);
      linksSection.append(legal);
    }
    top.append(linksSection);
    if (newsletter) top.append(newsletter);
  });
}
