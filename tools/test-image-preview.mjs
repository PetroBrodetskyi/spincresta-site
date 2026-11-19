import assert from 'node:assert/strict';
import { test } from 'node:test';
import { bindImagePreview } from '../scripts/image-preview.js';

class PreviewImage extends EventTarget {
  constructor({ complete = false, naturalWidth = 0 } = {}) {
    super();
    this.complete = complete;
    this.naturalWidth = naturalWidth;
    this.src = '/screenshot.webp';
  }

  getAttribute(attr) { return this[attr]; }
  fire(type) { this.dispatchEvent(new Event(type)); }
}

test('a pending image shows a skeleton until it loads', () => {
  const container = { dataset: {} };
  const image = new PreviewImage();
  bindImagePreview(container, image);
  assert.equal(container.dataset.previewState, 'loading');
  image.fire('load');
  assert.equal(container.dataset.previewState, 'ready');
  image.fire('error');
  assert.equal(container.dataset.previewState, 'ready');
});

test('cached screenshots bypass the loading state', () => {
  const container = { dataset: {} };
  bindImagePreview(container, new PreviewImage({ complete: true, naturalWidth: 640 }));
  assert.equal(container.dataset.previewState, 'ready');
});

test('a missing card screenshot tries the existing logo once and retains the loading state until it settles', () => {
  for (const result of ['load', 'error']) {
    const container = { dataset: {} };
    const image = new PreviewImage({ complete: true });
    let fallbackCount = 0;
    const options = { fallback: '/logo.webp', onFallback: () => { fallbackCount++; } };
    bindImagePreview(container, image, options);
    bindImagePreview(container, image, options);
    assert.equal(container.dataset.previewState, 'loading');
    assert.equal(image.src, '/logo.webp');
    image.fire(result);
    assert.equal(fallbackCount, 1);
    assert.equal(container.dataset.previewState, result === 'load' ? 'ready' : 'error');
  }
});

test('a failed brand screenshot ends loading even when no fallback exists', () => {
  const container = { dataset: {} };
  const image = new PreviewImage();
  bindImagePreview(container, image, { fallback: image.src });
  image.fire('error');
  assert.equal(container.dataset.previewState, 'error');
});

test('only visible, pending previews animate and settled previews are unobserved', async () => {
  const original = globalThis.IntersectionObserver;
  let notify;
  let observed;
  const unobserved = [];
  globalThis.IntersectionObserver = class {
    constructor(callback) { notify = (target, isIntersecting) => callback([{ target, isIntersecting }], this); }
    observe(target) { observed = target; }
    unobserve(target) { unobserved.push(target); }
  };
  try {
    const { bindImagePreview: bind } = await import('../scripts/image-preview.js?visibility-test');
    const target = { dataset: {}, isConnected: true };
    const image = new PreviewImage();
    bind(target, image);
    assert.equal(observed, target);
    assert.equal(target.dataset.previewVisible, undefined);
    notify(target, true);
    assert.equal(target.dataset.previewVisible, 'true');
    notify(target, false);
    assert.equal(target.dataset.previewVisible, undefined);
    notify(target, true);
    image.fire('load');
    assert.equal(target.dataset.previewState, 'ready');
    assert.equal(target.dataset.previewVisible, undefined);
    assert.deepEqual(unobserved, [target]);
    notify(target, true);
    assert.equal(target.dataset.previewVisible, undefined);
  } finally {
    if (original) globalThis.IntersectionObserver = original;
    else delete globalThis.IntersectionObserver;
  }
});
