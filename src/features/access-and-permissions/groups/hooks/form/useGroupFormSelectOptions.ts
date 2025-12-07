import { useMemo } from 'react';
import { useUsers } from '../../../users/hooks';
import { useRoles } from '../../../roles/hooks';
import { useGroupCategoryOptions } from '../categories/useGroupCategoryOptions';

interface UseGroupFormSelectOptionsReturn {
  userOptions: Array<{ label: string; value: string }>;
  roleOptions: Array<{ label: string; value: string }>;
  categoryOptions: Array<{ label: string; value: string }>;
  defaultCategoryId: string | undefined;
}

export const useGroupFormSelectOptions = (): UseGroupFormSelectOptionsReturn => {
  const { users } = useUsers();
  const { roles } = useRoles();
  const { categoryOptions, defaultCategoryId } = useGroupCategoryOptions();

  const userOptions = useMemo(
    () =>
      users?.map((user) => ({
        label: user.fullname || user.username,
        value: user.id,
      })) || [],
    [users],
  );

  const roleOptions = useMemo(
    () =>
      roles?.map((role) => ({
        label: role.name,
        value: role.id,
      })) || [],
    [roles],
  );

  return {
    userOptions,
    roleOptions,
    categoryOptions,
    defaultCategoryId,
  };
};
