#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PL_ROOT = path.join(ROOT, 'pl');
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(PL_ROOT);

const replacements = [
  [/\bkontrole rzeczywistości\b/gi, 'przypomnienia o czasie gry'],
  [/\bkontrola rzeczywistości\b/gi, 'przypomnienie o czasie gry'],
  [/\bnarzędzia bezpieczniejszej gry\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bnarzędzia bezpieczniejszego hazardu\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bbezpieczniejszy hazard\b/gi, 'odpowiedzialna gra'],
  [/\bbezpieczniejsza gra\b/gi, 'odpowiedzialna gra'],
  [/\bdopasowanie depozytu\b/gi, 'bonus od depozytu'],
  [/\bdopasowania depozytów\b/gi, 'bonusy od depozytu'],
  [/\bpasujący depozyt\b/gi, 'bonus od depozytu'],
  [/\bz dopasowaniem depozytu\b/gi, 'z bonusem od depozytu'],
  [/\bdopasowania depozytu\b/gi, 'bonusy od depozytu'],
  [/\bdopasowaniami depozytowymi\b/gi, 'bonusami od depozytu'],
  [/\bdopasowania depozytowe\b/gi, 'bonusy od depozytu'],
  [/\bdopasowane bonusy od depozytu\b/gi, 'bonusy procentowe od depozytu'],
  [/\bdopasowane depozyty\b/gi, 'bonusy od depozytu'],
  [/\bdopasowanych depozytów\b/gi, 'bonusów od depozytu'],
  [/\bprocent dopasowania\b/gi, 'procent bonusu'],
  [/\bdopasowanie kryptograficzne\b/gi, 'bonus kryptowalutowy'],
  [/\bdopasowania kryptograficznego\b/gi, 'bonusu kryptowalutowego'],
  [/\bdopasowanie standardowe\b/gi, 'bonus standardowy'],
  [/\bwarunki bonusowe\b/gi, 'warunki bonusu'],
  [/\bwarunki premii\b/gi, 'warunki bonusu'],
  [/\bwymagania dotyczące zakładów\b/gi, 'wymagania obrotu'],
  [/\bwymóg dotyczący zakładów\b/gi, 'wymóg obrotu'],
  [/\bwymagania dotyczące obstawiania\b/gi, 'wymagania obrotu'],
  [/\bwymóg dotyczący obstawiania\b/gi, 'wymóg obrotu'],
  [/\bwymagania dotyczące przejścia gry\b/gi, 'wymagania obrotu'],
  [/\bzakłady x(\d+)\b/gi, 'wymóg obrotu x$1'],
  [/\bzakładów x(\d+)\b/gi, 'wymogu obrotu x$1'],
  [/\bwycofania środków\b/gi, 'wypłaty'],
  [/\bwycofanie środków\b/gi, 'wypłata'],
  [/\bwypłacanie środków\b/gi, 'wypłaty'],
  [/\bwycofaniem środków\b/gi, 'wypłatą'],
  [/\bwycofania\b/gi, 'wypłaty'],
  [/\bwycofanie\b/gi, 'wypłata'],
  [/\bwycofaniu\b/gi, 'wypłacie'],
  [/\bgry szczelinowe\b/gi, 'automaty online'],
  [/\bszczeliny online\b/gi, 'automaty online'],
  [/\bgry awaryjne\b/gi, 'gry crash'],
  [/\bkatastrofy\b/gi, 'gry crash'],
  [/\blobby kasynowe\b/gi, 'lobby kasyna'],
  [/\bkasyno na żywo\b/gi, 'kasyno live'],
  [/\bkontrole bezpieczniejszej gry\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bkontrole zapewniające bezpieczniejszą grę\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bbezpieczniejsze kontrole\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bkontrol(?:a|i|ą) bezpieczniejszej gry\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bnarzędzia bezpieczniejszej gry\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bnarzędzia zapewniające bezpieczniejszą zabawę\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bsygnały bezpieczniejszej gry\b/gi, 'sygnały odpowiedzialnej gry'],
  [/\bzasady bezpieczniejszej gry\b/gi, 'zasady odpowiedzialnej gry'],
  [/\bwarunki bezpieczniejszej gry\b/gi, 'zasady odpowiedzialnej gry'],
  [/\bopcje bezpieczniejszej gry\b/gi, 'narzędzia odpowiedzialnej gry'],
  [/\bwskazówki dotyczące bezpieczniejszej gry\b/gi, 'wskazówki dotyczące odpowiedzialnej gry'],
  [/\bbezpieczniejszego hazardu\b/gi, 'odpowiedzialnej gry'],
  [/\bbezpieczniejszą kontrolą gry\b/gi, 'narzędziami odpowiedzialnej gry'],
  [/\bprzypomnienia o kontroli rzeczywistości\b/gi, 'przypomnienia o czasie gry'],
  [/\bkontroli rzeczywistości\b/gi, 'przypomnienia o czasie gry'],
  [/\bgraj odpowiedzialnie, proszę\./gi, 'Graj odpowiedzialnie.'],
  [/\bSpinCresta Widok ryzyka\b/g, 'Ocena ryzyka SpinCresta'],
  [/\bSpinCresta Widok licencji\b/g, 'Ocena licencji SpinCresta'],
  [/\bwarunki na żywo\b/gi, 'aktualne warunki'],
  [/\bwarunki operatora na żywo\b/gi, 'aktualne warunki operatora'],
  [/\bwarunki bonusu publicznej na żywo\b/gi, 'aktualne publiczne warunki bonusu'],
  [/\bbonus na żywo\b/gi, 'aktualny bonus'],
  [/\bstrona główna na żywo\b/gi, 'aktualna strona główna'],
  [/\bkasjer na żywo\b/gi, 'kasjer po zalogowaniu'],
  [/\bw kasie na żywo\b/gi, 'w kasie po zalogowaniu'],
  [/\btrasy płatności\b/gi, 'metody płatności'],
  [/\btrasy wypłat\b/gi, 'metody wypłat'],
  [/\btrasy kart\b/gi, 'płatności kartą'],
  [/\btrasy kryptograficzne\b/gi, 'płatności kryptowalutowe'],
  [/\btrasy kryptowalut\b/gi, 'płatności kryptowalutowe'],
  [/\btrasy bankowe\b/gi, 'metody bankowe'],
  [/\btrasy przelewów bankowych\b/gi, 'przelewy bankowe'],
  [/\btrasy portfela\b/gi, 'portfele'],
  [/\bujawnienia licencji\b/gi, 'informacje o licencji'],
  [/\bwypadków\b/gi, 'gier crash'],
  [/\bczeki ważne\b/gi, 'ważne informacje'],
  [/\bbardziej lepki\b/gi, 'bardziej angażujący'],
  [/\belementy sterujące\b/gi, 'narzędzia'],
  [/\bSterowanie odtwarzaczem\b/g, 'Narzędzia kontroli gracza'],
  [/\bOchłodzenie\b/g, 'Przerwa w grze'],
  [/\bochłodzenie\b/g, 'przerwa w grze'],
  [/\bGracz na wynos\b/g, 'Co to oznacza dla gracza'],
  [/\bPrzegląd dokumentów\b/g, 'Weryfikacja dokumentów'],
  [/\bWitamy darmowe spiny\b/g, 'Powitalne darmowe spiny'],
  [/\bsiedmiodniowe życie\b/gi, 'ważność przez siedem dni'],
  [/\bpowłoka kasyna\b/gi, 'interfejs kasyna'],
  [/\bzwykła powłoka obejmująca zakłady sportowe i automaty\b/gi, 'zwykły serwis łączący zakłady sportowe i automaty'],
  [/\bjednostronicowa powłoka bonusowa\b/gi, 'jednostronicowy serwis oparty wyłącznie na bonusach'],
  [/\bstandardowa powłoka z pojedynczym bonusem\b/gi, 'standardowy serwis z pojedynczym bonusem'],
  [/\bpowłoka promocyjna\b/gi, 'prosta strona promocyjna'],
  [/\bpowłoka bukmacherska\b/gi, 'prosta strona bukmacherska'],
  [/\bpowłoka przeznaczona wyłącznie na automaty\b/gi, 'prosty serwis wyłącznie z automatami'],
  [/\bpłaska powłoka do wszystkich gier\b/gi, 'prosta, nieuporządkowana lista gier'],
  [/\bMobile-First\b/g, 'Z myślą o urządzeniach mobilnych'],
  [/\bmobile-first\b/g, 'z myślą o urządzeniach mobilnych'],
  [/\bCrypto-First\b/g, 'Zorientowane na kryptowaluty'],
  [/\bCasino-First\b/g, 'Zorientowane na kasyno'],
  [/\bcasino-first\b/g, 'zorientowane na kasyno'],
  [/\bkasyna-First\b/g, 'zorientowane na kasyno'],
  [/\bkasynie-First\b/g, 'zorientowane na kasyno'],
  [/\bSport-First\b/g, 'Zorientowane na zakłady sportowe'],
  [/\bsport-first\b/g, 'zorientowane na zakłady sportowe'],
  [/\bEsports-First\b/g, 'Zorientowane na e-sport'],
  [/\bkrykieta-First\b/g, 'stawiający na krykiet'],
  [/\bFiltruj-First Gracze na automatach\b/g, 'Gracze korzystający z filtrów automatów'],
  [/\bOdtwarzacze mobilne First\b/g, 'Gracze mobilni'],
  [/\bDostęp mobilny-First\b/g, 'Dostęp mobilny'],
  [/\bFirst Professional League\b/g, 'Pierwsza Liga Zawodowa'],
  [/\bdepozycie First\b/gi, 'pierwszym depozycie'],
  [/\bdepozyt First\b/gi, 'pierwszy depozyt'],
  [/\bFirst depozyt(?: na żywo)?\b/gi, 'Pierwszy depozyt'],
  [/\bdepozytu kryptowalutowego First\b/gi, 'pierwszego depozytu kryptowalutowego'],
  [/\bdepozyt kryptowalutowy First\b/gi, 'pierwszy depozyt kryptowalutowy'],
  [/<td>First<\/td>/g, '<td>Pierwszy depozyt</td>'],
  [/\bPrzeczytaj ([^<.]+) First\b/g, 'Najpierw przeczytaj $1'],
  [/\bSprawdź kasjera First\b/g, 'Najpierw sprawdź kasjera'],
  [/\bCzeki wypłaty First\b/g, 'Najpierw sprawdź wypłaty'],
  [/\bReguły First\b/g, 'Najpierw sprawdź zasady'],
  [/\bWarunki First\b/g, 'Najpierw przeczytaj warunki'],
  [/\bUruchom mały First\b/g, 'Zacznij od małego depozytu'],
  [/\bSzczeliny First\b/g, 'Najpierw automaty'],
  [/\bWypłaty First\b/g, 'Pierwsze wypłaty'],
  [/\bFirst, oferty drugiego, trzeciego i czwartego depozytu\b/g, 'Oferty pierwszego, drugiego, trzeciego i czwartego depozytu'],
  [/\barkusz(?:u|em|owi)? kalkulacyjny(?:m|ch)?\b/gi, 'materiały redakcyjne'],
  [/\bdokument źródłowy\b/gi, 'materiały redakcyjne'],
  [/\bplik źródłowy\b/gi, 'materiały redakcyjne'],
  [/\bbriefing(?:u|iem)?\b/gi, 'materiały redakcyjne'],
  [/>Dom</g, '>Strona główna<'],
  [/>O</g, '>O nas<'],
  [/>Ekskluzywny</g, '>Ekskluzywne<'],
  [/>Wzmacniacz</g, '>Partnerzy<'],
  [/"name": "Wzmacniacz"/g, '"name": "Partnerzy"'],
  [/<h1>Wzmacniacz<\/h1>/g, '<h1>Partnerzy</h1>'],
  [/NIEZALEŻNE ODKRYCIE KASYNA/g, 'NIEZALEŻNE PORÓWNANIA KASYN'],
  [/Kasyna internetowe\. Lepiej wybrany\./g, 'Kasyna online. Wybrane z większą uwagą.'],
  [/świeże odkrycia gier/gi, 'najnowsze gry'],
  [/Więcej sposobów na znalezienie odpowiedniego miejsca do zabawy/g, 'Więcej sposobów na znalezienie odpowiedniego miejsca do gry'],
  [/Przewodniki krajowe/g, 'Przewodniki po krajach'],
  [/Lokalna dostępność, kontekst płatności, zasady i opcje kasyna specyficzne dla rynku\./g, 'Lokalna dostępność, metody płatności, zasady i opcje kasyn dopasowane do danego rynku.'],
  [/warunki bonusu, płatności, gry, wsparcie, kontrole zaufania i praktyczne szczegóły konta\./g, 'Warunki bonusów, płatności, gry, obsługa klienta, weryfikacja wiarygodności i praktyczne informacje o koncie.'],
  [/WYBRANE Z WYSZUKIWANIA ZAPYTANIA/g, 'WYBRANE NA PODSTAWIE DANYCH'],
  [/Zamówienie zaczyna się od największej liczby kliknięć na stronie marki i widoczności wyników wyszukiwania w naszych danych dotyczących wydajności, a następnie dodaje najnowsze zapotrzebowanie na recenzje i marki z pełnym pokryciem katalogu wizualnego\. Każdy gracz powinien nadal sprawdzić uprawnienia i aktualne warunki\./g, 'Kolejność uwzględnia liczbę kliknięć w strony marek, widoczność w wynikach wyszukiwania, zainteresowanie najnowszymi recenzjami oraz kompletność materiałów wizualnych. Przed rejestracją zawsze sprawdź dostępność i aktualne warunki.'],
  [/\blimity kasjerów\b/gi, 'limity płatności'],
  [/\bStosunki handlowe nie zastępują wskazanych powyżej kryteriów redakcyjnych\b/g, 'Relacje handlowe nie mają wpływu na wskazane powyżej kryteria redakcyjne'],
];

