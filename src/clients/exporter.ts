import { Client, exporterApiClient } from '../api/index';
import {
  Endpoints,
  HTTP_HEADERS,
  HEADER_VALUES,
  ERROR_MESSAGES,
  HTTP_STATUS,
  ERROR_CODES,
  API_RESPONSES,
} from '../constants';
import type {
  ResourceListResponse,
  ResourceDetailsResponse,
  MaintenanceModeResponse,
  ClusterInsightsResponse,
  StandardApiResponse,
} from '../interfaces/api';
import type { AppWorkload } from '../interfaces/workload';
import type { User } from '../interfaces/users';
import type { AxiosError } from 'axios';

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
      console.error(ERROR_MESSAGES.CLIENT.FETCH_GROUPERS_FAILED, error);
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
    console.error(`${ERROR_MESSAGES.CLIENT.FETCH_GROUPER_DETAILS_FAILED} "${name}":`, error);
    throw error;
  }
};

export const updateGrouperSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.GROUPERS.UPDATE_SYNC(name);
    return await Client<StandardApiResponse>(exporterApiClient, path, {
      method: method,
      data: { spec: { config: { sync: { mode: syncMode } } } },
    });
  } catch (error) {
    console.error(`${ERROR_MESSAGES.CLIENT.UPDATE_SYNC_MODE_FAILED} "${name}":`, error);
    throw error;
  }
};

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
    console.error(`${ERROR_MESSAGES.CLIENT.FETCH_MAINTENANCE_MODE_FAILED} "${name}":`, error);
    throw error;
  }
};

export const checkClusterInsights = async () => {
  try {
    const resp = await exporterApiClient.request({
      url: Endpoints.INSIGHTS.CLUSTER_GET.path,
      method: 'GET',
      headers: {
        [HTTP_HEADERS.CUSTOM.SILENT_404]: HEADER_VALUES.SILENT_404,
        [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK,
      },
      validateStatus: () => true,
    });
    if (resp.status === HTTP_STATUS.NOT_FOUND) {
      return { data: null, _status: HTTP_STATUS.NOT_FOUND } as ClusterInsightsResponse;
    }
    return { data: resp.data, _status: resp.status } as ClusterInsightsResponse;
  } catch (error: unknown) {
    const networkError = error as { code?: string };
    if (networkError?.code === ERROR_CODES.NETWORK) {
      return { data: null, _status: 0, ...API_RESPONSES.NETWORK_ERROR } as ClusterInsightsResponse;
    }
    throw error;
  }
};

export const fetchAllAppsWorkloads = async () => {
  try {
    return await Client<ResourceListResponse<AppWorkload>>(
      exporterApiClient,
      Endpoints.WORKLOADS.APPS.GET_ALL_APPS.path,
    );
  } catch (error) {
    console.error(ERROR_MESSAGES.CLIENT.FETCH_APPS_FAILED, error);
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
    console.error(`${ERROR_MESSAGES.CLIENT.FETCH_APP_DETAILS_FAILED} "${name}":`, error);
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
    console.error(`${ERROR_MESSAGES.CLIENT.UPDATE_SYNC_MODE_FAILED} "${name}":`, error);
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
    console.error(ERROR_MESSAGES.CLIENT.FETCH_BATCHES_FAILED, error);
    throw error;
  }
};

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
      console.error(ERROR_MESSAGES.CLIENT.FETCH_BRIDGES_FAILED, error);
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
    console.error(`${ERROR_MESSAGES.CLIENT.FETCH_BRIDGE_DETAILS_FAILED} "${name}":`, error);
    throw error;
  }
};

export const updateBridgeSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.BRIDGES.UPDATE_SYNC(name);
    return await Client<StandardApiResponse>(exporterApiClient, path, {
      method: method,
      data: { spec: { config: { sync: { mode: syncMode } } } },
    });
  } catch (error) {
    console.error(`${ERROR_MESSAGES.CLIENT.UPDATE_BRIDGE_SYNC_MODE_FAILED} "${name}":`, error);
    throw error;
  }
};

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
      console.error(ERROR_MESSAGES.CLIENT.FETCH_USERS_FAILED, error);
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
      console.error(ERROR_MESSAGES.CLIENT.FETCH_USERS_FAILED, error);
    }
    throw error;
  }
};
