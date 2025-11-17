export const API_PATHS = {
  RESOURCES: {
    GROUPERS: 'resources/groupers',
    INSIGHTS: 'resources/insights',
    WORKLOADS: 'resources/workloads',
    BRIDGES: 'resources/bridges',
    USERS: 'resources/users',
  },
  FEATS: {
    MAINTENANCE: 'feats/maintenance',
  },
  ANALYZE: 'analyze',
} as const;

export const RESOURCE_PATHS = {
  GET_ALL: 'get',
  GET_DETAILS: (name: string) => `${name}/get`,
  FIND_USER_BY_ID: (id: string) => `findbyid/${id}/get`,
  UPDATE_SYNC: (name: string) => `${name}/patch`,
  SYNC: 'sync',
  SYNC_GROUPER: (name: string) => `${name}/sync`,
  SYNC_APP: (name: string) => `${name}/sync`,
  SYNC_BRIDGE: (name: string) => `${name}/sync`,
} as const;

export const SESSION_PATHS = {
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
