import type { FormFieldConfig } from '../../interfaces/modal';

export const CATEGORIES_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Categories',
    HEADER_SUBTITLE: 'Manage existing categories',
    COLUMNS: {
      NAME: 'Category Name',
      DESCRIPTION: 'Description',
      USED_BY: 'Used By',
      TYPE: 'Type',
      CREATED: 'Created',
    },
    ACTIONS: {
      VIEW: 'View',
      DELETE: 'Delete',
      DELETE_MODAL_TITLE: 'Delete Category',
      DELETE_MODAL_CONTENT: (name: string) => `Are you sure you want to delete "${name}"?`,
      DELETE_MODAL_OK: 'Delete',
    },
    FORM: {
      TITLE: 'Create Category',
      SUBTITLE: 'Add a new category',
      SECTION_TITLE: 'Category Details',
      SECTION_SUBTITLE: 'Provide the category information.',
      BUTTON_TEXT: 'Create Category',
      FIELDS: {
        NAME_LABEL: 'Category Name',
        NAME_PLACEHOLDER: 'e.g. General',
        DESCRIPTION_LABEL: 'Category Description',
        DESCRIPTION_PLACEHOLDER: 'e.g. Common roles for everyday access',
        TYPE_LABEL: 'Category Type',
        TYPE_PLACEHOLDER: 'Select a type',
      },
    },
  },
  KEYS: {
    NAME: 'name',
    DESCRIPTION: 'description',
    USED_BY: 'usedBy',
    TYPE: 'type',
    CREATED_AT: 'createdAt',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    ROW_HEIGHT: 32,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      NAME: 110,
      DESCRIPTION: 140,
      USED_BY: 100,
      TYPE: 100,
      CREATED: 100,
      ACTIONS: 50,
    },
    MODAL_WIDTH: 360,
  },
  COLORS: {
    TYPE_DEFAULT_BG: '#f1f5f9',
    TYPE_DEFAULT_TEXT: '#334155',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_MUTED: '#64748b',
  },
  FORM: {
    FIELDS: [
      {
        type: 'input',
        name: 'name',
        label: 'Category Name',
        placeholder: 'e.g. General',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'input',
        name: 'description',
        label: 'Category Description',
        placeholder: 'e.g. Common roles for everyday access',
        required: true,
        marginBottom: 18,
      },
      {
        type: 'select',
        name: 'type',
        label: 'Category Type',
        placeholder: 'Select a type',
        required: true,
        options: [
          { label: 'Default', value: 'default' },
          { label: 'System', value: 'system' },
          { label: 'Custom', value: 'custom' },
        ],
        marginBottom: 6,
      },
    ] as FormFieldConfig[],
    INITIAL_VALUES: {
      type: 'default',
    },
  },
} as const;

export type CategoriesConstants = typeof CATEGORIES_CONSTANTS;

