#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const excluded = new Set(['de', 'es', 'it', 'pl', 'uk', 'node_modules', '.git']);
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excluded.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(ROOT);

const forbidden = [
  ['internal source-document wording', /\b(?:bonus brief|source document|spreadsheet)\b/gi],
  ['technical website wording', /\b(?:current site build|current build|site configuration|configured to load)\b/gi],
  ['awkward product-shell wording', /\b(?:skins-only casino|promo shell|bonus shell|sportsbook shell|casino shell|all-games shell)\b/gi],
  ['awkward labelled route', />(?:Complaint|Cashier|Support) Route</gi],
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

console.log(`English copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
