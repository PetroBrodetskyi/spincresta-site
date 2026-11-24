import { headerLanguages, renderHeaderAccount, renderHeaderLanguageSwitcher, renderHeaderSearch } from '../scripts/header-controls.js';

const headerPattern = /<header\b[^>]*class="header"[^>]*>[\s\S]*?<\/header>/;
const searchBlock = /\r?\n[ \t]*<!-- static-header-search:start -->[\s\S]*?<!-- static-header-search:end -->/;
const accountBlock = /\r?\n[ \t]*<!-- static-header-account:start -->[\s\S]*?<!-- static-header-account:end -->/;
const navStart = /(\r?\n)([ \t]*)(<nav\b[^>]*class="nav")/;
const burgerEnd = /(<button\b(?=[^>]*\bclass="burger")(?=[^>]*\baria-controls="mobileMenu")[^>]*>[\s\S]*?<\/button>)/;
const homeSwitcherEnd = '<!-- home-language-switcher:end -->';
const moderator = /<body\b[^>]*\bdata-page="moderator"/;
const englishPrefix = /^\/(?:de|es|it|pl|uk|pt|fr|hi|fi)(?=\/|$)/;
const hrefPath = value => {
  if (!value) return null;
  const url = new URL(value, 'https://spincresta.com');
  return url.origin === 'https://spincresta.com' ? url.pathname : null;
};

export function syncStaticHeaderControls(html) {
  const locale = html.match(/<html\b[^>]*\blang="([a-z]+)[^"]*"/i)?.[1]?.toLowerCase();
  const labels = headerLanguages.find(([code]) => code === locale);
  if (!labels) return html;
  const canonical = hrefPath(html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1]);
  const variants = new Map([...html.matchAll(/<link\b[^>]*rel="alternate"[^>]*hreflang="([a-z]{2})(?:-[a-z]+)?"[^>]*href="([^"]+)"/gi)]
    .map(([, lang, href]) => [lang.toLowerCase(), hrefPath(href)]));
  const englishPath = canonical?.replace(englishPrefix, '') || '/';
  const getHref = lang => variants.get(lang) ||
    (lang === 'en' ? englishPath : `/${lang}${englishPath}`);

  return html.replace(headerPattern, header => {
    const clean = header.replace(searchBlock, '').replace(accountBlock, '');
    if (!navStart.test(clean) || !burgerEnd.test(clean)) return header;
    const withSearch = clean.replace(navStart, (_, newline, indent, nav) =>
      `${newline}${indent}<!-- static-header-search:start -->${newline}${indent}${renderHeaderSearch(labels[4])}${newline}${indent}<!-- static-header-search:end -->${newline}${indent}${nav}`);
    const hasHomeSwitcher = withSearch.includes(homeSwitcherEnd);
    const language = hasHomeSwitcher || moderator.test(html) ? '' : `        ${renderHeaderLanguageSwitcher(locale, getHref)}\n`;
    const account = `\n        <!-- static-header-account:start -->\n${language}        ${renderHeaderAccount(labels[5])}\n        <!-- static-header-account:end -->`;
    return hasHomeSwitcher
      ? withSearch.replace(homeSwitcherEnd, () => homeSwitcherEnd + account)
      : withSearch.replace(burgerEnd, (_, button) => button + account);
  });
}
