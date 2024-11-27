export interface GrouperInterface {
  name: string;
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
  