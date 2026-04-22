import { message } from 'antd';
import { logout } from '../../clients/logout';
import { removeSessionToken } from '../session/token';
import { clearPermissions } from '../../store/slices/permissionsSlice';
import store from '../../../../store';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants';
import { APP_ROUTES } from '../../../../constants';

export const handleUserLogout = async (navigate: (path: string) => void): Promise<void> => {
  try {
    await logout();
    try {
      removeSessionToken();
    } catch {
      // Ignore session removal errors during successful logout
    }
    store.dispatch(clearPermissions());
    message.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    navigate(APP_ROUTES.LOGIN);
  } catch {
    try {
      removeSessionToken();
    } catch {
      // Even if session removal fails, proceed with logout
    }
    store.dispatch(clearPermissions());
    message.error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
    navigate(APP_ROUTES.LOGIN);
  }
};
