// Brand layout module. Loaded only on body[data-brand] pages.
import { bindImagePreview } from '../image-preview.js?v=20261119-preview-loader';

// Registries use canonical slugs; older entries may use punctuation-free keys.
export const resolveBrandNewGames = (pageKey, registry, normalizeKey) =>
  registry[pageKey] || registry[normalizeKey(pageKey)] || [];

// brands.js is authoritative even when an older review contains a stale href.
// Run before the layout copies the hero CTA into the sticky bar.
export const syncBrandCasinoLinks = (root, brand) => {
  const href = typeof brand?.urlCasino === 'string' ? brand.urlCasino.trim() : '';
  if (!href || brand.notRecommended || brand.temporarilyUnavailable) return 0;
  let updated = 0;
  root.querySelectorAll('a.cta-brands, a.brand-sticky-title, a.brand-new-game-card').forEach(link => {
    if (link.getAttribute('aria-disabled') === 'true' || link.dataset.blockedCta === 'true') return;
    if (link.getAttribute('href') === href) return;
    link.setAttribute('href', href);
    updated++;
  });
  return updated;
};

// Optional B2B referral links live in brands.js, never in individual review pages.
export const resolveBrandPartnerProgram = brand => {
  const program = brand?.partnerProgram;
  if (!program || typeof program.name !== 'string' || typeof program.url !== 'string') return null;
  const name = program.name.trim();
  if (!name) return null;
  try {
    const url = new URL(program.url);
    if (url.protocol !== 'https:' || url.username || url.password) return null;
    return { name, url: url.href };
  } catch {
    return null;
  }
};

