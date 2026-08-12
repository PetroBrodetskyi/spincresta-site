#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IT_ROOT = path.join(ROOT, 'it');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(IT_ROOT);

const forbidden = [
  ['machine placeholder', /ZXQ|QXZ/g],
  ['untranslated review term', /\b(?:Revisione|revisione|Revisioni|revisioni)\b/g],
  ['literal reality-check translation', /\bcontroll(?:o|i) di realtà\b/gi],
  ['awkward safer-gambling translation', /\b(?:gioco|gioco d['’]azzardo) più sicuro\b/gi],
  ['awkward safer-tools translation', /\b(?:controlli più sicuri|strumenti di gioco più sicuri)\b/gi],
  ['literal deposit-match translation', /\b(?:corrispondenza|partita) (?:del|di) deposit/i],
  ['wrong masculine article before strumenti', /\b(?:i|dei|nei|ai|sui) strumenti\b/gi],
  ['wrong masculine article before condizioni', /\b(?:i|gli|dei|nei|ai|sui) condizioni\b/gi],
  ['repeated editorial assessment', /La valutazione è una valutazione/gi],
  ['literal deposit bonus phrasing', /\bbonus di deposito abbinati\b/gi],
  ['duplicated sportsbook phrase', /\bscommesse gratuite sulle scommesse sportive\b/gi],
  ['literal completed-wagering phrase', /\bscommessa del bonus (?:è completa|è completata)\b/gi],
  ['withdrawal mistranslation', /\britiro\b/gi],
  ['English cash-out term', /\bcash out\b/gi],
  ['literal risk-view heading', /SpinCresta Visualizzazione/gi],
  ['literal promotion snapshot heading', /Bonus e istantanea della promozione/gi],
  ['awkward brand review heading', /<h1>[^<]+ (?:Casino )?Recensione<\/h1>/gi],
  ['bad home translation', />Casa</g],
  ['bad about translation', />Di</g],
  ['translated game-title marker', /FRESCO DA LOBBY RIVEDUTE|Realtà in più/g],
  ['source-document disclosure', /\b(?:foglio di calcolo|documento sorgente|briefing|file sorgente)\b/gi],
  ['untranslated UI phrase', /\b(?:play now|claim bonus|learn more|payment methods|why players choose)\b/gi],
  ['untranslated First marker', /\bFirst\b/g],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(IT_ROOT, file).split(path.sep).join('/');
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

console.log(`Italian copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
