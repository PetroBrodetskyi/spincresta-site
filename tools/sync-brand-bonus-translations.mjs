#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const LOCALES = ['de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const OUTPUT_DIRECTORY = path.join(ROOT, 'scripts', 'brand-bonus-translations');
const GOLDPARI_BONUS = '100% First-Deposit Bonus + 30 Free Spins in Selected Markets';
const SILVERPLAY_BONUS = '300% up to EUR 2,500 + 250 Free Spins';
const CASINOVA_BONUS = 'Up to €2,000 + 350 Free Spins';
const BONUS_TRANSLATION_OVERRIDES = {
  de: { [GOLDPARI_BONUS]: '100 % Ersteinzahlungsbonus + 30 Freispiele in ausgewählten Märkten', [SILVERPLAY_BONUS]: '300 % bis zu 2.500 EUR + 250 Freispiele', [CASINOVA_BONUS]: 'Bis zu 2.000 € + 350 Freispiele' },
  es: { [GOLDPARI_BONUS]: 'Bono del 100 % en el primer depósito + 30 giros gratis en mercados seleccionados', [SILVERPLAY_BONUS]: '300 % hasta 2.500 EUR + 250 giros gratis', [CASINOVA_BONUS]: 'Hasta 2.000 € + 350 giros gratis' },
  it: { [GOLDPARI_BONUS]: 'Bonus del 100% sul primo deposito + 30 giri gratis nei mercati selezionati', [SILVERPLAY_BONUS]: '300% fino a 2.500 EUR + 250 giri gratuiti', [CASINOVA_BONUS]: 'Fino a 2.000 € + 350 giri gratis' },
  pl: { [GOLDPARI_BONUS]: '100% bonusu od pierwszej wpłaty + 30 darmowych spinów na wybranych rynkach', [SILVERPLAY_BONUS]: '300% do 2 500 EUR + 250 darmowych spinów', [CASINOVA_BONUS]: 'Do 2 000 € + 350 darmowych spinów' },
  uk: { [GOLDPARI_BONUS]: '100% бонус на перший депозит + 30 фріспінів на вибраних ринках', [SILVERPLAY_BONUS]: '300% до 2 500 EUR + 250 безкоштовних обертань', [CASINOVA_BONUS]: 'До 2 000 € + 350 фріспінів' },
  pt: { [GOLDPARI_BONUS]: 'Bónus de 100% no primeiro depósito + 30 jogadas grátis em mercados selecionados', [SILVERPLAY_BONUS]: '300% até 2 500 EUR + 250 jogadas grátis', [CASINOVA_BONUS]: 'Até 2 000 € + 350 jogadas grátis' },
  fr: { [GOLDPARI_BONUS]: 'Bonus de 100 % sur le premier dépôt + 30 tours gratuits dans certains marchés', [SILVERPLAY_BONUS]: '300 % jusqu’à 2 500 EUR + 250 tours gratuits', [CASINOVA_BONUS]: 'Jusqu’à 2 000 € + 350 tours gratuits' },
  hi: { [GOLDPARI_BONUS]: 'चुनिंदा बाज़ारों में पहले जमा पर 100% बोनस + 30 फ्री स्पिन', [SILVERPLAY_BONUS]: '300% में 2,500 EUR तक + 250 मुफ़्त स्पिन', [CASINOVA_BONUS]: '€2,000 तक + 350 मुफ़्त स्पिन' },
  fi: { [GOLDPARI_BONUS]: '100 % ensitalletusbonus + 30 ilmaiskierrosta valituilla markkinoilla', [SILVERPLAY_BONUS]: '300 % enintään 2 500 EUR + 250 ilmaiskierrosta', [CASINOVA_BONUS]: 'Enintään 2 000 € + 350 ilmaiskierrosta' },
};
const decodeHtml = value =>
  value
    .replace(/&euro;/gi, '€')
    .replace(/&pound;/gi, '£')
    .replace(/&dollar;/gi, '$')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&apos;|&#39;/gi, "'")
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const readBonusRows = locale => {
  const file = path.join(ROOT, locale, 'casinos-and-betting', 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  return [...html.matchAll(/<article class="casino-list-row"[\s\S]*?<\/article>/g)].map(match => {
    const href = match[0].match(/href="(?:\/[a-z]{2})?\/brands\/([^"/]+)\/?"/)?.[1] || '';
    const paragraphs = [...match[0].matchAll(/<p class="casino-bonus">([\s\S]*?)<\/p>/g)];
    return {
      slug: href,
      bonus: paragraphs.length < 2 ? '' : decodeHtml(paragraphs[1][1].replace(/<strong>[\s\S]*?<\/strong>/, '')),
    };
  });
};

const writeDirectoryBonus = (locale, slug, bonus) => {
  const file = path.join(ROOT, locale, 'casinos-and-betting', 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  let found = false;
  const updated = html.replace(
    new RegExp(`<article class="casino-list-row"[^>]*data-brand-slug="${slug}"[\\s\\S]*?<\\/article>`),
    row => {
      found = true;
      let index = 0;
      return row.replace(
        /(<p class="casino-bonus"><strong>[^<]+<\/strong>)[\s\S]*?(<\/p>)/g,
        (paragraph, start, end) => {
            const value = index === 1 ? bonus : null;
          index += 1;
          return value === null ? paragraph : `${start} ${value}${end}`;
        },
      );
    },
  );

  if (!found) {
    throw new Error(`${locale || 'en'}: could not find the ${slug} directory row`);
  }

  if (updated !== html) fs.writeFileSync(file, updated);
};

const english = readBonusRows('');
const sourceBySlug = new Map(
  BRANDS.map(brand => {
    const slug = brand.urlDetail
      ?.replace(/^\/?brands\//, '')
      .replace(/\.html$/, '')
      .replace(/^\/+|\/+$/g, '');
    return [slug, brand.bonus?.replace(/\s+/g, ' ').trim()];
  }),
);

fs.mkdirSync(OUTPUT_DIRECTORY, { recursive: true });
writeDirectoryBonus('', 'silverplay', SILVERPLAY_BONUS);
writeDirectoryBonus('', 'casinova', CASINOVA_BONUS);

for (const locale of LOCALES) {
  const rows = readBonusRows(locale);
  if (rows.length !== english.length) {
    throw new Error(`${locale}: expected ${english.length} catalog rows, found ${rows.length}`);
  }

  const entries = rows
    .map(row => [sourceBySlug.get(row.slug), row.bonus])
    .filter(([source, translated]) => source && translated);
  const output = { ...Object.fromEntries(entries), ...BONUS_TRANSLATION_OVERRIDES[locale] };
  const banner = '// Generated by tools/sync-brand-bonus-translations.mjs. Do not edit manually.\n';
  const source = `${banner}export default ${JSON.stringify(output, null, 2)};\n`;
  fs.writeFileSync(path.join(OUTPUT_DIRECTORY, `${locale}.js`), source);
  writeDirectoryBonus(locale, 'silverplay', BONUS_TRANSLATION_OVERRIDES[locale][SILVERPLAY_BONUS]);
  writeDirectoryBonus(locale, 'casinova', BONUS_TRANSLATION_OVERRIDES[locale][CASINOVA_BONUS]);
}

console.log(`Brand bonus translations synced into ${LOCALES.length} locale-specific files.`);
