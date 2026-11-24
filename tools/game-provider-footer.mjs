import { siteIconMarkup } from '../scripts/site-icons.js';
import { escapeReview } from './brand-review-template.mjs';
import { directoryCopy } from './game-provider-directory-copy.mjs';

export function syncGameProviderFooter(html) {
  const lang = html.match(/<html\b[^>]*\blang="([a-z]{2})(?:-[^"]+)?"/i)?.[1].toLowerCase() || 'en';
  const locale = Object.hasOwn(directoryCopy, lang) ? lang : 'en';
  const prefix = locale === 'en' ? '/' : `/${locale}/`;
  const icon = siteIconMarkup('layers', 'site-icon site-icon--inline');
  const link = `<a href="${prefix}game-providers/">${icon} ${escapeReview(directoryCopy[locale].title)}</a>`;
  return html.replace(/<nav class="footer-nav">[\s\S]*?<\/nav>/g, nav => {
    const clean = nav.replace(/\r?\n[\t ]*<a href="\/(?:[a-z]{2}\/)?game-providers\/">[\s\S]*?<\/a>/g, '');
    const payment = /(\r?\n)([\t ]*)(<a href="\/(?:[a-z]{2}\/)?payment-methods\/">[\s\S]*?<\/a>)/;
    if (!payment.test(clean)) return clean.replace('>', `>\n          ${link}`);
    return clean.replace(payment, (match, newline, indent) => match + newline + indent + link);
  });
}
