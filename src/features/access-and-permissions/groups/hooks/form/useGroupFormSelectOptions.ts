import { useGroupCategoryOptions } from '../categories/useGroupCategoryOptions';

interface UseGroupFormSelectOptionsReturn {
  categoryOptions: Array<{ label: string; value: string }>;
  defaultCategoryId: string | undefined;
}

export const useGroupFormSelectOptions = (): UseGroupFormSelectOptionsReturn => {
  const { categoryOptions, defaultCategoryId } = useGroupCategoryOptions();

  return {
    categoryOptions,
    defaultCategoryId,
  };
};
