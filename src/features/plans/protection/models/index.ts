export type PlanPhase = 'active' | 'scheduled' | 'failed' | 'terminated' | 'cancelled' | 'draft';
export type ScopeType = 'applications' | 'namespaces';
export type PlanMode = 'audit' | 'enforce';
export type PlanTimeMode = 'permanent' | 'time_range';

export interface PlanScope {
  type: ScopeType;
  applicationIds: string[];
  namespaces: string[];
}

export interface PlanPolicy {
  templateID: string;
  params: Record<string, string[]>;
}

export interface PlanTimeRange {
  startAt: string;
  endAt: string;
}

export interface ProtectionPlan {
  id: string;
  name: string;
  description?: string;
  severity?: string;
  priority?: number;
  scope: PlanScope;
  policies: PlanPolicy[];
  mode: PlanMode;
  timeMode: PlanTimeMode;
  timeRange?: PlanTimeRange;
  phase: PlanPhase;
  reason?: string;
  renderedPolicies?: string[];
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  startedAt?: string;
  startedBy?: string;
  terminatedAt?: string;
  terminatedBy?: string;
  participantsIDs?: string[];
}

export type ParamType = 'string-array';

export interface ParamSpec {
  key: string;
  label: string;
  type: ParamType;
  required: boolean;
  placeholder?: string;
  description?: string;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  supportedScopes: ScopeType[];
  params: ParamSpec[];
}

export interface ProtectionPlansState {
  plans: ProtectionPlan[];
  templates: PlanTemplate[];
  loading: boolean;
  templatesLoading: boolean;
  error: string | null;
}
