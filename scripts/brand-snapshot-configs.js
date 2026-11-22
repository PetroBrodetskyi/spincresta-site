const GAME_CATEGORIES = [
  'Slots',
  'Roulette',
  'Blackjack',
  'Video poker',
  'Bingo',
  'Baccarat',
  'Jackpot games',
  'Live games',
  'Poker',
  'Craps and dice',
  'Keno',
  'Scratch cards',
  'Crash games',
];

const LIVE_GAME_CATEGORIES = [
  'Live shows',
  'Live baccarat',
  'Live bingo',
  'Live blackjack',
  'Live dice games',
  'Other live games',
  'Live poker',
  'Live roulette',
];

const BETTING_CATEGORIES = [
  'Football',
  'Basketball',
  'Tennis',
  'Table tennis',
  'Volleyball',
  'Ice hockey',
  'Cricket',
  'Baseball',
  'Handball',
  'American football',
  'eSports',
  'Virtual sports',
  'Combat sports',
  'Boxing',
  'Martial arts',
  'Motorsport',
];

const createSnapshotTab = (label, available, unavailable = [], note = '') => ({
  label,
  available,
  unavailable,
  note,
});

const createCategoryTab = (label, allCategories, availableCategories, note) => {
  const availableSet = new Set(availableCategories);

  return createSnapshotTab(
    label,
    allCategories.filter(item => availableSet.has(item)),
    allCategories.filter(item => !availableSet.has(item)),
    note
  );
};

const createGamesLiveConfig = (gamesAvailable, liveAvailable) => ({
  tabs: [
    createCategoryTab(
      'Games',
      GAME_CATEGORIES,
      gamesAvailable,
      'These are the main game categories currently visible in the account.'
    ),
    createCategoryTab(
      'Live games',
      LIVE_GAME_CATEGORIES,
      liveAvailable,
      'These are the live-dealer categories currently visible in the account.'
    ),
  ],
});

const createGamesLiveBettingConfig = (
  gamesAvailable, liveAvailable, bettingAvailable,
  { games = GAME_CATEGORIES, live = LIVE_GAME_CATEGORIES, betting = BETTING_CATEGORIES } = {},
) => ({
  tabs: [
    createCategoryTab(
      'Games',
      games,
      gamesAvailable,
      'These are the main game categories currently visible in the account.'
    ),
    createCategoryTab(
      'Live games',
      live,
      liveAvailable,
      'These are the live-dealer categories currently visible in the account.'
    ),
    createCategoryTab(
      'Betting',
      betting,
      bettingAvailable,
      'These are the main betting categories currently visible in the account.'
    ),
  ],
});

const createBettingConfig = bettingAvailable => ({
  tabs: [
    createCategoryTab(
      'Betting',
      BETTING_CATEGORIES,
      bettingAvailable,
      'These are the main betting categories currently visible in the account.'
    ),
  ],
});

const publicCatalogueNotes = {
  en: 'Categories checked in the public catalogue; country and provider restrictions may apply.',
  de: 'Kategorien aus dem öffentlichen Katalog; Länder- und Anbieterbeschränkungen sind möglich.',
  es: 'Categorías revisadas en el catálogo público; pueden aplicarse restricciones de país y proveedor.',
  it: 'Categorie verificate nel catalogo pubblico; possono esserci restrizioni per paese e fornitore.',
  pl: 'Kategorie sprawdzone w publicznym katalogu; możliwe ograniczenia kraju i dostawcy.',
  uk: 'Категорії перевірені у відкритому каталозі; можливі обмеження за країною та провайдером.',
  pt: 'Categorias verificadas no catálogo público; podem aplicar-se restrições de país e fornecedor.',
  fr: 'Catégories vérifiées dans le catalogue public ; restrictions de pays ou de fournisseur possibles.',
  hi: 'सार्वजनिक सूची में जाँचे गए प्रकार; देश और प्रदाता के प्रतिबंध लागू हो सकते हैं।',
  fi: 'Kategoriat tarkistettiin julkisesta valikoimasta; maa- ja tarjoajarajoituksia voi olla.',
};

const mapSnapshotConfig = (keys, config) =>
  Object.fromEntries(keys.map(key => [key.toLowerCase(), config]));

const mixedCasinoSportsConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Ice hockey', 'eSports']
);

const sportsPromoCasinoConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Live games', 'Poker', 'Craps and dice'],
  [
    'Live shows',
    'Live baccarat',
    'Live bingo',
    'Live blackjack',
    'Live dice games',
    'Other live games',
    'Live poker',
    'Live roulette',
  ],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Handball', 'eSports', 'Combat sports']
);

const sportsRewardsCasinoConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'eSports']
);

const casinoToolsConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette']
);

const fragaConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Combat sports']
);

const pinUpConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const pincoConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Combat sports', 'Boxing', 'Martial arts', 'Motorsport']
);

const gamblezenConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const firstConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const browinnerConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Combat sports', 'Boxing', 'Martial arts', 'Motorsport']
);

const goldpariConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Keno', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Combat sports', 'Boxing', 'Martial arts', 'Motorsport']
);

const casinovaConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Ice hockey', 'Handball', 'American football', 'Virtual sports']
);

const onlywinConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const tenBetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Combat sports', 'Motorsport']
);

const oshiCasinoConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live blackjack', 'Other live games', 'Live roulette']
);

const rajabetsConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'eSports', 'Virtual sports', 'Combat sports']
);

const fortunicaConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const clubCasinoSportsConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Ice hockey', 'eSports']
);

const duckyluckConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const slotsAndCasinoConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const lasVegasUsaConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Live games'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const puntConfig = createGamesLiveConfig(['Slots', 'Live games'], ['Other live games']);

const chancedConfig = createGamesLiveConfig(['Slots', 'Live games'], ['Other live games']);

const twentytwoBetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Handball', 'eSports']
);

const oneRedBetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Keno', 'Scratch cards'],
  [],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Handball', 'Baseball', 'eSports', 'Virtual sports']
);

const fourRabetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Cricket', 'Handball', 'eSports']
);

const betwinnerConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'eSports', 'Combat sports']
);

const betoryConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Baseball', 'Cricket', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const betfmConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports']
);

const zarbetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Keno'],
  [],
  ['Football', 'Basketball', 'Tennis', 'Combat sports']
);

const zizobetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'eSports', 'Virtual sports', 'Motorsport']
);

const spinariumConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live poker', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'eSports', 'Virtual sports', 'Motorsport']
);

const spinbetterConfig = createGamesLiveBettingConfig(
  ['Slots', 'Blackjack', 'Bingo', 'Live games', 'Poker', 'Crash games'],
  ['Other live games'],
  ['Football', 'Basketball', 'Tennis', 'Ice hockey', 'eSports', 'Virtual sports', 'Combat sports']
);

const spinbossConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Baseball']
);

const jeetcityConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette']
);

const moonwinConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Lottery', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette']
);

const spinriseConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Lottery', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette']
);

const crowngreenConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette']
);

const leonConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const ggbetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const getxConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Volleyball', 'Ice hockey', 'eSports', 'Virtual sports', 'Motorsport']
);

const westaceConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const wildsinoConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Bingo', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const longfu88Config = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'eSports']
);

const retrobetConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette']
);

const luckyHunterConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live bingo', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Combat sports', 'Motorsport']
);

const hollyWinConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live bingo', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette']
);

const slotMafiaConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette']
);

const nvcasinoConfig = {
  tabs: [
    createSnapshotTab(
      'Games',
      ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Mines'],
      ['Video poker', 'Bingo', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'],
      'The NV Casino lobby currently exposes slots, table games, live casino, poker, mines, jackpots, and specialty game categories.'
    ),
    createSnapshotTab(
      'Live games',
      ['Live roulette', 'Live blackjack', 'Live baccarat', 'Live poker'],
      ['Live shows', 'Live bingo', 'Live dice games', 'Other live games'],
      'Live casino availability can change by region, account, studio, and current lobby configuration.'
    ),
    createSnapshotTab(
      'Betting',
      [
        'Football',
        'Basketball',
        'Tennis',
        'Table tennis',
        'Volleyball',
        'Ice hockey',
        'Cricket',
        'Handball',
        'Darts',
        'Beach volleyball',
        'Cycling',
        'Futsal',
        'Field hockey',
        'eSports',
      ],
      [],
      'The supplied NV Casino routes cover pre-match, live sports, football tournaments, outrights, and esports markets.'
    ),
  ],
};

const aureonConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live roulette']
);

const fuguConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Live games', 'Crash games'],
  ['Live shows', 'Live blackjack', 'Live poker', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'eSports']
);

const pampasConfig = createGamesLiveBettingConfig(
  ['Slots', 'Jackpot games', 'Live games', 'Crash games'],
  ['Other live games'],
  ['Football']
);

const babu88Config = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Cricket', 'eSports']
);

const kaasinoConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const goldenstarConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'eSports', 'Virtual sports']
);

const goldencrownConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const mrpunterConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'eSports', 'Virtual sports']
);

const spininioConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live poker', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Ice hockey', 'Cricket', 'Baseball', 'eSports', 'Virtual sports', 'Combat sports']
);

const betonCasinoConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette']
);

const betonSportConfig = createBettingConfig([
  'Football',
  'Basketball',
  'Tennis',
  'Ice hockey',
  'eSports',
  'Combat sports',
]);

const slottConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const twinConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const winairlinesConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Keno', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'eSports', 'Virtual sports', 'Combat sports']
);

const velobetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live bingo', 'Live blackjack', 'Live dice games', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'eSports', 'Virtual sports', 'Combat sports', 'Motorsport']
);

const spinkoConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Ice hockey', 'eSports', 'Virtual sports']
);

const mostbetConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Combat sports', 'Boxing', 'Martial arts']
);

const dazardConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Other live games', 'Live roulette', 'Live poker'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports']
);

const billyBillionConfig = createGamesLiveConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
  ['Live baccarat', 'Live blackjack', 'Other live games', 'Live poker', 'Live roulette']
);

// Verified casino categories and slot collections; these are not title counts.
const BETONWIN_GAMES = ['Slots','Roulette','Blackjack','Baccarat','Jackpot games','Live games','Poker','Crash games','Bonus buy','Hold and Win','Megaways','Drops & Wins'];
const BETONWIN_LIVE_GAMES = ['Live baccarat','Live roulette','Live blackjack','Live poker','Live shows','Other live games','Spanish-language tables','VIP live casino'];
// Compared with the standard Snapshot categories. Gray entries mean no dedicated
// category in the Argentine lobby we reviewed, not that individual games are absent.
const BETONWIN_GAMES_NOT_LISTED = ['Video poker','Bingo','Keno','Scratch cards'];
const BETONWIN_LIVE_GAMES_NOT_LISTED = ['Live bingo','Live dice games'];
const betonwinExtraGameKeys = ['Bonus buy','Hold and Win','Megaways','Drops & Wins','Spanish-language tables','VIP live casino'];
const betonwinGameNames = {
  en:['Bonus buy','Hold and Win','Megaways','Drops & Wins','Spanish-language tables','VIP live casino'],
  de:['Bonuskauf','Hold and Win','Megaways','Drops & Wins','Spanischsprachige Tische','VIP-Live-Casino'],
  es:['Compra de bono','Hold and Win','Megaways','Drops & Wins','Mesas en español','Casino en vivo VIP'],
  it:['Acquisto bonus','Hold and Win','Megaways','Drops & Wins','Tavoli in spagnolo','Casinò live VIP'],
  pl:['Zakup bonusu','Hold and Win','Megaways','Drops & Wins','Stoły po hiszpańsku','Kasyno na żywo VIP'],
  uk:['Купівля бонусу','Hold and Win','Megaways','Drops & Wins','Іспаномовні столи','VIP live-казино'],
  pt:['Compra de bónus','Hold and Win','Megaways','Drops & Wins','Mesas em espanhol','Casino ao vivo VIP'],
  fr:['Achat de bonus','Hold and Win','Megaways','Drops & Wins','Tables en espagnol','Casino en direct VIP'],
  hi:['बोनस खरीद','Hold and Win','Megaways','Drops & Wins','स्पेनिश भाषा की टेबल','VIP लाइव कैसीनो'],
  fi:['Bonuksen osto','Hold and Win','Megaways','Drops & Wins','Espanjankieliset pöydät','VIP-livekasino'],
};
const BETONWIN_GAME_LABELS = Object.fromEntries(Object.entries(betonwinGameNames).map(([lang,values])=>[lang,Object.fromEntries(betonwinExtraGameKeys.map((key,i)=>[key,values[i]]))]));

