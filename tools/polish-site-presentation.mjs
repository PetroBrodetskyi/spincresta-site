import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const decorativeClass = /(?:^|\s)(?:[\w-]*(?:kicker|eyebrow|overline)|brand-quick-facts__heading)(?:\s|$)/;

export function stripDecorativeLabels(source) {
  return source.replace(/(^[ \t]*)?<(span|p)\b([^>]*\bclass=["']([^"']+)["'][^>]*)>([^<]*)<\/\2>([ \t]*\r?\n)?/gm,
    (element, indent, tag, attributes, classes) => {
      if (!decorativeClass.test(classes)) return element;
      // Never remove an anchor target, form label, status or interactive content.
      if (/\b(?:id|role|aria-live|tabindex|for)\s*=/.test(attributes)) return element;
      return '';
    }).replace(/^[ \t]*<meta name="brand-games-kicker"[^>]*>\r?\n?/gm, '');
}

const splitShadows = value => {
  const parts = [];
  let depth = 0, start = 0;
  for (let i = 0; i < value.length; i++) {
    if (value[i] === '(') depth++;
    if (value[i] === ')') depth--;
    if (value[i] === ',' && depth === 0) { parts.push(value.slice(start, i).trim()); start = i + 1; }
  }
  parts.push(value.slice(start).trim());
  return parts;
};

export function matteCss(source) {
  return source
    // These are UI glass filters, not the image-derived blur behind brand media.
    .replace(/((?:-webkit-)?backdrop-filter:\s*)[^;{}]+;/g, (_, property) => `${property}none;`)
    .replace(/(--blur-glass:\s*)[^;]+;/g, '$1none;')
    .replace(/content:\s*var\(--section-eyebrow[^;]*;/g, 'content: none;')
    .replace(/content:\s*(['"])((?:\\.|(?!\1)[\s\S])*?)\1\s*;/g, (declaration, quote, text) => {
      const withoutEscapes = text.replace(/\\[\da-f]{1,6}\s?/gi, '');
      return /\p{L}/u.test(withoutEscapes) ? 'content: none;' : declaration;
    })
    .replace(/((?:--[\w-]*shadow[\w-]*|box-shadow):\s*)([^;{}]+);/g, (_, property, value) => {
      const retained = splitShadows(value).filter(part => !/^inset\b/.test(part));
      return property + (retained.join(', ') || 'none') + ';';
    })
    .replace(/(--(?:unified-hero-lower|editorial-hero-rail)-bg:\s*)[^;]+;/g, '$1var(--surface-panel);')
    .replace(/(--header-surface:\s*)[^;]+;/g, '$1var(--chrome-bg);')
    .replace(/border-(?:left|inline-start):\s*[2-6]px solid var\(--section-accent\);/g, 'border-left: 0;')
    .replace(/([^{}]+)\{([^{}]*)\}/g, (rule, selector, body) => {
      // Accent bars only: do not affect dividers, focus indicators or table edges.
      if (!/::(?:before|after)/.test(selector) || !/width:\s*[1-6]px;/.test(body)) return rule;
      if (!/height:\s*(?:(?:[2-9]\d|\d{3,})px|clamp\([^;]+\));|(?:top|bottom):[\s\S]*(?:top|bottom):/.test(body)) return rule;
      if (!/var\(--(?:section-accent|gold)\)/.test(body)) return rule;
      return `${selector}{${body.replace(/content:\s*[^;]+;/, 'content: none;')}}`;
    });
}

function main() {
  const files = [];
  const walk = directory => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      if (entry.name.startsWith('.') || ['node_modules', 'tmp', 'research'].includes(entry.name)) continue;
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.name === 'index.html' || /\.(?:js|mjs|css)$/.test(entry.name)) files.push(file);
    }
  };
  walk(root);
  const apply = process.argv.includes('--apply');
  const changes = { html: 0, runtime: 0, generators: 0, css: 0 };
  for (const file of files) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const kind = relative.endsWith('index.html') ? 'html' :
      relative.startsWith('scripts/') && relative.endsWith('.js') ? 'runtime' :
      /^tools\/(?:build-|redesign-|generate-).*\.mjs$/.test(relative) ? 'generators' :
      /^styles\/(?:core|pages|blog)\.css$/.test(relative) ? 'css' : null;
    if (!kind) continue;
    const before = fs.readFileSync(file, 'utf8');
    const after = kind === 'css' ? matteCss(before) : stripDecorativeLabels(before);
    if (after === before) continue;
    changes[kind]++;
    if (apply) fs.writeFileSync(file, after);
  }
  console.log(`Site presentation ${apply ? 'updated' : 'pending'}: ${JSON.stringify(changes)}`);
  if (!apply && Object.values(changes).some(Boolean)) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) main();
