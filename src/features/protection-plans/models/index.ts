export type ProtectionPlanLifecycle = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';

export type ProtectionPlanScopeType = 'namespace' | 'workload';

export type ProtectionPlanPolicyKey =
  | 'preventWorkloadUpdates'
  | 'preventResourceDeletion'
  | 'configurationFreeze'
  | 'versionRestriction'
  | 'rollbackPrevention';

export type ProtectionPlanParticipantRole = 'contributor' | 'reviewer' | 'approver';

export interface ProtectionPlanScopeNamespace {
  type: 'namespace';
  namespace: string;
  cluster?: string;
  workloadsCount?: number;
}

export interface ProtectionPlanScopeWorkload {
  type: 'workload';
  namespace: string;
  name: string;
  kind: 'Deployment' | 'StatefulSet' | 'DaemonSet' | 'Job' | 'CronJob' | 'Other';
  cluster?: string;
  workloadsCount?: number;
}

export type ProtectionPlanScope = ProtectionPlanScopeNamespace | ProtectionPlanScopeWorkload;

export interface ProtectionPlanPolicy {
  key: ProtectionPlanPolicyKey;
  enabled: boolean;
}

export interface ProtectionPlanParticipant {
  id: string;
  displayName: string;
  role: ProtectionPlanParticipantRole;
}

export type ProtectionPlanHistoryEventType =
  | 'created'
  | 'updated'
  | 'scope_updated'
  | 'policies_updated'
  | 'scheduled'
  | 'activated'
  | 'completed'
  | 'cancelled';

export interface ProtectionPlanHistoryEvent {
  id: string;
  timestamp: string;
  type: ProtectionPlanHistoryEventType;
  actor: string;
  summary: string;
}

export interface ProtectionPlanSchedule {
  startAt: string;
  endAt: string;
}

import type { ProtectionPlanLevel } from '../constants/protectionPlans';

export interface ProtectionPlan {
  id: string;
  name: string;
  description?: string;
  lifecycle: ProtectionPlanLifecycle;
  type: string;
  typeLabel: string;
  builtInType?: boolean;
  level?: ProtectionPlanLevel;
  ownerId?: string;
  scope: ProtectionPlanScope;
  policies: ProtectionPlanPolicy[];
  schedule: ProtectionPlanSchedule;
  createdAt: string;
  createdBy: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  participants: ProtectionPlanParticipant[];
  history: ProtectionPlanHistoryEvent[];
}

export interface ProtectionPlansState {
  items: ProtectionPlan[];
  loading: boolean;
  error: string | null;
}
