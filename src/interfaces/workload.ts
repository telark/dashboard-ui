// Workload interfaces based on the CRD structure

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

export interface Workload {
  fasid: Fasid;
  cacid: Cacid;
  config: Config;
}

export interface WorkloadsResponse {
  status: number;
  operation: string;
  message: string;
  data: {
    items: Workload[];
  };
}

// Simplified interfaces for card display
export interface WorkloadCardData {
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
}
