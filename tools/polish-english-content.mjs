#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const localizedRoots = new Set(['de', 'es', 'it', 'pl', 'uk', 'node_modules', '.git']);
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && localizedRoots.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(ROOT);

const replacements = [
  [/Casino Casino Review/g, 'Casino Review'],
  [/current bonus brief/gi, 'current bonus terms'],
  [/the bonus brief lists/gi, 'the current bonus terms list'],
  [/The current ([^.<]+) site build embeds an Anjouan Gaming verification seal/gi, 'The $1 site displays an Anjouan Gaming verification badge'],
  [/The current site build embeds an Anjouan Gaming verification seal/gi, 'The site displays an Anjouan Gaming verification badge'],
  [/The current site build embeds an Anjouan verification seal/gi, 'The site displays an Anjouan verification badge'],
  [/The current build embeds an Anjouan Gaming verification seal/gi, 'The site displays an Anjouan Gaming verification badge'],
  [/The current site configuration loads an Anjouan Gaming verification seal/gi, 'The site displays an Anjouan Gaming verification badge'],
  [/The current SpinBoss site is configured to load an Anjouan Gaming verification seal/gi, 'The SpinBoss site displays an Anjouan Gaming verification badge'],
  [/The current site build is configured to load an Anjouan Gaming seal/gi, 'The site displays an Anjouan Gaming verification badge'],
  [/The current site build loads an Anjouan Gaming verification seal/gi, 'The site displays an Anjouan Gaming verification badge'],
  [/Anjouan Gaming seal UUID ([A-Za-z0-9-]+) is embedded in the current build/gi, 'The site displays an Anjouan Gaming verification badge with UUID $1'],
  [/Open the live seal/gi, 'Open the verification page'],
  [/verify the live seal/gi, 'verify the licence status'],
  [/Confirm the live seal/gi, 'Confirm the licence status'],
  [/>Complaint Route</g, '>Complaints Process<'],
  [/>Cashier Route</g, '>Cashier Check<'],
  [/>Support route</gi, '>Support<'],
  [/thin skins-only casino/gi, 'limited casino site'],
  [/pure promo shell/gi, 'promotion-only site'],
  [/thin promo shell/gi, 'basic promotion-only site'],
  [/one-page bonus shell/gi, 'single-page bonus site'],
  [/one-bonus shell/gi, 'single-bonus offer'],
  [/single-bonus shell/gi, 'single-bonus offer'],
  [/simple sportsbook-plus-slots shell/gi, 'basic sportsbook-and-slots site'],
  [/simple sportsbook shell/gi, 'basic sportsbook site'],
  [/basic big-five sportsbook shell/gi, 'basic sportsbook focused only on major sports'],
  [/generic football-heavy sportsbook shell/gi, 'generic sportsbook focused mainly on football'],
  [/clone-style casino shell/gi, 'generic casino site'],
  [/narrower casino shell/gi, 'more limited casino site'],
  [/flat all-games shell/gi, 'single unfiltered games page'],
];

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed += 1;
}

console.log(`Polished recurring English copy on ${changed} pages.`);
