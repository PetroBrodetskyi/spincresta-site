import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const core = fs.readFileSync(new URL('../styles/core.css', import.meta.url), 'utf8');
const entry = fs.readFileSync(new URL('../styles.css', import.meta.url), 'utf8');
const dark = core.match(/:root\s*\{([\s\S]*?)\n\}/)[1];
const light = core.match(/:root\[data-theme='light'\]\s*\{([\s\S]*?)\n\}/)[1];
const value = (block, name) => block.match(new RegExp(`${name}:\\s*([^;]+);`))?.[1].trim();
const rgb = color => color.slice(1).match(/../g).map(channel => parseInt(channel, 16));
const luminance = color => rgb(color).map(channel => {
  const normalized = channel / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
const contrast = (foreground, background) => {
  const levels = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
  return (levels[0] + 0.05) / (levels[1] + 0.05);
};

test('dark surfaces use neutral blacks with distinct elevation levels', () => {
  const names = ['--bg-main', '--bg-surface', '--bg-card', '--surface-panel', '--surface-card', '--surface-card-hover'];
  const levels = names.map(name => {
    const channels = rgb(value(dark, name));
    assert.equal(new Set(channels).size, 1, `${name} must not have a blue or green cast`);
    assert(channels[0] <= 28, `${name} must stay near black`);
    return channels[0];
  });
  assert.deepEqual(levels, [...new Set(levels)].sort((a, b) => a - b));
  assert.equal(value(dark, '--bg-main'), '#050505');
});

test('main and secondary copy meet AA contrast across dark surfaces', () => {
  for (const foreground of ['--text-main', '--text-muted']) {
    for (const background of ['--bg-main', '--surface-section', '--surface-panel', '--surface-card', '--surface-card-hover']) {
      assert(contrast(value(dark, foreground), value(dark, background)) >= 4.5, `${foreground} on ${background}`);
    }
  }
});

test('light surfaces and brand accents retain their established colors', () => {
  for (const name of ['--bg-main', '--bg-surface', '--bg-card', '--surface-section', '--surface-panel', '--surface-card']) {
    assert.equal(value(light, name), '#ffffff');
  }
  assert.equal(value(light, '--text-main'), '#0f172a');
  assert.equal(value(light, '--text-muted'), '#475569');
  assert.equal(value(light, '--chrome-bg'), '#22262a');
  assert.equal(value(dark, '--gold'), '#ffdf00');
  assert.equal(value(dark, '--accent'), '#f4c400');
  assert.equal(value(dark, '--section-accent'), '#9bbfa9');
  assert(contrast(value(light, '--text-muted'), value(light, '--surface-card')) >= 4.5);
});

test('black header and footer treatments are scoped to dark mode', () => {
  assert(core.includes("html:not([data-theme='light']) .header {"));
  assert(core.includes("html:not([data-theme='light']) .footer {"));
  assert.match(dark, /color-scheme:\s*dark;/);
  assert.match(light, /color-scheme:\s*light;/);
  assert(value(light, '--surface-graphite-gradient'), 'preserve shared surface aliases for light-mode consumers');
  assert(value(light, '--surface-graphite-gradient-hover'));
});

test('shared styles remain versioned for cache invalidation', () => {
  for (const file of ['core', 'pages']) {
    assert.match(entry, new RegExp(`/styles/${file}\\.css\\?v=[a-zA-Z0-9-]+`));
  }
});
