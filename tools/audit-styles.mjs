import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const tokens = /\/\*[\s\S]*?\*\/|"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\\[\s\S]|[{}()[\];,]/g;
const grouping = /^@(?:media|supports|layer|container|starting-style|scope)\b/;

function splitSelectors(selector) {
  let depth = 0;
  let from = 0;
  const parts = [];
  for (const match of selector.matchAll(tokens)) {
    if (match[0] === '(' || match[0] === '[') depth++;
    if (match[0] === ')' || match[0] === ']') depth--;
    if (match[0] === ',' && depth === 0) {
      parts.push(selector.slice(from, match.index));
      from = match.index + 1;
    }
  }
  parts.push(selector.slice(from));
  return parts;
}

// Keep the last identical rule in the same conditional scope. Different values,
// layer and query contexts are not duplicates; never merge those overrides.
export function removeExactStyleDuplicates(css) {
  const stream = new RegExp(tokens);
  const rules = new Map();
  const changes = [];
  let removed = 0;
  const readBlock = (start, scope, mode) => {
    let pending = start;
    let depth = 0;
    for (let m; (m = stream.exec(css));) {
      const token = m[0];
      if (token === '(' || token === '[') depth++;
      if (token === ')' || token === ']') depth--;
      if (depth) continue;
      if (token === '}') return;
      if (token === ';') pending = stream.lastIndex;
      if (token !== '{') continue;
      const opening = css.slice(pending, m.index);
      const leading = opening.match(/^(?:\s|\uFEFF|\/\*[\s\S]*?\*\/)*/)[0];
      const header = opening.slice(leading.length);
      const selector = header.trim();
      const group = grouping.test(selector);
      const contentStart = stream.lastIndex;
      readBlock(contentStart, [...scope, selector], mode && group && selector !== '@layer');
      const end = stream.lastIndex;
      if (mode && selector && !selector.startsWith('@') && !selector.includes('/*')) {
        const from = pending + leading.length;
        const seen = new Set();
        const parts = splitSelectors(header);
        const members = parts.filter(part => {
          const key = part.trim();
          if (seen.has(key)) {
            removed++;
            return false;
          }
          seen.add(key);
          return true;
        });
        const replacement = members.length === parts.length
          ? header
          : members.join(',').trimEnd() + header.match(/\s*$/)[0];
        const key = JSON.stringify([scope, [...seen], css.slice(contentStart, end - 1).trim()]);
        const previous = rules.get(key);
        if (previous) {
          previous.from -= css.slice(0, previous.from).match(/[ \t]*$/)[0].length;
          previous.to = previous.end;
          previous.replacement = '';
          removed++;
        }
        const rule = { from, to: m.index, end, replacement };
        rules.set(key, rule);
        changes.push(rule);
      }
      pending = end;
    }
    if (start > 0) throw new Error('Unclosed CSS block');
  };
  readBlock(0, [], true);
  let next = css;
  for (const edit of changes.reverse()) next = next.slice(0, edit.from) + edit.replacement + next.slice(edit.to);
  return { css: next, removed };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const apply = process.argv.includes('--apply');
  const files = ['styles/core.css', 'styles/pages.css', 'styles/brand-review.css', 'styles.css', 'styles/blog.css', 'styles/section-contrast-preview.css'];
  const cleaned = [];
  let remaining = 0;
  for (const path of files) {
    const file = new URL(`../${path}`, import.meta.url);
    const before = readFileSync(file, 'utf8');
    const { css, removed } = removeExactStyleDuplicates(before);
    cleaned.push(css);
    remaining += removed;
    if (apply && css !== before) writeFileSync(file, css);
    console.log(`${path}: ${removed} exact duplicate(s) ${apply ? 'removed' : 'found'}`);
  }
  const crossFile = removeExactStyleDuplicates(cleaned.join('\n')).removed;
  console.log(`Across shared stylesheet files: ${crossFile} exact duplicate(s) found`);
  if (crossFile || (!apply && remaining)) process.exitCode = 1;
}
