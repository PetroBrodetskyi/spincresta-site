// Replace the legacy country mega-menu without changing the localized label.
export const syncCountryHeader = (html, prefix) => html.replace(
  /<div class="nav-dropdown">\s*<a\b[^>]*\bclass="nav-dropdown-link"[^>]*>([^<]+)<\/a>\s*<div class="nav-dropdown-menu" id="countriesDropdown">\s*<\/div>\s*<\/div>/g,
  (_, label) => `<a class="nav-countries-link" href="${prefix}#home-country-title">${label}</a>`
);
