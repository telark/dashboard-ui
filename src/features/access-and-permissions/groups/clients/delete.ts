import { Client, authApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { StandardApiResponse } from '../../../../interfaces/http';
import { GROUPS_ERROR_MESSAGES } from '../constants';

export const deleteGroup = async (groupId: string) => {
  if (!groupId) {
    const err = new Error(GROUPS_ERROR_MESSAGES.CLIENT.DELETE_GROUP_MISSING_ID);
    logger.error(GROUPS_ERROR_MESSAGES.CLIENT.DELETE_GROUP_MISSING_ID);
    throw err;
  }
  try {
    const endpoint = Endpoints.GROUPS.CLEANUP(groupId);
    return await Client<StandardApiResponse>(authApiClient, endpoint.path, {
      method: endpoint.method,
    });
  } catch (error) {
    logger.error(GROUPS_ERROR_MESSAGES.CLIENT.DELETE_GROUP_FAILED(groupId), error);
    throw error;
  }
};
