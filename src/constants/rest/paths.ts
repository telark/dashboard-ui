export const API_PATHS = {
  RESOURCES: {
    APPLICATIONS: 'resources/applications',
    INSIGHTS: 'resources/insights',
    GLOBALCONFIG: 'resources/globalconfig',
    USERS: 'resources/users',
    GROUPS: 'resources/groups',
    ROLES: 'resources/roles',
  },
  ANALYZE: 'analyze',
  CLASSIFICATION: {
    CATEGORIES: 'classification/categories',
  },
} as const;

export const RESOURCE_PATHS = {
  GET_ALL: 'get',
  GET_DETAILS: (name: string) => `${name}/get`,
  CLEANUP_DETAILS: (name: string) => `${name}/cleanup`,
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

export const INSIGHT_PATHS = {
  CLUSTER_GET: 'cluster/get',
} as const;

export const ANALYZE_PATHS = {
  START: 'start',
} as const;

export const AUTH_PATHS = {
  LOGIN: {
    START: 'auth/login/start',
    FINISH: 'auth/login/finish',
  },
  REGISTER: {
    START: 'auth/register/start',
  },
  LOGOUT: 'auth/logout',
  PASSKEYS: {
    PROXY: {
      GET: 'auth/passkeys/proxy/get',
      CREATE: 'auth/passkeys/proxy/create',
      SINGLE_GET: 'auth/passkeys/proxy/single/get',
      PATCH: 'auth/passkeys/proxy/patch',
      DELETE: 'auth/passkeys/proxy/delete',
    },
  },
  OIDC: {
    GOOGLE_CALLBACK: 'auth/oidc/google/callback',
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
  DELETE_BY_ID: (id: string) => `${id}/delete`,
} as const;

export const ROLE_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `${id}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
  DELETE_BY_ID: (id: string) => `${id}/delete`,
} as const;

export const USER_PATHS = {
  CREATE: 'create',
  GET_ALL: 'get',
  GET_BY_ID: (id: string) => `findbyid/${id}/get`,
  GET_BY_EMAIL: (email: string) => `findbyemail/${email}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
  DELETE_BY_ID: (id: string) => `${id}/delete`,
} as const;
