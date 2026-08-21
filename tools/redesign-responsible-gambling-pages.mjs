#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();

const copy = {
  en: {
    eyebrow: 'Safer play at SpinCresta',
    primary: 'Safe-play guide',
    secondary: 'Find help now',
    basics: 'Know the essentials',
    tools: 'Built-in protection',
    signs: 'Know when to stop',
    support: 'Free and confidential support',
    faq: 'Quick answers',
    selfCheckButton: 'View support resources',
    urgentButton: 'Get help now',
  },
  de: {
    eyebrow: 'Sicherer spielen mit SpinCresta',
    primary: 'Leitfaden ansehen',
    secondary: 'Jetzt Hilfe finden',
    basics: 'Das Wichtigste im Überblick',
    tools: 'Integrierte Schutzfunktionen',
    signs: 'Warnsignale erkennen',
    support: 'Kostenlose und vertrauliche Hilfe',
    faq: 'Kurze Antworten',
    selfCheckButton: 'Hilfsangebote ansehen',
    urgentButton: 'Jetzt Hilfe erhalten',
  },
  es: {
    eyebrow: 'Juega de forma segura con SpinCresta',
    primary: 'Ver la guía',
    secondary: 'Buscar ayuda',
    basics: 'Lo esencial',
    tools: 'Herramientas de protección',
    signs: 'Señales para detenerse',
    support: 'Ayuda gratuita y confidencial',
    faq: 'Respuestas rápidas',
    selfCheckButton: 'Ver recursos de ayuda',
    urgentButton: 'Buscar ayuda ahora',
  },
  it: {
    eyebrow: 'Gioca responsabilmente con SpinCresta',
    primary: 'Consulta la guida',
    secondary: 'Trova aiuto',
    basics: 'Le basi da conoscere',
    tools: 'Strumenti di protezione',
    signs: 'Riconosci quando fermarti',
    support: 'Aiuto gratuito e riservato',
    faq: 'Risposte rapide',
    selfCheckButton: 'Vedi le risorse di supporto',
    urgentButton: 'Chiedi aiuto ora',
  },
  pl: {
    eyebrow: 'Graj odpowiedzialnie ze SpinCresta',
    primary: 'Przeczytaj poradnik',
    secondary: 'Znajdź pomoc',
    basics: 'Najważniejsze zasady',
    tools: 'Narzędzia ochronne',
    signs: 'Rozpoznaj moment, by przerwać',
    support: 'Bezpłatna i poufna pomoc',
    faq: 'Krótkie odpowiedzi',
    selfCheckButton: 'Zobacz dostępne wsparcie',
    urgentButton: 'Uzyskaj pomoc teraz',
  },
  uk: {
    eyebrow: 'Грайте відповідально зі SpinCresta',
    primary: 'Переглянути поради',
    secondary: 'Знайти допомогу',
    basics: 'Головне про безпечну гру',
    tools: 'Інструменти захисту',
    signs: 'Коли варто зупинитися',
    support: 'Безкоштовна конфіденційна допомога',
    faq: 'Короткі відповіді',
    selfCheckButton: 'Переглянути служби допомоги',
    urgentButton: 'Отримати допомогу',
  },
  pt: {
    eyebrow: 'Jogue de forma responsável com a SpinCresta',
    primary: 'Consultar o guia',
    secondary: 'Encontrar ajuda',
    basics: 'O essencial',
    tools: 'Ferramentas de proteção',
    signs: 'Saiba quando parar',
    support: 'Apoio gratuito e confidencial',
    faq: 'Respostas rápidas',
    selfCheckButton: 'Ver recursos de apoio',
    urgentButton: 'Obter ajuda agora',
  },
  fr: {
    eyebrow: 'Jouer plus sereinement avec SpinCresta',
    primary: 'Consulter le guide',
    secondary: 'Trouver de l’aide',
    basics: 'Les points essentiels',
    tools: 'Outils de protection',
    signs: 'Savoir quand s’arrêter',
    support: 'Aide gratuite et confidentielle',
    faq: 'Réponses rapides',
    selfCheckButton: 'Voir les ressources d’aide',
    urgentButton: 'Obtenir de l’aide',
  },
  hi: {
    eyebrow: 'SpinCresta के साथ सुरक्षित खेल',
    primary: 'सुरक्षित खेल गाइड',
    secondary: 'अभी मदद पाएँ',
    basics: 'ज़रूरी बातें समझें',
    tools: 'सुरक्षा के साधन',
    signs: 'जानें कब रुकना है',
    support: 'मुफ़्त और गोपनीय सहायता',
    faq: 'संक्षिप्त उत्तर',
    selfCheckButton: 'सहायता संसाधन देखें',
    urgentButton: 'अभी सहायता लें',
  },
  fi: {
    eyebrow: 'Pelaa vastuullisesti SpinCrestassa',
    primary: 'Lue turvallisen pelaamisen opas',
    secondary: 'Etsi apua',
    basics: 'Tärkeimmät periaatteet',
    tools: 'Suojaavat työkalut',
    signs: 'Tunnista, milloin on aika lopettaa',
    support: 'Maksutonta ja luottamuksellista tukea',
    faq: 'Lyhyet vastaukset',
    selfCheckButton: 'Katso tukipalvelut',
    urgentButton: 'Hae apua nyt',
  },
};

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const textOnly = value => {
  let text = String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  for (let pass = 0; pass < 2; pass += 1) {
    text = text
      .replaceAll('&amp;', '&')
      .replaceAll('&quot;', '"')
      .replaceAll('&#39;', "'")
      .replaceAll('&nbsp;', ' ');
  }
  return text;
};

