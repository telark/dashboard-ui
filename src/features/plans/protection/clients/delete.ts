import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import type { ApiResponse } from './shared';

export const deletePlan = async (userId: string, planId: string): Promise<void> => {
  await Client<ApiResponse<null>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.CLEAR(planId).path,
    {
      method: 'DELETE',
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
};
