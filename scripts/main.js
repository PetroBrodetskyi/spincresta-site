// =====================
// IMPORTS
// =====================
import { BRANDS } from './brands.js?v=20260801-mostbet-review-1';
import { BRAND_SNAPSHOT_CONFIGS } from './brand-snapshot-configs.js';
import { BRAND_NEW_GAMES } from './brand-new-games.js?v=20260801-mostbet-review-1';
import { COUNTRIES } from './countries.js';

// =====================
// HELPERS
// =====================
const PLACEHOLDER_LINK = '#';
const MOJIBAKE_FIXES = [];
const THEME_STORAGE_KEY = 'spincresta-theme';
const THEME_OPTIONS = ['dark', 'light'];
const BLOCKED_BRAND_ICON = '/icons/ui/stop-blocked-icon.svg';
const BLOCKED_BRAND_NOTICE =
  'According to verified information from our analysts, this casino has issues with law enforcement authorities of the Republic of Belarus.';
const BLOCKED_BRAND_CTA = 'Not recommended';

const normalizeText = value => {
  if (typeof value !== 'string') return value ?? '';
  return MOJIBAKE_FIXES.reduce((text, [bad, good]) => text.split(bad).join(good), value);
};

const escapeHtml = value =>
  normalizeText(value)
    .toString()
    .replace(
      /[&<>"']/g,
      char =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[char]
    );

const normalizeAssetPath = path => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }

  if (path.startsWith('/')) return path;

  return `/${path.replace(/^\.\//, '').replace(/^\.\.\//, '')}`;
};

const normalizePagePath = path => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('mailto:') ||
    path.startsWith('tel:') ||
    path.startsWith('#')
  ) {
    return path;
  }

  const cleaned = path.replace(/^\/+/, '').replace(/^\.\//, '').replace(/^\.\.\//, '');

  if (cleaned === '' || cleaned === 'index.html') return '/';

  if (cleaned.endsWith('.html')) {
    return `/${cleaned.replace(/\.html$/, '')}/`;
  }

  if (cleaned.endsWith('/')) {
    return `/${cleaned}`;
  }

  return `/${cleaned}/`;
};

const countryPagePath = slug => `/online-casinos/${slug}/`;
const iconPath = slug => `/icons/${slug}-flag-icon.svg`;

const syncHeaderFlowMetrics = header => {
  if (!header) return;

  const height = Math.ceil(header.offsetHeight || 0);
  const isExpanded =
    header.classList.contains('search-expanded') || header.classList.contains('countries-expanded');

  document.documentElement.style.setProperty('--header-height', `${height}px`);

  if (!isExpanded) {
    document.documentElement.style.setProperty('--header-collapsed-height', `${height}px`);
  }

  document.body.classList.toggle('header-is-expanded', isExpanded);
};
const paymentPath = method => `/icons/payments/${method}.svg`;
const pagePath = fileName => normalizePagePath(fileName);

const STATIC_SEARCH_ITEMS = [
  {
    label: 'Top Casinos',
    type: 'Page',
    href: '/top-casinos/',
    keywords: 'best casinos top casino reviews worldwide',
  },
  {
    label: 'New Casinos',
    type: 'Page',
    href: '/new-casinos/',
    keywords: 'new casino reviews fresh brands latest',
  },
  {
    label: 'Top Rated',
    type: 'Page',
    href: '/top-rated/',
    keywords: 'top rated trusted casino reviews rating',
  },
  {
    label: 'Exclusive',
    type: 'Page',
    href: '/exclusive-offers/',
    keywords: 'exclusive offers private bonuses promotions deals',
  },
  {
    label: 'Casinos & Betting',
    type: 'Page',
    href: '/casinos-and-betting/',
    keywords: 'all brands casinos betting sportsbooks a to z',
  },
  {
    label: 'Payment Methods',
    type: 'Page',
    href: '/payment-methods/',
    keywords: 'payments visa mastercard crypto bank transfer ewallets',
  },
  {
    label: 'Responsible Gambling',
    type: 'Page',
    href: '/responsible-gambling/',
    keywords: 'responsible gambling safer play limits help',
  },
  {
    label: 'About SpinCresta',
    type: 'Page',
    href: '/about/',
    keywords: 'about spincresta team reviews mission',
  },
  {
    label: 'SpinCresta Blog',
    type: 'Blog',
    href: '/blog/',
    summary: 'Casino guides, payment explainers, bonus terms, and safer-play checks',
    keywords: 'blog casino guides payment bonuses withdrawals kyc country reviews',
  },
];

const normalizeSearchValue = value =>
  normalizeText(value)
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const slugifyText = value =>
  normalizeSearchValue(value)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

const isCryptoPayment = method =>
  /bitcoin|crypto|ethereum|tether|litecoin|tron|cardano|usdt|btc|eth|bitcoincash/i.test(
    normalizeText(method)
  );

const isFastPayment = method =>
  /skrill|neteller|ecopayz|jeton|mifinity|muchbetter|astropay|payz|bitcoin|ethereum|tether|litecoin|tron/i.test(
    normalizeText(method)
  );

const getSiteSearchItems = () => {
  const countryByCode = new Map(COUNTRIES.map(country => [country.code.toUpperCase(), country]));
  const items = new Map();

  const addItem = item => {
    if (!item?.href || items.has(item.href)) return;
    const haystack = normalizeSearchValue(
      [item.label, item.type, item.summary, item.keywords].filter(Boolean).join(' ')
    );
    items.set(item.href, { ...item, haystack });
  };

  STATIC_SEARCH_ITEMS.forEach(addItem);

  COUNTRIES.forEach(country => {
    addItem({
      label: `${country.name} casinos`,
      type: 'Country guide',
      href: countryPagePath(country.slug),
      summary: `Online casinos and betting in ${country.name}`,
      keywords: `${country.code} ${country.slug}`,
    });
  });

  BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail).forEach(brand => {
    const brandCountries = (brand.countries || [])
      .map(code => countryByCode.get(code.toUpperCase()))
      .filter(Boolean);
    const countries = (brand.countries || [])
      .map(code => countryByCode.get(code.toUpperCase())?.name || code)
      .join(' ');

    addItem({
      label: brand.name,
      type: 'Brand review',
      href: normalizePagePath(brand.urlDetail),
      summary: brand.bonus || 'Casino review and player checks',
      keywords: [countries, brand.payments?.join(' ')].filter(Boolean).join(' '),
      flags: brandCountries.map(country => ({
        name: country.name,
        slug: country.slug,
      })),
    });
  });

  return Array.from(items.values());
};

const createSiteSearch = variant => {
  const searchItems = getSiteSearchItems();
  const form = document.createElement('form');
  const id = `site-search-${variant}`;
  form.className = `site-search site-search--${variant}`;
  form.setAttribute('role', 'search');
  form.setAttribute('aria-label', 'Search SpinCresta');
  form.innerHTML = `
    <label class="site-search-label" for="${id}">Search SpinCresta</label>
    <div class="site-search-shell">
      <img class="site-search-icon" src="/icons/ui/search-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <input id="${id}" class="site-search-input" type="search" placeholder="Search" autocomplete="off" spellcheck="false" />
    </div>
    <div class="site-search-results" hidden></div>
  `;

  const input = form.querySelector('.site-search-input');
  const resultsEl = form.querySelector('.site-search-results');
  let activeResults = [];

  const closeResults = () => {
    resultsEl.hidden = true;
    resultsEl.innerHTML = '';
    activeResults = [];
  };

  const renderResultLink = item => {
    const flagsHtml = item.flags?.length
      ? `
        <span class="site-search-flags" aria-label="Available countries">
          ${item.flags
            .map(
              flag => `
                <img
                  class="site-search-flag"
                  src="${iconPath(flag.slug)}"
                  alt="${escapeHtml(flag.name)}"
                  loading="lazy"
                  decoding="async"
                />
              `
            )
            .join('')}
        </span>
      `
      : '';

    return `
      <a class="site-search-result" href="${escapeHtml(item.href)}">
        <span class="site-search-result-type">${escapeHtml(item.type)}</span>
        <span class="site-search-result-title">
          <strong>${escapeHtml(item.label)}</strong>
          ${flagsHtml}
        </span>
        <span>${escapeHtml(item.summary || '')}</span>
      </a>
    `;
  };

  const renderResults = () => {
    const query = normalizeSearchValue(input.value);
    if (!query) {
      closeResults();
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    activeResults = searchItems
      .filter(item => terms.every(term => item.haystack.includes(term)))
      .slice(0, 8);

    resultsEl.hidden = false;
    resultsEl.innerHTML = activeResults.length
      ? activeResults.map(renderResultLink).join('')
      : '<div class="site-search-empty">No matches found</div>';
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (activeResults[0]?.href) {
      window.location.href = activeResults[0].href;
    }
  });

  input.addEventListener('input', renderResults);
  input.addEventListener('focus', renderResults);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.blur();
      closeResults();
    }
  });

  document.addEventListener('click', event => {
    if (!form.contains(event.target)) closeResults();
  });

  return form;
};

const initDesktopSiteSearch = () => {
  const headerInner = document.querySelector('.header-inner');
  const nav = headerInner?.querySelector('.nav');
  if (!headerInner || !nav) return null;

  let search = headerInner.querySelector('.site-search--desktop');
  if (!search) {
    search = createSiteSearch('desktop');
    search.id = 'site-search-desktop-panel';
    headerInner.append(search);
  }

  if (!headerInner.querySelector('.site-search-trigger--desktop')) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'site-search-trigger site-search-trigger--desktop';
    trigger.setAttribute('aria-label', 'Open search');
    trigger.setAttribute('aria-controls', search.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `
      <img class="site-search-trigger-icon" src="/icons/ui/search-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    `;
    headerInner.insertBefore(trigger, nav);
  }

  return search;
};

const getDefaultTheme = () => 'dark';

const ensureFooterBlogLink = () => {
  document.querySelectorAll('.footer-nav').forEach((footerNav) => {
    if (footerNav.querySelector('a[href="/blog/"]')) return;

    const link = document.createElement('a');
    link.href = '/blog/';
    link.textContent = 'Blog';
    footerNav.append(link);
  });
};

const getStoredTheme = () => {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEME_OPTIONS.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};

const applyTheme = theme => {
  const root = document.documentElement;
  if (!root) return;

  if (THEME_OPTIONS.includes(theme)) {
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
    return;
  }

  const defaultTheme = getDefaultTheme();
  root.dataset.theme = defaultTheme;
  root.style.colorScheme = defaultTheme;
};

const persistTheme = theme => {
  try {
    if (THEME_OPTIONS.includes(theme)) {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } else {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
};

const getActiveTheme = () => getStoredTheme() || getDefaultTheme();

applyTheme(getActiveTheme());

const renderPayments = (payments = []) => {
  const availablePayments = payments.filter(Boolean);
  if (!availablePayments.length) return '';

  return `
    <div class="payment-icons" data-payment-count="${availablePayments.length}">
      ${availablePayments
        .map(
          method =>
            `<img src="${paymentPath(method)}" alt="${normalizeText(method)} payment method" loading="lazy" decoding="async"/>`
        )
        .join('')}
      <span class="payment-more" hidden aria-hidden="true"></span>
    </div>
  `;
};

const normalizeBrandKey = value =>
  normalizeText(value)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '');

const getBrandDetailPath = brand => normalizePagePath(brand?.urlDetail || '');

const findBrandByPageKey = brandKey => {
  const normalizedPageKey = normalizeBrandKey(brandKey || '');
  if (!normalizedPageKey) return null;

  return (
    BRANDS.find(brand => {
      const detailSlug = getBrandDetailPath(brand).split('/').filter(Boolean).pop();
      return normalizeBrandKey(detailSlug) === normalizedPageKey;
    }) ||
    BRANDS.find(brand => normalizeBrandKey(brand.name).includes(normalizedPageKey)) ||
    null
  );
};

const getBrandAlternatives = brand => {
  const countryCodes = new Set((brand?.countries || []).map(code => code.toUpperCase()));
  const usedKeys = new Set([getBrandDetailPath(brand), normalizeBrandKey(brand?.name)]);
  const alternatives = [];

  const addCandidate = candidate => {
    const detailPath = getBrandDetailPath(candidate);
    const nameKey = normalizeBrandKey(candidate?.name);
    if (!candidate || candidate.notRecommended || !candidate.hasDetailPage || !detailPath || !candidate.image) return;
    if (usedKeys.has(detailPath) || usedKeys.has(nameKey)) return;
    usedKeys.add(detailPath);
    usedKeys.add(nameKey);
    alternatives.push(candidate);
  };

  BRANDS.filter(candidate =>
    (candidate.countries || []).some(code => countryCodes.has(code.toUpperCase()))
  ).forEach(addCandidate);

  if (alternatives.length < 4) {
    BRANDS.forEach(addCandidate);
  }

  return alternatives.slice(0, 4);
};

const getBlockedCtaMarkup = () => `
  <span>Visit Casino</span>
`;

const disableCasinoCta = element => {
  if (!element || element.dataset.blockedCta === 'true') return;

  element.dataset.blockedCta = 'true';
  element.classList.add('cta-blocked');
  element.setAttribute('aria-disabled', 'true');
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '-1');
  element.removeAttribute('href');
  element.removeAttribute('target');
  element.removeAttribute('rel');
  element.innerHTML = getBlockedCtaMarkup();

  element.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
  });
};

const createBlockedBrandIcon = className => {
  const icon = document.createElement('img');
  icon.className = className;
  icon.src = BLOCKED_BRAND_ICON;
  icon.alt = '';
  icon.loading = 'lazy';
  icon.decoding = 'async';
  icon.setAttribute('aria-hidden', 'true');
  return icon;
};

