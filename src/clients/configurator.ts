import { Client, configuratorApiClient } from '../api';
import logger from '../logging';
import {
  Endpoints,
  HTTP_HEADERS,
  HEADER_VALUES,
  ERROR_MESSAGES,
  MAINTENANCE_ACTIONS,
} from '../constants';
import type { MaintenanceModeResponse, StandardApiResponse } from '../interfaces/api';

export const enableGrouperMaintenanceMode = async (
  grouperName: string,
  resourceType: string,
  updateAction: boolean,
  deleteAction: boolean,
) => {
  try {
    const { path, method } = Endpoints.GROUPER_MAINTENANCE.ENABLE;
    return await Client<MaintenanceModeResponse>(configuratorApiClient, path, {
      method: method,
      data: {
        name: grouperName,
        type: resourceType,
        update: updateAction ? MAINTENANCE_ACTIONS.ALLOW : MAINTENANCE_ACTIONS.DENY,
        delete: deleteAction ? MAINTENANCE_ACTIONS.ALLOW : MAINTENANCE_ACTIONS.DENY,
      },
    });
  } catch (error) {
    logger.error(
      `${ERROR_MESSAGES.CLIENT.ENABLE_MAINTENANCE_MODE_FAILED} "${grouperName}":`,
      error,
    );
    throw error;
  }
};

export const updateGrouperMaintenanceMode = async (
  grouperName: string,
  updateAction: boolean,
  deleteAction: boolean,
) => {
  try {
    const { path, method } = Endpoints.GROUPER_MAINTENANCE.UPDATE;
    return await Client<MaintenanceModeResponse>(configuratorApiClient, path, {
      method: method,
      data: {
        name: grouperName,
        spec: {
          update: updateAction ? MAINTENANCE_ACTIONS.ALLOW : MAINTENANCE_ACTIONS.DENY,
          delete: deleteAction ? MAINTENANCE_ACTIONS.ALLOW : MAINTENANCE_ACTIONS.DENY,
        },
      },
    });
  } catch (error) {
    logger.error(
      `${ERROR_MESSAGES.CLIENT.UPDATE_MAINTENANCE_MODE_FAILED} "${grouperName}":`,
      error,
    );
    throw error;
  }
};

export const removeGrouperMaintenanceMode = async (grouperName: string) => {
  try {
    const { path, method } = Endpoints.GROUPER_MAINTENANCE.REMOVE;
    return await Client<MaintenanceModeResponse>(configuratorApiClient, path, {
      method: method,
      data: {
        name: grouperName,
      },
    });
  } catch (error) {
    logger.error(
      `${ERROR_MESSAGES.CLIENT.REMOVE_MAINTENANCE_MODE_FAILED} "${grouperName}":`,
      error,
    );
    throw error;
  }
};

export const startClusterAnalyze = async () => {
  try {
    const { path, method } = Endpoints.ANALYZE.START;
    return await Client<StandardApiResponse>(configuratorApiClient, path, {
      method,
      headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
    });
  } catch (error) {
    logger.error(ERROR_MESSAGES.CLIENT.START_CLUSTER_ANALYSIS_FAILED, error);
    throw error;
  }
};
