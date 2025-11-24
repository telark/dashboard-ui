import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../../constants';
import type { ResourceListResponse, ResourceDetailsResponse } from '../../../../interfaces/http';
import { GROUPER_ERROR_MESSAGES } from '../constants';

export const fetchGroupers = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceListResponse<unknown>>(
      exporterApiClient,
      Endpoints.GROUPERS.GET_ALL.path,
      config,
    );
  } catch (error) {
    if (!silent) {
      logger.error(GROUPER_ERROR_MESSAGES.CLIENT.FETCH_GROUPERS_FAILED, error);
    }
    throw error;
  }
};

export const fetchGrouperDetails = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<unknown>>(
      exporterApiClient,
      Endpoints.GROUPERS.GET_DETAILS(name).path,
    );
  } catch (error) {
    logger.error(`${GROUPER_ERROR_MESSAGES.CLIENT.FETCH_GROUPER_DETAILS_FAILED} "${name}":`, error);
    throw error;
  }
};
