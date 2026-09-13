import React from 'react';
import { Tooltip } from 'antd';
import {
  CheckSquareOutlined,
  DeleteOutlined,
  EllipsisOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { USERS_CONSTANTS as UC } from '../constants';
import { Icons } from '../../../../constants';
import type {
  FilterChip,
  ListToolbarProps,
  ToolbarConfig,
} from '../../../../interfaces/layout/toolbar';

const UserIcon = Icons.User;
const RoleIcon = Icons.Role;
const GroupIcon = Icons.Group;

const MANAGE_KEYS = {
  ROLES: 'manage-roles',
  GROUPS: 'manage-groups',
} as const;

interface UseUserListConfigProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit?: () => void;
  onCreateUserClick: () => void;
  canCreateUser?: boolean;
  selectedUsersCount?: number;
  onFilterClick?: () => void;
  onBulkDeleteClick?: () => void;
  onManageRoleClick?: () => void;
  onManageGroupClick?: () => void;
  canManageRole?: boolean;
  canManageGroup?: boolean;
  canBulkDeleteUser?: boolean;
  totalCount: number;
  pageCount: number;
  bulkMode: boolean;
  onToggleBulkMode: () => void;
  filterChips: FilterChip[];
  overflowChipsCount: number;
  onRemoveFilterChip: (key: string, value: string) => void;
  hasActiveFilters: boolean;
  onClearAllFilters: () => void;
}

const manageItemLabel = (label: string, allowed: boolean, deniedTooltip: string) =>
  allowed ? (
    label
  ) : (
    <Tooltip title={deniedTooltip}>
      <span style={{ pointerEvents: 'all' }}>{label}</span>
    </Tooltip>
  );

const buildManageItems = (canManageRole: boolean, canManageGroup: boolean): MenuProps['items'] => [
  {
    key: MANAGE_KEYS.ROLES,
    label: manageItemLabel(
      UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_ROLES,
      canManageRole,
      UC.LABELS.ACTIONS.MANAGE_ROLES_DISABLED_TOOLTIP,
    ),
    icon: <RoleIcon size={14} />,
    disabled: !canManageRole,
  },
  {
    key: MANAGE_KEYS.GROUPS,
    label: manageItemLabel(
      UC.LABELS.TOOLBAR.MANAGE.ITEMS.MANAGE_GROUPS,
      canManageGroup,
      UC.LABELS.ACTIONS.MANAGE_GROUPS_DISABLED_TOOLTIP,
    ),
    icon: <GroupIcon size={14} />,
    disabled: !canManageGroup,
  },
];

export const useUserListConfig = ({
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onCreateUserClick,
  canCreateUser = true,
  selectedUsersCount = 0,
  onFilterClick,
  onBulkDeleteClick,
  onManageRoleClick,
  onManageGroupClick,
  canManageRole = true,
  canManageGroup = true,
  canBulkDeleteUser = true,
  totalCount,
  pageCount,
  bulkMode,
  onToggleBulkMode,
  filterChips,
  overflowChipsCount,
  onRemoveFilterChip,
  hasActiveFilters,
  onClearAllFilters,
}: UseUserListConfigProps): { listToolbar: ListToolbarProps } => {
  const bulkActions: ToolbarConfig = React.useMemo(
    () => ({
      buttons: [
        {
          key: 'manage',
          label: UC.LABELS.TOOLBAR.MANAGE.BUTTON_LABEL,
          icon: <SettingOutlined />,
          variant: 'default',
          iconOnly: true,
          disabled: selectedUsersCount !== 1,
          dropdown: {
            items: buildManageItems(canManageRole, canManageGroup),
            onItemClick: (key: string) => {
              if (key === MANAGE_KEYS.ROLES) onManageRoleClick?.();
              if (key === MANAGE_KEYS.GROUPS) onManageGroupClick?.();
            },
          },
        },
        {
          key: 'bulk-delete',
          label: UC.LABELS.ACTIONS.BULK_DELETE,
          icon: <DeleteOutlined />,
          variant: 'danger',
          iconOnly: true,
          disabled: selectedUsersCount < 2 || !canBulkDeleteUser,
          tooltip: canBulkDeleteUser ? undefined : UC.LABELS.ACTIONS.BULK_DELETE_DISABLED_TOOLTIP,
          onClick: () => onBulkDeleteClick?.(),
        },
      ],
    }),
    [
      canBulkDeleteUser,
      canManageGroup,
      canManageRole,
      onBulkDeleteClick,
      onManageGroupClick,
      onManageRoleClick,
      selectedUsersCount,
    ],
  );

  const toolbars: ToolbarConfig[] = React.useMemo(() => {
    const search: ToolbarConfig = {
      search: {
        placeholder: UC.LABELS.TOOLBAR.SEARCH.PLACEHOLDER,
        value: searchValue,
        onChange: onSearchChange,
        onSubmit: onSearchSubmit,
      },
      buttons: [
        {
          key: 'search',
          label: UC.LABELS.TOOLBAR.SEARCH.BUTTON_LABEL,
          icon: <SearchOutlined />,
          variant: 'ghost',
        },
      ],
    };
    // Exiting bulk stays inline: it must never be buried behind a menu.
    const exitBulk: ToolbarConfig = {
      buttons: [
        {
          key: 'bulk-exit',
          label: UC.LABELS.TOOLBAR.BULK.EXIT,
          icon: <CheckSquareOutlined />,
          variant: 'ghost',
          onClick: onToggleBulkMode,
          active: true,
        },
      ],
    };
    const more: ToolbarConfig = {
      buttons: [
        {
          key: 'more',
          label: UC.LABELS.TOOLBAR.MORE,
          icon: <EllipsisOutlined />,
          variant: 'ghost',
          dropdown: {
            items: [
              {
                key: UC.KEYS.MORE_MENU_BULK,
                icon: <CheckSquareOutlined />,
                label: UC.LABELS.TOOLBAR.BULK.SELECT,
              },
            ],
            onItemClick: onToggleBulkMode,
          },
        },
      ],
    };
    const create: ToolbarConfig = {
      buttons: [
        {
          key: 'create-user',
          label: UC.LABELS.TOOLBAR.CREATE.BUTTON_LABEL,
          icon: <UserIcon size={14} />,
          variant: 'primary',
          onClick: onCreateUserClick,
          disabled: !canCreateUser,
          tooltip: canCreateUser ? undefined : UC.LABELS.TOOLBAR.CREATE.DISABLED_TOOLTIP,
        },
      ],
    };
    return bulkMode ? [search, exitBulk, create] : [search, create, more];
  }, [
    bulkMode,
    canCreateUser,
    onCreateUserClick,
    onSearchChange,
    onSearchSubmit,
    onToggleBulkMode,
    searchValue,
  ]);

  return {
    listToolbar: {
      totalCount,
      countSuffix: UC.LABELS.TOOLBAR.COUNT_SUFFIX,
      compactWidth: UC.SIZES.TOOLBAR_COMPACT_WIDTH,
      filterChips,
      overflowChipsCount,
      onRemoveFilterChip,
      hasActiveFilters,
      onClearAllFilters,
      onOpenFilters: onFilterClick,
      bulkMode,
      selection: { pageCount, selectedCount: selectedUsersCount },
      bulkActions,
      toolbars,
    },
  };
};
