import { screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { APP_ROUTES } from '../../../../constants';
import {
  clickButton,
  permissionsSeed,
  renderApp,
  type StoreSeed,
  currentLocation,
} from '../../../../test';
import { DATA_VIEW_ERROR_CONSTANTS } from '../../../../components/shared/dataViewError.constants';
import { mockMyPermissions } from '../../../../test/helpers/authApi';
import { signIn } from '../../../../test/helpers/session';
import { PERMISSION_GATE_BYPASS_PATHS } from '../../constants';
import ProtectedRoute from './ProtectedRoute';

const PAGE = 'The protected page';

const NOT_READY: StoreSeed = { permissions: { ready: false, loading: false, error: null } };

const renderRoute = (seed: StoreSeed, route: string = APP_ROUTES.ROLES) =>
  renderApp(
    <ProtectedRoute>
      <div>{PAGE}</div>
    </ProtectedRoute>,
    // Routed, so the redirect to the login page leaves this route instead of re-rendering it.
    { route, path: route, seed },
  );

describe('protected route', () => {
  it('sends a visitor who is not signed in to the login page', async () => {
    renderRoute(permissionsSeed());

    await waitFor(() => expect(currentLocation()).toBe(APP_ROUTES.LOGIN));
    expect(screen.queryByText(PAGE)).not.toBeInTheDocument();
  });

  describe('for a signed-in user', () => {
    beforeEach(() => void signIn());

    it('shows the page once permissions are ready', () => {
      renderRoute(permissionsSeed());

      expect(screen.getByText(PAGE)).toBeInTheDocument();
    });

    it('shows the page even before permissions on a bypassed path', () => {
      renderRoute(NOT_READY, PERMISSION_GATE_BYPASS_PATHS[0]);

      expect(screen.getByText(PAGE)).toBeInTheDocument();
    });

    it('offers a retry when permissions could not load, then shows the page', async () => {
      mockMyPermissions();
      const { user } = renderRoute({ permissions: { ready: false, error: 'nope' } });

      expect(
        await screen.findByText(DATA_VIEW_ERROR_CONSTANTS.LABELS.DEFAULT_TITLE),
      ).toBeInTheDocument();
      await clickButton(user, DATA_VIEW_ERROR_CONSTANTS.LABELS.RETRY_BUTTON);

      expect(await screen.findByText(PAGE)).toBeInTheDocument();
    });
  });
});
