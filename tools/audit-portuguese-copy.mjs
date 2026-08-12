#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PT_ROOT = path.join(ROOT, 'pt');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(PT_ROOT);

const forbidden = [
  ['machine placeholder', /ZXQ|QXZ/g],
  ['Brazilian casino spelling', /\bcassinos?\b/gi],
  ['Brazilian bonus spelling', /\bbônus\b/gi],
  ['Brazilian withdrawal wording', /\b(?:saques?|retiradas?)\b/gi],
  ['Brazilian free-spins wording', /\brodadas (?:grátis|gratuitas|livres)\b/gi],
  ['Brazilian slot wording', /\bcaça-níqueis\b/gi],
  ['Brazilian user wording', /\busuários?\b/gi],
  ['Brazilian team wording', /\bequipe\b/gi],
  ['Brazilian contact wording', /\bcontatos?\b/gi],
  ['Brazilian file wording', /\barquivos?\b/gi],
  ['Brazilian screen wording', /\btelas?\b/gi],
  ['Brazilian mobile wording', /\bcelulares?\b/gi],
  ['Brazilian app wording', /\baplicativos?\b/gi],
  ['Brazilian provider wording', /\bprovedores?\b/gi],
  ['Brazilian trust wording', /\bconfiáve(?:l|is)\b/gi],
  ['Brazilian poker spelling', /\bpôquer\b/gi],
  ['Brazilian registration wording', /\b(?:registro|registrar(?:-se)?)\b/gi],
  ['Brazilian access wording', /\bacessar\b/gi],
  ['Brazilian electronic spelling', /\beletrônic(?:a|as|o|os)\b/gi],
  ['awkward route wording', /\brotas? (?:de|para)\b/gi],
  ['awkward fit heading', /\b(?:bom|melhor) ajuste\b/gi],
  ['awkward caution heading', /\bpense duas vezes se\b/gi],
  ['awkward route wording', /\brotas?\b/gi],
  ['Brazilian prize spelling', /\bprêmios?\b/gi],
  ['Brazilian percentage wording', /\bporcentagens?\b/gi],
  ['awkward crypto wording', /\bcriptografad(?:a|as|o|os)\b/gi],
  ['unlocalized free-spins abbreviation', /\bFS\b/g],
  ['Brazilian second-person wording', /\bantes de você\b/gi],
  ['awkward review heading', /<h1>Revisão\b/gi],
  ['repetitive analysis wording', /\banálise analisa\b/gi],
  ['mistranslated checks wording', /\bcheques? (?:práticos|bancários|de (?:países|levantamento|identidade|apostas|bónus|propriedade)|KYC|administrativo|de pagamento)\b/gi],
  ['withdrawal gender agreement', /\b(?:primeira|uma|da) levantamento\b/gi],
  ['awkward safer-play wording', /\bjogo mais seguro\b/gi],
  ['untranslated UI phrase', /\b(?:play now|claim bonus|learn more|payment methods|why players choose)\b/gi],
  ['translated OnLuck brand', /\bNa sorte\b/g],
  ['source-document disclosure', /\b(?:folha de cálculo|documento de origem|ficheiro de origem|briefing)\b/gi],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(PT_ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<meta\b[^>]*name=["']keywords["'][^>]*>/gi, '');

  if (!/<html\b[^>]*\blang=["']pt(?:-[a-z]{2})?["']/i.test(html)) errors.push(`${relative}: wrong or missing html lang`);
  if (!/<link\b[^>]*rel=["']canonical["'][^>]*href=["']https:\/\/spincresta\.com\/pt\//i.test(html)) errors.push(`${relative}: wrong or missing canonical`);

  for (const [label, pattern] of forbidden) {
    const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
    const matches = [...html.matchAll(new RegExp(pattern.source, flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }
}

console.log(`Portuguese copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 400).join('\n'));
  process.exitCode = 1;
}
