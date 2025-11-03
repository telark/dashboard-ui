export const ROLE_SCOPE_PERMISSIONS = ['View', 'Edit', 'Delete'] as const;
export type RoleScopePermission = typeof ROLE_SCOPE_PERMISSIONS[number];

export const ROLES_PAGE_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Roles',
    HEADER_SUBTITLE: 'Manage existing roles',
    COLUMNS: {
      ROLE_TITLE: 'Role Title',
      TYPE: 'Type',
      GROUP: 'Group',
      CATEGORY: 'Category',
      PERMISSIONS: 'Permissions',
      CREATED: 'Created',
      STATUS: 'Status',
    },
    ACTIONS: {
      VIEW: 'View',
      DELETE: 'Delete',
    },
    PERMISSIONS_SUFFIX: 'permissions',
    CUSTOM_TYPE: 'custom',
    STATUS_ACTIVE: 'Active',
    STATUS_INACTIVE: 'Inactive',
    DELETE_MODAL_TITLE: 'Delete Role',
    DELETE_MODAL_CONTENT: (name: string) => `Are you sure you want to delete "${name}"?`,
    DELETE_MODAL_OK: 'Delete',
  },
  KEYS: {
    NAME: 'name',
    TYPE: 'type',
    GROUP: 'group',
    CATEGORY: 'category',
    PERMISSION: 'permission',
    CREATED_AT: 'createdAt',
    STATUS: 'status',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 44,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      ROLE_TITLE: 110,
      TYPE: 100,
      GROUP: 100,
      CATEGORY: 100,
      PERMISSIONS: 100,
      CREATED: 100,
      STATUS: 100,
      ACTIONS: 50,
    },
  },
  COLORS: {
    HEADER_BG: '#fff',
    CHIP_BLUE_BG: '#0ea5e930',
    CHIP_BLUE_TEXT: '#0369a1',
    TYPE_BUILTIN_BG: '#bfdbfe80',
    TYPE_BUILTIN_TEXT: '#1d4ed8',
    TYPE_CUSTOM_BG: '#bbf7d080',
    TYPE_CUSTOM_TEXT: '#047857',
    STATUS_ACTIVE_BG: '#0ea5e930',
    STATUS_ACTIVE_TEXT: '#0369a1',
    STATUS_INACTIVE_BG: '#fca5a530',
    STATUS_INACTIVE_TEXT: '#b91c1c',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_MUTED: '#64748b',
    SORT_ACTIVE: '#0ea5e9',
    SORT_MUTED: '#94a3b8',
  },
  VALUES: {
    ROLE_TYPE_BUILT_IN: 'built-in',
    ROLE_TYPE_CUSTOM: 'custom',
  },
  GENERAL: {
    TITLE: 'General',
    SUBTITLE: 'Provide the role details.',
    CATEGORY_LABEL: 'Role Category',
    CATEGORY_OPTIONS: [
      { label: 'General', value: 'general' },
      { label: 'Administration', value: 'administration' },
      { label: 'Operations', value: 'operations' },
      { label: 'Security', value: 'security' },
    ],
    GROUP_OPTIONS: [
      { label: 'Default', value: 'default' },
      { label: 'Engineering', value: 'engineering' },
      { label: 'Operations', value: 'operations' },
      { label: 'QA', value: 'qa' },
    ],
  },
  SCOPE: {
    TITLE: 'Scope & Permissions',
    SUBTITLE: 'Define what areas this role can access and at what level.',
    AREAS: [
      { key: 'groupers', label: 'Groupers' },
      { key: 'workloads', label: 'Workloads' },
      { key: 'bridges', label: 'Bridges' },
      { key: 'users', label: 'Users' },
      { key: 'roles', label: 'Roles' },
      { key: 'settings', label: 'Settings' },
    ] as const,
    PERMISSIONS: ROLE_SCOPE_PERMISSIONS,
    TOOLTIP: {
      View: 'Read-only access to view data and settings.',
      Edit: 'Can create and update within assigned scope.',
      Delete: 'Can remove resources within assigned scope. Use with caution.',
    } as Record<RoleScopePermission, string>,
  },
  STATUS: {ACTIVE: 'Active', INACTIVE: 'Inactive'},
  TYPE: {BUILT_IN: 'built-in', CUSTOM: 'custom'},
} as const;

export type RolesPageConstants = typeof ROLES_PAGE_CONSTANTS;

export type RoleStatus = typeof ROLES_PAGE_CONSTANTS.STATUS[keyof typeof ROLES_PAGE_CONSTANTS.STATUS];
export type RoleType = typeof ROLES_PAGE_CONSTANTS.TYPE[keyof typeof ROLES_PAGE_CONSTANTS.TYPE];


