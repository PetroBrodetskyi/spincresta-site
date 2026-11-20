const normalize = value => value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim();

export function catalogMatch(name, type, query, filter) {
  return (filter === 'all' || type === filter || type === 'casino-betting') &&
    normalize(query).split(/\s+/).every(term => normalize(name).includes(term));
}

export function initCatalogDirectory(doc = document) {
  const root = doc.querySelector('.catalog-directory');
  const input = root?.querySelector('[data-catalog-query]');
  if (!input) return;
  const filters = [...root.querySelectorAll('#typeFilters [data-filter]')];
  const groups = [...root.querySelectorAll('section[id^="letter-"]')];
  const letters = [...root.querySelectorAll('.alpha-nav a')];
  const empty = root.querySelector('[data-catalog-empty]');
  let activeFilter = 'all';

  const lists = groups.map(section => ({
    section, rows: [...section.querySelectorAll('.casino-list-row')].map(row => ({
      row, name: row.querySelector('.casino-name')?.textContent.trim() || '', type: row.dataset.type,
    })),
  }));

  function update() {
    const query = input.value;
    const visibleGroups = new Set();
    for (const { section, rows } of lists) {
      for (const { row, name, type } of rows) {
        row.hidden = !catalogMatch(name, type, query, activeFilter);
        if (!row.hidden) visibleGroups.add(section.id);
      }
      section.hidden = !visibleGroups.has(section.id);
    }
    for (const letter of letters) {
      if (visibleGroups.has(letter.hash.slice(1))) letter.removeAttribute('aria-disabled');
      else letter.setAttribute('aria-disabled', 'true');
    }
    for (const button of filters) {
      const active = button.dataset.filter === activeFilter;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    }
    if (empty) empty.hidden = visibleGroups.size > 0;
  }

  input.addEventListener('input', update);
  filters.forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.filter;
    update();
  }));
  letters.forEach(link => link.addEventListener('click', event => {
    if (link.getAttribute('aria-disabled') === 'true') event.preventDefault();
  }));
  update();
}
