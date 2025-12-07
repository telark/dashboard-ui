import type { Category } from '../../categories/models';
import type { FilterOption } from '../../../../interfaces/layout/filters';
import { deduplicateCategoriesByName } from '../../categories/utils/helpers';

export const mapCategoriesToFilterOptions = (
  categories: Category[] | undefined,
): FilterOption[] => {
  const options: FilterOption[] = [{ value: 'all', label: 'All' }];
  if (categories && categories.length > 0) {
    const uniqueCategories = deduplicateCategoriesByName(categories);
    uniqueCategories.forEach((category) => {
      options.push({ value: category.id, label: category.name });
    });
  }
  return options;
};
