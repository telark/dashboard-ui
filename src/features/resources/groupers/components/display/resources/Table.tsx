import React, { useMemo } from 'react';
import type { ResourceRowInterface } from '../../../../../../interfaces/shared';
import { Columns } from './Columns';
import DataTable from '../../../../../../components/display/table/DataTable';

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
    <DataTable<ResourceRowInterface>
      className="app-table"
      columns={columns}
      data={resources}
      rowKey={(r: ResourceRowInterface) => r.name}
      rowHeight={60}
      containerStyle={{
        background: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
        padding: 0,
      }}
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
