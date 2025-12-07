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
}

export const useGroupListConfig = ({
  categoryFilterOptions,
  selectedCategory,
  onCategoryChange,
}: UseGroupListConfigProps) => {
  const navigate = useNavigate();

  const filterSectionConfig: FilterSectionConfig = React.useMemo(
    () => ({
      label: 'Categories',
      options: categoryFilterOptions,
      selectedValue: selectedCategory,
      onChange: (value: string) => {
        onCategoryChange(value);
      },
    }),
    [categoryFilterOptions, selectedCategory, onCategoryChange],
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
            console.log('Search clicked');
          },
        },
        {
          key: 'filter',
          label: 'Filter',
          icon: <FilterOutlined />,
          variant: 'ghost',
          onClick: () => {
            // TODO: Implement filter functionality
            console.log('Filter clicked');
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
                // TODO: Navigate to view categories page
                console.log('View categories clicked');
              } else if (key === 'add-category') {
                // TODO: Open add category modal or navigate to create category page
                console.log('Add category clicked');
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
    [navigate],
  );

  return {
    filterSectionConfig,
    toolbarConfig,
  };
};
