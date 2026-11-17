import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export const THEME_INIT_TAG = '<script src="/scripts/theme-init.js?v=20261117-light-1"></script>';
export const THEME_ENTRY_VERSION = '20261117-light-pinup-1';
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
  return html.replace(/<html\b([^>]*)>/i,(all,attributes)=>`<html${attributes.replace(/\sdata-theme=(?:"[^"]*"|'[^']*')/gi,'')} data-theme="light">`)
    .replace(/\s*<script src="\/scripts\/theme-init\.js(?:\?[^"\s]*)?"><\/script>/g,'')
    .replace(/(<meta\b[^>]*charset=[^>]+>)/i,`$1\n    ${THEME_INIT_TAG}`)
    .replace(/(<meta name="theme-color" content=")[^"]+("\s*\/?>)/g,'$1#ffffff$2')
    .replace(/(\/scripts\/main\.js)\?v=[^"\s]+/g,`$1?v=${THEME_ENTRY_VERSION}`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  const check=process.argv.includes('--check');let changed=0;const files=publicThemePages();
  for(const file of files){const before=fs.readFileSync(file,'utf8'),after=syncDefaultTheme(before);if(before!==after){changed++;if(!check)fs.writeFileSync(file,after);}}
  console.log(`Default light theme: ${files.length} pages, ${changed} ${check?'pending':'updated'}.`);
  if(check&&changed)process.exitCode=1;
}
