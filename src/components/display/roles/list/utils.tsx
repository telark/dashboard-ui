import React from 'react';
import type { Role, RoleScopeLevel } from '../../../../interfaces/roles';
import { ROLES_PAGE_CONSTANTS as RPC } from '../../../../constants/pages/roles';
import SortHeader from './SortHeader';

export type RolesSortKey = 'name' | 'type' | 'group' | 'permission' | 'createdAt' | 'status';

export const getPermissionCount = (role: Role): number => {
  const levels = Object.values(role.scopes || {}) as Array<Array<RoleScopeLevel>>;
  return levels.reduce((acc, arr) => acc + (Array.isArray(arr) ? arr.length : 0), 0);
};

export const generateColumn = (
  cfg: {
    key: string;
    label: string;
    align?: 'left' | 'center';
    icon?: React.ReactNode;
    sortableKey?: RolesSortKey;
    width?: number;
    render?: (value: any, record: Role) => React.ReactNode;
    dataIndex?: string;
    headerBg?: string;
  },
  ctx: {
    activeSortKey: RolesSortKey;
    onSort: (key: RolesSortKey) => void;
  },
) => {
  const { key, label, align = 'center', icon, sortableKey, width, render, dataIndex, headerBg } = cfg;
  const { activeSortKey, onSort } = ctx;
  const HEADER_BG = RPC.COLORS.HEADER_BG;
  return {
    title: (
      <SortHeader
        label={label}
        align={align}
        leftIcon={icon}
        sortable={Boolean(sortableKey)}
        isActive={sortableKey ? activeSortKey === sortableKey : false}
        onSort={sortableKey ? () => onSort(sortableKey) : undefined}
      />
    ),
    key,
    ...(dataIndex ? { dataIndex } : {}),
    align: align as 'left' | 'center',
    onHeaderCell: () => ({ style: { background: headerBg ?? HEADER_BG } }),
    ...(render ? { render } : {}),
    ...(width ? { width } : {}),
  };
};


