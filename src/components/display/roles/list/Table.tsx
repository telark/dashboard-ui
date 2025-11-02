import React, { useMemo, useState } from 'react';
import { Modal, Table } from 'antd';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { Role, RolesTableProps } from '../../../../interfaces/roles';
import { buildColumns } from './buildColumns';
import { getPermissionCount } from './utils';

const RolesTable: React.FC<RolesTableProps> = ({ roles, onRolesChange, onView }) => {
  const [sortKey, setSortKey] = useState<'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  type RolesSortKey = 'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status';

  const onSort = (key: RolesSortKey) => {
    const next = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortKey(key);
    setSortOrder(next);
  };

  const sortedRoles = useMemo(() => {
    const items = [...roles];
    items.sort((a, b) => {
      let av: number | string = 0;
      let bv: number | string = 0;
      if (sortKey === 'name') {
        const cmp = String(a.name || '').localeCompare(String(b.name || ''));
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortKey === 'group') {
        const cmp = String(a.group || '').localeCompare(String(b.group || ''));
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortKey === 'type') {
        const cmp = String(a.type || '').localeCompare(String(b.type || ''));
        return sortOrder === 'asc' ? cmp : -cmp;
      }
      if (sortKey === 'permission') {
        av = getPermissionCount(a);
        bv = getPermissionCount(b);
      } else if (sortKey === 'createdAt') {
        av = new Date(a.createdAt || 0).getTime();
        bv = new Date(b.createdAt || 0).getTime();
      } else if (sortKey === 'status') {
        const map = { Inactive: 0, Active: 1 } as const;
        av = map[(a.status as 'Active' | 'Inactive') || 'Inactive'];
        bv = map[(b.status as 'Active' | 'Inactive') || 'Inactive'];
      }
      const diff = Number(av) - Number(bv);
      return sortOrder === 'asc' ? diff : -diff;
    });
    return items;
  }, [roles, sortKey, sortOrder]);

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

  const columns = buildColumns({
    onView: handleView,
    onDelete: handleDelete,
    onSort,
    activeSortKey: sortKey,
    sortOrder,
    getPermissionCount,
  });

  return (
    <div className="roles-table" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 10px 24px rgba(0,0,0,0.06)', padding: 16, overflow: 'hidden' }}>
      <Table
        rowKey={(r) => r.id}
        columns={columns as any}
        dataSource={sortedRoles as any}
        pagination={false}
        rowSelection={{}}
        size="small"
        style={{ borderRadius: 12 }}
        tableLayout="fixed"
        onRow={() => ({ style: { height: RPC.SIZES.ROW_HEIGHT } })}
      />
    </div>
  );
};

export default RolesTable;


