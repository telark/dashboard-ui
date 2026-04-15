export const API_PATHS = {
  RESOURCES: {
    GROUPERS: 'resources/groupers',
    APPLICATIONS: 'resources/applications',
    INSIGHTS: 'resources/insights',
    WORKLOADS: 'resources/workloads',
    BRIDGES: 'resources/bridges',
    GLOBALCONFIG: 'resources/globalconfig',
    USERS: 'resources/users',
    GROUPS: 'resources/groups',
    ROLES: 'resources/roles',
  },
  FEATS: {
    MAINTENANCE: 'feats/maintenance',
  },
  ANALYZE: 'analyze',
  CLASSIFICATION: {
    CATEGORIES: 'classification/categories',
  },
} as const;

export const RESOURCE_PATHS = {
  GET_ALL: 'get',
  GET_DETAILS: (name: string) => `${name}/get`,
  DELETE_DETAILS: (name: string) => `${name}/delete`,
  CLEANUP_DETAILS: (name: string) => `${name}/cleanup`,
  FIND_USER_BY_ID: (id: string) => `findbyid/${id}/get`,
  UPDATE_SYNC: (name: string) => `${name}/patch`,
  /** Application rollback: POST to trigger; GET to list (API contract from exporter). */
  APPLICATION_ROLLBACKS: (name: string) => `${name}/rollbacks`,
  SYNC: 'sync',
  SYNC_GROUPER: (name: string) => `${name}/sync`,
  SYNC_APP: (name: string) => `${name}/sync`,
  SYNC_BRIDGE: (name: string) => `${name}/sync`,
} as const;

export const SESSION_PATHS = {
  GET_ALL_BY_USER: (userId: string) => `auth/sessions/${userId}/get`,
  GET_BY_TOKEN: (sessionToken: string) => `auth/sessions/tokens/${sessionToken}/get`,
  DELETE_BY_TOKEN: (sessionToken: string) => `auth/sessions/tokens/${sessionToken}/delete`,
} as const;

export const INSIGHT_PATHS = {
  CLUSTER_GET: 'cluster/get',
} as const;

export const MAINTENANCE_PATHS = {
  CHECK: (name: string) => `${name}/get`,
  ENABLE: 'grouper/enable',
  UPDATE: 'grouper/update',
  REMOVE: 'grouper/remove',
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
  GET_BY_ID: (id: string) => `${id}/get`,
  PATCH_BY_ID: (id: string) => `${id}/patch`,
  DELETE_BY_ID: (id: string) => `${id}/delete`,
} as const;
