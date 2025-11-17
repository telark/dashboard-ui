import type { FormFieldConfig } from '../../interfaces/layout/modal';

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
      },
    },
  },
  KEYS: {
    NAME: 'name',
    DESCRIPTION: 'description',
    CATEGORY: 'category',
    CREATED_AT: 'createdAt',
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
  FORM: {
    FIELDS: [
      {
        type: 'input',
        name: 'name',
        label: 'Group Name',
        placeholder: 'e.g. Development Team',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'input',
        name: 'description',
        label: 'Description',
        placeholder: 'e.g. Group for development team members',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'select',
        name: 'category',
        label: 'Category',
        placeholder: 'Select a category',
        required: true,
        options: [
          { label: 'Engineering', value: 'Engineering' },
          { label: 'Operations', value: 'Operations' },
          { label: 'Quality Assurance', value: 'Quality Assurance' },
          { label: 'Security', value: 'Security' },
          { label: 'Management', value: 'Management' },
          { label: 'Support', value: 'Support' },
        ],
        marginBottom: 6,
      },
    ] as FormFieldConfig[],
    INITIAL_VALUES: {
      category: 'Engineering',
    },
  },
} as const;

export type GroupsConstants = typeof GROUPS_CONSTANTS;
