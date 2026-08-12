#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'de');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(ROOT);

const forbidden = [
  ['translated Telegram name', /\bTelegramm\b/g],
  ['internal bonus-document wording', /\b(?:Bonusbrief|Quelldokument|Tabellenkalkulation)\b/gi],
  ['technical website wording', /\b(?:Site-Build|Wildsino-Build|Website-Build|aktuelle[rn]? Build|Site-Konfiguration)\b/gi],
  ['literal product-shell wording', /\b(?:Casino|Sportwetten|Slot|Spielautomaten|Promo|Bonus|All-Games)(?:-plus-Slots)?-(?:Hülle|Shell)\b/gi],
  ['literal fit wording', /\b(?:Produkt|AU\/NZ|lokale|Praktische|Beste) Passform\b/gi],
  ['literal cashier-route wording', /\b(?:Kassenbereichroute|Auszahlungsroute|Einzahlungsroute)\b/gi],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8').replace(/<!--([\s\S]*?)-->/g, '');
  for (const [label, pattern] of forbidden) {
    const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }
}

console.log(`German copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
