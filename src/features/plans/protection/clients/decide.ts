import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { PlanApprovalDecision, ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export interface DecidePlanPayload {
  decision: PlanApprovalDecision;
  comment?: string;
  requestedAt: string;
}

export const decidePlan = async (
  planId: string,
  body: DecidePlanPayload,
): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.DECIDE(planId).path,
    {
      method: 'POST',
      data: body,
    },
  );
  return res.data;
};
