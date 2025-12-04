import React, { useMemo, useState, useCallback } from 'react';
import { Modal } from 'antd';
import DataTable from '../../../../../../components/display/table/DataTable';
import { USERS_CONSTANTS as UC } from '../../../constants';
import type { User, UsersTableProps } from '../../../models';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import Columns from './Columns';

type SortKey = 'username' | 'fullname' | 'email' | 'roleID' | 'creationDate';

type ExtendedColumnCtx = GenerateColumnCtx & {
  onView?: (record: User) => void;
  onEdit?: (record: User) => void;
  onDelete?: (record: User) => void;
};

const UsersTable: React.FC<UsersTableProps> = ({ users, onView, onEdit, onUsersChange }) => {
  const [sortKey, setSortKey] = useState<SortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sorted = useMemo(() => {
    const items = [...users];
    const compare = (a: User, b: User) => {
      switch (sortKey) {
        case 'username':
          return String(a.username).localeCompare(String(b.username));
        case 'fullname':
          return String(a.fullname).localeCompare(String(b.fullname));
        case 'email':
          return String(a.email).localeCompare(String(b.email));
        case 'roleID':
          return String(a.roleID).localeCompare(String(b.roleID));
        case 'creationDate':
        default:
          return new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime();
      }
    };
    items.sort((a, b) => (sortOrder === 'asc' ? compare(a, b) : -compare(a, b)));
    return items;
  }, [users, sortKey, sortOrder]);

  const handleView = useCallback(
    (record: User) => {
      onView?.(record);
    },
    [onView],
  );

  const handleEdit = useCallback(
    (record: User) => {
      onEdit?.(record);
    },
    [onEdit],
  );

  const handleDelete = useCallback(
    (record: User) => {
      Modal.confirm({
        title: UC.LABELS.ACTIONS.DELETE_MODAL_TITLE,
        content: UC.LABELS.ACTIONS.DELETE_MODAL_CONTENT(record?.fullname || record?.username || ''),
        okText: UC.LABELS.ACTIONS.DELETE_MODAL_OK,
        okButtonProps: { danger: true },
        onOk: () => {
          onUsersChange?.(users.filter((u) => u.id !== record.id));
        },
      });
    },
    [onUsersChange, users],
  );

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
      } as ExtendedColumnCtx),
    [sortKey, handleView, handleEdit, handleDelete],
  );

  return (
    <DataTable<User>
      columns={columns}
      data={sorted}
      rowKey={(r) => r.id}
      className="app-table"
      rowHeight={UC.SIZES.ROW_HEIGHT}
      tableProps={{ rowSelection: {} }}
      onRowClick={handleView}
    />
  );
};

export default UsersTable;
