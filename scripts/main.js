// =====================
// IMPORTS
// =====================
import { BRANDS } from './brands.js?v=20260813-french-1';
import { BRAND_SNAPSHOT_CONFIGS } from './brand-snapshot-configs.js?v=20260813-french-1';
import { BRAND_NEW_GAMES } from './brand-new-games.js?v=20260813-french-1';
import { BRAND_HOMEPAGE_SCREENSHOTS } from './brand-homepage-screenshots.js?v=20260813-french-1';
import { BRAND_BONUS_TRANSLATIONS } from './brand-bonus-translations.js?v=20260813-qa-1';
import { COUNTRIES } from './countries.js';

// =====================
// HELPERS
// =====================
const PLACEHOLDER_LINK = '#';
const MOJIBAKE_FIXES = [];
const THEME_STORAGE_KEY = 'spincresta-theme';
const THEME_OPTIONS = ['dark', 'light'];
const LANGUAGE_STORAGE_KEY = 'spincresta-language';
const LANGUAGE_OPTIONS = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi'];
const BLOCKED_BRAND_ICON = '/icons/ui/stop-blocked-icon.svg';
const UNAVAILABLE_BRAND_ICON = '/icons/ui/remove-close-round-grey-icon.svg';
const BRAND_ONLY_COUNTRIES = {
  CY: { slug: 'cyprus', name: { en: 'Cyprus', de: 'Zypern', es: 'Chipre', it: 'Cipro', pl: 'Cypr', uk: 'Кіпр', pt: 'Chipre', fr: 'Chypre', hi: 'साइप्रस' } },
  RS: { slug: 'serbia', name: { en: 'Serbia', de: 'Serbien', es: 'Serbia', it: 'Serbia', pl: 'Serbia', uk: 'Сербія', pt: 'Sérvia', fr: 'Serbie', hi: 'सर्बिया' } },
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
      : 'en';
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
};
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

