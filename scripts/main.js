// =====================
// IMPORTS
// =====================
import { BRANDS } from './brands.js?v=20260813-french-1';
import { COUNTRIES } from './countries.js';
import { initFooterNewsletter } from './footer-newsletter.js?v=20260826-newsletter-4';
import { initAccountAuth } from './account-auth.js?v=20260829-local-preview-1';

let BRAND_SNAPSHOT_CONFIGS = {};
let BRAND_NEW_GAMES = {};
let BRAND_HOMEPAGE_SCREENSHOTS = {};
let initHomePageModule = null;
let renderCountryMediaModule = null;
let initBrandPageModule = null;
let initBrandFeedbackModule = null;
let initTopCasinosPageModule = null;
let initBrandLayoutModule = null;
let initAccountPageModule = null;

const brandLayoutFallbackTimer = document.body?.dataset.brand
  ? window.setTimeout(() => {
      if (!document.body.classList.contains('has-brand-sticky-layout')) {
        document.body.classList.add('brand-layout-failed');
      }
    }, 1500)
  : null;
const brandLayoutModuleReady = document.body?.dataset.brand
  ? import('./pages/brand-layout.js?v=20260813-brand-cls-1').then(module => {
      initBrandLayoutModule = module.initBrandLayout;
    }).catch(error => {
      document.body.classList.add('brand-layout-failed');
      console.warn('Could not initialize the enhanced brand layout.', error);
    })
  : Promise.resolve();

const loadPageModules = async () => {
  const isHomePage = document.body.classList.contains('home-page') && !document.body.dataset.page;
  const isCountryPage = Boolean(document.body.dataset.country);
  const isBrandPage = Boolean(document.body.dataset.brand);

  if (isHomePage) {
    const [screenshotsModule, gamesModule, pageModule] = await Promise.all([
      import('./brand-homepage-screenshots.js?v=20260813-french-1'),
      import('./brand-new-games.js?v=20260813-french-1'),
      import('./pages/home.js?v=20260829-mobile-density-1'),
    ]);
    BRAND_HOMEPAGE_SCREENSHOTS = screenshotsModule.BRAND_HOMEPAGE_SCREENSHOTS || {};
    BRAND_NEW_GAMES = gamesModule.BRAND_NEW_GAMES || {};
    initHomePageModule = pageModule.initHomePage;
  }

  if (isCountryPage) {
    const [screenshotsModule, gamesModule, pageModule] = await Promise.all([
      import('./brand-homepage-screenshots.js?v=20260813-french-1'),
      import('./brand-new-games.js?v=20260813-french-1'),
      import('./pages/country-media.js?v=20260813-page-modules-1'),
    ]);
    BRAND_HOMEPAGE_SCREENSHOTS = screenshotsModule.BRAND_HOMEPAGE_SCREENSHOTS || {};
    BRAND_NEW_GAMES = gamesModule.BRAND_NEW_GAMES || {};
    renderCountryMediaModule = pageModule.renderCountryMedia;
  }

  if (isBrandPage) {
    const [snapshotsModule, gamesModule, pageModule, feedbackModule] = await Promise.all([
      import('./brand-snapshot-configs.js?v=20260813-french-1'),
      import('./brand-new-games.js?v=20260813-french-1'),
      import('./pages/brand.js?v=20260829-mobile-density-2'),
      import('./pages/brand-feedback.js?v=20260829-mobile-compose-1'),
    ]);
    BRAND_SNAPSHOT_CONFIGS = snapshotsModule.BRAND_SNAPSHOT_CONFIGS || {};
    BRAND_NEW_GAMES = gamesModule.BRAND_NEW_GAMES || {};
    initBrandPageModule = pageModule.initBrandPage;
    initBrandFeedbackModule = feedbackModule.initBrandFeedback;
  }

  if (document.body.dataset.page === 'top-casinos') {
    const pageModule = await import('./pages/top-casinos.js?v=20260814-finnish-1');
    initTopCasinosPageModule = pageModule.initTopCasinosPage;
  }

  if (document.body.dataset.page === 'account') {
    const pageModule = await import('./pages/account.js?v=20260827-moderation-1');
    initAccountPageModule = pageModule.initAccountPage;
  }

};

// =====================
// HELPERS
// =====================
const PLACEHOLDER_LINK = '#';
const MOJIBAKE_FIXES = [];
const THEME_STORAGE_KEY = 'spincresta-theme';
const THEME_OPTIONS = ['dark', 'light'];
const LANGUAGE_STORAGE_KEY = 'spincresta-language';
const LANGUAGE_OPTIONS = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const BLOCKED_BRAND_ICON = '/icons/ui/stop-blocked-icon.svg';
const UNAVAILABLE_BRAND_ICON = '/icons/ui/remove-close-round-grey-icon.svg';
const BRAND_ONLY_COUNTRIES = {
  BJ: { slug: 'benin', name: { en: 'Benin', de: 'Benin', es: 'Benín', it: 'Benin', pl: 'Benin', uk: 'Бенін', pt: 'Benim', fr: 'Bénin', hi: 'बेनिन', fi: 'Benin' } },
  BF: { slug: 'burkina-faso', name: { en: 'Burkina Faso', de: 'Burkina Faso', es: 'Burkina Faso', it: 'Burkina Faso', pl: 'Burkina Faso', uk: 'Буркіна-Фасо', pt: 'Burquina Faso', fr: 'Burkina Faso', hi: 'बुर्किना फासो', fi: 'Burkina Faso' } },
  CM: { slug: 'cameroon', name: { en: 'Cameroon', de: 'Kamerun', es: 'Camerún', it: 'Camerun', pl: 'Kamerun', uk: 'Камерун', pt: 'Camarões', fr: 'Cameroun', hi: 'कैमरून', fi: 'Kamerun' } },
  CD: { slug: 'democratic-republic-of-the-congo', name: { en: 'DR Congo', de: 'Demokratische Republik Kongo', es: 'República Democrática del Congo', it: 'Repubblica Democratica del Congo', pl: 'Demokratyczna Republika Konga', uk: 'Демократична Республіка Конго', pt: 'República Democrática do Congo', fr: 'République démocratique du Congo', hi: 'कांगो लोकतांत्रिक गणराज्य', fi: 'Kongon demokraattinen tasavalta' } },
  DZ: { slug: 'algeria', name: { en: 'Algeria', de: 'Algerien', es: 'Argelia', it: 'Algeria', pl: 'Algieria', uk: 'Алжир', pt: 'Argélia', fr: 'Algérie', hi: 'अल्जीरिया', fi: 'Algeria' } },
  CY: { slug: 'cyprus', name: { en: 'Cyprus', de: 'Zypern', es: 'Chipre', it: 'Cipro', pl: 'Cypr', uk: 'Кіпр', pt: 'Chipre', fr: 'Chypre', hi: 'साइप्रस', fi: 'Kypros' } },
  ET: { slug: 'ethiopia', name: { en: 'Ethiopia', de: 'Äthiopien', es: 'Etiopía', it: 'Etiopia', pl: 'Etiopia', uk: 'Ефіопія', pt: 'Etiópia', fr: 'Éthiopie', hi: 'इथियोपिया', fi: 'Etiopia' } },
  CI: { slug: 'ivory-coast', name: { en: "Côte d’Ivoire", de: 'Elfenbeinküste', es: 'Costa de Marfil', it: "Costa d’Avorio", pl: 'Wybrzeże Kości Słoniowej', uk: 'Кот-д’Івуар', pt: 'Costa do Marfim', fr: "Côte d’Ivoire", hi: 'कोट डी आइवर', fi: 'Norsunluurannikko' } },
  JO: { slug: 'jordan', name: { en: 'Jordan', de: 'Jordanien', es: 'Jordania', it: 'Giordania', pl: 'Jordania', uk: 'Йорданія', pt: 'Jordânia', fr: 'Jordanie', hi: 'जॉर्डन', fi: 'Jordania' } },
  MA: { slug: 'morocco', name: { en: 'Morocco', de: 'Marokko', es: 'Marruecos', it: 'Marocco', pl: 'Maroko', uk: 'Марокко', pt: 'Marrocos', fr: 'Maroc', hi: 'मोरक्को', fi: 'Marokko' } },
  RS: { slug: 'serbia', name: { en: 'Serbia', de: 'Serbien', es: 'Serbia', it: 'Serbia', pl: 'Serbia', uk: 'Сербія', pt: 'Sérvia', fr: 'Serbie', hi: 'सर्बिया', fi: 'Serbia' } },
  SN: { slug: 'senegal', name: { en: 'Senegal', de: 'Senegal', es: 'Senegal', it: 'Senegal', pl: 'Senegal', uk: 'Сенегал', pt: 'Senegal', fr: 'Sénégal', hi: 'सेनेगल', fi: 'Senegal' } },
  SO: { slug: 'somalia', name: { en: 'Somalia', de: 'Somalia', es: 'Somalia', it: 'Somalia', pl: 'Somalia', uk: 'Сомалі', pt: 'Somália', fr: 'Somalie', hi: 'सोमालिया', fi: 'Somalia' } },
  LK: { slug: 'sri-lanka', name: { en: 'Sri Lanka', de: 'Sri Lanka', es: 'Sri Lanka', it: 'Sri Lanka', pl: 'Sri Lanka', uk: 'Шрі-Ланка', pt: 'Sri Lanka', fr: 'Sri Lanka', hi: 'श्रीलंका', fi: 'Sri Lanka' } },
  TG: { slug: 'togo', name: { en: 'Togo', de: 'Togo', es: 'Togo', it: 'Togo', pl: 'Togo', uk: 'Того', pt: 'Togo', fr: 'Togo', hi: 'टोगो', fi: 'Togo' } },
  ZM: { slug: 'zambia', name: { en: 'Zambia', de: 'Sambia', es: 'Zambia', it: 'Zambia', pl: 'Zambia', uk: 'Замбія', pt: 'Zâmbia', fr: 'Zambie', hi: 'जाम्बिया', fi: 'Sambia' } },
};
const BLOCKED_BRAND_COPY = {
  en: {
    notice: 'According to verified information from our analysts, this casino has issues with law enforcement authorities of the Republic of Belarus.',
    cta: 'Not recommended',
    alternatives: 'We recommend these casinos instead',
  },
  de: {
    notice: 'Nach den von unseren Analysten geprüften Informationen hat dieses Casino Probleme mit den Strafverfolgungsbehörden der Republik Belarus.',
    cta: 'Nicht empfohlen',
    alternatives: 'Wir empfehlen stattdessen diese Casinos',
  },
  es: {
    notice: 'Según la información verificada por nuestros analistas, este casino tiene problemas con las autoridades policiales de la República de Bielorrusia.',
    cta: 'No recomendado',
    alternatives: 'Recomendamos estos casinos como alternativa',
  },
  it: {
    notice: 'Secondo le informazioni verificate dai nostri analisti, questo casinò ha problemi con le autorità della Repubblica di Bielorussia.',
    cta: 'Non consigliato',
    alternatives: 'In alternativa, consigliamo questi casinò',
  },
  pl: {
    notice: 'Według informacji zweryfikowanych przez naszych analityków to kasyno ma problemy z organami ścigania Republiki Białorusi.',
    cta: 'Nierekomendowane',
    alternatives: 'Zamiast tego polecamy te kasyna',
  },
  uk: {
    notice: 'За перевіреною інформацією наших аналітиків, це казино має проблеми з правоохоронними органами Республіки Білорусь.',
    cta: 'Не рекомендуємо',
    alternatives: 'Натомість рекомендуємо ці казино',
  },
  pt: {
    notice: 'Segundo as informações verificadas pelos nossos analistas, este casino tem problemas com as autoridades policiais da República da Bielorrússia.',
    cta: 'Não recomendado',
    alternatives: 'Em alternativa, recomendamos estes casinos',
  },
  fr: {
    notice: 'Selon les informations vérifiées par nos analystes, ce casino rencontre des problèmes avec les autorités chargées de l’application de la loi en République de Biélorussie.',
    cta: 'Non recommandé',
    alternatives: 'Nous recommandons plutôt ces casinos',
  },
  hi: {
    notice: 'हमारे विश्लेषकों द्वारा सत्यापित जानकारी के अनुसार, इस कैसीनो को बेलारूस गणराज्य की कानून-प्रवर्तन एजेंसियों से जुड़ी समस्याओं का सामना करना पड़ रहा है।',
    cta: 'अनुशंसित नहीं',
    alternatives: 'इसके बजाय इन कैसीनो पर विचार करें',
  },
  fi: {
    notice: 'Analyytikkojemme tarkistamien tietojen mukaan tällä kasinolla on ongelmia Valko-Venäjän lainvalvontaviranomaisten kanssa.',
    cta: 'Ei suositella',
    alternatives: 'Suosittelemme sen sijaan näitä kasinoita',
  },
};
const UNAVAILABLE_BRAND_COPY = {
  en: {
    notice: 'This casino is currently unavailable for our players. We will update this review when access becomes available again.',
    cta: 'Currently unavailable',
    alternatives: 'Available casinos you can explore instead',
  },
  de: {
    notice: 'Dieses Casino ist derzeit für unsere Spieler nicht verfügbar. Wir aktualisieren diesen Test, sobald der Zugang wieder möglich ist.',
    cta: 'Derzeit nicht verfügbar',
    alternatives: 'Stattdessen verfügbare Casinos entdecken',
  },
  es: {
    notice: 'Este casino no está disponible actualmente para nuestros jugadores. Actualizaremos la reseña cuando vuelva a estar accesible.',
    cta: 'No disponible actualmente',
    alternatives: 'Casinos disponibles que puedes explorar',
  },
  it: {
    notice: 'Questo casinò non è attualmente disponibile per i nostri giocatori. Aggiorneremo la recensione quando sarà nuovamente accessibile.',
    cta: 'Attualmente non disponibile',
    alternatives: 'Casinò disponibili da scoprire in alternativa',
  },
  pl: {
    notice: 'To kasyno jest obecnie niedostępne dla naszych graczy. Zaktualizujemy recenzję, gdy dostęp będzie ponownie możliwy.',
    cta: 'Obecnie niedostępne',
    alternatives: 'Inne dostępne kasyna, które warto sprawdzić',
  },
  uk: {
    notice: 'Це казино наразі недоступне для наших гравців. Ми оновимо огляд, коли доступ буде відновлено.',
    cta: 'Наразі недоступне',
    alternatives: 'Інші доступні казино, які варто переглянути',
  },
  pt: {
    notice: 'Este casino não está atualmente disponível para os nossos jogadores. Atualizaremos esta análise quando o acesso voltar a estar disponível.',
    cta: 'Indisponível neste momento',
    alternatives: 'Outros casinos disponíveis que pode consultar',
  },
  fr: {
    notice: 'Ce casino est actuellement indisponible pour nos joueurs. Nous mettrons cet avis à jour dès que l’accès sera de nouveau possible.',
    cta: 'Indisponible actuellement',
    alternatives: 'Découvrez plutôt ces casinos disponibles',
  },
  hi: {
    notice: 'यह कैसीनो फिलहाल हमारे खिलाड़ियों के लिए उपलब्ध नहीं है। दोबारा उपलब्ध होने पर हम इस समीक्षा को अपडेट करेंगे।',
    cta: 'फिलहाल उपलब्ध नहीं',
    alternatives: 'इसके बजाय उपलब्ध कैसीनो देखें',
  },
  fi: {
    notice: 'Tämä kasino ei ole tällä hetkellä pelaajiemme saatavilla. Päivitämme arvostelun, kun se on jälleen käytettävissä.',
    cta: 'Ei tällä hetkellä saatavilla',
    alternatives: 'Tutustu sen sijaan näihin saatavilla oleviin kasinoihin',
  },
};

const normalizeText = value => {
  if (typeof value !== 'string') return value ?? '';
  return MOJIBAKE_FIXES.reduce((text, [bad, good]) => text.split(bad).join(good), value);
};

const escapeHtml = value =>
  normalizeText(value)
    .toString()
    .replace(
      /[&<>"']/g,
      char =>
        ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
        })[char]
    );

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

const iconPath = slug => `/icons/${slug}-flag-icon.svg`;
const loadDeferredCountryFlags = container => {
  if (!container) return;

  container.querySelectorAll('img[data-country-flag-src]').forEach(image => {
    image.src = image.dataset.countryFlagSrc;
    image.removeAttribute('data-country-flag-src');
  });
};
const observeDeferredCountryFlags = container => {
  if (!container) return;
  if (!('IntersectionObserver' in window)) {
    loadDeferredCountryFlags(container);
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      loadDeferredCountryFlags(container);
      observer.disconnect();
    },
    { rootMargin: '500px 0px' }
  );
  observer.observe(container);
};
const DOCUMENT_LANGUAGE = document.documentElement.lang?.toLowerCase() || 'en';
const SITE_LOCALE = DOCUMENT_LANGUAGE.startsWith('de')
  ? 'de'
  : DOCUMENT_LANGUAGE.startsWith('es')
    ? 'es'
    : DOCUMENT_LANGUAGE.startsWith('it')
      ? 'it'
      : DOCUMENT_LANGUAGE.startsWith('pl')
        ? 'pl'
        : DOCUMENT_LANGUAGE.startsWith('uk')
          ? 'uk'
          : DOCUMENT_LANGUAGE.startsWith('pt')
            ? 'pt'
            : DOCUMENT_LANGUAGE.startsWith('fr')
              ? 'fr'
              : DOCUMENT_LANGUAGE.startsWith('hi')
                ? 'hi'
                : DOCUMENT_LANGUAGE.startsWith('fi')
                  ? 'fi'
      : 'en';
let brandBonusTranslations = {};
const brandBonusTranslationsReady = SITE_LOCALE === 'en'
  ? Promise.resolve()
  : import(`./brand-bonus-translations/${SITE_LOCALE}.js?v=20260814-finnish-1`)
      .then(module => {
        brandBonusTranslations = module.default || {};
      })
      .catch(error => {
        console.warn(`Could not load ${SITE_LOCALE} bonus translations.`, error);
      });
const getStoredLanguage = () => {
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return LANGUAGE_OPTIONS.includes(stored) ? stored : null;
  } catch {
    return null;
  }
};
const persistLanguage = locale => {
  if (!LANGUAGE_OPTIONS.includes(locale)) return;

  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
  } catch {
    // Ignore storage errors in private or restricted browsing modes.
  }
};
const restoreLanguageOnEntry = () => {
  const entryPath = window.location.pathname.replace(/\/index\.html$/, '/');
  const storedLanguage = getStoredLanguage();

  if (entryPath === '/' && SITE_LOCALE === 'en' && storedLanguage && storedLanguage !== 'en') {
    window.location.replace(`/${storedLanguage}/${window.location.search}${window.location.hash}`);
    return;
  }

  persistLanguage(SITE_LOCALE);
};

restoreLanguageOnEntry();
const GERMAN_COUNTRY_SLUGS = new Set(['argentina', 'australia', 'austria', 'azerbaijan', 'bangladesh', 'belgium', 'brazil', 'bulgaria', 'canada', 'chile', 'colombia', 'croatia', 'czech-republic', 'denmark', 'egypt', 'estonia', 'finland', 'france', 'germany', 'ghana', 'greece', 'hungary', 'iceland', 'india', 'indonesia', 'ireland', 'italy', 'japan', 'kazakhstan', 'kenya', 'kyrgyzstan', 'latvia', 'lithuania', 'luxembourg', 'malaysia', 'mexico', 'nepal', 'netherlands', 'new-zealand', 'nigeria', 'norway', 'peru', 'philippines', 'poland', 'portugal', 'romania', 'russia', 'singapore', 'slovakia', 'slovenia', 'south-africa', 'south-korea', 'spain', 'sweden', 'switzerland', 'tanzania', 'thailand', 'turkey', 'uganda', 'ukraine', 'united-kingdom', 'united-states', 'uzbekistan', 'vietnam']);
const SPANISH_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const ITALIAN_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const POLISH_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const UKRAINIAN_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const PORTUGUESE_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const FRENCH_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const HINDI_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const FINNISH_COUNTRY_SLUGS = GERMAN_COUNTRY_SLUGS;
const countryPagePath = slug =>
  SITE_LOCALE === 'de' && GERMAN_COUNTRY_SLUGS.has(slug)
    ? `/de/online-casinos/${slug}/`
    : SITE_LOCALE === 'es' && SPANISH_COUNTRY_SLUGS.has(slug)
      ? `/es/online-casinos/${slug}/`
      : SITE_LOCALE === 'it' && ITALIAN_COUNTRY_SLUGS.has(slug)
        ? `/it/online-casinos/${slug}/`
        : SITE_LOCALE === 'pl' && POLISH_COUNTRY_SLUGS.has(slug)
          ? `/pl/online-casinos/${slug}/`
          : SITE_LOCALE === 'uk' && UKRAINIAN_COUNTRY_SLUGS.has(slug)
            ? `/uk/online-casinos/${slug}/`
            : SITE_LOCALE === 'pt' && PORTUGUESE_COUNTRY_SLUGS.has(slug)
              ? `/pt/online-casinos/${slug}/`
              : SITE_LOCALE === 'fr' && FRENCH_COUNTRY_SLUGS.has(slug)
                ? `/fr/online-casinos/${slug}/`
                : SITE_LOCALE === 'hi' && HINDI_COUNTRY_SLUGS.has(slug)
                  ? `/hi/online-casinos/${slug}/`
                  : SITE_LOCALE === 'fi' && FINNISH_COUNTRY_SLUGS.has(slug)
                    ? `/fi/online-casinos/${slug}/`
        : `/online-casinos/${slug}/`;
