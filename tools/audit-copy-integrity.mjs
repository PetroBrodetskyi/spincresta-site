#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const excluded = new Set(['.git', '.vercel', 'node_modules', 'tmp']);
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
  ['duplicated casino label', /\bCasino Casino\b/g],
  ['duplicated modifier', /\b(?:reine reine|gratuiti gratuiti)\b/gi],
  ['mojibake replacement character', /�|â€™|â€“|Ã[©¨¼¶Ÿ]/g],
  ['double-encoded entity', /&amp;(?:amp|quot|apos|lt|gt);/gi],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8');
  for (const [label, pattern] of forbidden) {
    const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }
}

console.log(`Copy integrity audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
