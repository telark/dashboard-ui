import type { User } from '../../models';
import type { Group } from '../../../groups/models';

export const getTotalRoleCount = (user: User, groups: Group[]): number => {
  const direct = user.assignedRolesIDs ?? [];
  const assignedGroupIds = new Set(user.assignedGroupsIDs ?? []);

  const inherited = groups
    .filter((g) => assignedGroupIds.has(g.id))
    .flatMap((g) => g.assignedRolesIDs ?? []);

  return new Set([...direct, ...inherited]).size;
};
