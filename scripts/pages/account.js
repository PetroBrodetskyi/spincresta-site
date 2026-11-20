import { initSectionNavigation } from '../section-navigation.js?v=20261119-catalog-partners';

const DEFAULT_MODERATION_ENDPOINT = 'https://api.spincresta.com/api/moderation-reviews';

const ACCOUNT_SECTIONS = new Set(['profile', 'favorites', 'reviews', 'support']);
const LEGACY_SECTIONS = new Map([
  ['account-overview-title', 'profile'],
  ['account-favorites-title', 'favorites'],
  ['account-review-history-title', 'reviews'],
]);

export function getAccountSection(hash) {
  const target = hash.replace(/^#/, '');
  return ACCOUNT_SECTIONS.has(target) ? target : LEGACY_SECTIONS.get(target) || 'profile';
}

function initAccountNavigation() {
  const root = document.querySelector('.account-dashboard[data-account-page]');
  if (!root) return;
  const signedIn = root.querySelector('[data-account-page-signed-in]');
  const signedOut = root.querySelector('[data-account-page-signed-out]');
  initSectionNavigation(root, {
    name: 'account',
    resolve: getAccountSection,
    focusTarget: (section, panel) => section === 'support' || !signedIn?.hidden
      ? panel
      : signedOut?.hidden ? null : signedOut,
  });
}

const waitForAccount = () => {
  if (window.SpinCrestaAccount) return Promise.resolve(window.SpinCrestaAccount);

  return new Promise(resolve => {
    const timeout = window.setTimeout(() => resolve(null), 10000);
    window.addEventListener('spincresta:account-ready', () => {
      window.clearTimeout(timeout);
      resolve(window.SpinCrestaAccount || null);
    }, { once: true });
  });
};

export const initAccountPage = async () => {
  initAccountNavigation();
  const moderatorLink = document.querySelector('[data-moderator-link]');
  if (!moderatorLink) return;

  let accessRequest = 0;
  const checkAccess = async () => {
    const request = ++accessRequest;
    moderatorLink.hidden = true;
    const account = await waitForAccount();
    if (request !== accessRequest || !account?.getState().signedIn) return;

    try {
      const token = await account.getAccessToken();
      if (!token || request !== accessRequest) return;
      const endpoint = document.documentElement.dataset.moderationEndpoint
        || DEFAULT_MODERATION_ENDPOINT;
      const response = await fetch(`${endpoint}?status=pending&limit=1`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (request === accessRequest) moderatorLink.hidden = !response.ok || !account.getState().signedIn;
    } catch {
      if (request === accessRequest) moderatorLink.hidden = true;
    }
  };

  window.addEventListener('spincresta:account-state', () => {
    checkAccess().catch(() => {});
  });
  await checkAccess();
};
