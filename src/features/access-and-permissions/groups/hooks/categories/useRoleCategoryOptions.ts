import { useMemo } from 'react';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { deduplicateCategoriesByName } from '../../../categories/utils/helpers';
import type { FilterOption } from '../../../../../interfaces/layout/filters';

export const useRoleCategoryOptions = () => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);

  const uniqueCategories = useMemo(() => deduplicateCategoriesByName(categories), [categories]);

  const categoryOptions = useMemo((): FilterOption[] => {
    const options: FilterOption[] = [{ value: 'all', label: 'All' }];
    uniqueCategories.forEach((category) => {
      options.push({ value: category.id, label: category.name });
    });
    return options;
  }, [uniqueCategories]);

  return {
    categoryOptions,
  };
};
