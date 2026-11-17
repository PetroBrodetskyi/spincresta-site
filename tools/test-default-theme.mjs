import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import test from 'node:test';
import {publicThemePages,syncDefaultTheme,THEME_INIT_TAG} from './sync-default-theme.mjs';
const init=fs.readFileSync(new URL('../scripts/theme-init.js',import.meta.url),'utf8');
function boot(saved,blocked=false){const root={dataset:{},style:{}};vm.runInNewContext(init,{document:{documentElement:root},window:{localStorage:{getItem(){if(blocked)throw Error('Storage blocked');return saved;}}}});return root;}
for(const value of [null,undefined,'','system','invalid'])test(`new or invalid preference ${value}: light`,()=>assert.equal(boot(value).dataset.theme,'light'));
for(const value of ['dark','light'])test(`preserves saved ${value}`,()=>assert.equal(boot(value).dataset.theme,value));
test('blocked storage still uses light',()=>assert.equal(boot(null,true).style.colorScheme,'light'));
test('every public styled page sets the theme before CSS, without a dark flash',()=>{
  const files=publicThemePages();assert.ok(files.length>2600);
  for(const file of files){const html=fs.readFileSync(file,'utf8');assert.match(html,/<html\b[^>]*data-theme="light"/i,file);assert.ok(html.indexOf(THEME_INIT_TAG)<html.indexOf('href="/styles.css'),file);assert.equal(syncDefaultTheme(html),html,file);}
});
test('runtime fallback agrees with the head initializer',()=>assert.match(fs.readFileSync(new URL('../scripts/main.js',import.meta.url),'utf8'),/const getDefaultTheme = \(\) => 'light';/));
