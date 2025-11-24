import { exporterApiClient } from '../api/index';
import {
  Endpoints,
  HTTP_HEADERS,
  HEADER_VALUES,
  HTTP_STATUS,
  ERROR_CODES,
  API_RESPONSES,
} from '../constants';
import type { ClusterInsightsResponse } from '../interfaces/http';

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
