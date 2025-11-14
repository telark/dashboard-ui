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

export interface ResourcesActionBarProps {
  selectedCount: number;
  hasSelection: boolean;
  isSyncing?: boolean;
  onView: () => void;
  onSync: () => void;
  onDelete: () => void;
}

export interface BridgeFromStore {
  name: string;
  sourceName?: string;
  status?: string;
  creationTime?: string;
  lastUpdateTime?: string;
}

export interface WorkloadFromStore {
  name: string;
  sourceName?: string;
  status?: string;
  creationTime?: string;
  lastUpdate?: string;
}