const insertBrandRiskInlineNotice = brand => {
  if (document.querySelector('body[data-brand] .brand-risk-inline')) return;

  const alternatives = getBrandAlternatives(brand);
  const notice = document.createElement('aside');
  notice.className = 'brand-risk-inline';
  notice.setAttribute('role', 'note');
  notice.innerHTML = `
    <div class="brand-risk-inline__notice">
      <img class="brand-risk-inline__icon" src="${BLOCKED_BRAND_ICON}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div class="brand-risk-inline__copy">
        <strong>${escapeHtml(BLOCKED_BRAND_CTA)}</strong>
        <p>${escapeHtml(BLOCKED_BRAND_NOTICE)}</p>
      </div>
    </div>
    ${
      alternatives.length
        ? `<div class="brand-risk-inline__alternatives">
            <h3>We recommend these casinos instead</h3>
            <div class="brand-risk-inline-grid"></div>
          </div>`
        : ''
    }
  `;

  const grid = notice.querySelector('.brand-risk-inline-grid');
  alternatives.forEach(candidate => {
    grid?.appendChild(createCasinoCard(candidate));
  });

  const whySection =
    document.querySelector('body[data-brand] .brand-hero-why') ||
    Array.from(document.querySelectorAll('body[data-brand] section.features-section')).find(section => {
      const title = section.querySelector(':scope > .title, :scope > h2');
      return /why\s+players\s+choose/i.test(normalizeText(title?.textContent || ''));
    });

  if (whySection) {
    whySection.insertAdjacentElement('beforebegin', notice);
    return;
  }

  const main =
    document.querySelector('body[data-brand] .brand-sticky-main') ||
    document.querySelector('body[data-brand] main.content-review') ||
    document.querySelector('body[data-brand] .hero');
  main?.insertAdjacentElement('afterbegin', notice);
};

const applyNotRecommendedBrandPage = brand => {
  if (!brand?.notRecommended) return;

  document.body.classList.add('not-recommended-brand');
  document.querySelectorAll('body[data-brand] a.cta-brands').forEach(disableCasinoCta);

  document.querySelectorAll('body[data-brand] .brand-sticky-title[href]').forEach(stickyTitle => {
    stickyTitle.removeAttribute('href');
    stickyTitle.removeAttribute('target');
    stickyTitle.removeAttribute('rel');
    stickyTitle.setAttribute('role', 'status');
    stickyTitle.setAttribute('aria-label', `${normalizeText(brand.name)} is not recommended`);
    stickyTitle.classList.add('is-not-recommended');
  });

  document.querySelectorAll('body[data-brand] .brand-sticky-title__cta').forEach(cta => {
    cta.classList.add('cta-blocked');
    cta.innerHTML = getBlockedCtaMarkup();
  });

  insertBrandRiskInlineNotice(brand);
};

const applyNotRecommendedCasinoRows = () => {
  const blockedByPath = new Map(
    BRANDS.filter(brand => brand.notRecommended && brand.urlDetail).map(brand => [
      getBrandDetailPath(brand),
      brand,
    ])
  );

  document.querySelectorAll('body.casinos-page .casino-list-row').forEach(row => {
    const detailLink = row.querySelector('.casino-name a[href], .casino-list-logo a[href]');
    const brand = blockedByPath.get(normalizePagePath(detailLink?.getAttribute('href') || ''));
    if (!brand) return;

    row.classList.add('is-not-recommended');
    row.dataset.notRecommended = 'true';
    row.querySelectorAll('.casino-list-cta .cta[href]').forEach(disableCasinoCta);

    const name = row.querySelector('.casino-name');
    if (name && !name.querySelector('.casino-list-risk-icon')) {
      name.appendChild(createBlockedBrandIcon('casino-list-risk-icon'));
    }
  });
};

const normalizeBrandColor = color => {
  const value = typeof color === 'string' ? color.trim() : '';
  if (!value) return '';
  if (typeof CSS !== 'undefined' && typeof CSS.supports === 'function') {
    return CSS.supports('color', value) ? value : '';
  }
  return /^#[0-9a-f]{3,8}$/i.test(value) ? value : '';
};

const setBrandBackground = (element, color) => {
  const normalizedColor = normalizeBrandColor(color);
  if (!element || !normalizedColor) return;
  element.style.setProperty('--brand-bg-color', normalizedColor);
};

const getBrandBackgroundStyle = brand => {
  const color = normalizeBrandColor(brand?.bgColor);
  return color ? ` style="--brand-bg-color: ${color};"` : '';
};

const createBadge = ({ isTopRated, isExclusive, isNew }) => {
  if (isTopRated) return `<span class="casino-status-badge top-rated-badge">Top Rated</span>`;
  if (isExclusive) return `<span class="casino-status-badge exclusive-badge">Exclusive</span>`;
  if (isNew) return `<span class="casino-status-badge new-badge">New</span>`;
  return '';
};

let paymentSyncFrame = null;

const setPaymentIconVisibility = (icon, isHidden) => {
  icon.hidden = isHidden;
  icon.classList.toggle('is-payment-hidden', isHidden);
};

const syncPaymentIcons = (root = document) => {
  const rows = Array.from(root.querySelectorAll?.('.payment-icons[data-payment-count]') ?? []);

  rows.forEach(row => {
    const icons = Array.from(row.querySelectorAll('img'));
    const more = row.querySelector('.payment-more');
    if (!icons.length || !more) return;

    icons.forEach(icon => setPaymentIconVisibility(icon, false));
    more.hidden = true;
    more.style.visibility = '';
    more.setAttribute('aria-hidden', 'true');

    const availableWidth = Math.floor(row.getBoundingClientRect().width);
    if (!availableWidth) return;

    const styles = window.getComputedStyle(row);
    const gap = parseFloat(styles.columnGap || styles.gap) || 0;
    const iconWidths = icons.map(icon => Math.ceil(icon.getBoundingClientRect().width) || 24);
    const sumIconWidths = count => iconWidths.slice(0, count).reduce((total, width) => total + width, 0);

    let visibleCount = icons.length;

    for (let count = icons.length; count >= 0; count -= 1) {
      const hiddenCount = icons.length - count;
      let itemCount = count;
      let moreWidth = 0;

      if (hiddenCount > 0) {
        more.textContent = `+${hiddenCount}`;
        more.hidden = false;
        more.style.visibility = 'hidden';
        moreWidth = Math.ceil(more.getBoundingClientRect().width) || 24;
        itemCount += 1;
      } else {
        more.hidden = true;
      }

      const totalWidth =
        sumIconWidths(count) + moreWidth + gap * Math.max(0, itemCount - 1);

      if (totalWidth <= availableWidth || count === 0) {
        visibleCount = count;
        break;
      }
    }

    const hiddenCount = icons.length - visibleCount;
    icons.forEach((icon, index) => setPaymentIconVisibility(icon, index >= visibleCount));

    if (hiddenCount > 0) {
      more.textContent = `+${hiddenCount}`;
      more.hidden = false;
      more.style.visibility = '';
      more.removeAttribute('aria-hidden');
      more.setAttribute('aria-label', `${hiddenCount} more payment methods`);
    } else {
      more.hidden = true;
      more.style.visibility = '';
      more.setAttribute('aria-hidden', 'true');
      more.removeAttribute('aria-label');
    }

    row.dataset.visiblePayments = String(visibleCount);
  });
};

const requestPaymentIconSync = () => {
  if (paymentSyncFrame) {
    window.cancelAnimationFrame(paymentSyncFrame);
  }

  paymentSyncFrame = window.requestAnimationFrame(() => {
    paymentSyncFrame = null;
    syncPaymentIcons();
  });
};