const brandPagePath = brandOrPath => {
  const rawPath = typeof brandOrPath === 'string' ? brandOrPath : brandOrPath?.urlDetail;
  const normalized = normalizePagePath(rawPath || '');

  if (SITE_LOCALE !== 'en' && normalized.startsWith('/brands/')) {
    return `/${SITE_LOCALE}${normalized}`;
  }

  return normalized;
};
const UI_COPY = {
  en: {
    searchLabel: 'Search SpinCresta',
    searchPlaceholder: 'Search',
    availableCountries: 'Available countries',
    noMatches: 'No matches found',
    openSearch: 'Open search',
    closeSearch: 'Close search',
    languageSwitcher: 'Choose language',
    countries: 'Countries',
    settings: 'Settings',
    blog: 'Blog',
    languageEnglish: 'English',
    languageGerman: 'German',
    languageSpanish: 'Spanish',
    languageItalian: 'Italian',
    languagePolish: 'Polish',
    languageUkrainian: 'Ukrainian',
    languagePortuguese: 'Portuguese',
    languageFrench: 'French',
    languageHindi: 'Hindi',
    countryGuide: 'Country guide',
    brandReview: 'Brand review',
    casinoReview: 'Casino review and player checks',
    visitCasino: 'Visit Casino',
    claimBonusPlay: 'Claim Bonus & Play',
    review: 'Review',
    topRated: 'Top Rated',
    exclusive: 'Exclusive',
    new: 'New',
    all: 'All',
    crypto: 'Crypto',
    fastPayout: 'Fast Payout',
    sportsbook: 'Sportsbook',
    sweepstakes: 'Sweepstakes',
    filterBrands: 'Filter casino brands',
    noFilterMatches: 'No casinos match this filter yet.',
    noCountryCasinos: 'No casinos available for this country.',
    topCasinos: 'Top Casinos',
    newCasinos: 'New Casinos',
  },
  de: {
    searchLabel: 'SpinCresta durchsuchen',
    searchPlaceholder: 'Suchen',
    availableCountries: 'Verfügbare Länder',
    noMatches: 'Keine Treffer gefunden',
    openSearch: 'Suche öffnen',
    closeSearch: 'Suche schließen',
    languageSwitcher: 'Sprache auswählen',
    countries: 'Länder',
    settings: 'Einstellungen',
    blog: 'Blog',
    languageEnglish: 'Englisch',
    languageGerman: 'Deutsch',
    languageSpanish: 'Spanisch',
    languageItalian: 'Italienisch',
    languagePolish: 'Polnisch',
    languageUkrainian: 'Ukrainisch',
    languagePortuguese: 'Portugiesisch',
    languageFrench: 'Französisch',
    languageHindi: 'Hindi',
    countryGuide: 'Länder-Guide',
    brandReview: 'Marken-Test',
    casinoReview: 'Casino-Test und Spieler-Checks',
    visitCasino: 'Spielen',
    claimBonusPlay: 'Bonus sichern & spielen',
    review: 'Test',
    topRated: 'Top bewertet',
    exclusive: 'Exklusiv',
    new: 'Neu',
    all: 'Alle',
    crypto: 'Krypto',
    fastPayout: 'Schnelle Auszahlung',
    sportsbook: 'Sportwetten',
    sweepstakes: 'Social Casino',
    filterBrands: 'Casino-Marken filtern',
    noFilterMatches: 'Noch keine Casinos für diesen Filter.',
    noCountryCasinos: 'Für dieses Land sind noch keine Casinos verfügbar.',
    topCasinos: 'Top Casinos',
    newCasinos: 'Neue Casinos',
  },
  es: {
    searchLabel: 'Buscar en SpinCresta',
    searchPlaceholder: 'Buscar',
    availableCountries: 'Países disponibles',
    noMatches: 'No se encontraron resultados',
    openSearch: 'Abrir búsqueda',
    closeSearch: 'Cerrar búsqueda',
    languageSwitcher: 'Elegir idioma',
    countries: 'Países',
    settings: 'Ajustes',
    blog: 'Blog',
    languageEnglish: 'Inglés',
    languageGerman: 'Alemán',
    languageSpanish: 'Español',
    languageItalian: 'Italiano',
    languagePolish: 'Polaco',
    languageUkrainian: 'Ucraniano',
    languagePortuguese: 'Portugués',
    languageFrench: 'Francés',
    languageHindi: 'Hindi',
    countryGuide: 'Guía por país',
    brandReview: 'Reseña de marca',
    casinoReview: 'Reseña del casino y controles para jugadores',
    visitCasino: 'Visitar casino',
    claimBonusPlay: 'Reclamar bono y jugar',
    review: 'Reseña',
    topRated: 'Mejor valorado',
    exclusive: 'Exclusivo',
    new: 'Nuevo',
    all: 'Todos',
    crypto: 'Cripto',
    fastPayout: 'Pago rápido',
    sportsbook: 'Apuestas deportivas',
    sweepstakes: 'Casino social',
    filterBrands: 'Filtrar marcas de casino',
    noFilterMatches: 'Todavía no hay casinos para este filtro.',
    noCountryCasinos: 'No hay casinos disponibles para este país.',
    topCasinos: 'Mejores casinos',
    newCasinos: 'Casinos nuevos',
  },
  it: {
    searchLabel: 'Cerca su SpinCresta',
    searchPlaceholder: 'Cerca',
    availableCountries: 'Paesi disponibili',
    noMatches: 'Nessun risultato trovato',
    openSearch: 'Apri ricerca',
    closeSearch: 'Chiudi ricerca',
    languageSwitcher: 'Scegli la lingua',
    countries: 'Paesi',
    settings: 'Impostazioni',
    blog: 'Blog',
    languageEnglish: 'Inglese',
    languageGerman: 'Tedesco',
    languageSpanish: 'Spagnolo',
    languageItalian: 'Italiano',
    languagePolish: 'Polacco',
    languageUkrainian: 'Ucraino',
    languagePortuguese: 'Portoghese',
    languageFrench: 'Francese',
    languageHindi: 'Hindi',
    countryGuide: 'Guida per paese',
    brandReview: 'Recensione del brand',
    casinoReview: 'Recensione del casinò e controlli per i giocatori',
    visitCasino: 'Visita il casinò',
    claimBonusPlay: 'Richiedi il bonus e gioca',
    review: 'Recensione',
    topRated: 'Più votati',
    exclusive: 'Esclusivi',
    new: 'Nuovi',
    all: 'Tutti',
    crypto: 'Crypto',
    fastPayout: 'Pagamenti rapidi',
    sportsbook: 'Scommesse sportive',
    sweepstakes: 'Social casino',
    filterBrands: 'Filtra i brand di casinò',
    noFilterMatches: 'Nessun casinò corrisponde ancora a questo filtro.',
    noCountryCasinos: 'Nessun casinò disponibile per questo paese.',
    topCasinos: 'Migliori casinò',
    newCasinos: 'Nuovi casinò',
  },
  pl: {
    searchLabel: 'Szukaj w SpinCresta',
    searchPlaceholder: 'Szukaj',
    availableCountries: 'Dostępne kraje',
    noMatches: 'Nie znaleziono wyników',
    openSearch: 'Otwórz wyszukiwanie',
    closeSearch: 'Zamknij wyszukiwanie',
    languageSwitcher: 'Wybierz język',
    countries: 'Kraje',
    settings: 'Ustawienia',
    blog: 'Blog',
    languageEnglish: 'Angielski',
    languageGerman: 'Niemiecki',
    languageSpanish: 'Hiszpański',
    languageItalian: 'Włoski',
    languagePolish: 'Polski',
    languageUkrainian: 'Ukraiński',
    languagePortuguese: 'Portugalski',
    languageFrench: 'Francuski',
    languageHindi: 'Hindi',
    countryGuide: 'Przewodnik po kraju',
    brandReview: 'Recenzja marki',
    casinoReview: 'Recenzja kasyna i najważniejsze informacje dla graczy',
    visitCasino: 'Odwiedź kasyno',
    claimBonusPlay: 'Odbierz bonus i zagraj',
    review: 'Recenzja',
    topRated: 'Najwyżej oceniane',
    exclusive: 'Ekskluzywne',
    new: 'Nowe',
    all: 'Wszystkie',
    crypto: 'Krypto',
    fastPayout: 'Szybkie wypłaty',
    sportsbook: 'Zakłady sportowe',
    sweepstakes: 'Kasyno społecznościowe',
    filterBrands: 'Filtruj marki kasyn',
    noFilterMatches: 'Żadne kasyno nie pasuje jeszcze do tego filtra.',
    noCountryCasinos: 'Brak kasyn dostępnych w tym kraju.',
    topCasinos: 'Najlepsze kasyna',
    newCasinos: 'Nowe kasyna',
  },
  uk: {
    searchLabel: 'Пошук на SpinCresta',
    searchPlaceholder: 'Пошук',
    availableCountries: 'Доступні країни',
    noMatches: 'Нічого не знайдено',
    openSearch: 'Відкрити пошук',
    closeSearch: 'Закрити пошук',
    languageSwitcher: 'Вибрати мову',
    countries: 'Країни',
    settings: 'Налаштування',
    blog: 'Блог',
    languageEnglish: 'Англійська',
    languageGerman: 'Німецька',
    languageSpanish: 'Іспанська',
    languageItalian: 'Італійська',
    languagePolish: 'Польська',
    languageUkrainian: 'Українська',
    languagePortuguese: 'Португальська',
    languageFrench: 'Французька',
    languageHindi: 'Гінді',
    countryGuide: 'Гід країною',
    brandReview: 'Огляд бренду',
    casinoReview: 'Огляд казино та важлива інформація для гравців',
    visitCasino: 'Відвідати казино',
    claimBonusPlay: 'Отримати бонус і грати',
    review: 'Огляд',
    topRated: 'Найвище оцінені',
    exclusive: 'Ексклюзивні',
    new: 'Нові',
    all: 'Усі',
    crypto: 'Криптовалюти',
    fastPayout: 'Швидкі виплати',
    sportsbook: 'Ставки на спорт',
    sweepstakes: 'Соціальне казино',
    filterBrands: 'Фільтрувати бренди казино',
    noFilterMatches: 'За цим фільтром казино поки не знайдено.',
    noCountryCasinos: 'Для цієї країни казино поки немає.',
    topCasinos: 'Найкращі казино',
    newCasinos: 'Нові казино',
  },
  pt: {
    searchLabel: 'Pesquisar no SpinCresta',
    searchPlaceholder: 'Pesquisar',
    availableCountries: 'Países disponíveis',
    noMatches: 'Não foram encontrados resultados',
    openSearch: 'Abrir pesquisa',
    closeSearch: 'Fechar pesquisa',
    languageSwitcher: 'Escolher idioma',
    countries: 'Países',
    settings: 'Definições',
    blog: 'Blog',
    languageEnglish: 'Inglês',
    languageGerman: 'Alemão',
    languageSpanish: 'Espanhol',
    languageItalian: 'Italiano',
    languagePolish: 'Polaco',
    languageUkrainian: 'Ucraniano',
    languagePortuguese: 'Português',
    languageFrench: 'Francês',
    languageHindi: 'Hindi',
    countryGuide: 'Guia do país',
    brandReview: 'Análise da marca',
    casinoReview: 'Análise do casino e informações importantes para jogadores',
    visitCasino: 'Jogar',
    claimBonusPlay: 'Obter o bónus e jogar',
    review: 'Análise',
    topRated: 'Melhor avaliados',
    exclusive: 'Exclusivos',
    new: 'Novos',
    all: 'Todos',
    crypto: 'Criptomoedas',
    fastPayout: 'Levantamentos rápidos',
    sportsbook: 'Apostas desportivas',
    sweepstakes: 'Casino social',
    filterBrands: 'Filtrar marcas de casino',
    noFilterMatches: 'Ainda não existem casinos para este filtro.',
    noCountryCasinos: 'Não existem casinos disponíveis para este país.',
    topCasinos: 'Melhores casinos',
    newCasinos: 'Novos casinos',
  },
  fr: {
    searchLabel: 'Rechercher sur SpinCresta',
    searchPlaceholder: 'Rechercher',
    availableCountries: 'Pays disponibles',
    noMatches: 'Aucun résultat trouvé',
    openSearch: 'Ouvrir la recherche',
    closeSearch: 'Fermer la recherche',
    languageSwitcher: 'Choisir la langue',
    countries: 'Pays',
    settings: 'Paramètres',
    blog: 'Blog',
    languageEnglish: 'Anglais',
    languageGerman: 'Allemand',
    languageSpanish: 'Espagnol',
    languageItalian: 'Italien',
    languagePolish: 'Polonais',
    languageUkrainian: 'Ukrainien',
    languagePortuguese: 'Portugais',
    languageFrench: 'Français',
    languageHindi: 'Hindi',
    countryGuide: 'Guide par pays',
    brandReview: 'Avis sur la marque',
    casinoReview: 'Avis sur le casino et informations essentielles pour les joueurs',
    visitCasino: 'Jouer',
    claimBonusPlay: 'Obtenir le bonus et jouer',
    review: 'Avis',
    topRated: 'Mieux notés',
    exclusive: 'Exclusifs',
    new: 'Nouveaux',
    all: 'Tous',
    crypto: 'Crypto',
    fastPayout: 'Retraits rapides',
    sportsbook: 'Paris sportifs',
    sweepstakes: 'Casino social',
    filterBrands: 'Filtrer les marques de casino',
    noFilterMatches: 'Aucun casino ne correspond encore à ce filtre.',
    noCountryCasinos: 'Aucun casino disponible pour ce pays.',
    topCasinos: 'Meilleurs casinos',
    newCasinos: 'Nouveaux casinos',
  },
  hi: {
    searchLabel: 'SpinCresta पर खोजें',
    searchPlaceholder: 'खोजें',
    availableCountries: 'उपलब्ध देश',
    noMatches: 'कोई परिणाम नहीं मिला',
    openSearch: 'खोज खोलें',
    closeSearch: 'खोज बंद करें',
    languageSwitcher: 'भाषा चुनें',
    countries: 'देश',
    settings: 'सेटिंग्स',
    blog: 'ब्लॉग',
    languageEnglish: 'अंग्रेज़ी',
    languageGerman: 'जर्मन',
    languageSpanish: 'स्पेनिश',
    languageItalian: 'इतालवी',
    languagePolish: 'पोलिश',
    languageUkrainian: 'यूक्रेनी',
    languagePortuguese: 'पुर्तगाली',
    languageFrench: 'फ़्रेंच',
    languageHindi: 'हिन्दी',
    countryGuide: 'देश गाइड',
    brandReview: 'ब्रांड समीक्षा',
    casinoReview: 'कैसीनो समीक्षा और खिलाड़ियों के लिए ज़रूरी जानकारी',
    visitCasino: 'खेलें',
    claimBonusPlay: 'बोनस लें और खेलें',
    review: 'समीक्षा',
    topRated: 'सर्वोच्च रेटिंग',
    exclusive: 'एक्सक्लूसिव',
    new: 'नए',
    all: 'सभी',
    crypto: 'क्रिप्टो',
    fastPayout: 'तेज़ निकासी',
    sportsbook: 'स्पोर्ट्स बेटिंग',
    sweepstakes: 'सोशल कैसीनो',
    filterBrands: 'कैसीनो ब्रांड फ़िल्टर करें',
    noFilterMatches: 'इस फ़िल्टर के लिए अभी कोई कैसीनो नहीं है।',
    noCountryCasinos: 'इस देश के लिए कोई कैसीनो उपलब्ध नहीं है।',
    topCasinos: 'सर्वश्रेष्ठ कैसीनो',
    newCasinos: 'नए कैसीनो',
  },
  fi: {
    searchLabel: 'Hae SpinCrestasta',
    searchPlaceholder: 'Hae',
    availableCountries: 'Saatavilla olevat maat',
    noMatches: 'Ei hakutuloksia',
    openSearch: 'Avaa haku',
    closeSearch: 'Sulje haku',
    languageSwitcher: 'Valitse kieli',
    countries: 'Maat',
    settings: 'Asetukset',
    blog: 'Blogi',
    languageEnglish: 'Englanti',
    languageGerman: 'Saksa',
    languageSpanish: 'Espanja',
    languageItalian: 'Italia',
    languagePolish: 'Puola',
    languageUkrainian: 'Ukraina',
    languagePortuguese: 'Portugali',
    languageFrench: 'Ranska',
    languageHindi: 'Hindi',
    languageFinnish: 'Suomi',
    countryGuide: 'Maaopas',
    brandReview: 'Brändiarvostelu',
    casinoReview: 'Kasinoarvostelu ja tärkeät tiedot pelaajille',
    visitCasino: 'Pelaa',
    claimBonusPlay: 'Pelaa',
    review: 'Arvostelu',
    topRated: 'Parhaiten arvioidut',
    exclusive: 'Eksklusiiviset',
    new: 'Uudet',
    all: 'Kaikki',
    crypto: 'Krypto',
    fastPayout: 'Nopeat kotiutukset',
    sportsbook: 'Vedonlyönti',
    sweepstakes: 'Sosiaalinen kasino',
    filterBrands: 'Suodata kasinobrändejä',
    noFilterMatches: 'Tällä suodattimella ei löytynyt kasinoita.',
    noCountryCasinos: 'Tähän maahan ei ole saatavilla kasinoita.',
    topCasinos: 'Parhaat kasinot',
    newCasinos: 'Uudet kasinot',
  },
};
const FINNISH_LANGUAGE_LABELS = {
  en: 'Finnish', de: 'Finnisch', es: 'Finés', it: 'Finlandese', pl: 'Fiński',
  uk: 'Фінська', pt: 'Finlandês', fr: 'Finnois', hi: 'फ़िनिश', fi: 'Suomi',
};
Object.entries(UI_COPY).forEach(([locale, copy]) => {
  copy.languageFinnish = FINNISH_LANGUAGE_LABELS[locale] || 'Finnish';
});
const uiCopy = UI_COPY[SITE_LOCALE];
const ITALIAN_RUNTIME_COPY = {
  'Close settings': 'Chiudi impostazioni',
  Theme: 'Tema',
  'Choose the theme you want to use on SpinCresta.': 'Scegli il tema da utilizzare su SpinCresta.',
  'Theme options': 'Opzioni del tema',
  Dark: 'Scuro',
  Light: 'Chiaro',
  'CASINO LOBBY PREVIEWS': 'ANTEPRIME DEI CASINÒ',
  'Review and current details': 'Recensione e dettagli aggiornati',
  'FRESH FROM REVIEWED LOBBIES': 'NOVITÀ DAI CASINÒ RECENSITI',
  at: 'su',
  Highlights: 'In evidenza',
  Countries: 'Paesi',
  Payments: 'Pagamenti',
  Games: 'Giochi',
  Bonuses: 'Bonus',
  Checklist: 'Checklist',
  Trust: 'Affidabilità',
  'Pros & Cons': 'Pro e contro',
  'Best For': 'Ideale per',
  'On this page': 'In questa pagina',
  'Show fewer countries': 'Mostra meno paesi',
  'Show all countries': 'Mostra tutti i paesi',
  'Casino brand letter navigation': 'Navigazione alfabetica dei brand di casinò',
  'New Games': 'Nuovi giochi',
  'LATEST RELEASES': 'ULTIME USCITE',
  'No top casinos available.': 'Nessun casinò in evidenza disponibile.',
  'No exclusive offers available at the moment.': 'Al momento non sono disponibili offerte esclusive.',
  'No new casinos available at the moment.': 'Al momento non sono disponibili nuovi casinò.',
  'No top rated casinos available at the moment.': 'Al momento non sono disponibili casinò con le valutazioni migliori.',
};
const italianRuntimeText = english => {
  if (ITALIAN_RUNTIME_COPY[english]) return ITALIAN_RUNTIME_COPY[english];

  return english
    .replace(/^(.*) is currently unavailable$/, '$1 non è attualmente disponibile')
    .replace(/^(.*) is not recommended$/, '$1 non è consigliato')
    .replace(/^(\d+) more payment methods$/, '$1 altri metodi di pagamento')
    .replace(/^Read the (.*) review$/, 'Leggi la recensione di $1')
    .replace(/^Inside casinos available in (.*)$/, 'Dentro i casinò disponibili in $1')
    .replace(/^Real homepage captures from brands included in our (.*) comparison\. Open any preview for the complete review and current details\.$/, 'Schermate reali delle homepage dei brand inclusi nel confronto per $1. Apri un’anteprima per leggere la recensione completa e i dettagli aggiornati.')
    .replace(/^(.*) casino homepage for (.*)$/, 'Homepage del casinò $1 per $2')
    .replace(/^New games in (.*)$/, 'Nuovi giochi in $1')
    .replace(/^Recent releases from casino brands included in our (.*) comparison\. Each card opens the relevant review; availability can vary by region and account\.$/, 'Uscite recenti dei brand inclusi nel confronto per $1. Ogni scheda apre la recensione corrispondente; la disponibilità può variare in base alla regione e all’account.')
    .replace(/^New games for (.*)$/, 'Nuovi giochi per $1')
    .replace(/^(.*) game artwork at (.*)$/, 'Immagine del gioco $1 su $2')
    .replace(/^(.*) Gambling Guide$/, 'Guida al gioco per $1')
    .replace(/^Visit (.*)$/, 'Visita $1')
    .replace(/^(.*) product snapshot$/, 'Panoramica dei prodotti di $1')
    .replace(/^View all (.*) casinos$/, 'Vedi tutti i casinò di $1')
    .replace(/^(.*) market availability$/, 'Disponibilità per il mercato $1')
    .replace(/^(.*) casino guide$/, 'Guida ai casinò di $1')
    .replace(/^Play (.*) at (.*)$/, 'Gioca a $1 su $2');
};
const POLISH_RUNTIME_COPY = {
  'Close settings': 'Zamknij ustawienia',
  Theme: 'Motyw',
  'Choose the theme you want to use on SpinCresta.': 'Wybierz motyw, którego chcesz używać w SpinCresta.',
  'Theme options': 'Opcje motywu',
  Dark: 'Ciemny',
  Light: 'Jasny',
  'CASINO LOBBY PREVIEWS': 'PODGLĄD LOBBY KASYN',
  'Review and current details': 'Recenzja i aktualne informacje',
  'FRESH FROM REVIEWED LOBBIES': 'NOWOŚCI Z RECENZOWANYCH KASYN',
  at: 'w',
  Highlights: 'Najważniejsze informacje',
  Countries: 'Kraje',
  Payments: 'Płatności',
  Games: 'Gry',
  Bonuses: 'Bonusy',
  Checklist: 'Lista kontrolna',
  Trust: 'Wiarygodność',
  'Pros & Cons': 'Zalety i wady',
  'Best For': 'Najlepsze dla',
  'On this page': 'Na tej stronie',
  'Show fewer countries': 'Pokaż mniej krajów',
  'Show all countries': 'Pokaż wszystkie kraje',
  'Casino brand letter navigation': 'Alfabetyczna nawigacja marek kasyn',
  'New Games': 'Nowe gry',
  'LATEST RELEASES': 'NAJNOWSZE PREMIERY',
  'No top casinos available.': 'Brak wyróżnionych kasyn.',
  'No exclusive offers available at the moment.': 'Obecnie brak ekskluzywnych ofert.',
  'No new casinos available at the moment.': 'Obecnie brak nowych kasyn.',
  'No top rated casinos available at the moment.': 'Obecnie brak najwyżej ocenianych kasyn.',
};
const polishRuntimeText = english => {
  if (POLISH_RUNTIME_COPY[english]) return POLISH_RUNTIME_COPY[english];
  const paymentCount = english.match(/^(\d+) more payment methods$/)?.[1];
  if (paymentCount) {
    const count = Number(paymentCount);
    const label = count === 1
      ? 'dodatkowa metoda płatności'
      : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)
        ? 'dodatkowe metody płatności'
        : 'dodatkowych metod płatności';
    return `${count} ${label}`;
  }

  return english
    .replace(/^(.*) is currently unavailable$/, '$1 jest obecnie niedostępne')
    .replace(/^(.*) is not recommended$/, '$1 nie jest rekomendowane')
    .replace(/^Read the (.*) review$/, 'Przeczytaj recenzję $1')
    .replace(/^Inside casinos available in (.*)$/, 'Wnętrza kasyn dostępnych w kraju: $1')
    .replace(/^Real homepage captures from brands included in our (.*) comparison\. Open any preview for the complete review and current details\.$/, 'Prawdziwe zrzuty stron głównych marek uwzględnionych w porównaniu dla kraju $1. Otwórz podgląd, aby przeczytać pełną recenzję i aktualne informacje.')
    .replace(/^(.*) casino homepage for (.*)$/, 'Strona główna kasyna $1 dla kraju $2')
    .replace(/^New games in (.*)$/, 'Nowe gry w kraju: $1')
    .replace(/^Recent releases from casino brands included in our (.*) comparison\. Each card opens the relevant review; availability can vary by region and account\.$/, 'Najnowsze gry marek uwzględnionych w porównaniu dla kraju $1. Każda karta otwiera odpowiednią recenzję; dostępność może zależeć od regionu i konta.')
    .replace(/^New games for (.*)$/, 'Nowe gry dla kraju $1')
    .replace(/^(.*) game artwork at (.*)$/, 'Grafika gry $1 w $2')
    .replace(/^(.*) Gambling Guide$/, 'Przewodnik po grach hazardowych: $1')
    .replace(/^Visit (.*)$/, 'Odwiedź $1')
    .replace(/^(.*) product snapshot$/, 'Przegląd produktów $1')
    .replace(/^View all (.*) casinos$/, 'Zobacz wszystkie kasyna: $1')
    .replace(/^(.*) market availability$/, 'Dostępność na rynku: $1')
    .replace(/^(.*) casino guide$/, 'Przewodnik po kasynach: $1')
    .replace(/^Play (.*) at (.*)$/, 'Zagraj w $1 w $2');
};

