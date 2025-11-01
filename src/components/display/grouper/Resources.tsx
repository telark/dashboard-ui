import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { App as AntdApp } from 'antd';
import { ResourcesInterface } from '../../../interfaces/shared';
import { RootState } from '../../../store';
import { syncAppWorkload } from '../../../utils/workload/sync';
import { syncBridge } from '../../../utils/bridge/sync';
import ResourcesEmptyState from './ResourcesEmptyState';
import ResourcesActionBar from './ResourcesActionBar';
import ResourcesList from './ResourcesList';

const Resources: React.FC<ResourcesInterface> = React.memo(function Resources({ resources }) {
  const navigate = useNavigate();
  const { message } = AntdApp.useApp();
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const workloadSyncing = useSelector((state: RootState) => state.workload.syncing || {});
  const bridgeSyncing = useSelector((state: RootState) => state.bridge.syncing || {});

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Clear selection when changing pages
    setSelectedResources(new Set());
  };

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      if (checked) {
        const paginatedResources = resources.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize,
        );
        setSelectedResources(new Set(paginatedResources.map((r) => r.name)));
      } else {
        setSelectedResources(new Set());
      }
    },
    [resources, currentPage, pageSize],
  );

  const handleSelectResource = useCallback((resourceName: string, checked: boolean) => {
    setSelectedResources((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(resourceName);
      } else {
        next.delete(resourceName);
      }
      return next;
    });
  }, []);

  const paginatedResources = useMemo(
    () => resources.slice((currentPage - 1) * pageSize, currentPage * pageSize),
    [resources, currentPage, pageSize],
  );

  const allPageResourcesSelected = useMemo(
    () =>
      paginatedResources.length > 0 &&
      paginatedResources.every((r) => selectedResources.has(r.name)),
    [paginatedResources, selectedResources],
  );

  const somePageResourcesSelected = useMemo(
    () => paginatedResources.some((r) => selectedResources.has(r.name)),
    [paginatedResources, selectedResources],
  );

  const selectedCount = selectedResources.size;
  const hasSelection = selectedCount > 0;

  const handleView = useCallback(
    (resourceName?: string, isBridge?: boolean) => {
      if (resourceName) {
        const route = isBridge
          ? `/bridges/${resourceName}/details`
          : `/workloads/apps/${resourceName}/details`;
        navigate(route);
      } else if (selectedCount === 1) {
        const firstSelectedName = Array.from(selectedResources)[0];
        const selectedResource = paginatedResources.find((r) => r.name === firstSelectedName);

        const typeLower = (selectedResource?.type || '').toLowerCase();
        const isBridgeType = typeLower === 'bridge';
        const bridgeParam = (selectedResource as unknown as { sourceName?: string })?.sourceName || firstSelectedName;

        const route = isBridgeType
          ? `/bridges/${bridgeParam}/details`
          : `/workloads/apps/${firstSelectedName}/details`;
        navigate(route);
      }
    },
    [navigate, selectedResources, selectedCount, paginatedResources],
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
      const resource = resources.find((r) => r.name === name);
      if (!resource) return false;
      return isResourceSyncing(resource.name, resource.type, resource);
    });
  }, [selectedResources, resources, isResourceSyncing]);

  const handleSync = useCallback(
    async (resourceName?: string) => {
      const targets = resourceName ? [resourceName] : Array.from(selectedResources);
      if (targets.length === 0) return;

      for (const name of targets) {
        const resource = resources.find((r) => r.name === name);
        if (!resource) continue;

        if (resource.type?.toLowerCase() === 'bridge') {
          // For bridges:
          // - name (Redux key) should be the display/source name (e.g., 'service-1')
          // - syncName (API name) should be the backend-facing name (e.g., 'service-1-bridge')
          const bridgeResource = resource as typeof resource & { sourceName?: string; syncName?: string };
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
    [selectedResources, resources, message],
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

  return (
    <>
      <ResourcesActionBar
        selectedCount={selectedCount}
        hasSelection={hasSelection}
        allPageResourcesSelected={allPageResourcesSelected}
        somePageResourcesSelected={somePageResourcesSelected}
        isSyncing={hasAnySyncing}
        onSelectAll={handleSelectAll}
        onView={() => handleView()}
        onSync={() => handleSync()}
        onDelete={() => handleDelete()}
      />
      <ResourcesList
        resources={paginatedResources}
        selectedResources={selectedResources}
        onSelectResource={handleSelectResource}
        currentPage={currentPage}
        pageSize={pageSize}
        totalResources={resources.length}
        onPageChange={handlePageChange}
        isResourceSyncing={isResourceSyncing}
      />
    </>
  );
});

Resources.displayName = 'Resources';
export default Resources;
