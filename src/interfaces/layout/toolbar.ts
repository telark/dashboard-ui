import React from 'react';
import { MenuProps } from 'antd';

export interface ToolbarButtonConfig {
  key: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'primary' | 'ghost';
  active?: boolean;
  dropdown?: {
    items: MenuProps['items'];
    onItemClick?: (key: string) => void;
  };
}

export interface ToolbarConfig {
  buttons: ToolbarButtonConfig[];
}
