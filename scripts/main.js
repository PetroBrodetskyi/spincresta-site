import { BRANDS } from "./brands.js";

/* =====================
   BRANDS RENDER
===================== */

const container = document.querySelector("#brand-cards");
const template = document.querySelector("#casino-card-template");

if (container && template) {
  const fragment = document.createDocumentFragment();
  const pageCountry = document.body.dataset.country;

  const filteredBrands = BRANDS.filter(brand =>
    brand.countries.includes(pageCountry)
  );

  filteredBrands.forEach(
    ({ name, bonus, cta, urlDetail, urlCasino, image }) => {
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
      link.rel = "noopener noreferrer";

      article.addEventListener("click", () => {
        window.location.href = urlDetail;
      });

      link.addEventListener("click", e => {
        e.stopPropagation();
        window.open(urlCasino, "_blank", "noopener");
      });

      fragment.appendChild(card);
    }
  );

  container.append(fragment);
}

/* =====================
   BURGER MENU (MOBILE)
===================== */

const burger = document.querySelector(".burger");
const mobileMenu = document.getElementById("mobileMenu");

if (burger && mobileMenu) {
  burger.addEventListener("click", () => {
    burger.classList.toggle("active");
    mobileMenu.classList.toggle("open");
  });

  mobileMenu.addEventListener("click", e => {
    if (e.target === mobileMenu) {
      burger.classList.remove("active");
      mobileMenu.classList.remove("open");
    }
  });
}
