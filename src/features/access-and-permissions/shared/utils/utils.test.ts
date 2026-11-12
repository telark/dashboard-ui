import { describe, expect, it } from 'vitest';
import { buildRole } from '../../../../test/factories/roles';
import { ROLES_CONSTANTS as RC } from '../../roles/constants';
import type { ScopeAndPermissions } from '../../roles/models';
import { GRANT_CONFIRM as T } from '../constants/grantConfirm';
import { applySelectionChange } from './assignment';
import { formatList, grantConfirmCopy } from './grants';

describe('applySelectionChange', () => {
  it.each([
    ['adds what was selected', ['a'], ['a'], ['a', 'b'], ['a', 'b']],
    ['removes what was unselected', ['a', 'b'], ['a', 'b'], ['a'], ['a']],
    ['keeps what someone else added meanwhile', ['a', 'z'], ['a'], ['a', 'b'], ['a', 'z', 'b']],
    ['never sends an id twice', ['a', 'b'], ['a'], ['a', 'b'], ['a', 'b']],
  ])('%s', (_, fresh, initial, selected, expected) => {
    expect(applySelectionChange(fresh, initial, selected)).toEqual(expected);
  });
});

describe('grantConfirmCopy', () => {
  const NAME = 'sre_oncall';
  const roleWith = (...scopes: ScopeAndPermissions[]) =>
    buildRole({ scopesAndPermissions: scopes });
  const [firstArea, secondArea] = RC.SCOPE.DEFAULT_AREAS;

  it('formats a list', () => {
    expect(formatList(['a', 'b', 'c'])).toBe('a, b, and c');
  });

  it('asks nothing for a narrow grant', () => {
    expect(
      grantConfirmCopy([roleWith({ scope: firstArea.key, level: 'ReadOnly' })], NAME),
    ).toBeNull();
  });

  it('asks nothing for a role without scopes', () => {
    const role = { ...buildRole(), scopesAndPermissions: undefined } as unknown as ReturnType<
      typeof buildRole
    >;

    expect(grantConfirmCopy([role], NAME)).toBeNull();
  });

  it('names the areas of an Owner grant', () => {
    const scopes = [
      { scope: firstArea.key, level: 'Owner' as const },
      { scope: secondArea.key, level: 'Owner' as const },
    ];
    const areas = formatList([firstArea.label, secondArea.label]);

    expect(grantConfirmCopy([roleWith(...scopes)], NAME)).toEqual({
      title: T.TITLE('Owner', areas, NAME),
      body: T.BODY(NAME, areas),
      action: T.ACTION('Owner'),
    });
  });

  it('warns about Admin on everything', () => {
    expect(grantConfirmCopy([roleWith({ scope: 'all', level: 'Admin' })], NAME)).toEqual({
      title: T.TITLE('Admin', T.EVERY_AREA, NAME),
      body: T.ADMIN_BODY(NAME),
      action: T.ACTION('Admin'),
    });
  });

  it('says every area when all of them are granted one by one', () => {
    const scopes = RC.SCOPE.DEFAULT_AREAS.map((area) => ({
      scope: area.key,
      level: 'Owner' as const,
    }));

    expect(grantConfirmCopy([roleWith(...scopes)], NAME)?.title).toBe(
      T.TITLE('Owner', T.EVERY_AREA, NAME),
    );
  });

  it('labels an unknown scope by its key', () => {
    expect(grantConfirmCopy([roleWith({ scope: 'custom-area', level: 'Owner' })], NAME)?.body).toBe(
      T.BODY(NAME, 'custom-area'),
    );
  });
});
