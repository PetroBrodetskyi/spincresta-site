#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { BRANDS } from '../scripts/brands.js';

const ROOT = process.cwd();
const FI_ROOT = path.join(ROOT, 'fi');
const regionNames = new Intl.DisplayNames(['fi'], { type: 'region' });
const regionCode = code => code === 'UK' ? 'GB' : code;
const decode = value => value.replaceAll('&amp;', '&').replaceAll('&quot;', '"').replaceAll('&#39;', "'");
const encode = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;');
const plain = value => decode(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
const brandNames = new Map(
  BRANDS.filter(brand => brand.urlDetail).map(brand => {
    const slug = brand.urlDetail.replace(/^.*?brands\//, '').replace(/\.html$/, '').replace(/\/$/, '');
    return [slug, brand.name];
  }),
);

const files = [];
const walk = directory => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(target);
    else if (entry.name === 'index.html') files.push(target);
  }
};
walk(FI_ROOT);

const pagePath = file => `/${path.relative(ROOT, file).split(path.sep).join('/').replace(/index\.html$/, '')}`;
const replaceMeta = (html, selector, value) => html.replace(
  new RegExp(`<meta\\b(?=[^>]*${selector})[^>]*>`, 'i'),
  match => match.replace(/\bcontent=(['"])[\s\S]*?\1/i, `content="${encode(value)}"`),
);

const serviceTitles = {
  '/fi/': 'Parhaat nettikasinot 2026 | SpinCresta',
  '/fi/about/': 'Tietoa SpinCrestasta | Toimituksellinen menetelmä',
  '/fi/blog/': 'Nettikasino-oppaat | SpinCresta-blogi',
  '/fi/casinos-and-betting/': 'Kasinot ja vedonlyöntisivustot | SpinCresta',
  '/fi/exclusive-offers/': 'Eksklusiiviset kasinotarjoukset | SpinCresta',
  '/fi/new-casinos/': 'Uudet nettikasinot 2026 | SpinCresta',
  '/fi/online-casinos/': 'Nettikasinot maittain | SpinCresta',
  '/fi/partners/': 'SpinCrestan kumppanit | Yhteistyö',
  '/fi/payment-methods/': 'Kasinoiden maksutavat | Opas 2026',
  '/fi/privacy-policy/': 'Tietosuojakäytäntö | SpinCresta',
  '/fi/responsible-gambling/': 'Vastuullinen pelaaminen | SpinCresta',
  '/fi/top-casinos/': 'Nettikasinorankingit maittain 2026 | SpinCresta',
  '/fi/top-rated/': 'Parhaiten arvioidut nettikasinot 2026 | SpinCresta',
  '/fi/authors/odri-chambers/': 'Odri Chambers | SpinCrestan iGaming-asiantuntija',
};
const serviceDescriptions = {
  '/fi/': 'Vertaile nettikasinoita, bonuksia, maksutapoja, kotiutuksia ja maaoppaita. Tarkista ehdot ja saatavuus ennen rekisteröitymistä.',
  '/fi/about/': 'Tutustu SpinCrestan toimitukselliseen menetelmään, vertailukriteereihin, lähteisiin ja tapaan, jolla pidämme arvostelut ajan tasalla.',
  '/fi/blog/': 'Käytännön oppaita nettikasinoista, bonuksista, maksuista, kotiutuksista, tunnistautumisesta ja paikallisista markkinoista.',
  '/fi/casinos-and-betting/': 'Selaa kasinoita ja vedonlyöntisivustoja aakkosjärjestyksessä. Vertaa saatavuutta, tarjouksia, maksutapoja ja arvosteluja.',
  '/fi/online-casinos/': 'Tutustu nettikasinoihin maittain ja vertaile saatavuutta, bonuksia, maksutapoja, kotiutuksia ja vastuullisen pelaamisen työkaluja.',
  '/fi/partners/': 'Tutustu SpinCrestan valittuihin kumppaneihin, yhteistyöperiaatteisiin ja tapaan, jolla kaupalliset suhteet pidetään erillään toimituksellisista arvioista.',
  '/fi/payment-methods/': 'Vertaile kortteja, e-lompakoita, pankkisiirtoja, mobiilimaksuja ja kryptovaluuttoja talletuksiin ja kotiutuksiin.',
  '/fi/privacy-policy/': 'Lue, miten SpinCresta käyttää tietoja ja evästeitä, suojaa yksityisyyttä ja käsittelee ulkoisia linkkejä.',
  '/fi/responsible-gambling/': 'Vastuullisen pelaamisen ohjeet ja työkalut: talletusrajat, tauot, peliesto, riskimerkit, itsearviointi ja riippumattomat tukipalvelut.',
  '/fi/top-casinos/': 'Vertaile nettikasinoita maittain. Tarkista bonukset, maksutavat, kotiutukset, saatavuus ja käytännön tiedot.',
  '/fi/authors/odri-chambers/': 'Tutustu SpinCrestan iGaming-asiantuntijaan Odri Chambersiin, hänen kokemukseensa, arviointiperiaatteisiinsa ja toimitukselliseen vastuualueeseensa.',
};
const brandRegionLabels = {
  'betzino-fr': 'Ranska',
  'casinopeaches-fr': 'Ranska',
  'fortunica-es': 'Espanja',
  'fortunica-nl': 'Alankomaat',
  'fortunica-uk': 'Yhdistynyt kuningaskunta',
  'fraga-ar': 'Argentiina',
  'fraga-az': 'Azerbaidžan',
  'fraga-cl': 'Chile',
  'fraga-tr': 'Turkki',
  'letsjackpot-fr': 'Ranska',
  'uspin-fr': 'Ranska',
};
const bodyAdditions = {
  '/fi/about/': ' Tavoitteemme on auttaa lukijaa erottamaan käytännössä tärkeät ehdot markkinointiväitteistä ja tekemään vertailu ennen tilin avaamista.',
  '/fi/authors/odri-chambers/': ' Hän arvioi erityisesti bonusehtojen läpinäkyvyyttä, maksutapoja, kotiutusten käytäntöjä, pelivalikoimaa ja pelaajien suojaa. Jokaisessa arvostelussa hän painottaa selkeitä ehtoja ja tietoja, jotka lukija voi tarkistaa ennen rekisteröitymistä.',
  '/fi/blog/': ' Oppaissa keskitymme kysymyksiin, jotka vaikuttavat oikeaan pelikokemukseen: bonusten kierrätykseen, maksujen rajoihin, KYC-tarkistuksiin, kotiutusaikoihin ja paikalliseen saatavuuteen. Sisältö päivitetään, kun operaattorien ehdot tai tarjonta muuttuvat.',
  '/fi/exclusive-offers/': ' Vertaa aina kierrätysvaatimusta, voimassaoloaikaa, sallittuja pelejä ja kotiutuksen enimmäismäärää ennen tarjouksen hyväksymistä.',
  '/fi/online-casinos/': ' Jokainen maaopas auttaa tarkistamaan paikallisen saatavuuden, valuutat ja tavallisimmat maksutavat ennen rekisteröitymistä.',
  '/fi/partners/': ' Arviointimme perustuvat samoihin kriteereihin riippumatta siitä, onko sivulla kaupallinen kumppanuus. Kumppanuus voi tuottaa meille palkkion, mutta se ei takaa myönteistä arviota tai sijoitusta.',
  '/fi/payment-methods/': ' Tarkista lisäksi vähimmäissummat, mahdolliset kulut, käsittelyajat ja se, voiko saman maksutavan avulla sekä tallettaa että kotiuttaa.',
  '/fi/top-casinos/': ' Rankingit kokoavat yhteen saatavuuden, maksutavat ja keskeiset pelaajatiedot, mutta operaattorin ajantasaiset ehdot kannattaa aina tarkistaa ennen talletusta.',
  '/fi/top-rated/': ' Korkea sijoitus ei perustu vain bonuksen kokoon. Arvioimme myös maksamisen sujuvuutta, ehtojen läpinäkyvyyttä, pelivalikoimaa, asiakastukea ja vastuullisen pelaamisen työkaluja.',
};
const bodyExtraAdditions = {
  '/fi/authors/odri-chambers/': ' Toimituksellinen kokemus auttaa tunnistamaan epäselvät lupaukset ja nostamaan esiin tiedot, joilla on pelaajalle käytännön merkitystä.',
  '/fi/blog/': ' Pyrimme selittämään vaikeatkin säännöt ymmärrettävästi ja ilman turhaa alan sanastoa, jotta vaihtoehtojen vertaaminen olisi aidosti helpompaa.',
  '/fi/exclusive-offers/': ' Tarjouksen näkyminen tällä sivulla ei poista tarvetta tarkistaa operaattorin ajantasaiset ehdot ja alueellinen kelpoisuus.',
  '/fi/partners/': ' Lukijalle kerrotaan selkeästi, kun linkki on kaupallinen, ja vastuullisen pelaamisen tiedot säilyvät aina osana sisältöä.',
  '/fi/top-casinos/': ' Valitse ensin oma maasi, jotta näet alueelle sopivimmat vaihtoehdot.',
  '/fi/top-rated/': ' Tarkista aina myös kasinon ajantasainen saatavuus omassa maassasi sekä bonuksen täydelliset ehdot ennen tilin avaamista.',
};
const bodyFinalAdditions = {
  '/fi/authors/odri-chambers/': ' Arviointiperusteet kuvataan avoimesti myös lukijalle.',
  '/fi/blog/': ' Uudet artikkelit linkittyvät suoraan niitä täydentäviin arvosteluihin ja maaoppaisiin.',
  '/fi/top-rated/': ' Näin ranking säilyy käytännöllisenä eikä perustu yhteen mainoslupaukseen.',
};
const bodyLastAdditions = {
  '/fi/blog/': ' Sisältöä päivitetään säännöllisesti uusien tietojen perusteella.',
};

let titleUpdates = 0;
let descriptionUpdates = 0;

for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const route = pagePath(file);
  const currentTitle = plain(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '');
  const descriptionTag = html.match(/<meta\b(?=[^>]*\bname=['"]description['"])[^>]*>/i)?.[0] || '';
  const currentDescription = decode(descriptionTag.match(/\bcontent=(['"])([\s\S]*?)\1/i)?.[2] || '');
  const brandMatch = route.match(/^\/fi\/brands\/([^/]+)\/$/);
  const countryCode = html.match(/<body\b[^>]*\bdata-country=['"]([^'"]+)['"]/i)?.[1]?.toUpperCase();
  let title = serviceTitles[route] || currentTitle;
  let description = serviceDescriptions[route] || currentDescription;

  if (brandMatch) {
    const slug = brandMatch[1];
    const name = brandNames.get(slug) || plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || slug);
    const h1 = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
    const coversSports = /vedonlyönt|urheil|e-urheil/i.test(h1);
    const region = brandRegionLabels[slug];
    title = region
      ? `${name}-arvostelu 2026: ${region} | Bonus ja maksut`
      : coversSports || /casino|kasino/i.test(name)
        ? `${name}-arvostelu 2026 | Kasino, vedonlyönti ja maksut`
        : `${name}-kasinoarvostelu 2026 | Bonus, pelit ja maksut`;
    description = region
      ? `${name}-arvostelu, markkina ${region}: bonukset, pelit, maksutavat, kotiutukset, KYC ja saatavuus. Tarkista ehdot ennen pelaamista.`
      : `${name}-arvostelu: bonukset, pelit, maksutavat, kotiutukset, KYC, mobiilikäyttö ja saatavuus. Tarkista ehdot ennen pelaamista.`;
  } else if (countryCode) {
    const country = regionNames.of(regionCode(countryCode)) || countryCode;
    title = `Parhaat nettikasinot: ${country} 2026 | SpinCresta`;
    description = `Vertaile nettikasinoita alueella ${country}: bonukset, maksutavat, kotiutukset, saatavuus ja vastuullinen pelaaminen. Tarkista ehdot ennen rekisteröitymistä.`;
  }

  if (title.length > 65) title = title.slice(0, 62).replace(/[\s|,:;-]+$/, '') + '…';
  if (description.length > 170) description = description.slice(0, 167).replace(/[\s,;:-]+$/, '') + '…';

  if (title !== currentTitle) {
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);
    html = replaceMeta(html, `\\bproperty=['"]og:title['"]`, title);
    html = replaceMeta(html, `\\bname=['"]twitter:title['"]`, title);
    titleUpdates += 1;
  }
  if (description !== currentDescription) {
    html = replaceMeta(html, `\\bname=['"]description['"]`, description);
    html = replaceMeta(html, `\\bproperty=['"]og:description['"]`, description);
    html = replaceMeta(html, `\\bname=['"]twitter:description['"]`, description);
    descriptionUpdates += 1;
  }

  const bodyAddition = bodyAdditions[route];
  if (bodyAddition && !html.includes(bodyAddition.trim())) {
    const bodyStart = html.search(/<body\b/i);
    if (bodyStart !== -1) {
      const beforeBody = html.slice(0, bodyStart);
      const body = html.slice(bodyStart).replace(/(<p\b[^>]*>[\s\S]*?)(<\/p>)/i, `$1${bodyAddition}$2`);
      html = beforeBody + body;
    }
  }
  const bodyExtraAddition = bodyExtraAdditions[route];
  if (bodyExtraAddition && !html.includes(bodyExtraAddition.trim())) {
    const bodyStart = html.search(/<body\b/i);
    if (bodyStart !== -1) {
      const beforeBody = html.slice(0, bodyStart);
      const body = html.slice(bodyStart).replace(/(<p\b[^>]*>[\s\S]*?)(<\/p>)/i, `$1${bodyExtraAddition}$2`);
      html = beforeBody + body;
    }
  }
  const bodyFinalAddition = bodyFinalAdditions[route];
  if (bodyFinalAddition && !html.includes(bodyFinalAddition.trim())) {
    const bodyStart = html.search(/<body\b/i);
    if (bodyStart !== -1) {
      const beforeBody = html.slice(0, bodyStart);
      const body = html.slice(bodyStart).replace(/(<p\b[^>]*>[\s\S]*?)(<\/p>)/i, `$1${bodyFinalAddition}$2`);
      html = beforeBody + body;
    }
  }
  const bodyLastAddition = bodyLastAdditions[route];
  if (bodyLastAddition && !html.includes(bodyLastAddition.trim())) {
    const bodyStart = html.search(/<body\b/i);
    if (bodyStart !== -1) {
      const beforeBody = html.slice(0, bodyStart);
      const body = html.slice(bodyStart).replace(/(<p\b[^>]*>[\s\S]*?)(<\/p>)/i, `$1${bodyLastAddition}$2`);
      html = beforeBody + body;
    }
  }

  html = html.replace(/<script\b[^>]*type=['"]application\/ld\+json['"][^>]*>([\s\S]*?)<\/script>/gi, (full, json) => {
    try {
      const data = JSON.parse(json);
      const nodes = data['@graph'] || [data];
      const webPage = nodes.find(node => node?.['@type'] === 'WebPage');
      if (webPage) {
        webPage.name = title;
        webPage.description = description;
      }
      return `<script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n</script>`;
    } catch {
      return full;
    }
  });

  fs.writeFileSync(file, html);
}

console.log(`Optimized Finnish SEO: ${titleUpdates} titles, ${descriptionUpdates} descriptions.`);
