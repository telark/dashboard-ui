import type { Role, RoleScopePermission } from '../../../../interfaces/roles';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';

export type RolesSortKey = 'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status';
export const getPermissionCount = (role: Role): number => {
  const levels = Object.values(role.scopes || {}) as Array<Array<RoleScopePermission>>;
  return levels.reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
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
  getCount: (r: Role) => number,
  overrides?: Partial<Record<string, Comparator<Role>>>,
): Role[] => {
  const comparator: Comparator<Role> = (() => {
    if (overrides && overrides[sortKey]) return overrides[sortKey] as Comparator<Role>;

    switch (sortKey) {
      case RPC.KEYS.NAME:
        return (a, b) => compareStrings(a.name, b.name);
      case RPC.KEYS.GROUP:
        return (a, b) => compareStrings(a.group, b.group);
      case RPC.KEYS.TYPE:
        return (a, b) => compareStrings(a.type, b.type);
      case RPC.KEYS.PERMISSION:
        return (a, b) => compareNumbers(getCount(a), getCount(b));
      case RPC.KEYS.CREATED_AT:
        return (a, b) =>
          compareNumbers(new Date(a.createdAt || 0).getTime(), new Date(b.createdAt || 0).getTime());
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

