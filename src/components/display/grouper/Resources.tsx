import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ResourcesInterface } from '../../../interfaces/shared';
import ResourcesEmptyState from './ResourcesEmptyState';
import ResourcesActionBar from './ResourcesActionBar';
import ResourcesList from './ResourcesList';

const Resources: React.FC<ResourcesInterface> = React.memo(function Resources({ name, resources }) {
  const navigate = useNavigate();
  const [selectedResources, setSelectedResources] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

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
        const resourceIsBridge = selectedResource?.type === 'bridge';
        const route = resourceIsBridge
          ? `/bridges/${firstSelectedName}/details`
          : `/workloads/apps/${firstSelectedName}/details`;
        navigate(route);
      }
    },
    [navigate, selectedResources, selectedCount, paginatedResources],
  );

  const handleSync = useCallback(
    (resourceName?: string) => {
      const targets = resourceName ? [resourceName] : Array.from(selectedResources);
      // TODO: implement sync for multiple resources
      console.log('Sync resources:', targets);
    },
    [selectedResources],
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
      />
    </>
  );
});

Resources.displayName = 'Resources';
export default Resources;
