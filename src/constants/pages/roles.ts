export const ROLES_PAGE_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Roles',
    HEADER_SUBTITLE: 'Manage existing roles',
    COLUMNS: {
      ROLE_TITLE: 'Role Title',
      TYPE: 'Type',
      GROUP: 'Group',
      PERMISSIONS: 'Permissions',
      CREATED: 'Created',
      STATUS: 'Status',
    },
    ACTIONS: {
      VIEW: 'View',
      DELETE: 'Delete',
    },
    PERMISSIONS_SUFFIX: 'permissions',
  },
  SIZES: {
    ROW_HEIGHT: 44,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
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
  GENERAL: {
    SUBTITLE: 'Provide the role details.',
    GROUP_OPTIONS: [
      { label: 'Default', value: 'default' },
      { label: 'Engineering', value: 'engineering' },
      { label: 'Operations', value: 'operations' },
      { label: 'QA', value: 'qa' },
    ],
  },
  SCOPE: {
    AREAS: [
      { key: 'groupers', label: 'Groupers' },
      { key: 'workloads', label: 'Workloads' },
      { key: 'bridges', label: 'Bridges' },
      { key: 'users', label: 'Users' },
      { key: 'roles', label: 'Roles' },
      { key: 'settings', label: 'Settings' },
    ] as const,
    LEVELS: ['View', 'Edit', 'Delete'] as const,
    TOOLTIP: {
      View: 'Read-only access to view data and settings.',
      Edit: 'Can create and update within assigned scope.',
      Delete: 'Can remove resources within assigned scope. Use with caution.',
    } as const,
  },
} as const;

export type RolesPageConstants = typeof ROLES_PAGE_CONSTANTS;


