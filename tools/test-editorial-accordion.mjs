import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { bindMobileEditorialCards } from '../scripts/editorial-accordion.js';

const read = file => readFileSync(new URL(`../${file}`, import.meta.url), 'utf8');

function makeCard() {
  const classes = new Set();
  const children = Array.from({ length: 3 }, () => ({ dataset: {}, id: '' }));
  children.forEach((el, i) => Object.defineProperty(el, 'nextElementSibling', {
    get: () => children[i + 1] ?? null,
  }));
  return {
    children,
    classes,
    dataset: {},
    classList: { toggle: (name, on) => on ? classes.add(name) : classes.delete(name) },
    querySelector: () => children[0],
    ownerDocument: {
      createElement: () => {
        const attributes = new Map();
        return {
          setAttribute: (name, value) => attributes.set(name, value),
          getAttribute: name => attributes.get(name),
          addEventListener(name, listener) { this[name] = listener; },
        };
      },
    },
    append: el => children.push(el),
  };
}

test('accordion preserves every content element and discloses it through an accessible button', () => {
  const cards = [makeCard(), makeCard()];
  const options = { idPrefix: 'test-guide', labels: { collapsed: 'Show', expanded: 'Hide' } };
  bindMobileEditorialCards(cards, options);
  bindMobileEditorialCards(cards, options);
  const [heading, firstCopy, secondCopy, toggle] = cards[0].children;
  assert.equal(cards[0].children.length, 4);
  assert.equal(toggle.type, 'button');
  assert.equal(toggle.getAttribute('aria-labelledby'), heading.id);
  assert.equal(toggle.getAttribute('aria-controls'), `${firstCopy.id} ${secondCopy.id}`);
  for (const card of cards) assert.equal(card.children[3].getAttribute('aria-expanded'), 'false');
  assert.notEqual(cards[1].children[0].id, heading.id);
  toggle.click();
  assert.equal(toggle.getAttribute('aria-expanded'), 'true');
  assert.ok(cards[0].classes.has('is-mobile-expanded'));
  assert.equal(toggle.title, 'Hide');
  toggle.click();
  assert.equal(toggle.getAttribute('aria-expanded'), 'false');
  assert.ok(!cards[0].classes.has('is-mobile-expanded'));
  assert.equal(toggle.title, 'Show');
});

test('country guides only hide text after enhancement and only on narrow screens', () => {
  const css = read('styles/section-contrast-preview.css');
  const mobile = css.slice(css.indexOf('@media (max-width: 560px)'), css.indexOf('/* FAQ:'));
  assert.match(mobile, /\.country-guide-carousel\s*\{[^}]*display: grid;[^}]*overflow: visible;/);
  assert.match(mobile, /\.country-guide-carousel > div\[data-mobile-accordion-ready\]:not\(\.is-mobile-expanded\) > \[data-editorial-copy\]\s*\{\s*display: none;/);
  assert.match(read('styles/pages.css'), /\.content-article \.country-guide-carousel\s*\{[^}]*display: flex;[^}]*overflow-x: auto;/);
  assert.match(read('scripts/main.js'), /bindMobileEditorialCards\(cards,\s*\{\s*idPrefix: [^\n]+,\s*labels:/);
});
