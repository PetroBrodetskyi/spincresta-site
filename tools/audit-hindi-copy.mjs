#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOCALE_ROOT = path.join(ROOT, 'hi');
const errors = [];
const forbidden = [
  [/वर्तमान ब्रांड डेटा/gi, 'literal brand-data wording'],
  [/भुगतान मार्ग/gi, 'literal payment-route wording'],
  [/निकासी मार्ग/gi, 'literal withdrawal-route wording'],
  [/शिकायत मार्ग/gi, 'literal complaint-route wording'],
  [/उत्पाद शेल/gi, 'literal product-shell wording'],
  [/कैशियर के प्रदर्शन/gi, 'literal cashier-performance wording'],
  [/असली खिलाड़ियों के लिए फायदे और नुकसान/gi, 'unnatural pros-and-cons heading'],
  [/भुगतान, सत्यापन और कैशआउट प्रवाह/gi, 'unnatural cashout-flow heading'],
  [/पंजीकरण से पहले खिलाड़ी चेकलिस्ट/gi, 'unnatural registration heading'],
  [/अगर दो बार सोचो/gi, 'literal suitability heading'],
  [/अच्छे तरह से फिट होना/gi, 'literal suitability phrase'],
  [/प्रतिस्पर्धी बाधाओं/gi, 'literal odds translation'],
  [/कैशियर सीमा/gi, 'literal cashier-limit wording'],
  [/2020 से iGaming 2020/gi, 'duplicated experience wording'],
  [/शीर्षक प्रतिशत/gi, 'literal headline-percentage wording'],
  [/निकासी घर्षण/gi, 'literal withdrawal-friction wording'],
  [/भारतीय-सामना वाली/gi, 'literal India-facing wording'],
  [/प्रायोगिक उपकरण/gi, 'literal practical-advice heading'],
  [/मोबाइल-First/gi, 'mixed-language mobile-first wording'],
  [/कैशियर First/gi, 'mixed-language cashier-first wording'],
  [/स्नैपशॉट/gi, 'literal snapshot wording'],
  [/हेडलाइन/gi, 'literal headline wording'],
  [/चल रहे प्रोमो/gi, 'literal ongoing-promo wording'],
  [/दृष्टिपहलू/gi, 'corrupted drishtikon wording'],
  [/घर्षण/gi, 'literal friction wording'],
  [/सामना वाली/gi, 'literal facing-market wording'],
  [/श्रेणीे/gi, 'corrupted lene wording'],
  [/विकल्पदर्श/gi, 'corrupted margdarshan wording'],
];

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const absolute = path.join(directory, entry.name);
  if (entry.isDirectory()) return walk(absolute);
  return entry.name === 'index.html' ? [absolute] : [];
});

const files = walk(LOCALE_ROOT);
for (const file of files) {
  const html = fs.readFileSync(file, 'utf8').replace(/<!--([\s\S]*?)-->/g, '');
  if (!/<html\b[^>]*\blang=["']hi-IN["']/i.test(html)) errors.push(`${path.relative(ROOT, file)}: missing hi-IN lang`);
  if (!/<body\b[^>]*\bdata-language=["']hi["']/i.test(html)) errors.push(`${path.relative(ROOT, file)}: missing data-language=hi`);
  for (const [pattern, label] of forbidden) {
    const matches = html.match(pattern);
    if (matches?.length) errors.push(`${path.relative(ROOT, file)}: ${label} (${matches.length})`);
  }
  const relative = path.relative(LOCALE_ROOT, file).split(path.sep).join('/');
  if (!['brands/first/index.html', 'casinos-and-betting/index.html'].includes(relative)) {
    const firstMatches = html.match(/\bFirst\b/g);
    if (firstMatches?.length) errors.push(`${relative}: untranslated First marker (${firstMatches.length})`);
  }
}

console.log(`Hindi copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
