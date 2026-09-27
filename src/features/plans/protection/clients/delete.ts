import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ApiResponse } from './shared';

export const deletePlan = async (planId: string): Promise<void> => {
  await Client<ApiResponse<null>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.CLEAR(planId).path,
    {
      method: 'DELETE',
    },
  );
};