const initFooterThemeSettings = () => {
  const footerNavs = Array.from(document.querySelectorAll('.footer-nav'));
  if (!footerNavs.length) return;

  footerNavs.forEach(nav => {
    if (nav.querySelector('.footer-settings-trigger')) return;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'footer-settings-trigger';
    button.setAttribute('data-theme-settings-trigger', '');
    button.setAttribute('aria-haspopup', 'dialog');
    button.textContent = 'Settings';

    const firstSocial = nav.querySelector('.footer-social');
    if (firstSocial) {
      nav.insertBefore(button, firstSocial);
    } else {
      nav.appendChild(button);
    }
  });

  if (document.querySelector('.theme-settings-backdrop')) return;

  const backdrop = document.createElement('div');
  backdrop.className = 'theme-settings-backdrop';
  backdrop.hidden = true;
  backdrop.innerHTML = `
    <div class="theme-settings-modal" role="dialog" aria-modal="true" aria-labelledby="themeSettingsTitle">
      <button type="button" class="theme-settings-close" aria-label="Close settings"></button>
      <h3 id="themeSettingsTitle">Theme</h3>
      <p>Choose the theme you want to use on SpinCresta.</p>
      <div class="theme-settings-options" role="group" aria-label="Theme options">
        <button type="button" class="theme-settings-option" data-theme-choice="dark">
          <img src="/icons/ui/moon-icon.svg" alt="Dark theme icon" aria-hidden="true" loading="lazy" decoding="async" />
          <span>Dark</span>
        </button>
        <button type="button" class="theme-settings-option" data-theme-choice="light">
          <img src="/icons/ui/day-sunny-icon.svg" alt="Light theme icon" aria-hidden="true" loading="lazy" decoding="async" />
          <span>Light</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(backdrop);

  const closeButton = backdrop.querySelector('.theme-settings-close');
  const optionButtons = Array.from(backdrop.querySelectorAll('[data-theme-choice]'));

  const syncThemeState = () => {
    const activeTheme = getActiveTheme();

    optionButtons.forEach(button => {
      const isActive = button.dataset.themeChoice === activeTheme;
      button.classList.toggle('is-active', isActive);
      button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const openModal = () => {
    syncThemeState();
    backdrop.hidden = false;
    document.body.classList.add('theme-settings-open');
  };

  const closeModal = () => {
    backdrop.hidden = true;
    document.body.classList.remove('theme-settings-open');
  };

  closeButton?.addEventListener('click', closeModal);

  document.addEventListener('click', event => {
    const trigger = event.target.closest('[data-theme-settings-trigger]');
    if (!trigger) return;
    event.preventDefault();
    openModal();
  });

  backdrop.addEventListener('click', event => {
    if (event.target === backdrop) closeModal();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !backdrop.hidden) {
      closeModal();
    }
  });

  optionButtons.forEach(button => {
    button.addEventListener('click', () => {
      const theme = button.dataset.themeChoice;
      if (!THEME_OPTIONS.includes(theme)) return;
      persistTheme(theme);
      applyTheme(theme);
      syncThemeState();
      closeModal();
    });
  });
};

const syncFooterBrandDirectory = () => {
  const grids = Array.from(document.querySelectorAll('.footer-brand-grid'));
  if (!grids.length) return;

  const countryNames = new Map(COUNTRIES.map(country => [country.code.toUpperCase(), country.name]));
  const brandLinks = BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail)
    .map(brand => ({
      href: normalizePagePath(brand.urlDetail),
      label: normalizeText(brand.name),
      countries: (brand.countries || []).filter(Boolean),
    }))
    .filter(item => item.href && item.label)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }));

  const uniqueLinks = Array.from(new Map(brandLinks.map(item => [item.href, item])).values());
  const repeatedNames = new Set(
    Array.from(
      uniqueLinks.reduce((counts, item) => counts.set(item.label, (counts.get(item.label) || 0) + 1), new Map())
    )
      .filter(([, count]) => count > 1)
      .map(([label]) => label)
  );

  uniqueLinks.forEach(item => {
    if (repeatedNames.has(item.label) && item.countries.length === 1) {
      const countryCode = item.countries[0].toUpperCase();
      const countryName = countryNames.get(countryCode) || item.countries[0];
      item.label = `${item.label} ${countryName}`;
    }
  });

  const columnCount = 5;
  const columnSize = Math.ceil(uniqueLinks.length / columnCount);

  grids.forEach(grid => {
    grid.replaceChildren(
      ...Array.from({ length: columnCount }, (_, columnIndex) => {
        const column = document.createElement('div');
        column.className = 'footer-brand-column';

        uniqueLinks.slice(columnIndex * columnSize, (columnIndex + 1) * columnSize).forEach(item => {
          const link = document.createElement('a');
          link.href = item.href;
          link.textContent = item.label;
          column.appendChild(link);
        });

        return column;
      })
    );
  });
};

const createCasinoCard = ({
  name,
  bonus,
  urlDetail,
  urlCasino,
  image,
  payments = [],
  bgColor,
  isNew = false,
  isExclusive = false,
  isTopRated = false,
  notRecommended = false,
  hasDetailPage = false,
}) => {
  const article = document.createElement('article');
  article.className = 'casino-card';

  const safeUrl = urlCasino || PLACEHOLDER_LINK;
  const safeName = normalizeText(name);
  const safeBonus = normalizeText(bonus);
  const primaryCtaText = 'Visit Casino';
  const detailUrl = normalizePagePath(urlDetail ?? '');
  const imageUrl = normalizeAssetPath(image ?? '');
  const isBlocked = Boolean(notRecommended);
  const showReviewAction = Boolean(hasDetailPage && detailUrl);
  const showPlayAction = safeUrl !== PLACEHOLDER_LINK || isBlocked;

  article.dataset.page = detailUrl;
  article.classList.toggle('is-not-recommended', isBlocked);
  if (isBlocked) article.dataset.notRecommended = 'true';
  setBrandBackground(article, bgColor);

  article.innerHTML = `
    <div class="card-img">
      <img src="${imageUrl}" alt="${safeName}" loading="lazy" decoding="async" class="casino-image"/>
    </div>
    <div class="casino-card-heading">
      <h3 class="casino-name">${safeName}</h3>
      ${
        isBlocked
          ? `<img class="casino-card-risk-icon" src="${BLOCKED_BRAND_ICON}" alt="" aria-hidden="true" loading="lazy" decoding="async" />`
          : ''
      }
      ${createBadge({ isTopRated, isExclusive, isNew })}
    </div>
    ${safeBonus ? `<p class="casino-bonus">${safeBonus}</p>` : ''}
    ${renderPayments(payments)}
    <div class="casino-footer">
      <div class="casino-actions ${showReviewAction && showPlayAction ? 'has-two-actions' : 'has-single-action'}">
        ${
          showReviewAction
            ? `<a class="cta cta-secondary" href="${detailUrl}">Review</a>`
            : ''
        }
        ${
          isBlocked
            ? `<button class="cta cta-primary cta-blocked" type="button" disabled aria-disabled="true">
                ${getBlockedCtaMarkup()}
              </button>`
            : showPlayAction
            ? `<a class="cta cta-primary" href="${safeUrl}" target="_blank" rel="noopener noreferrer nofollow sponsored">${primaryCtaText}</a>`
            : ''
        }
      </div>
    </div>
  `;

  article.addEventListener('click', e => {
    if (e.target.closest('.cta')) return;

    if (hasDetailPage && detailUrl) {
      window.location.href = detailUrl;
      return;
    }

    if (safeUrl !== PLACEHOLDER_LINK) {
      if (isBlocked) return;
      window.open(safeUrl, '_blank', 'noopener');
    }
  });

  article.querySelectorAll('.cta').forEach(link => {
    link.addEventListener('click', e => e.stopPropagation());
  });

  return article;
};

const ITEMS_PER_BATCH = 12;
const COUNTRY_GRID_ROWS_PER_BATCH = 5;
const COUNTRY_GRID_ROW_BATCH_MIN_WIDTH = 1024;

const getGridColumnCount = container => {
  if (typeof window === 'undefined' || !container) return 1;

  const template = window.getComputedStyle(container).gridTemplateColumns.trim();
  if (!template || template === 'none') return 1;

  const repeatMatch = template.match(/^repeat\(\s*(\d+)\s*,/i);
  if (repeatMatch) return Math.max(1, Number(repeatMatch[1]) || 1);

  let columns = 0;
  let token = '';
  let depth = 0;

  Array.from(template).forEach(char => {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);

    if (/\s/.test(char) && depth === 0) {
      if (token.trim()) columns += 1;
      token = '';
      return;
    }

    token += char;
  });

  if (token.trim()) columns += 1;

  return Math.max(1, columns);
};

const getBrandListBatchSize = container => {
  const isCountryHeroGrid = Boolean(
    document.body.dataset.country && container?.closest('.country-hero-cards')
  );

  if (
    !isCountryHeroGrid ||
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    !window.matchMedia(`(min-width: ${COUNTRY_GRID_ROW_BATCH_MIN_WIDTH}px)`).matches
  ) {
    return ITEMS_PER_BATCH;
  }

  return getGridColumnCount(container) * COUNTRY_GRID_ROWS_PER_BATCH;
};

const getLoadMoreControls = container => {
  const loadMoreWrapper =
    container.parentElement?.querySelector(':scope > .load-more-wrapper') ||
    container.closest('.country-brand-main, .container, .content')?.querySelector('.load-more-wrapper') ||
    document.getElementById('loadMoreBtn')?.closest('.load-more-wrapper') ||
    null;

  const loadMoreBtn = loadMoreWrapper?.querySelector('button') || document.getElementById('loadMoreBtn');

  return { loadMoreBtn, loadMoreWrapper };
};

const setLoadMoreVisible = (wrapper, button, isVisible) => {
  if (!wrapper) return;

  wrapper.hidden = !isVisible;
  wrapper.classList.toggle('is-visible', isVisible);
  wrapper.classList.toggle('is-hidden', !isVisible);
  wrapper.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

  if (button) {
    button.disabled = !isVisible;
    button.tabIndex = isVisible ? 0 : -1;
  }
};

const renderBrandList = (brands, containerSelector, emptyText) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const { loadMoreBtn, loadMoreWrapper } = getLoadMoreControls(container);

  if (!brands.length) {
    container.innerHTML = `<p>${emptyText}</p>`;
    setLoadMoreVisible(loadMoreWrapper, loadMoreBtn, false);
    if (loadMoreBtn) loadMoreBtn.onclick = null;
    return;
  }

  let visibleCount = 0;

  container.innerHTML = '';
  setLoadMoreVisible(loadMoreWrapper, loadMoreBtn, false);

  const syncLoadMoreState = () => {
    setLoadMoreVisible(loadMoreWrapper, loadMoreBtn, visibleCount < brands.length);
  };

  const renderNextBatch = event => {
    event?.preventDefault();

    if (visibleCount >= brands.length) {
      syncLoadMoreState();
      return;
    }

    const batchSize = getBrandListBatchSize(container);
    const nextItems = brands.slice(visibleCount, visibleCount + batchSize);
    if (!nextItems.length) {
      syncLoadMoreState();
      return;
    }

    const fragment = document.createDocumentFragment();
    nextItems.forEach(brand => {
      fragment.appendChild(createCasinoCard(brand));
    });

    container.appendChild(fragment);
    requestPaymentIconSync();
    requestAnimationFrame(syncCountryStickyReviewsLayout);
    visibleCount += nextItems.length;
    syncLoadMoreState();
  };

  if (loadMoreBtn) {
    loadMoreBtn.onclick = renderNextBatch;
  }

  renderNextBatch();
};

const getCountryFilterDefinitions = () => [
  {
    id: 'all',
    label: 'All',
    matches: () => true,
  },
  {
    id: 'top-rated',
    label: 'Top Rated',
    matches: brand => Boolean(brand.isTopRated || brand.top?.length),
  },
  {
    id: 'new',
    label: 'New',
    matches: brand => Boolean(brand.isNew),
  },
  {
    id: 'crypto',
    label: 'Crypto',
    matches: brand => (brand.payments || []).some(isCryptoPayment),
  },
  {
    id: 'fast-payout',
    label: 'Fast Payout',
    matches: brand =>
      /fast|payout|withdraw/i.test(normalizeText(brand.bonus)) ||
      (brand.payments || []).some(isFastPayment),
  },
  {
    id: 'sportsbook',
    label: 'Sportsbook',
    matches: brand =>
      /sport|sportsbook|betting|free bets/i.test(
        [brand.name, brand.bonus, brand.urlDetail].map(normalizeText).join(' ')
      ),
  },
  {
    id: 'sweepstakes',
    label: 'Sweepstakes',
    matches: brand => /sweep|sweeps|social casino/i.test(normalizeText(brand.bonus)),
  },
];

const initCountryBrandFilters = (pageCountry, brands, onChange) => {
  const brandCards = document.getElementById('brand-cards');
  if (!brandCards || !pageCountry || !brands.length || document.querySelector('.country-filter-bar')) {
    return;
  }

  const filterDefinitions = getCountryFilterDefinitions()
    .map(filter => ({
      ...filter,
      count: filter.id === 'all' ? brands.length : brands.filter(filter.matches).length,
    }))
    .filter(filter => filter.id === 'all' || filter.count > 0);

  if (filterDefinitions.length <= 1) return;

  const filterBar = document.createElement('div');
  filterBar.className = 'country-filter-bar';
  filterBar.setAttribute('aria-label', 'Filter casino brands');
  filterBar.innerHTML = `
    <div class="country-filter-bar__controls">
      ${filterDefinitions
        .map(
          (filter, index) => `
            <button
              type="button"
              class="country-filter-chip filter-btn${index === 0 ? ' active is-active' : ''}"
              data-country-filter="${filter.id}"
              aria-pressed="${index === 0 ? 'true' : 'false'}"
            >
              ${filter.label}
            </button>
          `
        )
        .join('')}
    </div>
  `;

  brandCards.insertAdjacentElement('beforebegin', filterBar);

  const buttons = Array.from(filterBar.querySelectorAll('.country-filter-chip'));
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filterId = button.dataset.countryFilter || 'all';
      const filter = filterDefinitions.find(item => item.id === filterId) || filterDefinitions[0];
      const filteredBrands = filter.id === 'all' ? brands : brands.filter(filter.matches);

      buttons.forEach(item => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      onChange(filteredBrands, filter);
    });
  });
};

const syncCountryStickyReviewsLayout = () => {
  const rail = document.querySelector('body[data-country] .country-hero-rail');
  const cards = document.querySelector('body[data-country] .country-hero-cards');
  const reviews = document.querySelector('body[data-country] .country-new-reviews');
  const side = document.querySelector('body[data-country] .country-hero-side');
  if (!rail || !cards || !reviews || !side) return;

  const isDesktop = window.matchMedia('(min-width: 1121px)').matches;
  if (!isDesktop) {
    rail.style.minHeight = '';
    side.style.minHeight = '';
    return;
  }

  rail.style.minHeight = `${Math.max(cards.offsetHeight, rail.offsetHeight)}px`;
  side.style.minHeight = `${reviews.offsetHeight}px`;
};

const resetCountryStickyReviews = reviews => {
  reviews.classList.remove('is-fixed', 'is-bottom');
  reviews.style.position = '';
  reviews.style.top = '';
  reviews.style.left = '';
  reviews.style.width = '';
};

const updateCountryStickyReviews = () => {
  const reviews = document.querySelector('body[data-country] .country-new-reviews');
  const side = document.querySelector('body[data-country] .country-hero-side');
  const rail = document.querySelector('body[data-country] .country-hero-rail');
  const cards = document.querySelector('body[data-country] .country-hero-cards');
  const header = document.querySelector('.header');
  if (!reviews || !side || !rail || !cards) return;

  const isDesktop = window.matchMedia('(min-width: 1121px)').matches;
  if (!isDesktop) {
    resetCountryStickyReviews(reviews);
    rail.style.minHeight = '';
    side.style.minHeight = '';
    return;
  }

  syncCountryStickyReviewsLayout();

  const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
  const topOffset = (header?.offsetHeight || 74) + 18;
  const sideRect = side.getBoundingClientRect();
  const cardsRect = cards.getBoundingClientRect();
  const reviewsHeight = reviews.offsetHeight;
  const sideTop = sideRect.top + scrollY;
  const cardsBottom = cardsRect.bottom + scrollY;
  const startAt = sideTop - topOffset;
  const endAt = cardsBottom - reviewsHeight - topOffset - 24;

  if (scrollY < startAt || endAt <= startAt) {
    resetCountryStickyReviews(reviews);
    return;
  }

  if (scrollY >= endAt) {
    const absoluteTop = Math.max(0, cardsBottom - reviewsHeight - sideTop - 24);
    reviews.classList.remove('is-fixed');
    reviews.classList.add('is-bottom');
    reviews.style.position = 'absolute';
    reviews.style.top = `${absoluteTop}px`;
    reviews.style.left = '0';
    reviews.style.width = `${sideRect.width}px`;
    side.style.minHeight = `${absoluteTop + reviewsHeight}px`;
    return;
  }

  reviews.classList.remove('is-bottom');
  reviews.classList.add('is-fixed');
  reviews.style.position = 'fixed';
  reviews.style.top = `${topOffset}px`;
  reviews.style.left = `${sideRect.left}px`;
  reviews.style.width = `${sideRect.width}px`;
};

const initCountryStickyReviews = () => {
  if (!document.body.dataset.country) return;

  let ticking = false;
  const scheduleUpdate = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      ticking = false;
      updateCountryStickyReviews();
    });
  };

  updateCountryStickyReviews();
  window.addEventListener('load', scheduleUpdate);
  window.addEventListener('resize', scheduleUpdate);
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
};

const initVerticalLinkCarousel = ({
  carouselSelector,
  trackSelector,
  desktopMinWidth = 1121,
}) => {
  const carousel = document.querySelector(carouselSelector);
  const track = carousel?.querySelector(trackSelector);
  if (!carousel || !track) return;

  const desktopVisibleCount = Number(carousel.dataset.visibleCount) || 4;
  const mobileVisibleCount = Number(carousel.dataset.mobileVisibleCount) || 2;
  const isCountryReviewsCarousel = carousel.classList.contains('country-new-reviews-carousel');
  const compactDesktopVisibleCount =
    Number(carousel.dataset.compactVisibleCount) || (isCountryReviewsCarousel ? 3 : desktopVisibleCount);
  const rotateMs = Number(carousel.dataset.rotateMs) || 3800;
  const originalMarkup = track.innerHTML;
  const originalCount = track.querySelectorAll('.home-link-card').length;

  const desktopMedia =
    typeof window.matchMedia === 'function'
      ? window.matchMedia(`(min-width: ${desktopMinWidth}px)`)
      : { matches: window.innerWidth >= desktopMinWidth };
  const reducedMotionMedia =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };
  const compactHeightMedia =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-height: 980px)')
      : { matches: window.innerHeight <= 980 };

  let items = [];
  let index = 0;
  let intervalId = null;
  let resetTimerId = null;
  let controls = null;

  const getVisibleCount = () => {
    if (!desktopMedia.matches) return mobileVisibleCount;

    if (isCountryReviewsCarousel && compactHeightMedia.matches) {
      return Math.min(desktopVisibleCount, compactDesktopVisibleCount);
    }

    return desktopVisibleCount;
  };

  const refreshItems = () => {
    items = Array.from(track.querySelectorAll('.home-link-card'));
  };

  const createClone = item => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.tabIndex = -1;

    clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach(element => {
      element.tabIndex = -1;
    });

    return clone;
  };

  const getCycleIndex = () => {
    if (!originalCount) return 0;
    const offset = track.dataset.carouselBuilt === 'true' ? getVisibleCount() : 0;
    return ((index - offset) % originalCount + originalCount) % originalCount;
  };

  const syncItemState = () => {
    if (!items.length) return;

    const visibleCount = getVisibleCount();
    const activeCycleIndex = getCycleIndex();

    items.forEach((item, itemIndex) => {
      const relativeIndex = itemIndex - index;

      item.classList.toggle('is-current', relativeIndex === 0);
      item.classList.toggle('is-next', relativeIndex > 0 && relativeIndex < visibleCount);
      item.classList.toggle('is-tail', relativeIndex === visibleCount - 1);
      item.style.setProperty('--carousel-row', String(relativeIndex));
    });

    const progressValue = `${((activeCycleIndex + 1) / originalCount) * 100}%`;
    carousel.style.setProperty('--carousel-progress', progressValue);
    controls?.style.setProperty('--carousel-progress', progressValue);
    carousel.dataset.activeIndex = String(activeCycleIndex + 1);
  };

  const ensureControls = () => {
    if (controls) return controls;

    const existingControls = carousel.nextElementSibling?.classList.contains('link-carousel-controls')
      ? carousel.nextElementSibling
      : null;
    if (existingControls) {
      controls = existingControls;
      return controls;
    }

    controls = document.createElement('div');
    controls.className = 'link-carousel-controls';
    controls.innerHTML = `
      <div class="link-carousel-progress" aria-hidden="true"><span></span></div>
      <div class="link-carousel-buttons">
        <button class="link-carousel-button" type="button" data-carousel-direction="-1" aria-label="Previous review">
          <span aria-hidden="true"></span>
        </button>
        <button class="link-carousel-button" type="button" data-carousel-direction="1" aria-label="Next review">
          <span aria-hidden="true"></span>
        </button>
      </div>
    `;
    controls.hidden = true;

    carousel.insertAdjacentElement('afterend', controls);

    controls.querySelectorAll('[data-carousel-direction]').forEach(button => {
      button.addEventListener('click', () => {
        const direction = Number(button.dataset.carouselDirection) || 1;
        move(direction, true);
        restartTimer();
      });
    });

    return controls;
  };

  const buildTrack = () => {
    const activeVisibleCount = getVisibleCount();
    const currentCycleIndex = getCycleIndex();

    if (
      track.dataset.carouselBuilt === 'true' &&
      Number(track.dataset.activeVisibleCount) === activeVisibleCount
    ) {
      return;
    }

    track.innerHTML = originalMarkup;
    refreshItems();

    const beforeClones = items.slice(-activeVisibleCount).map(createClone);
    const afterClones = items.slice(0, activeVisibleCount).map(createClone);

    beforeClones.forEach(clone => track.insertBefore(clone, track.firstChild));
    afterClones.forEach(clone => track.appendChild(clone));

    track.dataset.carouselBuilt = 'true';
    track.dataset.activeVisibleCount = String(activeVisibleCount);
    refreshItems();
    index = activeVisibleCount + currentCycleIndex;
  };

  const restoreOriginalTrack = () => {
    if (track.dataset.carouselBuilt !== 'true') {
      refreshItems();
      carousel.style.height = '';
      track.style.transform = '';
      track.style.transition = '';
      carousel.classList.remove('is-carousel-active');
      if (controls) controls.hidden = true;
      syncItemState();
      return;
    }

    track.innerHTML = originalMarkup;
    track.dataset.carouselBuilt = 'false';
    delete track.dataset.activeVisibleCount;
    carousel.style.height = '';
    track.style.transform = '';
    track.style.transition = '';
    index = 0;
    refreshItems();
    carousel.classList.remove('is-carousel-active');
    if (controls) controls.hidden = true;
    syncItemState();
  };

  const setViewportHeight = () => {
    if (!items.length) return;

    const visibleCount = getVisibleCount();
    const firstItem = items[index] || items[0];
    const lastVisibleItem = items[Math.min(index + visibleCount - 1, items.length - 1)];
    const height =
      lastVisibleItem.offsetTop + lastVisibleItem.offsetHeight - firstItem.offsetTop;

    carousel.style.height = `${height}px`;
  };

  const setPosition = (nextIndex, animated) => {
    if (!items.length || !items[nextIndex]) return;

    const baseTop = items[0].offsetTop;
    const targetTop = items[nextIndex].offsetTop;

    track.style.transition = animated ? 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateY(-${targetTop - baseTop}px)`;
    syncItemState();
    setViewportHeight();
  };

  const clearTimers = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    if (resetTimerId) {
      window.clearTimeout(resetTimerId);
      resetTimerId = null;
    }
  };

  const scheduleEdgeReset = () => {
    const visibleCount = getVisibleCount();

    if (index >= originalCount + visibleCount) {
      resetTimerId = window.setTimeout(() => {
        index = visibleCount;
        setPosition(index, false);
        resetTimerId = null;
      }, 720);
      return;
    }

    if (index < visibleCount) {
      resetTimerId = window.setTimeout(() => {
        index = visibleCount + originalCount - 1;
        setPosition(index, false);
        resetTimerId = null;
      }, 720);
    }
  };

  const move = (direction = 1, animated = true) => {
    if (reducedMotionMedia.matches || track.dataset.carouselBuilt !== 'true') return;

    if (resetTimerId) {
      window.clearTimeout(resetTimerId);
      resetTimerId = null;
    }

    index += direction;
    setPosition(index, animated);
    scheduleEdgeReset();
  };

  const rotate = () => move(1, true);

  const restartTimer = () => {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }

    if (!reducedMotionMedia.matches && originalCount > getVisibleCount()) {
      intervalId = window.setInterval(rotate, rotateMs);
    }
  };

  const start = () => {
    clearTimers();

    const visibleCount = getVisibleCount();

    if (reducedMotionMedia.matches || originalCount <= visibleCount) {
      restoreOriginalTrack();
      return;
    }

    ensureControls();
    buildTrack();
    carousel.classList.add('is-carousel-active');
    if (controls) controls.hidden = false;

    if (index < visibleCount || index >= originalCount + visibleCount) {
      index = visibleCount;
    }

    setViewportHeight();
    setPosition(index, false);
    intervalId = window.setInterval(rotate, rotateMs);
  };

  const stop = () => {
    clearTimers();
  };

  const handleModeChange = () => {
    index = 0;
    restoreOriginalTrack();
    start();
  };

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  window.addEventListener('resize', () => {
    if (track.dataset.carouselBuilt !== 'true') return;

    window.requestAnimationFrame(() => {
      if (Number(track.dataset.activeVisibleCount) !== getVisibleCount()) {
        handleModeChange();
        return;
      }

      refreshItems();
      setViewportHeight();
      setPosition(index, false);
    });
  });

  if (typeof desktopMedia.addEventListener === 'function') {
    desktopMedia.addEventListener('change', handleModeChange);
    reducedMotionMedia.addEventListener('change', handleModeChange);
    compactHeightMedia.addEventListener('change', handleModeChange);
  } else if (typeof desktopMedia.addListener === 'function') {
    desktopMedia.addListener(handleModeChange);
    reducedMotionMedia.addListener(handleModeChange);
    compactHeightMedia.addListener(handleModeChange);
  }

  refreshItems();
  start();
};

