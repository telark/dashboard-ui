import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectScopeIndex } from '../../store/selectors/permissionsSelectors';
import type { PermissionLevel } from '../../models/permissions';
import { PERMISSION_LEVEL_RANK } from '../../models/permissions';

/**
 * Returns true when the current user has `scope` at >= `minimumLevel`
 * and the optional `denyRule` is not present in their effective rule set.
 *
 * @param scope - e.g. "users", "groups", "roles"
 * @param minimumLevel - minimum required permission level
 * @param denyRule - optional deny-rule key (format: "scope.rule.deny")
 */
export function useHasPermission(
  scope: string,
  minimumLevel: PermissionLevel,
  denyRule?: string,
): boolean {
  const scopeIndex = useSelector(selectScopeIndex);

  return useMemo(() => {
    const entry = scopeIndex[scope];
    if (!entry) return false;
    if (PERMISSION_LEVEL_RANK[entry.level] < PERMISSION_LEVEL_RANK[minimumLevel]) return false;
    if (denyRule && entry.rules.includes(denyRule)) return false;
    return true;
  }, [scopeIndex, scope, minimumLevel, denyRule]);
}
