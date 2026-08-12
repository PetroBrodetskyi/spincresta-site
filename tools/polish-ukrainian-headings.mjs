#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const BRANDS_ROOT = path.join(ROOT, 'uk', 'brands');
const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const textOnly = value => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const extractBrand = html => {
  const breadcrumb = html.match(/"position"\s*:\s*3\s*,\s*"name"\s*:\s*"([^"]+)"/i)?.[1] || '';
  return breadcrumb
    .replace(/^(?:Огляд|Рецензія)\s+/i, '')
    .replace(/\s+(?:Огляд|огляд)(?:\s+казино)?$/i, '')
    .trim();
};

const cleanHeading = (heading, brand) => {
  if (/^Чому гравці обирають(?:\s|$)/i.test(heading)) return `Чому гравці обирають ${brand}`;
  if (/^Готові(?:\s|$)/i.test(heading)) return `Готові спробувати ${brand}?`;

  let result = heading.replace(new RegExp(escapeRegExp(brand), 'gi'), ' ');
  result = result
    .replace(/\s+/g, ' ')
    .replace(/\s+([?!,:])/g, '$1')
    .replace(/^\s*[-–—:|&]+\s*|\s*[-–—:|&]+\s*$/g, '')
    .trim();

  const exact = new Map([
    ['огляд', 'Короткий огляд'],
    ['короткий огляд', 'Короткий огляд'],
    ['плюси та мінуси', 'Переваги та недоліки'],
    ['переваги та недоліки', 'Переваги та недоліки'],
    ['поширені запитання про', 'Поширені запитання'],
    ['поширені запитання', 'Поширені запитання'],
    ['країни та наявність', 'Країни та доступність'],
    ['платежі, kyc & виплати', 'Платежі, виплати та KYC'],
    ['платежі, kyc і виплати', 'Платежі, виплати та KYC'],
    ['додаток і мобільний досвід', 'Мобільний застосунок і версія сайту'],
    ['як організовує казино та спорт', 'Як організовані казино та ставки на спорт'],
  ]);
  const normalized = result.toLocaleLowerCase('uk');
  if (exact.has(normalized)) return exact.get(normalized);

  result = result
    .replace(/^Для кого найкраще підходить\??$/i, 'Кому підійде це казино?')
    .replace(/^Кому підходить найкраще\??$/i, 'Кому підійде це казино?')
    .replace(/^Суми регіональних бонусів$/i, 'Регіональні суми бонусів')
    .replace(/^Спортивні букмекерські контори, ставки Live та кіберспорт$/i, 'Ставки на спорт, live-ставки та кіберспорт')
    .replace(/^Поширені запитання про\s*$/i, 'Поширені запитання')
    .replace(/^Способи оплати\s+для/i, 'Способи оплати для');

  return result || heading;
};

const polishGenericHeading = heading => {
  let result = heading
    .replace(/Спортивні букмекерські контори/gi, 'Ставки на спорт')
    .replace(/Традиційні букмекерські контори/gi, 'Традиційні ставки на спорт')
    .replace(/Казино в прямому ефірі/gi, 'Live-казино')
    .replace(/ставки в реальному часі/gi, 'live-ставки')
    .replace(/ставки Live/gi, 'live-ставки')
    .replace(/лінійні та живі ставки/gi, 'прематч- і live-ставки')
    .replace(/інструменти для швидких ставок/gi, 'інструменти експрес-ставок')
    .replace(/\bаутрайти\b/gi, 'довгострокові ставки')
    .replace(/ринкова ніша/gi, 'особливості пропозиції')
    .replace(/змішане використання та вартість облікового запису/gi, 'поєднання продуктів і можливості акаунта')
    .replace(/функції облікового запису/gi, 'функції акаунта')
    .replace(/безпека облікового запису/gi, 'безпека акаунта')
    .replace(/перевірки облікового запису/gi, 'перевірка акаунта')
    .replace(/Правила облікового запису/gi, 'Правила акаунта')
    .replace(/Прийняття облікового запису/gi, 'Реєстрація акаунта')
    .replace(/постійна вартість/gi, 'довгострокові переваги')
    .replace(/видимість правил/gi, 'прозорість правил')
    .replace(/видимість політики/gi, 'прозорість політик')
    .replace(/юридична видимість/gi, 'юридична прозорість')
    .replace(/^Довіра,/i, 'Надійність,')
    .replace(/оцінка SpinCresta/gi, 'редакційна оцінка')
    .replace(/підтвердження/gi, 'верифікація')
    .replace(/рекламні примітки/gi, 'важливі умови')
    .replace(/повернення грошей/gi, 'кешбек')
    .replace(/коди релоад-бонуси/gi, 'релоад-бонуси за кодами')
    .replace(/безкоштовних обертань/gi, 'фриспінів')
    .replace(/^Подорож лояльності:/i, 'Програма лояльності:')
    .replace(/Бонусні знімки та рекламні шари/gi, 'Огляд бонусів та акцій')
    .replace(/^огляд (?:продукту|казино)$/i, 'Короткий огляд')
    .replace(/^Як організовує свій продукт казино$/i, 'Структура казино')
    .replace(/^Як організовує своє лобі казино$/i, 'Структура лобі казино')
    .replace(/^Як організовує слоти, live-ставки та контент для повторного відтворення$/i, 'Слоти, live-ставки та ігри для постійних гравців')
    .replace(/^Як організовує спортивні змагання, live-ставки та інструменти для матчів$/i, 'Спортивні події, live-ставки та інструменти для матчів')
    .replace(/^Онлайн казино за країнами$/i, 'Онлайн-казино за країнами')
    .replace(/^Ознайомтеся з іншими путівниками по казино$/i, 'Інші путівники казино')
    .replace(/Платежі, виплати і KYC/gi, 'Платежі, виплати та KYC')
    .replace(/Ліцензія, безпека та репутація гравця/gi, 'Ліцензія, безпека та захист гравців')
    .replace(/Діамантовий клуб/gi, 'Diamond Club')
    .replace(/мобільний досвід/gi, 'мобільна версія')
    .replace(/\s+/g, ' ')
    .trim();

  if (/^[а-яіїєґ]/u.test(result)) result = result[0].toLocaleUpperCase('uk') + result.slice(1);
  return result;
};

let changedPages = 0;
let changedHeadings = 0;
for (const entry of fs.readdirSync(BRANDS_ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const file = path.join(BRANDS_ROOT, entry.name, 'index.html');
  if (!fs.existsSync(file)) continue;
  const before = fs.readFileSync(file, 'utf8');
  const brand = extractBrand(before);
  if (!brand) continue;

  const after = before.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attributes, content) => {
    const heading = textOnly(content);
    const contextualHeading = /^Чому гравці обирають(?:\s|$)/i.test(heading) || /^Готові(?:\s|$)/i.test(heading);
    const mentionsBrand = heading.toLocaleLowerCase('uk').includes(brand.toLocaleLowerCase('uk'));
    const withoutRepetition = contextualHeading || mentionsBrand ? cleanHeading(heading, brand) : heading;
    const polished = polishGenericHeading(withoutRepetition);
    if (polished === heading) return full;
    changedHeadings += 1;
    return `<h2${attributes}>${polished}</h2>`;
  });

  if (after === before) continue;
  fs.writeFileSync(file, after);
  changedPages += 1;
}

console.log(`Polished ${changedHeadings} Ukrainian section headings on ${changedPages} brand pages.`);
