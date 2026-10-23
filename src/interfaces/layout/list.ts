import type React from 'react';

export interface SelectableListItemStyles {
  base?: React.CSSProperties;
  hover?: React.CSSProperties;
}

export interface SelectableListItemProps {
  value: string;
  name?: string;
  description?: string;
  customContent?: React.ReactNode;
  /** Shown at the end of the name row, e.g. the "Locked role" pill. */
  protectionBadge?: React.ReactNode;
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
  /** Why the item can't be picked, as visible text on the card (never only a hover). */
  disabledReason?: string;
}
