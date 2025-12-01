import React, { useMemo, useState, useCallback } from 'react';
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
import ActionBar from './ActionBar';
import { canModifyRoles, canDeleteRoles } from '../../../utils';

const RolesTable: React.FC<RolesTableProps & { loading?: boolean }> = ({
  roles,
  onView,
  onEdit,
  loading = false,
}) => {
  const dispatch: AppDispatch = useDispatch();
  const [sortKey, setSortKey] = useState<RolesSortKey>('creationDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());

  const selectedCount = selectedRoles.size;
  const hasSelection = selectedCount > 0;

  const selectedRolesList = useMemo(
    () => roles.filter((role) => selectedRoles.has(role.id)),
    [roles, selectedRoles],
  );

  const canEdit = useMemo(() => canModifyRoles(selectedRolesList), [selectedRolesList]);
  const canDelete = useMemo(() => canDeleteRoles(selectedRolesList), [selectedRolesList]);

  const onSort = useCallback((key: RolesSortKey) => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
      } else {
        setSortOrder('desc');
      }
      return key;
    });
  }, []);

  const sortedRoles = useMemo(
    () => sortRoles(roles, sortKey, sortOrder, getPermissionCount),
    [roles, sortKey, sortOrder],
  );

  const handleView = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = Array.from(selectedRoles)[0];
      const selectedRole = roles.find((r) => r.id === selectedId);
      if (selectedRole) {
        onView?.(selectedRole);
      }
    }
  }, [selectedCount, selectedRoles, roles, onView]);

  const handleEdit = useCallback(() => {
    if (selectedCount === 1) {
      const selectedId = Array.from(selectedRoles)[0];
      const selectedRole = roles.find((r) => r.id === selectedId);
      if (selectedRole && canModifyRoles([selectedRole])) {
        onEdit?.(selectedRole);
      }
    }
  }, [selectedCount, selectedRoles, roles, onEdit]);

  const handleDeleteClick = useCallback(() => {
    const selectedIds = Array.from(selectedRoles);
    if (selectedIds.length === 0) return;

    const selectedRoleNames = selectedIds
      .map((id) => roles.find((r) => r.id === id)?.name)
      .filter(Boolean) as string[];

    const deletableRoles = selectedIds
      .map((id) => roles.find((r) => r.id === id))
      .filter((role): role is Role => role !== undefined && canDeleteRoles([role]));

    if (deletableRoles.length === 0) {
      Modal.warning({
        title: 'Cannot Delete',
        content: 'Selected roles cannot be deleted due to protection flags.',
      });
      return;
    }

    Modal.confirm({
      title: RPC.LABELS.DELETE_MODAL_TITLE,
      content: RPC.LABELS.DELETE_MODAL_CONTENT(
        selectedRoleNames.length === 1
          ? selectedRoleNames[0]
          : `${selectedRoleNames.length} roles`,
      ),
      okText: RPC.LABELS.DELETE_MODAL_OK,
      okButtonProps: { danger: true },
      onOk: async () => {
        for (const role of deletableRoles) {
          try {
            await dispatch(deleteRoleThunk(role.id));
          } catch {
            // Error message already shown by deleteRoleThunk
          }
        }
        setSelectedRoles(new Set());
      },
    });
  }, [selectedRoles, roles, dispatch]);

  const handleRowSelection = useCallback((selectedRowKeys: React.Key[]) => {
    setSelectedRoles(new Set(selectedRowKeys as string[]));
  }, []);

  const columns = useMemo(
    () =>
      Columns({
        onSort,
        activeSortKey: sortKey,
        sortOrder,
        getPermissionCount,
      }),
    [sortKey, sortOrder, onSort],
  );

  return (
    <>
      <ActionBar
        selectedCount={selectedCount}
        hasSelection={hasSelection}
        canEdit={canEdit}
        canDelete={canDelete}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
      />
      <DataTable<Role>
        className="app-table"
        columns={columns}
        data={sortedRoles}
        rowKey={(r: Role) => r.id}
        rowHeight={RPC.SIZES.ROW_HEIGHT}
        tableProps={{
          rowSelection: {
            selectedRowKeys: Array.from(selectedRoles),
            onChange: handleRowSelection,
          },
          loading,
        }}
        onRowClick={(record) => onView?.(record)}
      />
    </>
  );
};

export default RolesTable;
