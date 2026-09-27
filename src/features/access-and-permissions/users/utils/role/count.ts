import type { User } from '../../models';
import type { Group } from '../../../groups/models';

export const getTotalRoleCount = (user: User, groups: Group[]): number => {
  const direct = user.roleRefs ?? [];
  const assignedGroupIds = new Set(user.groupRefs ?? []);

  const inherited = groups
    .filter((g) => assignedGroupIds.has(g.id))
    .flatMap((g) => g.roleRefs ?? []);

  return new Set([...direct, ...inherited]).size;
};
