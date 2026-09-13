import type { Role, RolesSortKey } from '../../../models';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import { toTimestamp } from '../../../../../../utils/shared/time';

export const getPermissionCount = (role: Role): number => {
  if (!role.scopesAndPermissions || role.scopesAndPermissions.length === 0) {
    return 0;
  }
  return role.scopesAndPermissions.reduce((acc, scopeAndPerm) => {
    if (scopeAndPerm.scope === 'ALL' && scopeAndPerm.level === RPC.PERMISSION_LEVEL.ADMIN) {
      return acc + 10;
    }
    return acc + 1;
  }, 0);
};
type Comparator<T> = (a: T, b: T) => number;
type SortOrder = 'asc' | 'desc';
const compareStrings = (a: string | undefined, b: string | undefined) =>
  String(a || '').localeCompare(String(b || ''));
const compareNumbers = (a: number, b: number) => a - b;

export const sortRoles = (
  roles: Role[],
  sortKey: RolesSortKey,
  sortOrder: SortOrder,
  overrides?: Partial<Record<string, Comparator<Role>>>,
): Role[] => {
  const comparator: Comparator<Role> = (() => {
    const override = overrides?.[sortKey];
    if (override) return override;

    switch (sortKey) {
      case RPC.KEYS.NAME:
        return (a, b) => compareStrings(a.name, b.name);
      case RPC.KEYS.TYPE:
        return (a, b) => compareStrings(a.type, b.type);
      case RPC.KEYS.CREATED_AT:
        return (a, b) => compareNumbers(toTimestamp(a.creationDate), toTimestamp(b.creationDate));
      case RPC.KEYS.STATUS: {
        const order = { [RPC.STATUS.INACTIVE]: 0, [RPC.STATUS.ACTIVE]: 1 } as const;
        return (a, b) => compareNumbers(order[a.status], order[b.status]);
      }
      default:
        return () => 0;
    }
  })();

  const items = [...roles];
  items.sort((a, b) => (sortOrder === 'asc' ? comparator(a, b) : -comparator(a, b)));
  return items;
};
