import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import {BRANDS} from '../scripts/brands.js';
import {PAMPAS_COPY, PAMPAS_MARKETS, PAMPAS_STAGES, PAMPAS_EXISTING_TERMS} from './pampas-welcome-copy.mjs';
const root=new URL('../',import.meta.url);
const brand=BRANDS.find(b=>b.name==='Pampas');
const oldBonus='Casino welcome package up to 450% + 500 FS across first 5 deposits';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
export const plain=s=>s.replace(/<[^>]+>/g,'').replaceAll('&amp;','&').replaceAll('&quot;','"').replaceAll('&#39;',"'").replace(/\s+/g,' ').trim();
const rows=section=>[...section.matchAll(/<tr>[\s\S]*?<\/tr>/g)].slice(1).map(m=>[...m[0].matchAll(/<td>([\s\S]*?)<\/td>/g)].map(c=>c[1]));
function bonusTables(locale){
  const c=PAMPAS_COPY[locale],names=new Intl.DisplayNames([locale],{type:'region'});
  const money=(amount,currency)=>esc(new Intl.NumberFormat(locale).format(amount)+' '+currency);
  const table=market=>{
    const stageRows=PAMPAS_STAGES.map((stage,i)=>{
      const cash=stage.percent?`${stage.percent}% ${esc(c.upTo)} ${money(market.caps[i],market.currency)}`:'';
      const spins=stage.spins?`${stage.spins} ${esc(c.spins)} ${esc(c.inGame)} ${esc(stage.game)}`:'';
      return `<tr><td>${esc(c.stages[i])}</td><td>${[cash,spins].filter(Boolean).join(' + ')}</td><td>${money(market.minimum,market.currency)}</td><td>×${stage.wager}${i===4?'*':''}</td><td>${esc(c.days)}</td></tr>`;
    });
    stageRows.splice(1,0,`<tr><td>${esc(c.special)}</td><td>140% ${esc(c.upTo)} ${money(market.special,market.currency)}</td><td>${money(market.minimum,market.currency)}</td><td>×35</td><td>${esc(c.hours)}</td></tr>`);
    return `<h3>${esc(names.of(market.code))} (${market.currency})</h3><table><thead><tr>${c.headers.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${stageRows.join('')}</tbody></table>`;
  };
  return PAMPAS_MARKETS.map(table).join('\n');
}
export function updatePampasReview(html,locale){
  if(html.includes('<!-- pampas-welcome:20261117 -->'))return html;
  const c=PAMPAS_COPY[locale];
  html=html.replaceAll('/images/pampas.svg','/'+brand.image);
  html=html.replace(/(<p class="hero-subtitle">)[\s\S]*?(<\/p>)/,()=>`<p class="hero-subtitle">${esc(c.summary)}</p>`);
  const date=new Intl.DateTimeFormat(locale,{year:'numeric',month:'long',day:'numeric',timeZone:'UTC'}).format(new Date('2026-11-17T12:00:00Z'));
  html=html.replace(/<p class="hero-subtitle editorial-meta">[\s\S]*?<\/p>/,()=>`<p class="hero-subtitle editorial-meta"><time datetime="2026-11-17">${date}</time></p>`);
  // Move the existing sports feature into the explicitly designated right rail.
  let featureIndex=0,sportsFeature='';
  html=html.replace(/(<section\b[^>]*id="brand-why-section"[^>]*>)([\s\S]*?)(<\/section>)/,(all,start,body,end)=>start+body.replace(/<div class="feature-card glass-card">[\s\S]*?<strong>[\s\S]*?<\/strong>\s*<span>[\s\S]*?<\/span>\s*<\/div>/g,card=>{
    const i=featureIndex++;
    if(i===1){sportsFeature=card;return '';}
    if(i===0)return card.replace(/<strong>[\s\S]*?<\/strong>/,()=>`<strong>${esc(c.title)}</strong>`).replace(/<span>[\s\S]*?<\/span>/,()=>`<span>${esc(c.short)}</span>`);
    return card;
  })+end);
  const mainIndex=html.indexOf('<main class="content-review">');
  let prefix=html.slice(0,mainIndex),main=html.slice(mainIndex);
  const first=main.match(/<section class="container">[\s\S]*?<\/section>/)?.[0];
  if(!first)throw Error(locale+': missing bonus section');
  const oldRows=rows(first);
  if(oldRows.length!==5||oldRows.some(r=>r.length!==3))throw Error(locale+': unexpected bonus table');
  main=main.replace(first,()=>`<section class="container" id="pampas-welcome"><h2 class="title">${esc(c.title)}</h2><p>${esc(c.short)}</p><p>${esc(c.terms)}</p><p>${esc(c.specialNote)}</p>${bonusTables(locale)}<p>${esc(c.fifthNote)}</p><p>${esc(PAMPAS_EXISTING_TERMS[locale][0])}</p><h3>${esc(c.retention)}</h3><p>${esc(PAMPAS_EXISTING_TERMS[locale][1])}</p></section>`);
  // The original third section is the sportsbook. Use stacked cards in a narrow rail.
  let sectionIndex=0;
  main=main.replace(/<section class="container"[^>]*>[\s\S]*?<\/section>/g,section=>{
    const i=sectionIndex++;
    if(i!==2)return section;
    const heading=section.match(/<h2[^>]*>[\s\S]*?<\/h2>/)?.[0];
    const sportsRows=rows(section);
    if(sportsRows.length!==4)throw Error(locale+': missing sports rows');
    return `<section class="container" id="pampas-sports-betting" data-brand-rail="betting">${heading}<div class="features-grid premium-grid">${sportsFeature}${[oldRows[2],oldRows[3],...sportsRows].map(r=>`<div class="feature-card glass-card"><strong>${r[0]}</strong><span>${r[1]} ${r[2]}</span></div>`).join('')}</div></section>`;
  });
  // The pros and cons have stable content order across all ten reviewed locales.
  let pros=0;
  main=main.replace(/(<div class="feature-card glass-card">\s*<strong>[^<]+<\/strong>\s*)<span>([^<]*)<\/span>(?=<br)/g,(all,start,body)=>{
    const i=pros++;return i===0?start+`<span>${esc(c.short)}</span>`:i===1?start+`<span>${esc(c.terms)}</span>`:all;
  });
  let faqIndex=0;
  main=main.replace(/(<div class="timeline">)([\s\S]*?)(<\/div>)/,(all,start,body,end)=>start+body.replace(/(<h3>[\s\S]*?<\/h3>\s*<p>)[\s\S]*?(<\/p>)/g,(all,start,end)=>faqIndex++===0?start+esc(c.summary+' '+c.terms)+end:all)+end);
  html=prefix+main;
  const faq=html.match(/<div class="timeline">([\s\S]*?)<\/div>/)?.[1]||'';
  const faqs=[...faq.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map(m=>({'@type':'Question',name:plain(m[1]),acceptedAnswer:{'@type':'Answer',text:plain(m[2])}}));
  if(faqs.length!==6)throw Error(locale+': FAQ shape changed');
  html=html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/,(all,start,json,end)=>{
    const data=JSON.parse(json);for(const node of data['@graph']){if(node['@type']==='FAQPage')node.mainEntity=faqs;if(node['@type']==='WebPage')node.dateModified='2026-11-17';}return start+JSON.stringify(data)+end;
  });
  return html.replace('</body>','<!-- pampas-welcome:20261117 -->\n</body>').replace(/[\t ]+$/gm,'');
}
export function updatePampasCatalog(html,locale){
  return html.replace(/<article class="casino-list-row"[^>]*>[\s\S]*?<\/article>/g,row=>{
    if(!/href="(?:\/[a-z]{2})?\/brands\/pampas\//.test(row))return row;
    let i=0;return row.replaceAll('/images/pampas.svg','/'+brand.image).replace(/(<p class="casino-bonus">)([\s\S]*?)(<\/p>)/g,(all,start,body,end)=>i++===1?start+body.match(/<strong>[\s\S]*?<\/strong>/)[0]+' '+esc(PAMPAS_COPY[locale].short)+end:all);
  });
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  let changed=0;const check=process.argv.includes('--check');
  for(const locale of Object.keys(PAMPAS_COPY)){
    const prefix=locale==='en'?'':locale+'/';
    for(const [file,update] of [[`${prefix}brands/pampas/index.html`,updatePampasReview],[`${prefix}casinos-and-betting/index.html`,updatePampasCatalog]]){
      const url=new URL(file,root),before=fs.readFileSync(url,'utf8'),after=update(before,locale);
      if(before!==after){changed++;if(!check)fs.writeFileSync(url,after);}
    }
    if(locale!=='en'){
      const file=new URL(`scripts/brand-bonus-translations/${locale}.js`,root),before=fs.readFileSync(file,'utf8');
      const data=JSON.parse(before.slice(before.indexOf('export default ')+15).replace(/;\s*$/,''));
      delete data[oldBonus];data[brand.bonus]=PAMPAS_COPY[locale].short;
      const after='// Generated by tools/sync-brand-bonus-translations.mjs. Do not edit manually.\nexport default '+JSON.stringify(data,null,2)+';\n';
      if(before!==after){changed++;if(!check)fs.writeFileSync(file,after);}
    }
  }
  console.log(`${check?'Pending':'Updated'} Pampas files: ${changed}`);if(check&&changed)process.exitCode=1;
}