const polishBrandBonusText = value => {
  if (SITE_LOCALE !== 'pl') return normalizeText(value);

  const normalized = normalizeText(value);
  const exactTranslations = {
    'Bet on your favorite sports, enjoy great odds, and spin to win in exciting casino games!': 'Obstawiaj ulubione dyscypliny, korzystaj z atrakcyjnych kursów i graj w emocjonujące gry kasynowe.',
    'Casino, betting, quest and tournament bonuses vary by country': 'Bonusy kasynowe, bukmacherskie, za zadania i turnieje zależą od kraju.',
    'Cricket exchange, slots, live casino and local payment routes': 'Giełda zakładów na krykieta, automaty, kasyno live i lokalne metody płatności.',
    'Fast payouts for players': 'Szybkie wypłaty dla graczy.',
    'Fortunica Casino features slots, fast payouts, and attractive bonuses': 'Fortunica Casino oferuje automaty, szybkie wypłaty i atrakcyjne bonusy.',
    'Bonus for sports. Casino + Win Games': 'Bonus sportowy. Kasyno i gry z nagrodami.',
  };

  if (exactTranslations[normalized]) return exactTranslations[normalized];

  return normalized
    .replace(/Live Casino Welcome Package/gi, 'Pakiet powitalny kasyna live')
    .replace(/Sports welcome package/gi, 'Sportowy pakiet powitalny')
    .replace(/Casino Welcome Package/gi, 'Pakiet powitalny kasyna')
    .replace(/Casino Welcome Bonus/gi, 'Bonus powitalny kasyna')
    .replace(/Casino Welcome Pack/gi, 'Pakiet powitalny kasyna')
    .replace(/Welcome Casino Bonus/gi, 'Bonus powitalny kasyna')
    .replace(/Casino welcome offer/gi, 'Oferta powitalna kasyna')
    .replace(/Regional Welcome Bonus/gi, 'Regionalny bonus powitalny')
    .replace(/Regional welcome pack/gi, 'Regionalny pakiet powitalny')
    .replace(/Total Welcome Pack/gi, 'Łączny pakiet powitalny')
    .replace(/Free Welcome Bonus/gi, 'Darmowy bonus powitalny')
    .replace(/Welcome Bonus Pack/gi, 'Pakiet powitalny')
    .replace(/Welcome Package/gi, 'Pakiet powitalny')
    .replace(/Welcome Pack/gi, 'Pakiet powitalny')
    .replace(/Welcome Bonus/gi, 'Bonus powitalny')
    .replace(/Welcome Offer/gi, 'Oferta powitalna')
    .replace(/Welcome Match/gi, 'Bonus powitalny od depozytu')
    .replace(/Deposit Bonus/gi, 'Bonus od depozytu')
    .replace(/Match Bonus/gi, 'Bonus od depozytu')
    .replace(/No Deposit Bonus/gi, 'Bonus bez depozytu')
    .replace(/No-Wager/gi, 'bez wymogu obrotu')
    .replace(/1st deposit bonus/gi, 'Bonus od pierwszego depozytu')
    .replace(/on Your First Crypto Deposit/gi, 'przy pierwszym depozycie kryptowalutowym')
    .replace(/on Your First Deposit/gi, 'przy pierwszym depozycie')
    .replace(/on the First Deposits/gi, 'przy pierwszych depozytach')
    .replace(/on your first 4 deposits/gi, 'przy pierwszych 4 depozytach')
    .replace(/across (?:the )?first 5 deposits/gi, 'przy pierwszych 5 depozytach')
    .replace(/for Your First Deposit/gi, 'przy pierwszym depozycie')
    .replace(/for your first deposit/gi, 'przy pierwszym depozycie')
    .replace(/First Deposit/gi, 'Pierwszy depozyt')
    .replace(/for new players:/gi, 'Dla nowych graczy:')
    .replace(/Sign up and get/gi, 'Zarejestruj się i odbierz')
    .replace(/Join Now To Get Your/gi, 'Dołącz teraz i odbierz')
    .replace(/Grab Your/gi, 'Odbierz')
    .replace(/Claim your/gi, 'Odbierz')
    .replace(/Claim a/gi, 'Odbierz')
    .replace(/\bClaim\b/gi, 'Odbierz')
    .replace(/Start Fast With/gi, 'Zacznij szybko z')
    .replace(/Start Strong with a/gi, 'Zacznij z bonusem')
    .replace(/for a Great Start/gi, 'na dobry start')
    .replace(/New in Uptown\?/gi, 'Nowy w Uptown?')
    .replace(/Easiest Bonus/gi, 'Prosty bonus')
    .replace(/Fast Track to Real Balance/gi, 'Szybka droga do salda gotówkowego')
    .replace(/Fast Payouts/gi, 'szybkie wypłaty')
    .replace(/Real Wins/gi, 'prawdziwe wygrane')
    .replace(/Play and win, be a little bit crazy!/gi, 'Graj, wygrywaj i baw się!')
    .replace(/Play games and get/gi, 'Graj i odbierz')
    .replace(/Enjoy/gi, 'Odbierz')
    .replace(/Nothing but Casino/gi, 'Tylko kasyno')
    .replace(/\bCasino\b/gi, 'Kasyno')
    .replace(/\bSports\b/gi, 'Zakłady sportowe')
    .replace(/Premium Pack/gi, 'Pakiet premium')
    .replace(/Casino Bonus/gi, 'Bonus kasynowy')
    .replace(/Sports Bonus/gi, 'Bonus sportowy')
    .replace(/Free Bets?/gi, match => /Bets/i.test(match) ? 'darmowych zakładów' : 'darmowy zakład')
    .replace(/Free Spins?/gi, 'darmowych spinów')
    .replace(/\bFS\b/g, 'darmowych spinów')
    .replace(/Free Sweep Coins/gi, 'darmowych monet Sweep')
    .replace(/Gold Coins/gi, 'złotych monet')
    .replace(/free chip/gi, 'darmowy żeton')
    .replace(/\bFree\b/gi, 'darmowy')
    .replace(/Extra/gi, 'dodatkowe')
    .replace(/in Coins/gi, 'w monetach')
    .replace(/in 3 Bonuses/gi, 'w 3 bonusach')
    .replace(/\bBoost\b/gi, 'bonus')
    .replace(/\bplus\b/gi, '+')
    .replace(/\bno wager\b/gi, 'bez wymogu obrotu')
    .replace(/\bup to\b/gi, 'do')
    .replace(/\bUp To\b/gi, 'do')
    .replace(/\bGet Bonus\b/gi, 'Odbierz bonus')
    .replace(/\bGet\b/gi, 'Odbierz')
    .replace(/\bwith Crypto\b/gi, 'przy płatności kryptowalutą')
    .replace(/when using Crypto/gi, 'przy płatności kryptowalutą')
    .replace(/live casino cashback/gi, 'cashbacku w kasynie live')
    .replace(/cashback every week/gi, 'cashbacku co tydzień')
    .replace(/local caps vary/gi, 'lokalne limity mogą się różnić')
    .replace(/bonuses excluded in SE\/FI/gi, 'bonusy niedostępne w SE/FI')
    .replace(/play live & get more credits!/gi, 'graj live i odbieraj więcej środków!')
    .replace(/\bper week\b/gi, 'tygodniowo')
    .replace(/\bweekly\b/gi, 'tygodniowo')
    .replace(/\bdaily\b/gi, 'dziennie')
    .replace(/\s+/g, ' ')
    .trim();
};
const ukrainianBrandBonusText = value => {
  if (SITE_LOCALE !== 'uk') return normalizeText(value);

  const normalized = normalizeText(value);
  const exactTranslations = {
    'Bet on your favorite sports, enjoy great odds, and spin to win in exciting casino games!': 'Робіть ставки на улюблені види спорту, користуйтеся вигідними коефіцієнтами та грайте в захопливі ігри казино.',
    'Casino, betting, quest and tournament bonuses vary by country': 'Бонуси казино, ставок, квестів і турнірів залежать від країни.',
    'Cricket exchange, slots, live casino and local payment routes': 'Біржа ставок на крикет, слоти, live-казино та місцеві способи оплати.',
    'Fast payouts for players': 'Швидкі виплати для гравців.',
    'Fortunica Casino features slots, fast payouts, and attractive bonuses': 'Fortunica Casino пропонує слоти, швидкі виплати та привабливі бонуси.',
    'Bonus for sports. Casino + Win Games': 'Спортивний бонус. Казино та ігри з призами.',
  };
  if (exactTranslations[normalized]) return exactTranslations[normalized];

  return normalized
    .replace(/Live Casino Welcome Package/gi, 'Вітальний пакет live-казино')
    .replace(/Sports welcome package/gi, 'Вітальний спортивний пакет')
    .replace(/Casino Welcome Package/gi, 'Вітальний пакет казино')
    .replace(/Casino Welcome Bonus/gi, 'Вітальний бонус казино')
    .replace(/Casino Welcome Pack/gi, 'Вітальний пакет казино')
    .replace(/Welcome Casino Bonus/gi, 'Вітальний бонус казино')
    .replace(/Casino welcome offer/gi, 'Вітальна пропозиція казино')
    .replace(/Regional Welcome Bonus/gi, 'Регіональний вітальний бонус')
    .replace(/Regional welcome pack/gi, 'Регіональний вітальний пакет')
    .replace(/Total Welcome Pack/gi, 'Загальний вітальний пакет')
    .replace(/Free Welcome Bonus/gi, 'Безкоштовний вітальний бонус')
    .replace(/Welcome Bonus Pack/gi, 'Вітальний пакет')
    .replace(/Welcome Package/gi, 'Вітальний пакет')
    .replace(/Welcome Pack/gi, 'Вітальний пакет')
    .replace(/Welcome Bonus/gi, 'Вітальний бонус')
    .replace(/Welcome Offer/gi, 'Вітальна пропозиція')
    .replace(/Welcome Match/gi, 'Вітальний бонус на депозит')
    .replace(/Deposit Bonus/gi, 'Бонус на депозит')
    .replace(/Match Bonus/gi, 'Бонус на депозит')
    .replace(/No Deposit Bonus/gi, 'Бездепозитний бонус')
    .replace(/No-Wager/gi, 'без відіграшу')
    .replace(/1st deposit bonus/gi, 'Бонус на перший депозит')
    .replace(/on Your First Crypto Deposit/gi, 'на перший криптовалютний депозит')
    .replace(/on Your First Deposit/gi, 'на перший депозит')
    .replace(/on the First Deposits/gi, 'на перші депозити')
    .replace(/on your first 4 deposits/gi, 'на перші 4 депозити')
    .replace(/across (?:the )?first 5 deposits/gi, 'на перші 5 депозитів')
    .replace(/for Your First Deposit/gi, 'на перший депозит')
    .replace(/for your first deposit/gi, 'на перший депозит')
    .replace(/First Deposit/gi, 'Перший депозит')
    .replace(/for new players:/gi, 'Для нових гравців:')
    .replace(/Sign up and get/gi, 'Зареєструйтеся та отримайте')
    .replace(/Join Now To Get Your/gi, 'Приєднуйтеся та отримайте')
    .replace(/Grab Your|Claim your|Claim a|\bClaim\b/gi, 'Отримайте')
    .replace(/Start Fast With/gi, 'Швидко почніть із')
    .replace(/Start Strong with a/gi, 'Почніть із бонусу')
    .replace(/for a Great Start/gi, 'для вдалого старту')
    .replace(/Easiest Bonus/gi, 'Простий бонус')
    .replace(/Fast Track to Real Balance/gi, 'Швидкий перехід до реального балансу')
    .replace(/Fast Payouts/gi, 'швидкі виплати')
    .replace(/Real Wins/gi, 'реальні виграші')
    .replace(/Play games and get/gi, 'Грайте та отримуйте')
    .replace(/Nothing but Casino/gi, 'Лише казино')
    .replace(/Premium Pack/gi, 'Преміумпакет')
    .replace(/Casino Bonus/gi, 'Бонус казино')
    .replace(/Sports Bonus/gi, 'Спортивний бонус')
    .replace(/Free Bets?/gi, 'безкоштовних ставок')
    .replace(/Free Spins?/gi, 'безкоштовних обертань')
    .replace(/\bFS\b/g, 'безкоштовних обертань')
    .replace(/Free Sweep Coins/gi, 'безкоштовних монет Sweep')
    .replace(/Gold Coins/gi, 'золотих монет')
    .replace(/free chip/gi, 'безкоштовний жетон')
    .replace(/\bup to\b/gi, 'до')
    .replace(/\bGet Bonus\b/gi, 'Отримайте бонус')
    .replace(/\bGet\b/gi, 'Отримайте')
    .replace(/\bwith Crypto\b|when using Crypto/gi, 'за оплату криптовалютою')
    .replace(/live casino cashback/gi, 'кешбеку в live-казино')
    .replace(/cashback every week/gi, 'щотижневого кешбеку')
    .replace(/local caps vary/gi, 'місцеві ліміти можуть відрізнятися')
    .replace(/bonuses excluded in SE\/FI/gi, 'бонуси недоступні у SE/FI')
    .replace(/\bper week\b|\bweekly\b/gi, 'щотижня')
    .replace(/\bdaily\b/gi, 'щодня')
    .replace(/\s+/g, ' ')
    .trim();
};
const portugueseBrandBonusText = value => {
  if (SITE_LOCALE !== 'pt') return normalizeText(value);
  return normalizeText(value)
    .replace(/Live Casino Welcome Package/gi, 'Pacote de boas-vindas do casino ao vivo')
    .replace(/Sports welcome package/gi, 'Pacote de boas-vindas para apostas desportivas')
    .replace(/Casino Welcome Package|Casino Welcome Pack|Welcome Package|Welcome Pack/gi, 'Pacote de boas-vindas do casino')
    .replace(/Casino Welcome Bonus|Welcome Casino Bonus|Welcome Bonus/gi, 'Bónus de boas-vindas do casino')
    .replace(/Welcome Offer/gi, 'Oferta de boas-vindas')
    .replace(/Deposit Bonus|Match Bonus/gi, 'Bónus de depósito')
    .replace(/No Deposit Bonus/gi, 'Bónus sem depósito')
    .replace(/First Deposit/gi, 'Primeiro depósito')
    .replace(/Free Spins?/gi, 'jogadas grátis')
    .replace(/Free Bets?/gi, 'apostas grátis')
    .replace(/Fast Payouts/gi, 'levantamentos rápidos')
    .replace(/Sports Bonus/gi, 'Bónus desportivo')
    .replace(/Casino Bonus/gi, 'Bónus de casino')
    .replace(/\bup to\b/gi, 'até')
    .replace(/\bper week\b|\bweekly\b/gi, 'por semana')
    .replace(/\bdaily\b/gi, 'diariamente')
    .replace(/\s+/g, ' ')
    .trim();
};
const frenchBrandBonusText = value => {
  if (SITE_LOCALE !== 'fr') return normalizeText(value);
  const normalized = normalizeText(value);
  const exactTranslations = {
    'Bet on your favorite sports, enjoy great odds, and spin to win in exciting casino games!': 'Pariez sur vos sports favoris, profitez de cotes attractives et découvrez les jeux de casino.',
    'Casino, betting, quest and tournament bonuses vary by country': 'Les bonus de casino, de paris, de quêtes et de tournois varient selon le pays.',
    'Cricket exchange, slots, live casino and local payment routes': 'Bourse de paris sur le cricket, machines à sous, casino en direct et moyens de paiement locaux.',
    'Fast payouts for players': 'Retraits rapides pour les joueurs.',
    'Fortunica Casino features slots, fast payouts, and attractive bonuses': 'Fortunica propose des machines à sous, des retraits rapides et des bonus attractifs.',
    'Bonus for sports.  Casino + Win Games': 'Bonus de paris sportifs, casino et jeux avec gains.',
  };
  if (exactTranslations[normalized]) return exactTranslations[normalized];

  return normalized
    .replace(/Live Casino Welcome Package/gi, 'Offre de bienvenue du casino en direct')
    .replace(/Sports welcome package/gi, 'Offre de bienvenue pour les paris sportifs')
    .replace(/Casino Welcome Package|Casino Welcome Pack|Welcome Package|Welcome Pack/gi, 'Offre de bienvenue du casino')
    .replace(/Casino Welcome Bonus|Welcome Casino Bonus|Welcome Bonus/gi, 'Bonus de bienvenue du casino')
    .replace(/Welcome Offer/gi, 'Offre de bienvenue')
    .replace(/Deposit Bonus|Match Bonus/gi, 'Bonus de dépôt')
    .replace(/No Deposit Bonus/gi, 'Bonus sans dépôt')
    .replace(/First Deposit/gi, 'Premier dépôt')
    .replace(/Free Spins?/gi, 'tours gratuits')
    .replace(/\bFS\b/g, 'tours gratuits')
    .replace(/Free Bets?/gi, 'paris gratuits')
    .replace(/Fast Payouts/gi, 'retraits rapides')
    .replace(/Sports Bonus/gi, 'Bonus de paris sportifs')
    .replace(/Casino Bonus/gi, 'Bonus de casino')
    .replace(/Sign up and get/gi, 'Inscrivez-vous et obtenez')
    .replace(/Join Now To Get Your/gi, 'Inscrivez-vous pour obtenir votre')
    .replace(/Grab Your|Claim your|Claim a|\bClaim\b/gi, 'Obtenez')
    .replace(/Start Strong with a/gi, 'Commencez avec')
    .replace(/Start Fast With/gi, 'Commencez avec')
    .replace(/for a Great Start/gi, 'pour bien commencer')
    .replace(/Fast Payouts/gi, 'retraits rapides')
    .replace(/Real Wins/gi, 'gains réels')
    .replace(/Nothing but Casino/gi, 'Tout pour le casino')
    .replace(/Welcome Match/gi, 'Bonus de bienvenue sur dépôt')
    .replace(/Premium Pack/gi, 'Offre premium')
    .replace(/Total Welcome Pack/gi, 'Offre de bienvenue complète')
    .replace(/Regional welcome pack/gi, 'Offre de bienvenue régionale')
    .replace(/Regional Welcome Bonus/gi, 'Bonus de bienvenue régional')
    .replace(/No-Wager/gi, 'sans condition de mise')
    .replace(/\bGet Bonus\b/gi, 'Obtenez le bonus')
    .replace(/\bGet\b/gi, 'Obtenez')
    .replace(/live casino cashback/gi, 'de cashback au casino en direct')
    .replace(/cashback every week/gi, 'de cashback chaque semaine')
    .replace(/local caps vary/gi, 'les plafonds varient selon le pays')
    .replace(/bonuses excluded in SE\/FI/gi, 'bonus indisponibles en SE/FI')
    .replace(/\bup to\b/gi, 'jusqu’à')
    .replace(/\bper week\b|\bweekly\b/gi, 'par semaine')
    .replace(/\bdaily\b/gi, 'chaque jour')
    .replace(/\s+/g, ' ')
    .trim();
};
const hindiBrandBonusText = value => {
  if (SITE_LOCALE !== 'hi') return normalizeText(value);
  const normalized = normalizeText(value);
  const exactTranslations = {
    'Bet on your favorite sports, enjoy great odds, and spin to win in exciting casino games!': 'अपने पसंदीदा खेलों पर बेट लगाएं, अच्छे ऑड्स पाएं और रोमांचक कैसीनो गेम खेलें।',
    'Casino, betting, quest and tournament bonuses vary by country': 'कैसीनो, बेटिंग, क्वेस्ट और टूर्नामेंट बोनस देश के अनुसार बदलते हैं।',
    'Cricket exchange, slots, live casino and local payment routes': 'क्रिकेट एक्सचेंज, स्लॉट, लाइव कैसीनो और स्थानीय भुगतान विधियां।',
    'Fast payouts for players': 'खिलाड़ियों के लिए तेज़ निकासी।',
    'Fortunica Casino features slots, fast payouts, and attractive bonuses': 'Fortunica में स्लॉट, तेज़ निकासी और आकर्षक बोनस उपलब्ध हैं।',
    'Bonus for sports. Casino + Win Games': 'स्पोर्ट्स बोनस, कैसीनो और पुरस्कार वाले गेम।',
    'Bonus for sports.  Casino + Win Games': 'स्पोर्ट्स बोनस, कैसीनो और पुरस्कार वाले गेम।',
    'Easiest Bonus 700% - Fast Track to Real Balance!': '700% तक का बोनस — शर्तें पूरी होने पर राशि असली बैलेंस में जुड़ती है।',
  };
  if (exactTranslations[normalized]) return exactTranslations[normalized];
  return normalized
    .replace(/Live Casino Welcome Package/gi, 'लाइव कैसीनो स्वागत पैकेज')
    .replace(/Sports welcome package/gi, 'स्पोर्ट्स बेटिंग स्वागत पैकेज')
    .replace(/Casino Welcome Package|Casino Welcome Pack|Welcome Package|Welcome Pack/gi, 'कैसीनो स्वागत पैकेज')
    .replace(/Casino Welcome Bonus|Welcome Casino Bonus|Welcome Bonus/gi, 'कैसीनो स्वागत बोनस')
    .replace(/Welcome Offer/gi, 'स्वागत ऑफर')
    .replace(/Deposit Bonus|Match Bonus/gi, 'डिपॉजिट बोनस')
    .replace(/No Deposit Bonus/gi, 'बिना डिपॉजिट का बोनस')
    .replace(/on Your First Crypto Deposit/gi, 'आपके पहले क्रिप्टो डिपॉजिट पर')
    .replace(/on Your First Deposit/gi, 'आपके पहले डिपॉजिट पर')
    .replace(/for Your First Deposit/gi, 'आपके पहले डिपॉजिट के लिए')
    .replace(/First Deposit/gi, 'पहला डिपॉजिट')
    .replace(/Free Spins?/gi, 'फ्री स्पिन')
    .replace(/\bFS\b/g, 'फ्री स्पिन')
    .replace(/Free Bets?/gi, 'फ्री बेट')
    .replace(/Fast Payouts/gi, 'तेज़ निकासी')
    .replace(/Sports Bonus/gi, 'स्पोर्ट्स बोनस')
    .replace(/Casino Bonus/gi, 'कैसीनो बोनस')
    .replace(/Sign up and get|Join Now To Get Your|Grab Your|Claim your|Claim a|\bClaim\b/gi, 'पाएं')
    .replace(/No-Wager/gi, 'बिना टर्नओवर शर्त के')
    .replace(/\bup to\b/gi, 'तक')
    .replace(/\bper week\b|\bweekly\b/gi, 'हर सप्ताह')
    .replace(/\bdaily\b/gi, 'प्रतिदिन')
    .replace(/\s+/g, ' ')
    .trim();
};
const localizedBrandBonusText = value => {
  const normalized = normalizeText(value);
  const catalogTranslation = BRAND_BONUS_TRANSLATIONS[SITE_LOCALE]?.[normalized];
  if (catalogTranslation) return catalogTranslation;

  return SITE_LOCALE === 'uk'
    ? ukrainianBrandBonusText(value)
    : SITE_LOCALE === 'pt'
      ? portugueseBrandBonusText(value)
      : SITE_LOCALE === 'fr'
        ? frenchBrandBonusText(value)
        : SITE_LOCALE === 'hi'
          ? hindiBrandBonusText(value)
          : polishBrandBonusText(value);
};

