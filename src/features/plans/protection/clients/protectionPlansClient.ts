import { Client, exporterApiClient, discoveryApiClient } from '../../../../api/index';
import { Endpoints, HTTP_HEADERS } from '../../../../constants';
import type { ProtectionPlan, PlanTemplate } from '../models';

interface ApiResponse<T> {
  status: string;
  operation: string;
  message?: string;
  data: T;
}

interface ListPlansData {
  items: ProtectionPlan[];
}

interface PreparePlanPayload {
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
}

export const fetchProtectionPlans = async (): Promise<ProtectionPlan[]> => {
  const res = await Client<ApiResponse<ListPlansData>>(
    exporterApiClient,
    Endpoints.PROTECTION_PLANS.LIST.path,
  );
  return res.data?.items ?? [];
};

export const fetchProtectionPlanById = async (id: string): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    exporterApiClient,
    Endpoints.PROTECTION_PLANS.GET_BY_ID(id).path,
  );
  return res.data;
};

export const fetchProtectionPlanTemplates = async (): Promise<PlanTemplate[]> => {
  const res = await Client<ApiResponse<PlanTemplate[]>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.TEMPLATES.path,
  );
  return res.data ?? [];
};

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

export const cancelPlan = async (
  userId: string,
  planId: string,
  reason?: string,
): Promise<ProtectionPlan> => {
  const res = await Client<ApiResponse<ProtectionPlan>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.CANCEL(planId).path,
    {
      method: 'POST',
      data: { reason: reason ?? '' },
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
  return res.data;
};

export const deletePlan = async (userId: string, planId: string): Promise<void> => {
  await Client<ApiResponse<null>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.CLEAR(planId).path,
    {
      method: 'DELETE',
      headers: { [HTTP_HEADERS.CUSTOM.USER_ID]: userId },
    },
  );
};
