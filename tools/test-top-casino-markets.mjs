import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { topCasinosForCountry } from '../scripts/pages/top-casinos.js';
import { syncTopCasinoMarkets } from './top-casino-markets.mjs';
import { syncDefaultTheme } from './sync-default-theme.mjs';

const read = route => fs.readFileSync(new URL('../' + route + '/index.html', import.meta.url), 'utf8');
const countryLinks = html => [...html.matchAll(/<a class="country-link" href="([^"]+)"[^>]*><img[^>]*><span>([^<]+)<\/span><\/a>/g)]
  .map(([, href, title]) => [href, title]);

test('all localized rankings have the same country links as home and a single ranking panel', () => {
  for (const prefix of ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/']) {
    const html = read(prefix + 'top-casinos');
    const picker = html.split('<!-- top-casino-picker:start -->')[1].split('<!-- top-casino-picker:end -->')[0];
    const home = fs.readFileSync(new URL('../' + prefix + 'index.html', import.meta.url), 'utf8');
    const homeCloud = home.match(/<div class="countries-cloud">([\s\S]+?)<\/div>/)[1];
    const links = [...picker.matchAll(/^<a class="country-link".*<\/a>$/gm)].map(([link]) => link).join('\n');
    assert.ok(countryLinks(picker).length > 55, prefix);
    assert.deepEqual(countryLinks(picker), countryLinks(homeCloud), prefix);
    assert.equal((html.match(/\bdata-top-casino-results\b/g) || []).length, 1, prefix);
    assert.doesNotMatch(html, /top-casinos-hero-actions|class="content" data-country=/, prefix);
    assert.equal(syncTopCasinoMarkets(html, prefix ? prefix.slice(0, -1) : 'en', links), html, prefix);
    assert.equal(syncDefaultTheme(html), html, `${prefix || 'en'}: current ranking entry assets`);
  }
});

test('the selected country keeps the existing preview ranking order and limit', () => {
  const brands = [
    { name: 'ordinary', countries: ['BD'] },
    { name: 'priority later', countries: ['BD'], countryPagePriority: 3 },
    { name: 'another country', countries: ['CA'], top: ['CA'] },
    { name: 'top', countries: ['BD'], top: ['BD'] },
    { name: 'priority first', countries: ['BD'], countryPagePriority: 1 },
    { name: 'blocked', countries: ['BD'], temporarilyUnavailable: true, countryPagePriority: 0 },
    { name: 'ordinary two', countries: ['BD'] },
  ];
  assert.deepEqual(topCasinosForCountry(brands, 'BD').map(brand => brand.name),
    ['priority first', 'priority later', 'top', 'ordinary', 'ordinary two']);
  assert.deepEqual(topCasinosForCountry(brands, 'XX'), []);
});

test('the sixth mobile card follows the desktop ranking and stays within the same market', () => {
  const brands = [
    { name: 'available first', countries: ['BR'], countryPagePriority: 1 },
    { name: 'unavailable', countries: ['BR'], temporarilyUnavailable: true, countryPagePriority: 0 },
    { name: 'different market', countries: ['CA'], countryPagePriority: 0 },
    ...Array.from({ length: 6 }, (_, index) => ({ name: `available ${index}`, countries: ['BR'] })),
  ];
  const desktop = topCasinosForCountry(brands, 'BR');
  const mobile = topCasinosForCountry(brands, 'BR', 6);
  assert.deepEqual(mobile, [...desktop, brands[7]]);
  assert.deepEqual(topCasinosForCountry(brands, 'CA', 6), [brands[2]]);
  assert.deepEqual(topCasinosForCountry(brands, 'XX', 6), []);
});