// Confirmed in the ARS account's prematch navigation, 2026-11-20.
// Politics and Other are betting sections, not sports disciplines.
const BETONWIN_SPORTS = ['Football','Basketball','Tennis','Darts','eSports','Baseball','Handball','Futsal','Ice hockey','Volleyball','Boxing','Table tennis','Cricket','MMA','Badminton','Snooker','Motorsport','Biathlon','American football','Rugby','Chess'];
export const BETONWIN_SPECIAL_MARKETS = ['Politics','Other'];
const betonwinSportNames = {
en:'Soccer|Basketball|Tennis|Darts|Esports|Baseball|Handball|Futsal|Ice hockey|Volleyball|Boxing|Table tennis|Cricket|MMA|Badminton|Snooker|Motorsports|Biathlon|American football|Rugby|Chess|Politics|Other',
de:'Fußball|Basketball|Tennis|Darts|E-Sport|Baseball|Handball|Futsal|Eishockey|Volleyball|Boxen|Tischtennis|Cricket|MMA|Badminton|Snooker|Motorsport|Biathlon|American Football|Rugby|Schach|Politik|Sonstige',
es:'Fútbol|Básquet|Tenis|Dardos|Esports|Béisbol|Balonmano|Futsal|Hockey sobre hielo|Vóley|Boxeo|Tenis de mesa|Críquet|MMA|Bádminton|Snooker|Automovilismo y motociclismo|Biatlón|Fútbol americano|Rugby|Ajedrez|Política|Otros',
it:'Calcio|Basket|Tennis|Freccette|Esport|Baseball|Pallamano|Calcio a 5|Hockey su ghiaccio|Pallavolo|Pugilato|Tennis tavolo|Cricket|MMA|Badminton|Snooker|Motori|Biathlon|Football americano|Rugby|Scacchi|Politica|Altro',
pl:'Piłka nożna|Koszykówka|Tenis|Dart|Esport|Baseball|Piłka ręczna|Futsal|Hokej na lodzie|Siatkówka|Boks|Tenis stołowy|Krykiet|MMA|Badminton|Snooker|Sporty motorowe|Biathlon|Futbol amerykański|Rugby|Szachy|Polityka|Inne',
uk:'Футбол|Баскетбол|Теніс|Дартс|Кіберспорт|Бейсбол|Гандбол|Футзал|Хокей|Волейбол|Бокс|Настільний теніс|Крикет|MMA|Бадмінтон|Снукер|Авто- й мотоспорт|Біатлон|Американський футбол|Регбі|Шахи|Політика|Інше',
pt:'Futebol|Basquetebol|Ténis|Dardos|Desportos eletrónicos|Basebol|Andebol|Futsal|Hóquei no gelo|Voleibol|Boxe|Ténis de mesa|Críquete|MMA|Badminton|Snooker|Desportos motorizados|Biatlo|Futebol americano|Râguebi|Xadrez|Política|Outros',
fr:'Football|Basket|Tennis|Fléchettes|Esport|Baseball|Handball|Futsal|Hockey sur glace|Volley|Boxe|Tennis de table|Cricket|MMA|Badminton|Snooker|Sports mécaniques|Biathlon|Football américain|Rugby|Échecs|Politique|Autres',
hi:'फ़ुटबॉल|बास्केटबॉल|टेनिस|डार्ट्स|ईस्पोर्ट्स|बेसबॉल|हैंडबॉल|फ़ुटसाल|आइस हॉकी|वॉलीबॉल|मुक्केबाज़ी|टेबल टेनिस|क्रिकेट|MMA|बैडमिंटन|स्नूकर|मोटरस्पोर्ट्स|बायथलॉन|अमेरिकी फ़ुटबॉल|रग्बी|शतरंज|राजनीति|अन्य',
fi:'Jalkapallo|Koripallo|Tennis|Darts|E-urheilu|Baseball|Käsipallo|Futsal|Jääkiekko|Lentopallo|Nyrkkeily|Pöytätennis|Kriketti|MMA|Sulkapallo|Snooker|Moottoriurheilu|Ampumahiihto|Amerikkalainen jalkapallo|Rugby|Shakki|Politiikka|Muut',
};
const betonwinBettingCategories=[...BETONWIN_SPORTS,...BETONWIN_SPECIAL_MARKETS];
const BETONWIN_SPORT_LABELS=Object.fromEntries(Object.entries(betonwinSportNames).map(([lang,text])=>{
 const values=text.split('|');
 if(values.length!==betonwinBettingCategories.length)throw Error('Incomplete sports labels: '+lang);
 return [lang,Object.fromEntries(betonwinBettingCategories.map((key,i)=>[key,values[i]]))];
}));

const magneticCollections = ['Instant win', 'Original games', 'Bonus buy', 'Book slots', 'Table games', 'New games', 'Top games'];
const magneticCollectionLabels = {
  de: 'Schnellspiele|Hauseigene Spiele|Bonuskauf|Book-Slots|Tischspiele|Neue Spiele|Beliebte Spiele',
  es: 'Juegos instantáneos|Juegos originales|Compra de bono|Tragamonedas de la serie Book|Juegos de mesa|Novedades|Juegos populares',
  it: 'Giochi istantanei|Giochi originali|Acquisto del bonus|Slot della serie Book|Giochi da tavolo|Nuovi giochi|Giochi popolari',
  pl: 'Gry błyskawiczne|Gry autorskie|Kupno rundy bonusowej|Automaty typu Book|Gry stołowe|Nowe gry|Popularne gry',
  uk: 'Миттєві ігри|Ігри Magnetic Slots|Купівля бонусу|Слоти серії Book|Настільні ігри|Нові ігри|Популярні ігри',
  pt: 'Jogos instantâneos|Jogos originais|Compra de bónus|Slots da série Book|Jogos de mesa|Jogos novos|Jogos populares',
  fr: 'Jeux instantanés|Jeux originaux|Achat de bonus|Machines à sous de la série Book|Jeux de table|Nouveaux jeux|Jeux populaires',
  hi: 'इंस्टेंट गेम|ओरिजिनल गेम|बोनस राउंड की खरीद|बुक सीरीज़ के स्लॉट|टेबल गेम|नए गेम|लोकप्रिय गेम',
  fi: 'Pikapelit|Kasinon omat pelit|Bonuksen osto|Book-sarjan kolikkopelit|Pöytäpelit|Uudet pelit|Suositut pelit',
};
const magneticCategoryStatuses = {
  en: 'Not listed:', de: 'Nicht aufgeführt:', es: 'No figuran:', it: 'Non presenti nel catalogo:',
  pl: 'Brak w wykazie:', uk: 'Не представлено:', pt: 'Não constam da lista:',
  fr: 'Non répertoriés :', hi: 'सूची में नहीं:', fi: 'Ei listattu:',
};

