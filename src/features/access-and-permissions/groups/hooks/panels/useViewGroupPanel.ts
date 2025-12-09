import { useMemo, useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { useUsers } from '../../../users/hooks';
import { useCategories } from '../../../categories/hooks';
import { CATEGORIES_CONSTANTS } from '../../../categories/constants';
import { getCategoryName } from '../../../categories/utils';
import type { Group } from '../../models';
import type { User } from '../../../users/models';

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
      const sources: Record<string, string> = {};
      const getAvatarStyle = async (styleName: string) => {
        const styleMap: Record<string, () => Promise<unknown>> = {
          avataaars: () => import('@dicebear/avataaars'),
          adventurer: () => import('@dicebear/adventurer'),
          'big-smile': () => import('@dicebear/big-smile'),
          bottts: () => import('@dicebear/bottts'),
          'fun-emoji': () => import('@dicebear/fun-emoji'),
          identicon: () => import('@dicebear/identicon'),
          lorelei: () => import('@dicebear/lorelei'),
          micah: () => import('@dicebear/micah'),
          miniavs: () => import('@dicebear/miniavs'),
          'open-peeps': () => import('@dicebear/open-peeps'),
          personas: () => import('@dicebear/personas'),
          'pixel-art': () => import('@dicebear/pixel-art'),
        };
        const loader = styleMap[styleName];
        return loader ? await loader() : null;
      };

      for (const user of groupUsers) {
        if (user.avatar?.style && user.avatar?.seed) {
          try {
            const styleModule = await getAvatarStyle(user.avatar.style);
            if (styleModule) {
              const generated = createAvatar(styleModule as never, {
                seed: user.avatar.seed,
                size: 32 * 2,
              });
              sources[user.id] = generated.toDataUri();
            }
          } catch (error) {
            console.error('Failed to load avatar style:', error);
          }
        }
      }

      // Also generate avatars for createdBy and lastUpdatedBy users
      if (createdByUser?.avatar?.style && createdByUser?.avatar?.seed) {
        try {
          const styleModule = await getAvatarStyle(createdByUser.avatar.style);
          if (styleModule) {
            const generated = createAvatar(styleModule as never, {
              seed: createdByUser.avatar.seed,
              size: 16 * 2,
            });
            sources[createdByUser.id] = generated.toDataUri();
          }
        } catch (error) {
          console.error('Failed to load avatar style:', error);
        }
      }

      if (lastUpdatedByUser?.avatar?.style && lastUpdatedByUser?.avatar?.seed) {
        try {
          const styleModule = await getAvatarStyle(lastUpdatedByUser.avatar.style);
          if (styleModule) {
            const generated = createAvatar(styleModule as never, {
              seed: lastUpdatedByUser.avatar.seed,
              size: 16 * 2,
            });
            sources[lastUpdatedByUser.id] = generated.toDataUri();
          }
        } catch (error) {
          console.error('Failed to load avatar style:', error);
        }
      }
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
