#!/usr/bin/env node

import fs from 'node:fs';

const rules = {
  de: [
    ['<h1>Casinova Casino- und Sportwetten-Rezension</h1>', '<h1>Casinova Casino- und Sportwetten-Test</h1>'],
    ['<h2 class="title">Warum Spieler Casinova wählen</h2>', '<h2 class="title">Warum sich Spieler für Casinova entscheiden</h2>'],
    ['<h2 class="title">Wem Casinova am besten passt</h2>', '<h2 class="title">Für wen Casinova geeignet ist</h2>'],
    ['<h2 class="title">Casinova Vor- und Nachteile</h2>', '<h2 class="title">Vor- und Nachteile von Casinova</h2>'],
    ['In dieser Überprüfung werden das aktuelle Casino-Paket mit vier Einzahlungen, der Sportbonus, die Zahlungs- und Auszahlungsregeln, die KYC-Anforderungen und die Transparenzgrenzen überprüft, bevor Sie eine Einzahlung tätigen.', 'Dieser Test prüft vor der Einzahlung das aktuelle Casino-Paket über vier Einzahlungen, den Sportbonus, Zahlungs- und Auszahlungsregeln, KYC-Anforderungen sowie die Transparenz des Angebots.'],
  ],
  es: [
    ['<h1>Casinova Revisión de casinos y apuestas deportivas</h1>', '<h1>Reseña de Casinova: casino y apuestas deportivas</h1>'],
    ['<h2 class="title">¿A quién se adapta mejor Casinova?</h2>', '<h2 class="title">Para quién es más adecuado Casinova</h2>'],
  ],
  it: [
    ['<h1>Casinova Recensione di casinò e scommesse sportive</h1>', '<h1>Recensione di Casinova: casinò e scommesse sportive</h1>'],
    ['<h2 class="title">Casinova Bonus casinò: quattro depositi e 350 giri gratuiti</h2>', '<h2 class="title">Bonus casinò Casinova: quattro depositi e 350 giri gratuiti</h2>'],
    ['<h2 class="title">Chi Casinova si adatta meglio</h2>', '<h2 class="title">Per chi è più adatto Casinova</h2>'],
    ['<h2 class="title">Casinova Pro e contro</h2>', '<h2 class="title">Pro e contro di Casinova</h2>'],
  ],
  pl: [
    ['<h1>Casinova Recenzja kasyna i zakładów sportowych</h1>', '<h1>Recenzja Casinova: kasyno i zakłady sportowe</h1>'],
    ['<h2 class="title">Casinova Bonus kasynowy: cztery depozyty i 350 darmowych spinów</h2>', '<h2 class="title">Bonus kasynowy Casinova: cztery wpłaty i 350 darmowych spinów</h2>'],
    ['<h2 class="title">Kto Casinova pasuje najlepiej</h2>', '<h2 class="title">Dla kogo Casinova sprawdzi się najlepiej</h2>'],
    ['<h2 class="title">Casinova Plusy i minusy</h2>', '<h2 class="title">Zalety i wady Casinova</h2>'],
  ],
  uk: [
    ['<h2 class="title">Casinova Бонус казино: чотири депозити та 350 безкоштовних обертань</h2>', '<h2 class="title">Бонус казино Casinova: чотири депозити та 350 фріспінів</h2>'],
    ['<h2 class="title">Casinova Плюси та мінуси</h2>', '<h2 class="title">Переваги та недоліки Casinova</h2>'],
    ['У цьому огляді перевіряється поточний чотиридепозитний пакет казино, спортивний бонус, правила виплати та виплати, вимоги KYC і ліміти прозорості перед внесенням депозиту.', 'У цьому огляді перед депозитом перевіряються актуальний пакет казино на чотири депозити, спортивний бонус, правила платежів і виплат, вимоги KYC та прозорість оператора.'],
    ['Переглянуто: 13 вересня 2026 р. Загальнодоступний сайт і умови розглядає SpinCresta; відсутність депозиту або перевірки виплат.', 'Перевірено 13 вересня 2026 року. SpinCresta проаналізувала відкриту версію сайту й умови; депозитів і тестових виплат ми не проводили.'],
  ],
  pt: [
    ['<h1>Análise de casino e apostas desportivas Casinova</h1>', '<h1>Análise da Casinova: casino e apostas desportivas</h1>'],
    ['<h2 class="title">Jogo responsável e Segurança do Jogador</h2>', '<h2 class="title">Jogo responsável e segurança do jogador</h2>'],
    ['<h2 class="title">Quem Casinova combina melhor</h2>', '<h2 class="title">Para quem a Casinova é mais indicada</h2>'],
  ],
  fr: [
    ['<h1>Casinova Revue de casino et de paris sportifs</h1>', '<h1>Avis sur Casinova : casino et paris sportifs</h1>'],
    ['<h2 class="title">Transparence des opérateurs, assistance et accès mobile</h2>', '<h2 class="title">Transparence de l’opérateur, assistance et accès mobile</h2>'],
    ['<h2 class="title">Qui Casinova convient le mieux</h2>', '<h2 class="title">À qui Casinova convient le mieux</h2>'],
    ['<h2 class="title">Casinova Avantages et inconvénients</h2>', '<h2 class="title">Avantages et inconvénients de Casinova</h2>'],
    ['Révision : 13 septembre 2026. Révision du site public et des conditions par SpinCresta ; aucun test de dépôt ou de paiement.', 'Évaluation du 13 septembre 2026. SpinCresta a étudié le site public et ses conditions, sans effectuer de dépôt ni tester de retrait.'],
  ],
  hi: [
    ['<h1>Casinova कैसीनो और स्पोर्ट्सबुक समीक्षा</h1>', '<h1>Casinova कैसीनो और स्पोर्ट्सबुक की समीक्षा</h1>'],
    ['<h2 class="title">कौन Casinova सबसे उपयुक्त है</h2>', '<h2 class="title">Casinova किसके लिए सबसे उपयुक्त है</h2>'],
    ['<h2 class="title">Casinova फायदे और नुकसान</h2>', '<h2 class="title">Casinova के फायदे और नुकसान</h2>'],
  ],
  fi: [
    ['<h2 class="title">Miksi pelaajat valitsevat Casinova</h2>', '<h2 class="title">Miksi pelaajat valitsevat Casinovan</h2>'],
    ['<h2 class="title">Casinova Kasinobonus: Neljä talletusta ja 350 ilmaiskierrosta</h2>', '<h2 class="title">Casinovan kasinobonus: neljä talletusta ja 350 ilmaiskierrosta</h2>'],
  ],
};

for (const [locale, replacements] of Object.entries(rules)) {
  const file = `${locale}/brands/casinova/index.html`;
  let html = fs.readFileSync(file, 'utf8');
  for (const [from, to] of replacements) html = html.replaceAll(from, to);
  fs.writeFileSync(file, html);
}

console.log('Polished Casinova headings and key editorial copy in 9 locales.');
