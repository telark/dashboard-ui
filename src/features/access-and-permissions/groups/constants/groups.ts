export const GROUPS_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Groups',
    HEADER_SUBTITLE: 'Manage existing groups',
    VIEW_SUBTITLE: 'View group details',
    EDIT_SUBTITLE: 'Edit group details',
    CREATE_SUBTITLE: 'Create a new group',
    NOT_FOUND: 'Group not found',
    UPDATE_BUTTON: 'Update Group',
    CREATE_BUTTON_TEXT: 'Create Group',
    BREADCRUMBS: {
      GROUPS: 'Groups',
      EDIT: 'Edit',
      CREATE: 'Create Group',
    },
    MESSAGES: {
      CREATED: (name: string) => `Group "${name}" created`,
      UPDATED: (name: string) => `Group "${name}" updated`,
      DELETED: 'Group deleted successfully',
      CREATE_FAILED: 'Failed to create group',
      UPDATE_FAILED: 'Failed to update group',
      DELETE_FAILED: 'Failed to delete group',
      NO_GROUPS_TITLE: 'No groups yet',
      NO_GROUPS_DESCRIPTION:
        'Get started by creating your first group. Groups help you organize and manage users with similar roles and permissions.',
    },
    COLUMNS: {
      NAME: 'Group Name',
      DESCRIPTION: 'Description',
      CATEGORY: 'Category',
      CREATED: 'Creation Date',
    },
    ACTIONS: {
      VIEW: 'View',
      EDIT: 'Edit',
      DELETE: 'Delete',
      DELETE_MODAL_TITLE: 'Delete Group',
      DELETE_MODAL_CONTENT: (name: string) => `Are you sure you want to delete "${name}"?`,
      DELETE_MODAL_OK: 'Delete',
    },
    FORM: {
      TITLE: 'Create Group',
      SUBTITLE: 'Add a new group',
      SECTION_TITLE: 'Group Details',
      SECTION_SUBTITLE: 'Provide the group information.',
      BUTTON_TEXT: 'Create Group',
      FIELDS: {
        NAME_LABEL: 'Group Name',
        NAME_PLACEHOLDER: 'e.g. Development Team',
        DESCRIPTION_LABEL: 'Description',
        DESCRIPTION_PLACEHOLDER: 'e.g. Group for development team members',
        CATEGORY_LABEL: 'Category',
        CATEGORY_PLACEHOLDER: 'Select a category',
        NAME_VALIDATION: {
          MIN_LENGTH: 1,
          MAX_LENGTH: 100,
          DUPLICATE_ERROR: 'A group with this name already exists',
          INVALID_CHARS_ERROR:
            'Group name can only contain letters, numbers, hyphens (-), and underscores (_)',
          LENGTH_ERROR: (min: number, max: number) =>
            `Group name must be between ${min} and ${max} characters`,
        },
      },
    },
  },
  KEYS: {
    NAME: 'name',
    DESCRIPTION: 'description',
    CATEGORY: 'categoryID',
    CREATED_AT: 'creationDate',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      NAME: 150,
      DESCRIPTION: 200,
      CATEGORY: 120,
      CREATED: 120,
      ACTIONS: 50,
    },
    MODAL_WIDTH: 360,
  },
  COLORS: {
    TEXT_PRIMARY: '#0B1F33',
    TEXT_MUTED: '#64748b',
    CHIP_BLUE_BG: '#dbeafe',
    CHIP_BLUE_TEXT: '#1e40af',
    TYPE_CUSTOM_BG: '#f1f5f9',
    TYPE_CUSTOM_TEXT: '#334155',
    HEADER_BG: '#f8fafc',
  },
  ERROR_MESSAGES: {
    CLIENT: {
      FETCH_GROUPS_FAILED: '[APIClient] Failed to fetch groups:',
      FETCH_GROUP_DETAILS_FAILED: (id: string) =>
        `[APIClient] Failed to fetch group details for ${id}:`,
      CREATE_GROUP_FAILED: (name: string) => `[APIClient] Failed to create group: ${name}`,
      UPDATE_GROUP_FAILED: (id: string) => `[APIClient] Failed to update group: ${id}`,
      DELETE_GROUP_FAILED: (id: string) => `[APIClient] Failed to delete group: ${id}`,
    },
  },
} as const;

export const GROUPS_ERROR_MESSAGES = GROUPS_CONSTANTS.ERROR_MESSAGES;
