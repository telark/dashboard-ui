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
  GET_DETAILS: (name: string) => `${name}/get`,
  RESET_DETAILS: (name: string) => `${name}/reset`,
  FIND_USER_BY_ID: (id: string) => `findbyid/${id}/get`,
  UPDATE_SYNC: (name: string) => `${name}/patch`,
  APPLICATION_ROLLBACKS: (name: string) => `${name}/rollbacks`,
  SYNC_PATH: (name: string) => `${name}/sync`,
} as const;

export const SESSION_PATHS = {
  GET_ALL_BY_USER: (userId: string) => `auth/sessions/${userId}/get`,
  GET_BY_TOKEN: (sessionToken: string) => `auth/sessions/tokens/${sessionToken}/get`,
  DELETE_BY_TOKEN: (sessionToken: string) => `auth/sessions/tokens/${sessionToken}/delete`,
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
    DELETE_USER: (id: string) => `auth/users/${id}/cleanup`,
    DELETE_GROUP: (id: string) => `auth/groups/${id}/cleanup`,
    DELETE_ROLE: (id: string) => `auth/roles/${id}/cleanup`,
  },
} as const;

export const CATEGORY_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${id}/get`,
  GET_BY_SCOPE: (scope: string) => `scope/${scope}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
  DELETE_BY_ID: (id: string) => `${id}/delete`,
} as const;

export const GROUP_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${id}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
} as const;

export const ROLE_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${id}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
} as const;

export const USER_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `findbyid/${id}/get`,
  GET_BY_EMAIL: (email: string) => `findbyemail/${email}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
} as const;

export const PLANS_PATHS = {
  PROTECTION: {
    GET_ALL: 'plans/protection/get',
    GET_BY_ID: (id: string) => `plans/protection/${id}/get`,
    TEMPLATES: 'plans/protection/templates',
    PREPARE: 'plans/protection/prepare',
    CANCEL: (id: string) => `plans/protection/${id}/cancel`,
    CLEAR: (id: string) => `plans/protection/${id}/clear`,
    STATUS: (id: string) => `plans/protection/${id}/status`,
    VIOLATIONS: (id: string) => `plans/protection/${id}/violations`,
    DUPLICATE: (id: string) => `plans/protection/${id}/duplicate`,
    REACTIVATE: (id: string) => `plans/protection/${id}/reactivate`,
    UPDATE: (id: string) => `plans/protection/${id}/update`,
    REPORTS_GENERATE: (id: string) => `plans/protection/${id}/reports/generate`,
  },
} as const;

export const REPORTS_PATHS = {
  PLANS: {
    LIST: (id: string) => `reports/plans/${id}/get`,
    DOWNLOAD: (id: string) => `reports/plans/${id}/download`,
  },
} as const;
