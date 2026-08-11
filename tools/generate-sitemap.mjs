import fs from 'node:fs';
import path from 'node:path';

const SITE_ORIGIN = 'https://spincresta.com';
const ROOT_DIR = process.cwd();
const SITEMAP_PATH = path.join(ROOT_DIR, 'sitemap.xml');
const SKIPPED_DIRECTORIES = new Set(['.git', '.localization-cache', 'node_modules']);

const walkIndexPages = directory =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    if (entry.isDirectory() && SKIPPED_DIRECTORIES.has(entry.name)) return [];

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
  if (pagePath === '/' || pagePath === '/de/' || pagePath === '/es/' || /\/(?:(?:de|es)\/)?online-casinos\/$/.test(pagePath)) {
    return { changefreq: 'weekly', priority: '0.9' };
  }

  if (/\/(?:(?:de|es)\/)?online-casinos\/[^/]+\/$/.test(pagePath)) {
    return { changefreq: 'weekly', priority: '0.7' };
  }

  if (/\/(?:(?:de|es)\/)?brands\/[^/]+\/$/.test(pagePath)) {
    return { changefreq: 'monthly', priority: '0.7' };
  }

  return { changefreq: 'monthly', priority: '0.6' };
};

const existingMetadata = getExistingMetadata();
const pages = walkIndexPages(ROOT_DIR)
  .map(filePath => {
    const pagePath = getPagePath(filePath);
    const html = fs.readFileSync(filePath, 'utf8');
    return { pagePath, robots: getRobotsDirective(html) };
  })
  .filter(page => !page.robots.includes('noindex'))
  .sort((a, b) => a.pagePath.localeCompare(b.pagePath, 'en'));

const sitemapEntries = pages.map(({ pagePath }) => {
  const metadata = existingMetadata.get(pagePath) || getDefaultMetadata(pagePath);
  return [
    '  <url>',
    `    <loc>${SITE_ORIGIN}${pagePath}</loc>`,
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

const englishCount = pages.filter(page => !page.pagePath.startsWith('/de/') && !page.pagePath.startsWith('/es/')).length;
const germanCount = pages.filter(page => page.pagePath.startsWith('/de/')).length;
const spanishCount = pages.filter(page => page.pagePath.startsWith('/es/')).length;
console.log(`Generated ${pages.length} sitemap URLs: ${englishCount} EN, ${germanCount} DE, ${spanishCount} ES.`);
