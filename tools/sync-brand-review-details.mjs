import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { classifyReviewSection } from '../scripts/pages/brand-review-order.js';
import { isBrandSportsSection } from '../scripts/pages/brand-layout.js';
import { BRAND_TABLE_TOPICS, belongsInReviewDetails, groupBrandReviewDetails } from '../scripts/pages/brand.js';

const locales = ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/'];
const review = /<main\b[^>]*class="content-(?:review|article)"[^>]*>[\s\S]*?<\/main>/;
const sectionPattern = /(<section\b[^>]*>)([\s\S]*?)<\/section>/g;
const editorialTopics = new Set([...BRAND_TABLE_TOPICS, 'rewards']);
const sportsbookHeadings = /^(?:Traditional Sportsbook|Winairlines Sportsbook|How 22Bet Organizes Sports, Live Betting)/i;
const legacyTopics = new Map([
  ['Daily Reel Run, Missions & Lottery', 'rewards'],
  ['Journey Map, Lucky Spin & Lucky Box', 'rewards'],
  ['How Fugu Organizes Ongoing Player Value', 'rewards'],
  ['Sports & Crypto Welcome Choices', 'bonuses'],
  ['Babu88 Product Map', 'summary'],
  ['Longfu88 Country-by-Country Comparison', 'summary'],
  ['Accounts, Payouts & Player Protection', 'cashier'],
]);

export function parseBrandDetailSource(html) {
  const article = html.match(review)?.[0] || '';
  return Array.from(article.matchAll(sectionPattern), ([, tag, content]) => {
    const attr = name => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1];
    const heading = content.match(/^\s*<h2\b[^>]*>([\s\S]*?)<\/h2>/)?.[1]
      .replace(/<[^>]+>/g, '').replaceAll('&amp;', '&').replace(/\s+/g, ' ').trim() || '';
    return {
      tag, heading, id: attr('id') || '', rail: attr('data-brand-rail'), kind: attr('data-review-section'),
      tables: [...content.matchAll(/<table\b/g)].length,
      explicit: /\sdata-review-details(?=\s|>)/.test(tag),
      isPros: /class="[^"]*pros-cons-grid/.test(content),
    };
  });
}

export function planBrandDetailSections(sections) {
  if (!sections.some(section => section.tables)) return null;
  return sections.map(section => {
    const { heading, id, tables, rail } = section;
    const kind = section.kind || legacyTopics.get(heading) || classifyReviewSection({
      heading, id, isPros: section.isPros,
      isSports: sportsbookHeadings.test(heading) || isBrandSportsSection({ id, heading, kind: rail }),
    });
    const explicit = section.explicit || Boolean(heading && !rail && !tables && editorialTopics.has(kind) && kind !== 'sports');
    const result = { id, rail, kind, explicit, hasTable: Boolean(tables), tables };
    if (!heading || !belongsInReviewDetails(result)) return null;
    return result;
  });
}

export function syncBrandDetailSections(html, source, plan) {
  const local = parseBrandDetailSource(html);
  if (source.length !== local.length || source.some((section, index) =>
    section.id !== local[index].id || section.tables !== local[index].tables || Boolean(section.heading) !== Boolean(local[index].heading) ||
    section.rail !== local[index].rail || section.isPros !== local[index].isPros)) {
    throw new Error('Localized review does not match the source section order');
  }
  return html.replace(review, article => {
    let index = 0;
    return article.replace(sectionPattern, (whole, tag) => {
      const target = plan[index];
      const section = local[index++];
      if (!target) return whole;
      const attrs = [
        ...(!section.kind ? [`data-review-section="${target.kind}"`] : []),
        ...(target.explicit && !section.explicit ? ['data-review-details'] : []),
      ];
      if (section.kind && section.kind !== target.kind) throw new Error(`Conflicting localized section role: ${section.heading}`);
      if (!attrs.length) return whole;
      // Only change the section's opening tag; table rows, titles, anchors and links are untouched.
      return tag.slice(0, -1) + ' ' + attrs.join(' ') + '>' + whole.slice(tag.length);
    });
  });
}

function main() {
  const apply = process.argv.includes('--apply');
  let checked = 0, updated = 0, tabs = 0, single = 0;
  for (const dir of readdirSync('brands', { withFileTypes: true }).filter(entry => entry.isDirectory())) {
    const file = `brands/${dir.name}/index.html`;
    if (!existsSync(file)) continue;
    const source = parseBrandDetailSource(readFileSync(file, 'utf8'));
    const plan = planBrandDetailSections(source);
    if (!plan) continue;
    const groups = groupBrandReviewDetails(plan.filter(Boolean));
    if (groups.length > 1) tabs++;
    if (groups.length === 1) single++;
    if (!groups.length) throw new Error(`No review details found in ${file}`);
    for (const prefix of locales) {
      const path = prefix + file;
      const before = readFileSync(path, 'utf8');
      let after;
      try { after = syncBrandDetailSections(before, source, plan); }
      catch (error) { throw new Error(`${path}: ${error.message}`); }
      checked++;
      if (before === after) continue;
      updated++;
      if (apply) writeFileSync(path, after);
      else if (updated <= 6) console.error(`Missing shared detail metadata: ${path}`);
    }
  }
  console.log(`Review details: ${checked} localized pages checked, ${updated} pages ${apply ? 'updated' : 'need updating'}; ${tabs} brands with tabs, ${single} with a single topic.`);
  if (!apply && updated) process.exitCode = 1;
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) main();
