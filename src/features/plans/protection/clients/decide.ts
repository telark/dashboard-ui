import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import type { PlanApprovalDecision, ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export interface DecidePlanPayload {
  decision: PlanApprovalDecision;
  comment?: string;
  requestedAt: string;
}

export const decidePlan = async (
  userId: string,
  planId: string,
  body: DecidePlanPayload,
): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.DECIDE(planId).path,
    {
      method: 'POST',
      data: body,
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
  return res.data;
};
