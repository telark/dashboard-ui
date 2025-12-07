import { useMemo } from 'react';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { mapCategoriesToOptions } from '../../../categories/utils';
import type { AssignmentSelectOption } from '../../../roles/models';

export const useGroupCategoryOptions = () => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);

  const categoryOptions = useMemo((): AssignmentSelectOption[] => {
    const mapped = mapCategoriesToOptions(categories);
    return mapped.map((option) => ({
      ...option,
      displayName: option.label as string,
    }));
  }, [categories]);

  const defaultCategoryId = useMemo(() => {
    return categories[0]?.id || '';
  }, [categories]);

  return {
    categoryOptions,
    defaultCategoryId,
  };
};
