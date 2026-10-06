import assert from 'node:assert/strict';
import test from 'node:test';
import { CLEAR_COPY, classifyFiller, polishInlineText, trimIntent, productIntro, removeComparisonTail, countryHeader } from './clear-copy-rules.mjs';
import { DIRECTORY_COPY, DIRECTORY_META } from './clear-directory-copy.mjs';
import { buildPlan, editPage } from './polish-clear-copy.mjs';

test('Financial, legal and unverified statements are not generic filler', () => {
  for (const text of [
    'This matters because the maximum bet is €5 and wagering is 40x.',
    'That gives players 200 free spins.',
    'This is useful, but a current license was not verified.',
    'Withdrawals may be delayed by KYC.',
    'The promotion excludes some games and has an expiry date.',
  ]) assert.equal(classifyFiller(text, 'Casino games'), null, text);
});

test('Clear copy preserves factual names instead of guessing an operator’s intentions', () => {
  assert.equal(trimIntent('Bonuses, tournaments, Wheel of Fortune, and Hall of Fame suggest more ongoing engagement than a single signup headline.', 'en'), 'Features: Bonuses, tournaments, Wheel of Fortune, and Hall of Fame.');
  assert.equal(trimIntent('A license suggests legitimacy.', 'en'), 'A license suggests legitimacy.');
});

test('All ten locales have reviewed native copy and stable spelling', () => {
  assert.equal(Object.keys(CLEAR_COPY).length, 10);
  for (const locale of Object.keys(CLEAR_COPY)) {
    for (const key of ['navigation','loyalty','sports','casino','payments','mobile','hero','about']) assert.ok(CLEAR_COPY[locale][key]);
  }
  assert.doesNotMatch(JSON.stringify(CLEAR_COPY.en), /programme|licence|colour|centre/);
});

