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

export const fetchGroupers = async (silent = false) => {
  try {
    const config = silent ? {
      headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK }
    } : {};
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.GET_ALL.path, config);
  } catch (error) {
    if (!silent) {
      console.error(ERROR_MESSAGES.CLIENT.FETCH_GROUPERS_FAILED, error);
    }
    throw error;
  }
};

export const fetchGrouperDetails = async (name: string) => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.GROUPERS.GET_DETAILS(name).path);
  } catch (error) {
    console.error(`${ERROR_MESSAGES.CLIENT.FETCH_GROUPER_DETAILS_FAILED} "${name}":`, error);
    throw error;
  }
};

export const updateGrouperSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.GROUPERS.UPDATE_SYNC(name);
    return await Client<any>(exporterApiClient, path, {
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
    return await Client<any>(exporterApiClient, Endpoints.GROUPER_MAINTENANCE.CHECK(name).path, {
      // Mark this request so 404 can be handled gracefully without noisy logs
      headers: { [HTTP_HEADERS.CUSTOM.SILENT_404]: HEADER_VALUES.SILENT_404 },
    });
  } catch (error) {
    // If maintenance feature is not found, treat as no maintenance (null), not an error
    const axiosErr = error as any;
    const status = axiosErr?.response?.status ?? axiosErr?.normalized?.status;
    if (status === HTTP_STATUS.NOT_FOUND) {
      return { data: null } as any;
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
      return { data: null, _status: HTTP_STATUS.NOT_FOUND } as any;
    }
    return { data: resp.data, _status: resp.status } as any;
  } catch (error: any) {
    if (error?.code === ERROR_CODES.NETWORK) {
      return { ...API_RESPONSES.NETWORK_ERROR, _status: 0 } as any;
    }
    throw error;
  }
};


export const fetchAllAppsWorkloads = async () => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.WORKLOADS.APPS.GET_ALL_APPS.path);
  } catch (error) {
    console.error('Failed to fetch apps workloads:', error);
    throw error;
  }
};

export const fetchAppWorkloadDetails = async (name: string) => {
  try {
    return await Client<any>(exporterApiClient, Endpoints.WORKLOADS.APPS.GET_APP_DETAILS(name).path);
  } catch (error) {
    console.error('Failed to fetch apps workloads:', error);
    throw error;
  }
};

export const updateAppWorkloadSyncMode = async (name: string, syncMode: string) => {
  try {
    const { path, method } = Endpoints.WORKLOADS.APPS.UPDATE_APP_SYNC(name);
    return await Client<any>(exporterApiClient, path, {
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
    return await Client<any>(exporterApiClient, Endpoints.WORKLOADS.BATCHES.GET_ALL_BATCHES.path);
  } catch (error) {
    console.error('Failed to fetch batches workloads:', error);
    throw error;
  }
};
