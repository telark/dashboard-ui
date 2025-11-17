const OS_PATTERNS = [
  { pattern: /win/i, name: 'Windows' },
  { pattern: /mac/i, name: 'macOS' },
  { pattern: /linux/i, name: 'Linux' },
  { pattern: /android/i, name: 'Android' },
  { pattern: /iphone|ipad|ipod/i, name: 'iOS' },
  { pattern: /cros/i, name: 'ChromeOS' },
];

const BROWSER_PATTERNS = [
  { pattern: /edg/i, name: 'Edge' },
  { pattern: /chrome/i, name: 'Chrome', exclude: /edg/i },
  { pattern: /firefox/i, name: 'Firefox' },
  { pattern: /safari/i, name: 'Safari', exclude: /chrome/i },
  { pattern: /opera|opr/i, name: 'Opera' },
  { pattern: /brave/i, name: 'Brave' },
];

const detect = (
  patterns: Array<{ pattern: RegExp; name: string; exclude?: RegExp }>,
  text: string,
): string => {
  for (const { pattern, name, exclude } of patterns) {
    if (pattern.test(text) && !exclude?.test(text)) {
      return name;
    }
  }
  return 'Unknown';
};

export const getDeviceInfo = (): { os: string; browser: string } => {
  const ua = globalThis.navigator.userAgent;
  const platform = globalThis.navigator.platform;
  const combined = `${ua} ${platform}`;

  return {
    os: detect(OS_PATTERNS, combined),
    browser: detect(BROWSER_PATTERNS, ua),
  };
};
