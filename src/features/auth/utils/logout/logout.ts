import { logout } from '../../clients/logout';
import { removeSessionToken } from '../session/token';
import { clearPermissions } from '../../store/slices/permissionsSlice';
import { stopPermissionsPolling } from '../../hooks/permissions/useInitializePermissions';
import store from '../../../../store';
import { AUTH_CONSTANTS, AUTH_SUCCESS_MESSAGES } from '../../constants';
import { APP_ROUTES } from '../../../../constants';
import logger from '../../../../logging';

export interface LogoutMessageApi {
  success: (content: string) => void;
}

export const handleUserLogout = async (
  navigate: (path: string) => void,
  message?: LogoutMessageApi,
): Promise<void> => {
  stopPermissionsPolling();
  void logout().catch((error: unknown) => {
    logger.warn(AUTH_CONSTANTS.LOGOUT.LOGS.SERVER_ERROR, { error });
  });
  try {
    removeSessionToken();
  } catch {
    // Ignore session removal errors during logout
  }
  store.dispatch(clearPermissions());
  navigate(APP_ROUTES.LOGIN);
  message?.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
};
