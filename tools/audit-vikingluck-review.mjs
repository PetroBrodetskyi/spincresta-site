import assert from 'node:assert/strict';
import fs from 'node:fs';
import { BRANDS } from '../scripts/brands.js';
import { BRAND_NEW_GAMES } from '../scripts/brand-new-games.js';
import { BRAND_HOMEPAGE_SCREENSHOTS } from '../scripts/brand-homepage-screenshots.js';
import { BRAND_SNAPSHOT_CONFIGS } from '../scripts/brand-snapshot-configs.js';

const locales = ['en', 'de', 'es', 'it', 'pl', 'uk', 'pt', 'fr', 'hi', 'fi'];
const brand = BRANDS.find(item => item.name === 'VikingLuck');
assert.equal(brand.urlCasino, 'https://armadaapp.media-412.com/click?pid=3862&offer_id=124853');
assert.equal(brand.bgColor, '#4A221B');
assert.equal(brand.bonus, '100% up to €500 + 200 Free Spins');
assert.deepEqual(brand.countries, ['IT', 'ES', 'CH', 'AT', 'IE', 'LU', 'CA', 'NZ', 'AU', 'CL', 'UY', 'MX', 'PE', 'AR', 'CO', 'BR', 'FI', 'NO', 'PL', 'CZ', 'SK', 'HU', 'TR', 'ZA', 'IS', 'SI', 'LV']);
assert.equal(brand.hasDetailPage, true);
assert.equal(BRAND_NEW_GAMES.vikingluck.length, 6);
assert.equal(BRAND_SNAPSHOT_CONFIGS.vikingluck.tabs.length, 3);
assert(BRAND_HOMEPAGE_SCREENSHOTS.vikingluck.includes('vikingluck-page_d8p9jb'));
for (const payment of brand.payments) assert(fs.existsSync(`icons/payments/${payment}.svg`), `Missing ${payment} logo`);
const decode = value => value.replaceAll('&quot;', '"').replaceAll('&lt;', '<').replaceAll('&gt;', '>').replaceAll('&amp;', '&');
let expectedSections;
const sitemap = fs.readFileSync('sitemap.xml', 'utf8');
for (const locale of locales) {
  const prefix = locale === 'en' ? '' : `${locale}/`;
  const file = `${prefix}brands/vikingluck/index.html`;
  const html = fs.readFileSync(file, 'utf8');
  const url = `https://spincresta.com/${prefix}brands/vikingluck/`;
  assert(html.includes(`<link rel="canonical" href="${url}"`), file);
  assert(html.includes('index, follow, max-image-preview:large'), file);
  assert(!/noindex|coming soon|ViperWin|viperwin|Sources Checked/i.test(html), file);
  assert(!/[\uFFFD]|днів, Кожен|; Wpłaty|; Die Überweisungsdauer/.test(html), file);
  assert.equal([...html.matchAll(/hreflang=/g)].length, 11, file);
  assert.equal([...html.matchAll(/<h1>/g)].length, 1, file);
  const sections = [...html.matchAll(/<section[^>]*\sid="([^"]+)"/g)].map(match => match[1]);
  if (!expectedSections) expectedSections = sections;
  assert.deepEqual(sections, expectedSections, `${file}: section parity`);
  const faqSection = html.match(/<section class="container" id="faq">[\s\S]*?<\/section>/)[0];
  const faq = [...faqSection.matchAll(/<h3>(.*?)<\/h3><p>(.*?)<\/p>/g)].map(([, q, a]) => [decode(q), decode(a)]);
  assert.equal(faq.length, 8, file);
  const schema = JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/)[1]);
  const schemaFaq = schema['@graph'].find(node => node['@type'] === 'FAQPage').mainEntity.map(node => [node.name, node.acceptedAnswer.text]);
  assert.deepEqual(schemaFaq, faq, `${file}: FAQ schema/visible copy mismatch`);
  for (const href of [...html.matchAll(/<a[^>]*href="(https?:[^\"]+)"/g)].map(match => decode(match[1]))) {
    const allowed = [brand.urlCasino, 'https://t.me/spincresta', 'https://x.com/SpinCresta'];
    assert(href.startsWith('https://spincresta.com/') || allowed.includes(href), `${file}: unexpected outbound link ${href}`);
  }
  assert(sitemap.includes(`<loc>${url}</loc>`), file);
  assert(html.includes('support@vikingluck.com') && html.includes('complaints@vikingluck.com'), file);
}
console.log('VikingLuck: 10 locale reviews, matching sections/FAQ schema, 6 games, 3 Snapshot tabs, 11 payment icons and 27 unchanged GEOs; all checks passed.');
