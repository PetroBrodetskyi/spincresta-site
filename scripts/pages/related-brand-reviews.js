import { bindMovingCardStrip } from '../scrolling-card-strip.js?v=20261122-compact-reviews';
import { createReviewCard } from '../review-card.js?v=20261122-compact-reviews';
import { siteIconMarkup } from '../site-icons.js?v=20261122-compact-reviews';

const marketsOf = brand => new Set((brand?.countries || []).map(code => code.toUpperCase()));

export function relatedBrandReviews(brand, brands, getSlug) {
  const markets = marketsOf(brand);
  const current = getSlug(brand);
  if (!current || !markets.size) return [];
  const seen = new Set([current]);
  return brands.flatMap(candidate => {
    const slug = getSlug(candidate);
    if (!slug || seen.has(slug) || !candidate.hasDetailPage || !candidate.image ||
        candidate.reviewComingSoon || candidate.notRecommended || candidate.temporarilyUnavailable) return [];
    const overlap = [...marketsOf(candidate)].filter(code => markets.has(code)).length;
    if (!overlap) return [];
    seen.add(slug);
    return [{ candidate, overlap }];
  }).sort((a, b) => b.overlap - a.overlap).slice(0, 24).map(({ candidate }) => candidate);
}

export function initRelatedBrandReviews(context) {
  const { brand, brands, localeText, getBrandDetailSlug } = context;
  const reviews = document.querySelector('body[data-brand] .content-review > #player-reviews');
  if (!brand || brand.reviewComingSoon || !reviews || document.getElementById('related-brand-reviews')) return;
  const related = relatedBrandReviews(brand, brands, getBrandDetailSlug);
  if (!related.length) return;

  const section = document.createElement('section');
  section.id = 'related-brand-reviews';
  section.className = 'container brand-related-reviews';
  section.setAttribute('aria-labelledby', 'related-brand-reviews-title');
  section.innerHTML = '<div class="home-games-toolbar"><h2 id="related-brand-reviews-title" class="title"></h2></div><div class="home-games-grid home-new-reviews-grid"></div>';
  const heading = section.querySelector('h2');
  heading.innerHTML = siteIconMarkup('review', 'site-icon site-icon--heading', 22);
  heading.append(localeText(
    'Other casinos in these markets', 'Weitere Casinos für diese Länder', 'Otros casinos en estos mercados',
    'Altri casinò in questi mercati', 'Inne kasyna na tych rynkach', 'Інші казино для цих країн',
    'Outros casinos nestes mercados', 'Autres casinos sur ces marchés', 'इन बाज़ारों के अन्य कैसीनो',
    'Muita kasinoita näissä maissa'
  ));
  const grid = section.querySelector('.home-games-grid');
  grid.append(...related.map(candidate => createReviewCard(candidate, context)));
  reviews.after(section);
  bindMovingCardStrip({
    grid,
    toolbar: section.querySelector('.home-games-toolbar'),
    id: 'related-brand-reviews-strip',
    headingId: heading.id,
    localeText,
    labels: {
      previous: localeText('Previous brands', 'Vorherige Anbieter', 'Marcas anteriores', 'Marchi precedenti', 'Poprzednie marki', 'Попередні бренди', 'Marcas anteriores', 'Marques précédentes', 'पिछले ब्रांड', 'Edelliset brändit'),
      next: localeText('Next brands', 'Nächste Anbieter', 'Marcas siguientes', 'Marchi successivi', 'Następne marki', 'Наступні бренди', 'Próximas marcas', 'Marques suivantes', 'अगले ब्रांड', 'Seuraavat brändit'),
    },
  });
}
