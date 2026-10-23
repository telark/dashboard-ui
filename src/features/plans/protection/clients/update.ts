import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ProtectionPlan } from '../models';
import type { ApiResponse, PlanPayload } from './shared';

export const updatePlan = async (planId: string, payload: PlanPayload): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.UPDATE(planId).path,
    {
      method: 'POST',
      data: payload,
    },
  );
  return res.data;
};
