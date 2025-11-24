import { Client, configuratorApiClient } from '../../../api';
import logger from '../../../logging';
import { Endpoints, HTTP_HEADERS, HEADER_VALUES } from '../../../constants';
import { INSIGHTS_CONSTANTS } from '../constants';
import type { StandardApiResponse } from '../../../interfaces/http';

export const startClusterAnalyze = async () => {
  try {
    const { path, method } = Endpoints.ANALYZE.START;
    return await Client<StandardApiResponse>(configuratorApiClient, path, {
      method,
      headers: { [HTTP_HEADERS.CUSTOM.SILENT_NETWORK]: HEADER_VALUES.SILENT_NETWORK },
    });
  } catch (error) {
    logger.error(INSIGHTS_CONSTANTS.ERROR.START_CLUSTER_ANALYSIS_FAILED, error);
    throw error;
  }
};
