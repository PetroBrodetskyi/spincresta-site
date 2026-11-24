// Standard brand-review components, matching the OnlyWin/Spinrise source markup.
export { reviewProviderStrip } from '../scripts/pages/brand-provider-strip.js';
export const escapeReview = value => String(value).replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
// The same wrapper the runtime builds for Countries and Payment Methods.
// The country block also uses it when no verified payment methods are available.
export const reviewCountries = ({ heading, countries, payments }) => {
  if (!countries.length) return '';
  const links = countries.map(({ name, href, flag, label = name }) =>
    `<a class="flag-container" href="${escapeReview(href)}" aria-label="${escapeReview(label)}"><img class="hero-flag" src="${escapeReview(flag)}" alt="" loading="lazy" decoding="async" /><span>${escapeReview(name)}</span></a>`,
  ).join('');
  const icons = (payments?.methods || []).filter(Boolean).map(method =>
    `<div class="payments"><img src="/icons/payments/${escapeReview(method)}.svg" alt="${escapeReview(method)}" loading="lazy" decoding="async" /></div>`,
  ).join('');
  const paymentBlock = icons
    ? `<div class="brand-payments" data-review-section="methods"><h2 class="title">${escapeReview(payments.heading)}</h2><div class="payments-container" id="brand-payments">${icons}</div></div>`
    : '';
  return `<section class="container brand-info-pair"><div class="brand-countries" data-review-section="countries"><h2 class="title">${escapeReview(heading)}</h2><div class="countries-container" id="brand-countries">${links}</div></div>${paymentBlock}</section>`;
};
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
