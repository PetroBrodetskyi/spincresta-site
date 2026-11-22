export function bindCompactCountryCloud(cloud, localeText) {
  const links = [...cloud.querySelectorAll('.country-link')];
  const extra = links.slice(18);
  if (!extra.length) return { reveal() {} };

  extra.forEach(link => link.classList.add('country-cloud-extra'));
  const showAll = localeText(
    'Show all countries', 'Alle Länder anzeigen', 'Mostrar todos los países',
    'Mostra tutti i paesi', 'Pokaż wszystkie kraje', 'Показати всі країни',
    'Mostrar todos os países', 'Voir tous les pays', 'सभी देश दिखाएँ', 'Näytä kaikki maat'
  );
  const showFewer = localeText(
    'Show fewer countries', 'Weniger Länder anzeigen', 'Mostrar menos países',
    'Mostra meno paesi', 'Pokaż mniej krajów', 'Згорнути список країн',
    'Mostrar menos países', 'Afficher moins de pays', 'कम देश दिखाएँ', 'Näytä vähemmän maita'
  );
  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'country-cloud-toggle';
  toggle.setAttribute('aria-controls', cloud.id);
  const setExpanded = expanded => {
    cloud.classList.toggle('is-collapsed', !expanded);
    toggle.setAttribute('aria-expanded', String(expanded));
    toggle.textContent = expanded ? showFewer : `${showAll} (${links.length})`;
  };
  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') !== 'true';
    setExpanded(expanded);
    if (expanded) extra[0].focus();
  });
  setExpanded(false);
  cloud.after(toggle);

  return {
    reveal(link) {
      if (extra.includes(link)) setExpanded(true);
    },
  };
}
