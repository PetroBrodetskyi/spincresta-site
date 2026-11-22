// Page-specific module. Loaded dynamically by scripts/main.js.
import { bindMovingCardStrip } from '../scrolling-card-strip.js?v=20261122-compact-reviews';

export const renderCountryMedia = context => {
  const {
    BRANDS,
    COUNTRIES,
    BRAND_NEW_GAMES,
    normalizeText,
    localizedCountryName,
    getBrandDetailSlug,
    brandPagePath,
    localeText,
    escapeHtml,
  } = context;

  const renderCountryNewGames = pageCountry => {
    const main = document.querySelector('body[data-country] main');
    const country = COUNTRIES.find(item => item.code.toUpperCase() === pageCountry);
    if (!main || !country || main.querySelector('.country-new-games')) return;

    const countryHash = Array.from(pageCountry).reduce((total, char) => total + char.charCodeAt(0), 0);
    const candidates = BRANDS.map((brand, index) => ({
      brand,
      index,
      slug: getBrandDetailSlug(brand),
    }))
      .filter(({ brand, slug }) =>
        brand.hasDetailPage &&
        brand.urlDetail &&
        !brand.notRecommended &&
        brand.countries?.some(code => code.toUpperCase() === pageCountry) &&
        Array.isArray(BRAND_NEW_GAMES[slug]) &&
        BRAND_NEW_GAMES[slug].length
      )
      .sort((a, b) => {
        const score = item =>
          (Number.isFinite(item.brand.countryPagePriority) ? 1000 - item.brand.countryPagePriority : 0) +
          (item.brand.top?.some(code => code.toUpperCase() === pageCountry) ? 100 : 0) +
          (item.brand.isTopRated ? 30 : 0) +
          (item.brand.isNew ? 12 : 0) +
          (item.brand.isExclusive ? 5 : 0);
        return score(b) - score(a) || a.index - b.index;
      });

    const selectedGames = [];
    const selectedNames = new Set();
    const maxCards = 12;

    const addGame = (candidate, gameIndex) => {
      const games = BRAND_NEW_GAMES[candidate.slug] || [];
      if (!games.length) return false;

      for (let offset = 0; offset < games.length; offset += 1) {
        const game = games[(gameIndex + offset) % games.length];
        const name = normalizeText(game?.name).trim();
        const nameKey = name.toLocaleLowerCase();
        if (!name || !game?.image || selectedNames.has(nameKey)) continue;

        selectedNames.add(nameKey);
        selectedGames.push({ brand: candidate.brand, game });
        return true;
      }

      return false;
    };

    candidates.forEach(candidate => {
      if (selectedGames.length >= maxCards) return;
      const games = BRAND_NEW_GAMES[candidate.slug] || [];
      const startingIndex = games.length ? (countryHash + candidate.index) % games.length : 0;
      addGame(candidate, startingIndex);
    });

    if (!selectedGames.length) return;

    const countryName = normalizeText(localizedCountryName(country));
    const headingId = `country-new-games-${country.slug}`;
    const section = document.createElement('section');
    section.className = 'home-new-games country-new-games';
    section.setAttribute('aria-labelledby', headingId);
    section.innerHTML = `
      <div class="container">
        <div class="country-new-games-head home-games-toolbar">
          <h2 id="${headingId}">${escapeHtml(localeText(
            `New games: ${countryName}`, `Neue Spiele: ${countryName}`, `Juegos nuevos: ${countryName}`,
            `Nuovi giochi: ${countryName}`, `Nowe gry: ${countryName}`, `Нові ігри: ${countryName}`,
            `Novos jogos: ${countryName}`, `Nouveaux jeux : ${countryName}`, `नए गेम: ${countryName}`,
            `Uudet pelit: ${countryName}`
          ))}</h2>
        </div>
        <div class="home-games-grid" aria-labelledby="${headingId}">
          ${selectedGames
            .map(({ brand, game }) => {
              const brandName = normalizeText(brand.name);
              const gameName = normalizeText(game.name);
              return `
                <a class="home-game-card" href="${brandPagePath(brand)}">
                  <span class="home-game-art game-art-backdrop">
                    <img
                      src="${escapeHtml(game.image)}"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span>
                    <strong>${escapeHtml(gameName)}</strong>
                    <small>${escapeHtml(brandName)}</small>
                  </span>
                </a>
              `;
            })
            .join('')}
        </div>
      </div>
    `;

    const catalog = main.querySelector('.country-catalog-reviews') || main.querySelector('.country-catalog-results');
    catalog?.insertAdjacentElement('afterend', section);
    bindMovingCardStrip({
      grid: section.querySelector('.home-games-grid'),
      toolbar: section.querySelector('.country-new-games-head'),
      id: headingId + '-strip',
      headingId,
      localeText,
    });
  };

  renderCountryNewGames(context.pageCountry);
};
