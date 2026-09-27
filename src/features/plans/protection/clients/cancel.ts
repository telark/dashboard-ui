import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export const cancelPlan = async (planId: string, reason?: string): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.CANCEL(planId).path,
    {
      method: 'POST',
      data: { reason: reason ?? '' },
    },
  );
  return res.data;
};
