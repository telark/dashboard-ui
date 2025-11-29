import { useMemo } from 'react';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { mapCategoriesToOptions } from '../../categories/utils';

export const useGroupCategories = () => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);

  const categoryOptions = useMemo(() => mapCategoriesToOptions(categories), [categories]);

  const defaultCategoryId = useMemo(() => {
    return categories[0]?.id || '';
  }, [categories]);

  return {
    categoryOptions,
    defaultCategoryId,
  };
};