const UKRAINIAN_RUNTIME_COPY = {
  'Close settings': 'Закрити налаштування',
  Theme: 'Тема',
  'Choose the theme you want to use on SpinCresta.': 'Виберіть тему для SpinCresta.',
  'Theme options': 'Варіанти теми',
  Dark: 'Темна',
  Light: 'Світла',
  'CASINO LOBBY PREVIEWS': 'ОГЛЯД ЛОБІ КАЗИНО',
  'Review and current details': 'Огляд та актуальна інформація',
  'FRESH FROM REVIEWED LOBBIES': 'НОВИНКИ З ПЕРЕВІРЕНИХ КАЗИНО',
  at: 'у',
  Highlights: 'Головне',
  Countries: 'Країни',
  Payments: 'Платежі',
  Games: 'Ігри',
  Bonuses: 'Бонуси',
  Checklist: 'Чекліст',
  Trust: 'Надійність',
  'Pros & Cons': 'Переваги й недоліки',
  'Best For': 'Найкраще підходить',
  'On this page': 'На цій сторінці',
  'Show fewer countries': 'Показати менше країн',
  'Show all countries': 'Показати всі країни',
  'Casino brand letter navigation': 'Алфавітна навігація брендами казино',
  'New Games': 'Нові ігри',
  'LATEST RELEASES': 'ОСТАННІ НОВИНКИ',
  'No top casinos available.': 'Немає доступних рекомендованих казино.',
  'No exclusive offers available at the moment.': 'Наразі ексклюзивних пропозицій немає.',
  'No new casinos available at the moment.': 'Наразі нових казино немає.',
  'No top rated casinos available at the moment.': 'Наразі немає казино з найвищими оцінками.',
};
const ukrainianRuntimeText = english => {
  if (UKRAINIAN_RUNTIME_COPY[english]) return UKRAINIAN_RUNTIME_COPY[english];
  const paymentCount = english.match(/^(\d+) more payment methods$/)?.[1];
  if (paymentCount) {
    const count = Number(paymentCount);
    const label = count % 10 === 1 && count % 100 !== 11
      ? 'додатковий спосіб оплати'
      : count % 10 >= 2 && count % 10 <= 4 && (count % 100 < 12 || count % 100 > 14)
        ? 'додаткові способи оплати'
        : 'додаткових способів оплати';
    return `${count} ${label}`;
  }

  return english
    .replace(/^(.*) is currently unavailable$/, '$1 наразі недоступне')
    .replace(/^(.*) is not recommended$/, '$1 не рекомендоване')
    .replace(/^Read the (.*) review$/, 'Прочитати огляд $1')
    .replace(/^Inside casinos available in (.*)$/, 'Казино, доступні для країни: $1')
    .replace(/^Real homepage captures from brands included in our (.*) comparison\. Open any preview for the complete review and current details\.$/, 'Справжні знімки головних сторінок брендів у нашому порівнянні для країни $1. Відкрийте прев’ю, щоб прочитати повний огляд та актуальну інформацію.')
    .replace(/^(.*) casino homepage for (.*)$/, 'Головна сторінка казино $1 для країни $2')
    .replace(/^New games in (.*)$/, 'Нові ігри для країни: $1')
    .replace(/^Recent releases from casino brands included in our (.*) comparison\. Each card opens the relevant review; availability can vary by region and account\.$/, 'Нові релізи брендів із нашого порівняння для країни $1. Кожна картка відкриває відповідний огляд; доступність може залежати від регіону та облікового запису.')
    .replace(/^New games for (.*)$/, 'Нові ігри для країни $1')
    .replace(/^(.*) game artwork at (.*)$/, 'Зображення гри $1 у $2')
    .replace(/^(.*) Gambling Guide$/, 'Гід з азартних ігор: $1')
    .replace(/^Visit (.*)$/, 'Відвідати $1')
    .replace(/^(.*) product snapshot$/, 'Огляд продуктів $1')
    .replace(/^View all (.*) casinos$/, 'Переглянути всі казино: $1')
    .replace(/^(.*) market availability$/, 'Доступність на ринку: $1')
    .replace(/^(.*) casino guide$/, 'Гід казино: $1')
    .replace(/^Play (.*) at (.*)$/, 'Грати в $1 у $2');
};

const PORTUGUESE_RUNTIME_COPY = {
  'Close settings': 'Fechar definições',
  Theme: 'Tema',
  'Choose the theme you want to use on SpinCresta.': 'Escolha o tema que pretende utilizar no SpinCresta.',
  'Theme options': 'Opções de tema',
  Dark: 'Escuro',
  Light: 'Claro',
  'CASINO LOBBY PREVIEWS': 'PRÉ-VISUALIZAÇÕES DOS CASINOS',
  'Review and current details': 'Análise e informações atualizadas',
  'FRESH FROM REVIEWED LOBBIES': 'NOVIDADES DOS CASINOS ANALISADOS',
  at: 'no',
  Highlights: 'Destaques',
  Countries: 'Países',
  Payments: 'Pagamentos',
  Games: 'Jogos',
  Bonuses: 'Bónus',
  Checklist: 'Lista de verificação',
  Trust: 'Confiança',
  'Pros & Cons': 'Vantagens e desvantagens',
  'Best For': 'Ideal para',
  'On this page': 'Nesta página',
  'Show fewer countries': 'Mostrar menos países',
  'Show all countries': 'Mostrar todos os países',
  'Casino brand letter navigation': 'Navegação alfabética das marcas de casino',
  'New Games': 'Novos jogos',
  'LATEST RELEASES': 'ÚLTIMOS LANÇAMENTOS',
  'No top casinos available.': 'Não existem casinos em destaque disponíveis.',
  'No exclusive offers available at the moment.': 'Não existem ofertas exclusivas disponíveis neste momento.',
  'No new casinos available at the moment.': 'Não existem novos casinos disponíveis neste momento.',
  'No top rated casinos available at the moment.': 'Não existem casinos melhor avaliados disponíveis neste momento.',
};
const portugueseRuntimeText = english => {
  if (PORTUGUESE_RUNTIME_COPY[english]) return PORTUGUESE_RUNTIME_COPY[english];
  return english
    .replace(/^(.*) is currently unavailable$/, '$1 está atualmente indisponível')
    .replace(/^(.*) is not recommended$/, '$1 não é recomendado')
    .replace(/^(\d+) more payment methods$/, '$1 métodos de pagamento adicionais')
    .replace(/^Read the (.*) review$/, 'Ler a análise de $1')
    .replace(/^Inside casinos available in (.*)$/, 'Por dentro dos casinos disponíveis em $1')
    .replace(/^Real homepage captures from brands included in our (.*) comparison\. Open any preview for the complete review and current details\.$/, 'Capturas reais das páginas iniciais das marcas incluídas na nossa comparação para $1. Abra uma pré-visualização para consultar a análise completa e as informações atualizadas.')
    .replace(/^(.*) casino homepage for (.*)$/, 'Página inicial do casino $1 para $2')
    .replace(/^New games in (.*)$/, 'Novos jogos em $1')
    .replace(/^Recent releases from casino brands included in our (.*) comparison\. Each card opens the relevant review; availability can vary by region and account\.$/, 'Lançamentos recentes das marcas incluídas na nossa comparação para $1. Cada cartão abre a análise correspondente; a disponibilidade pode variar consoante a região e a conta.')
    .replace(/^New games for (.*)$/, 'Novos jogos para $1')
    .replace(/^(.*) game artwork at (.*)$/, 'Imagem do jogo $1 no $2')
    .replace(/^(.*) Gambling Guide$/, 'Guia de jogo para $1')
    .replace(/^Visit (.*)$/, 'Visitar $1')
    .replace(/^(.*) product snapshot$/, 'Resumo dos produtos do $1')
    .replace(/^View all (.*) casinos$/, 'Ver todos os casinos de $1')
    .replace(/^(.*) market availability$/, 'Disponibilidade no mercado de $1')
    .replace(/^(.*) casino guide$/, 'Guia de casinos de $1')
    .replace(/^Play (.*) at (.*)$/, 'Jogar $1 no $2');
};

const FRENCH_RUNTIME_COPY = {
  'Close settings': 'Fermer les paramètres',
  Theme: 'Thème',
  'Choose the theme you want to use on SpinCresta.': 'Choisissez le thème à utiliser sur SpinCresta.',
  'Theme options': 'Options du thème',
  Dark: 'Sombre',
  Light: 'Clair',
  'CASINO LOBBY PREVIEWS': 'APERÇUS DES CASINOS',
  'Review and current details': 'Avis et informations à jour',
  'FRESH FROM REVIEWED LOBBIES': 'NOUVEAUTÉS DES CASINOS ÉVALUÉS',
  at: 'chez',
  Highlights: 'Points forts',
  Countries: 'Pays',
  Payments: 'Paiements',
  Games: 'Jeux',
  Bonuses: 'Bonus',
  Checklist: 'Points vérifiés',
  Trust: 'Fiabilité',
  'Pros & Cons': 'Avantages et inconvénients',
  'Best For': 'Idéal pour',
  'On this page': 'Sur cette page',
  'Show fewer countries': 'Afficher moins de pays',
  'Show all countries': 'Afficher tous les pays',
  'Casino brand letter navigation': 'Navigation alphabétique des marques de casino',
  'New Games': 'Nouveaux jeux',
  'LATEST RELEASES': 'DERNIÈRES SORTIES',
  'No top casinos available.': 'Aucun casino recommandé disponible.',
  'No exclusive offers available at the moment.': 'Aucune offre exclusive disponible actuellement.',
  'No new casinos available at the moment.': 'Aucun nouveau casino disponible actuellement.',
  'No top rated casinos available at the moment.': 'Aucun casino parmi les mieux notés disponible actuellement.',
};
const frenchRuntimeText = english => {
  if (FRENCH_RUNTIME_COPY[english]) return FRENCH_RUNTIME_COPY[english];
  return english
    .replace(/^(.*) is currently unavailable$/, '$1 est actuellement indisponible')
    .replace(/^(.*) is not recommended$/, '$1 n’est pas recommandé')
    .replace(/^(\d+) more payment methods$/, '$1 moyens de paiement supplémentaires')
    .replace(/^Read the (.*) review$/, 'Lire l’avis sur $1')
    .replace(/^Inside casinos available in (.*)$/, 'Aperçu des casinos disponibles en $1')
    .replace(/^Real homepage captures from brands included in our (.*) comparison\. Open any preview for the complete review and current details\.$/, 'Captures réelles des pages d’accueil des marques incluses dans notre comparatif pour $1. Ouvrez un aperçu pour consulter l’avis complet et les informations à jour.')
    .replace(/^(.*) casino homepage for (.*)$/, 'Page d’accueil du casino $1 pour $2')
    .replace(/^New games in (.*)$/, 'Nouveaux jeux en $1')
    .replace(/^Recent releases from casino brands included in our (.*) comparison\. Each card opens the relevant review; availability can vary by region and account\.$/, 'Sorties récentes des marques incluses dans notre comparatif pour $1. Chaque carte ouvre l’avis correspondant ; la disponibilité peut varier selon la région et le compte.')
    .replace(/^New games for (.*)$/, 'Nouveaux jeux pour $1')
    .replace(/^(.*) game artwork at (.*)$/, 'Visuel du jeu $1 chez $2')
    .replace(/^(.*) Gambling Guide$/, 'Guide des jeux d’argent : $1')
    .replace(/^Visit (.*)$/, 'Visiter $1')
    .replace(/^(.*) product snapshot$/, 'Aperçu de l’offre $1')
    .replace(/^View all (.*) casinos$/, 'Voir tous les casinos en $1')
    .replace(/^(.*) market availability$/, 'Disponibilité de $1 selon le marché')
    .replace(/^(.*) casino guide$/, 'Guide des casinos : $1')
    .replace(/^Play (.*) at (.*)$/, 'Jouer à $1 chez $2');
};

const HINDI_RUNTIME_COPY = {
  'Close settings': 'सेटिंग्स बंद करें',
  Theme: 'थीम',
  'Choose the theme you want to use on SpinCresta.': 'SpinCresta के लिए अपनी पसंद की थीम चुनें।',
  'Theme options': 'थीम विकल्प',
  Dark: 'डार्क',
  Light: 'लाइट',
  'BROWSE BY MARKET': 'बाज़ार के अनुसार देखें',
  'CASINO LOBBY PREVIEWS': 'कैसीनो लॉबी की झलक',
  'Review and current details': 'समीक्षा और नवीनतम जानकारी',
  'Casino review and current details': 'समीक्षा और नवीनतम जानकारी',
  'FRESH FROM REVIEWED LOBBIES': 'समीक्षित कैसीनो के नए गेम',
  Play: 'खेलें',
  at: 'पर',
  Highlights: 'मुख्य बातें',
  Countries: 'देश',
  Payments: 'भुगतान',
  Games: 'गेम',
  Bonuses: 'बोनस',
  Checklist: 'चेकलिस्ट',
  Trust: 'विश्वसनीयता',
  'Pros & Cons': 'फायदे और नुकसान',
  'Best For': 'इनके लिए बेहतर',
  'On this page': 'इस पेज पर',
  'Show fewer countries': 'कम देश दिखाएं',
  'Show all countries': 'सभी देश दिखाएं',
  'Casino brand letter navigation': 'कैसीनो ब्रांड की वर्णमाला सूची',
  'New Games': 'नए गेम',
  'LATEST RELEASES': 'नवीनतम गेम',
  'No top casinos available.': 'अभी कोई अनुशंसित कैसीनो उपलब्ध नहीं है।',
  'No exclusive offers available at the moment.': 'फिलहाल कोई एक्सक्लूसिव ऑफर उपलब्ध नहीं है।',
  'No new casinos available at the moment.': 'फिलहाल कोई नया कैसीनो उपलब्ध नहीं है।',
  'No top rated casinos available at the moment.': 'फिलहाल कोई सर्वोच्च रेटिंग वाला कैसीनो उपलब्ध नहीं है।',
};
const hindiRuntimeText = english => {
  if (HINDI_RUNTIME_COPY[english]) return HINDI_RUNTIME_COPY[english];
  return english
    .replace(/^(.*) is currently unavailable$/, '$1 फिलहाल उपलब्ध नहीं है')
    .replace(/^(.*) is not recommended$/, '$1 अनुशंसित नहीं है')
    .replace(/^(\d+) more payment methods$/, '$1 अन्य भुगतान विधियां')
    .replace(/^Read the (.*) review$/, '$1 की समीक्षा पढ़ें')
    .replace(/^Inside casinos available in (.*)$/, '$1 में उपलब्ध कैसीनो की झलक')
    .replace(/^New games in (.*)$/, '$1 में नए गेम')
    .replace(/^New games for (.*)$/, '$1 के लिए नए गेम')
    .replace(/^(.*) game artwork at (.*)$/, '$2 पर $1 गेम का चित्र')
    .replace(/^(.*) Gambling Guide$/, '$1 जुआ गाइड')
    .replace(/^Visit (.*)$/, '$1 पर जाएं')
    .replace(/^(.*) product snapshot$/, '$1 की सेवाओं का सार')
    .replace(/^View all (.*) casinos$/, '$1 के सभी कैसीनो देखें')
    .replace(/^(.*) market availability$/, '$1 की बाज़ार उपलब्धता')
    .replace(/^(.*) casino guide$/, '$1 कैसीनो गाइड')
    .replace(/^Play (.*) at (.*)$/, '$2 पर $1 खेलें');
};

