import fs from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const locales = ['', 'de/', 'es/', 'it/', 'pl/', 'uk/', 'pt/', 'fr/', 'hi/', 'fi/'];
const routes = [
  'top-casinos', 'top-rated', 'new-casinos', 'exclusive-offers', 'online-casinos',
  'casinos-and-betting', 'payment-methods', 'about', 'partners', 'privacy-policy',
  'responsible-gambling', 'authors/odri-chambers', 'blog', 'blog/how-to-choose-an-online-casino',
];

export function simplifyPageIntro(html) {
  if (/<body\b[^>]*\bdata-brand=/.test(html)) return html;
  return html.replace(
    /(<section class="(?:author-hero )?hero container"[^>]*>)([\s\S]*?)<\/section>/,
    (_, opening, content) => opening
      .replace('author-hero hero container', 'page-intro page-intro-author container')
      .replace('class="hero container"', 'class="page-intro container"')
      + content.replace(/\bhero-content\b/, 'page-intro-copy')
        .replace(/\n[ \t]*<div class="hero-banner">\s*(?:<!--\s*Banner ad or promo script\s*-->\s*)?<\/div>/, '')
      + '</section>',
  ).replace(
    '<section class="blog-hero"',
    '<section class="page-intro page-intro-blog"',
  ).replace(
    /<header\s+class="blog-article-header"\s+style="--blog-article-hero-image:[^"]*"\s*>/,
    '<header class="page-intro page-intro-article container">',
  );
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  const apply = process.argv.includes('--apply');
  let changes = 0;
  for (const locale of locales) {
    for (const route of routes) {
      const file = new URL(`../${locale}${route}/index.html`, import.meta.url);
      const html = fs.readFileSync(file, 'utf8');
      const next = simplifyPageIntro(html);
      if (!/class="page-intro\b/.test(next)) throw new Error(`Missing intro: ${file.pathname}`);
      if (html === next) continue;
      if (apply) fs.writeFileSync(file, next);
      changes++;
    }
  }
  console.log(`Page intros: ${changes} ${apply ? 'updated' : 'need updating'}.`);
  if (!apply && changes) process.exitCode = 1;
}
