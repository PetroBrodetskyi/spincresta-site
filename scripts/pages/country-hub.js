const normalize = value => value.toLowerCase().normalize('NFD')
  .replace(/(\p{Script=Latin})\p{M}+/gu, '$1')
  .normalize('NFC').replace(/[\p{P}\p{Z}]+/gu, ' ').trim();

export function countryMatches(query, ...names) {
  const searchable = normalize(names.join(' '));
  return normalize(query).split(/\s+/).every(term => searchable.includes(term));
}

export function initCountryHub(doc = document) {
  const grid = doc.querySelector('[data-country-hub-grid]');
  const search = doc.querySelector('[data-country-hub-search]');
  const input = search?.querySelector('input[type="search"]');
  if (!grid || !input) return;
  const cards = [...grid.querySelectorAll('[data-country-keywords]')].map(tile =>
    ({ tile, label: tile.textContent.trim(), keywords: tile.dataset.countryKeywords }));
  const empty = doc.querySelector('[data-country-hub-empty]');
  const update = () => {
    let found = false;
    for (const { tile, label, keywords } of cards) {
      tile.hidden = !countryMatches(input.value, label, keywords);
      found ||= !tile.hidden;
    }
    if (empty) empty.hidden = found;
  };
  input.addEventListener('input', update);
  search.hidden = false;
  update();
}
