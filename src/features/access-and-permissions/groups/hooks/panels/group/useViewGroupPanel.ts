import { EMPTY_VALUE } from '../../../../../../constants';
import { useMemo } from 'react';
import { useUsers } from '../../../../users/hooks';
import { useCategories } from '../../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../../categories/constants';
import { getCategoryName } from '../../../../categories/utils';
import type { Group } from '../../../models';
import type { User } from '../../../../users/models';
import { useUsernamesByIds } from '../../../../../../hooks/useUsernamesByIds';

interface UseViewGroupPanelReturn {
  categoryName: string;
  createdByUser: User | null;
  lastUpdatedByUser: User | null;
  usernamesById: Record<string, string>;
}

export const useViewGroupPanel = (group: Group | null): UseViewGroupPanelReturn => {
  const { users } = useUsers();
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);

  const categoryName = useMemo(() => {
    if (!group || !categories) return EMPTY_VALUE;
    return getCategoryName(group.categoryRef, categories);
  }, [group, categories]);

  const createdByUser = useMemo(() => {
    if (!group?.createdBy || !users) return null;
    return users.find((u) => u.id === group.createdBy) || null;
  }, [group, users]);

  const lastUpdatedByUser = useMemo(() => {
    if (!group?.lastUpdatedBy || !users) return null;
    return users.find((u) => u.id === group.lastUpdatedBy) || null;
  }, [group, users]);

  const actorIds = useMemo(
    () => [group?.createdBy, group?.lastUpdatedBy].filter((id): id is string => Boolean(id)),
    [group],
  );
  const usernamesById = useUsernamesByIds(actorIds, Boolean(group));

  return {
    categoryName,
    createdByUser,
    lastUpdatedByUser,
    usernamesById,
  };
};
