import React from 'react';
import { MenuProps } from 'antd';

export interface ToolbarButtonConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
  active?: boolean;
  disabled?: boolean;
  dropdown?: {
    items: MenuProps['items'];
    onItemClick?: (key: string) => void;
  };
  component?: React.ReactNode;
}

export interface ToolbarSearchConfig {
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
}

export interface ToolbarConfig {
  buttons: ToolbarButtonConfig[];
  search?: ToolbarSearchConfig;
}
