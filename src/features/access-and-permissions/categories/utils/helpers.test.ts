import { describe, expect, it } from 'vitest';
import { EMPTY_VALUE } from '../../../../constants';
import { buildCategory } from '../../../../test/factories/categories';
import { deduplicateCategoriesByName, getCategoryName, mapCategoriesToOptions } from './helpers';

describe('category helpers', () => {
  const category = buildCategory({ name: 'ops' });

  it('maps categories to options', () => {
    expect(mapCategoriesToOptions([category])).toEqual([{ label: 'ops', value: category.id }]);
  });

  it.each([
    ['', EMPTY_VALUE],
    ['missing', EMPTY_VALUE],
    [category.id, 'ops'],
  ])('names category %j as %j', (id, expected) => {
    expect(getCategoryName(id, [category])).toBe(expected);
  });

  it('keeps the first of a repeated name, in any case', () => {
    const repeat = buildCategory({ name: 'OPS' });

    expect(deduplicateCategoriesByName([category, repeat])).toEqual([category]);
  });
});
