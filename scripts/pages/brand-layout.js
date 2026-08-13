// Brand layout module. Loaded only on body[data-brand] pages.

export const initBrandLayout = context => {
  const {
    BRAND_NEW_GAMES,
    normalizeText,
    normalizeBrandKey,
    escapeHtml,
    localeText,
  } = context;

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
      return /why\s+players\s+choose|warum\s+spieler|por\s+qu[eé]\s+los\s+jugadores/i.test(normalizeText(title?.textContent || ''));
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
          aria-label="${localeText(
            `Play ${escapeHtml(game.name)} at ${escapeHtml(document.body.dataset.brand)}`,
            `${escapeHtml(game.name)} bei ${escapeHtml(document.body.dataset.brand)} spielen`,
            `Jugar a ${escapeHtml(game.name)} en ${escapeHtml(document.body.dataset.brand)}`
          )}"
        >
          ${cardContent}
        </a>
      `;
    };
  
    const newGamesLabel = localeText('New Games', 'Neue Spiele', 'Juegos nuevos');
    const newGamesKicker = localeText('LATEST RELEASES', 'NEUESTE VERÖFFENTLICHUNGEN', 'ÚLTIMOS LANZAMIENTOS');
    const rail = document.createElement('aside');
    rail.className = 'brand-new-games-rail';
    rail.setAttribute('aria-label', newGamesLabel);
    rail.innerHTML = `
      <div class="brand-new-games-panel">
        <div class="brand-new-games-heading">
          <span class="brand-new-games-kicker">${newGamesKicker}</span>
          <h2>${newGamesLabel}</h2>
        </div>
        <div class="brand-new-games-list">
          ${games.map(cardMarkup).join('')}
        </div>
      </div>
    `;
  
    return rail;
  };
  
  const applyBrandStickyReviewLayout = () => {
    const existingLayout = document.querySelector('.brand-sticky-review-layout');
    if (existingLayout) {
      if (!existingLayout.querySelector('.brand-new-games-rail')) {
        const newGamesRail = createBrandNewGamesRail();
        if (newGamesRail) existingLayout.appendChild(newGamesRail);
      }
      return;
    }

    const hero = document.querySelector('body[data-brand] .hero');
    const heroContent = hero?.querySelector(':scope > .hero-content');
    const allCountries = document.querySelector('body[data-brand] .all-countries');
    if (!hero || !heroContent || !allCountries) {
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

  applyBrandHeroConcept();
  applyBrandStickyReviewLayout();
  initBrandWhyPreview();
};