const initHomeNewBrandsCarousel = () => {
  initVerticalLinkCarousel({
    carouselSelector: '.home-new-brands-carousel',
    trackSelector: '.home-new-brands-track',
    desktopMinWidth: 1121,
  });
};

const initCountryNewReviewsCarousel = () => {
  initVerticalLinkCarousel({
    carouselSelector: '.country-new-reviews-carousel',
    trackSelector: '.country-new-reviews-track',
    desktopMinWidth: 1121,
  });
};

const initCountryGuideCarousels = () => {
  document.querySelectorAll('[data-carousel="gambling-guide"]').forEach(carousel => {
    const cards = Array.from(carousel.children).filter(card => card.tagName === 'DIV');
    if (!cards.length) return;

    const title = carousel.closest('.content-article')?.querySelector(':scope > .title');
    const guideLabel = normalizeText(title?.textContent || 'Gambling Guide').trim();

    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', `${guideLabel} carousel`);

    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;
    let suppressClick = false;

    cards.forEach((card, index) => {
      if (card.querySelector(':scope > .guide-card-index')) return;

      const indexLabel = document.createElement('span');
      indexLabel.className = 'guide-card-index';
      indexLabel.textContent = String(index + 1).padStart(2, '0');
      indexLabel.setAttribute('aria-hidden', 'true');
      card.prepend(indexLabel);
    });

    const releasePointer = event => {
      if (pointerId !== event.pointerId) return;

      pointerId = null;
      carousel.classList.remove('is-dragging');

      if (carousel.hasPointerCapture?.(event.pointerId)) {
        carousel.releasePointerCapture(event.pointerId);
      }

      if (dragged) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      dragged = false;
    };

    carousel.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('a, button, input, select, textarea')) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = carousel.scrollLeft;
      dragged = false;
      carousel.classList.add('is-dragging');
      carousel.setPointerCapture?.(pointerId);
    });

    carousel.addEventListener(
      'pointermove',
      event => {
        if (pointerId !== event.pointerId) return;

        const delta = event.clientX - startX;
        if (Math.abs(delta) < 6) return;

        dragged = true;
        carousel.scrollLeft = startScrollLeft - delta;
        event.preventDefault();
      },
      { passive: false }
    );

    carousel.addEventListener('pointerup', releasePointer);
    carousel.addEventListener('pointercancel', releasePointer);
    carousel.addEventListener('lostpointercapture', releasePointer);

    carousel.addEventListener(
      'click',
      event => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      },
      true
    );

    carousel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      carousel.scrollBy({
        left: event.key === 'ArrowRight' ? carousel.clientWidth * 0.82 : -carousel.clientWidth * 0.82,
        behavior: 'smooth',
      });
      event.preventDefault();
    });
  });
};

const ensureCountryBrandStage = pageCountry => {
  const brandCards = document.getElementById('brand-cards');
  if (!brandCards) return;

  const existingStage = document.querySelector('.country-brand-stage');
  if (existingStage) return;

  const container = brandCards.closest('.container');
  if (!container) return;

  const sectionHead = container.querySelector('.section-head');
  const intro = container.querySelector('.intro');
  const loadMoreWrapper = container.querySelector('.load-more-wrapper');

  const stage = document.createElement('div');
  stage.className = 'country-brand-stage';
  stage.innerHTML = `
    <div class="country-brand-main"></div>
  `;

  const main = stage.querySelector('.country-brand-main');
  const insertionPoint = sectionHead || intro || brandCards;
  container.insertBefore(stage, insertionPoint ?? null);

  [sectionHead, intro, brandCards, loadMoreWrapper].forEach(node => {
    if (node) {
      main.appendChild(node);
    }
  });
};

const applyCountryHeroConcept = () => {
  const hero = document.querySelector('body[data-country] .hero');
  const heroContent = hero?.querySelector(':scope > .hero-content');
  const stage = document.querySelector('.country-brand-stage');
  const brandMain = stage?.querySelector('.country-brand-main');
  const brandSide = stage?.querySelector('.country-brand-side');
  if (!hero || !heroContent || !stage || !brandMain) return;

  const inlineFlag = heroContent.querySelector('.hero-flag');
  document.querySelectorAll('.country-brand-summary').forEach(summary => summary.remove());

  let rail = hero.querySelector(':scope > .country-hero-rail');
  if (!rail) {
    rail = document.createElement('div');
    rail.className = 'country-hero-rail';
    hero.prepend(rail);
  }

  hero.classList.add('country-hero-with-cards');
  brandMain.classList.add('country-hero-cards');
  brandMain.querySelector('.country-card-flag')?.remove();

  if (inlineFlag) {
    const cardFlag = inlineFlag.cloneNode(true);
    cardFlag.classList.remove('hero-flag');
    cardFlag.classList.add('country-card-flag');
    cardFlag.setAttribute('aria-hidden', 'true');
    cardFlag.alt = '';
    brandMain.prepend(cardFlag);
  }

  rail.appendChild(heroContent);

  if (brandSide) {
    brandSide.classList.add('country-hero-side');
    rail.appendChild(brandSide);
  }

  hero.appendChild(brandMain);

  const contentSection = stage.closest('section.content');
  const contentContainer = contentSection?.querySelector(':scope > .container');
  stage.remove();

  if (contentSection && (!contentContainer || !contentContainer.children.length)) {
    contentSection.remove();
  } else {
    contentSection?.classList.add('country-brand-content-empty');
  }
};

const renderCountryNewReviews = pageCountry => {
  const container = document.getElementById('country-new-reviews');
  if (!container || !pageCountry) return;

  const sidebar = container.closest('.country-new-reviews');
  const matchingBrands = BRANDS.filter(
    brand =>
      brand.hasDetailPage &&
      brand.urlDetail &&
      brand.image &&
      brand.countries?.some(code => code.toUpperCase() === pageCountry)
  );

  const reviewBrands = [...matchingBrands].reverse();

  if (!reviewBrands.length) {
    sidebar?.remove();
    return;
  }

  container.innerHTML = reviewBrands
    .map(brand => {
      const detailUrl = normalizePagePath(brand.urlDetail);
      const imageUrl = normalizeAssetPath(brand.image);
      const bonus = normalizeText(brand.bonus || 'Fresh review with updated bonus and payment details.');
      const compactBonus = bonus.replace(/\s+/g, ' ').trim();

      return `
        <a class="home-link-card" href="${detailUrl}">
          <span class="home-link-brand">
            <img class="home-link-logo" src="${imageUrl}" alt="${normalizeText(brand.name)} logo" loading="lazy" decoding="async"${getBrandBackgroundStyle(brand)} />
            <strong>${normalizeText(brand.name)}</strong>
          </span>
          <span>${compactBonus}</span>
        </a>
      `;
    })
    .join('');
};

const getBrandSnapshotName = () => {
  const heading = document.querySelector('.hero h1, .hero-content h1, h1');
  if (!heading) return 'This brand';
  return normalizeText(heading.textContent).replace(/\s+Review$/i, '').trim() || 'This brand';
};

