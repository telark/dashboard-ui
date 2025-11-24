import { fetchUserById } from '../clients';
import { USER_ERROR_MESSAGES } from '../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { getCurrentUser } from '../../../auth/utils';
import type { User as UsersUser } from '../models';

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
      logger.error(USER_ERROR_MESSAGES.LOGS.FETCH_USER_DETAILS_ERROR, error);
    }
    if (onError) {
      onError(error);
    }
  }
};
