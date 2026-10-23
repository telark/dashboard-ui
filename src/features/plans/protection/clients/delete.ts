import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints, PROTECTION_PLAN_PATHS } from '../../../../constants';
import type { ApiResponse } from './shared';

// The option goes on the wire only when set: without it the plan's reports go with the plan.
export const deletePlan = async (planId: string, keepReports: boolean): Promise<void> => {
  const path = Endpoints.PROTECTION_PLANS.CLEAR(planId).path;
  const qs = new URLSearchParams({
    [PROTECTION_PLAN_PATHS.QUERY_KEEP_REPORTS]: String(keepReports),
  }).toString();
  await Client<ApiResponse<null>>(discoveryApiClient, keepReports ? `${path}?${qs}` : path, {
    method: 'DELETE',
  });
};