const initStickyBrandTitle = () => {
  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (!brandKey) return;
  const brand = findBrandByPageKey(brandKey);
  const isBlocked = Boolean(brand?.notRecommended);

  const source = document.querySelector('.brand-sticky-aside') || document.querySelector('.hero');
  const heading = source?.querySelector('h1');
  const brandLogo = source?.querySelector('.brand-logo');
  const heroCta = source?.querySelector('a.cta-brands[href]');
  const header = document.querySelector('.header');
  if (!source || !heading || !header) return;
  if (document.querySelector('.brand-sticky-title')) return;

  const titleText = normalizeText(heading.textContent).trim();
  if (!titleText) return;

  const casinoHref = heroCta?.getAttribute('href')?.trim() || '';
  if (!casinoHref && !isBlocked) return;

  const brandLogoSrc = brandLogo?.getAttribute('src') || '';
  const brandLogoMarkup = brandLogoSrc
    ? `
      <span class="brand-sticky-title__brand" aria-hidden="true">
        <img
          class="brand-sticky-title__brand-logo"
          src="${brandLogoSrc}"
          alt="${titleText} logo"
        />
      </span>
    `
    : '';

  const stickyTitle = document.createElement(isBlocked ? 'div' : 'a');
  stickyTitle.className = 'brand-sticky-title';
  if (isBlocked) {
    stickyTitle.classList.add('is-not-recommended');
    stickyTitle.setAttribute('role', 'status');
    stickyTitle.setAttribute('aria-label', `${titleText} is not recommended`);
  } else {
    stickyTitle.href = casinoHref;
    stickyTitle.target = heroCta?.getAttribute('target') || '_blank';
    stickyTitle.rel = heroCta?.getAttribute('rel') || 'noopener noreferrer nofollow sponsored';
    stickyTitle.setAttribute('aria-label', `Visit ${titleText}`);
  }
  stickyTitle.innerHTML = `
    <div class="brand-sticky-title__inner">
      ${brandLogoMarkup}
      <span class="brand-sticky-title__text">${titleText}</span>
      <span class="brand-sticky-title__cta${isBlocked ? ' cta-blocked' : ''}">
        Visit Casino
      </span>
    </div>
  `;

  document.body.appendChild(stickyTitle);

  const updateStickyVisibility = () => {
    const headerHeight = header.offsetHeight || 0;
    const headingBottom = heading.getBoundingClientRect().bottom;
    const shouldShow = headingBottom <= headerHeight + 16;
    stickyTitle.classList.toggle('is-visible', shouldShow);
  };

  updateStickyVisibility();

  window.addEventListener('scroll', updateStickyVisibility, { passive: true });
  window.addEventListener('resize', updateStickyVisibility);
};

const normalizeFinalBrandCtaLabels = () => {
  document
    .querySelectorAll('body[data-brand] .final-cta-glass a.cta-brands')
    .forEach(link => {
      link.textContent = 'Claim Bonus & Play';
    });
};

const getShortBrandSectionLabel = title => {
  const normalizedTitle = normalizeText(title);
  const lowerTitle = normalizedTitle.toLowerCase();

  if (lowerTitle.includes('why players choose')) return 'Highlights';
  if (lowerTitle.includes('available countries')) return 'Countries';
  if (lowerTitle.includes('payment')) return 'Payments';
  if (
    lowerTitle.includes('games') ||
    lowerTitle.includes('slots') ||
    lowerTitle.includes('live betting') ||
    lowerTitle.includes('betting snapshot')
  ) return 'Games';
  if (lowerTitle.includes('bonus') || lowerTitle.includes('promotion')) return 'Bonuses';
  if (lowerTitle.includes('checklist')) return 'Checklist';
  if (lowerTitle.includes('licensing') || lowerTitle.includes('trust')) return 'Trust';
  if (lowerTitle.includes('faq')) return 'FAQ';
  if (lowerTitle.includes('pros') && lowerTitle.includes('cons')) return 'Pros & Cons';
  if (lowerTitle.includes('suits')) return 'Best For';

  return normalizedTitle.replace(/\s+Review$/i, '').split(/[,&:|]/)[0].trim().slice(0, 18);
};

const initBrandSectionNav = () => {
  const heroContent =
    document.querySelector('body[data-brand] .brand-sticky-aside .hero-content') ||
    document.querySelector('body[data-brand] .hero-content');
  const reviewRoot =
    document.querySelector('body[data-brand] .brand-sticky-main') ||
    document.querySelector('body[data-brand] main.content-review') ||
    document.querySelector('body[data-brand]');
  if (!heroContent || !reviewRoot || heroContent.querySelector('.brand-section-nav')) return;

  const titleSelector = [
    '.brand-hero-why > .title',
    '.brand-countries > .title',
    '.brand-payments > .title',
    '.brand-availability-widget .title',
    '.content-review > section > .title',
    '.content-review > section > h2',
    '.content-article > section > .title',
    '.content-article > section > h2',
    '.final-cta-glass .title',
  ].join(', ');

  const seenLabels = new Set();
  const headings = Array.from(reviewRoot.querySelectorAll(titleSelector))
    .map(heading => {
      const text = normalizeText(heading.textContent).trim();
      const label = getShortBrandSectionLabel(text);
      return { heading, text, label };
    })
    .filter(item => item.text && item.label && !seenLabels.has(item.label) && seenLabels.add(item.label))
    .slice(0, 9);

  if (headings.length < 2) return;

  headings.forEach(({ heading, label }, index) => {
    if (!heading.id) {
      const baseId = slugifyText(label || heading.textContent) || `brand-section-${index + 1}`;
      let nextId = baseId;
      let suffix = 2;
      while (document.getElementById(nextId)) {
        nextId = `${baseId}-${suffix}`;
        suffix += 1;
      }
      heading.id = nextId;
    }
  });

  const nav = document.createElement('nav');
  nav.className = 'brand-section-nav';
  nav.setAttribute('aria-label', 'On this page');
  nav.innerHTML = `
    <div class="brand-section-nav__links">
      ${headings
        .map(
          ({ heading, label }) => `
            <a href="#${escapeHtml(heading.id)}">${escapeHtml(label)}</a>
          `
        )
        .join('')}
    </div>
  `;

  const ctaWrapper = heroContent.querySelector('.hero-cta-wrapper');
  if (ctaWrapper) {
    ctaWrapper.insertAdjacentElement('afterend', nav);
  } else {
    heroContent.appendChild(nav);
  }
};

const initBrandHeroPanels = () => {
  const heroContent = document.querySelector('body[data-brand] .hero-content');
  if (!heroContent || heroContent.dataset.panelsReady === 'true') return;

  const logo = heroContent.querySelector(':scope > .brand-logo-container');
  const nav = heroContent.querySelector(':scope > .brand-section-nav');
  if (!logo) return;

  const logoPanel = document.createElement('div');
  logoPanel.className = 'brand-hero-panel brand-hero-logo-panel';
  logoPanel.appendChild(logo);

  const summaryPanel = document.createElement('div');
  summaryPanel.className = 'brand-hero-panel brand-hero-summary-panel';

  const summaryNodes = Array.from(heroContent.children).filter(child => child !== logo && child !== nav);
  summaryPanel.append(...summaryNodes);

  const panels = [logoPanel, summaryPanel];
  if (nav) {
    const navPanel = document.createElement('div');
    navPanel.className = 'brand-hero-panel brand-hero-nav-panel';
    navPanel.appendChild(nav);
    panels.push(navPanel);
  }

  heroContent.replaceChildren(...panels);
  heroContent.dataset.panelsReady = 'true';
};

const renderSnapshotItems = (items, isAvailable) =>
  items
    .map(
      item => `
        <div class="availability-item ${isAvailable ? 'is-available' : 'is-unavailable'}">
          <img
            src="${isAvailable ? '/icons/ui/confirm-icon.svg' : '/icons/ui/remove-close-round-grey-icon.svg'}"
            alt="${isAvailable ? 'Available section' : 'Unavailable section'}"
            aria-hidden="true"
          />
          <span>${normalizeText(item)}</span>
        </div>
      `
    )
    .join('');

const renderBrandAvailabilityWidget = brandKey => {
  const normalizedKey = brandKey?.toLowerCase();
  const config = normalizedKey ? BRAND_SNAPSHOT_CONFIGS[normalizedKey] : null;
  if (!config || document.querySelector('.brand-availability-widget')) return;

  const paymentSection = document.querySelector('.brand-payments')?.closest('section');
  const reviewRoot = document.querySelector('main.content-review');
  if (!paymentSection || !reviewRoot) return;

  const brandName = getBrandSnapshotName();
  const snapshotIntro =
    document
      .querySelector('meta[name="brand-snapshot-intro"]')
      ?.getAttribute('content')
      ?.trim() || '';
  const section = document.createElement('section');
  section.className = 'container';

  const tabsMarkup = config.tabs
    .map((tab, index) => {
      const tabId = `${normalizedKey}-snapshot-tab-${index + 1}`;
      const panelId = `${normalizedKey}-snapshot-panel-${index + 1}`;
      const availableCount = tab.available.length;
      const unavailableCount = tab.unavailable.length;

      return {
        button: `
          <button
            class="availability-tab ${index === 0 ? 'is-active' : ''}"
            type="button"
            role="tab"
            id="${tabId}"
            aria-selected="${index === 0 ? 'true' : 'false'}"
            aria-controls="${panelId}"
            data-tab-target="${panelId}"
            ${index === 0 ? '' : 'tabindex="-1"'}
          >
            ${normalizeText(tab.label)}
          </button>
        `,
        panel: `
          <div
            class="availability-panel ${index === 0 ? 'is-active' : ''}"
            id="${panelId}"
            role="tabpanel"
            aria-labelledby="${tabId}"
            ${index === 0 ? '' : 'hidden'}
          >
            <div class="availability-grid">
              ${renderSnapshotItems(tab.available, true)}
              ${renderSnapshotItems(tab.unavailable, false)}
            </div>

            <div class="availability-summary">
              <div class="availability-counts">
                <span class="is-available">
                  <img src="/icons/ui/confirm-icon.svg" alt="Available sections" aria-hidden="true" />
                  Visible now: ${availableCount}
                </span>
                <span class="is-unavailable">
                  <img src="/icons/ui/remove-close-round-grey-icon.svg" alt="Unavailable sections" aria-hidden="true" />
                  Not surfaced: ${unavailableCount}
                </span>
              </div>
              <p>${normalizeText(tab.note || `These are the main ${tab.label.toLowerCase()} sections currently visible on the account.`)}</p>
            </div>
          </div>
        `,
      };
    })
    .reduce(
      (acc, item) => {
        acc.buttons.push(item.button);
        acc.panels.push(item.panel);
        return acc;
      },
      { buttons: [], panels: [] }
    );

  section.innerHTML = `
    <div class="brand-availability-widget glass-section">
      <h2 class="title">Games &amp; Betting Snapshot</h2>
      <p class="brand-availability-intro">
        ${normalizeText(
          snapshotIntro ||
            `This section shows which game, live-casino, and betting categories ${brandName} currently highlights, so you can quickly check whether it covers the types of games and betting options you want before you deposit.`
        )}
      </p>

      <div class="availability-tabs" data-tabs>
        <div class="availability-tab-list" role="tablist" aria-label="${normalizeText(brandName)} product snapshot">
          ${tabsMarkup.buttons.join('')}
        </div>
        ${tabsMarkup.panels.join('')}
      </div>
    </div>
  `;

  paymentSection.insertAdjacentElement('afterend', section);
};

const applyBrandInfoPairLayout = () => {
  const countriesBlock = document.querySelector('body[data-brand] .brand-countries');
  const paymentsBlock = document.querySelector('body[data-brand] .brand-payments');
  if (!countriesBlock || !paymentsBlock) return;

  if (
    countriesBlock.closest('.brand-info-pair') &&
    paymentsBlock.closest('.brand-info-pair')
  ) {
    return;
  }

  const countriesSection = countriesBlock.closest('section.container');
  const paymentsSection = paymentsBlock.closest('section.container');
  if (!countriesSection || !paymentsSection) return;

  const pairSection = document.createElement('section');
  pairSection.className = 'container brand-info-pair';

  countriesSection.insertAdjacentElement('beforebegin', pairSection);
  pairSection.append(countriesBlock, paymentsBlock);

  if (countriesSection !== pairSection && !countriesSection.children.length) {
    countriesSection.remove();
  }

  if (
    paymentsSection !== countriesSection &&
    paymentsSection !== pairSection &&
    !paymentsSection.children.length
  ) {
    paymentsSection.remove();
  }
};

const initBrandCountryCollapse = () => {
  const block = document.querySelector('body[data-brand] .brand-countries');
  const countriesEl = document.getElementById('brand-countries');
  if (!block || !countriesEl) return;

  const rowsToShow = 3;
  let toggle = block.querySelector('.brand-country-toggle');

  const syncToggleReference = () => {
    const toggles = Array.from(block.querySelectorAll('.brand-country-toggle'));
    toggle = toggles[0] || null;
    toggles.slice(1).forEach(extraToggle => extraToggle.remove());
    return toggle;
  };

  const updateToggleLabel = () => {
    syncToggleReference();
    if (!toggle) return;
    const isExpanded = block.classList.contains('is-country-expanded');
    toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
    const label = toggle.querySelector('.brand-country-toggle__text');
    if (label) {
      label.textContent = isExpanded ? 'Show fewer countries' : 'Show all countries';
    }
  };

  const ensureToggle = () => {
    syncToggleReference();
    if (toggle) return toggle;

    toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'brand-country-toggle';
    toggle.setAttribute('aria-controls', 'brand-countries');
    toggle.innerHTML = `
      <span class="brand-country-toggle__text">Show all countries</span>
      <span class="brand-country-toggle__icon" aria-hidden="true"></span>
    `;

    toggle.addEventListener('click', () => {
      block.classList.toggle('is-country-expanded');
      updateToggleLabel();
    });

    countriesEl.insertAdjacentElement('afterend', toggle);
    return toggle;
  };

  const reset = () => {
    block.classList.remove('is-country-collapsible', 'is-country-expanded');
    countriesEl.style.removeProperty('--brand-countries-collapsed-height');
    countriesEl.style.removeProperty('--brand-countries-expanded-height');
    block.querySelectorAll('.brand-country-toggle').forEach(countryToggle => countryToggle.remove());
    toggle = null;
  };

  const sync = () => {
    const countryItems = Array.from(countriesEl.querySelectorAll('.flag-container')).filter(
      item => item.offsetParent !== null
    );

    if (!countryItems.length) {
      reset();
      return;
    }

    const rowTops = countryItems
      .map(item => Math.round(item.offsetTop))
      .reduce((tops, top) => {
        if (!tops.some(existingTop => Math.abs(existingTop - top) <= 1)) {
          tops.push(top);
        }
        return tops;
      }, [])
      .sort((a, b) => a - b);

    const expandedHeight = Math.ceil(countriesEl.scrollHeight);
    let collapsedHeight = 0;

    if (rowTops.length > rowsToShow) {
      const visibleRows = rowTops.slice(0, rowsToShow);
      const visibleBottom = countryItems
        .filter(item => visibleRows.some(top => Math.abs(top - Math.round(item.offsetTop)) <= 1))
        .reduce((bottom, item) => Math.max(bottom, item.offsetTop + item.offsetHeight), 0);

      collapsedHeight = Math.ceil(visibleBottom - rowTops[0] + 2);
    } else if (countryItems.length > rowsToShow * 6) {
      const itemHeight = countryItems
        .slice(0, Math.min(countryItems.length, 6))
        .reduce((height, item) => Math.max(height, item.offsetHeight), 0);
      const rowGap = Number.parseFloat(window.getComputedStyle(countriesEl).rowGap) || 12;
      collapsedHeight = Math.ceil(itemHeight * rowsToShow + rowGap * (rowsToShow - 1) + 2);
    } else {
      reset();
      return;
    }

    if (collapsedHeight <= 0 || expandedHeight <= collapsedHeight + 8) {
      reset();
      return;
    }

    countriesEl.style.setProperty('--brand-countries-collapsed-height', `${collapsedHeight}px`);
    countriesEl.style.setProperty('--brand-countries-expanded-height', `${expandedHeight}px`);
    block.classList.add('is-country-collapsible');
    ensureToggle();
    updateToggleLabel();
  };

  const scheduleSync = () => window.requestAnimationFrame(sync);

  scheduleSync();
  window.setTimeout(scheduleSync, 250);

  if (block.dataset.countryCollapseBound === 'true') return;
  block.dataset.countryCollapseBound = 'true';

  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(scheduleSync);
    observer.observe(block);
    observer.observe(countriesEl);
  }

  window.addEventListener('resize', scheduleSync, { passive: true });
};

