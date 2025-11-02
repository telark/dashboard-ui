export const ROLE_CATEGORIES_CONSTANTS = {
  LABELS: {
    HEADER_TITLE: 'Role Categories',
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
    ROW_HEIGHT: 44,
    HEADER_ICON: 14,
    CHIP_FONT: 12,
    COLUMNS: {
      NAME: 100,
      DESCRIPTION: 360,
      USED_BY: 80,
      TYPE: 50,
      CREATED: 160,
      ACTIONS: 48,
    },
  },
  COLORS: {
    TYPE_DEFAULT_BG: '#f1f5f9',
    TYPE_DEFAULT_TEXT: '#334155',
    TEXT_PRIMARY: '#0B1F33',
    TEXT_MUTED: '#64748b',
  },
} as const;

export type RoleCategoriesConstants = typeof ROLE_CATEGORIES_CONSTANTS;


