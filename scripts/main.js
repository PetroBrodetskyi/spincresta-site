import { BRANDS } from './brands.js';
import { COUNTRIES } from './countries.js';

/* =====================
   HELPERS
===================== */

function renderPayments(payments = []) {
  if (!payments.length) return '';

  const MAX_VISIBLE = 4;
  const visible = payments.slice(0, MAX_VISIBLE);
  const hiddenCount = payments.length - MAX_VISIBLE;

  return `
    <div class="payment-icons">
      ${visible
        .map(
          method => `
            <img
              src="icons/payments/${method}.svg"
              alt="${method} payment"
              loading="lazy"
            />
          `
        )
        .join('')}
      ${hiddenCount > 0 ? `<span class="payments-more">+${hiddenCount}</span>` : ''}
    </div>
  `;
}

function renderCasinoCard({ name, bonus, cta, urlDetail, urlCasino, image, payments = [] }) {
  return `
    <article class="casino-card" data-page="${urlDetail}">
      <div class="card-img">
        <img src="${image}" alt="${name}" loading="lazy" />
      </div>

      <h3 class="casino-name">${name}</h3>
      <p class="casino-bonus">${bonus}</p>

      ${renderPayments(payments)}

      <a
        class="cta"
        href="${urlCasino}"
        target="_blank"
        rel="noopener noreferrer"
      >
        ${cta}
      </a>
    </article>
  `;
}

/* =====================
   BRANDS LIST (COUNTRY PAGE)
===================== */

(function renderBrandCards() {
  const container = document.querySelector('#brand-cards');
  const template = document.querySelector('#casino-card-template');
  const pageCountry = document.body.dataset.country?.toUpperCase();

  if (!container || !template || !pageCountry) return;

  const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));

  const fragment = document.createDocumentFragment();

  brands.forEach(brand => {
    const card = template.content.cloneNode(true);

    const article = card.querySelector('.casino-card');
    const img = card.querySelector('.casino-image');
    const title = card.querySelector('.casino-name');
    const bonusText = card.querySelector('.casino-bonus');
    const link = card.querySelector('.cta');
    const paymentsContainer = card.querySelector('.payment-icons');

    img.src = brand.image;
    img.alt = brand.name;
    img.loading = 'lazy';

    title.textContent = brand.name;
    bonusText.textContent = brand.bonus;

    link.textContent = brand.cta;
    link.href = brand.urlCasino;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (paymentsContainer) {
      paymentsContainer.innerHTML = renderPayments(brand.payments);
    }

    article.addEventListener('click', () => {
      window.location.href = brand.urlDetail;
    });

    link.addEventListener('click', e => {
      e.stopPropagation();
      window.open(brand.urlCasino, '_blank', 'noopener');
    });

    fragment.appendChild(card);
  });

  container.append(fragment);
})();

/* =====================
   BURGER MENU
===================== */

(function burgerMenu() {
  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (!burger || !mobileMenu) return;

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
})();

/* =====================
   COUNTRIES DROPDOWN
===================== */

(function renderCountriesDropdown() {
  const container = document.getElementById('countriesDropdown');
  if (!container) return;

  container.innerHTML = COUNTRIES.map(
    country => `
      <a href="${country.slug}.html">
        <img
          class="flag"
          src="icons/${country.slug}-flag-icon.svg"
          alt="${country.name}"
          loading="lazy"
        />
        ${country.name}
      </a>
    `
  ).join('');
})();

/* =====================
   ALL COUNTRIES CLOUD
===================== */

(function renderAllCountries() {
  const container = document.querySelector('.all-countries .countries-cloud');
  if (!container) return;

  container.innerHTML = COUNTRIES.map(
    country => `
      <a href="${country.slug}.html" class="country-link">
        <img
          class="flag"
          src="icons/${country.slug}-flag-icon.svg"
          alt="${country.name}"
          loading="lazy"
        />
        <span>${country.name}</span>
      </a>
    `
  ).join('');
})();

/* =====================
   HERO COUNTRIES
===================== */

