import type React from 'react';

export interface SelectableListItemStyles {
  base?: React.CSSProperties;
  hover?: React.CSSProperties;
}

export interface ProtectionIconPosition {
  top?: number;
  right?: number;
}

export interface SelectableListItemProps {
  value: string;
  name?: string;
  description?: string;
  customContent?: React.ReactNode;
  isProtected?: boolean;
  protectionIcon?: React.ReactNode;
  protectionTooltip?: string;
  protectionIconColor?: string;
  protectionIconSize?: number;
  protectionIconPosition?: ProtectionIconPosition;
  itemStyles?: SelectableListItemStyles;
  contentStyles?: React.CSSProperties;
  nameStyles?: React.CSSProperties;
  descriptionStyles?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  checkboxStyle?: React.CSSProperties;
  children?: React.ReactNode;
  disabled?: boolean;
}
