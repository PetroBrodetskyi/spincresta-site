import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { advanceHomeGames, initHomeGamesMotion } from '../scripts/pages/home.js';

test('the homepage games advance at a steady rate and wrap to the same offset', () => {
  assert.equal(advanceHomeGames(50, 50, 400), 51.2);
  assert.equal(advanceHomeGames(399.4, 50, 400).toFixed(1), '0.6');
  assert.equal(advanceHomeGames(50, 5000, 400), advanceHomeGames(50, 64, 400));
  assert.equal(advanceHomeGames(50, 50, 0), 0);
});

test('wheel and hover pauses are temporary; only the button leaves the strip paused', () => {
  const node = (left = 0) => ({
    children: [],
    dataset: {},
    events: {},
    attrs: {},
    classList: { add() {} },
    setAttribute(name, value) { this.attrs[name] = value; },
    hasAttribute() { return false; },
    addEventListener(name, fn) { this.events[name] = fn; },
    append(...items) { this.children.push(...items); },
    get firstElementChild() { return this.children[0]; },
    getBoundingClientRect() { return { left, right: left + 150, width: 150 }; },
    cloneNode() { return node(left); },
  });
  const controlsHost = node();
  const grid = Object.assign(node(), { clientWidth: 260, scrollWidth: 630, scrollLeft: 0 });
  grid.append(node(0), node(160));
  const section = { querySelector: selector => selector === '.home-games-grid' ? grid : controlsHost };
  const frames = new Map();
  const timers = new Map();
  let requestId = 0;
  let intersect;
  const page = Object.assign(node(), {
    ResizeObserver: class { observe() {} },
    IntersectionObserver: class { constructor(fn) { intersect = fn; } observe() {} },
    matchMedia: () => ({ matches: false, addEventListener() {} }),
    setTimeout: fn => { const id = ++requestId; timers.set(id, fn); return id; },
  });
  const globals = {
    document: Object.assign(node(), { querySelector: () => section, createElement: () => node(), hidden: false }),
    window: page,
    ResizeObserver: page.ResizeObserver,
    IntersectionObserver: page.IntersectionObserver,
    getComputedStyle: () => ({ columnGap: '10px' }),
    clearTimeout: id => timers.delete(id),
    requestAnimationFrame: fn => { const id = ++requestId; frames.set(id, fn); return id; },
    cancelAnimationFrame: id => frames.delete(id),
  };
  const original = Object.fromEntries(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  try {
    Object.assign(globalThis, globals);
    initHomeGamesMotion(english => english);
    const toggle = controlsHost.children[0].children[0];
    const settle = () => { const pending = [...timers.values()]; timers.clear(); pending.forEach(fn => fn()); };
    intersect([{ isIntersecting: true }]);
    assert.equal(frames.size, 1);
    grid.events.wheel({ deltaX: 3, deltaY: 40 });
    assert.equal(frames.size, 0);
    assert.equal(toggle.attrs['aria-label'], 'Pause');
    assert.match(toggle.innerHTML, /#pause"/);
    assert.equal(toggle.children.length, 0);
    settle();
    assert.equal(frames.size, 1);
    grid.events.wheel({ deltaX: 0, deltaY: 80, preventDefault: () => assert.fail('vertical scrolling was intercepted') });
    assert.equal(frames.size, 1);
    grid.events.pointermove({ pointerType: 'mouse', movementX: 0, movementY: 0 });
    assert.equal(frames.size, 1);
    grid.events.pointermove({ pointerType: 'mouse', movementX: 2 });
    assert.equal(frames.size, 0);
    grid.events.pointerleave();
    assert.equal(frames.size, 1);
    toggle.events.click();
    grid.events.wheel({ deltaX: 3 });
    settle();
    assert.equal(toggle.attrs['aria-label'], 'Resume');
    assert.match(toggle.innerHTML, /#play"/);
    assert.equal(frames.size, 0);
    toggle.events.click();
    assert.equal(frames.size, 1);
  } finally {
    for (const [key, descriptor] of Object.entries(original)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test('the enhanced strip keeps its original internal links and supports motion preferences', () => {
  const read = name => readFileSync(new URL(`../${name}`, import.meta.url), 'utf8');
  const source = read('scripts/scrolling-card-strip.js');
  assert.match(read('scripts/pages/home.js'), /renderLocalizedHomeGames\(\);\s*initHomeGamesMotion\(localeText\);/);
  assert.match(source, /copy\.setAttribute\('aria-hidden', 'true'\);\s*copy\.tabIndex = -1;/);
  assert.match(source, /distance = !reduced\.matches && hasOverflow/);
  assert.match(source, /grid\.addEventListener\('wheel', event => \{\s*if \([^\n]*\) waitForScrollIdle\(\);/);
  assert.match(source, /pointermove'[\s\S]*?hovering = true;[\s\S]*?pointerleave'[\s\S]*?hovering = false;/);
  assert.match(source, /previous\.addEventListener\('click', \(\) => stepByCard\(-1\)\);\s*next\.addEventListener\('click', \(\) => stepByCard\(1\)\);/);
  assert.match(read('styles/pages.css'), /\.home-games-grid\s*\{[^}]*display: flex;[^}]*overflow-x: auto;[^}]*scrollbar-width: none;/);
  const countryHeading = read('scripts/pages/country-media.js').split('<div class="country-new-games-head')[1].split('<div class="home-games-grid"')[0];
  assert.doesNotMatch(countryHeading, /<p\b/);
  const related = read('scripts/pages/related-brand-reviews.js');
  assert.match(related, /createReviewCard\(candidate, context\)/);
  assert.match(read('scripts/pages/home.js'), /createReviewCard\(brand, context\)/);
  for (const prefix of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
    const html = read(`${prefix}index.html`);
    const heading = html.match(/class="home-showcase-section home-new-games"[\s\S]*?(?=<div class="home-games-grid")/)?.[0] || '';
    assert.doesNotMatch(heading, /<p\b/);
    const games = html.match(/class="home-games-grid">([\s\S]*?)<\/div>/)?.[1] || '';
    assert.equal([...games.matchAll(/class="home-game-card" href="\/(?:[a-z]{2}\/)?brands\//g)].length, 18, prefix || 'en');
  }
});
