import type { ResourceRowInterface } from '../../../../../interfaces/shared';
import { ParseGoTimeDate } from '../../../../../utils/shared/time';
import type { BridgeFromStore, WorkloadFromStore } from '../../models';

export const isBridgeResource = (resourceType: string): boolean => {
  return (resourceType || '').toLowerCase() === 'bridge';
};

export const getResourceName = (resource: ResourceRowInterface): string => {
  return resource.sourceName || resource.name;
};

export const findBridgeInStore = (
  resource: ResourceRowInterface,
  bridges: BridgeFromStore[],
): BridgeFromStore | undefined => {
  const resourceName = getResourceName(resource);
  return bridges.find(
    (b) => b.name === resourceName || b.sourceName === resourceName || b.name === resource.name,
  );
};

export const findWorkloadInStore = (
  resource: ResourceRowInterface,
  workloads: WorkloadFromStore[],
): WorkloadFromStore | undefined => {
  const resourceName = getResourceName(resource);
  return workloads.find((w) => w.name === resource.name || w.sourceName === resourceName);
};

const getLastSync = (storeLastUpdate: string | undefined, resourceLastSync: string): string => {
  if (storeLastUpdate) {
    return ParseGoTimeDate(storeLastUpdate);
  }
  if (resourceLastSync) {
    return ParseGoTimeDate(resourceLastSync);
  }
  return resourceLastSync;
};

export const enrichBridgeResource = (
  resource: ResourceRowInterface,
  bridge: BridgeFromStore,
): ResourceRowInterface => {
  return {
    ...resource,
    status: bridge.status || resource.status,
    creationTime: bridge.creationTime ? ParseGoTimeDate(bridge.creationTime) : undefined,
    lastSync: getLastSync(bridge.lastUpdateTime, resource.lastSync),
  };
};

export const enrichWorkloadResource = (
  resource: ResourceRowInterface,
  workload: WorkloadFromStore,
): ResourceRowInterface => {
  return {
    ...resource,
    status: workload.status || resource.status,
    creationTime: workload.creationTime ? ParseGoTimeDate(workload.creationTime) : undefined,
    lastSync: getLastSync(workload.lastUpdate, resource.lastSync),
  };
};

export const enrichResources = (
  resources: ResourceRowInterface[],
  bridges: BridgeFromStore[],
  workloads: WorkloadFromStore[],
): ResourceRowInterface[] => {
  return resources.map((resource) => {
    if (isBridgeResource(resource.type)) {
      const bridge = findBridgeInStore(resource, bridges);
      if (bridge) {
        return enrichBridgeResource(resource, bridge);
      }
    } else {
      const workload = findWorkloadInStore(resource, workloads);
      if (workload) {
        return enrichWorkloadResource(resource, workload);
      }
    }

    // Return original resource if not found in Redux (backward compatibility)
    return resource;
  });
};

export const getResourceRoute = (resource: ResourceRowInterface): string => {
  const isBridge = isBridgeResource(resource.type);
  const resourceName = resource.name;
  const bridgeParam = (resource as unknown as { sourceName?: string })?.sourceName || resourceName;

  return isBridge ? `/bridges/${bridgeParam}/details` : `/workloads/apps/${resourceName}/details`;
};

export const getBridgeNameVariations = (resource: ResourceRowInterface): string[] => {
  const bridgeResource = resource as typeof resource & {
    sourceName?: string;
    syncName?: string;
  };
  return [resource.name, bridgeResource.syncName, bridgeResource.sourceName].filter(
    Boolean,
  ) as string[];
};

export const isBridgeSyncing = (
  resource: ResourceRowInterface,
  bridgeSyncing: Record<string, boolean>,
): boolean => {
  const namesToCheck = getBridgeNameVariations(resource);
  return namesToCheck.some((name) => name && bridgeSyncing[name]);
};

export const isWorkloadSyncing = (
  resourceName: string,
  workloadSyncing: Record<string, boolean>,
): boolean => {
  return !!workloadSyncing[resourceName];
};

export const isResourceSyncing = (
  resource: ResourceRowInterface,
  workloadSyncing: Record<string, boolean>,
  bridgeSyncing: Record<string, boolean>,
): boolean => {
  if (isBridgeResource(resource.type)) {
    return isBridgeSyncing(resource, bridgeSyncing);
  }
  return isWorkloadSyncing(resource.name, workloadSyncing);
};

export const getBridgeReduxName = (resource: ResourceRowInterface): string => {
  const bridgeResource = resource as typeof resource & {
    sourceName?: string;
  };
  return bridgeResource.sourceName || resource.name;
};

export const getBridgeApiName = (resource: ResourceRowInterface): string => {
  const bridgeResource = resource as typeof resource & {
    syncName?: string;
  };
  return bridgeResource.syncName || resource.name;
};
