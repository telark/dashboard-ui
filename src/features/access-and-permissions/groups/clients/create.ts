import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Group } from '../models';
import { GROUPS_ERROR_MESSAGES } from '../constants';

export const createGroup = async (group: Omit<Group, 'id' | 'creationDate'>) => {
  try {
    const groupData = {
      name: group.name,
      description: group.description,
      categoryID: group.categoryID,
    };
    return await Client<ResourceDetailsResponse<Group>>(
      exporterApiClient,
      Endpoints.GROUPS.CREATE.path,
      {
        method: Endpoints.GROUPS.CREATE.method,
        data: groupData,
      },
    );
  } catch (error) {
    logger.error(GROUPS_ERROR_MESSAGES.CLIENT.CREATE_GROUP_FAILED(group.name), error);
    throw error;
  }
};
