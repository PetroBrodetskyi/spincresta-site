const DEFAULT_MODERATION_ENDPOINT = 'https://api.spincresta.com/api/moderation-reviews';

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
  const moderatorLink = document.querySelector('[data-moderator-link]');
  if (!moderatorLink) return;

  const checkAccess = async () => {
    moderatorLink.hidden = true;
    const account = await waitForAccount();
    if (!account?.getState().signedIn) return;

    const token = await account.getAccessToken();
    if (!token) return;

    try {
      const endpoint = document.documentElement.dataset.moderationEndpoint
        || DEFAULT_MODERATION_ENDPOINT;
      const response = await fetch(`${endpoint}?status=pending&limit=1`, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      moderatorLink.hidden = !response.ok;
    } catch {
      moderatorLink.hidden = true;
    }
  };

  await checkAccess();
  window.addEventListener('spincresta:account-state', () => {
    checkAccess().catch(() => {});
  });
};
