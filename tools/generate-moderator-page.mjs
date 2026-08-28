import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetVersion = '20260827-private-contacts-1';

const main = `
    <main>
      <section class="hero container moderation-hero">
        <div class="hero-content">
          <span class="home-hero-kicker">SPINCRESTA TEAM</span>
          <h1>Player review moderation</h1>
          <p>Review player submissions, keep public feedback useful and document moderation decisions.</p>
        </div>
      </section>

      <div class="content-area container">
        <section class="home-showcase-section moderation-workspace" data-moderator-page aria-labelledby="moderation-title">
          <div class="moderation-view-tabs" role="tablist" aria-label="Moderator workspace">
            <button class="is-active" type="button" role="tab" data-moderator-view="reviews" aria-selected="true">Review queue</button>
            <button type="button" role="tab" data-moderator-view="users" aria-selected="false">Registered users</button>
          </div>

          <p class="account-auth-status moderation-notice" data-moderator-notice role="status" aria-live="polite" hidden></p>
          <div class="home-section-cta moderation-access" data-moderator-access hidden>
            <div>
              <strong>Moderator access required</strong>
              <p>Sign in with an approved Armada account to continue.</p>
            </div>
            <button type="button" data-moderator-signin>Sign in with Google</button>
          </div>

          <div data-moderator-panel="reviews" role="tabpanel">
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
            <p class="moderation-loading" data-moderator-loading>Loading moderation queue…</p>
            <p class="moderation-empty" data-moderator-empty hidden></p>
            <div class="moderation-review-list" data-moderator-list hidden></div>
          </div>

          <div data-moderator-panel="users" role="tabpanel" hidden>
            <div class="home-showcase-heading">
              <div>
                <span class="home-section-kicker">ACCOUNT DIRECTORY</span>
                <h2>Registered users</h2>
              </div>
              <p>Private account and contact details are available only to approved SpinCresta moderators.</p>
            </div>
            <div class="moderation-user-toolbar">
              <label><span>Search users</span><input type="search" data-moderator-user-search placeholder="Name, email, phone or Telegram" /></label>
              <strong data-moderator-user-total>0 users</strong>
              <button type="button" data-moderator-user-refresh>Refresh</button>
            </div>
            <p class="moderation-loading" data-moderator-users-loading hidden>Loading registered users…</p>
            <p class="moderation-empty" data-moderator-users-empty hidden>No registered users found.</p>
            <div class="moderation-user-table-wrap" data-moderator-users-table hidden>
              <table class="moderation-user-table">
                <thead><tr><th>User</th><th>Country</th><th>Phone</th><th>Telegram</th><th>Newsletter</th><th>Registered</th><th>Last sign-in</th></tr></thead>
                <tbody data-moderator-users-list></tbody>
              </table>
            </div>
          </div>
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
