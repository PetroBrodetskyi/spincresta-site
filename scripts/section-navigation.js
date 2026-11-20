export function initSectionNavigation(root, { name, resolve, focusTarget, revealOnSelect = false, linkShortcuts = false } = {}) {
  const menu = root?.querySelector('.account-menu');
  if (!menu || menu.hasAttribute('data-section-navigation-ready')) return;
  const win = root.ownerDocument.defaultView;
  if (!win) return;
  const navAttribute = `data-${name}-nav`;
  const panelAttribute = `data-${name}-panel`;
  const links = [...menu.querySelectorAll(`[${navAttribute}]`)];
  const panels = [...root.querySelectorAll(`[${panelAttribute}]`)];
  const keys = new Set(links.map(link => link.getAttribute(navAttribute)));
  if (!keys.size) return;
  const resolveHash = resolve || (hash => {
    const key = hash.slice(1);
    return keys.has(key) ? key : keys.values().next().value;
  });
  menu.setAttribute('data-section-navigation-ready', '');

  const show = (focus = false) => {
    const section = resolveHash(win.location.hash);
    root.setAttribute(`data-${name}-active`, section);
    for (const link of links) {
      if (link.getAttribute(navAttribute) === section) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
    for (const panel of panels) panel.hidden = panel.getAttribute(panelAttribute) !== section;
    if (focus) {
      const panel = panels.find(item => item.getAttribute(panelAttribute) === section);
      const heading = (focusTarget ? focusTarget(section, panel) : panel)?.querySelector('h2');
      heading?.focus({ preventScroll: true });
      if (heading && revealOnSelect) {
        const headerBottom = root.ownerDocument.querySelector('.header')?.getBoundingClientRect().bottom || 0;
        const { top, bottom } = heading.getBoundingClientRect();
        if (top < headerBottom || bottom > win.innerHeight) panel?.scrollIntoView({ block: 'start' });
      }
    }
  };

  const linkSelector = linkShortcuts ? `[${navAttribute}], [data-${name}-jump]` : `[${navAttribute}]`;
  (linkShortcuts ? root : menu).addEventListener('click', event => {
    const link = event.target.closest(linkSelector);
    if (!link || !keys.has(link.hash.slice(1)) || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (win.location.hash !== link.hash) win.history.pushState(null, '', link.hash);
    show(true);
  });
  win.addEventListener('hashchange', () => show());
  show();
}
