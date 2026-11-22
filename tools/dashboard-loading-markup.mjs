const line = (size = '') => `<span class="dashboard-skeleton-line${size ? ` is-${size}` : ''}"></span>`;
const escapeText = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const rows = () => Array.from({ length: 3 }, () =>
  `<div class="dashboard-skeleton-row">${line('avatar')}<div>${line('medium')}${line('long')}</div>${line('chip')}</div>`
).join('');

export function dashboardLoading(hook, label, { account = false, hidden = false } = {}) {
  const profile = account ? `<div data-account-loading-preview="profile">
    <div class="account-panel">${line('heading')}<div class="dashboard-skeleton-row">${line('avatar')}<div>${line('medium')}${line('long')}</div></div><div class="dashboard-skeleton-facts">${line('field')}${line('field')}${line('field')}</div></div>
    <div class="account-panel">${line('heading')}${line('long')}<div class="dashboard-skeleton-facts">${line('field')}${line('field')}${line('field')}</div>${line('chip')}</div>
  </div>` : '';
  return `<div class="dashboard-skeleton" ${hook}${hidden ? ' hidden' : ''} role="status">
    <span class="dashboard-skeleton-status">${escapeText(label)}</span>
    <div aria-hidden="true">${profile}<div class="dashboard-skeleton-list${account ? ' account-panel' : ''}"${account ? ' data-account-loading-preview="list"' : ''}>${rows()}</div></div>
  </div>`;
}
