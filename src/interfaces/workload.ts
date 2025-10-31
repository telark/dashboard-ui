export interface Fasid {
  creationTime: string;
  grouper: string;
  name: string;
  sourceName: string;
  sourceType: string;
  type: string;
}

export interface Annotation {
  key: string;
  value: string;
}

export interface Label {
  key: string;
  value: string;
}

export interface Metadata {
  annotations: Annotation[];
  labels: {
    global: Label[];
    selector: Label[];
  };
}

export interface Instance {
  name: string;
  totalCpu: string;
  totalMemory: string;
  containers: ContainerUsage[];
}

export interface ContainerUsage {
  name: string;
  cpu: string;
  memory: string;
}

export interface Usage {
  available: boolean;
  qos: string;
  resources: {
    totalCpu: string;
    totalMemory: string;
    usagePerInstance: Instance[];
  };
  timestamp: string;
}

export interface Instances {
  total: number;
  available: number;
  names: string[];
  labels: Label[];
}

export interface Image {
  name: string;
  tag: string;
  pullPolicy: string;
  isCurrent: boolean;
}

export interface Container {
  name: string;
  order: number;
  subType: string;
  image: Image;
  ports: number[];
}

export interface InitContainer extends Container {
  resources: {
    qos: string;
    cpu: string;
    memory: string;
  };
}

export interface Crates {
  regular: Container[];
  init: InitContainer[];
}

export interface Bridge {
  name: string;
  type: string;
  isSameGrouper: boolean;
}

export interface Event {
  type: string;
  reason: string;
  message: string;
}

export interface EventInstance {
  instance: string;
  events: Event[];
}

export interface Cacid {
  status: string;
  metadata: Metadata;
  strategy: string;
  instances: Instances;
  crates: Crates;
  registry: string;
  bridges: Bridge[];
  bridgeAttachmentPolicy: string;
  events: EventInstance[];
  usage: Usage;
}

export interface HistoryRecord {
  name: string;
  status: string;
  creationTime: string;
}

export interface Sync {
  lastUpdateTime: string;
  mode: string;
}

export interface Config {
  history: HistoryRecord[];
  sync: Sync;
}

export interface AppWorkload {
  fasid: Fasid;
  cacid: Cacid;
  config: Config;
}

export interface AppsWorkloadsResponse {
  status: number;
  operation: string;
  message: string;
  data: {
    items: AppWorkload[];
  };
}

export interface AppWorkloadCardData {
  name: string;
  sourceName: string;
  grouper: string;
  status: string;
  instances: {
    total: number;
    available: number;
  };
  containers: number;
  bridges: number;
  lastUpdate: string;
  sourceType: string;
  registry: string;
  strategy: string;
  sync?: Sync;
}

export interface BatchWorkloadCardData {
  name: string;
  sourceName: string;
  grouper?: string;
  sourceType?: string;
  status: string;
  lastUpdate: string;
  instances?: {
    available: number;
    total: number;
  };
  containers?: number;
  bridges?: number;
}

export interface WorkloadsState {
  apps: AppWorkloadCardData[];
  batches: BatchWorkloadCardData[];
  appDetails: AppWorkload | null;
  batchDetails: AppWorkload | null; // TODO: Add batch workload interface
  appLoading: boolean;
  batchLoading: boolean;
  appError: string | null;
  batchError: string | null;
  syncing: Record<string, boolean>;
}
