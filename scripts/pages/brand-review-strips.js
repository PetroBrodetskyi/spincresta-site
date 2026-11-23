import { bindManualCardStrip } from '../scrolling-card-strip.js?v=20261123-provider-strip';
import { classifyReviewSection, reviewSectionLabel } from './brand-review-order.js?v=20261123-single-row';

export function initBrandReviewStrips(main, localeText) {
  if (!main) return;
  const doc = main.ownerDocument;
  const previous = localeText('Previous card', 'Vorherige Karte', 'Ficha anterior', 'Scheda precedente', 'Poprzednia karta',
    'Попередня картка', 'Cartão anterior', 'Carte précédente', 'पिछला कार्ड', 'Edellinen kortti');
  const next = localeText('Next card', 'Nächste Karte', 'Ficha siguiente', 'Scheda successiva', 'Następna karta',
    'Наступна картка', 'Cartão seguinte', 'Carte suivante', 'अगला कार्ड', 'Seuraava kortti');
  const addStrip = (section, kind) => {
    if (section.hasAttribute('data-review-strip')) return;
    const heading = section.querySelector(':scope > :is(h2, .title), :scope > .brand-why-heading > .title');
    const grid = section.querySelector(':scope > :is(.features-grid, .premium-grid, .pros-cons-grid)');
    if (!heading || !grid?.firstElementChild) return;

    if (kind === 'highlights') {
      const label = reviewSectionLabel(kind, localeText);
      if (heading.textContent.trim() !== label) heading.textContent = label;
      section.dataset.reviewSection = kind;
    }
    section.dataset.reviewStrip = kind;
    grid.classList.add('brand-review-strip');
    const base = 'brand-' + kind + '-strip';
    let id = base;
    let count = 2;
    while (doc.getElementById(id)) id = base + '-' + count++;
    heading.id ||= id + '-title';
    grid.id ||= id;
    grid.setAttribute('role', 'group');
    grid.setAttribute('aria-labelledby', heading.id);
    if (grid.children.length < 2) return;

    const controls = doc.createElement('div');
    controls.className = 'home-games-controls brand-review-strip-controls';
    controls.hidden = true;
    const button = (direction, label, icon) => {
      const el = doc.createElement('button');
      el.type = 'button';
      el.className = 'home-games-control home-games-arrow';
      el.setAttribute('data-strip-' + direction, '');
      el.setAttribute('aria-label', label);
      el.setAttribute('aria-controls', grid.id);
      const symbol = doc.createElement('span');
      symbol.className = 'home-games-control-icon';
      symbol.setAttribute('aria-hidden', 'true');
      symbol.textContent = icon;
      el.append(symbol);
      return el;
    };
    controls.append(button('previous', previous, '‹'), button('next', next, '›'));
    grid.before(controls);
    bindManualCardStrip({ grid, controls });
  };

  main.querySelectorAll('#brand-why-section, .brand-hero-why, :scope > section.features-section')
    .forEach(section => addStrip(section, 'highlights'));
  main.querySelectorAll('section:is([data-review-section="pros"], [data-review-section="suitability"]), :scope > section.container')
    .forEach(section => {
      const kind = classifyReviewSection({
        id: section.id, kind: section.dataset.reviewSection,
        heading: section.querySelector(':scope > :is(h2, .title)')?.textContent,
      });
      if (kind !== 'pros' && kind !== 'suitability') return;
      if (!section.querySelector(':scope > :is(.features-grid, .premium-grid, .pros-cons-grid) > .feature-card')) return;
      section.dataset.reviewSection = kind;
      addStrip(section, kind);
    });
}
