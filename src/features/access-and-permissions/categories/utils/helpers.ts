import { APP_ROUTES, EMPTY_VALUE } from '../../../../constants';
import { CATEGORIES_CONSTANTS as CC } from '../constants';
import type { CategoryScope } from '../constants';
import type { Category } from '../models';

export const categoriesPageRoute = (scope: CategoryScope): string =>
  `${APP_ROUTES.CATEGORIES}?${CC.PAGE.TYPE_PARAM}=${scope}`;

export const mapCategoriesToOptions = (categories: Category[]) => {
  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
};

export const getCategoryName = (categoryId: string, categories: Category[]): string => {
  if (!categoryId) return EMPTY_VALUE;
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) {
    return EMPTY_VALUE;
  }
  return category.name;
};

export const deduplicateCategoriesByName = (categories: Category[]): Category[] => {
  const seenNames = new Set<string>();
  return categories.filter((category) => {
    const nameLower = category.name.toLowerCase();
    if (seenNames.has(nameLower)) {
      return false;
    }
    seenNames.add(nameLower);
    return true;
  });
};
