import React from 'react';
import SortHeader from './Sort';
import { TABLE_DEFAULTS } from './constants';
import type { GenerateColumnCtx } from '../../../interfaces/layout/table';

export const generateColumn = <V = unknown, T = unknown>(
  cfg: {
    key: string;
    label: string;
    align?: 'left' | 'center';
    icon?: React.ReactNode;
    width?: number;
    render?: (value: V, record: T) => React.ReactNode;
    headerBg?: string;
    activeColor?: string;
    inactiveColor?: string;
    sortable?: boolean;
  },
  ctx: GenerateColumnCtx,
) => {
  const {
    key,
    label,
    align = TABLE_DEFAULTS.HEADER_ALIGN_DEFAULT,
    icon,
    width,
    render,
    headerBg,
    activeColor,
    inactiveColor,
    sortable = true,
  } = cfg;
  const { activeSortKey, onSort } = ctx;
  const HEADER_BG = headerBg ?? TABLE_DEFAULTS.HEADER_BG;
  const isActive = key ? activeSortKey === key : false;
  const handleSort = key ? () => onSort(key) : undefined;
  return {
    title: (
      <SortHeader
        key={`${key}-${isActive ? 'active' : 'inactive'}-${activeSortKey}`}
        label={label}
        align={align}
        leftIcon={icon}
        sortable={sortable}
        isActive={isActive}
        onSort={handleSort}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
      />
    ),
    key,
    dataIndex: key,
    align,
    onHeaderCell: () => ({ style: { background: HEADER_BG } }),
    ...(render ? { render } : {}),
    ...(width ? { width } : {}),
  };
};

// Pinned to the right edge: when the columns outgrow the page, the others scroll sideways
// under it and the row actions stay in view.
export const generateActionsColumn = <T,>(
  key: string,
  width: number,
  render: (record: T) => React.ReactNode,
) => ({
  title: '',
  key,
  align: 'right' as const,
  width,
  fixed: 'right' as const,
  onHeaderCell: () => ({ style: { background: TABLE_DEFAULTS.HEADER_BG } }),
  render: (_: unknown, record: T) => render(record),
});
