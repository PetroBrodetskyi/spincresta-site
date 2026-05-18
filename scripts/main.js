// =====================
// IMPORTS
// =====================
import { BRANDS } from './brands.js';
import { BRAND_SNAPSHOT_CONFIGS } from './brand-snapshot-configs.js';
import { COUNTRIES } from './countries.js';

// =====================
// HELPERS
// =====================
const PLACEHOLDER_LINK = '#';
const MOJIBAKE_FIXES = [];
const THEME_STORAGE_KEY = 'spincresta-theme';
const THEME_OPTIONS = ['dark', 'light'];

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

const getSystemTheme = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
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

  delete root.dataset.theme;
  root.style.colorScheme = getSystemTheme();
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

const getActiveTheme = () => getStoredTheme() || getSystemTheme();

applyTheme(getStoredTheme());

const renderPayments = (payments = []) => {
  if (!payments.length) return '';

  return `
    <div class="payment-icons" data-payment-count="${payments.length}">
      ${payments
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
      <button type="button" class="theme-settings-close" aria-label="Close settings">×</button>
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
  const showReviewAction = Boolean(hasDetailPage && detailUrl);
  const showPlayAction = safeUrl !== PLACEHOLDER_LINK;

  article.dataset.page = detailUrl;
  setBrandBackground(article, bgColor);

  article.innerHTML = `
    <div class="card-img">
      <img src="${imageUrl}" alt="${safeName}" loading="lazy" decoding="async" class="casino-image"/>
    </div>
    <div class="casino-card-heading">
      <h3 class="casino-name">${safeName}</h3>
      ${createBadge({ isTopRated, isExclusive, isNew })}
    </div>
    <p class="casino-bonus">${safeBonus}</p>
    ${renderPayments(payments)}
    <div class="casino-footer">
      <div class="casino-actions ${showReviewAction && showPlayAction ? 'has-two-actions' : 'has-single-action'}">
        ${
          showReviewAction
            ? `<a class="cta cta-secondary" href="${detailUrl}">Review</a>`
            : ''
        }
        ${
          showPlayAction
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
      window.open(safeUrl, '_blank', 'noopener');
    }
  });

  article.querySelectorAll('.cta').forEach(link => {
    link.addEventListener('click', e => e.stopPropagation());
  });

  return article;
};

