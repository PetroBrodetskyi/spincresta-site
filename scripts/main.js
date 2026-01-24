import { BRANDS } from './brands.js';

const container = document.querySelector("#brand-cards");
const template = document.querySelector("#casino-card-template");
const fragment = document.createDocumentFragment();

BRANDS.forEach(({ name, bonus, cta, urlDetail, urlCasino, image }) => {
  const card = template.content.cloneNode(true);
  const article = card.querySelector(".casino-card");
  const img = card.querySelector(".casino-image");
  const title = card.querySelector(".casino-name");
  const bonusText = card.querySelector(".casino-bonus");
  const link = card.querySelector(".cta");

  img.src = image;
  img.alt = name;

  title.textContent = name;
  bonusText.textContent = bonus;

  link.textContent = cta;
  link.href = urlCasino;
  link.target = "_blank";

  article.addEventListener("click", () => {
    window.location.href = urlDetail;
  });

  link.addEventListener("click", e => {
    e.stopPropagation();
    window.open(urlCasino, "_blank");
  });

  fragment.appendChild(card);
});

container.append(fragment);
