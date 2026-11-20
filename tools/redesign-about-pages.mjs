#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { syncDefaultTheme } from './sync-default-theme.mjs';
import { siteIconMarkup } from '../scripts/site-icons.js';

const ROOT = process.cwd();

const copy = {
  en: {
    eyebrow: 'About SpinCresta',
    title: 'Independent reviews. Clearer choices.',
    lead: 'SpinCresta turns casino terms, payment details, regional restrictions, and safer-play information into clear, practical reviews.',
    primary: 'How we review',
    secondary: 'Meet our expert',
    purposeEyebrow: 'Why we exist',
    principlesEyebrow: 'What guides our work',
    editorialLead: 'Our reviews focus on information a player can verify before opening an account or making a deposit.',
    verifyTitle: 'What we verify',
    currentTitle: 'How we keep information current',
    expertTitle: 'Meet the expert behind our reviews',
    expertLead: 'Odri Chambers has worked in iGaming since 2020 and reviews the practical information readers need before choosing a casino.',
    expertButton: 'View Odri’s profile',
    transparencyEyebrow: 'Clear disclosure',
    partnersTitle: 'Working with SpinCresta?',
    partnersLead: 'See how we handle partnership proposals, affiliate relationships, factual updates, and public disclosures.',
    partnersButton: 'Partnership standards',
  },
  de: {
    eyebrow: 'Über SpinCresta',
    title: 'Unabhängige Tests. Klarere Entscheidungen.',
    lead: 'SpinCresta macht Casinobedingungen, Zahlungsdetails, regionale Einschränkungen und Spielerschutz verständlich und praktisch nutzbar.',
    primary: 'So testen wir',
    secondary: 'Unsere Expertin',
    purposeEyebrow: 'Warum es uns gibt',
    principlesEyebrow: 'Was unsere Arbeit bestimmt',
    editorialLead: 'Unsere Tests konzentrieren sich auf Informationen, die Spieler vor der Kontoeröffnung oder Einzahlung prüfen können.',
    verifyTitle: 'Was wir prüfen',
    currentTitle: 'Wie wir Informationen aktuell halten',
    expertTitle: 'Die Expertin hinter unseren Tests',
    expertLead: 'Odri Chambers arbeitet seit 2020 in der iGaming-Branche und prüft die praktischen Angaben, die Leser vor der Wahl eines Casinos benötigen.',
    expertButton: 'Odris Profil ansehen',
    transparencyEyebrow: 'Klare Offenlegung',
    partnersTitle: 'Mit SpinCresta zusammenarbeiten?',
    partnersLead: 'Erfahren Sie, wie wir Partnerschaften, Affiliate-Beziehungen, sachliche Updates und Offenlegungen handhaben.',
    partnersButton: 'Partnerschaftsstandards',
  },
  es: {
    eyebrow: 'Sobre SpinCresta',
    title: 'Reseñas independientes. Decisiones más claras.',
    lead: 'SpinCresta convierte las condiciones, los pagos, las restricciones regionales y el juego responsable en reseñas claras y prácticas.',
    primary: 'Cómo analizamos',
    secondary: 'Conoce a nuestra experta',
    purposeEyebrow: 'Nuestra razón de ser',
    principlesEyebrow: 'Lo que guía nuestro trabajo',
    editorialLead: 'Nuestras reseñas se centran en la información que un jugador puede comprobar antes de abrir una cuenta o depositar.',
    verifyTitle: 'Qué comprobamos',
    currentTitle: 'Cómo mantenemos la información al día',
    expertTitle: 'Conoce a la experta detrás de nuestras reseñas',
    expertLead: 'Odri Chambers trabaja en iGaming desde 2020 y revisa la información práctica que los lectores necesitan antes de elegir un casino.',
    expertButton: 'Ver el perfil de Odri',
    transparencyEyebrow: 'Transparencia',
    partnersTitle: '¿Quieres colaborar con SpinCresta?',
    partnersLead: 'Consulta cómo gestionamos propuestas, relaciones de afiliación, actualizaciones y divulgaciones públicas.',
    partnersButton: 'Normas de colaboración',
  },
  it: {
    eyebrow: 'Chi siamo',
    title: 'Recensioni indipendenti. Scelte più consapevoli.',
    lead: 'SpinCresta trasforma condizioni, pagamenti, restrizioni territoriali e gioco responsabile in recensioni chiare e pratiche.',
    primary: 'Come recensiamo',
    secondary: 'La nostra esperta',
    purposeEyebrow: 'Perché esistiamo',
    principlesEyebrow: 'I principi del nostro lavoro',
    editorialLead: 'Le nostre recensioni si concentrano sulle informazioni che un giocatore può verificare prima di aprire un conto o depositare.',
    verifyTitle: 'Cosa verifichiamo',
    currentTitle: 'Come manteniamo aggiornate le informazioni',
    expertTitle: 'L’esperta dietro le nostre recensioni',
    expertLead: 'Odri Chambers lavora nell’iGaming dal 2020 e verifica le informazioni pratiche necessarie prima di scegliere un casinò.',
    expertButton: 'Vedi il profilo di Odri',
    transparencyEyebrow: 'Trasparenza',
    partnersTitle: 'Vuoi collaborare con SpinCresta?',
    partnersLead: 'Scopri come gestiamo proposte, rapporti di affiliazione, aggiornamenti e comunicazioni pubbliche.',
    partnersButton: 'Standard per le partnership',
  },
  pl: {
    eyebrow: 'O SpinCresta',
    title: 'Niezależne recenzje. Świadome wybory.',
    lead: 'SpinCresta przedstawia warunki kasyn, płatności, ograniczenia regionalne i zasady bezpiecznej gry w jasnych, praktycznych recenzjach.',
    primary: 'Jak oceniamy',
    secondary: 'Poznaj naszą ekspertkę',
    purposeEyebrow: 'Dlaczego działamy',
    principlesEyebrow: 'Co kieruje naszą pracą',
    editorialLead: 'Skupiamy się na informacjach, które gracz może sprawdzić przed założeniem konta lub wpłatą pieniędzy.',
    verifyTitle: 'Co sprawdzamy',
    currentTitle: 'Jak dbamy o aktualność informacji',
    expertTitle: 'Poznaj ekspertkę stojącą za naszymi recenzjami',
    expertLead: 'Odri Chambers pracuje w branży iGaming od 2020 roku i weryfikuje praktyczne informacje potrzebne przed wyborem kasyna.',
    expertButton: 'Zobacz profil Odri',
    transparencyEyebrow: 'Przejrzyste zasady',
    partnersTitle: 'Chcesz współpracować ze SpinCresta?',
    partnersLead: 'Sprawdź, jak obsługujemy propozycje, relacje afiliacyjne, aktualizacje informacji i publiczne oznaczenia.',
    partnersButton: 'Standardy współpracy',
  },
  uk: {
    eyebrow: 'Про SpinCresta',
    title: 'Незалежні огляди. Зважений вибір.',
    lead: 'SpinCresta пояснює умови казино, платежі, регіональні обмеження та правила відповідальної гри простою й зрозумілою мовою.',
    primary: 'Як ми перевіряємо',
    secondary: 'Познайомитися з експерткою',
    purposeEyebrow: 'Навіщо ми працюємо',
    principlesEyebrow: 'Принципи нашої роботи',
    editorialLead: 'У центрі наших оглядів — інформація, яку гравець може перевірити до реєстрації або внесення депозиту.',
    verifyTitle: 'Що ми перевіряємо',
    currentTitle: 'Як ми підтримуємо актуальність',
    expertTitle: 'Познайомтеся з експерткою наших оглядів',
    expertLead: 'Odri Chambers працює в iGaming з 2020 року та перевіряє практичну інформацію, потрібну читачам перед вибором казино.',
    expertButton: 'Переглянути профіль Odri',
    transparencyEyebrow: 'Прозорі правила',
    partnersTitle: 'Хочете співпрацювати зі SpinCresta?',
    partnersLead: 'Дізнайтеся, як ми розглядаємо пропозиції, позначаємо партнерські відносини та вносимо фактичні оновлення.',
    partnersButton: 'Стандарти співпраці',
  },
  pt: {
    eyebrow: 'Sobre a SpinCresta',
    title: 'Análises independentes. Escolhas mais claras.',
    lead: 'A SpinCresta transforma condições, pagamentos, restrições regionais e jogo responsável em análises claras e práticas.',
    primary: 'Como analisamos',
    secondary: 'Conheça a nossa especialista',
    purposeEyebrow: 'Porque existimos',
    principlesEyebrow: 'O que orienta o nosso trabalho',
    editorialLead: 'As nossas análises concentram-se na informação que um jogador pode confirmar antes de criar uma conta ou depositar.',
    verifyTitle: 'O que verificamos',
    currentTitle: 'Como mantemos a informação atualizada',
    expertTitle: 'Conheça a especialista por detrás das nossas análises',
    expertLead: 'Odri Chambers trabalha em iGaming desde 2020 e verifica a informação prática necessária antes de escolher um casino.',
    expertButton: 'Ver o perfil de Odri',
    transparencyEyebrow: 'Transparência',
    partnersTitle: 'Quer colaborar com a SpinCresta?',
    partnersLead: 'Saiba como tratamos propostas, relações de afiliação, atualizações factuais e divulgações públicas.',
    partnersButton: 'Normas de parceria',
  },
  fr: {
    eyebrow: 'À propos de SpinCresta',
    title: 'Des avis indépendants. Des choix plus clairs.',
    lead: 'SpinCresta transforme les conditions, les paiements, les restrictions régionales et le jeu responsable en avis clairs et pratiques.',
    primary: 'Notre méthode',
    secondary: 'Notre experte',
    purposeEyebrow: 'Notre raison d’être',
    principlesEyebrow: 'Ce qui guide notre travail',
    editorialLead: 'Nos avis portent sur les informations qu’un joueur peut vérifier avant de créer un compte ou d’effectuer un dépôt.',
    verifyTitle: 'Ce que nous vérifions',
    currentTitle: 'Comment nous actualisons les informations',
    expertTitle: 'Découvrez l’experte derrière nos avis',
    expertLead: 'Odri Chambers travaille dans l’iGaming depuis 2020 et vérifie les informations pratiques utiles avant de choisir un casino.',
    expertButton: 'Voir le profil d’Odri',
    transparencyEyebrow: 'Transparence',
    partnersTitle: 'Vous souhaitez collaborer avec SpinCresta ?',
    partnersLead: 'Découvrez comment nous traitons les propositions, les relations d’affiliation, les mises à jour et les mentions publiques.',
    partnersButton: 'Règles de partenariat',
  },
  hi: {
    eyebrow: 'SpinCresta के बारे में',
    title: 'स्वतंत्र समीक्षाएँ। बेहतर फैसले।',
    lead: 'SpinCresta कैसीनो की शर्तों, भुगतान, क्षेत्रीय प्रतिबंधों और जिम्मेदार खेल की जानकारी को स्पष्ट और उपयोगी समीक्षाओं में प्रस्तुत करता है।',
    primary: 'हम कैसे समीक्षा करते हैं',
    secondary: 'हमारी विशेषज्ञ से मिलें',
    purposeEyebrow: 'हमारा उद्देश्य',
    principlesEyebrow: 'हमारे काम के सिद्धांत',
    editorialLead: 'हमारी समीक्षाएँ उस जानकारी पर केंद्रित होती हैं जिसे खिलाड़ी खाता खोलने या जमा करने से पहले जाँच सकता है।',
    verifyTitle: 'हम क्या जाँचते हैं',
    currentTitle: 'हम जानकारी को नया कैसे रखते हैं',
    expertTitle: 'हमारी समीक्षाओं की विशेषज्ञ से मिलें',
    expertLead: 'Odri Chambers 2020 से iGaming में काम कर रही हैं और कैसीनो चुनने से पहले जरूरी व्यावहारिक जानकारी की समीक्षा करती हैं।',
    expertButton: 'Odri की प्रोफ़ाइल देखें',
    transparencyEyebrow: 'स्पष्ट जानकारी',
    partnersTitle: 'SpinCresta के साथ काम करना चाहते हैं?',
    partnersLead: 'जानें कि हम साझेदारी प्रस्तावों, एफिलिएट संबंधों, तथ्यात्मक अपडेट और सार्वजनिक खुलासों को कैसे संभालते हैं।',
    partnersButton: 'साझेदारी मानक',
  },
  fi: {
    eyebrow: 'Tietoa SpinCrestasta',
    title: 'Riippumattomia arvioita. Selkeämpiä valintoja.',
    lead: 'SpinCresta esittää kasinoehdot, maksut, alueelliset rajoitukset ja vastuullisen pelaamisen tiedot selkeinä ja käytännöllisinä arvosteluina.',
    primary: 'Näin arvioimme',
    secondary: 'Tutustu asiantuntijaamme',
    purposeEyebrow: 'Miksi olemme olemassa',
    principlesEyebrow: 'Työtämme ohjaavat periaatteet',
    editorialLead: 'Arvostelumme keskittyvät tietoihin, jotka pelaaja voi tarkistaa ennen tilin avaamista tai talletusta.',
    verifyTitle: 'Mitä tarkistamme',
    currentTitle: 'Näin pidämme tiedot ajan tasalla',
    expertTitle: 'Tutustu arvostelujemme asiantuntijaan',
    expertLead: 'Odri Chambers on työskennellyt iGaming-alalla vuodesta 2020 ja tarkistaa kasinon valinnassa tarvittavat käytännön tiedot.',
    expertButton: 'Katso Odrin profiili',
    transparencyEyebrow: 'Avoimuus',
    partnersTitle: 'Haluatko tehdä yhteistyötä SpinCrestan kanssa?',
    partnersLead: 'Katso, miten käsittelemme yhteistyöehdotuksia, affiliate-suhteita, tietopäivityksiä ja julkisia ilmoituksia.',
    partnersButton: 'Kumppanuusperiaatteet',
  },
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const textOnly = value => String(value)
  .replace(/<[^>]+>/g, ' ')
  .replace(/&(amp|quot|lt|gt|apos|#39);/g, (_, entity) =>
    ({ amp: '&', quot: '"', lt: '<', gt: '>', apos: "'", '#39': "'" })[entity])
  .replace(/\s+/g, ' ')
  .trim();

const extractAboutContent = html => {
  const legacySection = html.match(/<section class="content container content-article">([\s\S]*?)<\/section>/i)?.[1];
  if (!legacySection) {
    const purposeSection = html.match(/<section\b[^>]*aria-labelledby="about-purpose-title"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
    const editorialSection = html.match(/<section\b[^>]*id="editorial-method"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
    const transparencySection = html.match(/<section\b[^>]*aria-labelledby="transparency-title"[^>]*>([\s\S]*?)<\/section>/i)?.[1];
    const countries = html.match(/<section\b[^>]*(?:class="all-countries"|id="about-countries")[^>]*>[\s\S]*?<\/section>/i)?.[0];
    if (!purposeSection || !editorialSection || !transparencySection || !countries) {
      throw new Error('About content was not found in either the legacy or redesigned structure.');
    }

    const purposeTitle = textOnly(purposeSection.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const purposeBody = purposeSection.match(/(<p>[\s\S]*?<\/p>)/i)?.[1] ?? '';
    const principles = [...purposeSection.matchAll(/<(article|li)>\s*<(span|svg)\b[^>]*>[\s\S]*?<\/\2>\s*(?:<div>)?\s*<h3>([\s\S]*?)<\/h3>\s*(<p>[\s\S]*?<\/p>)\s*(?:<\/div>)?\s*<\/\1>/gi)]
      .map(match => ({ title: textOnly(match[3]), body: match[4] }));

    const editorialTitle = textOnly(editorialSection.match(/<h2[^>]*id="editorial-method-title"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const editorialCards = [...editorialSection.matchAll(/<h3>[\s\S]*?<\/h3>\s*<p>([\s\S]*?)<\/p>/gi)]
      .map(match => match[1].trim());
    const transparencyTitle = textOnly(transparencySection.match(/<h2[^>]*id="transparency-title"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const transparencyText = transparencySection.match(/<p>([\s\S]*?)<\/p>/i)?.[1]?.trim() ?? '';

    if (!purposeTitle || !purposeBody || principles.length < 4 || !editorialTitle || editorialCards.length < 2 || !transparencyTitle || !transparencyText) {
      throw new Error('The redesigned About page has an unexpected structure.');
    }

    return {
      timeline: [{ title: purposeTitle, body: purposeBody }, ...principles],
      headings: [{ text: editorialTitle }, { text: transparencyTitle }],
      paragraphs: [
        { html: editorialCards[0] },
        { html: editorialCards[1] },
        { html: transparencyText },
      ],
      countries,
    };
  }

  const timeline = [...legacySection.matchAll(/<div>\s*<h3>([\s\S]*?)<\/h3>\s*([\s\S]*?)<\/div>/gi)]
    .map(match => ({ title: textOnly(match[1]), body: match[2].trim() }));
  if (timeline.length < 5) throw new Error(`Expected five About timeline entries, found ${timeline.length}.`);

  const editorialSection = html.match(/<section class="content" id="seo-editorial-guide">\s*<div[^>]*>([\s\S]*?)<\/div>\s*<\/section>/i)?.[1];
  if (!editorialSection) throw new Error('Editorial guide content was not found.');

  const editorialParts = [...editorialSection.matchAll(/<(h2|p)(?:\s+[^>]*)?>([\s\S]*?)<\/\1>/gi)]
    .map(match => ({ type: match[1].toLowerCase(), html: match[2].trim(), text: textOnly(match[2]) }));
  const headings = editorialParts.filter(part => part.type === 'h2');
  const paragraphs = editorialParts.filter(part => part.type === 'p');
  if (headings.length < 2 || paragraphs.length < 3) throw new Error('Editorial guide has an unexpected structure.');

  const countries = html.match(/<section class="all-countries">[\s\S]*?<\/section>/i)?.[0];
  if (!countries) throw new Error('Country listing was not found.');

  return { timeline, headings, paragraphs, countries };
};

const renderCardBody = body => {
  const list = [...body.matchAll(/<li>([\s\S]*?)<\/li>/gi)].map(match => textOnly(match[1]));
  if (list.length) return `<p>${list.map(item => `• ${escapeHtml(item)}`).join('<br />')}</p>`;
  const paragraph = body.match(/<p>([\s\S]*?)<\/p>/i)?.[1] ?? body;
  return `<p>${paragraph.trim()}</p>`;
};

const menuCopy = {
  en: ['Overview', 'Transparency', 'Country guides', 'Browse brand reviews'],
  de: ['Überblick', 'Transparenz', 'Länderguides', 'Markentests ansehen'],
  es: ['Resumen', 'Transparencia', 'Guías por país', 'Ver reseñas de marcas'],
  it: ['Panoramica', 'Trasparenza', 'Guide per paese', 'Consulta le recensioni dei marchi'],
  pl: ['O serwisie', 'Przejrzystość', 'Przewodniki po krajach', 'Przeglądaj recenzje marek'],
  uk: ['Про проєкт', 'Прозорість', 'Гіди за країнами', 'Переглянути огляди брендів'],
  pt: ['Visão geral', 'Transparência', 'Guias por país', 'Ver análises de marcas'],
  fr: ['Présentation', 'Transparence', 'Guides par pays', 'Consulter les avis sur les marques'],
  hi: ['परिचय', 'पारदर्शिता', 'देश गाइड', 'ब्रांड समीक्षाएँ देखें'],
  fi: ['Yleiskatsaus', 'Avoimuus', 'Maaoppaat', 'Selaa brändiarvosteluja'],
};

const renderRow = (icon, title, body) => `
              <li>
                ${siteIconMarkup(icon, 'site-icon', 22)}
                <div><h3>${escapeHtml(title)}</h3>${renderCardBody(body)}</div>
              </li>`;

const renderMain = (locale, source) => {
  const t = copy[locale];
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const [mission, ...principles] = source.timeline;
  const [editorialTitle, transparencyTitle] = source.headings;
  const [verifyText, currentText, transparencyText] = source.paragraphs;
  const [overview, transparency, countryGuides, browseReviews] = menuCopy[locale];
  const countriesHeading = textOnly(source.countries.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
  if (!countriesHeading) throw new Error(`Missing country heading for ${locale}`);
  const menu = [
    ['about-overview', 'book', overview], ['editorial-method', 'review', t.primary],
    ['about-author', 'user', t.secondary], ['about-transparency', 'link', transparency],
    ['about-countries', 'globe', countryGuides],
  ];
  const heading = (id, title) => `<h2 id="${id}" tabindex="-1">${escapeHtml(title)}</h2>`;
  const icons = ['review', 'globe', 'safety', 'star'];
  const countryBody = locale === 'en'
    ? 'Our country guides cover local payment methods, casino availability, and restrictions. Check the guide for your location before registering.'
    : principles[1].body;
  const reviewBody = locale === 'en' ? verifyText.html.replace(/\blicence\b/g, 'license') : verifyText.html;

  return `<main class="account-dashboard editorial-dashboard about-dashboard container" data-about-dashboard>
      <header class="account-dashboard-heading">
        <h1 id="about-title">${escapeHtml(t.eyebrow)}</h1>
        <p>${escapeHtml(t.lead)}</p>
      </header>
      <div class="account-layout">
        <aside class="account-sidebar">
          <nav class="account-menu" aria-labelledby="about-title">
            ${menu.map(([id, icon, label], index) =>
              `<a href="#${id}" data-about-nav="${id}"${index === 0 ? ' aria-current="location"' : ''}>${siteIconMarkup(icon, 'site-icon', 20)}<span>${escapeHtml(label)}</span></a>`
            ).join('\n            ')}
          </nav>
        </aside>
        <div class="account-workspace">
          <section class="account-panel" id="about-overview" data-about-panel="about-overview" aria-labelledby="about-purpose-title">
            ${heading('about-purpose-title', mission.title)}
            ${renderCardBody(mission.body)}
            <ul class="editorial-panel-rows" role="list" aria-label="${escapeHtml(t.principlesEyebrow)}">${principles.slice(0, 4).map((entry, index) =>
              renderRow(icons[index], entry.title, index === 1 ? countryBody : entry.body)).join('')}
            </ul>
            <div class="account-support-links">
              <a href="${prefix}/casinos-and-betting/">${siteIconMarkup('book', 'site-icon', 20)}<span>${escapeHtml(browseReviews)}</span></a>
            </div>
          </section>
          <section class="account-panel" id="editorial-method" data-about-panel="editorial-method" aria-labelledby="editorial-method-title">
            ${heading('editorial-method-title', editorialTitle.text)}
            <p>${escapeHtml(t.editorialLead)}</p>
            <ul class="editorial-panel-rows" role="list">${renderRow('review', t.verifyTitle, reviewBody)}${renderRow('calendar', t.currentTitle, currentText.html)}
            </ul>
          </section>
          <section class="account-panel" id="about-author" data-about-panel="about-author" aria-labelledby="about-author-title">
            ${heading('about-author-title', t.expertTitle)}
            <p>${escapeHtml(t.expertLead)}</p>
            <div class="account-support-links">
              <a href="${prefix}/authors/odri-chambers/">${siteIconMarkup('user', 'site-icon', 20)}<span>${escapeHtml(t.expertButton)}</span></a>
            </div>
          </section>
          <section class="account-panel" id="about-transparency" data-about-panel="about-transparency" aria-labelledby="transparency-title">
            ${heading('transparency-title', transparencyTitle.text)}
            <p>${transparencyText.html}</p>
            <div class="account-support-links">
              <a href="${prefix}/partners/">${siteIconMarkup('link', 'site-icon', 20)}<span>${escapeHtml(t.partnersButton)}</span></a>
            </div>
          </section>
          <section class="account-panel about-country-list" id="about-countries" data-about-panel="about-countries" aria-labelledby="about-countries-title">
            ${heading('about-countries-title', countriesHeading)}
            <div class="account-support-links">
              <a href="${prefix}/online-casinos/">${siteIconMarkup('globe', 'site-icon', 20)}<span>${escapeHtml(countryGuides)}</span></a>
            </div>
            <div class="countries-cloud"></div>
          </section>
        </div>
      </div>
    </main>`;
};

const check = process.argv.includes('--check');
let changed = 0;
for (const locale of Object.keys(copy)) {
  const file = locale === 'en' ? path.join(ROOT, 'about', 'index.html') : path.join(ROOT, locale, 'about', 'index.html');
  const original = fs.readFileSync(file, 'utf8');
  const source = extractAboutContent(original);

  const html = original
    .replace(/<body([^>]*)>/i, (_, attrs) => {
      const cleaned = attrs
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sdata-page="[^"]*"/gi, '');
      return `<body class="home-page" data-page="about"${cleaned}>`;
    })
    .replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, renderMain(locale, source));

  const updated = syncDefaultTheme(html);
  if (updated === original) continue;
  if (!check) fs.writeFileSync(file, updated);
  changed += 1;
}

console.log(`About layout: ${changed} pages ${check ? 'pending' : 'updated'}.`);
if (check && changed) process.exitCode = 1;
