import React from 'react';
import { Tooltip } from 'antd';
import type { MenuProps } from 'antd';
import { Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { getManageCategoriesButtonConfig } from '../../categories/config';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type {
  FilterChip,
  ListToolbarProps,
  ToolbarButtonConfig,
  ToolbarConfig,
} from '../../../../interfaces/layout/toolbar';

const GroupIcon = Icons.Group;
const RoleIcon = Icons.Role;
const UserIcon = Icons.User;

const MANAGE_KEYS = {
  ROLES: 'manage-roles',
  MEMBERS: 'manage-members',
} as const;

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
  totalCount: number;
  categoriesCount: number;
  pageCount: number;
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  filterChips: FilterChip[];
  overflowChipsCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}

const manageItemLabel = (label: string, allowed: boolean, deniedTooltip: string) =>
  allowed ? (
    label
  ) : (
    <Tooltip title={deniedTooltip}>
      <span style={{ pointerEvents: 'all' }}>{label}</span>
    </Tooltip>
  );

const buildManageItems = (canAttachRole: boolean, canAttachMember: boolean): MenuProps['items'] => [
  {
    key: MANAGE_KEYS.ROLES,
    label: manageItemLabel(
      GC.LABELS.ACTIONS.MANAGE_ROLES,
      canAttachRole,
      GC.LABELS.ACTIONS.MANAGE_ROLES_DISABLED_TOOLTIP,
    ),
    icon: <RoleIcon size={14} />,
    disabled: !canAttachRole,
  },
  {
    key: MANAGE_KEYS.MEMBERS,
    label: manageItemLabel(
      GC.LABELS.ACTIONS.MANAGE_MEMBERS,
      canAttachMember,
      GC.LABELS.ACTIONS.MANAGE_MEMBERS_DISABLED_TOOLTIP,
    ),
    icon: <UserIcon size={14} />,
    disabled: !canAttachMember,
  },
];

