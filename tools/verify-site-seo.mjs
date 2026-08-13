#!/usr/bin/env node

import { access, readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const ORIGIN = 'https://spincresta.com';
const EXCLUDED = new Set(['.git', '.vercel', 'node_modules', 'tmp']);

const collect = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.') || (entry.isDirectory() && EXCLUDED.has(entry.name))) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collect(absolute)));
    if (entry.isFile() && entry.name === 'index.html') files.push(absolute);
  }
  return files;
};

const pagePath = absolute => {
  const relative = path.relative(ROOT, absolute).split(path.sep).join('/');
  return relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;
};

const attr = (html, pattern) => html.match(pattern)?.[1]?.trim() || '';
const exists = async absolute => access(absolute).then(() => true).catch(() => false);
const errors = [];
const warnings = [];
const files = await collect(ROOT);
const pages = new Map();

for (const absolute of files) {
  const html = await readFile(absolute, 'utf8');
  const urlPath = pagePath(absolute);
  const lang = attr(html, /<html\b[^>]*\blang=["']([^"']+)/i);
  const canonical = attr(html, /<link\b(?=[^>]*\brel=["']canonical["'])[^>]*\bhref=["']([^"']+)/i);
  const robots = attr(html, /<meta\b(?=[^>]*\bname=["']robots["'])[^>]*\bcontent=["']([^"']+)/i);
  const title = attr(html, /<title>([\s\S]*?)<\/title>/i).replace(/&amp;/g, '&');
  const descriptionMatch = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*>/i);
  const description = (descriptionMatch?.[2] || '').replace(/&amp;/g, '&').replace(/&#39;/g, "'");
  const alternates = [...html.matchAll(/<link\b(?=[^>]*\brel=["']alternate["'])[^>]*\bhreflang=["']([^"']+)["'][^>]*\bhref=["']([^"']+)/gi)]
    .map(([, code, href]) => ({ code: code.toLowerCase(), href }));
  pages.set(urlPath, { absolute, html, lang, canonical, robots, title, description, alternates });

  const expectedLang = urlPath.startsWith('/de/') ? 'de' : urlPath.startsWith('/es/') ? 'es' : urlPath.startsWith('/it/') ? 'it' : urlPath.startsWith('/pl/') ? 'pl' : urlPath.startsWith('/uk/') ? 'uk' : urlPath.startsWith('/pt/') ? 'pt' : urlPath.startsWith('/fr/') ? 'fr' : urlPath.startsWith('/hi/') ? 'hi' : 'en';
  if (!lang.toLowerCase().startsWith(expectedLang)) errors.push(`${urlPath}: lang=${lang || 'missing'}, expected ${expectedLang}`);
  if (canonical !== `${ORIGIN}${urlPath}`) errors.push(`${urlPath}: canonical does not match its URL`);

  for (const block of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const data = JSON.parse(block[1]);
      const nodes = data['@graph'] || [data];
      const webPage = nodes.find(node => node['@type'] === 'WebPage');
      if (webPage?.name && webPage.name !== title) errors.push(`${urlPath}: JSON-LD WebPage name differs from title`);
      if (webPage?.description && webPage.description !== description) errors.push(`${urlPath}: JSON-LD WebPage description differs from meta description`);
    } catch {
      errors.push(`${urlPath}: invalid JSON-LD`);
    }
  }
}

// Validate language variants and reciprocal alternate links after every page is known.
for (const [urlPath, page] of pages) {
  const basePath = urlPath.replace(/^\/(?:de|es|it|pl|uk|pt|fr|hi)(?=\/)/, '');
  const localePaths = {
    en: basePath,
    de: basePath === '/' ? '/de/' : `/de${basePath}`,
    es: basePath === '/' ? '/es/' : `/es${basePath}`,
    it: basePath === '/' ? '/it/' : `/it${basePath}`,
    pl: basePath === '/' ? '/pl/' : `/pl${basePath}`,
    uk: basePath === '/' ? '/uk/' : `/uk${basePath}`,
    pt: basePath === '/' ? '/pt/' : `/pt${basePath}`,
    fr: basePath === '/' ? '/fr/' : `/fr${basePath}`,
    hi: basePath === '/' ? '/hi/' : `/hi${basePath}`,
  };

  for (const [locale, variantPath] of Object.entries(localePaths)) {
    const variant = pages.get(variantPath);
    if (!variant) {
      if (!/noindex/i.test(page.robots)) errors.push(`${urlPath}: missing ${locale.toUpperCase()} page`);
      continue;
    }

    const hasVariantAlternate = page.alternates.some(link =>
      link.code.startsWith(locale) && new URL(link.href).pathname === variantPath
    );
    if (!hasVariantAlternate) errors.push(`${urlPath}: missing alternate link to ${variantPath}`);

    const pageLocale = urlPath.startsWith('/de/') ? 'de' : urlPath.startsWith('/es/') ? 'es' : urlPath.startsWith('/it/') ? 'it' : urlPath.startsWith('/pl/') ? 'pl' : urlPath.startsWith('/uk/') ? 'uk' : urlPath.startsWith('/pt/') ? 'pt' : urlPath.startsWith('/fr/') ? 'fr' : urlPath.startsWith('/hi/') ? 'hi' : 'en';
    const hasReturnAlternate = variant.alternates.some(link =>
      link.code.startsWith(pageLocale) && new URL(link.href).pathname === urlPath
    );
    if (!hasReturnAlternate) errors.push(`${urlPath}: alternate link is not reciprocal with ${variantPath}`);
  }
}

// Validate local navigation targets.
for (const [urlPath, page] of pages) {
  const hrefs = new Set([...page.html.matchAll(/<a\b[^>]*\bhref=["'](\/[^"'#?]*)/gi)].map(match => match[1]));
  for (const href of hrefs) {
    if (/\.(?:avif|css|gif|ico|jpe?g|js|json|pdf|png|svg|webp|xml)$/i.test(href)) continue;
    const target = href.endsWith('/') ? path.join(ROOT, href, 'index.html') : path.join(ROOT, href);
    if (!(await exists(target))) errors.push(`${urlPath}: broken internal link ${href}`);
  }
}

const sitemap = await readFile(path.join(ROOT, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
const sitemapPaths = new Set(sitemapUrls.map(url => new URL(url).pathname));
if (sitemapPaths.size !== sitemapUrls.length) errors.push('sitemap.xml: duplicate URLs');
for (const [urlPath, page] of pages) {
  const indexable = !/noindex/i.test(page.robots);
  if (indexable && !sitemapPaths.has(urlPath)) errors.push(`${urlPath}: indexable page missing from sitemap`);
  if (!indexable && sitemapPaths.has(urlPath)) errors.push(`${urlPath}: noindex page present in sitemap`);
}
for (const sitemapPath of sitemapPaths) {
  if (!pages.has(sitemapPath)) errors.push(`${sitemapPath}: sitemap URL has no deployable page`);
}

console.log(`SEO verification: ${pages.size} pages, ${sitemapPaths.size} sitemap URLs, ${errors.length} errors.`);
if (warnings.length) console.log(`Warnings: ${warnings.length}`);
if (errors.length) {
  console.error(errors.slice(0, 200).join('\n'));
  process.exitCode = 1;
}
