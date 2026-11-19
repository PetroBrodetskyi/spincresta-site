export const SITE_ICON_SPRITE = '/icons/ui/review-method.svg?v=20261119-site-icons';

export const TOPIC_ICONS = Object.freeze({
  overview: 'review', highlights: 'sparkles', countries: 'globe', methods: 'payments',
  summary: 'review', bonuses: 'bonus', games: 'games', sports: 'sports', rewards: 'trophy',
  cashier: 'wallet', trust: 'safety', pros: 'balance', suitability: 'user', faq: 'help', reviews: 'chat',
});

const LINK_ICONS = Object.freeze({
  'top-casinos': 'trophy', 'new-casinos': 'sparkles', 'top-rated': 'star', 'exclusive-offers': 'bonus',
  'responsible-gambling': 'safety', 'privacy-policy': 'lock', 'casinos-and-betting': 'games',
  'payment-methods': 'payments', partners: 'link', about: 'user', blog: 'book',
});

export function linkIconFor(href, base) {
  if (!href) return undefined;
  let url;
  try { url = new URL(href, base); } catch { return undefined; }
  if (url.origin !== new URL(base).origin) return undefined;
  const name = url.pathname.split('/').filter(Boolean).at(-1) || '';
  if (url.hash === '#home-country-title' && (!name || /^[a-z]{2}$/.test(name))) return 'globe';
  return Object.hasOwn(LINK_ICONS, name) ? LINK_ICONS[name] : undefined;
}

export function siteIconMarkup(icon, classes = 'site-icon', size = 24) {
  return `<svg class="${classes}" width="${size}" height="${size}" aria-hidden="true" focusable="false"><use href="${SITE_ICON_SPRITE}#${icon}"></use></svg>`;
}

const SECTION_ICONS = [
  ['.home-new-reviews #new-reviews-title', 'review'],
  ['.home-new-games #new-games-title, .brand-new-games-panel h2, .country-new-games-head h2', 'games'],
  ['.expert-review h2', 'review'],
  ['.site-faq-content > h2', 'help'],
  ['#about-purpose-title', 'globe'],
  ['#transparency-title, #editorial-standard-title', 'review'],
  ['#safe-play-title, #protection-tools-title', 'safety'],
  ['#warning-signs-title', 'warning'],
  ['#support-resources-title', 'chat'],
  ['#privacy-details-title', 'lock'],
  ['#privacy-faq-title', 'help'],
  ['#author-work-title', 'review'],
  ['#account-overview-title', 'user'],
  ['#account-review-history-title', 'chat'],
  ['#account-favorites-title', 'heart'],
  ['.account-contact-heading h3', 'mail'],
  ['.brand-quick-facts__heading, #brand-review-details', 'review'],
  ['.brand-right-payments h2', 'payments'],
  ['.brand-feedback-heading h2', 'chat'],
];

const NUMBERED_CARDS = [
  ['.top-casinos-method-grid > article', ['safety', 'games', 'bonus', 'payments', 'clock']],
  ['[aria-labelledby="about-purpose-title"] .home-method-grid > article', ['review', 'globe', 'safety', 'star']],
  ['body[data-page="partners"] .content-area > .home-showcase-section:first-child .home-method-grid > article', ['games', 'link', 'payments', 'book']],
  ['.author-focus-grid > article', ['safety', 'bonus', 'payments', 'lock']],
  ['[data-account-page-signed-in] .home-method-grid > article', ['safety', 'globe', 'calendar', 'lock']],
];

const INFORMATION_CARDS = [
  ['.safe-play-rules-grid > article', ['wallet', 'warning', 'games', 'balance']],
  ['[aria-labelledby="protection-tools-title"] .faq-grid > article', ['payments', 'wallet', 'clock', 'help', 'calendar', 'lock']],
];

const DIRECTORY_PAGES = {
  'top-casinos': 'trophy', 'new-casinos': 'sparkles', 'top-rated': 'star', 'exclusive-offers': 'bonus',
  partners: 'link', blog: 'book', privacy: 'lock', 'responsible-gambling': 'safety', about: 'user',
};

export function initSiteIcons(doc = document) {
  const decorate = (element, icon, variant = 'heading') => {
    if (!icon || !element?.textContent.trim() || element.querySelector(':scope > :is(svg, img, .site-icon)')) return;
    element.insertAdjacentHTML('afterbegin', siteIconMarkup(icon, `site-icon site-icon--${variant}`) + ' ');
  };

  const page = doc.body.dataset.page;
  const introIcon = (Object.hasOwn(DIRECTORY_PAGES, page) ? DIRECTORY_PAGES[page] : undefined) ||
    (doc.body.matches('.payment-methods-page') ? 'payments' : doc.body.matches('.casinos-page') ? 'games' : undefined);
  if (introIcon) decorate(doc.querySelector('.page-intro h1'), introIcon);

  for (const [selector, icon] of SECTION_ICONS) {
    doc.querySelectorAll(selector).forEach(element => decorate(element, icon));
  }

  for (const [selector, icons] of NUMBERED_CARDS) {
    const cards = [...doc.querySelectorAll(selector)];
    const numbers = cards.map(card => card.querySelector(':scope > span:first-child'));
    // Only replace the fixed non-sequential topic cards, not editorial instructions or ranks.
    if (numbers.length !== icons.length || numbers.some((number, index) => Number(number?.textContent || '') !== index + 1)) continue;
    numbers.forEach((number, index) => {
      number.insertAdjacentHTML('beforebegin', siteIconMarkup(icons[index], 'site-icon site-icon--badge', 40));
      number.remove();
    });
  }

  for (const [selector, icons] of INFORMATION_CARDS) {
    const cards = [...doc.querySelectorAll(selector)];
    if (cards.length !== icons.length) continue;
    cards.forEach((card, index) => decorate(card.querySelector('h3'), icons[index]));
  }

  doc.querySelectorAll('.brand-sticky-review-layout [data-review-section]:not(.brand-review-details)').forEach(section => {
    const topic = section.dataset.reviewSection;
    if (!Object.hasOwn(TOPIC_ICONS, topic)) return;
    // Tab labels already identify the topic. Keep their inner section headings clean.
    if (section.closest('.brand-review-details__panel')) return;
    const title = section.querySelector(':scope > h2, :scope > :is(.container, .brand-why-heading) > h2');
    decorate(title, TOPIC_ICONS[topic]);
  });
  doc.querySelectorAll('.brand-review-details__tabs [role="tab"]').forEach(tab => {
    const topic = tab.id.replace(/^brand-review-tab-/, '');
    if (Object.hasOwn(TOPIC_ICONS, topic)) decorate(tab, TOPIC_ICONS[topic], 'inline');
  });

  doc.querySelectorAll('.mobile-menu-inner a:not(.footer-social), .footer-nav > a:not(.footer-social)').forEach(link => {
    decorate(link, linkIconFor(link.getAttribute('href'), doc.baseURI), 'inline');
  });
  decorate(doc.querySelector('.footer-newsletter-copy h2'), 'mail', 'inline');
}
