import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import DataTable from '../../../../../../components/display/table/DataTable';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import type { Group, GroupsTableProps } from '../../../models';
import Columns from './Columns';
import { useGroupActions } from '../../../hooks';

type SortKey = 'name' | 'category' | 'createdAt';

const GroupsTable: React.FC<GroupsTableProps> = ({ groups, onView, onEdit }) => {
  const { handleDelete } = useGroupActions();
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const items = [...groups];
    const compare = (a: Group, b: Group) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'category':
          return String(a.category).localeCompare(String(b.category));
        case 'createdAt':
        default:
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [groups, sortKey, sortOrder]);

  const handleView = (record: Group) => {
    onView?.(record);
  };

  const handleEdit = (record: Group) => {
    onEdit?.(record);
  };

  const handleDeleteClick = (record: Group) => {
    Modal.confirm({
      title: GC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
      content: GC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(record?.name || ''),
      okText: GC.LABELS.ACTIONS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: () => {
        handleDelete(record.id);
      },
    });
  };

  const columns = useMemo(
    () =>
      Columns({
        activeSortKey: sortKey,
        onSort: (k: string) => {
          const key = k as SortKey;
          setSortKey(key);
          setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
        },
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDeleteClick,
      } as any),
    [sortKey, handleView, handleEdit, handleDeleteClick],
  );

  return (
    <DataTable<Group>
      columns={columns}
      data={sorted}
      rowKey={(r) => r.id}
      className="app-table"
      rowHeight={GC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleView}
    />
  );
};

export default GroupsTable;
