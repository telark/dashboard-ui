import React, { useMemo, useState } from 'react';
import { Button, Dropdown, Modal, Table } from 'antd';
import { BiSort } from 'react-icons/bi';
import { MoreOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import {
  AiOutlineTeam,
  AiOutlineSafety,
  AiOutlineCalendar,
  AiOutlineCheckCircle,
  AiOutlineTag,
} from 'react-icons/ai';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import type { Role, RolesTableProps } from '../../../../interfaces/roles';

const RolesTable: React.FC<RolesTableProps> = ({ roles, onRolesChange, onView }) => {
  const [sortKey, setSortKey] = useState<'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const getPermissionCount = (r: Role) => {
    const levels = Object.values(r.scopes || {}) as Array<Array<'View' | 'Edit' | 'Manage'>>;
    return levels.reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
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

  const SortHeader = (
    label: string,
    keyName: 'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status',
    align: 'left' | 'center' = 'center',
    LeftIcon?: React.ReactNode,
    sortable: boolean = true,
  ) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        gap: 6,
        width: '100%',
      }}
    >
      {LeftIcon ? <span style={{ display: 'inline-flex', alignItems: 'center', color: RPC.COLORS.TEXT_MUTED }}>{LeftIcon}</span> : null}
      <span>{label}</span>
      {sortable ? (
        <BiSort
          onClick={() => {
            const next = sortKey === keyName && sortOrder === 'asc' ? 'desc' : 'asc';
            setSortKey(keyName);
            setSortOrder(next);
          }}
          style={{ cursor: 'pointer', color: sortKey === keyName ? RPC.COLORS.SORT_ACTIVE : RPC.COLORS.SORT_MUTED, fontSize: RPC.SIZES.HEADER_ICON }}
        />
      ) : null}
    </div>
  );

  const handleView = (record: Role) => {
    onView?.(record);
  };

  const handleDelete = (record: Role) => {
    Modal.confirm({
      title: 'Delete Role',
      content: `Are you sure you want to delete "${record?.name}"?`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      onOk: () => {
        onRolesChange?.(roles.filter((r) => r.id !== record.id));
      },
    });
  };

  const renderChip = (text: string, bg: string, color: string) => (
    <span
      style={{
        display: 'inline-block',
        background: bg,
        color,
        padding: '2px 10px',
        borderRadius: 999,
        fontWeight: 700,
        fontSize: RPC.SIZES.CHIP_FONT,
        textTransform: 'capitalize',
      }}
    >
      {text}
    </span>
  );

  const columns = [
    {
      title: SortHeader(RPC.LABELS.COLUMNS.ROLE_TITLE, 'name', 'left'),
      dataIndex: 'name',
      key: 'name',
      align: 'left' as const,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: string, record: Role) => (
        <span style={{ fontWeight: 700, color: RPC.COLORS.TEXT_PRIMARY }}>{record.name}</span>
      ),
      width: 320,
    },
    {
      title: SortHeader(RPC.LABELS.COLUMNS.TYPE, 'type', 'center', <AiOutlineTag />),
      key: 'type',
      align: 'center' as const,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: any, record: Role) => (
        renderChip(
          record.type || 'custom',
          record.type === 'built-in' ? RPC.COLORS.TYPE_BUILTIN_BG : RPC.COLORS.TYPE_CUSTOM_BG,
          record.type === 'built-in' ? RPC.COLORS.TYPE_BUILTIN_TEXT : RPC.COLORS.TYPE_CUSTOM_TEXT,
        )
      ),
      width: 140,
    },
    {
      title: SortHeader(RPC.LABELS.COLUMNS.GROUP, 'group', 'center', <AiOutlineTeam />),
      key: 'group',
      align: 'center' as const,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: any, record: Role) => (
        renderChip(record.group, RPC.COLORS.CHIP_BLUE_BG, RPC.COLORS.CHIP_BLUE_TEXT)
      ),
      width: 140,
    },
    {
      title: SortHeader(RPC.LABELS.COLUMNS.PERMISSIONS, 'permission', 'center', <AiOutlineSafety />),
      key: 'permission',
      align: 'center' as const,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (_: any, record: Role) => {
        const count = getPermissionCount(record);
        return renderChip(`${count} ${RPC.LABELS.PERMISSIONS_SUFFIX}`, RPC.COLORS.CHIP_BLUE_BG, RPC.COLORS.CHIP_BLUE_TEXT);
      },
      width: 160,
    },
    {
      title: SortHeader(RPC.LABELS.COLUMNS.CREATED, 'createdAt', 'center', <AiOutlineCalendar />),
      dataIndex: 'createdAt',
      key: 'createdAt',
      align: 'center' as const,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (date: string) => new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      width: 160,
    },
    {
      title: SortHeader(RPC.LABELS.COLUMNS.STATUS, 'status', 'center', <AiOutlineCheckCircle />),
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      onHeaderCell: () => ({ style: { background: RPC.COLORS.HEADER_BG } }),
      render: (status: string) => (
        renderChip(
          status,
          status === 'Active' ? RPC.COLORS.STATUS_ACTIVE_BG : RPC.COLORS.STATUS_INACTIVE_BG,
          status === 'Active' ? RPC.COLORS.STATUS_ACTIVE_TEXT : RPC.COLORS.STATUS_INACTIVE_TEXT,
        )
      ),
      width: 120,
    },
    {
      title: '',
      key: 'actions',
      align: 'right' as const,
      width: 48,
      onHeaderCell: () => ({ style: { background: '#fff' } }),
      render: (_: any, record: Role) => (
        <Dropdown
          trigger={['click']}
          placement="bottomRight"
          menu={{
            items: [
              { key: 'view', label: 'View', icon: <EyeOutlined /> },
              { key: 'delete', label: 'Delete', icon: <DeleteOutlined />, danger: true },
            ],
            onClick: ({ key }) => (key === 'view' ? handleView(record) : handleDelete(record)),
          }}
        >
          <Button type="text" shape="circle" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

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
        onRow={() => ({ style: { height: 44 } })}
      />
    </div>
  );
};

export default RolesTable;


