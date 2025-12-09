import { useMemo, useState, useEffect } from 'react';
import { useUsers } from '../../../users/hooks';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { getCategoryName } from '../../../categories/utils';
import type { Group } from '../../models';
import type { User } from '../../../users/models';
import { buildAvatarSources } from '../../../../../utils/layout';

interface UseViewGroupPanelReturn {
  groupUsers: User[];
  categoryName: string;
  createdByUser: User | null;
  lastUpdatedByUser: User | null;
  avatarSources: Record<string, string>;
}

export const useViewGroupPanel = (group: Group | null): UseViewGroupPanelReturn => {
  const { users } = useUsers();
  const { categories } = useCategories(CATEGORIES_CONSTANTS.SCOPES.GROUPS);
  const [avatarSources, setAvatarSources] = useState<Record<string, string>>({});

  const groupUsers = useMemo(() => {
    if (!group || !users) return [];
    return group.assignedUsersIDs
      .map((userId) => users.find((u) => u.id === userId))
      .filter((user): user is NonNullable<typeof user> => user != null);
  }, [group, users]);

  const categoryName = useMemo(() => {
    if (!group || !categories) return '—';
    return getCategoryName(group.categoryID, categories);
  }, [group, categories]);

  const createdByUser = useMemo(() => {
    if (!group?.createdBy || !users) return null;
    return users.find((u) => u.id === group.createdBy) || null;
  }, [group, users]);

  const lastUpdatedByUser = useMemo(() => {
    if (!group?.lastUpdatedBy || !users) return null;
    return users.find((u) => u.id === group.lastUpdatedBy) || null;
  }, [group, users]);

  // Generate avatar sources for Avatar.Group
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
    avatarSources,
  };
};
