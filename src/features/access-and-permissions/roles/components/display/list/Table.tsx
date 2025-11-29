import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { useDispatch } from 'react-redux';
import { ROLES_CONSTANTS as RPC } from '../../../constants';
import type { Role, RolesTableProps } from '../../../models';
import { Columns } from './Columns';
import { getPermissionCount, sortRoles } from './utils';
import type { RolesSortKey } from '../../../models';
import DataTable from '../../../../../../components/display/table/DataTable';
import { deleteRoleThunk } from '../../../store';
import type { AppDispatch } from '../../../../../../store';

const RolesTable: React.FC<RolesTableProps & { loading?: boolean }> = ({
  roles,
  onView,
  onEdit,
  loading = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [sortKey, setSortKey] = useState<RolesSortKey>('creationDate');
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
      onOk: async () => {
        await dispatch(deleteRoleThunk(record.id));
      },
    });
  };

  const handleEdit = (record: Role) => {
    onEdit?.(record);
  };

  const columns = Columns({
    onView: handleView,
    onEdit: handleEdit,
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
      tableProps={{ rowSelection: {}, loading }}
      onRowClick={handleView}
    />
  );
};

export default RolesTable;
