// The copy stays in the original markup and is always readable without JS.
export function bindMobileEditorialCards(cards, { idPrefix, labels }) {
  cards.forEach((card, index) => {
    if (card.dataset.mobileAccordionReady === 'true') return;
    const heading = card.querySelector(':scope > h3');
    if (!heading) return;

    const copy = [];
    for (let node = heading.nextElementSibling; node; node = node.nextElementSibling) copy.push(node);
    if (!copy.length) return;

    heading.id ||= `${idPrefix}-heading-${index + 1}`;
    copy.forEach((node, part) => {
      node.id ||= `${idPrefix}-copy-${index + 1}-${part + 1}`;
      node.dataset.editorialCopy = '';
    });

    const toggle = card.ownerDocument.createElement('button');
    toggle.type = 'button';
    toggle.className = 'home-method-toggle';
    toggle.setAttribute('aria-controls', copy.map(node => node.id).join(' '));
    toggle.setAttribute('aria-labelledby', heading.id);
    toggle.innerHTML = '<span aria-hidden="true"></span>';

    const setExpanded = expanded => {
      card.classList.toggle('is-mobile-expanded', expanded);
      toggle.setAttribute('aria-expanded', String(expanded));
      toggle.title = expanded ? labels.expanded : labels.collapsed;
    };
    toggle.addEventListener('click', () => setExpanded(toggle.getAttribute('aria-expanded') !== 'true'));
    card.append(toggle);
    card.dataset.mobileAccordionReady = 'true';
    setExpanded(false);
  });
}
