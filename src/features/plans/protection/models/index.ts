import type { SnapshotStorageMetric } from '../../../applications/models';

export type PlanPhase =
  'active' | 'scheduled' | 'failed' | 'terminated' | 'canceled' | 'draft' | 'pending_approval';
export type ScopeType = 'applications' | 'namespaces';
export type PlanMode = 'audit' | 'enforce';
export type PlanTimeMode = 'permanent' | 'time_range' | 'repeating';
export type PlanHealth = 'unknown' | 'healthy' | 'drifted' | 'degraded';
export type PlanViewMode = 'plans' | 'kinds' | 'environments' | 'tags';
export type ViolationResult = 'pass' | 'fail' | 'warn' | 'error' | 'skip';
export type PlanReportFormat = 'html' | 'md' | 'json' | 'csv';
export type PlanReportTrigger = 'end' | 'cancel' | 'manual' | 'window';
export type PlanRepeatDay = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
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
  // The Kubernetes username of the admission request; absent on Events from before 0.2.0.
  requestedBy?: string;
}

export interface PlanViolationsResponse {
  planId: string;
  total: number;
  retentionWindow: string;
  violations: PlanViolation[];
  // Only on the run list once the plan has started: the run's start (a repeating plan's window).
  since?: string;
  // The run ledger dropped its oldest rows at its cap.
  truncated?: boolean;
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

// A deleted plan's reports that its delete kept; planName is empty when the server lost it.
export interface KeptPlanReports {
  planId: string;
  planName: string;
  reports: PlanReportMeta[];
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
  applicationRefs: string[];
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

// Weekly windows on the wall clock of timeZone (HH:MM, 24-hour); an end before the start ends the next day.
export interface PlanRepeat {
  days: PlanRepeatDay[];
  startTime: string;
  endTime: string;
  timeZone: string;
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
  repeat?: PlanRepeat;
  // The open window (phase active) or the next one, computed by the server: read it through liveWindow.
  window?: PlanTimeRange;
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
  participantRefs?: string[];
  kindRef?: string;
  environmentRef?: string;
  tagRefs?: string[];
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
  code: string;
  name: string;
  description: string;
  supportedScopes: ScopeType[];
  params: ParamSpec[];
}

export type PlanPhaseQuickFilter = PlanPhase | 'all';

// What Create leads to: waiting for an approver, a later start, or auditing or enforcing at once.
export type CreateOutcome = 'approval' | 'schedule' | 'audit' | 'enforce';

export interface ProtectionPlansState {
  plans: ProtectionPlan[];
  templates: PlanTemplate[];
  loading: boolean;
  // Set once the list has arrived: `loading` is false both before the first fetch and after it.
  loaded: boolean;
  templatesLoading: boolean;
  error: string | null;
  details: ProtectionPlan | null;
  detailsLoading: boolean;
  detailsError: string | null;
  phaseQuickFilter: PlanPhaseQuickFilter;
  appliedFilters: Record<string, unknown>;
}

export interface ReportStorageInfos {
  totalPVCSpace: SnapshotStorageMetric;
  consumedSpace: SnapshotStorageMetric;
  availableSpace: SnapshotStorageMetric;
  totalReports: number;
}