const enhanceBrandProsCons = () => {
  document.querySelectorAll('body[data-brand] .feature-card > strong').forEach(heading => {
    const label = normalizeText(heading.textContent).trim().toLowerCase();
    if (label !== 'pros' && label !== 'cons') return;
    if (heading.querySelector('.pros-cons-icon')) return;

    const card = heading.closest('.feature-card');
    if (card) {
      card.classList.add(label === 'pros' ? 'is-pros-card' : 'is-cons-card');
      card.closest('.features-grid')?.classList.add('pros-cons-grid');
    }

    heading.classList.add('pros-cons-heading', label === 'pros' ? 'is-pros' : 'is-cons');

    const icon = document.createElement('img');
    icon.className = 'pros-cons-icon';
    icon.src =
      label === 'pros' ? '/icons/ui/addition-color-icon.svg' : '/icons/ui/subtract-color-icon.svg';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');

    heading.prepend(icon);
  });
};

const enhanceFaqBlocks = () => {
  const addQuestionIcon = question => {
    if (question.querySelector('.faq-question-icon')) return;

    question.classList.add('faq-question');

    const icon = document.createElement('img');
    icon.className = 'faq-question-icon';
    icon.src = '/icons/ui/question-mark-circle-icon.svg';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    question.prepend(icon);
  };

  const addAnswerIcon = answer => {
    if (answer.querySelector('.faq-answer-icon')) return;

    answer.classList.add('faq-answer');

    const icon = document.createElement('img');
    icon.className = 'faq-answer-icon';
    icon.src = '/icons/ui/answer-correct-icon.svg';
    icon.alt = '';
    icon.setAttribute('aria-hidden', 'true');
    answer.prepend(icon);
  };

  const enhanceCountryFaqCard = (card, faqGrid, index) => {
    if (card.querySelector(':scope > .faq-accordion-trigger')) return;

    const question = card.querySelector(':scope > h3');
    const answers = Array.from(card.querySelectorAll(':scope > p'));
    if (!question || !answers.length) return;

    addQuestionIcon(question);
    answers.forEach(addAnswerIcon);
    faqGrid.classList.add('faq-accordion-surface');

    const trigger = document.createElement('button');
    trigger.className = 'faq-question faq-accordion-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');

    const questionIcon = question.querySelector(':scope > .faq-question-icon');
    const questionLabel = document.createElement('span');
    questionLabel.className = 'faq-question-label';

    Array.from(question.childNodes).forEach(node => {
      if (node !== questionIcon) questionLabel.append(node);
    });

    if (questionIcon) trigger.append(questionIcon);
    trigger.append(questionLabel);

    const toggle = document.createElement('span');
    toggle.className = 'faq-accordion-toggle';
    toggle.setAttribute('aria-hidden', 'true');
    trigger.append(toggle);

    const answerPanel = document.createElement('div');
    answerPanel.className = 'faq-answer-panel';
    answerPanel.id = `country-faq-answer-${index + 1}`;
    answerPanel.hidden = true;
    trigger.setAttribute('aria-controls', answerPanel.id);
    answers.forEach(answer => answerPanel.append(answer));

    question.replaceWith(trigger);
    card.classList.add('faq-card--accordion');
    card.append(answerPanel);

    const closeOpenCards = () => {
      faqGrid.querySelectorAll('.faq-accordion-trigger[aria-expanded="true"]').forEach(openTrigger => {
        openTrigger.setAttribute('aria-expanded', 'false');
        openTrigger.closest('.faq-card')?.classList.remove('is-open');

        const openPanel = document.getElementById(openTrigger.getAttribute('aria-controls'));
        if (openPanel) openPanel.hidden = true;
      });
    };

    trigger.addEventListener('click', () => {
      const isOpening = trigger.getAttribute('aria-expanded') !== 'true';
      if (isOpening) closeOpenCards();

      trigger.setAttribute('aria-expanded', String(isOpening));
      card.classList.toggle('is-open', isOpening);
      answerPanel.hidden = !isOpening;
    });
  };

  const enhanceBrandFaqTimeline = timeline => {
    if (timeline.dataset.faqAccordionBound === 'true') return;

    timeline.dataset.faqAccordionBound = 'true';
    timeline.classList.add('faq-accordion-surface');

    const groups = [];
    let currentGroup = null;

    Array.from(timeline.children).forEach(child => {
      if (child.matches('h3')) {
        currentGroup = { question: child, answers: [] };
        groups.push(currentGroup);
        return;
      }

      if (currentGroup && child.matches('p')) currentGroup.answers.push(child);
    });

    groups.forEach((group, index) => {
      if (!group.answers.length) return;

      const { question, answers } = group;
      addQuestionIcon(question);
      answers.forEach(addAnswerIcon);

      const card = document.createElement('div');
      card.className = 'faq-card faq-card--accordion';

      const trigger = document.createElement('button');
      trigger.className = 'faq-question faq-accordion-trigger';
      trigger.type = 'button';
      trigger.setAttribute('aria-expanded', 'false');

      const questionIcon = question.querySelector(':scope > .faq-question-icon');
      const questionLabel = document.createElement('span');
      questionLabel.className = 'faq-question-label';

      Array.from(question.childNodes).forEach(node => {
        if (node !== questionIcon) questionLabel.append(node);
      });

      if (questionIcon) trigger.append(questionIcon);
      trigger.append(questionLabel);

      const toggle = document.createElement('span');
      toggle.className = 'faq-accordion-toggle';
      toggle.setAttribute('aria-hidden', 'true');
      trigger.append(toggle);

      const answerPanel = document.createElement('div');
      answerPanel.className = 'faq-answer-panel';
      answerPanel.id = `brand-faq-answer-${index + 1}`;
      answerPanel.hidden = true;
      trigger.setAttribute('aria-controls', answerPanel.id);

      question.replaceWith(card);
      card.append(trigger, answerPanel);
      answers.forEach(answer => answerPanel.append(answer));

      const closeOpenCards = () => {
        timeline.querySelectorAll('.faq-accordion-trigger[aria-expanded="true"]').forEach(openTrigger => {
          openTrigger.setAttribute('aria-expanded', 'false');
          openTrigger.closest('.faq-card')?.classList.remove('is-open');

          const openPanel = document.getElementById(openTrigger.getAttribute('aria-controls'));
          if (openPanel) openPanel.hidden = true;
        });
      };

      trigger.addEventListener('click', () => {
        const isOpening = trigger.getAttribute('aria-expanded') !== 'true';
        if (isOpening) closeOpenCards();

        trigger.setAttribute('aria-expanded', String(isOpening));
        card.classList.toggle('is-open', isOpening);
        answerPanel.hidden = !isOpening;
      });
    });
  };

  document.querySelectorAll('section.container, .content-article').forEach(section => {
    const title = section.querySelector('h2.title');
    const timeline = section.querySelector('.timeline');
    const faqGrid = section.querySelector('.faq-grid');
    if (!title || (!timeline && !faqGrid)) return;

    const titleText = normalizeText(title.textContent).trim().toLowerCase();
    if (!titleText.includes('faq')) return;

    if (document.body.matches('[data-brand]') && timeline) {
      enhanceBrandFaqTimeline(timeline);
      return;
    }

    timeline?.querySelectorAll(':scope > h3').forEach(addQuestionIcon);
    timeline?.querySelectorAll(':scope > p').forEach(addAnswerIcon);

    faqGrid?.querySelectorAll('.faq-card').forEach((card, index) => {
      const question = card.querySelector(':scope > h3');
      const answers = card.querySelectorAll(':scope > p');

      if (document.body.matches('[data-country]')) {
        enhanceCountryFaqCard(card, faqGrid, index);
        return;
      }

      if (question) addQuestionIcon(question);
      answers.forEach(addAnswerIcon);
    });
  });
};

const initCasinosScrollNav = () => {
  if (!document.body.classList.contains('casinos-page')) return null;

  const alphaNav = document.querySelector('.hero .alpha-nav');
  if (!alphaNav) return null;

  const existingNav = document.querySelector('.casino-scroll-nav');
  if (existingNav) return existingNav;

  const scrollNav = document.createElement('nav');
  scrollNav.className = 'casino-scroll-nav';
  scrollNav.setAttribute('aria-label', 'Casino brand letter navigation');

  const alphaClone = alphaNav.cloneNode(true);
  alphaClone.classList.add('alpha-nav--floating');

  const inner = document.createElement('div');
  inner.className = 'casino-scroll-nav__inner';
  inner.appendChild(alphaClone);

  scrollNav.appendChild(inner);
  document.body.appendChild(scrollNav);

  return scrollNav;
};

const initTopCasinosJumpNav = () => {
  if (document.body.dataset.page !== 'top-casinos' || document.querySelector('.top-casino-jump-nav')) {
    return;
  }

  const contentArea = document.querySelector('.content-area');
  const sections = Array.from(document.querySelectorAll('.content[data-country]'));
  if (!contentArea || sections.length < 2) return;

  const links = sections
    .map(section => {
      const code = section.dataset.country?.toUpperCase();
      const country = COUNTRIES.find(item => item.code.toUpperCase() === code);
      const title = country?.name || section.querySelector('.top-country-title')?.textContent.trim() || code;
      const id = `top-${slugifyText(title || code)}`;
      section.id = section.id || id;

      return { country, id: section.id, title };
    })
    .filter(item => item.id && item.title);

  if (links.length < 2) return;

  const nav = document.createElement('nav');
  nav.className = 'top-casino-jump-nav';
  nav.setAttribute('aria-label', 'Jump to country casino lists');
  nav.innerHTML = `
    <div class="top-casino-jump-nav__links">
      ${links
        .map(link => {
          const flag = link.country?.slug
            ? `<img class="flag" src="${iconPath(link.country.slug)}" alt="${escapeHtml(link.title)}" loading="lazy" decoding="async" />`
            : '';
          return `
            <a class="top-casino-jump-link" href="#${escapeHtml(link.id)}">
              ${flag}
              <span>${escapeHtml(link.title)}</span>
            </a>
          `;
        })
        .join('')}
    </div>
  `;

  contentArea.insertAdjacentElement('beforebegin', nav);
};

const applyBrandHeroConcept = () => {
  const hero = document.querySelector('body[data-brand] .hero');
  const heroContent = hero?.querySelector(':scope > .hero-content');
  if (!hero || !heroContent) return;

  const existingWhy = hero.querySelector(':scope > .brand-hero-why');
  if (existingWhy) {
    hero.classList.add('brand-hero-with-why');
    return;
  }

  const whySection = Array.from(
    document.querySelectorAll('body[data-brand] section.features-section')
  ).find(section => {
    const title = section.querySelector(':scope > .title, :scope > h2');
    return /why\s+players\s+choose/i.test(normalizeText(title?.textContent || ''));
  });

  if (!whySection) return;

  whySection.classList.add('brand-hero-why');
  hero.classList.add('brand-hero-with-why');
  hero.appendChild(whySection);
};

const createBrandNewGamesRail = () => {
  const brandKey = normalizeBrandKey(document.body.dataset.brand || '');
  const games = BRAND_NEW_GAMES[brandKey] || [];
  if (!games.length) return null;

  const playNowLink = document.querySelector(
    'body[data-brand] .brand-sticky-aside .hero-cta-wrapper a.cta-brands[href], body[data-brand] .hero-cta-wrapper a.cta-brands[href]'
  );
  const casinoHref = playNowLink?.getAttribute('href') || '';
  const cardMarkup = game => {
    const cardContent = `
      <img
        src="${escapeHtml(game.image)}"
        alt="${escapeHtml(game.name)} at ${escapeHtml(document.body.dataset.brand)}"
        loading="lazy"
        decoding="async"
      />
      <span>${escapeHtml(game.name)}</span>
    `;

    if (!casinoHref) return `<article class="brand-new-game-card">${cardContent}</article>`;

    return `
      <a
        class="brand-new-game-card"
        href="${escapeHtml(casinoHref)}"
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        aria-label="Play ${escapeHtml(game.name)} at ${escapeHtml(document.body.dataset.brand)}"
      >
        ${cardContent}
      </a>
    `;
  };

  const rail = document.createElement('aside');
  rail.className = 'brand-new-games-rail';
  rail.setAttribute('aria-label', 'New games');
  rail.innerHTML = `
    <div class="brand-new-games-panel">
      <div class="brand-new-games-heading">
        <span class="brand-new-games-kicker">LATEST RELEASES</span>
        <h2>New Games</h2>
      </div>
      <div class="brand-new-games-list">
        ${games.map(cardMarkup).join('')}
      </div>
    </div>
  `;

  return rail;
};

