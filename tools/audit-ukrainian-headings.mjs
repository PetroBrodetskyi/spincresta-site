#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.join(process.cwd(), 'uk', 'brands');
const textOnly = value => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const errors = [];
const forbidden = /Спортивні букмекерські контори|Традиційні букмекерські контори|ставки в реальному часі|ставки Live|Бонусні знімки|рекламні шари|постійна вартість|повернення грошей|безкоштовних обертань|видимість правил|юридична видимість|мобільний досвід/i;
let pages = 0;

for (const entry of fs.readdirSync(ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(ROOT, entry.name, 'index.html');
  if (!fs.existsSync(file)) continue;
  pages += 1;
  const html = fs.readFileSync(file, 'utf8');
  const brand = (html.match(/"position"\s*:\s*3\s*,\s*"name"\s*:\s*"([^"]+)"/i)?.[1] || '')
    .replace(/^(?:Огляд|Рецензія)\s+/i, '')
    .replace(/\s+(?:Огляд|огляд)(?:\s+казино)?$/i, '')
    .trim();
  if (!brand) continue;

  for (const match of html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)) {
    const heading = textOnly(match[1]);
    if (forbidden.test(heading)) errors.push(`${entry.name}: awkward section heading: ${heading}`);
    const mentionsBrand = heading.toLocaleLowerCase('uk').includes(brand.toLocaleLowerCase('uk'));
    if (/^Готові спробувати(?:\s|\?)/i.test(heading) && !mentionsBrand) {
      errors.push(`${entry.name}: brand missing from final CTA heading: ${heading}`);
      continue;
    }
    if (!mentionsBrand) continue;
    if (/^Чому гравці обирають(?:\s|$)/i.test(heading) || /^Готові спробувати(?:\s|$)/i.test(heading)) continue;
    errors.push(`${entry.name}: repeated brand in section heading: ${heading}`);
  }
}

console.log(`Ukrainian heading audit: ${pages} brand pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
