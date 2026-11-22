import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { syncDefaultTheme } from './sync-default-theme.mjs';
import { dashboardLoading } from './dashboard-loading-markup.mjs';
import { siteIconMarkup } from '../scripts/site-icons.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const assetVersion = '20261122-select-controls';
const icon = name => siteIconMarkup(name, 'site-icon', 18);

const main = `
    <main class="account-dashboard moderation-dashboard container" data-moderator-page>
      <header class="account-dashboard-heading moderation-dashboard-heading">
        <h1 id="moderation-title">Moderator dashboard</h1>
        <a class="cta-secondary moderation-button" href="/account/">${icon('arrow-left')}<span>Back to my account</span></a>
      </header>
      <div class="account-layout">
        <aside class="account-sidebar">
          <nav class="account-menu" role="tablist" aria-labelledby="moderation-title" aria-orientation="vertical">
            <button id="moderator-reviews-tab" type="button" role="tab" data-moderator-view="reviews" aria-selected="true" aria-controls="moderator-reviews-panel">${siteIconMarkup('chat', 'site-icon', 20)}<span>Review queue</span></button>
            <button id="moderator-users-tab" type="button" role="tab" data-moderator-view="users" aria-selected="false" aria-controls="moderator-users-panel" tabindex="-1">${siteIconMarkup('user', 'site-icon', 20)}<span>Registered users</span></button>
          </nav>
        </aside>
        <div class="account-workspace">

          <p class="account-auth-status moderation-notice" data-moderator-notice role="status" aria-live="polite" hidden></p>
          <div class="account-panel moderation-access" data-moderator-access hidden>
            <div>
              <strong>Moderator access required</strong>
              <p>Sign in with an approved moderator account to continue.</p>
            </div>
            <button type="button" data-moderator-signin>Sign in with Google</button>
          </div>

          <section id="moderator-reviews-panel" class="account-panel moderation-panel" data-moderator-panel="reviews" role="tabpanel" aria-labelledby="moderator-reviews-tab">
            <header class="moderation-panel-heading">
              <h2>${icon('chat')} Player reviews</h2>
              <p>Pending reviews are listed oldest first. Approved reviews appear on the brand page.</p>
            </header>
            <div class="moderation-toolbar" role="group" aria-label="Filter reviews by status">
              <button class="is-active" type="button" data-moderator-status="pending" aria-pressed="true">Pending</button>
              <button type="button" data-moderator-status="approved" aria-pressed="false">Approved</button>
              <button type="button" data-moderator-status="rejected" aria-pressed="false">Rejected</button>
            </div>
            ${dashboardLoading('data-moderator-loading', 'Loading moderation queue…')}
            <p class="moderation-empty" data-moderator-empty hidden></p>
            <div class="moderation-review-list" data-moderator-list hidden></div>
          </section>

          <section id="moderator-users-panel" class="account-panel moderation-panel" data-moderator-panel="users" role="tabpanel" aria-labelledby="moderator-users-tab" hidden>
            <header class="moderation-panel-heading">
              <h2>${icon('user')} Registered users</h2>
              <p>Contact details are visible only to approved moderators.</p>
            </header>
            <div class="moderation-user-toolbar">
              <label><span>Search users</span><input type="search" data-moderator-user-search placeholder="Name, email, phone or Telegram" /></label>
              <strong data-moderator-user-total aria-live="polite"></strong>
              <div class="moderation-user-tools">
                <button class="moderation-button" type="button" data-moderator-user-refresh>${icon('refresh')}<span>Refresh</span></button>
                <button class="moderation-button" type="button" data-moderator-user-export disabled hidden>${icon('download')}<span>Export contacts (CSV)</span></button>
              </div>
            </div>
            <p class="moderation-export-status" data-moderator-export-status role="status" hidden></p>
            ${dashboardLoading('data-moderator-users-loading', 'Loading registered users…')}
            <p class="moderation-empty" data-moderator-users-empty hidden>No registered users found.</p>
            <div class="moderation-user-list" data-moderator-users-list hidden></div>
          </section>
        </div>
      </div>
    </main>`;

let html = await readFile(path.join(root, 'about', 'index.html'), 'utf8');
html = html
  .replace(/<title>[\s\S]*?<\/title>/, '<title>Review Moderation | SpinCresta</title>')
  .replace(/<meta\s+name="description"\s+content="[^"]*"\s*\/>/, '<meta name="description" content="Private SpinCresta player-review moderation workspace." />')
  .replace(/<meta name="robots" content="[^"]*"\s*\/>/, '<meta name="robots" content="noindex, nofollow" />')
  .replace(/\s*<link rel="canonical"[^>]*\/>/g, '')
  .replace(/\s*<link rel="alternate"[^>]*\/>/g, '')
  .replace('<meta name="robots" content="noindex, nofollow" />', [
    '<meta name="robots" content="noindex, nofollow" />',
    '<link rel="canonical" href="https://spincresta.com/moderator/" />',
    '<link rel="alternate" hreflang="en" href="https://spincresta.com/moderator/" />',
    '<link rel="alternate" hreflang="x-default" href="https://spincresta.com/moderator/" />',
  ].join('\n    '))
  .replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '')
  .replace(/<meta name="twitter:(?:title|description)"[^>]*\/>/g, '')
  .replace(/<meta property="og:(?:title|description|url)"[^>]*\/>/g, '')
  .replace('data-page="about"', 'data-page="moderator"')
  .replace(/\/styles\.css\?v=[^"']+/g, `/styles.css?v=${assetVersion}`)
  .replace(/\/scripts\/main\.js\?v=[^"']+/g, `/scripts/main.js?v=${assetVersion}`)
  .replace(/\s*<main\b[^>]*>[\s\S]*?<\/main>/, `\n${main}`);

html = html.replace(
  '</body>',
  `    <script type="module" src="/scripts/moderator-bootstrap.js?v=${assetVersion}"></script>\n  </body>`
);

const target = path.join(root, 'moderator');
await mkdir(target, { recursive: true });
await writeFile(path.join(target, 'index.html'), `${syncDefaultTheme(html).split('\n').map(line => line.trimEnd()).join('\n').trimEnd()}\n`);
console.log('Generated moderator/index.html');