test('Shortening lead-ins preserves spelling, brand names and numeric entities', () => {
  assert.equal(polishInlineText('This matters because the bonus expires in seven days.', 'en'), 'The bonus expires in seven days.');
  assert.equal(polishInlineText('iGaming Expert', 'en'), 'iGaming Expert');
  const old='<p>Our current review lists a welcome bonus up to &#8372;350,000 plus 1450 free spins.</p>';
  const edited=editPage(old,'en').html;
  assert.match(edited,/₴350,000 plus 1450 free spins/);
  assert.doesNotMatch(edited,/&amp;#/);
});

test('Page edits preserve link markup, attributes, SEO IDs and FAQ text parity', () => {
  const old='<meta name="description" content="This matters because bonus rules apply." /><section id="faq" class="container"><h3>What makes Baloo more than a simple welcome-bonus brand?</h3><p>This matters because bonus rules apply.</p><p><a href="https://example.test/">This matters because a linked title must remain intact.</a></p></section><script type="application/ld+json">{"@type":"FAQPage","mainEntity":[{"name":"What makes Baloo more than a simple welcome-bonus brand?","acceptedAnswer":{"text":"This matters because bonus rules apply."}}]}</script>';
  const edited=editPage(old,'en').html;
  assert.match(edited,/id="faq" class="container"/);
  assert.match(edited,/<a href="https:\/\/example.test\/">This matters because a linked title must remain intact/);
  assert.match(edited,/<h3>What does Baloo offer\?<\/h3>/);
  const schema=JSON.parse(edited.match(/<script[^>]*>([^]*?)<\/script>/)[1]);
  assert.equal(schema.mainEntity[0].name,'What does Baloo offer?');
  assert.equal(schema.mainEntity[0].acceptedAnswer.text,'Bonus rules apply.');
  assert.equal(editPage(edited,'en').html,edited);
});

test('Localized replacements cannot erase a numeric detail missing from English', () => {
  const source='<td>Mobile</td><td>That gives players a smoother mobile session.</td>';
  const plan=buildPlan(source,'brands/example/index.html');
  const target='<td>Мобільна гра</td><td>Потрібен Android 10.</td>';
  assert.equal(editPage(target,'uk',plan).html,target);
});

test('A product summary must not overwrite an amount or a license qualification', () => {
  assert.equal(productIntro('Test is more than a casino with 100 games.','Test'),null);
  assert.equal(productIntro('Test is more than a casino; its license is not confirmed.','Test'),null);
  const summary=productIntro('Test is more than a sportsbook with slots and live betting.','Test');
  assert.equal(summary.text,'Test: slots, sports betting, live betting.');
});

test('Table context is the row label, not a brand name or a neighboring topic', () => {
  assert.equal(classifyFiller(CLEAR_COPY.en.loyalty,'Live Betting by Sport'),'sports');
  assert.equal(classifyFiller(CLEAR_COPY.en.support,'Crypto coverage'),'payments');
  assert.equal(classifyFiller(CLEAR_COPY.en.payments,'Rewards Program'),'loyalty');
  assert.equal(classifyFiller(CLEAR_COPY.en.payments,'Visible Top & New Games'),'navigation');
  assert.equal(classifyFiller(CLEAR_COPY.en.casino,'Bonus Rules'),'bonusCheck');
  assert.equal(classifyFiller(CLEAR_COPY.en.casino,'Buy Bonus, High RTP & Jackpot Games'),'navigation');
});

test('Only final decorative comparisons are cut, without losing feature names', () => {
  const old='Betory separates slots, live casino and sportsbook sections instead of hiding everything in one generic lobby.';
  assert.equal(classifyFiller(old),'comparisonTail');
  assert.equal(removeComparisonTail(old,'en'),'Betory separates slots, live casino and sportsbook sections.');
  assert.equal(classifyFiller('If you like finding games by type instead of one generic lobby, Betory offers original games.'),null);
  assert.equal(classifyFiller('Esports coverage looks meaningful rather than token, with League of Legends and Volta.'),null);
  assert.equal(classifyFiller('Players must complete KYC rather than depositing with a false name.'),null);
  assert.equal(removeComparisonTail('Die Lobby bietet Slots und Blackjack, statt einer endlosen Liste.','de'),'Die Lobby bietet Slots und Blackjack.');
});

test('Directory pages cannot assert tested payouts or universally better offers', () => {
  const old='<title>Exclusive Casino Offers 2026 | Private Bonuses | SpinCresta</title><meta name="description" content="Claim exclusive casino bonuses and private betting promotions. Higher value, better terms, limited availability. Not available on public sites." /><p>These exclusive offers are negotiated directly with operators and not shown publicly. They often include bigger bonuses, extra free spins, lower wagering or special cashback - but they disappear fast.</p><script type="application/ld+json">{"name":"Exclusive Casino Offers 2026 | Private Bonuses | SpinCresta","description":"Claim exclusive casino bonuses and private betting promotions. Higher value, better terms, limited availability. Not available on public sites.","url":"https://example.test/This matters because /license"}</script>';
  const page='exclusive-offers/index.html';
  const plan=buildPlan(old,page);
  const edited=editPage(old,'en',plan,page).html;
  assert.match(edited,/An offer is exclusive only/);
  assert.doesNotMatch(edited,/negotiated directly|Higher value, better terms|Private Bonuses/);
  const schema=JSON.parse(edited.match(/<script[^>]*>([^]*?)<\/script>/)[1]);
  assert.equal(schema.url,'https://example.test/This matters because /license');
  assert.equal(schema.description,DIRECTORY_META[page].en.description);
  assert.equal(editPage(edited,'en',buildPlan(edited,page),page).html,edited);
  for(const locale of Object.keys(CLEAR_COPY)) {
    assert.equal(Object.keys(DIRECTORY_COPY[locale]).length,Object.keys(DIRECTORY_COPY.en).length);
    for(const metadata of Object.values(DIRECTORY_META)) {
      assert.ok(metadata[locale].description.length>=105);
      assert.ok(metadata[locale].description.length<=170);
    }
  }
});

test('Country headlines retain the market without claiming every listing is licensed', () => {
  assert.equal(countryHeader('Trusted reviews, licensed platforms, and exclusive offers for Latvian players.','en'),'Casino reviews, games and bonus terms for Latvian players.');
  assert.equal(countryHeader('Надійні огляди, ліцензовані платформи та ексклюзивні пропозиції для латвійських гравців.','uk'),'Огляди казино, ігри та умови бонусів для латвійських гравців.');
  assert.equal(polishInlineText('каталог казино та ставок','uk'),'каталог казино та ставок');
});
