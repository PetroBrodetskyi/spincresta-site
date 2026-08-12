#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const origin = 'https://spincresta.com';
const locales = ['en', 'de', 'es', 'it', 'pl'];

const sourceFiles = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'tools', 'de', 'es', 'it', 'pl'].includes(entry.name) && directory === root) continue;
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name === 'index.html') sourceFiles.push(target);
  }
};
walk(root);

const routeFor = file => {
  const relative = path.relative(root, file).split(path.sep).join('/');
  return relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
};
const localizedRoute = (route, locale) => {
  if (locale === 'en') return route;
  return route === '/' ? `/${locale}/` : `/${locale}${route}`;
};

let updated = 0;
let skipped = 0;

for (const sourceFile of sourceFiles) {
  const route = routeFor(sourceFile);
  const source = fs.readFileSync(sourceFile, 'utf8');
  const sourceLanguageTag = source.match(/<html\b[^>]*\blang=['"]([^'"]+)['"]/i)?.[1] || 'en';
  const region = sourceLanguageTag.split('-')[1]?.toUpperCase();
  const suffix = region ? `-${region}` : '';
  const alternates = [
    ...locales.map(locale =>
      `<link rel="alternate" hreflang="${locale}${suffix}" href="${origin}${localizedRoute(route, locale)}" />`
    ),
    `<link rel="alternate" hreflang="x-default" href="${origin}${route}" />`,
  ].join('\n    ');

  for (const locale of locales) {
    const file = locale === 'en' ? sourceFile : path.join(root, locale, path.relative(root, sourceFile));
    if (!fs.existsSync(file)) {
      skipped += 1;
      continue;
    }

    let html = fs.readFileSync(file, 'utf8');
    const canonicalPattern = /<link\b(?=[^>]*\brel=['"]canonical['"])[^>]*>/i;
    if (!canonicalPattern.test(html)) {
      skipped += 1;
      continue;
    }

    html = html.replace(/\s*<link\b(?=[^>]*\brel=['"]alternate['"])(?=[^>]*\bhreflang=['"])[^>]*>/gi, '');
    html = html.replace(canonicalPattern, match => `${match}\n    ${alternates}`);
    fs.writeFileSync(file, html);
    updated += 1;
  }
}

console.log(`Synced hreflang on ${updated} pages; skipped ${skipped}.`);
