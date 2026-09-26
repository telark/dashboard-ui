import { logout } from '../../clients/logout';
import { getSessionToken, removeSessionToken } from '../session/token';
import { purgeLocalUserData } from '../session/cleanup';
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
  const sessionToken = getSessionToken();
  stopPermissionsPolling();
  try {
    await logout(sessionToken);
  } catch (error: unknown) {
    logger.warn(AUTH_CONSTANTS.LOGOUT.LOGS.SERVER_ERROR, { error });
  }
  try {
    removeSessionToken();
  } catch {
    // Ignore session removal errors during logout
  }
  store.dispatch(clearPermissions());
  try {
    await purgeLocalUserData();
  } catch (error: unknown) {
    logger.warn(AUTH_CONSTANTS.LOGOUT.LOGS.PURGE_ERROR, { error });
  }
  message?.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  navigate(APP_ROUTES.LOGIN);
};