const localeText = (english, german, spanish, italian, polish, ukrainian, portuguese, french, hindi) =>
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
    label: SITE_LOCALE === 'de' ? item.labelDe || item.label : SITE_LOCALE === 'es' ? item.labelEs || item.label : SITE_LOCALE === 'it' ? item.labelIt || item.label : SITE_LOCALE === 'pl' ? item.labelPl || item.label : SITE_LOCALE === 'uk' ? item.labelUk || item.label : SITE_LOCALE === 'pt' ? item.labelPt || item.label : SITE_LOCALE === 'fr' ? item.labelFr || item.label : SITE_LOCALE === 'hi' ? item.labelHi || item.label : item.label,
    type: SITE_LOCALE === 'de' && item.type === 'Page' ? 'Seite' : SITE_LOCALE === 'es' && item.type === 'Page' ? 'Página' : SITE_LOCALE === 'it' && item.type === 'Page' ? 'Pagina' : SITE_LOCALE === 'pl' && item.type === 'Page' ? 'Strona' : SITE_LOCALE === 'uk' && item.type === 'Page' ? 'Сторінка' : SITE_LOCALE === 'pt' && item.type === 'Page' ? 'Página' : SITE_LOCALE === 'fr' && item.type === 'Page' ? 'Page' : SITE_LOCALE === 'hi' && item.type === 'Page' ? 'पेज' : item.type,
    summary: SITE_LOCALE === 'de' ? item.summaryDe || item.summary : SITE_LOCALE === 'es' ? item.summaryEs || item.summary : SITE_LOCALE === 'it' ? item.summaryIt || item.summary : SITE_LOCALE === 'pl' ? item.summaryPl || item.summary : SITE_LOCALE === 'uk' ? item.summaryUk || item.summary : SITE_LOCALE === 'pt' ? item.summaryPt || item.summary : SITE_LOCALE === 'fr' ? item.summaryFr || item.summary : SITE_LOCALE === 'hi' ? item.summaryHi || item.summary : item.summary,
    href: localizedPagePath(item.href),
  }));

  COUNTRIES.forEach(country => {
    const countryName = localizedCountryName(country);
    addItem({
      label: `${countryName} casinos`,
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
    const englishPath = currentPath.replace(/^\/(?:de|es|it|pl|uk|pt|fr|hi)(?=\/|$)/, '') || '/';
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
    </div>
  `;
  headerInner.append(switcher);

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

const renderCountryCasinoGallery = pageCountry => {
  const main = document.querySelector('body[data-country] main');
  const hero = main?.querySelector(':scope > .hero');
  const country = COUNTRIES.find(item => item.code.toUpperCase() === pageCountry);
  if (!main || !hero || !country || main.querySelector('.country-casino-gallery')) return;

  const candidates = BRANDS.map((brand, index) => ({ brand, index }))
    .filter(({ brand }) => {
      const slug = getBrandDetailSlug(brand);
      return (
        brand.hasDetailPage &&
        brand.urlDetail &&
        !brand.notRecommended &&
        brand.countries?.some(code => code.toUpperCase() === pageCountry) &&
        Boolean(BRAND_HOMEPAGE_SCREENSHOTS[slug])
      );
    })
    .sort((a, b) => {
      const score = brand =>
        (brand.top?.some(code => code.toUpperCase() === pageCountry) ? 100 : 0) +
        (brand.isTopRated ? 30 : 0) +
        (brand.isExclusive ? 10 : 0) +
        (brand.isNew ? 5 : 0);
      return score(b.brand) - score(a.brand) || a.index - b.index;
    });

  const selectedBrands = [];
  const selectedSlugs = new Set();
  candidates.forEach(({ brand }) => {
    const slug = getBrandDetailSlug(brand);
    if (selectedBrands.length >= 6 || selectedSlugs.has(slug)) return;
    selectedSlugs.add(slug);
    selectedBrands.push(brand);
  });

  if (!selectedBrands.length) return;

  const countryName = normalizeText(localizedCountryName(country));
  const headingId = `country-casino-gallery-${country.slug}`;
  const section = document.createElement('section');
  section.className = 'content country-casino-gallery';
  section.setAttribute('aria-labelledby', headingId);
  section.innerHTML = `
    <div class="container">
      <div class="country-casino-gallery-head">
        <div>
          <span class="country-casino-gallery-kicker">${localeText('CASINO LOBBY PREVIEWS', 'EINBLICKE IN CASINO-LOBBYS', 'VISTAS PREVIAS DE LOBBIES')}</span>
          <h2 id="${headingId}">${localeText(
            `Inside casinos available in ${countryName}`,
            `Einblicke in Casinos für ${countryName}`,
            `Así son los casinos disponibles en ${countryName}`
          )}</h2>
        </div>
        <p>${
          localeText(
            `Real homepage captures from brands included in our ${countryName} comparison. Open any preview for the complete review and current details.`,
            `Echte Startseiten-Aufnahmen von Marken, die in unserem ${countryName}-Vergleich vertreten sind. Öffnen Sie eine Vorschau für den vollständigen Test.`,
            `Capturas reales de las páginas principales de marcas incluidas en nuestra comparativa de ${countryName}. Abre cualquier vista previa para consultar la reseña completa y los datos actuales.`
          )
        }</p>
      </div>
      <div class="country-casino-gallery-grid">
        ${selectedBrands
          .map(brand => {
            const slug = getBrandDetailSlug(brand);
            const name = normalizeText(brand.name);
            const source = BRAND_HOMEPAGE_SCREENSHOTS[slug].replace(
              '/image/upload/',
              '/image/upload/c_fill,g_north,w_900,h_506/'
            );
            return `
              <a class="country-casino-shot" href="${brandPagePath(brand)}">
                <img src="${source}" alt="${localeText(
                  `${name} casino homepage for ${countryName}`,
                  `${name} Casino-Startseite für ${countryName}`,
                  `Página principal de ${name} para ${countryName}`
                )}" width="900" height="506" loading="lazy" decoding="async" />
                <span>
                  <strong>${name}</strong>
                  <small>${localeText('Review and current details', 'Test und aktuelle Details', 'Reseña y datos actuales')}</small>
                </span>
              </a>
            `;
          })
          .join('')}
      </div>
    </div>
  `;

  hero.insertAdjacentElement('afterend', section);
};

const renderCountryNewGames = pageCountry => {
  const main = document.querySelector('body[data-country] main');
  const country = COUNTRIES.find(item => item.code.toUpperCase() === pageCountry);
  if (!main || !country || main.querySelector('.country-new-games')) return;

  const countryHash = Array.from(pageCountry).reduce((total, char) => total + char.charCodeAt(0), 0);
  const candidates = BRANDS.map((brand, index) => ({
    brand,
    index,
    slug: getBrandDetailSlug(brand),
  }))
    .filter(({ brand, slug }) =>
      brand.hasDetailPage &&
      brand.urlDetail &&
      !brand.notRecommended &&
      brand.countries?.some(code => code.toUpperCase() === pageCountry) &&
      Array.isArray(BRAND_NEW_GAMES[slug]) &&
      BRAND_NEW_GAMES[slug].length
    )
    .sort((a, b) => {
      const score = item =>
        (item.brand.top?.some(code => code.toUpperCase() === pageCountry) ? 100 : 0) +
        (item.brand.isTopRated ? 30 : 0) +
        (item.brand.isNew ? 12 : 0) +
        (item.brand.isExclusive ? 5 : 0);
      return score(b) - score(a) || a.index - b.index;
    });

  const selectedGames = [];
  const selectedNames = new Set();
  const maxCards = 12;

  const addGame = (candidate, gameIndex) => {
    const games = BRAND_NEW_GAMES[candidate.slug] || [];
    if (!games.length) return false;

    for (let offset = 0; offset < games.length; offset += 1) {
      const game = games[(gameIndex + offset) % games.length];
      const name = normalizeText(game?.name).trim();
      const nameKey = name.toLocaleLowerCase();
      if (!name || !game?.image || selectedNames.has(nameKey)) continue;

      selectedNames.add(nameKey);
      selectedGames.push({ brand: candidate.brand, game });
      return true;
    }

    return false;
  };

  candidates.forEach(candidate => {
    if (selectedGames.length >= maxCards) return;
    const games = BRAND_NEW_GAMES[candidate.slug] || [];
    const startingIndex = games.length ? (countryHash + candidate.index) % games.length : 0;
    addGame(candidate, startingIndex);
  });

  if (!selectedGames.length) return;

  const countryName = normalizeText(localizedCountryName(country));
  const headingId = `country-new-games-${country.slug}`;
  const section = document.createElement('section');
  section.className = `content country-new-games${selectedGames.length < 6 ? ' is-sparse' : ''}`;
  section.setAttribute('aria-labelledby', headingId);
  section.style.setProperty('--country-game-count', String(Math.min(selectedGames.length, 6)));
  section.innerHTML = `
    <div class="container">
      <div class="country-new-games-head">
        <div>
          <span class="country-new-games-kicker">${localeText('FRESH FROM REVIEWED LOBBIES', 'NEU IN GEPRÜFTEN LOBBYS', 'NOVEDADES DE LOBBIES REVISADOS')}</span>
          <h2 id="${headingId}">${localeText(
            `New games in ${countryName}`,
            `Neue Spiele im ${countryName}-Vergleich`,
            `Juegos nuevos en ${countryName}`
          )}</h2>
        </div>
        <p>${
          localeText(
            `Recent releases from casino brands included in our ${countryName} comparison. Each card opens the relevant review; availability can vary by region and account.`,
            `Aktuelle Neuerscheinungen aus Casino-Marken unseres ${countryName}-Vergleichs. Jede Karte führt zum passenden Test; die Verfügbarkeit kann je nach Region und Konto variieren.`,
            `Lanzamientos recientes de marcas incluidas en nuestra comparativa de ${countryName}. Cada tarjeta abre la reseña correspondiente; la disponibilidad puede variar según la región y la cuenta.`
          )
        }</p>
      </div>
      <div class="country-new-games-grid" aria-label="${
        localeText(`New games for ${countryName}`, `Neue Spiele für ${countryName}`, `Juegos nuevos para ${countryName}`)
      }">
        ${selectedGames
          .map(({ brand, game }) => {
            const brandName = normalizeText(brand.name);
            const gameName = normalizeText(game.name);
            return `
              <a class="country-new-game-card" href="${brandPagePath(brand)}">
                <span class="country-new-game-art">
                  <img
                    src="${escapeHtml(game.image)}"
                    alt="${localeText(
                      `${escapeHtml(gameName)} game artwork at ${escapeHtml(brandName)}`,
                      `${escapeHtml(gameName)} Spielgrafik bei ${escapeHtml(brandName)}`,
                      `Imagen del juego ${escapeHtml(gameName)} en ${escapeHtml(brandName)}`
                    )}"
                    loading="lazy"
                    decoding="async"
                  />
                </span>
                <span class="country-new-game-copy">
                  <strong>${escapeHtml(gameName)}</strong>
                  <small>${localeText('at', 'bei', 'en')} ${escapeHtml(brandName)}</small>
                </span>
              </a>
            `;
          })
          .join('')}
      </div>
    </div>
  `;

  const gallery = main.querySelector('.country-casino-gallery');
  const hero = main.querySelector(':scope > .hero');
  (gallery || hero)?.insertAdjacentElement('afterend', section);
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

  const stage = document.createElement('div');
  stage.className = 'country-brand-stage';
  stage.innerHTML = `
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

const initTopCasinosJumpNav = () => {
  if (document.body.dataset.page !== 'top-casinos' || document.querySelector('.top-casino-jump-nav')) {
    return;
  }

  const contentArea = document.querySelector('.content-area');
  const sections = Array.from(document.querySelectorAll('.content[data-country]'));
  if (!contentArea || sections.length < 2) return;

  const sectionsByCode = new Map();
  sections.forEach(section => {
    const code = section.dataset.country?.toUpperCase();
    const country = COUNTRIES.find(item => item.code.toUpperCase() === code);
    if (!code || !country) return;
    section.id = section.id || `top-${country.slug}`;
    sectionsByCode.set(code, section);
  });

  const featuredCodes = new Set(['US', 'UK', 'AU', 'CA', 'BR']);
  const copy = SITE_LOCALE === 'de'
    ? {
        kicker: `${COUNTRIES.length} LÄNDER-GUIDES`,
        title: 'Wählen Sie Ihren Markt',
        description: 'Öffnen Sie eine hervorgehobene Rangliste oder wechseln Sie direkt zum vollständigen Länder-Guide.',
        show: 'Alle Länder anzeigen',
        hide: 'Weniger anzeigen',
        label: 'Casino-Rankings und Länder-Guides',
      }
    : SITE_LOCALE === 'es'
      ? {
          kicker: `${COUNTRIES.length} GUÍAS POR PAÍS`,
          title: 'Elige tu mercado',
          description: 'Abre una clasificación destacada o accede directamente a la guía completa de tu país.',
          show: 'Mostrar todos los países',
          hide: 'Mostrar menos',
          label: 'Clasificaciones de casinos y guías por país',
        }
      : SITE_LOCALE === 'it'
        ? {
            kicker: `${COUNTRIES.length} GUIDE PER PAESE`,
            title: 'Scegli il tuo mercato',
            description: 'Apri una classifica in evidenza oppure vai direttamente alla guida completa per il tuo paese.',
            show: 'Mostra tutti i paesi',
            hide: 'Mostra meno',
            label: 'Classifiche dei casinò e guide per paese',
          }
        : SITE_LOCALE === 'pl'
          ? {
              kicker: `${COUNTRIES.length} PRZEWODNIKI PO KRAJACH`,
              title: 'Wybierz swój rynek',
              description: 'Otwórz wyróżniony ranking lub przejdź bezpośrednio do pełnego przewodnika po swoim kraju.',
              show: 'Pokaż wszystkie kraje',
              hide: 'Pokaż mniej',
              label: 'Rankingi kasyn i przewodniki po krajach',
            }
          : SITE_LOCALE === 'uk'
            ? {
                kicker: `${COUNTRIES.length} ГІДИ ЗА КРАЇНАМИ`,
                title: 'Оберіть свій ринок',
                description: 'Відкрийте вибраний рейтинг або перейдіть до повного гіда для своєї країни.',
                show: 'Показати всі країни',
                hide: 'Показати менше',
                label: 'Рейтинги казино та гіди за країнами',
              }
            : SITE_LOCALE === 'pt'
              ? {
                  kicker: `${COUNTRIES.length} GUIAS POR PAÍS`,
                  title: 'Escolha o seu mercado',
                  description: 'Abra uma classificação em destaque ou aceda diretamente ao guia completo do seu país.',
                  show: 'Mostrar todos os países',
                  hide: 'Mostrar menos',
                  label: 'Classificações de casinos e guias por país',
                }
              : SITE_LOCALE === 'fr'
                ? {
                    kicker: `${COUNTRIES.length} GUIDES PAR PAYS`,
                    title: 'Choisissez votre marché',
                    description: 'Ouvrez un classement mis en avant ou accédez directement au guide complet de votre pays.',
                    show: 'Afficher tous les pays',
                    hide: 'Afficher moins de pays',
                    label: 'Classements de casinos et guides par pays',
                  }
                : SITE_LOCALE === 'hi'
                  ? {
                      kicker: `${COUNTRIES.length} देश गाइड`,
                      title: 'अपना बाज़ार चुनें',
                      description: 'चुनिंदा रैंकिंग खोलें या सीधे अपने देश की पूरी गाइड देखें।',
                      show: 'सभी देश दिखाएं',
                      hide: 'कम देश दिखाएं',
                      label: 'कैसीनो रैंकिंग और देश गाइड',
                    }
        : {
        kicker: `${COUNTRIES.length} COUNTRY GUIDES`,
        title: 'Choose your market',
        description: 'Open a featured ranking below or go directly to the complete guide for your country.',
        show: 'Show all countries',
        hide: 'Show fewer',
        label: 'Casino rankings and country guides',
      };

  const nav = document.createElement('nav');
  nav.className = 'top-casino-jump-nav';
  nav.id = 'top-casino-markets';
  nav.setAttribute('aria-label', copy.label);
  nav.innerHTML = `
    <div class="top-casino-jump-nav__head">
      <div>
        <span class="top-casinos-section-kicker">${escapeHtml(copy.kicker)}</span>
        <h2>${escapeHtml(copy.title)}</h2>
        <p>${escapeHtml(copy.description)}</p>
      </div>
      <button class="top-casino-jump-toggle" type="button" aria-expanded="false" aria-controls="top-casino-country-links">
        ${escapeHtml(copy.show)}
      </button>
    </div>
    <div class="top-casino-jump-nav__links" id="top-casino-country-links">
      ${COUNTRIES.map(country => {
          const code = country.code.toUpperCase();
          const section = sectionsByCode.get(code);
          const title = localizedCountryName(country);
          const href = section ? `#${section.id}` : countryPagePath(country.slug);
          return `
            <a class="top-casino-jump-link" href="${escapeHtml(href)}" data-featured="${featuredCodes.has(code) ? 'true' : 'false'}">
              <img class="flag" src="${iconPath(country.slug)}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
              <span>${escapeHtml(title)}</span>
            </a>
          `;
        })
        .join('')}
    </div>
  `;

  contentArea.insertAdjacentElement('beforebegin', nav);

  const toggle = nav.querySelector('.top-casino-jump-toggle');
  toggle?.addEventListener('click', () => {
    const isExpanded = nav.classList.toggle('is-expanded');
    toggle.setAttribute('aria-expanded', String(isExpanded));
    toggle.textContent = isExpanded ? copy.hide : copy.show;
  });
};

const ensureTopCasinosCountrySections = () => {
  if (document.body.dataset.page !== 'top-casinos') return;

  const contentArea = document.querySelector('.content-area');
  const insertionPoint = contentArea?.querySelector('.top-casinos-method');
  if (!contentArea || !insertionPoint) return;

  const existingCodes = new Set(
    Array.from(contentArea.querySelectorAll('.content[data-country]'))
      .map(section => section.dataset.country?.toUpperCase())
      .filter(Boolean)
  );
  const fragment = document.createDocumentFragment();

  COUNTRIES.forEach(country => {
    const code = country.code.toUpperCase();
    if (existingCodes.has(code)) return;

    const section = document.createElement('section');
    section.className = 'content top-casinos-generated-country';
    section.dataset.country = code;
    section.id = `top-${country.slug}`;
    section.innerHTML = `
      <div class="cards-main">
        <h2 class="top-country-title">${escapeHtml(localizedCountryName(country))}</h2>
        <div class="casino-grid" data-limit="6"></div>
        <div class="view-all-wrapper" hidden>
          <a class="view-all" href="${countryPagePath(country.slug)}"></a>
        </div>
      </div>
    `;
    fragment.appendChild(section);
  });

  insertionPoint.after(fragment);
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
  const hero = document.querySelector('body[data-brand] .hero');
  const heroContent = hero?.querySelector(':scope > .hero-content');
  const allCountries = document.querySelector('body[data-brand] .all-countries');
  if (!hero || !heroContent || !allCountries || document.querySelector('.brand-sticky-review-layout')) {
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
export const initCasinoPage = () => {
  const pageType = document.body.dataset.page;
  const pageCountry = document.body.dataset.country?.toUpperCase();
  const siteCountryCountEl = document.getElementById('siteCountryCount');
  const siteBrandCountEl = document.getElementById('siteBrandCount');

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

  renderHomeRecommendationCards();
  renderHomeNewReviews();
  renderLocalizedHomeCasinoGallery();
  renderLocalizedHomeGames();
  initHomeNewBrandsCarousel();
  applyBrandLogoBackgrounds();
  applyNotRecommendedCasinoRows();
  applyBrandHeroConcept();
  applyBrandStickyReviewLayout();
  initBrandWhyPreview();

  if (pageCountry) {
    ensureCountryBrandStage(pageCountry);
    initCountryGuideCarousels();
    applyCountryHeroConcept();
    const brands = BRANDS.filter(b => b.countries?.some(c => c.toUpperCase() === pageCountry));

    initCountryBrandFilters(pageCountry, brands, filteredBrands => {
      renderBrandList(filteredBrands, '#brand-cards', uiCopy.noFilterMatches);
      applyBrandLogoBackgrounds();
      requestPaymentIconSync();
    });
    renderBrandList(brands, '#brand-cards', uiCopy.noCountryCasinos);
    applyBrandLogoBackgrounds();
    renderCountryCasinoGallery(pageCountry);
    renderCountryNewGames(pageCountry);
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
  ensureTopCasinosCountrySections();

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

    titleEl.textContent = localizedCountryTitle(country || { slug: '', name: code });

    const topBrands = BRANDS.filter(b => b.top?.includes(code) && b.countries?.includes(code));
    const needsTopCasinosFill = document.body.dataset.page === 'top-casinos' && topBrands.length < limit;
    const countryFillBrands = needsTopCasinosFill
      ? BRANDS.filter(b => b.countries?.includes(code) && !topBrands.includes(b))
      : [];
    const renderedBrands = [...topBrands, ...countryFillBrands].slice(0, limit);

    if (!renderedBrands.length) {
      grid.innerHTML = `<p>${localeText('No top casinos available.', 'Keine Top-Casinos verfügbar.', 'No hay casinos destacados disponibles.')}</p>`;
    } else {
      const fragment = document.createDocumentFragment();
      renderedBrands.forEach(b => fragment.appendChild(createCasinoCard(b)));
      grid.replaceChildren(fragment);
      requestPaymentIconSync();
    }

    if (country && viewAllWrapper && viewAllLink) {
      viewAllWrapper.hidden = false;
      viewAllLink.href = countryPagePath(country.slug);
      viewAllLink.textContent = localeText(
        `View all ${localizedCountryName(country)} casinos`,
        `Alle Casinos in ${localizedCountryName(country)} anzeigen`,
        `Ver todos los casinos de ${localizedCountryName(country)}`
      );
    }
  });

  initTopCasinosJumpNav();

  const brandKey = document.body.dataset.brand?.toLowerCase();
  if (brandKey) {
    normalizeFinalBrandCtaLabels();
    initStickyBrandTitle();
    enhanceBrandProsCons();
    applyBrandInfoPairLayout();
    renderBrandAvailabilityWidget(brandKey);

    const brand = findBrandByPageKey(brandKey);

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
        initBrandCountryCollapse();
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

    initBrandSectionNav();
    initBrandHeroPanels();
    applyBrandStickyReviewLayout();
    initBrandCountryCollapse();
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
          <img class="flag" src="${iconPath(c.slug)}" alt="${normalizeText(localizedCountryName(c))}" loading="lazy" decoding="async"/>
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
  initLanguageSwitcher();
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

  document.querySelector('.all-countries .countries-cloud')?.replaceChildren(
    ...COUNTRIES.map(c => {
      const a = document.createElement('a');
      a.href = countryPagePath(c.slug);
      a.className = 'country-link';
      a.innerHTML = `
        <img class="flag" src="${iconPath(c.slug)}" alt="${normalizeText(localizedCountryName(c))}" loading="lazy" decoding="async">
        <span>${normalizeText(localizedCountryName(c))}</span>
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
      <img class="flag" src="${iconPath(c.slug)}" alt="${normalizeText(localizedCountryName(c))}" loading="lazy" decoding="async"/>
      ${normalizeText(localizedCountryName(c))}
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
