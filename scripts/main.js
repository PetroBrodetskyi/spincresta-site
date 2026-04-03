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

const initVerticalLinkCarousel = ({
  carouselSelector,
  trackSelector,
  desktopMinWidth = 1121,
}) => {
  const carousel = document.querySelector(carouselSelector);
  const track = carousel?.querySelector(trackSelector);
  if (!carousel || !track) return;

  const visibleCount = Number(carousel.dataset.visibleCount) || 4;
  const rotateMs = Number(carousel.dataset.rotateMs) || 3800;
  const originalMarkup = track.innerHTML;
  const originalCount = track.querySelectorAll('.home-link-card').length;

  if (originalCount <= visibleCount) return;

  const desktopMedia =
    typeof window.matchMedia === 'function'
      ? window.matchMedia(`(min-width: ${desktopMinWidth}px)`)
      : { matches: window.innerWidth >= desktopMinWidth };
  const reducedMotionMedia =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(prefers-reduced-motion: reduce)')
      : { matches: false };

  let items = [];
  let index = 0;
  let intervalId = null;
  let resetTimerId = null;

  const refreshItems = () => {
    items = Array.from(track.querySelectorAll('.home-link-card'));
  };

  const buildDesktopTrack = () => {
    if (track.dataset.desktopBuilt === 'true') return;

    refreshItems();

    items.slice(0, visibleCount).forEach(item => {
      const clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      track.appendChild(clone);
    });

    track.dataset.desktopBuilt = 'true';
    refreshItems();
  };

  const restoreOriginalTrack = () => {
    if (track.dataset.desktopBuilt !== 'true') {
      refreshItems();
      carousel.style.height = '';
      track.style.transform = '';
      track.style.transition = '';
      return;
    }

    track.innerHTML = originalMarkup;
    track.dataset.desktopBuilt = 'false';
    carousel.style.height = '';
    track.style.transform = '';
    track.style.transition = '';
    index = 0;
    refreshItems();
  };

  const setViewportHeight = () => {
    if (!items.length) return;

    const firstItem = items[0];
    const lastVisibleItem = items[Math.min(visibleCount - 1, items.length - 1)];
    const height =
      lastVisibleItem.offsetTop + lastVisibleItem.offsetHeight - firstItem.offsetTop;

    carousel.style.height = `${height}px`;
  };

  const setPosition = (nextIndex, animated) => {
    if (!items.length || !items[nextIndex]) return;

    const baseTop = items[0].offsetTop;
    const targetTop = items[nextIndex].offsetTop;

    track.style.transition = animated ? 'transform 0.56s ease' : 'none';
    track.style.transform = `translateY(-${targetTop - baseTop}px)`;
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

  const rotate = () => {
    if (!desktopMedia.matches || reducedMotionMedia.matches) return;

    index += 1;
    setPosition(index, true);

    if (index === originalCount) {
      resetTimerId = window.setTimeout(() => {
        index = 0;
        setPosition(0, false);
        resetTimerId = null;
      }, 600);
    }
  };

  const start = () => {
    clearTimers();

    if (!desktopMedia.matches || reducedMotionMedia.matches) {
      restoreOriginalTrack();
      return;
    }

    buildDesktopTrack();
    if (index >= originalCount) {
      index = 0;
    }
    setViewportHeight();
    setPosition(index, false);
    intervalId = window.setInterval(rotate, rotateMs);
  };

  const stop = () => {
    clearTimers();
  };

  const handleModeChange = () => {
    if (!desktopMedia.matches) {
      index = 0;
      restoreOriginalTrack();
      return;
    }

    if (index > originalCount) {
      index = 0;
    }

    start();
  };

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', start);

  window.addEventListener('resize', () => {
    if (!desktopMedia.matches || track.dataset.desktopBuilt !== 'true') return;

    window.requestAnimationFrame(() => {
      refreshItems();
      setViewportHeight();
      setPosition(index, false);
    });
  });

  if (typeof desktopMedia.addEventListener === 'function') {
    desktopMedia.addEventListener('change', handleModeChange);
    reducedMotionMedia.addEventListener('change', handleModeChange);
  } else if (typeof desktopMedia.addListener === 'function') {
    desktopMedia.addListener(handleModeChange);
    reducedMotionMedia.addListener(handleModeChange);
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

const ensureCountryBrandStage = pageCountry => {
  const brandCards = document.getElementById('brand-cards');
  if (!brandCards) return;

  const existingStage = document.querySelector('.country-brand-stage');
  if (existingStage) return;

  const container = brandCards.closest('.container');
  if (!container) return;

  const country = COUNTRIES.find(c => c.code.toUpperCase() === pageCountry);
  const countryName = normalizeText(country?.name || pageCountry);
  const sectionHead = container.querySelector('.section-head');
  const intro = container.querySelector('.intro');
  const loadMoreWrapper = container.querySelector('.load-more-wrapper');

  const stage = document.createElement('div');
  stage.className = 'country-brand-stage';
  stage.innerHTML = `
    <div class="country-brand-side">
      <aside class="home-insight country-new-reviews" aria-label="New reviews for ${countryName} players">
        <div class="home-insight-card">
          <div class="home-insight-head">
            <h2>New Reviews</h2>
            <p>
              Here you can find fresh brand reviews for ${countryName}, along with new bonus pages,
              updated payment options, and useful account details in one place.
            </p>
          </div>
          <div class="country-new-reviews-carousel" data-visible-count="4" data-rotate-ms="4000">
            <div class="home-link-grid home-link-grid-vertical country-new-reviews-track" id="country-new-reviews"></div>
          </div>
        </div>
      </aside>
      <div class="country-brand-summary" aria-label="${countryName} brand coverage">
        <div class="country-brand-summary-card">
          <span class="country-brand-summary-number" id="countryBrandCount">0</span>
          <div class="country-brand-summary-copy">
            <strong id="countryBrandCountLabel">${countryName} Brands Reviewed</strong>
            <span>
              Casino and betting brands currently reviewed for this market, with bonus details,
              payment methods, trust checks, and practical notes for real players.
            </span>
          </div>
        </div>
      </div>
    </div>
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
            <img class="home-link-logo" src="${imageUrl}" alt="${normalizeText(brand.name)} logo" loading="lazy" decoding="async" />
            <strong>${normalizeText(brand.name)}</strong>
          </span>
          <span>${compactBonus}</span>
        </a>
      `;
    })
    .join('');
};

// =====================
// INIT FUNCTION
// =====================
export const initCasinoPage = () => {
  const pageType = document.body.dataset.page;
  const pageCountry = document.body.dataset.country?.toUpperCase();
  const siteCountryCountEl = document.getElementById('siteCountryCount');
  const siteBrandCountEl = document.getElementById('siteBrandCount');

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

  if (pageCountry) {
    ensureCountryBrandStage(pageCountry);
    const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));
    const country = COUNTRIES.find(c => c.code.toUpperCase() === pageCountry);
    const countryBrandCountEl = document.getElementById('countryBrandCount');
    const countryBrandCountLabelEl = document.getElementById('countryBrandCountLabel');

    renderBrandList(brands, '#brand-cards', 'No casinos available for this country.');
    renderCountryNewReviews(pageCountry);
    initCountryNewReviewsCarousel();

    if (countryBrandCountEl) {
      countryBrandCountEl.textContent = brands.length.toString();
    }

    if (countryBrandCountLabelEl) {
      countryBrandCountLabelEl.textContent = `${normalizeText(country?.name || pageCountry)} Brands Reviewed`;
    }
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

