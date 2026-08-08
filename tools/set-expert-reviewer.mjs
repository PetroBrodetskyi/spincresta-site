import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const LINKEDIN_URL = 'https://www.linkedin.com/in/odri-chambers-4344091b5/';
const PERSON_ID = 'https://spincresta.com/#odri-chambers';

const reviewerHeader = locale =>
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
                <a class="expert-linkedin" href="${LINKEDIN_URL}" target="_blank" rel="me noopener noreferrer">LinkedIn-Profil</a>
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
                <a class="expert-linkedin" href="${LINKEDIN_URL}" target="_blank" rel="me noopener noreferrer">LinkedIn profile</a>
              </div>
            </div>`;

const collectCountryPages = async locale => {
  const directory = path.join(ROOT, ...(locale === 'de' ? ['de', 'online-casinos'] : ['online-casinos']));
  const entries = await readdir(directory, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory())
    .map(entry => path.join(directory, entry.name, 'index.html'));
};

const addReviewerStructuredData = (html, locale) =>
  html.replace(
    /(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
    (match, open, raw, close) => {
      let data;
      try {
        data = JSON.parse(raw);
      } catch {
        return match;
      }

      const graph = data['@graph'];
      if (!Array.isArray(graph)) return match;

      const webPage = graph.find(node => node['@type'] === 'WebPage');
      if (!webPage) return match;

      webPage.reviewedBy = { '@id': PERSON_ID };

      if (!graph.some(node => node['@id'] === PERSON_ID)) {
        graph.push({
          '@type': 'Person',
          '@id': PERSON_ID,
          name: 'Odri Chambers',
          url: `https://spincresta.com/${locale === 'de' ? 'de/' : ''}authors/odri-chambers/`,
          image: 'https://spincresta.com/images/team/odri-chambers.jpg',
          jobTitle: locale === 'de' ? 'iGaming-Expertin' : 'iGaming Expert',
          worksFor: { '@id': 'https://spincresta.com/#organization' },
          sameAs: [LINKEDIN_URL],
        });
      }

      return `${open}${JSON.stringify(data)}${close}`;
    }
  );

let updated = 0;

for (const locale of ['en', 'de']) {
  for (const file of await collectCountryPages(locale)) {
    let html;
    try {
      html = await readFile(file, 'utf8');
    } catch {
      continue;
    }

    if (!html.includes('class="content expert-review"')) continue;

    let next = html.replace(
      /<div class=["']expert-header["']>[\s\S]*?<div class=["']expert-body["']>/i,
      `${reviewerHeader(locale)}\n            <div class="expert-body">`
    );
    next = addReviewerStructuredData(next, locale);

    if (next === html) continue;
    await writeFile(file, next);
    updated += 1;
  }
}

console.log(`Updated expert reviewer markup on ${updated} country pages.`);
