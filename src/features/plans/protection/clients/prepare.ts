import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type { PlanApprovalMode, PlanScopeExclusions, ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export interface PreparePlanPayload {
  name: string;
  description?: string;
  severity?: string;
  priority?: number;
  scope: {
    type: string;
    applicationIds: string[];
    namespaces: string[];
    exclusions: PlanScopeExclusions;
  };
  policies: { templateID: string; params: Record<string, string[]> }[];
  mode: string;
  timeMode: string;
  timeRange?: { startAt: string; endAt: string };
  participantsIDs?: string[];
  environmentID?: string;
  tagIDs?: string[];
  approvalMode?: PlanApprovalMode;
}

export const preparePlan = async (payload: PreparePlanPayload): Promise<ProtectionPlan> => {
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
