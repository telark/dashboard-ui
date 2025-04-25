export interface GrouperState {
  groupers: any[];
  details: any | null;
  loading: boolean;
  error: string | null;
}

export interface GrouperInterface {
  name: string;
  maintenance: Maintenance | null;
  status: 'Active' | 'Inactive';
  numberOfWorkloads: number;
  numberOfBridges: number;
  creationTime: string;
  lastUpdateTime: string;
  history: any[];
  workloads: any[];
  bridges: any[];
  sync: any | null;
  icon: JSX.Element;
}

export interface Maintenance {
  name: string;
  status: string;
  deleteAction: string;
  updateAction: string;
}
  