import React, { useMemo, useState } from 'react';
import { INSTANCES_PAGE_CONSTANTS as IPC } from '../../../../../constants/pages/instances';
import type { InstancesTableProps } from '../../../../../interfaces/instances';
import { Columns } from './Columns';
import { InstancesSortKey, sortInstances, transformWorkloadToInstances } from './utils';
import DataTable from '../../../shared/table/DataTable';

const InstancesTable: React.FC<InstancesTableProps> = ({ workload, onInstanceClick }) => {
  const [sortKey, setSortKey] = useState<InstancesSortKey>('instanceName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = (key: InstancesSortKey) => {
    const next = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(next);
  };

  const instances = useMemo(() => transformWorkloadToInstances(workload), [workload]);

  const sortedInstances = useMemo(
    () => sortInstances(instances, sortKey, sortOrder),
    [instances, sortKey, sortOrder],
  );

  const handleRowClick = (record: any) => {
    onInstanceClick?.(record);
  };

  const columns = Columns({
    onSort,
    activeSortKey: sortKey,
    sortOrder,
  });

  return (
    <DataTable
      className="app-table"
      columns={columns as any}
      data={sortedInstances as any}
      rowKey={(r: any) => r.id}
      rowHeight={IPC.SIZES.ROW_HEIGHT}
      containerStyle={{
        background: 'transparent',
        borderRadius: 0,
        boxShadow: 'none',
        padding: 0,
      }}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleRowClick}
    />
  );
};

export default InstancesTable;

