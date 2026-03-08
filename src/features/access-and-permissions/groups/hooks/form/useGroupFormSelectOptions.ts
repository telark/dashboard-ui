import { useGroupCategoryOptions } from '../categories/useGroupCategoryOptions';
import type { AssignmentSelectOption } from '../../../roles/models';

interface UseGroupFormSelectOptionsReturn {
  categoryOptions: AssignmentSelectOption[];
  defaultCategoryId: string | undefined;
}

export const useGroupFormSelectOptions = (): UseGroupFormSelectOptionsReturn => {
  const { categoryOptions, defaultCategoryId } = useGroupCategoryOptions();

  return {
    categoryOptions,
    defaultCategoryId,
  };
};
