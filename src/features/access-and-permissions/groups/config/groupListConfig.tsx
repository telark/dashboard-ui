import React from 'react';
import { useNavigate } from 'react-router-dom';
import { APP_ROUTES, Icons } from '../../../../constants';
import { GROUPS_CONSTANTS as GC } from '../constants';
import { SearchOutlined, AppstoreOutlined, PlusOutlined, FilterOutlined } from '@ant-design/icons';
import type { ToolbarConfig } from '../../../../interfaces/layout/toolbar';
import type { FilterSectionConfig } from '../../../../interfaces/layout/filters';
import type { FilterOption } from '../../../../interfaces/layout/filters';

const GroupIcon = Icons.Group;

interface UseGroupListConfigProps {
  categoryFilterOptions: FilterOption[];
  selectedCategory: string;
  onCategoryChange: (value: string) => void;
  viewMode?: 'groups' | 'categories';
  onViewModeChange?: (mode: 'groups' | 'categories') => void;
}

export const useGroupListConfig = ({
  categoryFilterOptions,
  selectedCategory,
  onCategoryChange,
  viewMode = 'groups',
  onViewModeChange,
}: UseGroupListConfigProps) => {
  const navigate = useNavigate();

  const filterSectionConfig: FilterSectionConfig | undefined = React.useMemo(
    () => {
      if (viewMode === 'categories') return undefined;
      return {
        label: 'Categories',
        options: categoryFilterOptions,
        selectedValue: selectedCategory,
        onChange: (value: string) => {
          onCategoryChange(value);
        },
      };
    },
    [categoryFilterOptions, selectedCategory, onCategoryChange, viewMode],
  );

  const toolbarConfig: ToolbarConfig = React.useMemo(
    () => ({
        buttons: [
          {
            key: 'search',
            label: 'Search',
            icon: <SearchOutlined />,
            variant: 'ghost',
            onClick: () => {
              // TODO: Implement search functionality
            },
          },
          {
            key: 'filter',
            label: 'Filter',
            icon: <FilterOutlined />,
            variant: 'ghost',
            onClick: () => {
              // TODO: Implement filter functionality
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
            key: 'create-group',
            label: GC.LABELS.FORM.BUTTON_TEXT,
            icon: <GroupIcon size={14} />,
            variant: 'primary',
            onClick: () => navigate(APP_ROUTES.GROUP_CREATE),
          },
        ],
    }),
    [navigate, onViewModeChange],
  );

  return {
    filterSectionConfig,
    toolbarConfig,
  };
};
