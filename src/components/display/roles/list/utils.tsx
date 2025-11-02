import type { Role, RoleScopeLevel } from '../../../../interfaces/roles';

export type RolesSortKey = 'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status';
export const getPermissionCount = (role: Role): number => {
  const levels = Object.values(role.scopes || {}) as Array<Array<RoleScopeLevel>>;
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
      case 'name':
        return (a, b) => compareStrings(a.name, b.name);
      case 'group':
        return (a, b) => compareStrings(a.group, b.group);
      case 'type':
        return (a, b) => compareStrings(a.type, b.type);
      case 'permission':
        return (a, b) => compareNumbers(getCount(a), getCount(b));
      case 'createdAt':
        return (a, b) =>
          compareNumbers(new Date(a.createdAt || 0).getTime(), new Date(b.createdAt || 0).getTime());
      case 'status': {
        const order = { Inactive: 0, Active: 1 } as const;
        return (a, b) => compareNumbers(order[(a.status as 'Active' | 'Inactive') || 'Inactive'], order[(b.status as 'Active' | 'Inactive') || 'Inactive']);
      }
      default:
        return () => 0;
    }
  })();

  const items = [...roles];
  items.sort((a, b) => (sortOrder === 'asc' ? comparator(a, b) : -comparator(a, b)));
  return items;
};

