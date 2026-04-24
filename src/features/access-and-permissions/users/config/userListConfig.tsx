import React from 'react';
import { Tooltip } from 'antd';
import { USERS_CONSTANTS as UC } from '../constants';
import { Icons } from '../../../../constants';
import { SearchOutlined, SettingOutlined, FilterOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

const UserIcon = Icons.User;
const RoleIcon = Icons.Role;
const GroupIcon = Icons.Group;

interface UseUserListConfigProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onCreateUserClick: () => void;
  canCreateUser?: boolean;
  selectedUsersCount?: number;
  onFilterClick?: () => void;
  onBulkDeleteClick?: () => void;
  onManageRoleClick?: () => void;
  onManageGroupClick?: () => void;
  canManageRole?: boolean;
  canManageGroup?: boolean;
  canBulkDeleteUser?: boolean;
}

export const useUserListConfig = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateUserClick,
  canCreateUser = true,
  selectedUsersCount = 0,
  onFilterClick,
  onBulkDeleteClick,
  onManageRoleClick,
  onManageGroupClick,
  canManageRole = true,
  canManageGroup = true,
  canBulkDeleteUser = true,
}: UseUserListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(
    () => ({
      search: {
        placeholder: UC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
        onSubmit: onSearchSubmit,
      },
      buttons: [
        {
          key: 'search',
          label: UC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'filter',
          label: UC.LABELS.TOOLBAR.FILTER.BUTTON_LABEL,
          icon: <FilterOutlined />,
          variant: 'ghost',
          onClick: () => onFilterClick?.(),
        },
        {
          key: 'bulk-delete',
          label: UC.LABELS.ACTIONS.BULK_DELETE,
          icon: <DeleteOutlined />,
          variant: 'danger',
          disabled: selectedUsersCount < 2 || !canBulkDeleteUser,
          tooltip: !canBulkDeleteUser ? UC.LABELS.ACTIONS.BULK_DELETE_DISABLED_TOOLTIP : undefined,
          onClick: () => onBulkDeleteClick?.(),
        },
        {
          key: 'manage',
          label: UC.LABELS.TOOLBAR.MANAGE.BUTTON_LABEL,
          icon: <SettingOutlined />,
          variant: 'default',
          disabled: selectedUsersCount !== 1,
          dropdown: {
            items: [
              {
                key: 'manage-roles',
                label: !canManageRole ? (
                  <Tooltip title={UC.LABELS.ACTIONS.MANAGE_ROLES_DISABLED_TOOLTIP}>
                    <span style={{ pointerEvents: 'all' }}>{UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_ROLES}</span>
                  </Tooltip>
                ) : UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_ROLES,
                icon: <RoleIcon size={14} />,
                disabled: !canManageRole,
              },
              {
                key: 'manage-groups',
                label: !canManageGroup ? (
                  <Tooltip title={UC.LABELS.ACTIONS.MANAGE_GROUPS_DISABLED_TOOLTIP}>
                    <span style={{ pointerEvents: 'all' }}>{UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_GROUPS}</span>
                  </Tooltip>
                ) : UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_GROUPS,
                icon: <GroupIcon size={14} />,
                disabled: !canManageGroup,
              },
            ],
            onItemClick: (key: string) => {
              if (key === 'manage-roles') {
                onManageRoleClick?.();
              } else if (key === 'manage-groups') {
                onManageGroupClick?.();
              }
            },
          },
        },
        {
          key: 'create-user',
          label: UC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
          icon: <UserIcon size={14} />,
          variant: 'primary',
          onClick: onCreateUserClick,
          disabled: !canCreateUser,
        },
      ],
    }),
    [
      searchValue,
      onSearchChange,
      onSearchSubmit,
      onCreateUserClick,
      canCreateUser,
      selectedUsersCount,
      onFilterClick,
      onBulkDeleteClick,
      onManageRoleClick,
      onManageGroupClick,
      canManageRole,
      canManageGroup,
      canBulkDeleteUser,
    ],
  );

  return { toolbarConfig };
};
