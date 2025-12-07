import type { Category } from '../../categories/models';
import type { FilterOption } from '../../../../interfaces/layout/filters';

export const mapCategoriesToFilterOptions = (
  categories: Category[] | undefined,
): FilterOption[] => {
  const options: FilterOption[] = [{ value: 'all', label: 'All' }];
  if (categories && categories.length > 0) {
    categories.forEach((category) => {
      options.push({ value: category.id, label: category.name });
    });
  }
  return options;
};
