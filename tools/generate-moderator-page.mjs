import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetVersion = '20260827-moderation-2';

const main = `
    <main>
      <section class="hero container moderation-hero">
        <div class="hero-content">
          <span class="home-hero-kicker">SPINCRESTA TEAM</span>
          <h1>Player review moderation</h1>
          <p>Review player submissions, keep public feedback useful and document moderation decisions.</p>
        </div>
        <div class="home-insight-card">
          <div class="home-stats-grid">
            <div class="home-stat-tile">
              <span class="home-stat-number">01</span>
              <strong>Read the full context</strong>
              <span>Check the brand, rating, language and exact player experience.</span>
            </div>
            <div class="home-stat-tile">
              <span class="home-stat-number">02</span>
              <strong>Make a clear decision</strong>
              <span>Approve useful feedback or reject content that does not meet the review rules.</span>
            </div>
          </div>
        </div>
      </section>

      <div class="content-area container">
        <section class="home-showcase-section moderation-workspace" data-moderator-page aria-labelledby="moderation-title">
          <div class="home-showcase-heading">
            <div>
              <span class="home-section-kicker">MODERATION QUEUE</span>
              <h2 id="moderation-title">Player reviews</h2>
            </div>
            <p>Pending reviews are shown oldest first. Approved feedback becomes visible on the relevant brand page.</p>
          </div>

          <div class="moderation-toolbar" role="group" aria-label="Filter reviews by status">
            <button class="is-active" type="button" data-moderator-status="pending" aria-pressed="true">Pending</button>
            <button type="button" data-moderator-status="approved" aria-pressed="false">Approved</button>
            <button type="button" data-moderator-status="rejected" aria-pressed="false">Rejected</button>
          </div>

          <p class="account-auth-status moderation-notice" data-moderator-notice role="status" aria-live="polite" hidden></p>
          <p class="moderation-loading" data-moderator-loading>Loading moderation queue…</p>

          <div class="home-section-cta moderation-access" data-moderator-access hidden>
            <div>
              <strong>Moderator access required</strong>
              <p>Sign in with an approved Armada account to continue.</p>
            </div>
            <button type="button" data-moderator-signin>Sign in with Google</button>
          </div>

          <p class="moderation-empty" data-moderator-empty hidden></p>
          <div class="moderation-review-list" data-moderator-list hidden></div>
        </section>
      </div>
    </main>`;

let html = await readFile(path.join(root, 'about', 'index.html'), 'utf8');
html = html
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Review Moderation | SpinCresta</title>')
  .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, '<meta name="description" content="Private SpinCresta player-review moderation workspace." />')
  .replace(/<meta name="robots" content="[^"]*"\s*\/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/\s*<link rel="canonical"[^>]*\/>/g, '')
  .replace(/\s*<link rel="alternate"[^>]*\/>/g, '')
  .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  .replace(/<meta name="twitter:(?:title|description)"[^>]*\/>/g, '')
  .replace(/<meta property="og:(?:title|description|url)"[^>]*\/>/g, '')
  .replace('data-page="about"', 'data-page="moderator"')
  .replace(/\/styles\.css\?v=[^"']+/g, `/styles.css?v=${assetVersion}`)
  .replace(/\/scripts\/main\.js\?v=[^"']+/g, `/scripts/main.js?v=${assetVersion}`)
  .replace(/\s*<main>[\s\S]*?<\/main>/, `\n${main}`);

const target = path.join(root, 'moderator');
await mkdir(target, { recursive: true });
await writeFile(path.join(target, 'index.html'), `${html.trimEnd()}\n`);
console.log('Generated moderator/index.html');
