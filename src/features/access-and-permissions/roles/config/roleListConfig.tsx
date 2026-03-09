import React from 'react';
import { ROLES_CONSTANTS as RC } from '../constants';
import { Icons } from '../../../../constants';
import {
  SearchOutlined,
  FilterOutlined,
  TagOutlined,
  EyeOutlined,
  PlusOutlined,
} from '@ant-design/icons';
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
              label: RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
              icon: <PlusOutlined />,
              variant: 'primary' as const,
              onClick: () => onAddCategoryClick?.(),
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
            {
              key: 'manage-categories',
              label: RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.BUTTON_LABEL,
              icon: <TagOutlined />,
              variant: 'default' as const,
              dropdown: {
                items: [
                  {
                    key: 'view-categories',
                    label: RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.VIEW_CATEGORIES,
                    icon: <EyeOutlined />,
                  },
                  {
                    key: 'add-category',
                    label: RC.LABELS.TOOLBAR.MANAGE_CATEGORIES.ADD_CATEGORY,
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
              key: 'create-role',
              label: RC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
              icon: <RoleIcon size={14} />,
              variant: 'primary' as const,
              onClick: onCreateRoleClick,
            },
          ],
    };
  }, [
    viewMode,
    searchValue,
    onSearchChange,
    onSearchSubmit,
    onCreateRoleClick,
    onFilterClick,
    onViewModeChange,
    onAddCategoryClick,
  ]);

  return { toolbarConfig };
};
