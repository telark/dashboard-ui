import { describe, expect, it } from 'vitest';
import { LIST_TOOLBAR } from '../../../constants';
import { buildFilterChips, hasAnyAppliedFilter, removeFilterChip, splitFilterChips } from '.';

const { DATE_RANGE_KEY: RANGE, DATE_RANGE_ANY: ANY, DATE_RANGE_SEPARATOR: TO } = LIST_TOOLBAR;

describe('hasAnyAppliedFilter', () => {
  it.each<[Record<string, unknown>, Record<string, unknown> | undefined, boolean]>([
    [{}, undefined, false],
    [{ tags: [] }, undefined, false],
    [{ tags: ['a'] }, undefined, true],
    [{ status: '' }, undefined, false],
    [{ status: 'all' }, { status: 'all' }, false],
    [{ status: 'active' }, { status: 'all' }, true],
    [{ range: 7 }, undefined, false],
    [{ range: {} }, undefined, false],
    [{ range: { from: '2026-01-01' } }, undefined, true],
    [{ range: { to: '2026-01-01' } }, undefined, true],
  ])('reads %j with defaults %j as %j', (filters, defaults, expected) => {
    expect(hasAnyAppliedFilter(filters, defaults)).toBe(expected);
  });
});

describe('buildFilterChips', () => {
  it('builds a chip per array value and skips blanks', () => {
    expect(buildFilterChips({ tags: ['a', ' ', 2] })).toEqual([
      { key: 'tags', value: 'a', label: 'a' },
      { key: 'tags', value: '2', label: '2' },
    ]);
  });

  it('skips a single value at its default, and an unset one', () => {
    expect(buildFilterChips({ status: 'all', other: ' ' }, { status: 'all' })).toEqual([]);
    expect(buildFilterChips({ status: 'active' })).toEqual([
      { key: 'status', value: 'active', label: 'active' },
    ]);
  });

  it.each([
    [{ from: '2026-01-01', to: '2026-02-01' }, `2026-01-01 ${TO} 2026-02-01`],
    [{ from: '2026-01-01' }, `2026-01-01 ${TO} ${ANY}`],
    [{ to: '2026-02-01' }, `${ANY} ${TO} 2026-02-01`],
  ])('labels the date range %j', (range, label) => {
    expect(buildFilterChips({ [RANGE]: range })).toEqual([{ key: RANGE, value: label, label }]);
  });

  it('ignores an empty date range and any other object', () => {
    expect(buildFilterChips({ [RANGE]: {}, other: { from: 'x' } })).toEqual([]);
  });
});

describe('removeFilterChip', () => {
  it('takes one value out of an array, and leaves the rest', () => {
    expect(removeFilterChip({ tags: ['a', 'b'] }, 'tags', 'a')).toEqual({ tags: ['b'] });
  });

  it('removes a single value altogether', () => {
    expect(removeFilterChip({ status: 'x', keep: 'y' }, 'status', 'x')).toEqual({ keep: 'y' });
  });
});

describe('splitFilterChips', () => {
  it('collapses what does not fit', () => {
    const chips = Array.from({ length: LIST_TOOLBAR.MAX_VISIBLE_CHIPS + 2 }, (_, i) => ({
      key: 'k',
      value: `${i}`,
      label: `${i}`,
    }));

    const { visible, overflowCount } = splitFilterChips(chips);

    expect(visible).toHaveLength(LIST_TOOLBAR.MAX_VISIBLE_CHIPS);
    expect(overflowCount).toBe(2);
  });
});
