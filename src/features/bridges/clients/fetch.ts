import { Client, exporterApiClient } from '../../../api/index';
import logger from '../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES, ERROR_MESSAGES } from '../../../constants';
import type { ResourceListResponse, ResourceDetailsResponse } from '../../../interfaces/http';

export const fetchBridges = async (silent = false) => {
  try {
    const config = silent
      ? {
          headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
        }
      : {};
    return await Client<ResourceListResponse<unknown>>(
      exporterApiClient,
      Endpoints.BRIDGES.GET_ALL.path,
      config,
    );
  } catch (error) {
    if (!silent) {
      logger.error(ERROR_MESSAGES.CLIENT.FETCH_BRIDGES_FAILED, error);
    }
    throw error;
  }
};

export const fetchBridgeDetails = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<unknown>>(
      exporterApiClient,
      Endpoints.BRIDGES.GET_DETAILS(name).path,
    );
  } catch (error) {
    logger.error(`${ERROR_MESSAGES.CLIENT.FETCH_BRIDGE_DETAILS_FAILED} "${name}":`, error);
    throw error;
  }
};

export const updateBridgeSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.BRIDGES.UPDATE_SYNC(name);
    return await Client<ResourceDetailsResponse<unknown>>(exporterApiClient, path, { method });
  } catch (error) {
    logger.error(`${ERROR_MESSAGES.CLIENT.UPDATE_BRIDGE_SYNC_FAILED} "${name}":`, error);
    throw error;
  }
};

