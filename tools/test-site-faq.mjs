import assert from 'node:assert/strict';
import test from 'node:test';
import { getFaqTabIndex, isFaqSection } from '../scripts/faq.js';

test('FAQ detection recognizes headings in every supported language', () => {
  for (const title of [
    'Frequently Asked Questions', 'Häufig gestellte Fragen', 'Preguntas frecuentes',
    'Domande frequenti', 'Najczęściej zadawane pytania', 'Поширені запитання',
    'Perguntas frequentes', 'Foire aux questions', 'अक्सर पूछे जाने वाले प्रश्न', 'Usein kysytyt kysymykset',
  ]) assert.equal(isFaqSection('', title), true, title);
  assert.ok(isFaqSection('brand-faq', ''));
  assert.ok(isFaqSection('', 'privacy-faq-title'));
});

test('the enhancer keeps similarly marked-up editorial cards out of the FAQ', () => {
  for (const title of [
    'Why Players Watch New Casino Launches', 'What makes a strong proposal',
    'Warning Signs of Problem Gambling', 'What Odri reviews', 'Player protection tools',
  ]) assert.equal(isFaqSection('', title), false, title);
});

test('the desktop question rail supports wrapping navigation and Home/End', () => {
  assert.equal(getFaqTabIndex('ArrowDown', 2, 3), 0);
  assert.equal(getFaqTabIndex('ArrowUp', 0, 3), 2);
  assert.equal(getFaqTabIndex('Home', 2, 3), 0);
  assert.equal(getFaqTabIndex('End', 0, 3), 2);
  assert.equal(getFaqTabIndex('Tab', 0, 3), -1);
});
