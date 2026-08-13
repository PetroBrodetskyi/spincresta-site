#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FR_ROOT = path.join(ROOT, 'fr');
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(FR_ROOT);

const replacements = [
  [/Examens fiables de plates-formes sous licence avec prise en charge UPI, Paytm et INR pour les joueurs indiens\./g, 'Sélection de plateformes sous licence proposant UPI, Paytm et les paiements en INR aux joueurs indiens.'],
  [/Examens fiables des plates-formes sous licence avec support EasyEFT, Ozow, Sid Instant EFT, ZAR, bonus exclusifs et meilleurs jeux pour les joueurs sud-africains/g, 'Sélection de plateformes sous licence proposant EasyEFT, Ozow, Sid Instant EFT, les paiements en ZAR, des bonus exclusifs et une offre de jeux adaptée aux joueurs sud-africains.'],
  [/"name": "Examen du ([^"]+)"/g, '"name": "Avis sur $1"'],
  [/"name": "Examen ([^"]+)"/g, '"name": "Avis sur $1"'],
  [/"name": "([^"]+) Examen"/g, '"name": "Avis sur $1"'],
  [/"name": "Revue du casino ([^"]+)"/g, '"name": "Avis sur $1"'],
  [/La révision complète du ([^<]+) est en cours/g, 'L’avis complet sur $1 est en préparation'],
  [/aria-label="Statut de l'examen"/g, 'aria-label="Statut de l’avis"'],
  [/<span>Revue en préparation<\/span>/g, '<span>Avis en préparation</span>'],
  [/"name": "Maison"/g, '"name": "Accueil"'],
  [/>Maison</g, '>Accueil<'],
  [/Expert en jeux vidéo/g, 'Experte iGaming'],
  [/expert en jeux vidéo/g, 'experte iGaming'],
  [/outils de jeu plus sûr/gi, 'outils de jeu responsable'],
  [/contrôles de jeu plus sûr/gi, 'outils de jeu responsable'],
  [/contrôles de jeu plus sûrs/gi, 'outils de jeu responsable'],
  [/bases d'un jeu plus sûr/gi, 'principes du jeu responsable'],
  [/jeu plus sûr/gi, 'jeu responsable'],
  [/jouer plus sûr/gi, 'jouer de manière responsable'],
  [/limites des caissiers/gi, 'limites de paiement'],
  [/limites du caissier/gi, 'limites de paiement'],
  [/limites de caissier/gi, 'limites de paiement'],
  [/options de caissier/gi, 'options de paiement'],
  [/adéquation du ([A-Z]{3}) et du caissier/gi, 'prise en charge du $1 et des moyens de paiement'],
  [/auprès du caissier/gi, 'dans la caisse'],
  [/offre de caissier/gi, 'offre disponible dans la caisse'],
  [/Caissier spécifique au pays/gi, 'Paiements selon le pays'],
  [/Caissier en euros/gi, 'Paiements en euros'],
  [/Caissier EUR/gi, 'Paiements en EUR'],
  [/Caissier UAH/gi, 'Paiements en UAH'],
  [/Caissier de cartes, de banques et de crypto-monnaies/gi, 'Cartes, banques et cryptomonnaies'],
  [/questions urgentes du caissier/gi, 'questions urgentes sur les paiements'],
  [/confort du caissier/gi, 'facilité d’utilisation de la caisse'],
  [/vérification du caissier/gi, 'vérification des moyens de paiement'],
  [/disponibilité exacte du caissier/gi, 'disponibilité exacte des moyens de paiement'],
  [/\bCaissier\b/g, 'Paiements'],
  [/\bcaissier\b/g, 'paiements'],
  [/crypto-caissiers/gi, 'cryptomonnaies'],
  [/le caissier/gi, 'la caisse'],
  [/un caissier/gi, 'une caisse'],
  [/des caissiers/gi, 'des caisses'],
  [/les caissiers/gi, 'les caisses'],
  [/itinéraires de paiement/gi, 'moyens de paiement'],
  [/itinéraires de dépôt/gi, 'moyens de dépôt'],
  [/itinéraires de retrait/gi, 'moyens de retrait'],
  [/itinéraires de portefeuille/gi, 'options de portefeuille électronique'],
  [/itinéraires cryptographiques/gi, 'options de cryptomonnaies'],
  [/itinéraires bancaires/gi, 'options bancaires'],
  [/itinéraires Bitcoin, Bitcoin Cash, Dogecoin, Ethereum, Litecoin et USDT/gi, 'options Bitcoin, Bitcoin Cash, Dogecoin, Ethereum, Litecoin et USDT'],
  [/itinéraire complet/gi, 'parcours complet'],
  [/itinéraire de paiement/gi, 'moyen de paiement'],
  [/itinéraire de retrait/gi, 'moyen de retrait'],
  [/itinéraire garanti/gi, 'moyen garanti'],
  [/meilleur itinéraire/gi, 'moyen le plus adapté'],
  [/itinéraires? de virement bancaire/gi, 'options de virement bancaire'],
  [/itinéraires? de dépôt et de retrait/gi, 'moyens de dépôt et de retrait'],
  [/itinéraires? de dépôt/gi, 'moyens de dépôt'],
  [/rails cryptographiques/gi, 'options de cryptomonnaies'],
  [/rails de cryptomonnaies/gi, 'options de cryptomonnaies'],
  [/chèques de pays/gi, 'vérifications par pays'],
  [/chèques bancaires/gi, 'vérifications bancaires'],
  [/chèques de paiement/gi, 'vérifications de paiement'],
  [/chèques KYC/gi, 'vérifications KYC'],
  [/critiques de casinos/gi, 'avis sur les casinos'],
  [/critiques de casino/gi, 'avis sur les casinos'],
  [/critique de casino/gi, 'avis sur le casino'],
  [/critiques détaillées de marques/gi, 'avis détaillés sur les marques'],
  [/copie marketing/gi, 'discours marketing'],
  [/itinéraires pratiques des comptes/gi, 'étapes pratiques liées au compte'],
  [/commandes de jeu responsablees/gi, 'outils de jeu responsable'],
  [/commandes de jeu responsable/gi, 'outils de jeu responsable'],
  [/responsablees/gi, 'responsable'],
  [/Blogue/g, 'Blog'],
  [/EXAMENS DE CASINO INDÉPENDANTS/g, 'AVIS INDÉPENDANTS SUR LES CASINOS'],
  [/Guides pays/g, 'Guides par pays'],
  [/>Exclusif</g, '>Exclusivités<'],
  [/>Examen du ([^<]+) à venir</g, '>Avis sur $1 à venir<'],
  [/>La revue ([^<]+) sera bientôt disponible</gi, '>L’avis sur $1 sera bientôt disponible<'],
  [/>Examen ([^<]+)</g, '>Avis sur $1<'],
  [/>Revue du casino ([^<]+)</g, '>Avis sur $1<'],
  [/>Revue de casino et de paris sportifs</g, '>Avis sur le casino et les paris sportifs<'],
  [/>Revue des paris sur les casinos et les sports électroniques ([^<]+)</g, '>Avis sur $1 : casino et paris e-sport<'],
  [/([A-Za-z0-9.'’ -]+) Revue du casino 2026/g, 'Avis $1 2026'],
  [/([A-Za-z0-9.'’ -]+) Revue 2026/g, 'Avis $1 2026'],
  [/Revue du casino ([A-Za-z0-9.'’ -]+) 2026/g, 'Avis $1 2026'],
  [/Revue de ([A-Za-z0-9.'’ -]+) 2026/g, 'Avis $1 2026'],
  [/\bCet examen vérifie\b/g, 'Cet avis présente'],
  [/\bCet examen examine\b/g, 'Cet avis analyse'],
  [/\bCet examen\b/g, 'Cet avis'],
  [/\bcet examen\b/g, 'cet avis'],
  [/\bUn examen utile\b/g, 'Un avis utile'],
  [/\bun examen utile\b/g, 'un avis utile'],
  [/\bExamen des casinos\b/g, 'Avis sur les casinos'],
  [/\bExamens et vérifications des joueurs\b/g, 'Avis et informations pour les joueurs'],
  [/\bRevues et guides de pays\b/g, 'Avis et guides par pays'],
  [/([A-Za-z0-9.'’ -]+) Revue du Royaume-Uni 2026/g, 'Avis $1 au Royaume-Uni 2026'],
  [/([A-Za-z0-9.'’ -]+) Revue de l’Azerbaïdjan 2026/g, 'Avis $1 en Azerbaïdjan 2026'],
  [/([A-Za-z0-9.'’ -]+) Revue du Chili 2026/g, 'Avis $1 au Chili 2026'],
  [/([A-Za-z0-9.'’ -]+) Revue des casinos et paris en Espagne 2026/g, 'Avis $1 en Espagne 2026'],
  [/([A-Za-z0-9.'’ -]+) Revue des casinos et paris au Royaume-Uni 2026/g, 'Avis $1 au Royaume-Uni 2026'],
  [/>((?:Leon|Wildsino|Velobet|GETX|LuckyHunter|WestAce)) Revue de casino et de paris sportifs</g, '>Avis $1 : casino et paris sportifs<'],
  [/>Fortunica Revue des casinos et des paris</g, '>Avis Fortunica : casino et paris<'],
  [/Revue des casinos et des paris sportifs/gi, 'Avis sur le casino et les paris sportifs'],
  [/Examen des casinos et paris sportifs/gi, 'Avis sur le casino et les paris sportifs'],
  [/Examen des casinos et des paris sportifs/gi, 'Avis sur le casino et les paris sportifs'],
  [/Examen du casino et des paris sportifs/gi, 'Avis sur le casino et les paris sportifs'],
  [/Examen de la marque/gi, 'Avis sur la marque'],
  [/Examen SpinBoss/gi, 'Avis SpinBoss'],
  [/SpinBoss Revue/gi, 'Avis SpinBoss'],
  [/Bon ajustement/gi, 'Idéal pour'],
  [/Meilleur ajustement/gi, 'Idéal pour'],
  [/Réfléchissez à deux fois si/gi, 'Peut ne pas convenir si'],
  [/Signal d'Anjouan/gi, 'Licence d’Anjouan'],
  [/plaintes@spinboss\.com/gi, 'complaints@spinboss.com'],
  [/plaintes@(longfu88|westace|wildsino)\.com/gi, 'complaints@$1.com'],
  [/confidentialité@spincresta\.com/gi, 'privacy@spincresta.com'],
  [/info-fr@betwinner\.com/gi, 'info-en@betwinner.com'],
  [/Jouez maintenant/g, 'Jouer'],
  [/Visitez le casino/g, 'Jouer'],
  [/Visiter le casino/g, 'Jouer'],
  [/politique de confidentialité/g, 'Politique de confidentialité'],
  [/Copyright 2026 SpinCresta\.com\. Tous droits réservés\./g, '© 2026 SpinCresta.com. Tous droits réservés.'],
  [/De brefs documents décrivent 174 tables de croupiers en direct, des tables en langue maternelle et des itinéraires VIP en direct, ce qui aide les joueurs qui ne souhaitent pas un compte uniquement à rouleaux\./g,
    'Le catalogue comprend 174 tables avec croupiers en direct, des tables dans plusieurs langues et des espaces VIP, ce qui convient aux joueurs qui recherchent davantage que des machines à sous.'],
  [/De brefs documents soulignent également Bitcoin, Ethereum, Litecoin, Tether, TRON et d’autres options de cryptomonnaies, ce qui correspond au positionnement international plus large de iWild\./g,
    'Bitcoin, Ethereum, Litecoin, Tether, TRON et d’autres cryptomonnaies complètent l’offre internationale de iWild.'],
  [/Les documents brefs et la couverture publique de Snatch répertorient généralement les cartes, les portefeuilles électroniques, Apple Pay, Google Pay, les virements bancaires et plusieurs options de cryptomonnaies, ce qui est plus intéressant qu'un casino à paiement unique\./g,
    'Snatch propose généralement les cartes, les portefeuilles électroniques, Apple Pay, Google Pay, les virements bancaires et plusieurs cryptomonnaies, offrant ainsi davantage de flexibilité qu’un casino limité à un seul moyen de paiement.'],
  [/De brefs documents relient également Snatch au virement bancaire et à plusieurs modes de paiement alternatifs, ce qui offre plus de flexibilité qu'une caisse utilisant uniquement des cartes\./g,
    'Le virement bancaire et plusieurs moyens de paiement alternatifs offrent davantage de flexibilité que les cartes seules.'],
  [/De brefs documents décrivent un pack bonus de 500 % plus 400 tours gratuits répartis sur quatre dépôts, ce qui rend Ybets plus structuré qu'une promotion d'inscription en un seul coup\./g,
    'Ybets présente une offre de bienvenue de 500 % et 400 tours gratuits répartis sur quatre dépôts, plutôt qu’un avantage limité au premier versement.'],
];

let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  for (const [pattern, replacement] of replacements) html = html.replace(pattern, replacement);
  if (html !== original) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Polished French copy on ${changed}/${files.length} pages.`);
