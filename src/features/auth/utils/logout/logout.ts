import { logout } from '../../clients/logout';
import { removeCurrentUser } from '../session/user';
import { purgeLocalUserData } from '../session/cleanup';
import { clearPermissions } from '../../store/slices/permissionsSlice';
import { stopPermissionsPolling } from '../../hooks/permissions/useInitializePermissions';
import store from '../../../../store';
import { AUTH_CONSTANTS, AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants';
import { APP_ROUTES } from '../../../../constants';
import logger from '../../../../logging';

export interface LogoutMessageApi {
  success: (content: string) => void;
  error: (content: string) => void;
}

// Only auth can clear the HttpOnly cookie, so nothing local is cleared (or broadcast to other tabs) until it
// answers: a failed logout keeps this browser signed in. Resolves whether it signed out.
export const handleUserLogout = async (
  navigate: (path: string) => void,
  message: LogoutMessageApi,
): Promise<boolean> => {
  try {
    await logout();
  } catch (error: unknown) {
    logger.warn(AUTH_CONSTANTS.LOGOUT.LOGS.SERVER_ERROR, { error });
    message.error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
    return false;
  }
  stopPermissionsPolling();
  removeCurrentUser();
  store.dispatch(clearPermissions());
  try {
    await purgeLocalUserData();
  } catch (error: unknown) {
    logger.warn(AUTH_CONSTANTS.LOGOUT.LOGS.PURGE_ERROR, { error });
  }
  message.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  navigate(APP_ROUTES.LOGIN);
  return true;
};
