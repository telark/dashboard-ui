import type { Application, SnapshotStorageInfos } from '../../resources/applications/models';

export type TagTone = 'danger' | 'warning' | 'neutral';

export interface DashboardTagData {
  text: string;
  tone: TagTone;
}

export interface DashboardRowItem {
  key: string;
  dotColor: string;
  title: string;
  meta?: string;
  time?: string | null;
  tag?: DashboardTagData;
  to?: string;
}

export interface BreakdownItem {
  label: string;
  count: number;
  color: string;
}

export interface BoxState {
  loading?: boolean;
  failed?: boolean;
}

export interface SnapshotStorageState {
  infos: SnapshotStorageInfos | null;
  failed: boolean;
}

export interface ApplicationsSummary {
  total: number;
  healthy: number;
  degraded: number;
  down: number;
  drifted: number;
}

export interface PlansSummary {
  total: number;
  active: number;
  drifted: number;
  degraded: number;
  failed: number;
}

export type AttentionReason = 'down' | 'degraded' | 'syncFailed' | 'drift';

export interface ApplicationAttention {
  application: Application;
  reasons: AttentionReason[];
}

export interface DashboardAccess {
  canViewApplications: boolean;
  canViewPlans: boolean;
  canViewSnapshots: boolean;
}
