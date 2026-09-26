import React, { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import DataTable from '../../../../../../components/display/table/DataTable';
import { USERS_CONSTANTS as UC } from '../../../constants';
import { DEFAULT_COLORS } from '../../../../../../constants';
import { toTimestamp } from '../../../../../../utils/shared/time';
import type { User, UsersTableProps } from '../../../models';
import type { GenerateColumnCtx } from '../../../../../../interfaces/layout/table';
import type { RootState } from '../../../../../../store';
import { useFetchGroups } from '../../../../groups/hooks';
import Columns from './Columns';
import { UserActionsColumn } from './UserActionsColumn';
import { useSortState } from '../../../../../../utils/layout/sort';

const UsersTable: React.FC<UsersTableProps> = ({ users, onView, onEdit, onUsersChange }) => {
  useFetchGroups();
  const groups = useSelector((state: RootState) => state.groups.groups);
  const { sortKey, sortOrder, handleSort } = useSortState({
    defaultSortKey: 'creationDate',
    defaultSortOrder: 'desc',
  });

  const sorted = useMemo(() => {
    const items = [...users];
    items.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'username':
          cmp = a.username.localeCompare(b.username);
          break;
        case 'fullname':
          cmp = a.fullname.localeCompare(b.fullname);
          break;
        case 'email':
          cmp = a.email.localeCompare(b.email);
          break;
        case 'assignedRolesIDs':
          cmp = (a.assignedRolesIDs?.[0] ?? '').localeCompare(b.assignedRolesIDs?.[0] ?? '');
          break;
        case 'creationDate':
        default:
          cmp = toTimestamp(a.creationDate) - toTimestamp(b.creationDate);
      }
      return sortOrder === 'asc' ? cmp : -cmp;
    });
    return items;
  }, [users, sortKey, sortOrder]);

  const handleView = useCallback((record: User) => onView?.(record), [onView]);
  const handleEdit = useCallback((record: User) => onEdit?.(record), [onEdit]);
  const handleDelete = useCallback(
    (record: User) => onUsersChange?.(users.filter((u) => u.id !== record.id)),
    [onUsersChange, users],
  );

  const ctx: GenerateColumnCtx = useMemo(
    () => ({ activeSortKey: sortKey ?? 'creationDate', onSort: handleSort }),
    [sortKey, handleSort],
  );

  const columns = useMemo(
    () => [
      ...Columns(ctx, groups),
      {
        title: '',
        key: UC.KEYS.ACTIONS,
        align: 'right' as const,
        width: 120,
        onHeaderCell: () => ({ style: { background: DEFAULT_COLORS.PAGE_BG } }),
        render: (_: unknown, record: User) => (
          <UserActionsColumn record={record} onEdit={handleEdit} onDelete={handleDelete} />
        ),
      },
    ],
    [ctx, groups, handleEdit, handleDelete],
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
