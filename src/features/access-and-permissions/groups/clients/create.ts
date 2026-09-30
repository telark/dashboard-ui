import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Group, GroupFormData } from '../models';
import { GROUPS_ERROR_MESSAGES } from '../constants';

export const createGroup = async (group: GroupFormData) => {
  try {
    const groupData: GroupFormData = {
      name: group.name,
      description: group.description,
      categoryRef: group.categoryRef,
      userRefs: Array.isArray(group.userRefs) ? group.userRefs : [],
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
