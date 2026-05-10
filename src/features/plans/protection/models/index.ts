export type PlanPhase = 'active' | 'scheduled' | 'failed' | 'terminated' | 'canceled' | 'draft';
export type ScopeType = 'applications' | 'namespaces';
export type PlanMode = 'audit' | 'enforce';
export type PlanTimeMode = 'permanent' | 'time_range';
export type PlanHealth = 'unknown' | 'healthy' | 'drifted' | 'degraded';
export type ViolationResult = 'pass' | 'fail' | 'warn' | 'error' | 'skip';

export interface PlanHealthDetail {
  policyName: string;
  namespace: string;
  present: boolean;
  ready: boolean;
  failureAction: string;
}

export interface PlanPolicyStatus {
  name: string;
  namespace: string;
  present: boolean;
  ready: boolean;
  failureAction: string;
}

export interface PlanDrift {
  missing: string[];
  unexpected: string[];
}

export interface PlanStatusResponse {
  planId: string;
  phase: PlanPhase;
  health: PlanHealth;
  policies: PlanPolicyStatus[];
  drift: PlanDrift;
}

export interface PlanViolationResource {
  kind: string;
  name: string;
  namespace: string;
}

export interface PlanViolation {
  policy: string;
  rule: string;
  namespace: string;
  resource: PlanViolationResource;
  result: ViolationResult;
  message: string;
  timestamp: string;
}

export interface PlanViolationsResponse {
  planId: string;
  total: number;
  violations: PlanViolation[];
}

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
  health?: PlanHealth;
  healthCheckedAt?: string;
  healthDetail?: PlanHealthDetail[];
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
  details: ProtectionPlan | null;
  detailsLoading: boolean;
  detailsError: string | null;
}
