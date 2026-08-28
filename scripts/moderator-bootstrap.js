import { initModeratorPage } from './pages/moderator.js?v=20260828-review-editing-3';

const startModerator = () => {
  initModeratorPage().catch(() => {
    const loading = document.querySelector('[data-moderator-loading]');
    const access = document.querySelector('[data-moderator-access]');
    if (loading) loading.hidden = true;
    if (access) {
      access.hidden = false;
      const message = access.querySelector('p');
      if (message) message.textContent = 'The moderation workspace could not be loaded. Please refresh the page.';
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startModerator, { once: true });
} else {
  startModerator();
}
