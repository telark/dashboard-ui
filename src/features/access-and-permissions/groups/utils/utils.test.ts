import dayjs from 'dayjs';
import { describe, expect, it } from 'vitest';
import { buildCategory } from '../../../../test/factories/categories';
import { buildGroup } from '../../../../test/factories/groups';
import { buildRole } from '../../../../test/factories/roles';
import type { Role } from '../../roles/models';
import type { Group } from '../models';
import {
  applyGroupFilters,
  applyRoleFilters,
  mapCategoriesToFilterOptions,
  mapGroupData,
  mapGroupDetailsData,
  mapGroupsData,
  normalizeGroupFormData,
} from '.';
import { filterByDateRange } from './filter/dateRangeUtils';

describe('applyGroupFilters', () => {
  const first = buildGroup({ name: 'alpha', categoryRef: 'cat-1' });
  const second = buildGroup({ name: 'beta', categoryRef: 'cat-2' });
  const groups = [first, second];

  it.each<[string, Group[] | undefined, Record<string, unknown>, string | undefined, Group[]]>([
    ['no list', undefined, {}, undefined, []],
    ['no filters', groups, {}, undefined, groups],
    ['a search', groups, {}, 'ALPH', [first]],
    ['category all', groups, { category: 'all' }, undefined, groups],
    ['a category', groups, { category: 'cat-2' }, undefined, [second]],
  ])('applies %s', (_, base, filters, term, expected) => {
    expect(applyGroupFilters(base, filters, term)).toEqual(expected);
  });
});

describe('applyRoleFilters', () => {
  const first = buildRole({
    name: 'alpha',
    description: 'reads things',
    categoryRef: 'cat-1',
    validity: { type: 'permanent' },
  });
  const second = buildRole({
    name: 'beta',
    type: 'built-in',
    status: 'Inactive',
    categoryRef: 'cat-2',
    validity: { type: 'temporary' },
  });
  const roles = [first, second];

  it.each<[string, Role[] | undefined, Record<string, unknown>, string | undefined, Role[]]>([
    ['no list', undefined, {}, undefined, []],
    ['a search on the description', roles, {}, 'things', [first]],
    ['a search on the validity', roles, {}, 'temporary', [second]],
    ['role type', roles, { roleType: 'built-in' }, undefined, [second]],
    ['category', roles, { category: 'cat-1' }, undefined, [first]],
    ['validity', roles, { validity: 'permanent' }, undefined, [first]],
    ['status', roles, { status: 'Inactive' }, undefined, [second]],
    [
      'all, on every filter',
      roles,
      { roleType: 'all', category: 'all', validity: 'all', status: 'all' },
      undefined,
      roles,
    ],
  ])('applies %s', (_, base, filters, term, expected) => {
    expect(applyRoleFilters(base, filters, term)).toEqual(expected);
  });
});

describe('filterByDateRange', () => {
  const inside = { at: '2026-02-15T12:00:00Z' };
  const before = { at: '2026-01-01T12:00:00Z' };
  const after = { at: '2026-04-01T12:00:00Z' };
  const invalid = { at: 'not a date' };
  const items = [inside, before, after, invalid];
  const getDate = (item: { at: string }) => item.at;

  it('keeps everything without a range', () => {
    expect(filterByDateRange(items, undefined, getDate)).toBe(items);
    expect(filterByDateRange(items, {}, getDate)).toBe(items);
  });

  it('keeps only valid dates inside the range', () => {
    expect(
      filterByDateRange(items, { from: dayjs('2026-02-01'), to: dayjs('2026-03-01') }, getDate),
    ).toEqual([inside]);
  });

  it('accepts a date that is already parsed', () => {
    expect(
      filterByDateRange([dayjs(after.at)], { to: dayjs('2026-03-01') }, (item) => item),
    ).toEqual([]);
  });
});

describe('group mappers and form data', () => {
  it('fills in what the API omitted', () => {
    const group = { id: 'g', name: 'n', description: 'd' } as Group;

    expect(mapGroupData(group)).toMatchObject({ userRefs: [], roleRefs: [], categoryRef: '' });
    expect(mapGroupData(group).creationDate).toEqual(expect.any(String));
  });

  it('keeps the values the API sent', () => {
    const group = buildGroup({ userRefs: ['u'], roleRefs: ['r'], categoryRef: 'c' });

    expect(mapGroupsData([group])).toEqual([expect.objectContaining(group)]);
    expect(
      mapGroupDetailsData({ data: group } as Parameters<typeof mapGroupDetailsData>[0]),
    ).toMatchObject(group);
  });

  it('normalizes form values', () => {
    expect(normalizeGroupFormData({ name: 'n', description: ' d ', userRefs: 'nope' })).toEqual({
      name: 'n',
      description: 'd',
      userRefs: [],
    });
    expect(normalizeGroupFormData({ userRefs: ['u'] })).toEqual({
      userRefs: ['u'],
      description: '',
    });
  });

  it('starts filter options with All and drops repeated names', () => {
    const [first, repeat] = [buildCategory({ name: 'ops' }), buildCategory({ name: 'OPS' })];

    expect(mapCategoriesToFilterOptions(undefined)).toEqual([{ value: 'all', label: 'All' }]);
    expect(mapCategoriesToFilterOptions([first, repeat])).toEqual([
      { value: 'all', label: 'All' },
      { value: first.id, label: first.name },
    ]);
  });
});