const FINNISH_RUNTIME_COPY = {
  'Close settings': 'Sulje asetukset',
  Theme: 'Teema',
  'Choose the theme you want to use on SpinCresta.': 'Valitse SpinCrestassa käytettävä teema.',
  'Theme options': 'Teemavaihtoehdot',
  Dark: 'Tumma',
  Light: 'Vaalea',
  'BROWSE BY MARKET': 'SELAA MAITTAIN',
  'CASINO LOBBY PREVIEWS': 'KATSAUS KASINOIDEN AULOIHIN',
  'Review and current details': 'Arvostelu ja ajantasaiset tiedot',
  'Casino review and current details': 'Arvostelu ja ajantasaiset tiedot',
  'FRESH FROM REVIEWED LOBBIES': 'UUTUUKSIA ARVOSTELLUILTA KASINOILTA',
  Play: 'Pelaa',
  at: 'kasinolla',
  Highlights: 'Kohokohdat',
  Countries: 'Maat',
  Payments: 'Maksutavat',
  Games: 'Pelit',
  Bonuses: 'Bonukset',
  Checklist: 'Tarkistuslista',
  Trust: 'Luotettavuus',
  'Pros & Cons': 'Hyvät ja huonot puolet',
  'Best For': 'Sopii parhaiten',
  'On this page': 'Tällä sivulla',
  'Show fewer countries': 'Näytä vähemmän maita',
  'Show all countries': 'Näytä kaikki maat',
  'Casino brand letter navigation': 'Kasinobrändien aakkosellinen navigointi',
  'New Games': 'Uudet pelit',
  'LATEST RELEASES': 'UUSIMMAT JULKAISUT',
  'No top casinos available.': 'Suositeltuja kasinoita ei ole juuri nyt saatavilla.',
  'No exclusive offers available at the moment.': 'Eksklusiivisia tarjouksia ei ole juuri nyt saatavilla.',
  'No new casinos available at the moment.': 'Uusia kasinoita ei ole juuri nyt saatavilla.',
  'No top rated casinos available at the moment.': 'Parhaiten arvioituja kasinoita ei ole juuri nyt saatavilla.',
};
const finnishRuntimeText = english => {
  if (FINNISH_RUNTIME_COPY[english]) return FINNISH_RUNTIME_COPY[english];
  return english
    .replace(/^(.*) is currently unavailable$/, '$1 ei ole tällä hetkellä saatavilla')
    .replace(/^(.*) is not recommended$/, '$1 ei ole suositeltu')
    .replace(/^(\d+) more payment methods$/, '$1 muuta maksutapaa')
    .replace(/^Read the (.*) review$/, 'Lue kasinon $1 arvostelu')
    .replace(/^Inside casinos available in (.*)$/, 'Kasinoiden esikatselu – $1')
    .replace(/^Real homepage captures from brands included in our (.*) comparison\. Open any preview for the complete review and current details\.$/, 'Aitoja kuvia $1-vertailuumme kuuluvien kasinoiden etusivuilta. Avaa kortti nähdäksesi koko arvostelun ja ajantasaiset tiedot.')
    .replace(/^(.*) casino homepage for (.*)$/, '$1-kasinon etusivu, markkina $2')
    .replace(/^(.*) casino homepage$/, '$1-kasinon etusivu')
    .replace(/^New games in (.*)$/, 'Uudet pelit: $1')
    .replace(/^Recent releases from casino brands included in our (.*) comparison\. Each card opens the relevant review; availability can vary by region and account\.$/, 'Uusimpia julkaisuja $1-vertailuumme kuuluvilta kasinoilta. Jokainen kortti avaa asiaankuuluvan arvostelun; saatavuus voi vaihdella alueen ja pelitilin mukaan.')
    .replace(/^New games for (.*)$/, 'Uudet pelit: $1')
    .replace(/^(.*) game artwork at (.*)$/, 'Pelin $1 kuva kasinolla $2')
    .replace(/^(.*) game artwork$/, '$1 -pelin kuva')
    .replace(/^(.*) Gambling Guide$/, 'Rahapeliopas: $1')
    .replace(/^Visit (.*)$/, 'Pelaa kasinolla $1')
    .replace(/^(.*) product snapshot$/, 'Kasinon $1 tarjonnan yhteenveto')
    .replace(/^View all (.*) casinos$/, 'Näytä kaikki kasinot: $1')
    .replace(/^(.*) market availability$/, 'Saatavuus markkinalla $1')
    .replace(/^(.*) casino guide$/, 'Kasino-opas: $1')
    .replace(/^Play (.*) at (.*)$/, 'Pelaa peliä $1 kasinolla $2');
};

const localizedBrandBonusText = value => {
  const normalized = normalizeText(value);
  return brandBonusTranslations[normalized] || normalized;
};

const localeText = (english, german, spanish, italian, polish, ukrainian, portuguese, french, hindi, finnish) =>
  SITE_LOCALE === 'de'
    ? german
    : SITE_LOCALE === 'es'
      ? spanish
      : SITE_LOCALE === 'it'
        ? (italian || italianRuntimeText(english))
        : SITE_LOCALE === 'pl'
          ? (polish || polishRuntimeText(english))
          : SITE_LOCALE === 'uk'
            ? (ukrainian || ukrainianRuntimeText(english))
            : SITE_LOCALE === 'pt'
              ? (portuguese || portugueseRuntimeText(english))
              : SITE_LOCALE === 'fr'
                ? (french || frenchRuntimeText(english))
                : SITE_LOCALE === 'hi'
                  ? (hindi || hindiRuntimeText(english))
                  : SITE_LOCALE === 'fi'
                    ? (finnish || finnishRuntimeText(english))
        : english;
const localizedPagePath = path => {
  const normalized = normalizePagePath(path);
  if (SITE_LOCALE === 'en' || !normalized.startsWith('/') || normalized.startsWith(`/${SITE_LOCALE}/`)) {
    return normalized;
  }

  return normalized === '/' ? `/${SITE_LOCALE}/` : `/${SITE_LOCALE}${normalized}`;
};
const COUNTRY_NAMES_DE = {
  argentina: 'Argentinien',
  australia: 'Australien',
  austria: 'Österreich',
  azerbaijan: 'Aserbaidschan',
  bangladesh: 'Bangladesch',
  belgium: 'Belgien',
  brazil: 'Brasilien',
  bulgaria: 'Bulgarien',
  canada: 'Kanada',
  chile: 'Chile',
  colombia: 'Kolumbien',
  croatia: 'Kroatien',
  'czech-republic': 'Tschechien',
  denmark: 'Dänemark',
  egypt: 'Ägypten',
  estonia: 'Estland',
  finland: 'Finnland',
  france: 'Frankreich',
  germany: 'Deutschland',
  ghana: 'Ghana',
  greece: 'Griechenland',
  hungary: 'Ungarn',
  iceland: 'Island',
  india: 'Indien',
  indonesia: 'Indonesien',
  ireland: 'Irland',
  italy: 'Italien',
  japan: 'Japan',
  kazakhstan: 'Kasachstan',
  kenya: 'Kenia',
  kyrgyzstan: 'Kirgisistan',
  latvia: 'Lettland',
  lithuania: 'Litauen',
  luxembourg: 'Luxemburg',
  malaysia: 'Malaysia',
  mexico: 'Mexiko',
  netherlands: 'Niederlande',
  nepal: 'Nepal',
  'new-zealand': 'Neuseeland',
  nigeria: 'Nigeria',
  norway: 'Norwegen',
  philippines: 'Philippinen',
  poland: 'Polen',
  portugal: 'Portugal',
  peru: 'Peru',
  russia: 'Russland',
  romania: 'Rumänien',
  singapore: 'Singapur',
  slovakia: 'Slowakei',
  slovenia: 'Slowenien',
  'south-africa': 'Südafrika',
  'south-korea': 'Südkorea',
  spain: 'Spanien',
  sweden: 'Schweden',
  switzerland: 'Schweiz',
  thailand: 'Thailand',
  turkey: 'Türkei',
  tanzania: 'Tansania',
  uganda: 'Uganda',
  ukraine: 'Ukraine',
  'united-kingdom': 'Vereinigtes Königreich',
  'united-states': 'Vereinigte Staaten',
  uzbekistan: 'Usbekistan',
  vietnam: 'Vietnam',
};
const COUNTRY_NAMES_ES = {
  argentina: 'Argentina',
  australia: 'Australia',
  austria: 'Austria',
  azerbaijan: 'Azerbaiyán',
  bangladesh: 'Bangladés',
  belgium: 'Bélgica',
  brazil: 'Brasil',
  bulgaria: 'Bulgaria',
  canada: 'Canadá',
  chile: 'Chile',
  colombia: 'Colombia',
  croatia: 'Croacia',
  'czech-republic': 'República Checa',
  denmark: 'Dinamarca',
  egypt: 'Egipto',
  estonia: 'Estonia',
  finland: 'Finlandia',
  france: 'Francia',
  germany: 'Alemania',
  ghana: 'Ghana',
  greece: 'Grecia',
  hungary: 'Hungría',
  iceland: 'Islandia',
  india: 'India',
  indonesia: 'Indonesia',
  ireland: 'Irlanda',
  italy: 'Italia',
  japan: 'Japón',
  kazakhstan: 'Kazajistán',
  kenya: 'Kenia',
  kyrgyzstan: 'Kirguistán',
  latvia: 'Letonia',
  lithuania: 'Lituania',
  luxembourg: 'Luxemburgo',
  malaysia: 'Malasia',
  mexico: 'México',
  netherlands: 'Países Bajos',
  nepal: 'Nepal',
  'new-zealand': 'Nueva Zelanda',
  nigeria: 'Nigeria',
  norway: 'Noruega',
  philippines: 'Filipinas',
  poland: 'Polonia',
  portugal: 'Portugal',
  peru: 'Perú',
  russia: 'Rusia',
  romania: 'Rumanía',
  singapore: 'Singapur',
  slovakia: 'Eslovaquia',
  slovenia: 'Eslovenia',
  'south-africa': 'Sudáfrica',
  'south-korea': 'Corea del Sur',
  spain: 'España',
  sweden: 'Suecia',
  switzerland: 'Suiza',
  thailand: 'Tailandia',
  turkey: 'Turquía',
  tanzania: 'Tanzania',
  uganda: 'Uganda',
  ukraine: 'Ucrania',
  'united-kingdom': 'Reino Unido',
  'united-states': 'Estados Unidos',
  uzbekistan: 'Uzbekistán',
  vietnam: 'Vietnam',
};
const COUNTRY_NAMES_IT = {
  argentina: 'Argentina',
  australia: 'Australia',
  austria: 'Austria',
  azerbaijan: 'Azerbaigian',
  bangladesh: 'Bangladesh',
  belgium: 'Belgio',
  brazil: 'Brasile',
  bulgaria: 'Bulgaria',
  canada: 'Canada',
  chile: 'Cile',
  colombia: 'Colombia',
  croatia: 'Croazia',
  'czech-republic': 'Repubblica Ceca',
  denmark: 'Danimarca',
  egypt: 'Egitto',
  estonia: 'Estonia',
  finland: 'Finlandia',
  france: 'Francia',
  germany: 'Germania',
  ghana: 'Ghana',
  greece: 'Grecia',
  hungary: 'Ungheria',
  iceland: 'Islanda',
  india: 'India',
  indonesia: 'Indonesia',
  ireland: 'Irlanda',
  italy: 'Italia',
  japan: 'Giappone',
  kazakhstan: 'Kazakistan',
  kenya: 'Kenya',
  kyrgyzstan: 'Kirghizistan',
  latvia: 'Lettonia',
  lithuania: 'Lituania',
  luxembourg: 'Lussemburgo',
  malaysia: 'Malaysia',
  mexico: 'Messico',
  netherlands: 'Paesi Bassi',
  nepal: 'Nepal',
  'new-zealand': 'Nuova Zelanda',
  nigeria: 'Nigeria',
  norway: 'Norvegia',
  philippines: 'Filippine',
  poland: 'Polonia',
  portugal: 'Portogallo',
  peru: 'Perù',
  russia: 'Russia',
  romania: 'Romania',
  singapore: 'Singapore',
  slovakia: 'Slovacchia',
  slovenia: 'Slovenia',
  'south-africa': 'Sudafrica',
  'south-korea': 'Corea del Sud',
  spain: 'Spagna',
  sweden: 'Svezia',
  switzerland: 'Svizzera',
  thailand: 'Thailandia',
  turkey: 'Turchia',
  tanzania: 'Tanzania',
  uganda: 'Uganda',
  ukraine: 'Ucraina',
  'united-kingdom': 'Regno Unito',
  'united-states': 'Stati Uniti',
  uzbekistan: 'Uzbekistan',
  vietnam: 'Vietnam',
};
const COUNTRY_NAMES_PL = {
  argentina: 'Argentyna',
  australia: 'Australia',
  austria: 'Austria',
  azerbaijan: 'Azerbejdżan',
  bangladesh: 'Bangladesz',
  belgium: 'Belgia',
  brazil: 'Brazylia',
  bulgaria: 'Bułgaria',
  canada: 'Kanada',
  chile: 'Chile',
  colombia: 'Kolumbia',
  croatia: 'Chorwacja',
  'czech-republic': 'Czechy',
  denmark: 'Dania',
  egypt: 'Egipt',
  estonia: 'Estonia',
  finland: 'Finlandia',
  france: 'Francja',
  germany: 'Niemcy',
  ghana: 'Ghana',
  greece: 'Grecja',
  hungary: 'Węgry',
  iceland: 'Islandia',
  india: 'Indie',
  indonesia: 'Indonezja',
  ireland: 'Irlandia',
  italy: 'Włochy',
  japan: 'Japonia',
  kazakhstan: 'Kazachstan',
  kenya: 'Kenia',
  kyrgyzstan: 'Kirgistan',
  latvia: 'Łotwa',
  lithuania: 'Litwa',
  luxembourg: 'Luksemburg',
  malaysia: 'Malezja',
  mexico: 'Meksyk',
  netherlands: 'Holandia',
  nepal: 'Nepal',
  'new-zealand': 'Nowa Zelandia',
  nigeria: 'Nigeria',
  norway: 'Norwegia',
  philippines: 'Filipiny',
  poland: 'Polska',
  portugal: 'Portugalia',
  peru: 'Peru',
  russia: 'Rosja',
  romania: 'Rumunia',
  singapore: 'Singapur',
  slovakia: 'Słowacja',
  slovenia: 'Słowenia',
  'south-africa': 'Republika Południowej Afryki',
  'south-korea': 'Korea Południowa',
  spain: 'Hiszpania',
  sweden: 'Szwecja',
  switzerland: 'Szwajcaria',
  thailand: 'Tajlandia',
  turkey: 'Turcja',
  tanzania: 'Tanzania',
  uganda: 'Uganda',
  ukraine: 'Ukraina',
  'united-kingdom': 'Wielka Brytania',
  'united-states': 'Stany Zjednoczone',
  uzbekistan: 'Uzbekistan',
  vietnam: 'Wietnam',
};
const COUNTRY_NAMES_UK = {
  argentina: 'Аргентина',
  australia: 'Австралія',
  austria: 'Австрія',
  azerbaijan: 'Азербайджан',
  bangladesh: 'Бангладеш',
  belgium: 'Бельгія',
  brazil: 'Бразилія',
  bulgaria: 'Болгарія',
  canada: 'Канада',
  chile: 'Чилі',
  colombia: 'Колумбія',
  croatia: 'Хорватія',
  'czech-republic': 'Чехія',
  denmark: 'Данія',
  egypt: 'Єгипет',
  estonia: 'Естонія',
  finland: 'Фінляндія',
  france: 'Франція',
  germany: 'Німеччина',
  ghana: 'Гана',
  greece: 'Греція',
  hungary: 'Угорщина',
  iceland: 'Ісландія',
  india: 'Індія',
  indonesia: 'Індонезія',
  ireland: 'Ірландія',
  italy: 'Італія',
  japan: 'Японія',
  kazakhstan: 'Казахстан',
  kenya: 'Кенія',
  kyrgyzstan: 'Киргизстан',
  latvia: 'Латвія',
  lithuania: 'Литва',
  luxembourg: 'Люксембург',
  malaysia: 'Малайзія',
  mexico: 'Мексика',
  netherlands: 'Нідерланди',
  nepal: 'Непал',
  'new-zealand': 'Нова Зеландія',
  nigeria: 'Нігерія',
  norway: 'Норвегія',
  philippines: 'Філіппіни',
  poland: 'Польща',
  portugal: 'Португалія',
  peru: 'Перу',
  russia: 'Росія',
  romania: 'Румунія',
  singapore: 'Сінгапур',
  slovakia: 'Словаччина',
  slovenia: 'Словенія',
  'south-africa': 'Південна Африка',
  'south-korea': 'Південна Корея',
  spain: 'Іспанія',
  sweden: 'Швеція',
  switzerland: 'Швейцарія',
  thailand: 'Таїланд',
  turkey: 'Туреччина',
  tanzania: 'Танзанія',
  uganda: 'Уганда',
  ukraine: 'Україна',
  'united-kingdom': 'Велика Британія',
  'united-states': 'Сполучені Штати',
  uzbekistan: 'Узбекистан',
  vietnam: 'В’єтнам',
};
const COUNTRY_NAMES_PT = {
  argentina: 'Argentina',
  australia: 'Austrália',
  austria: 'Áustria',
  azerbaijan: 'Azerbaijão',
  bangladesh: 'Bangladeche',
  belgium: 'Bélgica',
  brazil: 'Brasil',
  bulgaria: 'Bulgária',
  canada: 'Canadá',
  chile: 'Chile',
  colombia: 'Colômbia',
  croatia: 'Croácia',
  'czech-republic': 'Chéquia',
  denmark: 'Dinamarca',
  egypt: 'Egito',
  estonia: 'Estónia',
  finland: 'Finlândia',
  france: 'França',
  germany: 'Alemanha',
  ghana: 'Gana',
  greece: 'Grécia',
  hungary: 'Hungria',
  iceland: 'Islândia',
  india: 'Índia',
  indonesia: 'Indonésia',
  ireland: 'Irlanda',
  italy: 'Itália',
  japan: 'Japão',
  kazakhstan: 'Cazaquistão',
  kenya: 'Quénia',
  kyrgyzstan: 'Quirguistão',
  latvia: 'Letónia',
  lithuania: 'Lituânia',
  luxembourg: 'Luxemburgo',
  malaysia: 'Malásia',
  mexico: 'México',
  netherlands: 'Países Baixos',
  nepal: 'Nepal',
  'new-zealand': 'Nova Zelândia',
  nigeria: 'Nigéria',
  norway: 'Noruega',
  philippines: 'Filipinas',
  poland: 'Polónia',
  portugal: 'Portugal',
  peru: 'Peru',
  russia: 'Rússia',
  romania: 'Roménia',
  singapore: 'Singapura',
  slovakia: 'Eslováquia',
  slovenia: 'Eslovénia',
  'south-africa': 'África do Sul',
  'south-korea': 'Coreia do Sul',
  spain: 'Espanha',
  sweden: 'Suécia',
  switzerland: 'Suíça',
  thailand: 'Tailândia',
  turkey: 'Turquia',
  tanzania: 'Tanzânia',
  uganda: 'Uganda',
  ukraine: 'Ucrânia',
  'united-kingdom': 'Reino Unido',
  'united-states': 'Estados Unidos',
  uzbekistan: 'Uzbequistão',
  vietnam: 'Vietname',
};
const COUNTRY_NAMES_FR = {
  argentina: 'Argentine',
  australia: 'Australie',
  austria: 'Autriche',
  azerbaijan: 'Azerbaïdjan',
  bangladesh: 'Bangladesh',
  belgium: 'Belgique',
  brazil: 'Brésil',
  bulgaria: 'Bulgarie',
  canada: 'Canada',
  chile: 'Chili',
  colombia: 'Colombie',
  croatia: 'Croatie',
  'czech-republic': 'Tchéquie',
  denmark: 'Danemark',
  egypt: 'Égypte',
  estonia: 'Estonie',
  finland: 'Finlande',
  france: 'France',
  germany: 'Allemagne',
  ghana: 'Ghana',
  greece: 'Grèce',
  hungary: 'Hongrie',
  iceland: 'Islande',
  india: 'Inde',
  indonesia: 'Indonésie',
  ireland: 'Irlande',
  italy: 'Italie',
  japan: 'Japon',
  kazakhstan: 'Kazakhstan',
  kenya: 'Kenya',
  kyrgyzstan: 'Kirghizistan',
  latvia: 'Lettonie',
  lithuania: 'Lituanie',
  luxembourg: 'Luxembourg',
  malaysia: 'Malaisie',
  mexico: 'Mexique',
  netherlands: 'Pays-Bas',
  nepal: 'Népal',
  'new-zealand': 'Nouvelle-Zélande',
  nigeria: 'Nigeria',
  norway: 'Norvège',
  philippines: 'Philippines',
  poland: 'Pologne',
  portugal: 'Portugal',
  peru: 'Pérou',
  russia: 'Russie',
  romania: 'Roumanie',
  singapore: 'Singapour',
  slovakia: 'Slovaquie',
  slovenia: 'Slovénie',
  'south-africa': 'Afrique du Sud',
  'south-korea': 'Corée du Sud',
  spain: 'Espagne',
  sweden: 'Suède',
  switzerland: 'Suisse',
  thailand: 'Thaïlande',
  turkey: 'Turquie',
  tanzania: 'Tanzanie',
  uganda: 'Ouganda',
  ukraine: 'Ukraine',
  'united-kingdom': 'Royaume-Uni',
  'united-states': 'États-Unis',
  uzbekistan: 'Ouzbékistan',
  vietnam: 'Viêt Nam',
};
const COUNTRY_NAMES_HI = {
  argentina: 'अर्जेंटीना', australia: 'ऑस्ट्रेलिया', austria: 'ऑस्ट्रिया', azerbaijan: 'अज़रबैजान',
  bangladesh: 'बांग्लादेश', belgium: 'बेल्जियम', brazil: 'ब्राज़ील', bulgaria: 'बुल्गारिया',
  canada: 'कनाडा', chile: 'चिली', colombia: 'कोलंबिया', croatia: 'क्रोएशिया', 'czech-republic': 'चेक गणराज्य',
  denmark: 'डेनमार्क', egypt: 'मिस्र', estonia: 'एस्टोनिया', finland: 'फ़िनलैंड', france: 'फ़्रांस',
  germany: 'जर्मनी', ghana: 'घाना', greece: 'ग्रीस', hungary: 'हंगरी', iceland: 'आइसलैंड', india: 'भारत',
  indonesia: 'इंडोनेशिया', ireland: 'आयरलैंड', italy: 'इटली', japan: 'जापान', kazakhstan: 'कज़ाख़स्तान',
  kenya: 'केन्या', kyrgyzstan: 'किर्गिज़स्तान', latvia: 'लातविया', lithuania: 'लिथुआनिया', luxembourg: 'लक्ज़मबर्ग',
  malaysia: 'मलेशिया', mexico: 'मेक्सिको', netherlands: 'नीदरलैंड', nepal: 'नेपाल', 'new-zealand': 'न्यूज़ीलैंड',
  nigeria: 'नाइजीरिया', norway: 'नॉर्वे', philippines: 'फ़िलीपींस', poland: 'पोलैंड', portugal: 'पुर्तगाल', peru: 'पेरू',
  russia: 'रूस', romania: 'रोमानिया', singapore: 'सिंगापुर', slovakia: 'स्लोवाकिया', slovenia: 'स्लोवेनिया',
  'south-africa': 'दक्षिण अफ़्रीका', 'south-korea': 'दक्षिण कोरिया', spain: 'स्पेन', sweden: 'स्वीडन',
  switzerland: 'स्विट्ज़रलैंड', thailand: 'थाईलैंड', turkey: 'तुर्की', tanzania: 'तंज़ानिया', uganda: 'युगांडा',
  ukraine: 'यूक्रेन', 'united-kingdom': 'यूनाइटेड किंगडम', 'united-states': 'संयुक्त राज्य अमेरिका',
  uzbekistan: 'उज़्बेकिस्तान', vietnam: 'वियतनाम',
};
const FINNISH_REGION_NAMES = typeof Intl.DisplayNames === 'function'
  ? new Intl.DisplayNames(['fi'], { type: 'region' })
  : null;
