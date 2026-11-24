import { siteIconMarkup } from './site-icons.js?v=20261119-site-icons';

const FAVORITES_KEY = 'spincresta_favorite_brands';
const LIMIT = 80; // Keep the preference small because Auth includes user metadata in the session.
const isBrandSlug = slug => typeof slug === 'string' && /^[a-z0-9][a-z0-9-]{0,39}$/.test(slug);
export const favoriteLogoPath = image =>
  typeof image === 'string' && /^\/?images\/[a-z0-9_./-]+\.(?:avif|gif|jpe?g|png|svg|webp)$/i.test(image) &&
  !image.replace(/^\//, '').split('/').some(segment => !segment || segment === '.' || segment === '..')
    ? `/${image.replace(/^\//, '')}`
    : '';

export const readFavoriteBrands = user => {
  const data = user?.user_metadata?.[FAVORITES_KEY];
  return Array.isArray(data) ? [...new Set(data.filter(isBrandSlug))].slice(0, LIMIT) : [];
};

// This is a display preference, never a source of account permissions.
export async function persistBrandFavorite(auth, getActiveUserId, slug, selected) {
  const userId = getActiveUserId();
  if (!userId || !isBrandSlug(slug)) throw new Error('favorite_unavailable');
  const { data, error } = await auth.getUser();
  if (error || data?.user?.id !== userId || getActiveUserId() !== userId) {
    throw new Error('favorite_unavailable');
  }

  const current = readFavoriteBrands(data.user);
  if (current.includes(slug) === selected) return data.user;
  if (selected && current.length === LIMIT) throw new Error('favorites_limit');
  const next = selected ? [slug, ...current] : current.filter(item => item !== slug);
  const updated = await auth.updateUser({ data: { [FAVORITES_KEY]: next } });
  if (updated.error || updated.data?.user?.id !== userId || getActiveUserId() !== userId) {
    throw new Error('favorite_unavailable');
  }
  return updated.data.user;
}

const COPY = {
  en: ['Favorites', 'No favorites yet.', 'Sign in to save this brand', 'Favorite brand', 'Remove', 'Added to favorites.', 'Removed from favorites.', 'Could not update favorites. Try again.', 'Your favorites list is full. Remove a brand before adding another.'],
  de: ['Favoriten', 'Sie haben noch keine Favoriten.', 'Melden Sie sich an, um diese Marke zu speichern', 'Als Favorit markieren', 'Entfernen', 'Zu Ihren Favoriten hinzugefügt.', 'Aus Ihren Favoriten entfernt.', 'Die Favoriten konnten nicht aktualisiert werden. Versuchen Sie es erneut.', 'Ihre Favoritenliste ist voll. Entfernen Sie zuerst eine Marke.'],
  es: ['Favoritos', 'Todavía no tienes favoritos.', 'Inicia sesión para guardar esta marca', 'Marcar marca como favorita', 'Quitar', 'Añadida a favoritos.', 'Eliminada de favoritos.', 'No se pudieron actualizar los favoritos. Inténtalo de nuevo.', 'Tu lista de favoritos está llena. Quita una marca antes de añadir otra.'],
  it: ['Preferiti', 'Non hai ancora preferiti.', 'Accedi per salvare questo marchio', 'Aggiungi ai preferiti', 'Rimuovi', 'Aggiunto ai preferiti.', 'Rimosso dai preferiti.', 'Impossibile aggiornare i preferiti. Riprova.', 'L’elenco dei preferiti è pieno. Rimuovi un marchio prima di aggiungerne un altro.'],
  pl: ['Ulubione', 'Nie masz jeszcze ulubionych.', 'Zaloguj się, aby zapisać tę markę', 'Oznacz markę jako ulubioną', 'Usuń', 'Dodano do ulubionych.', 'Usunięto z ulubionych.', 'Nie udało się zaktualizować ulubionych. Spróbuj ponownie.', 'Lista ulubionych jest pełna. Usuń markę, aby dodać kolejną.'],
  uk: ['Обране', 'Поки що нічого не збережено.', 'Увійти, щоб зберегти бренд', 'Зберегти бренд в обране', 'Видалити', 'Додано до обраного.', 'Видалено з обраного.', 'Не вдалося оновити обране. Спробуйте ще раз.', 'Список обраного заповнений. Видаліть один бренд, щоб додати інший.'],
  pt: ['Favoritos', 'Ainda não tem favoritos.', 'Inicie sessão para guardar esta marca', 'Marcar marca como favorita', 'Remover', 'Adicionada aos favoritos.', 'Removida dos favoritos.', 'Não foi possível atualizar os favoritos. Tente novamente.', 'A lista de favoritos está cheia. Remova uma marca antes de adicionar outra.'],
  fr: ['Favoris', 'Vous n’avez pas encore de favoris.', 'Connectez-vous pour enregistrer cette marque', 'Marquer la marque comme favorite', 'Retirer', 'Ajoutée aux favoris.', 'Retirée des favoris.', 'Impossible de mettre à jour vos favoris. Réessayez.', 'Votre liste de favoris est pleine. Retirez une marque avant d’en ajouter une autre.'],
  hi: ['पसंदीदा', 'अभी कोई पसंदीदा नहीं है।', 'इस ब्रांड को सहेजने के लिए साइन इन करें', 'ब्रांड को पसंदीदा बनाएँ', 'हटाएँ', 'पसंदीदा में जोड़ा गया।', 'पसंदीदा से हटाया गया।', 'पसंदीदा अपडेट नहीं हो सके। फिर कोशिश करें।', 'पसंदीदा सूची भर गई है। नया ब्रांड जोड़ने से पहले एक हटाएँ।'],
  fi: ['Suosikit', 'Sinulla ei vielä ole suosikkeja.', 'Kirjaudu sisään tallentaaksesi brändin', 'Merkitse brändi suosikiksi', 'Poista', 'Lisätty suosikkeihin.', 'Poistettu suosikeista.', 'Suosikkeja ei voitu päivittää. Yritä uudelleen.', 'Suosikkilista on täynnä. Poista yksi brändi ennen kuin lisäät uuden.'],
};

export function initBrandFavorites({ locale, slug, findBrand, getBrandSlug, brandPagePath, account }) {
  const [, emptyCopy, signIn, favoriteLabel, removeLabel, added, removed, failed, limitCopy] = COPY[locale] || COPY.en;
  const preview = document.querySelector('.brand-profile-showcase__preview');
  const target = isBrandSlug(slug) && (preview || document.querySelector('.brand-profile-showcase__actions'));
  const favoritesMount = document.querySelector('[data-account-favorites-mount]');
  const status = () => {
    const el = document.createElement('p');
    el.className = 'favorite-status';
    el.setAttribute('role', 'status');
    return el;
  };
  const showMessage = (el, message, error = false) => {
    el.textContent = message;
    el.classList.toggle('is-error', error);
  };
  const errorCopy = error => error?.message === 'favorites_limit' ? limitCopy : failed;

  const heartSyncs = new Map();
  const mountedHearts = new WeakMap();
  const addHeart = (surface, key, isOverPreview, name = '') => {
    if (!surface || !isBrandSlug(key) || heartSyncs.has(surface)) return;
    const mountedSync = mountedHearts.get(surface);
    if (mountedSync) {
      heartSyncs.set(surface, mountedSync);
      mountedSync();
      return;
    }
    const control = document.createElement('div');
    control.className = 'brand-favorite-control';
    if (isOverPreview) control.classList.add('is-over-preview');
    const heart = document.createElement('button');
    heart.type = 'button';
    heart.className = 'brand-favorite-button';
    heart.innerHTML = siteIconMarkup('heart', 'site-icon', 22);
    const message = status();
    control.append(heart, message);
    surface.append(control);

    const sync = () => {
      const registered = account.hasRegisteredUser();
      const selected = registered && account.favorites().includes(key);
      const label = registered ? favoriteLabel : signIn;
      heart.setAttribute('aria-label', name ? `${label}: ${name}` : label);
      if (registered) heart.setAttribute('aria-pressed', String(selected));
      else heart.removeAttribute('aria-pressed');
      heart.title = registered ? favoriteLabel : signIn;
    };
    heart.addEventListener('click', async () => {
      showMessage(message, '');
      if (!account.hasRegisteredUser()) {
        if (!account.openSignIn()) showMessage(message, failed, true);
        return;
      }
      const selected = !account.favorites().includes(key);
      if (heart.getAttribute('aria-busy') === 'true') return;
      heart.setAttribute('aria-busy', 'true');
      try {
        await account.saveFavorite(key, selected);
        showMessage(message, selected ? added : removed);
      } catch (error) {
        showMessage(message, errorCopy(error), true);
      } finally {
        heart.removeAttribute('aria-busy');
        sync();
      }
    });
    mountedHearts.set(surface, sync);
    heartSyncs.set(surface, sync);
    sync();
  };

  const syncHearts = () => {
    for (const [surface, sync] of heartSyncs) {
      if (surface.isConnected) sync();
      else heartSyncs.delete(surface);
    }
  };
  addHeart(target, slug, Boolean(preview));
  const cardLists = document.querySelectorAll('.home-recommendation-grid, [data-top-casino-rankings]');
  for (const cards of cardLists) {
    const syncCards = () => {
      syncHearts();
      for (const surface of cards.querySelectorAll('[data-favorite-brand]')) {
        const name = surface.closest('article')?.querySelector('h3')?.textContent?.trim();
        addHeart(surface, surface.dataset.favoriteBrand, true, name);
      }
    };
    syncCards();
    new MutationObserver(syncCards).observe(cards, { childList: true });
  }
  if (target || cardLists.length) {
    window.addEventListener('spincresta:account-state', syncHearts);
  }

  if (!favoritesMount) return;
  const title = favoritesMount.closest('.account-favorites')?.querySelector('h2');
  const empty = document.createElement('p');
  empty.className = 'account-empty-state';
  empty.textContent = emptyCopy;
  const list = document.createElement('ul');
  const message = status();
  favoritesMount.replaceChildren(empty, list, message);

  const render = () => {
    list.replaceChildren();
    for (const key of account.favorites()) {
      const brand = findBrand(key);
      if (!brand || getBrandSlug(brand) !== key) continue;
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.className = 'account-favorite-brand';
      link.href = brandPagePath(brand);
      const logo = document.createElement('span');
      logo.className = 'account-favorite-logo';
      logo.setAttribute('aria-hidden', 'true');
      if (/^#[\da-f]{3}(?:[\da-f]{3})?$/i.test(brand.bgColor)) logo.style.backgroundColor = brand.bgColor;
      const logoPath = favoriteLogoPath(brand.image);
      const showInitial = () => {
        logo.style.removeProperty('background-color');
        logo.textContent = Array.from(brand.name)[0]?.toLocaleUpperCase(locale) || '';
      };
      if (logoPath) {
        const image = document.createElement('img');
        image.alt = '';
        image.loading = 'lazy';
        image.decoding = 'async';
        image.addEventListener('error', showInitial, { once: true });
        image.src = logoPath;
        logo.append(image);
      } else showInitial();
      const name = document.createElement('span');
      name.textContent = brand.name;
      link.append(logo, name);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'account-favorite-remove';
      button.textContent = removeLabel;
      button.setAttribute('aria-label', `${removeLabel}: ${brand.name}`);
      button.addEventListener('click', async () => {
        showMessage(message, '');
        button.disabled = true;
        try {
          await account.saveFavorite(key, false);
          showMessage(message, removed);
          title?.focus({ preventScroll: true });
        } catch (error) {
          showMessage(message, errorCopy(error), true);
          button.disabled = false;
        }
      });
      item.append(link, button);
      list.append(item);
    }
    empty.hidden = Boolean(list.childElementCount);
    list.hidden = !list.childElementCount;
  };
  window.addEventListener('spincresta:account-state', render);
  render();
}
