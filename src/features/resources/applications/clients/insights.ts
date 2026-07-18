import { Client, discoveryApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { ApplicationInsights } from '../models';

// Windowed read: the caller passes only the apps it is showing, keyed
// `namespace/name`. results holds whatever is enriched now; pending are still
// being produced and appear on a later poll.
export interface ApplicationInsightsRead {
  results: Record<string, ApplicationInsights>;
  pending: string[];
}

export const insightsAppKey = (namespace: string, name: string): string => `${namespace}/${name}`;

export const fetchApplicationInsights = async (
  appKeys: string[],
): Promise<ApplicationInsightsRead> => {
  const { path, method } = Endpoints.INSIGHTS.GET_APPLICATIONS;
  const res = await Client<ResourceDetailsResponse<ApplicationInsightsRead>>(
    discoveryApiClient,
    path,
    { method, params: { apps: appKeys.join(',') } },
  );
  return res.data;
};