const finnishCountryName = country =>
  FINNISH_REGION_NAMES?.of(country.code.toUpperCase()) || country.name;
const localizedCountryName = country =>
  SITE_LOCALE === 'de'
    ? COUNTRY_NAMES_DE[country.slug] || country.name
    : SITE_LOCALE === 'es'
      ? COUNTRY_NAMES_ES[country.slug] || country.name
      : SITE_LOCALE === 'it'
        ? COUNTRY_NAMES_IT[country.slug] || country.name
        : SITE_LOCALE === 'pl'
          ? COUNTRY_NAMES_PL[country.slug] || country.name
          : SITE_LOCALE === 'uk'
            ? COUNTRY_NAMES_UK[country.slug] || country.name
            : SITE_LOCALE === 'pt'
              ? COUNTRY_NAMES_PT[country.slug] || country.name
              : SITE_LOCALE === 'fr'
                ? COUNTRY_NAMES_FR[country.slug] || country.name
                : SITE_LOCALE === 'hi'
                  ? COUNTRY_NAMES_HI[country.slug] || country.name
                  : SITE_LOCALE === 'fi'
                    ? finnishCountryName(country)
        : country.name;

const localizedCountryTitle = country => {
  const name = localizedCountryName(country);
  if (SITE_LOCALE === 'en') return `Top ${name} Casinos`;
  if (SITE_LOCALE === 'es') return `Mejores casinos en ${name}`;
  if (SITE_LOCALE === 'it') return `Migliori casinò online: ${name}`;
  if (SITE_LOCALE === 'pl') return `Najlepsze kasyna online: ${name}`;
  if (SITE_LOCALE === 'uk') return `Найкращі онлайн-казино: ${name}`;
  if (SITE_LOCALE === 'pt') return `Melhores casinos online em ${name}`;
  if (SITE_LOCALE === 'fr') return `Meilleurs casinos en ligne en ${name}`;
  if (SITE_LOCALE === 'hi') return `${name} के सर्वश्रेष्ठ ऑनलाइन कैसीनो`;
  if (SITE_LOCALE === 'fi') return `Parhaat nettikasinot: ${name}`;

  const germanCases = {
    'united-states': 'in den Vereinigten Staaten',
    'united-kingdom': 'im Vereinigten Königreich',
  };

  return `Top Casinos ${germanCases[country.slug] || `in ${name}`}`;
};

const syncHeaderFlowMetrics = header => {
  if (!header) return;

  const height = Math.ceil(header.offsetHeight || 0);
  const isExpanded =
    header.classList.contains('search-expanded') || header.classList.contains('countries-expanded');

  document.documentElement.style.setProperty('--header-height', `${height}px`);

  if (!isExpanded) {
    document.documentElement.style.setProperty('--header-collapsed-height', `${height}px`);
  }

  document.body.classList.toggle('header-is-expanded', isExpanded);
};
const paymentPath = method => `/icons/payments/${method}.svg`;
const pagePath = fileName => localizedPagePath(fileName);

const STATIC_SEARCH_ITEMS = [
  {
    label: 'Top Casinos',
    labelDe: 'Top Casinos',
    labelEs: 'Mejores casinos',
    labelIt: 'Migliori casinò',
    labelPl: 'Najlepsze kasyna',
    labelUk: 'Найкращі казино',
    labelPt: 'Melhores casinos',
    labelFr: 'Meilleurs casinos',
    labelHi: 'सर्वश्रेष्ठ कैसीनो',
    labelFi: 'Parhaat kasinot',
    type: 'Page',
    href: '/top-casinos/',
    keywords: 'best casinos top casino reviews worldwide',
  },
  {
    label: 'New Casinos',
    labelDe: 'Neue Casinos',
    labelEs: 'Casinos nuevos',
    labelIt: 'Nuovi casinò',
    labelPl: 'Nowe kasyna',
    labelUk: 'Нові казино',
    labelPt: 'Novos casinos',
    labelFr: 'Nouveaux casinos',
    labelHi: 'नए कैसीनो',
    labelFi: 'Uudet kasinot',
    type: 'Page',
    href: '/new-casinos/',
    keywords: 'new casino reviews fresh brands latest',
  },
  {
    label: 'Top Rated',
    labelDe: 'Top bewertet',
    labelEs: 'Mejor valorados',
    labelIt: 'Più votati',
    labelPl: 'Najwyżej oceniane',
    labelUk: 'Найвище оцінені',
    labelPt: 'Melhor avaliados',
    labelFr: 'Mieux notés',
    labelHi: 'सर्वोच्च रेटिंग',
    labelFi: 'Parhaiten arvioidut',
    type: 'Page',
    href: '/top-rated/',
    keywords: 'top rated trusted casino reviews rating',
  },
  {
    label: 'Exclusive',
    labelDe: 'Exklusiv',
    labelEs: 'Exclusivo',
    labelIt: 'Esclusivi',
    labelPl: 'Ekskluzywne',
    labelUk: 'Ексклюзивні',
    labelPt: 'Exclusivos',
    labelFr: 'Exclusifs',
    labelHi: 'एक्सक्लूसिव',
    labelFi: 'Eksklusiiviset',
    type: 'Page',
    href: '/exclusive-offers/',
    keywords: 'exclusive offers private bonuses promotions deals',
  },
  {
    label: 'Casinos & Betting',
    labelDe: 'Casinos & Wetten',
    labelEs: 'Casinos y apuestas',
    labelIt: 'Casinò e scommesse',
    labelPl: 'Kasyna i zakłady',
    labelUk: 'Казино та ставки',
    labelPt: 'Casinos e apostas',
    labelFr: 'Casinos et paris',
    labelHi: 'कैसीनो और बेटिंग',
    labelFi: 'Kasinot ja vedonlyönti',
    type: 'Page',
    href: '/casinos-and-betting/',
    keywords: 'all brands casinos betting sportsbooks a to z',
  },
  {
    label: 'Payment Methods',
    labelDe: 'Zahlungsmethoden',
    labelEs: 'Métodos de pago',
    labelIt: 'Metodi di pagamento',
    labelPl: 'Metody płatności',
    labelUk: 'Способи оплати',
    labelPt: 'Métodos de pagamento',
    labelFr: 'Moyens de paiement',
    labelHi: 'भुगतान विधियां',
    labelFi: 'Maksutavat',
    type: 'Page',
    href: '/payment-methods/',
    keywords: 'payments visa mastercard crypto bank transfer ewallets',
  },
  {
    label: 'Responsible Gambling',
    labelDe: 'Verantwortungsvolles Spielen',
    labelEs: 'Juego responsable',
    labelIt: 'Gioco responsabile',
    labelPl: 'Odpowiedzialna gra',
    labelUk: 'Відповідальна гра',
    labelPt: 'Jogo responsável',
    labelFr: 'Jeu responsable',
    labelHi: 'ज़िम्मेदारी से खेलना',
    labelFi: 'Vastuullinen pelaaminen',
    type: 'Page',
    href: '/responsible-gambling/',
    keywords: 'responsible gambling safer play limits help',
  },
  {
    label: 'About SpinCresta',
    labelDe: 'Über SpinCresta',
    labelEs: 'Acerca de SpinCresta',
    labelIt: 'Chi siamo',
    labelPl: 'O SpinCresta',
    labelUk: 'Про SpinCresta',
    labelPt: 'Sobre o SpinCresta',
    labelFr: 'À propos de SpinCresta',
    labelHi: 'SpinCresta के बारे में',
    labelFi: 'Tietoa SpinCrestasta',
    type: 'Page',
    href: '/about/',
    keywords: 'about spincresta team reviews mission',
  },
  {
    label: 'SpinCresta Blog',
    labelDe: 'SpinCresta Blog',
    labelEs: 'Blog de SpinCresta',
    labelIt: 'Blog di SpinCresta',
    labelPl: 'Blog SpinCresta',
    labelUk: 'Блог SpinCresta',
    labelPt: 'Blog SpinCresta',
    labelFr: 'Blog SpinCresta',
    labelHi: 'SpinCresta ब्लॉग',
    labelFi: 'SpinCresta-blogi',
    type: 'Blog',
    href: '/blog/',
    summary: 'Casino guides, payment explainers, bonus terms, and safer-play checks',
    summaryDe: 'Casino-Ratgeber, Erklärungen zu Zahlungen, Bonusbedingungen und Spielerschutz',
    summaryEs: 'Guías de casino, métodos de pago, condiciones de bonos y controles de juego responsable',
    summaryIt: 'Guide ai casinò, metodi di pagamento, condizioni dei bonus e controlli per il gioco responsabile',
    summaryPl: 'Przewodniki po kasynach, metody płatności, warunki bonusów i narzędzia odpowiedzialnej gry',
    summaryUk: 'Гіди казино, способи оплати, умови бонусів та інструменти відповідальної гри',
    summaryPt: 'Guias de casinos, métodos de pagamento, condições de bónus e ferramentas de jogo responsável',
    summaryFr: 'Guides de casino, moyens de paiement, conditions des bonus et outils de jeu responsable',
    summaryHi: 'कैसीनो गाइड, भुगतान विधियां, बोनस की शर्तें और ज़िम्मेदारी से खेलने के टूल',
    summaryFi: 'Kasino-oppaat, maksutavat, bonusehdot ja vastuullisen pelaamisen työkalut',
    keywords: 'blog casino guides payment bonuses withdrawals kyc country reviews',
  },
];

const normalizeSearchValue = value =>
  normalizeText(value)
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

const slugifyText = value =>
  normalizeSearchValue(value)
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');

const isCryptoPayment = method =>
  /bitcoin|crypto|ethereum|tether|litecoin|tron|cardano|usdt|btc|eth|bitcoincash/i.test(
    normalizeText(method)
  );

const isFastPayment = method =>
  /skrill|neteller|ecopayz|jeton|mifinity|muchbetter|astropay|payz|bitcoin|ethereum|tether|litecoin|tron/i.test(
    normalizeText(method)
  );

const getSiteSearchItems = () => {
  const countryByCode = new Map(COUNTRIES.map(country => [country.code.toUpperCase(), country]));
  const items = new Map();

  const addItem = item => {
    if (!item?.href || items.has(item.href)) return;
    const haystack = normalizeSearchValue(
      [item.label, item.type, item.summary, item.keywords].filter(Boolean).join(' ')
    );
    items.set(item.href, { ...item, haystack });
  };

  STATIC_SEARCH_ITEMS.forEach(item => addItem({
    ...item,
    label: SITE_LOCALE === 'de' ? item.labelDe || item.label : SITE_LOCALE === 'es' ? item.labelEs || item.label : SITE_LOCALE === 'it' ? item.labelIt || item.label : SITE_LOCALE === 'pl' ? item.labelPl || item.label : SITE_LOCALE === 'uk' ? item.labelUk || item.label : SITE_LOCALE === 'pt' ? item.labelPt || item.label : SITE_LOCALE === 'fr' ? item.labelFr || item.label : SITE_LOCALE === 'hi' ? item.labelHi || item.label : SITE_LOCALE === 'fi' ? item.labelFi || item.label : item.label,
    type: SITE_LOCALE === 'de' && item.type === 'Page' ? 'Seite' : SITE_LOCALE === 'es' && item.type === 'Page' ? 'Página' : SITE_LOCALE === 'it' && item.type === 'Page' ? 'Pagina' : SITE_LOCALE === 'pl' && item.type === 'Page' ? 'Strona' : SITE_LOCALE === 'uk' && item.type === 'Page' ? 'Сторінка' : SITE_LOCALE === 'pt' && item.type === 'Page' ? 'Página' : SITE_LOCALE === 'fr' && item.type === 'Page' ? 'Page' : SITE_LOCALE === 'hi' && item.type === 'Page' ? 'पेज' : SITE_LOCALE === 'fi' && item.type === 'Page' ? 'Sivu' : item.type,
    summary: SITE_LOCALE === 'de' ? item.summaryDe || item.summary : SITE_LOCALE === 'es' ? item.summaryEs || item.summary : SITE_LOCALE === 'it' ? item.summaryIt || item.summary : SITE_LOCALE === 'pl' ? item.summaryPl || item.summary : SITE_LOCALE === 'uk' ? item.summaryUk || item.summary : SITE_LOCALE === 'pt' ? item.summaryPt || item.summary : SITE_LOCALE === 'fr' ? item.summaryFr || item.summary : SITE_LOCALE === 'hi' ? item.summaryHi || item.summary : SITE_LOCALE === 'fi' ? item.summaryFi || item.summary : item.summary,
    href: localizedPagePath(item.href),
  }));

  COUNTRIES.forEach(country => {
    const countryName = localizedCountryName(country);
    addItem({
      label: SITE_LOCALE === 'fi' ? `${countryName}: kasinot` : `${countryName} casinos`,
      type: uiCopy.countryGuide,
      href: countryPagePath(country.slug),
      summary:
        SITE_LOCALE === 'de'
          ? `Online Casinos und Sportwetten in ${countryName}`
          : SITE_LOCALE === 'es'
            ? `Casinos online y apuestas en ${countryName}`
            : SITE_LOCALE === 'it'
              ? `Casinò online e scommesse in ${countryName}`
              : SITE_LOCALE === 'pl'
                ? `Kasyna online i zakłady w kraju: ${countryName}`
                : SITE_LOCALE === 'uk'
                  ? `Онлайн-казино та ставки: ${countryName}`
                  : SITE_LOCALE === 'pt'
                    ? `Casinos online e apostas em ${countryName}`
                    : SITE_LOCALE === 'fr'
                      ? `Casinos en ligne et paris en ${countryName}`
                      : SITE_LOCALE === 'hi'
                        ? `${countryName} में ऑनलाइन कैसीनो और बेटिंग`
                        : SITE_LOCALE === 'fi'
                          ? `Nettikasinot ja vedonlyönti: ${countryName}`
              : `Online casinos and betting in ${countryName}`,
      keywords: `${country.code} ${country.slug}`,
    });
  });

  BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail).forEach(brand => {
    const brandCountries = (brand.countries || [])
      .map(code => countryByCode.get(code.toUpperCase()))
      .filter(Boolean);
    const countries = (brand.countries || [])
      .map(code => countryByCode.get(code.toUpperCase())?.name || code)
      .join(' ');

    addItem({
      label: brand.name,
      type: uiCopy.brandReview,
      href: brandPagePath(brand),
      summary: localizedBrandBonusText(brand.bonus) || uiCopy.casinoReview,
      keywords: [countries, brand.payments?.join(' ')].filter(Boolean).join(' '),
      flags: brandCountries.map(country => ({
        name: localizedCountryName(country),
        slug: country.slug,
      })),
    });
  });

  return Array.from(items.values());
};

const createSiteSearch = variant => {
  const searchItems = getSiteSearchItems();
  const form = document.createElement('form');
  const id = `site-search-${variant}`;
  form.className = `site-search site-search--${variant}`;
  form.setAttribute('role', 'search');
  form.setAttribute('aria-label', uiCopy.searchLabel);
  form.innerHTML = `
    <label class="site-search-label" for="${id}">${uiCopy.searchLabel}</label>
    <div class="site-search-shell">
      <img class="site-search-icon" src="/icons/ui/search-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <input id="${id}" class="site-search-input" type="search" placeholder="${uiCopy.searchPlaceholder}" autocomplete="off" spellcheck="false" />
    </div>
    <div class="site-search-results" hidden></div>
  `;

  const input = form.querySelector('.site-search-input');
  const resultsEl = form.querySelector('.site-search-results');
  let activeResults = [];

  const closeResults = () => {
    resultsEl.hidden = true;
    resultsEl.innerHTML = '';
    activeResults = [];
  };

  const renderResultLink = item => {
    const flagsHtml = item.flags?.length
      ? `
        <span class="site-search-flags" aria-label="${uiCopy.availableCountries}">
          ${item.flags
            .map(
              flag => `
                <img
                  class="site-search-flag"
                  src="${iconPath(flag.slug)}"
                  alt="${escapeHtml(flag.name)}"
                  loading="lazy"
                  decoding="async"
                />
              `
            )
            .join('')}
        </span>
      `
      : '';

    return `
      <a class="site-search-result" href="${escapeHtml(item.href)}">
        <span class="site-search-result-type">${escapeHtml(item.type)}</span>
        <span class="site-search-result-title">
          <strong>${escapeHtml(item.label)}</strong>
          ${flagsHtml}
        </span>
        <span>${escapeHtml(item.summary || '')}</span>
      </a>
    `;
  };

  const renderResults = () => {
    const query = normalizeSearchValue(input.value);
    if (!query) {
      closeResults();
      return;
    }

    const terms = query.split(/\s+/).filter(Boolean);
    activeResults = searchItems
      .filter(item => terms.every(term => item.haystack.includes(term)))
      .slice(0, 8);

    resultsEl.hidden = false;
    resultsEl.innerHTML = activeResults.length
      ? activeResults.map(renderResultLink).join('')
      : `<div class="site-search-empty">${uiCopy.noMatches}</div>`;
  };

  form.addEventListener('submit', event => {
    event.preventDefault();
    if (activeResults[0]?.href) {
      window.location.href = activeResults[0].href;
    }
  });

  input.addEventListener('input', renderResults);
  input.addEventListener('focus', renderResults);
  input.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      input.blur();
      closeResults();
    }
  });

  document.addEventListener('click', event => {
    if (!form.contains(event.target)) closeResults();
  });

  return form;
};

