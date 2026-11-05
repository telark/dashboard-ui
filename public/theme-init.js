// Runs before the first paint, as a file because the CSP forbids inline scripts, so a light
// theme never flashes dark. Mirrors src/features/theme; index.html holds the two page colors.
(() => {
  let theme;
  try {
    theme = JSON.parse(localStorage.getItem('CURRENT_USER'))?.settings?.theme;
  } catch {
    return;
  }
  const isLight =
    theme === 'light' ||
    (theme === 'system' && matchMedia('(prefers-color-scheme: light)').matches);
  if (!isLight) return;
  const root = document.documentElement;
  root.dataset.theme = 'light';
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', getComputedStyle(root).getPropertyValue('--color-page-bg'));
})();
