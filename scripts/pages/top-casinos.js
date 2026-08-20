// Top-casinos module. Loaded only on body[data-page="top-casinos"].

export const initTopCasinosPage = context => {
  const {
    COUNTRIES,
    BRANDS,
    SITE_LOCALE,
    localeText,
    escapeHtml,
    localizedCountryName,
    localizedCountryTitle,
    countryPagePath,
    iconPath,
    createCasinoCard,
    requestPaymentIconSync,
  } = context;

  const initTopCasinosJumpNav = () => {
    if (document.body.dataset.page !== 'top-casinos' || document.querySelector('.top-casino-jump-nav')) {
      return;
    }
  
    const contentArea = document.querySelector('.content-area');
    const sections = Array.from(document.querySelectorAll('.content[data-country]'));
    if (!contentArea || sections.length < 2) return;
  
    const sectionsByCode = new Map();
    sections.forEach(section => {
      const code = section.dataset.country?.toUpperCase();
      const country = COUNTRIES.find(item => item.code.toUpperCase() === code);
      if (!code || !country) return;
      section.id = section.id || `top-${country.slug}`;
      sectionsByCode.set(code, section);
    });
  
    const featuredCodes = new Set(['US', 'UK', 'AU', 'CA', 'BR']);
    const copy = SITE_LOCALE === 'de'
      ? {
          kicker: `${COUNTRIES.length} LÄNDER-GUIDES`,
          title: 'Wählen Sie Ihren Markt',
          description: 'Öffnen Sie eine hervorgehobene Rangliste oder wechseln Sie direkt zum vollständigen Länder-Guide.',
          show: 'Alle Länder anzeigen',
          hide: 'Weniger anzeigen',
          label: 'Casino-Rankings und Länder-Guides',
        }
      : SITE_LOCALE === 'es'
        ? {
            kicker: `${COUNTRIES.length} GUÍAS POR PAÍS`,
            title: 'Elige tu mercado',
            description: 'Abre una clasificación destacada o accede directamente a la guía completa de tu país.',
            show: 'Mostrar todos los países',
            hide: 'Mostrar menos',
            label: 'Clasificaciones de casinos y guías por país',
          }
        : SITE_LOCALE === 'it'
          ? {
              kicker: `${COUNTRIES.length} GUIDE PER PAESE`,
              title: 'Scegli il tuo mercato',
              description: 'Apri una classifica in evidenza oppure vai direttamente alla guida completa per il tuo paese.',
              show: 'Mostra tutti i paesi',
              hide: 'Mostra meno',
              label: 'Classifiche dei casinò e guide per paese',
            }
          : SITE_LOCALE === 'pl'
            ? {
                kicker: `${COUNTRIES.length} PRZEWODNIKI PO KRAJACH`,
                title: 'Wybierz swój rynek',
                description: 'Otwórz wyróżniony ranking lub przejdź bezpośrednio do pełnego przewodnika po swoim kraju.',
                show: 'Pokaż wszystkie kraje',
                hide: 'Pokaż mniej',
                label: 'Rankingi kasyn i przewodniki po krajach',
              }
            : SITE_LOCALE === 'uk'
              ? {
                  kicker: `${COUNTRIES.length} ГІДИ ЗА КРАЇНАМИ`,
                  title: 'Оберіть свій ринок',
                  description: 'Відкрийте вибраний рейтинг або перейдіть до повного гіда для своєї країни.',
                  show: 'Показати всі країни',
                  hide: 'Показати менше',
                  label: 'Рейтинги казино та гіди за країнами',
                }
              : SITE_LOCALE === 'pt'
                ? {
                    kicker: `${COUNTRIES.length} GUIAS POR PAÍS`,
                    title: 'Escolha o seu mercado',
                    description: 'Abra uma classificação em destaque ou aceda diretamente ao guia completo do seu país.',
                    show: 'Mostrar todos os países',
                    hide: 'Mostrar menos',
                    label: 'Classificações de casinos e guias por país',
                  }
                : SITE_LOCALE === 'fr'
                  ? {
                      kicker: `${COUNTRIES.length} GUIDES PAR PAYS`,
                      title: 'Choisissez votre marché',
                      description: 'Ouvrez un classement mis en avant ou accédez directement au guide complet de votre pays.',
                      show: 'Afficher tous les pays',
                      hide: 'Afficher moins de pays',
                      label: 'Classements de casinos et guides par pays',
                    }
                  : SITE_LOCALE === 'hi'
                    ? {
                        kicker: `${COUNTRIES.length} देश गाइड`,
                        title: 'अपना बाज़ार चुनें',
                        description: 'चुनिंदा रैंकिंग खोलें या सीधे अपने देश की पूरी गाइड देखें।',
                        show: 'सभी देश दिखाएं',
                        hide: 'कम देश दिखाएं',
                        label: 'कैसीनो रैंकिंग और देश गाइड',
                      }
                    : SITE_LOCALE === 'fi'
                      ? {
                          kicker: `${COUNTRIES.length} MAAOPASTA`,
                          title: 'Valitse markkinasi',
                          description: 'Avaa suositeltu ranking tai siirry suoraan oman maasi kattavaan oppaaseen.',
                          show: 'Näytä kaikki maat',
                          hide: 'Näytä vähemmän',
                          label: 'Kasinorankingit ja maaoppaat',
                        }
          : {
          kicker: `${COUNTRIES.length} COUNTRY GUIDES`,
          title: 'Choose your market',
          description: 'Open a featured ranking below or go directly to the complete guide for your country.',
          show: 'Show all countries',
          hide: 'Show fewer',
          label: 'Casino rankings and country guides',
        };
  
    const nav = document.createElement('nav');
    nav.className = 'top-casino-jump-nav';
    nav.id = 'top-casino-markets';
    nav.setAttribute('aria-label', copy.label);
    nav.innerHTML = `
      <div class="top-casino-jump-nav__head">
        <div>
          <span class="top-casinos-section-kicker">${escapeHtml(copy.kicker)}</span>
          <h2>${escapeHtml(copy.title)}</h2>
          <p>${escapeHtml(copy.description)}</p>
        </div>
        <button class="top-casino-jump-toggle" type="button" aria-expanded="false" aria-controls="top-casino-country-links">
          ${escapeHtml(copy.show)}
        </button>
      </div>
      <div class="top-casino-jump-nav__links" id="top-casino-country-links">
        ${COUNTRIES.map(country => {
            const code = country.code.toUpperCase();
            const section = sectionsByCode.get(code);
            const title = localizedCountryName(country);
            const href = section ? `#${section.id}` : countryPagePath(country.slug);
            return `
              <a class="top-casino-jump-link" href="${escapeHtml(href)}" data-featured="${featuredCodes.has(code) ? 'true' : 'false'}">
                <img class="flag" src="${iconPath(country.slug)}" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                <span>${escapeHtml(title)}</span>
              </a>
            `;
          })
          .join('')}
      </div>
    `;
  
    contentArea.insertAdjacentElement('beforebegin', nav);
  
    const toggle = nav.querySelector('.top-casino-jump-toggle');
    toggle?.addEventListener('click', () => {
      const isExpanded = nav.classList.toggle('is-expanded');
      toggle.setAttribute('aria-expanded', String(isExpanded));
      toggle.textContent = isExpanded ? copy.hide : copy.show;
    });
  };
  
  const ensureTopCasinosCountrySections = () => {
    if (document.body.dataset.page !== 'top-casinos') return;
  
    const contentArea = document.querySelector('.content-area');
    const insertionPoint = contentArea?.querySelector('.top-casinos-method');
    if (!contentArea || !insertionPoint) return;
  
    const existingCodes = new Set(
      Array.from(contentArea.querySelectorAll('.content[data-country]'))
        .map(section => section.dataset.country?.toUpperCase())
        .filter(Boolean)
    );
    const fragment = document.createDocumentFragment();
  
    COUNTRIES.forEach(country => {
      const code = country.code.toUpperCase();
      if (existingCodes.has(code)) return;
  
      const section = document.createElement('section');
      section.className = 'content top-casinos-generated-country';
      section.dataset.country = code;
      section.id = `top-${country.slug}`;
      section.innerHTML = `
        <div class="cards-main">
          <h2 class="top-country-title">${escapeHtml(localizedCountryName(country))}</h2>
          <div class="casino-grid" data-limit="6"></div>
          <div class="view-all-wrapper" hidden>
            <a class="view-all" href="${countryPagePath(country.slug)}"></a>
          </div>
        </div>
      `;
      fragment.appendChild(section);
    });
  
    insertionPoint.after(fragment);
  };

  ensureTopCasinosCountrySections();

  document.querySelectorAll('.content[data-country]').forEach(section => {
    const code = section.dataset.country?.toUpperCase();
    if (!code) return;

    const titleEl = section.querySelector('.top-country-title');
    const grid = section.querySelector('.casino-grid');
    const viewAllWrapper = section.querySelector('.view-all-wrapper');
    const viewAllLink = section.querySelector('.view-all');
    if (!titleEl || !grid) return;

    const country = COUNTRIES.find(item => item.code.toUpperCase() === code);
    const limit = Number(grid.dataset.limit) || 4;
    titleEl.textContent = localizedCountryTitle(country || { slug: '', name: code });

    const topBrands = BRANDS.filter(brand => brand.top?.includes(code) && brand.countries?.includes(code));
    const fillBrands = topBrands.length < limit
      ? BRANDS.filter(brand => brand.countries?.includes(code) && !topBrands.includes(brand))
      : [];
    const renderedBrands = [...topBrands, ...fillBrands].slice(0, limit);

    if (!renderedBrands.length) {
      grid.innerHTML = '<p>' + localeText('No top casinos available.', 'Keine Top-Casinos verfügbar.', 'No hay casinos destacados disponibles.') + '</p>';
    } else {
      const fragment = document.createDocumentFragment();
      renderedBrands.forEach(brand => fragment.appendChild(createCasinoCard(brand)));
      grid.replaceChildren(fragment);
      requestPaymentIconSync();
    }

    if (country && viewAllWrapper && viewAllLink) {
      const countryName = localizedCountryName(country);
      viewAllWrapper.hidden = false;
      viewAllLink.href = countryPagePath(country.slug);
      viewAllLink.textContent = localeText(
        'View all ' + countryName + ' casinos',
        'Alle Casinos in ' + countryName + ' anzeigen',
        'Ver todos los casinos de ' + countryName
      );
    }
  });

  initTopCasinosJumpNav();
};
