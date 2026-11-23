// Observed without transacting in one signed-in EUR test account.
// "icon" points to an existing SpinCresta asset; multiple networks share an icon.
const payments = [
  ['Visa', 'visa', true, true],
  ['MasterCard', 'mastercard', true, true],
  ['Google Pay', 'googlepay', true, false],
  ['Open Banking', 'banktransfer', true, true],
  ['SEPA', 'banktransfer', false, true],
  ['Bitcoin', 'bitcoin', true, true],
  ['Ethereum', 'ethereum', true, true],
  ['TRON', 'tron', true, true],
  ['Dogecoin', 'dogecoin', true, true],
  ['XRP', null, true, true],
  ['Binance Coin BSC', null, true, true],
  ['Tether on BSC', 'tether', true, true],
  ['Tether on Ethereum', 'tether', true, true],
  ['Tether on Tron', 'tether', true, true],
  ['Litecoin', 'litecoin', true, true],
  ['USD Coin on Ethereum', 'usdc', true, true],
  ['Cosmos Atom', null, true, true],
  ['Cardano', 'cardano', true, true],
  ['Solana', 'solana', true, true],
  ['Tether on Solana', 'tether', true, true],
  ['USD Coin on Solana', 'usdc', true, true],
  ['Polygon', null, true, true],
  ['SHIBA INU on BSC', null, true, false],
  ['DigiByte', null, true, false],
  ['Bitcoin Cash', 'bitcoincash', true, false],
  ['QTUM', null, true, false],
  ['Dash', null, true, false],
  ['Ethereum on Optimism', 'ethereum', true, false],
  ['Tether on Optimism', 'tether', true, true],
  ['USD Coin on Optimism', 'usdc', true, true],
  ['Bridged USD Coin on Optimism', 'usdc', true, false],
  ['SHIBA INU on Ethereum', null, true, false],
  ['Stellar', null, true, true],
  ['Algorand', null, true, false],
  ['Tether on POL', 'tether', true, true],
];

export const paymentIcons = [...new Set(payments.map(([, icon]) => icon).filter(Boolean))];
export const depositCount = payments.filter(([, , deposit]) => deposit).length;
export const withdrawalCount = payments.filter(([, , , withdraw]) => withdraw).length;
export const paymentGroups = [
  payments.filter(([, , deposit, withdraw]) => deposit && withdraw),
  payments.filter(([, , deposit, withdraw]) => deposit && !withdraw),
  payments.filter(([, , deposit, withdraw]) => !deposit && withdraw),
].map(group => group.map(([name]) => name));

// Tier name, XP threshold, experience rate, cashback rate, optional upper rate.
export const vipRows = [
  ['Copper', null, 100, .05],
  ['Bronze', 300000, 150, .06],
  ['Silver', 1000000, 200, .07],
  ['Golden', 2000000, 250, .08],
  ['Ruby', 5000000, 300, .09],
  ['Sapphire', 15000000, 350, .10],
  ['Diamond', 25000000, 400, .11],
  ['VIP Status', 75000000, 450, .0005, .0025],
];
