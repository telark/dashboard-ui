import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Group, GroupFormData } from '../models';
import { GROUPS_ERROR_MESSAGES } from '../constants';
import { getCurrentUser } from '../../../../features/auth/utils';

export const updateGroup = async (groupId: string, group: Partial<GroupFormData>) => {
  try {
    const currentUser = getCurrentUser();
    const groupData: Partial<GroupFormData> = {};

    if (group.name !== undefined) groupData.name = group.name;
    if (group.description !== undefined) groupData.description = group.description;
    if (group.categoryID !== undefined) groupData.categoryID = group.categoryID;
    if (group.assignedUsersIDs !== undefined) {
      groupData.assignedUsersIDs = Array.isArray(group.assignedUsersIDs)
        ? group.assignedUsersIDs
        : [];
    }

    if (group.assignedRolesIDs !== undefined) {
      groupData.assignedRolesIDs = Array.isArray(group.assignedRolesIDs)
        ? group.assignedRolesIDs
        : [];
    }

    if (currentUser?.id) {
      groupData.lastUpdatedBy = currentUser.id;
    }

    return await Client<ResourceDetailsResponse<Group>>(
      exporterApiClient,
      Endpoints.GROUPS.PATCH_BY_ID(groupId).path,
      {
        method: Endpoints.GROUPS.PATCH_BY_ID(groupId).method,
        data: groupData,
      },
    );
  } catch (error) {
    logger.error(GROUPS_ERROR_MESSAGES.CLIENT.UPDATE_GROUP_FAILED(groupId), error);
    throw error;
  }
};
