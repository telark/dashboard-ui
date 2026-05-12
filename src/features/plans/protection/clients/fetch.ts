import { Client, exporterApiClient, discoveryApiClient } from '../../../../api/index';
import { Endpoints } from '../../../../constants';
import type {
  ProtectionPlan,
  PlanTemplate,
  PlanStatusResponse,
  PlanViolationsResponse,
  ViolationResult,
} from '../models';
import type { ApiResponse } from './shared';

interface ListPlansData {
  items: ProtectionPlan[];
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

export const fetchPlanStatus = async (planId: string): Promise<PlanStatusResponse> => {
  const res = await Client<ApiResponse<PlanStatusResponse>>(
    discoveryApiClient,
    Endpoints.PROTECTION_PLANS.STATUS(planId).path,
  );
  return res.data;
};

interface ViolationsQuery {
  limit?: number;
  result?: ViolationResult;
}

const VIOLATIONS_REQUEST_TIMEOUT_MS = 10_000;

export const fetchPlanViolations = async (
  planId: string,
  query?: ViolationsQuery,
): Promise<PlanViolationsResponse> => {
  const params = new URLSearchParams();
  if (query?.limit) params.set('limit', String(query.limit));
  if (query?.result) params.set('result', query.result);
  const qs = params.toString();
  const path = Endpoints.PROTECTION_PLANS.VIOLATIONS(planId).path + (qs ? `?${qs}` : '');
  const res = await Client<ApiResponse<PlanViolationsResponse>>(discoveryApiClient, path, {
    method: 'GET',
    timeout: VIOLATIONS_REQUEST_TIMEOUT_MS,
  });
  return res.data;
};
