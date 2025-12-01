import type { RoleScopePermission, PermissionLevel, ValidityType } from '../models/types';

export const SCOPE_PERMISSIONS = ['View', 'Edit', 'Delete'] as const;
export const PERMISSION_LEVELS = ['ReadOnly', 'Contributor', 'Owner', 'Admin'] as const;
export const VALIDITY_TYPES = ['permanent', 'temporary', 'sessionBased'] as const;
export const ROLES_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Roles',
    HEADER_SUBTITLE: 'Manage existing roles',
    VIEW_SUBTITLE: 'View role details',
    EDIT_SUBTITLE: 'Edit role details',
    CREATE_SUBTITLE: 'Create a new role',
    NOT_FOUND: 'Role not found',
    CREATE_BUTTON: 'Add Role',
    UPDATE_BUTTON: 'Update Role',
    CREATE_BUTTON_TEXT: 'Create Role',
    BREADCRUMBS: {
      ROLES: 'Roles',
      EDIT: 'Edit',
      CREATE: 'Create Role',
    },
    MESSAGES: {
      CREATED: (name: string) => `Role "${name}" created`,
      UPDATED: (name: string) => `Role "${name}" updated`,
      DELETED: 'Role deleted successfully',
      CREATE_FAILED: 'Failed to create role',
      UPDATE_FAILED: 'Failed to update role',
      DELETE_FAILED: 'Failed to delete role',
    },
    COLUMNS: {
      ROLE_TITLE: 'Role Title',
      TYPE: 'Type',
      PERMISSIONS: 'Permissions',
      CREATED: 'Created',
      STATUS: 'Status',
    },
    ACTIONS: {
      VIEW: 'View',
      EDIT: 'Edit',
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
    PERMISSION: 'permission',
    CREATED_AT: 'creationDate',
    STATUS: 'status',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      ROLE_TITLE: 110,
      TYPE: 100,
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
  PERMISSION_LEVEL: {
    READ_ONLY: 'ReadOnly' as PermissionLevel,
    CONTRIBUTOR: 'Contributor' as PermissionLevel,
    OWNER: 'Owner' as PermissionLevel,
    ADMIN: 'Admin' as PermissionLevel,
  },
  VALIDITY: {
    PERMANENT: 'permanent' as ValidityType,
    TEMPORARY: 'temporary' as ValidityType,
    SESSION_BASED: 'sessionBased' as ValidityType,
  },
  GENERAL: {
    TITLE: 'General',
    SUBTITLE: 'Provide the role details.',
    NAME_LABEL: 'Role Name',
    NAME_PLACEHOLDER: 'e.g. Platform Admin',
    NAME_VALIDATION: {
      MIN_LENGTH: 1,
      MAX_LENGTH: 100,
      DUPLICATE_ERROR: 'A role with this name already exists',
      INVALID_CHARS_ERROR:
        'Role name can only contain letters, numbers, hyphens (-), and underscores (_)',
      LENGTH_ERROR: (min: number, max: number) =>
        `Role name must be between ${min} and ${max} characters`,
    },
  },
  SCOPE: {
    TITLE: 'Scope & Permissions',
    SUBTITLE: 'Define what areas this role can access and at what level.',
    DEFAULT_AREAS: [
      { key: 'groupers', label: 'Groupers' },
      { key: 'workloads', label: 'Workloads' },
      { key: 'bridges', label: 'Bridges' },
      { key: 'users', label: 'Users' },
      { key: 'roles', label: 'Roles' },
    ] as const,
    TOOLTIP: {
      View: 'Read-only access to view data and settings.',
      Edit: 'Can create and update within assigned scope.',
      Delete: 'Can remove resources within assigned scope. Use with caution.',
    } as Record<RoleScopePermission, string>,
  },
  STATUS: { ACTIVE: 'Active', INACTIVE: 'Inactive' },
  TYPE: { BUILT_IN: 'built-in', CUSTOM: 'custom' },
  ASSIGNMENT: {
    TITLE: 'Assignment',
    SUBTITLE: 'Assign this role to groups and users.',
    LABEL: 'Assigned To',
    PLACEHOLDER: 'Select groups and users',
    GROUPS_LABEL: 'Groups',
    USERS_LABEL: 'Users',
  },
  LOGS: {
    INITIALIZING_ROLES: 'Initializing built-in roles...',
    INITIALIZATION_SUCCESS: 'Successfully initialized built-in roles',
    INITIALIZATION_FAILED: 'Failed to initialize built-in roles',
    PLATFORM_CATEGORY_ALREADY_EXISTS: (id: string) =>
      `Platform category already exists with ID: ${id}`,
    CREATING_PLATFORM_CATEGORY: 'Creating platform category...',
    PLATFORM_CATEGORY_CREATED: (id: string) => `Platform category created with ID: ${id}`,
    PLATFORM_CATEGORY_CREATE_FAILED: 'Failed to create platform category: No ID returned',
    PLATFORM_CATEGORY_FETCH_FAILED: 'Failed to fetch existing platform category',
    PLATFORM_CATEGORY_ENSURE_FAILED: 'Failed to ensure platform category exists',
    PLATFORM_CATEGORY_ID_MISSING:
      'Failed to get platform category ID. Cannot initialize built-in roles.',
    ROLE_ALREADY_EXISTS: (name: string) => `Built-in role "${name}" already exists. Skipping.`,
    ROLE_CREATE_FAILED: (name: string) => `Failed to create built-in role "${name}"`,
    PLATFORM_CATEGORY_ALREADY_EXISTS_FETCHING: 'Platform category already exists. Fetching...',
  },
  ERROR_MESSAGES: {
    CLIENT: {
      FETCH_ROLES_FAILED: '[APIClient] Failed to fetch roles:',
      FETCH_ROLE_DETAILS_FAILED: (id: string) =>
        `[APIClient] Failed to fetch role details for ${id}:`,
      CREATE_ROLE_FAILED: (name: string) => `[APIClient] Failed to create role: ${name}`,
      UPDATE_ROLE_FAILED: (id: string) => `[APIClient] Failed to update role: ${id}`,
      DELETE_ROLE_FAILED: (id: string) => `[APIClient] Failed to delete role: ${id}`,
    },
  },
  PLATFORM_CATEGORY_NAME: 'Platform',
} as const;

export const ROLES_ERROR_MESSAGES = ROLES_CONSTANTS.ERROR_MESSAGES;
