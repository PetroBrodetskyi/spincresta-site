#!/usr/bin/env node

import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const EXCLUDED_DIRS = new Set(['.git', '.vercel', 'node_modules', 'tmp']);

const decodeEntities = value =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const plainText = value =>
  decodeEntities(
    value
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<(script|style|svg|nav|footer)\b[^>]*>[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  )
    .replace(/\s+/g, ' ')
    .trim();

const firstMatch = (html, pattern) => decodeEntities(html.match(pattern)?.[1]?.trim() || '');
const allMatches = (html, pattern) => [...html.matchAll(pattern)].map(match => plainText(match[1]));

const collectHtml = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue;
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) continue;

    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(absolute)));
    if (entry.isFile() && entry.name === 'index.html') files.push(absolute);
  }

  return files;
};

const duplicateGroups = (pages, key) => {
  const groups = new Map();
  for (const page of pages) {
    const value = page[key];
    if (!value) continue;
    groups.set(value, [...(groups.get(value) || []), page.file]);
  }
  return [...groups.entries()]
    .filter(([, files]) => files.length > 1)
    .map(([value, files]) => ({ value, files }));
};

const files = await collectHtml(ROOT);
const pages = [];

for (const absolute of files) {
  const html = await readFile(absolute, 'utf8');
  const file = path.relative(ROOT, absolute);
  const lang = firstMatch(html, /<html\b[^>]*\blang=["']([^"']+)["']/i);
  const title = firstMatch(html, /<title>([\s\S]*?)<\/title>/i);
  const descriptionMatch = html.match(
    /<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*>/i
  );
  const description = decodeEntities(descriptionMatch?.[2]?.trim() || '');
  const canonical = firstMatch(
    html,
    /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)["'][^>]*>/i
  );
  const robots = firstMatch(
    html,
    /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["']([^"']*)["'][^>]*>/i
  );
  const h1 = allMatches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
  const h2 = allMatches(html, /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi).filter(Boolean);
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body>/i)?.[1] || '';
  const words = plainText(body).split(/\s+/).filter(Boolean).length;
  const internalLinks = [...html.matchAll(/<a\b[^>]*\bhref=["'](\/[^"'#?]*)/gi)].map(match => match[1]);
  const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(match => match[0]);
  const missingAlt = images.filter(image => !/\balt=["'][^"']*["']/i.test(image)).length;
  const jsonLd = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let invalidJsonLd = 0;
  for (const block of jsonLd) {
    try {
      JSON.parse(block[1]);
    } catch {
      invalidJsonLd += 1;
    }
  }

  pages.push({
    file,
    lang,
    title,
    description,
    canonical,
    robots,
    h1,
    h2,
    words,
    internalLinks: new Set(internalLinks).size,
    missingAlt,
    jsonLd: jsonLd.length,
    invalidJsonLd,
  });
}

const indexable = pages.filter(page => !/noindex/i.test(page.robots));
const issues = {
  missingTitle: indexable.filter(page => !page.title),
  shortTitle: indexable.filter(page => page.title && page.title.length < 30),
  longTitle: indexable.filter(page => page.title.length > 65),
  missingDescription: indexable.filter(page => !page.description),
  shortDescription: indexable.filter(page => page.description && page.description.length < 105),
  longDescription: indexable.filter(page => page.description.length > 170),
  invalidH1: indexable.filter(page => page.h1.length !== 1),
  thinContent: indexable.filter(page => page.words < 300),
  lowInternalLinks: indexable.filter(page => page.internalLinks < 5),
  missingImageAlt: indexable.filter(page => page.missingAlt > 0),
  invalidJsonLd: indexable.filter(page => page.invalidJsonLd > 0),
};

const summary = Object.fromEntries(
  Object.entries(issues).map(([name, values]) => [name, values.length])
);

const report = {
  generatedAt: new Date().toISOString(),
  pages: pages.length,
  indexable: indexable.length,
  languages: Object.groupBy(pages, page => page.lang),
  summary,
  duplicateTitles: duplicateGroups(indexable, 'title'),
  duplicateDescriptions: duplicateGroups(indexable, 'description'),
  issueFiles: Object.fromEntries(
    Object.entries(issues).map(([name, values]) => [
      name,
      values.map(page => ({
        file: page.file,
        title: page.title,
        descriptionLength: page.description.length,
        h1: page.h1,
        words: page.words,
        internalLinks: page.internalLinks,
        missingAlt: page.missingAlt,
      })),
    ])
  ),
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(report, null, 2));
} else {
  console.log(`Pages: ${report.pages} (${report.indexable} indexable)`);
  for (const [name, count] of Object.entries(summary)) console.log(`${name}: ${count}`);
  console.log(`duplicateTitles: ${report.duplicateTitles.length}`);
  console.log(`duplicateDescriptions: ${report.duplicateDescriptions.length}`);
}
