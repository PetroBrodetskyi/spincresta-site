#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOCALE_ROOT = path.join(ROOT, 'fi');
const errors = [];
const forbidden = [
  [/\bCasino Review\b/gi, 'untranslated review heading'],
  [/Review details coming soon/gi, 'untranslated review placeholder'],
  [/Plussat ja miinukset oikeille pelaajille/gi, 'literal pros-and-cons heading'],
  [/Hyvä istuvuus/gi, 'literal player-fit heading'],
  [/Mieti kahdesti jos/gi, 'literal suitability heading'],
  [/nostovirta/gi, 'literal withdrawal-flow wording'],
  [/kassavirta/gi, 'literal cashier-flow wording'],
  [/kassanhoitaja/gi, 'literal cashier wording'],
  [/maksureitti/gi, 'literal payment-route wording'],
  [/nostoreitti/gi, 'literal withdrawal-route wording'],
  [/kryptoreitti/gi, 'literal crypto-route wording'],
  [/tuotemerkki/gi, 'stiff brand wording'],
  [/online-kasino/gi, 'non-native online-casino wording'],
  [/turvallisempi pelaaminen/gi, 'literal safer-gambling wording'],
  [/promootiokuva/gi, 'literal promotion-snapshot wording'],
  [/bonuskuva/gi, 'literal bonus-snapshot wording'],
  [/The current brief|The brief lists|current brief|source document|spreadsheet/gi, 'internal source wording'],
];

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const absolute = path.join(directory, entry.name);
  if (entry.isDirectory()) return walk(absolute);
  return entry.name === 'index.html' ? [absolute] : [];
});

const files = walk(LOCALE_ROOT);
let brandFaqPages = 0;
let prosConsPages = 0;
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8').replace(/<!--([\s\S]*?)-->/g, '');
  const relative = path.relative(ROOT, file);
  if (!/<html\b[^>]*\blang=["']fi-FI["']/i.test(html)) errors.push(`${relative}: missing fi-FI lang`);
  if (!/<body\b[^>]*\bdata-language=["']fi["']/i.test(html)) errors.push(`${relative}: missing data-language=fi`);
  if (!/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']https:\/\/spincresta\.com\/fi\//i.test(html)) {
    errors.push(`${relative}: invalid Finnish canonical`);
  }
  for (const [pattern, label] of forbidden) {
    const matches = html.match(pattern);
    if (matches?.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }

  if (/\bdata-brand=["'][^"']+["']/i.test(html)) {
    const hasPros = /<strong>\s*Plussat\s*<\/strong>/i.test(html);
    const hasCons = /<strong>\s*Miinukset\s*<\/strong>/i.test(html);
    if (hasPros || hasCons) {
      prosConsPages += 1;
      if (!hasPros || !hasCons) errors.push(`${relative}: incomplete Finnish pros-and-cons pair`);
    }

    const faqSections = [...html.matchAll(/<section\b[^>]*>[\s\S]*?<h2\b[^>]*>([^<]*(?:FAQ|UKK|kysym)[^<]*)<\/h2>[\s\S]*?<div class=["']timeline["']>([\s\S]*?)<\/div>[\s\S]*?<\/section>/gi)];
    if (faqSections.length) {
      brandFaqPages += 1;
      for (const [, heading, content] of faqSections) {
        const questions = (content.match(/<h3\b/gi) || []).length;
        const answers = (content.match(/<p\b/gi) || []).length;
        if (!questions || !answers) errors.push(`${relative}: incomplete FAQ timeline under “${heading.trim()}”`);
      }
    }
  }
}

const mainSource = fs.readFileSync(path.join(ROOT, 'scripts', 'main.js'), 'utf8');
const brandSource = fs.readFileSync(path.join(ROOT, 'scripts', 'pages', 'brand.js'), 'utf8');
if (!/titleText\.includes\(['"]ukk['"]\)/.test(mainSource) || !/titleText\.includes\(['"]kysym['"]\)/.test(mainSource)) {
  errors.push('scripts/main.js: Finnish FAQ headings are not recognized by the accordion enhancer');
}
if (!/label === ['"]plussat['"]/.test(brandSource) || !/label === ['"]miinukset['"]/.test(brandSource)) {
  errors.push('scripts/pages/brand.js: Finnish pros-and-cons labels are not recognized by the icon enhancer');
}

console.log(`Finnish copy audit: ${files.length} pages, ${brandFaqPages} brand FAQ timelines, ${prosConsPages} pros-and-cons pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
