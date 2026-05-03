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
  'eSports',
  'Virtual sports',
  'Combat sports',
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

const createGamesLiveBettingConfig = (gamesAvailable, liveAvailable, bettingAvailable) => ({
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
    createCategoryTab(
      'Betting',
      BETTING_CATEGORIES,
      bettingAvailable,
      'These are the main betting categories currently visible in the account.'
    ),
  ],
});

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

const leonConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Bingo', 'Baccarat', 'Jackpot games', 'Live games', 'Poker', 'Crash games'],
  ['Live shows', 'Live baccarat', 'Live blackjack', 'Live poker', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'Table tennis', 'Volleyball', 'Ice hockey', 'eSports', 'Virtual sports', 'Motorsport']
);

const fuguConfig = createGamesLiveBettingConfig(
  ['Slots', 'Roulette', 'Blackjack', 'Baccarat', 'Live games', 'Crash games'],
  ['Live shows', 'Live blackjack', 'Live poker', 'Other live games', 'Live roulette'],
  ['Football', 'Basketball', 'Tennis', 'eSports']
);

export const BRAND_SNAPSHOT_CONFIGS = {
  ...mapSnapshotConfig(['trino', 'spellwin'], mixedCasinoSportsConfig),
  ...mapSnapshotConfig(['amonbet', 'luckywave', 'slotlair'], sportsPromoCasinoConfig),
  ...mapSnapshotConfig(['ybets', 'immerion'], sportsRewardsCasinoConfig),
  ...mapSnapshotConfig(['iwild', 'snatch'], casinoToolsConfig),
  ...mapSnapshotConfig(['fraga-tr', 'fraga-az', 'fraga-ar', 'fraga-cl'], fragaConfig),
  'pin-up': pinUpConfig,
  ...mapSnapshotConfig(['fortunica-es', 'fortunica-nl', 'fortunica-uk'], fortunicaConfig),
  ...mapSnapshotConfig(['justcasino', 'letslucky', 'luckydreams', 'luckyones', 'lukki'], clubCasinoSportsConfig),
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
  zarbet: zarbetConfig,
  zizobet: zizobetConfig,
  spinarium: spinariumConfig,
  leon: leonConfig,
  fugu: fuguConfig,
};
