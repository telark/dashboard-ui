import { describe, expect, it } from 'vitest';
import { DEFAULT_COLORS, getPillColor, getPillTextColor } from './colors';

describe('getPillTextColor', () => {
  it.each([
    ['green', DEFAULT_COLORS.SUCCESS, DEFAULT_COLORS.PILL_TEXT],
    ['red', DEFAULT_COLORS.DANGER, DEFAULT_COLORS.PILL_TEXT],
    ['neutral', undefined, DEFAULT_COLORS.PILL_TEXT],
    ['amber', DEFAULT_COLORS.WARNING, DEFAULT_COLORS.TEXT_ON_SURFACE],
  ])('gives the %s pill its text color', (_, accent, expected) => {
    expect(getPillTextColor(getPillColor(accent))).toBe(expected);
  });
});
