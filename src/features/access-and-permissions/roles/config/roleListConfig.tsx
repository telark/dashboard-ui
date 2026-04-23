import React from 'react';
import { ROLES_CONSTANTS as RC } from '../constants';
import { Icons } from '../../../../constants';
import { getManageCategoriesButtonConfig } from '../../categories/config';
import { CATEGORIES_CONSTANTS } from '../../categories/constants';
import { SearchOutlined, FilterOutlined, PlusOutlined } from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';

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
}

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
}: UseRoleListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(() => {
    const isCategoriesView = viewMode === 'categories';

    return {
      search: isCategoriesView
        ? undefined
        : {
            placeholder: RC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
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
              disabled: !canAddRoleCategory,
            },
          ]
        : [
            {
              key: 'search',
              label: RC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
              icon: <SearchOutlined />,
              variant: 'ghost' as const,
            },
            {
              key: 'filter',
              label: RC.LABELS.TOOLBAR.FILTER.BUTTON_LABEL,
              icon: <FilterOutlined />,
              variant: 'ghost' as const,
              onClick: () => onFilterClick?.(),
            },
            getManageCategoriesButtonConfig({
              onViewCategories: () => onViewModeChange?.('categories'),
              onAddCategory: () => onAddCategoryClick?.(),
              canViewCategories: canViewRoleCategories,
              canAddCategory: canAddRoleCategory,
            }),
            {
              key: 'create-role',
              label: RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
              icon: <RoleIcon size={14} />,
              variant: 'primary' as const,
              onClick: onCreateRoleClick,
              disabled: !canCreateRole,
            },
          ],
    };
  }, [
    viewMode,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateRoleClick,
    canCreateRole,
    onFilterClick,
    onViewModeChange,
    onAddCategoryClick,
    canViewRoleCategories,
    canAddRoleCategory,
  ]);

  return { toolbarConfig };
};
