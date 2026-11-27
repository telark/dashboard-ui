import { describe, expect, it } from 'vitest';
import { parseConsumedPercent } from './snapshotStorageUtils';

describe('parseConsumedPercent', () => {
  it.each([
    ['12%', 12],
    [' 12.5 % ', 12.5],
    ['140%', 100],
    ['12', null],
    ['about 12%', null],
  ])('reads %j as %j', (consumed, expected) => {
    expect(parseConsumedPercent(consumed)).toBe(expected);
  });
});
