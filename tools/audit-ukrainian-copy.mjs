#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const UK_ROOT = path.join(ROOT, 'uk');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(UK_ROOT);

const forbidden = [
  ['machine placeholder', /ZXQ|QXZ/g],
  ['literal reality-check translation', /(?:перевірк|контрол)[а-яіїєґ]* реальност[а-яіїєґ]*/gi],
  ['awkward safer-gambling translation', /безпечніш[а-яіїєґ]* (?:гра|азартн)/gi],
  ['literal deposit-match translation', /(?:відповідність|зіставлення) депозит/gi],
  ['literal review snapshot', /знімок(?! екрана)/gi],
  ['literal route translation', /маршрут/gi],
  ['literal product-shell translation', /оболонк/gi],
  ['literal sportsbook translation', /спортивн[а-яіїєґ]* книг[а-яіїєґ]*/gi],
  ['literal verification-seal translation', /печатк[а-яіїєґ]*/gi],
  ['translated email address', /[а-яіїєґ]+@[a-z0-9.-]+/gi],
  ['literal sportsbook-games translation', /спортивн[а-яіїєґ]* букмекерськ[а-яіїєґ]* ігр[а-яіїєґ]*/gi],
  ['literal mobile-web translation', /мобільн[а-яіїєґ]* доступ[а-яіїєґ]* до Інтернет/gi],
  ['source briefing disclosure', /(?:бриф|електронн[а-яіїєґ]* таблиц|джерельн[а-яіїєґ]* документ|надан[а-яіїєґ]* інформац[а-яіїєґ]* про бренд)/gi],
  ['untranslated UI phrase', /\b(?:play now|claim bonus|learn more|payment methods|why players choose|player fit)\b/gi],
  ['untranslated positioning marker', /\b(?:Mobile-First|Crypto-First|Casino-First|Sport-First|Esports-First|Filter-First)\b/g],
  ['lowercase FAQ answer', /(?:<p>|"text": ")(?:так|ні)\s/gu],
  ['withdrawal agreement error', /(?:перше|першого|першим|мінімальне|максимальне|швидке|плавне|надійне|щомісячне) виплати|виплатим/gi],
  ['duplicate withdrawal wording', /виплати,\s*виплати/gi],
  ['awkward fast-access wording', /Швидкий розділ/gi],
  ['wrong betting category', /Статистика та казино/gi],
  ['literal live-cashier translation', /(?:Оперативн[а-яіїєґ]*|жив[а-яіїєґ]*|рахунк[а-яіїєґ]*)\s+касир[а-яіїєґ]*|касир[а-яіїєґ]* рахунк[а-яіїєґ]*/gi],
  ['noun used instead of copy-code imperative', /Копія\s+(?:<strong>)?SPINCRESTA/gi],
  ['literal crash-game translation', /аварійн[а-яіїєґ]*(?:\s+[а-яіїєґ-]+){0,2}\s+ігр[а-яіїєґ]*/gi],
  ['literal new-games rail translation', /Актуальн[а-яіїєґ]* залізниц[а-яіїєґ]*/gi],
  ['broken live-casino label', /Казино і жити/gi],
  ['literal prematch-sports translation', /Спорт перед матчем/gi],
  ['literal dealer-table translation', /стол[а-яіїєґ]* для дилер[а-яіїєґ]*/gi],
  ['broken licence-status wording', /поточн[а-яіїєґ]* знак[а-яіїєґ]* ліцензі[а-яіїєґ]*/gi],
  ['literal sportsbook-expansion heading', /Розширення розділу ставок на спорт/gi],
  ['literal bonus-claim wording', /перед позовом|подати заявку на бонус/gi],
  ['literal percentage-match wording', /відсотков[а-яіїєґ]* збіг[а-яіїєґ]*/gi],
  ['literal game-tile wording', /плитк[а-яіїєґ]* нових ігор/gi],
  ['literal flat-site wording', /плоск[а-яіїєґ]* сайт/gi],
  ['literal dealer-led wording', /під керівництвом дилер[а-яіїєґ]*/gi],
  ['literal final-source wording', /остаточн[а-яіїєґ]* актуальн[а-яіїєґ]* джерел[а-яіїєґ]*/gi],
  ['literal English-first word order', /(?:касу|касира|умови|правила|оплати)\s+перший/gi],
  ['literal game-tile translation', /плитк[а-яіїєґ]*/gi],
  ['literal rule-stack translation', /(?:правил[а-яіїєґ]*\s+стек[а-яіїєґ]*|стек[а-яіїєґ]*\s+правил[а-яіїєґ]*|легальн[а-яіїєґ]*\s+стек[а-яіїєґ]*)/gi],
  ['literal sportsbook-points wording', /спортивн[а-яіїєґ]* точк[а-яіїєґ]*/gi],
  ['literal trust-signal wording', /сигнал[а-яіїєґ]* (?:довіри|прозорості)/gi],
  ['literal homepage wording', /домашн[а-яіїєґ]* сторінк[а-яіїєґ]*/gi],
  ['literal one-angle wording', /однокутн[а-яіїєґ]*/gi],
  ['literal casino-first wording', /Казино-перший/gi],
];

const errors = [];
for (const file of files) {
  const relative = path.relative(UK_ROOT, file).split(path.sep).join('/');
  const html = fs.readFileSync(file, 'utf8')
    .replace(/<!--([\s\S]*?)-->/g, '')
    .replace(/<meta\b[^>]*name=["']keywords["'][^>]*>/gi, '');

  if (!/<html\b[^>]*\blang=["']uk(?:-[a-z]{2})?["']/i.test(html)) errors.push(`${relative}: wrong or missing html lang`);
  if (!new RegExp(`<link\\b[^>]*rel=["']canonical["'][^>]*href=["']https://spincresta\\.com/uk/`).test(html)) {
    errors.push(`${relative}: wrong or missing Ukrainian canonical`);
  }

  for (const [label, pattern] of forbidden) {
    const flags = pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`;
    const matches = [...html.matchAll(new RegExp(pattern.source, flags))];
    if (matches.length) errors.push(`${relative}: ${label} (${matches.length})`);
  }

  if (relative !== 'brands/first/index.html' && relative !== 'casinos-and-betting/index.html') {
    const firstMatches = [...html.matchAll(/\bFirst\b/g)];
    if (firstMatches.length) errors.push(`${relative}: untranslated First marker (${firstMatches.length})`);
  }
}

console.log(`Ukrainian copy audit: ${files.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 300).join('\n'));
  process.exitCode = 1;
}
