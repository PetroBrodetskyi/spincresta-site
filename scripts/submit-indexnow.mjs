import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_KEY = '4f6c73cc63b84633ad627127be893da7';
const DEFAULT_HOST = 'spincresta.com';
const DEFAULT_ENDPOINT = 'https://api.indexnow.org/IndexNow';
const MAX_URLS_PER_REQUEST = 10000;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');

const host = process.env.INDEXNOW_HOST || DEFAULT_HOST;
const key = process.env.INDEXNOW_KEY || DEFAULT_KEY;
const keyLocation =
  process.env.INDEXNOW_KEY_LOCATION || `https://${host}/${key}.txt`;
const endpoint = process.env.INDEXNOW_ENDPOINT || DEFAULT_ENDPOINT;
const sitemapPath = path.resolve(process.env.INDEXNOW_SITEMAP || 'sitemap.xml');
const keyFilePath = path.resolve(`${key}.txt`);

const decodeXmlEntities = value =>
  value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const readSitemapUrls = filePath => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Sitemap not found: ${filePath}`);
  }

  const sitemap = fs.readFileSync(filePath, 'utf8');
  const urls = [...sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g)]
    .map(match => decodeXmlEntities(match[1].trim()))
    .filter(Boolean);

  const uniqueUrls = [...new Set(urls)];
  const externalUrls = uniqueUrls.filter(url => {
    try {
      return new URL(url).host === host;
    } catch {
      return false;
    }
  });

  if (!externalUrls.length) {
    throw new Error(`No URLs for ${host} found in ${filePath}`);
  }

  return externalUrls;
};

const validateKeyFile = () => {
  if (!fs.existsSync(keyFilePath)) {
    throw new Error(`IndexNow key file is missing: ${keyFilePath}`);
  }

  const keyFileContent = fs.readFileSync(keyFilePath, 'utf8').trim();
  if (keyFileContent !== key) {
    throw new Error(`IndexNow key file content does not match ${key}`);
  }
};

const chunk = (items, size) => {
  const chunks = [];
  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }
  return chunks;
};

const submitUrls = async urls => {
  const batches = chunk(urls, MAX_URLS_PER_REQUEST);

  for (const [index, urlList] of batches.entries()) {
    const payload = {
      host,
      key,
      keyLocation,
      urlList,
    };

    if (dryRun) {
      console.log(
        `[dry-run] Batch ${index + 1}/${batches.length}: ${urlList.length} URLs would be submitted to ${endpoint}`
      );
      continue;
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    if (!response.ok) {
      throw new Error(
        `IndexNow batch ${index + 1}/${batches.length} failed with ${response.status}: ${responseText}`
      );
    }

    console.log(
      `IndexNow accepted batch ${index + 1}/${batches.length}: ${urlList.length} URLs`
    );
  }
};

try {
  validateKeyFile();
  const urls = readSitemapUrls(sitemapPath);

  console.log(`IndexNow host: ${host}`);
  console.log(`IndexNow key location: ${keyLocation}`);
  console.log(`IndexNow URLs from sitemap: ${urls.length}`);

  await submitUrls(urls);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
