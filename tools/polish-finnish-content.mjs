#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const FI_ROOT = path.join(ROOT, 'fi');
const files = [];

const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(absolute);
    else if (entry.name === 'index.html') files.push(absolute);
  }
};
walk(FI_ROOT);

const replacements = [
  [/>maat</g, '>Maat<'],
  [/>Parhaiksi arvioitu</g, '>Parhaiten arvioidut<'],
  [/>Yksinomainen</g, '>Eksklusiiviset<'],
  [/>Kotiin</g, '>Etusivu<'],
  [/"name": "Kotiin"/g, '"name": "Etusivu"'],
  [/Tietoja SpinCresta:stä/g, 'Tietoa SpinCrestasta'],
  [/(<a href="\/fi\/about\/">)Noin(<\/a>)/g, '$1Tietoa meistä$2'],
  [/Parhaiksi arvioidut/g, 'Parhaiten arvioidut'],
  [/Online-kasinot maittain/g, 'Nettikasinot maittain'],
  [/online-kasinoiden/g, 'nettikasinoiden'],
  [/Online-kasinoiden/g, 'Nettikasinoiden'],
  [/online-kasinoita/g, 'nettikasinoita'],
  [/Online-kasinoita/g, 'Nettikasinoita'],
  [/online-kasinolla/g, 'nettikasinolla'],
  [/Online-kasinolla/g, 'Nettikasinolla'],
  [/online-kasinot/g, 'nettikasinot'],
  [/Online-kasinot/g, 'Nettikasinot'],
  [/online-kasino/g, 'nettikasino'],
  [/Online-kasino/g, 'Nettikasino'],
  [/tuotemerkkiarvostelujen/g, 'brändiarvostelujen'],
  [/Tuotemerkkiarvostelujen/g, 'Brändiarvostelujen'],
  [/tuotemerkkiarvostelut/g, 'brändiarvostelut'],
  [/Tuotemerkkiarvostelut/g, 'Brändiarvostelut'],
  [/tuotemerkkiarvostelu/g, 'brändiarvostelu'],
  [/Tuotemerkkiarvostelu/g, 'Brändiarvostelu'],
  [/tuotemerkkikohtais/g, 'brändikohtais'],
  [/Tuotemerkkikohtais/g, 'Brändikohtais'],
  [/tuotemerkkiyhdistelm/g, 'brändikokonaisuud'],
  [/tuotemerkkiasetuks/g, 'brändin tarjonn'],
  [/tuotemerkkitiedoissa/g, 'brändin tiedoissa'],
  [/Tuotemerkkitiedoissa/g, 'Brändin tiedoissa'],
  [/tuotemerkkitiedot/g, 'brändin tiedot'],
  [/Tuotemerkkitiedot/g, 'Brändin tiedot'],
  [/tuotemerkkien/g, 'brändien'],
  [/Tuotemerkkien/g, 'Brändien'],
  [/tuotemerkkejä/g, 'brändejä'],
  [/Tuotemerkkejä/g, 'Brändejä'],
  [/tuotemerkit/g, 'brändit'],
  [/Tuotemerkit/g, 'Brändit'],
  [/tuotemerkin/g, 'brändin'],
  [/Tuotemerkin/g, 'Brändin'],
  [/tuotemerkkiä/g, 'brändiä'],
  [/Tuotemerkkiä/g, 'Brändiä'],
  [/tuotemerkkinä/g, 'brändinä'],
  [/Tuotemerkkinä/g, 'Brändinä'],
  [/tuotemerkki/g, 'brändi'],
  [/Tuotemerkki/g, 'Brändi'],
  [/Plussat ja miinukset oikeille pelaajille/g, 'Hyvät ja huonot puolet'],
  [/Asiantuntijan arvostelu/g, 'Asiantuntija-arvio'],
  [/>ARVOSTELLUT</g, '>ARVOSTELI<'],
  [/LinkedIn profiili/g, 'LinkedIn-profiili'],
  [/Hyvä istuvuus/g, 'Sopii parhaiten'],
  [/hyvä istuvuus/g, 'sopii parhaiten'],
  [/Mieti kahdesti jos/g, 'Ei välttämättä sovi, jos'],
  [/Mieti kahdesti, jos/g, 'Ei välttämättä sovi, jos'],
  [/Bonukset ja promootiokuva/g, 'Bonukset ja kampanjat'],
  [/Bonuskuvan ja kampanjan ehdot/g, 'Bonukset ja kampanjaehdot'],
  [/Bonuskuva ja promo-kerrokset/g, 'Bonukset ja kampanjat'],
  [/promootiokuva/gi, 'kampanjatarjonta'],
  [/bonuskuva/gi, 'bonustarjonta'],
  [/Maksut, vahvistus ja nostovirta/g, 'Maksut, vahvistus ja kotiutukset'],
  [/nostovirta/gi, 'kotiutusten käsittely'],
  [/kassavirta/gi, 'maksuliikenne'],
  [/live-kassanhoitaja/gi, 'ajantasaiset maksutiedot kassalla'],
  [/kassanhoitaja/gi, 'kassa'],
  [/pankkisiirtoreitit/gi, 'pankkisiirrot'],
  [/maksureitit/gi, 'maksutavat'],
  [/maksureittiä/gi, 'maksutapaa'],
  [/maksureitillä/gi, 'maksutavalla'],
  [/maksureitille/gi, 'maksutapaan'],
  [/maksureitistä/gi, 'maksutavasta'],
  [/maksureitin/gi, 'maksutavan'],
  [/maksureitti/gi, 'maksutapa'],
  [/nostoreitit/gi, 'kotiutustavat'],
  [/nostoreittiä/gi, 'kotiutustapaa'],
  [/nostoreitillä/gi, 'kotiutustavalla'],
  [/nostoreitistä/gi, 'kotiutustavasta'],
  [/nostoreitin/gi, 'kotiutustavan'],
  [/nostoreitti/gi, 'kotiutustapa'],
  [/kryptoreitit/gi, 'kryptomaksutavat'],
  [/kryptoreittejä/gi, 'kryptomaksutapoja'],
  [/kryptoreitin/gi, 'kryptomaksutavan'],
  [/kryptoreitti/gi, 'kryptomaksutapa'],
  [/talletusreitit/gi, 'talletustavat'],
  [/talletusreitti/gi, 'talletustapa'],
  [/valitusreitit/gi, 'valituskanavat'],
  [/valitusreitti/gi, 'valituskanava'],
  [/yhteydenottoreitit/gi, 'yhteydenottokanavat'],
  [/yhteydenottoreitti/gi, 'yhteydenottokanava'],
  [/bonusreitit/gi, 'bonustarjoukset'],
  [/bonusreitti/gi, 'bonustarjous'],
  [/turvallisemman pelaamisen/gi, 'vastuullisen pelaamisen'],
  [/turvallisempi pelaaminen/gi, 'vastuullinen pelaaminen'],
  [/turvallisemman pelin/gi, 'vastuullisen pelaamisen'],
  [/turvallisemmat pelityökalut/gi, 'vastuullisen pelaamisen työkalut'],
  [/vastuullisen pelaamisen säädöt/gi, 'vastuullisen pelaamisen työkalut'],
  [/vastuullisen pelaamisen hallintalaitteet/gi, 'vastuullisen pelaamisen työkalut'],
  [/turvallisemman toiston hallintalaitteet/gi, 'vastuullisen pelaamisen työkalut'],
  [/turvallisemman toiston säätimiä/gi, 'vastuullisen pelaamisen työkaluja'],
  [/turvallisemman toiston säätimet/gi, 'vastuullisen pelaamisen työkalut'],
  [/turvallisemman toiston ohjaimilla/gi, 'vastuullisen pelaamisen työkaluilla'],
  [/turvallisemmat rahapelityökalut/gi, 'vastuullisen pelaamisen työkalut'],
  [/hallintalaitteet/gi, 'hallintatyökalut'],
  [/Tilityökalut/g, 'Tilin hallintatyökalut'],
  [/Uhkapelien käyttöoikeus on tiukasti 18\+/g, 'Rahapelaamisen ikäraja on 18 vuotta'],
  [/Maavertailussamme tarkastellaan [^.]+ operaattoreiden julkaisemia ajankohtaisia ​​tietoja\./g, 'Maavertailumme perustuu operaattoreiden julkaisemiin ajantasaisiin tietoihin ja siihen, miten ne palvelevat kyseisen maan pelaajia.'],
  [/kun heidän ehdot ovat/g, 'kun niiden ehdot ovat'],
  [/Ennen rekisteröintiä tai talletusta, tarkista/g, 'Ennen rekisteröintiä tai talletusta tarkista'],
  [/Online-uhkapelisäännöt/g, 'Verkossa pelaamista koskevat säännöt'],
  [/talletusosuuksilla/g, 'talletusbonuksilla'],
  [/ilman talletustarjouksilla/g, 'ilman talletusta saatavilla bonuksilla'],
  [/ja ([A-Za-zÅÄÖåäö0-9-]+)-talletukset kelpaavat/g, 'sekä se, hyväksytäänkö $1-talletukset'],
  [/ja ([A-Za-zÅÄÖåäö0-9/-]+)-talletukset kelpaavat tarjoukseen/g, 'sekä tarkista, hyväksytäänkö $1-talletukset tarjoukseen'],
  [/pelaajien tarkistuslista ennen rekisteröintiä/gi, 'Pelaajan tarkistuslista ennen rekisteröitymistä'],
  [/Pelaa nyt osoitteessa [^<]+/g, 'Pelaa'],
  [/Lunasta bonus ja pelaa/g, 'Pelaa'],
  [/Lunasta bonus &amp; pelaa/g, 'Pelaa'],
  [/Arvostelu tulossa pian/g, 'arvostelu on tulossa'],
  [/Review details coming soon/gi, 'Arvostelu on tulossa'],
  [/Casino Review/gi, 'kasinoarvostelu'],
  [/Casino &amp; Esports Betting Review/g, 'kasino- ja e-urheiluvedonlyöntiarvostelu'],
  [/Casino & Esports Betting Review/g, 'kasino- ja e-urheiluvedonlyöntiarvostelu'],
  [/Kasinon &amp; Vedonlyöntiarvostelu/g, 'kasino- ja vedonlyöntiarvostelu'],
  [/Kasinon & Vedonlyöntiarvostelu/g, 'kasino- ja vedonlyöntiarvostelu'],
  [/Kasino- ja vedonlyöntiarvostelu/g, 'kasino- ja vedonlyöntiarvostelu'],
  [/Review tulossa pian/g, 'arvostelu on tulossa'],
  [/arvostelu tulossa pian/g, 'arvostelu on tulossa'],
  [/AML-shekit/gi, 'AML-tarkistukset'],
  [/luottamussignaalit/gi, 'luotettavuustiedot'],
  [/luottamustarkistukset/gi, 'luotettavuuden tarkistukset'],
  [/luottamustarkastukset/gi, 'luotettavuuden tarkistukset'],
  [/kassan kitka/gi, 'maksamisen sujuvuus'],
  [/nostokitka/gi, 'kotiutusten viiveet'],
  [/kotiutuskitka/gi, 'kotiutusten viiveet'],
  [/ennen kuin rahat liittyvät/gi, 'ennen talletusta'],
  [/ennen rahan käyttöä/gi, 'ennen talletusta'],
  [/Nykyinen arvostelumme sisältää/gi, 'Arvostelussamme käsitellään'],
  [/Nykyinen katsauksemme sisältää/gi, 'Arvostelussamme käsitellään'],
  [/Nykyinen ([^<."]+)-katsauksessamme on/gi, '$1-arvostelussamme käsitellään'],
  [/SpinCresta-maaindeksi/gi, 'SpinCrestan maakohtainen vertailu'],
  [/Tietoihin perustuvat suositukset, yksityiskohtaiset brändiarvostelut, todelliset kasinon aulan esikatselut ja tuoreet pelilöydöt maailmanlaajuisilla markkinoilla\./g,
    'Vertaile kasinoita, bonuksia, maksutapoja ja pelejä selkeiden arvostelujen ja aitojen aulaesikatselujen avulla.'],
  [/Katso kaikki kasinon sijoitukset/g, 'Katso kaikki kasinorankingit'],
  [/Suositellut kasinomerkit/g, 'Suositellut kasinot'],
  [/Äskettäin LISÄTTY SPINCRESTAAN/g, 'ÄSKETTÄIN LISÄTTY SPINCRESTAAN'],
  [/KATSO SISÄÄN ENNEN KUIN VALITAT/g, 'KATSO KASINOA ENNEN VALINTAA'],
  [/UUTTA TARKASTETUISSA KASINOSSA/g, 'UUTUUKSIA ARVOSTELLUILTA KASINOILTA'],
  [/Uusia pelejä löydettäväksi/g, 'Tutustu uusiin peleihin'],
  [/vedonlyönti syvyys/gi, 'vedonlyöntitarjonta'],
  [/Urheilun ja krypton tervetuliaisvalinnat/g, 'Vedonlyönti- ja kryptobonukset'],
  [/Vedonlyönti, Live-vedonlyönti ja kilpa-ajo/g, 'Vedonlyönti, live-vedonlyönti ja hevosurheilu'],
  [/Live-vedonlyönti/g, 'live-vedonlyönti'],
  [/Todelliset kotisivukaappaukset/gi, 'Aidot kuvat kasinoiden etusivuilta'],
  [/Kasinon aulan esikatselut/gi, 'Kasinoaulojen esikatselut'],
  [/SpinBoss tervetuliaisvedonlyöntivaatimukset/g, 'SpinBossin tervetuliaisbonuksen kierrätysvaatimukset'],
  [/Onko SpinBoss:llä kryptotervetuliaisbonus\?/g, 'Tarjoaako SpinBoss kryptotervetuliaisbonuksen?'],
  [/Kuinka monta peliä ja palveluntarjoajaa SpinBoss:llä on\?/g, 'Kuinka monta peliä ja pelivalmistajaa SpinBoss tarjoaa?'],
  [/Onko SpinBoss:llä VIP-ohjelmaa\?/g, 'Onko SpinBossilla VIP-ohjelma?'],
  [/SpinBoss:llä on 25 tasoa harjoittelija-, vastaanottovirkailija-, myyntiedustaja-, aluepäällikkö- ja maailman parhaan pomon tasoilla\./g, 'SpinBossin VIP-ohjelmassa on 25 tasoa viidessä eri tasoryhmässä.'],
  [/VIP-klubi: 25 uratasoa/g, 'VIP-klubi: 25 tasoa'],
  [/tai vastaava paikallinen vastaava summa/g, 'tai vastaava summa paikallisessa valuutassa'],
  [/Fiat-kasinopaketti sisältää 20-kertaisen kierrätyksen talletuksella plus bonuksen ja 40-kertaisen ilmaispyöräytysvoiton, 10 päivän suoritusikkunalla\./g, 'Käteispohjaisen kasinopaketin kierrätysvaatimus on 20× talletukselle ja bonukselle sekä 40× ilmaiskierrosten voitoille. Ehto on täytettävä 10 päivän kuluessa.'],
  [/Nykyinen kryptokasinotarjous on 200 % aina 3 000 USDT asti, minimipanos 100 USD ja 40x yhdistetty kierrätys 10 päivän sisällä\./g, 'Kryptokasinon tervetuliaisbonus on tällä hetkellä 200 % aina 3 000 USDT:hen asti. Vähimmäistalletus on 100 USD, ja 40× kierrätysvaatimus on täytettävä 10 päivän kuluessa.'],
  [/Julkinen luettelo palautti 13 186 peliä ja 118 palveluntarjoajaa, kun se tarkistettiin kesäkuussa 2026\./g, 'Tarkistushetkellä kesäkuussa 2026 julkisessa peliluettelossa oli 13 186 peliä 118 pelivalmistajalta.'],
  [/Talousosasto ilmoittaa kolmen arkipäivän kuluessa pyynnöstä tai edellisestä maksusta/g, 'SpinBoss ilmoittaa käsittelevänsä pyynnön kolmen arkipäivän kuluessa pyynnöstä tai edellisestä maksusta'],
  [/Siinä on 25 tasoa viidellä urateemalla tasolla/g, 'Ohjelmassa on 25 tasoa viidessä eri tasoryhmässä'],
  [/Minkä lisenssisignaalin SpinBoss julkaisee\?/g, 'Mitä lisenssitietoja SpinBoss julkaisee?'],
  [/Fiatin tervetuliaisvedonlyönti koskee talletusta ja bonusta\./g, 'Käteispohjaisen tervetuliaisbonuksen kierrätysvaatimus koskee sekä talletusta että bonusta.'],
  [/Crypto Welcome on korkeampi 40x yhdistetty vaatimus\./g, 'Kryptotervetuliaisbonuksessa on korkeampi 40× yhdistetty kierrätysvaatimus.'],
];

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const textOnly = value => value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

const polishBrandHeadings = (html, file) => {
  const relative = path.relative(FI_ROOT, file).split(path.sep).join('/');
  if (!relative.startsWith('brands/')) return html;
  const breadcrumbName = html.match(/"position"\s*:\s*3\s*,\s*"name"\s*:\s*"([^"]+)"/i)?.[1] || '';
  const brand = breadcrumbName.replace(/\s+(?:kasino)?arvostelu(?:\s+on\s+tulossa)?$/i, '').trim();
  if (!brand) return html;
  const escapedBrand = escapeRegExp(brand);

  let result = html.replace(/<h1\b([^>]*)>([\s\S]*?)<\/h1>/i, (full, attributes, content) => {
    const heading = textOnly(content);
    if (!/kasino- ja vedonlyöntiarvostelu/i.test(heading)) return full;
    return `<h1${attributes}>${brand}-kasino- ja vedonlyöntiarvostelu</h1>`;
  });

  const exactHeadings = new Map([
    [`${brand} Maksutavat`, 'Maksutavat'],
    [`${brand} tilannekuva`, 'Palvelun yleiskuva'],
    [`${brand} Plussat ja miinukset`, 'Hyvät ja huonot puolet'],
    [`${brand} UKK`, 'Usein kysytyt kysymykset'],
  ]);
  result = result.replace(/<h2\b([^>]*)>([\s\S]*?)<\/h2>/gi, (full, attributes, content) => {
    const heading = textOnly(content);
    if (exactHeadings.has(heading)) return `<h2${attributes}>${exactHeadings.get(heading)}</h2>`;
    if (/^Oletko valmis tutkimaan\b/i.test(heading)) {
      return `<h2${attributes}>Valmis kokeilemaan ${brand}-kasinoa?</h2>`;
    }
    return full;
  });

  return result.replace(new RegExp(`${escapedBrand}:tä`, 'g'), `${brand}-kasinoa`);
};

let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const original = html;
  for (const [pattern, replacement] of replacements) html = html.replace(pattern, replacement);
  html = polishBrandHeadings(html, file);
  html = html.replace(
    /(<a\b[^>]*\bclass=(['"])[^'"]*\bcta-brands\b[^'"]*\2[^>]*>)[\s\S]*?(<\/a\s*>)/gi,
    '$1Pelaa$3',
  );
  if (html !== original) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`Polished Finnish copy on ${changed}/${files.length} pages.`);
