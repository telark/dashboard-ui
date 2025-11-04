import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { Role, RolesTableProps } from '../../../../interfaces/roles';
import { Columns } from './Columns';
import { getPermissionCount, RolesSortKey, sortRoles } from './utils';
import DataTable from '../../shared/table/DataTable';

const RolesTable: React.FC<RolesTableProps> = ({ roles, onRolesChange, onView }) => {
  const [sortKey, setSortKey] = useState<RolesSortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const onSort = (key: RolesSortKey) => {
    const next = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(next);
  };

  const sortedRoles = useMemo(
    () => sortRoles(roles, sortKey, sortOrder, getPermissionCount),
    [roles, sortKey, sortOrder],
  );

  const handleView = (record: Role) => {
    onView?.(record);
  };

  const handleDelete = (record: Role) => {
    Modal.confirm({
      title: RPC.LABELS.DELETE_MODAL_TITLE,
      content: RPC.LABELS.DELETE_MODAL_CONTENT(record?.name || ''),
      okText: RPC.LABELS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: () => {
        onRolesChange?.(roles.filter((r) => r.id !== record.id));
      },
    });
  };

  const columns = Columns({
    onView: handleView,
    onDelete: handleDelete,
    onSort,
    activeSortKey: sortKey,
    sortOrder,
    getPermissionCount,
  });

  return (
    <DataTable
      className="app-table"
      columns={columns as any}
      data={sortedRoles as any}
      rowKey={(r: any) => r.id}
      rowHeight={RPC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleView}
    />
  );
};

export default RolesTable;
