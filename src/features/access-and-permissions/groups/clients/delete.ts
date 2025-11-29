import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { StandardApiResponse } from '../../../../interfaces/http';
import { GROUPS_ERROR_MESSAGES } from '../constants';

export const deleteGroup = async (groupId: string) => {
  try {
    return await Client<StandardApiResponse>(
      exporterApiClient,
      Endpoints.GROUPS.DELETE_BY_ID(groupId).path,
      {
        method: Endpoints.GROUPS.DELETE_BY_ID(groupId).method,
      },
    );
  } catch (error) {
    logger.error(GROUPS_ERROR_MESSAGES.CLIENT.DELETE_GROUP_FAILED(groupId), error);
    throw error;
  }
};