// JavaScript \b does not recognize Cyrillic words. Keep non-Latin branches
// free of ASCII word boundaries and support the headings used by older reviews.
const bestForTitlePattern = /(?:\bwho\b.*\b(?:suits?|best for)\b|\bbest for\b|\bfür wen\b|\bgeeignet für\b|\bpasst zu\b|\bpara quién\b|\bideal para\b|\ba chi\b.*\badatt|\bper chi\b|\bideale per\b|\bdla kogo\b|\bnajlepsze dla\b|\bodpowiednie dla\b|кому.*(?:підход|підійд)|найкраще.*(?:підход|підійд)|\bpara quem\b|\bindicado para\b|à qui.*(?:convient|s['’]adresse)|\bpour qui\b|किसके लिए|उपयुक्त|\bkenelle\b.*\bsopii|\bparas kenelle\b)/iu;
export const matchesBrandBestForTitle = title =>
  bestForTitlePattern.test(String(title || '').replace(/\s+/gu, ' '));

const sportsSectionId = /(?:^|-)(?:sports?(?:-betting|-bonus)?|sportsbook)$/i;
// Legacy localized reviews sometimes have a standalone sportsbook section without an ID.
const legacySportsHeading = /^(?:sportsbook\b|sports betting\b|sports (?:welcome )?bonus\b|(?:esports|live) betting\b|cricket exchange\b|sportwetten\b|live-wetten\b|esport-wetten\b|(?:herramientas de )?apuestas deportivas\b|scommesse sportive\b|zakłady sportowe\b|ставки на (?:кібер)?спорт(?:[\s,]|$)|спортивний бонус(?:[\s,]|$)|live-ставки(?:[\s,]|$)|(?:ferramentas de )?apostas desportivas\b|(?:outils de )?paris sportifs\b|paris sur l['’]e-sport\b|स्पोर्ट्सबुक(?:[\s,]|$)|vedonlyönti(?:[\s,]|$))/iu;
export const isBrandSportsSection = ({kind, id, heading}) => {
  if (kind) return kind === 'betting';
  const title = String(heading || '').trim();
  if (/\bcasin[oaòs]|kasyn|kasino|казино|कैसीनो|\bp[oó]ker\b|покер|पोकर|tragaperr|\bslots?\b|automat|слот/iu.test(title)) return false;
  return sportsSectionId.test(id || '') || legacySportsHeading.test(title);
};

// Shared by the browser layout and reviews that pre-render game cards.
export const renderBrandNewGamesPanel = ({ games, pageBrand, brandName, heading, escapeHtml, localeText }) => {
  if (!games.length) return '';
  const casinoHref = !pageBrand?.notRecommended && !pageBrand?.temporarilyUnavailable &&
    typeof pageBrand?.urlCasino === 'string' ? pageBrand.urlCasino.trim() : '';
  const cardMarkup = game => {
    const cardContent = `<div class="brand-new-game-media game-art-backdrop">
        <img
          src="${escapeHtml(game.image)}"
          alt="${escapeHtml(game.name)} — ${escapeHtml(brandName)}"
          loading="lazy"
          decoding="async"
        />
      </div>
      <span>${escapeHtml(game.name)}</span>`;

    if (!casinoHref) return `<article class="brand-new-game-card">${cardContent}</article>`;

    return `<a
        class="brand-new-game-card"
        href="${escapeHtml(casinoHref)}"
        target="_blank"
        rel="noopener noreferrer nofollow sponsored"
        aria-label="${localeText(
          `Play ${escapeHtml(game.name)} at ${escapeHtml(brandName)}`,
          `${escapeHtml(game.name)} bei ${escapeHtml(brandName)} spielen`,
          `Jugar a ${escapeHtml(game.name)} en ${escapeHtml(brandName)}`,
          `Gioca a ${escapeHtml(game.name)} su ${escapeHtml(brandName)}`,
          `Zagraj w ${escapeHtml(game.name)} w ${escapeHtml(brandName)}`,
          `Грати в ${escapeHtml(game.name)} у ${escapeHtml(brandName)}`,
          `Jogar ${escapeHtml(game.name)} no ${escapeHtml(brandName)}`,
          `Jouer à ${escapeHtml(game.name)} sur ${escapeHtml(brandName)}`,
          `${escapeHtml(brandName)} पर ${escapeHtml(game.name)} खेलें`,
          `Pelaa peliä ${escapeHtml(game.name)} kasinolla ${escapeHtml(brandName)}`
        )}"
      >
        ${cardContent}
      </a>`;
  };

  const newGamesLabel = heading || localeText(
    'New Games', 'Neue Spiele', 'Juegos nuevos', 'Nuovi giochi', 'Nowe gry',
    'Нові ігри', 'Novos jogos', 'Nouveaux jeux', 'नए गेम', 'Uudet pelit'
  );
  return `<section class="brand-new-games-panel" aria-labelledby="brand-new-games-title">
    <h2 id="brand-new-games-title">${escapeHtml(newGamesLabel)}</h2>
    <div class="brand-new-games-list"${casinoHref ? '' : ' tabindex="0"'}>
      ${games.map(cardMarkup).join('\n      ')}
    </div>
  </section>`;
};

export const initBrandLayout = context => {
  const {
    BRANDS = [],
    BRAND_NEW_GAMES,
    finalizeReview = false,
    normalizeText,
    normalizeBrandKey,
    findBrandByPageKey = () => null,
    escapeHtml,
    localeText,
    localizedBrandBonusText = value => value,
  } = context;

  const pageKey = document.body.dataset.brand || '';
  const pageBrand = findBrandByPageKey(pageKey) ||
    BRANDS.find(item => normalizeBrandKey(item.name || '') === normalizeBrandKey(pageKey));
  if (pageKey) syncBrandCasinoLinks(document.body, pageBrand);

  const initBrandPartnerProgram = () => {
    const pageKey = document.body.dataset.brand || '';
    const brand = findBrandByPageKey(pageKey) ||
      BRANDS.find(item => normalizeBrandKey(item.name || '') === normalizeBrandKey(pageKey));
    const program = resolveBrandPartnerProgram(brand);
    document.querySelectorAll('[data-brand-partner-program]').forEach(card => {
      if (!program) {
        card.remove();
        return;
      }
      const linkContainer = card.querySelector('[data-partner-program-link]');
      if (!linkContainer) return;
      const link = document.createElement('a');
      link.href = program.url;
      link.textContent = program.name;
      link.target = '_blank';
      link.rel = 'noopener noreferrer nofollow sponsored';
      linkContainer.replaceChildren(link);
    });
  };

  const initBrandNewGames = layout => {
    const main = layout.querySelector(':scope > .brand-sticky-main');
    if (!main || main.querySelector(':scope > .brand-new-games-panel')) return;

    const gameKey = normalizeText(pageKey).trim().toLowerCase();
    const games = resolveBrandNewGames(gameKey, BRAND_NEW_GAMES, normalizeBrandKey);
    const markup = renderBrandNewGamesPanel({
      games, pageBrand, brandName: pageBrand?.name || gameKey,
      heading: document.querySelector('meta[name="brand-games-title"]')?.content?.trim(),
      escapeHtml, localeText,
    });
    if (markup) main.insertAdjacentHTML('afterbegin', markup);
  };

  const ensureBrandRightRail = layout => {
    let rightRail = layout?.querySelector(':scope > .brand-right-rail');
    if (rightRail) return rightRail;

    rightRail = document.createElement('div');
    rightRail.className = 'brand-right-rail';
    layout?.appendChild(rightRail);
    return rightRail;
  };

  const bindResponsiveMove = ({ element, target, className, mediaQuery }) => {
    if (!element || !target) return;

    const moveToRail = () => {
      element.classList.add(className);
      if (element.parentElement === target) return;
      const priority = child => child.matches('.brand-quick-facts') ? 0
        : child.matches('.brand-payments') ? 1 : 2;
      const next = [...target.children].find(child => priority(child) > priority(element));
      target.insertBefore(element, next || null);
    };

    if (element.dataset.responsiveRailBound === 'true') {
      if (window.matchMedia(mediaQuery).matches) moveToRail();
      return;
    }

    const placeholder = document.createComment(`Original position for ${className}`);
    element.parentNode?.insertBefore(placeholder, element);
    element.dataset.responsiveRailBound = 'true';
    const query = window.matchMedia(mediaQuery);

    const syncPosition = () => {
      if (query.matches) {
        moveToRail();
        return;
      }

      element.classList.remove(className);
      placeholder.after(element);
    };

    syncPosition();
    query.addEventListener?.('change', syncPosition);
  };

  // Keep full articles in the main column. Only explicitly authored context cards join the contents.
  const initEditorialContext = (layout, aside) => {
    layout.querySelectorAll('.brand-sticky-main [data-brand-rail="context"]').forEach(section => {
      bindResponsiveMove({
        element: section,
        target: aside,
        className: 'brand-sidebar-section',
        mediaQuery: '(min-width: 901px)',
      });
    });
  };

  const decorateBrandFaq = layout => {
    const faq = Array.from(layout.querySelectorAll('.brand-sticky-main .content-review > section.container'))
      .find(section => /faq/i.test(section.id) || section.querySelector(
        ':scope > :is(.site-faq-list, .faq-grid, .timeline)'
      ));
    faq?.classList.add('brand-faq-section');
  };

  const createBrandQuickFacts = (layout, rightRail) => {
    if (!rightRail || rightRail.querySelector('.brand-quick-facts')) return;
    if (!layout.querySelector('.brand-hero-panel')) return;

    const pageKey = document.body.dataset.brand || '';
    const brandKey = normalizeBrandKey(pageKey);
    const brand =
      findBrandByPageKey(pageKey) ||
      BRANDS.find(item => normalizeBrandKey(item.name || '') === brandKey);
    if (!brand || brand.notRecommended || brand.temporarilyUnavailable) return;

    const bonus = localizedBrandBonusText(brand.bonus || '');
    const editorialFact = layout.querySelector('.brand-sticky-main [id][data-review-fact-label][data-review-fact-value]');
    const countryCount = Array.isArray(brand.countries) ? brand.countries.length : 0;
    if (!bonus && !countryCount && !editorialFact) return;
    const slavicCountryForm = (one, few, many) =>
      countryCount % 10 === 1 && countryCount % 100 !== 11 ? one :
      countryCount % 10 >= 2 && countryCount % 10 <= 4 && !(countryCount % 100 >= 12 && countryCount % 100 <= 14) ? few : many;

    const bonusSection = layout.querySelector('.brand-sticky-main [data-review-section="bonuses"]');
    const bonusTarget = bonusSection?.id || bonusSection?.querySelector(':scope > :is(.title, h2)')?.id ||
      layout.querySelector('.brand-review-overview > h2')?.id;
    if (!countryCount && !bonusTarget && !editorialFact) return;

    const labels = {
      heading: localeText('Casino details', 'Casino-Informationen', 'Información del casino', 'Informazioni sul casinò', 'Informacje o kasynie', 'Інформація про казино', 'Informações do casino', 'Informations sur le casino', 'कैसीनो की जानकारी', 'Kasinon tiedot'),
      bonus: localeText('Welcome offer', 'Willkommensangebot', 'Oferta de bienvenida', 'Offerta di benvenuto', 'Oferta powitalna', 'Вітальна пропозиція', 'Oferta de boas-vindas', 'Offre de bienvenue', 'वेलकम ऑफ़र', 'Tervetulotarjous'),
      markets: document.body.dataset.reviewMarketLabel || localeText('Available markets', 'Verfügbare Märkte', 'Mercados disponibles', 'Mercati disponibili', 'Dostępne rynki', 'Доступні ринки', 'Mercados disponíveis', 'Marchés disponibles', 'उपलब्ध बाज़ार', 'Saatavilla olevat markkinat'),
      countries: localeText(countryCount === 1 ? 'country' : 'countries', countryCount === 1 ? 'Land' : 'Länder', countryCount === 1 ? 'país' : 'países', countryCount === 1 ? 'Paese' : 'Paesi', countryCount === 1 ? 'kraj' : slavicCountryForm('krajów', 'kraje', 'krajów'), slavicCountryForm('країна', 'країни', 'країн'), countryCount === 1 ? 'país' : 'países', 'pays', 'देश', countryCount === 1 ? 'maa' : 'maata'),
    };

    const facts = document.createElement('aside');
    facts.className = 'brand-quick-facts';
    facts.setAttribute('aria-label', labels.heading);
    facts.innerHTML = `
      <h2 class="brand-quick-facts__heading">${escapeHtml(labels.heading)}</h2>
      ${bonus && bonusTarget ? `<a href="#${escapeHtml(bonusTarget)}"><small>${escapeHtml(labels.bonus)}</small><strong>${escapeHtml(bonus)}</strong></a>` : ''}
      ${editorialFact ? `<a href="#${escapeHtml(editorialFact.id)}"><small>${escapeHtml(editorialFact.dataset.reviewFactLabel)}</small><strong>${escapeHtml(editorialFact.dataset.reviewFactValue)}</strong></a>` : ''}
      ${countryCount ? `<a href="#brand-countries"><small>${escapeHtml(labels.markets)}</small><strong>${escapeHtml(document.body.dataset.reviewMarketName || `${countryCount} ${labels.countries}`)}</strong></a>` : ''}
    `;
    rightRail.prepend(facts);
  };

  const initReviewOverview = (layout, summaryPanel) => {
    const main = layout.querySelector(':scope > .brand-sticky-main');
    const paragraphs = summaryPanel?.querySelectorAll(':scope > p');
    if (!main || !paragraphs?.length) return;

    const overview = document.createElement('section');
    overview.className = 'brand-review-overview';
    overview.dataset.reviewSection = 'overview';
    const heading = document.createElement('h2');
    heading.id = 'brand-review-overview';
    heading.textContent = localeText(
      'Review overview', 'Bewertung im Überblick', 'Resumen de la reseña', 'Panoramica della recensione',
      'Przegląd recenzji', 'Коротко про бренд', 'Resumo da análise', 'L’essentiel de notre avis',
      'समीक्षा का सार', 'Arvostelu lyhyesti'
    );
    overview.setAttribute('aria-labelledby', heading.id);
    overview.append(heading, ...paragraphs);
    // Keep the overview beside the right rail; the article can span that rail below it.
    main.before(overview);
    if (!summaryPanel.children.length) summaryPanel.remove();

    const links = layout.querySelector('.brand-section-nav__links');
    if (!links) return;
    const link = document.createElement('a');
    link.href = '#brand-review-overview';
    link.dataset.reviewTopic = 'overview';
    link.textContent = heading.textContent;
    if (window.location.hash === link.hash) link.setAttribute('aria-current', 'location');
    links.prepend(link);
  };

  const initBrandProfileShowcase = (layout, aside) => {
    if (!layout || !aside) return;

    let showcase = layout.querySelector(':scope > .brand-profile-showcase');
    if (!showcase) {
      const logoPanel = aside.querySelector('.brand-hero-logo-panel');
      const logo = logoPanel?.querySelector('.brand-logo-container');
      const summaryPanel = aside.querySelector('.brand-hero-summary-panel');
      const heading = summaryPanel?.querySelector('h1');
      const reviewer = summaryPanel?.querySelector('.brand-reviewer-byline');
      const ctaWrapper = summaryPanel?.querySelector('.hero-cta-wrapper');
      const preview = layout.querySelector('#brand-why-section .brand-why-media');
      const image = preview?.querySelector('img');
      if (!logo || !heading) return;

      showcase = document.createElement('section');
      showcase.className = 'brand-profile-showcase';
      heading.id ||= 'brand-review-title';
      showcase.setAttribute('aria-labelledby', heading.id);
      showcase.innerHTML = `
        <div class="brand-profile-showcase__bar">
          <div class="brand-profile-showcase__identity">
            <div class="brand-profile-showcase__title"></div>
          </div>
          <div class="brand-profile-showcase__footer">
            <div class="brand-profile-showcase__actions"></div>
          </div>
        </div>
      `;

      const identity = showcase.querySelector('.brand-profile-showcase__identity');
      const title = showcase.querySelector('.brand-profile-showcase__title');
      const footer = showcase.querySelector('.brand-profile-showcase__footer');
      const actions = showcase.querySelector('.brand-profile-showcase__actions');
      identity.prepend(logo);
      title.appendChild(heading);
      const countries = pageBrand?.notRecommended || pageBrand?.temporarilyUnavailable
        ? 0
        : new Set(pageBrand?.countries?.map(country => country.toUpperCase()) || []).size;
      if (countries) {
        const coverage = document.createElement('span');
        coverage.className = 'brand-profile-showcase__coverage';
        coverage.textContent = `${document.body.dataset.reviewMarketLabel || localeText(
          'Available countries', 'Verfügbare Länder', 'Países disponibles',
          'Paesi disponibili', 'Dostępne kraje', 'Доступно країн',
          'Países disponíveis', 'Pays disponibles', 'उपलब्ध देश', 'Saatavilla olevat maat'
        )}: ${document.body.dataset.reviewMarketName || countries}`;
        title.appendChild(coverage);
      }
      if (reviewer) footer.prepend(reviewer);
      if (ctaWrapper) actions.appendChild(ctaWrapper);
      if (image) {
        const figure = document.createElement('figure');
        figure.className = 'brand-profile-showcase__preview';
        if (!image.alt) image.alt = localeText(
          'Site screenshot', 'Screenshot der Website', 'Captura del sitio',
          'Schermata del sito', 'Zrzut ekranu witryny', 'Скріншот сайту',
          'Captura do site', 'Capture d’écran du site', 'साइट का स्क्रीनशॉट', 'Kuvakaappaus sivustosta'
        );
        figure.appendChild(image);
        bindImagePreview(figure, image);
        showcase.prepend(figure);
        preview.remove();
      }
      logoPanel.remove();
      layout.prepend(showcase);
      initReviewOverview(layout, summaryPanel);
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

    const payments = layout.querySelector('.brand-sticky-main .brand-payments:not([hidden])');
    bindResponsiveMove({
      element: payments,
      target: rightRail,
      className: 'brand-right-payments',
      mediaQuery: '(min-width: 1200px)',
    });

    createBrandQuickFacts(layout, rightRail);
  };

  const applyBrandStickyReviewLayout = () => {
    const existingLayout = document.querySelector('.brand-sticky-review-layout');
    if (existingLayout) {
      const aside = existingLayout.querySelector('.brand-sticky-aside');
      const rightRail = ensureBrandRightRail(existingLayout);
      initBrandProfileShowcase(existingLayout, aside);
      initBrandNewGames(existingLayout);
      if (finalizeReview) {
        initEditorialContext(existingLayout, aside);
        initRightRailContent(existingLayout, rightRail);
      }
      decorateBrandFaq(existingLayout);
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
      if (!sibling.classList.contains('brand-related-reviews')) main.appendChild(sibling);
      sibling = nextSibling;
    }

    layout.append(aside, main);
    const rightRail = ensureBrandRightRail(layout);
    hero.remove();
    document.body.classList.add('has-brand-sticky-layout');
    document.documentElement.classList.add('has-brand-sticky-layout');
    initBrandProfileShowcase(layout, aside);
    initBrandNewGames(layout);
    if (finalizeReview) {
      initEditorialContext(layout, aside);
      initRightRailContent(layout, rightRail);
    }
    decorateBrandFaq(layout);
  };

  const initBrandWhyPreview = () => {
    const preview = document.querySelector('body[data-brand] .brand-why-media');
    const heading = preview?.closest('.brand-why-heading');
    if (!preview || !heading || preview.dataset.bound === 'true') return;

    bindImagePreview(preview, preview.querySelector('img'));
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

  initBrandPartnerProgram();
  applyBrandStickyReviewLayout();
  initBrandWhyPreview();
};
