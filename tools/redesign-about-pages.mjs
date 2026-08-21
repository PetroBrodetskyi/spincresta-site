#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

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
  .replace(/\s+/g, ' ')
  .trim();

const getHomeStatsGrid = locale => {
  const homeFile = locale === 'en' ? path.join(ROOT, 'index.html') : path.join(ROOT, locale, 'index.html');
  const homeHtml = fs.readFileSync(homeFile, 'utf8');
  const match = homeHtml.match(/<div class="home-stats-grid">[\s\S]*?<\/div>/i);
  if (!match) throw new Error(`No homepage statistics grid found in ${path.relative(ROOT, homeFile)}`);
  return match[0];
};

const extractAboutContent = html => {
  const legacySection = html.match(/<section class="content container content-article">([\s\S]*?)<\/section>/i)?.[1];
  if (!legacySection) {
    const purposeSection = html.match(/<section class="home-showcase-section" aria-labelledby="about-purpose-title">([\s\S]*?)<\/section>/i)?.[1];
    const editorialSection = html.match(/<section class="home-showcase-section" id="editorial-method"[\s\S]*?<\/section>/i)?.[0];
    const transparencySection = html.match(/<section class="home-showcase-section" aria-labelledby="transparency-title">([\s\S]*?)<\/section>/i)?.[1];
    const countries = html.match(/<section class="all-countries">[\s\S]*?<\/section>/i)?.[0];
    if (!purposeSection || !editorialSection || !transparencySection || !countries) {
      throw new Error('About content was not found in either the legacy or redesigned structure.');
    }

    const purposeTitle = textOnly(purposeSection.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const purposeBody = purposeSection.match(/<div class="home-showcase-heading">[\s\S]*?<\/div>\s*(<p>[\s\S]*?<\/p>)/i)?.[1] ?? '';
    const principles = [...purposeSection.matchAll(/<article>\s*<span>[\s\S]*?<\/span>\s*<h3>([\s\S]*?)<\/h3>\s*(<p>[\s\S]*?<\/p>)\s*<\/article>/gi)]
      .map(match => ({ title: textOnly(match[1]), body: match[2] }));

    const editorialTitle = textOnly(editorialSection.match(/<h2[^>]*id="editorial-method-title"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const editorialCards = [...editorialSection.matchAll(/<article class="faq-card">\s*<h3>[\s\S]*?<\/h3>\s*<p>([\s\S]*?)<\/p>\s*<\/article>/gi)]
      .map(match => match[1].trim());
    const transparencyTitle = textOnly(transparencySection.match(/<h2[^>]*id="transparency-title"[^>]*>([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    const transparencyText = transparencySection.match(/<div class="home-showcase-heading">[\s\S]*?<\/div>\s*<p>([\s\S]*?)<\/p>/i)?.[1]?.trim() ?? '';

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

const renderPrinciples = entries => entries.map((entry, index) => `
              <article>
                <span>0${index + 1}</span>
                <h3>${escapeHtml(entry.title)}</h3>
                ${renderCardBody(entry.body)}
              </article>`).join('');

const renderMain = (locale, source, homeStatsGrid) => {
  const t = copy[locale];
  const prefix = locale === 'en' ? '' : `/${locale}`;
  const [mission, ...principles] = source.timeline;
  const [editorialTitle, transparencyTitle] = source.headings;
  const [verifyText, currentText, transparencyText] = source.paragraphs;

  return `<main>
      <section class="hero container">
        <div class="hero-content">
          <span class="home-hero-kicker">${escapeHtml(t.eyebrow)}</span>
          <h1>${escapeHtml(t.title)}</h1>
          <p>${escapeHtml(t.lead)}</p>
          <div class="home-hero-actions">
            <a class="home-primary-action" href="#editorial-method">${escapeHtml(t.primary)}</a>
            <a class="home-secondary-action" href="${prefix}/authors/odri-chambers/">${escapeHtml(t.secondary)}</a>
          </div>
        </div>

        <div class="home-insight-card">
          ${homeStatsGrid}
        </div>
      </section>

      <div class="content-area container">
        <section class="home-showcase-section" aria-labelledby="about-purpose-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.purposeEyebrow)}</span>
              <h2 id="about-purpose-title">${escapeHtml(mission.title)}</h2>
            </div>
            ${renderCardBody(mission.body)}
          </div>
          <div class="home-method-grid" aria-label="${escapeHtml(t.principlesEyebrow)}">${renderPrinciples(principles.slice(0, 4))}
          </div>
        </section>

        <section class="home-showcase-section" id="editorial-method" aria-labelledby="editorial-method-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.principlesEyebrow)}</span>
              <h2 id="editorial-method-title">${escapeHtml(editorialTitle.text)}</h2>
            </div>
            <p>${escapeHtml(t.editorialLead)}</p>
          </div>
          <div class="faq-grid">
            <article class="faq-card">
              <h3>${escapeHtml(t.verifyTitle)}</h3>
              <p>${verifyText.html}</p>
            </article>
            <article class="faq-card">
              <h3>${escapeHtml(t.currentTitle)}</h3>
              <p>${currentText.html}</p>
            </article>
          </div>
        </section>

        <section class="home-showcase-section" aria-label="${escapeHtml(t.expertTitle)}">
          <div class="home-section-cta">
            <div>
              <strong>${escapeHtml(t.expertTitle)}</strong>
              <span>${escapeHtml(t.expertLead)}</span>
            </div>
            <a href="${prefix}/authors/odri-chambers/">${escapeHtml(t.expertButton)}</a>
          </div>
        </section>

        <section class="home-showcase-section" aria-labelledby="transparency-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.transparencyEyebrow)}</span>
              <h2 id="transparency-title">${escapeHtml(transparencyTitle.text)}</h2>
            </div>
            <p>${transparencyText.html}</p>
          </div>
          <div class="home-section-cta">
            <div>
              <strong>${escapeHtml(t.partnersTitle)}</strong>
              <span>${escapeHtml(t.partnersLead)}</span>
            </div>
            <a href="${prefix}/partners/">${escapeHtml(t.partnersButton)}</a>
          </div>
        </section>

        ${source.countries}
      </div>
    </main>`;
};

let changed = 0;
for (const locale of Object.keys(copy)) {
  const file = locale === 'en' ? path.join(ROOT, 'about', 'index.html') : path.join(ROOT, locale, 'about', 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const source = extractAboutContent(html);
  const homeStatsGrid = getHomeStatsGrid(locale);

  html = html
    .replace(/<body([^>]*)>/i, (_, attrs) => {
      const cleaned = attrs
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sdata-page="[^"]*"/gi, '');
      return `<body class="home-page" data-page="about"${cleaned}>`;
    })
    .replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, renderMain(locale, source, homeStatsGrid));

  fs.writeFileSync(file, html);
  changed += 1;
}

console.log(`Redesigned ${changed} About pages with existing site components.`);
