#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { CLEAR_COPY, classifyFiller, polishInlineText, trimIntent, productIntro, presentCatalog, offerQuestions, removeImmersive, countryHeader, removeComparisonTail } from './clear-copy-rules.mjs';
import { DIRECTORY_COPY, DIRECTORY_META, directoryKind } from './clear-directory-copy.mjs';
import { BRANDS } from '../scripts/brands.js';

const locales = Object.keys(CLEAR_COPY);
const ignored = new Set(['.git', '.vercel', 'node_modules', 'tools', 'research', 'tmp', ...locales.filter(l => l !== 'en')]);
const decode = text => text.replace(/&#(x[\da-f]+|\d+);/gi, (_, code) => String.fromCodePoint(code[0].toLowerCase() === 'x' ? parseInt(code.slice(1), 16) : Number(code))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&nbsp;|\u00a0/g, ' ').replace(/&(?:ndash|mdash|rsquo|lsquo|ldquo|rdquo|euro|pound);/g, entity => ({'&ndash;':'–','&mdash;':'—','&rsquo;':'’','&lsquo;':'‘','&ldquo;':'“','&rdquo;':'”','&euro;':'€','&pound;':'£'}[entity]));
const encode = text => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
const normalize = text => decode(text.replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

export function fields(html) {
  const masked = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, match => ' '.repeat(match.length));
  const result = [];
  for (const tag of ['p', 'td', 'span', 'li', 'h2', 'h3', 'strong']) {
    let ordinal = 0;
    for (const match of masked.matchAll(new RegExp(`<${tag}\\b([^>]*)>([\\s\\S]*?)<\\/${tag}>`, 'gi'))) {
      result.push({tag, ordinal: ordinal++, start: match.index, end: match.index + match[0].length,
        attributes: match[1], raw: match[2], text: normalize(match[2]), leaf: !/<[^>]*>/.test(match[2])});
    }
  }
  return result.sort((a, b) => a.start - b.start);
}

export function buildPlan(source, page) {
  const list = fields(source);
  const slug = /^brands\/([^/]+)\/index\.html$/.exec(page)?.[1];
  const brand = slug && BRANDS.find(item => item.urlDetail === `brands/${slug}.html`)?.name;
  return list.filter(field => field.leaf).flatMap(field => {
    const copyKey = directoryKind(field.text, page);
    if (copyKey) return [{tag:field.tag, ordinal:field.ordinal, kind:'directory', copyKey, sourceText:field.text}];
    if (brand && field.tag === 'h3' && /^What makes .+ more than (?:a|just) (?:standard|simple|generic)/.test(field.text)) {
      return [{tag:field.tag,ordinal:field.ordinal,kind:'offerQuestion',brand,sourceText:field.text}];
    }
    if (brand && field.tag === 'p' && /hero-subtitle/.test(field.attributes) && !/editorial-meta/.test(field.attributes)) {
      const intro = brand && productIntro(field.text, brand);
      if (intro && intro.text !== field.text) return [{tag:field.tag, ordinal:field.ordinal, kind:'productIntro', sourceText:field.text, brand, selected:intro.selected}];
    }
    const rowStart = source.lastIndexOf('<tr', field.start);
    const row = field.tag === 'td' && rowStart !== -1 ? source.slice(rowStart, field.start) : '';
    const context = normalize(/<td\b[^>]*>([\s\S]*?)<\/td>/i.exec(row)?.[1] || '');
    const kind = classifyFiller(field.text, context, field.attributes, page);
    return kind ? [{tag: field.tag, ordinal: field.ordinal, kind, sourceText: field.text}] : [];
  });
}

export function editPage(html, locale, plan = [], page = '') {
  const replacements = [];
  const edits = [];
  for (const field of fields(html)) {
    if (!field.leaf) continue; // Never flatten links, emphasis or other markup.
    const selected = plan.find(item => item.tag === field.tag && item.ordinal === field.ordinal);
    // A localized field must not lose a number or a qualifier absent in English.
    const protectedValue = /\d|[€$£₴]|@|https?:\/\//.test(field.text);
    let text = field.text;
    if (selected?.kind === 'directory') text = DIRECTORY_COPY[locale][selected.copyKey] ?? CLEAR_COPY[locale][selected.copyKey];
    else if (selected?.kind === 'countryHeader') text = countryHeader(field.text, locale);
    else if (selected?.kind === 'offerQuestion') text = offerQuestions[locale](selected.brand);
    else if (selected?.kind === 'productIntro' && !/\d|[€$£₴]/.test(field.text.replaceAll(selected.brand, ''))) text = productIntro(field.text, selected.brand, locale, selected.selected).text;
    else if (selected?.kind === 'featureList' && !protectedValue) text = trimIntent(field.text, locale);
    else if (selected?.kind === 'catalogPresent' && !protectedValue) text = presentCatalog(field.text, locale);
    else if (selected?.kind === 'comparisonTail' && !protectedValue) text = removeComparisonTail(field.text, locale);
    else if (selected?.kind === 'removeImmersive') text = removeImmersive(field.text, locale);
    else if (selected && !protectedValue) text = CLEAR_COPY[locale][selected.kind];
    text = polishInlineText(text, locale);
    if (text === field.text) continue;
    const leading = field.raw.match(/^\s*/)[0];
    const trailing = field.raw.match(/\s*$/)[0];
    const replacement = `<${field.tag}${field.attributes}>${leading}${encode(text)}${trailing}</${field.tag}>`;
    edits.push({...field, replacement});
    replacements.push({old: field.text, new: text, oldRaw: field.raw.trim(), newRaw: encode(text)});
  }
  let result = html;
  for (const edit of edits.toSorted((a, b) => b.start - a.start)) result = result.slice(0, edit.start) + edit.replacement + result.slice(edit.end);
  // Apply the same reviewed text to duplicate metadata and structured answers.
  const map = new Map(replacements.map(item => [item.old, item.new]));
  const metadata = DIRECTORY_META[page]?.[locale];
  if (metadata) {
    const oldDescription = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent="([^"]*)"/i)?.[1];
    if (oldDescription) map.set(normalize(oldDescription), metadata.description);
    if (metadata.title) {
      const oldTitle = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
      if (oldTitle) map.set(normalize(oldTitle), metadata.title);
      result = result.replace(/(<title>)[\s\S]*?(<\/title>)/i, (_, a, b) => a + encode(metadata.title) + b);
    }
  }
  result = result.replace(/<script\b([^>]*\btype=["']application\/ld\+json["'][^>]*)>([\s\S]*?)<\/script>/gi, (whole, attrs, json) => {
    const graph = JSON.parse(json);
    let changed = false;
    const visit = value => {
      if (typeof value === 'string') {
        if (/^(?:https?:\/\/|\/|mailto:)/i.test(value)) return value;
        const replacement = map.get(normalize(value)) ?? polishInlineText(value, locale);
        if (replacement !== value) changed = true;
        return replacement;
      }
      if (Array.isArray(value)) return value.map(visit);
      if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, visit(v)]));
      return value;
    };
    const updated = visit(graph);
    return changed ? `<script${attrs}>${JSON.stringify(updated)}</script>` : whole;
  });
  result = result.replace(/(<meta\b[^>]*\bcontent=")([^"]*)("[^>]*>)/gi, (whole, a, content, b) => {
    const text = decode(content);
    const replacement = map.get(normalize(text)) ?? polishInlineText(text, locale);
    return replacement === text ? whole : a + encode(replacement).replaceAll('"', '&quot;') + b;
  });
  // Editorial rewrites must not alter URLs, assets, IDs or class structure.
  const attrs = source => [...source.matchAll(/\b(?:href|src|id|class)=["']([^"']*)["']/gi)].map(m => m[0]);
  assert.deepEqual(attrs(result), attrs(html), `Protected markup changed (${locale})`);
  return {html: result, replacements};
}

