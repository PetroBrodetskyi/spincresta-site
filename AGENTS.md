# SpinCresta development instructions

Apply the clear-copy rules to every SpinCresta page and language, including shared components, generators, metadata and published HTML. The casino-link and review-column rules below apply to brand reviews.

## Casino links

- Do not publish direct links to operator homepages or operator pages for promotions, bonus terms, payments, licensing, or other casino information. This includes review copy, source lists, buttons, and game cards.
- Casino calls to action must use the approved affiliate destination from the corresponding brand object in `scripts/brands.js`. Keep that file as the single source of truth; do not substitute a direct operator URL.
- Research official operator pages, but keep their source URLs and evidence in ignored, non-published research notes such as `tools/research/`. Do not turn private research into public source-link blocks.
- This rule does not prohibit internal SpinCresta links or require changes to canonical URLs, hreflang, or other SEO metadata.

## Brand review columns

- On desktop, casino and live-game information belongs in the left editorial column. Sportsbook/betting coverage and any separate sports offer must occupy their own section in the right column, not a card mixed into the left casino section.
- Reuse the existing responsive rail behavior in `scripts/pages/brand-layout.js` and shared site styles. At the right-rail breakpoint (currently 1200px), verify that the betting section is inside `.brand-right-rail`.
- On smaller screens, restore the sections to the normal content flow. Do not force desktop columns onto mobile or add per-brand layout styles.

## Clear factual copy

- Describe verified current features directly, in the present tense. Write “Vegas Now offers bets on soccer, American football, and MMA,” not “events were visible” or “there were events in the catalog.” Use past tense only for genuine historical information or a dated test result.
- Remove filler, vague observation narratives, repetitive introductions, and redundant reminders. State the feature, amount, condition, or limitation clearly.
- Concise copy must remain accurate: preserve material bonus, payment, eligibility, and safer-play conditions. Do not turn an unverified claim into a confirmed fact or invent testing results.
- Use American English for English copy and natural editorial wording in other languages; follow `tools/LOCALIZATION.md`.
- Do not speculate about why a casino wants to retain players or why a feature makes it better than competitors. Describe the feature and its conditions instead. Do not promise safe play, fast loading, effortless winnings or seamless payments without evidence.
- After creating or regenerating pages, run `node tools/polish-clear-copy.mjs --apply`, then `node tools/polish-clear-copy.mjs --check`. This reviewed multilingual pass removes known filler while preserving links, markup and numeric conditions. It is not a replacement for reading new copy.
- Do not add generic paragraphs just to meet a word-count threshold. Comparison pages must explain actual selection criteria and link to detailed reviews; shorter factual copy is preferable to unsupported claims or padding.

## Verification

- Update both the source/generator and affected language pages so regeneration cannot restore rejected links, layouts, or wording.
- Check public operator links against the approved brand registry and verify desktop/right-column and mobile/inline placement when changing layout.
- Run the relevant review tests and copy checks before handing off changes. Do not deploy unless the user requests it.
