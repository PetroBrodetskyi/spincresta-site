// Standard brand-review components, matching the OnlyWin/Spinrise source markup.
export { reviewProviderStrip } from '../scripts/pages/brand-provider-strip.js';
export const escapeReview = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export const reviewCards = (rows, {comparison=false}={}) => `<div class="features-grid premium-grid${comparison?' pros-cons-grid':''}">${rows.map(([title,paragraphs],i)=>`<div class="feature-card glass-card${comparison?(i===0?' is-pros-card':' is-cons-card'):''}"><strong>${escapeReview(title)}</strong>${(Array.isArray(paragraphs)?paragraphs:[paragraphs]).map(text=>`<span>${comparison?'- ':''}${escapeReview(text)}</span>`).join('<br />')}</div>`).join('')}</div>`;
export const reviewTable = (headers, rows) => {
  if(headers.length!==3 || rows.some(row=>row.length!==3))throw Error('Review tables require area, finding and condition');
  return `<div class="table-wrap"><table><thead><tr>${headers.map((text,i)=>`<th scope="col"${i===0?' style="width: 18%"':''}>${escapeReview(text)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(text=>`<td>${escapeReview(text)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
};
