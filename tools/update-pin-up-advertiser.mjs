import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {BRANDS} from '../scripts/brands.js';
import {PINUP_COPY, PINUP_FREEBET_CAPS, PINUP_SPORTS_COVERAGE} from './pin-up-advertiser-copy.mjs';
import {syncDefaultTheme} from './sync-default-theme.mjs';
const root = new URL('../',import.meta.url);
const brand = BRANDS.find(b=>b.name==='Pin-Up');
const oldBonus='Casino 120% + 250 FS, Sports up to 125%; local caps vary';
const esc = s => String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const plain = s => s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replace(/\s+/g,' ').trim();
const available = locale => {
  const names=new Intl.DisplayNames([locale],{type:'region'});
  return brand.countries.map(code=>names.of(code)).join(', ');
};
export function updatePinUpReview(html,locale) {
  const c=PINUP_COPY[locale];
  // Narrow rails use the site's existing stacked feature cards, not a wide table.
  html=html.replace(/(<section class="container" id="pinup-sports-betting" data-brand-rail="betting">)([\s\S]*?)(<\/section>)/,(all,start,body,end)=>start+body.replace(/<table>[\s\S]*?<tbody>([\s\S]*?)<\/tbody>[\s\S]*?<\/table>/,(table,rows)=>'<div class="features-grid premium-grid">'+[...rows.matchAll(/<tr><td>([\s\S]*?)<\/td><td>([\s\S]*?)<\/td><\/tr>/g)].map(m=>`<div class="feature-card glass-card"><strong>${m[1]}</strong><span>${m[2]}</span></div>`).join('')+'</div>')+end);
  // Feature cards contain an inner icon div: do not stop at its closing tag.
  let feature=0;
  html=html.replace(/(<section\b[^>]*id="brand-why-section"[^>]*>)([\s\S]*?)(<\/section>)/,(all,start,body,end)=>start+body.replace(/<div class="feature-card glass-card">[\s\S]*?<strong>[\s\S]*?<\/strong>\s*<span>[\s\S]*?<\/span>\s*<\/div>/g,card=>{
    const i=feature++;
    if(i===1)return card.replace(/<span>[\s\S]*?<\/span>/,()=>`<span>${esc(c.terms)}</span>`);
    if(i===2)return card.replace(/<strong>[\s\S]*?<\/strong>/,()=>`<strong>${esc(c.slotsTitle)}</strong>`).replace(/<span>[\s\S]*?<\/span>/,()=>`<span>${esc(c.slots)}</span>`);
    return card;
  })+end);
  const addCoverage = source => source.replace(/(<section class="container" id="pinup-sports-betting" data-brand-rail="betting">)([\s\S]*?)(<\/section>)/,(all,start,body,end)=>start+(body.includes('class="pinup-sports-coverage"')?body:body.replace('</p>',()=>`</p><p class="pinup-sports-coverage">${esc(PINUP_SPORTS_COVERAGE[locale])}</p>`))+end).replace(/[\t ]+$/gm,'');
  if(html.includes('<!-- pinup-advertiser-update:20261117 -->')) return addCoverage(html);
  html=html.replace(/(<p class="hero-subtitle">)[\s\S]*?(<\/p>)/,`$1${esc(c.intro)}$2`);
  const date=new Intl.DateTimeFormat(locale,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date('2026-11-17T12:00:00Z'));
  html=html.replace(/(<p class="hero-subtitle editorial-meta">)[\s\S]*?(<\/p>)/,`$1<time datetime="2026-11-17">${date}</time>$2`);
  let cardIndex=0;
  html=html.replace(/(<section\b[^>]*id="brand-why-section"[^>]*>)([\s\S]*?)(<\/section>)/,(all,start,body,end)=>start+body.replace(/<div class="feature-card glass-card">[\s\S]*?<\/div>/g,card=>{
    const index=cardIndex++;
    if(index===1)return card.replace(/<span>[\s\S]*?<\/span>/,`<span>${esc(c.terms)}</span>`);
    if(index===2)return card.replace(/<strong>[\s\S]*?<\/strong>/,`<strong>${esc(c.slotsTitle)}</strong>`).replace(/<span>[\s\S]*?<\/span>/,`<span>${esc(c.slots)}</span>`);
    return card;
  })+end);
  // Preserve country names and deposit caps already translated in each review.
  // The free-bet limits below are separate amounts, never added to the deposit cap.
  html=html.replace(/10[ ,.\u00a0]?000(?=\s*AZN)/gu,'8,000');
  const mainIndex=html.indexOf('<main class="content-review">');
  let main=html.slice(mainIndex), prefix=html.slice(0,mainIndex);
  const regional=main.match(/<section class="container">[\s\S]*?<table>[\s\S]*?<\/table>\s*<\/section>/);
  if(!regional)throw Error(locale+': missing regional table');
  const headers=[...regional[0].matchAll(/<th>([\s\S]*?)<\/th>/g)].map(m=>m[1]);
  const rows=[...regional[0].matchAll(/<tr>[\s\S]*?<\/tr>/g)].slice(1).map(m=>[...m[0].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(c=>c[1]));
  if(rows.length!==10||rows.some(r=>r.length!==4))throw Error(locale+': unexpected regional table shape');
  const casinoTable=`<table><thead><tr><th>${headers[0]}</th><th>${headers[1]}</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('')}</tbody></table>`;
  const casinoSection=regional[0].replace(/<table>[\s\S]*?<\/table>/,casinoTable);
  const sportsSection=`<section class="container" id="pinup-sports-betting" data-brand-rail="betting"><h2 class="title">${esc(c.sportsTitle)}</h2><p>${esc(c.sports)}</p><div class="features-grid premium-grid">${rows.map((r,i)=>`<div class="feature-card glass-card"><strong>${r[0]}</strong><span>${r[2]} + ${esc(c.freeBet.replace('{cap}',PINUP_FREEBET_CAPS[i]))}</span></div>`).join('')}</div></section>`;
  main=main.replace(regional[0],()=>casinoSection+'\n'+sportsSection);
  let tableIndex=0;
  main=main.replace(/<table>[\s\S]*?<\/table>/g,table=>{
    const index=tableIndex++;
    // 0 casino regional, 1 recurring bonus terms; sports uses stacked cards.
    if(index===1){let row=0;return table.replace(/<tbody>([\s\S]*?)<\/tbody>/,(all,body)=>'<tbody>'+body.replace(/<tr>[\s\S]*?<\/tr>/g,r=>row++===1?'':r)+'</tbody>');}
    // Remove the old sports-catalog row from the mixed product overview.
    if(index===2){let row=0;return table.replace(/<tbody>([\s\S]*?)<\/tbody>/,(all,body)=>'<tbody>'+body.replace(/<tr>[\s\S]*?<\/tr>/g,r=>row++===4?'':r)+'</tbody>');}
    return table;
  });
  // Replace the pros sentence naming only ten markets with the confirmed 17-country scope.
  main=main.replace(/<span>([^<]*(?:Chile|Chili|Чилі|चिली)[^<]*)<\/span>/u,()=>`<span>${esc(c.availability.replace('{countries}',available(locale)))}</span>`);
  const answer=c.intro+' '+c.sports;
  let faqIndex=0;
  main=main.replace(/(<div class="timeline">)([\s\S]*?)(<\/div>)/,(all,start,body,end)=>start+body.replace(/(<h3>[\s\S]*?<\/h3>\s*<p>)[\s\S]*?(<\/p>)/g,(all,start,end)=>faqIndex++===0?start+esc(answer)+end:all)+end);
  html=prefix+main;
  const faqBody=html.match(/<div class="timeline">([\s\S]*?)<\/div>/)?.[1]||'';
  const faqs=[...faqBody.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map(m=>({'@type':'Question',name:plain(m[1]),acceptedAnswer:{'@type':'Answer',text:plain(m[2])}}));
  if(faqs.length!==8)throw Error(locale+': expected eight visible FAQ entries');
  html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(all,start,json,end)=>{
    const data=JSON.parse(json);for(const node of data['@graph']){if(node['@type']==='FAQPage')node.mainEntity=faqs;if(node['@type']==='WebPage')node.dateModified='2026-11-17';}return start+JSON.stringify(data)+end;
  });
  return syncDefaultTheme(addCoverage(html.replace('</body>','<!-- pinup-advertiser-update:20261117 -->\n</body>')));
}
export function updatePinUpCatalog(html,locale) {
  const c=PINUP_COPY[locale];
  return syncDefaultTheme(html.replace(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g,row=>{
    if(!/href="(?:\/[a-z]{2})?\/brands\/pin-up\//.test(row))return row;
    let p=0;
    return row.replace(/(<p class="casino-bonus">)([\s\S]*?)(<\/p>)/g,(all,start,body,end)=>{
      const i=p++;if(i!==1&&i!==2)return all;
      const label=body.match(/<strong>[\s\S]*?<\/strong>/)?.[0];
      if(!label)throw Error(locale+': catalog label missing');
      return start+label+' '+esc(i===1?c.short:available(locale))+end;
    });
  }));
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  let changed=0;const check=process.argv.includes('--check');
  for(const locale of Object.keys(PINUP_COPY)){
    const prefix=locale==='en'?'':locale+'/';
    for(const [file,update] of [[`${prefix}brands/pin-up/index.html`,updatePinUpReview],[`${prefix}casinos-and-betting/index.html`,updatePinUpCatalog]]){
      const url=new URL(file,root),before=fs.readFileSync(url,'utf8'),after=update(before,locale);
      if(before!==after){changed++;if(!check)fs.writeFileSync(url,after);}
    }
    const guide=new URL(`${prefix}online-casinos/kyrgyzstan/index.html`,root),beforeGuide=fs.readFileSync(guide,'utf8');
    const afterGuide=beforeGuide.replace(/<!-- crawlable-reviews:start -->[\s\S]*?<!-- crawlable-reviews:end -->/,block=>{
      if(block.includes('/brands/pin-up/'))return block;
      const inserted=block.replace(/(<a href="[^"]*\/brands\/pinco\/">)/,`<a href="/${prefix}brands/pin-up/">Pin-Up</a>\n$1`);
      return inserted.replace(/\(\d+\)/,()=>`(${[...inserted.matchAll(/<a href=/g)].length})`);
    });
    if(beforeGuide!==afterGuide){changed++;if(!check)fs.writeFileSync(guide,afterGuide);}
    if(locale!=='en'){
      const file=new URL(`scripts/brand-bonus-translations/${locale}.js`,root),before=fs.readFileSync(file,'utf8');
      const data=JSON.parse(before.slice(before.indexOf('export default ')+15).replace(/;\s*$/,''));
      delete data[oldBonus];data[brand.bonus]=PINUP_COPY[locale].short;
      const after='// Generated by tools/sync-brand-bonus-translations.mjs. Do not edit manually.\nexport default '+JSON.stringify(data,null,2)+';\n';
      if(before!==after){changed++;if(!check)fs.writeFileSync(file,after);}
    }
  }
  console.log(`${check?'Pending':'Updated'} Pin-Up files: ${changed}`);if(check&&changed)process.exitCode=1;
}
