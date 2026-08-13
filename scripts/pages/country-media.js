// Page-specific module. Loaded dynamically by scripts/main.js.

export const renderCountryMedia = context => {
  const {
    BRANDS,
    COUNTRIES,
    BRAND_HOMEPAGE_SCREENSHOTS,
    BRAND_NEW_GAMES,
    normalizeText,
    localizedCountryName,
    getBrandDetailSlug,
    brandPagePath,
    localeText,
    escapeHtml,
  } = context;

  const renderCountryCasinoGallery = pageCountry => {
    const main = document.querySelector('body[data-country] main');
    const hero = main?.querySelector(':scope > .hero');
    const country = COUNTRIES.find(item => item.code.toUpperCase() === pageCountry);
    if (!main || !hero || !country || main.querySelector('.country-casino-gallery')) return;
  
    const candidates = BRANDS.map((brand, index) => ({ brand, index }))
      .filter(({ brand }) => {
        const slug = getBrandDetailSlug(brand);
        return (
          brand.hasDetailPage &&
          brand.urlDetail &&
          !brand.notRecommended &&
          brand.countries?.some(code => code.toUpperCase() === pageCountry) &&
          Boolean(BRAND_HOMEPAGE_SCREENSHOTS[slug])
        );
      })
      .sort((a, b) => {
        const score = brand =>
          (brand.top?.some(code => code.toUpperCase() === pageCountry) ? 100 : 0) +
          (brand.isTopRated ? 30 : 0) +
          (brand.isExclusive ? 10 : 0) +
          (brand.isNew ? 5 : 0);
        return score(b.brand) - score(a.brand) || a.index - b.index;
      });
  
    const selectedBrands = [];
    const selectedSlugs = new Set();
    candidates.forEach(({ brand }) => {
      const slug = getBrandDetailSlug(brand);
      if (selectedBrands.length >= 6 || selectedSlugs.has(slug)) return;
      selectedSlugs.add(slug);
      selectedBrands.push(brand);
    });
  
    if (!selectedBrands.length) return;
  
    const countryName = normalizeText(localizedCountryName(country));
    const headingId = `country-casino-gallery-${country.slug}`;
    const section = document.createElement('section');
    section.className = 'content country-casino-gallery';
    section.setAttribute('aria-labelledby', headingId);
    section.innerHTML = `
      <div class="container">
        <div class="country-casino-gallery-head">
          <div>
            <span class="country-casino-gallery-kicker">${localeText('CASINO LOBBY PREVIEWS', 'EINBLICKE IN CASINO-LOBBYS', 'VISTAS PREVIAS DE LOBBIES')}</span>
            <h2 id="${headingId}">${localeText(
              `Inside casinos available in ${countryName}`,
              `Einblicke in Casinos für ${countryName}`,
              `Así son los casinos disponibles en ${countryName}`
            )}</h2>
          </div>
          <p>${
            localeText(
              `Real homepage captures from brands included in our ${countryName} comparison. Open any preview for the complete review and current details.`,
              `Echte Startseiten-Aufnahmen von Marken, die in unserem ${countryName}-Vergleich vertreten sind. Öffnen Sie eine Vorschau für den vollständigen Test.`,
              `Capturas reales de las páginas principales de marcas incluidas en nuestra comparativa de ${countryName}. Abre cualquier vista previa para consultar la reseña completa y los datos actuales.`
            )
          }</p>
        </div>
        <div class="country-casino-gallery-grid">
          ${selectedBrands
            .map(brand => {
              const slug = getBrandDetailSlug(brand);
              const name = normalizeText(brand.name);
              const source = BRAND_HOMEPAGE_SCREENSHOTS[slug].replace(
                '/image/upload/',
                '/image/upload/c_fill,g_north,w_900,h_506/'
              );
              return `
                <a class="country-casino-shot" href="${brandPagePath(brand)}">
                  <img src="${source}" alt="${localeText(
                    `${name} casino homepage for ${countryName}`,
                    `${name} Casino-Startseite für ${countryName}`,
                    `Página principal de ${name} para ${countryName}`
                  )}" width="900" height="506" loading="lazy" decoding="async" />
                  <span>
                    <strong>${name}</strong>
                    <small>${localeText('Review and current details', 'Test und aktuelle Details', 'Reseña y datos actuales')}</small>
                  </span>
                </a>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  
    hero.insertAdjacentElement('afterend', section);
  };
  
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
    section.className = `content country-new-games${selectedGames.length < 6 ? ' is-sparse' : ''}`;
    section.setAttribute('aria-labelledby', headingId);
    section.style.setProperty('--country-game-count', String(Math.min(selectedGames.length, 6)));
    section.innerHTML = `
      <div class="container">
        <div class="country-new-games-head">
          <div>
            <span class="country-new-games-kicker">${localeText('FRESH FROM REVIEWED LOBBIES', 'NEU IN GEPRÜFTEN LOBBYS', 'NOVEDADES DE LOBBIES REVISADOS')}</span>
            <h2 id="${headingId}">${localeText(
              `New games in ${countryName}`,
              `Neue Spiele im ${countryName}-Vergleich`,
              `Juegos nuevos en ${countryName}`
            )}</h2>
          </div>
          <p>${
            localeText(
              `Recent releases from casino brands included in our ${countryName} comparison. Each card opens the relevant review; availability can vary by region and account.`,
              `Aktuelle Neuerscheinungen aus Casino-Marken unseres ${countryName}-Vergleichs. Jede Karte führt zum passenden Test; die Verfügbarkeit kann je nach Region und Konto variieren.`,
              `Lanzamientos recientes de marcas incluidas en nuestra comparativa de ${countryName}. Cada tarjeta abre la reseña correspondiente; la disponibilidad puede variar según la región y la cuenta.`
            )
          }</p>
        </div>
        <div class="country-new-games-grid" aria-label="${
          localeText(`New games for ${countryName}`, `Neue Spiele für ${countryName}`, `Juegos nuevos para ${countryName}`)
        }">
          ${selectedGames
            .map(({ brand, game }) => {
              const brandName = normalizeText(brand.name);
              const gameName = normalizeText(game.name);
              return `
                <a class="country-new-game-card" href="${brandPagePath(brand)}">
                  <span class="country-new-game-art">
                    <img
                      src="${escapeHtml(game.image)}"
                      alt="${localeText(
                        `${escapeHtml(gameName)} game artwork at ${escapeHtml(brandName)}`,
                        `${escapeHtml(gameName)} Spielgrafik bei ${escapeHtml(brandName)}`,
                        `Imagen del juego ${escapeHtml(gameName)} en ${escapeHtml(brandName)}`
                      )}"
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span class="country-new-game-copy">
                    <strong>${escapeHtml(gameName)}</strong>
                    <small>${localeText('at', 'bei', 'en')} ${escapeHtml(brandName)}</small>
                  </span>
                </a>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  
    const gallery = main.querySelector('.country-casino-gallery');
    const hero = main.querySelector(':scope > .hero');
    (gallery || hero)?.insertAdjacentElement('afterend', section);
  };

  renderCountryCasinoGallery(context.pageCountry);
  renderCountryNewGames(context.pageCountry);
};
