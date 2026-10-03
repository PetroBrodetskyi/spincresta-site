import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const brand = BRANDS.find(item => item.name === 'Casinado');
assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124854');
assert.equal(brand.bgColor, '#1C2738');
assert.equal(brand.bonus, '100% up to €500 + 200 Free Spins');
assert.equal(brand.image, 'images/casinado.svg');
assert.deepEqual(brand.countries, ['IT', 'ES', 'CH', 'AT', 'IE', 'LU', 'CA', 'NZ', 'AU', 'CL', 'UY', 'MX', 'PE', 'AR', 'CO', 'BR', 'FI', 'NO', 'PL', 'CZ', 'SK', 'HU', 'TR', 'ZA', 'IS', 'SI', 'LV']);
assert.equal(brand.hasDetailPage, true);
assert.equal(BRAND_NEW_GAMES.casinado.length, 6);
assert.equal(new Set(BRAND_NEW_GAMES.casinado.map(game => game.image)).size, 6);
assert.equal(BRAND_SNAPSHOT_CONFIGS.casinado.tabs.length, 3);
assert(BRAND_SNAPSHOT_CONFIGS.casinado.tabs[2].available.includes('Horse racing'));
assert(BRAND_HOMEPAGE_SCREENSHOTS.casinado.includes('casinado-page_z6soxv'));
for (const payment of brand.payments) assert(fs.existsSync(`icons/payments/${payment}.svg`), `Missing ${payment} logo`);
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
let expectedSections;
for (const locale of locales) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  const file = `${prefix}brands/casinado/index.html`;
  const html = fs.readFileSync(file, 'utf8');
  const url = `https://spincresta.com/${prefix}brands/casinado/`;
  assert(html.includes(`<link rel="canonical" href="${url}"`), file);
  assert(html.includes('index, follow, max-image-preview:large'), file);
  assert(!/noindex|coming soon|VikingLuck|vikingluck|ViperWin|viperwin|Sources Checked|Casinadoin|Casinadoista|\uFFFD|11[., ]032|13[., ]707/i.test(html), file);
  assert.equal([...html.matchAll(/hreflang=/g)].length, 11, file);
  assert.equal([...html.matchAll(/<h1>/g)].length, 1, file);
  const sections = [...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map(match => match[1]);
  if (!expectedSections) expectedSections = sections;
  assert.deepEqual(sections, expectedSections, `${file}: section parity`);
  for (const suffix of ['verdict', 'bonus', 'games', 'sports', 'payments', 'safety']) assert(sections.includes(`casinado-${suffix}`), file);
  assert(html.includes('name="brand-snapshot-intro"'), file);
  assert(html.includes('Collections') && html.includes('Champions Cup'), file);
  assert(html.includes('7.19'), `${file}: missing bet-limit conflict`);
  assert(html.includes('support@casinado.com') && html.includes('complaints@casinado.com'), file);
  const faqSection = html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq = [...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([, q, a]) => [decode(q), decode(a)]);
  assert.equal(faq.length, 8, file);
  const graph = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1])['@graph'];
  assert.deepEqual(graph.find(node => node['@type'] === 'FAQPage').mainEntity.map(node => [node.name, node.acceptedAnswer.text]), faq, `${file}: FAQ schema mismatch`);
  assert(graph.some(node => node['@type'] === 'Article' && node.dateModified === '2026-10-03'), file);
  for (const href of [...html.matchAll(/<a[^>]*href="(https?:[^\"]+)"/g)].map(match => decode(match[1]))) {
    const allowed = [brand.urlCasino, 'https://t.me/spincresta', 'https://x.com/SpinCresta'];
    assert(href.startsWith('https://spincresta.com/') || allowed.includes(href), `${file}: unexpected outbound link ${href}`);
  }
  assert(sitemap.includes(`<loc>${url}</loc>`), file);
}
console.log('Casinado: 10 locale reviews, matching sections/FAQ schema, 6 games, 3 Snapshot tabs, bet-limit clarification, payment icons and 27 unchanged GEOs; all checks passed.');
