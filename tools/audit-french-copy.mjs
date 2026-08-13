#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FR_ROOT = path.join(ROOT, 'fr');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(FR_ROOT);

const forbidden = [
  ['translation placeholder', /ZXQ|QXZ/g],
  ['source-material disclosure', /\b(?:brief|briefing|brefs? documents?|documents? brefs?|feuille de calcul|document source|document d'origine)\b/gi],
  ['wrong breadcrumb label', /(?:"name": ">?Maison"|>Maison<)/g],
  ['wrong reviewer role', /Expert en jeux vidéo/gi],
  ['literal safer-play wording', /jeu plus sûr|contrôles? de jeu plus sûr|outils? de jeu plus sûr/gi],
  ['literal cashier wording', /\b(?:caissiers?|limites des caissiers)\b/gi],
  ['literal payment route wording', /itinéraires? (?:de paiement|de dépôt|de retrait|cryptographiques?)|rails cryptographiques/gi],
  ['unlocalized CTA', /\b(?:play now|claim bonus|visit casino)\b/gi],
  ['overlong French CTA', /\b(?:Jouez maintenant|Visitez le casino)\b/g],
  ['awkward fit heading', /\bBon ajustement\b/gi],
  ['awkward caution heading', /\bRéfléchissez à deux fois si\b/gi],
  ['translated complaints email', /plaintes@spinboss\.com/gi],
  ['outdated review wording', /Revue en préparation|La révision complète|"name": "(?:Examen|[^"\n]+ Examen|Revue du casino)/gi],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(FR_ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8').replace(/<!--([\s\S]*?)-->/g, '');
  if (!/<html\b[^>]*\blang=["']fr(?:-[a-z]{2})?["']/i.test(html)) errors.push(`${relative}: wrong or missing html lang`);
  if (!/<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/spincresta\.com\/fr\//i.test(html)) errors.push(`${relative}: wrong or missing canonical`);
  for (const [label, pattern] of forbidden) {
    const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
    const matches = [...html.matchAll(new RegExp(pattern.source, flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }
}

console.log(`French copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 400).join('\n'));
  process.exitCode = 1;
}
