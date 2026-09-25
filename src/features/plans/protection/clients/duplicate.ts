import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import type { PlanApprovalMode, ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export interface DuplicatePlanPayload {
  name?: string;
  timeMode?: string;
  timeRange?: { startAt: string; endAt: string };
  environmentID?: string;
  tagIDs?: string[];
  approvalMode?: PlanApprovalMode;
}

export const duplicatePlan = async (
  userId: string,
  planId: string,
  payload?: DuplicatePlanPayload,
): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.DUPLICATE(planId).path,
    {
      method: 'POST',
      data: payload ?? {},
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
  return res.data;
};
