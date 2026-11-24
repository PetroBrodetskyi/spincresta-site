import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const locales = ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/'];
const panel = /(<div class="brand-payments">)(\s*<h2\b[^>]*>[\s\S]*?<\/h2>(?:\s*<p\b[^>]*>[\s\S]*?<\/p>)*\s*<div\b[^>]*\bid="brand-payments"[^>]*>\s*<\/div>(?:\s*<p\b[^>]*>[\s\S]*?<\/p>)*)(\s*<\/div>)/g;
const descriptions = /\n?[\t ]*<p\b[^>]*>[\s\S]*?<\/p>/g;
const article = /<main\b[^>]*>[\s\S]*?<\/main>/;
const sections = /<section\b[^>]*>\s*<h2\b[^>]*>[\s\S]*?<\/h2>/g;
const heading = /<h2\b[^>]*>([\s\S]*?)<\/h2>/;

// These panels supplied extra details not already covered by the main
// review, e.g. the JeetCity and MoonWin wallet names. Move only those.
const keepInCashier = new Map([
  ['dazard', 'Payments, Withdrawals &amp; Verification'],
  ['getx', 'Payments, Withdrawals &amp; KYC'],
  ['goldenstar', 'Payments, Currencies &amp; Withdrawal Timing'],
  ['jeetcity', 'Payments, Withdrawals &amp; KYC'],
  ['moonwin', 'Payments, Withdrawals &amp; KYC'],
]);

const headings = html => [...(html.match(article)?.[0] ?? '').matchAll(sections)];

export function compactBrandPayments(html, cashierSectionIndex = undefined) {
  const moved = [];
  const result = html.replace(panel, (_, open, content, close) => {
    const compact = content.replace(descriptions, paragraph => {
      moved.push(paragraph.trim().replace('class="brand-availability-intro"', 'class="section-intro"'));
      return '';
    });
    return open + compact + close;
  });
  if (cashierSectionIndex === undefined || !moved.length) return result;
  const target = headings(result)[cashierSectionIndex]?.[0];
  if (!target) throw new Error('Missing corresponding cashier heading');
  return result.replace(article, main =>
    main.replace(target, () => target + '\n        ' + moved.join('\n        ')));
}

function main() {
  const apply = process.argv.includes('--apply');
  let changes = 0;
  for (const dir of readdirSync('brands', { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const path = `brands/${dir.name}/index.html`;
    if (!existsSync(path)) continue;
    const expectedHeading = keepInCashier.get(dir.name);
    const index = expectedHeading === undefined ? undefined : headings(readFileSync(path, 'utf8'))
      .findIndex(([tag]) => tag.match(heading)?.[1] === expectedHeading);
    if (index === -1) throw new Error(`Missing cashier section: ${path}`);
    for (const prefix of locales) {
      const localizedPath = prefix + path;
      if (!existsSync(localizedPath)) continue;
      const html = readFileSync(localizedPath, 'utf8');
      const compact = compactBrandPayments(html, index);
      if (compact === html) continue;
      changes++;
      if (apply) writeFileSync(localizedPath, compact);
      else console.error(`Payment panel still has descriptions: ${localizedPath}`);
    }
  }
  console.log(`Compact payment panels: ${changes} pages ${apply ? 'updated' : 'need updating'}.`);
  if (!apply && changes) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) main();
