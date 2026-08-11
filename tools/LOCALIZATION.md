# Static-site localization

The production site currently has matching English, German, and Spanish page trees. Use `localize-static-site.mjs` when a new English page needs a localized counterpart or when a locale must be regenerated.

```bash
node tools/localize-static-site.mjs --locale es --language Spanish
node tools/localize-static-site.mjs --locale es --language Spanish --translate
node tools/localize-static-site.mjs --locale es --language Spanish --apply
```

The first command is a read-only plan. `--translate` creates a temporary Google Translate cache under `/private/tmp`; `--apply` creates only missing locale pages. Use `--force` only when existing localized pages should be overwritten, because it also replaces manual editorial improvements.

After generating or replacing Spanish pages, run the repeatable SEO and language-linking steps:

```bash
node tools/polish-spanish-content.mjs
node tools/optimize-spanish-seo.mjs
node tools/sync-hreflang.mjs
node tools/generate-sitemap.mjs
node tools/audit-spanish-copy.mjs
node tools/audit-localization-parity.mjs es
node tools/audit-content-seo.mjs
node tools/verify-site-seo.mjs
```

`polish-spanish-content.mjs` applies the reviewed casino terminology, keeps product and promo-code names intact, and removes known literal translation artifacts. The two localization audits verify copy quality, page structure, FAQ/question parity, assets, IDs, classes, and inline-script syntax across every EN/ES pair.

Then review new legal, affiliate, bonus, payment, and responsible-gambling copy editorially. Confirm desktop and mobile layouts, internal links, language persistence, and page-specific dynamic sections before deployment.
