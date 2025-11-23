import { fetchUserById } from '../../clients/exporter';
import { USER_CONSTANTS } from '../../constants/user/user';
import { isDevelopment } from '../helpers/env';
import logger from '../../logging';
import { getCurrentUser } from '../../features/auth/utils/session/user';
import type { User as UsersUser } from '../../interfaces/resources/users';

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
    if (isDevelopment()) {
      logger.error(USER_CONSTANTS.LOGS.FETCH_USER_DETAILS_ERROR, error);
    }
    if (onError) {
      onError(error);
    }
  }
};
