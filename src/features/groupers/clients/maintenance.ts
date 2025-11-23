import { Client, exporterApiClient, configuratorApiClient } from '../../../api/index';
import logger from '../../../logging';
import {
  Endpoints,
  HTTP_HEADERS,
  HEADER_VALUES,
  ERROR_MESSAGES,
  HTTP_STATUS,
  MAINTENANCE_ACTIONS,
} from '../../../constants';
import type { MaintenanceModeResponse } from '../../../interfaces/http';
import type { AxiosError } from 'axios';

export const checkGrouperMaintenanceMode = async (name: string) => {
  try {
    return await Client<MaintenanceModeResponse>(
      exporterApiClient,
      Endpoints.GROUPER_MAINTENANCE.CHECK(name).path,
      {
        headers: { [HTTP_HEADERS.CUSTOM.SILENT_404]: HEADER_VALUES.SILENT_404 },
      },
    );
  } catch (error) {
    const axiosErr = error as AxiosError & { normalized?: { status?: number } };
    const status = axiosErr?.response?.status ?? axiosErr?.normalized?.status;
    if (status === HTTP_STATUS.NOT_FOUND) {
      return { status: HTTP_STATUS.NOT_FOUND, message: '', data: null } as MaintenanceModeResponse;
    }
    logger.error(`${ERROR_MESSAGES.CLIENT.FETCH_MAINTENANCE_MODE_FAILED} "${name}":`, error);
    throw error;
  }
};

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