export function run({root = process.cwd(), apply = false, check = false} = {}) {
  const pages = [];
  const walk = directory => {
    for (const item of fs.readdirSync(directory, {withFileTypes: true})) {
      if (item.name.startsWith('.')) continue;
      const file = path.join(directory, item.name);
      if (item.isDirectory() && !ignored.has(item.name)) walk(file);
      else if (item.name === 'index.html') pages.push(file);
    }
  };
  walk(root);
  const changes = new Map();
  const copyMaps = new Map();
  const counts = Object.fromEntries(locales.map(locale => [locale, 0]));
  let checked = 0, fieldCount = 0;
  const samples = [];
  for (const file of pages.sort()) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const source = fs.readFileSync(file, 'utf8');
    const sourceFields = fields(source);
    const plan = buildPlan(source, relative);
    for (const locale of locales) {
      const target = locale === 'en' ? file : path.join(root, locale, relative);
      if (!fs.existsSync(target)) continue;
      const before = locale === 'en' ? source : fs.readFileSync(target, 'utf8');
      checked++;
      const targetFields = fields(before);
      // Only reuse structural positions if the complete tag counts match. This
      // prevents a missing locale block from shifting the edits to another topic.
      const aligned = ['p', 'td', 'span', 'li', 'h2', 'h3', 'strong'].every(tag => sourceFields.filter(f => f.tag === tag).length === targetFields.filter(f => f.tag === tag).length);
      const edited = editPage(before, locale, aligned ? plan : [], relative);
      if (edited.html === before) continue;
      changes.set(target, edited.html);
      counts[locale]++;
      fieldCount += edited.replacements.length;
      for (const replacement of edited.replacements) {
        copyMaps.set(`${replacement.old}\0${replacement.new}`, replacement);
        if (locale === 'en' && samples.length < 25) samples.push({file: relative, ...replacement});
      }
    }
  }
  // Keep literal text in review generators/copy modules synchronized. Other
  // tools stay untouched; all generators must also run this editorial pass.
  let sourceCount = 0;
  const sources = fs.globSync('tools/{*review-copy.mjs,build-*review*.mjs,redesign-*-pages.mjs}', {cwd: root});
  for (const relative of sources) {
    const file = path.join(root, relative);
    const before = fs.readFileSync(file, 'utf8');
    let after = before;
    for (const {old, new: replacement, oldRaw, newRaw} of copyMaps.values()) {
      for (const [a, b] of [[old, replacement], [oldRaw, newRaw], [JSON.stringify(old).slice(1, -1), JSON.stringify(replacement).slice(1, -1)], [old.replaceAll("'", "\\'"), replacement.replaceAll("'", "\\'")]]) {
        if (a && a !== b) after = after.replaceAll(a, b);
      }
      // Older generators split literal paragraphs over multiple lines.
      if (old.length > 40) {
        const pattern = new RegExp(old.split(/\s+/u).map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+'), 'gu');
        after = after.replace(pattern, () => replacement);
      }
    }
    if (after !== before) { changes.set(file, after); sourceCount++; }
  }
  if (apply) for (const [file, html] of changes) fs.writeFileSync(file, html);
  const report = {checked, pages: Object.values(counts).reduce((a, b) => a + b, 0), fields: fieldCount, sources: sourceCount, locales: counts};
  console.log(`Clear-copy ${apply ? 'polish' : 'audit'}: ${JSON.stringify(report)}`);
  if (!apply && !check) for (const sample of samples) console.log(`${sample.file}\n  OLD: ${sample.old}\n  NEW: ${sample.new}`);
  if (check && changes.size) process.exitCode = 1;
  return report;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) run({apply: process.argv.includes('--apply'), check: process.argv.includes('--check')});
