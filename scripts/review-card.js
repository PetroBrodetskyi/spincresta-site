export function createReviewCard(brand, { normalizeText, brandPagePath, normalizeAssetPath, setBrandBackground, localeText }) {
  const name = normalizeText(brand.name);
  const link = document.createElement('a');
  link.className = 'home-new-review-card';
  link.href = brandPagePath(brand);
  link.setAttribute('aria-label', localeText(
    `Read the ${name} review`,
    `${name} Test lesen`,
    `Leer la reseña de ${name}`,
    `Leggi la recensione di ${name}`,
    `Przeczytaj recenzję ${name}`,
    `Прочитати огляд ${name}`,
    `Ler a avaliação de ${name}`,
    `Lire l’avis sur ${name}`,
    `${name} की समीक्षा पढ़ें`,
    `Lue ${name}-arvostelu`
  ));

  const logo = document.createElement('span');
  logo.className = 'home-new-review-logo';
  setBrandBackground(logo, brand.bgColor);
  const image = document.createElement('img');
  image.src = normalizeAssetPath(brand.image);
  image.alt = '';
  image.loading = 'lazy';
  image.decoding = 'async';
  logo.append(image);

  const title = document.createElement('strong');
  title.textContent = name;
  link.append(logo, title);
  return link;
}
