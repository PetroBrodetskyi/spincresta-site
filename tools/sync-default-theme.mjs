import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

const SITE_ENTRY_VERSION = '20261119-context-icons';
const SITE_STYLE_VERSION = '20261119-context-icons';
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
  return html.replace(/<html\b([^>]*)>/i,(all,attributes)=>`<html${attributes.replace(/\sdata-theme=(?:"[^"]*"|'[^']*')/gi,'')}>`)
    .replace(/\s*<script src="\/scripts\/theme-init\.js(?:\?[^"\s]*)?"><\/script>/g,'')
    .replace(/(<meta name="theme-color" content=")[^"]+("\s*\/?>)/g,'$1#ffffff$2')
    .replace(/<img\b(?=[^>]*\bclass="[^"]*\blogo-lockup\b)[^>]*>/g, tag =>
      tag.replace(/src="\/images\/(?:spincresta-logo\.jpg|spincresta-wordmark\.svg)(?:\?[^"]*)?"(?:\s+width="\d+"\s+height="\d+")?/,
        `src="/images/spincresta-wordmark.svg?v=${WORDMARK_VERSION}" width="258" height="60"`)
    )
    .replace(/(\/(?:scripts\/main\.js|styles\.css|styles\/blog\.css))(?:\?v=[^"\s]+)?(?=")/g,
      (_, asset) => `${asset}?v=${asset === '/styles.css' ? SITE_STYLE_VERSION : SITE_ENTRY_VERSION}`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const check=process.argv.includes('--check');let changed=0;const files=publicThemePages();
  for(const file of files){const before=fs.readFileSync(file,'utf8'),after=syncDefaultTheme(before);if(before!==after){changed++;if(!check)fs.writeFileSync(file,after);}}
  console.log(`Single-palette shell: ${files.length} pages, ${changed} ${check?'pending':'updated'}.`);
  if(check&&changed)process.exitCode=1;
}