const initDesktopSiteSearch = () => {
  const headerInner = document.querySelector('.header-inner');
  const nav = headerInner?.querySelector('.nav');
  if (!headerInner || !nav) return null;

  let search = headerInner.querySelector('.site-search--desktop');
  if (!search) {
    search = createSiteSearch('desktop');
    search.id = 'site-search-desktop-panel';
    headerInner.append(search);
  }

  if (!headerInner.querySelector('.site-search-trigger--desktop')) {
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'site-search-trigger site-search-trigger--desktop';
    trigger.setAttribute('aria-label', uiCopy.openSearch);
    trigger.setAttribute('aria-controls', search.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = `
      <img class="site-search-trigger-icon" src="/icons/ui/search-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
    `;
    headerInner.insertBefore(trigger, nav);
  }

  return search;
};

const getDefaultTheme = () => 'dark';

const ensureFooterBlogLink = () => {
  const blogHref = localizedPagePath('/blog/');
  document.querySelectorAll('.footer-nav').forEach((footerNav) => {
    if (footerNav.querySelector(`a[href="${blogHref}"]`)) return;

    const link = document.createElement('a');
    link.href = blogHref;
    link.textContent = uiCopy.blog;
    footerNav.append(link);
  });
};

const initLanguageSwitcher = () => {
  const headerInner = document.querySelector('.header-inner');
  if (!headerInner || headerInner.querySelector('.language-switcher')) return;

  const getLocaleSwitchPath = locale => {
    const currentPath = window.location.pathname;
    const englishPath = currentPath.replace(/^\/(?:de|es|it|pl|uk|pt|fr|hi|fi)(?=\/|$)/, '') || '/';
    const localizedPath = locale === 'en'
      ? englishPath
      : englishPath === '/'
        ? `/${locale}/`
        : `/${locale}${englishPath}`;
    return `${localizedPath}${window.location.search}${window.location.hash}`;
  };
  const localeDisplay = {
    en: { code: 'EN', flag: 'united-kingdom', label: uiCopy.languageEnglish },
    de: { code: 'DE', flag: 'germany', label: uiCopy.languageGerman },
    es: { code: 'ES', flag: 'spain', label: uiCopy.languageSpanish },
    it: { code: 'IT', flag: 'italy', label: uiCopy.languageItalian },
    pl: { code: 'PL', flag: 'poland', label: uiCopy.languagePolish },
    uk: { code: 'UK', flag: 'ukraine', label: uiCopy.languageUkrainian },
    pt: { code: 'PT', flag: 'portugal', label: uiCopy.languagePortuguese },
    fr: { code: 'FR', flag: 'france', label: uiCopy.languageFrench },
    hi: { code: 'HI', flag: 'india', label: uiCopy.languageHindi },
    fi: { code: 'FI', flag: 'finland', label: uiCopy.languageFinnish },
  };
  const currentLocale = localeDisplay[SITE_LOCALE];

  const switcher = document.createElement('details');
  switcher.className = 'language-switcher';
  switcher.innerHTML = `
    <summary class="language-switcher-current" aria-label="${uiCopy.languageSwitcher}">
      <img src="/icons/${currentLocale.flag}-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <span class="language-switcher-code" aria-hidden="true">${currentLocale.code}</span>
    </summary>
    <div class="language-switcher-menu">
      <a class="language-switcher-option" href="${getLocaleSwitchPath('en')}" lang="en" aria-label="${uiCopy.languageEnglish}" title="${uiCopy.languageEnglish}"${SITE_LOCALE === 'en' ? ' aria-current="page"' : ''}>
        <img src="/icons/united-kingdom-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">EN</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('de')}" lang="de" aria-label="${uiCopy.languageGerman}" title="${uiCopy.languageGerman}"${SITE_LOCALE === 'de' ? ' aria-current="page"' : ''}>
        <img src="/icons/germany-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">DE</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('es')}" lang="es" aria-label="${uiCopy.languageSpanish}" title="${uiCopy.languageSpanish}"${SITE_LOCALE === 'es' ? ' aria-current="page"' : ''}>
        <img src="/icons/spain-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">ES</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('it')}" lang="it" aria-label="${uiCopy.languageItalian}" title="${uiCopy.languageItalian}"${SITE_LOCALE === 'it' ? ' aria-current="page"' : ''}>
        <img src="/icons/italy-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">IT</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('pl')}" lang="pl" aria-label="${uiCopy.languagePolish}" title="${uiCopy.languagePolish}"${SITE_LOCALE === 'pl' ? ' aria-current="page"' : ''}>
        <img src="/icons/poland-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">PL</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('uk')}" lang="uk" aria-label="${uiCopy.languageUkrainian}" title="${uiCopy.languageUkrainian}"${SITE_LOCALE === 'uk' ? ' aria-current="page"' : ''}>
        <img src="/icons/ukraine-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">UK</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('pt')}" lang="pt" aria-label="${uiCopy.languagePortuguese}" title="${uiCopy.languagePortuguese}"${SITE_LOCALE === 'pt' ? ' aria-current="page"' : ''}>
        <img src="/icons/portugal-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">PT</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('fr')}" lang="fr" aria-label="${uiCopy.languageFrench}" title="${uiCopy.languageFrench}"${SITE_LOCALE === 'fr' ? ' aria-current="page"' : ''}>
        <img src="/icons/france-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">FR</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('hi')}" lang="hi" aria-label="${uiCopy.languageHindi}" title="${uiCopy.languageHindi}"${SITE_LOCALE === 'hi' ? ' aria-current="page"' : ''}>
        <img src="/icons/india-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">HI</span>
      </a>
      <a class="language-switcher-option" href="${getLocaleSwitchPath('fi')}" lang="fi" aria-label="${uiCopy.languageFinnish}" title="${uiCopy.languageFinnish}"${SITE_LOCALE === 'fi' ? ' aria-current="page"' : ''}>
        <img src="/icons/finland-flag-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
        <span class="language-switcher-code" aria-hidden="true">FI</span>
      </a>
    </div>
  `;
  headerInner.append(switcher);

  // Keep the visual and keyboard order consistent: language first, account second.
  // Account auth is initialized before the language switcher, so move its control
  // behind the newly-created switcher once both controls exist.
  const accountControl = headerInner.querySelector('.account-auth-control');
  if (accountControl) headerInner.append(accountControl);

  switcher.addEventListener('click', event => {
    const option = event.target.closest('.language-switcher-option');
    if (option) {
      persistLanguage(option.getAttribute('lang'));
      switcher.removeAttribute('open');
    }
  });

  document.addEventListener('click', event => {
    if (!switcher.contains(event.target)) switcher.removeAttribute('open');
  });
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

  const defaultTheme = getDefaultTheme();
  root.dataset.theme = defaultTheme;
  root.style.colorScheme = defaultTheme;
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

const getActiveTheme = () => getStoredTheme() || getDefaultTheme();

applyTheme(getActiveTheme());

const renderPayments = (payments = []) => {
  const availablePayments = payments.filter(Boolean);
  if (!availablePayments.length) return '';

  return `
    <div class="payment-icons" data-payment-count="${availablePayments.length}">
      ${availablePayments
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

const getBrandDetailSlug = brand =>
  String(brand?.urlDetail || '')
    .replace(/^\/?brands\//i, '')
    .replace(/\.html$/i, '')
    .replace(/^\/+|\/+$/g, '');

const getBrandDetailPath = brand => normalizePagePath(brand?.urlDetail || '');

const findBrandByPageKey = brandKey => {
  const normalizedPageKey = normalizeBrandKey(brandKey || '');
  if (!normalizedPageKey) return null;

  return (
    BRANDS.find(brand => {
      const detailSlug = getBrandDetailPath(brand).split('/').filter(Boolean).pop();
      return normalizeBrandKey(detailSlug) === normalizedPageKey;
    }) ||
    BRANDS.find(brand => normalizeBrandKey(brand.name).includes(normalizedPageKey)) ||
    null
  );
};

const getBrandAlternatives = brand => {
  const countryCodes = new Set((brand?.countries || []).map(code => code.toUpperCase()));
  const usedKeys = new Set([getBrandDetailPath(brand), normalizeBrandKey(brand?.name)]);
  const alternatives = [];

  const addCandidate = candidate => {
    const detailPath = getBrandDetailPath(candidate);
    const nameKey = normalizeBrandKey(candidate?.name);
    if (!candidate || candidate.notRecommended || !candidate.hasDetailPage || !detailPath || !candidate.image) return;
    if (usedKeys.has(detailPath) || usedKeys.has(nameKey)) return;
    usedKeys.add(detailPath);
    usedKeys.add(nameKey);
    alternatives.push(candidate);
  };

  BRANDS.filter(candidate =>
    (candidate.countries || []).some(code => countryCodes.has(code.toUpperCase()))
  ).forEach(addCandidate);

  if (alternatives.length < 4) {
    BRANDS.forEach(addCandidate);
  }

  return alternatives.slice(0, 4);
};

const getDisabledBrandCopy = brand =>
  (brand?.temporarilyUnavailable ? UNAVAILABLE_BRAND_COPY : BLOCKED_BRAND_COPY)[SITE_LOCALE];

const getBlockedCtaMarkup = brand => `
  <span>${escapeHtml(brand?.temporarilyUnavailable ? getDisabledBrandCopy(brand).cta : uiCopy.visitCasino)}</span>
`;

const disableCasinoCta = (element, brand) => {
  if (!element || element.dataset.blockedCta === 'true') return;

  element.dataset.blockedCta = 'true';
  element.classList.add('cta-blocked');
  element.setAttribute('aria-disabled', 'true');
  element.setAttribute('role', 'button');
  element.setAttribute('tabindex', '-1');
  element.removeAttribute('href');
  element.removeAttribute('target');
  element.removeAttribute('rel');
  element.innerHTML = getBlockedCtaMarkup(brand);

  element.addEventListener('click', event => {
    event.preventDefault();
    event.stopPropagation();
  });
};

const createBlockedBrandIcon = (className, brand) => {
  const icon = document.createElement('img');
  icon.className = className;
  icon.src = brand?.temporarilyUnavailable ? UNAVAILABLE_BRAND_ICON : BLOCKED_BRAND_ICON;
  icon.alt = '';
  icon.loading = 'lazy';
  icon.decoding = 'async';
  icon.setAttribute('aria-hidden', 'true');
  return icon;
};

const insertBrandRiskInlineNotice = brand => {
  if (document.querySelector('body[data-brand] .brand-risk-inline')) return;

  const alternatives = getBrandAlternatives(brand);
  const copy = getDisabledBrandCopy(brand);
  const icon = brand?.temporarilyUnavailable ? UNAVAILABLE_BRAND_ICON : BLOCKED_BRAND_ICON;
  const notice = document.createElement('aside');
  notice.className = 'brand-risk-inline';
  notice.classList.toggle('is-temporarily-unavailable', Boolean(brand?.temporarilyUnavailable));
  notice.setAttribute('role', 'note');
  notice.innerHTML = `
    <div class="brand-risk-inline__notice">
      <img class="brand-risk-inline__icon" src="${icon}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
      <div class="brand-risk-inline__copy">
        <strong>${escapeHtml(copy.cta)}</strong>
        <p>${escapeHtml(copy.notice)}</p>
      </div>
    </div>
    ${
      alternatives.length
        ? `<div class="brand-risk-inline__alternatives">
            <h3>${escapeHtml(copy.alternatives)}</h3>
            <div class="brand-risk-inline-grid"></div>
          </div>`
        : ''
    }
  `;

  const grid = notice.querySelector('.brand-risk-inline-grid');
  alternatives.forEach(candidate => {
    grid?.appendChild(createCasinoCard(candidate));
  });

  const whySection =
    document.querySelector('body[data-brand] .brand-hero-why') ||
    Array.from(document.querySelectorAll('body[data-brand] section.features-section')).find(section => {
      const title = section.querySelector(':scope > .title, :scope > h2');
      return /why\s+players\s+choose/i.test(normalizeText(title?.textContent || ''));
    });

  if (whySection) {
    whySection.insertAdjacentElement('beforebegin', notice);
    return;
  }

  const main =
    document.querySelector('body[data-brand] .brand-sticky-main') ||
    document.querySelector('body[data-brand] main.content-review') ||
    document.querySelector('body[data-brand] .hero');
  main?.insertAdjacentElement('afterbegin', notice);
};

const applyNotRecommendedBrandPage = brand => {
  if (!brand?.notRecommended) return;

  document.body.classList.add('not-recommended-brand');
  document.body.classList.toggle('temporarily-unavailable-brand', Boolean(brand.temporarilyUnavailable));
  document.querySelectorAll('body[data-brand] .cta-brands').forEach(element => disableCasinoCta(element, brand));

  document.querySelectorAll('body[data-brand] .brand-sticky-title[href]').forEach(stickyTitle => {
    stickyTitle.removeAttribute('href');
    stickyTitle.removeAttribute('target');
    stickyTitle.removeAttribute('rel');
    stickyTitle.setAttribute('role', 'status');
    stickyTitle.setAttribute(
      'aria-label',
      brand.temporarilyUnavailable
        ? localeText(`${normalizeText(brand.name)} is currently unavailable`, `${normalizeText(brand.name)} ist derzeit nicht verfügbar`, `${normalizeText(brand.name)} no está disponible actualmente`)
        : localeText(`${normalizeText(brand.name)} is not recommended`, `${normalizeText(brand.name)} wird nicht empfohlen`, `${normalizeText(brand.name)} no está recomendado`)
    );
    stickyTitle.classList.add('is-not-recommended');
    stickyTitle.classList.toggle('is-temporarily-unavailable', Boolean(brand.temporarilyUnavailable));
  });

  document.querySelectorAll('body[data-brand] .brand-sticky-title__cta').forEach(cta => {
    cta.classList.add('cta-blocked');
    cta.innerHTML = getBlockedCtaMarkup(brand);
  });

  insertBrandRiskInlineNotice(brand);
};

const applyNotRecommendedCasinoRows = () => {
  const blockedByPath = new Map(
    BRANDS.filter(brand => brand.notRecommended && brand.urlDetail).map(brand => [
      getBrandDetailPath(brand),
      brand,
    ])
  );

  document.querySelectorAll('body.casinos-page .casino-list-row').forEach(row => {
    const detailLink = row.querySelector('.casino-name a[href], .casino-list-logo a[href]');
    const brand = blockedByPath.get(normalizePagePath(detailLink?.getAttribute('href') || ''));
    if (!brand) return;

    row.classList.add('is-not-recommended');
    row.classList.toggle('is-temporarily-unavailable', Boolean(brand.temporarilyUnavailable));
    row.dataset.notRecommended = 'true';
    if (brand.temporarilyUnavailable) row.dataset.temporarilyUnavailable = 'true';
    row.querySelectorAll('.casino-list-cta .cta').forEach(element => disableCasinoCta(element, brand));

    const name = row.querySelector('.casino-name');
    if (name && !name.querySelector('.casino-list-risk-icon')) {
      name.appendChild(createBlockedBrandIcon('casino-list-risk-icon', brand));
    }
  });
};

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
  if (isTopRated) return `<span class="casino-status-badge top-rated-badge">${uiCopy.topRated}</span>`;
  if (isExclusive) return `<span class="casino-status-badge exclusive-badge">${uiCopy.exclusive}</span>`;
  if (isNew) return `<span class="casino-status-badge new-badge">${uiCopy.new}</span>`;
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
      more.setAttribute('aria-label', localeText(
        `${hiddenCount} more payment methods`,
        `${hiddenCount} weitere Zahlungsmethoden`,
        `${hiddenCount} métodos de pago más`
      ));
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
    button.textContent = uiCopy.settings;

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
      <button type="button" class="theme-settings-close" aria-label="${localeText('Close settings', 'Einstellungen schließen', 'Cerrar ajustes')}"></button>
      <h3 id="themeSettingsTitle">${localeText('Theme', 'Darstellung', 'Tema')}</h3>
      <p>${localeText('Choose the theme you want to use on SpinCresta.', 'Wählen Sie die gewünschte Darstellung für SpinCresta.', 'Elige el tema que quieres usar en SpinCresta.')}</p>
      <div class="theme-settings-options" role="group" aria-label="${localeText('Theme options', 'Darstellungsoptionen', 'Opciones de tema')}">
        <button type="button" class="theme-settings-option" data-theme-choice="dark">
          <img src="/icons/ui/moon-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span>${localeText('Dark', 'Dunkel', 'Oscuro')}</span>
        </button>
        <button type="button" class="theme-settings-option" data-theme-choice="light">
          <img src="/icons/ui/day-sunny-icon.svg" alt="" aria-hidden="true" loading="lazy" decoding="async" />
          <span>${localeText('Light', 'Hell', 'Claro')}</span>
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

const syncFooterBrandDirectory = () => {
  const grids = Array.from(document.querySelectorAll('.footer-brand-grid'));
  if (!grids.length) return;

  const countryNames = new Map(COUNTRIES.map(country => [country.code.toUpperCase(), country.name]));
  const brandLinks = BRANDS.filter(brand => brand.hasDetailPage && brand.urlDetail)
    .map(brand => ({
      href: brandPagePath(brand),
      label: normalizeText(brand.name),
      countries: (brand.countries || []).filter(Boolean),
    }))
    .filter(item => item.href && item.label)
    .sort((a, b) => a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }));

  const uniqueLinks = Array.from(new Map(brandLinks.map(item => [item.href, item])).values());
  const repeatedNames = new Set(
    Array.from(
      uniqueLinks.reduce((counts, item) => counts.set(item.label, (counts.get(item.label) || 0) + 1), new Map())
    )
      .filter(([, count]) => count > 1)
      .map(([label]) => label)
  );

  uniqueLinks.forEach(item => {
    if (repeatedNames.has(item.label) && item.countries.length === 1) {
      const countryCode = item.countries[0].toUpperCase();
      const countryName = countryNames.get(countryCode) || item.countries[0];
      item.label = `${item.label} ${countryName}`;
    }
  });

  const columnCount = 5;
  const columnSize = Math.ceil(uniqueLinks.length / columnCount);

  grids.forEach(grid => {
    grid.replaceChildren(
      ...Array.from({ length: columnCount }, (_, columnIndex) => {
        const column = document.createElement('div');
        column.className = 'footer-brand-column';

        uniqueLinks.slice(columnIndex * columnSize, (columnIndex + 1) * columnSize).forEach(item => {
          const link = document.createElement('a');
          link.href = item.href;
          link.textContent = item.label;
          column.appendChild(link);
        });

        return column;
      })
    );
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
  notRecommended = false,
  temporarilyUnavailable = false,
  hasDetailPage = false,
}) => {
  const article = document.createElement('article');
  article.className = 'casino-card';

  const safeUrl = urlCasino || PLACEHOLDER_LINK;
  const safeName = normalizeText(name);
  const safeBonus = localizedBrandBonusText(bonus);
  const primaryCtaText = localeText('Play', 'Spielen', 'Jugar', 'Gioca', 'Zagraj', 'Грати', 'Jogar', 'Jouer', 'खेलें');
  const detailUrl = brandPagePath(urlDetail ?? '');
  const imageUrl = normalizeAssetPath(image ?? '');
  const isBlocked = Boolean(notRecommended);
  const isUnavailable = Boolean(temporarilyUnavailable);
  const showReviewAction = Boolean(hasDetailPage && detailUrl);
  const showPlayAction = safeUrl !== PLACEHOLDER_LINK || isBlocked;

  article.dataset.page = detailUrl;
  article.classList.toggle('is-not-recommended', isBlocked);
  article.classList.toggle('is-temporarily-unavailable', isUnavailable);
  if (isBlocked) article.dataset.notRecommended = 'true';
  if (isUnavailable) article.dataset.temporarilyUnavailable = 'true';
  setBrandBackground(article, bgColor);

  article.innerHTML = `
    <div class="card-img">
      <img src="${imageUrl}" alt="${safeName}" loading="lazy" decoding="async" class="casino-image"/>
    </div>
    <div class="casino-card-heading">
      <h3 class="casino-name">${safeName}</h3>
      ${
        isBlocked
          ? `<img class="casino-card-risk-icon" src="${
              isUnavailable ? UNAVAILABLE_BRAND_ICON : BLOCKED_BRAND_ICON
            }" alt="" aria-hidden="true" loading="lazy" decoding="async" />`
          : ''
      }
      ${createBadge({ isTopRated, isExclusive, isNew })}
    </div>
    ${safeBonus ? `<p class="casino-bonus">${safeBonus}</p>` : ''}
    ${renderPayments(payments)}
    <div class="casino-footer">
      <div class="casino-actions ${showReviewAction && showPlayAction ? 'has-two-actions' : 'has-single-action'}">
        ${
          showReviewAction
            ? `<a class="cta cta-secondary" href="${detailUrl}">${uiCopy.review}</a>`
            : ''
        }
        ${
          isBlocked
            ? `<button class="cta cta-primary cta-blocked" type="button" disabled aria-disabled="true">
                ${getBlockedCtaMarkup({ temporarilyUnavailable: isUnavailable })}
              </button>`
            : showPlayAction
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
      if (isBlocked) return;
      window.open(safeUrl, '_blank', 'noopener');
    }
  });

  article.querySelectorAll('.cta').forEach(link => {
    link.addEventListener('click', e => e.stopPropagation());
  });

  return article;
};

const ITEMS_PER_BATCH = 12;
const COUNTRY_GRID_ROWS_PER_BATCH = 5;
const COUNTRY_GRID_ROW_BATCH_MIN_WIDTH = 1024;

