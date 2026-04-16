import {
  API_PATHS,
  RESOURCE_PATHS,
  INSIGHT_PATHS,
  MAINTENANCE_PATHS,
  ANALYZE_PATHS,
  AUTH_PATHS,
  SESSION_PATHS,
  CATEGORY_PATHS,
  GROUP_PATHS,
  ROLE_PATHS,
  USER_PATHS,
} from '../rest/paths';

export const Endpoints = {
  GROUPERS: {
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_DETAILS: (name: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.GET_DETAILS(name)}`,
      method: 'GET',
    }),
    UPDATE_SYNC: (name: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
      method: 'PATCH',
    }),
  },
  APPLICATIONS: {
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_DETAILS: (name: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.GET_DETAILS(name)}`,
      method: 'GET',
    }),
    UPDATE: (name: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
      method: 'PATCH',
    }),
    CLEANUP: (name: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.CLEANUP_DETAILS(name)}`,
      method: 'DELETE',
    }),
    TRIGGER_ROLLBACK: (name: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.APPLICATION_ROLLBACKS(name)}/trigger`,
      method: 'POST',
    }),
    GET_ROLLBACKS: (name: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.APPLICATION_ROLLBACKS(name)}/get`,
      method: 'GET',
    }),
    GET_ROLLBACK: (name: string, rollbackId: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.APPLICATION_ROLLBACKS(name)}/${rollbackId}/get`,
      method: 'GET',
    }),
  },
  GLOBALCONFIG: {
    GET: {
      path: `${API_PATHS.RESOURCES.GLOBALCONFIG}/get`,
      method: 'GET',
    },
    PATCH: {
      path: `${API_PATHS.RESOURCES.GLOBALCONFIG}/patch`,
      method: 'PATCH',
    },
  },
  PROVIDERS: {
    VALIDATE_API_KEY: {
      path: 'provider/validate-api-key',
      method: 'POST',
    },
  },
  SNAPSHOTS: {
    GET_INFOS: {
      path: 'snapshots/infos',
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: `snapshots/${id}/get`,
      method: 'GET',
    }),
    GET_MANIFEST: (id: string) => ({
      path: `snapshots/${id}/manifest`,
      method: 'GET',
    }),
  },
  INSIGHTS: {
    CLUSTER_GET: {
      path: `${API_PATHS.RESOURCES.INSIGHTS}/${INSIGHT_PATHS.CLUSTER_GET}`,
      method: 'GET',
    },
  },
  ANALYZE: {
    START: {
      path: `${API_PATHS.ANALYZE}/${ANALYZE_PATHS.START}`,
      method: 'POST',
    },
  },
  SYNC: {
    GROUPERS: {
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.SYNC}`,
      method: 'POST',
    },
    GROUPER: (name: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPERS}/${RESOURCE_PATHS.SYNC_GROUPER(name)}`,
      method: 'POST',
    }),
    APPS: {
      path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.SYNC}`,
      method: 'POST',
    },
    APP: (name: string) => ({
      path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.SYNC_APP(name)}`,
      method: 'POST',
    }),
    BRIDGES: {
      path: `${API_PATHS.RESOURCES.BRIDGES}/${RESOURCE_PATHS.SYNC}`,
      method: 'POST',
    },
    BRIDGE: (name: string) => ({
      path: `${API_PATHS.RESOURCES.BRIDGES}/${RESOURCE_PATHS.SYNC_BRIDGE(name)}`,
      method: 'POST',
    }),
    APPLICATION: (name: string) => ({
      path: `${API_PATHS.RESOURCES.APPLICATIONS}/${RESOURCE_PATHS.SYNC_APP(name)}`,
      method: 'POST',
    }),
  },
  NAMESPACES: {
    GET: {
      path: 'analyze/namespaces/get',
      method: 'GET',
    },
  },
  BRIDGES: {
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.BRIDGES}/${RESOURCE_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_DETAILS: (name: string) => ({
      path: `${API_PATHS.RESOURCES.BRIDGES}/${RESOURCE_PATHS.GET_DETAILS(name)}`,
      method: 'GET',
    }),
    UPDATE_SYNC: (name: string) => ({
      path: `${API_PATHS.RESOURCES.BRIDGES}/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
      method: 'PATCH',
    }),
  },
  GROUPER_MAINTENANCE: {
    CHECK: (name: string) => ({
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.CHECK(name)}`,
      method: 'GET',
    }),
    ENABLE: {
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.ENABLE}`,
      method: 'POST',
    },
    UPDATE: {
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.UPDATE}`,
      method: 'PUT',
    },
    REMOVE: {
      path: `${API_PATHS.FEATS.MAINTENANCE}/${MAINTENANCE_PATHS.REMOVE}`,
      method: 'DELETE',
    },
  },
  WORKLOADS: {
    APPS: {
      GET_ALL_APPS: {
        path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.GET_ALL}`,
        method: 'GET',
      },
      GET_APP_DETAILS: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.GET_DETAILS(name)}`,
        method: 'GET',
      }),
      UPDATE_APP_SYNC: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/apps/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
        method: 'PATCH',
      }),
    },
    BATCHES: {
      GET_ALL_BATCHES: {
        path: `${API_PATHS.RESOURCES.WORKLOADS}/batches/${RESOURCE_PATHS.GET_ALL}`,
        method: 'GET',
      },
      GET_BATCH_DETAILS: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/batches/${RESOURCE_PATHS.GET_DETAILS(name)}`,
        method: 'GET',
      }),
      UPDATE_BATCH_SYNC: (name: string) => ({
        path: `${API_PATHS.RESOURCES.WORKLOADS}/batches/${RESOURCE_PATHS.UPDATE_SYNC(name)}`,
        method: 'PATCH',
      }),
    },
  },
  AUTH: {
    LOGIN: {
      START: {
        path: AUTH_PATHS.LOGIN.START,
        method: 'POST',
      },
      FINISH: {
        path: AUTH_PATHS.LOGIN.FINISH,
        method: 'POST',
      },
    },
    REGISTER: {
      START: {
        path: AUTH_PATHS.REGISTER.START,
        method: 'POST',
      },
    },
    LOGOUT: {
      path: AUTH_PATHS.LOGOUT,
      method: 'POST',
    },
    PASSKEYS: {
      GET_ALL: {
        path: AUTH_PATHS.PASSKEYS.PROXY.GET,
        method: 'GET',
      },
      CREATE: {
        path: AUTH_PATHS.PASSKEYS.PROXY.CREATE,
        method: 'POST',
      },
      GET_SINGLE: {
        path: AUTH_PATHS.PASSKEYS.PROXY.SINGLE_GET,
        method: 'GET',
      },
      UPDATE: {
        path: AUTH_PATHS.PASSKEYS.PROXY.PATCH,
        method: 'PATCH',
      },
      DELETE: {
        path: AUTH_PATHS.PASSKEYS.PROXY.DELETE,
        method: 'DELETE',
      },
    },
  },
  USERS: {
    CREATE: {
      path: `${API_PATHS.RESOURCES.USERS}/${USER_PATHS.CREATE}`,
      method: 'POST',
    },
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.USERS}/${RESOURCE_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_BY_ID: (userId: string) => ({
      path: `${API_PATHS.RESOURCES.USERS}/${USER_PATHS.GET_BY_ID(userId)}`,
      method: 'GET',
    }),
    PATCH_BY_ID: (userId: string) => ({
      path: `${API_PATHS.RESOURCES.USERS}/${USER_PATHS.PATCH_BY_ID(userId)}`,
      method: 'PATCH',
    }),
    DELETE_BY_ID: (userId: string) => ({
      path: `${API_PATHS.RESOURCES.USERS}/${USER_PATHS.DELETE_BY_ID(userId)}`,
      method: 'DELETE',
    }),
  },
  SESSIONS: {
    GET_ALL_BY_USER: (userId: string) => ({
      path: SESSION_PATHS.GET_ALL_BY_USER(userId),
      method: 'GET',
    }),
    GET_BY_TOKEN: (sessionToken: string) => ({
      path: SESSION_PATHS.GET_BY_TOKEN(sessionToken),
      method: 'GET',
    }),
    DELETE_BY_TOKEN: (sessionToken: string) => ({
      path: SESSION_PATHS.DELETE_BY_TOKEN(sessionToken),
      method: 'DELETE',
    }),
  },
  CATEGORIES: {
    CREATE: {
      path: `${API_PATHS.CLASSIFICATION.CATEGORIES}/${CATEGORY_PATHS.CREATE}`,
      method: 'POST',
    },
    GET_ALL: {
      path: `${API_PATHS.CLASSIFICATION.CATEGORIES}/${CATEGORY_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: `${API_PATHS.CLASSIFICATION.CATEGORIES}/${CATEGORY_PATHS.GET_BY_ID(id)}`,
      method: 'GET',
    }),
    GET_BY_SCOPE: (scope: string) => ({
      path: `${API_PATHS.CLASSIFICATION.CATEGORIES}/${CATEGORY_PATHS.GET_BY_SCOPE(scope)}`,
      method: 'GET',
    }),
    PATCH_BY_ID: (id: string) => ({
      path: `${API_PATHS.CLASSIFICATION.CATEGORIES}/${CATEGORY_PATHS.PATCH_BY_ID(id)}`,
      method: 'PATCH',
    }),
    DELETE_BY_ID: (id: string) => ({
      path: `${API_PATHS.CLASSIFICATION.CATEGORIES}/${CATEGORY_PATHS.DELETE_BY_ID(id)}`,
      method: 'DELETE',
    }),
  },
  GROUPS: {
    CREATE: {
      path: `${API_PATHS.RESOURCES.GROUPS}/${GROUP_PATHS.CREATE}`,
      method: 'POST',
    },
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.GROUPS}/${GROUP_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPS}/${GROUP_PATHS.GET_BY_ID(id)}`,
      method: 'GET',
    }),
    PATCH_BY_ID: (id: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPS}/${GROUP_PATHS.PATCH_BY_ID(id)}`,
      method: 'PATCH',
    }),
    DELETE_BY_ID: (id: string) => ({
      path: `${API_PATHS.RESOURCES.GROUPS}/${GROUP_PATHS.DELETE_BY_ID(id)}`,
      method: 'DELETE',
    }),
  },
  ROLES: {
    CREATE: {
      path: `${API_PATHS.RESOURCES.ROLES}/${ROLE_PATHS.CREATE}`,
      method: 'POST',
    },
    GET_ALL: {
      path: `${API_PATHS.RESOURCES.ROLES}/${ROLE_PATHS.GET_ALL}`,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: `${API_PATHS.RESOURCES.ROLES}/${ROLE_PATHS.GET_BY_ID(id)}`,
      method: 'GET',
    }),
    PATCH_BY_ID: (id: string) => ({
      path: `${API_PATHS.RESOURCES.ROLES}/${ROLE_PATHS.PATCH_BY_ID(id)}`,
      method: 'PATCH',
    }),
    DELETE_BY_ID: (id: string) => ({
      path: `${API_PATHS.RESOURCES.ROLES}/${ROLE_PATHS.DELETE_BY_ID(id)}`,
      method: 'DELETE',
    }),
  },
};
