import React, { useMemo } from 'react';
import type { ResourceRowInterface } from '../../../../interfaces/shared';
import { Columns } from './Columns';
import DataTable from '../../shared/table/DataTable';

interface ResourcesTableProps {
  resources: ResourceRowInterface[];
  isResourceSyncing: (
    resourceName: string,
    resourceType: string,
    resource?: ResourceRowInterface,
  ) => boolean;
  onRowClick?: (record: ResourceRowInterface) => void;
  selectedRowKeys?: React.Key[];
  onRowSelectionChange?: (selectedRowKeys: React.Key[]) => void;
}

const ResourcesTable: React.FC<ResourcesTableProps> = ({
  resources,
  isResourceSyncing,
  onRowClick,
  selectedRowKeys = [],
  onRowSelectionChange,
}) => {
  const columns = useMemo(() => Columns({ isResourceSyncing }), [isResourceSyncing]);

  return (
    <DataTable
      className="app-table"
      columns={columns as any}
      data={resources as any}
      rowKey={(r: ResourceRowInterface) => r.name}
      rowHeight={60}
      tableProps={{
        rowSelection: onRowSelectionChange
          ? {
              selectedRowKeys,
              onChange: onRowSelectionChange,
            }
          : undefined,
      }}
      onRowClick={onRowClick}
    />
  );
};

export default ResourcesTable;

