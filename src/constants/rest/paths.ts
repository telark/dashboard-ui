export const API_PATHS = {
  RESOURCES: {
    APPLICATIONS: 'resources/applications',
    GLOBALCONFIG: 'resources/globalconfig',
    USERS: 'resources/users',
    GROUPS: 'resources/groups',
    ROLES: 'resources/roles',
  },
  // Insights are produced out of band and read windowed to the apps on screen,
  // so they sit outside the resource CRUD paths.
  INSIGHTS: 'insights',
  ANALYZE: 'analyze',
  CLASSIFICATION: {
    CATEGORIES: 'classification/categories',
  },
} as const;

export const RESOURCE_PATHS = {
  GET_ALL: 'get',
  GET_DETAILS: (name: string) => `${encodeURIComponent(name)}/get`,
  RESET_DETAILS: (name: string) => `${encodeURIComponent(name)}/reset`,
  FIND_USER_BY_ID: (id: string) => `findbyid/${encodeURIComponent(id)}/get`,
  UPDATE_SYNC: (name: string) => `${encodeURIComponent(name)}/patch`,
  APPLICATION_ROLLBACKS: (name: string) => `${encodeURIComponent(name)}/rollbacks`,
  SYNC_PATH: (name: string) => `${encodeURIComponent(name)}/sync`,
} as const;

export const SESSION_PATHS = {
  GET_ALL_BY_USER: (userId: string) => `auth/sessions/${encodeURIComponent(userId)}/get`,
  GET_BY_TOKEN: (sessionToken: string) =>
    `auth/sessions/tokens/${encodeURIComponent(sessionToken)}/get`,
  DELETE_BY_TOKEN: (sessionToken: string) =>
    `auth/sessions/tokens/${encodeURIComponent(sessionToken)}/delete`,
} as const;

export const AUTH_PATHS = {
  LOGIN: {
    START: 'auth/login/start',
    FINISH: 'auth/login/finish',
  },
  REGISTER: {
    START: 'auth/register/start',
  },
  CONFIG: 'auth/config',
  LOGOUT: 'auth/logout',
  PASSKEYS: {
    PROXY: {
      GET: 'auth/passkeys/proxy/get',
      CREATE: 'auth/passkeys/proxy/create',
      SINGLE_GET: 'auth/passkeys/proxy/single/get',
      PATCH: 'auth/passkeys/proxy/patch',
      DELETE: 'auth/passkeys/proxy/delete',
    },
    ENROLL_LINK: 'auth/passkeys/enroll-link',
  },
  OIDC: {
    GOOGLE_CALLBACK: 'auth/oidc/google/callback',
    GOOGLE_NONCE: 'auth/oidc/google/nonce',
    CONFIG: 'auth/oidc/config',
  },
  PERMISSIONS: 'auth/permissions',
  CLEANUP: {
    DELETE_USER: (id: string) => `auth/users/${encodeURIComponent(id)}/cleanup`,
    DELETE_GROUP: (id: string) => `auth/groups/${encodeURIComponent(id)}/cleanup`,
    DELETE_ROLE: (id: string) => `auth/roles/${encodeURIComponent(id)}/cleanup`,
  },
} as const;

export const CATEGORY_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${encodeURIComponent(id)}/get`,
  GET_BY_SCOPE: (scope: string) => `scope/${encodeURIComponent(scope)}/get`,
  PATCH_BY_ID: (id: string) => `${encodeURIComponent(id)}/patch`,
  DELETE_BY_ID: (id: string) => `${encodeURIComponent(id)}/delete`,
} as const;

export const GROUP_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${encodeURIComponent(id)}/get`,
  PATCH_BY_ID: (id: string) => `${encodeURIComponent(id)}/patch`,
} as const;

export const ROLE_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${encodeURIComponent(id)}/get`,
  PATCH_BY_ID: (id: string) => `${encodeURIComponent(id)}/patch`,
} as const;

export const USER_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `findbyid/${encodeURIComponent(id)}/get`,
  GET_BY_EMAIL: (email: string) => `findbyemail/${encodeURIComponent(email)}/get`,
  PATCH_BY_ID: (id: string) => `${encodeURIComponent(id)}/patch`,
} as const;

export const PLANS_PATHS = {
  PROTECTION: {
    GET_ALL: 'plans/protection/get',
    GET_BY_ID: (id: string) => `plans/protection/${encodeURIComponent(id)}/get`,
    TEMPLATES: 'plans/protection/templates',
    PREPARE: 'plans/protection/prepare',
    CANCEL: (id: string) => `plans/protection/${encodeURIComponent(id)}/cancel`,
    CLEAR: (id: string) => `plans/protection/${encodeURIComponent(id)}/clear`,
    STATUS: (id: string) => `plans/protection/${encodeURIComponent(id)}/status`,
    VIOLATIONS: (id: string) => `plans/protection/${encodeURIComponent(id)}/violations`,
    DUPLICATE: (id: string) => `plans/protection/${encodeURIComponent(id)}/duplicate`,
    REACTIVATE: (id: string) => `plans/protection/${encodeURIComponent(id)}/reactivate`,
    DECIDE: (id: string) => `plans/protection/${encodeURIComponent(id)}/decide`,
    UPDATE: (id: string) => `plans/protection/${encodeURIComponent(id)}/update`,
    REPORTS_GENERATE: (id: string) => `plans/protection/${encodeURIComponent(id)}/reports/generate`,
  },
} as const;

export const REPORTS_PATHS = {
  LIST_ALL: 'reports/get',
  PLANS: {
    LIST: (id: string) => `reports/plans/${encodeURIComponent(id)}/get`,
    DOWNLOAD: (id: string) => `reports/plans/${encodeURIComponent(id)}/download`,
  },
} as const;
