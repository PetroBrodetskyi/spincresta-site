#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const IT_ROOT = path.join(ROOT, 'it');
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(IT_ROOT);

const replacements = [
  [/Casino Casino/g, 'Casino'],
  [/\bgiri gratuiti gratuiti\b/gi, 'giri gratuiti'],
  [/\bVestibilità del gioco\b/gi, 'Compatibilità dei giochi'],
  [/\bVestibilità nazionale\b/gi, 'Disponibilità per Paese'],
  [/\bVestibilità del giocatore AU\/NZ\b/gi, 'Idoneità per i giocatori di Australia e Nuova Zelanda'],
  [/\bvestibilità locale\b/gi, 'buona compatibilità con il mercato locale'],
  [/\bVestibilità pratica\b/gi, 'Idoneità pratica'],
  [/\bguscio di scommesse sportive e slot\b/gi, 'sito con scommesse sportive e slot'],
  [/\bguscio di scommesse sportive pesantemente dedicato al calcio\b/gi, 'sito di scommesse incentrato soprattutto sul calcio'],
  [/\bguscio di scommesse sportive big five\b/gi, 'sito di scommesse limitato agli sport principali'],
  [/\bguscio di scommesse sportive\b/gi, 'sito di scommesse essenziale'],
  [/\bguscio con un bonus\b/gi, 'offerta con un solo bonus'],
  [/\bguscio con un solo bonus\b/gi, 'offerta con un solo bonus'],
  [/\bguscio bonus di una pagina\b/gi, 'sito promozionale di una sola pagina'],
  [/\bguscio solo per il calcio\b/gi, 'sito dedicato soltanto al calcio'],
  [/\bguscio di casinò più ristretto\b/gi, 'sito di casinò più limitato'],
  [/\bguscio promozionale\b/gi, 'sito esclusivamente promozionale'],
  [/\bshell promozionale\b/gi, 'sito esclusivamente promozionale'],
  [/\bshell piatta per tutti i giochi\b/gi, 'pagina unica di giochi senza filtri'],
  [/\bshell standard a bonus singolo\b/gi, 'offerta standard con un solo bonus'],
  [/\bshell solo per le slot\b/gi, 'sito dedicato soltanto alle slot'],
  [/\bshell solo per slot\b/gi, 'sito dedicato soltanto alle slot'],
  [/\bsottile guscio promozionale\b/gi, 'sito promozionale essenziale'],
  [/\bpiù appiccicoso\b/gi, 'più coinvolgente'],
  [/\bnell'attuale brief sul bonus\b/gi, 'nelle attuali condizioni del bonus'],
  [/\bIl brief sui bonus elenca\b/gi, 'Le condizioni del bonus elencano'],
  [/\bIl brief attuale elenca\b/gi, 'Le condizioni attuali elencano'],
  [/\bIl brief chiede ai giocatori\b/gi, 'Le condizioni invitano i giocatori'],
  [/\bIl brief dice anche\b/gi, 'Le condizioni indicano inoltre'],
  [/\bIl brief elenca\b/gi, 'Le condizioni elencano'],
  [/\baccesso Web mobile\b/gi, 'versione mobile del sito'],
  [/\bRevisioni\b/g, 'Recensioni'],
  [/\brevisioni\b/g, 'recensioni'],
  [/\bRevisione\b/g, 'Recensione'],
  [/\brevisione\b/g, 'recensione'],
  [/\bcontrolli di realtà\b/gi, 'promemoria di sessione'],
  [/\bcontrollo di realtà\b/gi, 'promemoria di sessione'],
  [/\bcontrolli per un gioco più sicuro\b/gi, 'strumenti per il gioco responsabile'],
  [/\bcontrolli più sicuri\b/gi, 'strumenti per il gioco responsabile'],
  [/\bstrumenti per un gioco più sicuro\b/gi, 'strumenti per il gioco responsabile'],
  [/\bstrumenti di gioco più sicuri\b/gi, 'strumenti per il gioco responsabile'],
  [/\bgioco d['’]azzardo più sicuro\b/gi, 'gioco responsabile'],
  [/\bgioco più sicuro\b/gi, 'gioco responsabile'],
  [/\bLe partite di deposito\b/g, 'I bonus sul deposito'],
  [/\ble partite di deposito\b/g, 'i bonus sul deposito'],
  [/\bpartite di deposito\b/gi, 'bonus sul deposito'],
  [/\bcorrispondenze dei depositi\b/gi, 'bonus sul deposito'],
  [/\bcorrispondenza del deposito\b/gi, 'bonus sul deposito'],
  [/\bcorrispondenza dei depositi\b/gi, 'bonus sul deposito'],
  [/\bcorrispondenza sul deposito\b/gi, 'bonus sul deposito'],
  [/\btermini di bonus\b/gi, 'condizioni dei bonus'],
  [/\btermini del bonus\b/gi, 'condizioni del bonus'],
  [/\bbonus di deposito abbinati\b/gi, 'bonus percentuali sul deposito'],
  [/\bscommesse gratuite sulle scommesse sportive\b/gi, 'scommesse gratuite per lo sportsbook'],
  [/\bpartite del (\d+(?:-\d+)?%)\b/gi, 'bonus sul deposito del $1'],
  [/\bscommessa del bonus è completa\b/gi, 'requisito di puntata del bonus è completato'],
  [/\bcompleta la scommessa del bonus\b/gi, 'completa il requisito di puntata del bonus'],
  [/\bscommesse sui bonus\b/gi, 'requisiti di puntata dei bonus'],
  [/\brequisiti di scommessa\b/gi, 'requisiti di puntata'],
  [/\brequisito di scommessa\b/gi, 'requisito di puntata'],
  [/\bScommesse (\d+)x\b/g, 'Requisito di puntata x$1'],
  [/\bscommesse (\d+)x\b/g, 'requisito di puntata x$1'],
  [/\bLe scommesse x(\d+)\b/g, 'Il requisito di puntata x$1'],
  [/\ble scommesse x(\d+)\b/g, 'il requisito di puntata x$1'],
  [/\bcon scommesse x(\d+)\b/gi, 'con requisito di puntata x$1'],
  [/\bscommesse x(\d+)\b/gi, 'requisito di puntata x$1'],
  [/\bperiodo di scommessa\b/gi, 'periodo per completare il requisito di puntata'],
  [/\brotazione dei depositi\b/gi, 'requisito di puntata sui depositi'],
  [/\brotazione del deposito\b/gi, 'requisito di puntata sul deposito'],
  [/\bassegni di pagamento locali\b/gi, 'verifiche sui pagamenti locali'],
  [/\bassegni del conto\b/gi, 'verifiche del conto'],
  [/\bassegni che contano\b/gi, 'verifiche importanti'],
  [/\bassegni di verifica\b/gi, 'verifiche'],
  [/\bassegni KYC\b/gi, 'controlli KYC'],
  [/\bfasce orarie\b/gi, 'slot'],
  [/\bcopia promozionale\b/gi, 'testo promozionale'],
  [/\bcopia bonus\b/gi, 'testo del bonus'],
  [/\bcopia ufficiale\b/gi, 'testo ufficiale'],
  [/\bcopia pubblica\b/gi, 'testo pubblico'],
  [/\bcopia del pagamento\b/gi, 'testo sui pagamenti'],
  [/\bin copia rivolta all['’]India\b/gi, 'nei contenuti rivolti all’India'],
  [/\brecensione della lobby\b/gi, 'analisi del casinò'],
  [/\bpolitica sulla riservatezza\b/gi, 'Informativa sulla privacy'],
  [/Per favore gioca in modo responsabile\./g, 'Gioca responsabilmente.'],
  [/Per favore, gioca in modo responsabile\./g, 'Gioca responsabilmente.'],
  [/>Di</g, '>Chi siamo<'],
  [/>Casa</g, '>Home<'],
  [/Casinò online\. Meglio scelto\./g, 'Casinò online. Scelti con cura.'],
  [/Marche di casinò consigliate/g, 'Brand di casinò consigliati'],
  [/FRESCO DA LOBBY RIVEDUTE/g, 'NOVITÀ DAI CASINÒ RECENSITI'],
  [/Realtà in più/g, 'Il valore reale del bonus'],
  [/Scommesse, contributo al gioco, limiti, scadenza e dettagli che modificano il valore del titolo\./g,
    'Requisiti di puntata, contributo dei giochi, limiti, scadenza e dettagli che modificano il valore effettivo del bonus.'],
  [/Bonus trasparenza/g, 'Trasparenza dei bonus'],
  [/approfondimento sulle scommesse sportive/gi, 'offerta di scommesse sportive'],
  [/\bPrima di un primo deposito\b/g, 'Prima del primo deposito'],
  [/\bprima di un primo deposito\b/g, 'prima del primo deposito'],
  [/\bRecensione di esperti\b/g, 'Recensione dell’esperta'],
  [/\bEsperto recensito\b/g, 'Recensione dell’esperta'],
  [/Cancellare i limiti nazionali per Canada e Australia nell'attuale briefing sui bonus\./g,
    'Limiti nazionali chiari per Canada e Australia nelle condizioni attuali del bonus.'],
  [/oltre una partita di deposito di base/gi, 'oltre un bonus base sul deposito'],
  [/sono documentate nel file bonus/gi, 'sono indicate nelle condizioni del bonus'],
  [/I primi controlli dovrebbero essere accettati tramite carta o portafoglio elettronico, se sono disponibili metodi crittografici o regionali e se i controlli KYC, proprietà del pagamento o antiriciclaggio possono influenzare il primo prelievo\./g,
    'Prima di depositare, controlla se sono accettate carte o e-wallet, se sono disponibili criptovalute o metodi regionali e se le verifiche KYC, di proprietà del pagamento o antiriciclaggio possono influire sul primo prelievo.'],
  [/First Professional League/g, 'Prima Lega Professionistica'],
  [/\bdeposito (?:di|in) criptovaluta First\b/gi, 'primo deposito in criptovaluta'],
  [/\bdeposito in criptovalute First\b/gi, 'primo deposito in criptovalute'],
  [/\bdeposito First\b/gi, 'primo deposito'],
  [/\bFirst deposito live\b/g, 'Primo deposito live'],
  [/\bCasino-First\b/g, 'incentrato sul casinò'],
  [/\bcasinò-First\b/g, 'incentrato sul casinò'],
  [/\bCasinò-First\b/g, 'Incentrato sul casinò'],
  [/\bCrypto-First\b/g, 'incentrato sulle criptovalute'],
  [/\bCripto-First\b/g, 'Incentrato sulle criptovalute'],
  [/\bMobile-First\b/g, 'Priorità al mobile'],
  [/\bmobile-First\b/g, 'priorità al mobile'],
  [/\bmobili-First\b/g, 'che privilegiano il mobile'],
  [/\bsport-First\b/g, 'incentrati sullo sport'],
  [/\bSport-First\b/g, 'Incentrato sullo sport'],
  [/\bcricket-First\b/g, 'incentrati sul cricket'],
  [/\bFiltro-First\b/g, 'Priorità ai filtri'],
  [/\bEsports-First\b/g, 'Incentrate sugli eSport'],
  [/\bLeggi (i|le) (condizioni|termini|domande frequenti)([^<]*) First\b/g, 'Leggi prima $1 $2$3'],
  [/\bControlla il cassiere First\b/g, 'Controlla prima il cassiere'],
  [/\bcontrolla il cassiere First\b/g, 'controlla prima il cassiere'],
  [/\bTermini First\b/g, 'Prima le condizioni'],
  [/\bRegole First\b/g, 'Controlla prima le regole'],
  [/\bInizia Piccolo First\b/g, 'Inizia prima con poco'],
  [/\bSlot First\b/g, 'Priorità alle slot'],
  [/\bprelievi First\b/g, 'primi prelievi'],
  [/\bAssegni di incasso First\b/g, 'Verifiche prima del prelievo'],
  [/\bciò che conta First\b/g, 'ciò che conta prima di giocare'],
  [/\bFirst, le offerte del secondo, terzo e quarto deposito\b/g, 'Le offerte del primo, secondo, terzo e quarto deposito'],
  [/\britiro\b/gi, 'prelievo'],
  [/\bcash out\b/gi, 'incasso anticipato'],
  [/\bSpinCresta Visualizzazione del rischio\b/g, 'Valutazione del rischio di SpinCresta'],
  [/\bSpinCresta Visualizzazione licenza\b/g, 'Valutazione della licenza di SpinCresta'],
  [/\bSpinCresta Visualizzazione della licenza\b/g, 'Valutazione della licenza di SpinCresta'],
  [/\bSÌ\b/g, 'Sì'],
  [/\bGli attuali Termini\b/g, 'Le condizioni attuali'],
  [/\bgli attuali Termini\b/g, 'le condizioni attuali'],
  [/\bI presenti Termini\b/g, 'Le presenti condizioni'],
  [/\bi presenti Termini\b/g, 'le presenti condizioni'],
  [/\bI Termini\b/g, 'Le condizioni'],
  [/\bi Termini\b/g, 'le condizioni'],
  [/\bTermini generali\b/g, 'Condizioni generali'],
  [/\btermini generali\b/g, 'condizioni generali'],
  [/\btermini live\b/gi, 'condizioni aggiornate'],
  [/\bcondizioni del bonus live\b/gi, 'condizioni aggiornate del bonus'],
  [/\bbonus live\b/gi, 'bonus attuali'],
  [/\bQuesta istantanea\b/g, 'Questa panoramica'],
  [/La valutazione è una valutazione editoriale delle informazioni disponibili al pubblico\. Non afferma che abbiamo aperto un conto in denaro reale o completato un prelievo con ogni operatore in ogni paese\./g,
    'La valutazione si basa sulle informazioni disponibili al pubblico. Non implica che abbiamo aperto un conto con denaro reale o completato un prelievo presso ogni operatore in ogni paese.'],
  [/\bi controlli più sicuri sono facili da trovare\b/gi, 'gli strumenti per il gioco responsabile sono facili da trovare'],
  [/\bnei condizioni\b/gi, 'nelle condizioni'],
  [/\bdei condizioni\b/gi, 'delle condizioni'],
  [/\bdai condizioni\b/gi, 'dalle condizioni'],
  [/\bai condizioni\b/gi, 'alle condizioni'],
  [/\bsui condizioni\b/gi, 'sulle condizioni'],
  [/\bgli condizioni\b/gi, 'le condizioni'],
  [/\bi condizioni\b/gi, 'le condizioni'],
  [/\bGli attuali condizioni\b/g, 'Le attuali condizioni'],
  [/\bgli attuali condizioni\b/g, 'le attuali condizioni'],
  [/\bnei strumenti\b/gi, 'negli strumenti'],
  [/\bdei strumenti\b/gi, 'degli strumenti'],
  [/\bdai strumenti\b/gi, 'dagli strumenti'],
  [/\bai strumenti\b/gi, 'agli strumenti'],
  [/\bsui strumenti\b/gi, 'sugli strumenti'],
  [/\bi strumenti\b/gi, 'gli strumenti'],
];

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  replacements.forEach(([pattern, replacement]) => { after = after.replace(pattern, replacement); });

  after = after
    .replace(/<h1>([^<]+?) (?:Casino )?Recensione<\/h1>/g, '<h1>Recensione di $1</h1>')
    .replace(/<h1>Recensione del casinò ([^<]+)<\/h1>/g, '<h1>Recensione di $1</h1>')
    .replace(/<h2 class="title">Bonus e istantanea della promozione<\/h2>/g, '<h2 class="title">Bonus e promozioni in sintesi</h2>')
    .replace(/<h2 class="title">([^<]+) Bonus e istantanea della promozione<\/h2>/g, '<h2 class="title">Bonus e promozioni di $1 in sintesi</h2>')
    .replace(/<h2 class="title">([^<]+) Istantanea<\/h2>/g, '<h2 class="title">$1 in sintesi</h2>')
    .replace(/<h2 class="title">([^<]+) Domande frequenti<\/h2>/g, '<h2 class="title">Domande frequenti su $1</h2>')
    .replace(/<h2 class="title">([^<]+) Istantanea di recensione<\/h2>/g, '<h2 class="title">$1 in sintesi</h2>')
    .replace(/<h2 class="title">Istantanea della recensione di ([^<]+)<\/h2>/g, '<h2 class="title">$1 in sintesi</h2>');

  const relative = path.relative(IT_ROOT, file).split(path.sep).join('/');
  if (relative !== 'brands/first/index.html' && relative !== 'casinos-and-betting/index.html') {
    after = after.replace(/\bFirst\b/g, 'primo');
  }
  if (relative === 'casinos-and-betting/index.html') {
    after = after
      .replace(/Bonus del 600% sul tuo deposito in criptovaluta First/g, 'Bonus del 600% sul primo deposito in criptovaluta')
      .replace(/Bonus del 600% sul tuo deposito di criptovaluta First/g, 'Bonus del 600% sul primo deposito in criptovaluta');
  }

  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

// Product names are proper names: restore them from the English homepage.
const sourceHome = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const targetHomePath = path.join(IT_ROOT, 'index.html');
let targetHome = fs.readFileSync(targetHomePath, 'utf8');
const cardPattern = /<a class="home-game-card"[\s\S]*?<img\b[^>]*\balt="([^"]*)"[^>]*>[\s\S]*?<span><strong>([^<]*)<\/strong><small>([^<]*)<\/small>/g;
const sourceCards = [...sourceHome.matchAll(cardPattern)].map(match => ({
  title: match[2],
  brand: match[3].replace(/^at\s+/i, '').trim(),
}));
let cardIndex = 0;
targetHome = targetHome.replace(cardPattern, full => {
  const source = sourceCards[cardIndex++];
  if (!source) return full;
  return full
    .replace(/\balt="[^"]*"/, `alt="Immagine del gioco ${source.title.replaceAll('"', '&quot;')}"`)
    .replace(/<strong>[^<]*<\/strong>/, `<strong>${source.title}</strong>`)
    .replace(/<small>[^<]*<\/small>/, `<small>su ${source.brand}</small>`);
});
fs.writeFileSync(targetHomePath, targetHome);

console.log(`Polished Italian copy on ${changed} pages; restored ${Math.min(cardIndex, sourceCards.length)} game titles.`);
