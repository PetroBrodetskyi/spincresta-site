// Page-specific module. Loaded dynamically by scripts/main.js.

export const initHomePage = context => {
  const {
    BRANDS,
    BRAND_HOMEPAGE_SCREENSHOTS,
    BRAND_NEW_GAMES,
    SITE_LOCALE,
    normalizeText,
    normalizeAssetPath,
    createCasinoCard,
    applyBrandLogoBackgrounds,
    requestPaymentIconSync,
    brandPagePath,
    localeText,
    setBrandBackground,
  } = context;

  const HOME_RECOMMENDATION_SLUGS = [
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
  
  const getBrandDetailSlug = brand =>
    String(brand?.urlDetail || '')
      .replace(/^\/?brands\//i, '')
      .replace(/\.html$/i, '')
      .replace(/^\/+|\/+$/g, '');
  
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
    const priority = new Map(HOME_RECOMMENDATION_SLUGS.map((slug, index) => [slug, index]));
  
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
  
  const renderHomeRecommendationCards = () => {
    const grid = document.querySelector('.home-recommendation-grid');
    if (!grid) return;
  
    const homeGeo = getHomeGeoCode();
    const fragment = document.createDocumentFragment();
  
    if (homeGeo) {
      selectUniqueHomeBrands(getHomeRecommendationCandidates(homeGeo), 18).forEach(({ brand }) => {
        fragment.appendChild(createCasinoCard(brand));
      });
    } else {
      const brandBySlug = new Map(
        BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail).map(brand => [getBrandDetailSlug(brand), brand])
      );
      HOME_RECOMMENDATION_SLUGS.forEach(slug => {
        const brand = brandBySlug.get(slug);
        if (brand) fragment.appendChild(createCasinoCard(brand));
      });
    }
  
    grid.replaceChildren(fragment);
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
  
  const renderHomeNewReviews = () => {
    const grid = document.querySelector('.home-new-reviews-grid');
    if (!grid) return;
  
    const homeGeo = getHomeGeoCode();
    const brandBySlug = new Map(
      BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail && brand.image && !brand.notRecommended).map(
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
          null,
          null,
          `${name} की समीक्षा पढ़ें`
        )
      );
      logo.className = 'home-new-review-logo';
      setBrandBackground(logo, brand.bgColor);
      image.src = normalizeAssetPath(brand.image);
      image.alt = `${name} logo`;
      image.loading = 'lazy';
      image.decoding = 'async';
      title.textContent = name;
  
      logo.appendChild(image);
      link.append(logo, title);
      fragment.appendChild(link);
    });
  
    grid.replaceChildren(fragment);
  };
  
  const renderLocalizedHomeCasinoGallery = () => {
    const homeGeo = getHomeGeoCode();
    const grid = document.querySelector('.home-casino-gallery-grid');
    if (!homeGeo || !grid) return;
  
    const candidates = getHomeRecommendationCandidates(homeGeo).filter(candidate =>
      Boolean(BRAND_HOMEPAGE_SCREENSHOTS[candidate.slug])
    );
    const fragment = document.createDocumentFragment();
  
    selectUniqueHomeBrands(candidates, 9).forEach(({ brand, slug }) => {
      const name = normalizeText(brand.name);
      const link = document.createElement('a');
      const image = document.createElement('img');
      const copy = document.createElement('span');
      const title = document.createElement('strong');
      const detail = document.createElement('small');
  
      link.className = 'home-casino-shot';
      link.href = brandPagePath(brand);
      image.src = BRAND_HOMEPAGE_SCREENSHOTS[slug];
      image.alt = localeText(
        `${name} casino homepage`,
        `${name} Casino-Startseite`,
        `Página de inicio del casino ${name}`,
        `Home page del casinò ${name}`,
        `Strona główna kasyna ${name}`,
        `Головна сторінка казино ${name}`,
        null,
        null,
        `${name} कैसीनो होमपेज`
      );
      image.width = 3024;
      image.height = 1574;
      image.loading = 'lazy';
      image.decoding = 'async';
      title.textContent = name;
      detail.textContent = localeText(
        'Casino review and current details',
        'Casino-Test und aktuelle Details',
        'Reseña y datos actuales',
        'Recensione e dettagli aggiornati',
        'Recenzja i aktualne informacje',
        'Огляд та актуальна інформація',
        null,
        null,
        'समीक्षा और नवीनतम जानकारी'
      );
  
      copy.append(title, detail);
      link.append(image, copy);
      fragment.appendChild(link);
    });
  
    grid.replaceChildren(fragment);
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

  renderHomeRecommendationCards();
  renderHomeNewReviews();
  renderLocalizedHomeCasinoGallery();
  renderLocalizedHomeGames();
};
