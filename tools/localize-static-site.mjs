#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const args = new Map(process.argv.slice(2).map((value, index, all) => value.startsWith('--') ? [value, all[index + 1]?.startsWith('--') ? true : all[index + 1]] : null).filter(Boolean));
const locale = String(args.get('--locale') || '').toLowerCase();
const language = String(args.get('--language') || '');
const mode = args.has('--translate') ? 'translate' : args.has('--apply') ? 'apply' : 'plan';
const force = args.has('--force');

if (!/^[a-z]{2}(?:-[a-z]{2})?$/.test(locale) || !language) {
  console.error('Usage: node tools/localize-static-site.mjs --locale es --language Spanish [--translate|--apply] [--force]');
  process.exit(1);
}

const cachePath = String(args.get('--cache') || `/private/tmp/spincresta-localize-${locale}.json`);
const sourceFiles = [];
const walk = dir => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['.git', 'node_modules', 'tools'].includes(entry.name) || (/^[a-z]{2}(?:-[a-z]{2})?$/.test(entry.name) && dir === root)) continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file);
    else if (entry.name === 'index.html') sourceFiles.push(file);
  }
};
walk(root);

const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'").replaceAll('&apos;', "'").replaceAll('&nbsp;', ' ');
const keyFor = value => decode(value).replace(/\s+/g, ' ').trim();
const shouldTranslate = value => /[A-Za-z]/.test(value) && !/^(?:https?:|mailto:|tel:)/i.test(value) && !/^[A-Z0-9_+&€$£¥₴%.,:;!?()\-/\s]{1,10}$/.test(value);
const jsonPattern = /<script\b[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi;
const strings = new Set();

const visitHtml = (html, callback) => {
  const parts = html.split(/(<[^>]+>)/g);
  let skip = 0;
  for (let index = 0; index < parts.length; index += 1) {
    const part = parts[index];
    if (part.startsWith('<')) {
      if (/^<\/(script|style|noscript)/i.test(part)) skip = Math.max(0, skip - 1);
      if (!skip) {
        let updated = part.replace(/\b(aria-label|alt|title)=(['"])(.*?)\2/gi, (full, name, quote, value) => {
          const key = keyFor(value);
          return key && shouldTranslate(key) ? `${name}=${quote}${callback(key).replaceAll('&', '&amp;').replaceAll(quote, quote === '"' ? '&quot;' : '&#39;')}${quote}` : full;
        });
        if (/^<meta\b/i.test(updated) && /(?:name|property)=['"](?:description|og:title|og:description|og:image:alt|twitter:title|twitter:description|twitter:image:alt)['"]/i.test(updated)) {
          updated = updated.replace(/\bcontent=(['"])(.*?)\1/i, (full, quote, value) => {
            const key = keyFor(value);
            return key && shouldTranslate(key) ? `content=${quote}${callback(key).replaceAll('&', '&amp;').replaceAll(quote, quote === '"' ? '&quot;' : '&#39;')}${quote}` : full;
          });
        }
        parts[index] = updated;
      }
      if (/^<(script|style|noscript)\b/i.test(part) && !/\/>$/.test(part)) skip += 1;
      continue;
    }
    if (skip) continue;
    const key = keyFor(part);
    if (!key || !shouldTranslate(key)) continue;
    const leading = part.match(/^\s*/)?.[0] || '';
    const trailing = part.match(/\s*$/)?.[0] || '';
    parts[index] = `${leading}${callback(key)}${trailing}`;
  }
  return parts.join('');
};

const collectJson = value => {
  if (Array.isArray(value)) return value.forEach(collectJson);
  if (value && typeof value === 'object') return Object.values(value).forEach(collectJson);
  if (typeof value === 'string') {
    const key = keyFor(value);
    if (key && shouldTranslate(key)) strings.add(key);
  }
};

for (const file of sourceFiles) {
  const html = fs.readFileSync(file, 'utf8');
  visitHtml(html, value => { strings.add(value); return value; });
  for (const match of html.matchAll(jsonPattern)) { try { collectJson(JSON.parse(match[1])); } catch {} }
}

if (mode === 'plan') {
  const missing = sourceFiles.filter(file => !fs.existsSync(path.join(root, locale, path.relative(root, file))));
  console.log(JSON.stringify({ locale, language, sourcePages: sourceFiles.length, missingPages: missing.length, uniqueStrings: strings.size, cachePath }, null, 2));
  process.exit(0);
}

const brandNames = fs.existsSync(path.join(root, 'scripts/brands.js'))
  ? [...new Set([...fs.readFileSync(path.join(root, 'scripts/brands.js'), 'utf8').matchAll(/\bname:\s*'([^']+)'/g)].map(match => match[1]).concat('SpinCresta'))].sort((a, b) => b.length - a.length)
  : ['SpinCresta'];
const protect = value => {
  const terms = [];
  let masked = value;
  for (const term of brandNames) {
    if (!masked.toLowerCase().includes(term.toLowerCase())) continue;
    const marker = `ZXQTERM${terms.length}QXZ`;
    masked = masked.replace(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), marker);
    terms.push(term);
  }
  return { masked, terms };
};
const restore = (value, terms) => {
  let restored = value;
  terms.forEach((term, index) => { restored = restored.replace(new RegExp(`ZXQ\\s*TERM\\s*${index}\\s*QXZ`, 'gi'), term); });
  return restored;
};

if (mode === 'translate') {
  const translated = fs.existsSync(cachePath) ? JSON.parse(fs.readFileSync(cachePath, 'utf8')) : {};
  const pending = [...strings].filter(text => !(text in translated));
  for (let offset = 0; offset < pending.length; offset += 25) {
    await Promise.all(pending.slice(offset, offset + 25).map(async text => {
      const { masked, terms } = protect(text);
      const url = new URL('https://translate.googleapis.com/translate_a/single');
      url.searchParams.set('client', 'gtx'); url.searchParams.set('sl', 'en'); url.searchParams.set('tl', locale); url.searchParams.set('dt', 't'); url.searchParams.set('q', masked);
      const response = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (!response.ok) throw new Error(`Google Translate ${response.status}`);
      const data = await response.json();
      translated[text] = restore((data[0] || []).map(row => row[0]).join(''), terms);
    }));
    fs.writeFileSync(cachePath, JSON.stringify(translated, null, 2));
    console.log(`Translated ${Math.min(offset + 25, pending.length)}/${pending.length}`);
  }
  console.log(`Translation cache: ${cachePath}`);
  process.exit(0);
}

if (!fs.existsSync(cachePath)) throw new Error(`Missing translation cache: ${cachePath}. Run --translate first.`);
const translated = new Map(Object.entries(JSON.parse(fs.readFileSync(cachePath, 'utf8'))));
const translate = value => translated.get(value) || value;
const preserveJsonKeys = new Set(['@context', '@type', 'url', 'item', 'image', 'logo', 'sameAs', 'datePublished', 'dateModified', 'priceCurrency', 'currenciesAccepted', 'paymentAccepted']);
const translateJson = (value, key = '') => {
  if (Array.isArray(value)) return value.map(item => translateJson(item, key));
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([childKey, child]) => [childKey, translateJson(child, childKey)]));
  if (key === 'inLanguage' && typeof value === 'string') return locale;
  if (typeof value !== 'string' || preserveJsonKeys.has(key) || /^https?:\/\//i.test(value)) return value;
  return translate(keyFor(value));
};
const routePath = file => `/${path.relative(root, file).replace(/index\.html$/, '').split(path.sep).join('/')}`;

for (const sourceFile of sourceFiles) {
  const targetFile = path.join(root, locale, path.relative(root, sourceFile));
  if (fs.existsSync(targetFile) && !force) continue;
  const source = fs.readFileSync(sourceFile, 'utf8');
  let html = visitHtml(source, translate);
  const blocks = [...source.matchAll(jsonPattern)].map(match => {
    try { return `<script type="application/ld+json">\n${JSON.stringify(translateJson(JSON.parse(match[1])), null, 2)}\n</script>`; }
    catch { return match[0]; }
  }).join('\n');
  html = html.replace(/\s*<script\b[^>]*type=['"]application\/ld\+json['"][^>]*>[\s\S]*?<\/script>/gi, '');
  html = html.replace(/\s*<\/head>/i, `\n${blocks}\n</head>`);
  html = html.replace(/<html\b([^>]*)lang=['"][^'"]+['"]([^>]*)>/i, `<html$1lang="${locale}"$2>`);
  html = html.replace(/<body\b([^>]*)>/i, (full, attrs) => `<body${attrs.replace(/\sdata-language=['"][^'"]+['"]/i, '')} data-language="${locale}">`);
  const route = routePath(sourceFile);
  html = html.replaceAll(`https://spincresta.com${route}`, `https://spincresta.com/${locale}${route}`);
  for (const file of sourceFiles) {
    const internal = routePath(file);
    html = html.replace(new RegExp(`href=(['"])${internal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), `href=$1/${locale}${internal}`);
  }
  html = html.replace(/<a href="\/" class="logo"/g, `<a href="/${locale}/" class="logo"`);
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  fs.writeFileSync(targetFile, html);
}

console.log(`Created locale ${locale}. Next: add ${language} UI_COPY and locale detection in scripts/main.js, then run browser QA and update hreflang/sitemap.`);
