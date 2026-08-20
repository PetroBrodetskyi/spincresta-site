#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const checks = {
  en: [/\b(?:current )?brand data\b/gi, /\bcomplaints routes\b/gi, /\bpayment routes\b/gi, /\bcrypto rails\b/gi, /\bproduct shell\b/gi, /Review details coming soon/gi, /The our current review|Official site messaging supports this offer direction/gi],
  de: [/Spiellautstärke/gi, /Kassenbereichleistung/gi, /Sperraktionen für Konten/gi, /Markendaten/gi, /Angebotsrichtung/gi, /Live-Kassenbereich/gi],
  es: [/flujo de retiro/gi, /acciones de cuentas bloqueadas/gi, /rendimiento del juego y del cajero/gi, /datos (?:actuales )?de la marca/gi, /las métodos/gi, /\brutas?\b/gi, /Revisar los detalles próximamente/gi, /dirección de (?:esta|la) oferta/gi, /cajero (?:de la cuenta|en vivo)/gi],
  it: [/flusso di pagamenti, verifica e incasso/gi, /percorsi di pagamento/gi, /percorsi di reclamo/gi, /dati (?:attuali )?del marchio/gi, /\bpercorsi?\b/gi, /direzione (?:di|dell['’])offerta/gi, /cassiere dal vivo|cassa (?:dal vivo|live)/gi],
  pl: [/głośnością gry/gi, /przepływ wypłat/gi, /ścieżki płatności/gi, /danych marki/gi, /wydajność gry i kasjera/gi, /\btrasy?\b/gi, /<strong>Premia:<\/strong>/gi, /kierunek oferty/gi, /kasjer po zalogowaniu/gi],
  uk: [/Перки прогресу/gi, /VIP-термінів/gi, /оплату права власності/gi, /роботу гри та касира/gi, /даних бренду/gi, /\bшлях(?:и|ів|ах|ами)?\b/gi, /Статистика та казино/gi, /<strong>тип:<\/strong>/g, /напрямок пропозиції/gi],
  pt: [/\bda operador\b/gi, /\bas métodos\b/gi, /\bos ferramentas\b/gi, /fluxo de levantamento/gi, /dados da marca/gi, /profundidade de apostas/gi, /apenos/gi, /cado operador/gi, /direção de oferta/gi, /caixa ao vivo/gi],
  fr: [/flux de retrait/gi, /fenêtres de validité/gi, /actions de compte bloqué/gi, /propriété du paiement/gi, /données (?:actuelles )?de la marque/gi, /profondeur des paris/gi, /Avis sur la marque/g, /correspondances sur dépôt/gi, /vérifications de la réalité/gi, /\bitinéraires?\b/gi, /<strong>(?:Taper|Prime):<\/strong>/gi, /direction d['’]offre/gi, /caisse en direct/gi],
  hi: [/वर्तमान ब्रांड डेटा/gi, /भुगतान मार्ग/gi, /निकासी मार्ग/gi, /शिकायत मार्ग/gi, /उत्पाद शेल/gi, /कैशियर प्रदर्शन/gi, /ऑफ[ऱ] दिशा/gi, /लाइव कैशियर/gi],
  fi: [/tuotemerkki/gi, /maksureitti/gi, /nostoreitti/gi, /kassavirta/gi, /nostovirta/gi, /Hyvä istuvuus/gi, /promootiokuva/gi, /live-kassa|elävä kassa/gi],
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

const errors = [];
const localizedRoots = new Set(['de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi', '.git', 'node_modules', 'tools']);
const walkEnglish = directory => {
  const files = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && directory === ROOT && localizedRoots.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walkEnglish(absolute));
    else if (entry.name === 'index.html') files.push(absolute);
  }
  return files;
};

for (const [locale, patterns] of Object.entries(checks)) {
  const files = locale === 'en' ? walkEnglish(ROOT) : walk(path.join(ROOT, locale));
  for (const file of files) {
    const html = fs.readFileSync(file, 'utf8').replace(/<!--([\s\S]*?)-->/g, '');
    for (const pattern of patterns) {
      const matches = html.match(pattern);
      if (matches?.length) errors.push(`${path.relative(ROOT, file)}: ${pattern.source} (${matches.length})`);
    }
  }
}

console.log(`Human copy audit: ${Object.keys(checks).length} locales, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 500).join('\n'));
  process.exitCode = 1;
}
