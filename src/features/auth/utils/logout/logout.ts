import { message } from 'antd';
import { logout } from '../../clients/logout';
import { removeSessionToken } from '../session/token';
import { clearPermissions } from '../../store/slices/permissionsSlice';
import { stopPermissionsPolling } from '../../hooks/permissions/useInitializePermissions';
import store from '../../../../store';
import { AUTH_SUCCESS_MESSAGES } from '../../constants';
import { APP_ROUTES } from '../../../../constants';

export const handleUserLogout = async (navigate: (path: string) => void): Promise<void> => {
  stopPermissionsPolling();
  void logout().catch(() => {
    // Server-side invalidation runs best-effort; ignore failures
  });
  try {
    removeSessionToken();
  } catch {
    // Ignore session removal errors during logout
  }
  store.dispatch(clearPermissions());
  navigate(APP_ROUTES.LOGIN);
  message.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
};
