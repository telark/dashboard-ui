import {
  API_PATHS,
  APPLICATION_PATHS,
  AUTH_PATHS,
  SESSION_PATHS,
  CATEGORY_PATHS,
  PROTECTION_PLAN_PATHS,
  USER_PATHS,
  byId,
} from '../rest/paths';

const PPA = PROTECTION_PLAN_PATHS.ACTIONS;
const planAction = PROTECTION_PLAN_PATHS.ACTION;

export const Endpoints = {
  APPLICATIONS: {
    GET_ALL: {
      path: `${API_PATHS.APPLICATIONS}?view=summary`,
      method: 'GET',
    },
    GET_DETAILS: (name: string) => ({
      path: APPLICATION_PATHS.BY_NAME(name),
      method: 'GET',
    }),
    UPDATE: (name: string) => ({
      path: APPLICATION_PATHS.BY_NAME(name),
      method: 'PATCH',
    }),
    RESET: (name: string) => ({
      path: APPLICATION_PATHS.RESET(name),
      method: 'POST',
    }),
    TRIGGER_ROLLBACK: (name: string) => ({
      path: APPLICATION_PATHS.ROLLBACKS(name),
      method: 'POST',
    }),
    ABORT_ROLLBACK: (name: string, rollbackId: string) => ({
      path: `${APPLICATION_PATHS.ROLLBACK(name, rollbackId)}/abort`,
      method: 'POST',
    }),
    DISCOVERY_STATUS: {
      path: API_PATHS.DISCOVERY_STATUS,
      method: 'GET',
    },
  },
  INSIGHTS: {
    GET_APPLICATIONS: {
      path: `${API_PATHS.INSIGHTS}/applications`,
      method: 'GET',
    },
    ANALYZE: (ns: string, name: string) => ({
      path: `${API_PATHS.INSIGHTS}/applications/${ns}/${name}/analyze`,
      method: 'POST',
    }),
    EVENTS: {
      path: `${API_PATHS.INSIGHTS}/events`,
      method: 'GET',
    },
    RUNTIME: {
      path: `${API_PATHS.INSIGHTS}/runtime`,
      method: 'GET',
    },
    RUNTIME_VALIDATE: {
      path: `${API_PATHS.INSIGHTS}/runtime/validate`,
      method: 'POST',
    },
    RUNTIME_PULL: {
      path: `${API_PATHS.INSIGHTS}/runtime/pull`,
      method: 'POST',
    },
    TRIAGE: (ns: string, name: string, id: string) => ({
      path: `${API_PATHS.INSIGHTS}/applications/${ns}/${name}/insights/${id}/triage`,
      method: 'POST',
    }),
    LIST: {
      path: API_PATHS.INSIGHTS,
      method: 'GET',
    },
  },
  GLOBALCONFIG: {
    GET: {
      path: API_PATHS.CONFIG,
      method: 'GET',
    },
    PATCH: {
      path: API_PATHS.CONFIG,
      method: 'PATCH',
    },
  },
  SNAPSHOTS: {
    GET_INFOS: {
      path: API_PATHS.SNAPSHOTS,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: byId(API_PATHS.SNAPSHOTS, id),
      method: 'GET',
    }),
    GET_MANIFEST: (id: string) => ({
      path: `${byId(API_PATHS.SNAPSHOTS, id)}/manifest`,
      method: 'GET',
    }),
  },
  SYNC: {
    APPLICATION: (name: string) => ({
      path: APPLICATION_PATHS.SYNC(name),
      method: 'POST',
    }),
  },
  NAMESPACES: {
    GET: {
      path: API_PATHS.CLUSTER_NAMESPACES,
      method: 'GET',
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
    CONFIG: {
      GET: {
        path: AUTH_PATHS.CONFIG,
        method: 'GET',
      },
    },
    OIDC: {
      GOOGLE: {
        CALLBACK: {
          path: AUTH_PATHS.OIDC.GOOGLE_CALLBACK,
          method: 'POST',
        },
        NONCE: {
          path: AUTH_PATHS.OIDC.GOOGLE_NONCE,
          method: 'POST',
        },
      },
      CONFIG: {
        path: AUTH_PATHS.OIDC.CONFIG,
        method: 'PATCH',
      },
    },
    SELF_REGISTRATION: {
      path: AUTH_PATHS.SELF_REGISTRATION,
      method: 'PATCH',
    },
    PERMISSIONS: {
      GET: {
        path: AUTH_PATHS.PERMISSIONS,
        method: 'GET',
      },
    },
    PASSKEYS: {
      GET_ALL: {
        path: AUTH_PATHS.PASSKEYS.ROOT,
        method: 'GET',
      },
      CREATE: {
        path: AUTH_PATHS.PASSKEYS.ROOT,
        method: 'POST',
      },
      GET_SINGLE: (credentialId: string) => ({
        path: AUTH_PATHS.PASSKEYS.BY_CREDENTIAL(credentialId),
        method: 'GET',
      }),
      UPDATE: (credentialId: string) => ({
        path: AUTH_PATHS.PASSKEYS.BY_CREDENTIAL(credentialId),
        method: 'PATCH',
      }),
      DELETE: (credentialId: string) => ({
        path: AUTH_PATHS.PASSKEYS.BY_CREDENTIAL(credentialId),
        method: 'DELETE',
      }),
      ENROLL_LINK: {
        path: AUTH_PATHS.PASSKEYS.ENROLL_LINK,
        method: 'POST',
      },
    },
  },
  USERS: {
    CREATE: {
      path: API_PATHS.USERS,
      method: 'POST',
    },
    GET_ALL: {
      path: API_PATHS.USERS,
      method: 'GET',
    },
    GET_BY_ID: (userId: string) => ({
      path: byId(API_PATHS.USERS, userId),
      method: 'GET',
    }),
    GET_NAMES: (userIds: string[]) => ({
      path: `${USER_PATHS.NAMES}?${USER_PATHS.QUERY_IDS}=${userIds
        .map((id) => encodeURIComponent(id))
        .join(USER_PATHS.IDS_SEPARATOR)}`,
      method: 'GET',
    }),
    PATCH_BY_ID: (userId: string) => ({
      path: byId(API_PATHS.USERS, userId),
      method: 'PATCH',
    }),
    CLEANUP: (userId: string) => ({
      path: AUTH_PATHS.CLEANUP.DELETE_USER(userId),
      method: 'DELETE',
    }),
    CREATE_ENROLL_LINK: (userId: string) => ({
      path: AUTH_PATHS.USER_ENROLL_LINK(userId),
      method: 'POST',
    }),
    REVOKE_ENROLL_LINK: (userId: string) => ({
      path: AUTH_PATHS.USER_ENROLL_LINK(userId),
      method: 'DELETE',
    }),
  },
  SESSIONS: {
    GET_ALL_BY_USER: (userId: string) => ({
      path: `${SESSION_PATHS.LIST}?${SESSION_PATHS.QUERY_USER}=${encodeURIComponent(userId)}`,
      method: 'GET',
    }),
    GET_SELF: {
      path: SESSION_PATHS.SELF,
      method: 'GET',
    },
    DELETE_SELF: {
      path: SESSION_PATHS.SELF,
      method: 'DELETE',
    },
    DELETE_BY_NAME: (name: string) => ({
      path: SESSION_PATHS.BY_NAME(name),
      method: 'DELETE',
    }),
  },
  CATEGORIES: {
    CREATE: {
      path: API_PATHS.CATEGORIES,
      method: 'POST',
    },
    GET_ALL: {
      path: API_PATHS.CATEGORIES,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: byId(API_PATHS.CATEGORIES, id),
      method: 'GET',
    }),
    GET_BY_SCOPE: (scope: string) => ({
      path: `${API_PATHS.CATEGORIES}?${CATEGORY_PATHS.QUERY_SCOPE}=${encodeURIComponent(scope)}`,
      method: 'GET',
    }),
    PATCH_BY_ID: (id: string) => ({
      path: byId(API_PATHS.CATEGORIES, id),
      method: 'PATCH',
    }),
    DELETE_BY_ID: (id: string) => ({
      path: byId(API_PATHS.CATEGORIES, id),
      method: 'DELETE',
    }),
  },
  GROUPS: {
    CREATE: {
      path: API_PATHS.GROUPS,
      method: 'POST',
    },
    GET_ALL: {
      path: API_PATHS.GROUPS,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: byId(API_PATHS.GROUPS, id),
      method: 'GET',
    }),
    PATCH_BY_ID: (id: string) => ({
      path: byId(API_PATHS.GROUPS, id),
      method: 'PATCH',
    }),
    CLEANUP: (id: string) => ({
      path: AUTH_PATHS.CLEANUP.DELETE_GROUP(id),
      method: 'DELETE',
    }),
  },
  PROTECTION_PLANS: {
    LIST: { path: API_PATHS.PROTECTION_PLANS, method: 'GET' },
    GET_BY_ID: (id: string) => ({ path: byId(API_PATHS.PROTECTION_PLANS, id), method: 'GET' }),
    TEMPLATES: { path: API_PATHS.POLICY_TEMPLATES, method: 'GET' },
    PREPARE: { path: PROTECTION_PLAN_PATHS.PREPARE, method: 'POST' },
    CANCEL: (id: string) => ({ path: planAction(id, PPA.CANCEL), method: 'POST' }),
    CLEAR: (id: string) => ({ path: planAction(id, PPA.CLEAR), method: 'DELETE' }),
    STATUS: (id: string) => ({ path: planAction(id, PPA.STATUS), method: 'GET' }),
    VIOLATIONS: (id: string) => ({ path: planAction(id, PPA.VIOLATIONS), method: 'GET' }),
    DUPLICATE: (id: string) => ({ path: planAction(id, PPA.DUPLICATE), method: 'POST' }),
    REACTIVATE: (id: string) => ({ path: planAction(id, PPA.REACTIVATE), method: 'POST' }),
    DECIDE: (id: string) => ({ path: planAction(id, PPA.DECISION), method: 'POST' }),
    UPDATE: (id: string) => ({ path: planAction(id, PPA.REVISE), method: 'POST' }),
    REPORTS_GENERATE: (id: string) => ({ path: planAction(id, PPA.REPORTS), method: 'POST' }),
  },
  REPORTS: {
    LIST_ALL: { path: API_PATHS.REPORTS, method: 'GET' },
    PLANS: {
      LIST: (id: string) => ({ path: planAction(id, PPA.REPORTS), method: 'GET' }),
      DOWNLOAD: (id: string) => ({ path: planAction(id, PPA.REPORTS_DOWNLOAD), method: 'GET' }),
    },
  },
  NOTIFICATIONS: {
    LIST: {
      path: API_PATHS.NOTIFICATIONS,
      method: 'GET',
    },
    MARK_READ: (id: string) => ({
      path: `${byId(API_PATHS.NOTIFICATIONS, id)}/read`,
      method: 'POST',
    }),
    MARK_ALL_READ: {
      path: `${API_PATHS.NOTIFICATIONS}/read`,
      method: 'POST',
    },
    CLEAR: {
      path: API_PATHS.NOTIFICATIONS,
      method: 'DELETE',
    },
    DELETE: (id: string) => ({
      path: byId(API_PATHS.NOTIFICATIONS, id),
      method: 'DELETE',
    }),
  },
  ROLES: {
    CREATE: {
      path: API_PATHS.ACCESS_ROLES,
      method: 'POST',
    },
    GET_ALL: {
      path: API_PATHS.ACCESS_ROLES,
      method: 'GET',
    },
    GET_BY_ID: (id: string) => ({
      path: byId(API_PATHS.ACCESS_ROLES, id),
      method: 'GET',
    }),
    PATCH_BY_ID: (id: string) => ({
      path: byId(API_PATHS.ACCESS_ROLES, id),
      method: 'PATCH',
    }),
    CLEANUP: (id: string) => ({
      path: AUTH_PATHS.CLEANUP.DELETE_ACCESS_ROLE(id),
      method: 'DELETE',
    }),
  },
};
