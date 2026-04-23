import React from 'react';
import { TagOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons';
import { CATEGORIES_CONSTANTS } from '../constants';
import type { ToolbarButtonConfig } from '../../../../interfaces/layout/toolbar';

const LABELS = CATEGORIES_CONSTANTS.LABELS.TOOLBAR.MANAGE_CATEGORIES;

export interface ManageCategoriesButtonConfigParams {
  onViewCategories: () => void;
  onAddCategory: () => void;
  canViewCategories?: boolean;
}

/**
 * Returns the toolbar button config for the generic "Manage Categories" dropdown
 * (View Categories + Add Category). Use in roles, groups, or any feature that lists categories by scope.
 */
export function getManageCategoriesButtonConfig({
  onViewCategories,
  onAddCategory,
  canViewCategories = true,
}: ManageCategoriesButtonConfigParams): ToolbarButtonConfig {
  return {
    key: 'manage-categories',
    label: LABELS.BUTTON_LABEL,
    icon: <TagOutlined />,
    variant: 'default',
    dropdown: {
      items: [
        {
          key: 'view-categories',
          label: LABELS.VIEW_CATEGORIES,
          icon: <EyeOutlined />,
          disabled: !canViewCategories,
        },
        {
          key: 'add-category',
          label: LABELS.ADD_CATEGORY,
          icon: <PlusOutlined />,
        },
      ],
      onItemClick: (key: string) => {
        if (key === 'view-categories') {
          onViewCategories();
        } else if (key === 'add-category') {
          onAddCategory();
        }
      },
    },
  };
}
