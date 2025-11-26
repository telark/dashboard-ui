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
