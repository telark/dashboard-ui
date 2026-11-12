import { describe, expect, it } from 'vitest';
import { CapitalizeFirstLetter, SentenceCase, pluralize, truncateText } from './format';

describe('format helpers', () => {
  it.each([
    ['', ''],
    ['release lead', 'Release Lead'],
    ['SRE on-call', 'Sre On-call'],
  ])('CapitalizeFirstLetter(%j) is %j', (input, expected) => {
    expect(CapitalizeFirstLetter(input)).toBe(expected);
  });

  it.each([
    ['', ''],
    ['grants API access for CI jobs', 'Grants API access for CI jobs'],
    ['Top-level authority', 'Top-level authority'],
  ])('SentenceCase(%j) is %j', (input, expected) => {
    expect(SentenceCase(input)).toBe(expected);
  });

  it.each([
    [0, '0 plans'],
    [1, '1 plan'],
    [2, '2 plans'],
  ])('pluralize(%i, "plan") is %j', (count, expected) => {
    expect(pluralize(count, 'plan')).toBe(expected);
  });

  it.each([
    ['', 5, ''],
    ['short', 5, 'short'],
    ['too long', 3, 'too...'],
  ])('truncateText(%j, %i) is %j', (text, max, expected) => {
    expect(truncateText(text, max)).toBe(expected);
  });
});
