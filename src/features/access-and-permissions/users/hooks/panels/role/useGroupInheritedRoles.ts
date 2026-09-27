import { useMemo } from 'react';
import type { User } from '../../../models';
import type { Role } from '../../../../roles/models';
import type { Group } from '../../../../groups/models';

export interface GroupInheritedRole {
  role: Role;
  /** All user groups that grant this role */
  fromGroups: Group[];
}

export const useGroupInheritedRoles = (
  user: User | null,
  allRoles: Role[] | undefined,
  allGroups: Group[] | undefined,
): GroupInheritedRole[] =>
  useMemo(() => {
    if (!user || !allRoles || !allGroups) return [];

    const userGroups = allGroups.filter((g) => user.groupRefs?.includes(g.id));

    const roleGroupMap = new Map<string, Group[]>();
    for (const group of userGroups) {
      for (const roleId of group.roleRefs ?? []) {
        const existing = roleGroupMap.get(roleId) ?? [];
        roleGroupMap.set(roleId, [...existing, group]);
      }
    }

    const result: GroupInheritedRole[] = [];
    for (const [roleId, fromGroups] of roleGroupMap) {
      const role = allRoles.find((r) => r.id === roleId);
      if (role) result.push({ role, fromGroups });
    }

    return result.sort((a, b) => a.role.name.localeCompare(b.role.name));
  }, [user, allRoles, allGroups]);
