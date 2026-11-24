import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { runInNewContext } from 'node:vm';
import { publicThemePages, syncDefaultTheme } from './sync-default-theme.mjs';

const root = new URL('../', import.meta.url);
const read = file => readFileSync(new URL(file, root), 'utf8');

test('all published brand pages install the layout guard before requesting CSS', () => {
  for (const file of publicThemePages()) {
    const html = readFileSync(file, 'utf8');
    const guards = [...html.matchAll(/<script data-brand-layout-guard>/g)];
    if (!/<body\b[^>]*\bdata-brand=/.test(html)) {
      assert.equal(guards.length, 0, file);
      continue;
    }
    assert.equal(guards.length, 1, file);
    assert.ok(guards[0].index < html.indexOf('/styles.css?'), file);
    assert.equal(syncDefaultTheme(html), html, file);
  }
});

test('a failed main script releases the readable review without releasing for unrelated assets', () => {
  const html = read('brands/duckyluck/index.html');
  const guard = html.match(/<script data-brand-layout-guard>([^<]+)<\/script>/)?.[1];
  const active = new Set();
  const listeners = {};
  class HTMLScriptElement { constructor(src) { this.src = src; } }
  runInNewContext(guard, {
    document: { documentElement: { classList: { add: name => active.add(name), remove: name => active.delete(name) } } },
    window: { addEventListener: (name, handler, capture) => { assert.equal(capture, true); listeners[name] = handler; } },
    HTMLScriptElement,
  });
  assert.ok(active.has('brand-layout-pending'));
  listeners.error({ target: new HTMLScriptElement('https://www.googletagmanager.com/gtag/js') });
  assert.ok(active.has('brand-layout-pending'));
  listeners.error({ target: new HTMLScriptElement('https://spincresta.com/scripts/main.js?v=first-paint') });
  assert.ok(!active.has('brand-layout-pending'));
});

test('enhancement leaves the old markup untouched until modules are ready and releases only after initialization', () => {
  const css = read('styles/pages.css');
  const js = read('scripts/main.js');
  assert.match(css, /html\.brand-layout-pending body\[data-brand\]\s*> :where\(\.hero, section, main, \.all-countries, \.footer\)\s*\{\s*visibility: hidden;/);
  const init = js.slice(js.indexOf('export const initCasinoPage'));
  const ready = init.indexOf('await Promise.all([pageModulesReady, brandBonusTranslationsReady, brandLayoutModuleReady])');
  assert.ok(ready >= 0 && ready < init.indexOf('initBrandLayoutModule?.('));
  assert.match(init, /initCasinoPage\(\)\s*\.catch\([^\n]+\)\s*\.finally\(\(\) => document\.documentElement\.classList\.remove\('brand-layout-pending'\)\)/);
});
