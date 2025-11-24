import React from 'react';
import SortHeader from './Sort';
import { TABLE_DEFAULTS } from './constants';
import type { GenerateColumnCtx } from '../../../interfaces/layout/table';

export const generateColumn = (
  cfg: {
    key: string;
    label: string;
    align?: 'left' | 'center';
    icon?: React.ReactNode;
    width?: number;
    render?: (value: any, record: any) => React.ReactNode;
    headerBg?: string;
    activeColor?: string;
    inactiveColor?: string;
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
  } = cfg;
  const { activeSortKey, onSort } = ctx;
  const HEADER_BG = headerBg ?? TABLE_DEFAULTS.HEADER_BG;
  return {
    title: (
      <SortHeader
        label={label}
        align={align}
        leftIcon={icon}
        sortable={true}
        isActive={key ? activeSortKey === key : false}
        onSort={key ? () => onSort(key) : undefined}
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
