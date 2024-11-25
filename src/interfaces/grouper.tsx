export interface GrouperInterface {
    name: string;
    status: 'Active' | 'Inactive';
    numberOfWorkloads: number;
    numberOfBridges: number;
    creationTime: string;
    lastUpdateTime: string;
    icon: JSX.Element;
    namespace: string;
    history: any[];
    sync: any;
  }