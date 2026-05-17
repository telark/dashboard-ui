import { Client, authApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import { USER_ERROR_MESSAGES } from '../constants';

export const deleteUser = async (userId: string) => {
  if (!userId) {
    const err = new Error(USER_ERROR_MESSAGES.CLIENT.DELETE_USER_MISSING_ID);
    logger.error(USER_ERROR_MESSAGES.CLIENT.DELETE_USER_MISSING_ID);
    throw err;
  }
  try {
    const endpoint = Endpoints.USERS.CLEANUP(userId);
    return await Client(authApiClient, endpoint.path, { method: endpoint.method });
  } catch (error) {
    logger.error(USER_ERROR_MESSAGES.CLIENT.DELETE_USER_FAILED(userId), error);
    throw error;
  }
};
