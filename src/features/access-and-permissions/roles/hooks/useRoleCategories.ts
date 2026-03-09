import { useMemo } from 'react';
import { useCategories } from '../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { deduplicateCategoriesByName } from '../../categories/utils/helpers';
import { mapCategoriesToOptions } from '../../categories/utils';

export const useRoleCategories = () => {
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.ROLES);

  const uniqueCategories = useMemo(
    () => deduplicateCategoriesByName(categories ?? []),
    [categories],
  );

  const categoryOptions = useMemo(
    () => mapCategoriesToOptions(uniqueCategories),
    [uniqueCategories],
  );

  const defaultCategoryId = useMemo(() => {
    return uniqueCategories[0]?.id || '';
  }, [uniqueCategories]);

  return {
    categoryOptions,
    defaultCategoryId,
  };
};
