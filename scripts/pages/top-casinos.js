// Top-casinos module. Loaded only on body[data-page="top-casinos"].
import { bindCompactCountryCloud } from '../country-cloud.js?v=20261122-market-cloud';

export const TOP_CASINOS_PREVIEW_LIMIT = 5;

export const topCasinosForCountry = (brands, code) => {
  const priority = brand => Number.isFinite(brand.countryPagePriority)
    ? brand.countryPagePriority : Number.MAX_SAFE_INTEGER;
  return brands.filter(brand => brand.countries?.includes(code))
    .map((brand, index) => ({
      brand,
      index,
      blocked: Number(Boolean(brand.notRecommended || brand.temporarilyUnavailable)),
      tier: Number.isFinite(brand.countryPagePriority) ? 0 : brand.top?.includes(code) ? 1 : 2,
    }))
    .sort((a, b) => a.blocked - b.blocked || a.tier - b.tier ||
      priority(a.brand) - priority(b.brand) || a.index - b.index)
    .slice(0, TOP_CASINOS_PREVIEW_LIMIT)
    .map(({ brand }) => brand);
};

export const initTopCasinosPage = ({
  COUNTRIES, BRANDS, localeText, localizedCountryTitle, createCasinoCard, requestPaymentIconSync,
}) => {
  const cloud = document.querySelector('[data-top-casino-markets]');
  const results = document.querySelector('[data-top-casino-results]');
  if (!cloud || !results) return;

  const countries = new Map(COUNTRIES.map(country => [country.slug, country]));
  const markets = new Map([...cloud.querySelectorAll('[data-top-casino-country]')].map(link =>
    ['#top-' + link.dataset.topCasinoCountry, link]));
  const compactCloud = bindCompactCountryCloud(cloud, localeText);
  const template = results.querySelector('[data-top-casino-ranking-template]');
  const stack = results.querySelector('[data-top-casino-rankings]');
  const reset = results.querySelector('[data-top-casino-reset]');
  const featured = ['united-states', 'united-kingdom', 'australia', 'canada', 'brazil'];
  const allLinks = [...new Set([...featured.map(slug => markets.get('#top-' + slug)), ...markets.values()])]
    .filter(link => link && countries.has(link.dataset.topCasinoCountry));
  const rankings = new Map();
  let currentLink;

  const rankingFor = link => {
    const country = countries.get(link.dataset.topCasinoCountry);
    if (rankings.has(country.slug)) return rankings.get(country.slug);

    const section = template.content.firstElementChild.cloneNode(true);
    section.id = 'top-' + country.slug;
    section.dataset.country = country.code.toUpperCase();
    const title = section.querySelector('.top-country-title');
    title.id = section.id + '-title';
    title.textContent = localizedCountryTitle(country);
    section.setAttribute('aria-labelledby', title.id);
    section.querySelector('.home-brand-view-all').href = link.href;
    const grid = section.querySelector('.casino-grid');
    const ranked = topCasinosForCountry(BRANDS, section.dataset.country);
    if (ranked.length) {
      grid.append(...ranked.map(brand => createCasinoCard(brand)));
    } else {
      const empty = document.createElement('p');
      empty.className = 'top-casino-empty';
      empty.textContent = localeText(
        'No casinos are listed for this country.', 'Für dieses Land sind keine Casinos gelistet.',
        'No hay casinos en la lista de este país.', 'Non ci sono casinò nell’elenco per questo paese.',
        'Na liście dla tego kraju nie ma kasyn.', 'У списку для цієї країни немає казино.',
        'Não há casinos na lista para este país.', 'Aucun casino ne figure dans la liste pour ce pays.',
        'इस देश के लिए सूची में कोई कैसीनो नहीं है।', 'Tämän maan listalla ei ole kasinoita.'
      );
      grid.append(empty);
    }
    rankings.set(country.slug, section);
    return section;
  };

  const showRankings = (link, { focus = false } = {}) => {
    if (currentLink !== link) {
      currentLink?.removeAttribute('aria-current');
      currentLink = link;
      if (link) {
        link.setAttribute('aria-current', 'true');
        compactCloud.reveal(link);
      }
      stack.replaceChildren(...(link ? [link] : allLinks).map(rankingFor));
      reset.hidden = !link;
      requestPaymentIconSync();
    }

    if (focus) {
      stack.querySelector('.top-country-title')?.focus({ preventScroll: true });
      results.scrollIntoView({ block: 'start', behavior: 'instant' });
    }
  };

  cloud.addEventListener('click', event => {
    const link = event.target.closest('[data-top-casino-country]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const hash = '#top-' + link.dataset.topCasinoCountry;
    if (!markets.has(hash) || !countries.has(link.dataset.topCasinoCountry)) return;
    event.preventDefault();
    if (window.location.hash !== hash) history.pushState(null, '', hash);
    showRankings(link, { focus: true });
  });

  reset.addEventListener('click', () => {
    history.pushState(null, '', window.location.pathname + window.location.search);
    showRankings(null, { focus: true });
  });
  const readHash = () => {
    const link = markets.get(window.location.hash);
    showRankings(allLinks.includes(link) ? link : null);
  };
  window.addEventListener('hashchange', readHash);
  readHash();
};
