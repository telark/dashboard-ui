import React from 'react';
import { Tooltip } from 'antd';
import { Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { getManageCategoriesButtonConfig } from '../../categories/config';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import {
  SearchOutlined,
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
  canCreateGroup?: boolean;
  onAddCategoryClick?: () => void;
  selectedGroupsCount?: number;
  onBulkDeleteClick?: () => void;
  onAttachRoleClick?: () => void;
  onAttachMemberClick?: () => void;
  canAttachRole?: boolean;
  canAttachMember?: boolean;
  canViewGroupCategories?: boolean;
  canAddGroupCategory?: boolean;
  onFilterClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
}

export const useGroupListConfig = ({
  viewMode = 'groups',
  onViewModeChange,
  onCreateGroupClick,
  canCreateGroup = true,
  onAddCategoryClick,
  selectedGroupsCount = 0,
  onBulkDeleteClick,
  onAttachRoleClick,
  onAttachMemberClick,
  canAttachRole = true,
  canAttachMember = true,
  canViewGroupCategories = true,
  canAddGroupCategory = true,
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
              label: CATEGORIES_CONSTANTS.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
              icon: <PlusOutlined />,
              variant: 'primary' as const,
              onClick: () => onAddCategoryClick?.(),
              disabled: !canAddGroupCategory,
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
            getManageCategoriesButtonConfig({
              onViewCategories: () => onViewModeChange?.('categories'),
              onAddCategory: () => onAddCategoryClick?.(),
              canViewCategories: canViewGroupCategories,
              canAddCategory: canAddGroupCategory,
            }),
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
                    label: !canAttachRole ? (
                      <Tooltip title={GC.LABELS.ACTIONS.MANAGE_ROLES_DISABLED_TOOLTIP}>
                        <span style={{ pointerEvents: 'all' }}>{GC.LABELS.ACTIONS.MANAGE_ROLES}</span>
                      </Tooltip>
                    ) : GC.LABELS.ACTIONS.MANAGE_ROLES,
                    icon: <RoleIcon size={14} />,
                    disabled: !canAttachRole,
                  },
                  {
                    key: 'manage-members',
                    label: !canAttachMember ? (
                      <Tooltip title={GC.LABELS.ACTIONS.MANAGE_MEMBERS_DISABLED_TOOLTIP}>
                        <span style={{ pointerEvents: 'all' }}>{GC.LABELS.ACTIONS.MANAGE_MEMBERS}</span>
                      </Tooltip>
                    ) : GC.LABELS.ACTIONS.MANAGE_MEMBERS,
                    icon: <UserIcon size={14} />,
                    disabled: !canAttachMember,
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
              disabled: !canCreateGroup,
              tooltip: !canCreateGroup ? GC.LABELS.ACTIONS.CREATE_DISABLED_TOOLTIP : undefined,
            },
          ],
    };
  }, [
    viewMode,
    onViewModeChange,
    onCreateGroupClick,
    canCreateGroup,
    onAddCategoryClick,
    selectedGroupsCount,
    onBulkDeleteClick,
    onAttachRoleClick,
    onAttachMemberClick,
    canAttachRole,
    canAttachMember,
    canViewGroupCategories,
    canAddGroupCategory,
    onFilterClick,
    searchValue,
    onSearchChange,
    onSearchSubmit,
  ]);

  return {
    toolbarConfig,
  };
};
