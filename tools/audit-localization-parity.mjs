#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = process.cwd();
const LOCALE = String(process.argv[2] || 'es').toLowerCase();
const SKIP_ROOTS = new Set(['.git', '.vercel', 'node_modules', 'tools', 'de', 'es', 'it', 'pl', 'uk']);
const TAGS = ['h1', 'h2', 'h3', 'p', 'section', 'article', 'table', 'thead', 'tbody', 'tr', 'li', 'img', 'details', 'summary'];

const sourceFiles = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory() && directory === ROOT && SKIP_ROOTS.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') sourceFiles.push(absolute);
  }
};
walk(ROOT);

const count = (html, pattern) => [...html.matchAll(pattern)].length;
const multiset = values => {
  const result = new Map();
  values.forEach(value => result.set(value, (result.get(value) || 0) + 1));
  return result;
};
const sameMultiset = (left, right) =>
  left.size === right.size && [...left].every(([key, value]) => right.get(key) === value);
const attributes = (html, name) =>
  [...html.matchAll(new RegExp(`\\b${name}=["']([^"']+)["']`, 'gi'))].map(match => match[1]);
const classTokens = html =>
  attributes(html, 'class').flatMap(value => value.split(/\s+/).filter(Boolean));
const stripData = html => html
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const validateInlineScripts = (html, label) => {
  for (const [index, match] of [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].entries()) {
    const attributes = match[1];
    const code = match[2].trim();
    if (!code || /\bsrc\s*=/i.test(attributes) || /application\/ld\+json/i.test(attributes)) continue;
    try { new vm.Script(code); }
    catch (error) { errors.push(`${label}: inline script ${index + 1} is invalid (${error.message})`); }
  }
};

const errors = [];
for (const sourceFile of sourceFiles.sort()) {
  const relative = path.relative(ROOT, sourceFile);
  const localizedFile = path.join(ROOT, LOCALE, relative);
  if (!fs.existsSync(localizedFile)) {
    errors.push(`${relative}: missing ${LOCALE.toUpperCase()} page`);
    continue;
  }

  const sourceHtml = fs.readFileSync(sourceFile, 'utf8');
  const localizedHtml = fs.readFileSync(localizedFile, 'utf8');
  validateInlineScripts(sourceHtml, relative);
  validateInlineScripts(localizedHtml, `${LOCALE}/${relative}`);
  const source = stripData(sourceHtml);
  const localized = stripData(localizedHtml);

  for (const tag of TAGS) {
    const pattern = new RegExp(`<${tag}\\b`, 'gi');
    const sourceCount = count(source, pattern);
    const localizedCount = count(localized, pattern);
    if (sourceCount !== localizedCount) {
      errors.push(`${relative}: <${tag}> ${sourceCount} EN / ${localizedCount} ${LOCALE.toUpperCase()}`);
    }
  }

  const sourceClasses = multiset(classTokens(source));
  const localizedClasses = multiset(classTokens(localized));
  if (!sameMultiset(sourceClasses, localizedClasses)) errors.push(`${relative}: class structure differs`);

  const sourceIds = multiset(attributes(source, 'id'));
  const localizedIds = multiset(attributes(localized, 'id'));
  if (!sameMultiset(sourceIds, localizedIds)) errors.push(`${relative}: id structure differs`);

  const sourceImages = multiset([...source.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)/gi)].map(match => match[1]));
  const localizedImages = multiset([...localized.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)/gi)].map(match => match[1]));
  if (!sameMultiset(sourceImages, localizedImages)) errors.push(`${relative}: image sources differ`);

  const sourceFaqQuestions = count(source, /<h3\b[^>]*>[\s\S]*?<\/h3>\s*<p\b/gi);
  const localizedFaqQuestions = count(localized, /<h3\b[^>]*>[\s\S]*?<\/h3>\s*<p\b/gi);
  if (sourceFaqQuestions !== localizedFaqQuestions) {
    errors.push(`${relative}: question/answer pairs ${sourceFaqQuestions} EN / ${localizedFaqQuestions} ${LOCALE.toUpperCase()}`);
  }
}

console.log(`Localization parity: ${sourceFiles.length} EN/${LOCALE.toUpperCase()} page pairs, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