const kingmakerSportsLabels = ['MMA', 'Rugby', 'Darts', 'Badminton', 'Snooker', 'Futsal', 'Biathlon', 'Chess'];

export const BRAND_SNAPSHOT_CONFIGS = {
  kingmaker: {
    tabs: [
      createSnapshotTab('Games', [
        'Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker',
        'Bonus buy', 'Instant win', 'Table games', 'Bingo', 'Scratch cards', 'Crash games',
        'Keno', 'Video poker', 'Craps and dice',
      ], ['Slingo']),
      createSnapshotTab('Live games', [
        'Live roulette', 'Live blackjack', 'Live baccarat', 'Live poker', 'Live dice games', 'Live shows', 'International tables',
      ], ['Live bingo']),
      createSnapshotTab('Betting', [
        'Football', 'Tennis', 'Table tennis', 'Basketball', 'Ice hockey', 'American football', 'Baseball',
        'Virtual sports', 'Motorsport', 'eSports', 'Volleyball', 'Handball', 'Cricket', 'Boxing', 'Horse racing',
        'MMA', 'Rugby', 'Darts', 'Badminton', 'Snooker', 'Futsal', 'Biathlon',
      ], ['Chess']),
    ],
    notes: { ...publicCatalogueNotes, en: 'Categories from the public catalog. Availability can vary by country and provider.' },
    labels: Object.fromEntries(Object.entries({
      en: ['Instant games', 'Table games', 'International tables'], de: ['Sofortspiele', 'Tischspiele', 'Internationale Tische'],
      es: ['Juegos instantáneos', 'Juegos de mesa', 'Mesas internacionales'], it: ['Giochi istantanei', 'Giochi da tavolo', 'Tavoli internazionali'],
      pl: ['Gry natychmiastowe', 'Gry stołowe', 'Stoły międzynarodowe'], uk: ['Миттєві ігри', 'Настільні ігри', 'Міжнародні столи'],
      pt: ['Jogos instantâneos', 'Jogos de mesa', 'Mesas internacionais'], fr: ['Jeux instantanés', 'Jeux de table', 'Tables internationales'],
      hi: ['इंस्टेंट गेम', 'टेबल गेम', 'अंतरराष्ट्रीय टेबल'], fi: ['Pikapelit', 'Pöytäpelit', 'Kansainväliset pöydät'],
    }).map(([locale, [instant, table, international]]) => [locale, {
      ...BETONWIN_GAME_LABELS[locale],
      ...Object.fromEntries(kingmakerSportsLabels.map(key => [key, BETONWIN_SPORT_LABELS[locale][key]])),
      'Instant win': instant,
      'Table games': table,
      'International tables': international,
      'Not surfaced:': locale === 'en' ? 'Not surfaced:' : magneticCategoryStatuses[locale],
    }])),
  },
  magneticslots: {
    tabs: [
      createCategoryTab('Games', [...GAME_CATEGORIES, ...magneticCollections], [
        'Slots', 'Roulette', 'Blackjack', 'Bingo', 'Jackpot games', 'Live games', 'Scratch cards',
        ...magneticCollections,
      ]),
      createCategoryTab('Live games', LIVE_GAME_CATEGORIES, ['Live roulette', 'Live blackjack', 'Live shows']),
      createSnapshotTab('Betting', ['Football', 'Tennis', 'Basketball', 'Ice hockey', 'Cricket', 'Martial arts', 'eSports', 'Volleyball', 'Baseball', 'Darts', 'Rugby']),
    ],
    notes: { ...publicCatalogueNotes, en: 'Categories from the public catalog. Availability can vary by country and provider.' },
    labels: {
      en: { 'Instant win': 'Instant games', 'Not surfaced:': magneticCategoryStatuses.en },
      ...Object.fromEntries(Object.entries(magneticCollectionLabels).map(([locale, names]) => [locale, {
        ...Object.fromEntries(magneticCollections.map((key, index) => [key, names.split('|')[index]])),
        Darts: BETONWIN_SPORT_LABELS[locale].Darts,
        Rugby: BETONWIN_SPORT_LABELS[locale].Rugby,
        'Not surfaced:': magneticCategoryStatuses[locale],
      }])),
    },
  },
  betonwin: {
    ...createGamesLiveBettingConfig(BETONWIN_GAMES, BETONWIN_LIVE_GAMES, betonwinBettingCategories, {
      games: [...BETONWIN_GAMES, ...BETONWIN_GAMES_NOT_LISTED],
      live: [...BETONWIN_LIVE_GAMES, ...BETONWIN_LIVE_GAMES_NOT_LISTED],
      betting: betonwinBettingCategories,
    }),
    labels: Object.fromEntries(Object.keys(BETONWIN_SPORT_LABELS).map(lang=>[lang,{
      ...BETONWIN_SPORT_LABELS[lang],
      ...BETONWIN_GAME_LABELS[lang],
    }])),
  },
  vegasnow: {
    ...createGamesLiveBettingConfig(
      ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
      ['Live shows', 'Live baccarat', 'Live blackjack', 'Live roulette'],
      ['Football', 'American football', 'Martial arts']
    ),
    notes: {
      en: 'Public lobby categories, not a real-money test. Games, sports and providers can vary by country.',
      uk: 'Категорії з відкритого каталогу, без гри на гроші. Ігри, види спорту та провайдери можуть відрізнятися за країною.',
      de: 'Öffentliche Lobby, kein Echtgeld-Test. Spiele, Sportarten und Anbieter können je nach Land abweichen.',
      es: 'Catálogo público, sin juego con dinero real. Juegos, deportes y proveedores pueden variar según el país.',
      it: 'Catalogo pubblico, senza gioco con denaro reale. Giochi, sport e fornitori possono variare per paese.',
      pl: 'Publiczny katalog, bez gry za prawdziwe pieniądze. Gry, dyscypliny i dostawcy zależą od kraju.',
      pt: 'Catálogo público, sem jogo com dinheiro real. Jogos, desportos e fornecedores podem variar por país.',
      fr: 'Catalogue public, sans jeu en argent réel. Jeux, sports et fournisseurs peuvent varier selon le pays.',
      hi: 'सार्वजनिक सूची पर आधारित; असली पैसे से परीक्षण नहीं। गेम, खेल और प्रदाता देश के अनुसार बदल सकते हैं।',
      fi: 'Julkinen peliaula, ei oikean rahan pelitestiä. Pelit, urheilulajit ja tarjoajat voivat vaihdella maittain.',
    },
  },
  gravira: {
    ...createGamesLiveConfig(
      ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Scratch cards', 'Crash games'],
      ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Other live games', 'Live roulette']
    ),
    notes: {
      "pl": "Kategorie z publicznego katalogu, bez gry za prawdziwe pieniądze. Gry i dostawcy mogą się zmieniać; obowiązują warunki konta i ograniczenia regionalne.",
      "fi": "Luokat perustuvat julkiseen valikoimaan, eivät oikean rahan pelitestiin. Pelit ja toimittajat voivat vaihtua; tilin ehdot ja alueelliset rajoitukset ovat voimassa.",
      "hi": "श्रेणियाँ सार्वजनिक गेम सूची पर आधारित हैं, असली पैसे से खेलकर नहीं जाँची गईं। गेम और प्रदाता बदल सकते हैं; खाते और क्षेत्र की शर्तें लागू हैं।",
      "fr": "Catégories du catalogue public, sans essai avec de l’argent réel. Jeux et fournisseurs peuvent changer ; les règles du compte et de la région restent applicables.",
      "pt": "Categorias do catálogo público, sem teste com dinheiro real. Jogos e fornecedores podem mudar; aplicam-se as regras da conta e da região.",
      "de": "Kategorien aus dem öffentlichen Katalog, kein Echtgeld-Spieltest. Spiele und Anbieter können wechseln; Konto- und Länderregeln gelten weiterhin.",
      "es": "Categorías del catálogo público, sin prueba de juego con dinero real. Juegos y proveedores pueden cambiar; se aplican las reglas de cuenta y región.",
      "it": "Categorie del catalogo pubblico, senza prova di gioco con denaro reale. Giochi e fornitori possono cambiare; valgono condizioni del conto e restrizioni regionali.",
      "en": "Public catalogue categories, not a real-money gameplay test. Games and providers can change; availability remains subject to account and regional rules.",
      "uk": "Категорії з відкритого каталогу, без тестової гри на гроші. Ігри та провайдери можуть змінюватися; діють правила акаунта й регіональні обмеження."
    },
  },
  'national-casino': {
    ...createGamesLiveBettingConfig(
      ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
      ['Live shows', 'Live baccarat', 'Live blackjack', 'Live poker', 'Live roulette'],
      ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Baseball', 'Handball', 'American football', 'eSports', 'Boxing', 'Martial arts']
    ),
    notes: {
      "fi": "Kategoriat tarkistettiin julkisesta peliluettelosta; maa- ja tarjoajarajoituksia voi olla. Ei vedonlyöntiä Australiassa.",
      "hi": "सार्वजनिक सूची में जाँचे गए प्रकार; देश और प्रदाता के प्रतिबंध लागू हो सकते हैं। ऑस्ट्रेलिया में स्पोर्ट्स बेटिंग उपलब्ध नहीं है।",
      "pt": "Categorias verificadas no catálogo público; possíveis restrições de país e fornecedor. Sem apostas desportivas na Austrália.",
      "fr": "Catégories vérifiées dans le catalogue public ; restrictions de pays et de fournisseur possibles. Pas de paris sportifs en Australie.",
      "it": "Categorie verificate nel catalogo pubblico; possibili restrizioni per paese e fornitore. Scommesse sportive non disponibili in Australia.",
      "pl": "Kategorie sprawdzone w publicznym katalogu; możliwe ograniczenia kraju i dostawcy. Zakłady sportowe niedostępne w Australii.",
      "de": "Kategorien aus dem öffentlichen Katalog; Länder- und Anbieterbeschränkungen sind möglich. Keine Sportwetten in Australien.",
      "es": "Categorías revisadas en el catálogo público; pueden aplicarse restricciones de país y proveedor. Sin apuestas deportivas en Australia.",
      "en": "Categories checked in the public catalogue; country and provider restrictions may apply. Sports betting is unavailable in Australia.",
      "uk": "Категорії перевірені у відкритому каталозі; можливі обмеження за країною та провайдером. Ставки на спорт недоступні в Австралії."
    },
  },
  '20bet': {
    ...createGamesLiveBettingConfig(
      ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
      ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Live poker', 'Live roulette'],
      ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Combat sports', 'Boxing', 'Martial arts', 'Motorsport']
    ),
    notes: {
      en: 'Categories checked in the public catalogue; country and provider restrictions may apply.',
      de: 'Kategorien aus dem öffentlichen Katalog; Länder- und Anbieterbeschränkungen sind möglich.',
      es: 'Categorías revisadas en el catálogo público; pueden aplicarse restricciones de país y proveedor.',
      it: 'Categorie verificate nel catalogo pubblico; possono esserci restrizioni per paese e fornitore.',
      pl: 'Kategorie sprawdzone w publicznym katalogu; możliwe ograniczenia kraju i dostawcy.',
      uk: 'Категорії перевірені у відкритому каталозі; можливі обмеження за країною та провайдером.',
      pt: 'Categorias verificadas no catálogo público; podem aplicar-se restrições de país e fornecedor.',
      fr: 'Catégories vérifiées dans le catalogue public ; restrictions de pays et de fournisseur possibles.',
      hi: 'सार्वजनिक सूची में जाँचे गए प्रकार; देश और प्रदाता के प्रतिबंध लागू हो सकते हैं।',
      fi: 'Kategoriat tarkistettiin julkisesta peliluettelosta; maa- ja tarjoajarajoituksia voi olla.',
    },
  },
  planbet: {
    ...createGamesLiveBettingConfig(
      ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Crash games'],
      ['Live shows', 'Live baccarat', 'Live bingo', 'Live blackjack', 'Live dice games', 'Live poker', 'Live roulette'],
      ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'eSports', 'Combat sports']
    ),
    notes: {
      en: 'Categories checked in the public lobby; access can vary by country and provider.',
      de: 'Kategorien aus der öffentlichen Lobby; der Zugang kann je nach Land und Anbieter variieren.',
      es: 'Categorías revisadas en el catálogo público; el acceso varía según el país y el proveedor.',
      it: 'Categorie verificate nel catalogo pubblico; l’accesso varia secondo paese e fornitore.',
      pl: 'Kategorie sprawdzone w publicznym katalogu; dostęp zależy od kraju i dostawcy.',
      uk: 'Категорії перевірені у відкритому каталозі; доступ залежить від країни й провайдера.',
      pt: 'Categorias verificadas no catálogo público; o acesso depende do país e do fornecedor.',
      fr: 'Catégories vérifiées dans le catalogue public ; l’accès dépend du pays et du fournisseur.',
      hi: 'श्रेणियाँ सार्वजनिक गेम सूची में जाँची गई हैं; उपलब्धता देश और प्रदाता पर निर्भर है।',
      fi: 'Kategoriat tarkistettiin julkisesta peliaulasta; saatavuus riippuu maasta ja tarjoajasta.',
    },
  },
  casinado: {
    tabs: [
      createCategoryTab('Games', GAME_CATEGORIES, ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Craps and dice', 'Keno', 'Scratch cards', 'Crash games'], 'These are the main game categories currently visible in the account.'),
      createCategoryTab('Live games', LIVE_GAME_CATEGORIES, ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Live roulette'], 'These are the live-dealer categories currently visible in the account.'),
      createSnapshotTab('Betting', ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Boxing', 'Martial arts', 'Motorsport', 'Horse racing'], [], 'These are the main betting categories currently visible in the account.'),
    ],
  },
  vikingluck: createGamesLiveBettingConfig(
    ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker'],
    ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Live poker', 'Live roulette'],
    ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Ice hockey', 'Baseball', 'American football', 'Virtual sports']
  ),
  viperwin: createGamesLiveBettingConfig(
    ['Slots', 'Roulette', 'Blackjack', 'Video poker', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Keno', 'Crash games'],
    ['Live shows', 'Live baccarat', 'Live blackjack', 'Live dice games', 'Live poker', 'Live roulette'],
    ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Ice hockey', 'Baseball', 'American football', 'Virtual sports']
  ),
  silverplay: {
    tabs: [
      createSnapshotTab('Games', ['Slots', 'Jackpot games', 'Scratch cards', 'Live games'], [], 'These are the main game categories currently visible in the account.'),
      createSnapshotTab('Live games', ['Live shows', 'Live baccarat', 'Live blackjack', 'Live poker', 'Live roulette'], [], 'These are the live-dealer categories currently visible in the account.'),
      createSnapshotTab('Betting', ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'Cricket', 'Baseball', 'Handball', 'American football', 'eSports', 'Virtual sports', 'Boxing', 'Martial arts', 'Motorsport'], [], 'These are the main betting categories currently visible in the account.'),
    ],
  },
  ...mapSnapshotConfig(['trino', 'spellwin'], mixedCasinoSportsConfig),
  ...mapSnapshotConfig(['amonbet', 'luckywave', 'slotlair'], sportsPromoCasinoConfig),
  ...mapSnapshotConfig(['ybets', 'immerion'], sportsRewardsCasinoConfig),
  ...mapSnapshotConfig(['goldenbet-uk', 'goldenbet-au'], sportsRewardsCasinoConfig),
  ...mapSnapshotConfig(['bcgame'], sportsRewardsCasinoConfig),
  ...mapSnapshotConfig(['casinobossy'], sportsPromoCasinoConfig),
  ...mapSnapshotConfig(['winolot', 'grandwin', 'felicebet'], sportsPromoCasinoConfig),
  ...mapSnapshotConfig(['iwild', 'snatch'], casinoToolsConfig),
  ...mapSnapshotConfig(['fraga-tr', 'fraga-az', 'fraga-ar', 'fraga-cl'], fragaConfig),
  'pin-up': pinUpConfig,
  pinco: {
    ...pincoConfig,
    notes: publicCatalogueNotes,
  },
  gamblezen: gamblezenConfig,
  first: firstConfig,
  browinner: browinnerConfig,
  goldpari: goldpariConfig,
  casinova: casinovaConfig,
  onlywin: onlywinConfig,
  '10bet': tenBetConfig,
  'oshi-casino': oshiCasinoConfig,
  rajabets: rajabetsConfig,
  ...mapSnapshotConfig(['fortunica-es', 'fortunica-nl', 'fortunica-uk'], fortunicaConfig),
  ...mapSnapshotConfig(['justcasino', 'letslucky', 'luckydreams', 'luckyones', 'lukki'], clubCasinoSportsConfig),
  yepcasino: clubCasinoSportsConfig,
  duckyluck: duckyluckConfig,
  slotsandcasino: slotsAndCasinoConfig,
  lasvegasusa: lasVegasUsaConfig,
  punt: puntConfig,
  chanced: chancedConfig,
  '22bet': twentytwoBetConfig,
  '1redbet': oneRedBetConfig,
  '4rabet': fourRabetConfig,
  betwinner: betwinnerConfig,
  betory: betoryConfig,
  ...mapSnapshotConfig(['betfm-ke', 'betfm-ng'], betfmConfig),
  zarbet: zarbetConfig,
  zizobet: zizobetConfig,
  spinarium: spinariumConfig,
  spinbetter: spinbetterConfig,
  spinboss: spinbossConfig,
  jeetcity: jeetcityConfig,
  moonwin: moonwinConfig,
  spinrise: spinriseConfig,
  crowngreen: crowngreenConfig,
  leon: leonConfig,
  ggbet: ggbetConfig,
  getx: getxConfig,
  westace: westaceConfig,
  wildsino: wildsinoConfig,
  longfu88: longfu88Config,
  retrobet: retrobetConfig,
  luckyhunter: luckyHunterConfig,
  hollywin: hollyWinConfig,
  slotmafia: slotMafiaConfig,
  nvcasino: nvcasinoConfig,
  aureon: aureonConfig,
  fugu: fuguConfig,
  pampas: pampasConfig,
  babu88: babu88Config,
  kaasino: kaasinoConfig,
  goldenstar: goldenstarConfig,
  goldencrown: goldencrownConfig,
  mrpunter: mrpunterConfig,
  spininio: spininioConfig,
  beton: betonCasinoConfig,
  'beton-sport': betonSportConfig,
  slott: slottConfig,
  twin: twinConfig,
  winairlines: winairlinesConfig,
  velobet: velobetConfig,
  spinko: spinkoConfig,
  mostbet: mostbetConfig,
  dazard: dazardConfig,
  billybillion: billyBillionConfig,
};
