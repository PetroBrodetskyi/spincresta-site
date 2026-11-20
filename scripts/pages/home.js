// Page-specific module. Loaded dynamically by scripts/main.js.

import { getBrandDetailSlug, getFeaturedHomeBrands } from '../featured-brands.js?v=20261119-shared-search';

const HOME_GAMES_PX_PER_SECOND = 24;
const HOME_GAMES_SCROLL_IDLE_MS = 950;

export const homeBrandScrollStep = (viewport, card, gap) => {
  const column = card + gap;
  return column > 0 ? column * Math.max(1, Math.floor((viewport + gap) / column)) : viewport;
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
  grid.addEventListener('scroll', sync, { passive: true });
  if (window.ResizeObserver) new ResizeObserver(sync).observe(grid);
  else window.addEventListener('resize', sync, { passive: true });
  return sync;
}

export const advanceHomeGames = (position, elapsed, distance) =>
  distance > 0 ? (position + Math.min(elapsed, 64) * HOME_GAMES_PX_PER_SECOND / 1000) % distance : 0;

export const initHomeGamesMotion = localeText => {
  const section = document.querySelector('.home-new-games');
  const grid = section?.querySelector('.home-games-grid');
  const toolbar = section?.querySelector('.home-showcase-heading > div');
  const cards = [...grid?.children || []];
  if (!toolbar || cards.length < 2 || grid.id === 'new-games-strip' ||
      !window.IntersectionObserver || !window.ResizeObserver) return;

  grid.id = 'new-games-strip';
  grid.tabIndex = 0;
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-labelledby', 'new-games-title');
  toolbar.classList.add('home-games-toolbar');

  const pauseLabel = localeText(
    'Pause', 'Pause', 'Pausar', 'Pausa', 'Pauza', 'Пауза',
    'Pausar', 'Pause', 'रोकें', 'Tauko'
  );
  const resumeLabel = localeText(
    'Resume', 'Fortsetzen', 'Reanudar', 'Riprendi', 'Wznów', 'Продовжити',
    'Retomar', 'Reprendre', 'फिर शुरू करें', 'Jatka'
  );
  const previousLabel = localeText(
    'Previous games', 'Vorherige Spiele', 'Juegos anteriores', 'Giochi precedenti', 'Poprzednie gry',
    'Попередні ігри', 'Jogos anteriores', 'Jeux précédents', 'पिछले गेम', 'Edelliset pelit'
  );
  const nextLabel = localeText(
    'Next games', 'Nächste Spiele', 'Juegos siguientes', 'Giochi successivi', 'Kolejne gry',
    'Наступні ігри', 'Próximos jogos', 'Jeux suivants', 'अगले गेम', 'Seuraavat pelit'
  );
  const controls = document.createElement('div');
  controls.className = 'home-games-controls';
  const button = (className, symbol, label) => {
    const control = document.createElement('button');
    control.type = 'button';
    control.className = `home-games-control ${className}`;
    control.setAttribute('aria-controls', grid.id);
    if (label) {
      control.setAttribute('aria-label', label);
      control.title = label;
    }
    const icon = document.createElement('span');
    icon.className = 'home-games-control-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = symbol;
    control.append(icon);
    return control;
  };
  const toggle = button('home-games-motion-toggle', 'Ⅱ');
  const toggleLabel = document.createElement('span');
  toggle.append(toggleLabel);
  const previous = button('home-games-arrow', '‹', previousLabel);
  const next = button('home-games-arrow', '›', nextLabel);
  controls.append(toggle, previous, next);
  toolbar.append(controls);

  // A second pass keeps the seam invisible. Only the original links are tabbable.
  const copies = cards.map(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    copy.hidden = true;
    return copy;
  });
  grid.append(...copies);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let pausedByUser = false;
  let hovering = false;
  let focused = false;
  let settlingTimer = 0;
  const activePointers = new Set();
  let distance = 0;
  let cardStep = 0;
  let position = 0;
  let raf = 0;
  let previousTime = 0;

  const move = time => {
    position = advanceHomeGames(position, previousTime ? time - previousTime : 0, distance);
    previousTime = time;
    grid.scrollLeft = position;
    raf = requestAnimationFrame(move);
  };
  const syncMotion = () => {
    const active = distance && inView && !pausedByUser && !hovering && !focused &&
      !settlingTimer && !activePointers.size && !document.hidden;
    if (active && !raf) {
      position = grid.scrollLeft;
      raf = requestAnimationFrame(move);
    } else if (!active && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      previousTime = 0;
    }
  };
  const setPaused = value => {
    pausedByUser = value;
    toggle.firstElementChild.textContent = pausedByUser ? '▶' : 'Ⅱ';
    toggleLabel.textContent = pausedByUser ? resumeLabel : pauseLabel;
    syncMotion();
  };
  const waitForScrollIdle = () => {
    clearTimeout(settlingTimer);
    settlingTimer = window.setTimeout(() => {
      settlingTimer = 0;
      syncMotion();
    }, HOME_GAMES_SCROLL_IDLE_MS);
    syncMotion();
  };
  const syncArrows = () => {
    previous.disabled = !distance && grid.scrollLeft < 1;
    next.disabled = !distance && grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;
  };
  const measure = () => {
    const first = cards[0].getBoundingClientRect();
    const width = cards.at(-1).getBoundingClientRect().right - first.left;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const hasOverflow = width > grid.clientWidth + 1;
    distance = !reduced.matches && hasOverflow ? width + gap : 0;
    cardStep = first.width + gap;
    copies.forEach(copy => { copy.hidden = !distance; });
    toggle.hidden = !distance;
    controls.hidden = !hasOverflow;
    if (distance && grid.scrollLeft >= distance) grid.scrollLeft %= distance;
    position = grid.scrollLeft;
    syncArrows();
    syncMotion();
  };

  const stepByCard = direction => {
    waitForScrollIdle();
    if (distance) {
      const offset = grid.scrollLeft % distance;
      grid.scrollLeft = offset + (offset + direction * cardStep < 0 ? distance : 0);
    }
    grid.scrollBy({ left: direction * cardStep, behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  toggle.addEventListener('click', () => setPaused(!pausedByUser));
  previous.addEventListener('click', () => stepByCard(-1));
  next.addEventListener('click', () => stepByCard(1));
  // A vertical scroll can move the row under a stationary pointer without intent to hover.
  grid.addEventListener('pointermove', event => {
    if (hovering || event.pointerType !== 'mouse' || !(event.movementX || event.movementY)) return;
    hovering = true;
    syncMotion();
  });
  grid.addEventListener('pointerleave', () => { hovering = false; syncMotion(); });
  grid.addEventListener('focusin', () => { focused = true; syncMotion(); });
  grid.addEventListener('focusout', event => {
    focused = grid.contains(event.relatedTarget);
    syncMotion();
  });
  grid.addEventListener('pointerdown', event => {
    activePointers.add(event.pointerId);
    syncMotion();
  }, { passive: true });
  const finishGesture = event => {
    if (activePointers.delete(event.pointerId)) waitForScrollIdle();
  };
  window.addEventListener('pointerup', finishGesture, { passive: true });
  window.addEventListener('pointercancel', finishGesture, { passive: true });
  window.addEventListener('blur', () => {
    activePointers.clear();
    hovering = false;
    syncMotion();
  });
  grid.addEventListener('wheel', event => {
    if (event.deltaX || (event.shiftKey && event.deltaY)) waitForScrollIdle();
  }, { passive: true });
  grid.addEventListener('scroll', () => {
    if (settlingTimer) waitForScrollIdle();
    if (!distance) syncArrows();
  }, { passive: true });
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', measure);
  new ResizeObserver(measure).observe(grid);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncMotion();
  }).observe(grid);

  setPaused(false);
  measure();
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
    const directory = document.querySelector('.home-country-directory');
    const cloud = directory?.querySelector('.countries-cloud');
    if (!cloud) return;
    const extraCountries = [...cloud.children].slice(18);
    if (!extraCountries.length) return;
    extraCountries.forEach(link => link.classList.add('home-country-extra'));

    const showAll = localeText(
      'Show all countries', 'Alle Länder anzeigen', 'Mostrar todos los países',
      'Mostra tutti i paesi', 'Pokaż wszystkie kraje', 'Показати всі країни',
      'Mostrar todos os países', 'Voir tous les pays', 'सभी देश दिखाएँ', 'Näytä kaikki maat'
    );
    const showFewer = localeText(
      'Show fewer countries', 'Weniger Länder anzeigen', 'Mostrar menos países',
      'Mostra meno paesi', 'Pokaż mniej krajów', 'Згорнути список країн',
      'Mostrar menos países', 'Afficher moins de pays', 'कम देश दिखाएँ', 'Näytä vähemmän maita'
    );
    const toggle = document.createElement('button');
    toggle.type = 'button';
    toggle.className = 'home-country-toggle';
    cloud.id = 'home-country-cloud';
    toggle.setAttribute('aria-controls', cloud.id);

    const setExpanded = expanded => {
      cloud.classList.toggle('is-collapsed', !expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.textContent = expanded ? showFewer : `${showAll} (${cloud.children.length})`;
    };

    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') !== 'true';
      setExpanded(expanded);
      if (expanded) extraCountries[0].focus();
    });
    setExpanded(false);
    directory.append(toggle);
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
  const renderHomeRecommendationCards = (brands = getHomeRecommendationBrands(getHomeGeoCode()), append = false) => {
    const grid = document.querySelector('.home-recommendation-grid');
    if (!grid) return;
    const fragment = document.createDocumentFragment();
    brands.forEach(brand => fragment.appendChild(createCasinoCard(brand, { favorite: true })));
    if (!brands.length && !append) {
      const empty = document.createElement('p');
      empty.className = 'home-market-empty';
      empty.textContent = noCountryCasinos;
      fragment.appendChild(empty);
    }
    if (append) grid.appendChild(fragment);
    else {
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
    }
    syncHomeBrandTrack();
    applyBrandLogoBackgrounds();
    requestPaymentIconSync();
  };
  
  const HOME_NEW_REVIEW_SLUGS = [
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

    const brandBySlug = new Map(
      BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail && brand.image && !brand.notRecommended && !brand.temporarilyUnavailable).map(
        brand => [getBrandDetailSlug(brand), brand]
      )
    );
    const fragment = document.createDocumentFragment();
  
    const reviewCandidates = homeGeo
      ? (() => {
          const eligible = getHomeGeoBrands(homeGeo);
          const bySlug = new Map(eligible.map(candidate => [candidate.slug, candidate]));
          const preferred = HOME_NEW_REVIEW_SLUGS.map(slug => bySlug.get(slug)).filter(Boolean);
          const recentRemainder = [...eligible].sort((a, b) => b.index - a.index);
          return selectUniqueHomeBrands([...preferred, ...recentRemainder], 24).map(candidate => candidate.brand);
        })()
      : HOME_NEW_REVIEW_SLUGS.map(slug => brandBySlug.get(slug)).filter(Boolean);
  
    reviewCandidates.forEach(brand => {
      if (!brand) return;
  
      const name = normalizeText(brand.name);
      const link = document.createElement('a');
      const logo = document.createElement('span');
      const image = document.createElement('img');
      const title = document.createElement('strong');
  
      link.className = 'home-new-review-card';
      link.href = brandPagePath(brand.urlDetail);
      link.setAttribute(
        'aria-label',
        localeText(
          `Read the ${name} review`,
          `${name} Test lesen`,
          `Leer la reseña de ${name}`,
          `Leggi la recensione di ${name}`,
          `Przeczytaj recenzję ${name}`,
          `Прочитати огляд ${name}`,
          `Ler a avaliação de ${name}`,
          `Lire l’avis sur ${name}`,
          `${name} की समीक्षा पढ़ें`,
          `Lue ${name}-arvostelu`
        )
      );
      logo.className = 'home-new-review-logo';
      setBrandBackground(logo, brand.bgColor);
      image.src = normalizeAssetPath(brand.image);
      image.alt = '';
      image.loading = 'lazy';
      image.decoding = 'async';
      title.textContent = name;
  
      logo.appendChild(image);
      link.append(logo, title);
      fragment.appendChild(link);
    });
  
    grid.replaceChildren(fragment);
    grid.closest('.home-new-reviews').hidden = !reviewCandidates.length;
  };
  
  const initHomeMarketFilter = () => {
    const directory = document.querySelector('.home-country-directory');
    const section = document.getElementById('recommended-brands');
    const grid = section?.querySelector('.home-recommendation-grid');
    if (!directory || !section || !grid) return;

    const countries = new Map(COUNTRIES.map(country => [country.slug, country.code.toUpperCase()]));
    const batchSize = 20;
    let selectedLink = null;
    let brands = [];
    let visibleCount = 0;

    const bar = document.createElement('div');
    const title = document.createElement('h2');
    const actions = document.createElement('div');
    const toolbar = document.createElement('div');
    const controls = document.createElement('div');
    const all = section.querySelector('.home-section-cta > a');
    const reviews = document.createElement('a');
    const guide = document.createElement('a');
    const reset = document.createElement('button');
    const more = document.createElement('button');
    const defaultTitle = section.getAttribute('aria-label');
    bar.className = 'home-market-bar home-brand-toolbar';
    actions.className = 'home-market-actions';
    toolbar.className = 'home-brand-toolbar-actions';
    controls.className = 'home-brand-carousel-controls';
    controls.hidden = true;
    title.id = 'home-brand-carousel-title';
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
    reset.type = more.type = 'button';
    reset.textContent = localeText(
      'Reset filter', 'Filter zurücksetzen', 'Quitar filtro', 'Azzera filtro', 'Wyczyść filtr',
      'Скинути фільтр', 'Limpar filtro', 'Réinitialiser le filtre', 'फ़िल्टर हटाएँ', 'Tyhjennä suodatin'
    );
    more.className = 'home-market-more';
    more.textContent = localeText(
      'Show more casinos', 'Mehr Casinos anzeigen', 'Ver más casinos', 'Mostra altri casinò', 'Pokaż więcej kasyn',
      'Показати більше казино', 'Ver mais casinos', 'Voir plus de casinos', 'और कैसीनो दिखाएँ', 'Näytä lisää kasinoita'
    );
    actions.hidden = more.hidden = true;
    actions.append(reviews, guide, reset);
    if (all) {
      const original = all.closest('.home-section-cta');
      all.className = 'home-brand-view-all';
      all.textContent = localeText('Show all casinos', 'Alle Casinos anzeigen', 'Ver todos los casinos', 'Mostra tutti i casinò', 'Pokaż wszystkie kasyna', 'Усі казино', 'Ver todos os casinos', 'Voir tous les casinos', 'सभी कैसीनो दिखाएँ', 'Näytä kaikki kasinot');
      toolbar.append(all);
      original.remove();
    }
    controls.append(previous, next);
    toolbar.append(actions, controls);
    bar.append(title, toolbar);
    grid.before(bar);
    grid.after(more);
    syncHomeBrandTrack = bindHomeBrandTrack(grid, controls, previous, next);

    const renderBatch = (append = false) => {
      const next = brands.slice(visibleCount, visibleCount + batchSize);
      renderHomeRecommendationCards(next, append);
      visibleCount += next.length;
      more.hidden = visibleCount >= brands.length;
    };

    more.addEventListener('click', () => {
      const firstNewCard = visibleCount;
      renderBatch(true);
      grid.children[firstNewCard]?.querySelector('.cta')?.focus();
    });

    reset.addEventListener('click', () => {
      const previous = selectedLink;
      previous?.removeAttribute('aria-current');
      selectedLink = null;
      delete section.dataset.selectedCountry;
      actions.hidden = more.hidden = true;
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
      brands = getHomeRecommendationBrands(code, Infinity);
      visibleCount = 0;
      actions.hidden = false;
      if (all) all.hidden = true;
      reviews.hidden = !brands.length;
      renderBatch();
      renderHomeNewReviews(code);
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
      image.alt = localeText(
        `${gameName} game artwork`,
        `${gameName} Spielgrafik`,
        `Imagen del juego ${gameName}`,
        `Immagine del gioco ${gameName}`,
        `Grafika gry ${gameName}`,
        `Зображення гри ${gameName}`,
        null,
        null,
        `${gameName} गेम का चित्र`
      );
      image.loading = 'lazy';
      image.decoding = 'async';
      title.textContent = gameName;
      detail.textContent = `${localeText('at', 'bei', 'en', 'su', 'w', 'у', 'no', 'chez', 'पर')} ${brandName}`;
  
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

    articles.forEach((article, index) => {
      if (article.dataset.mobileAccordionReady === 'true') return;
      const heading = article.querySelector(':scope > h3');
      const copy = article.querySelector(':scope > p');
      if (!heading || !copy) return;

      const headingId = heading.id || `home-method-heading-${index + 1}`;
      const copyId = copy.id || `home-method-copy-${index + 1}`;
      heading.id = headingId;
      copy.id = copyId;

      const toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'home-method-toggle';
      toggle.setAttribute('aria-controls', copyId);
      toggle.setAttribute('aria-labelledby', headingId);
      toggle.innerHTML = '<span aria-hidden="true"></span>';

      const syncToggle = isExpanded => {
        article.classList.toggle('is-mobile-expanded', isExpanded);
        toggle.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
        toggle.setAttribute('aria-label', isExpanded ? expandedLabel : collapsedLabel);
        toggle.title = isExpanded ? expandedLabel : collapsedLabel;
      };
      toggle.addEventListener('click', () => {
        syncToggle(toggle.getAttribute('aria-expanded') !== 'true');
      });

      article.appendChild(toggle);
      article.dataset.mobileAccordionReady = 'true';
      syncToggle(false);
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
