import React, { useMemo, useState } from 'react';
import { INSTANCES_CONSTANTS as IPC } from '../../../../constants/instances';
import type { InstancesTableProps, InstanceTableRow } from '../../../../models/instances';
import { Columns } from './Columns';
import { InstancesSortKey, sortInstances, transformWorkloadToInstances } from './utils';
import DataTable from '../../../../../../../components/display/table/DataTable';
import InstanceDetailsModal from './InstanceDetailsModal';

const InstancesTable: React.FC<InstancesTableProps> = ({ workload, onInstanceClick }) => {
  const [sortKey, setSortKey] = useState<InstancesSortKey>('instanceName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedInstance, setSelectedInstance] = useState<InstanceTableRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleView = (record: InstanceTableRow) => {
    setSelectedInstance(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedInstance(null);
  };

  const columns = Columns({
    onSort,
    activeSortKey: sortKey,
    sortOrder,
    onView: handleView,
  });

  return (
    <>
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
      <InstanceDetailsModal
        open={isModalOpen}
        onCancel={handleModalClose}
        instance={selectedInstance}
        workload={workload}
      />
    </>
  );
};

export default InstancesTable;
