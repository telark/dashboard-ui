import { message } from 'antd';
import { logout } from '../../clients/auth';
import { removeSessionToken } from '../auth/session';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import { APP_ROUTES } from '../../constants';

export const handleUserLogout = async (navigate: (path: string) => void): Promise<void> => {
  try {
    await logout();
    try {
      removeSessionToken();
    } catch {
      // Ignore session removal errors during successful logout
    }
    message.success(AUTH_SUCCESS_MESSAGES.LOGOUT_SUCCESS);
    navigate(APP_ROUTES.LOGIN);
  } catch (error) {
    try {
      removeSessionToken();
    } catch {
      // Even if session removal fails, proceed with logout
    }
    message.error(AUTH_ERROR_MESSAGES.LOGOUT_FAILED);
    navigate(APP_ROUTES.LOGIN);
  }
};