const applyBrandStickyReviewLayout = () => {
  const hero = document.querySelector('body[data-brand] .hero');
  const heroContent = hero?.querySelector(':scope > .hero-content');
  const allCountries = document.querySelector('body[data-brand] .all-countries');
  if (!hero || !heroContent || !allCountries || document.querySelector('.brand-sticky-review-layout')) {
    return;
  }

  const layout = document.createElement('section');
  layout.className = 'container brand-sticky-review-layout';

  const aside = document.createElement('aside');
  aside.className = 'brand-sticky-aside';

  const main = document.createElement('div');
  main.className = 'brand-sticky-main';

  hero.insertAdjacentElement('beforebegin', layout);
  aside.appendChild(heroContent);

  Array.from(hero.children).forEach(child => {
    main.appendChild(child);
  });

  let sibling = hero.nextElementSibling;
  while (sibling && sibling !== allCountries) {
    const nextSibling = sibling.nextElementSibling;
    main.appendChild(sibling);
    sibling = nextSibling;
  }

  layout.append(aside, main);
  const newGamesRail = createBrandNewGamesRail();
  if (newGamesRail) layout.appendChild(newGamesRail);
  hero.remove();
  document.body.classList.add('has-brand-sticky-layout');
  document.documentElement.classList.add('has-brand-sticky-layout');
};

const applyBrandLogoBackgrounds = () => {
  const byDetailPath = new Map();
  const byName = new Map();

  BRANDS.forEach(brand => {
    const color = normalizeBrandColor(brand.bgColor);
    if (!color) return;

    const detailPath = normalizePagePath(brand.urlDetail || '');
    if (detailPath) byDetailPath.set(detailPath, brand);

    const nameKey = normalizeBrandKey(brand.name);
    if (nameKey && !byName.has(nameKey)) byName.set(nameKey, brand);
  });

  const findBrandByLinkOrName = (link, name) => {
    const href = link?.getAttribute('href') || '';
    const path = href ? normalizePagePath(href) : '';
    return byDetailPath.get(path) || byName.get(normalizeBrandKey(name));
  };

  document.querySelectorAll('.casino-card').forEach(card => {
    const detailLink = card.querySelector('.cta-secondary[href]');
    const name = card.querySelector('.casino-name')?.textContent || '';
    const brand = findBrandByLinkOrName(detailLink, name);
    setBrandBackground(card, brand?.bgColor);
  });

  document.querySelectorAll('body.casinos-page .casino-list-row').forEach(row => {
    const detailLink = row.querySelector('.casino-name a[href], .casino-list-logo a[href]');
    const name = row.querySelector('.casino-name')?.textContent || '';
    const brand = findBrandByLinkOrName(detailLink, name);
    setBrandBackground(row, brand?.bgColor);
    setBrandBackground(row.querySelector('.casino-list-logo'), brand?.bgColor);
  });

  document.querySelectorAll('.home-link-card').forEach(card => {
    const detailLink = card.matches('a[href]') ? card : card.querySelector('a[href]');
    const name = card.querySelector('.home-link-brand strong')?.textContent || '';
    const brand = findBrandByLinkOrName(detailLink, name);
    setBrandBackground(card, brand?.bgColor);
    setBrandBackground(card.querySelector('.home-link-logo'), brand?.bgColor);
  });

  const brandLogoContainer = document.querySelector('body[data-brand] .brand-logo-container.hero-logo');
  if (brandLogoContainer) {
    const brandName =
      document.body.dataset.brand ||
      document.querySelector('body[data-brand] .hero h1, body[data-brand] .hero-content h1, body[data-brand] h1')?.textContent ||
      '';
    const brand =
      findBrandByPageKey(document.body.dataset.brand) ||
      byName.get(normalizeBrandKey(brandName.replace(/\s+Review$/i, '')));
    setBrandBackground(brandLogoContainer, brand?.bgColor);
  }
};

const initBrandWhyPreview = () => {
  const preview = document.querySelector('body[data-brand] .brand-why-media');
  const heading = preview?.closest('.brand-why-heading');
  if (!preview || !heading || preview.dataset.bound === 'true') return;

  preview.dataset.bound = 'true';

  const setExpanded = expanded => {
    heading.classList.toggle('is-expanded', expanded);
    preview.setAttribute('aria-expanded', String(expanded));
    preview.setAttribute(
      'aria-label',
      expanded ? 'Collapse casino screenshot' : 'Expand casino screenshot'
    );
  };

  const mobileQuery = window.matchMedia('(max-width: 768px)');
  const syncMobilePreviewState = () => {
    const isMobile = mobileQuery.matches;
    preview.disabled = isMobile;
    preview.tabIndex = isMobile ? -1 : 0;

    if (isMobile) setExpanded(false);
  };

  preview.addEventListener('click', () => {
    if (mobileQuery.matches) return;

    setExpanded(preview.getAttribute('aria-expanded') !== 'true');
  });

  preview.addEventListener('keydown', event => {
    if (event.key !== 'Escape' || preview.getAttribute('aria-expanded') !== 'true') return;

    setExpanded(false);
    preview.focus();
  });

  syncMobilePreviewState();
  mobileQuery.addEventListener?.('change', syncMobilePreviewState);
};

