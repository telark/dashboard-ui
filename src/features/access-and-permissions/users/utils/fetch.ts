import { fetchUserById } from '../clients';
import { USER_ERROR_MESSAGES } from '../constants';
import { isDevelopment } from '../../../../utils/helpers/env';
import logger from '../../../../logging';
import { getCurrentUser } from '../../../auth/utils';
import type { User as UsersUser } from '../models';

// Handles its own errors, so callers have no promise to await or catch.
export const fetchCurrentUserDetails = (
  onSuccess: (user: UsersUser) => void,
  onError?: (error: unknown) => void,
): void => {
  const authUser = getCurrentUser();
  if (!authUser?.id) {
    return;
  }

  fetchUserById(authUser.id, true)
    .then((response) => {
      if (response.data) {
        onSuccess(response.data);
      }
    })
    .catch((error: unknown) => {
      if (isDevelopment()) {
        logger.error(USER_ERROR_MESSAGES.LOGS.FETCH_USER_DETAILS_ERROR, error);
      }
      onError?.(error);
    });
};

export const fetchFreshUserIds = async (
  userId: string,
  field: 'roleRefs' | 'groupRefs',
): Promise<string[]> => (await fetchUserById(userId, true)).data?.[field] ?? [];
