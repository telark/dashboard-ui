import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import DataTable from '../../shared/table/DataTable';
import { CATEGORIES_CONSTANTS as CC } from '../../../../constants/pages/categories';
import type { Category, CategoriesTableProps } from '../../../../interfaces/categories';
import Columns from './Columns';
type SortKey = 'name' | 'type' | 'usedBy' | 'createdAt';

const CategoriesTable: React.FC<CategoriesTableProps> = ({
  categories,
  onView,
  onEdit,
  onCategoriesChange,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const items = [...categories];
    const compare = (a: Category, b: Category) => {
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

  const handleView = (record: Category) => {
    onView?.(record);
  };

  const handleEdit = (record: Category) => {
    onEdit?.(record);
  };

  const handleDelete = (record: Category) => {
    Modal.confirm({
      title: CC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
      content: CC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(record?.name || ''),
      okText: CC.LABELS.ACTIONS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: () => {
        onCategoriesChange?.(categories.filter((c) => c.id !== record.id));
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
        onDelete: handleDelete,
      } as any),
    [sortKey],
  );

  return (
    <DataTable<Category>
      columns={columns}
      data={sorted}
      rowKey={(r) => r.id}
      className="app-table"
      rowHeight={CC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleView}
    />
  );
};

export default CategoriesTable;
