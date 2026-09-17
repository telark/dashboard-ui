import { Client, discoveryApiClient } from '../../../../api';
import { Endpoints } from '../../../../constants';
import type { ResourceDetailsResponse } from '../../../../interfaces/http';
import type { DiscoveryCycleStatus } from '../models';

export const fetchDiscoveryStatus = async () => {
  const { path, method } = Endpoints.APPLICATIONS.DISCOVERY_STATUS;
  return Client<ResourceDetailsResponse<DiscoveryCycleStatus>>(discoveryApiClient, path, {
    method,
  });
};
