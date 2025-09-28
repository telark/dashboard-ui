import type { ReactNode } from 'react';
export interface GrouperState {
  groupers: any[];
  details: any | null;
  loading: boolean;
  error: string | null;
  syncing?: Record<string, boolean>;
}

export interface GrouperInterface {
  name: string;
  maintenance: Maintenance | null;
  status: 'Active' | 'Inactive';
  numberOfWorkloads: number;
  numberOfBridges: number;
  creationTime: string;
  lastUpdateTime: string;
  history: unknown[];
  workloads: unknown[];
  bridges: unknown[];
  sync: unknown | null;
  hasMaintenance?: boolean;
  syncName?: string; // API-facing name (fasid.name)
}

export interface Maintenance {
  name: string;
  status: string;
  deleteAction: string;
  updateAction: string;
}