const ITEMS_PER_BATCH = 12;

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
    requestPaymentIconSync();
    requestAnimationFrame(syncCountryStickyReviewsLayout);
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

  let items = [];
  let index = 0;
  let intervalId = null;
  let resetTimerId = null;
  let controls = null;

  const getVisibleCount = () => (desktopMedia.matches ? desktopVisibleCount : mobileVisibleCount);

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

    carousel.style.setProperty(
      '--carousel-progress',
      `${((activeCycleIndex + 1) / originalCount) * 100}%`
    );
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

    track.style.transition = animated ? 'transform 0.68s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    track.style.transform = `translateY(-${targetTop - baseTop}px)`;
    syncItemState();
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

  const hero = document.querySelector('.hero');
  const heading = hero?.querySelector('h1');
  const brandLogo = hero?.querySelector('.brand-logo');
  const heroCta = hero?.querySelector('a.cta-brands[href]');
  const header = document.querySelector('.header');
  if (!hero || !heading || !header) return;
  if (document.querySelector('.brand-sticky-title')) return;

  const titleText = normalizeText(heading.textContent).trim();
  if (!titleText) return;

  const casinoHref = heroCta?.getAttribute('href')?.trim() || '';
  if (!casinoHref) return;

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

  const stickyTitle = document.createElement('a');
  stickyTitle.className = 'brand-sticky-title';
  stickyTitle.href = casinoHref;
  stickyTitle.target = heroCta?.getAttribute('target') || '_blank';
  stickyTitle.rel = heroCta?.getAttribute('rel') || 'noopener noreferrer nofollow sponsored';
  stickyTitle.setAttribute('aria-label', `Visit ${titleText}`);
  stickyTitle.innerHTML = `
    <div class="brand-sticky-title__inner">
      ${brandLogoMarkup}
      <span class="brand-sticky-title__text">${titleText}</span>
      <span class="brand-sticky-title__cta">Visit Casino</span>
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

  document.querySelectorAll('section.container, .content-article').forEach(section => {
    const title = section.querySelector('h2.title');
    const timeline = section.querySelector('.timeline');
    const faqGrid = section.querySelector('.faq-grid');
    if (!title || (!timeline && !faqGrid)) return;

    const titleText = normalizeText(title.textContent).trim().toLowerCase();
    if (!titleText.includes('faq')) return;

    timeline?.querySelectorAll(':scope > h3').forEach(addQuestionIcon);
    timeline?.querySelectorAll(':scope > p').forEach(addAnswerIcon);

    faqGrid?.querySelectorAll('.faq-card').forEach(card => {
      const question = card.querySelector(':scope > h3');
      const answers = card.querySelectorAll(':scope > p');
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
    const brand = byName.get(normalizeBrandKey(brandName.replace(/\s+Review$/i, '')));
    setBrandBackground(brandLogoContainer, brand?.bgColor);
  }
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
  applyBrandHeroConcept();

  if (pageCountry) {
    ensureCountryBrandStage(pageCountry);
    applyCountryHeroConcept();
    const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));

    renderBrandList(brands, '#brand-cards', 'No casinos available for this country.');
    renderCountryNewReviews(pageCountry);
    initCountryNewReviewsCarousel();
    initCountryStickyReviews();
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
      requestPaymentIconSync();
    }

    if (country && viewAllWrapper && viewAllLink) {
      viewAllWrapper.hidden = false;
      viewAllLink.href = countryPagePath(country.slug);
    }
  });

  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (brandKey) {
    initStickyBrandTitle();
    enhanceBrandProsCons();
    applyBrandInfoPairLayout();
    renderBrandAvailabilityWidget(brandKey);

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
              <a class="flag-container" href="${countryPagePath(c.slug)}" aria-label="${normalizeText(c.name)} casino guide">
                <img class="hero-flag" src="${iconPath(c.slug)}" alt="${normalizeText(c.name)}" loading="lazy" decoding="async"/>
                <span>${normalizeText(c.name)}</span>
              </a>
            `;
          })
          .join('');
        initBrandCountryCollapse();
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

  const navDropdown = document.querySelector('.nav-dropdown');
  const navDropdownLink = navDropdown?.querySelector('.nav-dropdown-link');
  const navDropdownMenu = navDropdown?.querySelector('.nav-dropdown-menu');

  if (navDropdownLink && !navDropdownLink.querySelector('.nav-dropdown-icon')) {
    const dropdownIcon = document.createElement('img');
    dropdownIcon.className = 'nav-dropdown-icon';
    dropdownIcon.src = '/icons/ui/angle-bottom-icon.svg';
    dropdownIcon.alt = '';
    dropdownIcon.setAttribute('aria-hidden', 'true');
    navDropdownLink.append(dropdownIcon);
  }

  if (navDropdown && navDropdownLink && navDropdownMenu && typeof window.matchMedia === 'function') {
    const desktopDropdownMedia = window.matchMedia('(min-width: 1025px)');
    let closeTimerId = null;

    const syncDropdownState = isOpen => {
      navDropdown.classList.toggle('is-open', isOpen);
      navDropdownLink.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    };

    const clearDropdownTimer = () => {
      if (!closeTimerId) return;
      window.clearTimeout(closeTimerId);
      closeTimerId = null;
    };

    const openDropdown = () => {
      if (!desktopDropdownMedia.matches) {
        syncDropdownState(false);
        return;
      }

      clearDropdownTimer();
      syncDropdownState(true);
    };

    const closeDropdown = () => {
      clearDropdownTimer();
      syncDropdownState(false);
    };

    const scheduleDropdownClose = () => {
      if (!desktopDropdownMedia.matches) {
        closeDropdown();
        return;
      }

      clearDropdownTimer();
      closeTimerId = window.setTimeout(closeDropdown, 180);
    };

    navDropdown.addEventListener('mouseenter', openDropdown);
    navDropdown.addEventListener('mouseleave', scheduleDropdownClose);
    navDropdown.addEventListener('focusin', openDropdown);
    navDropdown.addEventListener('focusout', event => {
      if (event.relatedTarget instanceof Node && navDropdown.contains(event.relatedTarget)) return;
      scheduleDropdownClose();
    });

    if (typeof desktopDropdownMedia.addEventListener === 'function') {
      desktopDropdownMedia.addEventListener('change', () => {
        clearDropdownTimer();
        syncDropdownState(false);
      });
    } else if (typeof desktopDropdownMedia.addListener === 'function') {
      desktopDropdownMedia.addListener(() => {
        clearDropdownTimer();
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
    <button type="button" class="mobile-theme-settings" data-theme-settings-trigger aria-haspopup="dialog">Settings</button>
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
    if (!header) return;
    document.documentElement.style.setProperty('--header-height', `${header.offsetHeight || 0}px`);
  };

  syncHeaderHeight();

  if (header) {
    let lastScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

    const updateScrollChrome = () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = current > lastScroll;
      const shouldHide = isScrollingDown && current > 100;
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

