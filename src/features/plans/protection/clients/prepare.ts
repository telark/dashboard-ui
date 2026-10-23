import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { ProtectionPlan } from '../models';
import type { ApiResponse, PlanPayload } from './shared';

export const preparePlan = async (payload: PlanPayload): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.PREPARE.path,
    {
      method: 'POST',
      data: payload,
    },
  );
  return res.data;
};
