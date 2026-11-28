// Page-specific module. Loaded dynamically by scripts/main.js.

import { getBrandDetailSlug, getFeaturedHomeBrands } from '../featured-brands.js?v=20261119-shared-search';
import { bindCompactCountryCloud } from '../country-cloud.js?v=20261122-market-cloud';

import { bindMovingCardStrip } from '../scrolling-card-strip.js?v=20261122-compact-reviews';
import { createReviewCard } from '../review-card.js?v=20261122-compact-reviews';
import { bindMobileEditorialCards } from '../editorial-accordion.js?v=20261125-country-guides';
export { advanceHomeGames } from '../scrolling-card-strip.js?v=20261122-compact-reviews';

// Editorial dates are explicit: unrelated markup or registry edits don't bump a review.
export function selectLatestReviewBrands(brands, { market = '', fallbackSlugs = [], limit = 24 } = {}) {
  const fallback = new Map(fallbackSlugs.map((slug, rank) => [slug, rank]));
  const candidates = brands.flatMap((brand, index) => {
    const slug = getBrandDetailSlug(brand);
    if (!slug || !brand.hasDetailPage || brand.reviewComingSoon || !brand.image ||
        brand.notRecommended || brand.temporarilyUnavailable ||
        (market && !brand.countries?.some(code => code.toUpperCase() === market))) return [];
    const date = Date.parse(brand.reviewUpdatedAt);
    return [{ brand, slug, index, date: Number.isFinite(date) ? date : -Infinity }];
  });
  const rank = candidate => fallback.get(candidate.slug) ?? Infinity;
  candidates.sort((a, b) => (b.date - a.date) || (rank(a) - rank(b)) || (b.index - a.index));
  const seen = new Set();
  return candidates.filter(({ slug }) => {
    if (seen.has(slug)) return false;
    seen.add(slug);
    return true;
  }).slice(0, limit).map(({ brand }) => brand);
}

export const homeBrandScrollStep = (viewport, card, gap) => {
  const column = card + gap;
  return column > 0 ? column * Math.max(1, Math.floor((viewport + gap) / column)) : viewport;
};

export const forwardHomeBrandVerticalWheel = (event, page = window) => {
  if (!event.cancelable || event.defaultPrevented || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey) return;
  // Read the units before the deltas; some browsers normalize deltas based on this access.
  const mode = event.deltaMode;
  const { deltaX, deltaY } = event;
  if (!deltaY || Math.abs(deltaY) <= Math.abs(deltaX)) return;

  const root = page.document.scrollingElement;
  if (!root) return;
  const current = root.scrollTop;
  const limit = root.scrollHeight - root.clientHeight;
  if (limit <= 0 || (deltaY < 0 ? current <= 0 : current >= limit)) return;

  const unit = mode === 1 ? parseFloat(page.getComputedStyle(root).lineHeight) || 16
    : mode === 2 ? root.clientHeight : 1;
  event.preventDefault();
  page.scrollBy({ top: deltaY * unit, behavior: 'instant' });
};

