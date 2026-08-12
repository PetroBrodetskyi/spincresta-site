# Static-site localization

The production site currently has matching English, German, Spanish, Italian, Polish, Ukrainian, and Portuguese page trees. Use `localize-static-site.mjs` when a new English page needs a localized counterpart or when a locale must be regenerated.

```bash
node tools/localize-static-site.mjs --locale es --language Spanish
node tools/localize-static-site.mjs --locale es --language Spanish --translate
node tools/localize-static-site.mjs --locale es --language Spanish --apply
```

The first command is a read-only plan. `--translate` creates a temporary Google Translate cache under `/private/tmp`; `--apply` creates only missing locale pages. Use `--force` only when existing localized pages should be overwritten, because it also replaces manual editorial improvements.

After generating or replacing localized pages, run the repeatable copy, SEO, and language-linking steps. Use the locale-specific polisher for every locale that changed:

```bash
node tools/polish-english-content.mjs
node tools/polish-german-content.mjs
node tools/polish-spanish-content.mjs
node tools/polish-italian-content.mjs
node tools/polish-polish-content.mjs
node tools/polish-ukrainian-content.mjs
node tools/polish-ukrainian-headings.mjs
node tools/polish-portuguese-content.mjs
node tools/polish-multilingual-content.mjs
node tools/optimize-geo-variant-seo.mjs
node tools/optimize-spanish-seo.mjs
node tools/optimize-portuguese-seo.mjs
node tools/sync-hreflang.mjs
node tools/generate-sitemap.mjs
for audit in tools/audit-*-copy.mjs; do node "$audit"; done
for locale in de es it pl uk pt; do node tools/audit-localization-parity.mjs "$locale"; done
node tools/audit-content-seo.mjs
node tools/verify-site-seo.mjs
```

The locale-specific polishers apply reviewed casino terminology, keep product and promo-code names intact, and remove known literal translation artifacts. The localization audits verify copy quality, page structure, FAQ/question parity, assets, IDs, classes, and inline-script syntax across every English/localized pair.

`polish-multilingual-content.mjs` must run after a locale-specific polisher. It restores protected contact addresses from English, preserves official product labels such as SpinBoss VIP tiers, and removes recurring literal wording shared across localized page trees. Validate it with `audit-multilingual-copy.mjs`.

Then review new legal, affiliate, bonus, payment, and responsible-gambling copy editorially. Confirm desktop and mobile layouts, internal links, language persistence, and page-specific dynamic sections before deployment.
