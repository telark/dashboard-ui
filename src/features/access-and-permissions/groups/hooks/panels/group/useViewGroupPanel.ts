import { useMemo, useState, useEffect } from 'react';
import { useUsers } from '../../../../users/hooks';
import { useCategories } from '../../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../../categories/constants';
import { getCategoryName } from '../../../../categories/utils';
import { EMPTY_VALUE } from '../../../../shared';
import type { Group } from '../../../models';
import type { User } from '../../../../users/models';
import { buildAvatarSources } from '../../../../../../utils/layout';
import { useUsernamesByIds } from '../../../../../../hooks/useUsernamesByIds';

interface UseViewGroupPanelReturn {
  groupUsers: User[];
  categoryName: string;
  createdByUser: User | null;
  lastUpdatedByUser: User | null;
  usernamesById: Record<string, string>;
  avatarSources: Record<string, string>;
}

export const useViewGroupPanel = (group: Group | null): UseViewGroupPanelReturn => {
  const { users } = useUsers();
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
  const [avatarSources, setAvatarSources] = useState<Record<string, string>>({});

  const groupUsers = useMemo(() => {
    if (!group || !users) return [];
    return group.userRefs
      .map((userId) => users.find((u) => u.id === userId))
      .filter((user): user is NonNullable<typeof user> => user != null);
  }, [group, users]);

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

  useEffect(() => {
    const generateAvatars = async () => {
      const sources = await buildAvatarSources({
        groupUsers,
        createdByUser,
        lastUpdatedByUser,
      });
      setAvatarSources(sources);
    };

    generateAvatars();
  }, [groupUsers, createdByUser, lastUpdatedByUser]);

  return {
    groupUsers,
    categoryName,
    createdByUser,
    lastUpdatedByUser,
    usernamesById,
    avatarSources,
  };
};
