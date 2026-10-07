import fs from 'node:fs';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

// Reviewed native copy. The advertiser's October 7 update concerns document
// verification, not the existing casino or sports deposit welcome packages.
// Do not invent wagering, cash-out, deposit or timer-start conditions.
export const BETON_VERIFICATION_COPY = {
  en: {
    title: '500 UAH Verification Bonus',
    text: 'BetOn offers a 500 UAH bonus for completing document verification within the first hour.',
    question: 'What is the BetOn document verification bonus?',
  },
  de: {
    title: '500 UAH für die Dokumentenprüfung',
    text: 'BetOn bietet einen Bonus von 500 UAH für die Verifizierung der Dokumente innerhalb der ersten Stunde.',
    question: 'Welchen Bonus gibt es bei BetOn für die Dokumentenprüfung?',
  },
  es: {
    title: 'Bono de 500 UAH por verificar los documentos',
    text: 'BetOn ofrece un bono de 500 UAH por completar la verificación de documentos durante la primera hora.',
    question: '¿Cuál es el bono de BetOn por verificar los documentos?',
  },
  it: {
    title: '500 UAH per la verifica dei documenti',
    text: 'BetOn offre un bonus di 500 UAH a chi completa la verifica dei documenti entro la prima ora.',
    question: 'Qual è il bonus BetOn per la verifica dei documenti?',
  },
  pl: {
    title: '500 UAH za weryfikację dokumentów',
    text: 'BetOn oferuje bonus 500 UAH za ukończenie weryfikacji dokumentów w ciągu pierwszej godziny.',
    question: 'Jaki bonus BetOn oferuje za weryfikację dokumentów?',
  },
  uk: {
    title: '500 грн за верифікацію документів',
    text: 'BetOn пропонує бонус 500 грн за проходження верифікації документів протягом першої години.',
    question: 'Який бонус BetOn пропонує за верифікацію документів?',
  },
  pt: {
    title: '500 UAH pela verificação dos documentos',
    text: 'A BetOn oferece um bónus de 500 UAH a quem concluir a verificação dos documentos durante a primeira hora.',
    question: 'Qual é o bónus da BetOn pela verificação dos documentos?',
  },
  fr: {
    title: '500 UAH pour la vérification des documents',
    text: 'BetOn offre un bonus de 500 UAH pour une vérification des documents effectuée dans la première heure.',
    question: 'Quel bonus BetOn offre-t-il pour la vérification des documents ?',
  },
  hi: {
    title: 'दस्तावेज़ सत्यापन पर 500 UAH बोनस',
    text: 'पहले घंटे के भीतर दस्तावेज़ सत्यापन पूरा करने पर BetOn 500 UAH का बोनस देता है।',
    question: 'BetOn दस्तावेज़ सत्यापन के लिए कितना बोनस देता है?',
  },
  fi: {
    title: '500 UAH:n bonus asiakirjojen tarkistuksesta',
    text: 'BetOn tarjoaa 500 UAH:n bonuksen, kun asiakirjojen tarkistus tehdään ensimmäisen tunnin aikana.',
    question: 'Minkä bonuksen BetOn tarjoaa asiakirjojen tarkistuksesta?',
  },
};

