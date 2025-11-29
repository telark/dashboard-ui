const SCOPES = {
  GROUPS: 'groups',
  ROLES: 'roles',
} as const;

const TYPES = {
  BUILT_IN: 'built-in',
  CUSTOM: 'custom',
} as const;

export const CATEGORIES_CONSTANTS = {
  SCOPES,
  TYPES,
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
    },
  },
} as const;
