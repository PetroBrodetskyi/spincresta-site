// Keep the existing public feedback catalogue in step with published reviews.
// Dry run by default; add --apply to INSERT ONLY missing brand records.
// Never changes existing brands, users, reviews, ratings or access policies.
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { BRANDS } from '../scripts/brands.js';

const envIndex = process.argv.indexOf('--env-file');
const envFile = process.argv[envIndex + 1];
if (envIndex < 0 || !envFile) throw new Error('Supply --env-file <private backend environment file>');
process.loadEnvFile(envFile);
const endpoint = process.env.SUPABASE_URL?.replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
if (!endpoint || !key || new URL(endpoint).protocol !== 'https:') throw new Error('Missing backend configuration');

// Verify these credentials belong to the same project as the live site.
const liveConfig = await fetch('https://api.spincresta.com/api/auth-config', {
  headers: { Origin: 'https://spincresta.com' },
});
if (!liveConfig.ok) throw new Error(`Could not verify the production project (${liveConfig.status})`);
const publicConfig = await liveConfig.json();
if (publicConfig.supabaseUrl?.replace(/\/$/, '') !== endpoint) throw new Error('Production Supabase project mismatch');

const headers = { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' };
const catalogueUrl = `${endpoint}/rest/v1/brands?select=slug,name,is_active&limit=1000`;
const response = await fetch(catalogueUrl, { headers });
if (!response.ok) throw new Error(`Could not read the feedback catalogue (${response.status})`);
const existing = new Set((await response.json()).map(brand => brand.slug));
const published = new Map();
for (const brand of BRANDS) {
  const slug = brand.urlDetail?.match(/^brands\/([a-z0-9]+(?:-[a-z0-9]+)*)\.html$/)?.[1];
  if (!brand.hasDetailPage || !slug || published.has(slug)) continue;
  if (!existsSync(fileURLToPath(new URL(`../brands/${slug}/index.html`, import.meta.url)))) continue;
  published.set(slug, { slug, name: brand.name, is_active: !brand.temporarilyUnavailable });
}
const missing = [...published.values()].filter(brand => !existing.has(brand.slug));
console.log(JSON.stringify({ publishedBrands: published.size, missingBrands: missing.map(brand => brand.slug) }));

if (process.argv.includes('--apply') && missing.length) {
  const insert = await fetch(`${endpoint}/rest/v1/brands?on_conflict=slug`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=ignore-duplicates,return=minimal' },
    body: JSON.stringify(missing),
  });
  if (!insert.ok) throw new Error(`Could not insert missing brands (${insert.status})`);
  console.log(`Inserted ${missing.length} missing feedback brands; existing records were preserved.`);
}
