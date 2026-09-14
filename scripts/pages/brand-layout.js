// Brand layout module. Loaded only on body[data-brand] pages.

export const initBrandLayout = context => {
  const {
    BRANDS = [],
    BRAND_NEW_GAMES,
    normalizeText,
    normalizeBrandKey,
    findBrandByPageKey = () => null,
    escapeHtml,
    localeText,
    localizedBrandBonusText = value => value,
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

  const ensureBrandRightRail = layout => {
    let rightRail = layout?.querySelector(':scope > .brand-right-rail');
    if (rightRail) return rightRail;

    rightRail = document.createElement('div');
    rightRail.className = 'brand-right-rail';
    layout?.appendChild(rightRail);
    return rightRail;
  };

  const bindResponsiveMove = ({ element, target, className, mediaQuery, prepend = false }) => {
    if (!element || !target) return;

    if (element.dataset.responsiveRailBound === 'true') {
      if (window.matchMedia(mediaQuery).matches) {
        element.classList.add(className);
        if (prepend) target.prepend(element);
        else target.appendChild(element);
      }
      return;
    }

    const placeholder = document.createComment(`Original position for ${className}`);
    element.parentNode?.insertBefore(placeholder, element);
    element.dataset.responsiveRailBound = 'true';
    const query = window.matchMedia(mediaQuery);

    const syncPosition = () => {
      if (query.matches) {
        element.classList.add(className);
        if (prepend) target.prepend(element);
        else target.appendChild(element);
        return;
      }

      element.classList.remove(className);
      placeholder.after(element);
    };

    syncPosition();
    query.addEventListener?.('change', syncPosition);
  };

  const bestForTitlePattern = /(?:\bwho\b.*\b(?:suits?|best for)\b|\bbest for\b|\bfür wen\b|\bgeeignet für\b|\bpasst zu\b|\bpara quién\b|\bideal para\b|\ba chi\b.*\badatt|\bideale per\b|\bdla kogo\b|\bnajlepsze dla\b|\bodpowiednie dla\b|\bкому\b.*\bпідход|\bнайкраще підход|\bpara quem\b|\bindicado para\b|\bà qui\b.*\bconvient|\bpour qui\b|किसके लिए|उपयुक्त|\bkenelle\b.*\bsopii|\bparas kenelle\b)/i;
  const prosConsTitlePattern =
    /\bpros?\b.*\bcons?\b|\bvorzüge\b.*\bnachteile\b|\bvorteile\b.*\bnachteile\b|ventajas.*desventajas|pro.*contro|zalety.*wady|переваги.*недоліки|pr[oó]s.*contras|avantages.*inconv[eé]nients|फायदे.*नुकसान|hyv[aä]t.*huonot/i;
  const responsibleTitlePattern =
    /responsible|safer\s+play|verantwort|juego\s+responsable|gioco\s+responsabile|odpowiedzial|відповідаль|jogo\s+respons[aá]vel|jeu\s+responsable|जिम्मेदार|vastuull/i;
  const hasTabularContent = section =>
    Boolean(section?.querySelector('table, .brand-mobile-table, [role="table"]'));

  const initSidebarEditorialSections = (layout, aside) => {
    if (!layout || !aside) return;

    const sections = Array.from(
      layout.querySelectorAll('.brand-sticky-main .content-review > section.container')
    );
    const bestFor =
      sections.find(section => section.id === 'best-for') ||
      sections.find(section => {
        const title = section.querySelector(':scope > .title, :scope > h2');
        return bestForTitlePattern.test(normalizeText(title?.textContent || ''));
      });
    const prosCons =
      sections.find(section => section.id === 'pros-cons') ||
      sections.find(section => section.querySelector('.pros-cons-icon')) ||
      sections.find(section => {
        const title = section.querySelector(':scope > .title, :scope > h2');
        return prosConsTitlePattern.test(normalizeText(title?.textContent || ''));
      });

    [bestFor, prosCons]
      .filter(section => section && !hasTabularContent(section))
      .forEach(section => {
      bindResponsiveMove({
        element: section,
        target: aside,
        className: 'brand-sidebar-section',
        mediaQuery: '(min-width: 901px)',
        });
      });
  };

  const initAdditionalRailSections = (layout, aside, rightRail) => {
    if (!layout || !aside || !rightRail) return;

    const needsLeftSection = layout.dataset.leftEditorialBound !== 'true';
    const needsRightSection = layout.dataset.rightEditorialBound !== 'true';
    if (!needsLeftSection && !needsRightSection) return;

    const candidates = Array.from(
      layout.querySelectorAll('.brand-sticky-main .content-review > section.container')
    ).filter(section => {
      if (section.classList.contains('brand-sidebar-section')) return false;
      if (hasTabularContent(section)) return false;
      if (['best-for', 'pros-cons', 'faq'].includes(section.id)) return false;
      const title = normalizeText(
        section.querySelector(':scope > .title, :scope > h2')?.textContent || ''
      );
      if (prosConsTitlePattern.test(title) || responsibleTitlePattern.test(title)) {
        return false;
      }
      if (
        section.querySelector(
          ':scope > .faq-accordion-surface, :scope > .faq-grid, :scope > .timeline'
        )
      ) {
        return false;
      }
      return Boolean(
        section.querySelector(':scope > .features-grid, :scope > .premium-grid')
      );
    });

    const leftSection = needsLeftSection
      ? candidates.find(section => section.id === 'casino-lobby') || candidates[0]
      : null;
    const rightSection = needsRightSection
      ? candidates.find(section => section !== leftSection && section.id === 'trust') ||
        candidates.find(section => section !== leftSection)
      : null;

    if (leftSection) {
      layout.dataset.leftEditorialBound = 'true';
      bindResponsiveMove({
        element: leftSection,
        target: aside,
        className: 'brand-sidebar-section',
        mediaQuery: '(min-width: 901px)',
      });
    }

    if (rightSection) {
      layout.dataset.rightEditorialBound = 'true';
      bindResponsiveMove({
        element: rightSection,
        target: rightRail,
        className: 'brand-sidebar-section',
        mediaQuery: '(min-width: 1200px)',
      });
    }
  };

  const initLowerRailSections = (layout, aside, rightRail) => {
    if (!layout || !aside || !rightRail) return;

    const needsResponsibleSection = layout.dataset.responsibleRailBound !== 'true';
    const needsFaqSection = layout.dataset.faqRailBound !== 'true';
    if (!needsResponsibleSection && !needsFaqSection) return;

    const sections = Array.from(
      layout.querySelectorAll('.brand-sticky-main .content-review > section.container')
    ).filter(
      section =>
        !section.classList.contains('brand-sidebar-section') &&
        !hasTabularContent(section)
    );
    const titleText = section =>
      normalizeText(
        section.querySelector(':scope > .title, :scope > h2')?.textContent || ''
      );
    const responsibleSection = needsResponsibleSection
      ? sections.find(
          section =>
            /responsible|safer/i.test(section.id) ||
            responsibleTitlePattern.test(titleText(section))
        )
      : null;
    const faqSection = needsFaqSection
      ? sections.find(
          section =>
            section !== responsibleSection &&
            (/faq/i.test(section.id) ||
              Boolean(
                section.querySelector(
                  ':scope > .faq-accordion-surface, :scope > .faq-grid, :scope > .timeline'
                )
              ))
        )
      : null;

    if (responsibleSection) {
      layout.dataset.responsibleRailBound = 'true';
      bindResponsiveMove({
        element: responsibleSection,
        target: aside,
        className: 'brand-sidebar-section',
        mediaQuery: '(min-width: 1200px)',
      });
    }

    if (faqSection) {
      layout.dataset.faqRailBound = 'true';
      bindResponsiveMove({
        element: faqSection,
        target: rightRail,
        className: 'brand-sidebar-section',
        mediaQuery: '(min-width: 1200px)',
      });
    }
  };

  const createBrandQuickFacts = (layout, rightRail) => {
    if (!rightRail || rightRail.querySelector('.brand-quick-facts')) return;
    if (!layout.querySelector('.brand-hero-panel')) return;

    const pageKey = document.body.dataset.brand || '';
    const brandKey = normalizeBrandKey(pageKey);
    const brand =
      findBrandByPageKey(pageKey) ||
      BRANDS.find(item => normalizeBrandKey(item.name || '') === brandKey);
    if (!brand) return;

    const bonus = localizedBrandBonusText(brand.bonus || '');
    const countryCount = Array.isArray(brand.countries) ? brand.countries.length : 0;
    if (!bonus && !countryCount) return;

    const labels = {
      heading: localeText('At a glance', 'Auf einen Blick', 'De un vistazo', 'In breve', 'W skrócie', 'Коротко', 'Em resumo', 'En bref', 'एक नज़र में', 'Yhteenveto'),
      bonus: localeText('Welcome offer', 'Willkommensangebot', 'Oferta de bienvenida', 'Offerta di benvenuto', 'Oferta powitalna', 'Вітальна пропозиція', 'Oferta de boas-vindas', 'Offre de bienvenue', 'वेलकम ऑफ़र', 'Tervetulotarjous'),
      markets: localeText('Available markets', 'Verfügbare Märkte', 'Mercados disponibles', 'Mercati disponibili', 'Dostępne rynki', 'Доступні ринки', 'Mercados disponíveis', 'Marchés disponibles', 'उपलब्ध बाज़ार', 'Saatavilla olevat markkinat'),
      countries: localeText('countries', 'Länder', 'países', 'Paesi', 'krajów', 'країн', 'países', 'pays', 'देश', 'maata'),
    };

    const facts = document.createElement('aside');
    facts.className = 'brand-quick-facts';
    facts.setAttribute('aria-label', labels.heading);
    facts.innerHTML = `
      <span class="brand-quick-facts__heading">${escapeHtml(labels.heading)}</span>
      ${bonus ? `<a href="#bonuses"><small>${escapeHtml(labels.bonus)}</small><strong>${escapeHtml(bonus)}</strong></a>` : ''}
      ${countryCount ? `<a href="#brand-countries"><small>${escapeHtml(labels.markets)}</small><strong>${countryCount} ${escapeHtml(labels.countries)}</strong></a>` : ''}
    `;
    rightRail.appendChild(facts);
  };

  const initBrandProfileShowcase = (layout, aside) => {
    if (!layout || !aside) return;

    let showcase = layout.querySelector(':scope > .brand-profile-showcase');
    if (!showcase) {
      const logoPanel = aside.querySelector('.brand-hero-logo-panel');
      const logo = logoPanel?.querySelector('.brand-logo-container');
      const summaryPanel = aside.querySelector('.brand-hero-summary-panel');
      const heading = summaryPanel?.querySelector('h1');
      const ctaWrapper = summaryPanel?.querySelector('.hero-cta-wrapper');
      const preview = layout.querySelector('#brand-why-section .brand-why-media');
      if (!logo || !heading || !ctaWrapper || !preview) return;

      showcase = document.createElement('section');
      showcase.className = 'brand-profile-showcase';
      showcase.innerHTML = `
        <div class="brand-profile-showcase__media"></div>
        <div class="brand-profile-showcase__bar">
          <div class="brand-profile-showcase__identity"></div>
          <div class="brand-profile-showcase__actions"></div>
        </div>
      `;

      const media = showcase.querySelector('.brand-profile-showcase__media');
      const identity = showcase.querySelector('.brand-profile-showcase__identity');
      const actions = showcase.querySelector('.brand-profile-showcase__actions');
      preview.disabled = true;
      preview.tabIndex = -1;
      preview.setAttribute('aria-expanded', 'true');
      media.appendChild(preview);
      identity.append(logo, heading);
      actions.appendChild(ctaWrapper);
      logoPanel.remove();
      layout.prepend(showcase);
    }

    const showcaseImage = showcase.querySelector('.brand-profile-showcase__media img');
    const showcaseImageUrl = showcaseImage?.currentSrc || showcaseImage?.getAttribute('src');
    if (showcaseImageUrl) {
      showcase.style.setProperty(
        '--brand-showcase-image',
        `url(${JSON.stringify(showcaseImageUrl)})`
      );
    }

    const actions = showcase.querySelector('.brand-profile-showcase__actions');
    const bindRating = () => {
      const teaser = document.querySelector('body[data-brand] .brand-rating-teaser');
      if (!teaser || !actions) return false;

      teaser.classList.remove('brand-right-rating');
      teaser.classList.add('brand-profile-rating');
      actions.prepend(teaser);
      return true;
    };

    if (!bindRating() && showcase.dataset.ratingObserved !== 'true') {
      showcase.dataset.ratingObserved = 'true';
      const observer = new MutationObserver(() => {
        if (bindRating()) observer.disconnect();
      });
      observer.observe(layout, { childList: true, subtree: true });
    }
  };

  const initRightRailContent = (layout, rightRail) => {
    if (!layout || !rightRail) return;

    const payments = layout.querySelector('.brand-sticky-main .brand-payments');
    bindResponsiveMove({
      element: payments,
      target: rightRail,
      className: 'brand-right-payments',
      mediaQuery: '(min-width: 1200px)',
    });

    createBrandQuickFacts(layout, rightRail);
  };

  const initSidebarHighlights = layout => {
    const aside = layout?.querySelector('.brand-sticky-aside');
    const whySection = layout?.querySelector('#brand-why-section, .brand-hero-why');
    const highlights = whySection?.querySelector(
      ':scope > .features-grid, :scope > .premium-grid'
    );
    if (!aside || !whySection || !highlights || highlights.dataset.sidebarBound === 'true') return;

    highlights.dataset.sidebarBound = 'true';
    const desktopQuery = window.matchMedia('(min-width: 901px)');

    const syncHighlightsPosition = () => {
      if (desktopQuery.matches) {
        highlights.classList.add('brand-sidebar-highlights');
        aside.appendChild(highlights);
        return;
      }

      highlights.classList.remove('brand-sidebar-highlights');
      whySection.appendChild(highlights);
    };

    syncHighlightsPosition();
    desktopQuery.addEventListener?.('change', syncHighlightsPosition);
  };
  
  const applyBrandStickyReviewLayout = () => {
    const existingLayout = document.querySelector('.brand-sticky-review-layout');
    if (existingLayout) {
      const aside = existingLayout.querySelector('.brand-sticky-aside');
      const rightRail = ensureBrandRightRail(existingLayout);
      if (!rightRail.querySelector('.brand-new-games-rail')) {
        const newGamesRail = createBrandNewGamesRail();
        if (newGamesRail) rightRail.appendChild(newGamesRail);
      }
      initSidebarHighlights(existingLayout);
      initSidebarEditorialSections(existingLayout, aside);
      initBrandProfileShowcase(existingLayout, aside);
      initRightRailContent(existingLayout, rightRail);
      initAdditionalRailSections(existingLayout, aside, rightRail);
      initLowerRailSections(existingLayout, aside, rightRail);
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
    const rightRail = ensureBrandRightRail(layout);
    const newGamesRail = createBrandNewGamesRail();
    if (newGamesRail) rightRail.appendChild(newGamesRail);
    hero.remove();
    document.body.classList.add('has-brand-sticky-layout');
    document.documentElement.classList.add('has-brand-sticky-layout');
    initSidebarHighlights(layout);
    initSidebarEditorialSections(layout, aside);
    initBrandProfileShowcase(layout, aside);
    initRightRailContent(layout, rightRail);
    initAdditionalRailSections(layout, aside, rightRail);
    initLowerRailSections(layout, aside, rightRail);
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
