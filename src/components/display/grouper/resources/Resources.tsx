import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App as AntdApp } from 'antd';
import { ResourcesInterface } from '../../../../interfaces/shared';
import { RootState } from '../../../../store';
import { syncAppWorkload } from '../../../../utils/workload/sync';
import { syncBridge } from '../../../../utils/bridge/sync';
import { ParseGoTimeDate } from '../../../../utils/shared/time';
import ResourcesEmptyState from '../resources/ResourcesEmptyState';
import ActionBar from '../resources/ActionBar';
import ResourcesTable from '../resources/Table';

const Resources: React.FC<ResourcesInterface> = React.memo(function Resources({ resources }) {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());

  const workloadSyncing = useSelector((state: RootState) => state.workload.syncing || {});
  const bridgeSyncing = useSelector((state: RootState) => state.bridge.syncing || {});
  const workloads = useSelector((state: RootState) => state.workload.apps || []);
  const bridges = useSelector((state: RootState) => state.bridge.bridges || []);

  // Enrich resources with data from Redux store
  const enrichedResources = useMemo(() => {
    return resources.map((resource) => {
      const isBridge = (resource.type || '').toLowerCase() === 'bridge';
      const resourceName = resource.sourceName || resource.name;

      if (isBridge) {
        // Find bridge in Redux by name or sourceName
        const bridge = bridges.find(
          (b: any) => b.name === resourceName || b.sourceName === resourceName || b.name === resource.name,
        );
        if (bridge) {
          return {
            ...resource,
            status: bridge.status || resource.status,
            creationTime: bridge.creationTime
              ? ParseGoTimeDate(bridge.creationTime)
              : undefined,
            lastSync: bridge.lastUpdateTime
              ? ParseGoTimeDate(bridge.lastUpdateTime)
              : resource.lastSync
              ? ParseGoTimeDate(resource.lastSync)
              : resource.lastSync,
          };
        }
      } else {
        // Find workload in Redux by name
        const workload = workloads.find((w: any) => w.name === resource.name || w.sourceName === resourceName);
        if (workload) {
          return {
            ...resource,
            status: workload.status || resource.status,
            creationTime: workload.creationTime
              ? ParseGoTimeDate(workload.creationTime)
              : undefined,
            lastSync: workload.lastUpdate
              ? ParseGoTimeDate(workload.lastUpdate)
              : resource.lastSync
              ? ParseGoTimeDate(resource.lastSync)
              : resource.lastSync,
          };
        }
      }

      // Return original resource if not found in Redux (backward compatibility)
      return resource;
    });
  }, [resources, workloads, bridges]);

  const selectedCount = selectedResources.size;
  const hasSelection = selectedCount > 0;

  const handleView = useCallback(
    (resourceName?: string) => {
      if (resourceName) {
        const resource = enrichedResources.find((r) => r.name === resourceName);
        if (!resource) return;

        const typeLower = (resource.type || '').toLowerCase();
        const isBridgeType = typeLower === 'bridge';
        const bridgeParam =
          (resource as unknown as { sourceName?: string })?.sourceName || resourceName;

        const route = isBridgeType
          ? `/bridges/${bridgeParam}/details`
          : `/workloads/apps/${resourceName}/details`;
        navigate(route);
      } else if (selectedCount === 1) {
        const firstSelectedName = Array.from(selectedResources)[0];
        const selectedResource = enrichedResources.find((r) => r.name === firstSelectedName);
        if (!selectedResource) return;

        const typeLower = (selectedResource.type || '').toLowerCase();
        const isBridgeType = typeLower === 'bridge';
        const bridgeParam =
          (selectedResource as unknown as { sourceName?: string })?.sourceName ||
          firstSelectedName;

        const route = isBridgeType
          ? `/bridges/${bridgeParam}/details`
          : `/workloads/apps/${firstSelectedName}/details`;
        navigate(route);
      }
    },
    [navigate, selectedResources, selectedCount, enrichedResources],
  );

  const handleRowClick = useCallback(
    (record: typeof enrichedResources[0]) => {
      handleView(record.name);
    },
    [handleView, enrichedResources],
  );

  const isResourceSyncing = useCallback(
    (
      resourceName: string,
      resourceType: string,
      resource?: { name: string; syncName?: string; sourceName?: string },
    ) => {
      const typeLower = (resourceType || '').toLowerCase();
      if (typeLower === 'bridge') {
        // Check all possible name variations for bridges
        // Redux uses the bridge's 'name' property (sourceName) as the key
        const namesToCheck = [
          resourceName, // The resource.name
          resource?.syncName, // The syncName if exists
          resource?.sourceName, // The sourceName if exists
        ].filter(Boolean); // Remove undefined values

        return namesToCheck.some((name) => name && bridgeSyncing[name]);
      }
      return !!workloadSyncing[resourceName];
    },
    [workloadSyncing, bridgeSyncing],
  );

  const hasAnySyncing = useMemo(() => {
    return Array.from(selectedResources).some((name) => {
      const resource = enrichedResources.find((r) => r.name === name);
      if (!resource) return false;
      return isResourceSyncing(resource.name, resource.type, resource);
    });
  }, [selectedResources, enrichedResources, isResourceSyncing]);

  const isResourceSyncingForTable = useCallback(
    (resourceName: string, resourceType: string, resource?: typeof resources[0]) => {
      return isResourceSyncing(resourceName, resourceType, resource);
    },
    [isResourceSyncing],
  );

  const handleSync = useCallback(
    async (resourceName?: string) => {
      const targets = resourceName ? [resourceName] : Array.from(selectedResources);
      if (targets.length === 0) return;

      for (const name of targets) {
        const resource = enrichedResources.find((r) => r.name === name);
        if (!resource) continue;

        if (resource.type?.toLowerCase() === 'bridge') {
          const bridgeResource = resource as typeof resource & {
            sourceName?: string;
            syncName?: string;
          };
          const nameForRedux = bridgeResource.sourceName || resource.name;
          const nameForApi = bridgeResource.syncName || resource.name;
          await syncBridge({
            name: nameForRedux,
            syncName: nameForApi,
            message,
            setSyncing: () => {},
          });
        } else {
          await syncAppWorkload({ name, message, setSyncing: () => {} });
        }
      }
    },
    [selectedResources, enrichedResources, message],
  );

  const handleDelete = useCallback(
    (resourceName?: string) => {
      const targets = resourceName ? [resourceName] : Array.from(selectedResources);
      // TODO: implement delete for multiple resources
      console.log('Delete resources:', targets);
    },
    [selectedResources],
  );

  if (!resources || resources.length === 0) {
    return <ResourcesEmptyState />;
  }

  const handleRowSelection = useCallback(
    (selectedRowKeys: React.Key[]) => {
      setSelectedResources(new Set(selectedRowKeys as string[]));
    },
    [],
  );

  return (
    <>
      <ActionBar
        selectedCount={selectedCount}
        hasSelection={hasSelection}
        isSyncing={hasAnySyncing}
        onView={() => handleView()}
        onSync={() => handleSync()}
        onDelete={() => handleDelete()}
      />
      <ResourcesTable
        resources={enrichedResources}
        isResourceSyncing={isResourceSyncingForTable}
        onRowClick={handleRowClick}
        selectedRowKeys={Array.from(selectedResources)}
        onRowSelectionChange={handleRowSelection}
      />
    </>
  );
});

Resources.displayName = 'Resources';
export default Resources;
