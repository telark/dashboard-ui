import React from 'react';
import { Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import {
  SearchOutlined,
  AppstoreOutlined,
  PlusOutlined,
  FilterOutlined,
  DeleteOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

const GroupIcon = Icons.Group;
const RoleIcon = Icons.Role;
const UserIcon = Icons.User;

interface UseGroupListConfigProps {
  viewMode?: 'groups' | 'categories';
  onViewModeChange?: (mode: 'groups' | 'categories') => void;
  onCreateGroupClick?: () => void;
  selectedGroupsCount?: number;
  onBulkDeleteClick?: () => void;
  onAttachRoleClick?: () => void;
  onAttachMemberClick?: () => void;
  onFilterClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
}

export const useGroupListConfig = ({
  onViewModeChange,
  onCreateGroupClick,
  selectedGroupsCount = 0,
  onBulkDeleteClick,
  onAttachRoleClick,
  onAttachMemberClick,
  onFilterClick,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: UseGroupListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(
    () => ({
      search: {
        placeholder: GC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
        onSubmit: onSearchSubmit,
      },
      buttons: [
        {
          key: 'search',
          label: GC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
        {
          key: 'filter',
          label: GC.LABELS.TOOLBAR.FILTER.BUTTON_LABEL,
          icon: <FilterOutlined />,
          variant: 'ghost',
          onClick: () => {
            onFilterClick?.();
          },
        },
        {
          key: 'bulk-delete',
          label: GC.LABELS.ACTIONS.BULK_DELETE,
          icon: <DeleteOutlined />,
          variant: 'default',
          disabled: selectedGroupsCount < 2,
          onClick: () => {
            onBulkDeleteClick?.();
          },
        },
        {
          key: 'manage-categories',
          label: 'Manage Categories',
          icon: <AppstoreOutlined />,
          variant: 'default',
          dropdown: {
            items: [
              {
                key: 'view-categories',
                label: 'View Categories',
                icon: <AppstoreOutlined />,
              },
              {
                key: 'add-category',
                label: 'Add Category',
                icon: <PlusOutlined />,
              },
            ],
            onItemClick: (key: string) => {
              if (key === 'view-categories') {
                onViewModeChange?.('categories');
              } else if (key === 'add-category') {
                // TODO: Open add category modal or navigate to create category page
              }
            },
          },
        },
        {
          key: 'manage-assignments',
          label: GC.LABELS.TOOLBAR.MANAGE.BUTTON_LABEL,
          icon: <SettingOutlined />,
          variant: 'default',
          disabled: selectedGroupsCount !== 1,
          dropdown: {
            items: [
              {
                key: 'manage-roles',
                label: GC.LABELS.ACTIONS.MANAGE_ROLES,
                icon: <RoleIcon size={14} />,
              },
              {
                key: 'manage-members',
                label: GC.LABELS.ACTIONS.MANAGE_MEMBERS,
                icon: <UserIcon size={14} />,
              },
            ],
            onItemClick: (key: string) => {
              if (key === 'manage-roles') {
                onAttachRoleClick?.();
              } else if (key === 'manage-members') {
                onAttachMemberClick?.();
              }
            },
          },
        },
        {
          key: 'create-group',
          label: GC.LABELS.FORM.BUTTON_TEXT,
          icon: <GroupIcon size={14} />,
          variant: 'primary',
          onClick: () => {
            onCreateGroupClick?.();
          },
        },
      ],
    }),
    [
      onViewModeChange,
      onCreateGroupClick,
      selectedGroupsCount,
      onBulkDeleteClick,
      onAttachRoleClick,
      onAttachMemberClick,
      onFilterClick,
      searchValue,
      onSearchChange,
      onSearchSubmit,
    ],
  );

  return {
    toolbarConfig,
  };
};
