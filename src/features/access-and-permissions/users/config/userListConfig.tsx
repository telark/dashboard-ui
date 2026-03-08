import React from 'react';
import { USERS_CONSTANTS as UC } from '../constants';
import { Icons } from '../../../../constants';
import {
  SearchOutlined,
  SettingOutlined,
  FilterOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

const UserIcon = Icons.User;
const RoleIcon = Icons.Role;
const GroupIcon = Icons.Group;

interface UseUserListConfigProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onCreateUserClick: () => void;
  selectedUsersCount?: number;
  onFilterClick?: () => void;
  onBulkDeleteClick?: () => void;
  onManageRoleClick?: () => void;
  onManageGroupClick?: () => void;
}

export const useUserListConfig = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateUserClick,
  selectedUsersCount = 0,
  onFilterClick,
  onBulkDeleteClick,
  onManageRoleClick,
  onManageGroupClick,
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
          disabled: selectedUsersCount < 2,
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
                label: UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_ROLES,
                icon: <RoleIcon size={14} />,
              },
              {
                key: 'manage-groups',
                label: UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_GROUPS,
                icon: <GroupIcon size={14} />,
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
        },
      ],
    }),
    [
      searchValue,
      onSearchChange,
      onSearchSubmit,
      onCreateUserClick,
      selectedUsersCount,
      onFilterClick,
      onBulkDeleteClick,
      onManageRoleClick,
      onManageGroupClick,
    ],
  );

  return { toolbarConfig };
};
