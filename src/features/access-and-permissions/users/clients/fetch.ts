import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { ResourceListResponse, ResourceDetailsResponse } from '../../../../interfaces/http';
import type { User } from '../models';
import { USER_ERROR_MESSAGES } from '../constants';

export const fetchUsers = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceListResponse<User>>(
      exporterApiClient,
      Endpoints.USERS.GET_ALL.path,
      config,
    );
  } catch (error) {
    if (!silent) {
      logger.error(USER_ERROR_MESSAGES.CLIENT.FETCH_USERS_FAILED, error);
    }
    throw error;
  }
};

export const fetchUserById = async (userId: string, silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceDetailsResponse<User>>(
      exporterApiClient,
      Endpoints.USERS.GET_BY_ID(userId).path,
      config,
    );
  } catch (error) {
    if (!silent) {
      logger.error(USER_ERROR_MESSAGES.CLIENT.FETCH_USER_DETAILS_FAILED, error);
    }
    throw error;
  }
};
