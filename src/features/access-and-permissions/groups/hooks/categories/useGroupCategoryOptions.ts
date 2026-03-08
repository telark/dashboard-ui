import { useMemo } from 'react';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { mapCategoriesToOptions, deduplicateCategoriesByName } from '../../../categories/utils';
import type { AssignmentSelectOption } from '../../../roles/models';

export const useGroupCategoryOptions = () => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);

  const uniqueCategories = useMemo(() => deduplicateCategoriesByName(categories), [categories]);

  const categoryOptions = useMemo((): AssignmentSelectOption[] => {
    const mapped = mapCategoriesToOptions(uniqueCategories);
    return mapped.map((option) => ({
      ...option,
      displayName: option.label as string,
    }));
  }, [uniqueCategories]);

  const defaultCategoryId = useMemo(() => {
    return uniqueCategories[0]?.id || '';
  }, [uniqueCategories]);

  return {
    categoryOptions,
    defaultCategoryId,
  };
};
