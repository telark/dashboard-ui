import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Group, GroupFormData } from '../models';
import { GROUPS_ERROR_MESSAGES } from '../constants';
import { getCurrentUser } from '../../../../features/auth/utils';

export const createGroup = async (group: GroupFormData) => {
  try {
    const currentUser = getCurrentUser();
    const groupData: GroupFormData = {
      name: group.name,
      description: group.description,
      categoryID: group.categoryID,
      assignedUsersIDs: group.assignedUsersIDs || [],
    };

    if (currentUser?.id) {
      groupData.createdBy = currentUser.id;
    }
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
