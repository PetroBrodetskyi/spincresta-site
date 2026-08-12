#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const entries = {
  it: {
    'brands/betzino-fr/index.html': ['Betzino Francia 2026: recensione, bonus e pagamenti', 'Betzino Francia: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori francesi. Controlla le condizioni aggiornate.'],
    'brands/casinopeaches-fr/index.html': ['Casino Peaches Francia 2026: recensione e bonus', 'Casino Peaches Francia: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori francesi. Controlla le condizioni aggiornate.'],
    'brands/fortunica-es/index.html': ['Fortunica Spagna 2026: recensione, bonus e pagamenti', 'Fortunica Spagna: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori spagnoli. Controlla le condizioni aggiornate.'],
    'brands/fortunica-nl/index.html': ['Fortunica Paesi Bassi 2026: recensione e bonus', 'Fortunica Paesi Bassi: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori olandesi. Controlla le condizioni aggiornate.'],
    'brands/fortunica-uk/index.html': ['Fortunica Regno Unito 2026: recensione e bonus', 'Fortunica Regno Unito: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori britannici. Controlla le condizioni aggiornate.'],
    'brands/fraga-ar/index.html': ['Fraga Argentina 2026: recensione, bonus e pagamenti', 'Fraga Argentina: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori argentini. Controlla le condizioni aggiornate.'],
    'brands/fraga-az/index.html': ['Fraga Azerbaigian 2026: recensione, bonus e pagamenti', 'Fraga Azerbaigian: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori azeri. Controlla le condizioni aggiornate.'],
    'brands/fraga-cl/index.html': ['Fraga Cile 2026: recensione, bonus e pagamenti', 'Fraga Cile: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori cileni. Controlla le condizioni aggiornate.'],
    'brands/fraga-tr/index.html': ['Fraga Turchia 2026: recensione, bonus e pagamenti', 'Fraga Turchia: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori turchi. Controlla le condizioni aggiornate.'],
    'brands/letsjackpot-fr/index.html': ["Let's Jackpot Francia 2026: recensione e bonus", "Let's Jackpot Francia: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori francesi. Controlla le condizioni aggiornate."],
    'brands/uspin-fr/index.html': ['Uspin Francia 2026: recensione, bonus e pagamenti', 'Uspin Francia: bonus, giochi, pagamenti, prelievi, verifica KYC e disponibilità per i giocatori francesi. Controlla le condizioni aggiornate.'],
  },
  pl: {
    'brands/betzino-fr/index.html': ['Betzino Francja 2026 | Recenzja, bonusy i wypłaty', 'Betzino Francja: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Francji. Przed grą sprawdź aktualne warunki.'],
    'brands/casinopeaches-fr/index.html': ['Casino Peaches Francja 2026 | Recenzja i bonusy', 'Casino Peaches Francja: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Francji. Przed grą sprawdź aktualne warunki.'],
    'brands/fortunica-es/index.html': ['Fortunica Hiszpania 2026 | Recenzja i bonusy', 'Fortunica Hiszpania: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Hiszpanii. Przed grą sprawdź aktualne warunki.'],
    'brands/fortunica-nl/index.html': ['Fortunica Holandia 2026 | Recenzja i bonusy', 'Fortunica Holandia: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Holandii. Przed grą sprawdź aktualne warunki.'],
    'brands/fortunica-uk/index.html': ['Fortunica Wielka Brytania 2026 | Recenzja i bonusy', 'Fortunica Wielka Brytania: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Wielkiej Brytanii. Sprawdź aktualne warunki.'],
    'brands/fraga-ar/index.html': ['Fraga Argentyna 2026 | Recenzja, bonusy i wypłaty', 'Fraga Argentyna: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Argentyny. Przed grą sprawdź aktualne warunki.'],
    'brands/fraga-az/index.html': ['Fraga Azerbejdżan 2026 | Recenzja i bonusy', 'Fraga Azerbejdżan: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Azerbejdżanu. Przed grą sprawdź aktualne warunki.'],
    'brands/fraga-cl/index.html': ['Fraga Chile 2026 | Recenzja, bonusy i wypłaty', 'Fraga Chile: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Chile. Przed grą sprawdź aktualne warunki.'],
    'brands/fraga-tr/index.html': ['Fraga Turcja 2026 | Recenzja, bonusy i wypłaty', 'Fraga Turcja: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Turcji. Przed grą sprawdź aktualne warunki.'],
    'brands/letsjackpot-fr/index.html': ["Let's Jackpot Francja 2026 | Recenzja i bonusy", "Let's Jackpot Francja: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Francji. Przed grą sprawdź aktualne warunki."],
    'brands/uspin-fr/index.html': ['Uspin Francja 2026 | Recenzja, bonusy i wypłaty', 'Uspin Francja: bonusy, gry, płatności, wypłaty, KYC i dostępność dla graczy z Francji. Przed grą sprawdź aktualne warunki.'],
  },
  uk: {
    'brands/betzino-fr/index.html': ['Betzino Франція: огляд 2026 | Бонуси та виплати', 'Betzino Франція: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Франції. Перед грою перевірте актуальні умови.'],
    'brands/casinopeaches-fr/index.html': ['Casino Peaches Франція: огляд 2026 | Бонуси', 'Casino Peaches Франція: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Франції. Перевірте актуальні умови.'],
    'brands/fortunica-es/index.html': ['Fortunica Іспанія: огляд 2026 | Бонуси та виплати', 'Fortunica Іспанія: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців з Іспанії. Перед грою перевірте актуальні умови.'],
    'brands/fortunica-nl/index.html': ['Fortunica Нідерланди: огляд 2026 | Бонуси', 'Fortunica Нідерланди: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Нідерландів. Перевірте актуальні умови.'],
    'brands/fortunica-uk/index.html': ['Fortunica Велика Британія: огляд 2026 | Бонуси', 'Fortunica Велика Британія: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Великої Британії. Перевірте актуальні умови.'],
    'brands/fraga-ar/index.html': ['Fraga Аргентина: огляд 2026 | Бонуси та виплати', 'Fraga Аргентина: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців з Аргентини. Перед грою перевірте актуальні умови.'],
    'brands/fraga-az/index.html': ['Fraga Азербайджан: огляд 2026 | Бонуси та виплати', 'Fraga Азербайджан: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців з Азербайджану. Перевірте актуальні умови.'],
    'brands/fraga-cl/index.html': ['Fraga Чилі: огляд 2026 | Бонуси та виплати', 'Fraga Чилі: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Чилі. Перед грою перевірте актуальні умови.'],
    'brands/fraga-tr/index.html': ['Fraga Туреччина: огляд 2026 | Бонуси та виплати', 'Fraga Туреччина: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Туреччини. Перевірте актуальні умови.'],
    'brands/letsjackpot-fr/index.html': ["Let's Jackpot Франція: огляд 2026 | Бонуси", "Let's Jackpot Франція: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Франції. Перевірте актуальні умови."],
    'brands/uspin-fr/index.html': ['Uspin Франція: огляд 2026 | Бонуси та виплати', 'Uspin Франція: бонуси, ігри, способи оплати, виплати, KYC та доступність для гравців із Франції. Перед грою перевірте актуальні умови.'],
  },
};

let changed = 0;
for (const [locale, pages] of Object.entries(entries)) {
  for (const [relative, [title, description]] of Object.entries(pages)) {
    const file = path.join(ROOT, locale, relative);
    const before = fs.readFileSync(file, 'utf8');
    const oldTitle = before.match(/<title>([\s\S]*?)<\/title>/i)?.[1];
    const oldDescription = before.match(/<meta\s+name="description"\s+content="([^"]+)"/i)?.[1]
      || before.match(/<meta\s+name="description"[\s\S]*?content="([^"]+)"/i)?.[1];
    let after = before;
    if (oldTitle) after = after.split(oldTitle).join(title);
    if (oldDescription) after = after.split(oldDescription).join(description);
    if (after === before) continue;
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

console.log(`Optimized localized geo-variant SEO on ${changed} pages.`);
