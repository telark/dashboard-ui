import React from 'react';
import { Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import {
  SearchOutlined,
  TagOutlined,
  EyeOutlined,
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
  onAddCategoryClick?: () => void;
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
  viewMode = 'groups',
  onViewModeChange,
  onCreateGroupClick,
  onAddCategoryClick,
  selectedGroupsCount = 0,
  onBulkDeleteClick,
  onAttachRoleClick,
  onAttachMemberClick,
  onFilterClick,
  searchValue,
  onSearchChange,
  onSearchSubmit,
}: UseGroupListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(() => {
    const isCategoriesView = viewMode === 'categories';

    return {
      search: isCategoriesView
        ? undefined
        : {
            placeholder: GC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
            value: searchValue,
            onChange: onSearchChange,
            onSubmit: onSearchSubmit,
          },
      buttons: isCategoriesView
        ? [
            {
              key: 'add-category',
              label: GC.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
              icon: <PlusOutlined />,
              variant: 'primary' as const,
              onClick: () => onAddCategoryClick?.(),
            },
          ]
        : [
            {
              key: 'search',
              label: GC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
              icon: <SearchOutlined />,
              variant: 'ghost' as const,
            },
            {
              key: 'filter',
              label: GC.LABELS.TOOLBAR.FILTER.BUTTON_LABEL,
              icon: <FilterOutlined />,
              variant: 'ghost' as const,
              onClick: () => onFilterClick?.(),
            },
            {
              key: 'bulk-delete',
              label: GC.LABELS.ACTIONS.BULK_DELETE,
              icon: <DeleteOutlined />,
              variant: 'danger' as const,
              disabled: selectedGroupsCount < 2,
              onClick: () => onBulkDeleteClick?.(),
            },
            {
              key: 'manage-categories',
              label: GC.LABELS.TOOLBAR.MANAGE_CATEGORIES.BUTTON_LABEL,
              icon: <TagOutlined />,
              variant: 'default' as const,
              dropdown: {
                items: [
                  {
                    key: 'view-categories',
                    label: GC.LABELS.TOOLBAR.MANAGE_CATEGORIES.VIEW_CATEGORIES,
                    icon: <EyeOutlined />,
                  },
                  {
                    key: 'add-category',
                    label: GC.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
                    icon: <PlusOutlined />,
                  },
                ],
                onItemClick: (key: string) => {
                  if (key === 'view-categories') {
                    onViewModeChange?.('categories');
                  } else if (key === 'add-category') {
                    onAddCategoryClick?.();
                  }
                },
              },
            },
            {
              key: 'manage-assignments',
              label: GC.LABELS.TOOLBAR.MANAGE.BUTTON_LABEL,
              icon: <SettingOutlined />,
              variant: 'default' as const,
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
              variant: 'primary' as const,
              onClick: () => onCreateGroupClick?.(),
            },
          ],
    };
  }, [
    viewMode,
    onViewModeChange,
    onCreateGroupClick,
    onAddCategoryClick,
    selectedGroupsCount,
    onBulkDeleteClick,
    onAttachRoleClick,
    onAttachMemberClick,
    onFilterClick,
    searchValue,
    onSearchChange,
    onSearchSubmit,
  ]);

  return {
    toolbarConfig,
  };
};
