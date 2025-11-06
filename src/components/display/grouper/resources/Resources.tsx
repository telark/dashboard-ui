import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App as AntdApp } from 'antd';
import { ResourcesInterface } from '../../../../interfaces/shared';
import { RootState } from '../../../../store';
import { syncAppWorkload } from '../../../../utils/workload/sync';
import { syncBridge } from '../../../../utils/bridge/sync';
import {
  enrichResources,
  getResourceRoute,
  isResourceSyncing as checkResourceSyncing,
  getBridgeReduxName,
  getBridgeApiName,
  isBridgeResource,
} from '../../../../utils/grouper/resources';
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
    return enrichResources(resources, bridges, workloads);
  }, [resources, workloads, bridges]);

  const selectedCount = selectedResources.size;
  const hasSelection = selectedCount > 0;

  const handleView = useCallback(
    (resourceName?: string) => {
      if (resourceName) {
        const resource = enrichedResources.find((r) => r.name === resourceName);
        if (!resource) return;
        navigate(getResourceRoute(resource));
      } else if (selectedCount === 1) {
        const firstSelectedName = Array.from(selectedResources)[0];
        const selectedResource = enrichedResources.find((r) => r.name === firstSelectedName);
        if (!selectedResource) return;
        navigate(getResourceRoute(selectedResource));
      }
    },
    [navigate, selectedResources, selectedCount, enrichedResources],
  );

  const handleRowClick = useCallback(
    (record: (typeof enrichedResources)[0]) => {
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
      const resourceForCheck = resource
        ? ({ ...resource, type: resourceType } as (typeof enrichedResources)[0])
        : enrichedResources.find((r) => r.name === resourceName);

      if (!resourceForCheck) return false;

      return checkResourceSyncing(resourceForCheck, workloadSyncing, bridgeSyncing);
    },
    [workloadSyncing, bridgeSyncing, enrichedResources],
  );

  const hasAnySyncing = useMemo(() => {
    return Array.from(selectedResources).some((name) => {
      const resource = enrichedResources.find((r) => r.name === name);
      if (!resource) return false;
      return isResourceSyncing(resource.name, resource.type, resource);
    });
  }, [selectedResources, enrichedResources, isResourceSyncing]);

  const isResourceSyncingForTable = useCallback(
    (resourceName: string, resourceType: string, resource?: (typeof resources)[0]) => {
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

        if (isBridgeResource(resource.type)) {
          await syncBridge({
            name: getBridgeReduxName(resource),
            syncName: getBridgeApiName(resource),
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
      console.log('Delete resources:', targets);
    },
    [selectedResources],
  );

  if (!resources || resources.length === 0) {
    return <ResourcesEmptyState />;
  }

  const handleRowSelection = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedResources(new Set(selectedRowKeys as string[]));
  }, []);

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
