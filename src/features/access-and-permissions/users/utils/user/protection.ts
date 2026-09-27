import type { User } from '../../models';
import type { Group } from '../../../groups/models';
import type { Role } from '../../../roles/models';
import type { PermissionLevel } from '../../../../auth/models/permissions';
import { ALL_SCOPE_NAME } from '../../../../auth/store/slices/permissionsSlice';
import { USERS_CONSTANTS as UC } from '../../constants';

const ADMIN_LEVEL: PermissionLevel = 'Admin';

export const grantsAdminOnAll = (role: Role): boolean =>
  (role.scopesAndPermissions ?? []).some(
    (grant) => grant.scope === ALL_SCOPE_NAME && grant.level === ADMIN_LEVEL,
  );

export const isAdminUser = (user: User, groups: Group[], adminRoleIds: Set<string>): boolean =>
  [
    ...(user.roleRefs ?? []),
    ...groups
      .filter((group) => user.groupRefs?.includes(group.id))
      .flatMap((group) => group.roleRefs ?? []),
  ].some((roleId) => adminRoleIds.has(roleId));

// Why Delete and Suspend are off for this target, mirroring the backend refusals.
export const userLockReason = (
  target: User,
  viewer: User | null,
  targetIsAdmin: boolean,
): string | undefined => {
  if (target.id === viewer?.id) return UC.LABELS.ACTIONS.SELF_LOCKED_TOOLTIP;
  if (target.bootstrap) return UC.LABELS.ACTIONS.BOOTSTRAP_LOCKED_TOOLTIP;
  if (targetIsAdmin && !viewer?.bootstrap) return UC.LABELS.ACTIONS.ADMIN_LOCKED_TOOLTIP;
  return undefined;
};
