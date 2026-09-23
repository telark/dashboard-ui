import { Client, discoveryApiClient } from '../../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import type { ProtectionPlan } from '../models';
import type { ApiResponse } from './shared';

export interface PreparePlanPayload {
  name: string;
  description?: string;
  severity?: string;
  priority?: number;
  scope: { type: string; applicationIds: string[]; namespaces: string[] };
  policies: { templateID: string; params: Record<string, string[]> }[];
  mode: string;
  timeMode: string;
  timeRange?: { startAt: string; endAt: string };
  participantsIDs?: string[];
  environmentID?: string;
  tagIDs?: string[];
}

export const preparePlan = async (
  userId: string,
  payload: PreparePlanPayload,
): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.PREPARE.path,
    {
      method: 'POST',
      data: payload,
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
  return res.data;
};