let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, 'utf8');
  let after = before;
  replacements.forEach(([pattern, replacement]) => { after = after.replace(pattern, replacement); });

  after = after
    .replace(/Nasze porównanie krajów przegląda aktualne informacje publikowane przez operatorów obsługujących graczy (w|we|na) ([^.]+)\./g, 'W naszym porównaniu krajowym analizujemy aktualne informacje publikowane przez operatorów dostępnych dla graczy $1 $2.')
    .replace(/Nasze porównanie krajów przegląda aktualne informacje opublikowane przez operatorów obsługujących graczy (w|we|na) ([^.]+)\./g, 'W naszym porównaniu krajowym analizujemy aktualne informacje publikowane przez operatorów dostępnych dla graczy $1 $2.')
    .replace(/Nasza porównywarka krajów przegląda aktualne informacje publikowane przez operatorów obsługujących graczy (w|we|na) ([^.]+)\./g, 'W naszym porównaniu krajowym analizujemy aktualne informacje publikowane przez operatorów dostępnych dla graczy $1 $2.')
    .replace(/Sprawdzamy informacje o licencji, ograniczenia regionalne, zasady premii, limity kasjerów, wymagania KYC i narzędzia odpowiedzialnej gry\./g, 'Sprawdzamy informacje o licencji, ograniczenia regionalne, zasady bonusów, limity płatności, wymagania KYC oraz narzędzia odpowiedzialnej gry.')
    .replace(/Operatorzy plasują się wyżej, gdy ich warunki są jasne, informacje o licencji są identyfikowalne, metody płatności odpowiadają rynkowi i łatwo jest znaleźć narzędzia odpowiedzialnej gry\. Stosunki handlowe nie zastępują tych kryteriów\./g, 'Wyżej oceniamy operatorów, którzy przedstawiają jasne warunki, możliwe do zweryfikowania informacje o licencji, metody płatności dopasowane do rynku oraz łatwo dostępne narzędzia odpowiedzialnej gry. Relacje handlowe nie mają wpływu na te kryteria.')
    .replace(/<h1>([^<]+?) Recenzja<\/h1>/g, '<h1>Recenzja $1</h1>')
    .replace(/<h2 class="title">Bonus i migawka promocji<\/h2>/g, '<h2 class="title">Bonusy i promocje w skrócie</h2>')
    .replace(/<h2 class="title">([^<]+) Bonusowa migawka<\/h2>/g, '<h2 class="title">Bonusy $1 w skrócie</h2>')
    .replace(/<h2 class="title">Bonusowe migawki i ([^<]+)<\/h2>/g, '<h2 class="title">Bonusy i $1 w skrócie</h2>')
    .replace(/<h2 class="title">([^<]+) Przejrzyj migawkę<\/h2>/g, '<h2 class="title">$1 w skrócie</h2>')
    .replace(/<h2 class="title">([^<]+) Bonusowa migawka<\/h2>/g, '<h2 class="title">Bonusy $1 w skrócie</h2>')
    .replace(/<h2 class="title">([^<]+) Często zadawane pytania<\/h2>/g, '<h2 class="title">Najczęściej zadawane pytania o $1</h2>')
    .replace(/<h2 class="title">Migawka recenzji ([^<]+)<\/h2>/g, '<h2 class="title">$1 w skrócie</h2>')
    .replace(/\bTa migawka\b/g, 'Ten przegląd')
    .replace(/\bmigawka\b/gi, 'przegląd');

  const relative = path.relative(PL_ROOT, file).split(path.sep).join('/');
  if (relative !== 'brands/first/index.html' && relative !== 'casinos-and-betting/index.html') {
    after = after.replace(/\bFirst\b/g, 'pierwszy');
  }
  if (relative === 'casinos-and-betting/index.html') {
    after = after
      .replace(/depozyt kryptowalutowy First/g, 'pierwszy depozyt kryptowalutowy')
      .replace(/depozytu kryptowalutowego First/g, 'pierwszego depozytu kryptowalutowego');
  }

  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}

// Nazwy gier są nazwami własnymi — przywróć je z angielskiej strony głównej.
const sourceHome = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const targetHomePath = path.join(PL_ROOT, 'index.html');
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
    .replace(/\balt="[^"]*"/, `alt="Grafika gry ${source.title.replaceAll('"', '&quot;')}"`)
    .replace(/<strong>[^<]*<\/strong>/, `<strong>${source.title}</strong>`)
    .replace(/<small>[^<]*<\/small>/, `<small>w ${source.brand}</small>`);
});
fs.writeFileSync(targetHomePath, targetHome);

console.log(`Polished Polish copy on ${changed} pages; restored ${Math.min(cardIndex, sourceCards.length)} game titles.`);
