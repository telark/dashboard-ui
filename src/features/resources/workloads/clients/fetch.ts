import { Client, exporterApiClient } from '../../../../api/index';
import logger from '../../../../logging';
import { Endpoints, ERROR_MESSAGES } from '../../../../constants';
import { WORKLOAD_ERROR_MESSAGES } from '../constants';
import type {
  ResourceListResponse,
  ResourceDetailsResponse,
  StandardApiResponse,
} from '../../../../interfaces/http';
import type { AppWorkload } from '../models';

export const fetchAllAppsWorkloads = async () => {
  try {
    return await Client<ResourceListResponse<AppWorkload>>(
      exporterApiClient,
      Endpoints.WORKLOADS.APPS.GET_ALL_APPS.path,
    );
  } catch (error) {
    logger.error(WORKLOAD_ERROR_MESSAGES.CLIENT.FETCH_APPS_FAILED, error);
    throw error;
  }
};

export const fetchAppWorkloadDetails = async (name: string) => {
  try {
    return await Client<ResourceDetailsResponse<AppWorkload>>(
      exporterApiClient,
      Endpoints.WORKLOADS.APPS.GET_APP_DETAILS(name).path,
    );
  } catch (error) {
    logger.error(`${WORKLOAD_ERROR_MESSAGES.CLIENT.FETCH_APP_DETAILS_FAILED} "${name}":`, error);
    throw error;
  }
};

export const updateAppWorkloadSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.WORKLOADS.APPS.UPDATE_APP_SYNC(name);
    return await Client<StandardApiResponse>(exporterApiClient, path, {
      method: method,
      data: { spec: { config: { sync: { mode: syncMode } } } },
    });
  } catch (error) {
    logger.error(`${ERROR_MESSAGES.CLIENT.UPDATE_SYNC_MODE_FAILED} "${name}":`, error);
    throw error;
  }
};

export const fetchAllBatchesWorkloads = async () => {
  try {
    return await Client<ResourceListResponse<unknown>>(
      exporterApiClient,
      Endpoints.WORKLOADS.BATCHES.GET_ALL_BATCHES.path,
    );
  } catch (error) {
    logger.error(WORKLOAD_ERROR_MESSAGES.CLIENT.FETCH_BATCHES_FAILED, error);
    throw error;
  }
};
