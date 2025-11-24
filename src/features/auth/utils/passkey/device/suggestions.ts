import { getDeviceInfo } from './detection';

const OS_SUGGESTIONS: Record<string, string[]> = {
  Windows: ['Windows-PC', 'My-Windows-Device', 'Windows-Laptop'],
  macOS: ['MacBook', 'My-Mac', 'MacBook-Pro'],
  Linux: ['Linux-PC', 'My-Linux-Device', 'Linux-Laptop'],
  Android: ['Android-Phone', 'My-Android-Device', 'Android-Tablet'],
  iOS: ['iPhone', 'iPad', 'My-iPhone'],
  ChromeOS: ['Chromebook', 'ChromeOS-Device'],
};

const formatSuggestion = (baseName: string, nextNumber: number): string => {
  const formatted = baseName.replaceAll(/\s+/g, '-');
  const paddedNumber = String(nextNumber).padStart(2, '0');
  return `${formatted}-pk-${paddedNumber}`;
};

export const generateDeviceNameSuggestions = (
  existingNames: string[] = [],
  existingCount: number = 0,
): string[] => {
  const { os, browser } = getDeviceInfo();
  const suggestions: string[] = [];
  const nextNumber = existingCount + 1;

  // Add browser-only suggestions (prioritize browser name)
  if (browser !== 'Unknown') {
    suggestions.push(
      formatSuggestion(browser, nextNumber),
      formatSuggestion(`My-${browser}`, nextNumber),
    );
  }

  // Add OS-based suggestions
  if (OS_SUGGESTIONS[os]) {
    OS_SUGGESTIONS[os].forEach((suggestion) => {
      suggestions.push(formatSuggestion(suggestion, nextNumber));
    });
  }

  // Add browser-OS combination suggestions
  if (browser !== 'Unknown' && os !== 'Unknown') {
    suggestions.push(
      formatSuggestion(`${os}-${browser}`, nextNumber),
      formatSuggestion(`${browser}-on-${os}`, nextNumber),
    );
  }

  // Filter out existing names (case-insensitive)
  const existingLower = new Set(existingNames.map((name) => name.toLowerCase()));
  const unique = Array.from(new Set(suggestions)).filter(
    (suggestion) => !existingLower.has(suggestion.toLowerCase()),
  );

  return unique.slice(0, 3);
};
