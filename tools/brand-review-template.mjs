// Standard brand-review components, matching the OnlyWin/Spinrise source markup.
export { reviewProviderStrip } from '../scripts/pages/brand-provider-strip.js';
export const escapeReview = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export const reviewCards = (rows, {comparison=false}={}) => `<div class="features-grid premium-grid${comparison?' pros-cons-grid':''}">${rows.map(([title,paragraphs],i)=>`<div class="feature-card glass-card${comparison?(i===0?' is-pros-card':' is-cons-card'):''}"><strong>${escapeReview(title)}</strong>${(Array.isArray(paragraphs)?paragraphs:[paragraphs]).map(text=>`<span>${comparison?'- ':''}${escapeReview(text)}</span>`).join('<br />')}</div>`).join('')}</div>`;
export const reviewTable = (headers, rows, { rowHeaders = false } = {}) => {
  if (![2, 3].includes(headers.length) || rows.some(row => row.length !== headers.length)) {
    throw Error('Review tables require two or three equally sized columns');
  }
  const width = headers.length === 3 ? 18 : 28;
  const head = headers.map((text, i) => `<th scope="col"${i === 0 ? ` style="width: ${width}%"` : ''}>${escapeReview(text)}</th>`).join('');
  const body = rows.map(row => '<tr>' + row.map((value, i) => rowHeaders && i === 0
    ? `<th scope="row">${escapeReview(value)}</th>`
    : `<td>${escapeReview(value)}</td>`).join('') + '</tr>').join('');
  return `<div class="table-wrap"><table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table></div>`;
};
