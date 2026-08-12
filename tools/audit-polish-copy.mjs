#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PL_ROOT = path.join(ROOT, 'pl');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(PL_ROOT);

const forbidden = [
  ['machine placeholder', /ZXQ|QXZ/g],
  ['literal reality-check translation', /\bkontrol(?:a|e|i) rzeczywistości\b/gi],
  ['awkward safer-gambling translation', /\bbezpieczniejsz(?:y|a|e) (?:hazard|gra|gry)\b/gi],
  ['literal deposit-match translation', /\b(?:dopasowanie|dopasowania|pasujący) depozyt/gi],
  ['literal deposit-match adjective', /\bdopasowani(?:e|a|ami) depozytow/gi],
  ['literal wagering translation', /\bwymagani(?:e|a) dotyczące (?:zakładów|obstawiania)\b/gi],
  ['withdrawal mistranslation', /\bwycofani(?:e|a) środków\b/gi],
  ['awkward safer-play controls', /\b(?:kontrole bezpieczniejszej gry|bezpieczniejsze kontrole|kontrola bezpieczniejszej gry|narzędzia zapewniające bezpieczniejszą zabawę)\b/gi],
  ['literal wagering multiple', /\bzakład(?:y|ów) x\d+\b/gi],
  ['literal review snapshot', /\bmigawka\b/gi],
  ['literal slot translation', /\b(?:gry szczelinowe|szczeliny online)\b/gi],
  ['literal crash-game translation', /\b(?:gry awaryjne|katastrofy)\b/gi],
  ['wrong partners label', />Wzmacniacz</g],
  ['literal cashier translation', /\b(?:kasjer na żywo|w kasie na żywo)\b/gi],
  ['awkward player-controls translation', /\b(?:Sterowanie odtwarzaczem|elementy sterujące)\b/gi],
  ['source-document disclosure', /\b(?:arkusz kalkulacyjny|dokument źródłowy|plik źródłowy|briefing)\b/gi],
  ['untranslated UI phrase', /\b(?:play now|claim bonus|learn more|payment methods|why players choose)\b/gi],
  ['untranslated translation marker', /\b(?:Mobile-First|Crypto-First|Casino-First|Sport-First)\b/g],
  ['bad home translation', />Dom</g],
  ['untranslated First marker', /\bFirst\b/g],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(PL_ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<meta\b[^>]*name=["']keywords["'][^>]*>/gi, '');
  for (const [label, pattern] of forbidden) {
    if (label === 'untranslated First marker' && ['brands/first/index.html', 'casinos-and-betting/index.html'].includes(relative)) continue;
    const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
    const matches = [...html.matchAll(new RegExp(pattern.source, flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }
}

console.log(`Polish copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
