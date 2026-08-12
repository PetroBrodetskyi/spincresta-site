#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ES_ROOT = path.join(ROOT, 'es');
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(ES_ROOT);

const replacements = [
  [/Casino Casino/g, 'Casino'],
  [/\bPiensa dos veces si\b/gi, 'Puede no ser ideal si'],
  [/\bPiénselo dos veces,? si\b/gi, 'Puede no ser ideal si'],
  [/\bcaparazón de bonificación única\b/gi, 'oferta con un único bono'],
  [/\bcaparazón adicional de una página\b/gi, 'sitio de bonos de una sola página'],
  [/\bcaparazón plano para todos los juegos\b/gi, 'página única de juegos sin filtros'],
  [/\bLa construcción actual del sitio Wildsino incorpora un sello de verificación de Anjouan Gaming\b/gi, 'El sitio de Wildsino muestra un distintivo de verificación de Anjouan Gaming'],
  [/\bLa construcción actual del sitio incorpora un sello de verificación de Anjouan(?: Gaming)?\b/gi, 'El sitio muestra un distintivo de verificación de Anjouan Gaming'],
  [/\bLa configuración actual del sitio carga un sello de verificación de Anjouan Gaming\b/gi, 'El sitio muestra un distintivo de verificación de Anjouan Gaming'],
  [/\bel página de verificación\b/gi, 'la página de verificación'],
  [/\bacceso web móvil\b/gi, 'versión móvil del sitio'],
  [/\bFogonadura\b/g, 'Socios'],
  [/\bHogar\b/g, 'Inicio'],
  [/\bTelegrama\b/g, 'Telegram'],
  [/>política de privacidad</g, '>Política de privacidad<'],
  [/>Prima:</g, '>Bono:<'],
  [/>Prima</g, '>Bono<'],
  [/Por favor, juega responsablemente\./g, 'Juegue de forma responsable.'],
  [/soporte 24 horas al día, 7 días a la semana/gi, 'soporte 24/7'],
  [/críticas positivas/gi, 'reseñas positivas'],
  [/controles de la realidad/gi, 'recordatorios de realidad'],
  [/\bjuegos intensivos\b/gi, 'juegos crash'],
  [/\bpremios mayores\b/gi, 'jackpots'],
  [/\branuras\b/gi, 'tragamonedas'],
  [/\branura\b/gi, 'tragamonedas'],
  [/\bvestíbulos\b/gi, 'lobbies'],
  [/\bvestíbulo\b/gi, 'lobby'],
  [/\bcajero en vivo\b/gi, 'cajero de la cuenta'],
  [/\bcajero actual\b/gi, 'cajero de la cuenta'],
  [/\bprogramas de juegos\b/gi, 'juegos tipo concurso'],
  [/\bjuegos de azar más seguros\b/gi, 'juego responsable'],
  [/\bjuego más seguros\b/gi, 'juego responsable'],
  [/\bjuego más seguro\b/gi, 'juego responsable'],
  [/\bBusque apoyo\b/g, 'Busque soporte'],
  [/\brecursos de apoyo\b/gi, 'recursos de ayuda'],
  [/\bservicios de apoyo\b/gi, 'servicios de ayuda'],
  [/\bcopia de marketing\b/gi, 'texto promocional'],
  [/\bse acabó el tiempo\b/gi, 'pausas temporales'],
  [/\bmirrors\b/gi, 'dominios alternativos'],
  [/\bmirror\b/gi, 'dominio alternativo'],
  [/centro de cifrado/gi, 'centro de criptomonedas'],
  [/opciones de cifrado/gi, 'opciones de criptomonedas'],
  [/\bCheques\b/g, 'Comprobaciones'],
  [/\bcheques\b/g, 'comprobaciones'],
  [/\bCheque\b/g, 'Comprobación'],
  [/\bcheque\b/g, 'comprobación'],
  [/términos de bonificación/gi, 'condiciones del bono'],
  [/condiciones de bonificación/gi, 'condiciones del bono'],
  [/bonos de bienvenida con coincidencias de depósitos?/gi, 'bonos de bienvenida con porcentaje sobre el depósito'],
  [/coincidencias de depósitos?/gi, 'bonos por depósito'],
  [/bono de por vida/gi, 'vigencia del bono'],
  [/\bCuantos\b/g, 'Cuántos'],
  [/\bmonedas de barrido\b/gi, 'Sweep Coins'],
  [/\breglas de los barridos\b/gi, 'reglas del sorteo'],
  [/\breglas de barrido\b/gi, 'reglas del sorteo'],
  [/\bRutas de barrido\b/g, 'Formas de participación en el sorteo'],
  [/Revisión del casino ([^<"|]+)/g, 'Reseña de $1'],
  [/Revisión independiente/gi, 'Reseña independiente'],
  [/Revisión experta/gi, 'Reseña experta'],
  [/revisión útil/gi, 'reseña útil'],
  [/revisión del operador/gi, 'reseña del operador'],
  [/Durante nuestra revisión/gi, 'Durante nuestro análisis'],
  [/Pros y contras de los jugadores reales/gi, 'Ventajas y desventajas para jugadores reales'],
  [/Promociones, lealtad y juegos de azar más seguros/gi, 'Promociones, fidelidad y juego responsable'],
  [/Casinos en línea\. Mejor elegido\./g, 'Casinos online. Mejor seleccionados.'],
  [/Los mejores casinos\. Mundial\./g, 'Los mejores casinos del mundo.'],
  [/Encuentre la guía de su país/g, 'Encuentre la guía para su país'],
  [/¿Qué guías de casinos de países comparan\?/g, 'Qué comparan nuestras guías por país'],
  [/Avances del lobby del casino/g, 'Vistas previas de casinos'],
  [/RECIÉN DE LOBBIES REVISADOS/g, 'NOVEDADES DE CASINOS ANALIZADOS'],
  [/MÁS DE UN NÚMERO DE BONIFICACIÓN/g, 'MÁS QUE UNA CIFRA DE BONO'],
  [/SELECCIONADO DE LA DEMANDA DE BÚSQUEDA/g, 'SELECCIONADOS SEGÚN DATOS DE BÚSQUEDA'],
  [/Busque apoyo y controles de juego responsable\./g, 'Busque soporte y controles de juego responsable'],
  [/Apoyo y juego responsable/g, 'Soporte y juego responsable'],
  [/casino y apuestas deportivas/gi, 'casino y casa de apuestas deportivas'],
  [/rotación del depósito/gi, 'requisito de apuesta del depósito'],
  [/rotación de depósitos/gi, 'requisitos de apuesta de los depósitos'],
  [/\bLas apuestas x(\d+)\b/g, 'El requisito de apuesta x$1'],
  [/\blas apuestas x(\d+)\b/g, 'el requisito de apuesta x$1'],
  [/\bcon apuestas x(\d+)\b/gi, 'con un requisito de apuesta x$1'],
  [/\bincluyen apuestas x(\d+)\b/gi, 'incluyen un requisito de apuesta x$1'],
  [/\bimplican apuestas x(\d+)\b/gi, 'implican un requisito de apuesta x$1'],
  [/\bconllevan apuestas x(\d+)\b/gi, 'conllevan un requisito de apuesta x$1'],
  [/\btiene apuestas x(\d+)\b/gi, 'tiene un requisito de apuesta x$1'],
  [/\bestablece apuestas x(\d+)\b/gi, 'establece un requisito de apuesta x$1'],
  [/\bindica apuestas x(\d+)\b/gi, 'indica un requisito de apuesta x$1'],
  [/\bApuestas (\d+)x\b/g, 'Requisito de apuesta x$1'],
  [/\bapuestas (\d+)x\b/g, 'requisito de apuesta x$1'],
  [/\bFirst-come-First\b/g, 'por orden de llegada'],
  [/depósito criptográfico First/gi, 'primer depósito con criptomonedas'],
  [/\bCasino-First Navegación\b/g, 'Navegación centrada en el casino'],
  [/\bPosicionamiento Casino-First\b/g, 'Posicionamiento centrado en el casino'],
  [/\bJugadores de Casino-First\b/g, 'Jugadores centrados en el casino'],
  [/\bUsuarios de Casino-First\b/g, 'Usuarios centrados en el casino'],
  [/\bVestíbulo del Casino-First\b/g, 'Lobby centrado en el casino'],
  [/\bEstructura Casino-First\b/g, 'Estructura centrada en el casino'],
  [/\bCasino-First Valor\b/g, 'Valor centrado en el casino'],
  [/\bCasino-First Flujo de dinero\b/g, 'Flujo de dinero centrado en el casino'],
  [/\bCasino-First, no solo para apuestas\b/g, 'Centrado en el casino, no solo en las apuestas'],
  [/\bLos jugadores de Casino-First aún se benefician\b/g, 'Los jugadores centrados en el casino también se benefician'],
  [/\bCasino-First\b/g, 'centrado en el casino'],
  [/\bCrypto-First\b/g, 'centrado en las criptomonedas'],
  [/\bMóvil-First Acceso\b/g, 'Acceso prioritario desde el móvil'],
  [/\bMóvil-First Suficiente\b/g, 'Buena experiencia móvil'],
  [/\bReproductores móviles-First\b/g, 'Jugadores que priorizan el móvil'],
  [/\bDeportes-First Jugadores\b/g, 'Jugadores centrados en los deportes'],
  [/\bJugadores de Cricket-First\b/g, 'Jugadores centrados en el críquet'],
  [/\bFiltro-First Jugadores de tragamonedas\b/g, 'Jugadores de tragamonedas que priorizan los filtros'],
  [/\bEsports-First Apuestas deportivas\b/g, 'Apuestas deportivas centradas en esports'],
  [/\bAjuste criptográfico-First\b/g, 'Ideal para usuarios de criptomonedas'],
  [/\bBeneficios de Crypto-First\b/g, 'Ventajas para usuarios de criptomonedas'],
  [/\bÁngulo criptográfico-First\b/g, 'Enfoque en criptomonedas'],
  [/\bLeer términos de bonificación First\b/g, 'Leer primero las condiciones del bono'],
  [/\bLeer los términos de la oferta First\b/g, 'Leer primero las condiciones de la oferta'],
  [/\bLea las preguntas frecuentes sobre pagos First\b/g, 'Lea primero las preguntas frecuentes sobre pagos'],
  [/\bJugadores que leen las reglas First\b/g, 'Jugadores que leen primero las reglas'],
  [/\bPaso 1: Verifique el Cajero First\b/g, 'Paso 1: revise primero el cajero'],
  [/\bConsultar el Cajero First\b/g, 'Consultar primero el cajero'],
  [/\bCheques de retiro First\b/g, 'Comprobaciones antes del primer retiro'],
  [/\bRanuras First\b/g, 'Prioridad a las tragamonedas'],
  [/\bReglas First\b/g, 'Revisar primero las reglas'],
  [/\bTérminos First\b/g, 'Revisar primero las condiciones'],
  [/\bEmpezar poco a poco First\b/g, 'Empezar primero con poco dinero'],
  [/\bLiga Profesional First\b/g, 'Primera Liga Profesional'],
  [/en el informe de bonificación actual/gi, 'según las condiciones actuales del bono'],
  [/El informe pide a los jugadores/gi, 'Las condiciones indican a los jugadores'],
  [/El informe limita explícitamente/gi, 'Las condiciones limitan explícitamente'],
  [/en el informe de bonificación actual/gi, 'en las condiciones actuales del bono'],
  [/El informe también dice/gi, 'Las condiciones también indican'],
  [/archivo de bonificación/gi, 'documento de condiciones del bono'],
];

const polish = (html, file) => {
  let result = html;
  replacements.forEach(([pattern, replacement]) => { result = result.replace(pattern, replacement); });

  const relative = path.relative(ES_ROOT, file).split(path.sep).join('/');
  if (relative.startsWith('brands/')) {
    result = result
      .replace(/<title>Revisión de /g, '<title>Reseña de ')
      .replace(/content="Revisión de /g, 'content="Reseña de ')
      .replace(/"name": "Revisión de /g, '"name": "Reseña de ')
      .replace(/"description": "Revisión de /g, '"description": "Reseña de ')
      .replace(/<h1>Revisión de /g, '<h1>Reseña de ');
  }
  if (relative !== 'brands/first/index.html' && relative !== 'casinos-and-betting/index.html') {
    result = result.replace(/\bFirst\b/g, 'primero');
  }

  result = result
    .replace(/\s*<meta\b[^>]*name=["']keywords["'][^>]*>/gi, '')
    .replace(/depósito (?:de|en) primero/gi, 'primer depósito')
    .replace(/depósito criptográfico primero/gi, 'primer depósito con criptomonedas')
    .replace(/retiros de primero/gi, 'primeros retiros')
    .replace(/retiro de primero/gi, 'primer retiro')
    .replace(/<td>primero<\/td>/gi, '<td>Primer depósito</td>')
    .replace(/\bPrimero, las ofertas de segundo/gi, 'La primera oferta y las de segundo')
    .replace(/\bcajero primero\b/gi, 'cajero antes de depositar')
    .replace(/\bCódigo PRIMERO\b/g, 'Código FIRST')
    .replace(/\bcódigo PRIMERO\b/g, 'código FIRST');

  return result;
};

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  const relative = path.relative(ES_ROOT, file);
  const sourceFile = path.join(ROOT, relative);
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, 'utf8') : '';
  const sourceCodes = [...source.matchAll(/\bcode\s+([A-Z0-9]{3,})\b/g)].map(match => match[1]);
  let codeIndex = 0;
  const after = polish(before, file).replace(/\bcódigo\s+([A-ZÁÉÍÓÚÑ0-9]{3,})\b/g, full => {
    const sourceCode = sourceCodes[codeIndex++];
    return sourceCode ? `código ${sourceCode}` : full;
  });
  if (after === before) continue;
  fs.writeFileSync(file, after);
  changed += 1;
}

// Casino game titles are product names, so keep the original spelling on the homepage.
const homeSource = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const homeTargetPath = path.join(ES_ROOT, 'index.html');
let homeTarget = fs.readFileSync(homeTargetPath, 'utf8');
const cardPattern = /<a class="home-game-card"[\s\S]*?<img\b[^>]*\balt="([^"]*)"[^>]*>[\s\S]*?<span><strong>([^<]*)<\/strong>/g;
const sourceCards = [...homeSource.matchAll(cardPattern)].map(match => ({ alt: match[1], title: match[2] }));
let cardIndex = 0;
homeTarget = homeTarget.replace(cardPattern, (full, alt, title) => {
  const sourceCard = sourceCards[cardIndex++];
  if (!sourceCard) return full;
  return full.replace(`alt="${alt}"`, `alt="${sourceCard.alt}"`).replace(`<strong>${title}</strong>`, `<strong>${sourceCard.title}</strong>`);
});
fs.writeFileSync(homeTargetPath, homeTarget);

console.log(`Polished Spanish copy on ${changed} pages; restored ${Math.min(cardIndex, sourceCards.length)} game titles.`);
