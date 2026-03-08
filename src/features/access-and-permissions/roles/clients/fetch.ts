import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { ResourceListResponse, ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Role } from '../models';
import { ROLES_ERROR_MESSAGES } from '../constants';

export const fetchRoles = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceListResponse<Role>>(
      exporterApiClient,
      Endpoints.ROLES.GET_ALL.path,
      {
        ...config,
        method: Endpoints.ROLES.GET_ALL.method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(ROLES_ERROR_MESSAGES.CLIENT.FETCH_ROLES_FAILED, error);
    }
    throw error;
  }
};

export const fetchRoleById = async (roleId: string, silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceDetailsResponse<Role>>(
      exporterApiClient,
      Endpoints.ROLES.GET_BY_ID(roleId).path,
      {
        ...config,
        method: Endpoints.ROLES.GET_BY_ID(roleId).method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(ROLES_ERROR_MESSAGES.CLIENT.FETCH_ROLE_DETAILS_FAILED(roleId), error);
    }
    throw error;
  }
};
