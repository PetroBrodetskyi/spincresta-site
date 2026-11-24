export const headerLanguages = [
  ['en', 'united-kingdom', 'English', 'Choose language', 'Open search', 'Sign in'],
  ['de', 'germany', 'Deutsch', 'Sprache auswählen', 'Suche öffnen', 'Anmelden'],
  ['es', 'spain', 'Español', 'Elegir idioma', 'Abrir búsqueda', 'Iniciar sesión'],
  ['it', 'italy', 'Italiano', 'Scegli la lingua', 'Apri ricerca', 'Accedi'],
  ['pl', 'poland', 'Polski', 'Wybierz język', 'Otwórz wyszukiwanie', 'Zaloguj się'],
  ['uk', 'ukraine', 'Українська', 'Вибрати мову', 'Відкрити пошук', 'Увійти'],
  ['pt', 'portugal', 'Português', 'Escolher idioma', 'Abrir pesquisa', 'Entrar'],
  ['fr', 'france', 'Français', 'Choisir la langue', 'Ouvrir la recherche', 'Se connecter'],
  ['hi', 'india', 'हिन्दी', 'भाषा चुनें', 'खोज खोलें', 'साइन इन करें'],
  ['fi', 'finland', 'Suomi', 'Valitse kieli', 'Avaa haku', 'Kirjaudu'],
];

const esc = text => String(text).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const flag = (name, eager = false) => `<img src="/icons/${name}-flag-icon.svg" alt="" aria-hidden="true"${eager ? ' width="20" height="14"' : ' loading="lazy" decoding="async"'} />`;
const codeLabel = code => `<span class="language-switcher-code" aria-hidden="true">${code.toUpperCase()}</span>`;

export function renderHeaderLanguageSwitcher(locale, getHref) {
  const current = headerLanguages.find(([code]) => code === locale);
  if (!current) throw new Error(`Unknown header locale: ${locale}`);
  const items = headerLanguages.map(([code, icon, name]) =>
    `            <a class="language-switcher-option" href="${esc(getHref(code))}" lang="${code}" aria-label="${name}" title="${name}"${code === locale ? ' aria-current="page"' : ''}>${flag(icon)}${codeLabel(code)}</a>`
  );
  return `<details class="language-switcher" data-static-language-switcher>
          <summary class="language-switcher-current" aria-label="${current[3]}">${flag(current[1], true)}${codeLabel(locale)}</summary>
          <div class="language-switcher-menu">
${items.join('\n')}
          </div>
        </details>`;
}

export const headerSearchIcon = '<svg class="site-search-trigger-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="10.5" cy="10.5" r="7.25" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="m16 16 5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
export const renderHeaderSearch = label => `<button class="site-search-trigger site-search-trigger--desktop" type="button" aria-label="${esc(label)}" aria-expanded="false" disabled>${headerSearchIcon}</button>`;

export const renderHeaderAccountContents = label => `<span class="account-auth-icon" aria-hidden="true"><svg viewBox="0 0 24 24" focusable="false"><path d="M12 12a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5Zm-7.25 8.5c.7-4 3.2-6.25 7.25-6.25s6.55 2.25 7.25 6.25" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></span><span class="account-auth-label">${esc(label)}</span>`;
export const renderHeaderAccount = label => `<button class="account-auth-control" type="button" aria-haspopup="dialog" aria-label="${esc(label)}" disabled>${renderHeaderAccountContents(label)}</button>`;
