#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const LOCALE_ROOT = path.join(ROOT, 'de');
const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(LOCALE_ROOT);

const replacements = [
  [/Casino Casino/g, 'Casino'],
  [/\breine reine\b/gi, 'reine'],
  [/\bTelegramm\b/g, 'Telegram'],
  [/\bBonusbrief(?:s|es|e)?\b/gi, 'Bonusbedingungen'],
  [/\bDer Brief fordert die Spieler auf\b/gi, 'Die Bonusbedingungen fordern Spieler dazu auf'],
  [/\bProduktpassform\b/gi, 'Produkteignung'],
  [/\bBeste Passform\b/gi, 'Am besten geeignet'],
  [/\bPraktische Passform\b/gi, 'Praktische Eignung'],
  [/\bAU\/NZ-Passform\b/gi, 'Eignung für AU/NZ'],
  [/\bPassform für AU\/NZ-Spieler\b/gi, 'Eignung für Spieler aus AU/NZ'],
  [/\bklare AU\/NZ-Passform\b/gi, 'klare Ausrichtung auf AU/NZ'],
  [/\bstarke lokale Passform\b/gi, 'starke lokale Eignung'],
  [/\blokal(?:e|en|er) Passform\b/gi, 'lokale Eignung'],
  [/\bKassenbereichroute\b/gi, 'Kassenoption'],
  [/\bKassenbereichlogik\b/gi, 'Abläufe im Kassenbereich'],
  [/\bSupport-Route\b/gi, 'Supportweg'],
  [/\bKontaktroute\b/gi, 'Kontaktseite'],
  [/\bAuszahlungsroute\b/gi, 'Auszahlungsmethode'],
  [/\bEinzahlungsroute\b/gi, 'Einzahlungsmethode'],
  [/\bRegulierungsroute\b/gi, 'Aufsichtsweg'],
  [/\bBeschwerderoute\b/gi, 'Beschwerdeverfahren'],
  [/\bSportwetten-plus-Slots-Hülle\b/gi, 'Sportwetten- und Casino-Website'],
  [/\bSportwetten-Hülle\b/gi, 'Sportwetten-Website'],
  [/\bCasino-Hülle im Klon-Stil\b/gi, 'generische Casino-Website'],
  [/\bCasino-Hülle\b/gi, 'Casino-Website'],
  [/\bEin-Bonus-Hülle\b/gi, 'Einzelbonus-Angebot'],
  [/\bStandard-Einzelbonus-Shell\b/gi, 'Standardangebot mit nur einem Bonus'],
  [/\bPromo-Shell\b/gi, 'reine Promo-Website'],
  [/\bSportwetten-Shell\b/gi, 'Sportwetten-Website'],
  [/\bSlot-Shell\b/gi, 'reine Slot-Website'],
  [/\bSpielautomaten-Shell\b/gi, 'reine Spielautomaten-Website'],
  [/\bAll-Games-Shell\b/gi, 'ungefilterte Gesamtübersicht aller Spiele'],
  [/\bCasino-Shell\b/gi, 'Casino-Website'],
  [/\bBonus-Shell\b/gi, 'reine Bonusseite'],
  [/\bklebriger anfühlen\b/gi, 'eine stärkere Bindung bieten'],
  [/\bDer aktuelle Wildsino-Build enthält ein Anjouan Gaming-Siegel\b/gi, 'Auf der Wildsino-Website wird ein Prüfzeichen von Anjouan Gaming angezeigt'],
  [/\bder aktuelle Wildsino-Build enthält ein Anjouan Gaming-Siegel\b/gi, 'auf der Wildsino-Website wird ein Prüfzeichen von Anjouan Gaming angezeigt'],
  [/\bDer aktuelle Website ist so konfiguriert, dass ein Anjouan Gaming-Siegel[^.]*geladen wird\b/gi, 'Auf der Website wird ein Prüfzeichen von Anjouan Gaming angezeigt'],
  [/\bLive-Validator\b/gi, 'Verifizierungsseite'],
  [/\bLive-Siegel\b/gi, 'Verifizierungsseite'],
  [/>Complaint Route</gi, '>Beschwerdeverfahren<'],
  [/>Beschwerde-Route</gi, '>Beschwerdeverfahren<'],
];

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  for (const [pattern, replacement] of replacements) after = after.replace(pattern, replacement);
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed += 1;
}

console.log(`Polished German copy on ${changed} pages.`);
