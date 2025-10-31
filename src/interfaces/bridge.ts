export interface BridgeState {
  bridges: any[];
  details: any | null;
  loading: boolean;
  error: string | null;
  syncing?: Record<string, boolean>;
}

export interface BridgeInterface {
  name: string;
  status: 'Active' | 'Inactive';
  type: string;
  grouper: string;
  sourceName: string;
  sourceType: string;
  creationTime: string;
  lastUpdateTime: string;
  history: unknown[];
  ports: Port[];
  selectors: Selector[];
  workloads: Workload[];
  sync: unknown | null;
  syncName?: string; // API-facing name (fasid.name)
}

export interface Port {
  source: number;
  target: number;
}

export interface Selector {
  key: string;
  value: string;
}

export interface Workload {
  name: string;
  type: string;
  isSameGrouper: boolean;
  matchedLabels: Selector[];
}

