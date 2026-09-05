import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const SITE_ORIGIN = 'https://spincresta.com';
const ROOT_DIR = process.cwd();
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const SKIPPED_DIRECTORIES = new Set(['node_modules', 'tmp', 'tools']);

const walkIndexPages = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory() && (entry.name.startsWith('.') || SKIPPED_DIRECTORIES.has(entry.name))) return [];

    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) return walkIndexPages(absolutePath);
    return entry.name === 'index.html' ? [absolutePath] : [];
  });

const getPagePath = filePath => {
  const relativePath = path.relative(ROOT_DIR, filePath).split(path.sep).join('/');
  return relativePath === 'index.html' ? '/' : `/${relativePath.replace(/index\.html$/, '')}`;
};

const getRobotsDirective = html => {
  const robotsTag = html.match(/<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>/i)?.[0] || '';
  return robotsTag.match(/\bcontent=["']([^"']*)/i)?.[1].trim().toLowerCase() || '';
};

const getExistingMetadata = () => {
  if (!fs.existsSync(SITEMAP_PATH)) return new Map();

  const sitemap = fs.readFileSync(SITEMAP_PATH, 'utf8');
  return new Map(
    [...sitemap.matchAll(/<url>\s*([\s\S]*?)\s*<\/url>/g)].flatMap(([, block]) => {
      const loc = block.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1];
      if (!loc) return [];

      return [[new URL(loc).pathname, {
        changefreq: block.match(/<changefreq>\s*([^<]+?)\s*<\/changefreq>/)?.[1],
        priority: block.match(/<priority>\s*([^<]+?)\s*<\/priority>/)?.[1],
      }]];
    })
  );
};

const getDefaultMetadata = pagePath => {
  if (pagePath === '/' || /^\/(?:de|es|it|pl|uk|pt|fr|hi|fi)\/$/.test(pagePath) || /\/(?:(?:de|es|it|pl|uk|pt|fr|hi|fi)\/)?online-casinos\/$/.test(pagePath)) {
    return { changefreq: 'weekly', priority: '0.9' };
  }

  if (/\/(?:(?:de|es|it|pl|uk|pt|fr|hi|fi)\/)?online-casinos\/[^/]+\/$/.test(pagePath)) {
    return { changefreq: 'weekly', priority: '0.7' };
  }

  if (/\/(?:(?:de|es|it|pl|uk|pt|fr|hi|fi)\/)?brands\/[^/]+\/$/.test(pagePath)) {
    return { changefreq: 'monthly', priority: '0.7' };
  }

  return { changefreq: 'monthly', priority: '0.6' };
};

const existingMetadata = getExistingMetadata();
// Use actual page history, not the date on which the sitemap was generated.
// If Git is unavailable, omit lastmod rather than invent a freshness signal.
const modifiedDates = new Map();
try {
  const history = execFileSync('git', ['log', '--format=DATE:%cI', '--name-only', '--', '*.html'], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  let date;
  for (const line of history.split('\n')) {
    if (line.startsWith('DATE:')) date = line.slice(5, 15);
    else if (line.endsWith('index.html') && !modifiedDates.has(line)) modifiedDates.set(line, date);
  }
  const changed = execFileSync('git', ['diff', '--name-only', 'HEAD', '--', '*.html'], { encoding: 'utf8' }).trim().split('\n');
  const untracked = execFileSync('git', ['ls-files', '--others', '--exclude-standard', '--', '*.html'], { encoding: 'utf8' }).trim().split('\n');
  for (const file of [...changed, ...untracked]) {
    if (file && fs.existsSync(file)) modifiedDates.set(file, fs.statSync(file).mtime.toISOString().slice(0, 10));
  }
} catch { console.warn('Git history unavailable; lastmod is omitted for pages without known dates.'); }
const pages = walkIndexPages(ROOT_DIR)
  .map(filePath => {
    const pagePath = getPagePath(filePath);
    const html = fs.readFileSync(filePath, 'utf8');
    return { pagePath, robots: getRobotsDirective(html), lastmod: modifiedDates.get(path.relative(ROOT_DIR, filePath).split(path.sep).join('/')) };
  })
  .filter(page => !page.robots.includes('noindex'))
  .sort((a, b) => a.pagePath.localeCompare(b.pagePath, 'en'));

const sitemapEntries = pages.map(({ pagePath, lastmod }) => {
  const metadata = existingMetadata.get(pagePath) || getDefaultMetadata(pagePath);
  return [
    '  <url>',
    `    <loc>${SITE_ORIGIN}${pagePath}</loc>`,
    ...(lastmod ? [`    <lastmod>${lastmod}</lastmod>`] : []),
    `    <changefreq>${metadata.changefreq || getDefaultMetadata(pagePath).changefreq}</changefreq>`,
    `    <priority>${metadata.priority || getDefaultMetadata(pagePath).priority}</priority>`,
    '  </url>',
  ].join('\n');
});

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...sitemapEntries,
  '</urlset>',
  '',
].join('\n');

fs.writeFileSync(SITEMAP_PATH, sitemap);

const englishCount = pages.filter(page => !/^\/(?:de|es|it|pl|uk|pt|fr|hi|fi)\//.test(page.pagePath)).length;
const germanCount = pages.filter(page => page.pagePath.startsWith('/de/')).length;
const spanishCount = pages.filter(page => page.pagePath.startsWith('/es/')).length;
const italianCount = pages.filter(page => page.pagePath.startsWith('/it/')).length;
const polishCount = pages.filter(page => page.pagePath.startsWith('/pl/')).length;
const ukrainianCount = pages.filter(page => page.pagePath.startsWith('/uk/')).length;
const portugueseCount = pages.filter(page => page.pagePath.startsWith('/pt/')).length;
const frenchCount = pages.filter(page => page.pagePath.startsWith('/fr/')).length;
const hindiCount = pages.filter(page => page.pagePath.startsWith('/hi/')).length;
const finnishCount = pages.filter(page => page.pagePath.startsWith('/fi/')).length;
console.log(`Generated ${pages.length} sitemap URLs: ${englishCount} EN, ${germanCount} DE, ${spanishCount} ES, ${italianCount} IT, ${polishCount} PL, ${ukrainianCount} UK, ${portugueseCount} PT, ${frenchCount} FR, ${hindiCount} HI, ${finnishCount} FI.`);
