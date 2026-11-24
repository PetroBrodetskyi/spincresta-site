import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { compactBrandPayments } from './sync-compact-brand-payments.mjs';

const paymentPanel = /<div class="brand-payments">[\s\S]*?<div\b[^>]*id="brand-payments"[^>]*><\/div>\s*<\/div>/;

test('payment icons stay in their panel; unique text belongs in the main cashier section', () => {
  const icons = '<div class="payments-container" id="brand-payments"></div>';
  const intro = '<p class="brand-availability-intro">Market-specific methods.</p>';
  const note = '<p>Withdrawals have separate limits.</p>';
  const fixture = `<div class="brand-payments"><h2>Payment methods</h2>${intro}${icons}<p>Provider availability varies.</p></div><main><section><h2>Cashier</h2>${note}</section></main>`;
  const compact = compactBrandPayments(fixture, 0);
  assert.equal(compact.match(paymentPanel)?.[0], `<div class="brand-payments"><h2>Payment methods</h2>${icons}</div>`);
  assert.match(compact, /<h2>Cashier<\/h2>\s*<p class="section-intro">Market-specific methods\.<\/p>\s*<p>Provider availability varies\.<\/p><p>Withdrawals have separate limits\.<\/p>/);
  assert.equal(compactBrandPayments(compact, 0), compact);
  assert.doesNotMatch(compactBrandPayments(fixture), /Market-specific methods|Provider availability varies/);
});

test('all localized panels are compact and JeetCity details stay in the editorial review', () => {
  execFileSync(process.execPath, ['tools/sync-compact-brand-payments.mjs', '--check']);
  for (const prefix of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
    const file = `${prefix}brands/jeetcity/index.html`;
    const html = readFileSync(file, 'utf8');
    assert.match(html, paymentPanel, file);
    assert.match(html.match(/<main\b[\s\S]*?<\/main>/)?.[0] ?? '', /<h2[^>]*>[^<]+<\/h2>\s*<p class="section-intro">\s*[^<]+/, file);
  }
  assert.match(readFileSync('brands/jeetcity/index.html', 'utf8'), /<p class="section-intro">\s*JeetCity supports[\s\S]*?MiFinity[\s\S]*?<\/p>/);
});
