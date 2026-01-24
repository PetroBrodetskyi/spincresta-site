const BRANDS = [
  {
    name: "Las Vegas USA",
    bonus: "Up to $1,000 Welcome Bonus",
    cta: "Play at PHJ Casino",
    url: "brands/phj.html",
    image: "images/lasvegas.webp",
  },
  {
    name: "Vegas Online",
    bonus: "Exclusive bonus offers",
    cta: "Visit B Casino",
    url: "brands/b.html",
    image: "images/vegas.webp",
  },
  {
    name: "Slots and Casino",
    bonus: "Fast payouts for US players",
    cta: "Play Now",
    url: "brands/top-slots.html",
    image: "images/slotsandcasino.webp",
  },
  {
    name: "Ducky Luck",
    bonus: "Up to $1,000 Welcome Bonus",
    cta: "Play at PHJ Casino",
    url: "brands/phj.html",
    image: "images/duckyluck.webp",
  },
  {
    name: "Voltage Bet",
    bonus: "Exclusive bonus offers",
    cta: "Visit B Casino",
    url: "brands/b.html",
    image: "images/voltagebet.webp",
  },
  {
    name: "Lucky Red",
    bonus: "Fast payouts for US players",
    cta: "Play Now",
    url: "brands/top-slots.html",
    image: "images/luckyred.webp",
  },
  {
    name: "Shazam",
    bonus: "Up to $1,000 Welcome Bonus",
    cta: "Play at PHJ Casino",
    url: "brands/phj.html",
    image: "images/shazam.webp",
  },
  {
    name: "Lucky Tiger",
    bonus: "Exclusive bonus offers",
    cta: "Visit B Casino",
    url: "brands/b.html",
    image: "images/luckytiger.webp",
  },
  {
    name: "Rich Palps",
    bonus: "Fast payouts for US players",
    cta: "Play Now",
    url: "brands/top-slots.html",
    image: "images/richpalms.webp",
  },
  {
    name: "Lucky Red",
    bonus: "Fast payouts for US players",
    cta: "Play Now",
    url: "brands/top-slots.html",
    image: "images/luckyred.webp",
  },
  {
    name: "Shazam",
    bonus: "Up to $1,000 Welcome Bonus",
    cta: "Play at PHJ Casino",
    url: "brands/phj.html",
    image: "images/shazam.webp",
  },
  {
    name: "Lucky Tiger",
    bonus: "Exclusive bonus offers",
    cta: "Visit B Casino",
    url: "brands/b.html",
    image: "images/luckytiger.webp",
  },
];

const container = document.querySelector("#brand-cards");
const template = document.querySelector("#casino-card-template");

const fragment = document.createDocumentFragment();

BRANDS.forEach(({ name, bonus, cta, url, image }) => {
  const card = template.content.cloneNode(true);

  const img = card.querySelector(".casino-image");
  const title = card.querySelector(".casino-name");
  const bonusText = card.querySelector(".casino-bonus");
  const link = card.querySelector(".cta");

  img.src = image;
  img.alt = name;

  title.textContent = name;
  bonusText.textContent = bonus;

  link.href = url;
  link.textContent = cta;

  fragment.appendChild(card);
});

container.append(fragment);
