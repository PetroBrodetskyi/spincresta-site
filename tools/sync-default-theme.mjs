import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import { HOME_PAGE_ASSET_VERSION, HEADER_STYLE_REVISION } from './sync-home-language-switcher.mjs';
import { syncGameProviderFooter } from './game-provider-footer.mjs';
import { syncStaticHeaderControls } from './static-header-controls.mjs';

const SITE_ENTRY_VERSION = '20261119-catalog-partners';
const SITE_STYLE_VERSION = '20261119-catalog-partners';
const TOP_CASINOS_VERSION = '20261124-mobile-rankings';
const CATALOG_VERSION = '20261119-catalog-tiles';
const EDITORIAL_DASHBOARD_VERSION = '20261119-editorial-dashboards';
const LIGHT_EDITORIAL_VERSION = '20261119-light-editorial';
const PROFILE_AND_ARTICLE_VERSION = '20261119-light-profile-guide';
const COUNTRY_HUB_VERSION = '20261119-country-hub';
const BRAND_STYLE_VERSION = '20261124-review-first-paint';
const BRAND_ENTRY_VERSION = '20261124-review-first-paint';
const PROVIDER_DIRECTORY_VERSION = '20261124-provider-art';
const WORDMARK_VERSION = '20261118-padded-wordmark';
const excluded = new Set(['.git','.vercel','node_modules','tools','research','data','tmp','keyboard-diagnostics']);
export function publicThemePages(directory=process.cwd()) {
  return fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>{
    if(excluded.has(entry.name)||entry.name.startsWith('.'))return [];
    const file=path.join(directory,entry.name);
    return entry.isDirectory()?publicThemePages(file):entry.name.endsWith('.html')&&fs.readFileSync(file,'utf8').includes('/styles.css')?[file]:[];
  });
}
export function syncDefaultTheme(html) {
  if(!html.includes('/styles.css'))return html;
  const isBrand = /<body\b[^>]*\bdata-brand=/.test(html);
  const styleVersion = isBrand ? BRAND_STYLE_VERSION : SITE_STYLE_VERSION;
  const pageVersion = html.includes('data-provider-directory') ? PROVIDER_DIRECTORY_VERSION
    : html.includes('<!-- home-language-switcher:start -->') ? HOME_PAGE_ASSET_VERSION
    : /<body\b[^>]*\bdata-page="top-casinos"/.test(html) ? TOP_CASINOS_VERSION
    : html.includes('data-country-hub-grid') || html.includes('class="partners-telegram-icon"') ? COUNTRY_HUB_VERSION
    : /<main\b[^>]*(?:\beditorial-dashboard--author\b|\bdata-editorial-reading\b)/.test(html) ? PROFILE_AND_ARTICLE_VERSION
    : html.includes('data-editorial-dashboard') ? LIGHT_EDITORIAL_VERSION
    : html.includes('<main class="catalog-directory">')
    ? CATALOG_VERSION
    : /<main class="account-dashboard editorial-dashboard /.test(html) ? EDITORIAL_DASHBOARD_VERSION : null;
  const shell = syncStaticHeaderControls(syncGameProviderFooter(html)).replace(/<html\b([^>]*)>/i,(all,attributes)=>`<html${attributes.replace(/\sdata-theme=(?:"[^"]*"|'[^']*')/gi,'')}>`)
    .replace(/\s*<script src="\/scripts\/theme-init\.js(?:\?[^"\s]*)?"><\/script>/g,'')
    .replace(/(<meta name="theme-color" content=")[^"]+("\s*\/?>)/g,'$1#ffffff$2')
    .replace(/<img\b(?=[^>]*\bclass="[^"]*\blogo-lockup\b)[^>]*>/g, tag =>
      tag.replace(/src="\/images\/(?:spincresta-logo\.jpg|spincresta-wordmark\.svg)(?:\?[^"]*)?"(?:\s+width="\d+"\s+height="\d+")?/,
        `src="/images/spincresta-wordmark.svg?v=${WORDMARK_VERSION}" width="258" height="60"`)
    )
    .replace(/(\/(?:scripts\/main\.js|styles\.css|styles\/blog\.css))(?:\?v=[^"\s]+)?(?=")/g,
      (_, asset) => {
        const version = pageVersion || (asset === '/styles.css' ? styleVersion
          : asset === '/scripts/main.js' && isBrand ? BRAND_ENTRY_VERSION : SITE_ENTRY_VERSION);
        const header = version === HOME_PAGE_ASSET_VERSION ? '' : '-static-header';
        return `${asset}?v=${version}${header}${asset === '/styles.css' ? HEADER_STYLE_REVISION : ''}`;
      });
  if (!isBrand) return shell;
  return shell
    .replace(/\s*<script data-brand-layout-guard>[\s\S]*?<\/script>/g, '')
    .replace(/(\s+)(<link rel="stylesheet" href="\/styles\.css\?v=[^"\s]+"\s*\/?>)/, (_, indent, link) =>
      `${indent}<script data-brand-layout-guard>document.documentElement.classList.add('brand-layout-pending');window.addEventListener('error',function(event){if(event.target instanceof HTMLScriptElement && event.target.src.includes('/scripts/main.js'))document.documentElement.classList.remove('brand-layout-pending');},true);</script>${indent}${link}`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const check=process.argv.includes('--check');let changed=0;const files=publicThemePages();
  for(const file of files){const before=fs.readFileSync(file,'utf8'),after=syncDefaultTheme(before);if(before!==after){changed++;if(!check)fs.writeFileSync(file,after);}}
  console.log(`Single-palette shell: ${files.length} pages, ${changed} ${check?'pending':'updated'}.`);
  if(check&&changed)process.exitCode=1;
}
