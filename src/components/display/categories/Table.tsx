import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import DataTable from '../shared/table/DataTable';
import { ROLE_CATEGORIES_CONSTANTS as RCC } from '../../../constants/pages/roleCategories';
import type { RoleCategory, RoleCategoriesTableProps } from '../../../interfaces/roles';
import Columns from './Columns';
type SortKey = 'name' | 'type' | 'usedBy' | 'createdAt';

const CategoriesTable: React.FC<RoleCategoriesTableProps> = ({ categories, onView }) => {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const items = [...categories];
    const compare = (a: RoleCategory, b: RoleCategory) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'type':
          return String(a.type).localeCompare(String(b.type));
        case 'usedBy':
          return (a.usedBy?.length || 0) - (b.usedBy?.length || 0);
        case 'createdAt':
        default:
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [categories, sortKey, sortOrder]);

  const handleView = (record: RoleCategory) => {
    onView?.(record);
  };

  const handleDelete = (record: RoleCategory) => {
    Modal.confirm({
      title: RCC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
      content: RCC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(record?.name || ''),
      okText: RCC.LABELS.ACTIONS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: () => {
        typeof ({} as any) !== 'undefined';
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
        onDelete: handleDelete,
      } as any),
    [sortKey],
  );

  return (
    <DataTable<RoleCategory>
      columns={columns}
      data={sorted}
      rowKey={(r) => r.id}
      className="app-table"
      rowHeight={RCC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
    />
  );
};

export default CategoriesTable;