const extractListItems = body => [...body.matchAll(/<li>([\s\S]*?)<\/li>/gi)]
  .map(match => {
    const html = match[1].trim();
    const strong = html.match(/<strong>([\s\S]*?)<\/strong>/i);
    const title = textOnly(strong?.[1] ?? '');
    const rawContent = strong
      ? html.replace(strong[0], '').replace(/^\s*[-–—:|]\s*/, '').trim()
      : html;
    const content = rawContent.replace(/^(\s*)(\p{Ll})/u, (_, spacing, letter) => `${spacing}${letter.toUpperCase()}`);
    return { title, html: content, text: textOnly(html) };
  });

const extractFaqCards = source => [...source.matchAll(/<(?:div|article) class="faq-card">\s*<h3>([\s\S]*?)<\/h3>\s*([\s\S]*?)<\/(?:div|article)>/gi)]
  .map(match => ({ title: textOnly(match[1]), body: match[2].trim() }));

const extractSource = html => {
  if (/data-page="responsible-gambling"/i.test(html)) {
    throw new Error('Responsible Gambling pages have already been redesigned. Restore a legacy page before rerunning this generator.');
  }

  const hero = html.match(/<section class="hero container">([\s\S]*?)<\/section>/i)?.[1] ?? '';
  const title = textOnly(hero.match(/<h1>([\s\S]*?)<\/h1>/i)?.[1] ?? '');
  const heroLead = textOnly(hero.match(/<p>([\s\S]*?)<\/p>/i)?.[1] ?? '');

  const guideSection = html.match(/<div class="container content-article">\s*<h2 class="title">([\s\S]*?)<\/h2>\s*<div class="timeline">([\s\S]*?)<\/div>\s*<\/div>\s*<\/section>/i);
  const guideTitle = textOnly(guideSection?.[1] ?? '');
  const timeline = [...(guideSection?.[2] ?? '').matchAll(/<div>\s*<h3>([\s\S]*?)<\/h3>\s*([\s\S]*?)<\/div>/gi)]
    .map(match => ({ title: textOnly(match[1]), body: match[2].trim() }));

  const faqSections = [...html.matchAll(/<section class="content">\s*<div class="container content-article">([\s\S]*?)<\/div>\s*<\/section>/gi)];
  let faqTitle = '';
  let faq = [];
  for (const section of faqSections) {
    if (!section[1].includes('faq-grid')) continue;
    faqTitle = textOnly(section[1].match(/<h2 class="title">([\s\S]*?)<\/h2>/i)?.[1] ?? '');
    faq = extractFaqCards(section[1]);
  }

  const countries = html.match(/<section class="all-countries">[\s\S]*?<\/section>/i)?.[0] ?? '';
  if (!title || !heroLead || !guideTitle || timeline.length !== 6 || faq.length !== 6 || !faqTitle || !countries) {
    throw new Error(`Unexpected page structure: title=${Boolean(title)}, timeline=${timeline.length}, faq=${faq.length}.`);
  }
  return { title, heroLead, guideTitle, timeline, faqTitle, faq, countries };
};

const renderRuleCards = entries => entries.map(entry => {
  const items = extractListItems(entry.body);
  return items.slice(0, 4).map(item => `
          <article class="faq-card">
            <h3>${escapeHtml(item.title || item.text)}</h3>
            ${item.title ? `<p>${item.html}</p>` : ''}
          </article>`).join('');
}).join('');

const renderToolCards = entry => extractListItems(entry.body).map(item => `
            <article class="faq-card">
              <h3>${escapeHtml(item.title || item.text)}</h3>
              ${item.title ? `<p>${item.html}</p>` : ''}
            </article>`).join('');

