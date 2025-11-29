import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { ResourceListResponse, ResourceDetailsResponse } from '../../../../interfaces/http';
import type { Group } from '../models';
import { GROUPS_ERROR_MESSAGES } from '../constants';

export const fetchGroups = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceListResponse<Group>>(
      exporterApiClient,
      Endpoints.GROUPS.GET_ALL.path,
      {
        ...config,
        method: Endpoints.GROUPS.GET_ALL.method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(GROUPS_ERROR_MESSAGES.CLIENT.FETCH_GROUPS_FAILED, error);
    }
    throw error;
  }
};

export const fetchGroupById = async (groupId: string, silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceDetailsResponse<Group>>(
      exporterApiClient,
      Endpoints.GROUPS.GET_BY_ID(groupId).path,
      {
        ...config,
        method: Endpoints.GROUPS.GET_BY_ID(groupId).method,
      },
    );
  } catch (error) {
    if (!silent) {
      logger.error(GROUPS_ERROR_MESSAGES.CLIENT.FETCH_GROUP_DETAILS_FAILED(groupId), error);
    }
    throw error;
  }
};