function bindHomeBrandTrack(grid, controls, previous, next) {
  const sync = () => {
    const end = Math.max(0, grid.scrollWidth - grid.clientWidth);
    const canAdvance = grid.scrollLeft < end - 2;
    controls.hidden = end < 3;
    previous.setAttribute('aria-disabled', String(grid.scrollLeft < 2));
    next.setAttribute('aria-disabled', String(!canAdvance));
    grid.tabIndex = controls.hidden ? -1 : 0;
    grid.classList.toggle('has-more-columns', canAdvance);
  };
  const step = direction => {
    const button = direction < 0 ? previous : next;
    if (controls.hidden || button.getAttribute('aria-disabled') === 'true') return;
    const card = grid.querySelector('.casino-catalog-card');
    if (!card) return;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const distance = homeBrandScrollStep(grid.clientWidth, card.getBoundingClientRect().width, gap);
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    grid.scrollBy({ left: direction * distance, behavior });
  };
  previous.addEventListener('click', () => step(-1));
  next.addEventListener('click', () => step(1));
  grid.addEventListener('keydown', event => {
    if (event.target !== grid || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    step(event.key === 'ArrowLeft' ? -1 : 1);
  });
  grid.addEventListener('wheel', event => {
    // A wheel sequence can stay latched to the track after its direction changes.
    // Route each vertical event independently; horizontal wheel and touch remain native.
    if (!controls.hidden) forwardHomeBrandVerticalWheel(event);
  }, { passive: false });
  grid.addEventListener('scroll', sync, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(sync).observe(grid);
  else window.addEventListener('resize', sync, { passive: true });
  return sync;
}

export const initHomeGamesMotion = localeText => {
  const section = document.querySelector('.home-new-games');
  bindMovingCardStrip({
    grid: section?.querySelector('.home-games-grid'),
    toolbar: section?.querySelector('.home-showcase-heading > div'),
    id: 'new-games-strip',
    headingId: 'new-games-title',
    localeText,
  });
};

export const initHomePage = context => {
  const {
    BRANDS,
    COUNTRIES,
    BRAND_NEW_GAMES,
    pageCountry,
    SITE_LOCALE,
    normalizeText,
    normalizeAssetPath,
    createCasinoCard,
    applyBrandLogoBackgrounds,
    requestPaymentIconSync,
    brandPagePath,
    localeText,
    setBrandBackground,
    noCountryCasinos,
  } = context;

  const initHomeCountryCloud = () => {
    const cloud = document.querySelector('.home-country-directory .countries-cloud');
    if (!cloud) return;
    cloud.id = 'home-country-cloud';
    bindCompactCountryCloud(cloud, localeText);
  };

  // Follow the existing market priority for localized results and their games.
  const HOME_MARKET_PRIORITY_SLUGS = [
    'fraga-tr',
    '55bet',
    'zarbet',
    'lizaro',
    'spinboss',
    'dragonia',
    'onluck',
    'yepcasino',
    'sunpalace',
    'leon-casino',
    'stonevegas',
    'immerion',
    'lasvegasusa',
    'trino',
    'gamblezen',
    '10bet',
    'pinco',
    'ybets',
  ];
  
  const HOME_GEO_BY_LOCALE = Object.freeze({
    de: 'DE',
    es: 'ES',
    it: 'IT',
    pl: 'PL',
    pt: 'PT',
    fr: 'FR',
    hi: 'IN',
    fi: 'FI',
  });
  
  const getHomeGeoCode = () => HOME_GEO_BY_LOCALE[SITE_LOCALE] || '';
  
  const getHomeGeoBrands = countryCode => {
    if (!countryCode) return [];
  
    return BRANDS.map((brand, index) => ({ brand, index, slug: getBrandDetailSlug(brand) }))
      .filter(({ brand, slug }) =>
        Boolean(
          slug &&
          brand.hasDetailPage &&
          brand.urlDetail &&
          brand.image &&
          !brand.notRecommended &&
          !brand.temporarilyUnavailable &&
          brand.countries?.some(code => code.toUpperCase() === countryCode)
        )
      );
  };
  
  const selectUniqueHomeBrands = (candidates, limit) => {
    const selected = [];
    const slugs = new Set();
  
    candidates.forEach(candidate => {
      if (selected.length >= limit || slugs.has(candidate.slug)) return;
      slugs.add(candidate.slug);
      selected.push(candidate);
    });
  
    return selected;
  };
  
  const getHomeRecommendationCandidates = countryCode => {
    const candidates = getHomeGeoBrands(countryCode);
    const priority = new Map(HOME_MARKET_PRIORITY_SLUGS.map((slug, index) => [slug, index]));
  
    return candidates.sort((a, b) => {
      const score = candidate =>
        (candidate.brand.top?.some(code => code.toUpperCase() === countryCode) ? 2000 : 0) +
        (priority.has(candidate.slug) ? 1000 - priority.get(candidate.slug) : 0) +
        (candidate.brand.isTopRated ? 200 : 0) +
        (candidate.brand.isExclusive ? 60 : 0) +
        (candidate.brand.isNew ? 30 : 0);
      return score(b) - score(a) || a.index - b.index;
    });
  };
  
  const getHomeRecommendationBrands = (countryCode, limit = 18) => {
    if (countryCode) {
      return selectUniqueHomeBrands(getHomeRecommendationCandidates(countryCode), limit).map(({ brand }) => brand);
    }
    return getFeaturedHomeBrands(BRANDS);
  };

  let syncHomeBrandTrack = () => {};
  let homeBrandResetFrame = 0;
  const renderHomeRecommendationCards = (brands = getHomeRecommendationBrands(getHomeGeoCode())) => {
    const grid = document.querySelector('.home-recommendation-grid');
    if (!grid) return;
    const fragment = document.createDocumentFragment();
    brands.forEach(brand => fragment.appendChild(createCasinoCard(brand, { favorite: true })));
    if (!brands.length) {
      const empty = document.createElement('p');
      empty.className = 'home-market-empty';
      empty.textContent = noCountryCasinos;
      fragment.appendChild(empty);
    }
    cancelAnimationFrame(homeBrandResetFrame);
    grid.classList.add('is-resetting');
    grid.replaceChildren(fragment);
    grid.scrollTo({ left: 0, behavior: 'instant' });
    // Don't let an old snap point or an in-flight arrow scroll affect the next market.
    homeBrandResetFrame = requestAnimationFrame(() => {
      grid.scrollTo({ left: 0, behavior: 'instant' });
      grid.classList.remove('is-resetting');
      syncHomeBrandTrack();
    });
    syncHomeBrandTrack();
    applyBrandLogoBackgrounds();
    requestPaymentIconSync();
  };
  
  const HOME_NEW_REVIEW_SLUGS = [
    // Preserve editorial sequence where older reviews record a day but no time.
    'aladdinsgold',
    'cryptoreels',
    'allstarslots',
    'luckyred',
    'jackspay',
    'slotsandcasino',
    'duckyluck',
    'bitgames',
    'onlywin',
    'robocat',
    'allwin',
    'letslucky',
    'zizobet',
    'winairlines',
    'spininio',
    'jeetcity',
    'goldenstar',
    'luckyhunter',
    'moonwin',
    'mrpunter',
    'wildsino',
    'hollywin',
    'westace',
    'spinrise',
    'winhero',
    'casinoinfinity',
    'dazard',
    'billybillion',
    'spinko',
    'felicebet',
    'grandwin',
    'viperwin',
  ];
  
  const latestReviewsLabel = localeText(
    'Latest casino reviews', 'Neue Casino-Bewertungen', 'Últimas reseñas de casinos', 'Nuove recensioni di casinò',
    'Najnowsze recenzje kasyn', 'Нові огляди казино', 'Novas avaliações de casinos', 'Avis récents sur les casinos',
    'नई कैसीनो समीक्षाएँ', 'Uudet kasinoarvostelut'
  );

  const renderHomeNewReviews = (homeGeo = getHomeGeoCode()) => {
    const grid = document.querySelector('.home-new-reviews-grid');
    if (!grid) return;

    const fragment = document.createDocumentFragment();
    const reviewCandidates = selectLatestReviewBrands(BRANDS, { market: homeGeo, fallbackSlugs: HOME_NEW_REVIEW_SLUGS });
    fragment.append(...reviewCandidates.map(brand => createReviewCard(brand, context)));
  
    grid.replaceChildren(fragment);
    grid.closest('.home-new-reviews').hidden = !reviewCandidates.length;
  };
  
  const initHomeMarketFilter = () => {
    const directory = document.querySelector('.home-country-directory');
    const section = document.getElementById('recommended-brands');
    const grid = section?.querySelector('.home-recommendation-grid');
    if (!directory || !section || !grid) return;

    const countries = new Map(COUNTRIES.map(country => [country.slug, country.code.toUpperCase()]));
    let selectedLink = null;

    const bar = document.createElement('div');
    const title = document.createElement('h2');
    const actions = document.createElement('div');
    const toolbar = document.createElement('div');
    const controls = document.createElement('div');
    const all = section.querySelector('.home-section-cta > a');
    const reviews = document.createElement('a');
    const guide = document.createElement('a');
    const reset = document.createElement('button');
    const defaultTitle = section.getAttribute('aria-label');
    bar.className = 'home-market-bar home-brand-toolbar';
    actions.className = 'home-market-actions';
    toolbar.className = 'home-brand-toolbar-actions';
    controls.className = 'home-brand-carousel-controls';
    controls.hidden = true;
    title.id = 'home-brand-carousel-title';
    title.tabIndex = -1;
    title.textContent = defaultTitle;
    title.setAttribute('aria-live', 'polite');
    grid.id = 'home-brand-carousel';
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-labelledby', title.id);
    const arrow = (direction, label) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `home-brand-arrow home-brand-arrow--${direction}`;
      button.setAttribute('aria-controls', grid.id);
      button.setAttribute('aria-label', label);
      return button;
    };
    const previous = arrow('previous', localeText('Previous brands', 'Vorherige Anbieter', 'Marcas anteriores', 'Marchi precedenti', 'Poprzednie marki', 'Попередні бренди', 'Marcas anteriores', 'Marques précédentes', 'पिछले ब्रांड', 'Edelliset brändit'));
    const next = arrow('next', localeText('Next brands', 'Nächste Anbieter', 'Marcas siguientes', 'Marchi successivi', 'Następne marki', 'Наступні бренди', 'Próximas marcas', 'Marques suivantes', 'अगले ब्रांड', 'Seuraavat brändit'));
    reviews.href = '#new-reviews-title';
    reviews.textContent = latestReviewsLabel;
    guide.textContent = localeText(
      'Country guide', 'Länder-Guide', 'Guía del país', 'Guida del paese', 'Przewodnik po kraju',
      'Гід країни', 'Guia do país', 'Guide du pays', 'देश की गाइड', 'Maaopas'
    );
    reset.type = 'button';
    reset.textContent = localeText(
      'Reset filter', 'Filter zurücksetzen', 'Quitar filtro', 'Azzera filtro', 'Wyczyść filtr',
      'Скинути фільтр', 'Limpar filtro', 'Réinitialiser le filtre', 'फ़िल्टर हटाएँ', 'Tyhjennä suodatin'
    );
    actions.hidden = true;
    actions.append(reviews, guide, reset);
    if (all) {
      const original = all.closest('.home-section-cta');
      all.className = 'home-brand-view-all';
      toolbar.append(all);
      original.remove();
    }
    controls.append(previous, next);
    toolbar.append(actions, controls);
    bar.append(title, toolbar);
    grid.before(bar);
    syncHomeBrandTrack = bindHomeBrandTrack(grid, controls, previous, next);

    reset.addEventListener('click', () => {
      const previous = selectedLink;
      previous?.removeAttribute('aria-current');
      selectedLink = null;
      delete section.dataset.selectedCountry;
      actions.hidden = true;
      if (all) all.hidden = false;
      title.textContent = defaultTitle;
      renderHomeRecommendationCards();
      renderHomeNewReviews();
      previous?.focus();
    });

    directory.addEventListener('click', event => {
      const link = event.target.closest('.countries-cloud a.country-link');
      if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const slug = link.pathname.split('/').filter(Boolean).at(-1);
      const code = countries.get(slug);
      if (!code) return;

      event.preventDefault();
      selectedLink?.removeAttribute('aria-current');
      selectedLink = link;
      selectedLink.setAttribute('aria-current', 'true');
      section.dataset.selectedCountry = slug;
      title.textContent = link.textContent.trim();
      guide.href = link.href;
      const brands = getHomeRecommendationBrands(code, Infinity);
      actions.hidden = false;
      if (all) all.hidden = true;
      reviews.hidden = !brands.length;
      renderHomeRecommendationCards(brands);
      renderHomeNewReviews(code);
      if (window.matchMedia('(max-width: 767px)').matches) {
        title.focus({ preventScroll: true });
        title.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  };

  const initCountryCatalogReviews = () => {
    const catalog = document.querySelector('.country-catalog-results');
    if (!catalog) return;
    const section = document.createElement('section');
    const content = document.createElement('div');
    const title = document.createElement('h2');
    const grid = document.createElement('div');
    section.className = 'home-new-reviews country-catalog-reviews';
    section.setAttribute('aria-labelledby', 'new-reviews-title');
    content.className = 'container';
    title.id = 'new-reviews-title';
    title.textContent = latestReviewsLabel;
    grid.className = 'home-new-reviews-grid';
    content.append(title, grid);
    section.append(content);
    catalog.after(section);
    renderHomeNewReviews(pageCountry);
  };

  const renderLocalizedHomeGames = () => {
    const homeGeo = getHomeGeoCode();
    const grid = document.querySelector('.home-games-grid');
    if (!homeGeo || !grid) return;
  
    const candidates = getHomeRecommendationCandidates(homeGeo).filter(candidate =>
      Array.isArray(BRAND_NEW_GAMES[candidate.slug]) && BRAND_NEW_GAMES[candidate.slug].length
    );
    const selected = [];
    const brandSlugs = new Set();
    const gameNames = new Set();
  
    candidates.forEach(candidate => {
      if (selected.length >= 18 || brandSlugs.has(candidate.slug)) return;
      const games = BRAND_NEW_GAMES[candidate.slug] || [];
      const game = games.find(item => {
        const key = normalizeText(item?.name).trim().toLocaleLowerCase();
        return item?.image && key && !gameNames.has(key);
      });
      if (!game) return;
      brandSlugs.add(candidate.slug);
      gameNames.add(normalizeText(game.name).trim().toLocaleLowerCase());
      selected.push({ brand: candidate.brand, game });
    });
  
    const fragment = document.createDocumentFragment();
    selected.forEach(({ brand, game }) => {
      const brandName = normalizeText(brand.name);
      const gameName = normalizeText(game.name);
      const link = document.createElement('a');
      const image = document.createElement('img');
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      const detail = document.createElement('small');
  
      link.className = 'home-game-card';
      link.href = brandPagePath(brand);
      image.src = game.image;
      image.alt = ''; // Game and casino names are already part of the link's text.
      image.loading = 'lazy';
      image.decoding = 'async';
      title.textContent = gameName;
      detail.textContent = brandName;
  
      copy.append(title, detail);
      link.append(image, copy);
      fragment.appendChild(link);
    });
  
    grid.replaceChildren(fragment);
  };

  const initMobileEditorialMethod = () => {
    const articles = document.querySelectorAll('.home-editorial-method .home-method-grid article');
    if (!articles.length) return;

    const collapsedLabel = localeText(
      'Show check details',
      'Prüfdetails anzeigen',
      'Mostrar los detalles de la revisión',
      'Mostra i dettagli del controllo',
      'Pokaż szczegóły weryfikacji',
      'Показати деталі перевірки',
      'Mostrar detalhes da verificação',
      'Afficher les détails du contrôle',
      'जाँच का विवरण दिखाएँ',
      'Näytä tarkistuksen tiedot'
    );
    const expandedLabel = localeText(
      'Hide check details',
      'Prüfdetails ausblenden',
      'Ocultar los detalles de la revisión',
      'Nascondi i dettagli del controllo',
      'Ukryj szczegóły weryfikacji',
      'Сховати деталі перевірки',
      'Ocultar detalhes da verificação',
      'Masquer les détails du contrôle',
      'जाँच का विवरण छिपाएँ',
      'Piilota tarkistuksen tiedot'
    );

    bindMobileEditorialCards(articles, {
      idPrefix: 'home-method',
      labels: { collapsed: collapsedLabel, expanded: expandedLabel },
    });
  };

  if (pageCountry) {
    initCountryCatalogReviews();
    return;
  }
  initHomeCountryCloud();
  initHomeMarketFilter();
  renderHomeRecommendationCards();
  renderHomeNewReviews();
  renderLocalizedHomeGames();
  initHomeGamesMotion(localeText);
  initMobileEditorialMethod();
};
