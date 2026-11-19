let previewObserver;

const observePendingPreview = container => {
  if (typeof IntersectionObserver !== 'function') return;
  previewObserver ||= new IntersectionObserver((entries, observer) => {
    for (const { target, isIntersecting } of entries) {
      if (!target.isConnected || target.dataset.previewState !== 'loading') {
        delete target.dataset.previewVisible;
        observer.unobserve(target);
      } else if (isIntersecting) {
        target.dataset.previewVisible = 'true';
      } else {
        delete target.dataset.previewVisible;
      }
    }
  });
  previewObserver.observe(container);
};

// Keep the preview box in place while its image loads or switches to a fallback.
export function bindImagePreview(container, image, { fallback = '', onFallback } = {}) {
  if (!container || !image || container.dataset.previewState) return;

  let fallbackTried = false;
  const finish = state => {
    container.dataset.previewState = state;
    delete container.dataset.previewVisible;
    previewObserver?.unobserve(container);
    image.removeEventListener('load', onLoad);
    image.removeEventListener('error', onError);
  };
  const onLoad = () => finish('ready');
  const onError = () => {
    if (!fallbackTried && fallback && image.getAttribute('src') !== fallback) {
      fallbackTried = true;
      onFallback?.();
      image.src = fallback;
      return;
    }
    finish('error');
  };

  container.dataset.previewState = 'loading';
  image.addEventListener('load', onLoad);
  image.addEventListener('error', onError);
  // An eager brand screenshot may already have settled before its layout module loads.
  if (image.complete) {
    if (image.naturalWidth > 0) onLoad();
    else onError();
  }
  if (container.dataset.previewState === 'loading') observePendingPreview(container);
}
