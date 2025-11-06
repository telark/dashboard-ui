import type {
  AppWorkload,
  Container,
  Instance,
  ContainerUsage,
} from '../../../../../interfaces/workload';
import type { InstanceTableRow } from '../../../../../interfaces/instances';
import { INSTANCES_PAGE_CONSTANTS as IPC } from '../../../../../constants/pages/instances';

export type InstancesSortKey =
  | 'instanceName'
  | 'status'
  | 'cpu'
  | 'memory'
  | 'containers'
  | 'imageNames';

type Comparator<T> = (a: T, b: T) => number;
type SortOrder = 'asc' | 'desc';

const compareStrings = (a: string | undefined, b: string | undefined) =>
  String(a || '').localeCompare(String(b || ''));
const compareNumbers = (a: number, b: number) => a - b;

export const sortInstances = (
  instances: InstanceTableRow[],
  sortKey: InstancesSortKey,
  sortOrder: SortOrder,
): InstanceTableRow[] => {
  const comparator: Comparator<InstanceTableRow> = (() => {
    switch (sortKey) {
      case IPC.KEYS.INSTANCE_NAME:
        return (a, b) => compareStrings(a.instanceName, b.instanceName);
      case IPC.KEYS.STATUS:
        return (a, b) => compareStrings(a.status, b.status);
      case IPC.KEYS.CPU:
        return (a, b) => {
          const aCpu = parseFloat(a.cpu.replace(/[^0-9.]/g, '')) || 0;
          const bCpu = parseFloat(b.cpu.replace(/[^0-9.]/g, '')) || 0;
          return compareNumbers(aCpu, bCpu);
        };
      case IPC.KEYS.MEMORY:
        return (a, b) => {
          const aMem = parseFloat(a.memory.replace(/[^0-9.]/g, '')) || 0;
          const bMem = parseFloat(b.memory.replace(/[^0-9.]/g, '')) || 0;
          return compareNumbers(aMem, bMem);
        };
      case IPC.KEYS.CONTAINERS:
        return (a, b) => compareStrings(a.containerNames, b.containerNames);
      case IPC.KEYS.IMAGE_NAMES:
        return (a, b) => compareStrings(a.imageNames, b.imageNames);
      default:
        return () => 0;
    }
  })();

  const items = [...instances];
  items.sort((a, b) => (sortOrder === 'asc' ? comparator(a, b) : -comparator(a, b)));
  return items;
};

export const transformWorkloadToInstances = (workload: AppWorkload): InstanceTableRow[] => {
  const instances = workload.cacid?.usage?.resources?.usagePerInstance || [];
  const containers = workload.cacid?.crates?.regular || [];
  const workloadStatus = workload.cacid?.status || 'Unknown';

  // If no instances, create a single instance with all containers
  if (instances.length === 0 && containers.length > 0) {
    const containerNames = containers.map((c: Container) => c.name).join(', ');
    const imageNames = containers
      .map((c: Container) => {
        const name = c.image?.name || 'N/A';
        const tag = c.image?.tag || 'N/A';
        return `${name}:${tag}`;
      })
      .filter((img, index, arr) => arr.indexOf(img) === index) // Remove duplicates
      .join(', ');
    const imagePullPolicy = containers[0]?.image?.pullPolicy || 'N/A';

    return [
      {
        id: 'main-instance',
        instanceName: 'Main Instance',
        status: workloadStatus,
        cpu: workload.cacid?.usage?.resources?.totalCpu || '0m',
        memory: workload.cacid?.usage?.resources?.totalMemory || '0Mi',
        containersCount: containers.length,
        containerNames,
        imageNames,
        imagePullPolicy,
      },
    ];
  }

  // Map instances to table rows
  return instances.map((instance: Instance, index: number) => {
    const instanceContainers = containers.filter((c: Container) =>
      instance.containers?.some((ic: ContainerUsage) => ic.name === c.name),
    );

    // If no matching containers, use all containers
    const containersToUse = instanceContainers.length > 0 ? instanceContainers : containers;

    const containerNames = containersToUse.map((c: Container) => c.name).join(', ');
    const imageNames = containersToUse
      .map((c: Container) => {
        const name = c.image?.name || 'N/A';
        const tag = c.image?.tag || 'N/A';
        return `${name}:${tag}`;
      })
      .filter((img, idx, arr) => arr.indexOf(img) === idx) // Remove duplicates
      .join(', ');
    const imagePullPolicy = containersToUse[0]?.image?.pullPolicy || 'N/A';

    return {
      id: `instance-${index}`,
      instanceName: instance.name || `Instance ${index + 1}`,
      status: workloadStatus,
      cpu: instance.totalCpu || '0m',
      memory: instance.totalMemory || '0Mi',
      containersCount: containersToUse.length,
      containerNames,
      imageNames,
      imagePullPolicy,
    };
  });
};
