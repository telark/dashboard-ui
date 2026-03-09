import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { User } from '../models';
import { USER_ERROR_MESSAGES } from '../constants';

export const updateUser = async (userId: string, user: Partial<User>) => {
  try {
    const userData: Partial<User> = {};

    if (user.username !== undefined) userData.username = user.username;
    if (user.fullname !== undefined) userData.fullname = user.fullname;
    if (user.email !== undefined) userData.email = user.email;
    if (user.avatar !== undefined) userData.avatar = user.avatar;
    if (user.assignedRolesIDs !== undefined) {
      userData.assignedRolesIDs = Array.isArray(user.assignedRolesIDs)
        ? user.assignedRolesIDs
        : [];
    }
    if (user.assignedGroupsIDs !== undefined) {
      userData.assignedGroupsIDs = Array.isArray(user.assignedGroupsIDs)
        ? user.assignedGroupsIDs
        : [];
    }

    return await Client<ResourceDetailsResponse<User>>(
      exporterApiClient,
      Endpoints.USERS.PATCH_BY_ID(userId).path,
      {
        method: Endpoints.USERS.PATCH_BY_ID(userId).method,
        data: userData,
      },
    );
  } catch (error) {
    logger.error(USER_ERROR_MESSAGES.CLIENT.UPDATE_USER_FAILED(userId), error);
    throw error;
  }
};