(function renderHeroCountries() {
  const container = document.getElementById('heroCountries');
  if (!container) return;

  const TOP_COUNTRY_CODES = ['us', 'uk', 'ca', 'au', 'de', 'in', 'ar'];

  const topCountries = TOP_COUNTRY_CODES.map(code => COUNTRIES.find(c => c.code === code)).filter(Boolean);

  container.innerHTML = topCountries
    .map(
      country => `
        <a
          href="${country.slug}.html"
          class="hero-flag-link"
          aria-label="${country.name} casinos"
        >
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

/* =====================
   TOP CASINOS (MULTI COUNTRY)
===================== */
(function renderTopCasinos() {
  document.querySelectorAll('.content[data-country]').forEach(section => {
    const countryCode = section.dataset.country?.toUpperCase();
    if (!countryCode) return;

    const title = section.querySelector('.top-country-title');
    const grid = section.querySelector('.casino-grid-main');
    const viewAllWrapper = section.querySelector('.view-all-wrapper');
    const viewAllLink = section.querySelector('.view-all');

    if (!title || !grid) return;

    const country = COUNTRIES.find(c => c.code.toUpperCase() === countryCode);
    const limit = Number(grid.dataset.limit) || 4;

    title.textContent = `Top ${country?.name || countryCode} Casinos`;

    const topBrands = BRANDS.filter(
      b => b.top?.includes(countryCode) && b.countries?.includes(countryCode)
    ).slice(0, limit);

    if (!topBrands.length) {
      grid.innerHTML = `<p>No top casinos available.</p>`;
      return;
    }

    grid.innerHTML = '';
    topBrands.forEach(brand => {
      const wrapper = document.createElement('div');
      wrapper.innerHTML = renderCasinoCard(brand);
      const card = wrapper.firstElementChild;

      card.addEventListener('click', e => {
        if (!e.target.closest('.cta')) {
          window.location.href = brand.urlDetail;
        }
      });

      const link = card.querySelector('.cta');
      if (link) {
        link.addEventListener('click', e => {
          e.stopPropagation();
          window.open(link.href, '_blank', 'noopener');
        });
      }

      grid.appendChild(card);
    });

    if (country && viewAllWrapper && viewAllLink) {
      viewAllWrapper.hidden = false;
      viewAllLink.href = `${country.slug}.html`;
    }
  });
})();

/* =====================
   BRAND DETAILS PAGE
===================== */

(function renderBrandDetails() {
  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (!brandKey) return;

  const brand = BRANDS.find(b => b.urlDetail.includes(brandKey));
  if (!brand) return;

  const countriesEl = document.getElementById('brand-countries');
  const paymentsEl = document.getElementById('brand-payments');

  if (countriesEl && brand.countries?.length) {
    countriesEl.innerHTML = brand.countries
      .map(code => {
        const country = COUNTRIES.find(c => c.code.toLowerCase() === code.toLowerCase());
        if (!country) return '';
        return `
          <div class="flag-container">
            <img class="hero-flag"
              src="../icons/${country.slug}-flag-icon.svg"
              alt="${country.name}"
              loading="lazy"
            />
            <span>${country.name}</span>
          </div>
        `;
      })
      .join('');
  }

  if (paymentsEl && brand.payments?.length) {
    paymentsEl.innerHTML = brand.payments
      .map(
        method => `
          <div class="payments">
            <img
              src="../icons/payments/${method}.svg"
              alt="${method}"
              loading="lazy"
            />
          </div>
        `
      )
      .join('');
  }
})();

/* =====================
   MOBILE MENU COUNTRIES
===================== */
(function renderMobileMenuCountries() {
  const mobileMenuContainer = document.querySelector('#mobileMenu .mobile-menu-inner');
  if (!mobileMenuContainer) return;

  mobileMenuContainer.innerHTML = '<h4>Countries</h4>';

  COUNTRIES.forEach(country => {
    const link = document.createElement('a');
    link.href = `${country.slug}.html`;
    link.className = 'mobile-country-link';
    link.innerHTML = `
      <img class="flag" src="icons/${country.slug}-flag-icon.svg" alt="${country.name}" loading="lazy">
      <span>${country.name}</span>
    `;
    mobileMenuContainer.appendChild(link);
  });
})();

/* =====================
   GLOBAL LOADER
===================== */

window.addEventListener('load', () => {
  const loader = document.getElementById('globalLoader');
  if (!loader) return;

  loader.classList.add('hidden');
  setTimeout(() => loader.remove(), 300);
});
