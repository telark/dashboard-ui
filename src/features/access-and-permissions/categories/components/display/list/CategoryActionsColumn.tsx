import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';
import { DEFAULT_COLORS, ROW_ACTION_CLASS } from '../../../../../../constants';
import { ROLES_CONSTANTS as RC } from '../../../../roles/constants';
import { CATEGORIES_CONSTANTS as CC, labelsFor } from '../../../constants';
import type { CategoryScope } from '../../../constants';
import { useCategoryDeleteModal, CategoryDeleteModal } from '../../delete';
import type { Category } from '../../../models';
import {
  usePermission,
  ACTION_PERMISSIONS,
} from '../../../../../auth/hooks/permissions/permissionEngine';
import type { PermissionLevel } from '../../../../../auth/models/permissions';

interface CategoryActionsColumnProps {
  record: Category;
  onEdit?: (record: Category) => void;
  onDelete?: (record: Category) => void;
  scope: CategoryScope;
}

type PermissionEntry = { scope: string; level: PermissionLevel; deny: string };

const PERMISSIONS_BY_SCOPE: Record<
  CategoryScope,
  { edit: PermissionEntry; delete: PermissionEntry }
> = {
  [CC.SCOPES.GROUPS]: {
    edit: ACTION_PERMISSIONS.groups.editCategory,
    delete: ACTION_PERMISSIONS.groups.deleteCategory,
  },
  [CC.SCOPES.ROLES]: {
    edit: ACTION_PERMISSIONS.roles.editCategory,
    delete: ACTION_PERMISSIONS.roles.deleteCategory,
  },
  [CC.SCOPES.PLAN_ENVIRONMENTS]: {
    edit: ACTION_PERMISSIONS.protectionPlans.editCategory,
    delete: ACTION_PERMISSIONS.protectionPlans.deleteCategory,
  },
  [CC.SCOPES.PLAN_TAGS]: {
    edit: ACTION_PERMISSIONS.protectionPlans.editCategory,
    delete: ACTION_PERMISSIONS.protectionPlans.deleteCategory,
  },
};

const ACTION_SIZE = 28;

const actionButtonStyle = (disabled: boolean): React.CSSProperties => ({
  all: 'unset',
  cursor: disabled ? 'not-allowed' : 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: disabled ? DEFAULT_COLORS.ICON_MUTED : DEFAULT_COLORS.TEXT_MUTED,
  fontSize: 16,
  width: ACTION_SIZE,
  height: ACTION_SIZE,
  borderRadius: 4,
  transition: 'color 0.2s, opacity 0.2s',
  opacity: disabled ? 0.6 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
});

const actionWrapperStyle: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: ACTION_SIZE,
  height: ACTION_SIZE,
  flexShrink: 0,
};

export const CategoryActionsColumn: React.FC<CategoryActionsColumnProps> = ({
  record,
  onEdit,
  onDelete,
  scope,
}) => {
  const isBuiltIn = record.type === CC.TYPES.BUILT_IN;
  const { deleteModalOpen, isDeleting, openDeleteModal, closeDeleteModal, handleConfirmDelete } =
    useCategoryDeleteModal(record);

  const { edit, delete: del } = PERMISSIONS_BY_SCOPE[scope];
  const hasEditPermission = usePermission(edit.scope, edit.level, edit.deny);
  const hasDeletePermission = usePermission(del.scope, del.level, del.deny);
  const L = labelsFor(scope);

  const showEdit = !isBuiltIn && !!onEdit;
  const showDelete = !isBuiltIn;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!hasEditPermission) return;
    onEdit?.(record);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!hasDeletePermission) return;
    if (onDelete) {
      onDelete(record);
    } else {
      openDeleteModal();
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 12,
      }}
    >
      {showEdit && (
        <Tooltip
          title={
            hasEditPermission ? RC.LABELS.ACTIONS.EDIT : L.ACTIONS.EDIT_PERMISSION_DENIED_TOOLTIP
          }
          placement="left"
        >
          <span style={actionWrapperStyle}>
            <button
              type="button"
              onClick={handleEditClick}
              className={ROW_ACTION_CLASS}
              style={actionButtonStyle(!hasEditPermission)}
              disabled={!hasEditPermission}
              onMouseEnter={(e) => {
                if (hasEditPermission) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label={RC.LABELS.ACTIONS.EDIT}
            >
              <EditOutlined />
            </button>
          </span>
        </Tooltip>
      )}
      {showDelete && (
        <Tooltip
          title={
            hasDeletePermission
              ? RC.LABELS.ACTIONS.DELETE
              : L.ACTIONS.DELETE_PERMISSION_DENIED_TOOLTIP
          }
          placement="left"
        >
          <span style={actionWrapperStyle}>
            <button
              type="button"
              onClick={handleDeleteClick}
              className={ROW_ACTION_CLASS}
              style={actionButtonStyle(!hasDeletePermission)}
              disabled={!hasDeletePermission}
              onMouseEnter={(e) => {
                if (hasDeletePermission) e.currentTarget.style.background = DEFAULT_COLORS.HOVER_BG;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              aria-label={RC.LABELS.ACTIONS.DELETE}
            >
              <DeleteOutlined />
            </button>
          </span>
        </Tooltip>
      )}
      {!onDelete && (
        <CategoryDeleteModal
          open={deleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          categoryName={record.name}
          loading={isDeleting}
          scope={record.scope}
        />
      )}
    </div>
  );
};
