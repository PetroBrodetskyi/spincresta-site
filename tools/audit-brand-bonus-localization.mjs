#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const LOCALES = ['de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi'];
const bonuses = [...new Set(BRANDS.map(brand => brand.bonus?.replace(/\s+/g, ' ').trim()).filter(Boolean))];
const errors = [];

for (const locale of LOCALES) {
  const file = path.join(ROOT, 'scripts', 'brand-bonus-translations', `${locale}.js`);
  if (!fs.existsSync(file)) {
    errors.push(`${locale}: locale bonus module is missing`);
    continue;
  }

  const { default: translations = {} } = await import(`${pathToFileURL(file).href}?audit=${Date.now()}`);
  for (const bonus of bonuses) {
    if (!translations[bonus]) errors.push(`${locale}: missing dynamic translation for “${bonus}”`);
  }
}

console.log(`Brand bonus localization audit: ${bonuses.length} unique bonuses, ${LOCALES.length} locales, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
