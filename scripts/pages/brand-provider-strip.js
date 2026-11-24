import { getReviewProviders } from '../brand-review-providers.js?v=20261124-provider-art';
import { providerLogoPath } from '../provider-logo-library.js?v=20261124-provider-art';
import { siteIconMarkup } from '../site-icons.js?v=20261123-brand-providers';
import { bindManualCardStrip } from '../scrolling-card-strip.js?v=20261123-provider-strip';
import { reviewSectionLabel } from './brand-review-order.js?v=20261123-provider-strip';
import { providerDirectoryKey } from '../provider-directory-key.js';

const escape = value => String(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');

export function reviewProviderStrip({ id, heading, providers, previous, next, empty = '' }) {
  if (!/^[a-z0-9-]+$/.test(id)) throw new Error(`Invalid provider section ID: ${id}`);
  const stripId = `${id}-strip`;
  const control = (direction, label, icon) =>
    `<button class="home-games-control home-games-arrow" type="button" data-strip-${direction} aria-controls="${stripId}" aria-label="${escape(label)}"><span class="home-games-control-icon" aria-hidden="true">${icon}</span></button>`;
  const headingMarkup = `<h2 id="${id}-title" class="title">${siteIconMarkup('layers', 'site-icon site-icon--heading')} ${escape(heading)}</h2>`;
  const cards = providers.map(([name, slug]) => {
    if (slug !== null && !/^[a-z0-9-]+$/.test(slug)) throw new Error(`Invalid provider logo name: ${slug}`);
    const path = providerLogoPath(slug);
    if (slug && !path) throw new Error(`Unregistered provider logo: ${slug}`);
    const logo = slug
      ? `<img src="${path}" alt="" width="96" height="36" loading="lazy" decoding="async" />`
      : siteIconMarkup('layers');
    return `<li><span class="review-provider-logo">${logo}</span><span>${escape(name)}</span></li>`;
  }).join('');
  const content = cards
    ? `<div class="home-games-controls" data-strip-controls hidden>${control('previous', previous, '‹')}${control('next', next, '›')}</div><ul id="${stripId}" class="review-provider-strip" role="list" aria-labelledby="${id}-title">${cards}</ul>`
    : `<p class="review-providers__empty">${escape(empty)}</p>`;
  return `<section id="${id}" class="container review-providers home-new-reviews-grid" data-review-section="providers" aria-labelledby="${id}-title">${headingMarkup}${content}</section>`;
}

export function isPublishedBrandReview(brand) {
  return Boolean(brand?.hasDetailPage && !brand.reviewComingSoon && /^brands\/[a-z0-9-]+\.html$/.test(brand.urlDetail || ''));
}

export function insertBrandProviderSection({ article, brand, localeText }) {
  if (!article || !isPublishedBrandReview(brand) || article.querySelector('.review-providers')) return;
  const slug = brand.urlDetail.slice(7, -5);
  article.insertAdjacentHTML('beforeend', reviewProviderStrip({
    id: `${slug}-providers`,
    heading: reviewSectionLabel('providers', localeText),
    providers: brand.notRecommended || brand.temporarilyUnavailable ? [] : getReviewProviders(slug),
    previous: localeText('Previous providers', 'Vorherige Anbieter', 'Proveedores anteriores', 'Fornitori precedenti', 'Poprzedni dostawcy', 'Попередні провайдери', 'Fornecedores anteriores', 'Fournisseurs précédents', 'पिछले प्रदाता', 'Edelliset pelintarjoajat'),
    next: localeText('Next providers', 'Nächste Anbieter', 'Siguientes proveedores', 'Fornitori successivi', 'Następni dostawcy', 'Наступні провайдери', 'Próximos fornecedores', 'Fournisseurs suivants', 'अगले प्रदाता', 'Seuraavat pelintarjoajat'),
    empty: localeText(
      'We haven’t confirmed a list of game providers for this casino.',
      'Für dieses Casino liegt keine bestätigte Anbieterliste vor.',
      'No hemos confirmado una lista de proveedores para este casino.',
      'Non abbiamo confermato un elenco dei fornitori per questo casinò.',
      'Nie potwierdziliśmy listy dostawców gier dla tego kasyna.',
      'Ми не підтвердили список провайдерів ігор для цього казино.',
      'Não confirmámos uma lista de fornecedores para este casino.',
      'Nous n’avons pas confirmé la liste des fournisseurs de ce casino.',
      'हमने इस कैसीनो के गेम प्रदाताओं की सूची की पुष्टि नहीं की है।',
      'Tämän kasinon pelintarjoajien luetteloa ei ole vahvistettu.'
    ),
  }));
}

export function initBrandProviderStrips(root = document) {
  const strips = [...root.querySelectorAll('.review-providers')];
  strips.forEach(section => bindManualCardStrip({
    grid: section.querySelector('.review-provider-strip'),
    controls: section.querySelector('[data-strip-controls]'),
  }));
  if (!strips.length) return;
  import('../provider-directory-index.js?v=20261124-game-providers').then(({ providerDirectoryIndex }) => {
    for (const section of strips) {
      const doc = section.ownerDocument;
      const lang = doc.body.dataset.language || doc.documentElement.lang.split('-')[0] || 'en';
      const directory = lang === 'en' ? '/game-providers/' : `/${lang}/game-providers/`;
      for (const card of section.querySelectorAll('.review-provider-strip > li')) {
        const label = card.querySelector(':scope > span:last-child');
        if (!label || card.querySelector('a')) continue;
        const name = providerDirectoryKey(label.textContent);
        if (!Object.hasOwn(providerDirectoryIndex, name)) continue;
        const link = doc.createElement('a');
        link.className = 'review-provider-card-link';
        link.href = directory + '#provider-' + providerDirectoryIndex[name];
        link.append(...card.childNodes);
        card.append(link);
      }
    }
  }).catch(() => { /* Keep the original carousel if the directory index is unavailable. */ });
}
