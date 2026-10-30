import type { PermissionLevel, ValidityType } from '../models/types';
import { DEFAULT_COLORS, DROPDOWN_EMPTY } from '../../../../constants';
import { pluralize } from '../../../../utils/helpers/format';

export const PERMISSION_LEVELS = ['ReadOnly', 'Contributor', 'Owner', 'Admin'] as const;
export const ROLES_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Roles',
    HEADER_SUBTITLE: 'Manage existing roles',
    BREADCRUMBS: {
      CATEGORIES: 'Categories',
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
      CREATED: 'Creation Date',
      CREATED_BY: 'Created By',
      LAST_UPDATE: 'Last Update',
      VALIDITY: 'Validity',
      CATEGORY: 'Category',
      VERSION: 'Version',
      STATUS: 'Status',
    },
    ACTIONS: {
      EDIT: 'Edit',
      DELETE: 'Delete',
      EDIT_DISABLED_TOOLTIP: 'Edit is disabled due to protection',
      EDIT_PERMISSION_DENIED_TOOLTIP: 'You do not have permission to edit roles',
      DELETE_DISABLED_TOOLTIP: 'Delete is disabled due to protection',
      DELETE_PERMISSION_DENIED_TOOLTIP: 'You do not have permission to delete roles',
      CREATE_DISABLED_TOOLTIP: 'You do not have permission to create roles',
      BULK_DELETE: 'Delete selected',
      BULK_DELETE_PROTECTED_TOOLTIP: 'Some selected roles are protected from deletion',
      BULK_DELETE_MODAL_TITLE: 'Delete Roles',
      BULK_DELETE_RESOURCE: (count: number) => pluralize(count, 'role'),
      BULK_DELETE_NOTE:
        'Anyone holding these roles loses the access they grant immediately. The roles disappear from users and groups within a few seconds.',
      BULK_DELETE_LOADING: (count: number) => `Deleting ${pluralize(count, 'role')}...`,
      BULK_DELETE_SUCCESS: (count: number) => `${pluralize(count, 'role')} deleted successfully`,
      BULK_DELETE_FAILED: 'Failed to delete some roles',
      CANCEL: 'Cancel',
    },
    CUSTOM_TYPE: 'custom',
    DELETE_MODAL_TITLE: 'Delete Role',
    DELETE_IMPACT: (users: number, groups: number) =>
      `It is assigned to ${pluralize(users, 'user')} and ${pluralize(groups, 'group')}. They lose the access it grants immediately. The role disappears from them within a few seconds.`,
    DELETE_MODAL_OK: 'Delete',
    NO_ROLES_TITLE: 'No roles yet',
    NO_ROLES_DESCRIPTION: 'Create your first role to get started.',
    VIEW_LABELS: {
      STATUS: 'Status',
      TYPE: 'Type',
      CATEGORY: 'Category',
      VERSION: 'Version',
      CREATION_DATE: 'Creation Date',
      LAST_UPDATE: 'Last Update',
      CREATED_BY: 'Created By',
      LAST_UPDATED_BY: 'Last Updated By',
      VALIDITY: 'Validity',
    },
    PANELS: {
      VIEW: { TITLE: 'Role Details' },
      EDIT: {
        TITLE: 'Edit Role',
      },
      CREATE: {
        TITLE: 'Create Role',
        SUBMIT_BUTTON: 'Create Role',
      },
    },
    TOOLBAR: {
      SEARCH: { PLACEHOLDER: 'Search by name, description...', BUTTON_LABEL: 'Search' },
      CREATE: { BUTTON_LABEL: 'Create Role' },
      COUNT_SUFFIX: { one: 'role', other: 'roles' },
      CATEGORIES_COUNT_SUFFIX: { one: 'category', other: 'categories' },
      MORE: 'More',
      BULK: {
        SELECT: 'Bulk',
        EXIT: 'Exit bulk',
      },
    },
    EMPTY: {
      NO_ROLES_FOUND: 'No roles found',
      NO_CATEGORIES_FOUND: 'No categories found',
    },
    PAGINATION: {
      SHOW_ROWS: 'Show rows',
    },
  },
  KEYS: {
    NAME: 'name',
    TYPE: 'type',
    CREATED_AT: 'creationDate',
    CREATED_BY: 'createdBy',
    LAST_UPDATE: 'lastUpdateDate',
    VALIDITY: 'validity',
    CATEGORY: 'category',
    VERSION: 'version',
    STATUS: 'status',
    ACTIONS: 'actions',
    MORE_MENU_BULK: 'bulk',
    FILTER_ROLE_TYPE: 'roleType',
    FILTER_ALL: 'all',
  } as const,
  SIZES: {
    COLUMNS: {
      ROLE_TITLE: 110,
      // Header label + icon + sort measured (2026-10-09): narrower wraps or widens them.
      TYPE: 90,
      CREATED: 160,
      CREATED_BY: 130,
      LAST_UPDATE: 150,
      VALIDITY: 110,
      CATEGORY: 120,
      VERSION: 110,
      STATUS: 110,
      // Two row buttons with their gap, plus the cell padding (measured).
      ACTIONS: 80,
    },
    // Measured natural widths of the toolbar row: ~397px by default and ~516px in
    // bulk mode. Below these the controls fall back to icons.
    TOOLBAR_COMPACT_WIDTH: {
      DEFAULT: 450,
      BULK: 570,
    },
  },
  COLORS: {
    TEXT_MUTED: DEFAULT_COLORS.TEXT_ON_SURFACE_MUTED,
  },
  VALUES: {
    ROLE_TYPE_BUILT_IN: 'built-in',
    ROLE_TYPE_CUSTOM: 'custom',
  },
  PERMISSION_LEVEL: {
    READ_ONLY: 'ReadOnly' as PermissionLevel,
  },
  VALIDITY_TYPES: {
    PERMANENT: 'permanent' as ValidityType,
    TEMPORARY: 'temporary' as ValidityType,
    SESSION_BASED: 'sessionBased' as ValidityType,
  },
  VALIDITY: {
    TITLE: 'Validity',
    SUBTITLE: 'Define when and how long this role is valid.',
    TYPE_LABEL: 'Validity Type',
    EXPIRATION_MODEL_LABEL: 'Expiration Model',
    EXPIRATION_MODEL_OPTIONS: {
      EXPIRES_AT: 'expiresAt',
      DURATION: 'durationHours',
    },
    EXPIRES_AT_LABEL: 'Expires At',
    EXPIRES_AT_PLACEHOLDER: 'Select expiration date and time',
    DURATION_LABEL: 'Duration',
    DURATION_PLACEHOLDER: 'Enter duration in hours',
    AUTO_REVOKE_LABEL: 'Auto Revoke',
  },
  GENERAL: {
    TITLE: 'General',
    SUBTITLE: 'Provide the role details.',
    NAME_LABEL: 'Role Name',
    NAME_PLACEHOLDER: 'e.g. Platform Admin',
    DESCRIPTION_LABEL: 'Description',
    DESCRIPTION_PLACEHOLDER: 'Enter role description',
    CATEGORY_LABEL: 'Category',
    CATEGORY_EMPTY: DROPDOWN_EMPTY.NONE_FOUND('categories'),
    CATEGORY_PLACEHOLDER: 'Select a category',
    LOCK_NAME_TOOLTIP: 'Name is locked for this role',
    LOCK_CATEGORY_TOOLTIP: 'Category is locked for this role',
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
    TITLE: 'Scopes & Permissions',
    SUBTITLE: 'Define what areas this role can access and at what level.',
    LOCKED_MESSAGE: 'Scopes and permissions are locked for this role.',
    AT_LEAST_ONE_REQUIRED: 'Select a permission level for at least one scope.',
    DEFAULT_AREAS: [
      { key: 'groups', label: 'Groups' },
      { key: 'users', label: 'Users' },
      { key: 'roles', label: 'Roles' },
      { key: 'applications', label: 'Applications' },
      { key: 'insights', label: 'Insights' },
      { key: 'settings', label: 'Settings' },
      { key: 'protection-plans', label: 'Protection plans' },
    ] as const,
    PERMISSION_LEVEL_DESCRIPTION: {
      ReadOnly: 'Read-only access to view data and settings.',
      Contributor: 'Can create and update within assigned scope.',
      Owner: 'Full control including deletion and role assignment.',
      Admin: 'Top-level authority with override capabilities.',
    },
    RULES: {
      BLOCK_CERTAIN_RULES: 'Block certain rules',
      DENIED_COUNT: (count: number) => `${count} denied`,
      DENIED_LIST_LABEL: 'Denied actions',
    },
  },
  STATUS: { ACTIVE: 'Active', DELETED: 'Deleted' },
  TYPE: { BUILT_IN: 'built-in', CUSTOM: 'custom' },
  PROTECTION: {
    TITLE: 'Protection',
    SUBTITLE: 'Configure protection flags to prevent unauthorized changes.',
    PREVENT_DELETION_LABEL: 'Prevent Deletion',
    PREVENT_MODIFICATION_LABEL: 'Prevent Modification',
    PREVENT_SCOPE_CHANGES_LABEL: 'Prevent Scope Changes',
    LOCK_NAME_LABEL: 'Lock Name',
    LOCK_CATEGORY_LABEL: 'Lock Category',
    SOFT_DELETE_LABEL: 'Soft Delete',
    ENABLED: 'Yes',
    DISABLED: 'No',
    SOFT_DELETE_DISABLED_NOTE: 'Soft delete is disabled because deletion is prevented.',
    READ_ONLY_TOOLTIP:
      "Only a custom role's creator or an Admin on all scopes can change its protection.",
  },
  // Prevent Scope Changes shows its new value at once, writes the form after FORM_WRITE_DELAY_MS
  // and drops the local value LOCAL_VALUE_CLEAR_MS later.
  PROTECTION_TIMERS: {
    FORM_WRITE_DELAY_MS: 300,
    LOCAL_VALUE_CLEAR_MS: 100,
  },
  ERROR_MESSAGES: {
    CLIENT: {
      FETCH_ROLES_FAILED: '[APIClient] Failed to fetch roles:',
      FETCH_ROLE_DETAILS_FAILED: (id: string) =>
        `[APIClient] Failed to fetch role details for ${id}:`,
      CREATE_ROLE_FAILED: (name: string) => `[APIClient] Failed to create role: ${name}`,
      UPDATE_ROLE_FAILED: (id: string) => `[APIClient] Failed to update role: ${id}`,
      DELETE_ROLE_FAILED: (id: string) => `[APIClient] Failed to delete role: ${id}`,
      DELETE_ROLE_MISSING_ID: '[APIClient] Cannot delete role: missing id',
    },
  },
} as const;

export const ROLES_ERROR_MESSAGES = ROLES_CONSTANTS.ERROR_MESSAGES;
