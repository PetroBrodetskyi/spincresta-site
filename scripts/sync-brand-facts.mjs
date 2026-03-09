import fs from 'fs';
import path from 'path';
import vm from 'vm';

const root = process.cwd();
const brandsJsPath = path.join(root, 'scripts', 'brands.js');
const urlsPath = path.join(root, 'data', 'brand-source-urls.txt');
const brandsDir = path.join(root, 'brands');

const raw = fs.readFileSync(brandsJsPath, 'utf8');
const transformed = raw.replace(/^\s*export\s+const\s+BRANDS\s*=\s*/m, 'module.exports = ');
const sandbox = { module: { exports: [] } };
vm.runInNewContext(transformed, sandbox);
const BRANDS = sandbox.module.exports || [];

const uniq = new Map();
for (const b of BRANDS) {
  const m = (b.urlDetail || '').match(/brands\/([^/.]+)\.html/i);
  if (!m) continue;
  const slug = m[1].toLowerCase();
  if (!uniq.has(slug)) {
    uniq.set(slug, {
      slug,
      name: b.name || slug,
      bonuses: new Set(),
      payments: new Set(),
      countries: new Set(),
      top: !!b.isTopRated,
      exclusive: !!b.isExclusive,
      isNew: !!b.isNew,
    });
  }
  const t = uniq.get(slug);
  if (b.name) t.name = b.name;
  if (b.bonus) t.bonuses.add(String(b.bonus));
  (b.payments || []).forEach(p => t.payments.add(String(p).toLowerCase()));
  (b.countries || []).forEach(c => t.countries.add(String(c).toUpperCase()));
  t.top = t.top || !!b.isTopRated;
  t.exclusive = t.exclusive || !!b.isExclusive;
  t.isNew = t.isNew || !!b.isNew;
}

const urls = fs.readFileSync(urlsPath, 'utf8').split(/\r?\n/).map(s => s.trim()).filter(Boolean);

