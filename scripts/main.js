// =====================
// IMPORTS
// =====================
import { BRANDS } from './brands.js';
import { COUNTRIES } from './countries.js';

// =====================
// HELPERS
// =====================
const MAX_PAYMENT_VISIBLE = 4;

const renderPayments = (payments = []) => {
  if (!payments.length) return '';

  const visible = payments.slice(0, MAX_PAYMENT_VISIBLE);
  const hiddenCount = payments.length - MAX_PAYMENT_VISIBLE;

  return `
    <div class="payment-icons">
      ${visible
        .map(method => `<img src="icons/payments/${method}.svg" alt="${method} payment" loading="lazy"/>`)
        .join('')}
      ${hiddenCount > 0 ? `<span class="payments-more">+${hiddenCount}</span>` : ''}
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
  article.dataset.page = urlDetail ?? '';

  article.innerHTML = `
    ${createBadge({ isTopRated, isExclusive, isNew })}
    <div class="card-img">
      <img src="${image}" alt="${name}" loading="lazy" class="casino-image"/>
    </div>
    <h3 class="casino-name">${name}</h3>
    <p class="casino-bonus">${bonus}</p>
    ${renderPayments(payments)}
    <a class="cta" href="${urlCasino}" target="_blank" rel="noopener noreferrer">${cta}</a>
  `;

  article.addEventListener('click', e => {
    if (e.target.closest('.cta')) return;
    if (hasDetailPage && urlDetail) window.location.href = urlDetail;
    else window.open(urlCasino, '_blank', 'noopener');
  });

  article.querySelector('.cta')?.addEventListener('click', e => e.stopPropagation());

  return article;
};

const renderBrandList = (brands, containerSelector, emptyText) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  if (!brands.length) {
    container.innerHTML = `<p>${emptyText}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();
  brands.forEach(brand => fragment.appendChild(createCasinoCard(brand)));

  container.replaceChildren(fragment);
};

// =====================
// INIT FUNCTION
// =====================
export const initCasinoPage = () => {
  const pageType = document.body.dataset.page;
  const pageCountry = document.body.dataset.country?.toUpperCase();

  // =====================
  // COUNTRY PAGE
  // =====================
  if (pageCountry) {
    const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));

    renderBrandList(brands, '#brand-cards', 'No casinos available for this country.');
  }

  // =====================
  // NEW / EXCLUSIVE / TOP RATED PAGES
  // =====================
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

  // =====================
  // TOP CASINOS MULTI-COUNTRY
  // =====================
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
      viewAllLink.href = `${country.slug}.html`;
    }
  });

  // =====================
  // BRAND DETAILS PAGE
  // =====================
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
                <img class="hero-flag" src="../icons/${c.slug}-flag-icon.svg" alt="${c.name}" loading="lazy"/>
                <span>${c.name}</span>
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
                <img src="../icons/payments/${p}.svg" alt="${p}" loading="lazy"/>
              </div>`
          )
          .join('');
      }
    }
  }

  // =====================
  // COUNTRIES DROPDOWN
  // =====================
  const countriesDropdown = document.getElementById('countriesDropdown');
  if (countriesDropdown) {
    countriesDropdown.innerHTML = COUNTRIES.map(
      c => `
        <a href="${c.slug}.html">
          <img class="flag" src="icons/${c.slug}-flag-icon.svg" alt="${c.name}" loading="lazy"/>
          ${c.name}
        </a>
      `
    ).join('');
  }

  // =====================
  // ALL COUNTRIES CLOUD
  // =====================
  document.querySelector('.all-countries .countries-cloud')?.replaceChildren(
    ...COUNTRIES.map(c => {
      const a = document.createElement('a');
      a.href = `${c.slug}.html`;
      a.className = 'country-link';
      a.innerHTML = `
        <img class="flag" src="icons/${c.slug}-flag-icon.svg" alt="${c.name}" loading="lazy">
        <span>${c.name}</span>
      `;
      return a;
    })
  );

  // =====================
  // MOBILE MENU TOGGLE
  // =====================
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileMenuInner = document.querySelector('.mobile-menu-inner');

  if (burger && mobileMenu && mobileMenuInner) {
    mobileMenuInner.innerHTML = `
    <button class="submenu-toggle">Countries</button>
    <a href="index.html">Top Casinos</a>
    <a href="new-casinos.html">New Casinos</a>
    <a href="top-rated.html">Top Rated</a>
    <a href="exclusive-offers.html">Exclusive Offers</a>
    <a href="#">Bonuses</a>
    <a href="#">Reviews</a>
    <a href="#">Promotions</a>
    <a href="about.html">About</a>
  `;

    const countriesSubmenu = document.createElement('div');
    countriesSubmenu.className = 'mobile-submenu';
    countriesSubmenu.innerHTML = COUNTRIES.map(
      c => `
      <a href="${c.slug}.html">
        <img class="flag" src="icons/${c.slug}-flag-icon.svg" alt="${c.name}" loading="lazy"/>
        ${c.name}
      </a>
    `
    ).join('');
    mobileMenuInner.appendChild(countriesSubmenu);

    const submenuToggle = mobileMenuInner.querySelector('.submenu-toggle');
    submenuToggle.addEventListener('click', () => {
      countriesSubmenu.classList.toggle('open');
      submenuToggle.classList.toggle('active');
    });

    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('open');
    });

    mobileMenu.addEventListener('click', e => {
      if (e.target === mobileMenu) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('open');
      }
    });
  }

  // =====================
  // GLOBAL LOADER
  // =====================
  window.addEventListener('load', () => {
    const loader = document.getElementById('globalLoader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 300);
  });

  // =====================
  // HEADER SCROLL
  // =====================
  const header = document.querySelector('.header');
  if (header) {
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;

      header.classList.toggle('hidden', current > lastScroll && current > 100);

      lastScroll = current;
    });
  }
};

// =====================
// AUTO INIT
// =====================
document.addEventListener('DOMContentLoaded', initCasinoPage);

/* ===================== HERO COUNTRIES ===================== */

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
      <a href="${country.slug}.html" class="hero-flag-link" aria-label="${country.name} casinos">
        <img
          class="hero-flag"
          src="icons/${country.slug}-flag-icon.svg"
          alt="${country.name} flag"
          loading="lazy"
        />
      </a>
    `
    )
    .join('');
})();
