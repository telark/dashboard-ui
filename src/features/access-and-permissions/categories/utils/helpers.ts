import type { Category } from '../models';

export const mapCategoriesToOptions = (categories: Category[]) => {
  return categories.map((category) => ({
    label: category.name,
    value: category.id,
  }));
};

export const getCategoryName = (categoryId: string, categories: Category[]): string => {
  if (!categoryId) return '—';
  const category = categories.find((cat) => cat.id === categoryId);
  if (!category) {
    return '—';
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
