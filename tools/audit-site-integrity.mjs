#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED_ROOTS = new Set(['.git', '.vercel', 'node_modules', 'tmp', 'keyboard-diagnostics', 'tools']);
const htmlFiles = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (directory === ROOT && entry.isDirectory() && EXCLUDED_ROOTS.has(entry.name)) continue;

    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') htmlFiles.push(absolute);
  }
};

const resolveLocalReference = (sourceFile, reference) => {
  const clean = reference.split(/[?#]/)[0];
  if (!clean) return null;

  let target = clean.startsWith('/')
    ? path.join(ROOT, clean.slice(1))
    : path.resolve(path.dirname(sourceFile), clean);

  if (clean.endsWith('/')) target = path.join(target, 'index.html');
  else if (fs.existsSync(target) && fs.statSync(target).isDirectory()) target = path.join(target, 'index.html');
  return target;
};

walk(ROOT);

const errors = [];
for (const file of htmlFiles.sort()) {
  const html = fs.readFileSync(file, 'utf8');
  const relative = path.relative(ROOT, file);
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map(match => match[1]);
  const idSet = new Set();
  const generatedIds = new Set();

  if (/data-page=["']top-casinos["']/i.test(html)) {
    generatedIds.add('top-casino-markets');
    for (const match of html.matchAll(/<section\b[^>]*\bdata-country=["']([^"']+)["']/gi)) {
      const code = match[1].toUpperCase();
      const slug = ({ US: 'united-states', UK: 'united-kingdom', AU: 'australia', CA: 'canada', BR: 'brazil' })[code];
      if (slug) generatedIds.add(`top-${slug}`);
    }
  }

  for (const id of ids) {
    if (idSet.has(id)) errors.push(`${relative}: duplicate id #${id}`);
    idSet.add(id);
  }

  for (const match of html.matchAll(/\b(?:href|src)=["']([^"']+)["']/gi)) {
    const reference = match[1].trim();
    if (!reference || /^(?:https?:|mailto:|tel:|data:|javascript:)/i.test(reference)) continue;

    if (reference.startsWith('#')) {
      let id = reference.slice(1);
      try { id = decodeURIComponent(id); } catch { /* Invalid fragments are reported as missing. */ }
      if (id && !idSet.has(id) && !generatedIds.has(id)) errors.push(`${relative}: missing local anchor ${reference}`);
      continue;
    }

    const target = resolveLocalReference(file, reference);
    if (target && !fs.existsSync(target)) {
      errors.push(`${relative}: missing local resource ${reference} -> ${path.relative(ROOT, target)}`);
    }
  }
}

console.log(`Site integrity audit: ${htmlFiles.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 500).join('\n'));
  process.exitCode = 1;
}
