import { useMemo } from 'react';
import { useUsers } from '../../../users/hooks';
import { useGroupCategoryOptions } from '../categories/useGroupCategoryOptions';

interface UseGroupFormSelectOptionsReturn {
  userOptions: Array<{ label: string; value: string }>;
  categoryOptions: Array<{ label: string; value: string }>;
  defaultCategoryId: string | undefined;
}

export const useGroupFormSelectOptions = (): UseGroupFormSelectOptionsReturn => {
  const { users } = useUsers();
  const { categoryOptions, defaultCategoryId } = useGroupCategoryOptions();

  const userOptions = useMemo(
    () =>
      users?.map((user) => ({
        label: user.fullname || user.username,
        value: user.id,
      })) || [],
    [users],
  );

  return {
    userOptions,
    categoryOptions,
    defaultCategoryId,
  };
};
