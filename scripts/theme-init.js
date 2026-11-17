// Run before styles paint. A visitor's explicit choice always takes precedence.
(() => {
  let theme = 'light';
  try {
    const saved = window.localStorage.getItem('spincresta-theme');
    if (saved === 'dark' || saved === 'light') theme = saved;
  } catch {
    // Storage can be blocked in private or restricted browsing contexts.
  }
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
})();
