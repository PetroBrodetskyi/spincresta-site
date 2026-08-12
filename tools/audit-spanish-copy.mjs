#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ES_ROOT = path.join(ROOT, 'es');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(ES_ROOT);

const forbidden = [
  ['machine placeholder', /ZXQ|QXZ/g],
  ['Telegram mistranslation', /\bTelegrama\b/g],
  ['bonus mistranslation', /\bPrima\b/g],
  ['home mistranslation', /\bHogar\b/g],
  ['partners mistranslation', /\bFogonadura\b/g],
  ['untranslated review word', /\bcasino review\b/gi],
  ['untranslated UI phrase', /\b(?:play now|learn more|payment methods|bonus terms|why players choose)\b/gi],
  ['literal crash-games translation', /\bjuegos intensivos\b/gi],
  ['literal lobby translation', /\bvestíbulos?\b/gi],
  ['literal slot translation', /\branuras?\b/gi],
  ['literal sweepstakes translation', /\b(?:reglas|monedas) de barrido\b/gi],
  ['awkward responsible-gambling translation', /\bjuego más seguros?\b/gi],
  ['source-document disclosure', /\b(?:hoja de cálculo|documento fuente|briefing|informe de bonificación|archivo de bonificación)\b/gi],
  ['wrong positive-reviews translation', /\bcríticas positivas\b/gi],
  ['literal reality-check translation', /\bcontroles de la realidad\b/gi],
  ['literal deposit-match translation', /\bcoincidencias de depósitos?\b/gi],
  ['English translation marker', /\bFirst\b/g],
  ['corrupted instant-game wording', /\b(?:ganancia|área|banca|Compra) Resumen\b|Pix \(Resumen\)|una Resumen rápida/gi],
  ['literal caution heading', /\bPiensa dos veces si\b/gi],
  ['literal product-shell wording', /\bcaparazón (?:de bonificación|adicional|plano para todos los juegos)\b/gi],
  ['technical website wording', /\b(?:construcción actual del sitio|configuración actual del sitio carga)\b/gi],
  ['awkward mobile wording', /\bacceso web móvil\b/gi],
];

const allowedFirstFiles = new Set(['brands/first/index.html', 'casinos-and-betting/index.html']);
const errors = [];
for (const file of files) {
  const relative = path.relative(ES_ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<meta\b[^>]*name=["']keywords["'][^>]*>/gi, '');

  for (const [label, pattern] of forbidden) {
    if (label === 'English translation marker' && allowedFirstFiles.has(relative)) continue;
    const matches = [...html.matchAll(new RegExp(pattern.source, pattern.flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }
}

console.log(`Spanish copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
