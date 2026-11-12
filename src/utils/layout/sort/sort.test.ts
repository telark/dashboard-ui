import { act } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderAppHook } from '../../../test';
import { compareCodeUnits } from './compareCodeUnits';
import { sortData } from './sortData';
import type { SortFieldConfig, SortOrder } from './types';
import { useSortState } from './useSortState';

interface Row {
  name?: string;
  size?: number;
  at?: string;
}

const a: Row = { name: 'alpha', size: 2, at: '2026-02-01' };
const b: Row = { name: 'beta', size: 10, at: '2026-01-01' };
const blank: Row = {};
const rows = [b, blank, a];

const FIELDS: SortFieldConfig<Row>[] = [
  { key: 'name', type: 'string' },
  { key: 'size', type: 'number' },
  { key: 'at', type: 'date' },
  { key: 'custom', type: 'custom', getValue: (row) => row.size },
  { key: 'derived', type: 'string', getValue: (row) => row.name?.at(-2) },
  { key: 'comparator', type: 'custom', compare: (x, y) => (x.size ?? 0) - (y.size ?? 0) },
  { key: 'odd', type: 'unknown' as SortFieldConfig<Row>['type'], getValue: (row) => row.name },
];

describe('sortData', () => {
  it.each<[string, SortOrder, Row[]]>([
    ['name', 'asc', [a, b, blank]],
    ['name', 'desc', [blank, b, a]],
    ['size', 'asc', [a, b, blank]],
    ['at', 'asc', [b, a, blank]],
    ['custom', 'asc', [a, b, blank]],
    ['derived', 'asc', [a, b, blank]],
    ['comparator', 'asc', [blank, a, b]],
    ['odd', 'asc', [a, b, blank]],
  ])('sorts by %s %s', (key, order, expected) => {
    expect(sortData(rows, key, order, FIELDS)).toEqual(expected);
  });

  it('keeps equal custom values in place', () => {
    expect(sortData([a, { ...a }], 'custom', 'asc', FIELDS)).toEqual([a, a]);
  });

  it.each([
    [null, rows],
    ['missing', rows],
  ])('leaves the order alone for key %j', (key, expected) => {
    expect(sortData(rows, key, 'asc', FIELDS)).toBe(expected);
  });

  it('returns an empty list untouched', () => {
    const empty: Row[] = [];

    expect(sortData(empty, 'name', 'asc', FIELDS)).toBe(empty);
  });
});

describe('compareCodeUnits', () => {
  it.each([
    ['a', 'b', -1],
    ['b', 'a', 1],
    ['a', 'a', 0],
  ])('compares %j and %j as %i', (left, right, expected) => {
    expect(compareCodeUnits(left, right)).toBe(expected);
  });
});

describe('useSortState', () => {
  it('sorts a new key ascending and flips on a repeat click', () => {
    const { result } = renderAppHook(() => useSortState({ defaultSortKey: 'name' }));
    expect(result.current).toMatchObject({ sortKey: 'name', sortOrder: 'desc' });

    act(() => result.current.handleSort('name'));
    expect(result.current.sortOrder).toBe('asc');

    act(() => result.current.handleSort('name'));
    expect(result.current.sortOrder).toBe('desc');

    act(() => result.current.handleSort('size'));
    expect(result.current).toMatchObject({ sortKey: 'size', sortOrder: 'asc' });
  });

  it('starts unsorted by default', () => {
    expect(renderAppHook(() => useSortState()).result.current.sortKey).toBeNull();
  });
});