const renderWarningCards = entry => extractListItems(entry.body).map((item, index) => `
            <article>
              <span>${String(index + 1).padStart(2, '0')}</span>
              <h3>${escapeHtml(item.text)}</h3>
            </article>`).join('');

const renderFaqCards = entries => entries.map(entry => `
            <article class="faq-card">
              <h3>${escapeHtml(entry.title)}</h3>
              ${entry.body}
            </article>`).join('');

const paragraphHtml = body => body.match(/<p>([\s\S]*?)<\/p>/i)?.[1]?.trim() ?? body;

const renderMain = (locale, source) => {
  const t = copy[locale];
  const [definition, rules, tools, signs, support, urgent] = source.timeline;
  const selfCheck = extractListItems(rules.body)[4];

  return `<main>
      <section class="hero container">
        <div class="hero-content">
          <span class="home-hero-kicker">${escapeHtml(t.eyebrow)}</span>
          <h1>${escapeHtml(source.title)}</h1>
          <p>${escapeHtml(source.heroLead)}</p>
          <div class="home-hero-actions">
            <a class="home-primary-action" href="#safe-play-guide">${escapeHtml(t.primary)}</a>
            <a class="home-secondary-action" href="#support-resources">${escapeHtml(t.secondary)}</a>
          </div>
        </div>

        <div class="faq-grid" aria-label="${escapeHtml(rules.title)}">${renderRuleCards([rules])}
        </div>
      </section>

      <div class="content-area container">
        <section class="home-showcase-section" id="safe-play-guide" aria-labelledby="safe-play-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.basics)}</span>
              <h2 id="safe-play-title">${escapeHtml(definition.title)}</h2>
            </div>
            <p>${paragraphHtml(definition.body)}</p>
          </div>
          ${selfCheck ? `<div class="home-section-cta">
            <div>
              <strong>${escapeHtml(selfCheck.title || rules.title)}</strong>
              <span>${selfCheck.html}</span>
            </div>
            <a href="#support-resources">${escapeHtml(t.selfCheckButton)}</a>
          </div>` : ''}
        </section>

        <section class="home-showcase-section" aria-labelledby="protection-tools-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.tools)}</span>
              <h2 id="protection-tools-title">${escapeHtml(tools.title)}</h2>
            </div>
            <p>${paragraphHtml(tools.body)}</p>
          </div>
          <div class="faq-grid">${renderToolCards(tools)}
          </div>
        </section>

        <section class="home-showcase-section" aria-labelledby="warning-signs-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.signs)}</span>
              <h2 id="warning-signs-title">${escapeHtml(signs.title)}</h2>
            </div>
            <p>${paragraphHtml(signs.body)}</p>
          </div>
          <div class="home-method-grid">${renderWarningCards(signs)}
          </div>
          <div class="home-section-cta">
            <div>
              <strong>${escapeHtml(urgent.title)}</strong>
              <span>${paragraphHtml(urgent.body)}</span>
            </div>
            <a href="#support-resources">${escapeHtml(t.urgentButton)}</a>
          </div>
        </section>

        <section class="home-showcase-section" id="support-resources" aria-labelledby="support-resources-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.support)}</span>
              <h2 id="support-resources-title">${escapeHtml(support.title)}</h2>
            </div>
            <p>${paragraphHtml(support.body)}</p>
          </div>
          <div class="faq-grid">${renderToolCards(support)}
          </div>
        </section>

        <section class="home-showcase-section" id="responsible-faq" aria-labelledby="responsible-faq-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">${escapeHtml(t.faq)}</span>
              <h2 id="responsible-faq-title">${escapeHtml(source.faqTitle)}</h2>
            </div>
          </div>
          <div class="faq-grid">${renderFaqCards(source.faq)}
          </div>
        </section>

        ${source.countries}
      </div>
    </main>`;
};

let changed = 0;
for (const locale of Object.keys(copy)) {
  const file = locale === 'en'
    ? path.join(ROOT, 'responsible-gambling', 'index.html')
    : path.join(ROOT, locale, 'responsible-gambling', 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  const source = extractSource(html);

  html = html
    .replace(/<body([^>]*)>/i, (_, attrs) => {
      const cleaned = attrs
        .replace(/\sclass="[^"]*"/gi, '')
        .replace(/\sdata-page="[^"]*"/gi, '');
      return `<body class="home-page" data-page="responsible-gambling"${cleaned}>`;
    })
    .replace(/<main\b[^>]*>[\s\S]*?<\/main>/i, renderMain(locale, source));

  fs.writeFileSync(file, html);
  changed += 1;
}

console.log(`Redesigned ${changed} Responsible Gambling pages with existing site components.`);
