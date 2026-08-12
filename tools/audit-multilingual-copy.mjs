#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const locales = ['de', 'es', 'it', 'pl', 'uk'];
const emailPattern = /[^\s<>"']+@[^\s<>"']+\.[A-Za-z]{2,}/g;
const errors = [];

const walk = directory => {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.name === 'index.html') files.push(absolute);
  }
  return files;
};

const emails = html => [...new Set((html.match(emailPattern) || []).map(value => value.toLowerCase()).sort())];

for (const locale of locales) {
  for (const file of walk(path.join(ROOT, locale))) {
    const relative = path.relative(path.join(ROOT, locale), file);
    const sourceFile = path.join(ROOT, relative);
    if (!fs.existsSync(sourceFile)) continue;
    const sourceEmails = emails(fs.readFileSync(sourceFile, 'utf8'));
    const targetEmails = emails(fs.readFileSync(file, 'utf8'));
    if (sourceEmails.join('\n') !== targetEmails.join('\n')) {
      errors.push(`${locale}/${relative}: email mismatch (${targetEmails.join(', ') || 'none'} != ${sourceEmails.join(', ') || 'none'})`);
    }
  }
}

const officialSpinbossTiers = ['Intern', 'Receptionist', 'Sales Rep', 'Regional Manager', "World's Best Boss"];
for (const locale of locales) {
  const file = path.join(ROOT, locale, 'brands/spinboss/index.html');
  const html = fs.readFileSync(file, 'utf8');
  for (const tier of officialSpinbossTiers) {
    if (!html.includes(`<td>${tier}</td>`)) errors.push(`${locale}/brands/spinboss/index.html: missing official VIP tier ${tier}`);
  }
}

console.log(`Multilingual protected-copy audit: ${locales.length} locales, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 500).join('\n'));
  process.exitCode = 1;
}
