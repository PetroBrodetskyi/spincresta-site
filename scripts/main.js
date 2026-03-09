// =====================
// IMPORTS
// =====================
import { BRANDS } from './brands.js';
import { COUNTRIES } from './countries.js';

// =====================
// HELPERS
// =====================
const MAX_PAYMENT_VISIBLE = 4;
const PLACEHOLDER_LINK = '#';
const MOJIBAKE_FIXES = [];

const normalizeText = value => {
  if (typeof value !== 'string') return value ?? '';
  return MOJIBAKE_FIXES.reduce((text, [bad, good]) => text.split(bad).join(good), value);
};

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
const paymentPath = method => `/icons/payments/${method}.svg`;
const pagePath = fileName => normalizePagePath(fileName);

const renderPayments = (payments = []) => {
  if (!payments.length) return '';

  const visible = payments.slice(0, MAX_PAYMENT_VISIBLE);
  const hiddenCount = payments.length - MAX_PAYMENT_VISIBLE;

  return `
    <div class="payment-icons">
      ${visible
        .map(
          method =>
            `<img src="${paymentPath(method)}" alt="${normalizeText(method)} payment method" loading="lazy" decoding="async"/>`
        )
        .join('')}
      ${hiddenCount > 0 ? `<span class="payment-more">+${hiddenCount}</span>` : ''}
    </div>
  `;
};

const createBadge = ({ isTopRated, isExclusive, isNew }) => {
  if (isTopRated) return `<div class="top-rated-badge">TOP RATED</div>`;
  if (isExclusive) return `<div class="exclusive-badge">EXCLUSIVE</div>`;
  if (isNew) return `<div class="new-badge">NEW</div>`;
  return '';
};

const createCasinoCard = ({
  name,
  bonus,
  cta,
  urlDetail,
  urlCasino,
  image,
  payments = [],
  isNew = false,
  isExclusive = false,
  isTopRated = false,
  hasDetailPage = false,
}) => {
  const article = document.createElement('article');
  article.className = 'casino-card';

  const safeUrl = urlCasino || PLACEHOLDER_LINK;
  const safeName = normalizeText(name);
  const safeBonus = normalizeText(bonus);
  const safeCta = normalizeText(cta);
  const detailUrl = normalizePagePath(urlDetail ?? '');
  const imageUrl = normalizeAssetPath(image ?? '');

  article.dataset.page = detailUrl;

  article.innerHTML = `
    ${createBadge({ isTopRated, isExclusive, isNew })}
    <div class="card-img">
      <img src="${imageUrl}" alt="${safeName}" loading="lazy" decoding="async" class="casino-image"/>
    </div>
    <h3 class="casino-name">${safeName}</h3>
    <p class="casino-bonus">${safeBonus}</p>
    ${renderPayments(payments)}
    <a class="cta" href="${safeUrl}" target="_blank" rel="noopener noreferrer nofollow sponsored">${safeCta}</a>
  `;

  article.addEventListener('click', e => {
    if (e.target.closest('.cta')) return;

    if (hasDetailPage && detailUrl) {
      window.location.href = detailUrl;
      return;
    }

    if (safeUrl !== PLACEHOLDER_LINK) {
      window.open(safeUrl, '_blank', 'noopener');
    }
  });

  article.querySelector('.cta')?.addEventListener('click', e => e.stopPropagation());

  return article;
};

const ITEMS_PER_BATCH = 16;

const renderBrandList = (brands, containerSelector, emptyText) => {
  const container = document.querySelector(containerSelector);
  const loadMoreBtn = document.getElementById('loadMoreBtn');
  if (!container) return;

  if (!brands.length) {
    container.innerHTML = `<p>${emptyText}</p>`;
    loadMoreBtn?.remove();
    return;
  }

  let visibleCount = 0;

  container.innerHTML = '';

  const renderNextBatch = () => {
    const nextItems = brands.slice(visibleCount, visibleCount + ITEMS_PER_BATCH);

    const fragment = document.createDocumentFragment();
    nextItems.forEach(brand => {
      fragment.appendChild(createCasinoCard(brand));
    });

    container.appendChild(fragment);
    visibleCount += ITEMS_PER_BATCH;

    if (visibleCount >= brands.length) {
      loadMoreBtn?.remove();
    }
  };

  renderNextBatch();

  if (loadMoreBtn) {
    loadMoreBtn.onclick = renderNextBatch;
  }
};

// =====================
// INIT FUNCTION
// =====================
export const initCasinoPage = () => {
  const pageType = document.body.dataset.page;
  const pageCountry = document.body.dataset.country?.toUpperCase();

  if (pageCountry) {
    const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));
    renderBrandList(brands, '#brand-cards', 'No casinos available for this country.');
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

    const topBrands = BRANDS.filter(b => b.top?.includes(code) && b.countries?.includes(code)).slice(
      0,
      limit
    );

    if (!topBrands.length) {
      grid.innerHTML = `<p>No top casinos available.</p>`;
    } else {
      const fragment = document.createDocumentFragment();
      topBrands.forEach(b => fragment.appendChild(createCasinoCard(b)));
      grid.replaceChildren(fragment);
    }

    if (country && viewAllWrapper && viewAllLink) {
      viewAllWrapper.hidden = false;
      viewAllLink.href = countryPagePath(country.slug);
    }
  });

  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (brandKey) {
    const brand = BRANDS.find(b => b.urlDetail?.toLowerCase().includes(brandKey));

    if (brand) {
      const countriesEl = document.getElementById('brand-countries');
      const paymentsEl = document.getElementById('brand-payments');

      if (countriesEl && brand.countries?.length) {
        countriesEl.innerHTML = brand.countries
          .map(code => {
            const c = COUNTRIES.find(x => x.code.toLowerCase() === code.toLowerCase());
            if (!c) return '';
            return `
              <div class="flag-container">
                <img class="hero-flag" src="${iconPath(c.slug)}" alt="${normalizeText(c.name)}" loading="lazy" decoding="async"/>
                <span>${normalizeText(c.name)}</span>
              </div>
            `;
          })
          .join('');
      }

      if (paymentsEl && brand.payments?.length) {
        paymentsEl.innerHTML = brand.payments
          .map(
            p =>
              `<div class="payments">
                <img src="${paymentPath(p)}" alt="${normalizeText(p)}" loading="lazy" decoding="async"/>
              </div>`
          )
          .join('');
      }
    }
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
    const reviewsHref = pageCountry ? '#expert-review' : pagePath('top-rated.html');

    mobileMenuInner.innerHTML = `
    <button class="submenu-toggle" aria-expanded="false">Countries</button>
    <a href="${pagePath('top-casinos.html')}">Top Casinos</a>
    <a href="${pagePath('new-casinos.html')}">New Casinos</a>
    <a href="${pagePath('top-rated.html')}">Top Rated</a>
    <a href="${pagePath('exclusive-offers.html')}">Exclusive Offers</a>
    <a href="#">Bonuses</a>
    <a href="${reviewsHref}">Reviews</a>
    <a href="#">Promotions</a>
    <a href="${pagePath('about.html')}">About</a>
  `;

    const submenuToggle = mobileMenuInner.querySelector('.submenu-toggle');
    if (!submenuToggle) return;

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
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      header.classList.toggle('hidden', current > lastScroll && current > 100);
      lastScroll = current;
    });
  }

  const scrollToAnchor = hash => {
    if (!hash || hash === '#') return;
    const target = document.querySelector(hash);
    if (!target) return;

    const headerHeight = header?.offsetHeight ?? 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - headerHeight - 12;
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

