const FAQ_TITLE = /\bfaqs?\b|häufig(?:e| gestellte) fragen|preguntas? frecuentes|(?:perguntas?|dúvidas?) frequentes|\bq\s*&\s*a\b|\bquestions?\b|domande|pytani[ae]|питан|\bukk\b|usein kysytt|kysymy|सवाल|प्रश्न/iu;

export function isFaqSection(id, title) {
  return /(?:^|-)faq(?:-|$)/i.test(id) || FAQ_TITLE.test(title);
}

const getGridEntries = grid => [...grid.children].map(card => {
  const question = card.querySelector(':scope > h3');
  const answers = [...card.childNodes].filter(node => node !== question);
  return card.matches('.faq-card') && question && answers.some(node => node.nodeType === 1)
    ? { card, question, answers }
    : null;
});

const getTimelineEntries = timeline => {
  const entries = [];
  for (const node of timeline.children) {
    if (node.matches('h3')) entries.push({ question: node, answers: [] });
    else if (entries.length && node.matches('p, ul, ol, div, blockquote')) entries.at(-1).answers.push(node);
    else return [];
  }
  return entries;
};

export function getFaqTabIndex(key, index, count) {
  if (key === 'Home') return 0;
  if (key === 'End') return count - 1;
  if (key === 'ArrowDown') return (index + 1) % count;
  if (key === 'ArrowUp') return (index - 1 + count) % count;
  return -1;
}

function initResponsiveFaq(doc, container, heading, items, groupName) {
  const wide = doc.defaultView?.matchMedia('(min-width: 900px)');
  if (!wide) return;

  const tabList = doc.createElement('div');
  tabList.className = 'site-faq-tabs';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-labelledby', heading.id);
  tabList.setAttribute('aria-orientation', 'vertical');
  const answerArea = doc.createElement('div');
  answerArea.className = 'site-faq-panels';

  const entries = items.map((details, index) => {
    const summary = details.firstElementChild;
    const answer = details.lastElementChild;
    const tab = doc.createElement('button');
    tab.className = 'site-faq-tab';
    tab.type = 'button';
    tab.id = `${groupName}-tab-${index + 1}`;
    tab.setAttribute('role', 'tab');
    const label = summary.textContent.trim();
    tab.textContent = label;

    const panel = doc.createElement('div');
    panel.className = 'site-faq-panel';
    panel.id = `${groupName}-panel-${index + 1}`;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tab.id);
    panel.tabIndex = 0;
    panel.hidden = true;
    tab.setAttribute('aria-controls', panel.id);
    const title = doc.createElement('h3');
    title.textContent = label;
    panel.append(title);
    tabList.append(tab);
    answerArea.append(panel);
    return { details, summary, answer, tab, panel };
  });

  let selected = 0;
  let split = false;
  const select = index => {
    selected = index;
    entries.forEach(({ tab, panel }, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panel.hidden = !active;
    });
  };

  entries.forEach(({ tab }, index) => {
    tab.addEventListener('click', () => select(index));
    tab.addEventListener('keydown', event => {
      const next = getFaqTabIndex(event.key, index, entries.length);
      if (next < 0) return;
      event.preventDefault();
      select(next);
      entries[next].tab.focus();
    });
  });

  const syncLayout = () => {
    if (split === wide.matches) return;
    const previousFocus = doc.activeElement;
    const focusEntry = entries.findIndex(({ details, tab, panel }) =>
      details.contains(previousFocus) || tab === previousFocus || panel.contains(previousFocus));
    const answerFocused = focusEntry >= 0 && entries[focusEntry].answer.contains(previousFocus);
    split = wide.matches;
    if (split) {
      const open = items.findIndex(item => item.open);
      select(focusEntry >= 0 ? focusEntry : open >= 0 ? open : selected);
      entries.forEach(({ panel, answer }) => panel.append(answer));
      container.replaceChildren(tabList, answerArea);
    } else {
      entries.forEach(({ details, answer }, index) => {
        details.open = index === selected;
        details.append(answer);
      });
      container.replaceChildren(...items);
    }
    container.classList.toggle('site-faq-list--split', split);
    if (focusEntry >= 0) {
      const { tab, summary } = entries[focusEntry];
      (answerFocused ? previousFocus : split ? tab : summary).focus({ preventScroll: true });
    }
  };
  syncLayout();
  wide.addEventListener('change', syncLayout);
}

export function initFaqSections(doc = document) {
  let groupIndex = doc.querySelectorAll('.site-faq-list').length;
  for (const container of doc.querySelectorAll('main .faq-grid, body[data-brand] .content-review > section > .timeline')) {
    const content = container.parentElement;
    const section = content.closest('section');
    const heading = content.querySelector(':scope > h2, :scope > .home-showcase-heading h2');
    if (!section || !heading) continue;
    const isPartnerFaq = doc.body.dataset.page === 'partners' &&
      section.matches('.content-area > .home-showcase-section:last-child');
    if (!isPartnerFaq && !isFaqSection(section.id, `${section.getAttribute('aria-labelledby') || ''} ${heading.textContent}`)) continue;

    const entries = container.classList.contains('timeline')
      ? getTimelineEntries(container)
      : getGridEntries(container);
    if (!entries.length || entries.some(entry => !entry?.answers.length)) continue;
    const groupName = `site-faq-${++groupIndex}`;
    if (!heading.id) heading.id = `${groupName}-title`;
    if (!section.hasAttribute('aria-labelledby')) section.setAttribute('aria-labelledby', heading.id);

    const items = entries.map(({ card, question, answers }) => {
      const details = doc.createElement('details');
      details.className = 'site-faq-item';
      details.setAttribute('name', groupName);
      if (card?.id) details.id = card.id;
      const summary = doc.createElement('summary');
      if (question.id) summary.id = question.id;
      const label = doc.createElement('span');
      label.append(...question.childNodes);
      summary.append(label);
      const answer = doc.createElement('div');
      answer.className = 'site-faq-answer';
      answer.append(...answers);
      details.append(summary, answer);
      return details;
    });
    container.classList.remove('faq-grid', 'timeline');
    container.classList.add('site-faq-list');
    container.replaceChildren(...items);
    content.classList.add('site-faq-content');
    section.classList.add('site-faq-section');
    if (!doc.body.hasAttribute('data-brand')) initResponsiveFaq(doc, container, heading, items, groupName);
  }
}
