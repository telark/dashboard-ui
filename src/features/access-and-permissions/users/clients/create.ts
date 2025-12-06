import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { User, CreateUserFormValues } from '../models';
import { USER_ERROR_MESSAGES } from '../constants';

export const createUser = async (user: CreateUserFormValues) => {
  try {
    const userData = {
      username: user.username,
      fullname: user.fullname,
      email: user.email,
      roleID: user.roleID,
      groupID: user.groupID,
      avatar: user.avatar,
    };
    return await Client<ResourceDetailsResponse<User>>(
      exporterApiClient,
      Endpoints.USERS.CREATE.path,
      {
        method: Endpoints.USERS.CREATE.method,
        data: userData,
      },
    );
  } catch (error) {
    logger.error(USER_ERROR_MESSAGES.CLIENT.CREATE_USER_FAILED(user.fullname), error);
    throw error;
  }
};