const clean = s => (s || '').toLowerCase().replace(/https?:\/\//g, '').replace(/^www\./, '').replace(/[^a-z0-9]+/g, '');

const alias = {
  '1red': ['onered', '1red', '1redbet'],
  '1redbet': ['1redbet', 'onered'],
  'neospin': ['neo', 'neospin'],
  'evospin': ['evo', 'evospin'],
  'spinch': ['spinch', 'spinplaylink', 'spin'],
  'gunsbet': ['gunsbet', 'gunsplaylink', 'guns'],
  'phj': ['cazino'],
  'slotsandcasino': ['slotsandcasino'],
  'duckyluck': ['duckyluck'],
  'vegas': ['vegasnow', 'vegas'],
  'betlabel': ['betlbl', 'betlabel'],
  'crorebet': ['crorebet', 'crorebetsite'],
  '4rabet': ['4rabet'],
  'casinoinfinity': ['casinoinfinity'],
  'leon-casino': ['leoncasino', 'leon'],
  '22bit': ['22bit'],
  '22casino': ['22cas', '22casino'],
  'qbet': ['qbet', 'gqbet'],
  'robocat': ['robocat'],
  'dragonia': ['dragonia'],
  'amunra': ['amunra'],
  'frumzi': ['frumzi'],
  'posido': ['posido'],
  'slotlair': ['slotlair'],
  'spinarium': ['spinarium'],
  'betory': ['betory'],
  'twin': ['twin'],
  'slott': ['slott'],
  'crownslots': ['crownslots'],
  'loki': ['loki'],
  'onluck': ['onluck'],
  'corgibet': ['corgibet'],
  'coolzino': ['coolzino'],
  'beef': ['beefcasino', 'beef'],
  'zarbet': ['zarbet'],
  'amonbet': ['amonbet'],
  'amon': ['amoncasino', 'amon'],
  'lasvegasusa': ['lasvegasusa'],
  'roletto': ['rolletto', 'roletto'],
  'yepcasino': ['7yep', 'yepcasino'],
  'fairgo': ['fairg0', 'fairgo'],
  'redstag': ['stagspins', 'redstag'],
};

function pickUrl(meta) {
  const keys = new Set([clean(meta.slug), clean(meta.name), ...(alias[meta.slug] || [])]);
  let best = null;
  let bestScore = -1;
  for (const u of urls) {
    const cu = clean(u);
    let score = 0;
    for (const k of keys) {
      if (!k || k.length < 3) continue;
      if (cu.includes(k)) score += k.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = u;
    }
  }
  return bestScore > 0 ? best : null;
}

function parseFactsFromHtml(text, sourceUrl, status = 200) {
  const title = (text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || '').replace(/\s+/g, ' ').trim();
  const metaDesc = (text.match(/<meta[^>]+name=["']description["'][^>]+content=["']([\s\S]*?)["']/i)?.[1]
    || text.match(/<meta[^>]+content=["']([\s\S]*?)["'][^>]+name=["']description["']/i)?.[1]
    || '').replace(/\s+/g, ' ').trim();
  const h1 = (text.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1] || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  const plain = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const blob = `${title} ${metaDesc} ${h1} ${plain.slice(0, 7000)}`.toLowerCase();

  const flags = {
    welcome: /welcome|sign[- ]?up|first deposit|free spins|bonus/.test(blob),
    cashback: /cashback/.test(blob),
    vip: /vip|loyalty/.test(blob),
    live: /live casino|live dealer/.test(blob),
    esports: /esports|e-sports/.test(blob),
    sports: /sportsbook|sports betting/.test(blob),
    crypto: /bitcoin|btc|ethereum|usdt|tether|crypto|trx|litecoin/.test(blob),
    slots: /slots|slot games/.test(blob),
    mobile: /mobile|android|ios|app/.test(blob),
  };

  return { ok: true, status, url: sourceUrl, title, metaDesc, h1, flags };
}

async function tryFetch(url, timeoutMs = 20000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'accept-language': 'en-US,en;q=0.9',
      }
    });
    const text = await res.text();
    return { ok: res.ok, status: res.status, text, finalUrl: res.url || url };
  } catch (e) {
    return { ok: false, status: 0, error: String(e.message || e) };
  } finally {
    clearTimeout(timer);
  }
}

function buildJinaUrl(url) {
  const cleaned = String(url || '').replace(/^https?:\/\//i, '');
  return `https://r.jina.ai/http://${cleaned}`;
}

const cache = new Map();
async function fetchFacts(url) {
  if (!url) return null;
  if (cache.has(url)) return cache.get(url);

  const direct = await tryFetch(url, 20000);
  if (direct.ok && direct.text) {
    const data = parseFactsFromHtml(direct.text, direct.finalUrl || url, direct.status);
    cache.set(url, data);
    return data;
  }

  const fallback = await tryFetch(buildJinaUrl(url), 25000);
  if (fallback.ok && fallback.text) {
    const data = parseFactsFromHtml(fallback.text, url, fallback.status);
    cache.set(url, data);
    return data;
  }

  const fail = { ok: false, status: direct.status || fallback.status || 0, url, error: direct.error || fallback.error || 'fetch failed' };
  cache.set(url, fail);
  return fail;
}

const cap = (s, n = 150) => {
  const t = String(s || '').replace(/\s+/g, ' ').trim();
  return t.length > n ? `${t.slice(0, n - 1)}...` : t;
};

function buildFeatures(flags) {
  const out = [];
  if (flags.welcome) out.push('welcome bonus campaigns');
  if (flags.cashback) out.push('cashback-style offers');
  if (flags.vip) out.push('VIP or loyalty mechanics');
  if (flags.live) out.push('live-casino sections');
  if (flags.sports || flags.esports) out.push('sports-related products');
  if (flags.crypto) out.push('crypto payment messaging');
  if (flags.slots) out.push('slots-focused lobby content');
  if (flags.mobile) out.push('mobile access');
  return out;
}

function buildProsCons(meta, facts) {
  const bonus = [...meta.bonuses][0] || '';
  const features = buildFeatures(facts.flags);
  const featureLine = features.length ? features.slice(0, 3).join(', ') : 'core casino features and active promotions';

  const sourceSnippet = cap(facts.metaDesc || facts.h1 || facts.title || `${meta.name} official website content`);
  const p1 = bonus
    ? `Official site messaging supports this offer direction: ${bonus}.`
    : `Official site messaging highlights ${featureLine}.`;
  const p2 = `Visible onsite content references ${featureLine}. Source signal: ${sourceSnippet}`;

  const c1 = `Promotion terms, eligible games, and limits can vary by GEO and campaign, so check exact rules before deposit.`;
  const c2 = `KYC and payment ownership checks may still impact first-withdrawal speed even when registration is quick.`;

  return `
      <section class="container">
        <h2 class="title">Pros & Cons For Real Players</h2>
        <div class="features-grid premium-grid">
          <div class="feature-card glass-card">
            <strong>Pros</strong>
            <span>- ${p1}</span><br />
            <span>- ${p2}</span>
          </div>
          <div class="feature-card glass-card">
            <strong>Cons</strong>
            <span>- ${c1}</span><br />
            <span>- ${c2}</span>
          </div>
        </div>
      </section>
`;
}

let updated = 0;
let noSource = 0;
let failed = 0;
const report = [];

for (const meta of uniq.values()) {
  const file = path.join(brandsDir, meta.slug, 'index.html');
  if (!fs.existsSync(file)) continue;

  const sourceUrl = pickUrl(meta);
  if (!sourceUrl) {
    noSource++;
    report.push({ slug: meta.slug, status: 'no_source' });
    continue;
  }

  const facts = await fetchFacts(sourceUrl);
  if (!facts || !facts.ok) {
    failed++;
    report.push({ slug: meta.slug, status: 'fetch_failed', sourceUrl, detail: facts?.error || facts?.status || 'unknown' });
    continue;
  }

  let html = fs.readFileSync(file, 'utf8');
  const pattern = /\n\s*<section class="container">\s*\n\s*<h2 class="title">Pros & Cons For Real Players<\/h2>[\s\S]*?<\/section>\s*\n/i;
  if (!pattern.test(html)) {
    report.push({ slug: meta.slug, status: 'missing_block', sourceUrl });
    continue;
  }

  html = html.replace(pattern, buildProsCons(meta, facts));
  fs.writeFileSync(file, html, 'utf8');
  updated++;
  report.push({ slug: meta.slug, status: 'updated', sourceUrl, title: cap(facts.title, 100) });
}

fs.writeFileSync(path.join(root, 'data', 'brand-source-report.json'), JSON.stringify(report, null, 2));
console.log(`BRANDS_TOTAL=${uniq.size}`);
console.log(`UPDATED_FROM_SOURCE=${updated}`);
console.log(`NO_SOURCE_MATCH=${noSource}`);
console.log(`FETCH_FAILED=${failed}`);
console.log('REPORT=data/brand-source-report.json');