// The categories dropdown shares the More menu with the bulk toggle.
const buildMoreButton = (
  categoriesButton: ToolbarButtonConfig,
  onToggleBulkMode: () => void,
): ToolbarButtonConfig => ({
  key: 'more',
  label: GC.LABELS.TOOLBAR.MORE,
  icon: <EllipsisOutlined />,
  variant: 'ghost',
  dropdown: {
    items: [
      {
        key: GC.KEYS.MORE_MENU_BULK,
        icon: <CheckSquareOutlined />,
        label: GC.LABELS.TOOLBAR.BULK.SELECT,
      },
      ...(categoriesButton.dropdown?.items ?? []),
    ],
    onItemClick: (key: string) => {
      if (key === GC.KEYS.MORE_MENU_BULK) onToggleBulkMode();
      else categoriesButton.dropdown?.onItemClick?.(key);
    },
  },
});

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
  totalCount,
  categoriesCount,
  pageCount,
  bulkMode,
  onToggleBulkMode,
  filterChips,
  overflowChipsCount,
  onRemoveFilterChip,
  hasActiveFilters,
  onClearAllFilters,
}: UseGroupListConfigProps): { listToolbar: ListToolbarProps } => {
  const bulkActions: ToolbarConfig = React.useMemo(
    () => ({
      buttons: [
        {
          key: 'manage-assignments',
          label: GC.LABELS.TOOLBAR.MANAGE.BUTTON_LABEL,
          icon: <SettingOutlined />,
          variant: 'default',
          iconOnly: true,
          disabled: selectedGroupsCount !== 1,
          dropdown: {
            items: buildManageItems(canAttachRole, canAttachMember),
            onItemClick: (key: string) => {
              if (key === MANAGE_KEYS.ROLES) onAttachRoleClick?.();
              if (key === MANAGE_KEYS.MEMBERS) onAttachMemberClick?.();
            },
          },
        },
        {
          key: 'bulk-delete',
          label: GC.LABELS.ACTIONS.BULK_DELETE,
          icon: <DeleteOutlined />,
          variant: 'danger',
          iconOnly: true,
          disabled: selectedGroupsCount < 2,
          onClick: () => onBulkDeleteClick?.(),
        },
      ],
    }),
    [
      canAttachMember,
      canAttachRole,
      onAttachMemberClick,
      onAttachRoleClick,
      onBulkDeleteClick,
      selectedGroupsCount,
    ],
  );

  const groupToolbars: ToolbarConfig[] = React.useMemo(() => {
    const search: ToolbarConfig = {
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
      ],
    };
    // Exiting bulk stays inline: it must never be buried behind a menu.
    const exitBulk: ToolbarConfig = {
      buttons: [
        {
          key: 'bulk-exit',
          label: GC.LABELS.TOOLBAR.BULK.EXIT,
          icon: <CheckSquareOutlined />,
          variant: 'ghost',
          onClick: onToggleBulkMode,
          active: true,
        },
      ],
    };
    const categoriesButton = getManageCategoriesButtonConfig({
      onViewCategories: () => onViewModeChange?.('categories'),
      onAddCategory: () => onAddCategoryClick?.(),
      canViewCategories: canViewGroupCategories,
      canAddCategory: canAddGroupCategory,
    });
    const more: ToolbarConfig = { buttons: [buildMoreButton(categoriesButton, onToggleBulkMode)] };
    const create: ToolbarConfig = {
      buttons: [
        {
          key: 'create-group',
          label: GC.LABELS.FORM.BUTTON_TEXT,
          icon: <GroupIcon size={14} />,
          variant: 'primary',
          onClick: () => onCreateGroupClick?.(),
          disabled: !canCreateGroup,
          tooltip: canCreateGroup ? undefined : GC.LABELS.ACTIONS.CREATE_DISABLED_TOOLTIP,
        },
      ],
    };
    return bulkMode ? [search, exitBulk, create] : [search, create, more];
  }, [
    bulkMode,
    canAddGroupCategory,
    canCreateGroup,
    canViewGroupCategories,
    onAddCategoryClick,
    onCreateGroupClick,
    onSearchChange,
    onSearchSubmit,
    onToggleBulkMode,
    onViewModeChange,
    searchValue,
  ]);

  const listToolbar: ListToolbarProps = React.useMemo(() => {
    if (viewMode === 'categories') {
      return {
        totalCount: categoriesCount,
        countSuffix: GC.LABELS.TOOLBAR.CATEGORIES_COUNT_SUFFIX,
        compactWidth: GC.SIZES.TOOLBAR_COMPACT_WIDTH,
        toolbars: [
          {
            buttons: [
              {
                key: 'add-category',
                label: CATEGORIES_CONSTANTS.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
                icon: <PlusOutlined />,
                variant: 'primary',
                onClick: () => onAddCategoryClick?.(),
                disabled: !canAddGroupCategory,
              },
            ],
          },
        ],
      };
    }
    return {
      totalCount,
      countSuffix: GC.LABELS.TOOLBAR.COUNT_SUFFIX,
      compactWidth: GC.SIZES.TOOLBAR_COMPACT_WIDTH,
      filterChips,
      overflowChipsCount,
      onRemoveFilterChip,
      hasActiveFilters,
      onClearAllFilters,
      onOpenFilters: onFilterClick,
      bulkMode,
      selection: { pageCount, selectedCount: selectedGroupsCount },
      bulkActions,
      toolbars: groupToolbars,
    };
  }, [
    bulkActions,
    bulkMode,
    canAddGroupCategory,
    categoriesCount,
    filterChips,
    groupToolbars,
    hasActiveFilters,
    onAddCategoryClick,
    onClearAllFilters,
    onFilterClick,
    onRemoveFilterChip,
    overflowChipsCount,
    pageCount,
    selectedGroupsCount,
    totalCount,
    viewMode,
  ]);

  return { listToolbar };
};
