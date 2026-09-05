import fs from 'node:fs';
import assert from 'node:assert/strict';

const origin = 'https://spincresta.com';
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
const paths = new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => new URL(m[1]).pathname));
const edges = new Map();
for (const pathname of paths) {
  const html = fs.readFileSync(`.${pathname}index.html`, 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '');
  const links = new Set();
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref=["']([^"']+)["']/gi)) {
    const url = new URL(href.replaceAll('&amp;', '&'), origin + pathname);
    if (url.origin === origin && paths.has(url.pathname) && url.pathname !== pathname) links.add(url.pathname);
  }
  edges.set(pathname, links);
}
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
let errors = 0;
for (const lang of locales) {
  const home = lang === 'en' ? '/' : `/${lang}/`;
  const matches = url => lang === 'en' ? !/^\/(de|es|it|pl|uk|pt|fr|hi|fi)\//.test(url) : url.startsWith(home);
  const visited = new Set([home]);
  const queue = [home];
  for (let i = 0; i < queue.length; i++) for (const link of edges.get(queue[i]) || []) {
    if (matches(link) && !visited.has(link)) { visited.add(link); queue.push(link); }
  }
  const unreachable = [...paths].filter(url => matches(url) && !visited.has(url));
  console.log(`${lang}: ${visited.size} reachable; ${unreachable.length} unreachable`, unreachable.length ? unreachable : '');
  errors += unreachable.length;
}
for (const [, value] of sitemap.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  assert.match(value, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(value <= new Date().toISOString().slice(0, 10), `Future lastmod: ${value}`);
}
if (errors) process.exitCode = 1;
