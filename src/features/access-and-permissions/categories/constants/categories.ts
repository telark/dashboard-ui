const SCOPES = {
  GROUPS: 'groups',
  ROLES: 'roles',
  PLAN_ENVIRONMENTS: 'plan-environments',
  PLAN_TAGS: 'plan-tags',
} as const;

export type CategoryScope = (typeof SCOPES)[keyof typeof SCOPES];

const TYPES = {
  BUILT_IN: 'built-in',
  CUSTOM: 'custom',
} as const;

const buildLabels = ({
  noun,
  plural,
  example,
}: {
  noun: string;
  plural: string;
  example: string;
}) => {
  const lower = noun.toLowerCase();
  return {
    COLUMNS: {
      NAME: `${noun} Name`,
      TYPE: 'Type',
      SCOPE: 'Scope',
      CREATED: 'Creation Date',
    },
    TYPES: {
      BUILT_IN: 'Built-in',
      CUSTOM: 'Custom',
    },
    ACTIONS: {
      EDIT: 'Edit',
      DELETE: 'Delete',
      EDIT_PERMISSION_DENIED_TOOLTIP: `You do not have permission to edit ${plural}`,
      DELETE_PERMISSION_DENIED_TOOLTIP: `You do not have permission to delete ${plural}`,
      DELETE_MODAL_TITLE: `Delete ${noun}`,
      DELETE_MODAL_OK: 'Delete',
    },
    MESSAGES: {
      DELETED: `${noun} deleted successfully`,
      DELETE_FAILED: `Failed to delete ${lower}`,
      CATEGORY_CREATED: (name: string) => `${noun} "${name}" created`,
      CATEGORY_CREATE_FAILED: `Failed to create ${lower}`,
      CATEGORY_UPDATED: (name: string) => `${noun} "${name}" updated`,
      CATEGORY_UPDATE_FAILED: `Failed to update ${lower}`,
      CATEGORY_DELETED: `${noun} deleted successfully`,
      CATEGORY_DELETE_FAILED: `Failed to delete ${lower}`,
    },
    PANELS: {
      ADD_CATEGORY: {
        TITLE: `Create ${noun}`,
        SUBMIT_BUTTON: `Create ${noun}`,
        NAME_LABEL: `${noun} Name`,
        NAME_PLACEHOLDER: example,
        NAME_REQUIRED_MESSAGE: `${noun} name is required`,
        NAME_EMPTY_MESSAGE: `${noun} name cannot be empty`,
        NAME_EXISTS_MESSAGE: `A ${lower} with this name already exists`,
        CANCEL: 'Cancel',
      },
      EDIT_CATEGORY: {
        TITLE: `Edit ${noun}`,
        SUBMIT_BUTTON: `Update ${noun}`,
        NAME_LABEL: `${noun} Name`,
        NAME_PLACEHOLDER: example,
        NAME_REQUIRED_MESSAGE: `${noun} name is required`,
        NAME_EMPTY_MESSAGE: `${noun} name cannot be empty`,
        NAME_EXISTS_MESSAGE: `A ${lower} with this name already exists`,
        CANCEL: 'Cancel',
      },
    },
    TOOLBAR: {
      MANAGE_CATEGORIES: {
        BUTTON_LABEL: 'Manage Categories',
        VIEW_CATEGORIES: 'View Categories',
        ADD_CATEGORY: `Create ${noun}`,
        VIEW_CATEGORIES_DISABLED_TOOLTIP: 'You do not have permission to view categories',
        ADD_CATEGORY_DISABLED_TOOLTIP: `You do not have permission to create ${plural}`,
      },
    },
    RESOURCE_TYPE: lower,
    NOUN: noun,
    PLURAL: plural,
    EMPTY: `No ${plural} yet`,
  };
};

const LABELS = buildLabels({
  noun: 'Category',
  plural: 'categories',
  example: 'e.g. Engineering, Operations',
});

const LABELS_BY_SCOPE: Partial<Record<string, typeof LABELS>> = {
  [SCOPES.PLAN_ENVIRONMENTS]: buildLabels({
    noun: 'Environment',
    plural: 'environments',
    example: 'e.g. Production, Staging',
  }),
  [SCOPES.PLAN_TAGS]: buildLabels({
    noun: 'Tag',
    plural: 'tags',
    example: 'e.g. Compliance, Security',
  }),
};

export const labelsFor = (scope: string): typeof LABELS => LABELS_BY_SCOPE[scope] ?? LABELS;

export const CATEGORIES_CONSTANTS = {
  SCOPES,
  TYPES,
  LABELS,
  KEYS: {
    NAME: 'name',
    TYPE: 'type',
    SCOPE: 'scope',
    CREATED_AT: 'creationDate',
    ACTIONS: 'actions',
  } as const,
  SIZES: {
    COLUMNS: {
      NAME: 320,
      TYPE: 160,
      SCOPE: 160,
      CREATED: 180,
      ACTIONS: 120,
    },
  },
  BUILT_IN_GROUPS_CAT: [
    {
      name: 'Engineering',
      scope: SCOPES.GROUPS,
      type: TYPES.BUILT_IN,
    },
    {
      name: 'Operations',
      scope: SCOPES.GROUPS,
      type: TYPES.BUILT_IN,
    },
    {
      name: 'Quality Assurance',
      scope: SCOPES.GROUPS,
      type: TYPES.BUILT_IN,
    },
    {
      name: 'Security',
      scope: SCOPES.GROUPS,
      type: TYPES.BUILT_IN,
    },
  ],
  BUILT_IN_ROLES_CAT: [
    {
      name: 'Platform',
      scope: SCOPES.ROLES,
      type: TYPES.BUILT_IN,
    },
  ],
  LOGS: {
    CATEGORIES_ALREADY_EXIST: (scope: string) =>
      `Categories for scope "${scope}" already exist. Skipping initialization.`,
    NO_BUILT_IN_CATEGORIES: (scope: string) => `No built-in categories defined for scope: ${scope}`,
    INITIALIZING_CATEGORIES: (count: number, scope: string) =>
      `Initializing ${count} built-in categories for scope: ${scope}`,
    INITIALIZATION_SUCCESS: (scope: string) =>
      `Successfully initialized built-in categories for scope: ${scope}`,
    NO_CATEGORIES_FOUND: (scope: string) =>
      `No categories found for scope "${scope}". Creating built-in categories.`,
    CREATE_CATEGORIES_FAILED: (scope: string) =>
      `Failed to create built-in categories for scope: ${scope}`,
    INITIALIZATION_FAILED: (scope: string) => `Failed to initialize categories for scope: ${scope}`,
  },
  ERROR_MESSAGES: {
    CLIENT: {
      FETCH_CATEGORIES_BY_SCOPE_FAILED: (scope: string) =>
        `Failed to fetch categories for scope: ${scope}`,
      FETCH_ALL_CATEGORIES_FAILED: 'Failed to fetch all categories',
      FETCH_CATEGORY_BY_ID_FAILED: (id: string) => `Failed to fetch category by id: ${id}`,
      CREATE_CATEGORY_FAILED: (name: string) => `Failed to create category: ${name}`,
      UPDATE_CATEGORY_FAILED: (id: string) => `Failed to update category: ${id}`,
      DELETE_CATEGORY_FAILED: (id: string) => `Failed to delete category: ${id}`,
    },
  },
} as const;
