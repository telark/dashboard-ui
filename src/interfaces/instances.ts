import type { AppWorkload } from './workload';

export interface InstanceTableRow {
  id: string;
  instanceName: string;
  status: string;
  cpu: string;
  memory: string;
  containersCount: number;
  containerNames: string;
  imageNames: string;
  imagePullPolicy: string;
}

export interface InstancesTableProps {
  workload: AppWorkload;
  onInstanceClick?: (instance: InstanceTableRow) => void;
}
