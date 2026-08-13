// Brand-review module. Loaded only on body[data-brand] pages.

export const initBrandPage = context => {
  const {
    BRANDS,
    BRAND_SNAPSHOT_CONFIGS,
    SITE_LOCALE,
    uiCopy,
    normalizeText,
    normalizeAssetPath,
    findBrandByPageKey,
    normalizeBrandKey,
    getDisabledBrandCopy,
    getBlockedCtaMarkup,
    escapeHtml,
    slugifyText,
    localeText,
    syncHeaderFlowMetrics,
  } = context;

  const getBrandSnapshotName = () => {
    const heading = document.querySelector('.hero h1, .hero-content h1, h1');
    if (!heading) return 'This brand';
    return normalizeText(heading.textContent).replace(/\s+Review$/i, '').trim() || 'This brand';
  };
  
  const initStickyBrandTitle = () => {
    const brandKey = document.body.dataset.brand?.toLowerCase();
    if (!brandKey) return;
    const brand = findBrandByPageKey(brandKey);
    const isBlocked = Boolean(brand?.notRecommended);
    const isUnavailable = Boolean(brand?.temporarilyUnavailable);
  
    const source = document.querySelector('.brand-sticky-aside') || document.querySelector('.hero');
    const heading = source?.querySelector('h1');
    const brandLogo = source?.querySelector('.brand-logo');
    const heroCta = source?.querySelector('a.cta-brands[href]');
    const header = document.querySelector('.header');
    if (!source || !heading || !header) return;
    if (document.querySelector('.brand-sticky-title')) return;
  
    const titleText = normalizeText(heading.textContent).trim();
    if (!titleText) return;
  
    const casinoHref = heroCta?.getAttribute('href')?.trim() || '';
    if (!casinoHref && !isBlocked) return;
  
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
  
    const stickyTitle = document.createElement(isBlocked ? 'div' : 'a');
    stickyTitle.className = 'brand-sticky-title';
    if (isBlocked) {
      stickyTitle.classList.add('is-not-recommended');
      stickyTitle.classList.toggle('is-temporarily-unavailable', isUnavailable);
      stickyTitle.setAttribute('role', 'status');
      stickyTitle.setAttribute(
        'aria-label',
        isUnavailable
          ? localeText(`${titleText} is currently unavailable`, `${titleText} ist derzeit nicht verfügbar`, `${titleText} no está disponible actualmente`)
          : localeText(`${titleText} is not recommended`, `${titleText} wird nicht empfohlen`, `${titleText} no está recomendado`)
      );
    } else {
      stickyTitle.href = casinoHref;
      stickyTitle.target = heroCta?.getAttribute('target') || '_blank';
      stickyTitle.rel = heroCta?.getAttribute('rel') || 'noopener noreferrer nofollow sponsored';
      stickyTitle.setAttribute('aria-label', localeText(`Visit ${titleText}`, `${titleText} besuchen`, `Visitar ${titleText}`));
    }
    stickyTitle.innerHTML = `
      <div class="brand-sticky-title__inner">
        ${brandLogoMarkup}
        <span class="brand-sticky-title__text">${titleText}</span>
        <span class="brand-sticky-title__cta${isBlocked ? ' cta-blocked' : ''}">
          ${isBlocked ? getBlockedCtaMarkup(brand) : uiCopy.visitCasino}
        </span>
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
  
  const normalizeFinalBrandCtaLabels = () => {
    document
      .querySelectorAll('body[data-brand] .final-cta-glass a.cta-brands')
      .forEach(link => {
        link.textContent = uiCopy.claimBonusPlay;
      });
  };
  
  const getShortBrandSectionLabel = title => {
    const normalizedTitle = normalizeText(title);
    const lowerTitle = normalizedTitle.toLowerCase();
  
    if (/why players choose|warum spieler|por qué los jugadores|perché i giocatori scelgono|dlaczego gracze wybierają|чому гравці обирають|por que os jogadores escolhem/.test(lowerTitle)) return localeText('Highlights', 'Highlights', 'Aspectos clave', null, null, 'Головне');
    if (/available countries|verfügbare länder|países disponibles|paesi disponibili|dostępne kraje|доступні країни/.test(lowerTitle)) return localeText('Countries', 'Länder', 'Países', null, null, 'Країни');
    if (/payment|zahlung|pago|pagament|płatno/.test(lowerTitle)) return localeText('Payments', 'Zahlungen', 'Pagos');
    if (
      /games|slots|live betting|betting snapshot|spiele|sportwetten|juegos|tragaperras|apuestas|giochi|scommesse|gry|automaty|zakłady|ігри|слоти|ставки|jogos|apostas/.test(lowerTitle)
    ) return localeText('Games', 'Spiele', 'Juegos', null, null, 'Ігри');
    if (/bonus|promotion|aktion|bono|promoción|promozion|promocj|бонус|акці/.test(lowerTitle)) return localeText('Bonuses', 'Boni', 'Bonos', null, null, 'Бонуси');
    if (/checklist|checkliste|lista de control|lista di controllo|lista kontrolna|lista de verificação/.test(lowerTitle)) return localeText('Checklist', 'Checkliste', 'Lista');
    if (/licensing|trust|lizenz|vertrauen|licencia|confianza|licenz|fiducia|affidabil|licenc|wiarygod|licença|confiança|fiabilidade/.test(lowerTitle)) return localeText('Trust', 'Vertrauen', 'Confianza');
    if (lowerTitle.includes('faq') || lowerTitle.includes('pregunta') || lowerTitle.includes('domand') || lowerTitle.includes('pytan') || lowerTitle.includes('питан')) return 'FAQ';
    if ((/pros|vorteile|ventajas|vantaggi|zalety|plusy|переваги|плюси|vantagens|\bpro\b/.test(lowerTitle)) && (/cons|nachteile|desventajas|svantaggi|contro|wady|minusy|недоліки|мінуси|desvantagens|contras/.test(lowerTitle))) return localeText('Pros & Cons', 'Vor- & Nachteile', 'Ventajas y desventajas', null, null, 'Переваги та недоліки');
    if (/suits|passt|geeignet|ideal para|ideale per|adatto|najlepsze dla|odpowiednie dla/.test(lowerTitle)) return localeText('Best For', 'Geeignet für', 'Ideal para');
  
    return normalizedTitle.replace(/\s+Review$/i, '').split(/[,&:|]/)[0].trim().slice(0, 18);
  };
  
  const initBrandSectionNav = () => {
    const heroContent =
      document.querySelector('body[data-brand] .brand-sticky-aside .hero-content') ||
      document.querySelector('body[data-brand] .hero-content');
    const reviewRoot =
      document.querySelector('body[data-brand] .brand-sticky-main') ||
      document.querySelector('body[data-brand] main.content-review') ||
      document.querySelector('body[data-brand]');
    if (!heroContent || !reviewRoot || heroContent.querySelector('.brand-section-nav')) return;
  
    const titleSelector = [
      '.brand-hero-why > .title',
      '.brand-countries > .title',
      '.brand-payments > .title',
      '.brand-availability-widget .title',
      '.content-review > section > .title',
      '.content-review > section > h2',
      '.content-article > section > .title',
      '.content-article > section > h2',
      '.final-cta-glass .title',
    ].join(', ');
  
    const seenLabels = new Set();
    const headings = Array.from(reviewRoot.querySelectorAll(titleSelector))
      .map(heading => {
        const text = normalizeText(heading.textContent).trim();
        const label = getShortBrandSectionLabel(text);
        return { heading, text, label };
      })
      .filter(item => item.text && item.label && !seenLabels.has(item.label) && seenLabels.add(item.label))
      .slice(0, 9);
  
    if (headings.length < 2) return;
  
    headings.forEach(({ heading, label }, index) => {
      if (!heading.id) {
        const baseId = slugifyText(label || heading.textContent) || `brand-section-${index + 1}`;
        let nextId = baseId;
        let suffix = 2;
        while (document.getElementById(nextId)) {
          nextId = `${baseId}-${suffix}`;
          suffix += 1;
        }
        heading.id = nextId;
      }
    });
  
    const nav = document.createElement('nav');
    nav.className = 'brand-section-nav';
    nav.setAttribute('aria-label', localeText('On this page', 'Auf dieser Seite', 'En esta página'));
    nav.innerHTML = `
      <div class="brand-section-nav__links">
        ${headings
          .map(
            ({ heading, label }) => `
              <a href="#${escapeHtml(heading.id)}">${escapeHtml(label)}</a>
            `
          )
          .join('')}
      </div>
    `;
  
    const ctaWrapper = heroContent.querySelector('.hero-cta-wrapper');
    if (ctaWrapper) {
      ctaWrapper.insertAdjacentElement('afterend', nav);
    } else {
      heroContent.appendChild(nav);
    }
  };
  
  const initBrandHeroPanels = () => {
    const heroContent = document.querySelector('body[data-brand] .hero-content');
    if (!heroContent || heroContent.dataset.panelsReady === 'true') return;
  
    const logo = heroContent.querySelector(':scope > .brand-logo-container');
    const nav = heroContent.querySelector(':scope > .brand-section-nav');
    if (!logo) return;
  
    const logoPanel = document.createElement('div');
    logoPanel.className = 'brand-hero-panel brand-hero-logo-panel';
    logoPanel.appendChild(logo);
  
    const summaryPanel = document.createElement('div');
    summaryPanel.className = 'brand-hero-panel brand-hero-summary-panel';
  
    const summaryNodes = Array.from(heroContent.children).filter(child => child !== logo && child !== nav);
    summaryPanel.append(...summaryNodes);
  
    const panels = [logoPanel, summaryPanel];
    if (nav) {
      const navPanel = document.createElement('div');
      navPanel.className = 'brand-hero-panel brand-hero-nav-panel';
      navPanel.appendChild(nav);
      panels.push(navPanel);
    }
  
    heroContent.replaceChildren(...panels);
    heroContent.dataset.panelsReady = 'true';
  };
  
  const SNAPSHOT_DE_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Spiele- und Wettüberblick',
    'Visible now:': 'Aktuell sichtbar:',
    'Not surfaced:': 'Nicht eingeblendet:',
    'These are the main game categories currently visible in the account.':
      'Dies sind die wichtigsten Spielkategorien, die aktuell im Konto sichtbar sind.',
    'These are the main betting categories currently visible in the account.':
      'Dies sind die wichtigsten Wettkategorien, die aktuell im Konto sichtbar sind.',
    Games: 'SPIELE',
    GAMES: 'SPIELE',
    'LIVE GAMES': 'LIVE-SPIELE',
    Betting: 'SPORTWETTEN',
    BETTING: 'SPORTWETTEN',
    Slots: 'Slots',
    Roulette: 'Roulette',
    Blackjack: 'Blackjack',
    Baccarat: 'Baccarat',
    Poker: 'Poker',
    Keno: 'Keno',
    Bingo: 'Bingo',
    'Jackpot games': 'Jackpot-Spiele',
    'Live games': 'Live-Spiele',
    'Live dice games': 'Live-Würfelspiele',
    'Craps and dice': 'Craps und Würfelspiele',
    'Scratch cards': 'Rubbellose',
    'Video poker': 'Video-Poker',
    'Crash games': 'Crash-Spiele',
    'Other live games': 'Weitere Live-Spiele',
    'Live casino': 'Live-Casino',
    'Game shows': 'Game Shows',
  };
  const SNAPSHOT_ES_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Resumen de juegos y apuestas',
    'Visible now:': 'Visible ahora:',
    'Not surfaced:': 'No disponible:',
    'These are the main game categories currently visible in the account.':
      'Estas son las principales categorías de juegos visibles actualmente en la cuenta.',
    'These are the main betting categories currently visible in the account.':
      'Estas son las principales categorías de apuestas visibles actualmente en la cuenta.',
    Games: 'JUEGOS',
    GAMES: 'JUEGOS',
    'LIVE GAMES': 'JUEGOS EN VIVO',
    Betting: 'APUESTAS',
    BETTING: 'APUESTAS',
    Slots: 'Tragaperras',
    Roulette: 'Ruleta',
    Blackjack: 'Blackjack',
    Baccarat: 'Bacará',
    Poker: 'Póker',
    Keno: 'Keno',
    Bingo: 'Bingo',
    'Jackpot games': 'Juegos con jackpot',
    'Live games': 'Juegos en vivo',
    'Live dice games': 'Juegos de dados en vivo',
    'Craps and dice': 'Craps y dados',
    'Scratch cards': 'Rasca y gana',
    'Video poker': 'Video póker',
    'Crash games': 'Juegos crash',
    'Other live games': 'Otros juegos en vivo',
    'Live casino': 'Casino en vivo',
    'Game shows': 'Game shows',
  };
  const SNAPSHOT_IT_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Panoramica di giochi e scommesse',
    'Visible now:': 'Disponibili ora:',
    'Not surfaced:': 'Non disponibili:',
    'These are the main game categories currently visible in the account.':
      'Queste sono le principali categorie di giochi attualmente visibili nell’account.',
    'These are the main betting categories currently visible in the account.':
      'Queste sono le principali categorie di scommesse attualmente visibili nell’account.',
    Games: 'GIOCHI',
    GAMES: 'GIOCHI',
    'LIVE GAMES': 'GIOCHI LIVE',
    Betting: 'SCOMMESSE',
    BETTING: 'SCOMMESSE',
    Slots: 'Slot',
    Roulette: 'Roulette',
    Blackjack: 'Blackjack',
    Baccarat: 'Baccarat',
    Poker: 'Poker',
    Keno: 'Keno',
    Bingo: 'Bingo',
    'Jackpot games': 'Giochi con jackpot',
    'Live games': 'Giochi live',
    'Live dice games': 'Giochi di dadi live',
    'Craps and dice': 'Craps e dadi',
    'Scratch cards': 'Gratta e vinci',
    'Video poker': 'Video poker',
    'Crash games': 'Giochi crash',
    'Other live games': 'Altri giochi live',
    'Live casino': 'Casinò live',
    'Game shows': 'Game show',
  };
  const SNAPSHOT_PL_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Przegląd gier i zakładów',
    'Visible now:': 'Dostępne teraz:',
    'Not surfaced:': 'Niedostępne:',
    'These are the main game categories currently visible in the account.':
      'To główne kategorie gier widoczne obecnie na koncie.',
    'These are the main betting categories currently visible in the account.':
      'To główne kategorie zakładów widoczne obecnie na koncie.',
    Games: 'GRY',
    GAMES: 'GRY',
    'LIVE GAMES': 'GRY NA ŻYWO',
    Betting: 'ZAKŁADY',
    BETTING: 'ZAKŁADY',
    Slots: 'Automaty',
    Roulette: 'Ruletka',
    Blackjack: 'Blackjack',
    Baccarat: 'Bakarat',
    Poker: 'Poker',
    Keno: 'Keno',
    Bingo: 'Bingo',
    'Jackpot games': 'Gry jackpot',
    'Live games': 'Gry na żywo',
    'Live dice games': 'Gry w kości na żywo',
    'Craps and dice': 'Craps i gry w kości',
    'Scratch cards': 'Zdrapki',
    'Video poker': 'Wideopoker',
    'Crash games': 'Gry crash',
    'Other live games': 'Inne gry na żywo',
    'Live casino': 'Kasyno na żywo',
    'Game shows': 'Teleturnieje',
  };
  const SNAPSHOT_UK_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Огляд ігор і ставок',
    'Visible now:': 'Доступно зараз:',
    'Not surfaced:': 'Не представлено:',
    'These are the main game categories currently visible in the account.':
      'Це основні категорії ігор, які зараз доступні в акаунті.',
    'These are the main betting categories currently visible in the account.':
      'Це основні категорії ставок, які зараз доступні в акаунті.',
    Games: 'ІГРИ',
    GAMES: 'ІГРИ',
    'LIVE GAMES': 'LIVE-ІГРИ',
    Betting: 'СТАВКИ',
    BETTING: 'СТАВКИ',
    Slots: 'Слоти',
    Roulette: 'Рулетка',
    Blackjack: 'Блекджек',
    Baccarat: 'Бакара',
    Poker: 'Покер',
    Keno: 'Кено',
    Bingo: 'Бінго',
    'Jackpot games': 'Джекпот-ігри',
    'Live games': 'Live-ігри',
    'Live dice games': 'Live-ігри в кості',
    'Craps and dice': 'Крепс та ігри в кості',
    'Scratch cards': 'Скретч-картки',
    'Video poker': 'Відеопокер',
    'Crash games': 'Краш-ігри',
    'Other live games': 'Інші live-ігри',
    'Live casino': 'Live-казино',
    'Game shows': 'Ігрові шоу',
  };
  const SNAPSHOT_PT_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Resumo de jogos e apostas',
    'Visible now:': 'Disponível agora:',
    'Not surfaced:': 'Não disponível:',
    'These are the main game categories currently visible in the account.':
      'Estas são as principais categorias de jogos atualmente visíveis na conta.',
    'These are the main betting categories currently visible in the account.':
      'Estas são as principais categorias de apostas atualmente visíveis na conta.',
    Games: 'JOGOS',
    GAMES: 'JOGOS',
    'LIVE GAMES': 'JOGOS AO VIVO',
    Betting: 'APOSTAS',
    BETTING: 'APOSTAS',
    Slots: 'Slots',
    Roulette: 'Roleta',
    Blackjack: 'Blackjack',
    Baccarat: 'Bacará',
    Poker: 'Póquer',
    Keno: 'Keno',
    Bingo: 'Bingo',
    'Jackpot games': 'Jogos com jackpot',
    'Live games': 'Jogos ao vivo',
    'Live dice games': 'Jogos de dados ao vivo',
    'Craps and dice': 'Craps e jogos de dados',
    'Scratch cards': 'Raspadinhas',
    'Video poker': 'Vídeo póquer',
    'Crash games': 'Jogos crash',
    'Other live games': 'Outros jogos ao vivo',
    'Live casino': 'Casino ao vivo',
    'Game shows': 'Game shows',
  };
  const SNAPSHOT_FR_TRANSLATIONS = {
    'Games & Betting Snapshot': 'Aperçu des jeux et des paris',
    'Visible now:': 'Disponible actuellement :',
    'Not surfaced:': 'Non proposé :',
    'These are the main game categories currently visible in the account.':
      'Voici les principales catégories de jeux actuellement visibles dans le compte.',
    'These are the main betting categories currently visible in the account.':
      'Voici les principales catégories de paris actuellement visibles dans le compte.',
    Games: 'JEUX',
    GAMES: 'JEUX',
    'LIVE GAMES': 'JEUX EN DIRECT',
    Betting: 'PARIS',
    BETTING: 'PARIS',
    Slots: 'Machines à sous',
    Roulette: 'Roulette',
    Blackjack: 'Blackjack',
    Baccarat: 'Baccarat',
    Poker: 'Poker',
    Keno: 'Keno',
    Bingo: 'Bingo',
    'Jackpot games': 'Jeux à jackpot',
    'Live games': 'Jeux en direct',
    'Live dice games': 'Jeux de dés en direct',
    'Craps and dice': 'Craps et jeux de dés',
    'Scratch cards': 'Jeux à gratter',
    'Video poker': 'Vidéo poker',
    'Crash games': 'Jeux crash',
    'Other live games': 'Autres jeux en direct',
    'Live casino': 'Casino en direct',
    'Game shows': 'Jeux télévisés',
  };
  const SNAPSHOT_HI_TRANSLATIONS = {
    'Games & Betting Snapshot': 'गेम और बेटिंग का सार',
    'Visible now:': 'अभी उपलब्ध:',
    'Not surfaced:': 'उपलब्ध नहीं:',
    'These are the main game categories currently visible in the account.': 'खाते में फिलहाल उपलब्ध प्रमुख गेम श्रेणियां ये हैं।',
    'These are the main betting categories currently visible in the account.': 'खाते में फिलहाल उपलब्ध प्रमुख बेटिंग श्रेणियां ये हैं।',
    Games: 'गेम', GAMES: 'गेम', 'LIVE GAMES': 'लाइव गेम', Betting: 'बेटिंग', BETTING: 'बेटिंग',
    Slots: 'स्लॉट', Roulette: 'रूलेट', Blackjack: 'ब्लैकजैक', Baccarat: 'बैकारेट', Poker: 'पोकर',
    Keno: 'कीनो', Bingo: 'बिंगो', 'Jackpot games': 'जैकपॉट गेम', 'Live games': 'लाइव गेम',
    'Live dice games': 'लाइव डाइस गेम', 'Craps and dice': 'क्रैप्स और डाइस', 'Scratch cards': 'स्क्रैच कार्ड',
    'Video poker': 'वीडियो पोकर', 'Crash games': 'क्रैश गेम', 'Other live games': 'अन्य लाइव गेम',
    'Live casino': 'लाइव कैसीनो', 'Game shows': 'गेम शो',
  };
  
  const snapshotLabel = value =>
    SITE_LOCALE === 'de'
      ? SNAPSHOT_DE_TRANSLATIONS[value] || value
      : SITE_LOCALE === 'es'
        ? SNAPSHOT_ES_TRANSLATIONS[value] || value
        : SITE_LOCALE === 'it'
          ? SNAPSHOT_IT_TRANSLATIONS[value] || value
          : SITE_LOCALE === 'pl'
            ? SNAPSHOT_PL_TRANSLATIONS[value] || value
            : SITE_LOCALE === 'uk'
              ? SNAPSHOT_UK_TRANSLATIONS[value] || value
              : SITE_LOCALE === 'pt'
                ? SNAPSHOT_PT_TRANSLATIONS[value] || value
                : SITE_LOCALE === 'fr'
                  ? SNAPSHOT_FR_TRANSLATIONS[value] || value
                  : SITE_LOCALE === 'hi'
                    ? SNAPSHOT_HI_TRANSLATIONS[value] || value
          : value;
  
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
            <span>${normalizeText(snapshotLabel(item))}</span>
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
              ${normalizeText(snapshotLabel(tab.label))}
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
                    ${snapshotLabel('Visible now:')} ${availableCount}
                  </span>
                  <span class="is-unavailable">
                    <img src="/icons/ui/remove-close-round-grey-icon.svg" alt="Unavailable sections" aria-hidden="true" />
                    ${snapshotLabel('Not surfaced:')} ${unavailableCount}
                  </span>
                </div>
                <p>${normalizeText(
                  snapshotLabel(
                    tab.note || `These are the main ${tab.label.toLowerCase()} sections currently visible on the account.`
                  )
                )}</p>
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
        <h2 class="title">${normalizeText(snapshotLabel('Games & Betting Snapshot'))}</h2>
        <p class="brand-availability-intro">
          ${normalizeText(
            snapshotIntro ||
              localeText(
                `This section shows which game, live-casino, and betting categories ${brandName} currently highlights, so you can quickly check whether it covers the types of games and betting options you want before you deposit.`,
                `Dieser Abschnitt zeigt, welche Spiele-, Live-Casino- und Wettkategorien ${brandName} aktuell hervorhebt, damit Sie das Angebot vor einer Einzahlung prüfen können.`,
                `Esta sección muestra las categorías de juegos, casino en vivo y apuestas que ${brandName} destaca actualmente para que puedas comprobar la oferta antes de depositar.`
              )
          )}
        </p>
  
        <div class="availability-tabs" data-tabs>
          <div class="availability-tab-list" role="tablist" aria-label="${localeText(`${normalizeText(brandName)} product snapshot`, `${normalizeText(brandName)} Produktüberblick`, `Resumen de productos de ${normalizeText(brandName)}`)}">
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
        label.textContent = isExpanded
          ? localeText('Show fewer countries', 'Weniger Länder anzeigen', 'Mostrar menos países')
          : localeText('Show all countries', 'Alle Länder anzeigen', 'Mostrar todos los países');
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
        <span class="brand-country-toggle__text">${localeText('Show all countries', 'Alle Länder anzeigen', 'Mostrar todos los países')}</span>
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
      const kind =
        label === 'pros' || label === 'prós' || label === 'vorteile' || label === 'ventajas' || label === 'pro' || label === 'vantaggi' || label === 'zalety' || label === 'plusy' || label === 'переваги' || label === 'плюси' || label === 'avantages' || label === 'फायदे'
          ? 'pros'
          : label === 'cons' || label === 'nachteile' || label === 'contras' || label === 'desventajas' || label === 'contro' || label === 'svantaggi' || label === 'wady' || label === 'minusy' || label === 'недоліки' || label === 'мінуси' || label === 'inconvénients' || label === 'नुकसान'
            ? 'cons'
            : '';
      if (!kind) return;
      if (heading.querySelector('.pros-cons-icon')) return;
  
      const card = heading.closest('.feature-card');
      if (card) {
        card.classList.add(kind === 'pros' ? 'is-pros-card' : 'is-cons-card');
        card.closest('.features-grid')?.classList.add('pros-cons-grid');
      }
  
      heading.classList.add('pros-cons-heading', kind === 'pros' ? 'is-pros' : 'is-cons');
  
      const icon = document.createElement('img');
      icon.className = 'pros-cons-icon';
      icon.src =
        kind === 'pros' ? '/icons/ui/addition-color-icon.svg' : '/icons/ui/subtract-color-icon.svg';
      icon.alt = '';
      icon.setAttribute('aria-hidden', 'true');
  
      heading.prepend(icon);
    });
  };

  const brandKey = context.brandKey;
  normalizeFinalBrandCtaLabels();
  initStickyBrandTitle();
  enhanceBrandProsCons();
  applyBrandInfoPairLayout();
  renderBrandAvailabilityWidget(brandKey);
  initBrandSectionNav();
  initBrandHeroPanels();
  initBrandCountryCollapse();
  window.requestAnimationFrame(initBrandCountryCollapse);
  window.addEventListener('load', initBrandCountryCollapse, { once: true });
};
