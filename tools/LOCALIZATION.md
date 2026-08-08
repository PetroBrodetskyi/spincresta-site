# Static-site localization

Use `localize-static-site.mjs` as the starting point for the future Spanish version.

```bash
node tools/localize-static-site.mjs --locale es --language Spanish
node tools/localize-static-site.mjs --locale es --language Spanish --translate
node tools/localize-static-site.mjs --locale es --language Spanish --apply
```

The first command is a read-only plan. `--translate` creates a temporary Google Translate cache under `/private/tmp`; `--apply` creates only missing locale pages. Use `--force` only when existing localized pages should be overwritten.

After generation, add Spanish strings and locale detection to `scripts/main.js`, add `es` hreflang and sitemap entries, review legal/editorial translations, and run the same desktop/mobile navigation audit used for German.
