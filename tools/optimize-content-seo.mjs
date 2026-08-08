#!/usr/bin/env node

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const YEAR = '2026';
const EXCLUDED_DIRS = new Set(['.git', '.vercel', 'node_modules', 'tmp']);

const decode = value =>
  value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)));

const plain = value => decode(value.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const escapeHtml = value =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const collectHtml = async directory => {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory() && EXCLUDED_DIRS.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectHtml(absolute)));
    if (entry.isFile() && entry.name === 'index.html') files.push(absolute);
  }
  return files;
};

const setMeta = (html, key, value, isProperty = false) => {
  const attribute = isProperty ? 'property' : 'name';
  const pattern = new RegExp(`(<meta\\b(?=[^>]*\\b${attribute}=["']${key}["'])[^>]*\\bcontent=)(["'])([\\s\\S]*?)(\\2[^>]*>)`, 'i');
  return html.replace(pattern, (_, before, quote, _oldValue, after) => `${before}${quote}${escapeHtml(value)}${after}`);
};

const setMetadata = (html, title, description) => {
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`);
  html = setMeta(html, 'description', description);
  html = setMeta(html, 'og:title', title, true);
  html = setMeta(html, 'og:description', description, true);
  html = setMeta(html, 'twitter:title', title);
  html = setMeta(html, 'twitter:description', description);
  return html;
};

const getCurrentMetadata = html => {
  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() || '');
  const descriptionMatch = html.match(/<meta\b(?=[^>]*\bname=["']description["'])[^>]*\bcontent=(["'])([\s\S]*?)\1[^>]*>/i);
  return { title, description: decode(descriptionMatch?.[2]?.trim() || '') };
};

const syncCurrentWebPageJson = (html, locale) => {
  const metadata = getCurrentMetadata(html);
  return html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, open, raw, close) => {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return match;
      }
      let changed = false;
      const nodes = data['@graph'] || [data];
      for (const node of nodes) {
        if (node['@type'] === 'WebPage') {
          if (metadata.title && node.name !== metadata.title) {
            node.name = metadata.title;
            changed = true;
          }
          if (metadata.description && node.description && node.description !== metadata.description) {
            node.description = metadata.description;
            changed = true;
          }
        }
        if (locale === 'de' && node['@type'] === 'BreadcrumbList') {
          const first = node.itemListElement?.find(item => item.position === 1);
          if (first && (first.name !== 'Startseite' || first.item !== 'https://spincresta.com/de/')) {
            first.name = 'Startseite';
            first.item = 'https://spincresta.com/de/';
            changed = true;
          }
        }
      }
      return changed ? `${open}${JSON.stringify(data)}${close}` : match;
    }
  );
};

const pageUrlPath = relative => relative === 'index.html' ? '/' : `/${relative.replace(/index\.html$/, '')}`;

const ensureLanguageAlternates = (html, relative, allFiles) => {
  const pairRelative = relative.startsWith('de/')
    ? (relative === 'de/index.html' ? 'index.html' : relative.replace(/^de\//, ''))
    : (relative === 'index.html' ? 'de/index.html' : `de/${relative}`);
  if (!allFiles.has(pairRelative)) return html;

  const enRelative = relative.startsWith('de/') ? pairRelative : relative;
  const deRelative = relative.startsWith('de/') ? relative : pairRelative;
  const enUrl = `https://spincresta.com${pageUrlPath(enRelative)}`;
  const deUrl = `https://spincresta.com${pageUrlPath(deRelative)}`;
  html = html
    .replace(/<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["']en["'])[^>]*>/i, `<link rel="alternate" hreflang="en" href="${enUrl}" />`)
    .replace(/<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["']de["'])[^>]*>/i, `<link rel="alternate" hreflang="de" href="${deUrl}" />`)
    .replace(/<link\b(?=[^>]*\brel=["']alternate["'])(?=[^>]*\bhreflang=["']x-default["'])[^>]*>/i, `<link rel="alternate" hreflang="x-default" href="${enUrl}" />`);
  const links = [...html.matchAll(/<link\b(?=[^>]*\brel=["']alternate["'])[^>]*\bhreflang=["']([^"']+)["'][^>]*>/gi)];
  const codes = links.map(match => match[1].toLowerCase());
  const additions = [];
  if (!codes.some(code => code.startsWith('en'))) additions.push(`<link rel="alternate" hreflang="en" href="${enUrl}" />`);
  if (!codes.some(code => code.startsWith('de'))) additions.push(`<link rel="alternate" hreflang="de" href="${deUrl}" />`);
  if (!codes.includes('x-default')) additions.push(`<link rel="alternate" hreflang="x-default" href="${enUrl}" />`);
  if (!additions.length) return html;
  return html.replace(/(<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>)/i, `$1\n    ${additions.join('\n    ')}`);
};

const compactTitle = (prefix, locale, sweepstakes = false) => {
  const options =
    locale === 'de'
      ? [
          `${prefix} Test ${YEAR} | Bonus, Spiele & Auszahlung`,
          `${prefix} Test ${YEAR} | Bonus & Auszahlung`,
          `${prefix} Test ${YEAR}`,
        ]
      : sweepstakes
        ? [
            `${prefix} Review ${YEAR} | Bonuses, Games & Rules`,
            `${prefix} Review ${YEAR} | Bonuses & Rules`,
            `${prefix} Review ${YEAR}`,
          ]
        : [
            `${prefix} Review ${YEAR} | Bonus, Games & Payouts`,
            `${prefix} Review ${YEAR} | Bonus & Payouts`,
            `${prefix} Review ${YEAR}`,
          ];
  return options.find(value => value.length <= 65) || options.at(-1);
};

const syncJsonLd = (html, { title, description, locale, brandPage, legalAnswer }) =>
  html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, open, raw, close) => {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return match;
      }

      const nodes = data['@graph'] || [data];
      for (const node of nodes) {
        if (node['@type'] === 'WebPage') {
          if (title) node.name = title;
          if (description) node.description = description;
          if (legalAnswer) node.reviewedBy = { '@id': 'https://spincresta.com/#odri-chambers' };
        }
        if (brandPage && node['@type'] === 'BreadcrumbList') {
          const second = node.itemListElement?.find(item => item.position === 2);
          if (second) {
            second.name = locale === 'de' ? 'Casino-Tests' : 'Casino Reviews';
            second.item = `https://spincresta.com/${locale === 'de' ? 'de/' : ''}casinos-and-betting/`;
          }
        }
        if (locale === 'de' && node['@type'] === 'BreadcrumbList') {
          const first = node.itemListElement?.find(item => item.position === 1);
          if (first) {
            first.name = 'Startseite';
            first.item = 'https://spincresta.com/de/';
          }
        }
        if (legalAnswer && node['@type'] === 'FAQPage') {
          const question = node.mainEntity?.find(item =>
            /\b(legal|legally)\b|legal|erlaubt|rechtslage/i.test(item.name || '')
          );
          if (question?.acceptedAnswer) question.acceptedAnswer.text = legalAnswer;
        }
      }

      if (
        legalAnswer &&
        Array.isArray(data['@graph']) &&
        !data['@graph'].some(node => node['@id'] === 'https://spincresta.com/#odri-chambers')
      ) {
        data['@graph'].push({
          '@type': 'Person',
          '@id': 'https://spincresta.com/#odri-chambers',
          name: 'Odri Chambers',
          url: `https://spincresta.com/${locale === 'de' ? 'de/' : ''}authors/odri-chambers/`,
          image: 'https://spincresta.com/images/team/odri-chambers.jpg',
          jobTitle: locale === 'de' ? 'iGaming-Expertin' : 'iGaming Expert',
          worksFor: { '@id': 'https://spincresta.com/#organization' },
          sameAs: ['https://www.linkedin.com/in/odri-chambers-4344091b5/'],
        });
      }
      return `${open}${JSON.stringify(data)}${close}`;
    }
  );

const extractCurrency = html => {
  const head = html.match(/<head>[\s\S]*?<\/head>/i)?.[0] || '';
  const values = [...head.matchAll(/\b(AED|ARS|AUD|AZN|BDT|BRL|CAD|CHF|CLP|COP|CZK|DKK|EGP|EUR|GBP|GEL|GHS|HUF|IDR|INR|ISK|JPY|KES|KRW|KZT|MAD|MXN|MYR|NGN|NOK|NZD|PEN|PHP|PKR|PLN|RON|RSD|RUB|SAR|SEK|THB|TRY|UAH|USD|UYU|UZS|VND|ZAR)\b/g)].map(match => match[1]);
  return values[0] || '';
};

const REGIONS = {
  ar: { en: 'Argentina', de: 'Argentinien' },
  az: { en: 'Azerbaijan', de: 'Aserbaidschan' },
  cl: { en: 'Chile', de: 'Chile' },
  es: { en: 'Spain', de: 'Spanien' },
  fr: { en: 'France', de: 'Frankreich' },
  ng: { en: 'Nigeria', de: 'Nigeria' },
  nl: { en: 'Netherlands', de: 'Niederlande' },
  tr: { en: 'Turkey', de: 'Türkei' },
  uk: { en: 'UK', de: 'UK' },
};

const brandMetadata = (html, locale, relative) => {
  const h1 = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  let prefix = h1
    .replace(/\s+(?:Review|Test)\s+(?:Coming Soon|Demnächst verfügbar)$/i, '')
    .replace(/\s+(?:Review|Test|Bewertung)$/i, '')
    .replace(/-Test$/i, '')
    .replace(/\s+Casino-Test$/i, ' Casino')
    .replace(/\bCasino- und Wettbewertung\b/gi, 'Casino & Sportwetten')
    .replace(/\b(\d+Casino) Casino\b/gi, '$1')
    .replace(/\b(Casino)(?:\s+\1)+\b/gi, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  const slug = relative.split('/').at(-2);
  const regionCode = slug.match(/-([a-z]{2})$/)?.[1];
  const region = REGIONS[regionCode]?.[locale];
  if (region && !new RegExp(`\\b${region.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')}\\b`, 'i').test(prefix)) {
    prefix = `${prefix} ${region}`;
  }
  if (!prefix) return null;
  const sweepstakes = /sweep|social casino|gold coins|sweep coins/i.test(html);
  const title = compactTitle(prefix, locale, sweepstakes);
  const description =
    locale === 'de'
      ? `${prefix} im Test: Bonus, Spiele, Zahlungen, Auszahlung, KYC, regionale Verfügbarkeit und Spielerschutz für ${YEAR}.`
      : `${prefix} review: compare bonus terms, games, payments, withdrawal and KYC rules, regional availability, and safer-play tools for ${YEAR}.`;
  return { title, description, prefix };
};

const addBrandEditorialNote = (html, locale) => {
  html = html.replace(
    /class=(["'])expert-disclaimer editorial-meta\1/gi,
    'class="hero-subtitle editorial-meta"'
  );
  if (/class=["'][^"']*editorial-meta/i.test(html)) return html;
  const note =
    locale === 'de'
      ? `<p class="hero-subtitle editorial-meta">Redaktionell geprüft: August ${YEAR}. Boni, Zahlungsmethoden und Verfügbarkeit können sich ändern. Prüfen Sie vor der Einzahlung die aktuellen Bedingungen beim Anbieter.</p>`
      : `<p class="hero-subtitle editorial-meta">Editorially reviewed: August ${YEAR}. Bonuses, payment methods, and availability can change. Verify the operator's current terms before depositing.</p>`;
  return html.replace(/(<p\b[^>]*class=["'][^"']*hero-subtitle[^"']*["'][^>]*>[\s\S]*?<\/p>)/i, `$1\n        ${note}`);
};

const removeBrandRelatedGuides = html =>
  html.replace(
    /\s*<section\b[^>]*class=["'][^"']*\bbrand-related-guides\b[^"']*["'][^>]*>[\s\S]*?<\/section>\s*/gi,
    '\n'
  );

const countryMetadata = (html, locale) => {
  const h1 = plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '');
  const currency = extractCurrency(html);
  if (locale === 'de') {
    const match = h1.match(/\b(in|für)\s+(.+)$/i);
    const location = match ? `${match[1].toLowerCase()} ${match[2]}` : h1.replace(/^Beste?\s+Online-Casinos.*?\s+/i, '');
    const base = `Online-Casinos ${location} ${YEAR}`;
    const title = [
      `${base}${currency ? ` | ${currency}-Guide` : ' | Casino-Guide'}`,
      `${base} | Guide`,
      base,
    ].find(candidate => candidate.length >= 30 && candidate.length <= 65) || base;
    const description = `Online-Casinos ${location} vergleichen: Lizenzen, Bonusbedingungen${currency ? `, ${currency}-Zahlungen` : ', Zahlungen'}, Auszahlungsregeln und Spielerschutz für ${YEAR}.`;
    return { title, description, location, displayCountry: match?.[2] || location };
  }
  const country = h1.match(/\bin\s+(.+)$/i)?.[1] || h1.replace(/^Best Online Casinos.*?\s+/i, '');
  const withCurrency = `Best Online Casinos in ${country} ${YEAR}${currency ? ` | ${currency} Guide` : ''}`;
  const title = withCurrency.length <= 65 ? withCurrency : `Online Casinos in ${country} ${YEAR}${currency ? ` | ${currency} Guide` : ''}`;
  const description = `Compare online casinos in ${country}: licensing, bonus terms${currency ? `, ${currency} payments` : ', payments'}, withdrawal rules, regional access, and safer-play tools for ${YEAR}.`;
  return { title, description, location: `in ${country}`, displayCountry: country };
};

const replaceCountryExpertReview = (html, locale, data) => {
  const header =
    locale === 'de'
      ? `<div class="expert-header">
              <a class="expert-avatar" href="/de/authors/odri-chambers/" aria-label="Autorenprofil von Odri Chambers">
                <img src="/images/team/odri-chambers.jpg" alt="Odri Chambers" width="800" height="800" loading="lazy" decoding="async" />
              </a>
              <div class="expert-info">
                <span class="expert-byline-label">Geprüft von</span>
                <h3><a href="/de/authors/odri-chambers/">Odri Chambers</a></h3>
                <p class="expert-role">iGaming-Expertin</p>
                <p class="expert-meta">Tätig in der iGaming-Branche seit 2020</p>
                <a class="expert-linkedin" href="https://www.linkedin.com/in/odri-chambers-4344091b5/" target="_blank" rel="me noopener noreferrer">LinkedIn-Profil</a>
              </div>
            </div>`
      : `<div class="expert-header">
              <a class="expert-avatar" href="/authors/odri-chambers/" aria-label="Odri Chambers author profile">
                <img src="/images/team/odri-chambers.jpg" alt="Odri Chambers" width="800" height="800" loading="lazy" decoding="async" />
              </a>
              <div class="expert-info">
                <span class="expert-byline-label">Reviewed by</span>
                <h3><a href="/authors/odri-chambers/">Odri Chambers</a></h3>
                <p class="expert-role">iGaming Expert</p>
                <p class="expert-meta">Working in the iGaming industry since 2020</p>
                <a class="expert-linkedin" href="https://www.linkedin.com/in/odri-chambers-4344091b5/" target="_blank" rel="me noopener noreferrer">LinkedIn profile</a>
              </div>
            </div>`;
  const body =
    locale === 'de'
      ? `<div class="expert-body">
              <p>Unser Länder-Vergleich bündelt aktuelle Angaben von Anbietern, die Spieler ${data.location} ansprechen. Geprüft werden Lizenzhinweise, regionale Einschränkungen, Bonusbedingungen, Kassenlimits, KYC-Anforderungen und Werkzeuge für verantwortungsvolles Spielen.</p>
              <p>Die Bewertung ist eine redaktionelle Einordnung öffentlich verfügbarer Informationen. Sie ist kein Nachweis dafür, dass wir bei jedem Anbieter ein Echtgeldkonto eröffnet oder Auszahlungen in jedem Land selbst durchgeführt haben.</p>
              <h3>Was wir bei jedem Anbieter prüfen</h3>
              <ul class="expert-methodology">
                <li>Lizenzangaben, Betreiberidentität und Zulässigkeit für den Wohnsitz des Spielers</li>
                <li>Verfügbare Ein- und Auszahlungsmethoden, Limits, Gebühren und Bearbeitungszeiten</li>
                <li>Bonusregeln: Umsatzbedingungen, Höchsteinsatz, ausgeschlossene Spiele und Fristen</li>
                <li>KYC-Unterlagen, Kontoschutz, Beschwerdewege und Bedingungen für Auszahlungen</li>
                <li>Einzahlungs- und Verlustlimits, Selbstausschluss und weitere Spielerschutzfunktionen</li>
              </ul>
              <h3>So entstehen die Ranglisten</h3>
              <p>Anbieter mit klaren Bedingungen, nachvollziehbaren Lizenzangaben, geeigneten Zahlungswegen und wirksamen Spielerschutzfunktionen werden höher eingeordnet. Werbepartnerschaften ersetzen diese Kriterien nicht.</p>
              <p class="expert-disclaimer">Redaktionell aktualisiert: August ${YEAR}. Angaben und regionale Regeln können sich ändern. Prüfen Sie vor Registrierung und Einzahlung die aktuellen Bedingungen des Anbieters sowie die Hinweise der zuständigen Behörde. Glücksspiel ist nur für Volljährige und kann abhängig machen.</p>
            </div>`
      : `<div class="expert-body">
              <p>Our country comparison reviews current information published by operators serving players ${data.location}. We check licence disclosures, regional restrictions, bonus rules, cashier limits, KYC requirements, and safer-play controls.</p>
              <p>The rating is an editorial assessment of publicly available information. It does not claim that we opened a real-money account or completed a withdrawal with every operator in every country.</p>
              <h3>What we check for every operator</h3>
              <ul class="expert-methodology">
                <li>Licence details, operator identity, and eligibility for the player's place of residence</li>
                <li>Deposit and withdrawal methods, limits, fees, and stated processing times</li>
                <li>Bonus rules: wagering, maximum bet, excluded games, and expiry dates</li>
                <li>KYC documents, account security, complaints routes, and payout conditions</li>
                <li>Deposit and loss limits, self-exclusion, and other safer-play controls</li>
              </ul>
              <h3>How rankings are decided</h3>
              <p>Operators rank higher when their terms are clear, licence information is traceable, payment routes fit the market, and safer-play controls are easy to find. Commercial relationships do not replace these criteria.</p>
              <p class="expert-disclaimer">Editorially updated: August ${YEAR}. Offers and regional rules can change. Before registering or depositing, verify the operator's current terms and guidance from the relevant authority. Gambling is for adults only and can be addictive.</p>
            </div>`;
  html = html.replace(
    /<div class=["']expert-header["']>\s*<div class=["']expert-info["']>[\s\S]*?<\/div>\s*<\/div>/i,
    header
  );

  return html.replace(/<div class=["']expert-body["']>[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/section>/i, `${body}\n          </div>\n        </div>\n      </section>`);
};

const replaceLegalCopy = (html, locale, data) => {
  const answer =
    locale === 'de'
      ? `Die Regeln für Online-Glücksspiel ${data.location} hängen vom lokalen Recht, der Produktart und der Lizenz des Betreibers ab. Prüfen Sie vor der Registrierung die aktuellen Angaben der zuständigen Behörde. Eine ausländische Lizenz allein bestätigt nicht, dass ein Anbieter Personen an Ihrem Wohnort legal bedienen darf.`
      : `Online-gambling rules in ${data.displayCountry} depend on local law, product type, and operator licensing. Check current regulator or government guidance before registering. An offshore licence alone does not confirm that a site may legally serve residents.`;
  const headingPattern = locale === 'de' ? '(?:(?:Rechtslage|Rechtsstatus|Rechtliche Lage)[^<]*|Ist Online-Glücksspiel[^<]*(?:legal|erlaubt)[^<]*)' : '(?:Legal Status[^<]*|Is online gambling[^<]*legal[^<]*)';
  const pattern = new RegExp(`(<h3[^>]*>${headingPattern}<\\/h3>\\s*)<p[^>]*>[\\s\\S]*?<\\/p>`, 'gi');
  return {
    html: html.replace(pattern, `$1<p>${escapeHtml(answer)}</p>`),
    answer,
  };
};

const CORE_METADATA = new Map([
  ['about/index.html', ['About SpinCresta | Review Method & Editorial Standards', 'Learn how SpinCresta researches casino brands, compares terms and payments, handles commercial relationships, and maintains safer-play standards.']],
  ['de/about/index.html', ['Über SpinCresta | Testmethode & redaktionelle Standards', 'So recherchiert SpinCresta Casino-Anbieter, vergleicht Bedingungen und Zahlungen und trennt redaktionelle Bewertungen von Partnerschaften.']],
  ['privacy-policy/index.html', ['SpinCresta Privacy Policy | Data & Cookie Information', 'Read how SpinCresta handles analytics, cookies, external links, personal data, retention, security, and privacy choices when you use the website.']],
  ['blog/how-to-choose-an-online-casino/index.html', ['How to Choose an Online Casino | Practical Checklist', 'Use this practical casino checklist to compare licences, bonus terms, payments, KYC, withdrawals, game quality, support, and safer-play tools.']],
  ['de/blog/how-to-choose-an-online-casino/index.html', ['Online-Casino auswählen | Praktische Checkliste', 'Prüfen Sie Lizenz, Bonusbedingungen, Zahlungen, KYC, Auszahlungen, Spielangebot, Support und Spielerschutz vor der Registrierung.']],
  ['index.html', ['Best Online Casinos 2026 | Reviews & Country Guides', 'Compare online casino reviews, bonus terms, payments, withdrawals and country guides. Check current availability and safer-play tools before depositing.']],
  ['de/index.html', ['Online-Casinos 2026 | Tests, Boni & Länder-Guides', 'Online-Casinos vergleichen: Tests, Bonusbedingungen, Zahlungen, Auszahlungen, Länder-Verfügbarkeit und Spielerschutz für 2026.']],
  ['top-casinos/index.html', ['Top Online Casinos 2026 | Reviews & Player Checks', 'Compare selected online casinos by licence information, bonus terms, payments, withdrawal rules, regional access, and safer-play controls.']],
  ['de/top-casinos/index.html', ['Top Online-Casinos 2026 | Tests & Spieler-Checks', 'Vergleichen Sie ausgewählte Online-Casinos nach Lizenzangaben, Bonusregeln, Zahlungen, Auszahlung, Verfügbarkeit und Spielerschutz.']],
  ['de/payment-methods/index.html', ['Casino-Zahlungsmethoden | Karten, E-Wallets & Krypto', 'Vergleichen Sie Karten, E-Wallets, Banküberweisungen und Krypto für Casino-Einzahlungen und Auszahlungen, inklusive Gebühren, KYC und Limits.']],
  ['de/responsible-gambling/index.html', ['Verantwortungsvolles Spielen | Limits, Hilfe & Selbstsperre', 'Erkennen Sie Glücksspielrisiken, setzen Sie Zeit- und Geldlimits und finden Sie Informationen zu Selbstsperre, Kontrollen und professioneller Hilfe.']],
  ['de/top-rated/index.html', ['Bestbewertete Online-Casinos 2026 | Vergleich', 'Vergleichen Sie bestbewertete Online-Casinos nach Lizenzangaben, Bonusregeln, Zahlungen, Nutzerfreundlichkeit und Spielerschutz.']],
  ['online-casinos/index.html', ['Online Casinos by Country 2026 | Local Guides', 'Compare country-specific online casino guides covering local access, payments, currencies, bonus terms, withdrawal checks, and safer-play resources.']],
  ['de/online-casinos/index.html', ['Online-Casinos nach Land 2026 | Länder-Guides', 'Vergleichen Sie Länder-Guides zu Online-Casinos mit regionaler Verfügbarkeit, Zahlungen, Währungen, Bonusbedingungen, Auszahlungen und Spielerschutz.']],
]);

const HUB_CONTENT = new Map([
  ['about/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">How our editorial process works</h2><p>We start with the operator information a player can verify before registration: ownership and licence disclosures, country restrictions, bonus rules, payment methods, withdrawal conditions, identity checks, support routes, and safer-play controls. We compare those details with the needs of each market instead of treating one casino as the best choice for every player.</p><p>Casino terms and regional availability can change. Pages show an editorial review date where appropriate, and material changes are incorporated during scheduled reviews. If published information is unclear, we tell readers what still needs to be confirmed at registration or in the cashier rather than presenting an estimate as a verified fact.</p><h2>Commercial transparency and corrections</h2><p>Some outbound links are affiliate links and may generate revenue for SpinCresta. A commercial relationship does not guarantee a positive ranking and does not replace the editorial checks described above. Readers can report an outdated term or factual error through our contact channels; we review correction requests against current, attributable information.</p></div></section>`],
  ['de/about/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">So funktioniert unser redaktioneller Prozess</h2><p>Wir beginnen mit Angaben, die Spieler vor der Registrierung nachvollziehen können: Betreiber und Lizenzhinweise, Länderbeschränkungen, Bonusregeln, Zahlungsmethoden, Auszahlungsbedingungen, Identitätsprüfung, Supportwege und Funktionen für verantwortungsvolles Spielen. Diese Punkte werden für den jeweiligen Markt eingeordnet, statt einen Anbieter pauschal für jeden Spieler als beste Wahl darzustellen.</p><p>Casino-Bedingungen und regionale Verfügbarkeit können sich ändern. Wo sinnvoll, nennen die Seiten den redaktionellen Prüfzeitpunkt; wesentliche Änderungen fließen in regelmäßige Aktualisierungen ein. Sind Angaben unklar, weisen wir darauf hin, was bei Registrierung oder im Kassenbereich bestätigt werden muss.</p><h2>Werbetransparenz und Korrekturen</h2><p>Einige externe Links sind Affiliate-Links und können Einnahmen für SpinCresta erzeugen. Eine Partnerschaft garantiert keine positive Platzierung und ersetzt nicht die beschriebenen Prüfkriterien. Hinweise auf veraltete Bedingungen oder sachliche Fehler werden anhand aktueller, nachvollziehbarer Informationen geprüft.</p></div></section>`],
  ['blog/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">How to use the SpinCresta guides</h2><p>Start with the decision that matters most. A bonus guide helps you identify wagering, maximum-bet and expiry rules; a payment guide helps you compare fees, limits, KYC and withdrawal routes; a country guide helps you check whether an operator accepts registrations and supports useful local payment options. Brand reviews bring those checks together for one operator.</p><p>Promotional amounts are only the headline. Before depositing, save the terms that apply to your account, confirm that your payment method qualifies, and check which games contribute to wagering. Complete identity verification early when possible and use a payment account in your own name. For country-specific legal questions, rely on current government or regulator guidance.</p><p>These guides are educational comparisons, not a promise of winnings or financial advice. Set a budget, use account limits, and stop if play is no longer entertainment.</p></div></section>`],
  ['de/blog/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">So nutzen Sie die SpinCresta-Ratgeber</h2><p>Beginnen Sie mit der wichtigsten Entscheidung. Ein Bonus-Ratgeber erklärt Umsatzbedingungen, Höchsteinsatz und Fristen; ein Zahlungs-Ratgeber vergleicht Gebühren, Limits, KYC und Auszahlungswege; ein Länder-Guide hilft bei regionaler Verfügbarkeit und passenden Zahlungsmethoden. Marken-Tests führen diese Punkte für einen Anbieter zusammen.</p><p>Der beworbene Betrag ist nur die Überschrift. Speichern Sie vor der Einzahlung die für Ihr Konto geltenden Bedingungen, prüfen Sie die Bonusberechtigung der Zahlungsmethode und den Beitrag einzelner Spiele zum Umsatz. Schließen Sie die Identitätsprüfung möglichst früh ab und verwenden Sie ein Zahlungskonto auf Ihren Namen. Bei rechtlichen Länderfragen sind aktuelle Angaben von Behörden maßgeblich.</p><p>Die Ratgeber sind redaktionelle Vergleiche und kein Gewinnversprechen. Legen Sie ein Budget fest, nutzen Sie Kontolimits und unterbrechen Sie das Spielen, sobald es keine Unterhaltung mehr ist.</p></div></section>`],
  ['online-casinos/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">What country casino guides compare</h2><p>Online casino access, payment routes and consumer protections vary by location. Each country guide therefore focuses on the details that can affect a player before and after registration: operator and licence disclosures, stated regional restrictions, supported currencies, deposit and withdrawal methods, identity checks, bonus terms, and safer-play controls.</p><h2>Check access and legal context first</h2><p>An international or offshore licence does not automatically mean that an operator may legally serve every country. Laws can also differ by product, such as casino games, sports betting or lotteries. Use the guide as a comparison starting point, then check current government or regulator information and confirm eligibility with the operator before creating an account.</p><h2>Compare the cashier, not only the bonus</h2><p>Local cards, bank transfers, e-wallets, mobile money and crypto can have different fees, limits and processing times. Confirm both deposit and withdrawal support, whether currency conversion applies, and which documents are required for KYC. For bonuses, review wagering, maximum-bet rules, excluded games, expiry dates and withdrawal caps.</p><p>Availability and terms can change after publication. SpinCresta highlights practical checks and safer-play tools, but the operator's current account and cashier terms remain decisive. Only adults who meet the legal age in their location should play.</p></div></section>`],
  ['de/online-casinos/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">Was Länder-Guides vergleichen</h2><p>Zugang zu Online-Casinos, Zahlungswege und Verbraucherschutz unterscheiden sich je nach Standort. Deshalb prüfen die Länder-Guides Angaben zu Betreiber und Lizenz, regionale Beschränkungen, unterstützte Währungen, Ein- und Auszahlungen, Identitätsprüfung, Bonusbedingungen und Funktionen für verantwortungsvolles Spielen.</p><h2>Zugang und Rechtslage zuerst prüfen</h2><p>Eine internationale oder Offshore-Lizenz bedeutet nicht automatisch, dass ein Anbieter jedes Land legal bedienen darf. Regeln können sich zudem für Casinospiele, Sportwetten oder Lotterien unterscheiden. Nutzen Sie den Guide als Ausgangspunkt, prüfen Sie danach aktuelle Behördeninformationen und bestätigen Sie die Teilnahmeberechtigung vor der Kontoeröffnung.</p><h2>Kassenbereich statt nur Bonus vergleichen</h2><p>Karten, Banküberweisungen, E-Wallets, Mobile Payment und Krypto können unterschiedliche Gebühren, Limits und Bearbeitungszeiten haben. Prüfen Sie Ein- und Auszahlungsunterstützung, Währungsumrechnung und erforderliche KYC-Dokumente. Bei Boni sind Umsatzbedingungen, Höchsteinsatz, ausgeschlossene Spiele, Fristen und Auszahlungslimits wichtig.</p><p>Verfügbarkeit und Bedingungen können sich ändern. Maßgeblich sind die aktuellen Konto- und Kassenbedingungen des Anbieters. Spielen dürfen nur Volljährige, die das gesetzliche Mindestalter an ihrem Standort erfüllen.</p></div></section>`],
  ['partners/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">Partnership and listing standards</h2><p>SpinCresta considers partnerships with casino and sportsbook operators, affiliate programs, payment services, and tools that are relevant to the site's readers. A commercial proposal does not guarantee publication. Before adding a public listing, we need a working product page, clear operator and contact information, accurate market availability, and terms that readers can verify.</p><p>Sponsored or affiliate links are identified with appropriate link attributes. Commercial compensation does not replace editorial checks and does not guarantee a favourable review or ranking. Operators remain responsible for their licences, offers, account rules, payments, and legal availability in each market.</p><h2>What to include in a proposal</h2><p>Useful submissions include the legal operator name, official domain, licence and market information, supported countries, payment options, current promotion terms, responsible-gambling tools, and a contact for factual updates. We do not publish copied promotional claims as independent findings.</p></div></section>`],
  ['de/partners/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">Standards für Partnerschaften und Einträge</h2><p>SpinCresta prüft Kooperationen mit Casino- und Wettanbietern, Affiliate-Programmen, Zahlungsdiensten und nützlichen Branchenwerkzeugen. Eine kommerzielle Anfrage garantiert keine Veröffentlichung. Für einen öffentlichen Eintrag benötigen wir eine funktionierende Produktseite, klare Betreiber- und Kontaktdaten, nachvollziehbare Marktverfügbarkeit und überprüfbare Bedingungen.</p><p>Gesponserte oder Affiliate-Links erhalten passende Linkattribute. Eine Vergütung ersetzt keine redaktionelle Prüfung und garantiert weder eine positive Bewertung noch eine bestimmte Platzierung. Anbieter bleiben für Lizenzen, Angebote, Kontoregeln, Zahlungen und die rechtliche Verfügbarkeit verantwortlich.</p><h2>Angaben für eine Anfrage</h2><p>Hilfreich sind der rechtliche Betreibername, die offizielle Domain, Lizenz- und Marktangaben, unterstützte Länder, Zahlungsmethoden, aktuelle Aktionsbedingungen, Spielerschutzfunktionen und ein Kontakt für sachliche Aktualisierungen. Werbeaussagen werden nicht ungeprüft als unabhängige Feststellungen veröffentlicht.</p></div></section>`],
  ['top-casinos/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">How to read this selection</h2><p>“Top” is a comparison, not a guarantee that one site suits every player. We prioritise clear operator and licence information, understandable bonus terms, practical payment and withdrawal routes, regional eligibility, account security, support access, and safer-play controls. Confirm the live terms and cashier options before depositing because availability can change by country and account.</p><p>Start with a small amount you can afford to lose, complete verification early, and use deposit, loss and session limits. Gambling is entertainment, not a way to earn money.</p></div></section>`],
  ['de/top-casinos/index.html', `<section class="content" id="seo-editorial-guide"><div class="container content-article"><h2 class="title">So ist diese Auswahl zu verstehen</h2><p>„Top“ ist ein Vergleich und keine Garantie, dass ein Anbieter zu jedem Spieler passt. Bewertet werden nachvollziehbare Betreiber- und Lizenzangaben, verständliche Bonusregeln, geeignete Zahlungs- und Auszahlungswege, regionale Verfügbarkeit, Kontoschutz, Support und Spielerschutzfunktionen. Prüfen Sie vor der Einzahlung die aktuellen Bedingungen und Kassenoptionen.</p><p>Beginnen Sie nur mit einem Betrag, dessen Verlust Sie verkraften können, schließen Sie die Verifizierung früh ab und nutzen Sie Einzahlungs-, Verlust- und Sitzungslimits. Glücksspiel ist Unterhaltung und keine Einnahmequelle.</p></div></section>`],
]);

const addHubContent = (html, relative) => {
  const content = HUB_CONTENT.get(relative);
  if (!content || html.includes('id="seo-editorial-guide"')) return html;
  return html.replace(/\s*<\/main>/i, `\n      ${content}\n    </main>`);
};

const files = await collectHtml(ROOT);
const relativeFiles = new Set(files.map(file => path.relative(ROOT, file)));
const counters = {
  pagesChanged: 0,
  brandPages: 0,
  countryPages: 0,
  footerDirectoriesRemoved: 0,
  germanFirstFixes: 0,
  coreMetadata: 0,
};

for (const absolute of files) {
  const relative = path.relative(ROOT, absolute);
  let html = await readFile(absolute, 'utf8');
  const original = html;
  const locale = relative.startsWith('de/') ? 'de' : 'en';
  const brandPage = /^(?:de\/)?brands\/[^/]+\/index\.html$/.test(relative);
  const countryPage = /^(?:de\/)?online-casinos\/[^/]+\/index\.html$/.test(relative);

  const footerDirectory = /\s*<!-- Footer Brand Directory -->[\s\S]*?<!-- \/Footer Brand Directory -->\s*/g;
  const footerMatches = html.match(footerDirectory)?.length || 0;
  if (footerMatches) {
    html = html.replace(footerDirectory, '\n');
    counters.footerDirectoriesRemoved += footerMatches;
  }

  if (brandPage) {
    const metadata = brandMetadata(html, locale, relative);
    if (metadata) {
      html = setMetadata(html, metadata.title, metadata.description);
      html = addBrandEditorialNote(html, locale);
      html = removeBrandRelatedGuides(html);
      html = syncJsonLd(html, { ...metadata, locale, brandPage: true });
      counters.brandPages += 1;
    }
  } else if (countryPage) {
    const metadata = countryMetadata(html, locale);
    html = setMetadata(html, metadata.title, metadata.description);
    html = replaceCountryExpertReview(html, locale, metadata);
    const legal = replaceLegalCopy(html, locale, metadata);
    html = legal.html;
    html = syncJsonLd(html, { ...metadata, locale, legalAnswer: legal.answer });
    counters.countryPages += 1;
  } else if (CORE_METADATA.has(relative)) {
    const [title, description] = CORE_METADATA.get(relative);
    html = setMetadata(html, title, description);
    html = syncJsonLd(html, { title, description, locale });
    counters.coreMetadata += 1;
  }

  html = addHubContent(html, relative);
  html = ensureLanguageAlternates(html, relative, relativeFiles);
  html = syncCurrentWebPageJson(html, locale);

  if (locale === 'de' && relative !== 'de/brands/first/index.html') {
    const before = (html.match(/\bFirst\b/g) || []).length;
    if (relative === 'de/casinos-and-betting/index.html') {
      html = html
        .replace(/für alle First 5 Einzahlungen/g, 'für alle ersten 5 Einzahlungen')
        .replace(/für alle First 5 Einlagen/g, 'für alle ersten 5 Einzahlungen')
        .replace(/bei First 5 Einzahlungen/g, 'bei den ersten 5 Einzahlungen')
        .replace(/Ihre First 4 Einzahlungen/g, 'Ihre ersten 4 Einzahlungen');
    } else {
      const protectedLeague = '__SPINCRESTA_FIRST_PROFESSIONAL_LEAGUE__';
      const protectedPerson = '__SPINCRESTA_FIRST_PERSON__';
      html = html
        .replace(/First Professional League/g, protectedLeague)
        .replace(/First-Person/g, protectedPerson)
        .replace(/First-come-First-(?:Zustellung|Serve)/gi, 'Reihenfolge des Eingangs')
        .replace(/\bdie (drei|vier|fünf) Einzahlungen von First\b/gi, 'die ersten $1 Einzahlungen')
        .replace(/\büber die (drei|vier|fünf) Einzahlungen von First\b/gi, 'über die ersten $1 Einzahlungen')
        .replace(/\bfür die (drei|vier|fünf) Einzahlungen First\b/gi, 'für die ersten $1 Einzahlungen')
        .replace(/\bdie (drei|vier|fünf) Einzahlungen First\b/gi, 'die ersten $1 Einzahlungen')
        .replace(/\b(\d+) Einzahlungen von First\b/gi, 'die ersten $1 Einzahlungen')
        .replace(/\bFirst (\d+) Einzahlungen\b/gi, 'die ersten $1 Einzahlungen')
        .replace(/\bFirst (drei|vier|fünf) Einzahlungen\b/gi, 'die ersten $1 Einzahlungen')
        .replace(/\bFirst qualifizierenden Einzahlung\b/gi, 'ersten qualifizierenden Einzahlung')
        .replace(/\bFirst Casino-Einzahlung\b/gi, 'erste Casino-Einzahlung')
        .replace(/\bFirst Live-Einzahlung\b/gi, 'erste Live-Casino-Einzahlung')
        .replace(/\bFirst Anzahlung\b/gi, 'erste Einzahlung')
        .replace(/\bFirst Auszahlung\b/gi, 'erste Auszahlung')
        .replace(/\bFirst Kaufpaket\b/gi, 'erstes Kaufpaket')
        .replace(/\bFirst Kauf\b/gi, 'erster Kauf')
        .replace(/\bEinzahlung(?:en)? von First\b/gi, 'Ersteinzahlung')
        .replace(/\bEinzahlung First\b/gi, 'Ersteinzahlung')
        .replace(/\bAnzahlung First\b/gi, 'Ersteinzahlung')
        .replace(/\bAuszahlung von First\b/gi, 'erste Auszahlung')
        .replace(/\bAuszahlung First\b/gi, 'erste Auszahlung')
        .replace(/\bMobile-First\b/gi, 'mobilorientiert')
        .replace(/\bbrowser-First\b/gi, 'browserbasiert')
        .replace(/\bCrypto-First\b/gi, 'kryptoorientiert')
        .replace(/\bKarten-First\b/gi, 'kartenorientiert')
        .replace(/\bBank-First\b/gi, 'bankorientiert')
        .replace(/\bEsports-First\b/gi, 'E-Sport-orientiert')
        .replace(/\bFußball-First\b/gi, 'fußballorientiert')
        .replace(/\bCricket-First\b/gi, 'cricketorientiert')
        .replace(/\bCasino-First\b/gi, 'casinoorientiert')
        .replace(/\bSport-First\b/gi, 'sportorientiert')
        .replace(/\bPoker-First\b/gi, 'pokerorientiert')
        .replace(/\bPromo-First\b/gi, 'promo-orientiert')
        .replace(/\bProvider-First\b/gi, 'anbieterorientiert')
        .replace(/\bFilter-First\b/gi, 'filterorientiert')
        .replace(/\bDealer-First\b/gi, 'dealerorientiert')
        .replace(/\bQuoten-First\b/gi, 'quotenorientiert')
        .replace(/\bFirst-Impressionen\b/gi, 'erste Eindrücke')
        .replace(/\bFirst\b/g, 'zuerst')
        .replaceAll(protectedLeague, 'First Professional League')
        .replaceAll(protectedPerson, 'First-Person');
    }
    html = html
      .replace(/\bFirst nützliche Antwort\b/g, 'erste nützliche Antwort')
      .replace(/\bFirst Einzahlung\b/g, 'erste Einzahlung')
      .replace(/\bFirst Auszahlung\b/g, 'erste Auszahlung')
      .replace(/\bFirst Rücknahme\b/g, 'erste Auszahlung')
      .replace(/\bFirst auszahlen\b/g, 'zum ersten Mal auszahlen')
      .replace(/\bSicherheit First\b/g, 'Sicherheit an erster Stelle')
      .replace(/\bFirst Einzahlung tätigen\b/g, 'erste Einzahlung tätigen')
      .replace(/\bFirst Einzahlungsbonus\b/g, 'Ersteinzahlungsbonus');
    counters.germanFirstFixes += before - (html.match(/\bFirst\b/g) || []).length;
  }

  if (locale === 'de') {
    html = html
      .replace(/>Top Casinos<\/a>/g, '>Top-Casinos</a>')
      .replace(/\bdie die ersten\b/gi, 'die ersten')
      .replace(/\b(?:vor|nach|ab|bei|auf) der erste Einzahlung\b/gi, match => match.replace('der erste', 'der ersten'))
      .replace(/\b(mit|außerhalb|aus) der erste Einzahlung\b/gi, '$1 der ersten Einzahlung')
      .replace(/\bauf der erste Einzahlungsaktion\b/gi, 'auf der ersten Einzahlungsaktion')
      .replace(/\bdie erste Einzahlungsspins\b/gi, 'die Freispiele der ersten Einzahlung')
      .replace(/\bdie erste Prüfungen\b/gi, 'die ersten Prüfungen')
      .replace(/\bden erste Prüfungen\b/gi, 'den ersten Prüfungen')
      .replace(/\bein einmaliges erste Einzahlungsangebot\b/gi, 'ein einmaliges Ersteinzahlungsangebot')
      .replace(/\bein einmaliges erste Einzahlungspaket\b/gi, 'ein einmaliges Ersteinzahlungspaket')
      .replace(/\bEchtgeldsitzung von zuerst\b/gi, 'Echtgeldsitzung von Anfang an')
      .replace(/\bAuszahlungsversuch von zuerst\b/gi, 'ersten Auszahlungsversuch')
      .replace(/\bVertrauenssignale von zuerst\b/gi, 'ersten Vertrauenssignale')
      .replace(/\bAnzahlung von zuerst\b/gi, 'Ersteinzahlung')
      .replace(/\bmobilen Nutzung von zuerst\b/gi, 'mobilen Nutzung')
      .replace(/\bWas zu überprüfen ist zuerst\b/gi, 'Was zuerst zu überprüfen ist')
      .replace(/\bWas Spieler überprüfen sollten zuerst\b/gi, 'Was Spieler zuerst überprüfen sollten')
      .replace(/\bWas sollten vorsichtige Spieler überprüfen zuerst\?/gi, 'Was sollten vorsichtige Spieler zuerst überprüfen?')
      .replace(/\bWas sollten Spieler an der Kasse zuerst einchecken\?/gi, 'Was sollten Spieler an der Kasse zuerst prüfen?')
      .replace(/\bSpieler, die die Regeln lesen zuerst\b/gi, 'Spieler, die zuerst die Regeln lesen')
      .replace(/\bworauf es ankommt zuerst\b/gi, 'worauf es zuerst ankommt')
      .replace(/\bspielen möchten zuerst\b/gi, 'zuerst spielen möchten')
      .replace(/\beinen Blick auf zuerst wert\b/gi, 'zuerst einen Blick wert')
      .replace(/\bmit den einzelnen Formaten vertraut zuerst\b/gi, 'zuerst mit den einzelnen Formaten vertraut')
      .replace(/\bEinzahlungen und zuerst Auszahlungszeitpunkte\b/gi, 'Einzahlungen und den Zeitpunkt der ersten Auszahlung')
      .replace(/\bzuerst Auszahlungszeitpunkte\b/gi, 'den Zeitpunkt der ersten Auszahlung')
      .replace(/\bzuerst Auszahlungsvorbereitung\b/gi, 'Vorbereitung der ersten Auszahlung')
      .replace(/- zuerst –/g, '- Zu beachten –')
      .replace(/\bauf die (\d+|vier|fünf) Einzahlungen zuerst\b/gi, 'auf die ersten $1 Einzahlungen')
      .replace(/\bauf die fünf Einlagen zuerst\b/gi, 'auf die ersten fünf Einzahlungen')
      .replace(/über die fünf Einlagen zuerst/gi, 'über die ersten fünf Einzahlungen')
      .replace(/\bfür die (\d+|vier|fünf) Casino-Einzahlungen zuerst\b/gi, 'für die ersten $1 Casino-Einzahlungen')
      .replace(/über die (\d+|vier|fünf) Einlagen zuerst/gi, 'über die ersten $1 Einzahlungen')
      .replace(/\bSporteinzahlung zuerst\b/gi, 'erste Sporteinzahlung')
      .replace(/\bauf die Kaution zuerst\b/gi, 'auf die Ersteinzahlung')
      .replace(/<td>zuerst<\/td>/gi, '<td>Erste Einzahlung</td>')
      .replace(/\bCode zuerst\b/g, 'Code FIRST')
      .replace(/\bSportwetten, Live-Wetten, Spielautomaten, Live-Casino oder gemischtes Spiel zuerst\./gi, 'Zuerst das bevorzugte Produkt festlegen: Sportwetten, Live-Wetten, Spielautomaten, Live-Casino oder gemischtes Spiel.')
      .replace(/\bSportwetten, Live-Wetten, Spielautomaten, Tischspiele oder Live-Casino zuerst\./gi, 'Zuerst das bevorzugte Produkt festlegen: Sportwetten, Live-Wetten, Spielautomaten, Tischspiele oder Live-Casino.')
      .replace(/\bbei den erste Prüfungen\b/gi, 'bei den ersten Prüfungen');
    html = html.replace(
      /Was sollten Spieler auf den Zahlungs- und Regelseiten zuerst von AmonBet überprüfen\?/g,
      'Was sollten Spieler bei AmonBet zuerst auf den Zahlungs- und Regelseiten überprüfen?'
    );
    html = html
      .replace(/eine Einzahlung von 250 EUR High Roller zuerst erforderlich/gi, 'eine erste High-Roller-Einzahlung von 250 EUR erforderlich')
      .replace(/Widersprüchliche Standard-Einzahlungsobergrenzen zuerst auf den aktuellen Seiten/gi, 'Widersprüchliche Obergrenzen für die erste Einzahlung auf den aktuellen Seiten')
      .replace(/Standard-Einzahlungsbonus zuerst/gi, 'Ersteinzahlungsbonus')
      .replace(/die zuerst Titel/gi, 'die ersten Titel')
      .replace(/Billys zuerst willkommen/gi, 'Billys erster Willkommensbonus')
      .replace(/die Ebene zuerst umfasst/gi, 'die erste Stufe umfasst')
      .replace(/Die Vertrauenssignale zuerst prüfen sollten/gi, 'Die zuerst zu prüfenden Vertrauenssignale sollten')
      .replace(/Einzahlungsbonus zuerst\?/gi, 'Ersteinzahlungsbonus?')
      .replace(/die erster Kaufbedingungen/gi, 'die Bedingungen für den ersten Kauf')
      .replace(/Spieler in Argentinien erhalten Fußball zuerst/gi, 'Für Spieler in Argentinien steht Fußball an erster Stelle')
      .replace(/Sportwetten, Live-Wetten, Spielautomaten oder Live-Casino zuerst\./gi, 'Zuerst das bevorzugte Produkt festlegen: Sportwetten, Live-Wetten, Spielautomaten oder Live-Casino.')
      .replace(/Starten Sie klein zuerst/gi, 'Beginnen Sie zunächst mit kleinen Einsätzen')
      .replace(/Steckplätze zuerst/gi, 'Spielautomaten im Fokus')
      .replace(/Welche Einzahlungsmethode Sie verwenden möchten zuerst/gi, 'Welche Einzahlungsmethode Sie zuerst verwenden möchten')
      .replace(/eine Casino-Lobby des Anbieters zuerst/gi, 'eine anbieterorientierte Casino-Lobby')
      .replace(/auf Basiskonditionen und den normalen Auszahlungsfluss zuerst konzentrieren/gi, 'zunächst auf Basiskonditionen und den normalen Auszahlungsfluss konzentrieren')
      .replace(/eine der Vertrauenssignale zuerst prüfen ist/gi, 'eines der zuerst zu prüfenden Vertrauenssignale ist')
      .replace(/Einzahlungsstufe zuerst/gi, 'erste Einzahlungsstufe')
      .replace(/wenn Sie die (Bonusrichtlinien|entsprechenden Regeln) zuerst nicht lesen/gi, 'wenn Sie die $1 nicht zuerst lesen')
      .replace(/Setzen Sie Einsatz- und Sitzungslimits zuerst/gi, 'Setzen Sie zuerst Einsatz- und Sitzungslimits')
      .replace(/Legen Sie Zeit- und Ausgabenlimits fest zuerst/gi, 'Legen Sie zuerst Zeit- und Ausgabenlimits fest')
      .replace(/Setzen Sie Grenzen zuerst/gi, 'Setzen Sie zuerst Grenzen')
      .replace(/zum Überprüfen der Mechanik zuerst nützlich/gi, 'zum ersten Prüfen der Mechanik nützlich')
      .replace(/Der zuerst Live-Casino-Bonus/gi, 'Der erste Live-Casino-Bonus')
      .replace(/Buchmacher-Lizenzinformationen zuerst/gi, 'Buchmacher-Lizenzinformationen')
      .replace(/(\d[\d.]*)\s*€ \+ (\d+) FS zuerst, dann/gi, '$1 € + $2 FS bei der ersten Einzahlung, dann')
      .replace(/(\d+) % bis zu ([\d.]+) € \+ (\d+) FS zuerst, dann/gi, '$1 % bis zu $2 € + $3 FS bei der ersten Einzahlung, dann')
      .replace(/zuerst, Angebote für die zweite, dritte und vierte Einzahlung/gi, 'Die erste Einzahlung bildet den Anfang; Angebote für die zweite, dritte und vierte Einzahlung')
      .replace(/Zu den erste Seiten/gi, 'Zu den ersten Seiten');
    html = html
      .replace(/damit die Echtgeldsitzung zuerst noch mehr Spaß macht/gi, 'damit die Echtgeldsitzung von Anfang an übersichtlich bleibt')
      .replace(/nur für den Einzahlungsmoment zuerst erstellt wurde/gi, 'in erster Linie für den Einzahlungsmoment erstellt wurde')
      .replace(/die ersten Prüfungen sollten auf Karten- oder E-Wallet-Wegen akzeptiert werden, ob Krypto- oder regionale Methoden verfügbar sind und ob KYC-, Zahlungseigentums- oder Anti-Geldwäsche-Prüfungen die erste Auszahlung beeinflussen können/gi, 'Prüfen Sie zuerst, ob Karten oder E-Wallets akzeptiert werden, ob Krypto- oder regionale Methoden verfügbar sind und ob KYC-, Zahlungseigentums- oder Anti-Geldwäsche-Prüfungen die erste Auszahlung beeinflussen können')
      .replace(/und Setzen Sie zuerst Grenzen/g, 'und setzen Sie zuerst Grenzen')
      .replace(/als zuerst vermuten lässt/gi, 'als die Bonusüberschrift vermuten lässt')
      .replace(/wobei die vier Stufen zuerst bis zu/gi, 'wobei die ersten vier Stufen mit bis zu')
      .replace(/wenn man zuerst setzt, einen Auszahlungsantrag stellt/gi, 'wenn man eine erste Wette platziert, einen Auszahlungsantrag stellt');
  }

  if (html !== original) {
    await writeFile(absolute, html);
    counters.pagesChanged += 1;
  }
}

console.log(JSON.stringify(counters, null, 2));
