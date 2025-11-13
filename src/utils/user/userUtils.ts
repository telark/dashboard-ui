import { message } from 'antd';
import { logout } from '../../clients/auth';
import { removeSessionToken } from '../auth/session';
import { getCurrentUser } from '../auth/user';
import { fetchUserById } from '../../clients/exporter';
import { AUTH_ERROR_MESSAGES, AUTH_SUCCESS_MESSAGES } from '../../constants/auth';
import { APP_ROUTES } from '../../constants';
import type { User as AuthUser } from '../../interfaces/auth';
import type { User as UsersUser } from '../../interfaces/users';

export const fetchCurrentUserDetails = async (
  onSuccess: (user: UsersUser) => void,
  onError?: (error: unknown) => void,
): Promise<void> => {
  try {
    const authUser = getCurrentUser();
    if (!authUser?.id) {
      return;
    }

    const response = await fetchUserById(authUser.id, true);
    if (response.data) {
      onSuccess(response.data);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch user details:', error);
    }
    if (onError) {
      onError(error);
    }
  }
};

export const handleUserLogout = async (
  navigate: (path: string) => void,
): Promise<void> => {
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

export const getAuthUser = (): AuthUser | null => {
  return getCurrentUser();
};

