import type { PlanApprovalMode, PlanRepeat, PlanScopeExclusions } from '../models';

export interface ApiResponse<T> {
  status: string;
  operation: string;
  message?: string;
  data: T;
}

export interface PlanPayload {
  name: string;
  description?: string;
  severity?: string;
  priority?: number;
  scope: {
    type: string;
    applicationRefs: string[];
    namespaces: string[];
    exclusions: PlanScopeExclusions;
  };
  policies: { templateID: string; params: Record<string, string[]> }[];
  mode: string;
  timeMode: string;
  timeRange?: { startAt: string; endAt: string };
  repeat?: PlanRepeat;
  participantRefs?: string[];
  kindRef?: string;
  environmentRef?: string;
  tagRefs?: string[];
  approvalMode?: PlanApprovalMode;
}
