import { ROLES_CONSTANTS as RC } from '../../roles/constants';
import type { Role } from '../../roles/models';
import { GRANT_CONFIRM as T } from '../constants/grantConfirm';

const AREAS = RC.SCOPE.DEFAULT_AREAS;
const ALL_SCOPE = 'ALL';
const list = new Intl.ListFormat(T.LIST_LOCALE, { type: 'conjunction' });

/** "alice, bob, and carol": names in a grant confirm. */
export const formatList = (items: string[]): string => list.format(items);

export interface GrantConfirmCopy {
  title: string;
  body: string;
  action: string;
}

// Owner or Admin on any area asks first, like removing a role does. Null: nothing wide is granted.
export const grantConfirmCopy = (roles: Role[], name: string): GrantConfirmCopy | null => {
  const wide = roles
    .flatMap((role) => role.scopesAndPermissions ?? [])
    .filter(({ level }) => level === 'Owner' || level === 'Admin');
  if (wide.length === 0) return null;
  const level = wide.some((g) => g.level === 'Admin') ? 'Admin' : 'Owner';
  const onAll = (g: { scope: string }) => g.scope.toUpperCase() === ALL_SCOPE;
  const labels = new Set(
    wide.map((g) => AREAS.find((a) => a.key === g.scope.toLowerCase())?.label ?? g.scope),
  );
  const areas =
    wide.some(onAll) || labels.size >= AREAS.length ? T.EVERY_AREA : formatList([...labels]);
  return {
    title: T.TITLE(level, areas, name),
    body: wide.some((g) => onAll(g) && g.level === 'Admin')
      ? T.ADMIN_BODY(name)
      : T.BODY(name, areas),
    action: T.ACTION(level),
  };
};
