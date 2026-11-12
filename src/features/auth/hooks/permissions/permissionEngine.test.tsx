import { act, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { Endpoints } from '../../../../constants';
import { renderApp, renderAppHook, store, mockServerError } from '../../../../test';
import { mockMyPermissions } from '../../../../test/helpers/authApi';
import type { PermissionLevel, ResolvedRole } from '../../models/permissions';
import {
  selectPermissionsError,
  selectPermissionsReady,
} from '../../store/selectors/permissionsSelectors';
import { clearPermissions } from '../../store/slices/permissionsSlice';
import { fetchMyPermissionsThunk } from '../../store/thunks/fetchThunks';
import {
  PermissionGate,
  useCanGrantScopes,
  useIsAdminOnAll,
  usePermission,
} from './permissionEngine';

const NO_PERMISSIONS = { permissions: {} };

const buildRole = (overrides: Partial<ResolvedRole> = {}): ResolvedRole => ({
  roleID: 'role-1',
  roleName: 'release_reviewer',
  status: 'Active',
  priority: 1,
  isExpired: false,
  sources: [{ kind: 'direct' }],
  scopes: [{ scope: 'applications', level: 'Contributor', rules: [] }],
  ...overrides,
});

const fetchRoles = async (roles: ResolvedRole[]) => {
  mockMyPermissions('user-1', roles);
  await act(async () => {
    await store.dispatch(fetchMyPermissionsThunk());
  });
};

/** Mounts the hook first, then loads the roles, so the render's store reset can't wipe them. */
const hookWithRoles = async <T,>(hook: () => T, roles: ResolvedRole[]) => {
  const { result } = renderAppHook(hook, { seed: NO_PERMISSIONS });
  await fetchRoles(roles);
  return result;
};

const levelOn = async (
  roles: ResolvedRole[],
  level: PermissionLevel,
  action?: string,
  scope = 'applications',
) => (await hookWithRoles(() => usePermission(scope, level, action), roles)).current;

describe('permission resolution', () => {
  it('grants up to the level of the highest active role', async () => {
    const roles = [
      buildRole(),
      buildRole({ priority: 2, scopes: [{ scope: 'applications', level: 'ReadOnly', rules: [] }] }),
    ];

    await expect(levelOn(roles, 'Contributor')).resolves.toBe(true);
    await expect(levelOn(roles, 'Owner')).resolves.toBe(false);
  });

  it('ignores expired and inactive roles', async () => {
    const roles = [buildRole({ isExpired: true }), buildRole({ status: 'Inactive' })];

    await expect(levelOn(roles, 'ReadOnly')).resolves.toBe(false);
  });

  it('adds up deny rules across roles', async () => {
    const deny = 'applications.deleteapplication.deny';
    const roles = [
      buildRole(),
      buildRole({ scopes: [{ scope: 'applications', level: 'Owner', rules: [deny] }] }),
    ];

    await expect(levelOn(roles, 'Contributor', deny)).resolves.toBe(false);
    await expect(levelOn(roles, 'Owner', 'another.rule')).resolves.toBe(true);
  });

  it('expands an ALL grant to every scope', async () => {
    const roles = [buildRole({ scopes: [{ scope: 'ALL', level: 'Owner', rules: [] }] })];

    await expect(levelOn(roles, 'Owner', undefined, 'users')).resolves.toBe(true);
  });

  it('marks permissions as ready, and clears them on logout', async () => {
    await hookWithRoles(() => null, [buildRole()]);

    expect(selectPermissionsReady(store.getState())).toBe(true);
    act(() => {
      store.dispatch(clearPermissions());
    });
    expect(selectPermissionsReady(store.getState())).toBe(false);
  });

  it('keeps the error of a failed permissions read', async () => {
    mockServerError('auth', Endpoints.AUTH.PERMISSIONS.GET, { message: 'permissions are down' });
    renderAppHook(() => null, { seed: NO_PERMISSIONS });

    await act(async () => {
      await store.dispatch(fetchMyPermissionsThunk());
    });

    expect(selectPermissionsError(store.getState())).toBe('permissions are down');
  });
});

describe('permission hooks', () => {
  it('compares a grant with the viewer level, across ALL too', async () => {
    const roles = [buildRole({ scopes: [{ scope: 'ALL', level: 'Owner', rules: [] }] })];

    const { current: canGrant } = await hookWithRoles(() => useCanGrantScopes(), roles);

    expect(canGrant([{ scope: 'applications', level: 'Owner' }])).toBe(true);
    expect(canGrant([{ scope: 'ALL', level: 'Owner' }])).toBe(true);
    expect(canGrant([{ scope: 'applications', level: 'Admin' }])).toBe(false);
  });

  it.each([
    ['an Admin grant on ALL', 'ALL', true],
    ['Admin on one scope only', 'applications', false],
  ])('treats %s accordingly', async (_name, scope, expected) => {
    const roles = [buildRole({ scopes: [{ scope, level: 'Admin', rules: [] }] })];

    expect((await hookWithRoles(() => useIsAdminOnAll(), roles)).current).toBe(expected);
  });

  it('shows the fallback of a gate without the permission', async () => {
    const gate: ReactElement = (
      <PermissionGate
        requiredScope="applications"
        requiredLevel="ReadOnly"
        fallback={<div>denied</div>}
      >
        <div>allowed</div>
      </PermissionGate>
    );
    renderApp(gate, { seed: NO_PERMISSIONS });

    await fetchRoles([buildRole({ scopes: [] })]);

    expect(screen.getByText('denied')).toBeInTheDocument();
    expect(screen.queryByText('allowed')).not.toBeInTheDocument();
  });
});
