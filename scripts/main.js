import { BRANDS } from './brands.js';
import { COUNTRIES } from './countries.js';

/* =====================
   BRANDS RENDER
===================== */

const container = document.querySelector('#brand-cards');
const template = document.querySelector('#casino-card-template');

if (container && template) {
  const fragment = document.createDocumentFragment();
  const pageCountry = document.body.dataset.country?.toUpperCase();

  const filteredBrands = BRANDS.filter(brand => brand.countries.some(c => c.toUpperCase() === pageCountry));

  filteredBrands.forEach(({ name, bonus, cta, urlDetail, urlCasino, image, payments = [] }) => {
    const card = template.content.cloneNode(true);

    const article = card.querySelector('.casino-card');
    const img = card.querySelector('.casino-image');
    const title = card.querySelector('.casino-name');
    const bonusText = card.querySelector('.casino-bonus');
    const link = card.querySelector('.cta');
    const paymentsContainer = card.querySelector('.payment-icons');

    img.src = image;
    img.alt = name;
    img.loading = 'lazy';

    title.textContent = name;
    bonusText.textContent = bonus;

    link.textContent = cta;
    link.href = urlCasino;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (paymentsContainer && payments.length) {
      const MAX_VISIBLE = 4;

      const visiblePayments = payments.slice(0, MAX_VISIBLE);
      const hiddenCount = payments.length - MAX_VISIBLE;

      paymentsContainer.innerHTML = `
    ${visiblePayments
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
  `;
    }

    article.addEventListener('click', () => {
      window.location.href = urlDetail;
    });

    link.addEventListener('click', e => {
      e.stopPropagation();
      window.open(urlCasino, '_blank', 'noopener');
    });

    fragment.appendChild(card);
  });

  container.append(fragment);
}

/* =====================
   BURGER MENU (MOBILE)
===================== */

const burger = document.querySelector('.burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
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

/* =====================
   COUNTRIES DROPDOWN (DESKTOP)
===================== */

function renderCountriesDropdown() {
  const container = document.getElementById('countriesDropdown');
  if (!container) return;

  const html = COUNTRIES.map(
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

  container.innerHTML = html;
}

renderCountriesDropdown();

/* =====================
   ALL COUNTRIES SECTION
===================== */

function renderAllCountries() {
  const container = document.querySelector('.all-countries .countries-cloud');
  if (!container) return;

  const html = COUNTRIES.map(
    country => `
    <a href="${country.slug}.html" class="country-link">
      <img class="flag" src="icons/${country.slug}-flag-icon.svg" alt="${country.name}" loading="lazy" />
      <span>${country.name}</span>
    </a>
  `
  ).join('');

  container.innerHTML = html;
}

renderAllCountries();

window.addEventListener('load', () => {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 300);
  }
});

const TOP_COUNTRY_CODES = ['us', 'uk', 'ca', 'au', 'de', 'in', 'ar'];

function renderHeroCountries() {
  const container = document.getElementById('heroCountries');
  if (!container) return;

  const topCountries = TOP_COUNTRY_CODES.map(code => COUNTRIES.find(country => country.code === code)).filter(
    Boolean
  );

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
}

renderHeroCountries();

/* =====================
   CLICK ON STATIC CARDS
===================== */

document.querySelectorAll('.casino-card').forEach(card => {
  card.addEventListener('click', e => {
    if (e.target.closest('.cta')) return;
    const page = card.dataset.page;
    if (page) window.location.href = page;
  });
});
