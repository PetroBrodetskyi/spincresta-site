#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const locales = ['de', 'es', 'it', 'pl', 'uk'];
const emailPattern = /[^\s<>"']+@[^\s<>"']+\.[A-Za-z]{2,}/g;

const replacements = {
  de: [
    [/Bonus-Snapshot/gi, 'Bonusüberblick'],
    [/Produkt-Snapshot/gi, 'Produktüberblick'],
    [/Review-Snapshot/gi, 'Testüberblick'],
    [/\bSnapshot\b/gi, 'Überblick'],
    [/Schnappschuss/gi, 'Überblick'],
    [/Gute Passform/gi, 'Gut geeignet'],
    [/Überlegen Sie zweimal, ob/gi, 'Weniger geeignet, wenn'],
    [/Lizenzsignal/gi, 'Lizenzangaben'],
    [/Site-Build/gi, 'Website'],
    [/Live-Siegel/gi, 'Verifizierungsseite'],
    [/mobiler Webzugriff/gi, 'mobile Website'],
    [/Karrierestufen/gi, 'VIP-Stufen'],
    [/<td>Lädt nach<\/td>/gi, '<td>Reload-Boni</td>'],
    [/der aktuelle Build/gi, 'die aktuelle Website'],
    [/im aktuellen Build/gi, 'auf der aktuellen Website'],
    [/aktuelle Site-Konfiguration/gi, 'aktuelle Website'],
  ],
  es: [
    [/(<h2 class="title">[^<]*)\bInstantánea\b([^<]*<\/h2>)/gi, '$1Resumen$2'],
    [/Esta instantánea/gi, 'Este resumen'],
    [/Esta Resumen/gi, 'Este resumen'],
    [/ganancia Resumen/gi, 'ganancia instantánea'],
    [/Ganancia Resumen/g, 'Ganancia instantánea'],
    [/Compra Resumen/gi, 'Compra instantánea'],
    [/área Resumen/gi, 'área de juegos instantáneos'],
    [/banca Resumen/gi, 'banca instantánea'],
    [/Pix \(Resumen\)/gi, 'Pix (instantáneo)'],
    [/una Resumen rápida/gi, 'un resumen rápido'],
    [/mesa, Resumen y ruleta/gi, 'mesa, juegos instantáneos y ruleta'],
    [/Buen ajuste/gi, 'Ideal para'],
    [/Piénselo dos veces, si/gi, 'Puede no ser ideal si'],
    [/sello en vivo/gi, 'página de verificación'],
    [/compilación actual/gi, 'sitio actual'],
    [/niveles profesionales/gi, 'niveles VIP'],
  ],
  it: [
    [/(<h2 class="title">[^<]*)\bIstantanea\b([^<]*<\/h2>)/gi, '$1Panoramica$2'],
    [/Questa istantanea/gi, 'Questa panoramica'],
    [/vincita Panoramica/gi, 'vincita istantanea'],
    [/Vincita Panoramica/g, 'Vincita istantanea'],
    [/elaborazione Panoramica/gi, 'elaborazione istantanea'],
    [/elaborazione crittografica Panoramica/gi, 'elaborazione crittografica istantanea'],
    [/crittografia Panoramica/gi, 'elaborazione istantanea delle criptovalute'],
    [/banca Panoramica/gi, 'servizi bancari istantanei'],
    [/riproduzione Panoramica/gi, 'gioco istantaneo'],
    [/una rapida Panoramica/gi, 'una rapida panoramica'],
    [/area Panoramica/gi, 'area dei giochi istantanei'],
    [/gratta e vinci Panoramica/gi, 'gratta e vinci istantanei'],
    [/normalmente Panoramica/gi, 'normalmente istantanea'],
    [/Buona vestibilità/gi, 'Ideale per'],
    [/Pensaci due volte se/gi, 'Potrebbe non essere ideale se'],
    [/sigillo dal vivo/gi, 'pagina di verifica'],
    [/build attuale/gi, 'sito attuale'],
    [/livelli di carriera/gi, 'livelli VIP'],
  ],
  pl: [
    [/Dobre dopasowanie/gi, 'Dla kogo'],
    [/Zastanów się dwa razy, jeśli/gi, 'Może nie być odpowiednie, jeśli'],
    [/pieczęć aktywna/gi, 'aktualny status licencji'],
    [/Obecna wersja witryny/gi, 'Aktualna strona'],
    [/poziomów kariery/gi, 'poziomów VIP'],
  ],
  uk: [],
};

const walk = directory => {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute));
    else if (entry.name === 'index.html') files.push(absolute);
  }
  return files;
};

