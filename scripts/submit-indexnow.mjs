import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const DEFAULT_KEY = '4f6c73cc63b84633ad627127be893da7';
const DEFAULT_HOST = 'spincresta.com';
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/indexnow';
const DEFAULT_DELAY_MS = 100;
const MAX_RETRIES = 3;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const submitAll = args.has('--all');
const host = process.env.INDEXNOW_HOST || DEFAULT_HOST;
const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const keyLocation = process.env.INDEXNOW_KEY_LOCATION || `https://${host}/${key}.txt`;
const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_ENDPOINT;
const sitemapPath = path.resolve(process.env.INDEXNOW_SITEMAP || 'sitemap.xml');
const keyFilePath = path.resolve(`${key}.txt`);
const configuredDelayMs = Number(process.env.INDEXNOW_DELAY_MS);
const delayMs = Number.isFinite(configuredDelayMs) && process.env.INDEXNOW_DELAY_MS !== undefined
  ? Math.max(0, configuredDelayMs)
  : DEFAULT_DELAY_MS;

const sleep = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

const decodeXmlEntities = value => value
  .replace(/&amp;/g, '&')
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'");

const readSitemapUrls = filePath => {
  if (!fs.existsSync(filePath)) throw new Error(`Sitemap not found: ${filePath}`);

  const sitemap = fs.readFileSync(filePath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)]
    .map(match => decodeXmlEntities(match[1].trim()))
    .filter(url => {
      try {
        return new URL(url).host === host;
      } catch {
        return false;
      }
    });

  if (!urls.length) throw new Error(`No URLs for ${host} found in ${filePath}`);
  return [...new Set(urls)];
};

const validateKeyFile = () => {
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`IndexNow key file is missing: ${keyFilePath}`);
  }
  if (fs.readFileSync(keyFilePath, 'utf8').trim() !== key) {
    throw new Error(`IndexNow key file content does not match ${key}`);
  }
};

const git = (...gitArgs) => execFileSync('git', gitArgs, { encoding: 'utf8' }).trim();

const resolveDiffRange = () => {
  const before = process.env.INDEXNOW_BEFORE_SHA?.trim();
  const after = process.env.INDEXNOW_AFTER_SHA?.trim() || 'HEAD';
  if (before && !/^0+$/.test(before)) return { before, after };

  try {
    return { before: git('rev-parse', `${after}^`), after };
  } catch {
    return null;
  }
};

const filePathToUrl = filePath => {
  const normalizedPath = filePath.replaceAll('\\', '/').replace(/^\.\//, '');
  if (!normalizedPath.endsWith('.html') || normalizedPath.startsWith('.')) return null;

  if (normalizedPath === 'index.html') return `https://${host}/`;
  if (normalizedPath.endsWith('/index.html')) {
    return `https://${host}/${normalizedPath.slice(0, -'index.html'.length)}`;
  }
  return `https://${host}/${normalizedPath}`;
};

const readChangedUrls = (range, sitemapUrls) => {
  if (!range) return sitemapUrls;

  const output = execFileSync(
    'git',
    ['diff', '--name-status', '-z', '--find-renames', range.before, range.after],
    { encoding: 'utf8' }
  );
  const fields = output.split('\0');
  const sitemapSet = new Set(sitemapUrls);
  const changedUrls = new Set();

  for (let index = 0; index < fields.length;) {
    const status = fields[index++];
    if (!status) break;

    if (status.startsWith('R') || status.startsWith('C')) {
      const oldUrl = filePathToUrl(fields[index++]);
      const newUrl = filePathToUrl(fields[index++]);
      if (status.startsWith('R') && oldUrl) changedUrls.add(oldUrl);
      if (newUrl && sitemapSet.has(newUrl)) changedUrls.add(newUrl);
      continue;
    }

    const url = filePathToUrl(fields[index++]);
    if (url && (status.startsWith('D') || sitemapSet.has(url))) changedUrls.add(url);
  }

  return [...changedUrls];
};

const createSubmissionUrl = url => {
  const submissionUrl = new URL(endpoint);
  submissionUrl.searchParams.set('url', url);
  submissionUrl.searchParams.set('key', key);
  submissionUrl.searchParams.set('keyLocation', keyLocation);
  return submissionUrl;
};

const retryDelay = response => {
  const retryAfter = Number(response.headers.get('retry-after'));
  return Number.isFinite(retryAfter) && retryAfter > 0
    ? Math.min(retryAfter * 1000, 60_000)
    : 1000;
};

const submitUrl = async url => {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
    const response = await fetch(createSubmissionUrl(url), {
      headers: { Accept: 'application/json' },
    });
    const responseText = await response.text();
    if (response.ok) return;

    const canRetry = response.status === 429 || response.status >= 500;
    if (!canRetry || attempt === MAX_RETRIES) {
      throw new Error(`IndexNow submission failed for ${url} (${response.status}): ${responseText}`);
    }
    await sleep(retryDelay(response) * attempt);
  }
};

const submitUrls = async urls => {
  for (const [index, url] of urls.entries()) {
    if (dryRun) {
      console.log(`[dry-run] URL ${index + 1}/${urls.length}: ${url}`);
    } else {
      await submitUrl(url);
      console.log(`IndexNow accepted URL ${index + 1}/${urls.length}: ${url}`);
    }
    if (!dryRun && index < urls.length - 1 && delayMs > 0) await sleep(delayMs);
  }
};

try {
  validateKeyFile();
  const sitemapUrls = readSitemapUrls(sitemapPath);
  const range = submitAll ? null : resolveDiffRange();
  const urls = submitAll ? sitemapUrls : readChangedUrls(range, sitemapUrls);

  console.log(`IndexNow host: ${host}`);
  console.log(`IndexNow key location: ${keyLocation}`);
  if (submitAll) {
    console.log(`IndexNow explicit full submission: ${urls.length} URLs`);
  } else if (range) {
    console.log(`IndexNow changed URLs: ${urls.length} (${range.before}..${range.after})`);
  } else {
    console.log(`IndexNow initial repository submission: ${urls.length} URLs`);
  }

  if (!urls.length) console.log('No changed public URLs to submit.');
  else await submitUrls(urls);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
