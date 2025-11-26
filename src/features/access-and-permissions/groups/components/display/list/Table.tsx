import React, { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { useSelector } from 'react-redux';
import DataTable from '../../../../../../components/display/table/DataTable';
import { GROUPS_CONSTANTS as GC } from '../../../constants';
import type { Group, GroupsTableProps } from '../../../models';
import Columns from './Columns';
import { useGroupActions } from '../../../hooks';
import { selectGroupsCategories } from '../../../../categories/store/selectors/categorySelectors';

type SortKey = 'name' | 'categoryID' | 'creationDate';

const GroupsTable: React.FC<GroupsTableProps> = ({ groups, onView, onEdit }) => {
  const { handleDelete } = useGroupActions();
  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const categories = useSelector(selectGroupsCategories);

  const sorted = useMemo(() => {
    const items = [...groups];
    const compare = (a: Group, b: Group) => {
      switch (sortKey) {
        case 'name':
          return String(a.name).localeCompare(String(b.name));
        case 'categoryID':
          return String(a.categoryID).localeCompare(String(b.categoryID));
        case 'creationDate':
        default:
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [groups, sortKey, sortOrder]);


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
        onView,
        onEdit,
        onDelete: handleDeleteClick,
        categories,
      } as any),
    [sortKey, onView, onEdit, handleDeleteClick, categories],
  );

  return (
    <DataTable<Group>
      columns={columns}
      data={sorted}
      rowKey={(r) => r.id}
      className="app-table"
      rowHeight={GC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={onView}
    />
  );
};

export default GroupsTable;
