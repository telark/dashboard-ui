import React from 'react';
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  PlusOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import { ROLES_CONSTANTS as RC } from '../constants';
import { Icons } from '../../../../constants';
import { getManageCategoriesButtonConfig } from '../../categories/config';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import type {
  FilterChip,
  ListToolbarProps,
  ToolbarConfig,
} from '../../../../interfaces/layout/toolbar';

const RoleIcon = Icons.Role;

type ViewMode = 'roles' | 'categories';

interface UseRoleListConfigProps {
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onCreateRoleClick: () => void;
  canCreateRole?: boolean;
  onFilterClick?: () => void;
  onAddCategoryClick?: () => void;
  canViewRoleCategories?: boolean;
  canAddRoleCategory?: boolean;
  totalCount: number;
  pageCount: number;
  selectedRolesCount: number;
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  onBulkDeleteClick: () => void;
  canBulkDeleteRole: boolean;
  selectionHasProtectedRole: boolean;
  filterChips: FilterChip[];
  overflowChipsCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}

const bulkDeleteTooltip = (canDelete: boolean, hasProtected: boolean): string | undefined => {
  if (!canDelete) return RC.LABELS.ACTIONS.DELETE_PERMISSION_DENIED_TOOLTIP;
  if (hasProtected) return RC.LABELS.ACTIONS.BULK_DELETE_PROTECTED_TOOLTIP;
  return undefined;
};

export const useRoleListConfig = ({
  viewMode = 'roles',
  onViewModeChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateRoleClick,
  canCreateRole = true,
  onFilterClick,
  onAddCategoryClick,
  canViewRoleCategories = true,
  canAddRoleCategory = true,
  totalCount,
  pageCount,
  selectedRolesCount,
  bulkMode,
  onToggleBulkMode,
  onBulkDeleteClick,
  canBulkDeleteRole,
  selectionHasProtectedRole,
  filterChips,
  overflowChipsCount,
  onRemoveFilterChip,
  hasActiveFilters,
  onClearAllFilters,
}: UseRoleListConfigProps): { listToolbar: ListToolbarProps } => {
  const isCategoriesView = viewMode === 'categories';

  const bulkActions: ToolbarConfig = React.useMemo(
    () => ({
      buttons: [
        {
          key: 'bulk-delete',
          label: RC.LABELS.ACTIONS.BULK_DELETE,
          icon: <DeleteOutlined />,
          variant: 'danger',
          iconOnly: true,
          disabled: selectedRolesCount < 2 || !canBulkDeleteRole || selectionHasProtectedRole,
          tooltip: bulkDeleteTooltip(canBulkDeleteRole, selectionHasProtectedRole),
          onClick: onBulkDeleteClick,
        },
      ],
    }),
    [canBulkDeleteRole, onBulkDeleteClick, selectedRolesCount, selectionHasProtectedRole],
  );

  const toolbars: ToolbarConfig[] = React.useMemo(() => {
    const addCategory: ToolbarConfig = {
      buttons: [
        {
          key: 'add-category',
          label: CATEGORIES_CONSTANTS.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
          icon: <PlusOutlined />,
          variant: 'primary',
          onClick: () => onAddCategoryClick?.(),
          disabled: !canAddRoleCategory,
        },
      ],
    };
    if (isCategoriesView) return [addCategory];

    const search: ToolbarConfig = {
      search: {
        placeholder: RC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
        onSubmit: onSearchSubmit,
      },
      buttons: [
        {
          key: 'search',
          label: RC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
      ],
    };
    // Category management is secondary to the role list, so it sits behind More.
    const manageCategories = getManageCategoriesButtonConfig({
      onViewCategories: () => onViewModeChange?.('categories'),
      onAddCategory: () => onAddCategoryClick?.(),
      canViewCategories: canViewRoleCategories,
      canAddCategory: canAddRoleCategory,
    });
    // Exiting bulk stays inline: it must never be buried behind a menu.
    const exitBulk: ToolbarConfig = {
      buttons: [
        {
          key: 'bulk-exit',
          label: RC.LABELS.TOOLBAR.BULK.EXIT,
          icon: <CheckSquareOutlined />,
          variant: 'ghost',
          onClick: onToggleBulkMode,
          active: true,
        },
      ],
    };
    const more: ToolbarConfig = {
      buttons: [
        {
          key: 'more',
          label: RC.LABELS.TOOLBAR.MORE,
          icon: <EllipsisOutlined />,
          variant: 'ghost',
          dropdown: {
            items: [
              {
                key: RC.KEYS.MORE_MENU_BULK,
                icon: <CheckSquareOutlined />,
                label: RC.LABELS.TOOLBAR.BULK.SELECT,
              },
              ...(manageCategories.dropdown?.items ?? []),
            ],
            onItemClick: (key: string) => {
              if (key === RC.KEYS.MORE_MENU_BULK) onToggleBulkMode();
              else manageCategories.dropdown?.onItemClick?.(key);
            },
          },
        },
      ],
    };
    const create: ToolbarConfig = {
      buttons: [
        {
          key: 'create-role',
          label: RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
          icon: <RoleIcon size={14} />,
          variant: 'primary',
          onClick: onCreateRoleClick,
          disabled: !canCreateRole,
          tooltip: canCreateRole ? undefined : RC.LABELS.ACTIONS.CREATE_DISABLED_TOOLTIP,
        },
      ],
    };
    return bulkMode ? [search, exitBulk, create] : [search, create, more];
  }, [
    isCategoriesView,
    bulkMode,
    onToggleBulkMode,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateRoleClick,
    canCreateRole,
    onViewModeChange,
    onAddCategoryClick,
    canViewRoleCategories,
    canAddRoleCategory,
  ]);

  if (isCategoriesView) {
    return {
      listToolbar: {
        totalCount,
        countSuffix: RC.LABELS.TOOLBAR.CATEGORIES_COUNT_SUFFIX,
        compactWidth: RC.SIZES.TOOLBAR_COMPACT_WIDTH,
        toolbars,
      },
    };
  }

  return {
    listToolbar: {
      totalCount,
      countSuffix: RC.LABELS.TOOLBAR.COUNT_SUFFIX,
      compactWidth: RC.SIZES.TOOLBAR_COMPACT_WIDTH,
      filterChips,
      overflowChipsCount,
      onRemoveFilterChip,
      hasActiveFilters,
      onClearAllFilters,
      onOpenFilters: onFilterClick,
      bulkMode,
      selection: { pageCount, selectedCount: selectedRolesCount },
      bulkActions,
      toolbars,
    },
  };
};
