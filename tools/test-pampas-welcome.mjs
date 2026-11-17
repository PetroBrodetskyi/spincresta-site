import fs from 'node:fs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {BRANDS} from '../scripts/brands.js';
import {PAMPAS_COPY, PAMPAS_MARKETS, PAMPAS_STAGES} from './pampas-welcome-copy.mjs';
import {plain,updatePampasReview,updatePampasCatalog} from './update-pampas-welcome.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const brand=BRANDS.find(b=>b.name==='Pampas');
test('Pampas registry retains approved destination and markets',()=>{
  assert.equal(brand.bonus,PAMPAS_COPY.en.short);
  assert.deepEqual(brand.countries,['AR','CO','CL','MX']);
  assert.equal(brand.urlCasino,'https://armadaapp.media-412.com/click?pid=3862&offer_id=122865');
  assert.equal(brand.image,'images/pampas-20261117.svg');
  assert.match(read(brand.image),/<svg/);assert.ok(!/<script|<image|(?:href|src)="https?:/.test(read(brand.image)));
  assert.equal(PAMPAS_STAGES.reduce((s,r)=>s+r.percent,0),455);
  assert.equal(PAMPAS_STAGES.reduce((s,r)=>s+r.spins,0),270);
});
for(const [locale,c] of Object.entries(PAMPAS_COPY)){
  const prefix=locale==='en'?'':locale+'/';const html=read(prefix+'brands/pampas/index.html');
  test(locale+': all four markets have exact per-stage caps and conditions',()=>{
    assert.ok(plain(html).includes(c.short));assert.ok(plain(html).includes(c.specialNote));
    const section=html.match(/<section[^>]+id="pampas-welcome"[\s\S]*?<\/section>/)[0];
    const tables=[...section.matchAll(/<tbody>([\s\S]*?)<\/tbody>/g)];assert.equal(tables.length,4);
    PAMPAS_MARKETS.forEach((m,i)=>{
      const text=plain(tables[i][1]);const n=x=>plain(new Intl.NumberFormat(locale).format(x)+' '+m.currency);
      assert.ok(text.includes(n(m.minimum)));
      for(const cap of [...m.caps,m.special])assert.ok(text.includes(n(cap)));
      assert.equal((text.match(/×25/g)||[]).length,1);assert.equal((text.match(/×35/g)||[]).length,5);
      assert.ok(text.includes(c.hours));for(const s of PAMPAS_STAGES)if(s.game)assert.ok(text.includes(s.game));
      assert.equal((tables[i][1].match(/<tr>/g)||[]).length,6);
    });
    assert.doesNotMatch(html,/450\s*%|x40|×40|40x|docs\.google\.com|figma\.com|825[ ,.]?000|9[ ,.]?955|537[ ,.]?000|1[ ,.]?710[ ,.]?000/);
    assert.match(html,/id="pampas-sports-betting" data-brand-rail="betting"/);
    const external=[...html.matchAll(/href="(https?:[^"\s]+)"/g)].map(m=>m[1]);
    assert.ok(external.every(u=>u.startsWith('https://spincresta.com/')||u===brand.urlCasino||u==='https://t.me/spincresta'||u==='https://x.com/SpinCresta'));
    assert.ok(html.includes('/'+brand.image));
  });
  test(locale+': visible FAQ equals schema; updates are repeatable',()=>{
    const data=JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
    const faq=html.match(/<div class="timeline">([\s\S]*?)<\/div>/)[1];
    const visible=[...faq.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map(m=>[plain(m[1]),plain(m[2])]);
    assert.equal(visible.length,6);assert.deepEqual(data['@graph'].find(n=>n['@type']==='FAQPage').mainEntity.map(q=>[q.name,q.acceptedAnswer.text]),visible);
    assert.equal(updatePampasReview(html,locale),html);
    const catalog=read(prefix+'casinos-and-betting/index.html');assert.equal(updatePampasCatalog(catalog,locale),catalog);assert.ok(plain(catalog).includes(c.short));
    // The migration can rebuild from the pre-update page, not just its own marker.
    const before=execFileSync('git',['show',`5ab4840:${prefix}brands/pampas/index.html`],{maxBuffer:1000000}).toString();
    const rebuilt=updatePampasReview(before,locale);assert.ok(plain(rebuilt).includes(c.short));assert.match(rebuilt,/id="pampas-sports-betting"/);
    assert.equal((rebuilt.match(/<section\b/g)||[]).length,(before.match(/<section\b/g)||[]).length);
    assert.equal((rebuilt.match(/class="feature-card glass-card"/g)||[]).length,(before.match(/class="feature-card glass-card"/g)||[]).length+6);
  });
}
