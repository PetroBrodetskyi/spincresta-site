#!/usr/bin/env node

import { BRANDS } from '../scripts/brands.js';
import { BRAND_BONUS_TRANSLATIONS } from '../scripts/brand-bonus-translations.js';

const LOCALES = ['de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi'];
const bonuses = [...new Set(BRANDS.map(brand => brand.bonus?.replace(/\s+/g, ' ').trim()).filter(Boolean))];
const errors = [];

for (const locale of LOCALES) {
  const translations = BRAND_BONUS_TRANSLATIONS[locale] || {};
  for (const bonus of bonuses) {
    if (!translations[bonus]) errors.push(`${locale}: missing dynamic translation for “${bonus}”`);
  }
}

console.log(`Brand bonus localization audit: ${bonuses.length} unique bonuses, ${LOCALES.length} locales, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
