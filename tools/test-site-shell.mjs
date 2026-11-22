import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { publicThemePages, syncDefaultTheme } from './sync-default-theme.mjs';
import { isBrandSportsSection } from '../scripts/pages/brand-layout.js';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('all styled public pages use the single palette without a legacy initializer', () => {
  const files = publicThemePages();
  assert.ok(files.length > 2600);
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8');
    assert.doesNotMatch(html, /\bdata-theme=|\/scripts\/theme-init\.js/, file);
    assert.equal(syncDefaultTheme(html), html, file);
  }
});

test('the light canvas, white header and black footer do not depend on a visitor preference', () => {
  const core = read('styles/core.css');
  assert.match(core, /color-scheme:\s*light;/);
  assert.match(core, /--bg-main: #ffffff;/);
  assert.match(core, /--chrome-bg: #000000;/);
  assert.match(core, /\.header \{[^}]*--header-surface: #fff;/);
  assert.match(core, /\.account-auth-control \{[^}]*color: var\(--text-muted\);[^}]*border: 1px solid var\(--header-border\);/);
  assert.match(core, /\.header \{[^}]*inset: 0 0 auto;/);
  assert.match(core, /\.header-container \{[^}]*border-radius: 0;/);
  for (const file of ['styles.css', 'styles/core.css', 'styles/pages.css', 'styles/blog.css', 'scripts/main.js']) {
    assert.doesNotMatch(read(file), /data-theme|spincresta-theme|theme-settings|footer-settings-trigger|prefers-color-scheme|color-scheme:\s*dark/, file);
  }
  assert.match(read('styles.css'), /\/styles\/core\.css\?v=[\w-]+/);
});

test('native dropdowns share an inset chevron, with a system arrow in forced colors', () => {
  const css = read('styles.css');
  const dropdown = "select:not([multiple], [size]:not([size='1']))";
  const block = css.split(dropdown + ' {')[1]?.split('}')[0] || '';
  assert.match(block, /appearance: none;/);
  assert.match(block, /padding-inline-end: 38px;/);
  assert.match(block, /background-position: right 12px center;/);
  assert.match(block, /background-size: 16px 16px;/);
  assert.match(css.split('@media (forced-colors: active) {')[1]?.split('}\n}')[0] || '', /appearance: auto;[^}]*background-image: none;/);
  assert.doesNotMatch(read('scripts/pages/moderator.js'), /roleField\.insertAdjacentHTML/);
});

test('account navigation shares the selected appearance across links and tabs', () => {
  const account = read('styles/account.css');
  assert.match(account, /\.account-menu :is\(a\[aria-current='location'\], button\[aria-selected='true'\]\) \{[^}]*background: var\(--account-selected\)/);
});

test('the white vector wordmark has a footer-black ribbon with angular side notches', () => {
  const svg = read('images/spincresta-wordmark.svg');
  assert.match(svg, /viewBox="0 -5 258 60"/);
  const footer = read('styles/core.css').match(/--chrome-bg:\s*(#[0-9a-f]+);/i)?.[1];
  assert.ok(footer);
  const background = svg.match(/<path\b[^>]*fill="[^"]+"[^>]*\/>/)?.[0] || '';
  assert.ok(background.includes(`fill="${footer}"`));
  assert.match(background, /d="M0 -5H258L244 25L258 55H0L14 25Z"/);
  assert.doesNotMatch(svg, /<rect\b/);
  assert.match(svg, /<g\b[^>]*stroke="#fff"/);
  assert.doesNotMatch(svg, /chip|<use\b|<image\b|<text\b|<filter\b/i);
  assert.doesNotMatch(read('styles/core.css').match(/\.logo-lockup\s*\{[^}]*\}/)?.[0] || '', /filter:|mix-blend-mode:/);
  for (const file of publicThemePages()) {
    const html = fs.readFileSync(file, 'utf8');
    for (const [headerLogo] of html.matchAll(/<img\b(?=[^>]*\bclass="[^"]*\blogo-lockup\b)[^>]*>/g)) {
      assert.match(headerLogo, /src="\/images\/spincresta-wordmark\.svg\?v=[\w-]+" width="258" height="60"/, file);
      assert.match(headerLogo, /alt="SpinCresta"/, file);
    }
  }
});

test('review rails start alongside the masthead without stretching its row', () => {
  const css = read('styles/pages.css');
  assert.match(css, /"toc masthead context"\s*"toc article context";\s*grid-template-rows:\s*max-content minmax\(0, 1fr\)/);
  assert.match(css, /"toc masthead"\s*"toc article";/);
  const layout = read('scripts/pages/brand-layout.js');
  assert.match(layout, /element: payments,\s*target: rightRail,\s*className: 'brand-right-payments',\s*mediaQuery: '\(min-width: 1200px\)'/);
  const rail = layout.slice(layout.indexOf('const initRightRailContent'), layout.indexOf('const applyBrandStickyReviewLayout'));
  assert.doesNotMatch(rail, /betting|sports/i);
  assert.match(layout, /placeholder\.after\(element\)/);
});

test('the article below the overview spans the former right rail without moving the masthead', () => {
  const css = read('styles/pages.css');
  assert.match(css, /"toc masthead context"\s*"toc overview context"\s*"toc article article"/);
  assert.match(css, /"toc masthead"\s*"toc overview"\s*"toc article";/);
  assert.match(css, /:has\(> \.brand-review-overview\) > \.brand-right-rail\s*\{[^}]*contain: size;[^}]*overflow-y: auto;/);
  const layout = read('scripts/pages/brand-layout.js');
  assert.match(layout, /main\.before\(overview\)/);
  assert.match(layout, /heading\.id = 'brand-review-overview'/);
  const surfaces = read('styles/section-contrast-preview.css');
  assert.match(surfaces, /--brand-section-paint:[^}]*border-radius: 0;[^}]*fill 0 \/ 0 \/ 0 100vmax 0 0/);
  assert.match(surfaces, /\.brand-review-overview \+ \.brand-sticky-main\s*\{[^}]*background: var\(--review-surface\);/);
});