const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
export const plainText = value => value.replace(/<[^>]+>/g, '')
  .replace(/&#(x[0-9a-f]+|\d+);/gi, (_, number) => String.fromCodePoint(number[0].toLowerCase() === 'x' ? parseInt(number.slice(1), 16) : Number(number)))
  .replace(/&(amp|quot|apos|lt|gt|nbsp);/g, (_, name) => ({ amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' })[name])
  .trim();

export function updateBetonBonus(original, locale, slug) {
  const copy = BETON_VERIFICATION_COPY[locale];
  assert.ok(copy, `Unknown locale: ${locale}`);
  assert.ok(['beton', 'beton-sport'].includes(slug), `Unknown brand: ${slug}`);
  let html = original;
  const verificationRows = [...html.matchAll(/<tr>[\s\S]*?<\/tr>/g)].filter(match => match[0].includes('KYCAID'));
  assert.equal(verificationRows.length, 1, `${locale}/${slug}: verification row`);
  const oldRow = verificationRows[0][0];
  const newRow = oldRow.replace(/(<td>)[^]*?(<\/td>)/g, (match, open, close, offset) => {
    // Only replace the advice cell; keep verification methods and row label.
    return offset === oldRow.lastIndexOf('<td>') ? open + escape(copy.text) + close : match;
  });
  html = html.replace(oldRow, newRow);

  if (slug === 'beton') {
    const card = `<div class="feature-card glass-card" id="verification-bonus"><strong>${escape(copy.title)}</strong><span>${escape(copy.text)}</span></div>`;
    const existing = /<div class="feature-card glass-card" id="verification-bonus">[\s\S]*?<\/div>/;
    if (existing.test(html)) html = html.replace(existing, card);
    else {
      const bonusSection = [...html.matchAll(/<section class="container"[^>]*>[\s\S]*?<\/section>/g)].find(match => match[0].includes('<strong>BETCOIN</strong>'));
      assert.ok(bonusSection, `${locale}/${slug}: bonus section`);
      const newSection = bonusSection[0].replace('<div class="features-grid premium-grid">', `<div class="features-grid premium-grid">\n          ${card}`);
      html = html.replace(bonusSection[0], newSection);
    }
  }

  const faqSection = [...html.matchAll(/<section class="container"[^>]*>[\s\S]*?<\/section>/g)].find(match => match[0].includes('class="timeline"'));
  assert.ok(faqSection, `${locale}/${slug}: FAQ section`);
  const faqEntry = `<h3>${escape(copy.question)}</h3><p>${escape(copy.text)}</p>`;
  const existingQuestion = `<h3>${escape(copy.question)}</h3>`;
  let newFaq = faqSection[0];
  if (newFaq.includes(existingQuestion)) {
    const start = newFaq.indexOf(existingQuestion);
    const end = newFaq.indexOf('</p>', start) + '</p>'.length;
    newFaq = newFaq.slice(0, start) + faqEntry + newFaq.slice(end);
  } else newFaq = newFaq.replace('<div class="timeline">', `<div class="timeline">\n          ${faqEntry}`);
  html = html.replace(faqSection[0], newFaq);
  const questions = [...newFaq.matchAll(/<h3>([\s\S]*?)<\/h3>\s*<p>([\s\S]*?)<\/p>/g)].map(match => ({
    '@type': 'Question', name: plainText(match[1]), acceptedAnswer: { '@type': 'Answer', text: plainText(match[2]) },
  }));
  assert.equal(questions.length, 6, `${locale}/${slug}: FAQ count`);
  html = html.replace(/(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/, (_, open, json, close) => {
    const schema = JSON.parse(json);
    const faq = schema['@graph'].find(node => node['@type'] === 'FAQPage');
    assert.ok(faq);
    faq.mainEntity = questions;
    for (const node of schema['@graph'].filter(node => ['WebPage', 'Article'].includes(node['@type']))) node.dateModified = '2026-10-07';
    const indent = json.includes('\n') ? 2 : undefined;
    return open + (indent ? '\n' : '') + JSON.stringify(schema, null, indent) + (indent ? '\n    ' : '') + close;
  });
  return html;
}

// Emit an apply_patch document instead of writing HTML. Use --check after
// applying it; optional --locale and --brand keep each patch small and scoped.
function pagePatch(before, after, file) {
  if (before === after) return '';
  const a = before.split('\n'), b = after.split('\n');
  const dp = Array.from({ length: a.length + 1 }, () => new Uint16Array(b.length + 1));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const ops = [];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { ops.push(' ' + a[i++]); j++; }
    else if (j < b.length && (i === a.length || dp[i][j + 1] > dp[i + 1][j])) ops.push('+' + b[j++]);
    else ops.push('-' + a[i++]);
  }
  const ranges = [];
  for (let n = 0; n < ops.length; n++) if (ops[n][0] !== ' ') {
    const start = Math.max(0, n - 2), end = Math.min(ops.length, n + 3);
    const last = ranges.at(-1);
    if (last && start <= last[1]) last[1] = end;
    else ranges.push([start, end]);
  }
  return `*** Update File: ${file}\n` + ranges.map(([start, end]) => '@@\n' + ops.slice(start, end).join('\n') + '\n').join('');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const args = process.argv.slice(2);
  const option = name => args.includes(name) ? args[args.indexOf(name) + 1] : undefined;
  const locales = option('--locale') ? [option('--locale')] : Object.keys(BETON_VERIFICATION_COPY);
  const slugs = option('--brand') ? [option('--brand')] : ['beton', 'beton-sport'];
  const patches = [];
  for (const locale of locales) for (const slug of slugs) {
    const file = `${locale === 'en' ? '' : `${locale}/`}brands/${slug}/index.html`;
    const before = fs.readFileSync(file, 'utf8');
    const after = updateBetonBonus(before, locale, slug);
    const patch = pagePatch(before, after, file);
    if (patch) patches.push(patch);
  }
  if (args.includes('--check')) {
    console.log(`BetOn verification bonus: ${locales.length * slugs.length} pages checked, ${patches.length} pending updates.`);
    if (patches.length) process.exitCode = 1;
  } else if (patches.length) console.log('*** Begin Patch\n' + patches.join('') + '*** End Patch');
}
