export type PlanPhase =
  'active' | 'scheduled' | 'failed' | 'terminated' | 'canceled' | 'draft' | 'pending_approval';
export type ScopeType = 'applications' | 'namespaces';
export type PlanMode = 'audit' | 'enforce';
export type PlanTimeMode = 'permanent' | 'time_range';
export type PlanHealth = 'unknown' | 'healthy' | 'drifted' | 'degraded';
export type PlanViewMode = 'plans' | 'environments' | 'tags';
export type ViolationResult = 'pass' | 'fail' | 'warn' | 'error' | 'skip';
export type PlanReportFormat = 'html' | 'md' | 'json' | 'csv';
export type PlanReportTrigger = 'end' | 'cancel' | 'manual';
export type PlansPageTab = 'plans' | 'reports';
export type PlanApprovalMode = 'automatic' | 'required';
export type PlanApprovalState = 'pending' | 'approved' | 'rejected';
export type PlanApprovalDecision = 'approved' | 'rejected';

export interface PlanApprovalEvent {
  event: string;
  by: string;
  at: string;
  comment?: string;
}

export interface PlanApproval {
  state: PlanApprovalState;
  requestedBy: string;
  requestedAt: string;
  decidedBy?: string;
  decidedAt?: string;
  comment?: string;
  history?: PlanApprovalEvent[];
}

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
  retentionWindow: string;
  violations: PlanViolation[];
}

export interface PlanReportMeta {
  id: string;
  planId: string;
  trigger: PlanReportTrigger;
  generatedAt: string;
  generatedBy: string;
  violationsTotal: number;
  truncated: boolean;
}

export interface PlanExcludedResource {
  kind: string;
  name: string;
  namespace: string;
}

export interface PlanScopeExclusions {
  kinds: string[];
  resources: PlanExcludedResource[];
}

export interface PlanScope {
  type: ScopeType;
  applicationIds: string[];
  namespaces: string[];
  exclusions?: PlanScopeExclusions;
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
  environmentID?: string;
  tagIDs?: string[];
  health?: PlanHealth;
  healthCheckedAt?: string;
  healthDetail?: PlanHealthDetail[];
  approvalMode?: PlanApprovalMode;
  approval?: PlanApproval;
}

export type ParamType = 'string-array';

export interface ParamSpec {
  key: string;
  label: string;
  type: ParamType;
  required: boolean;
  placeholder?: string;
  description?: string;
  // Regex the backend enforces on every entry of a required param.
  pattern?: string;
}

export interface PlanTemplate {
  id: string;
  name: string;
  description: string;
  supportedScopes: ScopeType[];
  params: ParamSpec[];
}

export type PlanPhaseQuickFilter = PlanPhase | 'all';

export interface ProtectionPlansState {
  plans: ProtectionPlan[];
  templates: PlanTemplate[];
  loading: boolean;
  templatesLoading: boolean;
  error: string | null;
  details: ProtectionPlan | null;
  detailsLoading: boolean;
  detailsError: string | null;
  phaseQuickFilter: PlanPhaseQuickFilter;
  appliedFilters: Record<string, unknown>;
}
