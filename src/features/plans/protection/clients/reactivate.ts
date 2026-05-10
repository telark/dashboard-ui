import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import type { ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export const reactivatePlan = async (userId: string, planId: string): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.REACTIVATE(planId).path,
    {
      method: 'POST',
      data: {},
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
  return res.data;
};
