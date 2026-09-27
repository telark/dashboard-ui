import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export const reactivatePlan = async (planId: string): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.REACTIVATE(planId).path,
    {
      method: 'POST',
      data: {},
    },
  );
  return res.data;
};
