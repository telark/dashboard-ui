import React from 'react';
import { ROLES_CONSTANTS as RC } from '../constants';
import { Icons } from '../../../../constants';
import { SearchOutlined, FilterOutlined, AppstoreOutlined, PlusOutlined } from '@ant-design/icons';
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
  onFilterClick?: () => void;
  onAddCategoryClick?: () => void;
}

export const useRoleListConfig = ({
  viewMode = 'roles',
  onViewModeChange,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateRoleClick,
  onFilterClick,
  onAddCategoryClick,
}: UseRoleListConfigProps) => {
  const toolbarConfig: ToolbarConfig = React.useMemo(
    () => ({
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
        {
          key: 'filter',
          label: RC.LABELS.TOOLBAR.FILTER.BUTTON_LABEL,
          icon: <FilterOutlined />,
          variant: 'ghost',
          onClick: () => onFilterClick?.(),
        },
        {
          key: 'manage-categories',
          label: RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.BUTTON_LABEL,
          icon: <AppstoreOutlined />,
          variant: 'default',
          dropdown: {
            items: [
              {
                key: 'view-categories',
                label:
                  viewMode === 'categories'
                    ? RC.LABELS.HEADER_TITLE
                    : RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.VIEW_CATEGORIES,
                icon: <AppstoreOutlined />,
              },
              {
                key: 'add-category',
                label: RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
                icon: <PlusOutlined />,
              },
            ],
            onItemClick: (key: string) => {
              if (key === 'view-categories') {
                onViewModeChange?.(viewMode === 'categories' ? 'roles' : 'categories');
              } else if (key === 'add-category') {
                onAddCategoryClick?.();
              }
            },
          },
        },
        {
          key: 'create-role',
          label: RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
          icon: <RoleIcon size={14} />,
          variant: 'primary',
          onClick: onCreateRoleClick,
        },
      ],
    }),
    [
      viewMode,
      searchValue,
      onSearchChange,
      onSearchSubmit,
      onCreateRoleClick,
      onFilterClick,
      onViewModeChange,
      onAddCategoryClick,
    ],
  );

  return { toolbarConfig };
};
