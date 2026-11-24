import { providerDirectoryKey } from '../provider-directory-key.js';

export const matchesProvider = (row, query, category) =>
  (category === 'all' || row.types.includes(category)) && (!query || row.search.includes(query));

export function initGameProviderDirectory(root) {
  if (!root) return;
  const doc = root.ownerDocument;
  const win = doc.defaultView;
  const query = root.querySelector('[data-provider-query]');
  const type = root.querySelector('[data-provider-category]');
  const count = root.querySelector('[data-provider-count]');
  const empty = root.querySelector('[data-provider-empty]');
  const rows = [...root.querySelectorAll('[data-provider-result]')].map(element => ({
    element, types: element.dataset.providerTypes.split(' '), search: element.dataset.providerSearch,
  }));
  const number = new Intl.NumberFormat(doc.documentElement.lang || 'en');
  const update = () => {
    const needle = providerDirectoryKey(query.value);
    let visible = 0;
    for (const row of rows) {
      const show = matchesProvider(row, needle, type.value);
      row.element.hidden = !show;
      if (show) visible++;
    }
    count.textContent = number.format(visible);
    empty.hidden = visible !== 0;
  };
  const revealProvider = () => {
    if (!/^#provider-[a-z0-9]+$/.test(win.location.hash)) return;
    const target = doc.getElementById(win.location.hash.slice(1));
    if (!target?.hasAttribute('data-provider-result')) return;
    if (target.hidden) {
      query.value = '';
      type.value = 'all';
      update();
    }
    win.requestAnimationFrame(() => {
      const headerBottom = doc.querySelector('.header')?.getBoundingClientRect().bottom || 0;
      win.scrollBy({ top: target.getBoundingClientRect().top - headerBottom - 12, behavior: 'instant' });
    });
  };
  query.addEventListener('input', update);
  type.addEventListener('change', update);
  win.addEventListener('hashchange', revealProvider);
  root.querySelector('[data-provider-controls]').hidden = false;
  update();
  revealProvider();
}

if (typeof document !== 'undefined') initGameProviderDirectory(document.querySelector('[data-provider-directory]'));
