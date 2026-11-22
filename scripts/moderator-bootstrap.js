import { initModeratorPage } from './pages/moderator.js?v=20261122-moderator-contacts';

const startModerator = () => {
  initModeratorPage().catch(() => {
    const access = document.querySelector('[data-moderator-access]');
    document.querySelectorAll('[data-moderator-panel]').forEach(panel => { panel.hidden = true; });
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