const getGridColumnCount = container => {
  if (typeof window === 'undefined' || !container) return 1;

  const template = window.getComputedStyle(container).gridTemplateColumns.trim();
  if (!template || template === 'none') return 1;

  const repeatMatch = template.match(/^repeat\(\s*(\d+)\s*,/i);
  if (repeatMatch) return Math.max(1, Number(repeatMatch[1]) || 1);

  let columns = 0;
  let token = '';
  let depth = 0;

  Array.from(template).forEach(char => {
    if (char === '(') depth += 1;
    if (char === ')') depth = Math.max(0, depth - 1);

    if (/\s/.test(char) && depth === 0) {
      if (token.trim()) columns += 1;
      token = '';
      return;
    }

    token += char;
  });

  if (token.trim()) columns += 1;

  return Math.max(1, columns);
};

const getBrandListBatchSize = container => {
  const isCountryHeroGrid = Boolean(
    document.body.dataset.country && container?.closest('.country-hero-cards')
  );

  if (
    !isCountryHeroGrid ||
    typeof window === 'undefined' ||
    typeof window.matchMedia !== 'function' ||
    !window.matchMedia(`(min-width: ${COUNTRY_GRID_ROW_BATCH_MIN_WIDTH}px)`).matches
  ) {
    return ITEMS_PER_BATCH;
  }

  return getGridColumnCount(container) * COUNTRY_GRID_ROWS_PER_BATCH;
};

const getLoadMoreControls = container => {
  const loadMoreWrapper =
    container.parentElement?.querySelector(':scope > .load-more-wrapper') ||
    container.closest('.country-brand-main, .container, .content')?.querySelector('.load-more-wrapper') ||
    document.getElementById('loadMoreBtn')?.closest('.load-more-wrapper') ||
    null;

  const loadMoreBtn = loadMoreWrapper?.querySelector('button') || document.getElementById('loadMoreBtn');

  return { loadMoreBtn, loadMoreWrapper };
};

const setLoadMoreVisible = (wrapper, button, isVisible) => {
  if (!wrapper) return;

  wrapper.hidden = !isVisible;
  wrapper.classList.toggle('is-visible', isVisible);
  wrapper.classList.toggle('is-hidden', !isVisible);
  wrapper.setAttribute('aria-hidden', isVisible ? 'false' : 'true');

  if (button) {
    button.disabled = !isVisible;
    button.tabIndex = isVisible ? 0 : -1;
  }
};

const renderBrandList = (brands, containerSelector, emptyText) => {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const { loadMoreBtn, loadMoreWrapper } = getLoadMoreControls(container);

  if (!brands.length) {
    container.innerHTML = `<p>${emptyText}</p>`;
    setLoadMoreVisible(loadMoreWrapper, loadMoreBtn, false);
    if (loadMoreBtn) loadMoreBtn.onclick = null;
    return;
  }

  let visibleCount = 0;

  container.innerHTML = '';
  setLoadMoreVisible(loadMoreWrapper, loadMoreBtn, false);

  const syncLoadMoreState = () => {
    setLoadMoreVisible(loadMoreWrapper, loadMoreBtn, visibleCount < brands.length);
  };

  const renderNextBatch = event => {
    event?.preventDefault();

    if (visibleCount >= brands.length) {
      syncLoadMoreState();
      return;
    }

    const batchSize = getBrandListBatchSize(container);
    const nextItems = brands.slice(visibleCount, visibleCount + batchSize);
    if (!nextItems.length) {
      syncLoadMoreState();
      return;
    }

    const fragment = document.createDocumentFragment();
    nextItems.forEach(brand => {
      fragment.appendChild(createCasinoCard(brand));
    });

    container.appendChild(fragment);
    requestPaymentIconSync();
    requestAnimationFrame(syncCountryStickyReviewsLayout);
    visibleCount += nextItems.length;
    syncLoadMoreState();
  };

  if (loadMoreBtn) {
    loadMoreBtn.onclick = renderNextBatch;
  }

  renderNextBatch();
};

const sortCountryBrands = brands =>
  brands
    .map((brand, index) => ({ brand, index }))
    .sort((a, b) => {
      const priorityA = Number.isFinite(a.brand.countryPagePriority)
        ? a.brand.countryPagePriority
        : Number.MAX_SAFE_INTEGER;
      const priorityB = Number.isFinite(b.brand.countryPagePriority)
        ? b.brand.countryPagePriority
        : Number.MAX_SAFE_INTEGER;

      return priorityA - priorityB || a.index - b.index;
    })
    .map(({ brand }) => brand);

const getCountryFilterDefinitions = () => [
  {
    id: 'all',
    label: uiCopy.all,
    matches: () => true,
  },
  {
    id: 'top-rated',
    label: uiCopy.topRated,
    matches: brand => Boolean(brand.isTopRated || brand.top?.length),
  },
  {
    id: 'new',
    label: uiCopy.new,
    matches: brand => Boolean(brand.isNew),
  },
  {
    id: 'crypto',
    label: uiCopy.crypto,
    matches: brand => (brand.payments || []).some(isCryptoPayment),
  },
  {
    id: 'fast-payout',
    label: uiCopy.fastPayout,
    matches: brand =>
      /fast|payout|withdraw/i.test(normalizeText(brand.bonus)) ||
      (brand.payments || []).some(isFastPayment),
  },
  {
    id: 'sportsbook',
    label: uiCopy.sportsbook,
    matches: brand =>
      /sport|sportsbook|betting|free bets/i.test(
        [brand.name, brand.bonus, brand.urlDetail].map(normalizeText).join(' ')
      ),
  },
  {
    id: 'sweepstakes',
    label: uiCopy.sweepstakes,
    matches: brand => /sweep|sweeps|social casino/i.test(normalizeText(brand.bonus)),
  },
];

const initCountryBrandFilters = (pageCountry, brands, onChange) => {
  const brandCards = document.getElementById('brand-cards');
  if (!brandCards || !pageCountry || !brands.length || document.querySelector('.country-filter-bar')) {
    return;
  }

  const filterDefinitions = getCountryFilterDefinitions()
    .map(filter => ({
      ...filter,
      count: filter.id === 'all' ? brands.length : brands.filter(filter.matches).length,
    }))
    .filter(filter => filter.id === 'all' || filter.count > 0);

  if (filterDefinitions.length <= 1) return;

  const filterBar = document.createElement('div');
  filterBar.className = 'country-filter-bar';
  filterBar.setAttribute('aria-label', uiCopy.filterBrands);
  filterBar.innerHTML = `
    <div class="country-filter-bar__controls">
      ${filterDefinitions
        .map(
          (filter, index) => `
            <button
              type="button"
              class="country-filter-chip filter-btn${index === 0 ? ' active is-active' : ''}"
              data-country-filter="${filter.id}"
              aria-pressed="${index === 0 ? 'true' : 'false'}"
            >
              ${filter.label}
            </button>
          `
        )
        .join('')}
    </div>
  `;

  brandCards.insertAdjacentElement('beforebegin', filterBar);

  const buttons = Array.from(filterBar.querySelectorAll('.country-filter-chip'));
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const filterId = button.dataset.countryFilter || 'all';
      const filter = filterDefinitions.find(item => item.id === filterId) || filterDefinitions[0];
      const filteredBrands = filter.id === 'all' ? brands : brands.filter(filter.matches);

      buttons.forEach(item => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.classList.toggle('active', isActive);
        item.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      onChange(filteredBrands, filter);
    });
  });
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
  const isCountryReviewsCarousel = carousel.classList.contains('country-new-reviews-carousel');
  const compactDesktopVisibleCount =
    Number(carousel.dataset.compactVisibleCount) || (isCountryReviewsCarousel ? 3 : desktopVisibleCount);
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
  const compactHeightMedia =
    typeof window.matchMedia === 'function'
      ? window.matchMedia('(max-height: 980px)')
      : { matches: window.innerHeight <= 980 };

  let items = [];
  let index = 0;
  let intervalId = null;
  let resetTimerId = null;
  let controls = null;

  const getVisibleCount = () => {
    if (!desktopMedia.matches) return mobileVisibleCount;

    if (isCountryReviewsCarousel && compactHeightMedia.matches) {
      return Math.min(desktopVisibleCount, compactDesktopVisibleCount);
    }

    return desktopVisibleCount;
  };

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

    const progressValue = `${((activeCycleIndex + 1) / originalCount) * 100}%`;
    carousel.style.setProperty('--carousel-progress', progressValue);
    controls?.style.setProperty('--carousel-progress', progressValue);
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
    const firstItem = items[index] || items[0];
    const lastVisibleItem = items[Math.min(index + visibleCount - 1, items.length - 1)];
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
    setViewportHeight();
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
      if (Number(track.dataset.activeVisibleCount) !== getVisibleCount()) {
        handleModeChange();
        return;
      }

      refreshItems();
      setViewportHeight();
      setPosition(index, false);
    });
  });

  if (typeof desktopMedia.addEventListener === 'function') {
    desktopMedia.addEventListener('change', handleModeChange);
    reducedMotionMedia.addEventListener('change', handleModeChange);
    compactHeightMedia.addEventListener('change', handleModeChange);
  } else if (typeof desktopMedia.addListener === 'function') {
    desktopMedia.addListener(handleModeChange);
    reducedMotionMedia.addListener(handleModeChange);
    compactHeightMedia.addListener(handleModeChange);
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

const ensureLegacyCountryGuideCarousel = () => {
  if (!document.body.matches('[data-country]') || document.querySelector('[data-carousel="gambling-guide"]')) {
    return;
  }

  const legacyArticle = Array.from(document.querySelectorAll('.content-article')).find(article => {
    const directHeadings = Array.from(article.children).filter(child => child.tagName === 'H2');
    return directHeadings.length >= 3 && !article.querySelector('.timeline, .faq-grid');
  });

  if (!legacyArticle) return;

  const cards = [];
  let currentCard = null;

  Array.from(legacyArticle.children).forEach(child => {
    if (child.tagName === 'H2') {
      currentCard = document.createElement('div');

      const heading = document.createElement('h3');
      heading.innerHTML = child.innerHTML;
      currentCard.appendChild(heading);
      cards.push(currentCard);
      return;
    }

    if (currentCard && child.tagName === 'P') currentCard.appendChild(child);
  });

  if (cards.length < 3) return;

  const countryCode = String(document.body.dataset.country || '').toLowerCase();
  const country = COUNTRIES.find(item => item.code === countryCode);
  const countryName = country ? localizedCountryName(country) : '';

  const title = document.createElement('h2');
  title.className = 'title';
  title.textContent = localeText(
    `${countryName} Gambling Guide`,
    `Glücksspielführer für ${countryName}`,
    `Guía de juego para ${countryName}`
  );

  const carousel = document.createElement('div');
  carousel.className = 'timeline country-guide-carousel';
  carousel.dataset.carousel = 'gambling-guide';
  carousel.tabIndex = 0;
  carousel.append(...cards);

  legacyArticle.replaceChildren(title, carousel);
};

const initCountryGuideCarousels = () => {
  ensureLegacyCountryGuideCarousel();

  document.querySelectorAll('[data-carousel="gambling-guide"]').forEach(carousel => {
    const cards = Array.from(carousel.children).filter(card => card.tagName === 'DIV');
    if (!cards.length) return;

    const title = carousel.closest('.content-article')?.querySelector(':scope > .title');
    const guideLabel = normalizeText(title?.textContent || 'Gambling Guide').trim();

    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', `${guideLabel} carousel`);

    let pointerId = null;
    let startX = 0;
    let startScrollLeft = 0;
    let dragged = false;
    let suppressClick = false;

    cards.forEach((card, index) => {
      if (card.querySelector(':scope > .guide-card-index')) return;

      const indexLabel = document.createElement('span');
      indexLabel.className = 'guide-card-index';
      indexLabel.textContent = String(index + 1).padStart(2, '0');
      indexLabel.setAttribute('aria-hidden', 'true');
      card.prepend(indexLabel);
    });

    const releasePointer = event => {
      if (pointerId !== event.pointerId) return;

      pointerId = null;
      carousel.classList.remove('is-dragging');

      if (carousel.hasPointerCapture?.(event.pointerId)) {
        carousel.releasePointerCapture(event.pointerId);
      }

      if (dragged) {
        suppressClick = true;
        window.setTimeout(() => {
          suppressClick = false;
        }, 0);
      }

      dragged = false;
    };

    carousel.addEventListener('pointerdown', event => {
      if (event.pointerType === 'mouse' && event.button !== 0) return;
      if (event.target.closest('a, button, input, select, textarea')) return;

      pointerId = event.pointerId;
      startX = event.clientX;
      startScrollLeft = carousel.scrollLeft;
      dragged = false;
      carousel.classList.add('is-dragging');
      carousel.setPointerCapture?.(pointerId);
    });

    carousel.addEventListener(
      'pointermove',
      event => {
        if (pointerId !== event.pointerId) return;

        const delta = event.clientX - startX;
        if (Math.abs(delta) < 6) return;

        dragged = true;
        carousel.scrollLeft = startScrollLeft - delta;
        event.preventDefault();
      },
      { passive: false }
    );

    carousel.addEventListener('pointerup', releasePointer);
    carousel.addEventListener('pointercancel', releasePointer);
    carousel.addEventListener('lostpointercapture', releasePointer);

    carousel.addEventListener(
      'click',
      event => {
        if (!suppressClick) return;

        event.preventDefault();
        event.stopPropagation();
        suppressClick = false;
      },
      true
    );

    carousel.addEventListener('keydown', event => {
      if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

      carousel.scrollBy({
        left: event.key === 'ArrowRight' ? carousel.clientWidth * 0.82 : -carousel.clientWidth * 0.82,
        behavior: 'smooth',
      });
      event.preventDefault();
    });
  });
};

const ensureCountryBrandStage = pageCountry => {
  const brandCards = document.getElementById('brand-cards');
  if (!brandCards) return;

  const existingStage = document.querySelector('.country-brand-stage');
  if (existingStage) return;

  const container = brandCards.closest('.container');
  if (!container) return;

  const sectionHead = container.querySelector('.section-head');
  const intro = container.querySelector('.intro');
  const loadMoreWrapper = container.querySelector('.load-more-wrapper');
  const reviewDirectory = container.querySelector('.country-review-directory');

  const stage = document.createElement('div');
  stage.className = 'country-brand-stage';
  stage.innerHTML = `
    <div class="country-brand-main"></div>
  `;

  const main = stage.querySelector('.country-brand-main');
  const insertionPoint = sectionHead || intro || brandCards;
  container.insertBefore(stage, insertionPoint ?? null);

  [sectionHead, intro, brandCards, loadMoreWrapper, reviewDirectory].forEach(node => {
    if (node) {
      main.appendChild(node);
    }
  });
};

const applyCountryHeroConcept = () => {
  const hero = document.querySelector('body[data-country] .hero');
  let heroContent = hero?.querySelector(':scope > .hero-content');
  if (!heroContent) {
    const legacyHeroCopy = hero?.querySelector(':scope > .container > .hero-copy');
    if (legacyHeroCopy) {
      const legacyContainer = legacyHeroCopy.parentElement;
      legacyHeroCopy.classList.remove('hero-copy');
      legacyHeroCopy.classList.add('hero-content');
      hero.classList.remove('content-hero');
      hero.classList.add('container');
      hero.appendChild(legacyHeroCopy);
      legacyContainer?.remove();
      heroContent = legacyHeroCopy;
    }
  }
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
      const detailUrl = brandPagePath(brand);
      const imageUrl = normalizeAssetPath(brand.image);
      const bonus = localizedBrandBonusText(brand.bonus || 'Fresh review with updated bonus and payment details.');
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

  const enhanceCountryFaqCard = (card, faqGrid, index) => {
    if (card.querySelector(':scope > .faq-accordion-trigger')) return;

    const question = card.querySelector(':scope > h3');
    const answers = Array.from(card.querySelectorAll(':scope > p'));
    if (!question || !answers.length) return;

    addQuestionIcon(question);
    answers.forEach(addAnswerIcon);
    faqGrid.classList.add('faq-accordion-surface');

    const trigger = document.createElement('button');
    trigger.className = 'faq-question faq-accordion-trigger';
    trigger.type = 'button';
    trigger.setAttribute('aria-expanded', 'false');

    const questionIcon = question.querySelector(':scope > .faq-question-icon');
    const questionLabel = document.createElement('span');
    questionLabel.className = 'faq-question-label';

    Array.from(question.childNodes).forEach(node => {
      if (node !== questionIcon) questionLabel.append(node);
    });

    if (questionIcon) trigger.append(questionIcon);
    trigger.append(questionLabel);

    const toggle = document.createElement('span');
    toggle.className = 'faq-accordion-toggle';
    toggle.setAttribute('aria-hidden', 'true');
    trigger.append(toggle);

    const answerPanel = document.createElement('div');
    answerPanel.className = 'faq-answer-panel';
    answerPanel.id = `country-faq-answer-${index + 1}`;
    answerPanel.hidden = true;
    trigger.setAttribute('aria-controls', answerPanel.id);
    answers.forEach(answer => answerPanel.append(answer));

    question.replaceWith(trigger);
    card.classList.add('faq-card--accordion');
    card.append(answerPanel);

    const closeOpenCards = () => {
      faqGrid.querySelectorAll('.faq-accordion-trigger[aria-expanded="true"]').forEach(openTrigger => {
        openTrigger.setAttribute('aria-expanded', 'false');
        openTrigger.closest('.faq-card')?.classList.remove('is-open');

        const openPanel = document.getElementById(openTrigger.getAttribute('aria-controls'));
        if (openPanel) openPanel.hidden = true;
      });
    };

    trigger.addEventListener('click', () => {
      const isOpening = trigger.getAttribute('aria-expanded') !== 'true';
      if (isOpening) closeOpenCards();

      trigger.setAttribute('aria-expanded', String(isOpening));
      card.classList.toggle('is-open', isOpening);
      answerPanel.hidden = !isOpening;
    });
  };

  const enhanceBrandFaqTimeline = timeline => {
    if (timeline.dataset.faqAccordionBound === 'true') return;

    timeline.dataset.faqAccordionBound = 'true';
    timeline.classList.add('faq-accordion-surface');

    const groups = [];
    let currentGroup = null;

    Array.from(timeline.children).forEach(child => {
      if (child.matches('h3')) {
        currentGroup = { question: child, answers: [] };
        groups.push(currentGroup);
        return;
      }

      if (currentGroup && child.matches('p')) currentGroup.answers.push(child);
    });

    groups.forEach((group, index) => {
      if (!group.answers.length) return;

      const { question, answers } = group;
      addQuestionIcon(question);
      answers.forEach(addAnswerIcon);

      const card = document.createElement('div');
      card.className = 'faq-card faq-card--accordion';

      const trigger = document.createElement('button');
      trigger.className = 'faq-question faq-accordion-trigger';
      trigger.type = 'button';
      trigger.setAttribute('aria-expanded', 'false');

      const questionIcon = question.querySelector(':scope > .faq-question-icon');
      const questionLabel = document.createElement('span');
      questionLabel.className = 'faq-question-label';

      Array.from(question.childNodes).forEach(node => {
        if (node !== questionIcon) questionLabel.append(node);
      });

      if (questionIcon) trigger.append(questionIcon);
      trigger.append(questionLabel);

      const toggle = document.createElement('span');
      toggle.className = 'faq-accordion-toggle';
      toggle.setAttribute('aria-hidden', 'true');
      trigger.append(toggle);

      const answerPanel = document.createElement('div');
      answerPanel.className = 'faq-answer-panel';
      answerPanel.id = `brand-faq-answer-${index + 1}`;
      answerPanel.hidden = true;
      trigger.setAttribute('aria-controls', answerPanel.id);

      question.replaceWith(card);
      card.append(trigger, answerPanel);
      answers.forEach(answer => answerPanel.append(answer));

      const closeOpenCards = () => {
        timeline.querySelectorAll('.faq-accordion-trigger[aria-expanded="true"]').forEach(openTrigger => {
          openTrigger.setAttribute('aria-expanded', 'false');
          openTrigger.closest('.faq-card')?.classList.remove('is-open');

          const openPanel = document.getElementById(openTrigger.getAttribute('aria-controls'));
          if (openPanel) openPanel.hidden = true;
        });
      };

      trigger.addEventListener('click', () => {
        const isOpening = trigger.getAttribute('aria-expanded') !== 'true';
        if (isOpening) closeOpenCards();

        trigger.setAttribute('aria-expanded', String(isOpening));
        card.classList.toggle('is-open', isOpening);
        answerPanel.hidden = !isOpening;
      });
    });
  };

  document.querySelectorAll('section.container, .content-article').forEach(section => {
    const title = section.querySelector('h2.title');
    const timeline = section.querySelector('.timeline');
    const faqGrid = section.querySelector('.faq-grid');
    if (!title || (!timeline && !faqGrid)) return;

    const titleText = normalizeText(title.textContent).trim().toLowerCase();
    const isFaqTitle =
      titleText.includes('faq') ||
      titleText.includes('häufige fragen') ||
      titleText.includes('pregunta') ||
      titleText.includes('pergunt') ||
      titleText.includes('question') ||
      titleText.includes('domand') ||
      titleText.includes('pytan') ||
      titleText.includes('питан') ||
      titleText.includes('ukk') ||
      titleText.includes('kysym') ||
      titleText.includes('पूछे जाने वाले प्रश्न') ||
      titleText.includes('प्रश्नोत्तर');
    if (!isFaqTitle) return;

    if (document.body.matches('[data-brand]') && timeline) {
      enhanceBrandFaqTimeline(timeline);
      return;
    }

    timeline?.querySelectorAll(':scope > h3').forEach(addQuestionIcon);
    timeline?.querySelectorAll(':scope > p').forEach(addAnswerIcon);

    faqGrid?.querySelectorAll('.faq-card').forEach((card, index) => {
      const question = card.querySelector(':scope > h3');
      const answers = card.querySelectorAll(':scope > p');

      if (document.body.matches('[data-country]')) {
        enhanceCountryFaqCard(card, faqGrid, index);
        return;
      }

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
  scrollNav.setAttribute('aria-label', localeText('Casino brand letter navigation', 'Buchstabennavigation der Casino-Marken', 'Navegación alfabética de marcas de casino'));

  const alphaClone = alphaNav.cloneNode(true);
  alphaClone.classList.add('alpha-nav--floating');

  const inner = document.createElement('div');
  inner.className = 'casino-scroll-nav__inner';
  inner.appendChild(alphaClone);

  scrollNav.appendChild(inner);
  document.body.appendChild(scrollNav);

  return scrollNav;
};

const applyBrandLogoBackgrounds = () => {
  const byDetailPath = new Map();
  const byName = new Map();

  BRANDS.forEach(brand => {
    const color = normalizeBrandColor(brand.bgColor);
    if (!color) return;

    const detailPath = normalizePagePath(brand.urlDetail || '');
    if (detailPath) byDetailPath.set(detailPath, brand);
    const localizedDetailPath = brandPagePath(brand);
    if (localizedDetailPath) byDetailPath.set(localizedDetailPath, brand);

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
    const brand =
      findBrandByPageKey(document.body.dataset.brand) ||
      byName.get(normalizeBrandKey(brandName.replace(/\s+Review$/i, '')));
    setBrandBackground(brandLogoContainer, brand?.bgColor);
  }
};

const initAffiliateClickTracking = () => {
  if (document.documentElement.dataset.affiliateTrackingBound === 'true') return;

  document.documentElement.dataset.affiliateTrackingBound = 'true';
  document.addEventListener('click', event => {
    const target = event.target instanceof Element ? event.target : null;
    const link = target?.closest('a[rel~="sponsored"]');
    if (!link || typeof window.gtag !== 'function') return;

    let destination;
    try {
      const url = new URL(link.href, window.location.href);
      destination = `${url.origin}${url.pathname}`;
    } catch {
      destination = link.getAttribute('href') || '';
    }

    window.gtag('event', 'affiliate_click', {
      link_url: destination,
      link_text: normalizeText(link.textContent).trim().slice(0, 100),
      page_language: SITE_LOCALE,
      brand_slug:
        document.body.dataset.brand ||
        document.querySelector('meta[name="brand-slug"]')?.content ||
        '',
      transport_type: 'beacon',
    });
  });
};

// =====================
// INIT FUNCTION
// =====================
export const initCasinoPage = async () => {
  const pageType = document.body.dataset.page;
  const pageCountry = document.body.dataset.country?.toUpperCase();
  const isBrandPage = Boolean(document.body.dataset.brand);
  const siteCountryCountEl = document.getElementById('siteCountryCount');
  const siteBrandCountEl = document.getElementById('siteBrandCount');

  const pageModulesReady = loadPageModules();

  if (isBrandPage) {
    await brandLayoutModuleReady;
    initBrandLayoutModule?.({
      BRAND_NEW_GAMES: {},
      normalizeText,
      normalizeBrandKey,
      escapeHtml,
      localeText,
    });
    if (document.body.classList.contains('has-brand-sticky-layout') && brandLayoutFallbackTimer) {
      window.clearTimeout(brandLayoutFallbackTimer);
    }
  }

  await Promise.all([pageModulesReady, brandBonusTranslationsReady]);

  if (pageType !== 'moderator') initFooterNewsletter(SITE_LOCALE);
  initAccountAuth(SITE_LOCALE);
  initAccountPageModule?.();
  initFooterThemeSettings();
  initAffiliateClickTracking();
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

  initHomePageModule?.({
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
  });
  initHomeNewBrandsCarousel();
  applyBrandLogoBackgrounds();
  applyNotRecommendedCasinoRows();
  initBrandLayoutModule?.({
    BRAND_NEW_GAMES,
    normalizeText,
    normalizeBrandKey,
    escapeHtml,
    localeText,
  });

  if (pageCountry) {
    ensureCountryBrandStage(pageCountry);
    initCountryGuideCarousels();
    applyCountryHeroConcept();
    const brands = sortCountryBrands(
      BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry))
    );

    initCountryBrandFilters(pageCountry, brands, filteredBrands => {
      renderBrandList(filteredBrands, '#brand-cards', uiCopy.noFilterMatches);
      applyBrandLogoBackgrounds();
      requestPaymentIconSync();
    });
    renderBrandList(brands, '#brand-cards', uiCopy.noCountryCasinos);
    applyBrandLogoBackgrounds();
    renderCountryMediaModule?.({
      pageCountry,
      BRANDS,
      COUNTRIES,
      BRAND_HOMEPAGE_SCREENSHOTS,
      BRAND_NEW_GAMES,
      normalizeText,
      localizedCountryName,
      getBrandDetailSlug,
      brandPagePath,
      localeText,
      escapeHtml,
    });
  }

  if (pageType === 'exclusive-offers') {
    renderBrandList(
      BRANDS.filter(b => b.isExclusive),
      '#exclusive-cards',
      localeText('No exclusive offers available at the moment.', 'Derzeit sind keine exklusiven Angebote verfügbar.', 'No hay ofertas exclusivas disponibles en este momento.')
    );
  }

  if (pageType === 'new-casinos') {
    renderBrandList(
      BRANDS.filter(b => b.isNew),
      '#brand-cards',
      localeText('No new casinos available at the moment.', 'Derzeit sind keine neuen Casinos verfügbar.', 'No hay casinos nuevos disponibles en este momento.')
    );
  }

  if (pageType === 'top-rated') {
    renderBrandList(
      BRANDS.filter(b => b.isTopRated),
      '#top-rated-cards',
      localeText('No top rated casinos available at the moment.', 'Derzeit sind keine top-bewerteten Casinos verfügbar.', 'No hay casinos mejor valorados disponibles en este momento.')
    );
  }

  enhanceFaqBlocks();
  initTopCasinosPageModule?.({
    COUNTRIES,
    BRANDS,
    SITE_LOCALE,
    localeText,
    escapeHtml,
    localizedCountryName,
    localizedCountryTitle,
    countryPagePath,
    iconPath,
    createCasinoCard,
    requestPaymentIconSync,
  });

  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (brandKey) {
    initBrandPageModule?.({
      brandKey,
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
    });
    const brand = findBrandByPageKey(brandKey);
    initBrandFeedbackModule?.({
      brand: brand ? getBrandDetailSlug(brand) : brandKey,
      brandName: brand?.name || brandKey,
      brandImage: brand ? normalizeAssetPath(brand.image) : '',
      locale: SITE_LOCALE,
    });

    if (brand) {
      const countriesEl = document.getElementById('brand-countries');
      const paymentsEl = document.getElementById('brand-payments');

      if (countriesEl && brand.countries?.length) {
        countriesEl.innerHTML = brand.countries
          .map(code => {
            const c = COUNTRIES.find(x => x.code.toLowerCase() === code.toLowerCase());
            if (!c) {
              const market = BRAND_ONLY_COUNTRIES[code.toUpperCase()];
              if (!market) return '';
              const marketName = market.name[SITE_LOCALE] || market.name.en;
              const marketLabel = localeText(
                `${marketName} market availability`,
                `${marketName} Marktverfügbarkeit`,
                `Disponibilidad en el mercado de ${marketName}`
              );
              return `
                <span class="flag-container brand-country-market" aria-label="${normalizeText(marketLabel)}">
                  <img class="hero-flag" src="${iconPath(market.slug)}" alt="${normalizeText(marketName)}" loading="lazy" decoding="async"/>
                  <span>${normalizeText(marketName)}</span>
                </span>
              `;
            }
            const countryName = localizedCountryName(c);
            const countryGuideLabel = localeText(
              `${countryName} casino guide`,
              `${countryName} Casino-Guide`,
              `Guía de casinos de ${countryName}`
            );
            return `
              <a class="flag-container" href="${countryPagePath(c.slug)}" aria-label="${normalizeText(countryGuideLabel)}">
                <img class="hero-flag" src="${iconPath(c.slug)}" alt="${normalizeText(countryName)}" loading="lazy" decoding="async"/>
                <span>${normalizeText(countryName)}</span>
              </a>
            `;
          })
          .join('');
      }

      const availablePayments = (brand.payments || []).filter(Boolean);

      if (paymentsEl && availablePayments.length) {
        paymentsEl.innerHTML = availablePayments
          .map(
            p =>
              `<div class="payments">
                <img src="${paymentPath(p)}" alt="${normalizeText(p)}" loading="lazy" decoding="async"/>
              </div>`
          )
          .join('');
      }

      applyNotRecommendedBrandPage(brand);
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
          <img class="flag" data-country-flag-src="${iconPath(c.slug)}" alt="${normalizeText(localizedCountryName(c))}" loading="lazy" decoding="async"/>
          ${normalizeText(localizedCountryName(c))}
        </a>
      `
    ).join('');

    const syncCountriesDropdownFlow = () => {
      const columnGap = Number.parseFloat(getComputedStyle(countriesDropdown).columnGap) || 0;
      const minimumColumnWidth = 136;
      const columnCount = Math.max(
        1,
        Math.floor(
          (countriesDropdown.clientWidth + columnGap) / (minimumColumnWidth + columnGap)
        )
      );
      const rowCount = Math.ceil(COUNTRIES.length / Math.max(columnCount, 1));

      countriesDropdown.style.setProperty('--countries-dropdown-rows', rowCount);
    };

    requestAnimationFrame(syncCountriesDropdownFlow);
    window.addEventListener('resize', syncCountriesDropdownFlow, { passive: true });
  }

  const navDropdown = document.querySelector('.nav-dropdown');
  const navDropdownLink = navDropdown?.querySelector('.nav-dropdown-link');
  const navDropdownMenu = navDropdown?.querySelector('.nav-dropdown-menu');
  const desktopNavHeader = document.querySelector('.header');
  const desktopNavHeaderInner = document.querySelector('.header-inner');

  navDropdownLink?.querySelector('.nav-dropdown-icon')?.remove();

  initDesktopSiteSearch();
  if (pageType !== 'moderator') initLanguageSwitcher();
  ensureFooterBlogLink();
  const desktopSearch = desktopNavHeaderInner?.querySelector('.site-search--desktop');
  const desktopSearchTrigger = desktopNavHeaderInner?.querySelector('.site-search-trigger--desktop');
  const desktopSearchInput = desktopSearch?.querySelector('.site-search-input');
  syncFooterBrandDirectory();

  let closeDesktopCountries = () => {};
  let closeDesktopSearch = () => {};

  if (
    desktopSearch &&
    desktopSearchTrigger &&
    desktopSearchInput &&
    desktopNavHeader &&
    desktopNavHeaderInner &&
    typeof window.matchMedia === 'function'
  ) {
    const desktopSearchMedia = window.matchMedia('(min-width: 1025px)');
    let searchHeightTimerId = null;
    let searchFocusTimerId = null;

    const syncSearchHeaderHeight = () => {
      window.clearTimeout(searchHeightTimerId);
      window.requestAnimationFrame(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      });
      searchHeightTimerId = window.setTimeout(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      }, 320);
    };

    const syncSearchState = isOpen => {
      const nextOpen = Boolean(isOpen && desktopSearchMedia.matches);
      window.clearTimeout(searchFocusTimerId);
      if (nextOpen) closeDesktopCountries();
      desktopNavHeader.classList.toggle('search-expanded', nextOpen);
      desktopNavHeaderInner.classList.toggle('search-expanded', nextOpen);
      desktopSearchTrigger.classList.toggle('is-active', nextOpen);
      desktopSearchTrigger.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      desktopSearchTrigger.setAttribute(
        'aria-label',
        nextOpen ? uiCopy.closeSearch : uiCopy.openSearch
      );
      desktopSearch.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');

      if (nextOpen) {
        searchFocusTimerId = window.setTimeout(() => {
          desktopSearchInput.focus({ preventScroll: true });
        }, 220);
      } else {
        desktopSearchInput.blur();
      }

      syncSearchHeaderHeight();
    };

    closeDesktopSearch = () => syncSearchState(false);
    syncSearchState(false);

    desktopSearchTrigger.addEventListener('click', () => {
      syncSearchState(!desktopNavHeader.classList.contains('search-expanded'));
    });

    desktopSearch.addEventListener('transitionend', syncSearchHeaderHeight);

    document.addEventListener('click', event => {
      if (!desktopNavHeader.classList.contains('search-expanded')) return;
      if (event.target instanceof Node && desktopNavHeader.contains(event.target)) return;
      closeDesktopSearch();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDesktopSearch();
    });

    window.addEventListener('scroll', () => {
      if (desktopNavHeader.classList.contains('search-expanded')) closeDesktopSearch();
    }, { passive: true });

    window.addEventListener('resize', syncSearchHeaderHeight);

    if (typeof desktopSearchMedia.addEventListener === 'function') {
      desktopSearchMedia.addEventListener('change', () => {
        syncSearchState(false);
      });
    } else if (typeof desktopSearchMedia.addListener === 'function') {
      desktopSearchMedia.addListener(() => {
        syncSearchState(false);
      });
    }
  }

  if (
    navDropdown &&
    navDropdownLink &&
    navDropdownMenu &&
    desktopNavHeader &&
    desktopNavHeaderInner &&
    typeof window.matchMedia === 'function'
  ) {
    const desktopDropdownMedia = window.matchMedia('(min-width: 1025px)');
    let headerHeightTimerId = null;
    let expandedSettleTimerId = null;

    navDropdownLink.removeAttribute('href');
    navDropdownLink.setAttribute('role', 'button');
    navDropdownLink.setAttribute('tabindex', '0');
    navDropdownLink.setAttribute('aria-controls', navDropdownMenu.id || 'countriesDropdown');
    navDropdownMenu.classList.add('nav-dropdown-menu--expanded-header');

    if (navDropdownMenu.parentElement !== desktopNavHeaderInner) {
      desktopNavHeaderInner.append(navDropdownMenu);
    }

    const syncExpandedHeaderHeight = () => {
      window.clearTimeout(headerHeightTimerId);
      window.requestAnimationFrame(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      });
      headerHeightTimerId = window.setTimeout(() => {
        syncHeaderFlowMetrics(desktopNavHeader);
      }, 320);
    };

    const syncDropdownState = isOpen => {
      const nextOpen = Boolean(isOpen && desktopDropdownMedia.matches);
      window.clearTimeout(expandedSettleTimerId);
      if (nextOpen) closeDesktopSearch();
      navDropdown.classList.toggle('is-open', nextOpen);
      desktopNavHeader.classList.toggle('countries-expanded', nextOpen);
      desktopNavHeader.classList.remove('countries-expanded-settled');
      desktopNavHeaderInner.classList.toggle('countries-expanded', nextOpen);
      navDropdownLink.setAttribute('aria-expanded', nextOpen ? 'true' : 'false');
      navDropdownMenu.setAttribute('aria-hidden', nextOpen ? 'false' : 'true');
      if (nextOpen) {
        loadDeferredCountryFlags(navDropdownMenu);
        expandedSettleTimerId = window.setTimeout(() => {
          desktopNavHeader.classList.add('countries-expanded-settled');
        }, 380);
      }
      syncExpandedHeaderHeight();
    };

    const toggleDropdown = () => {
      syncDropdownState(!desktopNavHeader.classList.contains('countries-expanded'));
    };

    const closeDropdown = () => {
      syncDropdownState(false);
    };

    closeDesktopCountries = closeDropdown;
    syncDropdownState(false);

    navDropdownLink.addEventListener('click', event => {
      event.preventDefault();
      if (!desktopDropdownMedia.matches) return;
      toggleDropdown();
    });

    navDropdownLink.addEventListener('keydown', event => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (!desktopDropdownMedia.matches) return;
      toggleDropdown();
    });

    document.addEventListener('click', event => {
      if (!desktopNavHeader.classList.contains('countries-expanded')) return;
      if (event.target instanceof Node && desktopNavHeader.contains(event.target)) return;
      closeDropdown();
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDropdown();
    });

    navDropdownMenu.addEventListener('click', event => {
      if (event.target instanceof Element && event.target.closest('a')) closeDropdown();
    });

    navDropdownMenu.addEventListener('transitionend', syncExpandedHeaderHeight);

    window.addEventListener('scroll', () => {
      if (desktopNavHeader.classList.contains('countries-expanded')) closeDropdown();
    }, { passive: true });

    window.addEventListener('resize', syncExpandedHeaderHeight);

    window.addEventListener('load', syncExpandedHeaderHeight, { once: true });

    if (document.fonts?.ready) {
      document.fonts.ready.then(syncExpandedHeaderHeight).catch(() => {});
    }

    if (typeof desktopDropdownMedia.addEventListener === 'function') {
      desktopDropdownMedia.addEventListener('change', () => {
        syncDropdownState(false);
      });
    } else if (typeof desktopDropdownMedia.addListener === 'function') {
      desktopDropdownMedia.addListener(() => {
        syncDropdownState(false);
      });
    }
  }

  const countriesCloud = document.querySelector('.all-countries .countries-cloud');
  countriesCloud?.replaceChildren(
    ...COUNTRIES.map(c => {
      const a = document.createElement('a');
      a.href = countryPagePath(c.slug);
      a.className = 'country-link';
      a.innerHTML = `
        <img class="flag" data-country-flag-src="${iconPath(c.slug)}" alt="${normalizeText(localizedCountryName(c))}" loading="lazy" decoding="async">
        <span>${normalizeText(localizedCountryName(c))}</span>
      `;
      return a;
    })
  );
  observeDeferredCountryFlags(countriesCloud);

  const burger = document.querySelector('.burger');
  const mobileMenu = document.getElementById('mobileMenu');
  const overlay = mobileMenu?.querySelector('.mobile-overlay');
  const closeButtons = mobileMenu?.querySelectorAll('[data-action="close"]');
  const body = document.body;

  if (burger && mobileMenu) {
    const mobileMenuInner = mobileMenu.querySelector('.mobile-menu-inner');
    if (!mobileMenuInner) return;

    mobileMenuInner.innerHTML = `
    <button class="submenu-toggle" aria-expanded="false">${uiCopy.countries}</button>
    <a href="${pagePath('top-casinos.html')}">${uiCopy.topCasinos}</a>
    <a href="${pagePath('new-casinos.html')}">${uiCopy.newCasinos}</a>
    <a href="${pagePath('top-rated.html')}">${uiCopy.topRated}</a>
    <a href="${pagePath('exclusive-offers.html')}">${uiCopy.exclusive}</a>
    <button type="button" class="mobile-theme-settings" data-theme-settings-trigger aria-haspopup="dialog">${uiCopy.settings}</button>
  `;

    const submenuToggle = mobileMenuInner.querySelector('.submenu-toggle');
    if (!submenuToggle) return;

    if (!mobileMenuInner.querySelector('.site-search')) {
      mobileMenuInner.prepend(createSiteSearch('mobile'));
    }

    const countriesSubmenu = document.createElement('div');
    countriesSubmenu.className = 'mobile-submenu';
    countriesSubmenu.innerHTML = COUNTRIES.map(
      c => `
    <a href="${countryPagePath(c.slug)}">
      <img class="flag" data-country-flag-src="${iconPath(c.slug)}" alt="${normalizeText(localizedCountryName(c))}" loading="lazy" decoding="async"/>
      ${normalizeText(localizedCountryName(c))}
    </a>
  `
    ).join('');

    mobileMenuInner.insertBefore(countriesSubmenu, submenuToggle.nextSibling);

    submenuToggle.addEventListener('click', () => {
      const expanded = submenuToggle.getAttribute('aria-expanded') !== 'true';
      if (expanded) loadDeferredCountryFlags(countriesSubmenu);
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

  const dismissGlobalLoader = () => {
    const loader = document.getElementById('globalLoader');
    if (!loader) return;
    loader.classList.add('hidden');
    setTimeout(() => loader.remove(), 300);
  };

  if (document.readyState === 'complete') {
    dismissGlobalLoader();
  } else {
    window.addEventListener('load', dismissGlobalLoader, { once: true });
  }

  const header = document.querySelector('.header');
  const casinosScrollNav = initCasinosScrollNav();
  const syncHeaderHeight = () => {
    syncHeaderFlowMetrics(header);
  };

  syncHeaderHeight();

  if (header) {
    let lastScroll = window.pageYOffset || document.documentElement.scrollTop || 0;

    if ('ResizeObserver' in window) {
      new ResizeObserver(syncHeaderHeight).observe(header);
    }

    const updateScrollChrome = () => {
      const current = window.pageYOffset || document.documentElement.scrollTop;
      const isScrollingDown = current > lastScroll;
      const isDesktop = window.matchMedia('(min-width: 1025px)').matches;
      const shouldHide = !isDesktop && isScrollingDown && current > 100;
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
  requestPaymentIconSync();
};

document.addEventListener('DOMContentLoaded', () => {
  initCasinoPage();
});

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