// =====================
// INIT FUNCTION
// =====================
export const initCasinoPage = () => {
  const pageType = document.body.dataset.page;
  const pageCountry = document.body.dataset.country?.toUpperCase();
  const siteCountryCountEl = document.getElementById('siteCountryCount');
  const siteBrandCountEl = document.getElementById('siteBrandCount');

  initFooterThemeSettings();
  window.addEventListener('resize', requestPaymentIconSync, { passive: true });
  document.addEventListener(
    'load',
    event => {
      if (event.target instanceof HTMLImageElement && event.target.closest('.payment-icons')) {
        requestPaymentIconSync();
      }
    },
    true
  );

  if (siteCountryCountEl) {
    siteCountryCountEl.textContent = COUNTRIES.length.toString();
  }

  if (siteBrandCountEl) {
    const uniqueBrandCount = new Set(
      BRANDS.map(brand => normalizeText(brand.name).trim()).filter(Boolean)
    ).size;
    siteBrandCountEl.textContent = uniqueBrandCount.toString();
  }

  initHomeNewBrandsCarousel();
  applyBrandLogoBackgrounds();
  applyNotRecommendedCasinoRows();
  applyBrandHeroConcept();
  applyBrandStickyReviewLayout();
  initBrandWhyPreview();

  if (pageCountry) {
    ensureCountryBrandStage(pageCountry);
    initCountryGuideCarousels();
    applyCountryHeroConcept();
    const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));

    initCountryBrandFilters(pageCountry, brands, filteredBrands => {
      renderBrandList(filteredBrands, '#brand-cards', 'No casinos match this filter yet.');
      applyBrandLogoBackgrounds();
      requestPaymentIconSync();
    });
    renderBrandList(brands, '#brand-cards', 'No casinos available for this country.');
    applyBrandLogoBackgrounds();
  }

  if (pageType === 'exclusive-offers') {
    renderBrandList(
      BRANDS.filter(b => b.isExclusive),
      '#exclusive-cards',
      'No exclusive offers available at the moment.'
    );
  }

  if (pageType === 'new-casinos') {
    renderBrandList(
      BRANDS.filter(b => b.isNew),
      '#brand-cards',
      'No new casinos available at the moment.'
    );
  }

  if (pageType === 'top-rated') {
    renderBrandList(
      BRANDS.filter(b => b.isTopRated),
      '#top-rated-cards',
      'No top rated casinos available at the moment.'
    );
  }

  enhanceFaqBlocks();

  document.querySelectorAll('.content[data-country]').forEach(section => {
    const code = section.dataset.country?.toUpperCase();
    if (!code) return;

    const titleEl = section.querySelector('.top-country-title');
    const grid = section.querySelector('.casino-grid');
    const viewAllWrapper = section.querySelector('.view-all-wrapper');
    const viewAllLink = section.querySelector('.view-all');
    if (!titleEl || !grid) return;

    const country = COUNTRIES.find(c => c.code.toUpperCase() === code);
    const limit = Number(grid.dataset.limit) || 4;

    titleEl.textContent = `Top ${country?.name || code} Casinos`;

    const topBrands = BRANDS.filter(b => b.top?.includes(code) && b.countries?.includes(code));
    const needsTopCasinosFill = document.body.dataset.page === 'top-casinos' && topBrands.length < limit;
    const countryFillBrands = needsTopCasinosFill
      ? BRANDS.filter(b => b.countries?.includes(code) && !topBrands.includes(b))
      : [];
    const renderedBrands = [...topBrands, ...countryFillBrands].slice(0, limit);

    if (!renderedBrands.length) {
      grid.innerHTML = `<p>No top casinos available.</p>`;
    } else {
      const fragment = document.createDocumentFragment();
      renderedBrands.forEach(b => fragment.appendChild(createCasinoCard(b)));
      grid.replaceChildren(fragment);
      requestPaymentIconSync();
    }

    if (country && viewAllWrapper && viewAllLink) {
      viewAllWrapper.hidden = false;
      viewAllLink.href = countryPagePath(country.slug);
    }
  });

  initTopCasinosJumpNav();

  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (brandKey) {
    normalizeFinalBrandCtaLabels();
    initStickyBrandTitle();
    enhanceBrandProsCons();
    applyBrandInfoPairLayout();
    renderBrandAvailabilityWidget(brandKey);

    const brand = findBrandByPageKey(brandKey);

    if (brand) {
      const countriesEl = document.getElementById('brand-countries');
      const paymentsEl = document.getElementById('brand-payments');

      if (countriesEl && brand.countries?.length) {
        countriesEl.innerHTML = brand.countries
          .map(code => {
            const c = COUNTRIES.find(x => x.code.toLowerCase() === code.toLowerCase());
            if (!c) return '';
            return `
              <a class="flag-container" href="${countryPagePath(c.slug)}" aria-label="${normalizeText(c.name)} casino guide">
                <img class="hero-flag" src="${iconPath(c.slug)}" alt="${normalizeText(c.name)}" loading="lazy" decoding="async"/>
                <span>${normalizeText(c.name)}</span>
              </a>
            `;
          })
          .join('');
        initBrandCountryCollapse();
      }

      const availablePayments = (brand.payments || []).filter(Boolean);

      if (paymentsEl && availablePayments.length) {
        paymentsEl.innerHTML = availablePayments
          .map(
            p =>
              `<div class="payments">
                <img src="${paymentPath(p)}" alt="${normalizeText(p)}" loading="lazy" decoding="async"/>
              </div>`
          )
          .join('');
      }

      applyNotRecommendedBrandPage(brand);
    }

    initBrandSectionNav();
    initBrandHeroPanels();
    applyBrandStickyReviewLayout();
    initBrandCountryCollapse();
  }

  const promoCopyBoxes = document.querySelectorAll('[data-copy-code]');
  if (promoCopyBoxes.length) {
    const fallbackCopy = code => {
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'absolute';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    };

    promoCopyBoxes.forEach(trigger => {
      const code = trigger.dataset.copyCode?.trim();
      const promoBox = trigger.closest('.promo-copy-box');
      const title = promoBox?.querySelector('.promo-copy-title');
      const feedback = promoBox?.querySelector('.promo-copy-feedback');
      let resetTimer;

      const setCopiedState = copied => {
        trigger.classList.toggle('copied', copied);
        if (title) title.classList.toggle('copied', copied);
        if (feedback) feedback.classList.toggle('visible', copied);
      };

      const triggerCopy = async () => {
        if (!code) return;

        try {
          if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(code);
          } else {
            fallbackCopy(code);
          }
        } catch {
          fallbackCopy(code);
        }

        window.clearTimeout(resetTimer);
        setCopiedState(true);
        resetTimer = window.setTimeout(() => setCopiedState(false), 1600);
      };

      trigger.addEventListener('click', event => {
        triggerCopy();
      });

      trigger.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          triggerCopy();
        }
      });
    });
  }

  const countriesDropdown = document.getElementById('countriesDropdown');
  if (countriesDropdown) {
    countriesDropdown.innerHTML = COUNTRIES.map(
      c => `
        <a href="${countryPagePath(c.slug)}">
          <img class="flag" src="${iconPath(c.slug)}" alt="${normalizeText(c.name)}" loading="lazy" decoding="async"/>
          ${normalizeText(c.name)}
        </a>
      `
    ).join('');

    const syncCountriesDropdownFlow = () => {
      const columnGap = Number.parseFloat(getComputedStyle(countriesDropdown).columnGap) || 0;
      const minimumColumnWidth = 136;
      const columnCount = Math.max(
        1,
        Math.floor(
          (countriesDropdown.clientWidth + columnGap) / (minimumColumnWidth + columnGap)
        )
      );
      const rowCount = Math.ceil(COUNTRIES.length / Math.max(columnCount, 1));

      countriesDropdown.style.setProperty('--countries-dropdown-rows', rowCount);
    };

    requestAnimationFrame(syncCountriesDropdownFlow);
    window.addEventListener('resize', syncCountriesDropdownFlow, { passive: true });
  }

  const navDropdown = document.querySelector('.nav-dropdown');
  const navDropdownLink = navDropdown?.querySelector('.nav-dropdown-link');
  const navDropdownMenu = navDropdown?.querySelector('.nav-dropdown-menu');
  const desktopNavHeader = document.querySelector('.header');
  const desktopNavHeaderInner = document.querySelector('.header-inner');

  navDropdownLink?.querySelector('.nav-dropdown-icon')?.remove();

  initDesktopSiteSearch();
  ensureFooterBlogLink();
  const desktopSearch = desktopNavHeaderInner?.querySelector('.site-search--desktop');
  const desktopSearchTrigger = desktopNavHeaderInner?.querySelector('.site-search-trigger--desktop');
  const desktopSearchInput = desktopSearch?.querySelector('.site-search-input');
  syncFooterBrandDirectory();

  let closeDesktopCountries = () => {};
  let closeDesktopSearch = () => {};

  if (
    desktopSearch &&
    desktopSearchTrigger &&
    desktopSearchInput &&
    desktopNavHeader &&
    desktopNavHeaderInner &&
    typeof window.matchMedia === 'function'
  ) {
    const desktopSearchMedia = window.matchMedia('(min-width: 1025px)');
    let searchHeightTimerId = null;
    let searchFocusTimerId = null;

    const syncSearchHeaderHeight = () => {
      window.clearTimeout(searchHeightTimerId);
      window.requestAnimationFrame(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      });
      searchHeightTimerId = window.setTimeout(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      }, 320);
    };

    const syncSearchState = isOpen => {
      const nextOpen = Boolean(isOpen && desktopSearchMedia.matches);
      window.clearTimeout(searchFocusTimerId);
      if (nextOpen) closeDesktopCountries();
      desktopNavHeader.classList.toggle('search-expanded', nextOpen);
      desktopNavHeaderInner.classList.toggle('search-expanded', nextOpen);
      desktopSearchTrigger.classList.toggle('is-active', nextOpen);
      desktopSearchTrigger.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      desktopSearchTrigger.setAttribute('aria-label', nextOpen ? 'Close search' : 'Open search');
      desktopSearch.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');

      if (nextOpen) {
        searchFocusTimerId = window.setTimeout(() => {
          desktopSearchInput.focus({ preventScroll: true });
        }, 220);
      } else {
        desktopSearchInput.blur();
      }

      syncSearchHeaderHeight();
    };

    closeDesktopSearch = () => syncSearchState(false);
    syncSearchState(false);

    desktopSearchTrigger.addEventListener('click', () => {
      syncSearchState(!desktopNavHeader.classList.contains('search-expanded'));
    });

    desktopSearch.addEventListener('transitionend', syncSearchHeaderHeight);

    document.addEventListener('click', event => {
      if (!desktopNavHeader.classList.contains('search-expanded')) return;
      if (event.target instanceof Node && desktopNavHeader.contains(event.target)) return;
      closeDesktopSearch();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDesktopSearch();
    });

    window.addEventListener('scroll', () => {
      if (desktopNavHeader.classList.contains('search-expanded')) closeDesktopSearch();
    }, { passive: true });

    window.addEventListener('resize', syncSearchHeaderHeight);

    if (typeof desktopSearchMedia.addEventListener === 'function') {
      desktopSearchMedia.addEventListener('change', () => {
        syncSearchState(false);
      });
    } else if (typeof desktopSearchMedia.addListener === 'function') {
      desktopSearchMedia.addListener(() => {
        syncSearchState(false);
      });
    }
  }

  if (
    navDropdown &&
    navDropdownLink &&
    navDropdownMenu &&
    desktopNavHeader &&
    desktopNavHeaderInner &&
    typeof window.matchMedia === 'function'
  ) {
    const desktopDropdownMedia = window.matchMedia('(min-width: 1025px)');
    let headerHeightTimerId = null;
    let expandedSettleTimerId = null;

    navDropdownLink.removeAttribute('href');
    navDropdownLink.setAttribute('role', 'button');
    navDropdownLink.setAttribute('tabindex', '0');
    navDropdownLink.setAttribute('aria-controls', navDropdownMenu.id || 'countriesDropdown');
    navDropdownMenu.classList.add('nav-dropdown-menu--expanded-header');

    if (navDropdownMenu.parentElement !== desktopNavHeaderInner) {
      desktopNavHeaderInner.append(navDropdownMenu);
    }

    const syncExpandedHeaderHeight = () => {
      window.clearTimeout(headerHeightTimerId);
      window.requestAnimationFrame(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      });
      headerHeightTimerId = window.setTimeout(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      }, 320);
    };

    const syncDropdownState = isOpen => {
      const nextOpen = Boolean(isOpen && desktopDropdownMedia.matches);
      window.clearTimeout(expandedSettleTimerId);
      if (nextOpen) closeDesktopSearch();
      navDropdown.classList.toggle('is-open', nextOpen);
      desktopNavHeader.classList.toggle('countries-expanded', nextOpen);
      desktopNavHeader.classList.remove('countries-expanded-settled');
      desktopNavHeaderInner.classList.toggle('countries-expanded', nextOpen);
      navDropdownLink.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      navDropdownMenu.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
      if (nextOpen) {
        expandedSettleTimerId = window.setTimeout(() => {
          desktopNavHeader.classList.add('countries-expanded-settled');
        }, 380);
      }
      syncExpandedHeaderHeight();
    };

    const toggleDropdown = () => {
      syncDropdownState(!desktopNavHeader.classList.contains('countries-expanded'));
    };

    const closeDropdown = () => {
      syncDropdownState(false);
    };

    closeDesktopCountries = closeDropdown;
    syncDropdownState(false);

    navDropdownLink.addEventListener('click', event => {
      event.preventDefault();
      if (!desktopDropdownMedia.matches) return;
      toggleDropdown();
    });

    navDropdownLink.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!desktopDropdownMedia.matches) return;
      toggleDropdown();
    });

    document.addEventListener('click', event => {
      if (!desktopNavHeader.classList.contains('countries-expanded')) return;
      if (event.target instanceof Node && desktopNavHeader.contains(event.target)) return;
      closeDropdown();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDropdown();
    });

    navDropdownMenu.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a')) closeDropdown();
    });

    navDropdownMenu.addEventListener('transitionend', syncExpandedHeaderHeight);

    window.addEventListener('scroll', () => {
      if (desktopNavHeader.classList.contains('countries-expanded')) closeDropdown();
    }, { passive: true });

    window.addEventListener('resize', syncExpandedHeaderHeight);

    window.addEventListener('load', syncExpandedHeaderHeight, { once: true });

    if (document.fonts?.ready) {
      document.fonts.ready.then(syncExpandedHeaderHeight).catch(() => {});
    }

    if (typeof desktopDropdownMedia.addEventListener === 'function') {
      desktopDropdownMedia.addEventListener('change', () => {
        syncDropdownState(false);
      });
    } else if (typeof desktopDropdownMedia.addListener === 'function') {
      desktopDropdownMedia.addListener(() => {
        syncDropdownState(false);
      });
    }
  }

  document.querySelector('.all-countries .countries-cloud')?.replaceChildren(
    ...COUNTRIES.map(c => {
      const a = document.createElement('a');
      a.href = countryPagePath(c.slug);
      a.className = 'country-link';
      a.innerHTML = `
        <img class="flag" src="${iconPath(c.slug)}" alt="${normalizeText(c.name)}" loading="lazy" decoding="async">
        <span>${normalizeText(c.name)}</span>
      `;
      return a;
    })
  );

  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = mobileMenu?.querySelector('.mobile-overlay');
  const closeButtons = mobileMenu?.querySelectorAll('[data-action="close"]');
  const body = document.body;

  if (burger && mobileMenu) {
    const mobileMenuInner = mobileMenu.querySelector('.mobile-menu-inner');
    if (!mobileMenuInner) return;

    mobileMenuInner.innerHTML = `
    <button class="submenu-toggle" aria-expanded="false">Countries</button>
    <a href="${pagePath('top-casinos.html')}">Top Casinos</a>
    <a href="${pagePath('new-casinos.html')}">New Casinos</a>
    <a href="${pagePath('top-rated.html')}">Top Rated</a>
    <a href="${pagePath('exclusive-offers.html')}">Exclusive</a>
    <button type="button" class="mobile-theme-settings" data-theme-settings-trigger aria-haspopup="dialog">Settings</button>
  `;

    const submenuToggle = mobileMenuInner.querySelector('.submenu-toggle');
    if (!submenuToggle) return;

    if (!mobileMenuInner.querySelector('.site-search')) {
      mobileMenuInner.prepend(createSiteSearch('mobile'));
    }

    const countriesSubmenu = document.createElement('div');
    countriesSubmenu.className = 'mobile-submenu';
    countriesSubmenu.innerHTML = COUNTRIES.map(
      c => `
    <a href="${countryPagePath(c.slug)}">
      <img class="flag" src="${iconPath(c.slug)}" alt="${normalizeText(c.name)}" loading="lazy" decoding="async"/>
      ${normalizeText(c.name)}
    </a>
  `
    ).join('');

    mobileMenuInner.insertBefore(countriesSubmenu, submenuToggle.nextSibling);

    submenuToggle.addEventListener('click', () => {
      const expanded = submenuToggle.getAttribute('aria-expanded') !== 'true';
      submenuToggle.setAttribute('aria-expanded', String(expanded));
      submenuToggle.classList.toggle('active', expanded);
      countriesSubmenu.style.maxHeight = expanded ? `${countriesSubmenu.scrollHeight}px` : '0px';
    });

    function openMenu() {
      mobileMenu.classList.add('open');
      burger.classList.add('active');
      body.classList.add('menu-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
    }

    function closeMenu() {
      mobileMenu.classList.remove('open');
      burger.classList.remove('active');
      body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');

      submenuToggle.classList.remove('active');
      submenuToggle.setAttribute('aria-expanded', 'false');
      countriesSubmenu.style.maxHeight = '0px';
    }

    burger.addEventListener('click', () => {
      if (window.innerWidth > 1024) return;
      mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
    });

    overlay?.addEventListener('click', closeMenu);
    closeButtons?.forEach(btn => btn.addEventListener('click', closeMenu));

    mobileMenuInner.addEventListener('click', e => {
      if (e.target.closest('.mobile-submenu')) return;
      if (e.target.closest('a')) closeMenu();
      if (e.target.closest('[data-theme-settings-trigger]')) closeMenu();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('open')) closeMenu();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && mobileMenu.classList.contains('open')) closeMenu();
    });
  }

  window.addEventListener('load', () => {
    const loader = document.getElementById('globalLoader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 300);
  });

  const header = document.querySelector('.header');
  const casinosScrollNav = initCasinosScrollNav();
  const syncHeaderHeight = () => {
    syncHeaderFlowMetrics(header);
  };

  syncHeaderHeight();

  if (header) {
    let lastScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

    if ('ResizeObserver' in window) {
      new ResizeObserver(syncHeaderHeight).observe(header);
    }

    const updateScrollChrome = () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = current > lastScroll;
      const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
      const shouldHide = !isDesktop && isScrollingDown && current > 100;
      const shouldShowScrollNav = Boolean(casinosScrollNav) && !shouldHide && current > 280;

      header.classList.toggle('hidden', shouldHide);
      document.body.classList.toggle('header-is-hidden', shouldHide);
      document.body.classList.toggle('scroll-controls-visible', shouldShowScrollNav);
      casinosScrollNav?.classList.toggle('is-visible', shouldShowScrollNav);

      lastScroll = Math.max(current, 0);
    };

    updateScrollChrome();

    window.addEventListener('scroll', updateScrollChrome, { passive: true });
    window.addEventListener('resize', () => {
      syncHeaderHeight();
      updateScrollChrome();
    });
  }

  const scrollToAnchor = hash => {
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    const headerHeight = header?.offsetHeight ?? 0;
    const scrollNavHeight = casinosScrollNav?.classList.contains('is-visible')
      ? casinosScrollNav.offsetHeight
      : 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - scrollNavHeight - 12;
    window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
  };

  document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(link => {
    link.addEventListener('click', event => {
      const hash = link.getAttribute('href');
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      event.preventDefault();
      scrollToAnchor(hash);
      history.replaceState(null, '', hash);
    });
  });

  if (window.location.hash) {
    requestAnimationFrame(() => scrollToAnchor(window.location.hash));
  }

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.setAttribute('aria-disabled', 'true');
    link.addEventListener('click', event => event.preventDefault());
  });

  document.querySelectorAll('[data-tabs]').forEach(tabWidget => {
    const tabs = Array.from(tabWidget.querySelectorAll('[role="tab"]'));
    const panels = Array.from(tabWidget.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length || !panels.length) return;

    const activateTab = tab => {
      const targetId = tab.dataset.tabTarget;
      if (!targetId) return;

      tabs.forEach(button => {
        const isActive = button === tab;
        button.classList.toggle('is-active', isActive);
        button.setAttribute('aria-selected', isActive ? 'true' : 'false');
        button.tabIndex = isActive ? 0 : -1;
      });

      panels.forEach(panel => {
        const isActive = panel.id === targetId;
        panel.classList.toggle('is-active', isActive);
        panel.hidden = !isActive;
      });
    };

    tabs.forEach(tab => {
      tab.addEventListener('click', () => activateTab(tab));
    });
  });

  applyBrandLogoBackgrounds();
  if (brandKey) {
    window.requestAnimationFrame(initBrandCountryCollapse);
    window.addEventListener('load', initBrandCountryCollapse, { once: true });
  }
  requestPaymentIconSync();
};

document.addEventListener('DOMContentLoaded', initCasinoPage);

(function renderHeroCountries() {
  const container = document.getElementById('heroCountries');
  if (!container) return;

  const TOP_COUNTRY_CODES = ['us', 'uk', 'ca', 'au', 'de', 'in', 'ar'];
  const topCountries = TOP_COUNTRY_CODES.map(code =>
    COUNTRIES.find(c => c.code.toLowerCase() === code)
  ).filter(Boolean);

  container.innerHTML = topCountries
    .map(
      country => `
      <a href="${countryPagePath(country.slug)}" class="hero-flag-link" aria-label="${country.name} casinos">
        <img
          class="hero-flag"
          src="${iconPath(country.slug)}"
          alt="${country.name} flag"
          loading="lazy"
          decoding="async"
        />
      </a>
    `
    )
    .join('');
})();
