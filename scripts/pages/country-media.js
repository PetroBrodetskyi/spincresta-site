// Page-specific module. Loaded dynamically by scripts/main.js.

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
    section.className = `content country-new-games${selectedGames.length < 6 ? ' is-sparse' : ''}`;
    section.setAttribute('aria-labelledby', headingId);
    section.style.setProperty('--country-game-count', String(Math.min(selectedGames.length, 6)));
    section.innerHTML = `
      <div class="container">
        <div class="country-new-games-head">
          <div>

            <h2 id="${headingId}">${localeText(
              `New games: ${countryName}`, `Neue Spiele: ${countryName}`, `Juegos nuevos: ${countryName}`,
              `Nuovi giochi: ${countryName}`, `Nowe gry: ${countryName}`, `Нові ігри: ${countryName}`,
              `Novos jogos: ${countryName}`, `Nouveaux jeux : ${countryName}`, `नए गेम: ${countryName}`,
              `Uudet pelit: ${countryName}`
            )}</h2>
          </div>
          <p>${
            localeText(
              'Recent releases from casinos in this comparison. Select a game to read the casino review. Availability can vary by region and account.',
              'Spielneuheiten der Casinos im Vergleich. Jede Karte führt zur Bewertung des Casinos. Die Verfügbarkeit kann je nach Region und Konto variieren.',
              'Lanzamientos recientes de los casinos de esta comparativa. Cada juego lleva a la reseña del casino. La disponibilidad puede variar según la región y la cuenta.',
              'Novità dei casinò a confronto. Ogni gioco rimanda alla recensione del casinò. La disponibilità può variare in base alla regione e al conto.',
              'Nowości w porównywanych kasynach. Każda gra prowadzi do recenzji kasyna. Dostępność może zależeć od regionu i konta.',
              'Новинки казино з цього порівняння. Кожна картка веде до огляду казино. Доступність ігор може залежати від регіону й акаунта.',
              'Novidades dos casinos desta comparação. Cada jogo leva à análise do casino. A disponibilidade pode variar consoante a região e a conta.',
              'Nouveautés des casinos de ce comparatif. Chaque jeu mène à l’avis sur le casino. La disponibilité peut varier selon la région et le compte.',
              'इस तुलना में शामिल कैसीनो के नए गेम। हर गेम का कार्ड उस कैसीनो की समीक्षा खोलता है। उपलब्धता क्षेत्र और खाते पर निर्भर हो सकती है।',
              'Vertailun kasinoiden uutuuspelejä. Pelikortista pääset kasinon arvosteluun. Saatavuus voi vaihdella alueen ja pelitilin mukaan.'
            )
          }</p>
        </div>
        <div class="country-new-games-grid" aria-labelledby="${headingId}">
          ${selectedGames
            .map(({ brand, game }) => {
              const brandName = normalizeText(brand.name);
              const gameName = normalizeText(game.name);
              return `
                <a class="country-new-game-card" href="${brandPagePath(brand)}">
                  <span class="country-new-game-art game-art-backdrop">
                    <img
                      src="${escapeHtml(game.image)}"
                      alt=""
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <span class="country-new-game-copy">
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
  };

  renderCountryNewGames(context.pageCountry);
};
