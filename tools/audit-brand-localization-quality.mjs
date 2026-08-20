#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const rootFor = locale => locale === 'en' ? path.join(ROOT, 'brands') : path.join(ROOT, locale, 'brands');
const slugsFor = locale => fs.readdirSync(rootFor(locale), { withFileTypes: true })
  .filter(entry => entry.isDirectory() && fs.existsSync(path.join(rootFor(locale), entry.name, 'index.html')))
  .map(entry => entry.name)
  .sort();

const suspicious = {
  en: [/\bThe (?:current )?brief lists\b/gi, /\b(?:current )?brand data\b/gi, /\bheadline value\b/gi, /\bNew Games rail\b/gi, /\bcrypto rails\b/gi, /\bproduct shell\b/gi, /\bbrand materials?\b/gi, /\baffiliate copy\b/gi, /\bsource file\b/gi],
  de: [/\bMarkendaten\b/gi, /\bAngebotsrichtung\b/gi, /\bNew-Game-Schiene\b/gi, /\bKacheln für neue Spiele\b/gi, /\bProdukt-Ökosystem\b/gi, /\bBonusüberschrift\b/gi, /\bBonus-Überschrift\b/gi, /\bTiefe Casino/gi, /Markenmaterial/gi, /Bonusdatei/gi],
  es: [/\bdatos (?:actuales )?de la marca\b/gi, /\bdirección de (?:la )?oferta\b/gi, /\bcajero\b/gi, /\brieles? (?:EFT|de pago|bancarios?|cripto)/gi, /\bmosaicos de juegos nuevos\b/gi, /\bbono de titular\b/gi, /\bprofundidad (?:del |de )?(?:casino|apuestas|juego)/gi, /\becosistema\b/gi, /material(?:es)? (?:de|del) (?:la )?marca/gi, /copia de afiliado/gi],
  it: [/\bdati (?:attuali )?del marchio\b/gi, /\bdirezione (?:di|dell['’])offerta\b/gi, /\bcassiere\b/gi, /\bbinari? (?:di )?(?:pagamento|banca|cripto)/gi, /\btessere dei nuovi giochi\b/gi, /\bbonus del titolo\b/gi, /\bprofondità (?:delle |del |di )?(?:scommesse|casinò|gioco)/gi, /\becosistema\b/gi, /materiale (?:del|di) (?:marchio|brand)/gi],
  pl: [/\bdanych marki\b/gi, /\bkierunek oferty\b/gi, /\bkasjer\b/gi, /\bszyn(?:a|y|ami)?\b/gi, /\bkafelki nowych gier\b/gi, /\bbonus nagłówkowy\b/gi, /\bgłęb(?:ia|okość).{0,24}(?:zakład|kasyn|gier)/gi, /\bekosystem\b/gi, /materiały marki/gi, /plik bonusowy/gi],
  uk: [/касир/gi, /заголов/gi, /\bпотік/gi, /глибин/gi, /сигнал/gi, /залізниц/gi, /екосистем/gi, /доріжк/gi, /криптограф/gi, /спортивн[а-яіїєґ]* букмекерськ[а-яіїєґ]* контор/gi, /обліков(?:ий|ого|ому|им) запис/gi, /(?:повна|широка) розділ/gi, /виплати (?:виглядає|коливається|може бути|описується)/gi, /плоск(?:а|е|ий|ої|ого).{0,20}(?:стіна|лобі|екран)/gi, /матеріал(?:и|ах) бренду/gi, /партнерськ(?:ій|ою) копії/gi, /бонусному файлі/gi, /букмекерськ[а-яіїєґ]* товари/gi, /розділ виплати/gi, /ставки на спорт товари/gi, /підтримує відповідальна гра/gi],
  pt: [/\bdados (?:atuais )?da marca\b/gi, /\bdireção de oferta\b/gi, /\bTrilho atual de novos jogos\b/gi, /\bblocos de novos jogos\b/gi, /\bbónus de cabeçalho\b/gi, /\bprofundidade (?:de |do )?(?:apostas|casino|jogo)/gi, /\becossistema\b/gi, /material (?:da|do) marca/gi, /ficheiro de bónus/gi],
  fr: [/\bdonnées (?:actuelles )?de la marque\b/gi, /\bdirection d['’]offre\b/gi, /\brail actuel des nouveaux jeux\b/gi, /\btuiles de nouveaux jeux\b/gi, /\bbonus du titre\b/gi, /\bprofondeur (?:des |du |de )?(?:paris|casino|jeu)/gi, /\bécosystème\b/gi, /matériel de la marque/gi],
  hi: [/वर्तमान ब्रांड डेटा/gi, /ऑफ़र दिशा/gi, /कैशियर/gi, /नए खेल रेल/gi, /नई-गेम टाइलें/gi, /बोनस हेडलाइन/gi, /(?:स्पोर्ट्सबुक|लाइव-कैसीनो|गेम) गहराई/gi, /इकोसिस्टम/gi, /ब्रांड सामग्री/gi, /सहबद्ध प्रति/gi, /(?:लाइसेंस|कंपनी) नहीं।/gi],
  fi: [/\btuotemerkki\b/gi, /\btarjouksen suunta\b/gi, /\bNykyinen uusien pelien juna\b/gi, /\bUusien pelien laatat\b/gi, /\bbonuksen otsikko\b/gi, /\b(?:vedonlyönnin|kasino|peli)syvyys\b/gi, /\bekosysteemi\b/gi, /brändimateriaali/gi],
};

const count = (html, pattern) => (html.match(pattern) || []).length;
const stripComments = html => html.replace(/<!--[\s\S]*?-->/g, '');
const errors = [];
const sourceSlugs = slugsFor('en');

for (const locale of locales) {
  const slugs = slugsFor(locale);
  const missing = sourceSlugs.filter(slug => !slugs.includes(slug));
  const extra = slugs.filter(slug => !sourceSlugs.includes(slug));
  if (missing.length) errors.push(`${locale}: missing brands: ${missing.join(', ')}`);
  if (extra.length) errors.push(`${locale}: extra brands: ${extra.join(', ')}`);

  for (const slug of sourceSlugs) {
    const file = path.join(rootFor(locale), slug, 'index.html');
    if (!fs.existsSync(file)) continue;
    const html = stripComments(fs.readFileSync(file, 'utf8'));
    const source = stripComments(fs.readFileSync(path.join(rootFor('en'), slug, 'index.html'), 'utf8'));
    const label = `${locale}/brands/${slug}/`;

    if (!/<h1\b[^>]*>[\s\S]*?<\/h1>/i.test(html)) errors.push(`${label}: missing H1`);
    if (!/<h2\b[^>]*>[\s\S]*?<\/h2>/i.test(html)) errors.push(`${label}: missing H2 sections`);
    for (const pattern of suspicious[locale]) {
      pattern.lastIndex = 0;
      const matches = html.match(pattern);
      if (matches?.length) errors.push(`${label}: suspicious copy ${pattern.source} (${matches.length})`);
    }

    for (const [name, pattern] of [
      ['feature cards', /class=["'][^"']*\bfeature-card\b/gi],
      ['review markers', /class=["'][^"']*\bicon-placeholder\b/gi],
      ['FAQ pairs', /<h3\b[^>]*>[\s\S]*?<\/h3>\s*<p\b/gi],
      ['images', /<img\b/gi],
      ['tables', /<table\b/gi],
    ]) {
      const expected = count(source, pattern);
      const actual = count(html, pattern);
      if (expected !== actual) errors.push(`${label}: ${name} ${actual}, expected ${expected}`);
    }

    const sourceHasPros = /<strong>Pros<\/strong>/i.test(source);
    const sourceHasCons = /<strong>Cons<\/strong>/i.test(source);
    if (sourceHasPros && !/<strong>(?:Pros|Vorteile|Ventajas|Pro|Plusy|Переваги|плюси|Prós|Avantages|फ़ायदे|फायदे|Plussat)<\/strong>/i.test(html)) {
      errors.push(`${label}: missing localized pros section`);
    }
    if (sourceHasCons && !/<strong>(?:Cons|Nachteile|Contras|Contro|Wady|Недоліки|мінуси|Inconvénients|नुकसान|Miinukset)<\/strong>/i.test(html)) {
      errors.push(`${label}: missing localized cons section`);
    }
  }
}

console.log(`Brand localization audit: ${sourceSlugs.length} brands × ${locales.length} locales = ${sourceSlugs.length * locales.length} pages, ${errors.length} errors.`);
if (errors.length) {
  console.error(errors.slice(0, 800).join('\n'));
  process.exitCode = 1;
}