test('brand FAQ keeps its tinted surface and player feedback starts a white band', () => {
  const css = read('styles/section-contrast-preview.css');
  assert.match(css, /:is\([^)]*\.site-faq-section[^)]*\) \{\s*--brand-section-background: var\(--editorial-band\);/);
  assert.match(css, /\.brand-sticky-main \.brand-player-feedback \{\s*--brand-section-background: var\(--review-surface\);\s*padding-block: var\(--editorial-band-block-padding\);/);
  assert.doesNotMatch(css, /:is\([^)]*\.brand-player-feedback[^)]*\) \{\s*--brand-section-background: var\(--editorial-band\);/);
});

test('new game cards open the review body in a single horizontal, scrollable row', () => {
  const layout = read('scripts/pages/brand-layout.js');
  assert.match(layout, /main\.prepend\(gamesSection\)/);
  assert.doesNotMatch(layout, /brand-new-games-rail/);
  assert.match(read('styles/brand-review.css'),
    /\.brand-new-games-list\s*\{[^}]*grid-auto-flow: column;[^}]*overflow-x: auto;/);
});

test('standalone sportsbook sections are recognized across the localized Fraga reviews', () => {
  for (const locale of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
    const html = read(`${locale}brands/fraga-tr/index.html`);
    const headings = [...html.matchAll(/<h2 class="title">(.*?)<\/h2>/g)].map(match => match[1]);
    assert.equal(headings.filter(heading => isBrandSportsSection({heading})).length, 1, locale || 'en');
  }
  assert.equal(isBrandSportsSection({kind: 'betting', heading: 'Sports Welcome Bonus'}), true);
  assert.equal(isBrandSportsSection({id: 'sports-bonus', heading: 'Welcome offer'}), true);
  assert.equal(isBrandSportsSection({id: 'brand-sports', heading: 'Sportsbook and Casino'}), false);
  assert.equal(isBrandSportsSection({heading: 'Casino and Sportsbook'}), false);
  assert.equal(isBrandSportsSection({kind: 'casino', heading: 'Sportsbook'}), false);
});
