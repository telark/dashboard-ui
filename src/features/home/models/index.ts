import type { SnapshotStorageInfos } from '../../resources/applications/models';

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
  unknown: number;
  drifted: number;
}

export interface PlansSummary {
  total: number;
  active: number;
  drifted: number;
  degraded: number;
  failed: number;
}

export type SeverityKey = 'critical' | 'high' | 'medium' | 'low' | 'other';

export type PlanEventKey = 'created' | 'started' | 'terminated';

export interface ActivityEvent<K extends string> {
  at?: string;
  key: K;
}

// Long format, one row per day × series, as G2 stacks it.
export interface ActivityDatum {
  date: Date;
  series: string;
  count: number;
}

export interface ColorScale {
  domain: string[];
  range: string[];
}

export interface ActivityChartData {
  data: ActivityDatum[];
  colors: ColorScale;
}

export interface ClusterVersionInfo {
  version: string;
  distribution: string;
  full: string;
}

export interface DashboardAccess {
  canViewApplications: boolean;
  canViewPlans: boolean;
  canViewSnapshots: boolean;
}
