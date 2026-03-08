import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import { USER_ERROR_MESSAGES } from '../constants';

export const deleteUser = async (userId: string) => {
  try {
    return await Client(exporterApiClient, Endpoints.USERS.DELETE_BY_ID(userId).path, {
      method: Endpoints.USERS.DELETE_BY_ID(userId).method,
    });
  } catch (error) {
    logger.error(USER_ERROR_MESSAGES.CLIENT.DELETE_USER_FAILED(userId), error);
    throw error;
  }
};
