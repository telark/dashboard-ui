import { act, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../../constants';
import { STORAGE_KEYS } from '../../../constants/store/store';
import { permissionsSeed, renderAppHook, store, currentLocation } from '../../../test';
import { mockMyPermissions } from '../../../test/helpers/authApi';
import { signIn } from '../../../test/helpers/session';
import { getMyPermissions } from '../clients/permissions';
import { selectPermissionsReady } from '../store/selectors/permissionsSelectors';
import { useCrossTabLogout } from './useCrossTabLogout';
import {
  dropForeignPermissions,
  useInitializePermissions,
} from './permissions/useInitializePermissions';

const storageEvent = (key: string | null, newValue: string | null) =>
  new StorageEvent('storage', { key, newValue });

describe('cross-tab logout', () => {
  const logOutElsewhere = async (event: StorageEvent) => {
    renderAppHook(() => useCrossTabLogout(), { route: APP_ROUTES.ROLES });
    act(() => {
      window.dispatchEvent(event);
    });
  };

  it.each([
    ['the stored user was removed', storageEvent(STORAGE_KEYS.CURRENT_USER, null)],
    ['storage was cleared', storageEvent(null, null)],
  ])('follows a logout in another tab when %s', async (_name, event) => {
    await logOutElsewhere(event);

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
  });

  it('ignores any other storage change', async () => {
    await logOutElsewhere(storageEvent('some-other-key', null));

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.ROLES));
  });
});

describe('initializing permissions', () => {
  const renderInitialization = (auth: boolean) =>
    renderAppHook((props: { auth: boolean }) => useInitializePermissions(props.auth), {
      initialProps: { auth },
      seed: { permissions: {} },
    });

  it('loads permissions once for a signed-in session', async () => {
    const permissions = mockMyPermissions();

    const { rerender } = renderInitialization(true);
    rerender({ auth: true });

    await waitFor(() => expect(selectPermissionsReady(store.getState())).toBe(true));
    expect(permissions.calls).toHaveLength(1);
  });

  it('does not fetch when signed out', async () => {
    const permissions = mockMyPermissions();

    renderInitialization(false);

    // A fetch the hook had started would reach the mock before this read's own request.
    await getMyPermissions();
    expect(permissions.calls).toHaveLength(1);
  });

  it('leaves the permissions of the same user alone on startup', async () => {
    signIn({ id: 'user-under-test' });
    renderAppHook(() => null, { seed: permissionsSeed() });

    await dropForeignPermissions();

    expect(store.getState().permissions.userID).toBe('user-under-test');
  });
});
