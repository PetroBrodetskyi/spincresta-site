# spincresta-site

## Brand reviews

- `scripts/brands.js` is the brand registry and the source of approved affiliate URLs.
- `scripts/brand-snapshot-configs.js` holds Snapshot categories and brand-specific labels. Game cards and review screenshots are registered separately in `scripts/brand-new-games.js` and `scripts/brand-homepage-screenshots.js`.
- `scripts/pages/brand.js` renders the shared review layout. Generated reviews live in `brands/<brand>/index.html` and `<locale>/brands/<brand>/index.html`.
- For reviews with a generator, edit the editorial source under `tools/` and regenerate all affected languages. For BetonWin, run `node tools/build-betonwin-reviews.mjs` after editing `tools/betonwin-review-copy.mjs`. If the offer headline changed, also update the brand registry and run `node tools/sync-brand-bonus-translations.mjs`.

After regeneration, run `node tools/polish-clear-copy.mjs --apply` and `node tools/polish-clear-copy.mjs --check`. Run the relevant tests under `tools/` and check affiliate links and localized routes before publishing. See `AGENTS.md` and `tools/LOCALIZATION.md` for editorial and localization rules.
