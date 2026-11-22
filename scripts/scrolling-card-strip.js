import { siteIconMarkup } from './site-icons.js?v=20261122-compact-reviews';

const HOME_GAMES_PX_PER_SECOND = 24;
const HOME_GAMES_SCROLL_IDLE_MS = 950;

export const advanceHomeGames = (position, elapsed, distance) =>
  distance > 0 ? (position + Math.min(elapsed, 64) * HOME_GAMES_PX_PER_SECOND / 1000) % distance : 0;

export const bindMovingCardStrip = ({ grid, toolbar, id, headingId, localeText, labels }) => {
  const cards = [...grid?.children || []];
  if (!toolbar || cards.length < 2 || grid.hasAttribute('data-moving-strip') ||
      !window.IntersectionObserver || !window.ResizeObserver) return;

  grid.dataset.movingStrip = '';
  grid.id = id;
  grid.tabIndex = 0;
  grid.setAttribute('role', 'group');
  grid.setAttribute('aria-labelledby', headingId);
  toolbar.classList.add('home-games-toolbar');

  const pauseLabel = localeText(
    'Pause', 'Pause', 'Pausar', 'Pausa', 'Pauza', 'Пауза',
    'Pausar', 'Pause', 'रोकें', 'Tauko'
  );
  const resumeLabel = localeText(
    'Resume', 'Fortsetzen', 'Reanudar', 'Riprendi', 'Wznów', 'Продовжити',
    'Retomar', 'Reprendre', 'फिर शुरू करें', 'Jatka'
  );
  const previousLabel = labels?.previous ?? localeText(
    'Previous games', 'Vorherige Spiele', 'Juegos anteriores', 'Giochi precedenti', 'Poprzednie gry',
    'Попередні ігри', 'Jogos anteriores', 'Jeux précédents', 'पिछले गेम', 'Edelliset pelit'
  );
  const nextLabel = labels?.next ?? localeText(
    'Next games', 'Nächste Spiele', 'Juegos siguientes', 'Giochi successivi', 'Kolejne gry',
    'Наступні ігри', 'Próximos jogos', 'Jeux suivants', 'अगले गेम', 'Seuraavat pelit'
  );
  const controls = document.createElement('div');
  controls.className = 'home-games-controls';
  const button = (className, symbol, label) => {
    const control = document.createElement('button');
    control.type = 'button';
    control.className = `home-games-control ${className}`;
    control.setAttribute('aria-controls', grid.id);
    if (label) {
      control.setAttribute('aria-label', label);
      control.title = label;
    }
    if (symbol) {
      const icon = document.createElement('span');
      icon.className = 'home-games-control-icon';
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = symbol;
      control.append(icon);
    }
    return control;
  };
  const toggle = button('home-games-motion-toggle');
  const previous = button('home-games-arrow', '‹', previousLabel);
  const next = button('home-games-arrow', '›', nextLabel);
  controls.append(toggle, previous, next);
  toolbar.append(controls);

  // A second pass keeps the seam invisible. Only the original links are tabbable.
  const copies = cards.map(card => {
    const copy = card.cloneNode(true);
    copy.setAttribute('aria-hidden', 'true');
    copy.tabIndex = -1;
    copy.hidden = true;
    return copy;
  });
  grid.append(...copies);

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  let inView = false;
  let pausedByUser = false;
  let hovering = false;
  let focused = false;
  let settlingTimer = 0;
  const activePointers = new Set();
  let distance = 0;
  let cardStep = 0;
  let position = 0;
  let raf = 0;
  let previousTime = 0;

  const move = time => {
    position = advanceHomeGames(position, previousTime ? time - previousTime : 0, distance);
    previousTime = time;
    grid.scrollLeft = position;
    raf = requestAnimationFrame(move);
  };
  const syncMotion = () => {
    const active = distance && inView && !pausedByUser && !hovering && !focused &&
      !settlingTimer && !activePointers.size && !document.hidden;
    if (active && !raf) {
      position = grid.scrollLeft;
      raf = requestAnimationFrame(move);
    } else if (!active && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
      previousTime = 0;
    }
  };
  const setPaused = value => {
    pausedByUser = value;
    toggle.setAttribute('aria-label', pausedByUser ? resumeLabel : pauseLabel);
    toggle.innerHTML = siteIconMarkup(pausedByUser ? 'play' : 'pause', 'site-icon', 18);
    syncMotion();
  };
  const waitForScrollIdle = () => {
    clearTimeout(settlingTimer);
    settlingTimer = window.setTimeout(() => {
      settlingTimer = 0;
      syncMotion();
    }, HOME_GAMES_SCROLL_IDLE_MS);
    syncMotion();
  };
  const syncArrows = () => {
    previous.disabled = !distance && grid.scrollLeft < 1;
    next.disabled = !distance && grid.scrollLeft + grid.clientWidth >= grid.scrollWidth - 1;
  };
  const measure = () => {
    const first = cards[0].getBoundingClientRect();
    const width = cards.at(-1).getBoundingClientRect().right - first.left;
    const gap = parseFloat(getComputedStyle(grid).columnGap) || 0;
    const hasOverflow = width > grid.clientWidth + 1;
    distance = !reduced.matches && hasOverflow ? width + gap : 0;
    cardStep = first.width + gap;
    copies.forEach(copy => { copy.hidden = !distance; });
    toggle.hidden = !distance;
    controls.hidden = !hasOverflow;
    grid.tabIndex = hasOverflow ? 0 : -1;
    if (distance && grid.scrollLeft >= distance) grid.scrollLeft %= distance;
    position = grid.scrollLeft;
    syncArrows();
    syncMotion();
  };

  const stepByCard = direction => {
    waitForScrollIdle();
    if (distance) {
      const offset = grid.scrollLeft % distance;
      grid.scrollLeft = offset + (offset + direction * cardStep < 0 ? distance : 0);
    }
    grid.scrollBy({ left: direction * cardStep, behavior: reduced.matches ? 'auto' : 'smooth' });
  };
  toggle.addEventListener('click', () => setPaused(!pausedByUser));
  previous.addEventListener('click', () => stepByCard(-1));
  next.addEventListener('click', () => stepByCard(1));
  // A vertical scroll can move the row under a stationary pointer without intent to hover.
  grid.addEventListener('pointermove', event => {
    if (hovering || event.pointerType !== 'mouse' || !(event.movementX || event.movementY)) return;
    hovering = true;
    syncMotion();
  });
  grid.addEventListener('pointerleave', () => { hovering = false; syncMotion(); });
  grid.addEventListener('focusin', () => { focused = true; syncMotion(); });
  grid.addEventListener('focusout', event => {
    focused = grid.contains(event.relatedTarget);
    syncMotion();
  });
  grid.addEventListener('keydown', event => {
    if (event.target !== grid || controls.hidden || !['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    stepByCard(event.key === 'ArrowLeft' ? -1 : 1);
  });
  grid.addEventListener('pointerdown', event => {
    activePointers.add(event.pointerId);
    syncMotion();
  }, { passive: true });
  const finishGesture = event => {
    if (activePointers.delete(event.pointerId)) waitForScrollIdle();
  };
  window.addEventListener('pointerup', finishGesture, { passive: true });
  window.addEventListener('pointercancel', finishGesture, { passive: true });
  window.addEventListener('blur', () => {
    activePointers.clear();
    hovering = false;
    syncMotion();
  });
  grid.addEventListener('wheel', event => {
    if (event.deltaX || (event.shiftKey && event.deltaY)) waitForScrollIdle();
  }, { passive: true });
  grid.addEventListener('scroll', () => {
    if (settlingTimer) waitForScrollIdle();
    if (!distance) syncArrows();
  }, { passive: true });
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', measure);
  new ResizeObserver(measure).observe(grid);
  new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    syncMotion();
  }).observe(grid);

  setPaused(false);
  measure();
};