const restoreEmails = (target, source) => {
  const sourceEmails = source.match(emailPattern) || [];
  let index = 0;
  return target.replace(emailPattern, value => sourceEmails[index++] || value);
};

const restoreSpinbossTiers = html => html.replace(
  /(<h2 class="title">[^<]*VIP[^<]*<\/h2>[\s\S]*?<tbody>)([\s\S]*?)(<\/tbody>[\s\S]*?<\/table>)/i,
  (full, start, rows, end) => {
    const tiers = ['Intern', 'Receptionist', 'Sales Rep', 'Regional Manager', "World's Best Boss"];
    let index = 0;
    const restored = rows.replace(/(<tr><td>)[^<]*(<\/td>)/g, (row, open, close) => {
      const tier = tiers[index++];
      return tier ? `${open}${tier}${close}` : row;
    });
    return `${start}${restored}${end}`;
  },
);

const restoreSpinbossTierNames = (html, locale) => {
  const rules = {
    de: [
      [/den Stufen Praktikant, Rezeptionist, Vertriebsmitarbeiter, Regionalmanager und World's Best Boss/gi, "den fünf offiziellen Gruppen Intern, Receptionist, Sales Rep, Regional Manager und World's Best Boss"],
      [/Die Stufen „Vertriebsmitarbeiter“, „Regionalmanager“ und „World's Best Boss“/gi, "Die Gruppen Sales Rep, Regional Manager und World's Best Boss"],
    ],
    es: [
      [/entre los niveles de pasante, recepcionista, representante de ventas, gerente regional y mejor jefe del mundo/gi, "en cinco grupos oficiales: Intern, Receptionist, Sales Rep, Regional Manager y World's Best Boss"],
      [/Los niveles de Representante de ventas, Gerente regional y Mejor jefe del mundo/gi, "Los grupos Sales Rep, Regional Manager y World's Best Boss"],
    ],
    it: [
      [/tra stagista, receptionist, rappresentante di vendita, manager regionale e miglior capo del mondo/gi, "in cinque gruppi ufficiali: Intern, Receptionist, Sales Rep, Regional Manager e World's Best Boss"],
      [/I livelli Rappresentante delle vendite, Direttore Regionale e Il miglior capo del mondo/gi, "I gruppi Sales Rep, Regional Manager e World's Best Boss"],
    ],
    pl: [
      [/Przedstawiciel handlowy, menedżer regionalny i najlepszy szef świata/gi, "Grupy Sales Rep, Regional Manager i World's Best Boss"],
      [/na poziomach Stażysta, Recepcjonista, Przedstawiciel handlowy, Menedżer regionalny i Najlepszy szef świata/gi, "w pięciu oficjalnych grupach: Intern, Receptionist, Sales Rep, Regional Manager i World's Best Boss"],
    ],
    uk: [],
  };
  let result = html;
  for (const [pattern, replacement] of rules[locale]) result = result.replace(pattern, replacement);
  return result;
};

let changed = 0;
for (const locale of locales) {
  for (const file of walk(path.join(ROOT, locale))) {
    const relative = path.relative(path.join(ROOT, locale), file);
    const sourceFile = path.join(ROOT, relative);
    const before = fs.readFileSync(file, 'utf8');
    let after = before;

    if (fs.existsSync(sourceFile)) after = restoreEmails(after, fs.readFileSync(sourceFile, 'utf8'));
    for (const [pattern, replacement] of replacements[locale]) after = after.replace(pattern, replacement);
    if (relative.split(path.sep).join('/') === 'brands/spinboss/index.html') {
      after = restoreSpinbossTierNames(after, locale);
      after = restoreSpinbossTiers(after);
    }

    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

console.log(`Polished protected and recurring multilingual copy on ${changed} pages.`);
